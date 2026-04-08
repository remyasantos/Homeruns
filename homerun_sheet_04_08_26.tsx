"use client"; // <--- Add this line at the top
import { useState } from "react";

const PARK_FACTORS = {
  "Coors Field": { rank: 1, label: "🏔️ #1 HR Park", color: "#ff6b35" },
  "Angel Stadium": { rank: 2, label: "⚡ #2 HR Park", color: "#f7c59f" },
  "Guaranteed Rate Field": { rank: 5, label: "🏟️ #5 HR Park", color: "#ffe082" },
  "Fenway Park": { rank: 2, label: "🟢 #2 AVG Park", color: "#a8e063" },
  "Oracle Park": { rank: 4, label: "💨 Wind Boost", color: "#90e0ef" },
  "Citizens Bank Park": { rank: 8, label: "🔶 Hitter Friendly", color: "#ffb347" },
  "Yankee Stadium": { rank: 10, label: "⚾ Solid Park", color: "#c0c0c0" },
  "Rogers Centre": { rank: 12, label: "🏟️ Neutral", color: "#b0bec5" },
};

const TIERS = {
  S: { label: "S-TIER", color: "#ff4444", bg: "rgba(255,68,68,0.15)", border: "#ff4444" },
  A: { label: "A-TIER", color: "#ff8c00", bg: "rgba(255,140,0,0.12)", border: "#ff8c00" },
  B: { label: "B-TIER", color: "#ffd700", bg: "rgba(255,215,0,0.10)", border: "#ffd700" },
  C: { label: "C-TIER", color: "#7ec8e3", bg: "rgba(126,200,227,0.10)", border: "#7ec8e3" },
};

