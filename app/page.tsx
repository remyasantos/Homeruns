"use client";
import { useState, useMemo, useEffect, useCallback, type MouseEvent } from "react";

// ─── STATIC CONFIG ────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  S: { label: "S-TIER",   color: "#FFD700", bg: "rgba(255,215,0,0.12)",  border: "#FFD700", desc: "Elite HR Targets — highest probability" },
  A: { label: "A-TIER",   color: "#00E5FF", bg: "rgba(0,229,255,0.08)",  border: "#00E5FF", desc: "Strong Plays — solid HR potential" },
  B: { label: "B-TIER",   color: "#76FF03", bg: "rgba(118,255,3,0.07)",  border: "#76FF03", desc: "Value Plays — good odds vs probability" },
  C: { label: "LONGSHOT", color: "#FF6D00", bg: "rgba(255,109,0,0.08)",  border: "#FF6D00", desc: "High Risk, High Reward" },
} as const;


const GRADE_ORDER = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","F"] as const;

function gradeToEdge(grade: string): number {
  const idx = GRADE_ORDER.indexOf(grade as typeof GRADE_ORDER[number]);
  if (idx === -1) return 40;
  return Math.max(20, 97 - idx * 7);
}

function gradeToHrProb(grade: string, tier: string): number {
  const base = gradeToEdge(grade);
  const bonus = tier === "S" ? 6 : tier === "A" ? 3 : tier === "B" ? 1 : 0;
  return Math.min(22, Math.max(4, Math.round((base / 100) * 18) + bonus));
}

function gradeColor(g = ""): string {
  if (g.startsWith("A")) return "#FFD700";
  if (g.startsWith("B")) return "#76FF03";
  if (g.startsWith("C")) return "#FF9800";
  return "#FF5252";
}

function oddsToNum(odds: string): number {
  const n = parseInt(odds.replace("+", "").replace(",", ""), 10);
  return isNaN(n) ? 400 : n;
}

// Convert American odds to implied probability %
function oddsToImplied(oddsNum: number): number {
  if (oddsNum > 0) return Math.round((100 / (oddsNum + 100)) * 100);
  return Math.round((Math.abs(oddsNum) / (Math.abs(oddsNum) + 100)) * 100);
}

// ─── SPORTSBOOK DEEP LINKS ────────────────────────────────────────────────────
// These land on the HR props page for each book — closest we can get without an API
const BOOKS = [
  {
    id: "dk",
    name: "DraftKings",
    color: "#53D337",
    logo: "DK",
    url: "https://sportsbook.draftkings.com/leagues/baseball/mlb?category=batter-props&subcategory=home-run",
    searchUrl: (name: string) =>
      `https://sportsbook.draftkings.com/leagues/baseball/mlb?category=batter-props&subcategory=home-run&query=${encodeURIComponent(name)}`,
  },
  {
    id: "fd",
    name: "FanDuel",
    color: "#1493FF",
    logo: "FD",
    url: "https://sportsbook.fanduel.com/navigation/mlb?tab=home-run",
    searchUrl: (name: string) =>
      `https://sportsbook.fanduel.com/navigation/mlb?tab=home-run&search=${encodeURIComponent(name)}`,
  },
  {
    id: "mgm",
    name: "BetMGM",
    color: "#C9A84C",
    logo: "MGM",
    url: "https://sports.betmgm.com/en/sports/baseball-23/betting/usa-9/mlb-75",
    searchUrl: (_name: string) =>
      `https://sports.betmgm.com/en/sports/baseball-23/betting/usa-9/mlb-75`,
  },
  {
    id: "czr",
    name: "Caesars",
    color: "#B5962B",
    logo: "CZR",
    url: "https://sportsbook.caesars.com/us/nj/bet/baseball/mlb",
    searchUrl: (_name: string) =>
      `https://sportsbook.caesars.com/us/nj/bet/baseball/mlb`,
  },
];

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Player {
  id: number; name: string; team: string; tier: string;
  park: string; pitcher: string; pitcherNote: string;
  matchupGrade: string; estOdds: string; note: string; tags: string[];
  edgeScore: number; hrProb: number; oddsNum: number; isLongshot: boolean;
  game: string;
}

interface Parlay {
  id: string; legs: number; label: string; risk: string;
  estPayout: string; description: string; playerIds: number[]; strategy: string;
}

// ─── SPORTSBOOK CARD (deep link + market button) ──────────────────────────────
function BookButton({ book, playerName }: { book: typeof BOOKS[0]; playerName?: string }) {
  return (
    <a
      href={playerName ? book.searchUrl(playerName) : book.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: 8,
        background: `${book.color}15`, border: `1px solid ${book.color}50`,
        borderRadius: 8, padding: "8px 12px", textDecoration: "none",
        transition: "background 0.15s", cursor: "pointer", flex: 1,
        minWidth: 100,
      }}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
    >
      <span style={{
        background: book.color, color: "#000", borderRadius: 4,
        padding: "1px 5px", fontSize: 9, fontWeight: 900, letterSpacing: 0.5,
        flexShrink: 0,
      }}>{book.logo}</span>
      <span style={{ fontSize: 11, color: book.color, fontWeight: 700 }}>{book.name}</span>
      <span style={{ marginLeft: "auto", fontSize: 10, color: "#555" }}>→</span>
    </a>
  );
}

// ─── ODDS COMPARISON ROW ──────────────────────────────────────────────────────
function OddsComparisonRow({ player }: { player: Player }) {
  const [open, setOpen] = useState(false);
  const tc = TIER_CONFIG[player.tier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.C;
  const implied = oddsToImplied(player.oddsNum);
  const edgeVsImplied = player.hrProb - implied;

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)", border: `1px solid ${tc.color}25`,
      borderRadius: 10, marginBottom: 6, overflow: "hidden",
    }}>
      {/* Collapsed row */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", flexWrap: "wrap" }}
        onClick={() => setOpen((o: boolean) => !o)}
      >
        <span style={{
          background: tc.bg, border: `1px solid ${tc.color}60`,
          borderRadius: 3, padding: "1px 5px", fontSize: 9, fontWeight: 900,
          color: tc.color, letterSpacing: 1, whiteSpace: "nowrap", flexShrink: 0,
        }}>{tc.label}</span>

        <span style={{ fontWeight: 700, fontSize: 13, color: "#F5F5F5", flex: 1, minWidth: 100 }}>{player.name}</span>
        <span style={{ fontSize: 10, color: "#aaa" }}>{player.team}</span>

        {/* Model odds */}
        <div style={{ textAlign: "center", minWidth: 54 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#FFD700" }}>{player.estOdds}</div>
          <div style={{ fontSize: 8, color: "#888", letterSpacing: 1 }}>MODEL</div>
        </div>

        {/* Edge vs implied */}
        <div style={{ textAlign: "center", minWidth: 48 }}>
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: edgeVsImplied > 0 ? "#76FF03" : "#FF5252",
          }}>
            {edgeVsImplied > 0 ? "+" : ""}{edgeVsImplied}%
          </div>
          <div style={{ fontSize: 8, color: "#888", letterSpacing: 1 }}>EDGE</div>
        </div>

        <span style={{ fontSize: 10, color: "#888" }}>{open ? "▲" : "▼"}</span>
      </div>

      {/* Expanded: book links + odds detail */}
      {open && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 14px" }}>
          <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 2, marginBottom: 8 }}>OPEN IN YOUR BOOK</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {BOOKS.map(b => <BookButton key={b.id} book={b} playerName={player.name} />)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11 }}>
              <div style={{ color: "#aaa", marginBottom: 2, fontSize: 9 }}>MODEL ODDS</div>
              <div style={{ color: "#FFD700", fontWeight: 700, fontSize: 15 }}>{player.estOdds}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11 }}>
              <div style={{ color: "#aaa", marginBottom: 2, fontSize: 9 }}>IMPLIED PROB</div>
              <div style={{ color: "#00E5FF", fontWeight: 700 }}>{implied}%</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11 }}>
              <div style={{ color: "#aaa", marginBottom: 2, fontSize: 9 }}>MODEL EST.</div>
              <div style={{ color: "#76FF03", fontWeight: 700 }}>{player.hrProb}%</div>
            </div>
          </div>

          <p style={{ fontSize: 11, color: "#aaa", lineHeight: 1.5, margin: 0 }}>
            ⚠ Model odds are estimates — always confirm current lines on your sportsbook before placing.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── PLACE BET TAB ────────────────────────────────────────────────────────────
