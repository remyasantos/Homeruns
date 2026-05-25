const TEAM_TO_GAME = {
  CHC: "CHC@PIT",
  PIT: "CHC@PIT",
  TB:  "TB@BAL",
  BAL: "TB@BAL",
  MIN: "MIN@CWS",
  CWS: "MIN@CWS",
  STL: "STL@MIL",
  MIL: "STL@MIL",
  NYY: "NYY@KC",
  KC:  "NYY@KC",
  CIN: "CIN@NYM",
  NYM: "CIN@NYM",
  AZ:  "AZ@SF",
  SF:  "AZ@SF",
  WSH: "WSH@CLE",
  CLE: "WSH@CLE",
  PHI: "PHI@SD",
  SD:  "PHI@SD",
  HOU: "HOU@TEX",
  TEX: "HOU@TEX",
  MIA: "MIA@TOR",
  TOR: "MIA@TOR",
  COL: "COL@LAD",
  LAD: "COL@LAD",
  SEA: "SEA@ATH",
  ATH: "SEA@ATH"
};

const SLATE_DATE  = "MAY 25, 2026";
const SLATE_LABEL = "MONDAY MLB SLATE";

const CONTEXT_CARDS = [
  {
    icon:  "💣",
    label: "Nick Lodolo — SP Disaster",
    note:  "8.68 ERA / 1.61 WHIP",
    sub:   "Lodolo returned from a blister IL stint and has been torched for 8.68 ERA and 1.61 WHIP across 9.1 IP in three starts. The Mets' loaded lineup at Citi Field facing a left-hander who cannot miss bats or locate his offspeed is a certified bomb alert for Memorial Day."
  },
  {
    icon:  "🔥",
    label: "Dodger Stadium — Elite HR Environment",
    note:  "Top HR Park + Tanner Gordon (6.59 ERA)",
    sub:   "Dodger Stadium is one of the top-3 HR parks in baseball and today the Dodgers draw Tanner Gordon — a rookie with a 6.59 ERA who has yet to navigate a lineup cleanly. Ohtani, Betts, and Freeman all face a gift-wrapped Memorial Day spot at the #1 park on today's board."
  },
  {
    icon:  "🏠",
    label: "Globe Life Field Dome Stack",
    note:  "Tatsuya Imai: 8.31 ERA / 1.79 WHIP",
    sub:   "Texas bats face Imai (8.31 ERA, 1.79 WHIP) inside the Globe Life Field retractable-roof dome — zero wind, zero rain, and a pitcher surrendering runs at a historic rate. Garcia, Semien, and Lowe are all live in one of the cleanest dome-disaster stacks of the 2026 season."
  },
  {
    icon:  "💰",
    label: "Jose Ramirez — Memorial Day Value",
    note:  "+350 odds vs Zack Littell (5.83 ERA, 15 HR allowed)",
    sub:   "Ramirez has 13 HR and a .915 OPS this season and draws Zack Littell who has allowed 15 HR in just 46.1 IP — a rate of one every 2.8 innings. Progressive Field is a neutral environment and JRam is the single most underpriced S-tier bat on the entire slate."
  }
];

const PARK_FACTORS = {
  "Dodger Stadium": {
    rank: 1,
    label: "🔥 #1 HR Park Today",
    color: "#ff6b35"
  },
  "Globe Life Field": {
    rank: 2,
    label: "🏠 Dome/Roof Closed",
    color: "#ff6b35"
  },
  "American Family Field": {
    rank: 3,
    label: "🏠 Dome/Roof Closed",
    color: "#ffb347"
  },
  "Rogers Centre": {
    rank: 4,
    label: "🏠 Dome/Roof Closed",
    color: "#ffb347"
  },
  "Sutter Health Park": {
    rank: 5,
    label: "💥 Short Minor League Dimensions",
    color: "#ffb347"
  },
  "Citi Field": {
    rank: 6,
    label: "⚾ Neutral HR Park",
    color: "#b0bec5"
  },
  "Camden Yards": {
    rank: 7,
    label: "⚾ Neutral HR Park",
    color: "#b0bec5"
  },
  "Kauffman Stadium": {
    rank: 8,
    label: "⚾ Neutral HR Park",
    color: "#b0bec5"
  },
  "Guaranteed Rate Field": {
    rank: 9,
    label: "⚾ Neutral HR Park",
    color: "#b0bec5"
  },
  "Progressive Field": {
    rank: 10,
    label: "📉 Slightly Suppressive",
    color: "#78909c"
  },
  "PNC Park": {
    rank: 11,
    label: "📉 Suppressive Park",
    color: "#78909c"
  },
  "Petco Park": {
    rank: 12,
    label: "📉 Suppressive Park",
    color: "#78909c"
  },
  "Oracle Park": {
    rank: 13,
    label: "❄️ Most Suppressive Today",
    color: "#78909c"
  }
};

