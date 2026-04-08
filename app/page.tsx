"use client";
import { useState, useMemo, useEffect } from "react";

// ── STATIC CONFIG (never changes day-to-day) ──────────────────
const TIERS = {
  S: { label: "S-TIER", color: "#ff4444", bg: "rgba(255,68,68,0.15)",   border: "#ff4444" },
  A: { label: "A-TIER", color: "#ff8c00", bg: "rgba(255,140,0,0.12)",   border: "#ff8c00" },
  B: { label: "B-TIER", color: "#ffd700", bg: "rgba(255,215,0,0.10)",   border: "#ffd700" },
  C: { label: "C-TIER", color: "#7ec8e3", bg: "rgba(126,200,227,0.10)", border: "#7ec8e3" },
};

function gradeColor(g = "") {
  if (g.startsWith("A")) return "#4caf50";
  if (g.startsWith("B")) return "#ffd700";
  if (g.startsWith("C")) return "#ff8c00";
  return "#ff4444";
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "255,255,255";
}

const GRADE_ORDER = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","F"];

// ── SUBCOMPONENTS ─────────────────────────────────────────────

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, #ff4444, transparent)" }} />
        <div style={{ fontSize: "10px", color: "#ff4444", letterSpacing: "3px", fontWeight: "bold" }}>{title}</div>
        <div style={{ height: "1px", flex: 1, background: "linear-gradient(270deg, #ff4444, transparent)" }} />
      </div>
      {sub && <div style={{ fontSize: "10px", color: "#555", textAlign: "center", marginTop: "4px", letterSpacing: "1px" }}>{sub}</div>}
    </div>
  );
}

function ContextCard({ icon, label, note, sub }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <div style={{ fontSize: "22px", lineHeight: 1, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: "bold", fontSize: "12px", color: "#e8e8e8" }}>{label}</div>
        <div style={{ fontSize: "11px", color: "#ff8c00", marginTop: "2px" }}>{note}</div>
        <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>{sub}</div>
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, color = "#ff8c00", children }) {
  return (
    <button onClick={onClick} style={{
      background: active ? color : "rgba(255,255,255,0.04)",
      border: `1px solid ${active ? color : "#2a2a2a"}`,
      color: active ? (color === "#ffd700" ? "#000" : "#fff") : "#666",
      padding: "4px 12px",
      borderRadius: "4px",
      fontSize: "11px",
      cursor: "pointer",
      fontWeight: "bold",
      letterSpacing: "0.5px",
      transition: "all 0.15s",
      fontFamily: "inherit",
      lineHeight: 1.4,
    }}>{children}</button>
  );
}

