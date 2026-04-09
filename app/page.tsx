"use client";
import { useState, useMemo, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const PLAYERS = [
  {
    id: 1, name: "Yordan Alvarez", team: "HOU", tier: "S",
    park: "Coors Field", parkFactor: 130, parkEmoji: "🏔️",
    pitcher: "Michael Lorenzen", pitcherHand: "R",
    muGrade: "A+", muScore: 97,
    odds: "+270", oddsNum: 270,
    hrProb: 18, edgeScore: 94,
    recentForm: 5, barrels: 4,
    why: "Lorenzen gave up 12 R in 7.1 IP. Coors #1 HR park. Alvarez leads MLB in SLG (.900).",
    tags: ["🔥 Hot", "🏔️ Coors", "💣 Elite MU"],
    longshot: false,
  },
  {
    id: 2, name: "Kyle Schwarber", team: "PHI", tier: "S",
    park: "Citizens Bank Park", parkFactor: 112, parkEmoji: "🔶",
    pitcher: "Tyler Mahle", pitcherHand: "R",
    muGrade: "A", muScore: 88,
    odds: "+340", oddsNum: 340,
    hrProb: 15, edgeScore: 89,
    recentForm: 4, barrels: 3,
    why: "56 HR in 2025. Mahle getting lit up early in starts. CBP hitter-friendly.",
    tags: ["🐂 Elite Power", "💣 Struggling SP"],
    longshot: false,
  },
  {
    id: 3, name: "Aaron Judge", team: "NYY", tier: "S",
    park: "Yankee Stadium", parkFactor: 115, parkEmoji: "⚾",
    pitcher: "Luis Severino", pitcherHand: "R",
    muGrade: "B", muScore: 80,
    odds: "+310", oddsNum: 310,
    hrProb: 16, edgeScore: 88,
    recentForm: 3, barrels: 2,
    why: "53 HR in 2025. Short porch at home. Already 2 HR in 2026.",
    tags: ["👑 AL MVP", "🏟️ Short Porch"],
    longshot: false,
  },
  {
    id: 4, name: "Kyle Tucker", team: "HOU", tier: "S",
    park: "Coors Field", parkFactor: 130, parkEmoji: "🏔️",
    pitcher: "Michael Lorenzen", pitcherHand: "R",
    muGrade: "A+", muScore: 97,
    odds: "+310", oddsNum: 310,
    hrProb: 16, edgeScore: 91,
    recentForm: 4, barrels: 3,
    why: "Tucker in Coors is a cheat code. 98th percentile Sweet Spot %. Lorenzen's cutter is flat.",
    tags: ["🏔️ Coors Stack", "🎯 Sweet Spot"],
    longshot: false,
  },
  {
    id: 5, name: "Rafael Devers", team: "BOS", tier: "S",
    park: "Fenway Park", parkFactor: 111, parkEmoji: "🟢",
    pitcher: "George Kirby", pitcherHand: "R",
    muGrade: "B", muScore: 78,
    odds: "+410", oddsNum: 410,
    hrProb: 13, edgeScore: 82,
    recentForm: 3, barrels: 2,
    why: "1.100 OPS vs Kirby in 15 career ABs. Fenway hitter-friendly.",
    tags: ["🦁 Fenway King", "📊 BvP History"],
    longshot: false,
  },
  {
    id: 6, name: "Bobby Witt Jr.", team: "KC", tier: "S",
    park: "Kauffman Stadium", parkFactor: 98, parkEmoji: "🏟️",
    pitcher: "Tanner Bibee", pitcherHand: "R",
    muGrade: "A-", muScore: 86,
    odds: "+440", oddsNum: 440,
    hrProb: 13, edgeScore: 84,
    recentForm: 5, barrels: 3,
    why: "10-game hit streak. Bibee gave up 3 HR in last start. Elite contact rate.",
    tags: ["⚡ 30/30 Club", "📈 Streak"],
    longshot: false,
  },
  {
    id: 7, name: "Matt Olson", team: "ATL", tier: "S",
    park: "Angel Stadium", parkFactor: 118, parkEmoji: "⚡",
    pitcher: "Reid Detmers", pitcherHand: "L",
    muGrade: "B", muScore: 79,
    odds: "+330", oddsNum: 330,
    hrProb: 15, edgeScore: 87,
    recentForm: 3, barrels: 2,
    why: "Olson at #2 HR park. L/L split negligible for him. Must-include for volume parlays.",
    tags: ["🏰 Smash", "📊 Consistent"],
    longshot: false,
  },
  {
    id: 8, name: "Juan Soto", team: "NYM", tier: "S",
    park: "Citi Field", parkFactor: 95, parkEmoji: "🏟️",
    pitcher: "Zack Wheeler", pitcherHand: "R",
    muGrade: "B-", muScore: 74,
    odds: "+460", oddsNum: 460,
    hrProb: 12, edgeScore: 79,
    recentForm: 3, barrels: 2,
    why: "Soto Shuffle back in Queens. Wheeler is tough but Soto's plate discipline is 99th percentile.",
    tags: ["⚖️ Plate Disc.", "👑 Elite"],
    longshot: false,
  },
  // A-TIER
  {
    id: 9, name: "Ozzie Albies", team: "ATL", tier: "A",
    park: "Angel Stadium", parkFactor: 118, parkEmoji: "⚡",
    pitcher: "Reid Detmers", pitcherHand: "L",
    muGrade: "A", muScore: 89,
    odds: "+570", oddsNum: 570,
    hrProb: 11, edgeScore: 81,
    recentForm: 5, barrels: 3,
    why: "HR yesterday at +520 (cashed). Bats 3rd vs LHP (100pt SLG boost). Detmers arm is cooked.",
    tags: ["♻️ Run Back", "⚡ Angel Stad.", "📈 L5 Form"],
    longshot: false,
  },
  {
    id: 10, name: "Jo Adell", team: "LAA", tier: "A",
    park: "Angel Stadium", parkFactor: 118, parkEmoji: "⚡",
    pitcher: "Grant Holmes", pitcherHand: "R",
    muGrade: "A+", muScore: 93,
    odds: "+470", oddsNum: 470,
    hrProb: 12, edgeScore: 83,
    recentForm: 4, barrels: 3,
    why: "Best +EV prop per Covers/THE BAT. 4-for-8 in this series. +100 longer than Trout despite similar projected ABs.",
    tags: ["💰 Best EV", "⚡ Angel Stad.", "🔥 Series Hot"],
    longshot: false,
  },
  {
    id: 11, name: "Willy Adames", team: "SF", tier: "A",
    park: "Oracle Park", parkFactor: 102, parkEmoji: "💨",
    pitcher: "Aaron Nola", pitcherHand: "R",
    muGrade: "B+", muScore: 82,
    odds: "+500", oddsNum: 500,
    hrProb: 11, edgeScore: 78,
    recentForm: 3, barrels: 2,
    why: "93rd percentile HR talent. Wind blowing out to CF at 11.5 mph. Leadoff = max ABs.",
    tags: ["💨 Wind Boost", "🏠 Home Field"],
    longshot: false,
  },
  {
    id: 12, name: "Cal Raleigh", team: "SEA", tier: "A",
    park: "Globe Life Field", parkFactor: 100, parkEmoji: "🏟️",
    pitcher: "MacKenzie Gore", pitcherHand: "L",
    muGrade: "C", muScore: 65,
    odds: "+600", oddsNum: 600,
    hrProb: 9, edgeScore: 71,
    recentForm: 2, barrels: 1,
    why: "60 HR in 2025. 0 HR in 25 ABs in 2026 — elite talent in drought. Due soon.",
    tags: ["💤 Still Waiting", "🔜 Due Soon"],
    longshot: false,
  },
  {
    id: 13, name: "Royce Lewis", team: "MIN", tier: "A",
    park: "Comerica Park", parkFactor: 93, parkEmoji: "🏟️",
    pitcher: "Jack Flaherty", pitcherHand: "R",
    muGrade: "A-", muScore: 85,
    odds: "+430", oddsNum: 430,
    hrProb: 12, edgeScore: 80,
    recentForm: 4, barrels: 3,
    why: "HR every 12 ABs when healthy. Flaherty's velo is down 1.5 mph — targetable.",
    tags: ["🔥 Per-AB Power", "🎯 Velo Drop"],
    longshot: false,
  },
  {
    id: 14, name: "Adolis Garcia", team: "TEX", tier: "A",
    park: "Globe Life Field", parkFactor: 100, parkEmoji: "🏟️",
    pitcher: "Logan Gilbert", pitcherHand: "R",
    muGrade: "B", muScore: 77,
    odds: "+380", oddsNum: 380,
    hrProb: 13, edgeScore: 79,
    recentForm: 4, barrels: 3,
    why: "2 HR in last 3 games. Momentum hitter. Home field advantage.",
    tags: ["💣 Bomb Squad", "🏠 Home"],
    longshot: false,
  },
  {
    id: 15, name: "Shea Langeliers", team: "OAK", tier: "A",
    park: "Sutter Health Park", parkFactor: 108, parkEmoji: "🏟️",
    pitcher: "Bryan Woo", pitcherHand: "R",
    muGrade: "B+", muScore: 83,
    odds: "+420", oddsNum: 420,
    hrProb: 12, edgeScore: 80,
    recentForm: 3, barrels: 4,
    why: "95th percentile barrel rate. Sutter Health Park playing small in 2026. Woo allows pull-side power.",
    tags: ["🏟️ Small Park", "💣 Barrel King"],
    longshot: false,
  },
  // B-TIER
  {
    id: 16, name: "Oneil Cruz", team: "PIT", tier: "B",
    park: "PNC Park", parkFactor: 91, parkEmoji: "🏟️",
    pitcher: "Michael King", pitcherHand: "R",
    muGrade: "B+", muScore: 82,
    odds: "+500", oddsNum: 500,
    hrProb: 10, edgeScore: 74,
    recentForm: 5, barrels: 3,
    why: ".314 BA / 4 HR / 1.026 OPS in 2026. King struggling with walk rate up.",
    tags: ["🚀 Raw Power", "📈 Hot Start"],
    longshot: false,
  },
  {
    id: 17, name: "Jose Altuve", team: "HOU", tier: "B",
    park: "Coors Field", parkFactor: 130, parkEmoji: "🏔️",
    pitcher: "Michael Lorenzen", pitcherHand: "R",
    muGrade: "A+", muScore: 93,
    odds: "+550", oddsNum: 550,
    hrProb: 10, edgeScore: 75,
    recentForm: 3, barrels: 2,
    why: "88th percentile batting per THE BAT X. Bats 3rd. Coors + Lorenzen disaster = perfect storm.",
    tags: ["🏔️ Coors", "💣 SP Disaster"],
    longshot: false,
  },
  {
    id: 18, name: "Gunnar Henderson", team: "BAL", tier: "B",
    park: "Guaranteed Rate Field", parkFactor: 108, parkEmoji: "🏟️",
    pitcher: "Sean Burke", pitcherHand: "R",
    muGrade: "C+", muScore: 67,
    odds: "+480", oddsNum: 480,
    hrProb: 10, edgeScore: 72,
    recentForm: 2, barrels: 2,
    why: "GRF has shallowest fences in MLB (#5 HR park). Burke sharp but Henderson elite power.",
    tags: ["🏟️ Short Fences", "🔁 Bounce Back"],
    longshot: false,
  },
  {
    id: 19, name: "Manny Machado", team: "SD", tier: "B",
    park: "PNC Park", parkFactor: 91, parkEmoji: "🏟️",
    pitcher: "Mitch Keller", pitcherHand: "R",
    muGrade: "B", muScore: 78,
    odds: "+490", oddsNum: 490,
    hrProb: 9, edgeScore: 70,
    recentForm: 3, barrels: 2,
    why: "Just homered Sunday to break cold streak. Rebound candidate with established power.",
    tags: ["📈 Breakout", "🔓 Due"],
    longshot: false,
  },
  {
    id: 20, name: "Giancarlo Stanton", team: "NYY", tier: "B",
    park: "Yankee Stadium", parkFactor: 115, parkEmoji: "⚾",
    pitcher: "Luis Severino", pitcherHand: "R",
    muGrade: "B", muScore: 77,
    odds: "+380", oddsNum: 380,
    hrProb: 13, edgeScore: 76,
    recentForm: 3, barrels: 3,
    why: "Leads MLB in Hard Hit % per Statcast. Severino's slider hanging. Short porch.",
    tags: ["🚀 EV King", "🏟️ Short Porch"],
    longshot: false,
  },
  {
    id: 21, name: "Riley Greene", team: "DET", tier: "B",
    park: "Comerica Park", parkFactor: 93, parkEmoji: "🏟️",
    pitcher: "Joe Ryan", pitcherHand: "R",
    muGrade: "A", muScore: 88,
    odds: "+540", oddsNum: 540,
    hrProb: 9, edgeScore: 72,
    recentForm: 3, barrels: 2,
    why: "Extreme fly-ball pitcher in 75-degree weather = ideal HR recipe.",
    tags: ["🐯 Tiger Up", "📈 MU Play"],
    longshot: false,
  },
  {
    id: 22, name: "Elly De La Cruz", team: "CIN", tier: "B",
    park: "Great American Ball Park", parkFactor: 120, parkEmoji: "🏟️",
    pitcher: "Graham Ashcraft", pitcherHand: "R",
    muGrade: "B-", muScore: 73,
    odds: "+520", oddsNum: 520,
    hrProb: 9, edgeScore: 71,
    recentForm: 4, barrels: 3,
    why: "Hardest exit velo of the year (119.2 mph). GABP fences can't hold him.",
    tags: ["👽 Alien", "🏟️ GABP"],
    longshot: false,
  },
  // LONGSHOTS
  {
    id: 23, name: "Sal Stewart", team: "CIN", tier: "C",
    park: "Great American Ball Park", parkFactor: 120, parkEmoji: "🏟️",
    pitcher: "TBD", pitcherHand: "R",
    muGrade: "B+", muScore: 82,
    odds: "+580", oddsNum: 580,
    hrProb: 8, edgeScore: 68,
    recentForm: 5, barrels: 3,
    why: "1.167 OPS in 9 games — one of the hottest bats in baseball. GABP is a launching pad.",
    tags: ["🔥 Hottest Bat", "🏟️ GABP", "📈 Emerging"],
    longshot: true,
  },
  {
    id: 24, name: "James Wood", team: "WAS", tier: "B",
    park: "Nationals Park", parkFactor: 100, parkEmoji: "🏟️",
    pitcher: "Michael McGreevey", pitcherHand: "R",
    muGrade: "B+", muScore: 83,
    odds: "+520", oddsNum: 520,
    hrProb: 9, edgeScore: 69,
    recentForm: 3, barrels: 2,
    why: "2 HR/6 RBI in 2026. Elite exit velo (6'7\", 234 lbs). McGreevey getting lucky with 2.53 ERA vs high xERA.",
    tags: ["📊 Regression SP", "🏆 2025 All-Star"],
    longshot: false,
  },
  {
    id: 25, name: "Jackson Holliday", team: "BAL", tier: "C",
    park: "Guaranteed Rate Field", parkFactor: 108, parkEmoji: "🏟️",
    pitcher: "Sean Burke", pitcherHand: "R",
    muGrade: "B-", muScore: 72,
    odds: "+750", oddsNum: 750,
    hrProb: 6, edgeScore: 58,
    recentForm: 3, barrels: 2,
    why: "Elite bat speed. GRF shallowest fences. Rookie vs Rookie — volatility favors the longshot.",
    tags: ["👶 Rookie", "💰 Value"],
    longshot: true,
  },
  {
    id: 26, name: "Maikel Garcia", team: "KC", tier: "C",
    park: "Kauffman Stadium", parkFactor: 98, parkEmoji: "🏟️",
    pitcher: "Tanner Bibee", pitcherHand: "R",
    muGrade: "B", muScore: 76,
    odds: "+800", oddsNum: 800,
    hrProb: 5, edgeScore: 55,
    recentForm: 4, barrels: 2,
    why: "Hitting ball harder than ever. Bibee vulnerable to high-contact hitters. Sneaky KC sleeper.",
    tags: ["👑 KC Sleeper", "💰 Value"],
    longshot: true,
  },
  {
    id: 27, name: "Lane Thomas", team: "CLE", tier: "C",
    park: "Progressive Field", parkFactor: 95, parkEmoji: "🏟️",
    pitcher: "Bailey Ober", pitcherHand: "R",
    muGrade: "B-", muScore: 71,
    odds: "+720", oddsNum: 720,
    hrProb: 6, edgeScore: 57,
    recentForm: 3, barrels: 2,
    why: "Lefty killer but facing a righty. Contrarian play with barrel flashes.",
    tags: ["🏹 Guardian", "🤔 Contrarian"],
    longshot: true,
  },
];

const PARLAYS = [
  { id: "4A", label: "THE CORE FOUR", legs: 4, risk: "Lower Risk", players: ["Yordan Alvarez","Kyle Schwarber","Aaron Judge","Kyle Tucker"], desc: "Highest-probability S-tier anchors for today's slate.", odds: "+850" },
  { id: "4B", label: "FENWAY-COORS LIGHT", legs: 4, risk: "Lower Risk", players: ["Yordan Alvarez","Rafael Devers","Kyle Tucker","Triston Casas"], desc: "Elite bats in the top two hitting environments today.", odds: "+1,100" },
  { id: "5A", label: "THE HIGH FIVE", legs: 5, risk: "Lower Risk", players: ["Yordan Alvarez","Kyle Schwarber","Aaron Judge","Ozzie Albies","Jo Adell"], desc: "A blend of S-tier power and Angel Stadium's park factor.", odds: "+1,800" },
  { id: "5B", label: "THE EV SPECIAL", legs: 5, risk: "Medium Risk", players: ["Yordan Alvarez","Aaron Judge","Oneil Cruz","Giancarlo Stanton","Kyle Schwarber"], desc: "Players with the highest Exit Velocity metrics this week.", odds: "+2,400" },
  { id: "6A", label: "THE ANCHOR", legs: 6, risk: "Lower Risk", players: ["Yordan Alvarez","Kyle Schwarber","Aaron Judge","Shohei Ohtani","Jo Adell","Ozzie Albies"], desc: "Pure S-tier + elite park stack. The floor of the board.", odds: "+3,200" },
  { id: "6B", label: "THE COORS STACK", legs: 6, risk: "Lower Risk", players: ["Yordan Alvarez","Jose Altuve","Kyle Schwarber","Jo Adell","Ozzie Albies","Oneil Cruz"], desc: "Double-down on Coors — #1 HR park today — plus elite matchup plays.", odds: "+4,100" },
  { id: "7A", label: "THE ANGEL CITY MEGA", legs: 7, risk: "Medium Risk", players: ["Ozzie Albies","Jo Adell","Yordan Alvarez","Kyle Schwarber","Aaron Judge","Willy Adames","Jose Altuve"], desc: "Both Angel Stadium plays stacked with S-tier elite power.", odds: "+6,800" },
  { id: "9A", label: "THE GRAND SALAMI", legs: 9, risk: "High Risk", players: ["Yordan Alvarez","Jose Altuve","Kyle Schwarber","Aaron Judge","Ozzie Albies","Jo Adell","Willy Adames","Oneil Cruz","Kyle Tucker"], desc: "Nine-leg monster pulling from every park context today.", odds: "+32,000" },
  { id: "10A", label: "THE LOTTERY TICKET", legs: 10, risk: "Max Risk", players: ["Yordan Alvarez","Jose Altuve","Kyle Schwarber","Aaron Judge","Ozzie Albies","Jo Adell","Willy Adames","Oneil Cruz","Kyle Tucker","Sal Stewart"], desc: "All-in 10-leg monster. Every elite + value play on the board.", odds: "+70,000" },
];

const TIER_CONFIG = {
  S: { label: "S-TIER", color: "#FFD700", bg: "rgba(255,215,0,0.12)", border: "#FFD700", desc: "Elite HR Targets — highest probability" },
  A: { label: "A-TIER", color: "#00E5FF", bg: "rgba(0,229,255,0.08)", border: "#00E5FF", desc: "Strong Plays — solid HR potential" },
  B: { label: "B-TIER", color: "#76FF03", bg: "rgba(118,255,3,0.07)", border: "#76FF03", desc: "Value Plays — good odds vs probability" },
  C: { label: "LONGSHOT", color: "#FF6D00", bg: "rgba(255,109,0,0.08)", border: "#FF6D00", desc: "High Risk, High Reward" },
};

function EdgeBadge({ score }: { score: number }) {
  const color = score >= 85 ? "#FFD700" : score >= 70 ? "#76FF03" : "#FF9800";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 4,
      background: `${color}18`, border: `1px solid ${color}40`,
      borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, color,
    }}>
      <span style={{ fontSize: 9 }}>EDGE</span>
      <span style={{ fontSize: 14 }}>{score}</span>
      <span style={{ fontSize: 9, opacity: 0.7 }}>/100</span>
    </div>
  );
}