const players = [
  {
    id: 1, name: "Yordan Alvarez", team: "HOU", tier: "S",
    park: "Coors Field", parkRank: 1,
    pitcher: "Michael Lorenzen", pitcherNote: "12 R allowed in 7.1 IP, disaster start",
    matchupGrade: "A+", estOdds: "+270",
    note: "Leads MLB in SLG (.900) & OPS (1.478). 4 HR in 2026. Lorenzen is a bomb machine at Coors.",
    tags: ["🔥 Hot", "🏔️ Coors", "💣 Elite SP"],
  },
  {
    id: 2, name: "Ozzie Albies", team: "ATL", tier: "A",
    park: "Angel Stadium", parkRank: 2,
    pitcher: "Reid Detmers", pitcherNote: "Overworked — 199 pitches in 2 starts",
    matchupGrade: "A", estOdds: "+570",
    note: "Hit HR yesterday (+520 cash). Bats 3rd vs LHP (100pt SLG boost). Detmers arm is cooked.",
    tags: ["♻️ Run Back", "⚡ Angel Stadium", "📈 L5 Form"],
  },
  {
    id: 3, name: "Jo Adell", team: "LAA", tier: "A",
    park: "Angel Stadium", parkRank: 2,
    pitcher: "Grant Holmes", pitcherNote: "Projected over 2.5 ER by THE BAT",
    matchupGrade: "A+", estOdds: "+470",
    note: "Best +EV prop per Covers/THE BAT. 4-for-8 in this series. +100 longer than Trout despite similar proj. AB.",
    tags: ["💰 Best EV", "⚡ Angel Stadium", "🔥 Series Hot"],
  },
  {
    id: 4, name: "Willy Adames", team: "SF", tier: "A",
    park: "Oracle Park", parkRank: 4,
    pitcher: "Aaron Nola", pitcherNote: "12.7 K/9 — tough but hittable",
    matchupGrade: "B+", estOdds: "+500",
    note: "93rd percentile HR talent per THE BAT X. Wind blowing out to CF at 11.5 mph (#3 today). Leadoff = max AB.",
    tags: ["💨 Wind Boost", "🏠 Home Field", "93rd Pctile HR"],
  },
  {
    id: 5, name: "Kyle Schwarber", team: "PHI", tier: "S",
    park: "Citizens Bank Park", parkRank: 8,
    pitcher: "Tyler Mahle", pitcherNote: "2 rough starts vs NYY & NYM",
    matchupGrade: "A", estOdds: "+340",
    note: "56 HR in 2025. HR every 10.8 ABs last year. Mahle has been getting lit up early. CBP hitter-friendly.",
    tags: ["🐂 Elite Power", "💣 Struggling SP", "📊 High Volume"],
  },
  {
    id: 6, name: "Shohei Ohtani", team: "LAD", tier: "S",
    park: "Rogers Centre", parkRank: 12,
    pitcher: "Dylan Cease", pitcherNote: "20% SwStr, 18 Ks in 9.2 IP — elite",
    matchupGrade: "C+", estOdds: "+450",
    note: "55 HR in 2025. Just hit HR vs Nationals. Cease is tough but Ohtani’s raw power wins at Jays park.",
    tags: ["👑 4x MVP", "⚠️ Tough SP", "📈 Recent HR"],
  },
  {
    id: 7, name: "Oneil Cruz", team: "PIT", tier: "B",
    park: "PNC Park", parkRank: 15,
    pitcher: "Michael King", pitcherNote: "3.97 xERA, shaky, 4 walks in last start",
    matchupGrade: "B+", estOdds: "+500",
    note: ".314 BA / 4 HR / 1.026 OPS early 2026. Massive raw power. King struggling with command.",
    tags: ["🚀 Raw Power", "📈 Hot Start", "🎯 Walk Rate UP"],
  },
  {
    id: 8, name: "Aaron Judge", team: "NYY", tier: "S",
    park: "Yankee Stadium", parkRank: 10,
    pitcher: "Luis Severino", pitcherNote: "Solid, familiar foe",
    matchupGrade: "B", estOdds: "+310",
    note: "53 HR in 2025. Already has 2 HR in 2026. NYY best rotation + offense. Will Warren vs Sev on other side.",
    tags: ["👑 AL MVP x3", "📊 Consistent", "🏟️ Short Porch"],
  },
  {
    id: 9, name: "Jose Altuve", team: "HOU", tier: "B",
    park: "Coors Field", parkRank: 1,
    pitcher: "Michael Lorenzen", pitcherNote: "12 R in 7.1 IP disaster",
    matchupGrade: "A+", estOdds: "+550",
    note: "88th pctile batting per THE BAT X. Bats 3rd. Coors #1 park + best weather conditions today.",
    tags: ["🏔️ Coors", "🌡️ Best Weather", "💣 SP Disaster"],
  },
  {
    id: 10, name: "Manny Machado", team: "SD", tier: "B",
    park: "PNC Park", parkRank: 15,
    pitcher: "Mitch Keller", pitcherNote: "K/9 declining, hittable",
    matchupGrade: "B", estOdds: "+490",
    note: "Just homered vs PIT Sunday to break out. Padres’ Big 3 was ice cold before that. Rebound candidate.",
    tags: ["📈 Breakout", "🔓 Due", "💪 Established Power"],
  },
  {
    id: 11, name: "James Wood", team: "WAS", tier: "B",
    park: "Nationals Park", parkRank: 11,
    pitcher: "Michael McGreevey", pitcherNote: "2.53 ERA but high xERA — regression due",
    matchupGrade: "B+", estOdds: "+520",
    note: "2 HR / 6 RBI in 2026. All-Star in 2025. Elite exit velo (6’7\", 234 lbs). McGreevey getting lucky.",
    tags: ["📊 Regression SP", "🏆 2025 All-Star", "💪 Elite Frame"],
  },
  {
    id: 12, name: "Gunnar Henderson", team: "BAL", tier: "B",
    park: "Guaranteed Rate Field", parkRank: 5,
    pitcher: "Sean Burke", pitcherNote: "12 Ks in 10 IP, only 1 walk — sharp",
    matchupGrade: "C+", estOdds: "+480",
    note: "At GRF — #5 HR park, shallowest fences in MLB. Burke is tough. Henderson a bounce-back candidate.",
    tags: ["🏟️ Short Fences", "⚠️ Tough SP", "🔁 Bounce Back"],
  },
  {
    id: 13, name: "Fernando Tatis Jr.", team: "SD", tier: "B",
    park: "PNC Park", parkRank: 15,
    pitcher: "Mitch Keller", pitcherNote: "Declining K rate",
    matchupGrade: "B", estOdds: "+510",
    note: "Elite batted-ball metrics. Possible launch angle tweak under new coach. Was cold, woke up Sunday.",
    tags: ["📈 Breaking Out", "🎯 Launch Tweak", "💯 Metrics Pop"],
  },
  {
    id: 14, name: "Cal Raleigh", team: "SEA", tier: "A",
    park: "Globe Life Field", parkRank: 13,
    pitcher: "MacKenzie Gore", pitcherNote: "3.97 ERA / 2.99 xERA — efficient",
    matchupGrade: "C", estOdds: "+600",
    note: "60 HR in 2025. Yet to go deep in 2026 (0/25 ABs). Hitless so far. Still elite talent, long drought brewing.",
    tags: ["💤 Still Waiting", "⚠️ Hard SP", "🔜 Due Soon"],
  },
  {
    id: 15, name: "Sal Stewart", team: "CIN", tier: "C",
    park: "Great American Ball Park", parkRank: 3,
    pitcher: "TBD", pitcherNote: "Favorable matchup pending",
    matchupGrade: "B+", estOdds: "+580",
    note: "1.167 OPS in 9 games. One of the hottest bats in baseball right now. GABP is a launching pad.",
    tags: ["🔥 Hottest Bat", "🏟️ GABP", "📈 Emerging"],
  },
  // ... (Players 1-15 from previous code)
  {
    id: 16, name: "Shea Langeliers", team: "OAK", tier: "B",
    park: "Sutter Health Park", parkRank: 6,
    pitcher: "Bryan Woo", pitcherNote: "High FB%, susceptible to pull-side power",
    matchupGrade: "B+", estOdds: "+420",
    note: "Sutter Health Park (Sacramento) playing small in 2026. Langeliers 95th percentile barrel rate.",
    tags: ["🏟️ Small Park", "💣 Barrel King"],
  },
  {
    id: 17, name: "Rafael Devers", team: "BOS", tier: "S",
    park: "Fenway Park", parkRank: 2,
    pitcher: "George Kirby", pitcherNote: "Elite control, but Devers owns the matchup",
    matchupGrade: "B", estOdds: "+410",
    note: "Kirby throws strikes; Devers hits them. 1.100 OPS vs Kirby in 15 career ABs.",
    tags: ["🦁 Fenway King", "📊 MU History"],
  },
  {
    id: 18, name: "Bobby Witt Jr.", team: "KC", tier: "S",
    park: "Kauffman Stadium", parkRank: 20,
    pitcher: "Tanner Bibee", pitcherNote: "Gave up 3 HR in his last start",
    matchupGrade: "A-", estOdds: "+440",
    note: "Witt is on a 10-game hit streak. Bibee struggling with the long ball early this year.",
    tags: ["⚡ 30/30 Club", "📈 Streak"],
  },
  {
    id: 19, name: "Vladimir Guerrero Jr.", team: "TOR", tier: "A",
    park: "Rogers Centre", parkRank: 12,
    pitcher: "Tyler Glasnow", pitcherNote: "100mph heat, high K rate",
    matchupGrade: "C+", estOdds: "+510",
    note: "Hardest hit ball of the week (118 mph). If Glasnow leaves one middle, it's gone.",
    tags: ["💥 Max EV", "⚠️ Tough MU"],
  },
  {
    id: 20, name: "Juan Soto", team: "NYM", tier: "S",
    park: "Citi Field", parkRank: 22,
    pitcher: "Zack Wheeler", pitcherNote: "Cy Young caliber form",
    matchupGrade: "B-", estOdds: "+460",
    note: "The 'Soto Shuffle' is back in Queens. Wheeler is tough, but Soto's eye is 99th percentile.",
    tags: ["⚖️ Plate Disc.", "👑 Elite"],
  },
  {
    id: 21, name: "Munetaka Murakami", team: "LAD", tier: "A",
    park: "Rogers Centre", parkRank: 12,
    pitcher: "Dylan Cease", pitcherNote: "High whiff rate on slider",
    matchupGrade: "B", estOdds: "+390",
    note: "Murakami adjusting to MLB fastballs. Rogers Centre fences are friendly to lefties.",
    tags: ["🇯🇵 Power", "📈 Rising"],
  },
  {
    id: 22, name: "Corbin Carroll", team: "ARI", tier: "B",
    park: "Chase Field", parkRank: 18,
    pitcher: "Kyle Harrison", pitcherNote: "Lefty/Lefty matchup",
    matchupGrade: "C", estOdds: "+620",
    note: "Sneaky power. Harrison allows high launch angles which suit Carroll's swing.",
    tags: ["🦎 Speed", "🎯 Launch"],
  },
  {
    id: 23, name: "Pete Alonso", team: "NYM", tier: "A",
    park: "Citi Field", parkRank: 22,
    pitcher: "Zack Wheeler", pitcherNote: "Low HR allowed rate in 2025",
    matchupGrade: "C+", estOdds: "+400",
    note: "Polar Bear loves big stages. High risk, high reward against an ace.",
    tags: ["🐻 Polar Bear", "💪 Strength"],
  },
  {
    id: 24, name: "Riley Greene", team: "DET", tier: "B",
    park: "Comerica Park", parkRank: 14,
    pitcher: "Joe Ryan", pitcherNote: "Extreme fly-ball pitcher",
    matchupGrade: "A", estOdds: "+540",
    note: "Matchup vs high-FB pitcher in 75-degree weather is the ideal HR recipe.",
    tags: ["🐯 Tiger Up", "📈 MU Play"],
  },
  {
    id: 25, name: "Royce Lewis", team: "MIN", tier: "A",
    park: "Comerica Park", parkRank: 14,
    pitcher: "Jack Flaherty", pitcherNote: "Velocity down 1.5 mph",
    matchupGrade: "A-", estOdds: "+430",
    note: "HR in every 12 at-bats when healthy. Flaherty's declining heater is a target.",
    tags: ["🔥 Per-AB Power", "🎯 Velo Drop"],
  },
  {
    id: 26, name: "Matt Olson", team: "ATL", tier: "S",
    park: "Angel Stadium", parkRank: 2,
    pitcher: "Reid Detmers", pitcherNote: "L/L split is negligible for Olson",
    matchupGrade: "B", estOdds: "+330",
    note: "Olson at the #2 park is a must-include for volume-based parlays.",
    tags: ["🏰 Smash", "📊 Consistent"],
  },
  {
    id: 27, name: "Luis Robert Jr.", team: "CWS", tier: "A",
    park: "Guaranteed Rate Field", parkRank: 5,
    pitcher: "Corbin Burnes", pitcherNote: "Top 5 SP in MLB",
    matchupGrade: "D+", estOdds: "+590",
    note: "Only power source on CWS. Burnes is a nightmare, but Robert has the 'accidental' HR power.",
    tags: ["🐆 Lone Star", "⚠️ Avoid MU"],
  },
  {
    id: 28, name: "Adolis Garcia", team: "TEX", tier: "A",
    park: "Globe Life Field", parkRank: 13,
    pitcher: "Logan Gilbert", pitcherNote: "High extension, tough angle",
    matchupGrade: "B", estOdds: "+380",
    note: "Garcia is a 'momentum' hitter. 2 HR in his last 3 games.",
    tags: ["💣 Bomb Squad", "🏠 Home"],
  },
  {
    id: 29, name: "Elly De La Cruz", team: "CIN", tier: "B",
    park: "Great American Ball Park", parkRank: 3,
    pitcher: "Graham Ashcraft", pitcherNote: "Extreme ground ball rate",
    matchupGrade: "B-", estOdds: "+520",
    note: "Hardest exit velo of the year (119.2 mph). GABP fences can't hold him.",
    tags: ["👽 Alien", "🏟️ GABP"],
  },
  {
    id: 30, name: "Jackson Holliday", team: "BAL", tier: "C",
    park: "Guaranteed Rate Field", parkRank: 5,
    pitcher: "Sean Burke", pitcherNote: "Rookie vs Rookie matchup",
    matchupGrade: "B-", estOdds: "+750",
    note: "Long shot value. Bat speed is elite, just needs to find the lift.",
    tags: ["👶 Rookie", "💰 Value"],
  },
  {
    id: 31, name: "Giancarlo Stanton", team: "NYY", tier: "B",
    park: "Yankee Stadium", parkRank: 10,
    pitcher: "Luis Severino", pitcherNote: "Former teammate, knows the tendencies",
    matchupGrade: "B", estOdds: "+380",
    note: "Still leads MLB in 'Hard Hit' % per Statcast. Severino's slider is hanging.",
    tags: ["🚀 EV King", "🏟️ Short Porch"],
  },
  {
    id: 32, name: "Kyle Tucker", team: "HOU", tier: "S",
    park: "Coors Field", parkRank: 1,
    pitcher: "Michael Lorenzen", pitcherNote: "Lorenzen's cutter is flat",
    matchupGrade: "A+", estOdds: "+310",
    note: "Tucker in Coors is a cheat code. 98th percentile in Sweet Spot %.",
    tags: ["🏔️ Coors Stack", "🎯 Sweet Spot"],
  },
  {
    id: 33, name: "Jazz Chisholm Jr.", team: "MIA", tier: "B",
    park: "loanDepot park", parkRank: 19,
    pitcher: "Max Fried", pitcherNote: "Elite lefty, suppresses HRs",
    matchupGrade: "D", estOdds: "+650",
    note: "Brutal matchup vs Fried. Only for deep longshot flyers.",
    tags: ["🎷 Flashy", "⚠️ Fade MU"],
  },
  {
    id: 34, name: "Triston Casas", team: "BOS", tier: "A",
    park: "Fenway Park", parkRank: 2,
    pitcher: "George Kirby", pitcherNote: "Low walk rate means strikes to hit",
    matchupGrade: "B+", estOdds: "+480",
    note: "Casas is a 'Statcast Darling.' Pull-side power fits the Fenway profile.",
    tags: ["☘️ Boston Power", "📈 Trending"],
  },
  {
    id: 35, name: "Bryan Reynolds", team: "PIT", tier: "B",
    park: "PNC Park", parkRank: 15,
    pitcher: "Michael King", pitcherNote: "Vulnerable to switch hitters",
    matchupGrade: "B", estOdds: "+580",
    note: "Consistent producer. King's changeup is missing high today.",
    tags: ["🏴‍☠️ Pirate Core", "📊 Steady"],
  },
  {
    id: 36, name: "Cal Raleigh", team: "SEA", tier: "A",
    park: "Globe Life Field", parkRank: 13,
    pitcher: "MacKenzie Gore", pitcherNote: "High FB rate, prone to HRs",
    matchupGrade: "B+", estOdds: "+450",
    note: "The 'Big Dumper' has a 42% fly-ball rate. Great MU vs Gore.",
    tags: ["🍑 Big Dumper", "💣 Catcher Power"],
  },
  {
    id: 37, name: "Nolan Jones", team: "COL", tier: "B",
    park: "Coors Field", parkRank: 1,
    pitcher: "Cristian Javier", pitcherNote: "Javier's 'invisible' FB is flat in altitude",
    matchupGrade: "A", estOdds: "+490",
    note: "Jones thrives at home. Javier's rise-ball doesn't rise at Coors.",
    tags: ["🏔️ Home Cooking", "🏔️ Coors"],
  },
  {
    id: 38, name: "Josh Jung", team: "TEX", tier: "B",
    park: "Globe Life Field", parkRank: 13,
    pitcher: "Logan Gilbert", pitcherNote: "Gilbert allows high Hard-Hit %",
    matchupGrade: "B-", estOdds: "+520",
    note: "Jung back from injury and looking sharp. Exit velos are back to 105+.",
    tags: ["🤠 Texas Tough", "📈 Injury Return"],
  },
  {
    id: 39, name: "Francisco Lindor", team: "NYM", tier: "A",
    park: "Citi Field", parkRank: 22,
    pitcher: "Zack Wheeler", pitcherNote: "Wheeler's sinker is elite",
    matchupGrade: "C+", estOdds: "+550",
    note: "Lindor is 0-for-12 this week. He's due for a 'get-right' game.",
    tags: ["🍎 NY Anchor", "🔁 Due"],
  },
  {
    id: 40, name: "Spencer Torkelson", team: "DET", tier: "B",
    park: "Comerica Park", parkRank: 14,
    pitcher: "Joe Ryan", pitcherNote: "Ryan's 'sweeper' is hanging",
    matchupGrade: "B+", estOdds: "+500",
    note: "Torkelson thrives against North-South pitchers like Ryan.",
    tags: ["🐅 Tork", "📊 Matchup Ace"],
  },
  {
    id: 41, name: "Jorge Soler", team: "LAA", tier: "A",
    park: "Angel Stadium", parkRank: 2,
    pitcher: "Chris Sale", pitcherNote: "Sale's slider is still elite",
    matchupGrade: "C-", estOdds: "+420",
    note: "Soler power is real, but Sale's K-rate is too high to trust fully.",
    tags: ["☀️ Cali Power", "⚠️ Tough MU"],
  },
  {
    id: 42, name: "Wyatt Langford", team: "TEX", tier: "A",
    park: "Globe Life Field", parkRank: 13,
    pitcher: "Logan Gilbert", pitcherNote: "Gilbert's splitter is missing low",
    matchupGrade: "B", estOdds: "+540",
    note: "Sophomore surge is real. Langford's barrel rate has jumped 4% since '25.",
    tags: ["⭐ Star Rising", "🤠 Texas"],
  },
  {
    id: 43, name: "Teoscar Hernandez", team: "LAD", tier: "A",
    park: "Rogers Centre", parkRank: 12,
    pitcher: "Dylan Cease", pitcherNote: "High walk rate today",
    matchupGrade: "B+", estOdds: "+440",
    note: "Revenge game vs former team (sort of). Teoscar loves hitting in Toronto.",
    tags: ["🦕 Revenge", "📈 Hot Form"],
  },
  {
    id: 44, name: "Christian Yelich", team: "MIL", tier: "B",
    park: "American Family Field", parkRank: 7,
    pitcher: "Justin Steele", pitcherNote: "Steele's command is pinpoint",
    matchupGrade: "C", estOdds: "+600",
    note: "Yelich hitting more ground balls lately. Need a launch angle fix.",
    tags: ["🍺 Brew Crew", "💤 Cold"],
  },
  {
    id: 45, name: "Cody Bellinger", team: "CHC", tier: "B",
    park: "Wrigley Field", parkRank: 17,
    pitcher: "Freddy Peralta", pitcherNote: "Peralta's FB has 19 inches of run",
    matchupGrade: "C-", estOdds: "+570",
    note: "Wrigley wind is blowing IN at 8mph. Avoid this game for HR props.",
    tags: ["🐻 Wrigley", "💨 Wind Warning"],
  },
  {
    id: 46, name: "Maikel Garcia", team: "KC", tier: "C",
    park: "Kauffman Stadium", parkRank: 20,
    pitcher: "Tanner Bibee", pitcherNote: "Vulnerable to high-contact hitters",
    matchupGrade: "B", estOdds: "+800",
    note: "The longshot of the day. Garcia is hitting the ball harder than ever.",
    tags: ["👑 KC Sleeper", "💰 Value"],
  },
  {
    id: 47, name: "Ketel Marte", team: "ARI", tier: "A",
    park: "Chase Field", parkRank: 18,
    pitcher: "Kyle Harrison", pitcherNote: "Harrison's FB is flat today",
    matchupGrade: "B+", estOdds: "+470",
    note: "Switch hitter with elite metrics vs lefties. Marte is a 'Banker' leg.",
    tags: ["🐍 Snake Bite", "📊 L/R Split"],
  },
  {
    id: 48, name: "Lane Thomas", team: "CLE", tier: "C",
    park: "Progressive Field", parkRank: 16,
    pitcher: "Bailey Ober", pitcherNote: "Ober's height creates tough angles",
    matchupGrade: "B-", estOdds: "+720",
    note: "Thomas is a 'Lefty Killer' but facing a Righty today. Contrarian play.",
    tags: ["🏹 Guardian", "🤔 Contrarian"],
  },
  {
    id: 49, name: "Gleyber Torres", team: "NYY", tier: "B",
    park: "Yankee Stadium", parkRank: 10,
    pitcher: "Luis Severino", pitcherNote: "Sevvy allowing high pull-side contact",
    matchupGrade: "B+", estOdds: "+510",
    note: "Torres thrives in the 2-hole. Severino's velocity is fluctuating.",
    tags: ["🏟️ Short Porch", "📈 Trending"],
  },
  {
    id: 50, name: "Luis Arraez", team: "SD", tier: "C",
    park: "PNC Park", parkRank: 15,
    pitcher: "Mitch Keller", pitcherNote: "Keller's sinker is heavy",
    matchupGrade: "F", estOdds: "+1200",
    note: "Arraez has 0 HR this year. This is purely a 'meme' leg for 10+ leg tickets.",
    tags: ["🎰 Lottery", "🛑 Low Ceiling"],
  },
];

