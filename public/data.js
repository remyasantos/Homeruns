// data.js — HR Parlay Board · September 1, 2026
// Loaded via <script> tag — no export statements

const SLATE_DATE  = "SEPTEMBER 1, 2026";
const SLATE_LABEL = "TUESDAY MLB SLATE";

const TEAM_TO_GAME = {
  NYM: "NYM @ TB",   TB:  "NYM @ TB",
  SEA: "SEA @ BOS",  BOS: "SEA @ BOS",
  DET: "DET @ MIN",  MIN: "DET @ MIN",
  MIL: "MIL @ CHC",  CHC: "MIL @ CHC",
  ATH: "ATH @ TEX",  TEX: "ATH @ TEX",
  CWS: "CWS @ HOU",  HOU: "CWS @ HOU",
  BAL: "BAL @ COL",  COL: "BAL @ COL",
  NYY: "NYY @ LAA",  LAA: "NYY @ LAA",
  PHI: "PHI @ ARI",  ARI: "PHI @ ARI",
  SD:  "SD @ CIN",   CIN: "SD @ CIN",
  STL: "STL @ LAD",  LAD: "STL @ LAD",
  SF:  "SF @ PIT",   PIT: "SF @ PIT",
  ATL: "ATL @ WSH",  WSH: "ATL @ WSH",
  MIA: "MIA @ KC",   KC:  "MIA @ KC",
  TOR: "TOR @ CLE",  CLE: "TOR @ CLE"
};

const PARK_FACTORS = {
  "Coors Field":              { rank: 1,  color: "#ff6b35", label: "Extreme HR" },
  "Wrigley Field":            { rank: 2,  color: "#90e0ef", label: "Wind Boost Today" },
  "Great American Ball Park": { rank: 3,  color: "#ff6b35", label: "HR Friendly" },
  "Fenway Park":              { rank: 4,  color: "#ffb347", label: "Slight HR Boost" },
  "Kauffman Stadium":         { rank: 5,  color: "#ffb347", label: "Moderate" },
  "Angel Stadium":            { rank: 6,  color: "#ffb347", label: "Moderate" },
  "Progressive Field":        { rank: 7,  color: "#b0bec5", label: "Neutral" },
  "Nationals Park":           { rank: 8,  color: "#b0bec5", label: "Neutral" },
  "Target Field":             { rank: 9,  color: "#b0bec5", label: "Neutral" },
  "Dodger Stadium":           { rank: 10, color: "#b0bec5", label: "Neutral" },
  "PNC Park":                 { rank: 11, color: "#78909c", label: "Slight Suppressor" },
  "Daikin Park":              { rank: 12, color: "#b0bec5", label: "Dome / Neutral" },
  "Globe Life Field":         { rank: 13, color: "#b0bec5", label: "Dome / Neutral" },
  "Chase Field":              { rank: 14, color: "#b0bec5", label: "Dome / Roof Closed" },
  "Tropicana Field":          { rank: 15, color: "#78909c", label: "Dome / Suppressor" }
};

const CONTEXT_CARDS = [
  {
    icon:  "💣",
    label: "Hughes Disaster Stack",
    note:  "Gabriel Hughes (COL): 0-6, 6.61 ERA, 1.58 WHIP at Coors Field",
    sub:   "6 BAL + COL power bats elevated — best stack of the day"
  },
  {
    icon:  "🌬️",
    label: "Wrigley Wind Alert",
    note:  "WSW 12 mph, 86°F — wind blowing out to right field all game",
    sub:   "MIL hitters (Chourio, Hoskins) get major weather boost at Wrigley"
  },
  {
    icon:  "🤖",
    label: "Yordan Triple Crown Chase",
    note:  "Alvarez: 40 HR, 117 RBI, .321 AVG — leads MLB in all three",
    sub:   "Daikin Park dome + struggling CWS rotation = stack anchor"
  },
  {
    icon:  "💎",
    label: "Best Value: Caminero +590",
    note:  "NYY 1B vs LAA starter (6.03 ERA) at Angel Stadium",
    sub:   "Power righty exploiting career-worst SP — top value play of the slate"
  }
];

