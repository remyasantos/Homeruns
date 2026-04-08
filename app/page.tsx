"use client"; // <--- Add this line at the top
import { useState, useMemo } from "react";

// ============================================================
// DAILY UPDATE ZONE — Edit only this section each day
// ============================================================
const SLATE_DATE = "APRIL 8, 2026";
const SLATE_LABEL = "WEDNESDAY MLB SLATE";

const CONTEXT_CARDS = [
  { icon: "🏔️", label: "Coors Field",    note: "#1 HR Park Today",           sub: "HOU @ COL — Javier/Lorenzen disaster" },
  { icon: "⚡", label: "Angel Stadium",  note: "#2 HR Park Today",           sub: "ATL @ LAA — Albies + Adell double"    },
  { icon: "💨", label: "Oracle Park",    note: "11.5 mph Wind Out to CF",    sub: "PHI @ SF — 3rd-best wind today"       },
  { icon: "🏟️", label: "GRF (Chicago)", note: "#5 Park, Shallowest Fences", sub: "BAL @ CWS — Henderson spot"           },
];

// Park factors — add any park that appears in today's slate
const PARK_FACTORS = {
  "Coors Field":              { rank: 1,  label: "🏔️ #1 HR Park",       color: "#ff6b35" },
  "Angel Stadium":            { rank: 2,  label: "⚡ #2 HR Park",       color: "#f7c59f" },
  "Great American Ball Park": { rank: 3,  label: "🏟️ #3 HR Park",       color: "#ffb347" },
  "Oracle Park":              { rank: 4,  label: "💨 Wind Boost",        color: "#90e0ef" },
  "Guaranteed Rate Field":    { rank: 5,  label: "🏟️ #5 HR Park",       color: "#ffe082" },
  "Sutter Health Park":       { rank: 6,  label: "🏟️ Small Park",        color: "#b2ff59" },
  "American Family Field":    { rank: 7,  label: "🏟️ #7 HR Park",       color: "#e0e0e0" },
  "Citizens Bank Park":       { rank: 8,  label: "🔶 Hitter Friendly",   color: "#ffb347" },
  "Fenway Park":              { rank: 9,  label: "🟢 Hitter Friendly",   color: "#a8e063" },
  "Yankee Stadium":           { rank: 10, label: "⚾ Short Porch",       color: "#c0c0c0" },
  "Nationals Park":           { rank: 11, label: "🏟️ Neutral",           color: "#b0bec5" },
  "Rogers Centre":            { rank: 12, label: "🏟️ Neutral",           color: "#b0bec5" },
  "Globe Life Field":         { rank: 13, label: "🏟️ Neutral",           color: "#b0bec5" },
  "Comerica Park":            { rank: 14, label: "🏟️ Pitcher Friendly",  color: "#78909c" },
  "PNC Park":                 { rank: 15, label: "🏟️ Pitcher Friendly",  color: "#78909c" },
  "Progressive Field":        { rank: 16, label: "🏟️ Pitcher Friendly",  color: "#78909c" },
  "Wrigley Field":            { rank: 17, label: "🌬️ Wind Dependent",    color: "#90caf9" },
  "Chase Field":              { rank: 18, label: "🏟️ Neutral",           color: "#b0bec5" },
  "loanDepot Park":           { rank: 19, label: "🏟️ Pitcher Friendly",  color: "#78909c" },
  "Kauffman Stadium":         { rank: 20, label: "🏟️ Neutral",           color: "#b0bec5" },
  "Citi Field":               { rank: 22, label: "🏟️ Pitcher Friendly",  color: "#78909c" },
};

// Tier definitions — stable, do not change between days
const TIERS = {
  S: { label: "S-TIER", color: "#ff4444", bg: "rgba(255,68,68,0.15)",   border: "#ff4444" },
  A: { label: "A-TIER", color: "#ff8c00", bg: "rgba(255,140,0,0.12)",   border: "#ff8c00" },
  B: { label: "B-TIER", color: "#ffd700", bg: "rgba(255,215,0,0.10)",   border: "#ffd700" },
  C: { label: "C-TIER", color: "#7ec8e3", bg: "rgba(126,200,227,0.10)", border: "#7ec8e3" },
};

// MU grade color — green A, yellow B, orange C, red D/F
function gradeColor(g = "") {
  if (g.startsWith("A")) return "#4caf50";
  if (g.startsWith("B")) return "#ffd700";
  if (g.startsWith("C")) return "#ff8c00";
  return "#ff4444";
}