const parlays = [
  {
    id: "4A", legs: 4, label: "THE CORE FOUR", risk: "Lower Risk",
    riskColor: "#4caf50", estPayout: "+850",
    description: "The highest-probability S-tier anchors for today's slate.",
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
    strategy: "Pure Hard-Hit play. These players (Vladdy Jr, Elly, Stanton) are currently leading the league in barrel rate.",
  },
  {
    id: "5C", legs: 5, label: "THE BOSTON-SAC BOMB", risk: "Medium Risk",
    riskColor: "#ff9800", estPayout: "+2,100",
    description: "Targeting high-altitude and small-stadium dynamics.",
    playerIds: [17, 34, 16, 1, 32],
    strategy: "Stacks Fenway lefties with Langeliers in the small Sacramento park and the Coors duo.",
  },
  {
    id: 1, legs: 6, label: "THE ANCHOR", risk: "Lower Risk",
    riskColor: "#4caf50", estPayout: "+3,200",
    description: "Pure S-tier + elite park stack. The floor of the board.",
    playerIds: [1, 5, 8, 6, 3, 2],
    strategy: "Stack the 3 S-tier sluggers with both Angel Stadium plays and Schwarber. All confirmed hot or due.",
  },
  {
    id: 2, legs: 6, label: "THE COORS STACK", risk: "Lower Risk",
    riskColor: "#4caf50", estPayout: "+4,100",
    description: "Double-down on Coors — the #1 HR park today — plus elite matchup plays.",
    playerIds: [1, 9, 5, 3, 2, 7],
    strategy: "Alvarez + Altuve both at Coors vs Lorenzen (12R/7.1IP). Stack same-game legs with value adds.",
  },
  {
    id: 3, legs: 7, label: "THE ANGEL CITY MEGA", risk: "Medium Risk",
    riskColor: "#ff9800", estPayout: "+6,800",
    description: "Both Angel Stadium plays stacked with S-tier elite power.",
    playerIds: [2, 3, 1, 5, 8, 4, 9],
    strategy: "Albies + Adell double-stack at #2 HR park is the core. Surround with elite talent. Altuve at Coors bridges the stacks.",
  },
  {
    id: 4, legs: 7, label: "THE WIND CHASER", risk: "Medium Risk",
    riskColor: "#ff9800", estPayout: "+7,500",
    description: "Oracle Park wind (11.5mph out to CF) + Coors + Angel Stadium triple-park stack.",
    playerIds: [4, 1, 9, 3, 5, 11, 2],
    strategy: "Adames at Oracle (3rd-best wind today) + Coors double + Angel pair. James Wood sneaks in vs regression SP.",
  },
  {
    id: 5, legs: 7, label: "THE HOT HAND", risk: "Medium Risk",
    riskColor: "#ff9800", estPayout: "+8,200",
    description: "Focus on players in confirmed recent form with favorable contexts.",
    playerIds: [2, 3, 1, 6, 7, 10, 5],
    strategy: "Albies (yesterday HR), Adell (4-for-8 series), Alvarez (4 HR, .900 SLG), Ohtani (HR Friday), Cruz (.314/4HR), Machado (HR Sunday). All have recent positive signals.",
  },
  {
    id: 6, legs: 8, label: "THE SLUGGER SUMMIT", risk: "Medium-High Risk",
    riskColor: "#ff5722", estPayout: "+14,000",
    description: "Every tier-S and most tier-A players combined into a mass-power 8-leg.",
    playerIds: [1, 5, 8, 6, 2, 3, 4, 9],
    strategy: "All three S-tiers (Alvarez, Schwarber, Judge) + Ohtani + both Angel Stadium plays + Adames wind play + Altuve at Coors. Pure power parlay.",
  },
  {
    id: 7, legs: 8, label: "THE VALUE PLAY", risk: "Medium-High Risk",
    riskColor: "#ff5722", estPayout: "+17,500",
    description: "Sprinkle in B-tier value on top of the core S-tier anchors.",
    playerIds: [1, 5, 3, 2, 7, 13, 11, 10],
    strategy: "Anchor: Alvarez + Schwarber + Angel pair. Add Cruz (raw power), Tatis Jr. (breaking out), James Wood (regression SP), Machado (just homered). Maximizes expected value per leg.",
  },
  {
    id: 8, legs: 9, label: "THE GRAND SALAMI", risk: "High Risk",
    riskColor: "#e91e63", estPayout: "+32,000",
    description: "Nine-leg monster pulling from every park context today.",
    playerIds: [1, 9, 5, 8, 6, 2, 3, 4, 7],
    strategy: "Coors double (Alvarez+Altuve) + Schwarber + Judge + Ohtani + Angel double (Albies+Adell) + Adames wind + Cruz. Covers every premium context on the slate.",
  },
  {
    id: 9, legs: 9, label: "THE SLEEPER STACK", risk: "High Risk",
    riskColor: "#e91e63", estPayout: "+38,000",
    description: "Mixes proven S-tier anchors with breakout candidates and regression spots.",
    playerIds: [1, 5, 3, 2, 7, 15, 12, 14, 11],
    strategy: "Alvarez + Schwarber as bedrock. Sal Stewart (.1.167 OPS) at GABP as a wildcard. Cal Raleigh (60 HR last year, 0 in 2026 — historically due). James Wood vs regression SP. High upside, needs the chalk to hold.",
  },
  {
    id: 10, legs: 10, label: "THE LOTTERY TICKET", risk: "Max Risk",
    riskColor: "#9c27b0", estPayout: "+70,000",
    description: "All-in 10-leg monster. Every elite + value play on the board today.",
    playerIds: [1, 9, 5, 8, 6, 2, 3, 4, 7, 15],
    strategy: "Every premium context: Coors double, Angel double, Oracle wind, Schwarber vs Mahle, Judge short porch, Ohtani despite Cease, Cruz raw power, Sal Stewart hot bat at GABP. The moon shot.",
  },
];