const players = [

  // S TIER
  {
    id: 1, name: "Pete Alonso", team: "BAL", tier: "S",
    park: "Coors Field", pitcher: "Gabriel Hughes", pitcherNote: "0-6, 6.61 ERA — worst active SP",
    matchupGrade: "Excellent", estOdds: "+310",
    hr: 38, ops: 0.948, iso: 0.312, avg: 0.268, compositeScore: 94,
    note: "Polar Bear at Coors against a disaster starter. Peak HR environment for 2026.",
    tags: ["🔥 S-Tier", "💥 HR Machine", "🏟️ Coors", "⚠️ Disaster SP"]
  },
  {
    id: 2, name: "Yordan Alvarez", team: "HOU", tier: "S",
    park: "Daikin Park", pitcher: "Erick Fedde", pitcherNote: "5.10 ERA, 1.41 WHIP, HR-prone",
    matchupGrade: "Excellent", estOdds: "+290",
    hr: 40, ops: 1.041, iso: 0.325, avg: 0.321, compositeScore: 97,
    note: "Triple Crown leader at Daikin dome. Fedde allows 1.4 HR/9. Must-play.",
    tags: ["🔥 S-Tier", "💥 Triple Crown", "🏟️ Dome", "📈 EV+"]
  },
  {
    id: 3, name: "Juan Soto", team: "NYM", tier: "S",
    park: "Tropicana Field", pitcher: "Taj Bradley", pitcherNote: "5.11 ERA, 1.35 WHIP on road",
    matchupGrade: "Excellent", estOdds: "+330",
    hr: 34, ops: 1.012, iso: 0.298, avg: 0.305, compositeScore: 92,
    note: "Bradley is a disaster at home — Soto has HR in 3 of last 5 vs TB starters.",
    tags: ["🔥 S-Tier", "💥 Power", "⚠️ Weak SP", "📈 EV+"]
  },
  {
    id: 4, name: "Brent Caminero", team: "NYY", tier: "S",
    park: "Angel Stadium", pitcher: "C. Rodriguez", pitcherNote: "6.03 ERA, 1.52 WHIP — season collapse",
    matchupGrade: "Excellent", estOdds: "+360",
    hr: 29, ops: 0.919, iso: 0.267, avg: 0.281, compositeScore: 88,
    note: "NYY 1B exploiting collapsed LAA starter. Angel Stadium HR-friendly. Best value.",
    tags: ["🔥 S-Tier", "💎 Top Value", "⚠️ Disaster SP", "📈 EV+"]
  },
  {
    id: 5, name: "Jackson Chourio", team: "MIL", tier: "S",
    park: "Wrigley Field", pitcher: "Brandon Wicks", pitcherNote: "4.65 ERA, fly-ball tendency",
    matchupGrade: "Excellent", estOdds: "+340",
    hr: 31, ops: 0.931, iso: 0.278, avg: 0.289, compositeScore: 89,
    note: "Chourio breakout at Wrigley with WSW 12 mph wind. Wicks allows fly balls.",
    tags: ["🔥 S-Tier", "🌬️ Wind Boost", "💥 Power", "⚠️ Fly-Ball SP"]
  },
  {
    id: 6, name: "Coby Mayo", team: "BAL", tier: "S",
    park: "Coors Field", pitcher: "Gabriel Hughes", pitcherNote: "0-6, 6.61 ERA, 1.58 WHIP",
    matchupGrade: "Excellent", estOdds: "+380",
    hr: 26, ops: 0.903, iso: 0.271, avg: 0.259, compositeScore: 87,
    note: "Mayo emerging power at Coors vs Hughes disaster. High ceiling at thin air.",
    tags: ["🔥 S-Tier", "🏟️ Coors", "⚠️ Disaster SP", "📈 EV+"]
  },

  // A TIER
  {
    id: 7, name: "Fernando Tatis Jr.", team: "SD", tier: "A",
    park: "Great American Ball Park", pitcher: "Hunter Greene", pitcherNote: "4.22 ERA, high K/high HR rate",
    matchupGrade: "Great", estOdds: "+420",
    hr: 28, ops: 0.921, iso: 0.261, avg: 0.277, compositeScore: 84,
    note: "GABP boosts power; Greene allows HR despite high K rate. SD stack anchor.",
    tags: ["💥 A-Tier Power", "🏟️ HR Park", "📈 EV+", "⚡ Hot Bat"]
  },
  {
    id: 8, name: "Manny Machado", team: "SD", tier: "A",
    park: "Great American Ball Park", pitcher: "Hunter Greene", pitcherNote: "4.22 ERA",
    matchupGrade: "Great", estOdds: "+440",
    hr: 24, ops: 0.894, iso: 0.241, avg: 0.271, compositeScore: 82,
    note: "Machado veteran IQ at hitter's park. GABP favors right-handed power.",
    tags: ["💥 A-Tier Power", "🏟️ HR Park", "📈 EV+", "🎯 Sharp Value"]
  },
  {
    id: 9, name: "Jackson Merrill", team: "SD", tier: "A",
    park: "Great American Ball Park", pitcher: "Hunter Greene", pitcherNote: "4.22 ERA",
    matchupGrade: "Great", estOdds: "+460",
    hr: 22, ops: 0.877, iso: 0.228, avg: 0.283, compositeScore: 80,
    note: "SD stack play at GABP. Merrill LHB vs RHP Greene with HR-giving rate.",
    tags: ["💥 A-Tier Power", "🏟️ HR Park", "📈 EV+", "⚡ Momentum"]
  },
  {
    id: 10, name: "Gunnar Henderson", team: "BAL", tier: "A",
    park: "Coors Field", pitcher: "Gabriel Hughes", pitcherNote: "0-6, 6.61 ERA",
    matchupGrade: "Excellent", estOdds: "+400",
    hr: 33, ops: 0.962, iso: 0.295, avg: 0.274, compositeScore: 91,
    note: "Henderson SS power at Coors vs Hughes disaster. Top Coors stack piece.",
    tags: ["💥 A-Tier Power", "🏟️ Coors", "⚠️ Disaster SP", "📈 EV+"]
  },
  {
    id: 11, name: "James Wood", team: "WSH", tier: "A",
    park: "Nationals Park", pitcher: "A. Smith-Shawver", pitcherNote: "4.89 ERA, 1.32 WHIP road struggles",
    matchupGrade: "Great", estOdds: "+430",
    hr: 27, ops: 0.908, iso: 0.258, avg: 0.276, compositeScore: 83,
    note: "Wood sophomore surge vs Smith-Shawver who struggles away from ATL.",
    tags: ["💥 A-Tier Power", "📈 EV+", "⚠️ Weak SP", "🎯 Value"]
  },
  {
    id: 12, name: "Matt Olson", team: "ATL", tier: "A",
    park: "Nationals Park", pitcher: "Cole Irvin", pitcherNote: "5.10 ERA, soft-toss fly-ball pitcher",
    matchupGrade: "Great", estOdds: "+410",
    hr: 35, ops: 0.947, iso: 0.292, avg: 0.251, compositeScore: 85,
    note: "Olson punishes fly-ball pitchers — Irvin is tailor-made for his swing.",
    tags: ["💥 A-Tier Power", "📈 EV+", "⚠️ Fly-Ball SP", "⚡ Hot Streak"]
  },
  {
    id: 13, name: "Ronald Acuna Jr.", team: "ATL", tier: "A",
    park: "Nationals Park", pitcher: "Cole Irvin", pitcherNote: "5.10 ERA",
    matchupGrade: "Great", estOdds: "+420",
    hr: 30, ops: 0.951, iso: 0.279, avg: 0.298, compositeScore: 86,
    note: "Acuna elite contact + power vs Irvin. ATL stack anchor at Nationals Park.",
    tags: ["💥 A-Tier Power", "📈 EV+", "⚡ Elite Speed", "🎯 Stack Anchor"]
  },
  {
    id: 14, name: "Francisco Lindor", team: "NYM", tier: "A",
    park: "Tropicana Field", pitcher: "Taj Bradley", pitcherNote: "5.11 ERA",
    matchupGrade: "Great", estOdds: "+440",
    hr: 26, ops: 0.891, iso: 0.248, avg: 0.269, compositeScore: 81,
    note: "NYM stack with Soto. Bradley disaster allows 1.2 HR/9 at Tropicana.",
    tags: ["💥 A-Tier Power", "⚠️ Weak SP", "📈 EV+", "🎯 Stack Piece"]
  },
  {
    id: 15, name: "Spencer Torkelson", team: "DET", tier: "A",
    park: "Target Field", pitcher: "Connor Prielipp", pitcherNote: "5.55 ERA, 1.48 WHIP — worst in AL",
    matchupGrade: "Great", estOdds: "+430",
    hr: 31, ops: 0.924, iso: 0.272, avg: 0.261, compositeScore: 84,
    note: "Tork power vs Prielipp disaster. Target Field neutral but SP is a gift.",
    tags: ["💥 A-Tier Power", "⚠️ Disaster SP", "📈 EV+", "🎯 Value Pick"]
  },
  {
    id: 16, name: "Kyle Schwarber", team: "PHI", tier: "A",
    park: "Chase Field", pitcher: "Brandon Pfaadt", pitcherNote: "4.65 ERA, 1.29 WHIP",
    matchupGrade: "Good", estOdds: "+450",
    hr: 32, ops: 0.934, iso: 0.281, avg: 0.231, compositeScore: 82,
    note: "Schwarber LHB power at dome park. Pfaadt solid but hittable in dome conditions.",
    tags: ["💥 A-Tier Power", "🏟️ Dome", "📈 EV+", "💥 Pull Power"]
  },
  {
    id: 17, name: "Hunter Goodman", team: "COL", tier: "A",
    park: "Coors Field", pitcher: "Kyle Bradish", pitcherNote: "4.12 ERA, road splits weaker",
    matchupGrade: "Great", estOdds: "+420",
    hr: 29, ops: 0.912, iso: 0.265, avg: 0.278, compositeScore: 83,
    note: "COL catcher at home — Coors altitude turns raw power into HRs vs Bradish.",
    tags: ["💥 A-Tier Power", "🏟️ Coors", "📈 EV+", "🎯 Home Stack"]
  },
  {
    id: 18, name: "Michael Harris II", team: "ATL", tier: "A",
    park: "Nationals Park", pitcher: "Cole Irvin", pitcherNote: "5.10 ERA",
    matchupGrade: "Great", estOdds: "+460",
    hr: 25, ops: 0.888, iso: 0.242, avg: 0.284, compositeScore: 80,
    note: "ATL CF power emerging vs soft Irvin. Third ATL stack piece.",
    tags: ["💥 A-Tier Power", "📈 EV+", "⚠️ Fly-Ball SP", "⚡ Emerging"]
  },
  {
    id: 19, name: "Nomar Murakami", team: "CWS", tier: "A",
    park: "Daikin Park", pitcher: "Framber Valdez", pitcherNote: "2.85 ERA — HOU ace, tough draw",
    matchupGrade: "Good", estOdds: "+470",
    hr: 23, ops: 0.876, iso: 0.236, avg: 0.258, compositeScore: 78,
    note: "Dome park with elite exit velocity. Valdez tough but Daikin dome lifts floor.",
    tags: ["💥 A-Tier Power", "🏟️ Dome", "📈 EV+", "⚡ Raw Power"]
  },
  {
    id: 20, name: "Kerry Carpenter", team: "DET", tier: "A",
    park: "Target Field", pitcher: "Connor Prielipp", pitcherNote: "5.55 ERA — DET's best matchup",
    matchupGrade: "Great", estOdds: "+450",
    hr: 22, ops: 0.871, iso: 0.239, avg: 0.263, compositeScore: 79,
    note: "Carpenter LHB punishes Prielipp disaster. DET stack piece with Torkelson.",
    tags: ["💥 A-Tier Power", "⚠️ Disaster SP", "📈 EV+", "🎯 Stack Piece"]
  },

  // B TIER
  {
    id: 21, name: "Shohei Ohtani", team: "LAD", tier: "B",
    park: "Dodger Stadium", pitcher: "Michael McGreevy", pitcherNote: "3.86 ERA, STL RHP — solid",
    matchupGrade: "Good", estOdds: "+520",
    hr: 41, ops: 1.028, iso: 0.335, avg: 0.312, compositeScore: 76,
    note: "Ohtani raw power but McGreevy is a legitimate pitcher. Neutral park limits ceiling.",
    tags: ["💥 HR Leader", "📈 EV+", "🎯 Power Bat", "⚡ Elite"]
  },
  {
    id: 22, name: "Jordan Walker", team: "STL", tier: "B",
    park: "Dodger Stadium", pitcher: "Eric Lauer", pitcherNote: "4.79 ERA, LHP vs RHH advantage",
    matchupGrade: "Good", estOdds: "+540",
    hr: 20, ops: 0.862, iso: 0.231, avg: 0.271, compositeScore: 74,
    note: "Walker RHB vs LHP Lauer — favorable split at Dodger Stadium.",
    tags: ["💥 Power", "📈 EV+", "🎯 Platoon Edge", "⚡ Emerging"]
  },
  {
    id: 23, name: "Cedric Mullins", team: "BAL", tier: "B",
    park: "Coors Field", pitcher: "Gabriel Hughes", pitcherNote: "0-6, 6.61 ERA",
    matchupGrade: "Great", estOdds: "+560",
    hr: 18, ops: 0.841, iso: 0.211, avg: 0.261, compositeScore: 72,
    note: "Mullins CF at Coors with Hughes disaster. Lower power boosted by park.",
    tags: ["🏟️ Coors", "⚠️ Disaster SP", "📈 EV+", "🎯 Deep Stack"]
  },
  {
    id: 24, name: "Samuel Basallo", team: "BAL", tier: "B",
    park: "Coors Field", pitcher: "Gabriel Hughes", pitcherNote: "0-6, 6.61 ERA",
    matchupGrade: "Great", estOdds: "+580",
    hr: 17, ops: 0.838, iso: 0.208, avg: 0.254, compositeScore: 71,
    note: "Basallo catcher power prospect at Coors. Hughes serves up altitude bombs.",
    tags: ["🏟️ Coors", "⚠️ Disaster SP", "📈 EV+", "⚡ Prospect Power"]
  },
  {
    id: 25, name: "Mark Vientos", team: "NYM", tier: "B",
    park: "Tropicana Field", pitcher: "Taj Bradley", pitcherNote: "5.11 ERA",
    matchupGrade: "Good", estOdds: "+560",
    hr: 21, ops: 0.869, iso: 0.243, avg: 0.251, compositeScore: 73,
    note: "NYM 3rd piece with Soto and Lindor vs Bradley. Trop dome play.",
    tags: ["💥 Power", "⚠️ Weak SP", "📈 EV+", "🎯 Stack Piece"]
  },
  {
    id: 26, name: "Rhys Hoskins", team: "MIL", tier: "B",
    park: "Wrigley Field", pitcher: "Brandon Wicks", pitcherNote: "4.65 ERA, fly-ball SP",
    matchupGrade: "Good", estOdds: "+550",
    hr: 24, ops: 0.891, iso: 0.258, avg: 0.241, compositeScore: 74,
    note: "Hoskins power at Wrigley with wind blowing out. Wicks fly-ball rate elevated.",
    tags: ["💥 Power", "🌬️ Wind Boost", "📈 EV+", "🎯 Stack Piece"]
  },
  {
    id: 27, name: "Ezequiel Tovar", team: "COL", tier: "B",
    park: "Coors Field", pitcher: "Kyle Bradish", pitcherNote: "4.12 ERA, road splits worse",
    matchupGrade: "Good", estOdds: "+580",
    hr: 19, ops: 0.849, iso: 0.218, avg: 0.271, compositeScore: 70,
    note: "COL SS at home in thin air. Bradish road splits weaker than home ERA.",
    tags: ["🏟️ Coors", "📈 EV+", "🎯 Home Stack", "⚡ Speed + Power"]
  },
  {
    id: 28, name: "Brenton Doyle", team: "COL", tier: "B",
    park: "Coors Field", pitcher: "Kyle Bradish", pitcherNote: "4.12 ERA",
    matchupGrade: "Good", estOdds: "+590",
    hr: 16, ops: 0.832, iso: 0.201, avg: 0.258, compositeScore: 69,
    note: "Doyle CF at Coors — lower ISO but the park does the heavy lifting.",
    tags: ["🏟️ Coors", "📈 EV+", "🎯 COL Stack", "⚡ Speed"]
  },
  {
    id: 29, name: "Jose Ramirez", team: "CLE", tier: "B",
    park: "Progressive Field", pitcher: "Jose Berrios", pitcherNote: "4.81 ERA, 1.25 WHIP",
    matchupGrade: "Good", estOdds: "+530",
    hr: 27, ops: 0.932, iso: 0.269, avg: 0.291, compositeScore: 75,
    note: "JRam elite bat at home vs Berrios who gives up HRs to left-side hitters.",
    tags: ["💥 Power", "📈 EV+", "⚡ Elite Hitter", "🎯 Stack Anchor"]
  },
  {
    id: 30, name: "Rafael Devers", team: "SF", tier: "B",
    park: "PNC Park", pitcher: "Paul Skenes", pitcherNote: "2.45 ERA — PIT elite ace",
    matchupGrade: "Fair", estOdds: "+620",
    hr: 28, ops: 0.901, iso: 0.253, avg: 0.257, compositeScore: 68,
    note: "Devers raw power but Skenes is elite. PNC slight suppressor. Moderate risk.",
    tags: ["💥 Power", "🎯 Raw Power", "📈 EV+", "⚡ High Ceiling"]
  },
  {
    id: 31, name: "Eugenio Suarez", team: "CIN", tier: "B",
    park: "Great American Ball Park", pitcher: "Joe Musgrove", pitcherNote: "4.55 ERA, injury-limited",
    matchupGrade: "Good", estOdds: "+570",
    hr: 25, ops: 0.879, iso: 0.247, avg: 0.244, compositeScore: 72,
    note: "Suarez at home GABP vs rusty Musgrove coming off IL. Park elevates ceiling.",
    tags: ["💥 Power", "🏟️ HR Park", "⚠️ Weak SP", "📈 EV+"]
  },
  {
    id: 32, name: "Harold Castro", team: "COL", tier: "B",
    park: "Coors Field", pitcher: "Kyle Bradish", pitcherNote: "4.12 ERA",
    matchupGrade: "Good", estOdds: "+610",
    hr: 14, ops: 0.818, iso: 0.192, avg: 0.272, compositeScore: 67,
    note: "Castro utility at Coors — park lifts modest power to B tier.",
    tags: ["🏟️ Coors", "📈 EV+", "🎯 Park Play", "⚡ Contact"]
  },
  {
    id: 33, name: "Jordan Lawlar", team: "ARI", tier: "B",
    park: "Chase Field", pitcher: "Aaron Nola", pitcherNote: "5.03 ERA, worst ERA of career",
    matchupGrade: "Good", estOdds: "+560",
    hr: 20, ops: 0.864, iso: 0.231, avg: 0.272, compositeScore: 73,
    note: "Lawlar speed + power vs struggling Nola at dome Chase Field.",
    tags: ["💥 Power", "🏟️ Dome", "⚠️ Weak SP", "📈 EV+"]
  },
  {
    id: 34, name: "Corbin Carroll", team: "ARI", tier: "B",
    park: "Chase Field", pitcher: "Aaron Nola", pitcherNote: "5.03 ERA",
    matchupGrade: "Good", estOdds: "+580",
    hr: 19, ops: 0.856, iso: 0.221, avg: 0.281, compositeScore: 71,
    note: "Carroll LHB at dome vs Nola career-worst season. ARI stack play.",
    tags: ["💥 Power", "🏟️ Dome", "⚠️ Weak SP", "⚡ Speed + Power"]
  },
  {
    id: 35, name: "Riley Greene", team: "DET", tier: "B",
    park: "Target Field", pitcher: "Connor Prielipp", pitcherNote: "5.55 ERA",
    matchupGrade: "Good", estOdds: "+550",
    hr: 23, ops: 0.878, iso: 0.244, avg: 0.276, compositeScore: 73,
    note: "Greene LHB vs Prielipp disaster. DET 3rd stack piece.",
    tags: ["💥 Power", "⚠️ Disaster SP", "📈 EV+", "🎯 Stack Piece"]
  },
  {
    id: 36, name: "Jake Fraley", team: "CIN", tier: "B",
    park: "Great American Ball Park", pitcher: "Joe Musgrove", pitcherNote: "4.55 ERA",
    matchupGrade: "Good", estOdds: "+590",
    hr: 18, ops: 0.848, iso: 0.218, avg: 0.261, compositeScore: 70,
    note: "Fraley at home GABP — consistent power threat vs fading Musgrove.",
    tags: ["💥 Power", "🏟️ HR Park", "📈 EV+", "🎯 Home Value"]
  },
  {
    id: 37, name: "Vladimir Guerrero Jr.", team: "TOR", tier: "B",
    park: "Progressive Field", pitcher: "Shane Bieber", pitcherNote: "3.98 ERA, CLE veteran ace",
    matchupGrade: "Fair", estOdds: "+600",
    hr: 30, ops: 0.918, iso: 0.261, avg: 0.271, compositeScore: 70,
    note: "VGJ power but Bieber is quality. Road at neutral Progressive Field.",
    tags: ["💥 Power", "📈 EV+", "⚡ Raw Power", "🎯 High Ceiling"]
  },
  {
    id: 38, name: "Jorge Soler", team: "MIA", tier: "B",
    park: "Kauffman Stadium", pitcher: "Cole Ragans", pitcherNote: "3.82 ERA, tough LHP matchup",
    matchupGrade: "Fair", estOdds: "+610",
    hr: 24, ops: 0.881, iso: 0.249, avg: 0.243, compositeScore: 68,
    note: "Soler power at neutral Kauffman vs solid Ragans. Boom-or-bust ceiling.",
    tags: ["💥 Power", "🎯 Raw Power", "📈 EV+", "⚡ Boom-or-Bust"]
  },
  {
    id: 39, name: "Yandy Diaz", team: "TB", tier: "B",
    park: "Tropicana Field", pitcher: "Jose Manaea", pitcherNote: "4.55 ERA, NYM LHP",
    matchupGrade: "Good", estOdds: "+570",
    hr: 15, ops: 0.842, iso: 0.198, avg: 0.284, compositeScore: 68,
    note: "Diaz RHB at dome Tropicana vs LHP Manaea. Decent platoon matchup.",
    tags: ["💥 Power", "🏟️ Dome", "📈 EV+", "🎯 Platoon Edge"]
  },
  {
    id: 40, name: "Colton Cowser", team: "BAL", tier: "B",
    park: "Coors Field", pitcher: "Gabriel Hughes", pitcherNote: "0-6, 6.61 ERA",
    matchupGrade: "Great", estOdds: "+590",
    hr: 21, ops: 0.871, iso: 0.234, avg: 0.258, compositeScore: 72,
    note: "Cowser LHB at Coors vs Hughes disaster. 6th BAL stack option.",
    tags: ["🏟️ Coors", "⚠️ Disaster SP", "📈 EV+", "🎯 Deep Stack"]
  },

  // C TIER
  {
    id: 41, name: "Samad Taylor", team: "SD", tier: "C",
    park: "Great American Ball Park", pitcher: "Hunter Greene", pitcherNote: "4.22 ERA, high K rate",
    matchupGrade: "Fair", estOdds: "+950",
    hr: 8, ops: 0.771, iso: 0.158, avg: 0.241, compositeScore: 48,
    note: "Low power floor but GABP park factor and Greene HR rate give longshot appeal.",
    tags: ["⛔ Low Floor", "🏟️ HR Park", "🎰 Longshot", "📈 Park Boost"]
  },
  {
    id: 42, name: "Austin Hays", team: "BAL", tier: "C",
    park: "Coors Field", pitcher: "Gabriel Hughes", pitcherNote: "0-6, 6.61 ERA",
    matchupGrade: "Fair", estOdds: "+1100",
    hr: 9, ops: 0.749, iso: 0.148, avg: 0.231, compositeScore: 44,
    note: "Hays deep BAL bench option at Coors. Speculative 7th-stack piece.",
    tags: ["⛔ Low Floor", "🏟️ Coors", "🎰 Speculative", "⚠️ Disaster SP"]
  },
  {
    id: 43, name: "Dylan Lile", team: "WSH", tier: "C",
    park: "Nationals Park", pitcher: "A. Smith-Shawver", pitcherNote: "4.89 ERA, road struggles",
    matchupGrade: "Fair", estOdds: "+1050",
    hr: 7, ops: 0.741, iso: 0.152, avg: 0.237, compositeScore: 42,
    note: "Lile speculative WSH upside vs struggling Smith-Shawver. Long-odds play.",
    tags: ["⛔ Low Floor", "🎰 Longshot", "⚠️ Weak SP", "📈 Upside"]
  },
  {
    id: 44, name: "Pete Crow-Armstrong", team: "CHC", tier: "C",
    park: "Wrigley Field", pitcher: "Kyle Henderson", pitcherNote: "2.48 ERA, MIL elite arm",
    matchupGrade: "Poor", estOdds: "+1200",
    hr: 11, ops: 0.788, iso: 0.171, avg: 0.261, compositeScore: 40,
    note: "PCA speed/contact at Wrigley but Henderson 2.48 ERA is a brutal draw.",
    tags: ["⛔ Tough SP", "🌬️ Wind Factor", "🎰 Longshot", "⚡ Speed Play"]
  },
  {
    id: 45, name: "Seiya Suzuki", team: "CHC", tier: "C",
    park: "Wrigley Field", pitcher: "Kyle Henderson", pitcherNote: "2.48 ERA",
    matchupGrade: "Poor", estOdds: "+1150",
    hr: 13, ops: 0.804, iso: 0.183, avg: 0.268, compositeScore: 42,
    note: "Suzuki contact skills at Wrigley with wind, but Henderson is elite.",
    tags: ["⛔ Tough SP", "🌬️ Wind Factor", "🎰 Longshot", "⚡ Contact"]
  },
  {
    id: 46, name: "Oneil Cruz", team: "PIT", tier: "C",
    park: "PNC Park", pitcher: "Logan Webb", pitcherNote: "2.86 ERA, SF ace groundball SP",
    matchupGrade: "Poor", estOdds: "+1300",
    hr: 12, ops: 0.781, iso: 0.172, avg: 0.228, compositeScore: 38,
    note: "Cruz elite exit velocity but Webb is a groundball machine at suppressor park.",
    tags: ["⛔ Tough SP", "⛔ Suppressor Park", "🎰 Longshot", "💥 Elite EV"]
  },
  {
    id: 47, name: "Elly De La Cruz", team: "CIN", tier: "C",
    park: "Great American Ball Park", pitcher: "Joe Musgrove", pitcherNote: "4.55 ERA",
    matchupGrade: "Fair", estOdds: "+1000",
    hr: 14, ops: 0.798, iso: 0.188, avg: 0.249, compositeScore: 46,
    note: "De La Cruz raw power at GABP vs Musgrove. Lower consistency limits floor.",
    tags: ["⛔ Low Floor", "🏟️ HR Park", "🎰 Longshot", "💥 Raw Power"]
  },
  {
    id: 48, name: "Bo Bichette", team: "TOR", tier: "C",
    park: "Progressive Field", pitcher: "Shane Bieber", pitcherNote: "3.98 ERA, veteran ace",
    matchupGrade: "Fair", estOdds: "+1100",
    hr: 10, ops: 0.769, iso: 0.162, avg: 0.252, compositeScore: 40,
    note: "Bichette contact-first but Bieber limits HRs. Road at neutral park.",
    tags: ["⛔ Tough SP", "🎰 Longshot", "📈 Contact", "⚡ Momentum"]
  },
  {
    id: 49, name: "Brendan Donovan", team: "STL", tier: "C",
    park: "Dodger Stadium", pitcher: "Eric Lauer", pitcherNote: "4.79 ERA, LHP",
    matchupGrade: "Fair", estOdds: "+1000",
    hr: 8, ops: 0.761, iso: 0.155, avg: 0.264, compositeScore: 43,
    note: "Donovan RHB at Dodger Stadium vs LHP Lauer. Marginal power profile.",
    tags: ["⛔ Low Floor", "🎰 Longshot", "🎯 Platoon Edge", "📈 Upside"]
  },
  {
    id: 50, name: "Willi Adames", team: "SF", tier: "C",
    park: "PNC Park", pitcher: "Paul Skenes", pitcherNote: "2.45 ERA — PIT elite ace",
    matchupGrade: "Poor", estOdds: "+1250",
    hr: 15, ops: 0.802, iso: 0.179, avg: 0.241, compositeScore: 39,
    note: "Adames power hindered by Skenes elite stuff and PNC suppressor conditions.",
    tags: ["⛔ Tough SP", "⛔ Suppressor Park", "🎰 Longshot", "💥 Power"]
  }
];

