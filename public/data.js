const TEAM_TO_GAME = {
  TB:  "TB@CLE",   CLE: "TB@CLE",
  LAA: "LAA@CWS",  CWS: "LAA@CWS",
  SEA: "SEA@MIN",  MIN: "SEA@MIN",
  NYY: "NYY@TEX",  TEX: "NYY@TEX",
  BOS: "BOS@TOR",  TOR: "BOS@TOR",
  MIA: "MIA@LAD",  LAD: "MIA@LAD",
  CHC: "CHC@SD",   SD:  "CHC@SD",
  HOU: "HOU@BAL",  BAL: "HOU@BAL",
  STL: "STL@PIT",  PIT: "STL@PIT",
  SF:  "SF@PHI",   PHI: "SF@PHI",
  COL: "COL@CIN",  CIN: "COL@CIN",
  WSH: "WSH@NYM",  NYM: "WSH@NYM",
  DET: "DET@ATL",  ATL: "DET@ATL",
  AZ:  "AZ@MIL",   MIL: "AZ@MIL",
  KC:  "KC@ATH",   ATH: "KC@ATH",
};

const SLATE_DATE  = "APRIL 29, 2026";
const SLATE_LABEL = "WEDNESDAY MLB SLATE";

const CONTEXT_CARDS = [
  {
    icon: "💣",
    label: "Disaster Arms — Dome Edition",
    note: "Eovaldi 5.79 ERA (Globe Life), Lauer 6.75 ERA (Rogers), Bello 9.00 ERA",
    sub: "Three dome/roof games hide SP implosions: NYY sluggers get Eovaldi, TOR hitters feast on Lauer's 6.75 ERA — no wind to blame when they go deep indoors."
  },
  {
    icon: "🔥",
    label: "Great American Ball Park",
    note: "#1 HR Park — 75°F Warm, Williamson 5.40 ERA vs COL",
    sub: "COL@CIN: GABP + 75°F warm air + Brandon Williamson's bleeding 5.40 ERA = certified disaster start for a Reds lineup that mashes left-handers at home."
  },
  {
    icon: "💨",
    label: "Progressive Field",
    note: "Wind Out 9mph / 65°F — TB@CLE Afternoon",
    sub: "Afternoon wind blowing out at Progressive Field boosts both lineups; Gavin Williams' 3.28 ERA masks a climbing FB rate against a Rays lineup with elite barrel metrics."
  },
  {
    icon: "🌅",
    label: "Dodger Stadium",
    note: "Wind Out 9mph R-CF — MIA@LAD, Alcantara 3.05 ERA",
    sub: "Glasnow is elite but the Dodger lineup is the most dangerous in baseball — Ohtani, Hernandez, and Acuna Jr. obliterate soft-contact pitchers and the outbound wind turns line drives into home runs."
  },
];

const PARK_FACTORS = {
  "Great American Ball Park":      { rank: 1,  label: "🔥 #1 HR Park — 75°F Warm",           color: "#ff6b35" },
  "Progressive Field":             { rank: 2,  label: "💨 #2 — Wind Out 9mph / 65°F",         color: "#90e0ef" },
  "UNIQLO Field at Dodger Stadium":{ rank: 3,  label: "💨 #3 — Wind Out 9mph / 65°F",         color: "#90e0ef" },
  "Truist Park":                   { rank: 4,  label: "🌤️ #4 — Warm 77°F / 4mph Soft",        color: "#ffb347" },
  "Citizens Bank Park":            { rank: 5,  label: "💨 #5 — Wind Out 5mph / 61°F",         color: "#90e0ef" },
  "Citi Field":                    { rank: 6,  label: "💨 #6 — Wind Soft Out / 57°F",         color: "#90e0ef" },
  "PNC Park":                      { rank: 7,  label: "🌤️ Neutral — 71°F / Soft Out",         color: "#b0bec5" },
  "Oriole Park at Camden Yards":   { rank: 8,  label: "🌤️ Neutral — 63°F / SE 6mph",         color: "#b0bec5" },
  "Target Field":                  { rank: 9,  label: "🌤️ Neutral — 55°F / Calm",             color: "#b0bec5" },
  "Globe Life Field":              { rank: 10, label: "🏟️ Dome/Roof Closed",                  color: "#b0bec5" },
  "Rogers Centre":                 { rank: 11, label: "🏟️ Dome/Roof Closed",                  color: "#b0bec5" },
  "American Family Field":         { rank: 12, label: "🏟️ Dome/Roof Closed",                  color: "#b0bec5" },
  "Sutter Health Park":            { rank: 13, label: "🌤️ Neutral — 75°F / 2mph Calm",        color: "#b0bec5" },
  "Rate Field":                    { rank: 14, label: "🌬️ Crosswind L-R 11mph — No Boost",    color: "#78909c" },
  "Petco Park":                    { rank: 15, label: "🌬️ Wind IN from Left — Suppressor",    color: "#78909c" },
};

