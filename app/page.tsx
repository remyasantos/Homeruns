"use client";
import { useState, useMemo, useEffect, useCallback } from "react";

// ─── STATIC CONFIG — never touches data.js ───────────────────────────────────
const TIER_CONFIG = {
  S: { label: "S-TIER",   color: "#FFD700", bg: "rgba(255,215,0,0.12)",   border: "#FFD700",  desc: "Elite HR Targets — highest probability" },
  A: { label: "A-TIER",   color: "#00E5FF", bg: "rgba(0,229,255,0.08)",   border: "#00E5FF",  desc: "Strong Plays — solid HR potential" },
  B: { label: "B-TIER",   color: "#76FF03", bg: "rgba(118,255,3,0.07)",   border: "#76FF03",  desc: "Value Plays — good odds vs probability" },
  C: { label: "LONGSHOT", color: "#FF6D00", bg: "rgba(255,109,0,0.08)",   border: "#FF6D00",  desc: "High Risk, High Reward" },
} as const;

const GRADE_ORDER = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","F"] as const;

// Derive a 1-100 edge score from matchupGrade so the broken-page UI features work
// without requiring those fields in data.js
function gradeToEdge(grade: string): number {
  const idx = GRADE_ORDER.indexOf(grade as typeof GRADE_ORDER[number]);
  if (idx === -1) return 40;
  // A+ → 97, A → 90, A- → 85, B+ → 80 … F → 20
  return Math.max(20, 97 - idx * 7);
}

// Derive a rough HR probability % from matchupGrade + tier
function gradeToHrProb(grade: string, tier: string): number {
  const base = gradeToEdge(grade);
  const tierBonus = tier === "S" ? 6 : tier === "A" ? 3 : tier === "B" ? 1 : 0;
  return Math.min(22, Math.max(4, Math.round((base / 100) * 18) + tierBonus));
}

function gradeColor(g = "") {
  if (g.startsWith("A")) return "#FFD700";
  if (g.startsWith("B")) return "#76FF03";
  if (g.startsWith("C")) return "#FF9800";
  return "#FF5252";
}

function oddsToNum(odds: string): number {
  const n = parseInt(odds.replace("+","").replace(",",""), 10);
  return isNaN(n) ? 400 : n;
}

// ─── DATA TYPES ───────────────────────────────────────────────────────────────
interface Player {
  id: number;
  name: string;
  team: string;
  tier: string;
  park: string;
  pitcher: string;
  pitcherNote: string;
  matchupGrade: string;
  estOdds: string;
  note: string;
  tags: string[];
  // derived
  edgeScore: number;
  hrProb: number;
  oddsNum: number;
  isLongshot: boolean;
}

interface Parlay {
  id: string;
  legs: number;
  label: string;
  risk: string;
  riskColor: string;
  estPayout: string;
  description: string;
  playerIds: number[];
  strategy: string;
}