function PlaceBetTab({
  parlayPlayers, parlays, playerMap, combinedOdds, slateDate,
}: {
  parlayPlayers: Player[];
  parlays: Parlay[];
  playerMap: Record<number, Player>;
  combinedOdds: string | null;
  slateDate: string;
}) {
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [copiedList, setCopiedList] = useState(false);
  const [activeBook, setActiveBook] = useState("dk");
  const [viewSection, setViewSection] = useState<"ticket"|"odds"|"books">("ticket");

  const selectedBook = BOOKS.find(b => b.id === activeBook) ?? BOOKS[0];

  // Build the copy-ready ticket text
  const ticketText = useMemo(() => {
    if (parlayPlayers.length === 0) return "";
    const lines = [
      `═══ HR PARLAY TICKET — ${slateDate} ═══`,
      `${parlayPlayers.length}-LEG SAME-GAME / MULTI-GAME PARLAY`,
      `Bet type: Player Home Run (any HR)`,
      ``,
      ...parlayPlayers.map((p: Player, i: number) =>
        `LEG ${i + 1}: ${p.name} (${p.team}) to hit a Home Run\n        vs ${p.pitcher} @ ${p.park}\n        Model odds: ${p.estOdds} | MU Grade: ${p.matchupGrade}`
      ),
      ``,
      `Combined model payout: ${combinedOdds ?? "N/A"}`,
      `⚠ Confirm current odds on your sportsbook before placing.`,
      `═══════════════════════════════════════`,
    ];
    return lines.join("\n");
  }, [parlayPlayers, combinedOdds, slateDate]);

  const shortList = useMemo(() =>
    parlayPlayers.map((p: Player) => `${p.name} (${p.team}) HR ${p.estOdds}`).join("\n"),
  [parlayPlayers]);

  // Safe clipboard helper — falls back to execCommand for non-HTTPS / older browsers
  const copyToClipboard = (text: string, onSuccess: () => void) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        // Silent fail — user can manually copy from the ticket
      });
    } else {
      // Fallback: create a temporary textarea and execCommand
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        onSuccess();
      } catch {
        // Silent fail
      }
    }
  };

  const copyTicket = () => copyToClipboard(ticketText, () => {
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2500);
  });

  const copyList = () => copyToClipboard(shortList, () => {
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2500);
  });

  const sectionBtn = (id: typeof viewSection, label: string) => (
    <button
      style={{
        flex: 1, padding: "7px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer",
        background: viewSection === id ? "rgba(255,215,0,0.15)" : "transparent",
        color: viewSection === id ? "#FFD700" : "#555",
        border: "none", borderBottom: `2px solid ${viewSection === id ? "#FFD700" : "transparent"}`,
        transition: "all 0.15s", fontFamily: "inherit",
      }}
      onClick={() => setViewSection(id)}
    >{label}</button>
  );

  return (
    <div>
      {/* Header */}
      <div style={{
        background: "rgba(83,211,55,0.06)", border: "1px solid rgba(83,211,55,0.2)",
        borderRadius: 12, padding: 14, marginBottom: 16,
      }}>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: "#53D337", letterSpacing: 2, marginBottom: 4 }}>
          🎯 PLACE YOUR BET
        </h2>
        <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6 }}>
          Use your parlay builder to select legs, then copy your ticket or open directly in your sportsbook.
          {parlayPlayers.length === 0 && " → Go to the Picks tab and add players first."}
        </p>
      </div>

      {/* Section switcher */}
      <div style={{
        display: "flex", background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
        marginBottom: 16, overflow: "hidden",
      }}>
        {sectionBtn("ticket", "📋 Parlay Ticket")}
        {sectionBtn("odds", "📊 Odds Table")}
        {sectionBtn("books", "🔗 Open in Book")}
      </div>

      {/* ── PARLAY TICKET ── */}
      {viewSection === "ticket" && (
        <div>
          {parlayPlayers.length === 0 ? (
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)",
              borderRadius: 12, padding: 32, textAlign: "center",
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎰</div>
              <div style={{ fontSize: 13, color: "#555" }}>No legs selected yet</div>
              <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>Go to Picks → Add players to your parlay builder</div>
            </div>
          ) : (
            <>
              {/* Ticket preview */}
              <div style={{
                background: "#0D0D14", border: "1px solid rgba(255,215,0,0.2)",
                borderRadius: 12, padding: 16, marginBottom: 12,
                fontFamily: "'DM Mono', monospace",
              }}>
                <div style={{ fontSize: 9, color: "#FFD70060", letterSpacing: 3, marginBottom: 10 }}>
                  ══ HR PARLAY TICKET — {slateDate} ══
                </div>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 10 }}>
                  {parlayPlayers.length}-LEG PARLAY · Player Home Run (any HR)
                </div>

                {parlayPlayers.map((p: Player, i: number) => {
                  const tc = TIER_CONFIG[p.tier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.C;
                  return (
                    <div key={p.id} style={{
                      display: "flex", gap: 10, alignItems: "flex-start",
                      padding: "8px 0", borderBottom: i < parlayPlayers.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}>
                      <span style={{ fontSize: 9, color: "#444", paddingTop: 2, minWidth: 40 }}>LEG {i + 1}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{
                            background: tc.bg, border: `1px solid ${tc.color}50`,
                            borderRadius: 3, padding: "0px 4px", fontSize: 8, fontWeight: 900, color: tc.color,
                          }}>{tc.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F5" }}>{p.name}</span>
                          <span style={{ fontSize: 10, color: "#aaa" }}>{p.team}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
                          vs {p.pitcher} @ {p.park}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#FFD700" }}>{p.estOdds}</div>
                        <div style={{ fontSize: 9, color: "#444" }}>MU: {p.matchupGrade}</div>
                      </div>
                    </div>
                  );
                })}

                <div style={{
                  marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,215,0,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{ fontSize: 10, color: "#666" }}>{parlayPlayers.length}-LEG COMBINED EST.</span>
                  <span style={{ fontFamily: "'Bebas Neue'", fontSize: 26, color: "#FFD700" }}>
                    {combinedOdds ?? "—"}
                  </span>
                </div>
              </div>

              {/* Copy buttons */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button
                  style={{
                    flex: 1, padding: "10px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    background: copiedTicket ? "rgba(118,255,3,0.15)" : "rgba(255,215,0,0.1)",
                    border: `1px solid ${copiedTicket ? "#76FF03" : "rgba(255,215,0,0.3)"}`,
                    color: copiedTicket ? "#76FF03" : "#FFD700",
                    transition: "all 0.2s",
                  }}
                  onClick={copyTicket}
                >
                  {copiedTicket ? "✓ Copied!" : "📋 Copy Full Ticket"}
                </button>
                <button
                  style={{
                    padding: "10px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    background: copiedList ? "rgba(118,255,3,0.15)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${copiedList ? "#76FF03" : "rgba(255,255,255,0.1)"}`,
                    color: copiedList ? "#76FF03" : "#888",
                    transition: "all 0.2s",
                  }}
                  onClick={copyList}
                >
                  {copiedList ? "✓ Copied!" : "Quick Copy"}
                </button>
              </div>

              {/* Open in book */}
              <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 2, marginBottom: 8 }}>OPEN YOUR BOOK — THEN SEARCH EACH LEG</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {BOOKS.map(b => (
                  <a
                    key={b.id}
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      background: `${b.color}15`, border: `1px solid ${b.color}50`,
                      borderRadius: 8, padding: "9px 14px", textDecoration: "none",
                      flex: 1, minWidth: 110, cursor: "pointer",
                    }}
                  >
                    <span style={{
                      background: b.color, color: "#000", borderRadius: 4,
                      padding: "1px 6px", fontSize: 9, fontWeight: 900,
                    }}>{b.logo}</span>
                    <span style={{ fontSize: 12, color: b.color, fontWeight: 700 }}>{b.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "#888" }}>↗</span>
                  </a>
                ))}
              </div>

              <p style={{ fontSize: 10, color: "#aaa", marginTop: 12, lineHeight: 1.6 }}>
                ⚠ Odds shown are model estimates. Always verify current lines on your sportsbook. Some books may not offer all listed props.
              </p>
            </>
          )}
        </div>
      )}

      {/* ── ODDS TABLE ── */}
      {viewSection === "odds" && (
        <div>
          <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 1, marginBottom: 12 }}>
            {parlayPlayers.length > 0
              ? `Showing ${parlayPlayers.length} selected parlay legs — expand any row to open in your book`
              : "No legs in your builder — showing top picks instead. Add legs from the Picks tab."}
          </div>

          {/* Show parlay legs if any, otherwise top S-tier */}
          {(parlayPlayers.length > 0
            ? parlayPlayers
            : (Object.values(playerMap) as Player[]).filter((p: Player) => p.tier === "S").sort((a: Player, b: Player) => b.edgeScore - a.edgeScore).slice(0, 8)
          ).map((p: Player) => (
            <OddsComparisonRow key={p.id} player={p} />
          ))}

          <div style={{
            background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.15)",
            borderRadius: 10, padding: 12, marginTop: 12, fontSize: 11, color: "#aaa", lineHeight: 1.7,
          }}>
            <span style={{ color: "#00E5FF", fontWeight: 700 }}>How to read this: </span>
            Model odds are our estimated fair value based on matchup grade and park factor. Implied prob is what the sportsbook's odds translate to. When our model est. exceeds the implied prob, that's where we see edge.
          </div>
        </div>
      )}

      {/* ── BOOK LINKS ── */}
      {viewSection === "books" && (
        <div>
          <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 1, marginBottom: 16 }}>
            SELECT A BOOK — THEN NAVIGATE TO PLAYER PROPS → HOME RUNS
          </div>

          {/* Book selector */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {BOOKS.map(b => (
              <button
                key={b.id}
                style={{
                  padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  background: activeBook === b.id ? `${b.color}25` : "rgba(255,255,255,0.04)",
                  color: activeBook === b.id ? b.color : "#aaa",
                  border: `1px solid ${activeBook === b.id ? b.color + "60" : "rgba(255,255,255,0.08)"}`,
                }}
                onClick={() => setActiveBook(b.id)}
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* Selected book card */}
          <div style={{
            background: `${selectedBook.color}08`, border: `1px solid ${selectedBook.color}30`,
            borderRadius: 12, padding: 16, marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{
                background: selectedBook.color, color: "#000", borderRadius: 6,
                padding: "4px 10px", fontSize: 13, fontWeight: 900,
              }}>{selectedBook.logo}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: selectedBook.color }}>{selectedBook.name}</span>
            </div>

            <a
              href={selectedBook.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", textAlign: "center", padding: "11px 16px",
                background: selectedBook.color, color: "#000",
                borderRadius: 8, fontSize: 13, fontWeight: 900,
                textDecoration: "none", marginBottom: 12, letterSpacing: 0.5,
              }}
            >
              Open {selectedBook.name} → HR Props ↗
            </a>

            <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 2, marginBottom: 8 }}>
              SEARCH EACH PLAYER — OPENS DIRECTLY TO HR PROPS SECTION
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {(parlayPlayers.length > 0
                ? parlayPlayers
                : (Object.values(playerMap) as Player[]).filter((p: Player) => p.tier === "S").sort((a: Player, b: Player) => b.edgeScore - a.edgeScore).slice(0, 6)
              ).map((p: Player) => (
                <a
                  key={p.id}
                  href={selectedBook.searchUrl(p.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 8, padding: "8px 12px", textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#F5F5F5", flex: 1 }}>{p.name}</span>
                  <span style={{ fontSize: 10, color: "#aaa" }}>{p.team}</span>
                  <span style={{ fontSize: 12, color: "#FFD700", fontWeight: 700 }}>{p.estOdds}</span>
                  <span style={{ fontSize: 10, color: selectedBook.color }}>Search ↗</span>
                </a>
              ))}
            </div>

            {parlayPlayers.length === 0 && (
              <p style={{ fontSize: 10, color: "#888", marginTop: 10, textAlign: "center" }}>
                Add players in the Picks tab to see your specific legs here.
              </p>
            )}
          </div>

          {/* Step-by-step guide */}
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12, padding: 14,
          }}>
            <div style={{ fontSize: 10, color: "#FFD700", letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>
              HOW TO PLACE YOUR PARLAY
            </div>
            {[
              "Open your sportsbook using the button above",
              "Navigate to MLB → Player Props → Home Run",
              'Search each player name and find "To Hit a Home Run"',
              "Add each leg to your bet slip",
              "Select Parlay and enter your stake",
              "Verify the combined odds match or beat our model estimate",
              "Confirm the bet — good luck!",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{
                  background: "rgba(255,215,0,0.15)", color: "#FFD700",
                  borderRadius: "50%", width: 20, height: 20, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 900, marginTop: 1,
                }}>{i + 1}</span>
                <span style={{ fontSize: 11, color: "#aaa", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EDGE / MU BADGE COMPONENTS ───────────────────────────────────────────────
function EdgeBadge({ score }: { score: number }) {
  const color = score >= 85 ? "#FFD700" : score >= 70 ? "#76FF03" : "#FF9800";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 3,
      background: `${color}18`, border: `1px solid ${color}40`,
      borderRadius: 6, padding: "2px 7px", fontSize: 11, fontWeight: 700, color, whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 9 }}>EDGE</span>
      <span style={{ fontSize: 14 }}>{score}</span>
      <span style={{ fontSize: 9, opacity: 0.7 }}>/100</span>
    </div>
  );
}

function MuBadge({ grade }: { grade: string }) {
  const color = gradeColor(grade);
  return (
    <span style={{
      background: `${color}20`, border: `1px solid ${color}50`,
      borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 800, color, letterSpacing: 0.5,
    }}>{grade}</span>
  );
}

// ─── PLAYER CARD ──────────────────────────────────────────────────────────────
function PlayerCard({
  player, inParlay, onToggle, parkLabel,
}: {
  player: Player; inParlay: boolean; onToggle: () => void; parkLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const tc = TIER_CONFIG[player.tier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.C;

  return (
    <div
      style={{
        background: inParlay ? `${tc.color}15` : "rgba(255,255,255,0.03)",
        border: `1px solid ${inParlay ? tc.color : tc.border + "35"}`,
        borderRadius: 12, padding: "14px 16px", marginBottom: 8,
        cursor: "pointer", transition: "border-color 0.2s, background 0.2s",
        boxShadow: inParlay ? `0 0 14px ${tc.color}28` : "none",
      }}
      onClick={() => setExpanded((e: boolean) => !e)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{
          background: tc.bg, border: `1px solid ${tc.color}60`,
          borderRadius: 4, padding: "2px 7px", fontSize: 9, fontWeight: 900,
          color: tc.color, letterSpacing: 1, whiteSpace: "nowrap",
        }}>{tc.label}</span>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#F5F5F5", flex: 1 }}>{player.name}</span>
        <span style={{ fontSize: 11, color: "#888", background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>{player.team}</span>
        <span style={{ fontWeight: 800, fontSize: 16, color: "#FFD700", minWidth: 54, textAlign: "right" }}>{player.estOdds}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#aaa" }}>{player.park}</span>
        {parkLabel && <span style={{ fontSize: 10, color: "#888" }}>· {parkLabel}</span>}
        <span style={{ fontSize: 11, color: "#aaa" }}>vs {player.pitcher}</span>
        <MuBadge grade={player.matchupGrade} />
        <EdgeBadge score={player.edgeScore} />
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#aaa", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#76FF03", fontWeight: 700 }}>{player.hrProb}%</span>
          {player.game && (
            <span style={{
              fontSize: 9, color: "#00E5FF", background: "rgba(0,229,255,0.07)",
              border: "1px solid rgba(0,229,255,0.18)", borderRadius: 4,
              padding: "1px 5px", letterSpacing: 0.5, fontWeight: 700,
            }}>{player.game}</span>
          )}
        </span>
      </div>

      {expanded && (
        <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
          <p style={{ fontSize: 12, color: "#bbb", lineHeight: 1.6, margin: "0 0 6px" }}>
            💡 <em>{player.note}</em>
          </p>
          {player.pitcherNote && (
            <p style={{ fontSize: 11, color: "#aaa", lineHeight: 1.5, margin: "0 0 8px" }}>
              ⚾ SP note: {player.pitcherNote}
            </p>
          )}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {player.tags.map(t => (
              <span key={t} style={{ fontSize: 10, color: "#aaa", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 10 }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11 }}>
              <div style={{ color: "#aaa", marginBottom: 2 }}>MU Grade</div>
              <div style={{ color: gradeColor(player.matchupGrade), fontWeight: 700 }}>{player.matchupGrade}</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11 }}>
              <div style={{ color: "#aaa", marginBottom: 2 }}>Edge Score</div>
              <div style={{ color: "#FFD700", fontWeight: 700 }}>{player.edgeScore}/100</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11 }}>
              <div style={{ color: "#aaa", marginBottom: 2 }}>Est. HR %</div>
              <div style={{ color: "#76FF03", fontWeight: 700 }}>{player.hrProb}%</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <button
          style={{
            background: inParlay ? tc.color : "transparent",
            border: `1px solid ${tc.color}`,
            borderRadius: 6, padding: "5px 14px", fontSize: 11,
            color: inParlay ? "#000" : tc.color, fontWeight: 700, cursor: "pointer",
            transition: "all 0.15s", fontFamily: "inherit",
          }}
          onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onToggle(); }}
        >
          {inParlay ? "✓ In Parlay" : "+ Add to Parlay"}
        </button>
        <span style={{ fontSize: 10, color: "#888" }}>{expanded ? "▲ collapse" : "▼ details"}</span>
      </div>
    </div>
  );
}

// ─── BUILT PARLAY CARD ────────────────────────────────────────────────────────
function ParlayBuiltCard({
  parlay, playerMap, isOpen, onToggle,
}: {
  parlay: Parlay; playerMap: Record<number, Player>; isOpen: boolean; onToggle: () => void;
}) {
  const legPlayers = parlay.playerIds.map((id: number) => playerMap[id]).filter((p): p is Player => Boolean(p));
  const missingIds = parlay.playerIds.filter((id: number) => !playerMap[id]);
  const riskColor =
    parlay.risk === "Lower Risk" ? "#76FF03" :
    parlay.risk === "Medium Risk" ? "#FFD700" :
    parlay.risk === "High Risk" ? "#FF9800" : "#FF5252";

  // Derive unique games this parlay spans
  const gamesInParlay = Array.from(new Set(legPlayers.map(p => p.game).filter(Boolean)));

  return (
    <div style={{
      background: isOpen ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${isOpen ? riskColor + "60" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 12, padding: "14px 16px", marginBottom: 8, cursor: "pointer",
      transition: "all 0.2s",
    }} onClick={onToggle}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)",
          borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 900,
          color: "#FFD700", letterSpacing: 1,
        }}>{parlay.legs}-LEG</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: "#F5F5F5", flex: 1 }}>{parlay.label}</span>
        <span style={{ fontSize: 11, color: riskColor, fontWeight: 600, whiteSpace: "nowrap" }}>{parlay.risk}</span>
        <span style={{ fontWeight: 800, color: "#FFD700", fontSize: 15, whiteSpace: "nowrap" }}>{parlay.estPayout}</span>
        <span style={{ fontSize: 11, color: "#888" }}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* Game coverage badges — always visible */}
      {gamesInParlay.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
          {gamesInParlay.map(g => (
            <span key={g} style={{
              fontSize: 9, color: "#00E5FF", background: "rgba(0,229,255,0.08)",
              border: "1px solid rgba(0,229,255,0.2)", borderRadius: 4,
              padding: "1px 6px", letterSpacing: 0.5, fontWeight: 700,
            }}>{g}</span>
          ))}
        </div>
      )}

      {missingIds.length > 0 && (
        <div style={{ fontSize: 10, color: "#FF5252", marginTop: 6 }}>
          ⚠ {missingIds.length} player id{missingIds.length > 1 ? "s" : ""} not found in data: {missingIds.join(", ")}
        </div>
      )}
      {isOpen && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 11, color: "#aaa", margin: "0 0 10px", lineHeight: 1.6 }}>{parlay.description}</p>
          {parlay.strategy && (
            <p style={{ fontSize: 11, color: "#aaa", margin: "0 0 10px", lineHeight: 1.6 }}>
              <span style={{ color: "#FFD700", fontWeight: 700 }}>STRATEGY: </span>{parlay.strategy}
            </p>
          )}
          <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 1, marginBottom: 6 }}>LEGS</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {legPlayers.map(p => {
              const tc = TIER_CONFIG[p.tier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.C;
              return (
                <span key={p.id} style={{
                  fontSize: 10, color: tc.color, background: tc.bg,
                  padding: "2px 8px", borderRadius: 10, border: `1px solid ${tc.color}40`,
                }}>{p.name}</span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [slateDate,    setSlateDate]    = useState("...");
  const [slateLabel,   setSlateLabel]   = useState("");
  const [contextCards, setContextCards] = useState<{ icon: string; label: string; note: string; sub: string }[]>([]);
  const [parkFactors,  setParkFactors]  = useState<Record<string, { rank: number; label: string; color: string }>>({});
  const [players,      setPlayers]      = useState<Player[]>([]);
  const [parlays,      setParlays]      = useState<Parlay[]>([]);
  const [allGames,     setAllGames]     = useState<string[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [dataError,    setDataError]    = useState<string | null>(null);

  const [activeTab,    setActiveTab]    = useState<"picks"|"parlays"|"longshots"|"bet">("picks");
  const [tierFilters,  setTierFilters]  = useState<Set<string>>(new Set());  // empty = ALL
  const [gameFilter,   setGameFilter]   = useState<Set<string>>(new Set());  // empty = ALL
  const [sortBy,       setSortBy]       = useState<"edge"|"prob"|"odds">("edge");
  const [parlay,       setParlay]       = useState<number[]>([]);
  const [parlayOpen,   setParlayOpen]   = useState(false);
  const [openParlay,   setOpenParlay]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/data.js")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} — is public/data.js in your repo?`);
        return r.text();
      })
      .then(text => {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${text}\nreturn { SLATE_DATE, SLATE_LABEL, CONTEXT_CARDS, PARK_FACTORS, players, parlays, TEAM_TO_GAME };`);
        const raw = fn();

        // Deduplicate players by id (guards against accidental duplicates)
        const seen = new Set<number>();
        const unique = (raw.players as Player[]).filter((p: Player) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });

        const hydrated: Player[] = unique.map((p: Player) => ({
          ...p,
          edgeScore: gradeToEdge(p.matchupGrade),
          hrProb: gradeToHrProb(p.matchupGrade, p.tier),
          oddsNum: oddsToNum(p.estOdds),
          isLongshot: p.tier === "C",
          game: (raw.TEAM_TO_GAME as Record<string, string>)?.[p.team] ?? "Other",
        }));

        setSlateDate(raw.SLATE_DATE);
        setSlateLabel(raw.SLATE_LABEL);
        setContextCards(raw.CONTEXT_CARDS);
        setParkFactors(raw.PARK_FACTORS);
        setPlayers(hydrated);
        setParlays(raw.parlays);
        // Derive unique game list from TEAM_TO_GAME — preserves insertion order
        const uniqueGames = [...new Set<string>(Object.values((raw.TEAM_TO_GAME as Record<string, string>) ?? {}))];
        setAllGames(uniqueGames);
        setLoading(false);
      })
      .catch(err => { setDataError(err.message); setLoading(false); });
  }, []);

  const playerMap       = useMemo(() => Object.fromEntries(players.map((p: Player) => [p.id, p])), [players]);
  const mainPlayers     = useMemo(() => players.filter((p: Player) => p.tier !== "C"), [players]);
  const longshotPlayers = useMemo(() => players.filter((p: Player) => p.tier === "C"), [players]);
  const parlayPlayers   = useMemo(() => players.filter((p: Player) => parlay.includes(p.id)), [parlay, players]);
  const topPicks        = useMemo(() => players.filter((p: Player) => p.tier === "S").sort((a: Player, b: Player) => b.edgeScore - a.edgeScore).slice(0, 5), [players]);
  const tierCounts      = useMemo(() => {
    const c: Record<string, number> = { S: 0, A: 0, B: 0, C: 0 };
    players.forEach((p: Player) => { if (p.tier in c) c[p.tier]++; });
    return c;
  }, [players]);

  const toggleTierFilter = useCallback((t: string) => {
    setTierFilters((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  }, []);

  const toggleGameFilter = useCallback((g: string) => {
    setGameFilter((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g); else next.add(g);
      return next;
    });
  }, []);

  const filteredPlayers = useMemo(() => {
    let p = mainPlayers;
    if (tierFilters.size > 0) p = p.filter((pl: Player) => tierFilters.has(pl.tier));
    if (gameFilter.size > 0)  p = p.filter((pl: Player) => gameFilter.has(pl.game));
    if (sortBy === "edge")  return [...p].sort((a: Player, b: Player) => b.edgeScore - a.edgeScore);
    if (sortBy === "prob")  return [...p].sort((a: Player, b: Player) => b.hrProb - a.hrProb);
    if (sortBy === "odds")  return [...p].sort((a: Player, b: Player) => b.oddsNum - a.oddsNum);
    return p;
  }, [mainPlayers, tierFilters, gameFilter, sortBy]);

  const filteredLongshots = useMemo(() => {
    let p = longshotPlayers;
    if (gameFilter.size > 0) p = p.filter((pl: Player) => gameFilter.has(pl.game));
    return p;
  }, [longshotPlayers, gameFilter]);

  const combinedOdds = useMemo(() => {
    if (parlayPlayers.length < 2) return null;
    const dec = parlayPlayers.map((p: Player) => p.oddsNum > 0 ? p.oddsNum / 100 + 1 : 100 / Math.abs(p.oddsNum) + 1);
    return `+${Math.round((dec.reduce((a: number, b: number) => a * b, 1) - 1) * 100).toLocaleString()}`;
  }, [parlayPlayers]);

  // ── PARLAY VALIDATION HELPERS ─────────────────────────────────────────────
  // Fix 1: No two players from the same game
  const isGameConflict = useCallback((candidateId: number, currentIds: number[]): boolean => {
    const candidate = playerMap[candidateId];
    if (!candidate) return false;
    return currentIds.some(id => {
      const p = playerMap[id];
      return p && p.game && candidate.game && p.game === candidate.game;
    });
  }, [playerMap]);

  // Fix 2: S-tier cap — max 2 S legs per parlay
  const wouldExceedSTierCap = useCallback((candidateId: number, currentIds: number[]): boolean => {
    const candidate = playerMap[candidateId];
    if (!candidate || candidate.tier !== "S") return false;
    const currentSCount = currentIds.filter(id => playerMap[id]?.tier === "S").length;
    return currentSCount >= 2;
  }, [playerMap]);

  // Fix 3: Warn when structure deviates from ideal (2S / 2-3A / 1-2B-C)
  // Used to show a badge in the parlay builder — no hard reject, just guidance
  const parlayStructureWarning = useMemo((): string | null => {
    if (parlayPlayers.length < 4) return null;
    const s  = parlayPlayers.filter(p => p.tier === "S").length;
    const a  = parlayPlayers.filter(p => p.tier === "A").length;
    const bc = parlayPlayers.filter(p => p.tier === "B" || p.tier === "C").length;
    if (s > 2)          return `⚠ ${s} S-tier legs — cap is 2`;
    if (s < 2)          return `⚠ Ideal: 2 S-tier anchors`;
    if (a < 2)          return `⚠ Add 1-2 more A-tier legs`;
    if (bc === 0)       return `⚠ Add 1 B/C value leg`;
    return null; // structure is good
  }, [parlayPlayers]);

  // Fix 4: Sort parlay candidates by independent HR probability (edgeScore × hrProb),
  // never by park/matchup grouping — enforced in filteredPlayers sort above.
  // The "edge" sort already does this; we just make it the default and only meaningful sort.

  const toggleParlay = useCallback((id: number) => {
    setParlay((prev: number[]) => {
      if (prev.includes(id)) return prev.filter((x: number) => x !== id);
      if (isGameConflict(id, prev)) {
        alert("⛔ Same game! Pick one player per game to keep legs independent.");
        return prev;
      }
      if (wouldExceedSTierCap(id, prev)) {
        alert("⚠ S-tier cap reached — max 2 S-tier legs per parlay.");
        return prev;
      }
      return [...prev, id];
    });
  }, [isGameConflict, wouldExceedSTierCap]);

  const tabStyle = (t: string) => ({
    padding: "8px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700 as const,
    cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
    background: activeTab === t ? "#FFD700" : "rgba(255,255,255,0.05)",
    color: activeTab === t ? "#000" : "#aaa",
    border: activeTab === t ? "none" : "1px solid rgba(255,255,255,0.1)",
    position: "relative" as const,
  });

  const filterBtnStyle = (active: boolean, color = "#FFD700") => ({
    padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700 as const,
    cursor: "pointer", fontFamily: "inherit",
    background: active ? `${color}20` : "rgba(255,255,255,0.04)",
    color: active ? color : "#666",
    border: `1px solid ${active ? color + "50" : "rgba(255,255,255,0.08)"}`,
    transition: "all 0.15s",
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#aaa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", letterSpacing: 3, fontSize: 13 }}>
      LOADING SLATE DATA...
    </div>
  );

  if (dataError) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#FF5252", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, fontFamily: "'DM Mono', monospace", padding: 24 }}>
      <div style={{ letterSpacing: 3, fontSize: 13 }}>⚠ FAILED TO LOAD DATA</div>
      <div style={{ fontSize: 11, color: "#aaa", textAlign: "center", maxWidth: 400 }}>{dataError}</div>
      <div style={{ fontSize: 10, color: "#888" }}>Make sure <code>public/data.js</code> exists in your repo.</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#F0F0F0", fontFamily: "'DM Mono', 'Courier New', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A0F; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .parlay-sticky { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; }
        @media (max-width: 600px) { .hero-title { font-size: 36px !important; } .stat-row { gap: 12px !important; } }
      `}</style>

      <header>
      {/* HERO */}
      <div style={{ background: "linear-gradient(180deg, #111118 0%, #0A0A0F 100%)", borderBottom: "1px solid rgba(255,215,0,0.15)", padding: "32px 16px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 400, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,215,0,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#FFD700", fontWeight: 700, marginBottom: 10 }}>
          ◆ SHARP STACKING SYSTEM ◆ {slateDate} ◆ {slateLabel}
        </div>
        <h1 className="hero-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: 3, color: "#FFD700", lineHeight: 1, marginBottom: 8 }}>
          Daily MLB Home Run Picks
        </h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Data-driven picks using matchup grades, park factors &amp; pitcher tendencies</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          {["✅ Updated Daily","📊 Statcast Data","🔢 Edge Score /100"].map(s => (
            <span key={s} style={{ fontSize: 10, color: "#FFD700", background: "rgba(255,215,0,0.08)", padding: "3px 10px", borderRadius: 10, border: "1px solid rgba(255,215,0,0.2)" }}>{s}</span>
          ))}
        </div>
        <div className="stat-row" style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
          {([
            { label: "S-TIER", val: tierCounts.S, color: "#FFD700" },
            { label: "A-TIER", val: tierCounts.A, color: "#00E5FF" },
            { label: "B-TIER", val: tierCounts.B, color: "#76FF03" },
            { label: "LONGSHOTS", val: tierCounts.C, color: "#FF6D00" },
            { label: "PARLAYS", val: parlays.length, color: "#FF80AB" },
          ] as const).map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "#888", letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP PICKS BANNER */}
      <div style={{ background: "rgba(255,215,0,0.04)", borderBottom: "1px solid rgba(255,215,0,0.1)", padding: "16px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#FFD700", fontWeight: 900, marginBottom: 10 }}>🏆 BEST HR BETS TODAY</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {topPicks.map((p: Player) => (
              <div key={p.id} style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)", borderRadius: 10, padding: "10px 14px", minWidth: 130, flex: "0 0 auto" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#FFD700", marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{p.team} · {p.estOdds}</div>
                <div style={{ fontSize: 10, color: "#76FF03", marginTop: 4 }}>Edge {p.edgeScore}/100</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTEXT CARDS */}
      {contextCards.length > 0 && (
        <div style={{ background: "rgba(255,140,0,0.03)", borderBottom: "1px solid rgba(255,140,0,0.12)", padding: "14px 16px" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#FF9800", fontWeight: 900, marginBottom: 10 }}>📍 TODAY'S KEY CONTEXTS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {contextCards.map((c: { icon: string; label: string; note: string; sub: string }, i: number) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#e8e8e8" }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: "#FF9800", marginTop: 1 }}>{c.note}</div>
                    <div style={{ fontSize: 10, color: "#888", marginTop: 1 }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      </header>

      <main id="main-content">
      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "16px 12px 130px" }}>

        {/* Tabs — now 4 tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          <button style={tabStyle("picks")}     onClick={() => setActiveTab("picks")}>📊 Picks</button>
          <button style={tabStyle("parlays")}   onClick={() => setActiveTab("parlays")}>🎰 Parlays</button>
          <button style={tabStyle("longshots")} onClick={() => setActiveTab("longshots")}>💎 Longshots</button>
          <button
            style={{ ...tabStyle("bet"), background: activeTab === "bet" ? "#53D337" : "rgba(83,211,55,0.08)", color: activeTab === "bet" ? "#000" : "#53D337", border: activeTab === "bet" ? "none" : "1px solid rgba(83,211,55,0.3)" }}
            onClick={() => setActiveTab("bet")}
          >
            🎯 Place Bet
            {parlay.length > 0 && (
              <span style={{ background: "#53D337", color: "#000", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, marginLeft: 6 }}>{parlay.length}</span>
            )}
          </button>
        </div>

        {/* PICKS TAB */}
        {activeTab === "picks" && (
          <>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, marginBottom: 14 }}>
              {/* GAME FILTER */}
              <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 2, marginBottom: 8 }}>
                FILTER BY GAME
                <span style={{ fontSize: 9, color: "#888", marginLeft: 6 }}>(multi-select)</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                <button
                  style={filterBtnStyle(gameFilter.size === 0, "#aaa")}
                  onClick={() => setGameFilter(new Set())}
                >All Games</button>
                {allGames.map(g => {
                  const cnt = mainPlayers.filter((p: Player) => p.game === g).length;
                  const active = gameFilter.has(g);
                  return (
                    <button
                      key={g}
                      style={{
                        ...filterBtnStyle(active, "#00E5FF"),
                        display: "flex", alignItems: "center", gap: 4,
                      }}
                      onClick={() => toggleGameFilter(g)}
                    >
                      {active && <span style={{ fontSize: 9 }}>✓</span>}
                      <span style={{ fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 }}>{g}</span>
                      <span style={{
                        background: active ? "rgba(0,229,255,0.25)" : "rgba(255,255,255,0.08)",
                        borderRadius: 8, padding: "0px 5px", fontSize: 9, fontWeight: 900,
                        color: active ? "#00E5FF" : "#888",
                      }}>{cnt}</span>
                    </button>
                  );
                })}
                {gameFilter.size > 0 && (
                  <button
                    style={{ padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: "rgba(255,82,82,0.08)", color: "#FF5252", border: "1px solid rgba(255,82,82,0.25)" }}
                    onClick={() => setGameFilter(new Set())}
                  >✕ Clear</button>
                )}
              </div>

              {/* TIER FILTER — multi-select */}
              <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 2, marginBottom: 8 }}>
                FILTER BY TIER
                <span style={{ fontSize: 9, color: "#888", marginLeft: 6 }}>(multi-select)</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {(["S","A","B"] as const).map(t => {
                  const tColor = t === "S" ? "#FFD700" : t === "A" ? "#00E5FF" : "#76FF03";
                  const active = tierFilters.has(t);
                  const cnt = mainPlayers.filter((p: Player) => p.tier === t && (gameFilter.size === 0 || gameFilter.has(p.game))).length;
                  return (
                    <button
                      key={t}
                      style={{
                        ...filterBtnStyle(active, tColor),
                        display: "flex", alignItems: "center", gap: 4,
                        position: "relative",
                      }}
                      onClick={() => toggleTierFilter(t)}
                    >
                      {active && <span style={{ fontSize: 9 }}>✓</span>}
                      {TIER_CONFIG[t].label}
                      <span style={{
                        background: active ? `${tColor}30` : "rgba(255,255,255,0.08)",
                        borderRadius: 8, padding: "0px 5px", fontSize: 9, fontWeight: 900,
                        color: active ? tColor : "#888",
                      }}>{cnt}</span>
                    </button>
                  );
                })}
                {tierFilters.size > 0 && (
                  <button
                    style={{ padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: "rgba(255,82,82,0.08)", color: "#FF5252", border: "1px solid rgba(255,82,82,0.25)" }}
                    onClick={() => setTierFilters(new Set())}
                  >✕ Clear</button>
                )}
              </div>

              {/* SORT */}
              <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 2, marginBottom: 8 }}>SORT BY</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {([["edge","Edge Score"],["prob","HR Prob"],["odds","Best Odds"]] as const).map(([v,l]) => (
                  <button key={v} style={filterBtnStyle(sortBy === v, "#00E5FF")} onClick={() => setSortBy(v)}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#888", letterSpacing: 1, marginBottom: 10 }}>
              {filteredPlayers.length} players
              {(tierFilters.size > 0 || gameFilter.size > 0) && (
                <span style={{ color: "#aaa" }}> · filtered
                  {gameFilter.size > 0 && <span style={{ color: "#00E5FF" }}> {[...gameFilter].join(", ")}</span>}
                  {tierFilters.size > 0 && <span style={{ color: "#FFD700" }}> {[...tierFilters].join("+")}</span>}
                </span>
              )}
              <span style={{ color: "#888" }}> · tap for details · add to parlay builder below</span>
            </div>
            {filteredPlayers.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "40px 20px",
                background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)",
                borderRadius: 12,
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
                <div style={{ fontSize: 13, color: "#aaa", marginBottom: 6 }}>No picks match these filters</div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 16 }}>
                  {gameFilter.size > 0 && <span>{[...gameFilter].join(", ")} · </span>}
                  {tierFilters.size > 0 && <span>{[...tierFilters].join(" + ")} tier{tierFilters.size > 1 ? "s" : ""}</span>}
                </div>
                <button
                  style={{
                    padding: "8px 18px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)",
                    color: "#00E5FF",
                  }}
                  onClick={() => { setTierFilters(new Set()); setGameFilter(new Set()); }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
            (["S","A","B"] as const).filter(t => tierFilters.size === 0 || tierFilters.has(t)).map(tier => {
              const tc = TIER_CONFIG[tier];
              const tp = filteredPlayers.filter((p: Player) => p.tier === tier);
              if (!tp.length) return null;
              return (
                <div key={tier} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${tc.color}25` }}>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: tc.color, letterSpacing: 2 }}>{tc.label}</span>
                    <span style={{ fontSize: 10, color: "#555" }}>— {tc.desc}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "#444" }}>{tp.length}</span>
                  </div>
                  {tp.map((p: Player) => (
                    <PlayerCard key={p.id} player={p} inParlay={parlay.includes(p.id)} onToggle={() => toggleParlay(p.id)} parkLabel={parkFactors[p.park]?.label} />
                  ))}
                </div>
              );
            })
            )}
          </>
        )}

        {/* PARLAYS TAB */}
        {activeTab === "parlays" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: "#FFD700", letterSpacing: 2, marginBottom: 4 }}>SHARP PARLAYS</h2>
              <p style={{ fontSize: 11, color: "#666" }}>Pre-built combinations from today's slate — tap to expand strategy</p>
            </div>
            {parlays.map((p: Parlay) => (
              <ParlayBuiltCard key={p.id} parlay={p} playerMap={playerMap} isOpen={openParlay === p.id} onToggle={() => setOpenParlay((prev: string | null) => prev === p.id ? null : p.id)} />
            ))}
          </div>
        )}

        {/* LONGSHOTS TAB */}
        {activeTab === "longshots" && (
          <div>
            <div style={{ background: "rgba(255,109,0,0.06)", border: "1px solid rgba(255,109,0,0.2)", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: "#FF6D00", letterSpacing: 2, marginBottom: 4 }}>💎 LONGSHOTS — HIGH RISK, HIGH REWARD</h2>
              <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6 }}>
                C-tier players with real HR upside — favorable parks, overlooked matchups, or hot streaks. Ideal as tail legs on big parlays. {longshotPlayers.length} available today.
              </p>
            </div>
            {/* Game filter for longshots — multi-select */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              <button style={filterBtnStyle(gameFilter.size === 0, "#aaa")} onClick={() => setGameFilter(new Set())}>All Games</button>
              {allGames.map(g => {
                const cnt = longshotPlayers.filter((p: Player) => p.game === g).length;
                if (!cnt) return null;
                const active = gameFilter.has(g);
                return (
                  <button key={g} style={{ ...filterBtnStyle(active, "#FF6D00"), display: "flex", alignItems: "center", gap: 4 }} onClick={() => toggleGameFilter(g)}>
                    {active && <span style={{ fontSize: 9 }}>✓</span>}
                    <span style={{ fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 }}>{g}</span>
                    <span style={{ background: active ? "rgba(255,109,0,0.25)" : "rgba(255,255,255,0.08)", borderRadius: 8, padding: "0px 5px", fontSize: 9, fontWeight: 900, color: active ? "#FF6D00" : "#555" }}>{cnt}</span>
                  </button>
                );
              })}
              {gameFilter.size > 0 && (
                <button
                  style={{ padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: "rgba(255,82,82,0.08)", color: "#FF5252", border: "1px solid rgba(255,82,82,0.25)" }}
                  onClick={() => setGameFilter(new Set())}
                >✕ Clear</button>
              )}
            </div>
            {filteredLongshots.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px", color: "#555", fontSize: 12 }}>No longshots match this game filter.</div>
            ) : (
              filteredLongshots.map((p: Player) => (
                <PlayerCard key={p.id} player={p} inParlay={parlay.includes(p.id)} onToggle={() => toggleParlay(p.id)} parkLabel={parkFactors[p.park]?.label} />
              ))
            )}
          </div>
        )}

        {/* PLACE BET TAB */}
        {activeTab === "bet" && (
          <PlaceBetTab
            parlayPlayers={parlayPlayers}
            parlays={parlays}
            playerMap={playerMap}
            combinedOdds={combinedOdds}
            slateDate={slateDate}
          />
        )}
      </div>

      </main>

      {/* STICKY PARLAY BUILDER */}
      <div className="parlay-sticky">
        <div style={{ background: "#111118", borderTop: "1px solid rgba(255,215,0,0.25)" }}>
          {parlayOpen && (
            <div style={{ background: "#13131A", maxHeight: "55vh", overflowY: "auto", padding: "16px" }}>
              <div style={{ maxWidth: 700, margin: "0 auto" }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#FFD700", marginBottom: 12 }}>YOUR PARLAY BUILDER</div>
                {parlayPlayers.length === 0 ? (
                  <p style={{ fontSize: 12, color: "#aaa", textAlign: "center", padding: "20px 0" }}>Add players from the picks tab to build your parlay</p>
                ) : (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                      {parlayPlayers.map((p: Player) => (
                        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px" }}>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                          <span style={{ fontSize: 11, color: "#888" }}>{p.team}</span>
                          <span style={{ fontSize: 13, color: "#FFD700", fontWeight: 700 }}>{p.estOdds}</span>
                          <button style={{ background: "rgba(255,82,82,0.15)", border: "1px solid rgba(255,82,82,0.3)", borderRadius: 4, padding: "2px 8px", fontSize: 11, color: "#FF5252", cursor: "pointer", fontFamily: "inherit" }} onClick={() => toggleParlay(p.id)}>✕</button>
                        </div>
                      ))}
                    </div>
                    {parlayStructureWarning && (
                      <div style={{ background: "rgba(255,152,0,0.08)", border: "1px solid rgba(255,152,0,0.3)", borderRadius: 8, padding: "8px 12px", marginBottom: 8, fontSize: 11, color: "#FF9800" }}>
                        {parlayStructureWarning}
                        <span style={{ color: "#888", marginLeft: 6 }}>Ideal: 2S · 2-3A · 1-2B/C</span>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(255,215,0,0.06)", borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: "#888", flex: 1 }}>{parlayPlayers.length}-LEG PARLAY EST.</span>
                      <span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: "#FFD700" }}>{combinedOdds ?? "—"}</span>
                    </div>
                    <button
                      style={{ width: "100%", padding: "10px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: "rgba(83,211,55,0.12)", border: "1px solid rgba(83,211,55,0.35)", color: "#53D337" }}
                      onClick={() => { setParlayOpen(false); setActiveTab("bet"); }}
                    >
                      🎯 Place This Parlay →
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px" }}>
            <button
              style={{ flex: 1, background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)", borderRadius: 8, padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit" }}
              onClick={() => setParlayOpen((o: boolean) => !o)}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FFD700" }}>🎰 PARLAY BUILDER</span>
              <span style={{ background: "#FFD700", color: "#000", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{parlay.length}</span>
              {combinedOdds && <span style={{ marginLeft: "auto", fontSize: 13, color: "#FFD700", fontWeight: 800 }}>{combinedOdds}</span>}
              <span style={{ fontSize: 11, color: "#888", marginLeft: combinedOdds ? 0 : "auto" }}>{parlayOpen ? "▼" : "▲"}</span>
            </button>
            {parlay.length > 0 && (
              <button style={{ background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.3)", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontSize: 11, color: "#FF5252", fontWeight: 700, fontFamily: "inherit" }} onClick={() => { setParlay([]); setParlayOpen(false); }}>Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ textAlign: "center", padding: "12px", background: "#07070C", fontSize: 9, color: "#888", letterSpacing: 1 }}>
        ⚠️ INFORMATIONAL &amp; ENTERTAINMENT PURPOSES ONLY — NOT FINANCIAL ADVICE — CONFIRM ODDS ON YOUR SPORTSBOOK
        <br />SOURCES: Covers.com · THE BAT X · DraftKings · Baseball-Reference · StatMuse · Statcast
      </footer>
    </div>
  );
}