function ParlayCard({ parlay, playerMap, parkFactors, isOpen, onToggle }) {
  const legPlayers = parlay.playerIds.map(id => playerMap[id]).filter(Boolean);
  const missingIds = parlay.playerIds.filter(id => !playerMap[id]);

  return (
    <div style={{
      border: `1px solid ${isOpen ? parlay.riskColor : "#252525"}`,
      borderRadius: "8px",
      background: isOpen ? `rgba(${hexToRgb(parlay.riskColor)},0.04)` : "rgba(255,255,255,0.015)",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      <div onClick={onToggle} style={{
        padding: "14px 18px", cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "44px 1fr auto 24px",
        gap: "14px", alignItems: "center",
        userSelect: "none",
      }}>
        <div style={{
          background: parlay.riskColor, borderRadius: "5px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: "bold", color: "#fff",
          height: "32px", width: "44px", flexShrink: 0, letterSpacing: "0.5px",
        }}>{parlay.id}</div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "5px" }}>
            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#e8e8e8" }}>{parlay.label}</span>
            <span style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid #333",
              color: "#666", padding: "1px 8px", borderRadius: "3px", fontSize: "10px", letterSpacing: "1px",
            }}>{parlay.legs}-LEG</span>
            <span style={{
              background: `rgba(${hexToRgb(parlay.riskColor)},0.15)`,
              border: `1px solid ${parlay.riskColor}`,
              color: parlay.riskColor, padding: "1px 8px", borderRadius: "3px", fontSize: "10px", letterSpacing: "1px",
            }}>{parlay.risk}</span>
            {missingIds.length > 0 && (
              <span style={{ fontSize: "10px", color: "#ff4444", background: "rgba(255,68,68,0.1)", border: "1px solid #ff4444", padding: "1px 6px", borderRadius: "3px" }}>
                ⚠ {missingIds.length} invalid id{missingIds.length > 1 ? "s" : ""}: {missingIds.join(",")}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "4px" }}>
            {legPlayers.map(p => {
              const tier = TIERS[p.tier] || TIERS.C;
              return (
                <span key={p.id} style={{
                  background: tier.bg, border: `1px solid ${tier.border}`,
                  color: tier.color, padding: "2px 7px", borderRadius: "3px",
                  fontSize: "11px", fontWeight: "600",
                }}>{p.name.split(" ").slice(-1)[0]}</span>
              );
            })}
          </div>
          <div style={{ fontSize: "11px", color: "#555" }}>{parlay.description}</div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "9px", color: "#444", letterSpacing: "1px", marginBottom: "2px" }}>EST. PAYOUT</div>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ff8c00", lineHeight: 1 }}>{parlay.estPayout}</div>
        </div>

        <div style={{ color: "#444", fontSize: "12px", textAlign: "center" }}>{isOpen ? "▲" : "▼"}</div>
      </div>

      {isOpen && (
        <div style={{ borderTop: "1px solid #1e1e1e", padding: "16px 18px" }}>
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid #252525",
            borderRadius: "6px", padding: "10px 14px", marginBottom: "14px",
            fontSize: "12px", color: "#aaa", lineHeight: 1.6,
          }}>
            <span style={{ color: "#ff8c00", fontWeight: "bold", letterSpacing: "1px" }}>STRATEGY: </span>
            {parlay.strategy}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {legPlayers.map((p, i) => {
              const tier = TIERS[p.tier] || TIERS.C;
              const park = parkFactors[p.park];
              const gc   = gradeColor(p.matchupGrade);
              return (
                <div key={p.id} style={{
                  display: "grid", gridTemplateColumns: "22px 1fr auto",
                  gap: "12px", alignItems: "start",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "6px",
                }}>
                  <div style={{ color: "#444", fontSize: "11px", fontWeight: "bold", paddingTop: "2px" }}>{i + 1}</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: "bold", color: "#e8e8e8" }}>{p.name}</span>
                      <span style={{ color: "#555", fontSize: "11px" }}>{p.team}</span>
                      <span style={{
                        background: tier.bg, border: `1px solid ${tier.border}`,
                        color: tier.color, padding: "1px 6px", borderRadius: "2px",
                        fontSize: "9px", letterSpacing: "1px",
                      }}>{tier.label}</span>
                      {park && <span style={{ fontSize: "10px", color: "#777" }}>{park.label}</span>}
                    </div>
                    <div style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>
                      vs <span style={{ color: "#aaa" }}>{p.pitcher}</span>
                      <span style={{ color: "#444" }}> — {p.pitcherNote}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "4px", lineHeight: 1.5 }}>{p.note}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "9px", color: "#444", marginBottom: "2px" }}>ODDS</div>
                    <div style={{ color: "#ff8c00", fontWeight: "bold", fontSize: "15px" }}>{p.estOdds}</div>
                    <div style={{ marginTop: "4px", color: gc, fontSize: "12px", fontWeight: "bold" }}>MU: {p.matchupGrade}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  // ── Daily data loaded from /data.js ──
  const [slateDate,    setSlateDate]    = useState("");
  const [slateLabel,   setSlateLabel]   = useState("");
  const [contextCards, setContextCards] = useState([]);
  const [parkFactors,  setParkFactors]  = useState({});
  const [players,      setPlayers]      = useState([]);
  const [parlays,      setParlays]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [dataError,    setDataError]    = useState(null);

  useEffect(() => {
    fetch("/data.js")
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load data.js (${r.status})`);
        return r.text();
      })
      .then(text => {
        // Execute the JS module in a sandboxed scope and extract the exports
        // eslint-disable-next-line no-new-func
        const fn = new Function(`
          ${text}
          return { SLATE_DATE, SLATE_LABEL, CONTEXT_CARDS, PARK_FACTORS, players, parlays };
        `);
        const data = fn();
        setSlateDate(data.SLATE_DATE);
        setSlateLabel(data.SLATE_LABEL);
        setContextCards(data.CONTEXT_CARDS);
        setParkFactors(data.PARK_FACTORS);
        setPlayers(data.players);
        setParlays(data.parlays);
        setLoading(false);
      })
      .catch(err => {
        setDataError(err.message);
        setLoading(false);
      });
  }, []);

  // ── Filter state ──
  const [tierFilter,    setTierFilter]    = useState("ALL");
  const [gradeFilter,   setGradeFilter]   = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [legFilter,     setLegFilter]     = useState("ALL");
  const [activeParlay,  setActiveParlay]  = useState(null);
  const [parlayMode,    setParlayMode]    = useState("all");

  const toggleTeam  = (team)  => setSelectedTeams(prev => prev.includes(team)  ? prev.filter(t => t !== team)  : [...prev, team]);
  const toggleGrade = (grade) => setGradeFilter(prev   => prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]);
  const clearAll    = ()      => { setTierFilter("ALL"); setGradeFilter([]); setSelectedTeams([]); };

  const filtersActive = tierFilter !== "ALL" || gradeFilter.length > 0 || selectedTeams.length > 0;

  // Derived from loaded data
  const playerMap       = useMemo(() => Object.fromEntries(players.map(p => [p.id, p])), [players]);
  const TEAMS_IN_SLATE  = useMemo(() => [...new Set(players.map(p => p.team))].sort(), [players]);
  const GRADES_IN_SLATE = useMemo(() => GRADE_ORDER.filter(g => players.some(p => p.matchupGrade === g)), [players]);

  const filteredCandidates = useMemo(() => players.filter(p => {
    const okTier  = tierFilter === "ALL" || p.tier === tierFilter;
    const okGrade = gradeFilter.length === 0 || gradeFilter.includes(p.matchupGrade);
    const okTeam  = selectedTeams.length === 0 || selectedTeams.includes(p.team);
    return okTier && okGrade && okTeam;
  }), [players, tierFilter, gradeFilter, selectedTeams]);

  const allowedIds = useMemo(() => new Set(filteredCandidates.map(p => p.id)), [filteredCandidates]);

  const filteredParlays = useMemo(() => parlays.filter(p => {
    const legCount = parseInt(legFilter);
    const okLegs = legFilter === "ALL" ? true : legFilter === "9+" ? p.legs >= 9 : p.legs === legCount;
    if (!okLegs) return false;
    if (parlayMode === "smart" && filtersActive) return p.playerIds.every(id => allowedIds.has(id));
    return true;
  }), [parlays, legFilter, parlayMode, allowedIds, filtersActive]);

  const sTierCount = filteredCandidates.filter(p => p.tier === "S").length;
  const aTierCount = filteredCandidates.filter(p => p.tier === "A").length;
  const bestPark   = [...filteredCandidates]
    .map(p => parkFactors[p.park]).filter(Boolean)
    .sort((a, b) => a.rank - b.rank)[0];

  // ── Loading / error states ──
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#444", fontFamily: "'Courier New', Consolas, monospace", display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "3px", fontSize: "12px" }}>
      LOADING SLATE DATA...
    </div>
  );

  if (dataError) return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#ff4444", fontFamily: "'Courier New', Consolas, monospace", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
      <div style={{ letterSpacing: "3px", fontSize: "12px" }}>⚠ FAILED TO LOAD DATA</div>
      <div style={{ fontSize: "11px", color: "#555" }}>{dataError}</div>
      <div style={{ fontSize: "10px", color: "#333" }}>Make sure /public/data.js exists in your repo.</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#e0e0e0", fontFamily: "'Courier New', Consolas, monospace" }}>

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <div style={{
        background: "linear-gradient(160deg, #0d0d1c 0%, #170808 60%, #080d18 100%)",
        borderBottom: "2px solid #ff4444",
        padding: "28px 40px 22px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(255,68,68,0.025) 22px, rgba(255,68,68,0.025) 23px)",
        }} />
        <div style={{ position: "relative", maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ fontSize: "10px", color: "#ff4444", letterSpacing: "4px", marginBottom: "12px", opacity: 0.85 }}>
            ◆ SHARP STACKING SYSTEM ◆ {slateDate} ◆ {slateLabel}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: "900", margin: "0 0 6px", letterSpacing: "-1px", lineHeight: 1 }}>
                <span style={{ color: "#ff4444" }}>HR PARLAY</span>{" "}
                <span style={{ color: "#e8e8e8" }}>BOARD</span>
              </h1>
              <div style={{ fontSize: "10px", color: "#444", letterSpacing: "2px" }}>
                HOME RUN PROP RESEARCH · INFORMATIONAL ONLY
              </div>
            </div>

            <div style={{
              display: "flex", gap: "0",
              border: "1px solid #1e1e1e", borderRadius: "6px", overflow: "hidden",
              background: "rgba(0,0,0,0.5)", flexShrink: 0,
            }}>
              {[
                { label: "CANDIDATES", val: filteredCandidates.length, col: "#e8e8e8" },
                { label: "S-TIER",     val: sTierCount,                col: "#ff4444" },
                { label: "A-TIER",     val: aTierCount,                col: "#ff8c00" },
                { label: "PARLAYS",    val: filteredParlays.length,    col: "#ffd700" },
                { label: "BEST PARK",  val: bestPark ? `#${bestPark.rank}` : "—", col: "#90e0ef" },
              ].map((s, i, arr) => (
                <div key={s.label} style={{
                  padding: "10px 20px", textAlign: "center",
                  borderRight: i < arr.length - 1 ? "1px solid #1a1a1a" : "none",
                  minWidth: "70px",
                }}>
                  <div style={{ fontSize: "8px", color: "#3a3a3a", letterSpacing: "2px", marginBottom: "4px" }}>{s.label}</div>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: s.col, lineHeight: 1 }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════ */}
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "24px 32px 56px" }}>

        {/* ── FILTER PANEL ─────────────────────────────── */}
        <div style={{
          background: "rgba(255,255,255,0.015)",
          border: "1px solid #1e1e1e",
          borderRadius: "8px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex", flexDirection: "column", gap: "12px",
        }}>
          <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "2px", minWidth: "28px" }}>TIER</span>
              {["ALL","S","A","B","C"].map(t => (
                <FilterBtn key={t} active={tierFilter === t} onClick={() => setTierFilter(t)}
                  color={t === "S" ? "#ff4444" : t === "A" ? "#ff8c00" : t === "B" ? "#ffd700" : t === "C" ? "#7ec8e3" : "#666"}>
                  {t}
                </FilterBtn>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "2px", whiteSpace: "nowrap" }}>MU GRADE</span>
              <FilterBtn active={gradeFilter.length === 0} onClick={() => setGradeFilter([])} color="#666">ALL</FilterBtn>
              {GRADES_IN_SLATE.map(g => (
                <FilterBtn key={g} active={gradeFilter.includes(g)} onClick={() => toggleGrade(g)} color={gradeColor(g)}>{g}</FilterBtn>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid #181818", paddingTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "2px", minWidth: "28px" }}>TEAM</span>
              <FilterBtn active={selectedTeams.length === 0} onClick={() => setSelectedTeams([])} color="#666">ALL</FilterBtn>
              {TEAMS_IN_SLATE.map(team => (
                <FilterBtn key={team} active={selectedTeams.includes(team)} onClick={() => toggleTeam(team)} color="#4a90d9">{team}</FilterBtn>
              ))}
            </div>
          </div>

          {filtersActive && (
            <div style={{ borderTop: "1px solid #181818", paddingTop: "10px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "1px" }}>ACTIVE:</span>
              {tierFilter !== "ALL" && (
                <span style={{ fontSize: "10px", background: "rgba(255,140,0,0.08)", border: "1px solid #ff8c00", color: "#ff8c00", padding: "2px 8px", borderRadius: "3px" }}>TIER={tierFilter}</span>
              )}
              {gradeFilter.map(g => (
                <span key={g} style={{ fontSize: "10px", background: "rgba(76,175,80,0.08)", border: "1px solid #4caf50", color: "#4caf50", padding: "2px 8px", borderRadius: "3px" }}>MU={g}</span>
              ))}
              {selectedTeams.map(t => (
                <span key={t} style={{ fontSize: "10px", background: "rgba(74,144,217,0.08)", border: "1px solid #4a90d9", color: "#4a90d9", padding: "2px 8px", borderRadius: "3px" }}>{t}</span>
              ))}
              <button onClick={clearAll} style={{
                marginLeft: "auto", fontSize: "10px", color: "#ff4444",
                background: "none", border: "1px solid rgba(255,68,68,0.4)",
                padding: "2px 12px", borderRadius: "3px", cursor: "pointer", fontFamily: "inherit",
              }}>CLEAR ALL ×</button>
            </div>
          )}
        </div>

        {/* ── CONTEXT CARDS ────────────────────────────── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px", marginBottom: "28px",
          background: "rgba(255,140,0,0.03)", border: "1px solid rgba(255,140,0,0.18)",
          borderRadius: "8px", padding: "16px 20px",
        }}>
          {contextCards.map((c, i) => <ContextCard key={i} {...c} />)}
        </div>

        {/* ── CANDIDATES TABLE ─────────────────────────── */}
        <div style={{ marginBottom: "40px" }}>
          <SectionHeader
            title="TARGET CANDIDATES"
            sub={`${filteredCandidates.length} of ${players.length} players${filtersActive ? " · filters active" : ""}`}
          />
          <div style={{ overflowX: "auto", border: "1px solid #1e1e1e", borderRadius: "8px", background: "#0c0c14" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", tableLayout: "fixed", minWidth: "1400px" }}>
              <thead>
                <tr style={{
                  borderBottom: "1px solid #222", background: "#0c0c14",
                  color: "#3a3a3a", textTransform: "uppercase", fontSize: "9px", letterSpacing: "1.5px",
                }}>
                  <th style={{ width: "44px",  padding: "13px 14px", textAlign: "left", fontWeight: "bold" }}>#</th>
                  <th style={{ width: "190px", padding: "13px 14px", textAlign: "left", fontWeight: "bold" }}>Player</th>
                  <th style={{ width: "60px",  padding: "13px 14px", textAlign: "left", fontWeight: "bold" }}>Team</th>
                  <th style={{ width: "96px",  padding: "13px 14px", textAlign: "left", fontWeight: "bold" }}>Tier</th>
                  <th style={{ width: "195px", padding: "13px 14px", textAlign: "left", fontWeight: "bold" }}>Park</th>
                  <th style={{ width: "215px", padding: "13px 14px", textAlign: "left", fontWeight: "bold" }}>Vs. Pitcher</th>
                  <th style={{ width: "54px",  padding: "13px 14px", textAlign: "left", fontWeight: "bold" }}>MU</th>
                  <th style={{ width: "80px",  padding: "13px 14px", textAlign: "left", fontWeight: "bold" }}>~Odds</th>
                  <th style={{                  padding: "13px 14px", textAlign: "left", fontWeight: "bold" }}>Notes / Tags</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: "40px", textAlign: "center", color: "#333", fontSize: "12px", letterSpacing: "1px" }}>
                      NO PLAYERS MATCH CURRENT FILTERS
                    </td>
                  </tr>
                ) : filteredCandidates.map((p, i) => {
                  const tier = TIERS[p.tier] || { bg: "#1a1a1a", color: "#555", label: p.tier, border: "#333" };
                  const park = parkFactors[p.park];
                  const gc   = gradeColor(p.matchupGrade);
                  return (
                    <tr key={p.id} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      background: i % 2 === 0 ? "rgba(255,255,255,0.007)" : "transparent",
                    }}>
                      <td style={{ padding: "14px 14px", color: "#333", fontWeight: "bold", fontSize: "12px" }}>{i + 1}</td>
                      <td style={{ padding: "14px 14px", fontWeight: "700", color: "#e8e8e8", whiteSpace: "nowrap" }}>{p.name}</td>
                      <td style={{ padding: "14px 14px", color: "#666", fontSize: "12px" }}>{p.team}</td>
                      <td style={{ padding: "14px 14px" }}>
                        <span style={{
                          background: tier.bg, border: `1px solid ${tier.border}`,
                          color: tier.color, padding: "3px 8px", borderRadius: "3px",
                          fontSize: "10px", fontWeight: "bold", letterSpacing: "0.5px",
                        }}>{tier.label}</span>
                      </td>
                      <td style={{ padding: "14px 14px", fontSize: "12px" }}>
                        <div style={{ color: "#aaa", whiteSpace: "nowrap" }}>{p.park}</div>
                        {park && <div style={{ fontSize: "10px", color: park.color, marginTop: "2px", opacity: 0.8 }}>{park.label}</div>}
                      </td>
                      <td style={{ padding: "14px 14px", fontSize: "12px" }}>
                        <div style={{ color: "#aaa", whiteSpace: "nowrap" }}>{p.pitcher}</div>
                        <div style={{ color: "#3a3a3a", fontSize: "11px", marginTop: "2px" }}>{p.pitcherNote}</div>
                      </td>
                      <td style={{ padding: "14px 14px" }}>
                        <span style={{ color: gc, fontWeight: "bold", fontSize: "13px" }}>{p.matchupGrade}</span>
                      </td>
                      <td style={{ padding: "14px 14px", color: "#ff8c00", fontWeight: "bold", fontSize: "14px", whiteSpace: "nowrap" }}>{p.estOdds}</td>
                      <td style={{ padding: "14px 14px" }}>
                        <div style={{ fontSize: "12px", color: "#bbb", marginBottom: "6px", lineHeight: 1.5 }}>{p.note}</div>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {p.tags?.map((t, idx) => (
                            <span key={idx} style={{
                              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                              padding: "2px 7px", borderRadius: "3px", fontSize: "10px", color: "#666", whiteSpace: "nowrap",
                            }}>{t}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── PARLAYS ──────────────────────────────────── */}
        <div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "12px", marginBottom: "14px",
            background: "rgba(255,255,255,0.015)", border: "1px solid #1e1e1e",
            borderRadius: "8px", padding: "12px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "2px" }}>LEGS</span>
              {["ALL","4","5","6","7","8","9+","10"].map(f => (
                <FilterBtn key={f} active={legFilter === f} onClick={() => setLegFilter(f)} color="#ff4444">{f}</FilterBtn>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "1px" }}>FILTER MODE</span>
              <div style={{ display: "flex", border: "1px solid #252525", borderRadius: "4px", overflow: "hidden" }}>
                <button onClick={() => setParlayMode("all")} style={{
                  background: parlayMode === "all" ? "#333" : "transparent",
                  border: "none", borderRight: "1px solid #252525",
                  color: parlayMode === "all" ? "#e0e0e0" : "#444",
                  padding: "5px 14px", cursor: "pointer", fontSize: "11px",
                  fontFamily: "inherit", fontWeight: "bold",
                }}>SHOW ALL</button>
                <button onClick={() => setParlayMode("smart")} style={{
                  background: parlayMode === "smart" ? "#ff4444" : "transparent",
                  border: "none",
                  color: parlayMode === "smart" ? "#fff" : "#444",
                  padding: "5px 14px", cursor: "pointer", fontSize: "11px",
                  fontFamily: "inherit", fontWeight: "bold",
                }}>MATCH PLAYERS ▲</button>
              </div>
              {parlayMode === "smart" && filtersActive && (
                <span style={{ fontSize: "10px", color: "#555", fontStyle: "italic" }}>hiding parlays with filtered-out legs</span>
              )}
            </div>
          </div>

          <SectionHeader
            title="SHARP PARLAYS"
            sub={`${filteredParlays.length} of ${parlays.length} combos${parlayMode === "smart" && filtersActive ? " · smart-filtered to match player view" : ""}`}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredParlays.length > 0 ? filteredParlays.map(parlay => (
              <ParlayCard
                key={parlay.id}
                parlay={parlay}
                playerMap={playerMap}
                parkFactors={parkFactors}
                isOpen={activeParlay === parlay.id}
                onToggle={() => setActiveParlay(prev => prev === parlay.id ? null : parlay.id)}
              />
            )) : (
              <div style={{
                padding: "40px", textAlign: "center", color: "#333",
                border: "1px dashed #252525", borderRadius: "8px",
                fontSize: "12px", letterSpacing: "1px",
              }}>
                NO PARLAYS MATCH CURRENT FILTERS
                {parlayMode === "smart" && filtersActive && (
                  <div style={{ marginTop: "10px", color: "#444", fontSize: "11px" }}>
                    Switch FILTER MODE to "SHOW ALL" to see all parlays regardless of player filters.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER ───────────────────────────────────── */}
        <div style={{
          marginTop: "48px", paddingTop: "16px",
          borderTop: "1px solid #161616",
          display: "flex", justifyContent: "space-between",
          flexWrap: "wrap", gap: "8px",
          fontSize: "9px", color: "#303030", letterSpacing: "0.5px", lineHeight: 2,
        }}>
          <span>⚠️ INFORMATIONAL &amp; ENTERTAINMENT PURPOSES ONLY — NOT FINANCIAL ADVICE — CONFIRM ODDS ON YOUR SPORTSBOOK BEFORE BETTING</span>
          <span>SOURCES: Covers.com · THE BAT X · DraftKings · Baseball-Reference · StatMuse</span>
        </div>
      </div>
    </div>
  );
}