function MuBadge({ grade, score }: { grade: string; score: number }) {
  const color = score >= 85 ? "#FFD700" : score >= 70 ? "#00E5FF" : score >= 55 ? "#76FF03" : "#FF5252";
  return (
    <span style={{
      background: `${color}20`, border: `1px solid ${color}50`,
      borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 800, color, letterSpacing: 0.5,
    }}>{grade}</span>
  );
}

function PlayerCard({ player, inParlay, onToggle }: { player: typeof PLAYERS[0]; inParlay: boolean; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const tc = TIER_CONFIG[player.tier as keyof typeof TIER_CONFIG];
  return (
    <div
      style={{
        background: inParlay ? `${tc.color}15` : "rgba(255,255,255,0.03)",
        border: `1px solid ${inParlay ? tc.color : tc.border + "35"}`,
        borderRadius: 12, padding: "14px 16px", marginBottom: 8,
        cursor: "pointer", transition: "all 0.2s ease",
        boxShadow: inParlay ? `0 0 16px ${tc.color}30` : "none",
      }}
      onClick={() => setExpanded(e => !e)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {/* Tier badge */}
        <span style={{
          background: tc.bg, border: `1px solid ${tc.color}60`,
          borderRadius: 4, padding: "2px 7px", fontSize: 9, fontWeight: 900,
          color: tc.color, letterSpacing: 1, whiteSpace: "nowrap",
        }}>{tc.label}</span>
        {/* Name */}
        <span style={{ fontWeight: 700, fontSize: 15, color: "#F5F5F5", flex: 1 }}>{player.name}</span>
        {/* Team */}
        <span style={{ fontSize: 11, color: "#888", background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>{player.team}</span>
        {/* Odds */}
        <span style={{ fontWeight: 800, fontSize: 16, color: "#FFD700", minWidth: 54, textAlign: "right" }}>{player.odds}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#aaa" }}>{player.parkEmoji} {player.park}</span>
        <span style={{ fontSize: 11, color: "#777" }}>vs {player.pitcher} ({player.pitcherHand}HP)</span>
        <MuBadge grade={player.muGrade} score={player.muScore} />
        <EdgeBadge score={player.edgeScore} />
        {/* HR Prob */}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#aaa" }}>
          <span style={{ color: "#76FF03", fontWeight: 700 }}>{player.hrProb}%</span> HR prob
        </span>
      </div>

      {expanded && (
        <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
          <p style={{ fontSize: 12, color: "#bbb", lineHeight: 1.6, margin: "0 0 8px" }}>
            💡 <em>{player.why}</em>
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {player.tags.map(t => (
              <span key={t} style={{ fontSize: 10, color: "#aaa", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 10 }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11 }}>
              <div style={{ color: "#666", marginBottom: 2 }}>Park Factor</div>
              <div style={{ color: "#00E5FF", fontWeight: 700 }}>{player.parkFactor}</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11 }}>
              <div style={{ color: "#666", marginBottom: 2 }}>L5 Form</div>
              <div style={{ color: "#76FF03", fontWeight: 700 }}>{"⚡".repeat(player.recentForm)}</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", fontSize: 11 }}>
              <div style={{ color: "#666", marginBottom: 2 }}>Barrels (L5)</div>
              <div style={{ color: "#FFD700", fontWeight: 700 }}>{player.barrels}</div>
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

function ParlayCard({ parlay }: { parlay: typeof PARLAYS[0] }) {
  const [open, setOpen] = useState(false);
  const riskColor = parlay.risk === "Lower Risk" ? "#76FF03" : parlay.risk === "Medium Risk" ? "#FFD700" : parlay.risk === "High Risk" ? "#FF9800" : "#FF5252";
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: "14px 16px", marginBottom: 8, cursor: "pointer",
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)",
          borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 900,
          color: "#FFD700", letterSpacing: 1,
        }}>{parlay.legs}-LEG</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: "#F5F5F5", flex: 1 }}>{parlay.label}</span>
        <span style={{ fontSize: 11, color: riskColor, fontWeight: 600 }}>{parlay.risk}</span>
        <span style={{ fontWeight: 800, color: "#FFD700", fontSize: 15 }}>{parlay.odds}</span>
      </div>
      {open && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 11, color: "#aaa", margin: "0 0 8px" }}>{parlay.desc}</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {parlay.players.map(p => (
              <span key={p} style={{ fontSize: 10, color: "#FFD700", background: "rgba(255,215,0,0.08)", padding: "2px 8px", borderRadius: 10, border: "1px solid rgba(255,215,0,0.2)" }}>{p}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"picks"|"parlays"|"longshots">("picks");
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"edge"|"prob"|"odds"|"form">("edge");
  const [parlay, setParlay] = useState<number[]>([]);
  const [parlayOpen, setParlayOpen] = useState(false);
  const [pitcherHand, setPitcherHand] = useState<"ALL"|"L"|"R">("ALL");

  const toggleParlay = useCallback((id: number) => {
    setParlay(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const parlayPlayers = useMemo(() => PLAYERS.filter(p => parlay.includes(p.id)), [parlay]);

  const combinedOdds = useMemo(() => {
    if (parlayPlayers.length < 2) return null;
    const dec = parlayPlayers.map(p => {
      const n = p.oddsNum;
      return n > 0 ? (n / 100) + 1 : (100 / Math.abs(n)) + 1;
    });
    const combined = dec.reduce((a, b) => a * b, 1);
    const american = Math.round((combined - 1) * 100);
    return `+${american.toLocaleString()}`;
  }, [parlayPlayers]);

  const filteredPlayers = useMemo(() => {
    let p = PLAYERS.filter(pl => !pl.longshot);
    if (tierFilter !== "ALL") p = p.filter(pl => pl.tier === tierFilter);
    if (pitcherHand !== "ALL") p = p.filter(pl => pl.pitcherHand === pitcherHand);
    if (sortBy === "edge") p = [...p].sort((a, b) => b.edgeScore - a.edgeScore);
    else if (sortBy === "prob") p = [...p].sort((a, b) => b.hrProb - a.hrProb);
    else if (sortBy === "odds") p = [...p].sort((a, b) => b.oddsNum - a.oddsNum);
    else if (sortBy === "form") p = [...p].sort((a, b) => b.recentForm - a.recentForm);
    return p;
  }, [tierFilter, sortBy, pitcherHand]);

  const topPicks = useMemo(() => PLAYERS.filter(p => p.tier === "S" && p.edgeScore >= 85).slice(0, 5), []);
  const longshots = useMemo(() => PLAYERS.filter(p => p.longshot), []);

  const tabStyle = (t: string) => ({
    padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700,
    cursor: "pointer", transition: "all 0.15s",
    background: activeTab === t ? "#FFD700" : "rgba(255,255,255,0.05)",
    color: activeTab === t ? "#000" : "#aaa",
    border: activeTab === t ? "none" : "1px solid rgba(255,255,255,0.1)",
  });

  const filterBtnStyle = (active: boolean, color = "#FFD700") => ({
    padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700,
    cursor: "pointer", background: active ? `${color}20` : "rgba(255,255,255,0.04)",
    color: active ? color : "#666", border: `1px solid ${active ? color + "50" : "rgba(255,255,255,0.08)"}`,
    transition: "all 0.15s",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      color: "#F0F0F0",
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
          .stat-row { flex-wrap: wrap !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(180deg, #111118 0%, #0A0A0F 100%)",
        borderBottom: "1px solid rgba(255,215,0,0.15)",
        padding: "32px 16px 24px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
          width: 400, height: 200, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,215,0,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#FFD70080", fontWeight: 700, marginBottom: 10 }}>
          ◆ SHARP STACKING SYSTEM ◆ APRIL 9, 2026 ◆
        </div>
        <h1 className="hero-title" style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 52, letterSpacing: 3, color: "#FFD700",
          lineHeight: 1, marginBottom: 8,
        }}>
          Daily MLB Home Run Picks
        </h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
          Data-driven picks using matchup grades, park factors & pitcher tendencies
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          {["✅ Updated Daily", "📊 Based on Statcast Data", "🔢 Model Score / 100"].map(s => (
            <span key={s} style={{ fontSize: 10, color: "#FFD700", background: "rgba(255,215,0,0.08)", padding: "3px 10px", borderRadius: 10, border: "1px solid rgba(255,215,0,0.2)" }}>{s}</span>
          ))}
        </div>
        {/* Stats row */}
        <div className="stat-row" style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
          {[
            { label: "S-TIER", val: "8", color: "#FFD700" },
            { label: "A-TIER", val: "7", color: "#00E5FF" },
            { label: "B-TIER", val: "8", color: "#76FF03" },
            { label: "LONGSHOTS", val: "3", color: "#FF6D00" },
            { label: "PARLAYS", val: "9", color: "#FF80AB" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "#555", letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOP PICKS BANNER ── */}
      <div style={{ background: "rgba(255,215,0,0.05)", borderBottom: "1px solid rgba(255,215,0,0.1)", padding: "16px 16px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#FFD700", fontWeight: 900, marginBottom: 10 }}>🏆 BEST HR BETS TODAY — TOP PICKS</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {topPicks.map(p => (
              <div key={p.id} style={{
                background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)",
                borderRadius: 10, padding: "10px 14px", minWidth: 130, flex: "0 0 auto",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#FFD700", marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{p.team} · {p.odds}</div>
                <div style={{ fontSize: 10, color: "#76FF03", marginTop: 4 }}>Edge {p.edgeScore}/100</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "16px 12px 120px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <button style={tabStyle("picks")} onClick={() => setActiveTab("picks")}>📊 All Picks</button>
          <button style={tabStyle("parlays")} onClick={() => setActiveTab("parlays")}>🎰 Parlays</button>
          <button style={tabStyle("longshots")} onClick={() => setActiveTab("longshots")}>💎 Longshots</button>
        </div>

        {/* ── PICKS TAB ── */}
        {activeTab === "picks" && (
          <>
            {/* Filters */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 8 }}>FILTER BY TIER</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {["ALL","S","A","B"].map(t => (
                  <button key={t} style={filterBtnStyle(tierFilter === t, t === "S" ? "#FFD700" : t === "A" ? "#00E5FF" : t === "B" ? "#76FF03" : "#aaa")}
                    onClick={() => setTierFilter(t)}>
                    {t === "ALL" ? "All" : TIER_CONFIG[t as keyof typeof TIER_CONFIG]?.label || t}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 8 }}>PITCHER HAND</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {(["ALL","L","R"] as const).map(h => (
                  <button key={h} style={filterBtnStyle(pitcherHand === h)} onClick={() => setPitcherHand(h)}>{h === "ALL" ? "Both" : h === "L" ? "LHP" : "RHP"}</button>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 8 }}>SORT BY</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {([["edge","Edge Score"],["prob","HR Prob"],["odds","Best Odds"],["form","Hot Form"]] as const).map(([v,l]) => (
                  <button key={v} style={filterBtnStyle(sortBy === v, "#00E5FF")} onClick={() => setSortBy(v)}>{l}</button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 10, color: "#444", letterSpacing: 1, marginBottom: 10 }}>
              {filteredPlayers.length} players — tap any card to expand details
            </div>

            {/* Tier sections */}
            {(["S","A","B"] as const).filter(t => tierFilter === "ALL" || tierFilter === t).map(tier => {
              const tc = TIER_CONFIG[tier];
              const players = filteredPlayers.filter(p => p.tier === tier);
              if (!players.length) return null;
              return (
                <div key={tier} style={{ marginBottom: 20 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
                    paddingBottom: 8, borderBottom: `1px solid ${tc.color}25`,
                  }}>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: tc.color, letterSpacing: 2 }}>{tc.label}</span>
                    <span style={{ fontSize: 10, color: "#555" }}>— {tc.desc}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "#444" }}>{players.length}</span>
                  </div>
                  {players.map(p => (
                    <PlayerCard key={p.id} player={p} inParlay={parlay.includes(p.id)} onToggle={() => toggleParlay(p.id)} />
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
              <p style={{ fontSize: 11, color: "#666" }}>Pre-built combinations from today's slate — tap to expand</p>
            </div>
            {PARLAYS.map(p => <ParlayCard key={p.id} parlay={p} />)}
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
                Lower probability players with real HR upside — power flashes, favorable parks, platoon advantages, or overlooked matchups. Ideal as tail legs on big parlays.
              </p>
            </div>
            {longshots.map(p => (
              <PlayerCard key={p.id} player={p} inParlay={parlay.includes(p.id)} onToggle={() => toggleParlay(p.id)} />
            ))}
          </div>
        )}
      </div>

      {/* ── PARLAY BUILDER (Sticky) ── */}
      <div className="parlay-sticky">
        <div
          style={{
            background: "#111118", borderTop: "1px solid rgba(255,215,0,0.25)",
            padding: parlayOpen ? "0" : "12px 16px",
          }}
        >
          {parlayOpen && (
            <div style={{ background: "#13131A", maxHeight: "60vh", overflowY: "auto", padding: "16px" }}>
              <div style={{ maxWidth: 700, margin: "0 auto" }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#FFD700", marginBottom: 12 }}>YOUR PARLAY BUILDER</div>
                {parlayPlayers.length === 0 ? (
                  <p style={{ fontSize: 12, color: "#555", textAlign: "center", padding: "20px 0" }}>Add players from the picks tab to build your parlay</p>
                ) : (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                      {parlayPlayers.map(p => (
                        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px" }}>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                          <span style={{ fontSize: 11, color: "#888" }}>{p.team}</span>
                          <span style={{ fontSize: 13, color: "#FFD700", fontWeight: 700 }}>{p.odds}</span>
                          <button
                            style={{ background: "rgba(255,82,82,0.15)", border: "1px solid rgba(255,82,82,0.3)", borderRadius: 4, padding: "2px 8px", fontSize: 11, color: "#FF5252", cursor: "pointer" }}
                            onClick={() => toggleParlay(p.id)}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(255,215,0,0.06)", borderRadius: 8, padding: "10px 14px" }}>
                      <span style={{ fontSize: 11, color: "#888", flex: 1 }}>{parlayPlayers.length}-LEG PARLAY</span>
                      <span style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: "#FFD700" }}>{combinedOdds ?? "—"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, padding: parlayOpen ? "10px 0" : "0" }}>
            <button
              style={{
                flex: 1, background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)",
                borderRadius: 8, padding: "10px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
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
                style={{ background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.3)", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontSize: 11, color: "#FF5252", fontWeight: 700 }}
                onClick={() => { setParlay([]); setParlayOpen(false); }}
              >Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "12px", background: "#07070C", fontSize: 9, color: "#333", letterSpacing: 1 }}>
        ⚠️ INFORMATIONAL & ENTERTAINMENT PURPOSES ONLY — NOT FINANCIAL ADVICE — CONFIRM ODDS ON YOUR SPORTSBOOK
        <br />SOURCES: Covers.com · THE BAT X · DraftKings · Baseball-Reference · StatMuse · Statcast
      </div>
    </div>
  );
}