interface SlateData {
  slateDate: string;
  slateLabel: string;
  contextCards: { icon: string; label: string; note: string; sub: string }[];
  parkFactors: Record<string, { rank: number; label: string; color: string }>;
  players: Player[];
  parlays: Parlay[];
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function EdgeBadge({ score }: { score: number }) {
  const color = score >= 85 ? "#FFD700" : score >= 70 ? "#76FF03" : "#FF9800";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 3,
      background: `${color}18`, border: `1px solid ${color}40`,
      borderRadius: 6, padding: "2px 7px", fontSize: 11, fontWeight: 700, color,
      whiteSpace: "nowrap",
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
      onClick={() => setExpanded(e => !e)}
    >
      {/* Row 1: Tier badge / Name / Team / Odds */}
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

      {/* Row 2: Park / Pitcher / Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#aaa" }}>{player.park}</span>
        {parkLabel && <span style={{ fontSize: 10, color: "#555" }}>· {parkLabel}</span>}
        <span style={{ fontSize: 11, color: "#777" }}>vs {player.pitcher}</span>
        <MuBadge grade={player.matchupGrade} />
        <EdgeBadge score={player.edgeScore} />
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#aaa", whiteSpace: "nowrap" }}>
          <span style={{ color: "#76FF03", fontWeight: 700 }}>{player.hrProb}%</span> HR est.
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
          <p style={{ fontSize: 12, color: "#bbb", lineHeight: 1.6, margin: "0 0 6px" }}>
            💡 <em>{player.note}</em>
          </p>
          {player.pitcherNote && (
            <p style={{ fontSize: 11, color: "#666", lineHeight: 1.5, margin: "0 0 8px" }}>
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
              <div style={{ color: "#666", marginBottom: 2 }}>MU Grade</div>
              <div style={{ color: gradeColor(player.matchupGrade), fontWeight: 700 }}>{player.matchupGrade}</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11 }}>
              <div style={{ color: "#666", marginBottom: 2 }}>Edge Score</div>
              <div style={{ color: "#FFD700", fontWeight: 700 }}>{player.edgeScore}/100</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11 }}>
              <div style={{ color: "#666", marginBottom: 2 }}>Est. HR %</div>
              <div style={{ color: "#76FF03", fontWeight: 700 }}>{player.hrProb}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Row 3: CTA + toggle hint */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <button
          style={{
            background: inParlay ? tc.color : "transparent",
            border: `1px solid ${tc.color}`,
            borderRadius: 6, padding: "5px 14px", fontSize: 11,
            color: inParlay ? "#000" : tc.color, fontWeight: 700, cursor: "pointer",
            transition: "all 0.15s",
          }}
          onClick={e => { e.stopPropagation(); onToggle(); }}
        >
          {inParlay ? "✓ In Parlay" : "+ Add to Parlay"}
        </button>
        <span style={{ fontSize: 10, color: "#555" }}>{expanded ? "▲ collapse" : "▼ details"}</span>
      </div>
    </div>
  );
}

function ParlayBuiltCard({
  parlay, playerMap, isOpen, onToggle,
}: {
  parlay: Parlay; playerMap: Record<number, Player>; isOpen: boolean; onToggle: () => void;
}) {
  const legPlayers = parlay.playerIds.map(id => playerMap[id]).filter(Boolean);
  const missingIds = parlay.playerIds.filter(id => !playerMap[id]);
  const riskColor =
    parlay.risk === "Lower Risk" ? "#76FF03" :
    parlay.risk === "Medium Risk" ? "#FFD700" :
    parlay.risk === "High Risk" ? "#FF9800" : "#FF5252";

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
        <span style={{ fontSize: 11, color: "#555" }}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {missingIds.length > 0 && (
        <div style={{ fontSize: 10, color: "#FF5252", marginTop: 6 }}>
          ⚠ {missingIds.length} player id{missingIds.length > 1 ? "s" : ""} not found: {missingIds.join(", ")}
        </div>
      )}

      {isOpen && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 11, color: "#aaa", margin: "0 0 10px", lineHeight: 1.6 }}>{parlay.description}</p>
          {parlay.strategy && (
            <p style={{ fontSize: 11, color: "#666", margin: "0 0 10px", lineHeight: 1.6 }}>
              <span style={{ color: "#FFD700", fontWeight: 700 }}>STRATEGY: </span>{parlay.strategy}
            </p>
          )}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {legPlayers.map(p => {
              const tc = TIER_CONFIG[p.tier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.C;
              return (
                <span key={p.id} style={{
                  fontSize: 10, color: tc.color,
                  background: tc.bg, padding: "2px 8px",
                  borderRadius: 10, border: `1px solid ${tc.color}40`,
                }}>{p.name.split(" ").at(-1)}</span>
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
  // ── State: loaded data
  const [slateDate,    setSlateDate]    = useState("...");
  const [slateLabel,   setSlateLabel]   = useState("");
  const [contextCards, setContextCards] = useState<SlateData["contextCards"]>([]);
  const [parkFactors,  setParkFactors]  = useState<SlateData["parkFactors"]>({});
  const [players,      setPlayers]      = useState<Player[]>([]);
  const [parlays,      setParlays]      = useState<Parlay[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [dataError,    setDataError]    = useState<string | null>(null);

  // ── State: UI
  const [activeTab,   setActiveTab]   = useState<"picks"|"parlays"|"longshots">("picks");
  const [tierFilter,  setTierFilter]  = useState("ALL");
  const [sortBy,      setSortBy]      = useState<"edge"|"prob"|"odds">("edge");
  const [parlay,      setParlay]      = useState<number[]>([]);
  const [parlayOpen,  setParlayOpen]  = useState(false);
  const [openParlay,  setOpenParlay]  = useState<string | null>(null);

  // ── Fetch data.js from public/
  useEffect(() => {
    fetch("/data.js")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} — is public/data.js in your repo?`);
        return r.text();
      })
      .then(text => {
        // Execute the JS in a sandboxed scope
        // eslint-disable-next-line no-new-func
        const fn = new Function(`
          ${text}
          return { SLATE_DATE, SLATE_LABEL, CONTEXT_CARDS, PARK_FACTORS, players, parlays };
        `);
        const raw = fn();

        // Hydrate derived fields into each player
        const hydrated: Player[] = (raw.players as Player[]).map((p: Player) => ({
          ...p,
          edgeScore:  gradeToEdge(p.matchupGrade),
          hrProb:     gradeToHrProb(p.matchupGrade, p.tier),
          oddsNum:    oddsToNum(p.estOdds),
          isLongshot: p.tier === "C",
        }));

        setSlateDate(raw.SLATE_DATE);
        setSlateLabel(raw.SLATE_LABEL);
        setContextCards(raw.CONTEXT_CARDS);
        setParkFactors(raw.PARK_FACTORS);
        setPlayers(hydrated);
        setParlays(raw.parlays);
        setLoading(false);
      })
      .catch(err => {
        setDataError(err.message);
        setLoading(false);
      });
  }, []);

  // ── Derived
  const playerMap = useMemo(() => Object.fromEntries(players.map(p => [p.id, p])), [players]);

  const mainPlayers = useMemo(() => players.filter(p => p.tier !== "C"), [players]);
  const longshotPlayers = useMemo(() => players.filter(p => p.tier === "C"), [players]);

  const filteredPlayers = useMemo(() => {
    let p = mainPlayers;
    if (tierFilter !== "ALL") p = p.filter(pl => pl.tier === tierFilter);
    if (sortBy === "edge")  p = [...p].sort((a, b) => b.edgeScore - a.edgeScore);
    if (sortBy === "prob")  p = [...p].sort((a, b) => b.hrProb   - a.hrProb);
    if (sortBy === "odds")  p = [...p].sort((a, b) => b.oddsNum  - a.oddsNum);
    return p;
  }, [mainPlayers, tierFilter, sortBy]);

  const topPicks = useMemo(() =>
    players.filter(p => p.tier === "S").sort((a, b) => b.edgeScore - a.edgeScore).slice(0, 5),
  [players]);

  const parlayPlayers = useMemo(() => players.filter(p => parlay.includes(p.id)), [parlay, players]);

  const combinedOdds = useMemo(() => {
    if (parlayPlayers.length < 2) return null;
    const dec = parlayPlayers.map(p => p.oddsNum > 0 ? p.oddsNum / 100 + 1 : 100 / Math.abs(p.oddsNum) + 1);
    const combined = dec.reduce((a, b) => a * b, 1);
    return `+${Math.round((combined - 1) * 100).toLocaleString()}`;
  }, [parlayPlayers]);

  const toggleParlay = useCallback((id: number) => {
    setParlay(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  // ── Stat counts (live from data)
  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = { S: 0, A: 0, B: 0, C: 0 };
    players.forEach(p => { if (p.tier in counts) counts[p.tier]++; });
    return counts;
  }, [players]);

  // ── Style helpers
  const tabStyle = (t: string) => ({
    padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700 as const,
    cursor: "pointer", transition: "all 0.15s",
    background: activeTab === t ? "#FFD700" : "rgba(255,255,255,0.05)",
    color: activeTab === t ? "#000" : "#aaa",
    border: activeTab === t ? "none" : "1px solid rgba(255,255,255,0.1)",
    fontFamily: "inherit",
  });

  const filterBtnStyle = (active: boolean, color = "#FFD700") => ({
    padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700 as const,
    cursor: "pointer",
    background: active ? `${color}20` : "rgba(255,255,255,0.04)",
    color: active ? color : "#666",
    border: `1px solid ${active ? color + "50" : "rgba(255,255,255,0.08)"}`,
    transition: "all 0.15s", fontFamily: "inherit",
  });

  // ── Loading / error screens
  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0F", color: "#555",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Mono', monospace", letterSpacing: 3, fontSize: 13,
    }}>
      LOADING SLATE DATA...
    </div>
  );

  if (dataError) return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0F", color: "#FF5252",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 12, fontFamily: "'DM Mono', monospace", padding: 24,
    }}>
      <div style={{ letterSpacing: 3, fontSize: 13 }}>⚠ FAILED TO LOAD DATA</div>
      <div style={{ fontSize: 11, color: "#666", textAlign: "center", maxWidth: 400 }}>{dataError}</div>
      <div style={{ fontSize: 10, color: "#444" }}>Make sure <code>public/data.js</code> exists in your repo.</div>
    </div>
  );

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0F", color: "#F0F0F0",
      fontFamily: "'DM Mono', 'Courier New', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A0F; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .parlay-sticky { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; }
        @media (max-width: 600px) {
          .hero-title { font-size: 36px !important; }
          .stat-row { gap: 12px !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(180deg, #111118 0%, #0A0A0F 100%)",
        borderBottom: "1px solid rgba(255,215,0,0.15)",
        padding: "32px 16px 24px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
          width: 400, height: 200, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,215,0,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#FFD70080", fontWeight: 700, marginBottom: 10 }}>
          ◆ SHARP STACKING SYSTEM ◆ {slateDate} ◆ {slateLabel}
        </div>
        <h1 className="hero-title" style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 52, letterSpacing: 3, color: "#FFD700",
          lineHeight: 1, marginBottom: 8,
        }}>
          Daily MLB Home Run Picks
        </h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
          Data-driven picks using matchup grades, park factors &amp; pitcher tendencies
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          {["✅ Updated Daily","📊 Statcast Data","🔢 Edge Score /100"].map(s => (
            <span key={s} style={{ fontSize: 10, color: "#FFD700", background: "rgba(255,215,0,0.08)", padding: "3px 10px", borderRadius: 10, border: "1px solid rgba(255,215,0,0.2)" }}>{s}</span>
          ))}
        </div>

        {/* Live stat counts from data */}
        <div className="stat-row" style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
          {([
            { label: "S-TIER",    val: tierCounts.S, color: "#FFD700" },
            { label: "A-TIER",    val: tierCounts.A, color: "#00E5FF" },
            { label: "B-TIER",    val: tierCounts.B, color: "#76FF03" },
            { label: "LONGSHOTS", val: tierCounts.C, color: "#FF6D00" },
            { label: "PARLAYS",   val: parlays.length, color: "#FF80AB" },
          ] as const).map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "#555", letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOP PICKS BANNER ── */}
      <div style={{ background: "rgba(255,215,0,0.04)", borderBottom: "1px solid rgba(255,215,0,0.1)", padding: "16px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#FFD700", fontWeight: 900, marginBottom: 10 }}>🏆 BEST HR BETS TODAY — TOP S-TIER PICKS</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {topPicks.map(p => (
              <div key={p.id} style={{
                background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)",
                borderRadius: 10, padding: "10px 14px", minWidth: 130, flex: "0 0 auto",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#FFD700", marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{p.team} · {p.estOdds}</div>
                <div style={{ fontSize: 10, color: "#76FF03", marginTop: 4 }}>Edge {p.edgeScore}/100</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTEXT CARDS ── */}
      {contextCards.length > 0 && (
        <div style={{ background: "rgba(255,140,0,0.03)", borderBottom: "1px solid rgba(255,140,0,0.12)", padding: "14px 16px" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#FF9800", fontWeight: 900, marginBottom: 10 }}>📍 TODAY'S KEY CONTEXTS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {contextCards.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#e8e8e8" }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: "#FF9800", marginTop: 1 }}>{c.note}</div>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "16px 12px 130px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <button style={tabStyle("picks")}     onClick={() => setActiveTab("picks")}>📊 All Picks</button>
          <button style={tabStyle("parlays")}   onClick={() => setActiveTab("parlays")}>🎰 Parlays</button>
          <button style={tabStyle("longshots")} onClick={() => setActiveTab("longshots")}>💎 Longshots</button>
        </div>

        {/* ── PICKS TAB ── */}
        {activeTab === "picks" && (
          <>
            {/* Filters */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 8 }}>FILTER BY TIER</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {(["ALL","S","A","B"] as const).map(t => (
                  <button key={t} style={filterBtnStyle(tierFilter === t, t === "S" ? "#FFD700" : t === "A" ? "#00E5FF" : t === "B" ? "#76FF03" : "#aaa")}
                    onClick={() => setTierFilter(t)}>
                    {t === "ALL" ? "All" : TIER_CONFIG[t].label}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 8 }}>SORT BY</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {([["edge","Edge Score"],["prob","HR Prob"],["odds","Best Odds"]] as const).map(([v,l]) => (
                  <button key={v} style={filterBtnStyle(sortBy === v, "#00E5FF")} onClick={() => setSortBy(v)}>{l}</button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 10, color: "#444", letterSpacing: 1, marginBottom: 10 }}>
              {filteredPlayers.length} players — tap any card for details · click "+ Add to Parlay" to build your ticket
            </div>

            {/* Tier sections */}
            {(["S","A","B"] as const).filter(t => tierFilter === "ALL" || tierFilter === t).map(tier => {
              const tc = TIER_CONFIG[tier];
              const tieredPlayers = filteredPlayers.filter(p => p.tier === tier);
              if (!tieredPlayers.length) return null;
              return (
                <div key={tier} style={{ marginBottom: 20 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
                    paddingBottom: 8, borderBottom: `1px solid ${tc.color}25`,
                  }}>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: tc.color, letterSpacing: 2 }}>{tc.label}</span>
                    <span style={{ fontSize: 10, color: "#555" }}>— {tc.desc}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "#444" }}>{tieredPlayers.length}</span>
                  </div>
                  {tieredPlayers.map(p => (
                    <PlayerCard
                      key={p.id}
                      player={p}
                      inParlay={parlay.includes(p.id)}
                      onToggle={() => toggleParlay(p.id)}
                      parkLabel={parkFactors[p.park]?.label}
                    />
                  ))}
                </div>
              );
            })}
          </>
        )}

        {/* ── PARLAYS TAB ── */}
        {activeTab === "parlays" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: "#FFD700", letterSpacing: 2, marginBottom: 4 }}>SHARP PARLAYS</h2>
              <p style={{ fontSize: 11, color: "#666" }}>Pre-built combinations from today's slate — tap to expand strategy</p>
            </div>
            {parlays.map(p => (
              <ParlayBuiltCard
                key={p.id}
                parlay={p}
                playerMap={playerMap}
                isOpen={openParlay === p.id}
                onToggle={() => setOpenParlay(prev => prev === p.id ? null : p.id)}
              />
            ))}
          </div>
        )}

        {/* ── LONGSHOTS TAB ── */}
        {activeTab === "longshots" && (
          <div>
            <div style={{
              background: "rgba(255,109,0,0.06)", border: "1px solid rgba(255,109,0,0.2)",
              borderRadius: 12, padding: 14, marginBottom: 16,
            }}>
              <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: "#FF6D00", letterSpacing: 2, marginBottom: 4 }}>
                💎 LONGSHOTS — HIGH RISK, HIGH REWARD
              </h2>
              <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6 }}>
                C-tier players with real HR upside — favorable parks, overlooked matchups, or hot streaks. Ideal as tail legs on big parlays. {longshotPlayers.length} available today.
              </p>
            </div>
            {longshotPlayers.map(p => (
              <PlayerCard
                key={p.id}
                player={p}
                inParlay={parlay.includes(p.id)}
                onToggle={() => toggleParlay(p.id)}
                parkLabel={parkFactors[p.park]?.label}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── STICKY PARLAY BUILDER ── */}
      <div className="parlay-sticky">
        <div style={{ background: "#111118", borderTop: "1px solid rgba(255,215,0,0.25)" }}>
          {parlayOpen && (
            <div style={{ background: "#13131A", maxHeight: "55vh", overflowY: "auto", padding: "16px" }}>
              <div style={{ maxWidth: 700, margin: "0 auto" }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#FFD700", marginBottom: 12 }}>YOUR PARLAY BUILDER</div>
                {parlayPlayers.length === 0 ? (
                  <p style={{ fontSize: 12, color: "#555", textAlign: "center", padding: "20px 0" }}>
                    Add players from the picks tab to build your parlay
                  </p>
                ) : (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                      {parlayPlayers.map(p => (
                        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px" }}>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                          <span style={{ fontSize: 11, color: "#888" }}>{p.team}</span>
                          <span style={{ fontSize: 13, color: "#FFD700", fontWeight: 700 }}>{p.estOdds}</span>
                          <button
                            style={{ background: "rgba(255,82,82,0.15)", border: "1px solid rgba(255,82,82,0.3)", borderRadius: 4, padding: "2px 8px", fontSize: 11, color: "#FF5252", cursor: "pointer", fontFamily: "inherit" }}
                            onClick={() => toggleParlay(p.id)}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(255,215,0,0.06)", borderRadius: 8, padding: "10px 14px" }}>
                      <span style={{ fontSize: 11, color: "#888", flex: 1 }}>{parlayPlayers.length}-LEG PARLAY EST.</span>
                      <span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: "#FFD700" }}>{combinedOdds ?? "—"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px" }}>
            <button
              style={{
                flex: 1, background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)",
                borderRadius: 8, padding: "10px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit",
              }}
              onClick={() => setParlayOpen(o => !o)}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FFD700" }}>🎰 PARLAY BUILDER</span>
              <span style={{ background: "#FFD700", color: "#000", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{parlay.length}</span>
              {combinedOdds && <span style={{ marginLeft: "auto", fontSize: 13, color: "#FFD700", fontWeight: 800 }}>{combinedOdds}</span>}
              <span style={{ fontSize: 11, color: "#555", marginLeft: combinedOdds ? 0 : "auto" }}>{parlayOpen ? "▼" : "▲"}</span>
            </button>
            {parlay.length > 0 && (
              <button
                style={{ background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.3)", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontSize: 11, color: "#FF5252", fontWeight: 700, fontFamily: "inherit" }}
                onClick={() => { setParlay([]); setParlayOpen(false); }}
              >Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ textAlign: "center", padding: "12px", background: "#07070C", fontSize: 9, color: "#333", letterSpacing: 1 }}>
        ⚠️ INFORMATIONAL &amp; ENTERTAINMENT PURPOSES ONLY — NOT FINANCIAL ADVICE — CONFIRM ODDS ON YOUR SPORTSBOOK
        <br />SOURCES: Covers.com · THE BAT X · DraftKings · Baseball-Reference · StatMuse · Statcast
      </div>
    </div>
  );
}
