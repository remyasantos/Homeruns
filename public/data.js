const TEAM_TO_GAME = {
  TB:  "TB@CLE",   CLE: "TB@CLE",
  HOU: "HOU@BAL",  BAL: "HOU@BAL",
  STL: "STL@PIT",  PIT: "STL@PIT",
  COL: "COL@CIN",  CIN: "COL@CIN",
  SF:  "SF@PHI",   PHI: "SF@PHI",
  BOS: "BOS@TOR",  TOR: "BOS@TOR",
  WAS: "WAS@NYM",  NYM: "WAS@NYM",
  DET: "DET@ATL",  ATL: "DET@ATL",
  LAA: "LAA@CWS",  CWS: "LAA@CWS",
  AZ:  "AZ@MIL",   MIL: "AZ@MIL",
  SEA: "SEA@MIN",  MIN: "SEA@MIN",
  NYY: "NYY@TEX",  TEX: "NYY@TEX",
  CHC: "CHC@SD",   SD:  "CHC@SD",
  KC:  "KC@ATH",   ATH: "KC@ATH",
  MIA: "MIA@LAD",  LAD: "MIA@LAD",
};

const SLATE_DATE  = "APRIL 28, 2026";
const SLATE_LABEL = "TUESDAY MLB SLATE";

const CONTEXT_CARDS = [
  {
    icon: "💨",
    label: "Progressive Field",
    note: "14 mph Wind Out to Left — TB@CLE",
    sub: "Cleveland is the slate's top wind-boost park; Rays and Guardians sluggers get full tailwind at 73°F against disaster starters on both sides."
  },
  {
    icon: "🔥",
    label: "Great American Ball Park",
    note: "#2 HR Park — 70°F, Sugano (3.42 ERA / 6.04 xERA)",
    sub: "COL@CIN: GABP is the premium regression bomb — Sugano's massive ERA-to-xERA gap is a blowup waiting to happen against Cincinnati's aggressive lineup."
  },
  {
    icon: "💣",
    label: "Pitcher Disaster Night",
    note: "Littell, Bubic, Yesavage, Sugano, Mahle — 5 implosion arms",
    sub: "Tuesday slate is stacked with SP regression targets: Littell leads the league in HRs allowed since 2025, Bubic surrendered 8 ER in his last two starts."
  },
  {
    icon: "💨",
    label: "Citizens Bank Park",
    note: "7 mph Hard Out — SF@PHI Matchup",
    sub: "Mahle's 5.26 ERA / 5.69 xERA / 5.78 FIP telegraphs disaster in a hitter-friendly Philly park with outbound wind — Schwarber and Harper get premium conditions."
  },
];

const PARK_FACTORS = {
  "Progressive Field":         { rank: 1,  label: "💨 #1 — Wind Out 14mph / 73°F",      color: "#90e0ef" },
  "Great American Ball Park":  { rank: 2,  label: "🔥 #2 HR Park — 70°F Warm",           color: "#ff6b35" },
  "Citizens Bank Park":        { rank: 3,  label: "💨 #3 — Wind Out 7mph / 58°F",        color: "#90e0ef" },
  "UNIQLO Field at Dodger Stadium": { rank: 4, label: "💨 #4 — Wind Out 10mph / 62°F",   color: "#90e0ef" },
  "Citi Field":                { rank: 5,  label: "💨 #5 — Wind Out 8mph / 56°F",        color: "#90e0ef" },
  "Sutter Health Park":        { rank: 6,  label: "🌤️ Neutral — West Coast Eve",         color: "#b0bec5" },
  "Oriole Park at Camden Yards": { rank: 7, label: "🌤️ Neutral — 56°F, 6mph Soft Out",  color: "#b0bec5" },
  "Target Field":              { rank: 8,  label: "🌤️ Wind Out 10mph — Cold/Wet Risk",   color: "#b0bec5" },
  "Truist Park":               { rank: 9,  label: "🌤️ Neutral — 69°F, 4mph Soft In",    color: "#b0bec5" },
  "Globe Life Field":          { rank: 10, label: "🏟️ Dome/Roof Closed",                 color: "#b0bec5" },
  "Rogers Centre":             { rank: 11, label: "🏟️ Dome/Roof Closed",                 color: "#b0bec5" },
  "American Family Field":     { rank: 12, label: "🏟️ Dome/Roof Closed",                 color: "#b0bec5" },
  "Petco Park":                { rank: 13, label: "🌬️ Cross Wind L-R — Coastal Suppress", color: "#78909c" },
  "PNC Park":                  { rank: 14, label: "🌬️ Wind IN 10–12mph — Avoid",         color: "#78909c" },
  "Rate Field":                { rank: 15, label: "⛈️ Rain Delay Risk — Wind In",         color: "#78909c" },
};