const players = [
  // ─── S-TIER ────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Shohei Ohtani",
    team: "LAD",
    tier: "S",
    park: "Dodger Stadium",
    pitcher: "Tanner Gordon",
    pitcherNote: "6.59 ERA in debut MLB season — poor command, elevated hard-hit rate, HR/9 over 1.4.",
    matchupGrade: "A+",
    estOdds: "+225",
    note: "Ohtani posted an .828 OPS with 7+ HR through 45 contests and is riding his strongest May power stretch yet. Gordon's 6.59 ERA at Dodger Stadium — the #1 HR environment on today's board — is the definition of free real estate.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 2,
    name: "Juan Soto",
    team: "NYM",
    tier: "S",
    park: "Citi Field",
    pitcher: "Nick Lodolo",
    pitcherNote: "8.68 ERA / 1.61 WHIP since IL return — cannot miss bats or locate his fastball reliably.",
    matchupGrade: "A+",
    estOdds: "+240",
    note: "Soto is the most dangerous hitter in the Mets lineup with an elite plate approach and premium power against left-handed pitching. Lodolo's 8.68 ERA is the worst qualifying mark in the NL and Soto historically destroys struggling southpaws at Citi Field.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 3,
    name: "Jose Ramirez",
    team: "CLE",
    tier: "S",
    park: "Progressive Field",
    pitcher: "Zack Littell",
    pitcherNote: "5.83 ERA, 1.45 WHIP, and 15 HR allowed in 46.1 IP — surrenders one HR every 2.8 innings pitched.",
    matchupGrade: "A+",
    estOdds: "+350",
    note: "Ramirez has 13 HR and a .915 OPS through late May, doing his usual elite damage at Progressive Field where he historically torches right-handers. Littell's 15 HR allowed is the worst rate among active starters — JRam is the Memorial Day value of the entire slate.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "💰 Value"]
  },
  {
    id: 4,
    name: "Adolis Garcia",
    team: "TEX",
    tier: "S",
    park: "Globe Life Field",
    pitcher: "Tatsuya Imai",
    pitcherNote: "8.31 ERA / 1.79 WHIP — worst qualifying ERA in the AL, walking 22 batters in 33.1 IP with HR/9 over 2.0.",
    matchupGrade: "A+",
    estOdds: "+310",
    note: "Garcia's 23% barrel rate and all-or-nothing power profile are built to punish pitchers who cannot command the ball — Imai's 8.31 ERA and 1.79 WHIP are a walking disaster. The Globe Life dome eliminates every weather variable and gives Garcia a clean shot in his home park.",
    tags: ["💣 SP Disaster", "🔥 Hot", "💰 Value"]
  },
  {
    id: 5,
    name: "Kyle Schwarber",
    team: "PHI",
    tier: "S",
    park: "Petco Park",
    pitcher: "Randy Vasquez",
    pitcherNote: "5-2 record with a 2.96 ERA, but xFIP of 3.87 — outperforming peripherals against teams without elite exit velocity.",
    matchupGrade: "B+",
    estOdds: "+265",
    note: "Schwarber leads all of MLB with 20 HR and a .947 OPS through late May — the most prolific power hitter alive right now. Even Petco's suppressive environment cannot stop a man on pace to crush 65+ HRs; Vasquez's soft-contact approach is a time bomb against elite barrel rates.",
    tags: ["👑 MVP/Elite", "🔥 Hot", "📈 Breakout"]
  },
  {
    id: 6,
    name: "Mookie Betts",
    team: "LAD",
    tier: "S",
    park: "Dodger Stadium",
    pitcher: "Tanner Gordon",
    pitcherNote: "6.59 ERA — has allowed multiple hard-hit balls in nearly every start, frequently departing before the fifth inning.",
    matchupGrade: "A+",
    estOdds: "+330",
    note: "Betts brings a .870 OPS and one of the best contact-plus-power profiles in the NL, thriving in Dodger Stadium's elite HR environment. Gordon's 6.59 ERA is the largest pitching mismatch Betts will see all season and the Memorial Day crowd sets up for an afternoon bomb.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },

  // ─── A-TIER ────────────────────────────────────────────────────────────────
  {
    id: 7,
    name: "Aaron Judge",
    team: "NYY",
    tier: "A",
    park: "Kauffman Stadium",
    pitcher: "Michael Wacha",
    pitcherNote: "3.90 ERA / 1.30 WHIP — declining spin rates in late-game situations, gives up hard contact to right-handed power bats.",
    matchupGrade: "B+",
    estOdds: "+245",
    note: "Judge has 17 HR and homers in over 30% of his games this season despite consistently facing elite pitching. Wacha's 3.90 ERA and command lapses in the middle innings make Kauffman Stadium a viable spot for the most dangerous right-handed hitter in baseball.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 8,
    name: "Yordan Alvarez",
    team: "HOU",
    tier: "A",
    park: "Globe Life Field",
    pitcher: "Kumar Rocker",
    pitcherNote: "2-4, 3.60 ERA / 1.38 WHIP — struggles to retire left-handed power bats with secondary pitches, elevated walk rate.",
    matchupGrade: "B+",
    estOdds: "+310",
    note: "Alvarez's .895 OPS and monster exit velocity make him a legitimate threat even against a pitcher with a respectable ERA like Rocker. The Globe Life dome removes all weather risk, and Alvarez has historically crushed hard-throwing righties at this park.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },
  {
    id: 9,
    name: "Freddie Freeman",
    team: "LAD",
    tier: "A",
    park: "Dodger Stadium",
    pitcher: "Tanner Gordon",
    pitcherNote: "6.59 ERA — cannot navigate full lineups without allowing multiple hard-hit balls; allows fly balls at an elite rate.",
    matchupGrade: "A",
    estOdds: "+360",
    note: "Freeman is batting .890 OPS with 10 HR through late May, providing consistent middle-order pop at one of MLB's premier HR parks. Gordon's 6.59 ERA at Dodger Stadium is the best individual power matchup in the afternoon slate.",
    tags: ["💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 10,
    name: "Bobby Witt Jr.",
    team: "KC",
    tier: "A",
    park: "Kauffman Stadium",
    pitcher: "Cam Schlittler",
    pitcherNote: "1.50 ERA / 0.86 WHIP — elite swing-and-miss with 75 K in 66 IP, AL ERA leader; must-identify contact tendencies.",
    matchupGrade: "B-",
    estOdds: "+380",
    note: "Witt leads the AL in hits and has 14 HR with a .910 OPS, proving his power is legitimate at every stage of his development. Even against Schlittler's historic ERA pace, Witt's elite bat-to-ball skill gives him a better chance than most of making hard contact at home.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },
  {
    id: 11,
    name: "Pete Alonso",
    team: "BAL",
    tier: "A",
    park: "Camden Yards",
    pitcher: "Shane McClanahan",
    pitcherNote: "5-2, 2.82 ERA / 1.05 WHIP — strong strikeout arm, but right-handed corner power hitters take him deep at a clip above his ERA.",
    matchupGrade: "B",
    estOdds: "+400",
    note: "Alonso has 12 HR this season and Camden Yards plays as a moderate power environment well-suited to his pull-side profile. McClanahan's 2.82 ERA understates some vulnerability versus elite corner power bats with high exit velocity.",
    tags: ["💰 Value", "📈 Breakout"]
  },
  {
    id: 12,
    name: "Bryce Harper",
    team: "PHI",
    tier: "A",
    park: "Petco Park",
    pitcher: "Randy Vasquez",
    pitcherNote: "2.96 ERA with xFIP of 3.87 — has been fortunate on BABIP and is due for regression against left-handed power.",
    matchupGrade: "B",
    estOdds: "+370",
    note: "Harper has 9 HR and an .880 OPS posting his usual elite left-handed power numbers through late May. Vasquez is outperforming his FIP by nearly a full run and Harper is one of few bats that can overcome Petco's suppression through sheer exit velocity.",
    tags: ["👑 MVP/Elite", "📈 Breakout"]
  },
  {
    id: 13,
    name: "Francisco Lindor",
    team: "NYM",
    tier: "A",
    park: "Citi Field",
    pitcher: "Nick Lodolo",
    pitcherNote: "8.68 ERA / 1.61 WHIP — zero command, blister forcing mechanical changes that stripped velocity and movement.",
    matchupGrade: "A",
    estOdds: "+380",
    note: "Lindor has 10 HR and an .840 OPS with excellent production against struggling left-handers in his cleanup spot. Lodolo's 8.68 ERA is the worst in the NL and Citi Field's neutral park factor gives Lindor a strong Memorial Day opportunity.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 14,
    name: "Jackson Chourio",
    team: "MIL",
    tier: "A",
    park: "American Family Field",
    pitcher: "Michael McGreevy",
    pitcherNote: "2.40 ERA masks a 4.03 FIP — strikeout-poor (37 K in 56.1 IP) and vulnerable to pull-power bats sitting on his fastball.",
    matchupGrade: "B+",
    estOdds: "+390",
    note: "Chourio has 8 HR and .820 OPS in his sophomore campaign, showing the elite bat speed that made him a consensus top prospect. The American Family Field dome neutralizes all weather and McGreevy's 4.03 FIP signals real regression risk against Chourio's developing power.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 15,
    name: "Marcus Semien",
    team: "TEX",
    tier: "A",
    park: "Globe Life Field",
    pitcher: "Tatsuya Imai",
    pitcherNote: "8.31 ERA / 1.79 WHIP — command meltdown, surrenders multi-run innings with near-automatic frequency in every start.",
    matchupGrade: "A",
    estOdds: "+420",
    note: "Semien has 8 HR and remains one of the most consistent right-handed power bats in the AL lineup. Inside the Globe Life dome facing Imai's 8.31 ERA disaster, Semien's professional plate approach and elite barrel rate make him a strong A-tier Memorial Day play.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 16,
    name: "Gunnar Henderson",
    team: "BAL",
    tier: "A",
    park: "Camden Yards",
    pitcher: "Shane McClanahan",
    pitcherNote: "2.82 ERA / 1.05 WHIP — but 19% barrel rate allowed shows elite contact makers consistently reach him.",
    matchupGrade: "B",
    estOdds: "+410",
    note: "Henderson has 11 HR and an .865 OPS continuing his ascent as Baltimore's franchise cornerstone and switch-hitting terror. McClanahan is quality but Henderson's 90th-percentile exit velocity and strong production from both sides give him a legitimate Camden Yards shot.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 17,
    name: "Nathaniel Lowe",
    team: "TEX",
    tier: "A",
    park: "Globe Life Field",
    pitcher: "Tatsuya Imai",
    pitcherNote: "8.31 ERA / 1.79 WHIP — one of the worst active pitching lines in MLB; cannot locate fastball or breaking ball consistently.",
    matchupGrade: "A",
    estOdds: "+450",
    note: "Lowe has 7 HR and an .800 OPS with a patient approach that wears out struggling pitchers into full counts on premium pitches. Imai's 8.31 ERA combined with the controlled dome environment makes Globe Life a prime power spot for Lowe's pull-side game.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 18,
    name: "Fernando Tatis Jr.",
    team: "SD",
    tier: "A",
    park: "Petco Park",
    pitcher: "Jesus Luzardo",
    pitcherNote: "3-4, 4.85 ERA / 1.30 WHIP — gives up hard contact to right-handed power bats and has inconsistent off-speed command.",
    matchupGrade: "B+",
    estOdds: "+380",
    note: "Tatis has 12 HR and an .890 OPS, thriving at Petco despite its suppressive reputation through sheer pull power and elite exit velocity. Luzardo's 4.85 ERA with right-handed hitters is a genuine opportunity for the Padres' franchise anchor at his home park.",
    tags: ["👑 MVP/Elite", "📈 Breakout"]
  },
  {
    id: 19,
    name: "Josh Naylor",
    team: "CLE",
    tier: "A",
    park: "Progressive Field",
    pitcher: "Zack Littell",
    pitcherNote: "5.83 ERA with 15 HR surrendered in 46.1 IP — essentially serves batting practice to left-handed power hitters.",
    matchupGrade: "A",
    estOdds: "+430",
    note: "Naylor has 10 HR and an .825 OPS providing power from the middle of Cleveland's lineup at home. Littell's 15 HR allowed is an extraordinary mark that signals Naylor — as a left-handed power bat — gets a green light against this starter at Progressive Field.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 20,
    name: "Vladimir Guerrero Jr.",
    team: "TOR",
    tier: "A",
    park: "Rogers Centre",
    pitcher: "Janson Junk",
    pitcherNote: "5.07 ERA / 1.27 WHIP — walks too many batters and has allowed 8 HR in 55 IP, leaving elevated pitches over the plate.",
    matchupGrade: "A-",
    estOdds: "+370",
    note: "Guerrero has 13 HR and an .880 OPS carrying Toronto's offense as their cleanup hitter at a controlled Rogers Centre dome. Junk's 5.07 ERA and 8 HR allowed in 55 IP make this a prime home-park power spot for Vlad in the late-game window.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster"]
  },

  // ─── B-TIER ────────────────────────────────────────────────────────────────
  {
    id: 21,
    name: "Manny Machado",
    team: "SD",
    tier: "B",
    park: "Petco Park",
    pitcher: "Jesus Luzardo",
    pitcherNote: "4.85 ERA — declining velocity on slider, pitches up in the zone more than optimal against veterans.",
    matchupGrade: "B",
    estOdds: "+500",
    note: "Machado has 9 HR at home and knows Petco's dimensions better than any batter in baseball history. Luzardo's 4.85 ERA gives the veteran slugger a clean window to pull one out despite the park suppression.",
    tags: ["💰 Value", "🔥 Hot"]
  },
  {
    id: 22,
    name: "Jackson Holliday",
    team: "BAL",
    tier: "B",
    park: "Camden Yards",
    pitcher: "Shane McClanahan",
    pitcherNote: "2.82 ERA / 1.05 WHIP — dominant left-hander who attacks young switch-hitters effectively with varied sequencing.",
    matchupGrade: "C+",
    estOdds: "+600",
    note: "Holliday has 7 HR through late May showing plus raw power in his sophomore emergence at Baltimore. McClanahan is a tough draw but Camden Yards and Holliday's improving hard-contact metrics make him worth a speculative flier.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 23,
    name: "Kyle Tucker",
    team: "CHC",
    tier: "B",
    park: "PNC Park",
    pitcher: "Carmen Mlodzinski",
    pitcherNote: "3.96 ERA / 1.40 WHIP — sinker-slider approach limits fly balls; PNC Park's suppressive environment compounds the challenge.",
    matchupGrade: "B-",
    estOdds: "+520",
    note: "Tucker has 8 HR and continues to generate consistent hard contact for Chicago's lineup. Mlodzinski's 3.96 ERA and ground-ball profile will cap upside at PNC, but Tucker's pull-power gap-shot ability keeps him viable.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 24,
    name: "Ian Happ",
    team: "CHC",
    tier: "B",
    park: "PNC Park",
    pitcher: "Carmen Mlodzinski",
    pitcherNote: "3.96 ERA — sinker-heavy approach that limits fly balls and plays well in suppressive parks.",
    matchupGrade: "C+",
    estOdds: "+570",
    note: "Happ has 7 HR and provides solid left-handed pop in Chicago's order on a warm Memorial Day afternoon. PNC Park is a challenge but Happ's fly-ball rate and pull tendencies make him a lotto ticket against a pitcher who occasionally loses command.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 25,
    name: "Jordan Walker",
    team: "STL",
    tier: "B",
    park: "American Family Field",
    pitcher: "Jacob Misiorowski",
    pitcherNote: "1.89 ERA, 3-0 in May — dominant strikeout repertoire with 37 K in last 24.1 IP, virtually unhittable this month.",
    matchupGrade: "C",
    estOdds: "+600",
    note: "Walker has 7 HR on the season and retains the raw power that made him a consensus top-10 prospect. Misiorowski has been near-unhittable in May, but the dome environment at American Family Field can amplify any mistake pitch into a souvenir.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 26,
    name: "Willy Adames",
    team: "MIL",
    tier: "B",
    park: "American Family Field",
    pitcher: "Michael McGreevy",
    pitcherNote: "2.40 ERA masks a 4.03 FIP — strikeout-poor starter who relies on defense; right-handed power bats sit on his fastball.",
    matchupGrade: "B",
    estOdds: "+480",
    note: "Adames has 9 HR and .800 OPS leading Milwaukee's power-laden middle infield through late May. McGreevy's 4.03 FIP leaves plenty of room for the dome to magnify one mistake pitch in front of the Milwaukee home crowd.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 27,
    name: "Jazz Chisholm",
    team: "NYY",
    tier: "B",
    park: "Kauffman Stadium",
    pitcher: "Michael Wacha",
    pitcherNote: "3.90 ERA / 1.30 WHIP — gives up big fly balls to left-handed power bats at a higher rate than his ERA reflects.",
    matchupGrade: "B-",
    estOdds: "+550",
    note: "Chisholm has been a spark plug for the Yankees with 8 HR and an aggressive approach at the plate in every lineup slot. Wacha historically struggles with left-handed free-swingers who generate above-average exit velocity on contact.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 28,
    name: "Julio Rodriguez",
    team: "SEA",
    tier: "B",
    park: "Sutter Health Park",
    pitcher: "Aaron Civale",
    pitcherNote: "5-1, 3.31 ERA — strong cutter-heavy approach, induces weak contact, but Rodriguez's elite speed-power combo creates danger.",
    matchupGrade: "B-",
    estOdds: "+530",
    note: "Rodriguez has 7 HR and is one of the most athletically gifted power hitters in the AL with elite sprint speed and top-tier exit velocity. Sutter Health Park's compact Minor League dimensions create HR opportunities even against Civale's solid profile.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 29,
    name: "Bryan Reynolds",
    team: "PIT",
    tier: "B",
    park: "PNC Park",
    pitcher: "Ben Brown",
    pitcherNote: "1-2, 2.09 ERA — significantly outperforming peripherals with a FIP near 3.90; regression candidate on fly balls.",
    matchupGrade: "B-",
    estOdds: "+540",
    note: "Reynolds has 8 HR and a solid .780 OPS batting in the middle of Pittsburgh's lineup on a warm Memorial Day in Pittsburgh. Brown's 2.09 ERA comes with a FIP nearly two full runs higher — Reynolds' consistent hard contact at home could expose that gap.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 30,
    name: "Steven Kwan",
    team: "CLE",
    tier: "B",
    park: "Progressive Field",
    pitcher: "Zack Littell",
    pitcherNote: "5.83 ERA / 1.45 WHIP — 15 HR allowed, cannot generate swings and misses against any tier of hitter.",
    matchupGrade: "B+",
    estOdds: "+560",
    note: "Kwan has 6 HR and brings strong contact skills that exploit pitchers who must consistently work in the strike zone. Littell's 15 HR and 5.83 ERA make Progressive Field a legitimate opportunity even for a line-drive hitter who occasionally goes deep.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 31,
    name: "James Wood",
    team: "WSH",
    tier: "B",
    park: "Progressive Field",
    pitcher: "Tanner Bibee",
    pitcherNote: "0-6 despite a 3.75 ERA — strong strikeout profile, but Wood's raw power is a legitimate counter to any ERA.",
    matchupGrade: "B-",
    estOdds: "+560",
    note: "Wood has 6 HR and draws national attention for his extraordinary size and raw power potential as one of the game's top young outfielders. Bibee is effective, but Wood's elite exit velocity makes him dangerous even in a neutral park environment at Progressive Field.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 32,
    name: "CJ Abrams",
    team: "WSH",
    tier: "B",
    park: "Progressive Field",
    pitcher: "Tanner Bibee",
    pitcherNote: "3.75 ERA / 1.25 WHIP — strong command, but gives up gap power to aggressive early-count swingers.",
    matchupGrade: "C+",
    estOdds: "+620",
    note: "Abrams has 6 HR and is showing improved pull-power awareness in his continued development. Bibee's 3.75 ERA makes this a longshot, but Abrams' speed and aggression create an unconventional power profile worth the look.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },
  {
    id: 33,
    name: "Brent Rooker",
    team: "ATH",
    tier: "B",
    park: "Sutter Health Park",
    pitcher: "Luis Castillo",
    pitcherNote: "1-5, 6.41 ERA — allowing hard contact at an alarming rate with 6 HR in his last 6 appearances.",
    matchupGrade: "B+",
    estOdds: "+480",
    note: "Rooker has 9 HR and is one of the purest power threats in the AL lineup, built exactly for short-porch environments. Castillo's 6.41 ERA at Sutter Health Park's Minor League dimensions is a dream matchup for an all-or-nothing slugger.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 34,
    name: "Mark Vientos",
    team: "NYM",
    tier: "B",
    park: "Citi Field",
    pitcher: "Nick Lodolo",
    pitcherNote: "8.68 ERA / 1.61 WHIP — the most exploitable starting pitcher on today's entire slate.",
    matchupGrade: "A-",
    estOdds: "+500",
    note: "Vientos has been a Mets breakout power story with 8 HR and .810 OPS through late May. Against Lodolo's 8.68 ERA disaster at Citi Field, Vientos' developing power profile represents excellent value on a Memorial Day plate.",
    tags: ["💣 SP Disaster", "📈 Breakout"]
  },
  {
    id: 35,
    name: "Anthony Volpe",
    team: "NYY",
    tier: "B",
    park: "Kauffman Stadium",
    pitcher: "Michael Wacha",
    pitcherNote: "3.90 ERA / 1.30 WHIP — gives up hard contact to right-handed pull-power hitters in counts he falls behind.",
    matchupGrade: "B-",
    estOdds: "+580",
    note: "Volpe has 7 HR and continues developing his power stroke batting near the top of the Yankees' powerful order. Wacha's 3.90 ERA gives Volpe a moderate opportunity to put one over the fences at Kauffman on Memorial Day.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 36,
    name: "Jung-Hoo Lee",
    team: "SF",
    tier: "B",
    park: "Oracle Park",
    pitcher: "Merrill Kelly",
    pitcherNote: "5.71 ERA / 1.40 WHIP — struggling veteran who has lost command of secondary pitches throughout the 2026 season.",
    matchupGrade: "B",
    estOdds: "+540",
    note: "Lee has 6 HR and .790 OPS in his second full MLB season, showing improved power from the opposite-field line. Kelly's 5.71 ERA opens a window despite Oracle Park's suppressive dimensions — Lee's contact quality can carry one out to right-center.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 37,
    name: "William Contreras",
    team: "MIL",
    tier: "B",
    park: "American Family Field",
    pitcher: "Michael McGreevy",
    pitcherNote: "4.03 FIP despite 2.40 ERA — extreme positive BABIP luck; hitters making good contact are just finding gloves.",
    matchupGrade: "B",
    estOdds: "+490",
    note: "Contreras has 7 HR and .795 OPS at Milwaukee's dome, using his compact power stroke inside a controlled indoor environment. McGreevy's FIP-ERA gap suggests Contreras is due to cash in — today's dome setting and familiar park make it prime.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 38,
    name: "Munetaka Murakami",
    team: "CWS",
    tier: "B",
    park: "Guaranteed Rate Field",
    pitcher: "Zebby Matthews",
    pitcherNote: "1-1, 1.38 ERA / 0.77 WHIP — dominant in limited action, but Murakami's 100th-percentile exit velocity threatens any pitcher.",
    matchupGrade: "C+",
    estOdds: "+500",
    note: "Murakami leads the White Sox with 17 HR and has been the revelation of the 2026 MLB season as a rookie power sensation. Matthews' 1.38 ERA is a genuine wall, but Murakami's elite exit velocity and raw pull power make him viable even in this tough spot.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 39,
    name: "Trea Turner",
    team: "PHI",
    tier: "B",
    park: "Petco Park",
    pitcher: "Randy Vasquez",
    pitcherNote: "2.96 ERA, xFIP 3.87 — outperforming contact metrics; speed threats like Turner draw favorable early-count situations.",
    matchupGrade: "C+",
    estOdds: "+580",
    note: "Turner has 6 HR and .780 OPS providing complementary pop alongside Schwarber and Harper at the heart of Philly's order. Vasquez's regression risk and potential for high-leverage counts favor Turner's aggressive early-count approach at Petco.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 40,
    name: "Cal Raleigh",
    team: "SEA",
    tier: "B",
    park: "Sutter Health Park",
    pitcher: "Aaron Civale",
    pitcherNote: "3.31 ERA — strong command, but Raleigh generates above-average exit velocity on cutter-fastball combinations.",
    matchupGrade: "B-",
    estOdds: "+530",
    note: "Raleigh has 8 HR and remains one of the most powerful catchers in the majors with his all-or-nothing approach at the dish. Sutter Health Park's compact dimensions and Civale's occasional elevated pitches give Raleigh a legitimate opportunity.",
    tags: ["💰 Value", "🔜 Due"]
  },

  // ─── C-TIER ────────────────────────────────────────────────────────────────
  {
    id: 41,
    name: "Jesús Sánchez",
    team: "MIA",
    tier: "C",
    park: "Rogers Centre",
    pitcher: "Trey Yesavage",
    pitcherNote: "2-1, 1.07 ERA — virtually unhittable since returning from IL; dominant command with elite swing-and-miss rates.",
    matchupGrade: "D",
    estOdds: "+900",
    note: "Sánchez has 5 HR and raw pull power that could catch a single mistake pitch on any given night. Yesavage's 1.07 ERA makes this pure lottery territory — Sánchez needs a rare command slip in a controlled dome environment.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 42,
    name: "Luis Arraez",
    team: "SD",
    tier: "C",
    park: "Petco Park",
    pitcher: "Jesus Luzardo",
    pitcherNote: "4.85 ERA — moderately exploitable, but Arraez's contact-first approach rarely generates the launch angle needed for HRs.",
    matchupGrade: "D",
    estOdds: "+1200",
    note: "Arraez is the greatest pure contact hitter in baseball with virtually zero historical HR upside — but Luzardo's 4.85 ERA occasionally produces mistake pitches even elite contact bats can elevate. True lottery inclusion only.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 43,
    name: "Oneil Cruz",
    team: "PIT",
    tier: "C",
    park: "PNC Park",
    pitcher: "Ben Brown",
    pitcherNote: "2.09 ERA masks a nearly 4.00 FIP — Cruz's elite raw power can expose a regression-prone pitcher on one swing.",
    matchupGrade: "C-",
    estOdds: "+700",
    note: "Cruz has 6 HR and one of the most impressive raw exit velocity profiles in MLB at 6-foot-7 with monster bat speed. Brown's inflated ERA-FIP gap makes PNC Park's suppressive environment the only obstacle — when Cruz connects, it flies anywhere.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },
  {
    id: 44,
    name: "Zach McKinstry",
    team: "CWS",
    tier: "C",
    park: "Guaranteed Rate Field",
    pitcher: "Zebby Matthews",
    pitcherNote: "1.38 ERA / 0.77 WHIP — the AL's hottest pitcher, a true Cy Young front-runner through late May.",
    matchupGrade: "D",
    estOdds: "+1000",
    note: "McKinstry has 4 HR and limited power upside against elite pitching but provides utility value at the back of Chicago's order. Matthews is nearly unhittable and McKinstry would need a genuine mistake pitch — true jackpot territory.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 45,
    name: "Nick Castellanos",
    team: "PHI",
    tier: "C",
    park: "Petco Park",
    pitcher: "Randy Vasquez",
    pitcherNote: "2.96 ERA, xFIP 3.87 — Castellanos' fly-ball pull approach can occasionally catch a regressing pitcher off-guard.",
    matchupGrade: "C",
    estOdds: "+750",
    note: "Castellanos has 5 HR through late May and occasionally explodes for multi-HR performances completely out of nowhere. Vasquez's FIP-ERA gap and Castellanos' aggressive approach make this a low-probability but non-zero lottery shot even at suppressive Petco.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 46,
    name: "Jordan Lawlar",
    team: "AZ",
    tier: "C",
    park: "Oracle Park",
    pitcher: "Tyler Mahle",
    pitcherNote: "4.10 ERA — moderate command issues with a slider that flattens against patient hitters in extended counts.",
    matchupGrade: "C",
    estOdds: "+800",
    note: "Lawlar has 5 HR and is developing into Arizona's shortstop of the future with emerging pull-power upside in his young career. Oracle Park is suppressive but Mahle's command lapses occasionally produce hittable pitches — Lawlar is a deep-value lottery play.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },
  {
    id: 47,
    name: "Michael Massey",
    team: "KC",
    tier: "C",
    park: "Kauffman Stadium",
    pitcher: "Cam Schlittler",
    pitcherNote: "1.50 ERA / 0.86 WHIP — AL ERA leader with elite swing-and-miss on all four pitches.",
    matchupGrade: "D",
    estOdds: "+1100",
    note: "Massey has 4 HR and represents a pure lottery inclusion against Schlittler's historically dominant ERA pace. Kauffman's moderate dimensions and Massey's left-handed approach create the smallest of windows — true jackpot territory on this Memorial Day.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 48,
    name: "Tommy Edman",
    team: "LAD",
    tier: "C",
    park: "Dodger Stadium",
    pitcher: "Tanner Gordon",
    pitcherNote: "6.59 ERA — disaster start, but Edman's leadoff role limits pure power-count at-bats.",
    matchupGrade: "C+",
    estOdds: "+850",
    note: "Edman has 4 HR but his leadoff role reduces opportunities for the long ball in traditional power counts at the bottom of orders. Dodger Stadium's elite HR environment and Gordon's 6.59 ERA create a window for the 10A parlay inclusion with LAD stack value.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 49,
    name: "Daulton Varsho",
    team: "TOR",
    tier: "C",
    park: "Rogers Centre",
    pitcher: "Janson Junk",
    pitcherNote: "5.07 ERA / 1.27 WHIP — command issues leave Varsho's left-handed pop a legitimate threat at the dome.",
    matchupGrade: "C+",
    estOdds: "+780",
    note: "Varsho has 5 HR and brings a left-handed power swing that can exploit command-challenged right-handers in long counts. Rogers Centre's controlled dome neutralizes weather and Junk's 5.07 ERA signals non-trivial HR risk — Varsho is a deep-value dome inclusion.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 50,
    name: "Corey Seager",
    team: "TEX",
    tier: "C",
    park: "Globe Life Field",
    pitcher: "Tatsuya Imai",
    pitcherNote: "8.31 ERA / 1.79 WHIP — worst ERA in the AL; Seager faces the best individual matchup on the entire slate if healthy.",
    matchupGrade: "A",
    estOdds: "+350",
    note: "Seager's playing status carries injury risk from recent activity — day-to-day; confirm lineup before rostering. If active, he faces Imai's 8.31 ERA inside the Globe Life dome — the absolute best pitcher-park combo on today's board at the best possible odds.",
    tags: ["🎰 Longshot", "💣 SP Disaster"]
  }
];

const parlays = [
  {
    id: "4A",
    legs: 4,
    label: "THE CORE FOUR",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+850",
    description: "The four biggest SP disasters on the Memorial Day slate all on one ticket.",
    playerIds: [1, 2, 3, 4],
    strategy: "Ohtani vs Gordon (6.59 ERA) at Dodger Stadium, Soto vs Lodolo (8.68 ERA) at Citi, Ramirez vs Littell (5.83 ERA, 15 HR allowed) at Progressive, Garcia vs Imai (8.31 ERA) in the Globe Life dome — four elite bats facing four busted pitchers. The Memorial Day lower-risk anchor."
  },
  {
    id: "4B",
    legs: 4,
    label: "POWER SURGE",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+800",
    description: "Elite contact-plus-power combined across the best park environments.",
    playerIds: [1, 5, 6, 9],
    strategy: "Ohtani, Schwarber (MLB HR leader at 20), Betts, and Freeman all bring elite exit velocity to situations where pitchers are vulnerable. Three of these four bats are at Dodger Stadium or in favorable park situations — pure power quality on one parlay."
  },
  {
    id: "5A",
    legs: 5,
    label: "DISASTER STACK",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1200",
    description: "Five hitters each facing a pitcher with ERA above 5.00.",
    playerIds: [1, 2, 3, 4, 20],
    strategy: "Every leg faces a pitcher with ERA 5.07 or worse — Ohtani/Gordon (6.59), Soto/Lodolo (8.68), Ramirez/Littell (5.83), Garcia/Imai (8.31), Guerrero/Junk (5.07). Pure SP disaster concentration across five elite bats on one Memorial Day ticket."
  },
  {
    id: "5B",
    legs: 5,
    label: "MEMORIAL MAYHEM",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+1400",
    description: "Two premium park-pitcher combos expanded into a five-leg holiday parlay.",
    playerIds: [1, 6, 2, 13, 14],
    strategy: "Dodger Stadium double stack (Ohtani, Betts) vs Gordon's 6.59 ERA, Citi Field Mets duo (Soto, Lindor) vs Lodolo's 8.68 ERA disaster, plus Chourio in the Milwaukee dome vs McGreevy's inflated 4.03 FIP. Five games, five legitimate Memorial Day fireworks shots."
  },
  {
    id: "5C",
    legs: 5,
    label: "TEXAS DOME STACK",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+1600",
    description: "Globe Life Field dome stack featuring Imai's historically bad ERA.",
    playerIds: [4, 15, 17, 8, 50],
    strategy: "Garcia, Semien, and Lowe all face Imai (8.31 ERA, 1.79 WHIP) in the controlled Globe Life dome — arguably the best trio stack opportunity of the entire 2026 season. Alvarez adds elite dome power versus Rocker, and Seager (injury watch required) completes the dome parlay facing the same 8.31 ERA disaster."
  },
  {
    id: "6A",
    legs: 6,
    label: "ELITE CORE",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2000",
    description: "Six elite power bats from the top disaster matchups of the holiday slate.",
    playerIds: [1, 2, 3, 4, 8, 11],
    strategy: "The full SP disaster collection — Ohtani, Soto, Ramirez, Garcia facing ERA-busted starters, Alvarez in the Globe Life dome with his .895 OPS, and Alonso bringing veteran power at Camden Yards. Six-leg package hits if baseball's elite bats do what they do against struggling pitchers."
  },
  {
    id: "6B",
    legs: 6,
    label: "PARK ADVANTAGE",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2200",
    description: "Top-ranked park environments paired with quality power hitters.",
    playerIds: [1, 6, 9, 18, 20, 33],
    strategy: "Dodger triple-stack (Ohtani, Betts, Freeman) vs Gordon's 6.59 ERA at the #1 HR park, Tatis at Petco vs Luzardo (4.85 ERA), Guerrero at Rogers Centre dome vs Junk (5.07 ERA), and Rooker at Sutter Health Park vs Castillo (6.41 ERA). Park advantage on every single leg."
  },
  {
    id: "7A",
    legs: 7,
    label: "MEMORIAL DAY MONSTER",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+3000",
    description: "Seven legs anchored by the day's biggest pitcher mismatches.",
    playerIds: [1, 2, 3, 4, 7, 11, 19],
    strategy: "The four core disaster bats plus Judge (17 HR vs Wacha), Alonso (12 HR veteran power at Camden Yards), and Naylor (vs Littell's 15 HR allowed) form a seven-leg parlay covering four distinct SP disasters. High Memorial Day upside against unusual starting pitcher vulnerabilities.",
  },
  {
    id: "7B",
    legs: 7,
    label: "EVENING SEVEN",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+3200",
    description: "Targeting the best evening-game HR matchups across the late-night window.",
    playerIds: [1, 5, 8, 9, 16, 18, 20],
    strategy: "Ohtani and Freeman anchor the Dodger evening cap, Schwarber brings his 20-HR pace at Petco, Alvarez adds dome production, Henderson layers in Camden Yards pop, Tatis exploits Luzardo's 4.85 ERA, and Guerrero handles the Blue Jays dome vs Junk. Seven elite bats covering every evening time slot."
  },
  {
    id: "7C",
    legs: 7,
    label: "DOME SEVEN",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+3400",
    description: "Pure indoor slate — all seven legs in climate-controlled dome environments.",
    playerIds: [4, 8, 15, 17, 14, 20, 49],
    strategy: "Globe Life dome stack (Garcia, Alvarez, Semien, Lowe) against Imai's historic 8.31 ERA, Chourio in Milwaukee's dome vs McGreevy's 4.03 FIP, Guerrero at Rogers Centre vs Junk (5.07 ERA), and Varsho as a deep-value dome inclusion. Zero weather variables on every leg of this indoor parlay."
  },
  {
    id: "8A",
    legs: 8,
    label: "ELITE EIGHT",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+4500",
    description: "Eight elite power bats from the day's strongest matchups.",
    playerIds: [1, 2, 3, 4, 5, 7, 11, 13],
    strategy: "Six pitchers with ERAs above 4.13 are represented across these eight legs — Schwarber's 20 HR pace, Ramirez's 13 HR production, Soto vs Lodolo, Garcia vs Imai, Ohtani vs Gordon, Judge with 17 HR, Alonso's corner power, and Lindor vs Lodolo at Citi. The ambitious Memorial Day eight-leg elite build."
  },
  {
    id: "8B",
    legs: 8,
    label: "VALUE EIGHT",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+4800",
    description: "Eight value-priced bats across favorable matchups offering excellent return.",
    playerIds: [3, 4, 9, 14, 16, 18, 19, 33],
    strategy: "Ramirez and Garcia anchor the disaster matchups vs Littell (5.83 ERA) and Imai (8.31 ERA), Freeman and Chourio cover the Dodger and dome angles, Henderson and Naylor add Baltimore-Cleveland power, Tatis exploits Luzardo's 4.85 ERA at Petco, and Rooker at Sutter Health Park vs Castillo (6.41 ERA) completes the deep-value eighth leg."
  },
  {
    id: "9A",
    legs: 9,
    label: "HOLIDAY NINESLOT",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+6500",
    description: "Nine-leg parlay covering all the best Memorial Day HR angles.",
    playerIds: [1, 2, 3, 4, 5, 7, 8, 11, 13],
    strategy: "The complete disaster-pitcher collection: Ohtani/Betts vs Gordon (6.59), Soto/Lindor vs Lodolo (8.68), Ramirez/Naylor vs Littell (5.83/15 HR), Garcia vs Imai (8.31), Schwarber with his 20-HR pace, Judge with his 17 HR, and Alvarez in the Globe Life dome. Nine shots on one holiday card."
  },
  {
    id: "9B",
    legs: 9,
    label: "DOME AND DISASTER",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+7000",
    description: "Combining dome stacks with SP disaster matchups into a mega Memorial Day parlay.",
    playerIds: [1, 2, 4, 8, 14, 15, 16, 18, 20],
    strategy: "Ohtani (Dodger #1 park), Soto (Lodolo disaster), Garcia and Semien (Imai disaster at Globe Life dome), Chourio (MIL dome vs McGreevy FIP 4.03), Alvarez (dome power vs Rocker), Henderson (Camden Yards), Tatis (Petco vs Luzardo 4.85), Guerrero (Rogers dome vs Junk). Nine legs blending every structural advantage today's slate offers."
  },
  {
    id: "10A",
    legs: 10,
    label: "MEMORIAL MAX",
    risk: "Max Risk",
    riskColor: "#9c27b0",
    estPayout: "+10000",
    description: "Ten-leg maximum lottery including two C-tier longshots for Memorial Day jackpot upside.",
    playerIds: [1, 2, 3, 4, 7, 8, 11, 43, 46, 50],
    strategy: "The seven elite anchors plus three lottery legs: Cruz at PNC Park (elite raw power, Brown's near-4.00 FIP), Lawlar at Oracle vs Mahle (developing power, 4.10 ERA command issues), and Seager (if healthy, faces Imai's 8.31 ERA — the absolute best matchup of Memorial Day). Two confirmed C-tier inclusions at +700 and +800 create a jackpot-tier holiday parlay targeting $10,000+ returns."
  }
];
