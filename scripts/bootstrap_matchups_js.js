#!/usr/bin/env node
/**
 * bootstrap_matchups_js.js
 * Generates public/matchups_data.js from public/data.js when no Savant
 * data is available. Produces real game/player structure; Savant stats
 * (khr, xwoba, barrel%, etc.) will show as dashes until the real pipeline runs.
 */
'use strict';

const vm  = require('vm');
const fs  = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── Load data.js ─────────────────────────────────────────────────────────────
const src = fs.readFileSync(path.join(ROOT, 'public', 'data.js'), 'utf8')
              .replace(/^(?:const|let)\s+/gm, 'var ');
const s = {};
vm.createContext(s);
vm.runInContext(src, s);

const { players, TEAM_TO_GAME, SLATE_DATE, SLATE_LABEL } = s;

// ── Build per-game structures ────────────────────────────────────────────────
const gameMap = {};

players.forEach(p => {
  const gk = TEAM_TO_GAME[p.team];
  if (!gk) return;

  if (!gameMap[gk]) {
    const [awayTeam, homeTeam] = gk.split('@');
    gameMap[gk] = {
      gamePk: gk,
      awayTeam,
      homeTeam,
      awayPitcherName: null,
      homePitcherName: null,
      awayPitcherId:   null,
      homePitcherId:   null,
      awayThrows: 'R',
      homeThrows: 'R',
      awayMatchups: [],
      homeMatchups: [],
    };
  }

  const g       = gameMap[gk];
  const isAway  = p.team === g.awayTeam;

  // In data.js, p.pitcher is the OPPOSING pitcher.
  // Away batter's pitcher → home pitcher; home batter's pitcher → away pitcher.
  if (isAway && !g.homePitcherName && p.pitcher) {
    g.homePitcherName = p.pitcher;
    g.homePitcherId   = 'P_' + g.homeTeam;
  } else if (!isAway && !g.awayPitcherName && p.pitcher) {
    g.awayPitcherName = p.pitcher;
    g.awayPitcherId   = 'P_' + g.awayTeam;
  }

  // Approximate HR pace per 162 (assume ~75 games played by late June)
  const likelyPace = (p.hr != null) ? Math.round(p.hr / 75 * 162) : null;

  const batter = {
    name:         p.name,
    team:         p.team,
    batterId:     String(p.id),
    playerId:     String(p.id),
    khr:          null,   // needs Savant
    xwoba:        null,
    xwobac:       null,
    hardHit:      null,
    barrel:       null,
    zoneFit:      null,
    matchupScore: p.compositeScore || null,
    likely:       likelyPace,
    hr:           p.hr    || null,
    iso:          p.iso   || null,
    ops:          p.ops   || null,
    matchupGrade: p.matchupGrade || null,
    tier:         p.tier  || null,
    gameKey:      gk,
    opponentTeam: isAway ? g.homeTeam : g.awayTeam,
    zones:        [],
  };

  (isAway ? g.awayMatchups : g.homeMatchups).push(batter);
});

// Sort by compositeScore desc; cap at 8 per side
Object.values(gameMap).forEach(g => {
  const rank = (a, b) => (b.matchupScore || 0) - (a.matchupScore || 0);
  g.awayMatchups = g.awayMatchups.sort(rank).slice(0, 8);
  g.homeMatchups = g.homeMatchups.sort(rank).slice(0, 8);
});

const games = Object.values(gameMap);

// ── Build PITCHERS_SLATE ─────────────────────────────────────────────────────
const pitcherMap = {};
let slateRank = 1;
games.forEach(g => {
  [
    { side: 'away', pName: g.awayPitcherName, pId: g.awayPitcherId, pTeam: g.awayTeam, opp: g.homeTeam, throws: g.awayThrows },
    { side: 'home', pName: g.homePitcherName, pId: g.homePitcherId, pTeam: g.homeTeam, opp: g.awayTeam, throws: g.homeThrows },
  ].forEach(({ pName, pId, pTeam, opp, throws }) => {
    if (!pId || pitcherMap[pId]) return;
    pitcherMap[pId] = {
      pitcherId:    pId,
      name:         pName || 'TBD',
      team:         pTeam,
      opponentTeam: opp,
      throws,
      xwoba:        null,
      era:          null,
      whip:         null,
      k9:           null,
      bb9:          null,
      slateRank:    slateRank++,
      gameKey:      g.gamePk,
      zones:        [],
      arsenal:      [],
    };
  });
});

const pitchersSlate = Object.values(pitcherMap);

// ── Build lookup dicts ────────────────────────────────────────────────────────
const battersById = {};
games.forEach(g => {
  [...g.awayMatchups, ...g.homeMatchups].forEach(b => {
    if (!battersById[b.batterId]) battersById[b.batterId] = b;
  });
});

const pitchersById = {};
pitchersSlate.forEach(p => { pitchersById[p.pitcherId] = p; });

// ── Serialize ─────────────────────────────────────────────────────────────────
const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

const out = [
  `const MATCHUPS_DATE = ${JSON.stringify(SLATE_DATE)};`,
  `const MATCHUPS_LABEL = ${JSON.stringify(SLATE_LABEL)};`,
  `const MATCHUPS_GENERATED_AT = ${JSON.stringify(now)};`,
  `const MATCHUPS_GAMES = ${JSON.stringify(games, null, 2)};`,
  `const PITCHERS_SLATE = ${JSON.stringify(pitchersSlate, null, 2)};`,
  `const BATTERS_BY_ID = ${JSON.stringify(battersById, null, 2)};`,
  `const PITCHERS_BY_ID = ${JSON.stringify(pitchersById, null, 2)};`,
].join('\n') + '\n';

const outPath = path.join(ROOT, 'public', 'matchups_data.js');
fs.writeFileSync(outPath, out);
console.log(`✅ matchups_data.js written — ${games.length} games, ${pitchersSlate.length} pitchers, ${Object.keys(battersById).length} batters`);
console.log('   Savant stats (KHR, xwOBA, barrel) will show dashes until the real pipeline runs.');
