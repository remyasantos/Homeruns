#!/usr/bin/env node
/**
 * fetch_park_factors.js — real per-game HR park factors (stadium dimensions
 * + today's actual weather combined).
 *
 * Primary source:  ballparkpal.com/Park-Factors.php (real per-game HR%,
 *                  keyed by the actual MLB gamePk taken from the page's own
 *                  game links -- verified to match MLB Stats API's gamePk).
 * Fallback source: vsin.com/projections-park-factors/ -- a free page that
 *                  republishes the same BallparkPal numbers (its own title
 *                  is "Park Factors Powered by Ballpark Pal"), used only
 *                  when the primary is unavailable (e.g. rate-limited from
 *                  repeated same-day fetches). No gamePk is exposed there,
 *                  so those rows are keyed by "AWAY@HOME" team abbreviations
 *                  instead; score_matchups.py tries gamePk first, then that
 *                  key.
 *
 * Both pages render their tables client-side, so a real browser (Playwright
 * /Chromium) is required rather than a plain HTTP GET.
 *
 * Writes: scripts/park_factors.json
 *
 * If neither source is available, writes an empty {} rather than guessing --
 * score_matchups.py treats a missing entry as "no park factor today" (bonus
 * 0), never a fallback estimate.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, 'park_factors.json');
const BALLPARKPAL_URL = 'https://www.ballparkpal.com/Park-Factors.php';
const VSIN_URL = 'https://vsin.com/projections-park-factors/';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
  + '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// BallparkPal/VSiN sometimes use an alternate team abbreviation than MLB
// Stats API's canonical one (e.g. "CHW" vs our "CWS"). Normalize known cases
// so the "AWAY@HOME" fallback key matches what score_matchups.py builds.
const TEAM_ABBR_ALIASES = {
  CHW: 'CWS',
  WAS: 'WSH',
  SDP: 'SD',
  SFG: 'SF',
  TBR: 'TB',
  KCR: 'KC',
};
function normTeam(abbr) {
  const t = String(abbr || '').trim().toUpperCase();
  return TEAM_ABBR_ALIASES[t] || t;
}

function parsePct(s) {
  if (s == null) return null;
  const t = String(s).trim();
  if (t === '') return null;
  const m = t.match(/^([+-]?)(\d+(?:\.\d+)?)%$/);
  if (!m) return null;
  const val = parseFloat(m[2]) / 100.0;
  return m[1] === '-' ? -val : val;
}

async function fetchFromBallparkPal(chromium) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ userAgent: USER_AGENT });
    await page.goto(BALLPARKPAL_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('#parkFactorsTable tbody tr', { timeout: 15000 });

    const rows = await page.evaluate(() => {
      const table = document.getElementById('parkFactorsTable');
      if (!table) return [];
      return Array.from(table.querySelectorAll('tbody tr')).map((tr) => {
        const gameCell = tr.children[0];
        const venueLink = gameCell.querySelector('.venueText a');
        const gameLink = gameCell.querySelector('.matchupText a.gameLink');
        let venueId = null, gamePk = null;
        try { venueId = venueLink ? new URL(venueLink.href).searchParams.get('VenueId') : null; } catch (e) {}
        try { gamePk = gameLink ? new URL(gameLink.href).searchParams.get('GamePk') : null; } catch (e) {}
        const cells = Array.from(tr.children).map((td) => td.textContent.trim());
        return {
          venueName: venueLink ? venueLink.textContent.trim() : null,
          venueId,
          gamePk,
          matchup: gameLink ? gameLink.textContent.trim() : null,
          hr: cells[1],
          doublesTriples: cells[2],
          singles: cells[3],
          runs: cells[4],
        };
      });
    });

    const result = {};
    for (const row of rows) {
      if (!row.gamePk) continue;
      result[row.gamePk] = {
        venueName: row.venueName,
        venueId: row.venueId,
        matchup: row.matchup,
        hr_pct: parsePct(row.hr),
        doubles_triples_pct: parsePct(row.doublesTriples),
        singles_pct: parsePct(row.singles),
        runs_pct: parsePct(row.runs),
        source: BALLPARKPAL_URL,
        fetched_at: new Date().toISOString(),
      };
    }
    return result;
  } finally {
    await browser.close();
  }
}

async function fetchFromVsin(chromium) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ userAgent: USER_AGENT });
    await page.goto(VSIN_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('table tbody tr', { timeout: 25000 });

    // Cells expose a clean data-sort-value attribute (matchup text, venue
    // name, and signed numeric percent) -- read that instead of parsing the
    // nested-div textContent, which is more fragile.
    const rows = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      const table = tables.find((t) => t.querySelectorAll('tbody tr').length >= 8) || tables[0];
      if (!table) return [];
      return Array.from(table.querySelectorAll('tbody tr')).map((tr) => {
        const cells = Array.from(tr.children);
        const sortVal = (td) => (td ? td.getAttribute('data-sort-value') : null);
        return {
          matchup: sortVal(cells[0]),
          venue: sortVal(cells[2]) || (cells[2] ? cells[2].textContent.trim() : null),
          hr: sortVal(cells[3]),
          doublesTriples: sortVal(cells[4]),
          singles: sortVal(cells[5]),
          runs: sortVal(cells[6]),
        };
      });
    });

    const result = {};
    for (const row of rows) {
      const m = (row.matchup || '').match(/([A-Z]{2,3})\s*@\s*([A-Z]{2,3})/);
      if (!m) continue;
      const key = `${normTeam(m[1])}@${normTeam(m[2])}`;
      const pct = (v) => (v == null || v === '' ? null : parseFloat(v) / 100.0);
      result[key] = {
        venueName: row.venue || null,
        matchup: `${normTeam(m[1])} @ ${normTeam(m[2])}`,
        hr_pct: pct(row.hr),
        doubles_triples_pct: pct(row.doublesTriples),
        singles_pct: pct(row.singles),
        runs_pct: pct(row.runs),
        source: VSIN_URL,
        fetched_at: new Date().toISOString(),
      };
    }
    return result;
  } finally {
    await browser.close();
  }
}

async function main() {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch (e) {
    console.error('⚠ playwright not installed -- writing empty park_factors.json');
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify({}, null, 2));
    return;
  }

  let result = {};
  try {
    result = await fetchFromBallparkPal(chromium);
    if (Object.keys(result).length > 0) {
      console.log(`✅ Fetched park factors for ${Object.keys(result).length} games from BallparkPal`);
    } else {
      throw new Error('BallparkPal returned no rows');
    }
  } catch (e) {
    console.error(`⚠ BallparkPal fetch failed: ${e.message} -- trying VSiN fallback`);
    try {
      result = await fetchFromVsin(chromium);
      console.log(`✅ Fetched park factors for ${Object.keys(result).length} games from VSiN (fallback)`);
    } catch (e2) {
      console.error(`⚠ VSiN fallback also failed: ${e2.message} -- writing empty park_factors.json`);
      result = {};
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
}

main();