// ── PLAYERS ──────────────────────────────────────────────────
// Required fields per player:
//   id          unique int (never reuse)
//   name        full player name
//   team        3-letter MLB abbr matching real roster
//   tier        S / A / B / C
//   park        must exactly match a key in PARK_FACTORS above
//   pitcher     opposing starter name
//   pitcherNote short scouting note on pitcher
//   matchupGrade A+ A A- B+ B B- C+ C C- D+ D F
//   estOdds     string e.g. "+340"
//   note        1-2 sentence analysis
//   tags        string array of short labels
const players = [
  {
    id: 1, name: "Yordan Alvarez", team: "HOU", tier: "S",
    park: "Coors Field",
    pitcher: "Michael Lorenzen", pitcherNote: "12 R allowed in 7.1 IP, disaster start",
    matchupGrade: "A+", estOdds: "+270",
    note: "Leads MLB in SLG (.900) & OPS (1.478). 4 HR in 2026. Lorenzen is a bomb machine at Coors.",
    tags: ["🔥 Hot", "🏔️ Coors", "💣 Elite Matchup"],
  },
  {
    id: 2, name: "Ozzie Albies", team: "ATL", tier: "A",
    park: "Angel Stadium",
    pitcher: "Reid Detmers", pitcherNote: "Overworked — 199 pitches in 2 starts",
    matchupGrade: "A", estOdds: "+570",
    note: "Hit HR yesterday (+520 cash). Bats 3rd vs LHP (100pt SLG boost). Detmers arm is cooked.",
    tags: ["♻️ Run Back", "⚡ Angel Stad.", "📈 L5 Form"],
  },
  {
    id: 3, name: "Jo Adell", team: "LAA", tier: "A",
    park: "Angel Stadium",
    pitcher: "Grant Holmes", pitcherNote: "Projected over 2.5 ER by THE BAT",
    matchupGrade: "A+", estOdds: "+470",
    note: "Best +EV prop per Covers/THE BAT. 4-for-8 in this series. +100 longer than Trout despite similar proj. AB.",
    tags: ["💰 Best EV", "⚡ Angel Stad.", "🔥 Series Hot"],
  },
  {
    id: 4, name: "Willy Adames", team: "SF", tier: "A",
    park: "Oracle Park",
    pitcher: "Aaron Nola", pitcherNote: "12.7 K/9 — tough but hittable",
    matchupGrade: "B+", estOdds: "+500",
    note: "93rd percentile HR talent per THE BAT X. Wind blowing out to CF at 11.5 mph (#3 today). Leadoff = max AB.",
    tags: ["💨 Wind Boost", "🏠 Home Field", "93rd Pctile HR"],
  },
  {
    id: 5, name: "Kyle Schwarber", team: "PHI", tier: "S",
    park: "Citizens Bank Park",
    pitcher: "Tyler Mahle", pitcherNote: "2 rough starts vs NYY & NYM",
    matchupGrade: "A", estOdds: "+340",
    note: "56 HR in 2025. HR every 10.8 ABs last year. Mahle has been getting lit up early. CBP hitter-friendly.",
    tags: ["🐂 Elite Power", "💣 Struggling SP", "📊 High Volume"],
  },
  {
    id: 6, name: "Shohei Ohtani", team: "LAD", tier: "S",
    park: "Rogers Centre",
    pitcher: "Dylan Cease", pitcherNote: "20% SwStr, 18 Ks in 9.2 IP — elite",
    matchupGrade: "C+", estOdds: "+450",
    note: "55 HR in 2025. Just hit HR vs Nationals. Cease is tough but Ohtani's raw power wins at Jays park.",
    tags: ["👑 4x MVP", "⚠️ Tough SP", "📈 Recent HR"],
  },
  {
    id: 7, name: "Oneil Cruz", team: "PIT", tier: "B",
    park: "PNC Park",
    pitcher: "Michael King", pitcherNote: "3.97 xERA, shaky, 4 walks in last start",
    matchupGrade: "B+", estOdds: "+500",
    note: ".314 BA / 4 HR / 1.026 OPS early 2026. Massive raw power. King struggling with command.",
    tags: ["🚀 Raw Power", "📈 Hot Start", "🎯 Walk Rate UP"],
  },
  {
    id: 8, name: "Aaron Judge", team: "NYY", tier: "S",
    park: "Yankee Stadium",
    pitcher: "Luis Severino", pitcherNote: "Solid, familiar foe",
    matchupGrade: "B", estOdds: "+310",
    note: "53 HR in 2025. Already has 2 HR in 2026. NYY best rotation + offense. Will Warren vs Sev on other side.",
    tags: ["👑 AL MVP x3", "📊 Consistent", "🏟️ Short Porch"],
  },
  {
    id: 9, name: "Jose Altuve", team: "HOU", tier: "B",
    park: "Coors Field",
    pitcher: "Michael Lorenzen", pitcherNote: "12 R in 7.1 IP disaster",
    matchupGrade: "A+", estOdds: "+550",
    note: "88th pctile batting per THE BAT X. Bats 3rd. Coors #1 park + best weather conditions today.",
    tags: ["🏔️ Coors", "🌡️ Best Weather", "💣 SP Disaster"],
  },
  {
    id: 10, name: "Manny Machado", team: "SD", tier: "B",
    park: "PNC Park",
    pitcher: "Mitch Keller", pitcherNote: "K/9 declining, hittable",
    matchupGrade: "B", estOdds: "+490",
    note: "Just homered vs PIT Sunday to break out. Padres' Big 3 was ice cold before that. Rebound candidate.",
    tags: ["📈 Breakout", "🔓 Due", "💪 Established Power"],
  },
  {
    id: 11, name: "James Wood", team: "WAS", tier: "B",
    park: "Nationals Park",
    pitcher: "Michael McGreevey", pitcherNote: "2.53 ERA but high xERA — regression due",
    matchupGrade: "B+", estOdds: "+520",
    note: "2 HR / 6 RBI in 2026. All-Star in 2025. Elite exit velo (6'7\", 234 lbs). McGreevey getting lucky.",
    tags: ["📊 Regression SP", "🏆 2025 All-Star", "💪 Elite Frame"],
  },
  {
    id: 12, name: "Gunnar Henderson", team: "BAL", tier: "B",
    park: "Guaranteed Rate Field",
    pitcher: "Sean Burke", pitcherNote: "12 Ks in 10 IP, only 1 walk — sharp",
    matchupGrade: "C+", estOdds: "+480",
    note: "At GRF — #5 HR park, shallowest fences in MLB. Burke is tough. Henderson a bounce-back candidate.",
    tags: ["🏟️ Short Fences", "⚠️ Tough SP", "🔁 Bounce Back"],
  },
  {
    id: 13, name: "Fernando Tatis Jr.", team: "SD", tier: "B",
    park: "PNC Park",
    pitcher: "Mitch Keller", pitcherNote: "Declining K rate",
    matchupGrade: "B", estOdds: "+510",
    note: "Elite batted-ball metrics. Possible launch angle tweak under new coach. Was cold, woke up Sunday.",
    tags: ["📈 Breaking Out", "🎯 Launch Tweak", "💯 Metrics Pop"],
  },
  {
    id: 14, name: "Cal Raleigh", team: "SEA", tier: "A",
    park: "Globe Life Field",
    pitcher: "MacKenzie Gore", pitcherNote: "3.97 ERA / 2.99 xERA — efficient",
    matchupGrade: "C", estOdds: "+600",
    note: "60 HR in 2025. Yet to go deep in 2026 (0 for 25 ABs). Still elite talent, long drought brewing.",
    tags: ["💤 Still Waiting", "⚠️ Hard SP", "🔜 Due Soon"],
  },
  {
    id: 15, name: "Sal Stewart", team: "CIN", tier: "C",
    park: "Great American Ball Park",
    pitcher: "TBD", pitcherNote: "Favorable matchup pending",
    matchupGrade: "B+", estOdds: "+580",
    note: "1.167 OPS in 9 games. One of the hottest bats in baseball right now. GABP is a launching pad.",
    tags: ["🔥 Hottest Bat", "🏟️ GABP", "📈 Emerging"],
  },
  {
    id: 16, name: "Shea Langeliers", team: "OAK", tier: "B",
    park: "Sutter Health Park",
    pitcher: "Bryan Woo", pitcherNote: "High FB%, susceptible to pull-side power",
    matchupGrade: "B+", estOdds: "+420",
    note: "Sutter Health Park (Sacramento) playing small in 2026. Langeliers 95th percentile barrel rate.",
    tags: ["🏟️ Small Park", "💣 Barrel King"],
  },
  {
    id: 17, name: "Rafael Devers", team: "BOS", tier: "S",
    park: "Fenway Park",
    pitcher: "George Kirby", pitcherNote: "Elite control, but Devers owns the matchup",
    matchupGrade: "B", estOdds: "+410",
    note: "Kirby throws strikes; Devers hits them. 1.100 OPS vs Kirby in 15 career ABs.",
    tags: ["🦁 Fenway King", "📊 BvP History"],
  },
  {
    id: 18, name: "Bobby Witt Jr.", team: "KC", tier: "S",
    park: "Kauffman Stadium",
    pitcher: "Tanner Bibee", pitcherNote: "Gave up 3 HR in his last start",
    matchupGrade: "A-", estOdds: "+440",
    note: "Witt is on a 10-game hit streak. Bibee struggling with the long ball early this year.",
    tags: ["⚡ 30/30 Club", "📈 Streak"],
  },
  {
    id: 19, name: "Vladimir Guerrero Jr.", team: "TOR", tier: "A",
    park: "Rogers Centre",
    pitcher: "Tyler Glasnow", pitcherNote: "100mph heat, high K rate",
    matchupGrade: "C+", estOdds: "+510",
    note: "Hardest hit ball of the week (118 mph). If Glasnow leaves one middle, it's gone.",
    tags: ["💥 Max EV", "⚠️ Tough MU"],
  },
  {
    id: 20, name: "Juan Soto", team: "NYM", tier: "S",
    park: "Citi Field",
    pitcher: "Zack Wheeler", pitcherNote: "Cy Young caliber form",
    matchupGrade: "B-", estOdds: "+460",
    note: "The 'Soto Shuffle' is back in Queens. Wheeler is tough, but Soto's eye is 99th percentile.",
    tags: ["⚖️ Plate Disc.", "👑 Elite"],
  },
  {
    id: 21, name: "Munetaka Murakami", team: "LAD", tier: "A",
    park: "Rogers Centre",
    pitcher: "Dylan Cease", pitcherNote: "High whiff rate on slider",
    matchupGrade: "B", estOdds: "+390",
    note: "Murakami adjusting to MLB fastballs. Rogers Centre fences are friendly to lefties.",
    tags: ["🇯🇵 Power", "📈 Rising"],
  },
  {
    id: 22, name: "Corbin Carroll", team: "ARI", tier: "B",
    park: "Chase Field",
    pitcher: "Kyle Harrison", pitcherNote: "Lefty/Lefty matchup",
    matchupGrade: "C", estOdds: "+620",
    note: "Sneaky power. Harrison allows high launch angles which suit Carroll's swing.",
    tags: ["🦎 Speed", "🎯 Launch"],
  },
  {
    id: 23, name: "Pete Alonso", team: "NYM", tier: "A",
    park: "Citi Field",
    pitcher: "Zack Wheeler", pitcherNote: "Low HR allowed rate in 2025",
    matchupGrade: "C+", estOdds: "+400",
    note: "Polar Bear loves big stages. High risk, high reward against an ace.",
    tags: ["🐻 Polar Bear", "💪 Strength"],
  },
  {
    id: 24, name: "Riley Greene", team: "DET", tier: "B",
    park: "Comerica Park",
    pitcher: "Joe Ryan", pitcherNote: "Extreme fly-ball pitcher",
    matchupGrade: "A", estOdds: "+540",
    note: "Matchup vs high-FB pitcher in 75-degree weather is the ideal HR recipe.",
    tags: ["🐯 Tiger Up", "📈 MU Play"],
  },
  {
    id: 25, name: "Royce Lewis", team: "MIN", tier: "A",
    park: "Comerica Park",
    pitcher: "Jack Flaherty", pitcherNote: "Velocity down 1.5 mph",
    matchupGrade: "A-", estOdds: "+430",
    note: "HR in every 12 at-bats when healthy. Flaherty's declining heater is a target.",
    tags: ["🔥 Per-AB Power", "🎯 Velo Drop"],
  },
  {
    id: 26, name: "Matt Olson", team: "ATL", tier: "S",
    park: "Angel Stadium",
    pitcher: "Reid Detmers", pitcherNote: "L/L split is negligible for Olson",
    matchupGrade: "B", estOdds: "+330",
    note: "Olson at the #2 park is a must-include for volume-based parlays.",
    tags: ["🏰 Smash", "📊 Consistent"],
  },
  {
    id: 27, name: "Luis Robert Jr.", team: "CWS", tier: "A",
    park: "Guaranteed Rate Field",
    pitcher: "Corbin Burnes", pitcherNote: "Top 5 SP in MLB",
    matchupGrade: "D+", estOdds: "+590",
    note: "Only power source on CWS. Burnes is a nightmare, but Robert has the 'accidental' HR power.",
    tags: ["🐆 Lone Star", "⚠️ Avoid MU"],
  },
  {
    id: 28, name: "Adolis Garcia", team: "TEX", tier: "A",
    park: "Globe Life Field",
    pitcher: "Logan Gilbert", pitcherNote: "High extension, tough angle",
    matchupGrade: "B", estOdds: "+380",
    note: "Garcia is a 'momentum' hitter. 2 HR in his last 3 games.",
    tags: ["💣 Bomb Squad", "🏠 Home"],
  },
  {
    id: 29, name: "Elly De La Cruz", team: "CIN", tier: "B",
    park: "Great American Ball Park",
    pitcher: "Graham Ashcraft", pitcherNote: "Extreme ground ball rate",
    matchupGrade: "B-", estOdds: "+520",
    note: "Hardest exit velo of the year (119.2 mph). GABP fences can't hold him.",
    tags: ["👽 Alien", "🏟️ GABP"],
  },
  {
    id: 30, name: "Jackson Holliday", team: "BAL", tier: "C",
    park: "Guaranteed Rate Field",
    pitcher: "Sean Burke", pitcherNote: "Rookie vs Rookie matchup",
    matchupGrade: "B-", estOdds: "+750",
    note: "Long shot value. Bat speed is elite, just needs to find the lift.",
    tags: ["👶 Rookie", "💰 Value"],
  },
  {
    id: 31, name: "Giancarlo Stanton", team: "NYY", tier: "B",
    park: "Yankee Stadium",
    pitcher: "Luis Severino", pitcherNote: "Former teammate, knows the tendencies",
    matchupGrade: "B", estOdds: "+380",
    note: "Still leads MLB in 'Hard Hit' % per Statcast. Severino's slider is hanging.",
    tags: ["🚀 EV King", "🏟️ Short Porch"],
  },
  {
    id: 32, name: "Kyle Tucker", team: "HOU", tier: "S",
    park: "Coors Field",
    pitcher: "Michael Lorenzen", pitcherNote: "Lorenzen's cutter is flat",
    matchupGrade: "A+", estOdds: "+310",
    note: "Tucker in Coors is a cheat code. 98th percentile in Sweet Spot %.",
    tags: ["🏔️ Coors Stack", "🎯 Sweet Spot"],
  },
  {
    id: 33, name: "Jazz Chisholm Jr.", team: "MIA", tier: "B",
    park: "loanDepot Park",
    pitcher: "Max Fried", pitcherNote: "Elite lefty, suppresses HRs",
    matchupGrade: "D", estOdds: "+650",
    note: "Brutal matchup vs Fried. Only for deep longshot flyers.",
    tags: ["🎷 Flashy", "⚠️ Fade MU"],
  },
  {
    id: 34, name: "Triston Casas", team: "BOS", tier: "A",
    park: "Fenway Park",
    pitcher: "George Kirby", pitcherNote: "Low walk rate means strikes to hit",
    matchupGrade: "B+", estOdds: "+480",
    note: "Casas is a 'Statcast Darling.' Pull-side power fits the Fenway profile.",
    tags: ["☘️ Boston Power", "📈 Trending"],
  },
  {
    id: 35, name: "Bryan Reynolds", team: "PIT", tier: "B",
    park: "PNC Park",
    pitcher: "Michael King", pitcherNote: "Vulnerable to switch hitters",
    matchupGrade: "B", estOdds: "+580",
    note: "Consistent producer. King's changeup is missing high today.",
    tags: ["🏴‍☠️ Pirate Core", "📊 Steady"],
  },
  {
    id: 36, name: "Nolan Jones", team: "COL", tier: "B",
    park: "Coors Field",
    pitcher: "Cristian Javier", pitcherNote: "Javier's 'invisible' FB is flat in altitude",
    matchupGrade: "A", estOdds: "+490",
    note: "Jones thrives at home. Javier's rise-ball doesn't rise at Coors.",
    tags: ["🏔️ Home Cooking", "🏔️ Coors"],
  },
  {
    id: 37, name: "Josh Jung", team: "TEX", tier: "B",
    park: "Globe Life Field",
    pitcher: "Logan Gilbert", pitcherNote: "Gilbert allows high Hard-Hit %",
    matchupGrade: "B-", estOdds: "+520",
    note: "Jung back from injury and looking sharp. Exit velos are back to 105+.",
    tags: ["🤠 Texas Tough", "📈 Injury Return"],
  },
  {
    id: 38, name: "Francisco Lindor", team: "NYM", tier: "A",
    park: "Citi Field",
    pitcher: "Zack Wheeler", pitcherNote: "Wheeler's sinker is elite",
    matchupGrade: "C+", estOdds: "+550",
    note: "Lindor is 0-for-12 this week. He's due for a 'get-right' game.",
    tags: ["🍎 NY Anchor", "🔁 Due"],
  },
  {
    id: 39, name: "Spencer Torkelson", team: "DET", tier: "B",
    park: "Comerica Park",
    pitcher: "Joe Ryan", pitcherNote: "Ryan's 'sweeper' is hanging",
    matchupGrade: "B+", estOdds: "+500",
    note: "Torkelson thrives against North-South pitchers like Ryan.",
    tags: ["🐅 Tork", "📊 Matchup Ace"],
  },
  {
    id: 40, name: "Jorge Soler", team: "LAA", tier: "A",
    park: "Angel Stadium",
    pitcher: "Chris Sale", pitcherNote: "Sale's slider is still elite",
    matchupGrade: "C-", estOdds: "+420",
    note: "Soler power is real, but Sale's K-rate is too high to trust fully.",
    tags: ["☀️ Cali Power", "⚠️ Tough MU"],
  },
  {
    id: 41, name: "Wyatt Langford", team: "TEX", tier: "A",
    park: "Globe Life Field",
    pitcher: "Logan Gilbert", pitcherNote: "Gilbert's splitter is missing low",
    matchupGrade: "B", estOdds: "+540",
    note: "Sophomore surge is real. Langford's barrel rate has jumped 4% since '25.",
    tags: ["⭐ Star Rising", "🤠 Texas"],
  },
  {
    id: 42, name: "Teoscar Hernandez", team: "LAD", tier: "A",
    park: "Rogers Centre",
    pitcher: "Dylan Cease", pitcherNote: "High walk rate today",
    matchupGrade: "B+", estOdds: "+440",
    note: "Revenge game vs former team (sort of). Teoscar loves hitting in Toronto.",
    tags: ["🦕 Revenge", "📈 Hot Form"],
  },
  {
    id: 43, name: "Christian Yelich", team: "MIL", tier: "B",
    park: "American Family Field",
    pitcher: "Justin Steele", pitcherNote: "Steele's command is pinpoint",
    matchupGrade: "C", estOdds: "+600",
    note: "Yelich hitting more ground balls lately. Need a launch angle fix.",
    tags: ["🍺 Brew Crew", "💤 Cold"],
  },
  {
    id: 44, name: "Cody Bellinger", team: "CHC", tier: "B",
    park: "Wrigley Field",
    pitcher: "Freddy Peralta", pitcherNote: "Peralta's FB has 19 inches of run",
    matchupGrade: "C-", estOdds: "+570",
    note: "Wrigley wind is blowing IN at 8mph. Avoid this game for HR props.",
    tags: ["🐻 Wrigley", "💨 Wind Warning"],
  },
  {
    id: 45, name: "Maikel Garcia", team: "KC", tier: "C",
    park: "Kauffman Stadium",
    pitcher: "Tanner Bibee", pitcherNote: "Vulnerable to high-contact hitters",
    matchupGrade: "B", estOdds: "+800",
    note: "The longshot of the day. Garcia is hitting the ball harder than ever.",
    tags: ["👑 KC Sleeper", "💰 Value"],
  },
  {
    id: 46, name: "Ketel Marte", team: "ARI", tier: "A",
    park: "Chase Field",
    pitcher: "Kyle Harrison", pitcherNote: "Harrison's FB is flat today",
    matchupGrade: "B+", estOdds: "+470",
    note: "Switch hitter with elite metrics vs lefties. Marte is a 'Banker' leg.",
    tags: ["🐍 Snake Bite", "📊 L/R Split"],
  },
  {
    id: 47, name: "Lane Thomas", team: "CLE", tier: "C",
    park: "Progressive Field",
    pitcher: "Bailey Ober", pitcherNote: "Ober's height creates tough angles",
    matchupGrade: "B-", estOdds: "+720",
    note: "Thomas is a 'Lefty Killer' but facing a Righty today. Contrarian play.",
    tags: ["🏹 Guardian", "🤔 Contrarian"],
  },
  {
    id: 48, name: "Gleyber Torres", team: "NYY", tier: "B",
    park: "Yankee Stadium",
    pitcher: "Luis Severino", pitcherNote: "Sevvy allowing high pull-side contact",
    matchupGrade: "B+", estOdds: "+510",
    note: "Torres thrives in the 2-hole. Severino's velocity is fluctuating.",
    tags: ["🏟️ Short Porch", "📈 Trending"],
  },
  {
    id: 49, name: "Luis Arraez", team: "SD", tier: "C",
    park: "PNC Park",
    pitcher: "Mitch Keller", pitcherNote: "Keller's sinker is heavy",
    matchupGrade: "F", estOdds: "+1200",
    note: "Arraez has 0 HR this year. This is purely a 'meme' leg for 10+ leg tickets.",
    tags: ["🎰 Lottery", "🛑 Low Ceiling"],
  },
];