const playerMap = Object.fromEntries(players.map(p => [p.id, p]));

export default function App() {
  const [activeParlay, setActiveParlay] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredParlays = activeFilter === "ALL"
    ? parlays
    : parlays.filter(p => {
        if (activeFilter === "4") return p.legs === 4; // Added
        if (activeFilter === "5") return p.legs === 5; // Added
        if (activeFilter === "6") return p.legs === 6;
        if (activeFilter === "7") return p.legs === 7;
        if (activeFilter === "8") return p.legs === 8;
        if (activeFilter === "9+") return p.legs >= 9;
        return true;
      });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e8e8e8",
      fontFamily: "'Courier New', 'Consolas', monospace",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a0a 50%, #0f1520 100%)",
        borderBottom: "2px solid #ff4444",
        padding: "32px 24px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,68,68,0.04) 24px, rgba(255,68,68,0.04) 25px)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: "10px", color: "#ff4444", letterSpacing: "4px", marginBottom: "8px", textTransform: "uppercase" }}>
          ◆ SHARP STACKING SYSTEM ◆ APRIL 8, 2026 ◆ MLB SLATE
        </div>
        <h1 style={{
          fontSize: "clamp(22px, 5vw, 36px)",
          fontWeight: "900",
          margin: "0 0 8px",
          letterSpacing: "-1px",
          lineHeight: 1.1,
        }}>
          <span style={{ color: "#ff4444" }}>HR PARLAY</span>{" "}
          <span style={{ color: "#e8e8e8" }}>BOARD</span>
        </h1>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "16px" }}>
          {[
            { label: "PARLAYS", val: "15" },
            { label: "CANDIDATES", val: "50" },
            { label: "LEGS", val: "4–10" },
            { label: "TOP PARK", val: "COORS #1" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: "9px", color: "#666", letterSpacing: "2px" }}>{s.label}</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ff8c00" }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{
          background: "rgba(255,140,0,0.06)",
          border: "1px solid rgba(255,140,0,0.3)",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}>
          <ContextCard icon="🏔️" label="Coors Field" note="#1 HR Park Today" sub="HOU @ COL — Javier/Lorenzen disaster" />
          <ContextCard icon="⚡" label="Angel Stadium" note="#2 HR Park Today" sub="ATL @ LAA — Albies + Adell double" />
          <ContextCard icon="💨" label="Oracle Park" note="11.5mph Wind Out CF" sub="PHI @ SF — 3rd-best wind today" />
          <ContextCard icon="🏟️" label="GRF" note="#5 Park, Shallowest Fences" sub="BAL @ CWS — Henderson spot" />
        </div>

        {/* Candidates Table */}
        <div style={{ marginBottom: "28px" }}>
          <SectionHeader title="TOP 30 CANDIDATES" sub="Ranked by confidence tier · Park · Matchup" />
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #333", color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {["#", "Player", "Team", "Tier", "Park", "Vs. Pitcher", "MU", "~Odds", "Notes"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
{players.map((p, i) => {
  const tier = TIERS[p.tier];
  return (
    <tr key={p.id} style={{
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
    }}>
      <td style={{ padding: "9px 10px", color: "#555", fontWeight: "bold" }}>{i + 1}</td>
      <td style={{ padding: "9px 10px", fontWeight: "700", color: "#e8e8e8", whiteSpace: "nowrap" }}>{p.name}</td>
      <td style={{ padding: "9px 10px", color: "#888" }}>{p.team}</td>
      
      {/* --- UPDATED TIER COLUMN --- */}
      <td style={{ padding: "9px 10px", minWidth: "85px", whiteSpace: "nowrap" }}>
        <span style={{
          background: tier.bg,
          border: `1px solid ${tier.border}`,
          color: tier.color,
          padding: "2px 7px",
          borderRadius: "3px",
          fontSize: "10px",
          fontWeight: "bold",
          letterSpacing: "1px",
          display: "inline-block" // Ensures padding/width are respected
        }}>{tier.label}</span>
      </td>
      {/* --------------------------- */}

      <td style={{ padding: "9px 10px", color: "#aaa", whiteSpace: "nowrap", fontSize: "11px" }}>{p.park.replace(" Field", "").replace(" Park", "").replace(" Stadium", " Stad.")}</td>
      <td style={{ padding: "9px 10px", color: "#aaa", whiteSpace: "nowrap", fontSize: "11px" }}>{p.pitcher}</td>
      <td style={{ padding: "9px 10px", whiteSpace: "nowrap" }}>
        <span style={{
          color: p.matchupGrade.startsWith("A") ? "#4caf50" : p.matchupGrade.startsWith("B") ? "#ffd700" : "#ff8c00",
          fontWeight: "bold",
        }}>{p.matchupGrade}</span>
      </td>
      <td style={{ padding: "9px 10px", color: "#ff8c00", fontWeight: "bold", whiteSpace: "nowrap" }}>{p.estOdds}</td>
      <td style={{ padding: "9px 10px", color: "#777", fontSize: "11px", maxWidth: "200px" }}>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {p.tags.slice(0, 2).map(t => (
            <span key={t} style={{ background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: "2px", fontSize: "10px" }}>{t}</span>
          ))}
        </div>
      </td>
    </tr>
  );
})}              </tbody>
            </table>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ fontSize: "11px", color: "#555", alignSelf: "center", marginRight: "4px", letterSpacing: "1px" }}>FILTER:</div>
            {["ALL", "4", "5", "6", "7", "8", "9+"].map(f => ( // Added "4" and "5" here
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background: activeFilter === f ? "#ff4444" : "rgba(255,255,255,0.06)",
                border: `1px solid ${activeFilter === f ? "#ff4444" : "#333"}`,
                color: activeFilter === f ? "#fff" : "#888",
                padding: "5px 14px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "inherit",
                fontWeight: activeFilter === f ? "bold" : "normal",
                letterSpacing: "1px",
              }}
            >
              {f === "ALL" ? "ALL" : `${f}-LEG`}
            </button>
          ))}
        </div>

        {/* Parlay Cards */}
        <SectionHeader title="10 SHARP PARLAYS" sub="Click any parlay to expand full breakdown" />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredParlays.map(parlay => (
            <ParlayCard
              key={parlay.id}
              parlay={parlay}
              playerMap={playerMap}
              isOpen={activeParlay === parlay.id}
              onToggle={() => setActiveParlay(activeParlay === parlay.id ? null : parlay.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "32px",
          padding: "16px",
          borderTop: "1px solid #222",
          fontSize: "10px",
          color: "#444",
          lineHeight: 1.8,
          letterSpacing: "0.5px",
        }}>
          ⚠️ DISCLAIMER: For informational and entertainment purposes only. Confirm actual odds on your sportsbook. Please gamble responsibly.
          <br />
          DATA SOURCES: Covers.com / THE BAT X · DraftKings Network · Baseball-Reference · StatMuse
        </div>
      </div>
    </div>
  );
}

