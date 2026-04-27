#!/usr/bin/env node
// validate-data.js — schema validation for public/data.js
// Usage: node validate-data.js
// Exit 0 = passed, Exit 1 = errors found

const vm   = require('vm');
const fs   = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/data.js');

if (!fs.existsSync(filePath)) {
  console.error('❌ public/data.js not found');
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const errors   = [];
const warnings = [];

// ── 1. No export statements ───────────────────────────────────────────────────
if (/^export\s+/m.test(content)) {
  errors.push('Export statement found — data.js must not use ES module exports');
}

// ── 2. Execute in sandbox ─────────────────────────────────────────────────────
// Replace const/let with var so declarations land on the sandbox global scope
const runnable = content.replace(/^(?:const|let)\s+/gm, 'var ');
const sandbox = {};
try {
  vm.createContext(sandbox);
  vm.runInContext(runnable, sandbox);
} catch (e) {
  errors.push(`Syntax / runtime error: ${e.message}`);
  report();
  process.exit(1);
}

const { TEAM_TO_GAME, SLATE_DATE, SLATE_LABEL, CONTEXT_CARDS, PARK_FACTORS, players, parlays } = sandbox;

// ── 3. Top-level constants ────────────────────────────────────────────────────
if (!SLATE_DATE  || typeof SLATE_DATE  !== 'string') errors.push('SLATE_DATE missing or not a string');
if (!SLATE_LABEL || typeof SLATE_LABEL !== 'string') errors.push('SLATE_LABEL missing or not a string');
if (!TEAM_TO_GAME || typeof TEAM_TO_GAME !== 'object') errors.push('TEAM_TO_GAME missing');
if (!PARK_FACTORS || typeof PARK_FACTORS !== 'object') errors.push('PARK_FACTORS missing');

// ── 4. CONTEXT_CARDS ──────────────────────────────────────────────────────────
if (!Array.isArray(CONTEXT_CARDS)) {
  errors.push('CONTEXT_CARDS is not an array');
} else {
  if (CONTEXT_CARDS.length !== 4) errors.push(`CONTEXT_CARDS has ${CONTEXT_CARDS.length} entries — expected 4`);
  CONTEXT_CARDS.forEach((c, i) => {
    ['icon', 'label', 'note', 'sub'].forEach(f => {
      if (!c[f]) errors.push(`CONTEXT_CARDS[${i}] missing field: ${f}`);
    });
  });
}

// ── 5. players ────────────────────────────────────────────────────────────────
if (!Array.isArray(players)) {
  errors.push('players is not an array');
} else {
  if (players.length < 30) errors.push(`players.length = ${players.length} — suspiciously low, expected at least 30`);

  const REQUIRED = ['id','name','team','tier','park','pitcher','pitcherNote','matchupGrade','estOdds','note','tags'];
  const VALID_TIERS = new Set(['S','A','B','C']);
  const seenIds = new Set();
  const tierCounts = { S:0, A:0, B:0, C:0 };

  players.forEach((p, i) => {
    // IDs must be integers 1–50, no duplicates
    if (typeof p.id !== 'number' || p.id < 1) {
      errors.push(`players[${i}].id = ${p.id} — must be a positive integer`);
    }
    if (seenIds.has(p.id)) errors.push(`Duplicate player id: ${p.id}`);
    seenIds.add(p.id);

    // Required fields
    REQUIRED.forEach(f => {
      if (p[f] === undefined || p[f] === null || p[f] === '') {
        errors.push(`Player id ${p.id} (${p.name || '?'}) missing field: ${f}`);
      }
    });

    // Valid tier
    if (!VALID_TIERS.has(p.tier)) {
      errors.push(`Player id ${p.id} has invalid tier: "${p.tier}"`);
    } else {
      tierCounts[p.tier]++;
    }

    // Team in TEAM_TO_GAME
    if (TEAM_TO_GAME && !TEAM_TO_GAME[p.team]) {
      errors.push(`Player id ${p.id} team "${p.team}" not found in TEAM_TO_GAME`);
    }

    // Park in PARK_FACTORS
    if (PARK_FACTORS && !PARK_FACTORS[p.park]) {
      errors.push(`Player id ${p.id} park "${p.park}" not found in PARK_FACTORS`);
    }

    // estOdds is a string starting with + or -
    if (p.estOdds && typeof p.estOdds !== 'string') {
      errors.push(`Player id ${p.id} estOdds must be a string (e.g. "+310")`);
    }

    // tags: 2–4 items
    if (Array.isArray(p.tags)) {
      if (p.tags.length < 2 || p.tags.length > 4) {
        warnings.push(`Player id ${p.id} has ${p.tags.length} tag(s) — expected 2–4`);
      }
    } else {
      errors.push(`Player id ${p.id} tags is not an array`);
    }
  });


  // Tier distribution
  if (tierCounts.S < 4 || tierCounts.S > 8)   warnings.push(`S-tier count: ${tierCounts.S} — expected 4–8`);
  if (tierCounts.A < 12 || tierCounts.A > 16)  warnings.push(`A-tier count: ${tierCounts.A} — expected 12–16`);
  if (tierCounts.B < 16 || tierCounts.B > 20)  warnings.push(`B-tier count: ${tierCounts.B} — expected 16–20`);
  if (tierCounts.C < 6  || tierCounts.C > 10)  warnings.push(`C-tier count: ${tierCounts.C} — expected 6–10`);
}

// ── 6. parlays ────────────────────────────────────────────────────────────────
if (!Array.isArray(parlays)) {
  errors.push('parlays is not an array');
} else {
  if (parlays.length < 14 || parlays.length > 16) {
    errors.push(`parlays.length = ${parlays.length} — expected 14–16`);
  }

  const playerIdSet = new Set(Array.isArray(players) ? players.map(p => p.id) : []);
  const cTierIds    = new Set(Array.isArray(players) ? players.filter(p => p.tier === 'C').map(p => p.id) : []);

  parlays.forEach(parlay => {
    const pid = parlay.id || '?';

    // legs === playerIds.length
    if (!Array.isArray(parlay.playerIds)) {
      errors.push(`Parlay ${pid}: playerIds is not an array`);
      return;
    }
    if (parlay.legs !== parlay.playerIds.length) {
      errors.push(`Parlay ${pid}: legs=${parlay.legs} but playerIds.length=${parlay.playerIds.length}`);
    }

    // All playerIds exist in players
    parlay.playerIds.forEach(id => {
      if (!playerIdSet.has(id)) {
        errors.push(`Parlay ${pid}: playerIds contains ${id} which doesn't exist in players`);
      }
    });

    // No duplicates within parlay
    const seen = new Set();
    parlay.playerIds.forEach(id => {
      if (seen.has(id)) errors.push(`Parlay ${pid}: duplicate playerId ${id}`);
      seen.add(id);
    });

    // 10A must include at least 2 C-tier players
    if (pid === '10A') {
      const cCount = parlay.playerIds.filter(id => cTierIds.has(id)).length;
      if (cCount < 2) errors.push(`Parlay 10A must include at least 2 C-tier players — found ${cCount}`);
    }

    // Required parlay fields
    ['id','legs','label','risk','riskColor','estPayout','description','playerIds','strategy'].forEach(f => {
      if (parlay[f] === undefined || parlay[f] === null || parlay[f] === '') {
        errors.push(`Parlay ${pid} missing field: ${f}`);
      }
    });
  });
}

// ── Report ────────────────────────────────────────────────────────────────────
function report() {
  if (warnings.length > 0) {
    console.warn('\n⚠️  WARNINGS:');
    warnings.forEach(w => console.warn(`   - ${w}`));
  }
  if (errors.length > 0) {
    console.error('\n❌ VALIDATION FAILED:');
    errors.forEach(e => console.error(`   - ${e}`));
    console.error(`\n   ${errors.length} error(s) · ${warnings.length} warning(s)\n`);
  } else {
    const pCount = Array.isArray(parlays) ? parlays.length : '?';
    console.log(`\n✅ VALIDATION PASSED`);
    console.log(`   Date:    ${SLATE_DATE}`);
    console.log(`   Players: ${Array.isArray(players) ? players.length : '?'}`);
    console.log(`   Parlays: ${pCount}`);
    console.log(`   Games:   ${TEAM_TO_GAME ? Object.keys(TEAM_TO_GAME).length / 2 : '?'}`);
    if (warnings.length > 0) console.warn(`   Warnings: ${warnings.length}\n`);
    else console.log();
  }
}

report();
process.exit(errors.length > 0 ? 1 : 0);