// ── PARLAYS ───────────────────────────────────────────────────
// playerIds MUST reference valid player ids above.
// Parlays with missing player ids will show a warning badge but still render.
// Use unique string ids — prefix with leg count for clarity: "4A", "5B", "6A", etc.
const parlays = [
  {
    id: "4A", legs: 4, label: "THE CORE FOUR", risk: "Lower Risk",
    riskColor: "#4caf50", estPayout: "+850",
    description: "Highest-probability S-tier anchors for today's slate.",
    playerIds: [1, 5, 8, 32],
    strategy: "Focuses entirely on S-Tier talent (Alvarez, Schwarber, Judge, Tucker) in premium parks like Coors and Yankee Stadium.",
  },
  {
    id: "4B", legs: 4, label: "FENWAY-COORS LIGHT", risk: "Lower Risk",
    riskColor: "#4caf50", estPayout: "+1,100",
    description: "Elite bats in the top two hitting environments today.",
    playerIds: [1, 17, 32, 34],
    strategy: "Combines Coors altitude (Alvarez, Tucker) with Fenway's hitter-friendly dimensions (Devers, Casas).",
  },
  {
    id: "5A", legs: 5, label: "THE HIGH FIVE", risk: "Lower Risk",
    riskColor: "#4caf50", estPayout: "+1,800",
    description: "A blend of S-tier power and Angel Stadium's park factor.",
    playerIds: [1, 5, 8, 2, 3],
    strategy: "Uses the three main S-tier anchors and stacks the top two Angel Stadium plays (Albies, Adell).",
  },
  {
    id: "5B", legs: 5, label: "THE EV SPECIAL", risk: "Medium Risk",
    riskColor: "#ff9800", estPayout: "+2,400",
    description: "Players with the highest Exit Velocity metrics this week.",
    playerIds: [1, 19, 29, 31, 5],
    strategy: "Pure Hard-Hit play. Vladdy Jr, Elly De La Cruz, Stanton are currently leading the league in barrel rate.",
  },
  {
    id: "5C", legs: 5, label: "THE BOSTON-COORS BOMB", risk: "Medium Risk",
    riskColor: "#ff9800", estPayout: "+2,100",
    description: "Targeting high-altitude and hitter-friendly stadium dynamics.",
    playerIds: [17, 34, 16, 1, 32],
    strategy: "Stacks Fenway hitters with Langeliers in the small Sacramento park and the Coors duo (Alvarez, Tucker).",
  },
  {
    id: "6A", legs: 6, label: "THE ANCHOR", risk: "Lower Risk",
    riskColor: "#4caf50", estPayout: "+3,200",
    description: "Pure S-tier + elite park stack. The floor of the board.",
    playerIds: [1, 5, 8, 6, 3, 2],
    strategy: "Stack the 3 S-tier sluggers with both Angel Stadium plays and Ohtani. All confirmed hot or due.",
  },
  {
    id: "6B", legs: 6, label: "THE COORS STACK", risk: "Lower Risk",
    riskColor: "#4caf50", estPayout: "+4,100",
    description: "Double-down on Coors — the #1 HR park today — plus elite matchup plays.",
    playerIds: [1, 9, 5, 3, 2, 7],
    strategy: "Alvarez + Altuve both at Coors vs Lorenzen (12R/7.1IP). Stack same-game legs with value adds.",
  },
  {
    id: "7A", legs: 7, label: "THE ANGEL CITY MEGA", risk: "Medium Risk",
    riskColor: "#ff9800", estPayout: "+6,800",
    description: "Both Angel Stadium plays stacked with S-tier elite power.",
    playerIds: [2, 3, 1, 5, 8, 4, 9],
    strategy: "Albies + Adell double-stack at #2 HR park is the core. Surround with elite talent. Altuve at Coors bridges the stacks.",
  },
  {
    id: "7B", legs: 7, label: "THE WIND CHASER", risk: "Medium Risk",
    riskColor: "#ff9800", estPayout: "+7,500",
    description: "Oracle Park wind (11.5mph out to CF) + Coors + Angel Stadium triple-park stack.",
    playerIds: [4, 1, 9, 3, 5, 11, 2],
    strategy: "Adames at Oracle (3rd-best wind today) + Coors double + Angel pair. James Wood sneaks in vs regression SP.",
  },
  {
    id: "7C", legs: 7, label: "THE HOT HAND", risk: "Medium Risk",
    riskColor: "#ff9800", estPayout: "+8,200",
    description: "Players in confirmed recent form with favorable contexts.",
    playerIds: [2, 3, 1, 6, 7, 10, 5],
    strategy: "Albies (yesterday HR), Adell (4-for-8 series), Alvarez (4 HR, .900 SLG), Ohtani (HR Friday), Cruz (.314/4HR), Machado (HR Sunday). All have recent positive signals.",
  },
  {
    id: "8A", legs: 8, label: "THE SLUGGER SUMMIT", risk: "Medium-High Risk",
    riskColor: "#ff5722", estPayout: "+14,000",
    description: "Every S-tier and most A-tier players combined into a mass-power 8-leg.",
    playerIds: [1, 5, 8, 6, 2, 3, 4, 9],
    strategy: "All S-tiers (Alvarez, Schwarber, Judge) + Ohtani + both Angel Stadium plays + Adames wind play + Altuve at Coors. Pure power parlay.",
  },
  {
    id: "8B", legs: 8, label: "THE VALUE PLAY", risk: "Medium-High Risk",
    riskColor: "#ff5722", estPayout: "+17,500",
    description: "Sprinkle in B-tier value on top of the core S-tier anchors.",
    playerIds: [1, 5, 3, 2, 7, 13, 11, 10],
    strategy: "Anchor: Alvarez + Schwarber + Angel pair. Add Cruz (raw power), Tatis Jr. (breaking out), James Wood (regression SP), Machado (just homered). Maximizes expected value per leg.",
  },
  {
    id: "9A", legs: 9, label: "THE GRAND SALAMI", risk: "High Risk",
    riskColor: "#e91e63", estPayout: "+32,000",
    description: "Nine-leg monster pulling from every park context today.",
    playerIds: [1, 9, 5, 8, 6, 2, 3, 4, 7],
    strategy: "Coors double (Alvarez+Altuve) + Schwarber + Judge + Ohtani + Angel double (Albies+Adell) + Adames wind + Cruz. Covers every premium context on the slate.",
  },
  {
    id: "9B", legs: 9, label: "THE SLEEPER STACK", risk: "High Risk",
    riskColor: "#e91e63", estPayout: "+38,000",
    description: "Proven S-tier anchors mixed with breakout candidates and regression spots.",
    playerIds: [1, 5, 3, 2, 7, 15, 12, 14, 11],
    strategy: "Alvarez + Schwarber as bedrock. Sal Stewart (1.167 OPS) at GABP as wildcard. Cal Raleigh (60 HR last year, 0 in 2026 — historically due). James Wood vs regression SP. High upside.",
  },
  {
    id: "10A", legs: 10, label: "THE LOTTERY TICKET", risk: "Max Risk",
    riskColor: "#9c27b0", estPayout: "+70,000",
    description: "All-in 10-leg monster. Every elite + value play on the board today.",
    playerIds: [1, 9, 5, 8, 6, 2, 3, 4, 7, 15],
    strategy: "Every premium context: Coors double, Angel double, Oracle wind, Schwarber vs Mahle, Judge short porch, Ohtani despite Cease, Cruz raw power, Sal Stewart hot bat at GABP. The moon shot.",
  },
];
// ============================================================
// END OF DAILY UPDATE ZONE
// ============================================================