const players = [

  // ── COL@CIN — Great American Ball Park — 75°F — Williamson 5.40 ERA ──
  {
    id: 1,
    name: "Elly De La Cruz",
    team: "CIN",
    tier: "S",
    park: "Great American Ball Park",
    pitcher: "Tomoyuki Sugano",
    pitcherNote: "Sugano: ERA-to-xERA gap still wide, elevated FB rate all season",
    matchupGrade: "A+",
    estOdds: "+300",
    note: "De La Cruz owns a 95th-percentile exit velocity and is the most electric HR threat in the NL, having homered multiple times in recent outings. GABP's 75°F warm air and his pull-power profile against a fly-ball-prone righty make this the #1 play on the slate.",
    tags: ["👑 MVP/Elite", "🔥 Hot", "💣 SP Disaster"]
  },
  {
    id: 2,
    name: "Spencer Steer",
    team: "CIN",
    tier: "S",
    park: "Great American Ball Park",
    pitcher: "Tomoyuki Sugano",
    pitcherNote: "Sugano: high FB% and xERA gap telegraphing regression",
    matchupGrade: "A+",
    estOdds: "+340",
    note: "Steer is posting a .540+ home SLG at GABP and thrives in warm-weather power environments against right-handed pitching. Sugano's elevated fly-ball rate in this cozy outfield at 75°F is pure free real estate.",
    tags: ["🔥 Hot", "💣 SP Disaster"]
  },
  {
    id: 3,
    name: "Tyler Stephenson",
    team: "CIN",
    tier: "A",
    park: "Great American Ball Park",
    pitcher: "Tomoyuki Sugano",
    pitcherNote: "Sugano: righty giving up elevated HR rate to LHB this season",
    matchupGrade: "A",
    estOdds: "+420",
    note: "Stephenson has been raking from the left side with elite contact quality and is posting a top-10 weekly EV among catchers in April. GABP is the league's best HR park for lefties and Sugano's FB% spikes vs. LHB.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 4,
    name: "Jonathan India",
    team: "CIN",
    tier: "A",
    park: "Great American Ball Park",
    pitcher: "Tomoyuki Sugano",
    pitcherNote: "Sugano: ISO allowed spiking in April, 1.1+ HR/9 in road starts",
    matchupGrade: "A",
    estOdds: "+400",
    note: "India is a lefty pull machine at GABP with a career .570 SLG at home, and has been one of the best-performing hitters in early-season Statcast contact metrics. Sugano's HR/9 on the road is elite giveaway territory at this park.",
    tags: ["🔥 Hot", "💣 SP Disaster"]
  },
  {
    id: 5,
    name: "Austin Wynns",
    team: "CIN",
    tier: "B",
    park: "Great American Ball Park",
    pitcher: "Tomoyuki Sugano",
    pitcherNote: "Sugano: righty with climbing HR allowed rate in April",
    matchupGrade: "B+",
    estOdds: "+600",
    note: "Wynns is a stack completor with solid home power metrics against right-handed pitching at GABP. He's a lottery-tier addition to any CIN stack at this park.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 6,
    name: "Ryan Noda",
    team: "COL",
    tier: "B",
    park: "Great American Ball Park",
    pitcher: "Brandon Williamson",
    pitcherNote: "Williamson: 5.40 ERA / elevated BB/9 — command disaster",
    matchupGrade: "B+",
    estOdds: "+500",
    note: "Noda is a patient lefty slugger who gets on-base at an elite rate and has surprising pop against southpaws with a pull-side swing built for GABP's short right-center porch. Williamson's 5.40 ERA and wild command issues make him a compelling stack target.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },

  // ── TB@CLE — Progressive Field — Wind Out 9mph — Rasmussen vs Williams ──
  {
    id: 7,
    name: "Jose Ramirez",
    team: "CLE",
    tier: "S",
    park: "Progressive Field",
    pitcher: "Drew Rasmussen",
    pitcherNote: "Rasmussen: 2-0 but only 26 K in 2026, elevated HR/9 rate",
    matchupGrade: "A+",
    estOdds: "+290",
    note: "Ramirez is the AL's all-time games-played leader for Cleveland and continues to produce at an MVP level with a 97th-percentile barrel rate and elite pull power to left-center. The 9-mph outbound wind at Progressive Field's afternoon slot turns his line-drive profile into a no-doubter machine.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "🔥 Hot"]
  },
  {
    id: 8,
    name: "Junior Caminero",
    team: "TB",
    tier: "S",
    park: "Progressive Field",
    pitcher: "Gavin Williams",
    pitcherNote: "Williams: climbing FB% in April, 1.1+ HR/9 in last 4 starts",
    matchupGrade: "A",
    estOdds: "+310",
    note: "Caminero leads the Rays in barrels and hits the ball as hard as anyone in baseball with a 96th-percentile exit velocity, making him lethal against any FB-heavy arm. The afternoon wind boost at Progressive converts his raw power into a Tier-S must-play.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "🔥 Hot"]
  },
  {
    id: 9,
    name: "Josh Naylor",
    team: "CLE",
    tier: "A",
    park: "Progressive Field",
    pitcher: "Drew Rasmussen",
    pitcherNote: "Rasmussen: only 26 SO in 26 starts — contact rate spike vs LHB",
    matchupGrade: "A",
    estOdds: "+400",
    note: "Naylor posts a 94th-percentile exit velocity and obliterates right-handers from the left side with an uppercut swing built for wind-aided conditions. Progressive's 9-mph tailwind in the afternoon slot transforms his line-drive profile into prime HR equity.",
    tags: ["💨 Wind Boost", "🔥 Hot"]
  },
  {
    id: 10,
    name: "Yandy Diaz",
    team: "TB",
    tier: "A",
    park: "Progressive Field",
    pitcher: "Gavin Williams",
    pitcherNote: "Williams: FB% trending up, 3.28 ERA masking xFIP blowup risk",
    matchupGrade: "A-",
    estOdds: "+430",
    note: "Diaz has been seeing the ball at a peak level with a multi-hit game streak and strong current-week EV metrics above 94 mph average. His line-drive approach pairs perfectly with Progressive's wind to push well-struck balls over the left-center wall.",
    tags: ["♻️ Run Back", "💨 Wind Boost", "🔥 Hot"]
  },
  {
    id: 11,
    name: "Kyle Manzardo",
    team: "CLE",
    tier: "B",
    park: "Progressive Field",
    pitcher: "Drew Rasmussen",
    pitcherNote: "Rasmussen: HR/9 elevated vs pull-side hitters, velo steady",
    matchupGrade: "B+",
    estOdds: "+480",
    note: "Manzardo is a pure pull hitter posting elite hard-hit rates against right-handed pitching this season. Stacked behind Ramirez in the lineup with afternoon wind blowing out, he is a high-ceiling value play at plus-money odds.",
    tags: ["💨 Wind Boost", "💰 Value", "📈 Breakout"]
  },
  {
    id: 12,
    name: "Isaac Paredes",
    team: "TB",
    tier: "B",
    park: "Progressive Field",
    pitcher: "Gavin Williams",
    pitcherNote: "Williams: FB% elevated, fly-ball rate trending up this month",
    matchupGrade: "B+",
    estOdds: "+460",
    note: "Paredes pulls virtually everything to left field by design, making him the ideal wind-boost stack candidate at Progressive Field this afternoon. He provides premium value stacked with Caminero against an arm giving up elevated fly balls.",
    tags: ["💨 Wind Boost", "💰 Value"]
  },

  // ── MIA@LAD — Dodger Stadium — Wind Out 9mph R-CF — Alcantara vs Glasnow ──
  {
    id: 13,
    name: "Shohei Ohtani",
    team: "LAD",
    tier: "S",
    park: "UNIQLO Field at Dodger Stadium",
    pitcher: "Sandy Alcantara",
    pitcherNote: "Alcantara: 3.05 ERA / 4.42 xFIP — solid but Ohtani owns all pitchers",
    matchupGrade: "A+",
    estOdds: "+250",
    note: "Ohtani leads the NL in ISO and is the most feared hitter on the planet, posting a 98th-percentile barrel rate and top-3 exit velocity this season. Dodger Stadium's 9-mph wind blowing out to right-center and his left-handed pull power make every at-bat a premium HR candidate.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "🔥 Hot"]
  },
  {
    id: 14,
    name: "Teoscar Hernandez",
    team: "LAD",
    tier: "A",
    park: "UNIQLO Field at Dodger Stadium",
    pitcher: "Sandy Alcantara",
    pitcherNote: "Alcantara: 27 SO in 6 starts but HR/9 elevated vs RHB pull hitters",
    matchupGrade: "A",
    estOdds: "+370",
    note: "Hernandez is in a torrid hot stretch with back-to-back multi-hit games and a 95th-percentile hard-hit rate this week. The wind blowing out to right-center at Dodger Stadium perfectly matches his right-handed pull profile.",
    tags: ["🔥 Hot", "💨 Wind Boost"]
  },
  {
    id: 15,
    name: "Ronald Acuna Jr.",
    team: "LAD",
    tier: "A",
    park: "UNIQLO Field at Dodger Stadium",
    pitcher: "Sandy Alcantara",
    pitcherNote: "Alcantara: relies on soft contact, but EV allowed creeping up",
    matchupGrade: "A-",
    estOdds: "+400",
    note: "Acuna Jr. is the most explosive bat in the Dodger lineup after Ohtani, with a 93rd-percentile sprint speed and barrel rate that makes him terrifying against any pitcher. His speed-to-power combination at a wind-boosted Dodger Stadium is elite upside at any odds.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "📈 Breakout"]
  },
  {
    id: 16,
    name: "Freddie Freeman",
    team: "LAD",
    tier: "A",
    park: "UNIQLO Field at Dodger Stadium",
    pitcher: "Sandy Alcantara",
    pitcherNote: "Alcantara: BABIP due for negative regression, fly-ball rate spiking",
    matchupGrade: "A-",
    estOdds: "+420",
    note: "Freeman is the most clutch hitter in baseball history at Dodger Stadium, posting a career .975 OPS at home in the last two seasons. His left-handed pull power with the wind blowing out to right-center is a textbook must-play situational bet.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "🔥 Hot"]
  },

  // ── NYY@TEX — Globe Life Field — DOME — Rodriguez (debut) vs Eovaldi 5.79 ERA ──
  {
    id: 17,
    name: "Aaron Judge",
    team: "NYY",
    tier: "S",
    park: "Globe Life Field",
    pitcher: "Nathan Eovaldi",
    pitcherNote: "Eovaldi: 5.79 ERA / 2-4 record — velocity down, HR/9 leading AL starters",
    matchupGrade: "A+",
    estOdds: "+270",
    note: "Judge leads the AL in home runs and is posting a .700 SLG this season, owning a 99th-percentile exit velocity that makes every Eovaldi offering dangerous. The dome removes wind variables and Judge's raw power turns any mistake into 450-foot evidence.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 18,
    name: "Juan Soto",
    team: "NYY",
    tier: "S",
    park: "Globe Life Field",
    pitcher: "Nathan Eovaldi",
    pitcherNote: "Eovaldi: 5.79 ERA / 32 SO in 7 starts — command unraveling",
    matchupGrade: "A+",
    estOdds: "+310",
    note: "Soto is putting together an MVP-caliber April with a 97th-percentile barrel rate and a .420+ OBP that ensures he gets multiple at-bats in every scoring chance. Eovaldi's command issues are a gift for a hitter with Soto's elite plate discipline and pop.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 19,
    name: "Giancarlo Stanton",
    team: "NYY",
    tier: "A",
    park: "Globe Life Field",
    pitcher: "Nathan Eovaldi",
    pitcherNote: "Eovaldi: velo decline + elevated fly-ball % = HR cocktail",
    matchupGrade: "A",
    estOdds: "+380",
    note: "Stanton's 99th-percentile exit velocity is the highest of any player this week and Eovaldi's declining velocity and elevated fly-ball rate make this a monster matchup inside the Globe Life dome. One barrel equals 450 feet regardless of wind.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster"]
  },
  {
    id: 20,
    name: "Jazz Chisholm Jr.",
    team: "NYY",
    tier: "A",
    park: "Globe Life Field",
    pitcher: "Nathan Eovaldi",
    pitcherNote: "Eovaldi: 5.79 ERA, 2-4 record — implosion start incoming",
    matchupGrade: "A",
    estOdds: "+420",
    note: "Chisholm Jr. is a Statcast darling with a 94th-percentile barrel rate and has been the most aggressive pull hitter in the Yankees order this month. Eovaldi's ERA on the road this season is over 7.00 and the dome removes any weather excuses.",
    tags: ["🔥 Hot", "💣 SP Disaster"]
  },
  {
    id: 21,
    name: "Elmer Rodriguez-Cruz",
    team: "TEX",
    tier: "C",
    park: "Globe Life Field",
    pitcher: "Elmer Rodriguez",
    pitcherNote: "Rodriguez: MLB debut start — unknown arm, 0 innings of MLB experience",
    matchupGrade: "C",
    estOdds: "+550",
    note: "This is purely a meme leg — Rodriguez is facing a debuting pitcher with zero MLB data and the TEX lineup gets premium odds to exploit an unknown arm inside the dome. Pure lottery if the rookie melts down early.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },

  // ── BOS@TOR — Rogers Centre — DOME — Bello 9.00 ERA vs Lauer 6.75 ERA ──
  {
    id: 22,
    name: "Jarren Duran",
    team: "BOS",
    tier: "S",
    park: "Rogers Centre",
    pitcher: "Eric Lauer",
    pitcherNote: "Lauer: 6.75 ERA / 1-3 record — worst qualifying LHP in AL",
    matchupGrade: "A+",
    estOdds: "+330",
    note: "Duran is the fastest-rising power bat in the AL with a 96th-percentile hard-hit rate and a pull-side swing that has produced 8 HRs already this season. Lauer's 6.75 ERA against a hot Red Sox lineup in a dome is a certified disaster start — this is free real estate.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 23,
    name: "Masataka Yoshida",
    team: "BOS",
    tier: "A",
    park: "Rogers Centre",
    pitcher: "Eric Lauer",
    pitcherNote: "Lauer: LHP allowing elevated SLG to lefty pull hitters in 2026",
    matchupGrade: "A",
    estOdds: "+420",
    note: "Yoshida is one of the most disciplined contact hitters in the AL, posting a .380+ OBP with serious gap power against lefties at the Rogers Centre dome all season. Lauer's 6.75 ERA makes every at-bat a premium opportunity.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 24,
    name: "Rafael Devers",
    team: "BOS",
    tier: "A",
    park: "Rogers Centre",
    pitcher: "Eric Lauer",
    pitcherNote: "Lauer: 19 SO in 7 starts — cooked, command non-existent",
    matchupGrade: "A",
    estOdds: "+390",
    note: "Devers owns a 97th-percentile exit velocity and has torched left-handers all season with an ISO above .300 against southpaws. Lauer's 6.75 ERA and inability to miss bats makes Devers the premier BOS stack anchor.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster"]
  },
  {
    id: 25,
    name: "Daulton Varsho",
    team: "TOR",
    tier: "B",
    park: "Rogers Centre",
    pitcher: "Brayan Bello",
    pitcherNote: "Bello: 9.00 ERA — worst ERA among AL starters with 3+ starts",
    matchupGrade: "A",
    estOdds: "+430",
    note: "Varsho is a switch hitter with elite defensive value and serious offensive upside against right-handed pitching this year. Bello's 9.00 ERA inside the Rogers Centre dome is the most extreme disaster start on today's slate.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 26,
    name: "George Springer",
    team: "TOR",
    tier: "A",
    park: "Rogers Centre",
    pitcher: "Brayan Bello",
    pitcherNote: "Bello: 9.00 ERA / 15 SO — on fumes, batters teeing off",
    matchupGrade: "A+",
    estOdds: "+380",
    note: "Springer has re-discovered his Astros-era power with a 93rd-percentile barrel rate in April and has already homered 5 times at Rogers Centre this season. Bello's 9.00 ERA is a blowup game waiting to happen and Springer is the trigger.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },

  // ── SF@PHI — Citizens Bank Park — 61°F / Wind Out 5mph — Webb vs Sanchez ──
  {
    id: 27,
    name: "Kyle Schwarber",
    team: "PHI",
    tier: "S",
    park: "Citizens Bank Park",
    pitcher: "Logan Webb",
    pitcherNote: "Webb: 4.86 ERA — struggling to miss bats, FB% spiking in 2026",
    matchupGrade: "A+",
    estOdds: "+260",
    note: "Schwarber leads the NL in home runs and owns a career .620 SLG against pitchers with sub-average stuff — Webb's 4.86 ERA and spiking FB rate is free real estate for the game's most dangerous pull hitter. Citizens Bank Park's outbound wind seals the deal.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "💨 Wind Boost"]
  },
  {
    id: 28,
    name: "Bryce Harper",
    team: "PHI",
    tier: "A",
    park: "Citizens Bank Park",
    pitcher: "Logan Webb",
    pitcherNote: "Webb: 4.86 ERA / elevated contact rate allowed — regression target",
    matchupGrade: "A",
    estOdds: "+390",
    note: "Harper is seeing the ball at a peak level with a top-10 weekly barrel rate and continues to feast at Citizens Bank Park, where he posts a .990+ career OPS. Webb's struggles this season combined with the soft outbound breeze make this a high-probability hit.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 29,
    name: "Nick Castellanos",
    team: "PHI",
    tier: "B",
    park: "Citizens Bank Park",
    pitcher: "Logan Webb",
    pitcherNote: "Webb: 4.86 ERA — soft contact profile not suppressing PHI lineup",
    matchupGrade: "B+",
    estOdds: "+480",
    note: "Castellanos is a right-handed pull hitter with a career home HR rate that ranks top-5 among active outfielders. Webb's declining strikeout rate and elevated HR/9 in 2026 make this a compelling value stack play behind Schwarber.",
    tags: ["💨 Wind Boost", "💰 Value"]
  },

  // ── DET@ATL — Truist Park — 77°F Warm — Skubal vs Ritchie ──
  {
    id: 30,
    name: "Marcell Ozuna",
    team: "ATL",
    tier: "S",
    park: "Truist Park",
    pitcher: "Tarik Skubal",
    pitcherNote: "Skubal: 2.72 ERA / elite — Ozuna still carries elite matchup upside",
    matchupGrade: "B+",
    estOdds: "+320",
    note: "Ozuna leads the NL in slugging against left-handed pitchers this season with a career-worst Skubal matchup offset by 77°F warm Atlanta air and a gorgeous HR park. His 95th-percentile barrel rate makes even Skubal offerings dangerous.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 31,
    name: "Riley Greene",
    team: "DET",
    tier: "A",
    park: "Truist Park",
    pitcher: "JR Ritchie",
    pitcherNote: "Ritchie: RHP, 2.57 ERA but only 7 SO in 4 starts — soft contact masker",
    matchupGrade: "A",
    estOdds: "+370",
    note: "Greene is one of the most underrated power bats in the AL with a 94th-percentile exit velocity and left-handed pull power tailor-made for Truist Park's warm 77°F conditions. Ritchie's 7 SO in 4 starts signals regression and Greene has been the Tigers' best pure hitter all month.",
    tags: ["🔥 Hot", "📈 Breakout"]
  },
  {
    id: 32,
    name: "Spencer Torkelson",
    team: "DET",
    tier: "A",
    park: "Truist Park",
    pitcher: "JR Ritchie",
    pitcherNote: "Ritchie: low K rate — batters making hard contact freely",
    matchupGrade: "A-",
    estOdds: "+400",
    note: "Torkelson is finally unlocking his top-prospect power in 2026 with a 92nd-percentile hard-hit rate and 6 HRs on the season. Ritchie's inability to miss bats in warm Atlanta conditions makes this a must-add for any DET stack.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 33,
    name: "Matt Olson",
    team: "ATL",
    tier: "A",
    park: "Truist Park",
    pitcher: "Tarik Skubal",
    pitcherNote: "Skubal: elite, but LHB pull power in warm conditions creates edge",
    matchupGrade: "B+",
    estOdds: "+410",
    note: "Olson's left-handed pull power at Truist Park is among the best park-batter combinations in baseball, with a career .580 home SLG. Even against elite Skubal, warm 77°F air and his raw power make this a compelling dart at value odds.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },

  // ── WSH@NYM — Citi Field — Wind Soft Out / 57°F — Cavalli vs Peterson ──
  {
    id: 34,
    name: "Pete Alonso",
    team: "NYM",
    tier: "S",
    park: "Citi Field",
    pitcher: "Cade Cavalli",
    pitcherNote: "Cavalli: 4.01 ERA — adequate but elevated HR/9 vs LHB this month",
    matchupGrade: "A",
    estOdds: "+300",
    note: "Alonso is the Mets' franchise HR machine with a 97th-percentile barrel rate and has homered in back-to-back games this week. Citi Field's soft outbound breeze and his pull-power profile give him prime conditions at home.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 35,
    name: "CJ Abrams",
    team: "WSH",
    tier: "A",
    park: "Citi Field",
    pitcher: "David Peterson",
    pitcherNote: "Peterson: 5.06 ERA / 0-3 — worst ERA among NL East starters",
    matchupGrade: "A",
    estOdds: "+400",
    note: "Abrams has broken out in 2026 with elite sprint speed plus surprising home run power, posting 7 HRs already in his first 30 games. Peterson's 5.06 ERA and lack of strikeout ability turn every hard-hit ball into an adventure for the Mets' outfield.",
    tags: ["📈 Breakout", "💣 SP Disaster"]
  },
  {
    id: 36,
    name: "Brandon Nimmo",
    team: "NYM",
    tier: "B",
    park: "Citi Field",
    pitcher: "Cade Cavalli",
    pitcherNote: "Cavalli: HR/9 spiking vs LHB, velo 0.8 mph below 2025 average",
    matchupGrade: "B+",
    estOdds: "+480",
    note: "Nimmo is a left-handed hitter with legitimate home park power and is posting a 90th-percentile exit velocity in April after a slow start. Cavalli's velocity dip and elevated fly-ball rate make him an exploitable matchup for the Mets' leadoff man.",
    tags: ["💰 Value", "🔜 Due"]
  },

  // ── HOU@BAL — Camden Yards — 63°F / SE 6mph — Lambert vs Bassitt 6.75 ERA ──
  {
    id: 37,
    name: "Adley Rutschman",
    team: "BAL",
    tier: "A",
    park: "Oriole Park at Camden Yards",
    pitcher: "Peter Lambert",
    pitcherNote: "Lambert: 3.27 ERA — solid, not a disaster arm",
    matchupGrade: "B+",
    estOdds: "+380",
    note: "Rutschman is the premier offensive catcher in baseball with a 94th-percentile barrel rate and consistent power at Camden Yards where he has 5 HRs this season. He gets a manageable righty and a park that rewards left-center line drives.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 38,
    name: "Yordan Alvarez",
    team: "HOU",
    tier: "S",
    park: "Oriole Park at Camden Yards",
    pitcher: "Chris Bassitt",
    pitcherNote: "Bassitt: 6.75 ERA / 1-2 — velocity cratering, regression bomb",
    matchupGrade: "A+",
    estOdds: "+280",
    note: "Alvarez is the most dangerous left-handed hitter in the AL with a 99th-percentile barrel rate and a career .340 ISO against right-handed pitching. Bassitt's 6.75 ERA and dramatically declining velocity make this a blowup game — Alvarez is the trigger.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 39,
    name: "Jose Abreu",
    team: "HOU",
    tier: "B",
    park: "Oriole Park at Camden Yards",
    pitcher: "Chris Bassitt",
    pitcherNote: "Bassitt: 6.75 ERA — on fumes, HR/9 leading all AL starters",
    matchupGrade: "A",
    estOdds: "+520",
    note: "Abreu is a powerful right-handed pull hitter who still has elite raw power, posting a 91st-percentile hard-hit rate this season. Bassitt's 6.75 ERA and velocity drop make every at-bat against him a premium HR opportunity.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },

  // ── STL@PIT — PNC Park — 71°F / Soft Out — Pallante vs Chandler ──
  {
    id: 40,
    name: "Paul Goldschmidt",
    team: "STL",
    tier: "A",
    park: "PNC Park",
    pitcher: "Bubba Chandler",
    pitcherNote: "Chandler: 4.88 ERA / 1-2 — young arm, walks climbing",
    matchupGrade: "A-",
    estOdds: "+380",
    note: "Goldschmidt is a proven veteran HR machine with excellent career numbers at PNC Park and a 91st-percentile exit velocity this month. Chandler's 4.88 ERA and elevated walk rate signal command issues that experienced hitters like Goldschmidt exploit.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },
  {
    id: 41,
    name: "Nolan Arenado",
    team: "STL",
    tier: "B",
    park: "PNC Park",
    pitcher: "Bubba Chandler",
    pitcherNote: "Chandler: 4.88 ERA — rising walks suggest command is cooked",
    matchupGrade: "B+",
    estOdds: "+470",
    note: "Arenado continues to produce at a high level with a 92nd-percentile hard-hit rate against right-handed pitching. Chandler's youth and command issues at a 71°F neutral park give Arenado a solid value opportunity.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },

  // ── CHC@SD — Petco Park — Wind IN from Left — Taillon vs Waldron 12.46 ERA ──
  {
    id: 42,
    name: "Seiya Suzuki",
    team: "CHC",
    tier: "A",
    park: "Petco Park",
    pitcher: "Matt Waldron",
    pitcherNote: "Waldron: 12.46 ERA — historically bad start to 2026, every start a blowup",
    matchupGrade: "A+",
    estOdds: "+360",
    note: "Suzuki is the Cubs' best pure hitter with a 94th-percentile barrel rate and excellent opposite-field power that neutralizes Petco's wind-in suppressor. Waldron's 12.46 ERA is the worst among all MLB starters — the park factor hurts but the pitcher disaster overwhelms it.",
    tags: ["💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 43,
    name: "Ian Happ",
    team: "CHC",
    tier: "A",
    park: "Petco Park",
    pitcher: "Matt Waldron",
    pitcherNote: "Waldron: 12.46 ERA / 7 SO in 4 starts — cooked, can't miss bats",
    matchupGrade: "A+",
    estOdds: "+390",
    note: "Happ is a switch hitter with serious power from both sides and has been the most consistent HR threat in the Cubs lineup with 6 HR in 30 games. Waldron's catastrophic ERA against a hot Cubs lineup makes this a must-target even at a suppressor park.",
    tags: ["💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 44,
    name: "Manny Machado",
    team: "SD",
    tier: "B",
    park: "Petco Park",
    pitcher: "Jameson Taillon",
    pitcherNote: "Taillon: 4.55 ERA — flyball pitcher in a suppressor park, slight risk",
    matchupGrade: "B",
    estOdds: "+460",
    note: "Machado has elite opposite-field power to left that neutralizes Petco's wind-in tendency and is posting a 90th-percentile hard-hit rate this month. He's a solid value play stacking the Padres against a 4.55 ERA arm.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },

  // ── SEA@MIN — Target Field — 55°F / Calm — Kirby vs Bradley ──
  {
    id: 45,
    name: "Byron Buxton",
    team: "MIN",
    tier: "A",
    park: "Target Field",
    pitcher: "George Kirby",
    pitcherNote: "Kirby: 2.97 ERA / 4-2 — elite arm, best SEA starter",
    matchupGrade: "B+",
    estOdds: "+400",
    note: "Buxton remains one of the most dangerous power threats in the AL when healthy, posting a 94th-percentile exit velocity and elite pull power. Even against a quality Kirby, Buxton's raw power at Target Field makes him a legitimate bolt-on value dart.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 46,
    name: "Cal Raleigh",
    team: "SEA",
    tier: "B",
    park: "Target Field",
    pitcher: "Taj Bradley",
    pitcherNote: "Bradley: 2.91 ERA / 3-1 — solid arm but HR/9 elevated vs LHB",
    matchupGrade: "B+",
    estOdds: "+450",
    note: "Raleigh is the best-hitting catcher in the AL with elite pull power against right-handed pitching, posting 8 HR on the season. Bradley's elevated HR/9 against left-handed hitters gives Raleigh a workable value play away from home.",
    tags: ["💰 Value", "🔜 Due"]
  },

  // ── AZ@MIL — American Family Field — DOME — Rodriguez vs TBD ──
  {
    id: 47,
    name: "Christian Walker",
    team: "AZ",
    tier: "B",
    park: "American Family Field",
    pitcher: "Eduardo Rodriguez",
    pitcherNote: "E-Rod: LHP with historically elevated HR/9 against RHB pull hitters",
    matchupGrade: "B+",
    estOdds: "+480",
    note: "Walker is one of the premier power first basemen in the NL with a 93rd-percentile hard-hit rate and excellent numbers against left-handed pitching. The dome neutralizes weather and E-Rod's elevated HR/9 vs right-handed pull hitters gives Walker a legitimate matchup edge.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 48,
    name: "William Contreras",
    team: "MIL",
    tier: "B",
    park: "American Family Field",
    pitcher: "Eduardo Rodriguez",
    pitcherNote: "E-Rod: LHP — Contreras mashes southpaws with career .310 ISO vs LHP",
    matchupGrade: "B+",
    estOdds: "+470",
    note: "Contreras is one of the most underrated power bats in the NL with a .310 career ISO against left-handed pitching and a 92nd-percentile hard-hit rate this month. The dome environment and E-Rod's elevated HR/9 make him a compelling dome stack value play.",
    tags: ["💰 Value", "📈 Breakout"]
  },

  // ── KC@ATH — Sutter Health Park — 75°F Calm — TBD pitchers ──
  {
    id: 49,
    name: "Salvador Perez",
    team: "KC",
    tier: "C",
    park: "Sutter Health Park",
    pitcher: "TBD ATH SP",
    pitcherNote: "TBD ATH SP — rotation in flux, potential bullpen game",
    matchupGrade: "B",
    estOdds: "+540",
    note: "Perez is a perennial power threat with 10+ HR pace and a career .480 SLG against right-handed pitching when healthy. The Sacramento ballpark is neutral and a bullpen game makes the at-bat odds more favorable for his pull-power profile.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 50,
    name: "Brent Rooker",
    team: "ATH",
    tier: "C",
    park: "Sutter Health Park",
    pitcher: "TBD KC SP",
    pitcherNote: "TBD KC SP — rotation status unclear heading into Wednesday",
    matchupGrade: "B-",
    estOdds: "+550",
    note: "Rooker is the most dangerous power bat on the Athletics roster with a 95th-percentile hard-hit rate and elite pull power against right-handed pitching at his home park. His longshot odds relative to his raw power metrics make this the slate's best lottery leg.",
    tags: ["🎰 Longshot", "📈 Breakout", "💰 Value"]
  },
];

const parlays = [
  {
    id: "4A",
    legs: 4,
    label: "THE CORE FOUR",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1050",
    description: "The 4 highest-probability S-tier legs on Wednesday's slate.",
    playerIds: [1, 7, 17, 27],
    strategy: "Elly De La Cruz at GABP vs Sugano, Jose Ramirez with the wind at Progressive, Aaron Judge destroying Eovaldi's 5.79 ERA, and Schwarber at Citizens Bank — four of the best power-matchup combinations on the slate. All four hitters post elite barrel metrics and face pitchers with documented HR-allowance issues."
  },
  {
    id: "4B",
    legs: 4,
    label: "THE DOME BOMB SQUAD",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1100",
    description: "Full stack of the two worst dome starters: Eovaldi 5.79 ERA and Lauer 6.75 ERA.",
    playerIds: [17, 18, 22, 26],
    strategy: "Judge and Soto destroy Eovaldi while Duran and Springer feast on Lauer inside their respective domes. Four elite hitters against two of the worst qualified starters in their respective leagues — no weather excuses, just bad pitching getting cooked by elite bats."
  },
  {
    id: "5A",
    legs: 5,
    label: "THE HIGH FIVE",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1900",
    description: "S-tier anchors plus top wind and park plays across the best venues.",
    playerIds: [1, 7, 13, 17, 38],
    strategy: "De La Cruz at GABP, Ramirez with wind at Progressive, Ohtani with wind at Dodger Stadium, Judge vs Eovaldi dome bomb, and Yordan Alvarez obliterating Bassitt's 6.75 ERA at Camden Yards. Five premier power hitters in five of the best matchup-context combinations on the entire slate."
  },
  {
    id: "5B",
    legs: 5,
    label: "THE EV SPECIAL",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2200",
    description: "Five players with the highest confirmed EV/Barrel% this week.",
    playerIds: [13, 17, 18, 38, 1],
    strategy: "Ohtani (98th pctile EV), Judge (99th pctile EV), Soto (97th pctile barrel%), Yordan Alvarez (99th pctile barrel%), and Elly De La Cruz (95th pctile EV) — the five most dangerous power hitters on today's entire slate by Statcast metrics. This parlay is purely about elite talent concentration."
  },
  {
    id: "5C",
    legs: 5,
    label: "THE REGRESSION BOMB",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2400",
    description: "Target pitchers with the biggest ERA-vs-xERA or raw ERA disaster profiles.",
    playerIds: [26, 22, 38, 4, 42],
    strategy: "Springer vs Bello (9.00 ERA), Duran vs Lauer (6.75 ERA), Yordan vs Bassitt (6.75 ERA), Jonathan India at GABP vs Sugano, and Seiya Suzuki vs Waldron (12.46 ERA) — five hitters specifically targeting the five worst starters on the slate by ERA metrics. Pure pitcher regression exposure."
  },
  {
    id: "6A",
    legs: 6,
    label: "THE GREAT AMERICAN STACK",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+2600",
    description: "Full GABP stack — 6 hitters vs Sugano at the #1 HR park.",
    playerIds: [1, 2, 3, 4, 5, 6],
    strategy: "The full Cincinnati and Colorado stack at GABP maximizes exposure to the slate's top park factor. Elly De La Cruz anchors, Steer and India provide A-tier upside, and Stephenson, Wynns, and Noda complete the stack at value odds. If Sugano implodes — and his xERA says he will — this parlay explodes."
  },
  {
    id: "6B",
    legs: 6,
    label: "EOVALDI BODY BAG",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+2800",
    description: "Full Yankees stack vs Nathan Eovaldi's 5.79 ERA inside the dome.",
    playerIds: [17, 18, 19, 20, 13, 38],
    strategy: "Judge, Soto, Stanton, and Chisholm stack the entire Yankees lineup against the worst ERA in the AL — Eovaldi at 5.79 — while Ohtani and Yordan serve as premium reinforcers. Six of the most dangerous power hitters in baseball targeting two catastrophic starters make this a value-rich six-leg ticket."
  },
  {
    id: "7A",
    legs: 7,
    label: "THE ALTITUDE-FREE STACK",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+4500",
    description: "Max exposure to the top three HR parks — GABP, Progressive, Dodger Stadium.",
    playerIds: [1, 2, 7, 8, 13, 14, 27],
    strategy: "Double down on GABP with De La Cruz and Steer, double the Progressive wind boost with Ramirez and Caminero, load Dodger Stadium with Ohtani and Hernandez, then add Schwarber at Citizens Bank. Seven elite power hitters in the four best park-condition combinations on the slate — pure park-factor concentration."
  },
  {
    id: "7B",
    legs: 7,
    label: "THE WIND CHASER",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+5000",
    description: "Stack both confirmed wind-boosted parks — Progressive Field and Dodger Stadium.",
    playerIds: [7, 8, 9, 10, 13, 14, 16],
    strategy: "Ramirez, Caminero, Naylor, and Diaz get the 9-mph Progressive wind while Ohtani, Hernandez, and Freeman get the 9-mph Dodger Stadium wind blowing out to right-center. Seven hitters in two confirmed wind-boosted parks maximize the atmospheric edge on this Wednesday slate."
  },
  {
    id: "7C",
    legs: 7,
    label: "THE HOT HAND",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+4800",
    description: "Seven confirmed hot-streak hitters in the best contexts today.",
    playerIds: [1, 7, 8, 13, 17, 22, 38],
    strategy: "De La Cruz (multi-HR recently), Ramirez (AL hits leader), Caminero (Rays HR leader), Ohtani (NL ISO leader), Judge (AL HR leader), Duran (8 HR in 30 games), and Yordan Alvarez (career-best ISO pace) — seven of the hottest pure power bats on the slate stacked in their best individual contexts today."
  },
  {
    id: "8A",
    legs: 8,
    label: "THE SLUGGER SUMMIT",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+7500",
    description: "All S-tier players plus top A-tier matchups on the slate.",
    playerIds: [1, 7, 8, 13, 17, 18, 22, 38],
    strategy: "Every S-tier player on Wednesday's board — De La Cruz, Ramirez, Caminero, Ohtani, Judge, Soto, Duran, and Yordan Alvarez — assembled in one eight-leg superstructure. This is the most talent-dense parlay possible given the slate, requiring eight elite-level bats to all connect."
  },
  {
    id: "8B",
    legs: 8,
    label: "THE VALUE MATRIX",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+8200",
    description: "S-tier anchors plus highest-value B-tier underpriced plays.",
    playerIds: [1, 17, 38, 27, 22, 11, 39, 47],
    strategy: "Judge and De La Cruz anchor with elite probability while Schwarber, Duran, and Yordan provide premium middle legs. Then Manzardo (+480), Abreu (+520), and Christian Walker (+480) provide massive value inflation to the payout. This parlay is built to exploit underpriced odds while using high-probability anchors to protect the ticket."
  },
  {
    id: "9A",
    legs: 9,
    label: "THE GRAND SALAMI",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+14000",
    description: "9-leg monster covering every premium context on the slate.",
    playerIds: [1, 7, 13, 17, 18, 22, 26, 27, 38],
    strategy: "De La Cruz at GABP, Ramirez in the wind, Ohtani at Dodger Stadium, Judge and Soto demolishing Eovaldi, Duran and Springer destroying Lauer and Bello, Schwarber at CBP, and Yordan obliterating Bassitt — nine of the single best individual matchup-context combinations on the slate assembled into the day's largest premium ticket."
  },
  {
    id: "9B",
    legs: 9,
    label: "THE SLEEPER STACK",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+16000",
    description: "S-tier anchors plus confirmed hot bats plus breakout candidates.",
    playerIds: [1, 17, 38, 13, 22, 31, 32, 35, 42],
    strategy: "De La Cruz, Judge, Yordan, Ohtani, and Duran serve as the S-tier anchors. Riley Greene (94th pctile EV) and Spencer Torkelson (6 HR breakout) target the soft Ritchie in warm Atlanta. CJ Abrams exploits Peterson's 5.06 ERA at Citi Field. Seiya Suzuki torches Waldron's historic 12.46 ERA. Three breakout candidates elevate the ceiling of this high-upside ticket."
  },
  {
    id: "10A",
    legs: 10,
    label: "THE LOTTERY TICKET",
    risk: "Max Risk",
    riskColor: "#9c27b0",
    estPayout: "+28000",
    description: "Elite core plus 2 C-tier lottery legs for moon-shot payout.",
    playerIds: [1, 7, 13, 17, 18, 22, 27, 38, 49, 50],
    strategy: "Eight premium S/A-tier anchors — De La Cruz, Ramirez, Ohtani, Judge, Soto, Duran, Schwarber, and Yordan — form the elite backbone of this ticket. Salvador Perez and Brent Rooker are added as pure lottery C-tier legs with TBD pitching matchups in Sacramento, inflating the payout into moon-shot territory. Hit the two lotto legs and this ticket is life-changing."
  },
];