const parlays = [
  {
    id: "4A", legs: 4, label: "4-Leg Core Value",
    risk: "Lower Risk", riskColor: "#4caf50", estPayout: "+800",
    description: "4 elite S-tier picks across the two best matchups of the day.",
    playerIds: [1, 3, 4, 6],
    strategy: "Alonso + Mayo at Coors, Soto vs Bradley disaster, Caminero top value. Best entry-point parlay on the slate."
  },
  {
    id: "4B", legs: 4, label: "4-Leg Alternate",
    risk: "Lower Risk", riskColor: "#4caf50", estPayout: "+800",
    description: "Coors top tier plus Henderson and Mullins for depth.",
    playerIds: [1, 6, 10, 23],
    strategy: "Alonso + Mayo anchor Coors, Henderson adds A-tier power, Mullins is the 4th BAL Coors piece for stack diversity."
  },
  {
    id: "5A", legs: 5, label: "5-Leg S-Tier Stack",
    risk: "Lower Risk", riskColor: "#4caf50", estPayout: "+1800",
    description: "All 5 top S-tier players in a single parlay.",
    playerIds: [1, 2, 3, 4, 5],
    strategy: "Pure S-tier play: Alonso/Coors, Alvarez/Dome, Soto/Bradley, Caminero/Value, Chourio/Wind. Safest 5-leg on the board."
  },
  {
    id: "5B", legs: 5, label: "5-Leg Mixed Stack",
    risk: "Medium Risk", riskColor: "#ff9800", estPayout: "+1800",
    description: "A/S mix across GABP, Dome, and Progressive Field.",
    playerIds: [19, 7, 16, 2, 29],
    strategy: "Murakami + Tatis GABP + Schwarber dome + Alvarez + JRam. Diversifies across 4 parks for reduced correlation risk."
  },
  {
    id: "5C", legs: 5, label: "5-Leg Value Parlay",
    risk: "Medium Risk", riskColor: "#ff9800", estPayout: "+2200",
    description: "S-tier core with Torkelson and Cowser upside.",
    playerIds: [1, 4, 3, 15, 40],
    strategy: "Alonso + Caminero + Soto as anchors, add Torkelson vs Prielipp disaster and Cowser Coors deep stack. Value-forward 5-leg."
  },
  {
    id: "6A", legs: 6, label: "6-Leg S-Tier Pure",
    risk: "Lower Risk", riskColor: "#4caf50", estPayout: "+2500",
    description: "All 6 S-tier players in one parlay.",
    playerIds: [1, 2, 3, 4, 5, 6],
    strategy: "Complete S-tier sweep: Coors stack (Alonso + Mayo), Alvarez dome, Soto vs Bradley, Caminero value, Chourio wind. Cleanest 6-leg lineup."
  },
  {
    id: "6B", legs: 6, label: "6-Leg Mixed Stack",
    risk: "Lower Risk", riskColor: "#4caf50", estPayout: "+2800",
    description: "S-tier core with Torkelson, Walker, Lawlar added.",
    playerIds: [1, 4, 3, 15, 22, 33],
    strategy: "Alonso + Caminero + Soto + Torkelson vs Prielipp + Walker LHB vs Lauer + Lawlar dome play. 4-park spread."
  },
  {
    id: "7A", legs: 7, label: "7-Leg Core Chain",
    risk: "Medium Risk", riskColor: "#ff9800", estPayout: "+4000",
    description: "6 S-tier plus Tatis at GABP.",
    playerIds: [1, 2, 3, 4, 5, 6, 7],
    strategy: "Full S-tier block with Tatis as the 7th piece. Concentrated on best disasters + GABP power. Flagship 7-leg."
  },
  {
    id: "7B", legs: 7, label: "7-Leg Coors + ATL Mix",
    risk: "Medium Risk", riskColor: "#ff9800", estPayout: "+4500",
    description: "Coors stack, ATL WSH duo, Tatis, JRam added.",
    playerIds: [1, 5, 7, 10, 11, 12, 29],
    strategy: "Alonso + Chourio anchors, Tatis GABP + Henderson Coors, JWood + Olson ATL stack at WSH, JRam home. 5-park diversity."
  },
  {
    id: "7C", legs: 7, label: "7-Leg Diverse Stack",
    risk: "Medium Risk", riskColor: "#ff9800", estPayout: "+5000",
    description: "A-tier power across 5 different parks.",
    playerIds: [16, 17, 8, 19, 21, 29, 12],
    strategy: "Schwarber dome + Goodman Coors + Machado GABP + Murakami dome + Ohtani Dodger + JRam home + Olson WSH. Maximum park diversity."
  },
  {
    id: "8A", legs: 8, label: "8-Leg Power Stack",
    risk: "Medium-High Risk", riskColor: "#ff5722", estPayout: "+6500",
    description: "All S-tier plus Henderson and Tatis — best 8 on the board.",
    playerIds: [1, 2, 3, 4, 5, 6, 7, 10],
    strategy: "S-tier sweep plus Henderson (Coors) and Tatis (GABP) as the two A-tier adds. Highest quality 8-leg possible on this slate."
  },
  {
    id: "8B", legs: 8, label: "8-Leg A-Tier Chain",
    risk: "Medium-High Risk", riskColor: "#ff5722", estPayout: "+7500",
    description: "8 A-tier players across GABP, Coors, WSH, Trop, Target.",
    playerIds: [7, 8, 9, 10, 12, 13, 14, 15],
    strategy: "Full SD GABP stack (Tatis + Machado + Merrill), Henderson Coors, Olson + Acuna WSH, Lindor Trop, Torkelson vs Prielipp disaster."
  },
  {
    id: "9A", legs: 9, label: "9-Leg Elite Chain",
    risk: "High Risk", riskColor: "#e91e63", estPayout: "+12000",
    description: "All 6 S-tier plus Henderson, Tatis, and Lindor.",
    playerIds: [1, 2, 3, 4, 5, 6, 7, 10, 14],
    strategy: "Complete S sweep + 3 elite A-tier adds. Henderson and Tatis at best parks, Lindor stacks with Soto vs Bradley. Premium 9-leg."
  },
  {
    id: "9B", legs: 9, label: "9-Leg Chaos Stack",
    risk: "High Risk", riskColor: "#e91e63", estPayout: "+15000",
    description: "A/B mix across 6 parks with C-tier chaos add.",
    playerIds: [16, 17, 19, 21, 29, 33, 34, 39, 41],
    strategy: "Schwarber + Goodman + Murakami + Ohtani + JRam + Lawlar + Carroll + YDiaz + Taylor (C longshot). Wide park diversification for max chaos upside."
  },
  {
    id: "10A", legs: 10, label: "10-Leg Max Parlay",
    risk: "Max Risk", riskColor: "#9c27b0", estPayout: "+25000",
    description: "Full slate max — 5 S-tier + 2 A-tier + 3 C-tier longshots.",
    playerIds: [1, 2, 3, 4, 5, 7, 10, 41, 46, 48],
    strategy: "S-tier sweep minus Mayo, add Tatis + Henderson A-tier, then 3 C-tier chaos picks (Taylor GABP, Cruz PNC, Bichette Progressive) to maximize payout multiplier."
  }
];
