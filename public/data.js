const TEAM_TO_GAME = {
  NYY: "NYY@KC",   KC:  "NYY@KC",
  HOU: "HOU@TEX",  TEX: "HOU@TEX",
  ATL: "ATL@BOS",  BOS: "ATL@BOS",
  MIA: "MIA@TOR",  TOR: "MIA@TOR",
  CIN: "CIN@NYM",  NYM: "CIN@NYM",
  MIN: "MIN@CWS",  CWS: "MIN@CWS",
  WSH: "WSH@CLE",  CLE: "WSH@CLE",
  TB:  "TB@BAL",   BAL: "TB@BAL",
  LAA: "LAA@DET",  DET: "LAA@DET",
  CHC: "CHC@PIT",  PIT: "CHC@PIT",
  PHI: "PHI@SD",   SD:  "PHI@SD",
  SEA: "SEA@ATH",  ATH: "SEA@ATH",
  AZ:  "AZ@SF",    SF:  "AZ@SF",
  COL: "COL@LAD",  LAD: "COL@LAD",
  STL: "STL@MIL",  MIL: "STL@MIL"
};

const SLATE_DATE  = "MAY 27, 2026";
const SLATE_LABEL = "WEDNESDAY MLB SLATE";

const CONTEXT_CARDS = [
  {
    icon:  "💥",
    label: "Eury Pérez — SP Disaster",
    note:  "5.33 ERA / 1.41 WHIP — Rogers Centre dome stack is the top HR play today",
    sub:   "Pérez has been historically bad in 2026 — a 5.33 ERA and 1.41 WHIP that rank among the worst active qualified starters in baseball. The Rogers Centre dome removes all weather variance, letting Vladdy, Bichette, and Springer feast in a fully controlled environment against one of the most hittable arms on the slate. This is the single cleanest pitcher-disaster stack of the day."
  },
  {
    icon:  "🌬️",
    label: "Kauffman Stadium — 9 MPH Wind Tonight",
    note:  "Judge + Rice vs Cameron 5.20 ERA — the best outdoor HR combo on the board",
    sub:   "Kauffman Stadium pairs its historically strong HR environment with 9 mph winds tonight and a 82°F temperature, creating one of the best outdoor power contexts on the slate. Noah Cameron's 5.20 ERA gives Judge and Rice a live shot at every at-bat — combine the wind, the park, and the disaster starter and Kauffman is today's premium outdoor stack venue."
  },
  {
    icon:  "🏠",
    label: "Globe Life Dome Stack",
    note:  "Alvarez / Tucker / Altuve vs McDonald 4.80 ERA — pure dome power",
    sub:   "Globe Life Field's closed roof delivers a fully controlled environment where Trevor McDonald's 4.80 ERA is the only variable that matters. Alvarez leads MLB with a 1.199 OPS and .736 SLG — he's the most dangerous bat alive against any pitcher. Tucker and Altuve give this dome stack depth and lineup coverage across three legitimate HR threats in one of the cleanest setups of the 2026 season."
  },
  {
    icon:  "💰",
    label: "James Wood Value Spot",
    note:  "96.4 avg exit velocity + 25.4% barrel rate + 15 HR — elite metrics at +360",
    sub:   "Wood is quietly one of the most dangerous power threats in baseball — 96.4 average exit velocity and 25.4% barrel rate rank in the elite tier of all MLB hitters. His .916 OPS and 15 HR entering today put him firmly in A-tier consideration despite the odds, and Gavin Williams has command issues that inflate walk rates and count. Wood at +360 is the sharpest value play on the board today."
  }
];

const PARK_FACTORS = {
  "Fenway Park": {
    rank: 1,
    label: "💨 Wind Boost — 9.2 MPH Tonight",
    color: "#90e0ef"
  },
  "Kauffman Stadium": {
    rank: 2,
    label: "💨 Wind Boost + Good HR Park",
    color: "#90e0ef"
  },
  "Guaranteed Rate Field": {
    rank: 3,
    label: "🔥 Above-Average HR Park",
    color: "#ffb347"
  },
  "Globe Life Field": {
    rank: 4,
    label: "Dome/Roof Closed",
    color: "#b0bec5"
  },
  "Camden Yards": {
    rank: 5,
    label: "✅ Good HR Environment",
    color: "#ffb347"
  },
  "PNC Park": {
    rank: 6,
    label: "⚾ Neutral / Slight HR Friendly",
    color: "#b0bec5"
  },
  "Dodger Stadium": {
    rank: 7,
    label: "⚾ Neutral HR Context",
    color: "#b0bec5"
  },
  "American Family Field": {
    rank: 8,
    label: "Dome/Roof Closed",
    color: "#b0bec5"
  },
  "Rogers Centre": {
    rank: 9,
    label: "Dome/Roof Closed",
    color: "#b0bec5"
  },
  "Comerica Park": {
    rank: 10,
    label: "📉 Large Outfield — Suppressive",
    color: "#78909c"
  },
  "Citi Field": {
    rank: 11,
    label: "📉 Slight Pitcher Advantage",
    color: "#b0bec5"
  },
  "Sutter Health Park": {
    rank: 12,
    label: "⚾ Neutral Outdoor Context",
    color: "#b0bec5"
  },
  "Progressive Field": {
    rank: 13,
    label: "📉 Slightly Suppressive",
    color: "#78909c"
  },
  "Oracle Park": {
    rank: 14,
    label: "❄️ Marine Layer Suppression",
    color: "#78909c"
  },
  "Petco Park": {
    rank: 15,
    label: "🥶 Most Suppressive Today",
    color: "#78909c"
  }
};