// Build lookup map from players array
const playerMap = Object.fromEntries(players.map(p => [p.id, p]));

// Derive teams and grades dynamically from today's slate — no hardcoding needed
const TEAMS_IN_SLATE = [...new Set(players.map(p => p.team))].sort();
const GRADE_ORDER = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","F"];
const GRADES_IN_SLATE = GRADE_ORDER.filter(g => players.some(p => p.matchupGrade === g));

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "255,255,255";
}

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

function ParlayCard({ parlay, playerMap, isOpen, onToggle }) {
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
      {/* Collapsed header */}
      <div onClick={onToggle} style={{
        padding: "14px 18px", cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "44px 1fr auto 24px",
        gap: "14px", alignItems: "center",
        userSelect: "none",
      }}>
        {/* ID badge */}
        <div style={{
          background: parlay.riskColor, borderRadius: "5px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: "bold", color: "#fff",
          height: "32px", width: "44px", flexShrink: 0, letterSpacing: "0.5px",
        }}>{parlay.id}</div>

        {/* Main content */}
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
          {/* Player last-name chips */}
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

        {/* Payout */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "9px", color: "#444", letterSpacing: "1px", marginBottom: "2px" }}>EST. PAYOUT</div>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ff8c00", lineHeight: 1 }}>{parlay.estPayout}</div>
        </div>

        {/* Chevron */}
        <div style={{ color: "#444", fontSize: "12px", textAlign: "center" }}>{isOpen ? "▲" : "▼"}</div>
      </div>

      {/* Expanded detail */}
      {isOpen && (
        <div style={{ borderTop: "1px solid #1e1e1e", padding: "16px 18px" }}>
          {/* Strategy box */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid #252525",
            borderRadius: "6px", padding: "10px 14px", marginBottom: "14px",
            fontSize: "12px", color: "#aaa", lineHeight: 1.6,
          }}>
            <span style={{ color: "#ff8c00", fontWeight: "bold", letterSpacing: "1px" }}>STRATEGY: </span>
            {parlay.strategy}
          </div>

          {/* Leg list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {legPlayers.map((p, i) => {
              const tier = TIERS[p.tier] || TIERS.C;
              const park = PARK_FACTORS[p.park];
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
  const [tierFilter,    setTierFilter]    = useState("ALL");
  const [gradeFilter,   setGradeFilter]   = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [legFilter,     setLegFilter]     = useState("ALL");
  const [activeParlay,  setActiveParlay]  = useState(null);
  // "all" = parlays always show; "smart" = parlays hide if any leg is filtered out
  const [parlayMode,    setParlayMode]    = useState("all");

  const toggleTeam = (team) => {
    if (team === "ALL") { setSelectedTeams([]); return; }
    setSelectedTeams(prev => prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]);
  };
  const toggleGrade = (grade) => {
    if (grade === "ALL") { setGradeFilter([]); return; }
    setGradeFilter(prev => prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]);
  };
  const clearAll = () => { setTierFilter("ALL"); setGradeFilter([]); setSelectedTeams([]); };

  const filtersActive = tierFilter !== "ALL" || gradeFilter.length > 0 || selectedTeams.length > 0;

  // Filtered candidates (table rows)
  const filteredCandidates = useMemo(() => players.filter(p => {
    const okTier  = tierFilter === "ALL" || p.tier === tierFilter;
    const okGrade = gradeFilter.length === 0 || gradeFilter.includes(p.matchupGrade);
    const okTeam  = selectedTeams.length === 0 || selectedTeams.includes(p.team);
    return okTier && okGrade && okTeam;
  }), [tierFilter, gradeFilter, selectedTeams]);

  const allowedIds = useMemo(() => new Set(filteredCandidates.map(p => p.id)), [filteredCandidates]);

  // Filtered parlays — leg count always applies; smart mode also hides mismatched parlays
  const filteredParlays = useMemo(() => parlays.filter(p => {
    const legCount = parseInt(legFilter);
    const okLegs = legFilter === "ALL"
      ? true
      : legFilter === "9+"
        ? p.legs >= 9
        : p.legs === legCount;
    if (!okLegs) return false;
    if (parlayMode === "smart" && filtersActive) {
      return p.playerIds.every(id => allowedIds.has(id));
    }
    return true;
  }), [legFilter, parlayMode, allowedIds, filtersActive]);

  // Dynamic header stats
  const sTierCount = filteredCandidates.filter(p => p.tier === "S").length;
  const aTierCount = filteredCandidates.filter(p => p.tier === "A").length;
  const bestPark   = [...filteredCandidates]
    .map(p => PARK_FACTORS[p.park]).filter(Boolean)
    .sort((a, b) => a.rank - b.rank)[0];

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
            ◆ SHARP STACKING SYSTEM ◆ {SLATE_DATE} ◆ {SLATE_LABEL}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            {/* Title */}
            <div>
              <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: "900", margin: "0 0 6px", letterSpacing: "-1px", lineHeight: 1 }}>
                <span style={{ color: "#ff4444" }}>HR PARLAY</span>{" "}
                <span style={{ color: "#e8e8e8" }}>BOARD</span>
              </h1>
              <div style={{ fontSize: "10px", color: "#444", letterSpacing: "2px" }}>
                HOME RUN PROP RESEARCH · INFORMATIONAL ONLY
              </div>
            </div>

            {/* Stat strip — updates live with filters */}
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

          {/* Row 1: Tier + MU Grade */}
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
                <FilterBtn key={g} active={gradeFilter.includes(g)} onClick={() => toggleGrade(g)} color={gradeColor(g)}>
                  {g}
                </FilterBtn>
              ))}
            </div>
          </div>

          {/* Row 2: Teams */}
          <div style={{ borderTop: "1px solid #181818", paddingTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "2px", minWidth: "28px" }}>TEAM</span>
              <FilterBtn active={selectedTeams.length === 0} onClick={() => setSelectedTeams([])} color="#666">ALL</FilterBtn>
              {TEAMS_IN_SLATE.map(team => (
                <FilterBtn key={team} active={selectedTeams.includes(team)} onClick={() => toggleTeam(team)} color="#4a90d9">
                  {team}
                </FilterBtn>
              ))}
            </div>
          </div>

          {/* Active filter chips + clear */}
          {filtersActive && (
            <div style={{ borderTop: "1px solid #181818", paddingTop: "10px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "1px" }}>ACTIVE:</span>
              {tierFilter !== "ALL" && (
                <span style={{ fontSize: "10px", background: "rgba(255,140,0,0.08)", border: "1px solid #ff8c00", color: "#ff8c00", padding: "2px 8px", borderRadius: "3px" }}>
                  TIER={tierFilter}
                </span>
              )}
              {gradeFilter.map(g => (
                <span key={g} style={{ fontSize: "10px", background: "rgba(76,175,80,0.08)", border: "1px solid #4caf50", color: "#4caf50", padding: "2px 8px", borderRadius: "3px" }}>
                  MU={g}
                </span>
              ))}
              {selectedTeams.map(t => (
                <span key={t} style={{ fontSize: "10px", background: "rgba(74,144,217,0.08)", border: "1px solid #4a90d9", color: "#4a90d9", padding: "2px 8px", borderRadius: "3px" }}>
                  {t}
                </span>
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
          {CONTEXT_CARDS.map((c, i) => <ContextCard key={i} {...c} />)}
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
                  const park = PARK_FACTORS[p.park];
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
          {/* Parlay controls */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "12px", marginBottom: "14px",
            background: "rgba(255,255,255,0.015)", border: "1px solid #1e1e1e",
            borderRadius: "8px", padding: "12px 16px",
          }}>
            {/* Leg count */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9px", color: "#3a3a3a", letterSpacing: "2px" }}>LEGS</span>
              {["ALL","4","5","6","7","8","9+","10"].map(f => (
                <FilterBtn key={f} active={legFilter === f} onClick={() => setLegFilter(f)} color="#ff4444">
                  {f === "ALL" ? "ALL" : f}
                </FilterBtn>
              ))}
            </div>

            {/* Parlay filter mode toggle */}
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