function ContextCard({ icon, label, note, sub }) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
      <div style={{ fontSize: "20px", lineHeight: 1 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: "bold", fontSize: "12px", color: "#e8e8e8" }}>{label}</div>
        <div style={{ fontSize: "11px", color: "#ff8c00" }}>{note}</div>
        <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>{sub}</div>
      </div>
    </div>
  );
}

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

function ParlayCard({ parlay, playerMap, isOpen, onToggle }) {
  const legPlayers = parlay.playerIds.map(id => playerMap[id]).filter(Boolean);

  return (
    <div style={{
      border: `1px solid ${isOpen ? parlay.riskColor : "#2a2a2a"}`,
      borderRadius: "8px",
      background: isOpen ? `rgba(${hexToRgb(parlay.riskColor)},0.05)` : "rgba(255,255,255,0.02)",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: "14px 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{
          width: "28px", height: "28px",
          background: parlay.riskColor,
          borderRadius: "4px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: "bold", color: "#fff", flexShrink: 0,
        }}>
          {parlay.id}
        </div>

        <div style={{ flex: 1, minWidth: "160px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#e8e8e8" }}>{parlay.label}</span>
            <span style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid #333",
              color: "#888",
              padding: "1px 8px",
              borderRadius: "3px",
              fontSize: "10px",
              letterSpacing: "1px",
            }}>{parlay.legs}-LEG</span>
            <span style={{
              background: `rgba(${hexToRgb(parlay.riskColor)},0.15)`,
              border: `1px solid ${parlay.riskColor}`,
              color: parlay.riskColor,
              padding: "1px 8px",
              borderRadius: "3px",
              fontSize: "10px",
              letterSpacing: "1px",
            }}>{parlay.risk}</span>
          </div>
          <div style={{ fontSize: "11px", color: "#666", marginTop: "3px" }}>{parlay.description}</div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "10px", color: "#555", letterSpacing: "1px" }}>EST. PAYOUT*</div>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ff8c00" }}>{parlay.estPayout}</div>
        </div>

        <div style={{ width: "100%", display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "2px" }}>
          {legPlayers.map((p) => {
            const tier = TIERS[p.tier];
            return (
              <span key={p.id} style={{
                background: tier.bg,
                border: `1px solid ${tier.border}`,
                color: tier.color,
                padding: "2px 7px",
                borderRadius: "3px",
                fontSize: "11px",
                fontWeight: "600",
              }}>
                {p.name.split(" ")[1] || p.name}
              </span>
            );
          })}
          <span style={{ fontSize: "11px", color: "#555", alignSelf: "center", marginLeft: "4px" }}>
            {isOpen ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {isOpen && (
        <div style={{ borderTop: "1px solid #222", padding: "16px" }}>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #2a2a2a",
            borderRadius: "6px",
            padding: "10px 14px",
            marginBottom: "14px",
            fontSize: "12px",
            color: "#aaa",
            lineHeight: 1.6,
          }}>
            <span style={{ color: "#ff8c00", fontWeight: "bold", letterSpacing: "1px" }}>STRATEGY: </span>
            {parlay.strategy}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {legPlayers.map((p, i) => {
              const tier = TIERS[p.tier];
              const park = PARK_FACTORS[p.park];
              return (
                <div key={p.id} style={{
                  display: "grid",
                  gridTemplateColumns: "20px 1fr auto",
                  gap: "10px",
                  alignItems: "start",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "6px",
                }}>
                  <div style={{ color: "#555", fontSize: "11px", fontWeight: "bold", paddingTop: "1px" }}>{i + 1}</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: "bold", color: "#e8e8e8" }}>{p.name}</span>
                      <span style={{ color: "#555", fontSize: "11px" }}>{p.team}</span>
                      <span style={{
                        background: tier.bg, border: `1px solid ${tier.border}`,
                        color: tier.color, padding: "1px 6px", borderRadius: "2px",
                        fontSize: "9px", letterSpacing: "1px",
                      }}>{tier.label}</span>
                      {park && (
                        <span style={{ fontSize: "10px", color: "#888" }}>{park.label}</span>
                      )}
                    </div>
                    <div style={{ fontSize: "11px", color: "#777", marginTop: "3px" }}>
                      vs <span style={{ color: "#aaa" }}>{p.pitcher}</span>
                      <span style={{ color: "#555" }}> — {p.pitcherNote}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "4px", lineHeight: 1.5 }}>{p.note}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "10px", color: "#555" }}>ODDS</div>
                    <div style={{ color: "#ff8c00", fontWeight: "bold", fontSize: "14px" }}>{p.estOdds}</div>
                    <div style={{
                      marginTop: "4px",
                      color: p.matchupGrade.startsWith("A") ? "#4caf50" : p.matchupGrade.startsWith("B") ? "#ffd700" : "#ff8c00",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}>MU: {p.matchupGrade}</div>
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

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : "255,255,255";
}