const players = [
  // ─── S-TIER ────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Aaron Judge",
    team: "NYY",
    tier: "S",
    park: "Kauffman Stadium",
    pitcher: "Noah Cameron",
    pitcherNote: "5.20 ERA / 1.45 WHIP — unproven KC arm with no reliable put-away pitch, allowing hard contact in every start this season.",
    matchupGrade: "A+",
    estOdds: "+280",
    note: "Judge has cracked 16 HR and a 1.037 OPS making him the most dangerous right-handed power bat alive this season. Noah Cameron's 5.20 ERA at Kauffman's 9 mph wind environment is the cleanest SP-disaster outdoor setup on the slate — every Judge at-bat tonight is a live threat.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "💨 Wind Boost"]
  },
  {
    id: 2,
    name: "Vladimir Guerrero Jr.",
    team: "TOR",
    tier: "S",
    park: "Rogers Centre",
    pitcher: "Eury Pérez",
    pitcherNote: "5.33 ERA / 1.41 WHIP — one of the worst qualified ERAs in baseball, surrendering hard contact and walks at historic rates.",
    matchupGrade: "A+",
    estOdds: "+310",
    note: "Guerrero Jr. is in a contract year and has been elite — 12 HR and an .880 OPS with explosive pull-side power that punishes mistake pitchers. Eury Pérez's 5.33 ERA inside Rogers Centre's controlled dome is pure free real estate — Vladdy is the premier value on today's entire board.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 3,
    name: "Yordan Alvarez",
    team: "HOU",
    tier: "S",
    park: "Globe Life Field",
    pitcher: "Trevor McDonald",
    pitcherNote: "4.80 ERA / 1.38 WHIP — secondary stuff lacks the depth to put away elite contact hitters, walk rate trending upward.",
    matchupGrade: "A+",
    estOdds: "+260",
    note: "Alvarez leads all of MLB with a .355 BA, .736 SLG, and 1.199 OPS — the most dominant offensive season in baseball right now. Trevor McDonald's 4.80 ERA inside Globe Life's controlled dome gives the best hitter alive a weather-free shot at a pitcher who cannot keep him in check.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 4,
    name: "Kyle Tucker",
    team: "HOU",
    tier: "S",
    park: "Globe Life Field",
    pitcher: "Trevor McDonald",
    pitcherNote: "4.80 ERA / 1.38 WHIP — flat four-seamer approach without consistent breaking ball to slow down Houston's middle-order bats.",
    matchupGrade: "A+",
    estOdds: "+310",
    note: "Tucker has posted 14 HR and an .870 OPS continuing his development as one of the AL's elite right-handed power threats this season. McDonald's 4.80 ERA in Globe Life's dome creates the ideal double-stack with Alvarez — Tucker is underpriced for a pitcher this exploitable.",
    tags: ["💣 SP Disaster", "🔥 Hot", "💰 Value"]
  },
  {
    id: 5,
    name: "Byron Buxton",
    team: "MIN",
    tier: "S",
    park: "Guaranteed Rate Field",
    pitcher: "David Sandlin",
    pitcherNote: "5.40 ERA / 1.52 WHIP — worst ERA in today's slate, command breakdowns on fastball and slider generate hard contact all game.",
    matchupGrade: "A+",
    estOdds: "+330",
    note: "Buxton has ripped 13 HR with a 19.7% barrel rate and .870 OPS, delivering the elite power profile that his athleticism has always projected. David Sandlin's 5.40 ERA is the single worst starting pitcher on today's slate — Buxton versus the biggest disaster arm at an above-average HR park is an A+ spot.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 6,
    name: "Ben Rice",
    team: "NYY",
    tier: "S",
    park: "Kauffman Stadium",
    pitcher: "Noah Cameron",
    pitcherNote: "5.20 ERA / 1.45 WHIP — lacks command on secondary pitches, routinely falls behind in counts against power hitters.",
    matchupGrade: "A",
    estOdds: "+300",
    note: "Rice has posted a 1.145 OPS — second best in all of baseball — with 16 HR establishing himself as one of the most dangerous young sluggers in the AL. Cameron's 5.20 ERA at Kauffman with tonight's 9 mph wind gives Rice a two-factor edge the market hasn't fully priced in.",
    tags: ["📈 Breakout", "💣 SP Disaster", "💨 Wind Boost"]
  },

  // ─── A-TIER ────────────────────────────────────────────────────────────────
  {
    id: 7,
    name: "Seiya Suzuki",
    team: "CHC",
    tier: "A",
    park: "PNC Park",
    pitcher: "Bubba Chandler",
    pitcherNote: "4.62 ERA / 1.46 WHIP — slider command lapses leave him vulnerable to opposite-field contact from disciplined right-handed bats.",
    matchupGrade: "A",
    estOdds: "+380",
    note: "Suzuki has hit 9 HR and an .850 OPS as the Cubs' reliable right-handed power bat providing a balanced attack through the middle of the order. Chandler's 4.62 ERA at outdoor PNC Park makes the entire CHC lineup a stacking target — Suzuki is the secondary CHC value behind Happ.",
    tags: ["💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 8,
    name: "Bo Bichette",
    team: "TOR",
    tier: "A",
    park: "Rogers Centre",
    pitcher: "Eury Pérez",
    pitcherNote: "5.33 ERA / 1.41 WHIP — cannot generate consistent weak contact, hard-hit rate against him is one of the worst in baseball.",
    matchupGrade: "A",
    estOdds: "+390",
    note: "Bichette has put up 9 HR and an .830 OPS with plus bat speed that punishes pitchers who leave the ball over the middle of the plate. Pérez's 5.33 ERA inside Rogers Centre's dome is a no-weather-risk disaster stack — Bichette is the Blue Jays' most dangerous second option after Vladdy.",
    tags: ["💣 SP Disaster", "📈 Breakout"]
  },
  {
    id: 9,
    name: "George Springer",
    team: "TOR",
    tier: "A",
    park: "Rogers Centre",
    pitcher: "Eury Pérez",
    pitcherNote: "5.33 ERA / 1.41 WHIP — elevated HR/9 in current stretch signals a pitch-mix problem that veteran right-handed hitters expose repeatedly.",
    matchupGrade: "A",
    estOdds: "+420",
    note: "Springer has produced 8 HR and an .820 OPS as Toronto's veteran leadoff catalyst, providing pull-side power from a top lineup slot. Pérez's 5.33 ERA gives the entire TOR lineup a disaster-stack setup — Springer at +420 is genuine value for a three-time champion who thrives against bad pitching.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 10,
    name: "James Wood",
    team: "WSH",
    tier: "A",
    park: "Progressive Field",
    pitcher: "Gavin Williams",
    pitcherNote: "3.90 ERA / 1.35 WHIP — elevated walk rate and command lapses in middle innings create hittable counts for elite contact bats.",
    matchupGrade: "B+",
    estOdds: "+360",
    note: "Wood leads the Nationals with 15 HR and a .916 OPS, backed by a 96.4 average exit velocity and elite 25.4% barrel rate that rank in the top 5% of all MLB hitters. Williams's 3.90 ERA with a walk-heavy approach gives Wood live opportunities in every at-bat — he's the best value on the entire board at +360.",
    tags: ["📈 Breakout", "🔥 Hot", "💰 Value"]
  },
  {
    id: 11,
    name: "Kyle Schwarber",
    team: "PHI",
    tier: "A",
    park: "Petco Park",
    pitcher: "Walker Buehler",
    pitcherNote: "3.80 ERA / 1.22 WHIP — has been hittable in recent starts, xFIP tracking above ERA with HR/9 regression overdue.",
    matchupGrade: "B+",
    estOdds: "+290",
    note: "Schwarber leads all of baseball with 20 HR through 49 games — the fastest any player has reached that mark in MLB history. Buehler's 3.80 ERA at suppressive Petco is the one drag on this spot, but no park can stop a man projecting for 65+ HR when he gets a mistake pitch.",
    tags: ["👑 MVP/Elite", "🔥 Hot", "📈 Breakout"]
  },
  {
    id: 12,
    name: "Munetaka Murakami",
    team: "CWS",
    tier: "A",
    park: "Guaranteed Rate Field",
    pitcher: "Connor Prielipp",
    pitcherNote: "2.88 ERA / 1.12 WHIP — solid command overall, but Murakami's elite exit velocity creates danger even against disciplined starters.",
    matchupGrade: "B",
    estOdds: "+350",
    note: "Murakami has launched 17 HR to lead the AL — his historic power has made him the most talked-about rookie in baseball since Shohei Ohtani's 2018 debut. Even against Prielipp's 2.88 ERA, Murakami's raw power is so elite that one mistake pitch at Guaranteed Rate ends up in the seats.",
    tags: ["📈 Breakout", "🔥 Hot", "💰 Value"]
  },
  {
    id: 13,
    name: "Jose Altuve",
    team: "HOU",
    tier: "A",
    park: "Globe Life Field",
    pitcher: "Trevor McDonald",
    pitcherNote: "4.80 ERA / 1.38 WHIP — lacks the movement to handle the Houston lineup's elite bat-to-ball ability multiple times through.",
    matchupGrade: "A-",
    estOdds: "+420",
    note: "Altuve has 9 HR and an .810 OPS providing veteran power from Houston's top of the order — a clutch performer who elevates in big spots. McDonald's 4.80 ERA inside Globe Life's controlled dome makes this an HOU triple-stack scenario — Altuve completes the trio behind Alvarez and Tucker.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 14,
    name: "Freddie Freeman",
    team: "LAD",
    tier: "A",
    park: "Dodger Stadium",
    pitcher: "Tomoyuki Sugano",
    pitcherNote: "3.86 ERA / 1.23 WHIP — lacks a true swing-and-miss offering, generating soft contact rather than strikeouts at a career-high BABIP.",
    matchupGrade: "B+",
    estOdds: "+400",
    note: "Freeman has raked for 12 HR and a .890 OPS delivering consistent middle-order pop at one of MLB's best HR parks with Dodger Stadium. Sugano's 3.86 ERA and BABIP-driven approach at Dodger Stadium puts Freeman in a live power spot — the best LAD bat behind Ohtani in today's setup.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 15,
    name: "Bobby Witt Jr.",
    team: "KC",
    tier: "A",
    park: "Kauffman Stadium",
    pitcher: "Gerrit Cole",
    pitcherNote: "3.41 ERA / 1.18 WHIP — declining mid-season velocity and 11 HR allowed make him more exploitable than his ERA suggests.",
    matchupGrade: "B+",
    estOdds: "+460",
    note: "Witt Jr. has put up 11 HR and a .900 OPS as Kansas City's young superstar — a five-tool talent who consistently punishes mistakes at his home park. Cole's 3.41 ERA at Kauffman tonight with 9 mph wind gives Witt a legitimate outdoor power edge at +460 — he's the top Royals value play on the board.",
    tags: ["📈 Breakout", "💨 Wind Boost", "💰 Value"]
  },
  {
    id: 16,
    name: "Elly De La Cruz",
    team: "CIN",
    tier: "A",
    park: "Citi Field",
    pitcher: "Huascar Brazoban",
    pitcherNote: "4.50 ERA / 1.40 WHIP — secondary pitch location collapses under pressure, surrendering hard contact to athletic bats through the order.",
    matchupGrade: "A-",
    estOdds: "+380",
    note: "Elly De La Cruz has posted 13 HR and a .285 ISO cementing himself as one of the NL's elite five-tool stars with elite bat speed and raw power. Brazoban's 4.50 ERA makes the Reds' lineup a legitimate stacking target — Elly's combination of speed and power gives him the highest upside of any Reds bat today.",
    tags: ["📈 Breakout", "💣 SP Disaster"]
  },
  {
    id: 17,
    name: "Anthony Santander",
    team: "BAL",
    tier: "A",
    park: "Camden Yards",
    pitcher: "Ryan Pepiot",
    pitcherNote: "3.90 ERA / 1.24 WHIP — reliably hittable mid-rotation arm who struggles to navigate the Baltimore lineup a third time through.",
    matchupGrade: "B+",
    estOdds: "+440",
    note: "Santander has quietly assembled 12 HR and an .880 OPS as Baltimore's most consistent power source from the cleanup spot all season long. Camden Yards consistently plays as one of the AL's most HR-friendly environments — Santander versus Pepiot's 3.90 ERA is the best BAL value play today.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 18,
    name: "Gunnar Henderson",
    team: "BAL",
    tier: "A",
    park: "Camden Yards",
    pitcher: "Ryan Pepiot",
    pitcherNote: "3.90 ERA / 1.24 WHIP — mid-rotation stuff with limited swing-and-miss that sets up poorly against elite young contact-plus bats.",
    matchupGrade: "B+",
    estOdds: "+400",
    note: "Henderson has erupted for 14 HR and a .930 OPS becoming one of the AL's most dangerous shortstops — a player projecting for 40+ HR who thrives at Camden Yards. Pepiot's 3.90 ERA gives Henderson the matchup edge at home — the Orioles double-stack with Santander is the best multi-player value at Camden today.",
    tags: ["📈 Breakout", "🔥 Hot"]
  },
  {
    id: 19,
    name: "Fernando Tatis Jr.",
    team: "SD",
    tier: "A",
    park: "Petco Park",
    pitcher: "Cristopher Sanchez",
    pitcherNote: "3.00 ERA / 1.13 WHIP — solid overall but HR/9 trending upward, command dips in middle innings expose power hitters on the outer half.",
    matchupGrade: "B-",
    estOdds: "+480",
    note: "Tatis Jr. has accumulated 11 HR and an .870 OPS as San Diego's premiere power threat — his raw talent can clear any park when he gets a pitch to drive. Even at suppressive Petco, Sanchez's 3.00 ERA is hittable against an elite bat — Tatis's raw power makes him a live dart throw at +480.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },
  {
    id: 20,
    name: "Jazz Chisholm Jr.",
    team: "NYY",
    tier: "A",
    park: "Kauffman Stadium",
    pitcher: "Noah Cameron",
    pitcherNote: "5.20 ERA / 1.45 WHIP — walks batters freely and cannot generate swing-and-miss against any lineup spot in the order.",
    matchupGrade: "A",
    estOdds: "+380",
    note: "Chisholm has posted 12 HR and an .870 OPS in a breakout 2026 campaign — his elite bat speed and athleticism make him one of the most explosive HR threats in the AL lineup. Cameron's 5.20 ERA at Kauffman with 9 mph wind gives Chisholm a third legitimate NYY bat to include in today's SP-disaster stack.",
    tags: ["💣 SP Disaster", "📈 Breakout", "💨 Wind Boost"]
  },

  // ─── B-TIER ────────────────────────────────────────────────────────────────
  {
    id: 21,
    name: "Pete Crow-Armstrong",
    team: "CHC",
    tier: "B",
    park: "PNC Park",
    pitcher: "Bubba Chandler",
    pitcherNote: "4.62 ERA / 1.46 WHIP — slider command issues leave him prone to hard contact from athletic outfielders who can drive the ball to all fields.",
    matchupGrade: "B+",
    estOdds: "+520",
    note: "Crow-Armstrong has 7 HR and a .790 OPS showing genuine power growth as the Cubs' center fielder — a breakout candidate whose barrel rate has climbed all season. Chandler's 4.62 ERA at PNC makes this a three-man CHC stack scenario — PCA is the Cubs' tertiary value play behind Happ and Suzuki.",
    tags: ["📈 Breakout", "💣 SP Disaster"]
  },
  {
    id: 22,
    name: "Rafael Devers",
    team: "BOS",
    tier: "B",
    park: "Fenway Park",
    pitcher: "Bryce Elder",
    pitcherNote: "1.97 ERA / 0.99 WHIP — dominant 2026 form generating elite weak contact, K/BB among the best in the NL despite the matchup.",
    matchupGrade: "B-",
    estOdds: "+480",
    note: "Devers has 10 HR and an .860 OPS with powerful pull-side authority toward the Green Monster — a natural Fenway performer even in tough matchups. Elder's 1.97 ERA is elite but Fenway's 9.2 mph wind tonight provides a real atmospheric edge — Devers's one swing can beat even the best start.",
    tags: ["💨 Wind Boost", "🔜 Due"]
  },
  {
    id: 23,
    name: "Julio Rodriguez",
    team: "SEA",
    tier: "B",
    park: "Sutter Health Park",
    pitcher: "Jeffrey Springs",
    pitcherNote: "3.27 ERA / 1.18 WHIP — returned from injury healthy but lacking full command on breaking ball, susceptible to power from elite athletes.",
    matchupGrade: "B",
    estOdds: "+520",
    note: "Rodriguez has 11 HR and an .850 OPS continuing his development into one of baseball's brightest young stars with improving power numbers. Springs's 3.27 ERA makes this a moderate setup but Rodriguez's raw athleticism and improving exit velocity give him a real shot at the seats.",
    tags: ["📈 Breakout", "🔥 Hot"]
  },
  {
    id: 24,
    name: "Nick Castellanos",
    team: "PHI",
    tier: "B",
    park: "Petco Park",
    pitcher: "Walker Buehler",
    pitcherNote: "3.80 ERA / 1.22 WHIP — xFIP trending above ERA signals regression in HR/9 for right-handed power hitters later in starts.",
    matchupGrade: "C+",
    estOdds: "+550",
    note: "Castellanos has 8 HR and an .800 OPS delivering veteran power from the middle of the Phillies' order alongside Schwarber and Harper. Petco's suppression is real but Castellanos's line-drive authority to the gaps makes him a viable secondary PHI option at extended odds.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 25,
    name: "Ronald Acuña Jr.",
    team: "ATL",
    tier: "B",
    park: "Fenway Park",
    pitcher: "Connelly Early",
    pitcherNote: "4.80 ERA / 1.42 WHIP — lacks a consistent put-away pitch and allows elevated hard-hit rates against athletic outfielders.",
    matchupGrade: "B+",
    estOdds: "+500",
    note: "Acuña is rounding back into form after his ACL return — 2 HR in 33 games but his xwOBA of .370 signals the power is returning and his xISO is trending toward full strength. Early's 4.80 ERA at Fenway with 9.2 mph wind gives Acuña a prime bounce-back spot — one healthy swing and this cashes.",
    tags: ["🔜 Due", "💨 Wind Boost"]
  },
  {
    id: 26,
    name: "Josh Naylor",
    team: "CLE",
    tier: "B",
    park: "Progressive Field",
    pitcher: "MacKenzie Gore",
    pitcherNote: "3.80 ERA / 1.28 WHIP — command dips in third time through the order leave him vulnerable to pull-side left-handed power.",
    matchupGrade: "B-",
    estOdds: "+580",
    note: "Naylor has 8 HR and an .820 OPS as Cleveland's physical first baseman providing middle-of-the-order pop behind Jose Ramirez. Gore's 3.80 ERA gives Naylor a moderate matchup at Progressive Field — he's a legitimate secondary CLE value play for those wanting Guardians exposure.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 27,
    name: "William Contreras",
    team: "MIL",
    tier: "B",
    park: "American Family Field",
    pitcher: "Miles Mikolas",
    pitcherNote: "4.20 ERA / 1.30 WHIP — sinker-heavy approach without effective secondary stuff leads to elevated contact rates against left-handed power.",
    matchupGrade: "B",
    estOdds: "+620",
    note: "Contreras has 7 HR and an .800 OPS as Milwaukee's primary power catcher — a strong arm behind the plate with genuine opposite-field pull authority. Mikolas's 4.20 ERA inside the closed American Family Field dome gives Contreras a weather-free swing opportunity at above-average odds.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 28,
    name: "Jackson Chourio",
    team: "MIL",
    tier: "B",
    park: "American Family Field",
    pitcher: "Miles Mikolas",
    pitcherNote: "4.20 ERA / 1.30 WHIP — HR/9 has climbed through May, his fastball-first approach exploitable for aggressive young power hitters.",
    matchupGrade: "B",
    estOdds: "+550",
    note: "Chourio has 8 HR and elite bat speed ranking in the 90th percentile as Milwaukee's top young talent — a breakout star who has genuinely arrived in 2026. Mikolas's 4.20 ERA gives Chourio a real shot at going deep in the dome — he's the Brewers' best HR threat tonight.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 29,
    name: "Giancarlo Stanton",
    team: "NYY",
    tier: "B",
    park: "Kauffman Stadium",
    pitcher: "Noah Cameron",
    pitcherNote: "5.20 ERA / 1.45 WHIP — has been unable to keep elite sluggers at bay this season, home run rate against him is historically elevated.",
    matchupGrade: "A-",
    estOdds: "+480",
    note: "Stanton has 9 HR and an .830 OPS bringing his trademark raw power to Kauffman's favorable HR context tonight when healthy. Cameron's 5.20 ERA gives this NYY triple-stack a fourth live option — Stanton's massive exit velocity and Kauffman's dimensions are a natural pairing.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster"]
  },
  {
    id: 30,
    name: "Cal Raleigh",
    team: "SEA",
    tier: "B",
    park: "Sutter Health Park",
    pitcher: "Jeffrey Springs",
    pitcherNote: "3.27 ERA / 1.18 WHIP — post-injury return has left diminished velocity, pitch arsenal less effective against patient power catchers.",
    matchupGrade: "B",
    estOdds: "+560",
    note: "Raleigh has cemented himself as the best power-hitting catcher in baseball with 12 HR and an .870 OPS continuing his dominant production. Springs's 3.27 ERA at Sutter Health Park gives Raleigh a moderate but viable setup — he's the top SEA value option for those wanting Mariners exposure.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 31,
    name: "Vinnie Pasquantino",
    team: "KC",
    tier: "B",
    park: "Kauffman Stadium",
    pitcher: "Gerrit Cole",
    pitcherNote: "3.41 ERA / 1.18 WHIP — HR/9 tracking above career norms with 11 allowed this season, command lapses in middle innings exploitable.",
    matchupGrade: "B",
    estOdds: "+620",
    note: "Pasquantino has 7 HR and an .810 OPS as Kansas City's patient first baseman who draws walks and occasionally launches one to right on a mistake. Cole's 3.41 ERA at Kauffman with tonight's 9 mph wind creates an outside shot — Pasquantino is the best secondary KC value play.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 32,
    name: "Spencer Steer",
    team: "CIN",
    tier: "B",
    park: "Citi Field",
    pitcher: "Huascar Brazoban",
    pitcherNote: "4.50 ERA / 1.40 WHIP — secondary pitch command is inconsistent, allowing elevated hard-hit rates especially against left-handed pull hitters.",
    matchupGrade: "B",
    estOdds: "+580",
    note: "Steer has 7 HR and an .820 OPS as Cincinnati's versatile left-handed power contributor from the middle of the order. Brazoban's 4.50 ERA makes the Reds' lineup a stacking target — Steer is the secondary CIN value play behind De La Cruz tonight at Citi Field.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 33,
    name: "Jarren Duran",
    team: "BOS",
    tier: "B",
    park: "Fenway Park",
    pitcher: "Bryce Elder",
    pitcherNote: "1.97 ERA / 0.99 WHIP — one of the best pitching seasons in the NL, but Fenway's 9.2 mph wind creates a residual park-boost angle.",
    matchupGrade: "C+",
    estOdds: "+640",
    note: "Duran has 6 HR and an .800 OPS — primarily a speed-first outfielder whose improved exit velocity makes him a viable power play at Fenway. Elder's dominance is real but Fenway's dimensions and tonight's 9.2 mph wind give Duran a home-park atmospheric edge on any hard-pulled ball.",
    tags: ["💨 Wind Boost", "🔜 Due"]
  },
  {
    id: 34,
    name: "Ryan Mountcastle",
    team: "BAL",
    tier: "B",
    park: "Camden Yards",
    pitcher: "Ryan Pepiot",
    pitcherNote: "3.90 ERA / 1.24 WHIP — four-seam-heavy approach with declining movement leaves him exposed to right-handed pull power at Camden.",
    matchupGrade: "B",
    estOdds: "+560",
    note: "Mountcastle has 8 HR and an .830 OPS as Baltimore's steady first baseman delivering consistent pull-side power at Camden Yards. Pepiot's 3.90 ERA at one of the AL's best HR parks gives Mountcastle a legitimate value play — he's the BAL tertiary option behind Santander and Henderson.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 35,
    name: "Nolan Arenado",
    team: "STL",
    tier: "B",
    park: "American Family Field",
    pitcher: "Freddy Peralta",
    pitcherNote: "3.40 ERA / 1.20 WHIP — excellent overall but mid-inning command dips leave veteran pull-side power bats with hittable counts.",
    matchupGrade: "B-",
    estOdds: "+600",
    note: "Arenado has 9 HR and an .820 OPS providing veteran power from the hot corner in a contract year where his defensive and offensive excellence continues. Peralta's 3.40 ERA at the closed dome is a moderate matchup, but Arenado's postseason-caliber authority gives him a shot at any mistake pitch.",
    tags: ["👑 MVP/Elite", "🔜 Due"]
  },
  {
    id: 36,
    name: "Corey Seager",
    team: "TEX",
    tier: "B",
    park: "Globe Life Field",
    pitcher: "Framber Valdez",
    pitcherNote: "3.30 ERA / 1.25 WHIP — sinker/curveball combo is tough but HR/9 has climbed in May starts, elevated hard-hit rate against left-handed power.",
    matchupGrade: "B",
    estOdds: "+520",
    note: "Seager has 10 HR and an .840 OPS as one of the AL's best left-handed power bats — a perennial Silver Slugger with elite postseason HR authority. Globe Life's controlled dome removes all weather risk but Valdez's 3.30 ERA keeps this firmly at B-tier for today's Rangers stack.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },
  {
    id: 37,
    name: "Ozzie Albies",
    team: "ATL",
    tier: "B",
    park: "Fenway Park",
    pitcher: "Connelly Early",
    pitcherNote: "4.80 ERA / 1.42 WHIP — struggles to put away compact-swing right-handed hitters, secondary pitch quality drops late in starts.",
    matchupGrade: "B+",
    estOdds: "+530",
    note: "Albies has 6 HR and a .780 OPS providing legitimate middle-of-the-order pop from his second base spot — a hitter who thrives in close counts at any park. Early's 4.80 ERA at Fenway with 9.2 mph wind tonight gives Albies a real atmospheric and matchup edge — the best secondary ATL bat today.",
    tags: ["💨 Wind Boost", "💰 Value"]
  },
  {
    id: 38,
    name: "Bryce Harper",
    team: "PHI",
    tier: "B",
    park: "Petco Park",
    pitcher: "Walker Buehler",
    pitcherNote: "3.80 ERA / 1.22 WHIP — xFIP climbing toward 4.00, underlying HR/9 regression building against proven left-handed power bats.",
    matchupGrade: "B",
    estOdds: "+440",
    note: "Harper has 11 HR and a .970 OPS as one of the NL's elite left-handed power bats — even Petco Park's suppression cannot contain an MVP-caliber swing forever. Buehler's 3.80 ERA is hittable and his xFIP regression angle gives Harper a real outside shot at going deep tonight.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },
  {
    id: 39,
    name: "Davis Schneider",
    team: "TOR",
    tier: "B",
    park: "Rogers Centre",
    pitcher: "Eury Pérez",
    pitcherNote: "5.33 ERA / 1.41 WHIP — command that disappears under pressure leaves every spot in the TOR lineup with elevated hard-contact opportunity.",
    matchupGrade: "B+",
    estOdds: "+640",
    note: "Schneider has 5 HR and a .760 OPS — a natural power hitter who makes consistent hard contact in the dome setup against soft pitching. Pérez's 5.33 ERA inside Rogers Centre gives Schneider a legitimate slot as the fourth TOR stack option — pure matchup value at extended odds.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 40,
    name: "Matt Chapman",
    team: "SF",
    tier: "B",
    park: "Oracle Park",
    pitcher: "Mike Soroka",
    pitcherNote: "3.50 ERA / 1.33 WHIP — elevated BABIP and inflated WHIP signal command regression coming; fly-ball heavy approach in a suppressive park.",
    matchupGrade: "B-",
    estOdds: "+620",
    note: "Chapman has 8 HR and an .850 OPS as San Francisco's premier power threat — a pull-side authority bat who forces pitchers to work away in count. Soroka's 1.33 WHIP and elevated BABIP at suppressive Oracle create a moderate window — Chapman is the best SF value play despite the park.",
    tags: ["🔜 Due", "💰 Value"]
  },

  // ─── C-TIER ────────────────────────────────────────────────────────────────
  {
    id: 41,
    name: "Corbin Carroll",
    team: "AZ",
    tier: "C",
    park: "Oracle Park",
    pitcher: "Kevin Gausman",
    pitcherNote: "3.20 ERA / 1.08 WHIP — elite command and splitter generate one of the highest strikeout rates in the NL, very tough for all hitters.",
    matchupGrade: "C",
    estOdds: "+750",
    note: "Carroll has 7 HR and an .820 OPS showing legitimate ISO growth from his improving pull rate — a speed-first player adding power to his game. Gausman's 3.20 ERA at suppressive Oracle Park makes this a tough double-negative setup — Carroll is a pure longshot dart today.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },
  {
    id: 42,
    name: "Marcus Semien",
    team: "TEX",
    tier: "C",
    park: "Globe Life Field",
    pitcher: "Framber Valdez",
    pitcherNote: "3.30 ERA / 1.25 WHIP — sinker-centric approach with excellent movement generates ground balls and weak contact all game long.",
    matchupGrade: "C+",
    estOdds: "+800",
    note: "Semien has 10 HR and an .840 OPS as the Rangers' veteran middle-of-the-order anchor — quietly productive with power that shows up in clusters. Valdez's 3.30 ERA is among the tougher matchups today but Semien's professional approach means any hanging sinker in the dome could end up over the wall.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 43,
    name: "LaMonte Wade Jr.",
    team: "SF",
    tier: "C",
    park: "Oracle Park",
    pitcher: "Mike Soroka",
    pitcherNote: "3.50 ERA / 1.33 WHIP — contact-oriented approach may inflate BABIP further but Oracle's marine layer aggressively suppresses fly balls.",
    matchupGrade: "C",
    estOdds: "+850",
    note: "Wade Jr. has 5 HR and a .780 OPS — a contact-first hitter whose pull authority occasionally generates a bomb when he locks in on a fastball. Oracle Park's marine-layer suppression plus Soroka's moderate arm makes this a dual-negative setup — Wade Jr. is a pure lottery spot today.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 44,
    name: "Charlie Blackmon",
    team: "COL",
    tier: "C",
    park: "Dodger Stadium",
    pitcher: "Shohei Ohtani",
    pitcherNote: "0.73 ERA / 0.84 WHIP — the single most dominant pitching season in modern baseball history, virtually untouchable for any hitter.",
    matchupGrade: "C-",
    estOdds: "+1100",
    note: "Blackmon has 5 HR and a .750 OPS as a veteran COL bat who has proven throughout his career that he can go deep against any arm on any given night. Ohtani's 0.73 ERA is the most dominant mark in the sport — this is the purest lottery play on the entire slate, best for the 10A max-risk parlay only.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 45,
    name: "Ryan McMahon",
    team: "COL",
    tier: "C",
    park: "Dodger Stadium",
    pitcher: "Shohei Ohtani",
    pitcherNote: "0.73 ERA / 0.84 WHIP — historically untouchable two-way weapon whose splitter and 99 mph heater make him the most dominant starter alive.",
    matchupGrade: "C-",
    estOdds: "+1200",
    note: "McMahon has 7 HR and a .780 OPS as Colorado's third baseman — a pull-side power hitter who occasionally launches one to right field on a mistake. Facing Ohtani's 0.73 ERA at Dodger Stadium makes this the maximum-risk lottery spot on the board — pair with Blackmon in the 10A for the full COL longshot stack.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 46,
    name: "Zach Neto",
    team: "LAA",
    tier: "C",
    park: "Comerica Park",
    pitcher: "Tarik Skubal",
    pitcherNote: "2.00 ERA / 0.90 WHIP — elite changeup and fastball combination generates elite strikeout rates, among the best starters in the AL.",
    matchupGrade: "C",
    estOdds: "+880",
    note: "Neto has 6 HR and a .770 OPS continuing his development as an athletic Angels shortstop with legitimate gap power from the left side. Skubal's 2.00 ERA at Comerica's large outfield creates a tough dual-negative setup — Neto is a pure power-upside dart at value odds.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },
  {
    id: 47,
    name: "Jeff McNeil",
    team: "NYM",
    tier: "C",
    park: "Citi Field",
    pitcher: "Andrew Abbott",
    pitcherNote: "2.87 ERA / 1.14 WHIP — strong curveball command generates weak contact and strikeouts against both sides of the plate.",
    matchupGrade: "C",
    estOdds: "+950",
    note: "McNeil has 4 HR and a .750 OPS — primarily a contact hitter who rarely goes deep but has shown the pop to reach Citi's gaps in select spots. Abbott's 2.87 ERA at suppressive Citi Field makes this a tough double-negative matchup — McNeil is a pure lottery play today.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 48,
    name: "Connor Norby",
    team: "BAL",
    tier: "C",
    park: "Camden Yards",
    pitcher: "Ryan Pepiot",
    pitcherNote: "3.90 ERA / 1.24 WHIP — mid-rotation stuff that Norby's developing power profile has not yet proven it can exploit consistently.",
    matchupGrade: "C",
    estOdds: "+1000",
    note: "Norby has 4 HR and a .720 OPS as Baltimore's young utility infielder — a player still finding his power stroke in the big leagues this season. Camden Yards gives him the best park of any C-tier bat today — Norby is a speculative play for those wanting a cheap fourth BAL stack leg.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },
  {
    id: 49,
    name: "Steven Kwan",
    team: "CLE",
    tier: "C",
    park: "Progressive Field",
    pitcher: "MacKenzie Gore",
    pitcherNote: "3.80 ERA / 1.28 WHIP — contact-generating approach that matches poorly against Kwan's speed-first profile with limited power output.",
    matchupGrade: "C-",
    estOdds: "+920",
    note: "Kwan has 4 HR and an .800 OPS as Cleveland's leadoff weapon — primarily a contact and on-base bat whose power uptick has barely scratched the surface. Gore's 3.80 ERA at pitcher-friendly Progressive Field makes this a tough setup for a longshot play — Kwan is a pure dart for secondary CLE exposure.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 50,
    name: "Bryan De La Cruz",
    team: "MIA",
    tier: "C",
    park: "Rogers Centre",
    pitcher: "Yariel Rodriguez",
    pitcherNote: "3.90 ERA / 1.25 WHIP — solid mid-rotation arm with no glaring weakness, limiting away-team power opportunities in the dome environment.",
    matchupGrade: "C",
    estOdds: "+1050",
    note: "De La Cruz has 5 HR and a .760 OPS as Miami's best offensive threat — an aggressive hitter who occasionally connects for extra bases on fastballs up in the zone. Rodriguez's 3.90 ERA inside the Rogers Centre dome makes this a controlled-environment lottery — best used as a cheap fourth leg in extended parlays.",
    tags: ["🎰 Longshot", "💰 Value"]
  }
];

const parlays = [
  {
    id: "4A",
    legs: 4,
    label: "THE CORE FOUR",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1100",
    description: "Four elite S-tier power bats stacked into the lowest-risk parlay on today's board.",
    playerIds: [1, 2, 3, 6],
    strategy: "Judge and Rice against Cameron's 5.20 ERA at Kauffman's 9 mph wind is the cleanest outdoor HR setup on the slate — both NYY bats have the power profiles that destroy bad pitchers on contact. Vladdy vs Pérez's 5.33 ERA disaster in the Rogers Centre dome and Alvarez against McDonald's 4.80 ERA at Globe Life round out this all-S-tier core. This is the minimum-risk parlay with the highest floor on the entire board."
  },
  {
    id: "4B",
    legs: 4,
    label: "DISASTER DOUBLE STACK",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1300",
    description: "Tucker and Buxton anchor two separate SP disaster matchups — four live legs at better value.",
    playerIds: [1, 4, 5, 7],
    strategy: "Judge's 16 HR and 1.037 OPS against Cameron's 5.20 ERA is one of the best individual power setups today. Tucker against McDonald's 4.80 ERA in Globe Life's dome and Buxton against Sandlin's 5.40 ERA — the worst pitcher on the board — provide the two strongest independent disaster spots. Suzuki adds PNC Park outdoor value vs Chandler's 4.62 ERA, completing four legs across three separate games."
  },
  {
    id: "5A",
    legs: 5,
    label: "THE POWER FIVE",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1900",
    description: "All five S-tier locks — the highest-conviction five-leg parlay on today's 15-game slate.",
    playerIds: [1, 2, 3, 5, 6],
    strategy: "Judge and Rice together against Cameron's 5.20 ERA at Kauffman form the NYY outdoor power duo. Vladdy against Pérez's 5.33 ERA inside Rogers Centre and Alvarez against McDonald's 4.80 ERA in Globe Life's dome give this five-leg parlay three independent disaster stacks across three parks. Buxton against Sandlin's 5.40 ERA — the highest ERA on the slate — completes the best five legs available today with zero wasted spots."
  },
  {
    id: "5B",
    legs: 5,
    label: "MULTI-SLATE VALUE",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2200",
    description: "S-tier anchors plus James Wood's elite metrics at value odds — five strong legs across five games.",
    playerIds: [1, 4, 6, 7, 10],
    strategy: "Judge and Rice anchor the NYY wind-and-disaster outdoor duo at Kauffman while Tucker's Globe Life dome setup vs McDonald creates a second independent SP disaster. Suzuki vs Chandler's 4.62 ERA at PNC adds a third SP disaster leg with genuine Cubs power upside. James Wood's 96.4 exit velocity and 25.4% barrel rate vs Williams at +360 makes him the best A-tier value leg on the board — five games, five different setups."
  },
  {
    id: "5C",
    legs: 5,
    label: "ROGERS CENTRE STACK PLUS",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2500",
    description: "Full TOR disaster stack plus Schwarber's historic pace — five legs targeting Pérez and Buehler.",
    playerIds: [2, 8, 9, 11, 20],
    strategy: "Vladdy, Bichette, and Springer form the three-man Rogers Centre stack against Pérez's 5.33 ERA disaster — an SP disaster dome stack that is the best pitcher-matchup play on the board. Schwarber's 20 HR historic pace and Chisholm's Kauffman wind boost complete this five-leg parlay across two games. The TOR dome triple-stack plus NYY wind value gives this parlay excellent geographic concentration and matchup depth."
  },
  {
    id: "6A",
    legs: 6,
    label: "THE SUPER S-TIER",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+3500",
    description: "All six S-tier players in one parlay — the most elite six-leg combination on the slate.",
    playerIds: [1, 2, 3, 4, 5, 6],
    strategy: "This parlay combines the two NYY outdoor wind-disaster bats (Judge + Rice vs Cameron), the TOR dome disaster king (Vladdy vs Pérez), the HOU globe dome duo (Alvarez + Tucker vs McDonald), and Buxton against the slate's worst ERA (Sandlin's 5.40). Six players across four separate games, all with A+ matchup grades and S-tier power profiles. This is the premium medium-risk play for those who want maximum matchup concentration."
  },
  {
    id: "6B",
    legs: 6,
    label: "VALUE LADDER",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+4500",
    description: "S-tier anchors plus four A-tier value plays at extended odds — best payout-per-quality ratio.",
    playerIds: [1, 6, 7, 14, 15, 20],
    strategy: "Judge and Rice anchor the outdoor NYY disaster duo at Kauffman's 9 mph wind while Suzuki's PNC disaster spot adds a third independent SP-disaster leg. Freeman's .890 OPS at Dodger Stadium vs Sugano's 3.86 ERA and Witt Jr.'s +460 home-park value at Kauffman complete the quality anchor tier. Chisholm adds the fourth NYY bat at A-tier odds — six legs that combine elite talent with genuine value pricing across multiple matchups."
  },
  {
    id: "7A",
    legs: 7,
    label: "THE MAGNIFICENT SEVEN",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+6500",
    description: "S-tier core plus the best A-tier disaster legs — the premium medium-high risk parlay for today.",
    playerIds: [1, 3, 4, 5, 6, 7, 13],
    strategy: "Judge, Alvarez, Tucker, Buxton, and Rice bring five elite S-tier power bats across four different games — Kauffman outdoor, Globe Life dome, and Guaranteed Rate disaster. Suzuki vs Chandler's 4.62 ERA at PNC adds the CHC disaster angle, while Altuve at Globe Life vs McDonald's 4.80 ERA completes the HOU triple-stack. Seven legs, four games, three SP disasters — a well-constructed seven-leg parlay with no wasted legs."
  },
  {
    id: "7B",
    legs: 7,
    label: "TOR STACK EXPANSION",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+7500",
    description: "Full TOR dome disaster triple-stack plus four independent power plays for maximum spread.",
    playerIds: [2, 8, 9, 10, 11, 16, 17],
    strategy: "Vladdy, Bichette, and Springer form the three-man Rogers Centre disaster stack against Pérez's 5.33 ERA — the most concentrated dome-disaster stack available today. Wood at +360 with his 25.4% barrel rate adds elite value, while Schwarber's 20 HR historic pace gives this a second proven power anchor. De La Cruz and Santander extend this to seven legs across five games — geographic diversification at premium odds."
  },
  {
    id: "7C",
    legs: 7,
    label: "SLEEPER STACK",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+8000",
    description: "Seven underpriced A and B-tier bats — the best payout-per-quality seven-leg ticket today.",
    playerIds: [1, 6, 14, 15, 19, 20, 29],
    strategy: "Judge and Rice anchor this with the two best outdoor disaster legs on the board before transitioning to A and B-tier value. Freeman at Dodger Stadium and Witt Jr. at Kauffman home provide two legitimate park-advantage spots while Tatis Jr. at +480 and Chisholm's wind boost add upside at extended odds. Stanton completes the seven with his massive raw power at Cameron's 5.20 ERA — seven legs at better average odds than the 7A parlay."
  },
  {
    id: "8A",
    legs: 8,
    label: "THE SUPER EIGHT",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+12000",
    description: "All six S-tier bats plus the two best A-tier disaster plays — the premium eight-leg parlay.",
    playerIds: [1, 2, 3, 4, 5, 6, 7, 16],
    strategy: "The full S-tier slate — Judge, Vladdy, Alvarez, Tucker, Buxton, Rice — provides the six highest-conviction bats on the board across four different games. Suzuki adds a fifth disaster spot (Chandler's 4.62 ERA at PNC) and De La Cruz brings Brazoban's 4.50 ERA at Citi as the eighth leg. Eight legs covering five different games, all with A- matchup grades or better — this is the cleanest eight-leg parlay available on a 15-game slate."
  },
  {
    id: "8B",
    legs: 8,
    label: "DIAMOND DISTRICT",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+13500",
    description: "Eight A-tier power bats across six different games — quality-depth eight-leg parlay.",
    playerIds: [1, 3, 7, 10, 11, 14, 16, 20],
    strategy: "Judge against Cameron's 5.20 ERA and Alvarez against McDonald's 4.80 ERA anchor two independent S-tier disaster spots. Suzuki vs Chandler, Schwarber's historic 20 HR pace, and Wood's elite 25.4% barrel rate add three more A-grade legs with real conviction. Freeman at Dodger Stadium, Elly vs Brazoban's 4.50 ERA, and Chisholm's wind-boosted Kauffman spot complete eight legs spanning six games — maximum diversification at competitive odds."
  },
  {
    id: "9A",
    legs: 9,
    label: "THE BIG NINE",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+22000",
    description: "Nine elite power bats spanning five games — the premium high-risk parlay for today's full slate.",
    playerIds: [1, 2, 3, 4, 5, 6, 7, 13, 16],
    strategy: "The full S-tier six — Judge, Vladdy, Alvarez, Tucker, Buxton, Rice — provides the six highest floors on the board, each with A+ matchup grades across four different parks. Suzuki adds the CHC disaster spot, Altuve completes the HOU dome triple-stack, and De La Cruz's Citi Field Brazoban angle extends to a ninth independent leg. Nine legs, five games, all with legitimate SP disaster or elite power backing — this is the cleanest nine-leg parlay on the slate."
  },
  {
    id: "9B",
    legs: 9,
    label: "CROSS-SLATE POWER",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+18000",
    description: "Nine bats spanning six different games — maximum diversification at high risk.",
    playerIds: [1, 2, 5, 6, 8, 9, 10, 11, 20],
    strategy: "Judge and Rice bring the outdoor Kauffman wind-disaster duo while Vladdy extends the TOR dome stack. Buxton's Sandlin disaster at Guaranteed Rate and Bichette plus Springer complete the TOR Rogers Centre triple as independent legs. Wood's elite barrel metrics at +360 and Schwarber's historic 20 HR pace add two more proven power anchors. Chisholm's Kauffman appearance extends the NYY wind angle for a ninth leg — nine legs across six games, maximum spread at better combined odds than 9A."
  },
  {
    id: "10A",
    legs: 10,
    label: "THE LOTTERY BOARD",
    risk: "Max Risk",
    riskColor: "#9c27b0",
    estPayout: "+35000",
    description: "Ten legs including two C-tier lottery plays — maximum-risk, maximum-reward parlay for today's slate.",
    playerIds: [1, 2, 3, 5, 6, 7, 16, 20, 44, 45],
    strategy: "Judge and Rice vs Cameron's 5.20 ERA at Kauffman wind, Vladdy vs Pérez's 5.33 disaster at the dome, Alvarez against McDonald's 4.80 ERA at Globe Life — five of the board's best legs anchor this ticket. Buxton against Sandlin's 5.40 ERA, Suzuki vs Chandler, Elly vs Brazoban, and Chisholm's wind boost add four more legitimate A+ to A-grade legs before the lottery tier. Blackmon (+1100) and McMahon (+1200) against Ohtani's 0.73 ERA at Dodger Stadium are pure lottery — the two COL bats who only need one mistake on the worst odds on the slate to turn this into a five-figure payout."
  }
];