const players = [
  // ── TB@CLE — Progressive Field — 14mph Wind Out — Martinez vs Bibee ──
  {
    id: 1,
    name: "Jose Ramirez",
    team: "CLE",
    tier: "S",
    park: "Progressive Field",
    pitcher: "Taj Bradley",
    pitcherNote: "Martinez (TB): 1.1+ HR/9 over last 6 starts, elevated FB rate",
    matchupGrade: "A+",
    estOdds: "+370",
    note: "Ramirez leads the AL in ISO with a 97th-percentile barrel rate and obliterates left-center field lines with pull power. The 14-mph wind blowing directly out to left at Progressive Field turns any well-hit ball into a no-doubter.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "🔥 Hot"]
  },
  {
    id: 2,
    name: "Josh Naylor",
    team: "CLE",
    tier: "A",
    park: "Progressive Field",
    pitcher: "Sandy Martinez",
    pitcherNote: "Martinez (TB): elevated HR/9 and declining velo this season",
    matchupGrade: "A",
    estOdds: "+400",
    note: "Naylor posts a 94th-percentile exit velocity and feasts on right-handed arms from the left side with an uppercut swing built for wind-aided conditions. Progressive Field's 14-mph tailwind to left field transforms his line-drive profile into pure home run equity.",
    tags: ["💨 Wind Boost", "🔥 Hot", "💣 SP Disaster"]
  },
  {
    id: 3,
    name: "Kyle Manzardo",
    team: "CLE",
    tier: "B",
    park: "Progressive Field",
    pitcher: "Sandy Martinez",
    pitcherNote: "Martinez (TB): 1.1+ HR/9, regression target all season",
    matchupGrade: "B+",
    estOdds: "+480",
    note: "Manzardo is a pure pull hitter posting elite hard-hit rates against right-handed pitching this season. Stacked behind Ramirez in the lineup with the wind blowing out, he is a high-ceiling value play at plus-money odds.",
    tags: ["💨 Wind Boost", "💰 Value", "📈 Breakout"]
  },
  {
    id: 4,
    name: "Junior Caminero",
    team: "TB",
    tier: "S",
    park: "Progressive Field",
    pitcher: "Tanner Bibee",
    pitcherNote: "Bibee: 1.2 HR/9 this season with elevated fly-ball rate",
    matchupGrade: "A",
    estOdds: "+320",
    note: "Caminero leads the Rays in barrels and hits the ball as hard as anyone in the majors with a 96th-percentile exit velocity profile. The 14-mph outgoing wind at Progressive Field gives this 22-year-old cannon arm a massive risk-reward edge.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "🔥 Hot"]
  },
  {
    id: 5,
    name: "Yandy Diaz",
    team: "TB",
    tier: "A",
    park: "Progressive Field",
    pitcher: "Tanner Bibee",
    pitcherNote: "Bibee: elevated HR/9 and FB% climbing in April",
    matchupGrade: "A-",
    estOdds: "+420",
    note: "Diaz has been seeing the ball at an elite level with a multi-hit game streak and strong current-week EV metrics. His line-drive approach pairs perfectly with the aggressive Progressive Field wind to push well-struck balls over the left-center fence.",
    tags: ["♻️ Run Back", "🔥 Hot", "💨 Wind Boost"]
  },
  {
    id: 6,
    name: "Isaac Paredes",
    team: "TB",
    tier: "B",
    park: "Progressive Field",
    pitcher: "Tanner Bibee",
    pitcherNote: "Bibee: 1.2 HR/9, fly-ball rate trending up this month",
    matchupGrade: "B+",
    estOdds: "+450",
    note: "Paredes pulls virtually everything to left field by design, making him the ideal wind-boost stack candidate at Progressive Field today. He provides premium value stacked with Caminero against an arm giving up elevated fly balls.",
    tags: ["💨 Wind Boost", "💰 Value"]
  },

  // ── COL@CIN — Great American Ball Park — Sugano vs Burns ──
  {
    id: 7,
    name: "Kyle Schwarber",
    team: "PHI",
    tier: "S",
    park: "Citizens Bank Park",
    pitcher: "Kyle Leahy",
    pitcherNote: "Mahle (SF): 5.26 ERA / 5.69 xERA / 5.78 FIP — cooked",
    matchupGrade: "A+",
    estOdds: "+235",
    note: "Schwarber leads the NL in home runs and owns a career .620 SLG against pitchers with sub-average stuff — Mahle's 5.78 FIP is free real estate for the game's most dangerous pull hitter. Citizens Bank's 7-mph outbound wind seals the deal.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "💨 Wind Boost"]
  },
  {
    id: 8,
    name: "Bryce Harper",
    team: "PHI",
    tier: "A",
    park: "Citizens Bank Park",
    pitcher: "Kyle Mahle",
    pitcherNote: "Mahle: 5.26 ERA / 5.69 xERA — massive regression target",
    matchupGrade: "A",
    estOdds: "+410",
    note: "Harper posted a homer vs Atlanta just days ago and is seeing the ball at a peak level with a top-10 weekly barrel rate. Mahle's xERA-to-ERA gap screams blowup game, and Philly's home crowd combined with outbound wind makes this a must-play.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 9,
    name: "Elly De La Cruz",
    team: "CIN",
    tier: "S",
    park: "Great American Ball Park",
    pitcher: "Kohei Sugano",
    pitcherNote: "Sugano: 3.42 ERA / 6.04 xERA — historic regression gap",
    matchupGrade: "A+",
    estOdds: "+310",
    note: "De La Cruz homered twice in a recent game and is the most electric power-speed threat in baseball with a 95th-percentile exit velocity. Sugano's 6.04 xERA at GABP, the league's most HR-friendly outdoor park, is a certified disaster start.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 10,
    name: "Spencer Steer",
    team: "CIN",
    tier: "A",
    park: "Great American Ball Park",
    pitcher: "Kohei Sugano",
    pitcherNote: "Sugano: 6.04 xERA — cooked, fly-ball machine getting lit up",
    matchupGrade: "A",
    estOdds: "+380",
    note: "Steer thrives in warm-weather power environments and has elite pull numbers at GABP with a .540+ home SLG. Sugano allows elevated fly-ball rates and the warm 70°F Cincinnati air helps every ball carry in that cozy outfield.",
    tags: ["🔥 Hot", "💣 SP Disaster"]
  },
  {
    id: 11,
    name: "Tyler Stephenson",
    team: "CIN",
    tier: "B",
    park: "Great American Ball Park",
    pitcher: "Kohei Sugano",
    pitcherNote: "Sugano: xERA nearly 3 full runs over ERA — blowup incoming",
    matchupGrade: "B+",
    estOdds: "+480",
    note: "Stephenson is a legitimate power bat from the catcher position with a recent hot streak and above-average barrel metrics. He offers fantastic stack value against Sugano in the game's best HR environment.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 12,
    name: "Nolan Arenado",
    team: "AZ",
    tier: "A",
    park: "American Family Field",
    pitcher: "Chad Patrick",
    pitcherNote: "Patrick (MIL): 2.35 ERA — solid arm, but Arenado owns MIL pitching",
    matchupGrade: "B+",
    estOdds: "+390",
    note: "Arenado has a .928 career OPS with 24 home runs against Brewers pitching — he is an active Brewer Killer making his return to American Family Field. Even with the dome, his elite RH power and historic production against this franchise make him the top AZ play.",
    tags: ["🔥 Hot", "💰 Value"]
  },

  // ── SF@PHI — Citizens Bank Park — Mahle vs Luzardo ──
  {
    id: 13,
    name: "Nick Castellanos",
    team: "PHI",
    tier: "A",
    park: "Citizens Bank Park",
    pitcher: "Kyle Mahle",
    pitcherNote: "Mahle: 5.26 ERA / 5.78 FIP — arm completely cooked",
    matchupGrade: "A-",
    estOdds: "+420",
    note: "Castellanos feasts on regression pitchers and has a history of going deep at Citizens Bank Park where his pull profile is a natural fit. Mahle's massive FIP-to-ERA gap plus the outbound wind makes this a high-conviction stack play.",
    tags: ["💣 SP Disaster", "💨 Wind Boost"]
  },
  {
    id: 14,
    name: "Trea Turner",
    team: "PHI",
    tier: "B",
    park: "Citizens Bank Park",
    pitcher: "Kyle Mahle",
    pitcherNote: "Mahle: 5.69 xERA — FIP and xERA both call for disaster start",
    matchupGrade: "B+",
    estOdds: "+480",
    note: "Turner's elite contact rate and 92nd-percentile sprint speed translate to upper-tier hard-hit metrics and occasional pop. Mahle's command issues set up favorable counts that Turner has historically exploited for extra-base hits.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },

  // ── BOS@TOR — Rogers Centre — Dome — Tolle vs Yesavage ──
  {
    id: 15,
    name: "Rafael Devers",
    team: "BOS",
    tier: "A",
    park: "Rogers Centre",
    pitcher: "Ryan Yesavage",
    pitcherNote: "Yesavage: MiLB call-up — first MLB start, zero big-league track record",
    matchupGrade: "A",
    estOdds: "+340",
    note: "Devers has a 97th-percentile hard-hit rate and crushes young arms making their MLB debuts — Yesavage has never faced big-league hitters, making his stuff and command a complete question mark. Elite S-tier talent facing a pure lottery arm in a controlled dome.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "💰 Value"]
  },
  {
    id: 16,
    name: "Jarren Duran",
    team: "BOS",
    tier: "A",
    park: "Rogers Centre",
    pitcher: "Ryan Yesavage",
    pitcherNote: "Yesavage: debut call-up — no MLB data, pure regression bomb",
    matchupGrade: "A-",
    estOdds: "+380",
    note: "Duran has elevated his barrel rate significantly this season and is hitting with authority from the top of Boston's lineup. Facing a minor-league call-up in a dome environment with no wind variables gives him a clean power opportunity.",
    tags: ["💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 17,
    name: "Vladimir Guerrero Jr.",
    team: "TOR",
    tier: "A",
    park: "Rogers Centre",
    pitcher: "Cam Tolle",
    pitcherNote: "Tolle (BOS): limited big-league track record, command concerns",
    matchupGrade: "B+",
    estOdds: "+350",
    note: "Guerrero Jr. owns a 25% barrel rate this season and has been one of the most dangerous right-handed power bats in the AL. The Rogers Centre dome eliminates all weather variables, letting his elite raw power take center stage.",
    tags: ["👑 MVP/Elite", "🏟️ Dome", "🔥 Hot"]
  },
  {
    id: 18,
    name: "Bo Bichette",
    team: "TOR",
    tier: "B",
    park: "Rogers Centre",
    pitcher: "Cam Tolle",
    pitcherNote: "Tolle: inconsistent command, elevated walk rate in early sample",
    matchupGrade: "B",
    estOdds: "+460",
    note: "Bichette has a natural pull-side power stroke and provides excellent stack value underneath Guerrero Jr. in the Blue Jays lineup. His walk-off power has been evident this season and a controlled dome maximizes his swing-driven output.",
    tags: ["💰 Value", "🏟️ Dome"]
  },

  // ── WAS@NYM — Citi Field — 8mph Wind Out — Littell vs Holmes ──
  {
    id: 19,
    name: "Pete Alonso",
    team: "NYM",
    tier: "S",
    park: "Citi Field",
    pitcher: "Zach Littell",
    pitcherNote: "Littell (WAS): league-high HRs allowed since 2025, 3.9 HR/9",
    matchupGrade: "A+",
    estOdds: "+290",
    note: "Alonso leads the NL in home runs at Citi Field where he has maximized the right-field porch, and Littell is statistically the most HR-susceptible pitcher in baseball since 2025. The 8-mph outbound wind is the final ingredient in what is the slate's most underpriced S-tier play.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "💨 Wind Boost"]
  },
  {
    id: 20,
    name: "Francisco Lindor",
    team: "NYM",
    tier: "A",
    park: "Citi Field",
    pitcher: "Zach Littell",
    pitcherNote: "Littell: 3.9 HR/9 since 2025 — league-worst HR rate allowed",
    matchupGrade: "A",
    estOdds: "+380",
    note: "Lindor's 93rd-percentile exit velocity and switch-hit pull power make him a devastating matchup against pitchers who leak pitches over the middle. Littell's historically elevated home run rate against all hitter profiles makes this a high-conviction stack leg.",
    tags: ["💣 SP Disaster", "💨 Wind Boost", "🔥 Hot"]
  },
  {
    id: 21,
    name: "James Wood",
    team: "WAS",
    tier: "S",
    park: "Citi Field",
    pitcher: "Clay Holmes",
    pitcherNote: "Holmes (NYM): strong ERA but raw stuff declining in 2026",
    matchupGrade: "A",
    estOdds: "+360",
    note: "Wood homered in three straight games recently and owns a 97th-percentile exit velocity with a swing that produces elite carry on fly balls. The 8-mph Citi Field outbound wind supercharges his already elite raw power — he is the slate's best value S-tier play.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "🔥 Hot", "💰 Value"]
  },
  {
    id: 22,
    name: "Juan Soto",
    team: "NYM",
    tier: "S",
    park: "Citi Field",
    pitcher: "Zach Littell",
    pitcherNote: "Littell: 3.9 HR/9 — historically bad HR suppression since 2025",
    matchupGrade: "A+",
    estOdds: "+285",
    note: "Soto has a 96th-percentile barrel rate and is posting his best ISO since his Washington days — facing the most home-run-prone pitcher in baseball at home with wind blowing out makes him the single most underpriced play on the slate. Pure free real estate.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "💨 Wind Boost", "🔥 Hot"]
  },

  // ── DET@ATL — Truist Park — Mize vs Perez ──
  {
    id: 23,
    name: "Matt Olson",
    team: "ATL",
    tier: "A",
    park: "Truist Park",
    pitcher: "Casey Mize",
    pitcherNote: "Mize (DET): limited 2026 sample, FB% climbing, velo declining",
    matchupGrade: "B+",
    estOdds: "+370",
    note: "Olson owns a 98th-percentile barrel rate and has crushed right-handed pitching all season with a .590 SLG at Truist Park. Mize's velocity decline and increasing fly-ball rate set up a classic power matchup for Atlanta's cleanup hitter.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 24,
    name: "Marcell Ozuna",
    team: "ATL",
    tier: "B",
    park: "Truist Park",
    pitcher: "Casey Mize",
    pitcherNote: "Mize: declining velo trend in 2026, elevated HR allowed rate",
    matchupGrade: "B",
    estOdds: "+460",
    note: "Ozuna is one of baseball's most consistent power threats and regularly goes deep against pitchers whose fastballs sit below 93 mph. Mize's declining velo creates the exact fastball-over-the-plate scenario Ozuna waits for.",
    tags: ["💰 Value", "🔥 Hot"]
  },
  {
    id: 25,
    name: "Ronald Acuna Jr.",
    team: "ATL",
    tier: "A",
    park: "Truist Park",
    pitcher: "Casey Mize",
    pitcherNote: "Mize: velo down and fly-ball% climbing in young 2026 sample",
    matchupGrade: "A-",
    estOdds: "+340",
    note: "Acuna's return to full health has included a top-10 weekly barrel rate and elite sprint-speed that translates to true five-tool production. He is the most dangerous hitter in Atlanta's lineup against an arm showing regression indicators.",
    tags: ["👑 MVP/Elite", "📈 Breakout", "🔥 Hot"]
  },

  // ── NYY@TEX — Globe Life Field — Dome — Schlittler vs deGrom ──
  {
    id: 26,
    name: "Aaron Judge",
    team: "NYY",
    tier: "S",
    park: "Globe Life Field",
    pitcher: "Jacob deGrom",
    pitcherNote: "deGrom (TEX): returns from injury, pitch count restricted, stuff not yet sharp",
    matchupGrade: "A",
    estOdds: "+240",
    note: "Judge leads the majors in barrel rate at 26% and just recorded his 362nd career homer — he is chasing history with elite contact quality every at-bat. deGrom returning from injury with limited pitch count and shaky command makes the back-end of the game a live HR opportunity.",
    tags: ["👑 MVP/Elite", "🔥 Hot", "🏟️ Dome"]
  },
  {
    id: 27,
    name: "Giancarlo Stanton",
    team: "NYY",
    tier: "A",
    park: "Globe Life Field",
    pitcher: "Jacob deGrom",
    pitcherNote: "deGrom: injury-return start, workload limited, not at full stuff",
    matchupGrade: "B+",
    estOdds: "+350",
    note: "Stanton's raw power is generational and he absolutely ambushes pitchers who leave fastballs in the zone — a restricted deGrom at less than 100% is a legitimate matchup edge. Globe Life's controlled dome environment gives Stanton the clean swing conditions he needs.",
    tags: ["💣 SP Disaster", "🏟️ Dome", "🔥 Hot"]
  },
  {
    id: 28,
    name: "Corey Seager",
    team: "TEX",
    tier: "A",
    park: "Globe Life Field",
    pitcher: "Brock Schlittler",
    pitcherNote: "Schlittler (NYY): first major-league extended sample, command unproven",
    matchupGrade: "A-",
    estOdds: "+340",
    note: "Seager thrives at home in Globe Life Field and matches up perfectly against right-handed pitchers with limited big-league experience. The dome eliminates park variance, letting his elite pull-side home run stroke take over.",
    tags: ["👑 MVP/Elite", "🏟️ Dome", "💰 Value"]
  },

  // ── KC@ATH — Sutter Health Park — Bubic vs Lopez ──
  {
    id: 29,
    name: "Salvador Perez",
    team: "KC",
    tier: "A",
    park: "Sutter Health Park",
    pitcher: "Jorge Lopez",
    pitcherNote: "Lopez (ATH): 7.7 BB/9 — worst walk rate in the majors",
    matchupGrade: "A",
    estOdds: "+380",
    note: "Perez punishes pitchers with command issues more than almost any hitter in baseball — he chases, but when he gets a fastball in the zone he destroys it with a 94th-percentile exit velocity. Lopez's 7.7 BB/9 guarantees free baserunners and hittable pitches.",
    tags: ["💣 SP Disaster", "💰 Value", "🔥 Hot"]
  },
  {
    id: 30,
    name: "Bobby Witt Jr.",
    team: "KC",
    tier: "S",
    park: "Sutter Health Park",
    pitcher: "Jorge Lopez",
    pitcherNote: "Lopez: 7.7 BB/9 — walks set up HR counts constantly",
    matchupGrade: "A+",
    estOdds: "+320",
    note: "Witt Jr. is posting a 95th-percentile barrel rate and has emerged as the AL's most complete offensive player — facing a pitcher who walks nearly 8 per 9 innings sets up the perfect behind-in-the-count fastball situation for his elite pull power. Must-play value.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "💰 Value"]
  },
  {
    id: 31,
    name: "Brent Rooker",
    team: "ATH",
    tier: "A",
    park: "Sutter Health Park",
    pitcher: "Kris Bubic",
    pitcherNote: "Bubic (KC): 8 ER in last 2 starts — cooked, arm on fumes",
    matchupGrade: "A",
    estOdds: "+350",
    note: "Rooker is one of baseball's most dangerous right-handed power bats and absolutely feasts against pitchers showing command regression. Bubic's 8 ER in his last two starts signals a pitcher on fumes — Rooker is the premium ATH stack anchor today.",
    tags: ["💣 SP Disaster", "🔥 Hot", "💰 Value"]
  },
  {
    id: 32,
    name: "Lawrence Butler",
    team: "ATH",
    tier: "B",
    park: "Sutter Health Park",
    pitcher: "Kris Bubic",
    pitcherNote: "Bubic: 8 ER in 2 starts — disaster arm, arm on fumes",
    matchupGrade: "B+",
    estOdds: "+480",
    note: "Butler posts elite exit velocity from the left side and provides massive upside value stacked with Rooker against a collapsing Bubic. His developing power and improving plate discipline make him the ideal breakout stack candidate.",
    tags: ["💣 SP Disaster", "📈 Breakout", "💰 Value"]
  },

  // ── SEA@MIN — Target Field — 10mph Wind Out — Gilbert vs Ryan ──
  {
    id: 33,
    name: "Carlos Correa",
    team: "MIN",
    tier: "A",
    park: "Target Field",
    pitcher: "Logan Gilbert",
    pitcherNote: "Gilbert (SEA): strong ERA but Statcast indicators show regression",
    matchupGrade: "B+",
    estOdds: "+400",
    note: "Correa is hitting at a career-best power level this season with a 92nd-percentile barrel rate and aggressive approach against right-handed aces. Target Field's 10-mph outbound wind gives him the park-boost necessary to convert hard-hit balls into home runs.",
    tags: ["💨 Wind Boost", "🔥 Hot"]
  },
  {
    id: 34,
    name: "Julio Rodriguez",
    team: "SEA",
    tier: "A",
    park: "Target Field",
    pitcher: "Joe Ryan",
    pitcherNote: "Ryan (MIN): solid ERA but FB% elevated and xERA outpacing ERA",
    matchupGrade: "B+",
    estOdds: "+390",
    note: "Rodriguez has been on an absolute tear with a 96th-percentile exit velocity and the most raw power of any center fielder in baseball. Target Field's 10-mph wind out gives his elite bat speed a massive carry boost against an arm showing regression signals.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "🔥 Hot"]
  },

  // ── MIA@LAD — UNIQLO Field at Dodger Stadium — 10mph Wind Out — Junk vs [LAD Batters] ──
  {
    id: 35,
    name: "Mookie Betts",
    team: "LAD",
    tier: "A",
    park: "UNIQLO Field at Dodger Stadium",
    pitcher: "Garrett Junk",
    pitcherNote: "Junk (MIA): 4.8+ ERA in 2026, limited movement on pitches",
    matchupGrade: "A",
    estOdds: "+310",
    note: "Betts uses elite plate discipline to attack early-count mistakes and has a 94th-percentile exit velocity in recent weeks. Dodger Stadium's 10-mph wind blowing out combined with Junk's flat stuff makes this a premium pull-side home run setup.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost"]
  },
  {
    id: 36,
    name: "Freddie Freeman",
    team: "LAD",
    tier: "A",
    park: "UNIQLO Field at Dodger Stadium",
    pitcher: "Garrett Junk",
    pitcherNote: "Junk: limited arsenal, high contact-quality allowed rate in 2026",
    matchupGrade: "A-",
    estOdds: "+340",
    note: "Freeman's consistent barrel rate and elite approach against below-average right-handers guarantees high-quality contact tonight. The outbound Dodger Stadium wind gives every elevated ball a chance to carry over the fences.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost"]
  },
  {
    id: 37,
    name: "Will Smith",
    team: "LAD",
    tier: "B",
    park: "UNIQLO Field at Dodger Stadium",
    pitcher: "Garrett Junk",
    pitcherNote: "Junk: below-average command, elevated walks in early 2026",
    matchupGrade: "B+",
    estOdds: "+430",
    note: "Smith provides right-handed power from the catcher position and is the most underrated barrel rate in the LAD lineup at 18%. Stacked behind Betts and Freeman against a sub-par arm in a wind-aided environment, he is a top value stack play.",
    tags: ["💰 Value", "💨 Wind Boost"]
  },
  {
    id: 38,
    name: "Teoscar Hernandez",
    team: "LAD",
    tier: "B",
    park: "UNIQLO Field at Dodger Stadium",
    pitcher: "Garrett Junk",
    pitcherNote: "Junk: 4.8+ ERA — limited swing-and-miss ability",
    matchupGrade: "B+",
    estOdds: "+430",
    note: "Hernandez crushes fastballs with 94th-percentile exit velocity and is perfectly positioned to punish a finesse pitcher trying to spot the ball against elite contact hitters. The Dodger Stadium wind supercharges every fly ball he makes contact on.",
    tags: ["🔥 Hot", "💨 Wind Boost"]
  },
  {
    id: 39,
    name: "Max Muncy",
    team: "LAD",
    tier: "A",
    park: "UNIQLO Field at Dodger Stadium",
    pitcher: "Garrett Junk",
    pitcherNote: "Junk: lacks plus-stuff, gives up hard contact vs LHH",
    matchupGrade: "A-",
    estOdds: "+380",
    note: "Muncy is a nightmare left-handed matchup for any right-hander with limited breaking-ball sharpness — his pull-side power stroke is one of baseball's most consistent home run profiles. Dodger Stadium's outbound wind is a pure multiplier for his already elite fly-ball carry.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "💰 Value"]
  },

  // ── HOU@BAL — Camden Yards — Teng vs Baz ──
  {
    id: 40,
    name: "Adley Rutschman",
    team: "BAL",
    tier: "B",
    park: "Oriole Park at Camden Yards",
    pitcher:="Hayden Birdsong",
    pitcherNote: "Teng (HOU): limited MLB track record, inconsistent command",
    matchupGrade: "B+",
    estOdds: "+440",
    note: "Rutschman is one of baseball's most complete offensive catchers and has been producing at an elite level this season with strong exit velocity and walk rate. Camden's soft outbound wind today provides a modest carry advantage for his opposite-field power.",
    tags: ["💰 Value", "🔥 Hot"]
  },
  {
    id: 40,
    name: "Adley Rutschman",
    team: "BAL",
    tier: "B",
    park: "Oriole Park at Camden Yards",
    pitcher: "Hayden Teng",
    pitcherNote: "Teng (HOU): limited MLB track record, inconsistent command",
    matchupGrade: "B+",
    estOdds: "+440",
    note: "Rutschman is one of baseball's most complete offensive catchers with strong exit velocity and a mature approach against young right-handers. Camden's soft outbound conditions today provide a modest park-factor advantage for his pull-side swing.",
    tags: ["💰 Value", "🔥 Hot"]
  },
  {
    id: 41,
    name: "Yordan Alvarez",
    team: "HOU",
    tier: "A",
    park: "Oriole Park at Camden Yards",
    pitcher: "Jack Baz",
    pitcherNote: "Baz (BAL): strong K-rate but elevated HR/9 in 2026 sample",
    matchupGrade: "B+",
    estOdds: "+350",
    note: "Alvarez owns a 98th-percentile hard-hit rate and is arguably the most dangerous left-handed power bat in baseball against any pitcher. Camden Yards is historically one of the more HR-friendly outdoor parks and Baz's elevated HR/9 makes this a live Alvarez bomb spot.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },

  // ── STL@PIT — PNC Park — Leahy vs Chandler ──
  {
    id: 42,
    name: "Nolan Gorman",
    team: "STL",
    tier: "B",
    park: "PNC Park",
    pitcher: "Bubba Chandler",
    pitcherNote: "Chandler (PIT): young arm, command still developing in 2026",
    matchupGrade: "B",
    estOdds: "+470",
    note: "Gorman has one of the most explosive left-handed power strokes in baseball and will punish any fastball left over the plate by a developing arm. PNC Park has a wind-in scenario today which limits the ceiling but his raw power offsets the park factor.",
    tags: ["📈 Breakout", "💰 Value"]
  },

  // ── CHC@SD — Petco Park — Cross Wind — Cabrera vs Buehler ──
  {
    id: 43,
    name: "Fernando Tatis Jr.",
    team: "SD",
    tier: "A",
    park: "Petco Park",
    pitcher: "Oswaldo Cabrera",
    pitcherNote: "Cabrera (CHC): reliever-turned-starter, limited SP track record",
    matchupGrade: "B+",
    estOdds: "+310",
    note: "Tatis Jr. posts a 95th-percentile barrel rate and has been one of the NL's hottest power hitters this month with back-to-back multi-hit games. Petco's cross wind is not ideal, but Tatis's raw exit velocity can overcome any mild suppression effect.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 44,
    name: "Kyle Tucker",
    team: "CHC",
    tier: "A",
    park: "Petco Park",
    pitcher: "Walker Buehler",
    pitcherNote: "Buehler (SD): strong ERA but mechanics still rebuilding post-TJ",
    matchupGrade: "B+",
    estOdds: "+360",
    note: "Tucker is a consistent 30-HR threat with a natural pull-side power profile that has produced elite exit velocity metrics all season. He targets pitchers whose secondary stuff doesn't get to the plate on time — a post-TJ Buehler with marginal command fits that profile.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 45,
    name: "Jackson Merrill",
    team: "SD",
    tier: "B",
    park: "Petco Park",
    pitcher: "Oswaldo Cabrera",
    pitcherNote: "Cabrera: converted reliever in SP role — likely limited pitch count",
    matchupGrade: "B",
    estOdds: "+480",
    note: "Merrill showed breakout power in 2025 and has continued punishing mistakes with above-average exit velocity this season. Facing a reliever being stretched as a starter with limited SP experience gives him a ceiling-play opportunity at great odds.",
    tags: ["📈 Breakout", "💰 Value"]
  },

  // ── AZ@MIL — American Family Field — Dome/Closed — Kelly vs Patrick ──
  {
    id: 46,
    name: "William Contreras",
    team: "MIL",
    tier: "A",
    park: "American Family Field",
    pitcher: "Merrill Kelly",
    pitcherNote: "Kelly (AZ): 9.38 ERA in 2026, allowed 3 HRs in last start, rocked",
    matchupGrade: "A+",
    estOdds: "+380",
    note: "Contreras has 7 HRs and an OPS of 1.227 in 22 career games against the Diamondbacks — he is an active AZ killer walking into a nightmare matchup for Merrill Kelly who has been absolutely shelled this season. This is the slate's top value A-tier play.",
    tags: ["💣 SP Disaster", "🔥 Hot", "💰 Value"]
  },
  {
    id: 47,
    name: "Corbin Carroll",
    team: "AZ",
    tier: "A",
    park: "American Family Field",
    pitcher: "Chad Patrick",
    pitcherNote: "Patrick (MIL): 2.35 ERA — solid arm, but AZ lineup is live",
    matchupGrade: "B+",
    estOdds: "+400",
    note: "Carroll's elite speed and extra-base ability make him a constant threat for extra-base hits in any environment — his improving power metrics and ability to drive the ball into the gaps translate well in the dome. He is the top AZ play for the high-ceiling parlay stack.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },

  // ── C-TIER LOTTERY PLAYS ──
  {
    id: 48,
    name: "Jose Aranda",
    team: "TB",
    tier: "C",
    park: "Progressive Field",
    pitcher: "Tanner Bibee",
    pitcherNote: "Bibee: 1.2 HR/9 — fly-ball rate climbing in April",
    matchupGrade: "C+",
    estOdds: "+470",
    note: "Aranda has elite pull-side raw power and has connected for hard-hit balls in recent weeks at an above-average clip. The 14-mph wind at Progressive Field is the perfect lottery multiplier for his occasional power outbursts.",
    tags: ["🎰 Longshot", "💨 Wind Boost"]
  },
  {
    id: 49,
    name: "Gavin Lux",
    team: "LAD",
    tier: "C",
    park: "UNIQLO Field at Dodger Stadium",
    pitcher: "Garrett Junk",
    pitcherNote: "Junk: flat pitches over the zone, getting hit hard in 2026",
    matchupGrade: "C+",
    estOdds: "+650",
    note: "Lux provides a high-ceiling lottery option stacked deep in the LAD lineup against a below-average arm with command issues. The Dodger Stadium wind makes any ball he elevates a potential moon shot in this deep-stack lineup.",
    tags: ["🎰 Longshot", "💨 Wind Boost"]
  },
  {
    id: 50,
    name: "Spencer Torkelson",
    team: "DET",
    tier: "C",
    park: "Truist Park",
    pitcher: "Chris Perez",
    pitcherNote: "Perez (ATL): young ATL arm, still establishing big-league command",
    matchupGrade: "C",
    estOdds: "+700",
    note: "Torkelson has elite raw power that has yet to fully materialize — his exit velocity metrics are in the 91st percentile but he contacts the ball at a low barrel rate. This is a pure lottery play banking on one of his notorious tape-measure shots materializing.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
];

const parlays = [
  {
    id: "4A",
    legs: 4,
    label: "THE CORE FOUR",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1100",
    description: "The 4 highest-probability S-tier legs on the Tuesday slate.",
    playerIds: [22, 19, 9, 30],
    strategy: "Soto (NYM) vs Littell — the most underpriced HR prop on the board. Alonso (NYM) in the same park vs the league's worst HR-allowed pitcher. De La Cruz (CIN) at GABP vs Sugano's 6.04 xERA. Witt Jr. (KC) vs Lopez's 7.7 BB/9 disaster arm. Four elite bats with elite pitcher regression targets."
  },
  {
    id: "4B",
    legs: 4,
    label: "METS DISASTER STACK",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1300",
    description: "Full NYM stack vs Zach Littell — the league's worst HR-allowed pitcher since 2025.",
    playerIds: [22, 19, 20, 21],
    strategy: "Soto, Alonso, and Lindor target Littell's 3.9 HR/9 at home with Citi Field wind blowing out. James Wood adds the WAS side — the 8-mph outbound wind boosts all four legs simultaneously in what is the slate's premium single-game stack."
  },
  {
    id: "5A",
    legs: 5,
    label: "THE HIGH FIVE",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+2100",
    description: "S-tier anchors combined with top pitcher regression and wind plays.",
    playerIds: [22, 9, 4, 30, 21],
    strategy: "Soto (NYM) and Alonso (NYM) anchor vs Littell. De La Cruz (CIN) feasts on Sugano's 6.04 xERA at GABP. Caminero (TB) rides the 14-mph Progressive Field wind vs Bibee. Witt Jr. (KC) destroys Lopez's 7.7 BB/9 walk machine. Five premium matchups, five premium contexts."
  },
  {
    id: "5B",
    legs: 5,
    label: "THE EV SPECIAL",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2600",
    description: "5 players with the highest EV and Barrel% metrics on the Tuesday slate.",
    playerIds: [22, 26, 9, 4, 34],
    strategy: "Soto (96th-percentile barrel), Judge (26% barrel rate), De La Cruz (95th-percentile EV), Caminero (96th-percentile EV), and J-Rod (96th-percentile EV). Five of the hardest contact-makers in baseball each with favorable matchup contexts today."
  },
  {
    id: "5C",
    legs: 5,
    label: "THE REGRESSION BOMB",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2400",
    description: "Five players targeting pitchers with the biggest ERA-vs-xERA gaps today.",
    playerIds: [9, 10, 7, 8, 46],
    strategy: "De La Cruz and Steer target Sugano's historic 6.04 xERA at GABP. Schwarber and Harper destroy Mahle's 5.78 FIP at Citizens Bank. Contreras ambushes Merrill Kelly who has a 9.38 ERA in 2026. Five hitters, five disaster pitchers — regression bomb activated."
  },
  {
    id: "6A",
    legs: 6,
    label: "GREAT AMERICAN DISASTER",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+3400",
    description: "Full GABP stack vs Sugano's 6.04 xERA in the #2 HR park today.",
    playerIds: [9, 10, 11, 7, 8, 13],
    strategy: "De La Cruz, Steer, and Stephenson stack the Reds side vs Sugano's historic regression target at GABP. Schwarber, Harper, and Castellanos anchor the Phillies side vs Mahle's 5.78 FIP. Six bats, two of the worst pitchers on the slate, two hitter-friendly outdoor parks."
  },
  {
    id: "6B",
    legs: 6,
    label: "LITTELL SLAUGHTER HOUSE",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+3200",
    description: "Full stack vs Zach Littell — the most HR-prone pitcher in baseball since 2025.",
    playerIds: [22, 19, 20, 15, 29, 31],
    strategy: "Soto, Alonso, and Lindor target Littell's 3.9 HR/9 at home in Citi Field wind. Devers (BOS) bats against the MiLB call-up Yesavage. Perez (KC) and Rooker (ATH) target the two worst arms on the evening slate. Fully loaded disaster-pitcher stack."
  },
  {
    id: "7A",
    legs: 7,
    label: "PROGRESSIVE WIND STORM",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+6800",
    description: "Max wind-boost exposure — full Progressive Field stack in the slate's best weather game.",
    playerIds: [1, 2, 3, 4, 5, 6, 48],
    strategy: "Ramirez, Naylor, and Manzardo stack the CLE side. Caminero, Diaz, Paredes, and Aranda stack the TB side. Seven players locked into the 14-mph outgoing wind at Progressive Field — the most aggressive single-park weather stack on the slate."
  },
  {
    id: "7B",
    legs: 7,
    label: "THE WIND CHASER",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+5800",
    description: "Stack all wind-boosted outdoor parks today (10+ mph out).",
    playerIds: [1, 4, 35, 39, 19, 22, 34],
    strategy: "Ramirez and Caminero ride the CLE 14-mph wind. Betts and Muncy get the 10-mph Dodger Stadium boost. Alonso and Soto benefit from Citi Field's 8-mph outbound conditions. J-Rod gets the 10-mph Target Field tailwind. Seven premium bats across four outdoor wind-boosted parks."
  },
  {
    id: "7C",
    legs: 7,
    label: "THE HOT HAND",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+6500",
    description: "Players confirmed in recent peak hot form this week.",
    playerIds: [9, 22, 21, 26, 46, 30, 25],
    strategy: "De La Cruz (2 HRs in one game), Soto (top-10 weekly ISO), Wood (HR in 3 straight games), Judge (362nd career HR), Contreras (career 1.227 OPS vs AZ), Witt Jr. (top-5 AL barrel rate), and Acuna (returning to full health with elite metrics). Seven bats all confirmed running hot."
  },
  {
    id: "8A",
    legs: 8,
    label: "THE SLUGGER SUMMIT",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+9800",
    description: "All S-tier anchors plus top A-tier matchups across the slate.",
    playerIds: [22, 19, 9, 4, 21, 30, 26, 35],
    strategy: "Soto, Alonso, De La Cruz, Caminero, Wood, Witt Jr., Judge, and Betts. Eight of the highest-probability home run candidates on the slate each with elite underlying metrics and favorable matchup contexts. The complete S-tier and A-tier power summit."
  },
  {
    id: "8B",
    legs: 8,
    label: "THE VALUE MATRIX",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+10200",
    description: "S-tier anchors heavily fortified with the highest-value B-tier plays today.",
    playerIds: [22, 9, 30, 46, 31, 37, 15, 32],
    strategy: "Soto and De La Cruz as S-tier anchors. Witt Jr., Contreras, Rooker, Will Smith, Devers, and Butler as high-value underpriced B/A plays. Building maximum odds without sacrificing core probability anchors — the slate's best risk-adjusted parlay."
  },
  {
    id: "9A",
    legs: 9,
    label: "THE GRAND SALAMI",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+19000",
    description: "9-leg monster covering every premium S-tier and park context on the slate.",
    playerIds: [22, 19, 9, 4, 21, 30, 26, 7, 35],
    strategy: "Soto, Alonso, De La Cruz, Caminero, Wood, Witt Jr., Judge, Schwarber, and Betts. Nine of the highest-probability names on the slate spanning every top park factor — wind at CLE, PHI, NYM, LAD — plus three of the five worst pitchers on the board. Maximum premium coverage."
  },
  {
    id: "9B",
    legs: 9,
    label: "THE SLEEPER STACK",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+22000",
    description: "S-tier anchors mixed with deep-value sleeper bats and breakout candidates.",
    playerIds: [22, 9, 30, 46, 31, 16, 34, 45, 32],
    strategy: "Soto, De La Cruz, and Witt Jr. as the S-tier core. Contreras (AZ Killer), Rooker (vs cooked Bubic), Duran (vs MiLB call-up), J-Rod (Target Field wind), Merrill (breakout), and Butler (vs collapsing Bubic). Incredible payout ceiling with legitimate underlying edge across all nine legs."
  },
  {
    id: "10A",
    legs: 10,
    label: "THE LOTTERY TICKET",
    risk: "Max Risk",
    riskColor: "#9c27b0",
    estPayout: "+42000",
    description: "Elite core surrounded by C-tier moon shot lottery legs for maximum payout.",
    playerIds: [22, 19, 9, 4, 30, 26, 7, 35, 49, 50],
    strategy: "Core anchors: Soto, Alonso, De La Cruz, Caminero, Witt Jr., Judge, Schwarber, Betts. Two pure moon shots: Lux (LAD lottery deep in lineup vs Junk's flat stuff, Dodger wind) and Torkelson (DET — elite raw power that is statistically due for a tape-measure bomb). This parlay only hits if both lottery legs connect — but the payout is life-changing."
  },
];
