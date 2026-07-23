const TEAM_TO_GAME = {
  "SD":  "SD@ATL",
  "ATL": "SD@ATL",
  "MIN": "MIN@CLE",
  "CLE": "MIN@CLE",
  "TB":  "TB@TOR",
  "TOR": "TB@TOR",
  "ARI": "ARI@STL",
  "STL": "ARI@STL",
  "KC":  "KC@DET",
  "DET": "KC@DET"
};

const SLATE_DATE  = "JULY 23, 2026";
const SLATE_LABEL = "THURSDAY MLB SLATE";

const CONTEXT_CARDS = [
  {
    icon:  "💣",
    label: "Nick Canning — SP Disaster",
    note:  "6.47 ERA entering July 23",
    sub:   "Canning has been a home run machine all season — his 6.47 ERA and elevated HR/9 make him must-target for Atlanta's lineup. Truist Park ranks #10 in HR context and plays favorable in warm July conditions. Olson, Riley, and Harris are licking their chops against this disaster start."
  },
  {
    icon:  "💣",
    label: "Shane Bieber — SP Disaster",
    note:  "7.64 ERA, 2.04 WHIP in 2026",
    sub:   "Bieber's decline has been catastrophic — a 7.64 ERA and 2.04 WHIP means every at-bat is a scoring opportunity. Tampa Bay hitters at Rogers Centre get a dome stack opportunity against one of baseball's most hittable starters. Caminero leads the charge at elite power odds."
  },
  {
    icon:  "🌤️",
    label: "Truist Park — Best Outdoor Park",
    note:  "Park rank #10, warm July day game",
    sub:   "Atlanta's Truist Park is the best outdoor HR venue on today's slate. With Canning on the mound and warm July temperatures, it sets up as a premium power-hitting environment. Stack Atlanta's lineup top-to-bottom for maximum upside."
  },
  {
    icon:  "🏟️",
    label: "Rogers Centre — Dome Stack",
    note:  "Bieber 7.64 ERA meets Tampa Bay's lineup",
    sub:   "Rogers Centre as a dome venue eliminates weather variance entirely. Tampa Bay brings one of the game's better power lineups against Shane Bieber's wreckage of a 2026 season. Caminero and Díaz have legitimate S-tier HR upside in this dome matchup."
  }
];

const PARK_FACTORS = {
  "Truist Park":       { rank: 1,  label: "🔥 Best HR Park Today (#10 overall)", color: "#ffb347" },
  "Busch Stadium":     { rank: 2,  label: "⚾ Neutral Park (#13 overall)",         color: "#b0bec5" },
  "Progressive Field": { rank: 3,  label: "⚾ Neutral Park (#16 overall)",         color: "#b0bec5" },
  "Rogers Centre":     { rank: 4,  label: "🏟️ Dome/Roof Closed (#19 overall)",    color: "#b0bec5" },
  "Comerica Park":     { rank: 5,  label: "📉 Suppressive Park (#25 overall)",     color: "#78909c" }
};

const players = [
  // ─── S-TIER ───────────────────────────────────────────────────────────────
  {
    id: 1, name: "Matt Olson", team: "ATL", tier: "S",
    park: "Truist Park", pitcher: "Nick Canning", pitcherNote: "6.47 ERA, elevated HR/9 — has surrendered power at elite rates all season.",
    matchupGrade: "A+", estOdds: "+270",
    note: "Olson leads the NL in HR this season with a .540 SLG and .280 ISO — pure power metrics that scream home run. Canning's 6.47 ERA sets up a disaster start at Truist Park where Olson has crushed all year.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 2, name: "Austin Riley", team: "ATL", tier: "S",
    park: "Truist Park", pitcher: "Nick Canning", pitcherNote: "6.47 ERA, allowing HRs at an alarming rate throughout 2026.",
    matchupGrade: "A+", estOdds: "+290",
    note: "Riley's .520 SLG and 22 HR pace make him one of the most dangerous power bats on this slate. Canning has been a disaster against right-handed pull hitters and Riley is the textbook case.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster"]
  },
  {
    id: 3, name: "Jonny DeLauter", team: "CLE", tier: "S",
    park: "Progressive Field", pitcher: "David Festa", pitcherNote: "4.85 ERA, 1.38 WHIP — struggles to miss bats and gets elevated hard contact.",
    matchupGrade: "A", estOdds: "+310",
    note: "DeLauter's breakout 2026 features a .490 SLG and 18 HR by mid-July — one of Cleveland's best power threats. Festa's 4.85 ERA and soft stuff give Cleveland's lineup multiple opportunities.",
    tags: ["📈 Breakout", "💣 SP Disaster"]
  },
  {
    id: 4, name: "Yandy Díaz", team: "TB", tier: "S",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA, 2.04 WHIP — statistically one of baseball's worst starters in 2026.",
    matchupGrade: "A+", estOdds: "+320",
    note: "Díaz has elevated his HR production in 2026 with a .460 SLG and 15 HR — plus a .380 OBP that puts him on base constantly. Bieber's 7.64 ERA is a gift, and Díaz has the bat speed to punish any mistake.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster"]
  },
  {
    id: 5, name: "Marcelo Caminero", team: "TB", tier: "S",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA, 2.04 WHIP — elite HR/9 rate, can't locate fastball consistently.",
    matchupGrade: "A+", estOdds: "+340",
    note: "Caminero's raw power is elite — .520 SLG, .270 ISO, and 20 HR pace at just 22 years old. Bieber's 7.64 ERA in a dome environment with no weather variables makes this a near-automatic S-tier play.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🎰 Longshot"]
  },
  {
    id: 6, name: "Michael Harris II", team: "ATL", tier: "S",
    park: "Truist Park", pitcher: "Nick Canning", pitcherNote: "6.47 ERA, struggles against athletic contact hitters who cover the zone.",
    matchupGrade: "A+", estOdds: "+350",
    note: "Harris hits .295 with a .490 SLG and 17 HR — the three-hole threat in a loaded Atlanta lineup. Canning's 6.47 ERA and Truist Park's #10 ranking combine for a premium HR setup.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster"]
  },

  // ─── A-TIER ───────────────────────────────────────────────────────────────
  {
    id: 7, name: "José Ozuna", team: "ATL", tier: "A",
    park: "Truist Park", pitcher: "Nick Canning", pitcherNote: "6.47 ERA — power hitters have feasted on flat fastball location all year.",
    matchupGrade: "A", estOdds: "+390",
    note: "Ozuna's .510 SLG and 19 HR make him a lineup cornerstone in Atlanta's power-heavy order. Canning's 6.47 ERA at Truist Park is a legitimate A-tier opportunity.",
    tags: ["🔥 Hot", "💣 SP Disaster"]
  },
  {
    id: 8, name: "Steven Kwan", team: "CLE", tier: "A",
    park: "Progressive Field", pitcher: "David Festa", pitcherNote: "4.85 ERA, 1.38 WHIP — gives up barrels to contact-first hitters.",
    matchupGrade: "A-", estOdds: "+380",
    note: "Kwan has evolved into a legitimate HR threat with a .460 SLG and 14 HR in 2026. Festa's 4.85 ERA and command issues set up well for Cleveland's table-setters.",
    tags: ["📈 Breakout", "🔥 Hot"]
  },
  {
    id: 9, name: "José Ramírez", team: "CLE", tier: "A",
    park: "Progressive Field", pitcher: "David Festa", pitcherNote: "4.85 ERA, 1.38 WHIP — struggles to pitch around elite pull hitters.",
    matchupGrade: "A", estOdds: "+320",
    note: "Ramírez owns a .520 SLG and .260 ISO — still one of baseball's most complete power hitters. Festa's 4.85 ERA at Progressive Field is a tasty matchup for Cleveland's best bat.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster"]
  },
  {
    id: 10, name: "Nolan Gorman", team: "STL", tier: "A",
    park: "Busch Stadium", pitcher: "Brandon Pfaadt", pitcherNote: "3.85 ERA, 1.12 WHIP — solid but hittable against high-exit-velocity left-handed pull hitters.",
    matchupGrade: "B+", estOdds: "+410",
    note: "Gorman's left-handed power is elite — .500 SLG, .270 ISO, 21 HR through July. Pfaadt is a solid pitcher but Gorman's pull-side power gives him a favorable platoon edge.",
    tags: ["💣 SP Disaster", "📈 Breakout"]
  },
  {
    id: 11, name: "Alec Burleson", team: "STL", tier: "A",
    park: "Busch Stadium", pitcher: "Brandon Pfaadt", pitcherNote: "3.85 ERA — keeps ball in park most nights but STL's power bats are capable.",
    matchupGrade: "B+", estOdds: "+430",
    note: "Burleson has emerged as St. Louis's best bat with a .480 SLG and 16 HR in 2026. Pfaadt's 3.85 ERA doesn't scare anyone and Burleson's gap-to-gap power plays anywhere.",
    tags: ["📈 Breakout", "🔥 Hot"]
  },
  {
    id: 12, name: "Jordan Walker", team: "STL", tier: "A",
    park: "Busch Stadium", pitcher: "Brandon Pfaadt", pitcherNote: "3.85 ERA, 1.12 WHIP — not a disaster, but Walker's elite raw power can hit anyone.",
    matchupGrade: "B+", estOdds: "+450",
    note: "Walker's .470 SLG and .240 ISO show his elite raw power is starting to translate. Busch Stadium is neutral but Walker's exit velocity numbers are top-5 in the league.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 13, name: "Spencer Torkelson", team: "DET", tier: "A",
    park: "Comerica Park", pitcher: "Cole Ragans", pitcherNote: "4.20 ERA, 1.25 WHIP — serviceable but hittable when his slider command wavers.",
    matchupGrade: "B+", estOdds: "+400",
    note: "Torkelson's breakout 2026 features a .500 SLG and 20 HR — the power finally translating from top prospect to major league slugger. Ragans' 4.20 ERA gives Detroit a legitimate scoring chance.",
    tags: ["📈 Breakout", "🔥 Hot"]
  },
  {
    id: 14, name: "Riley Greene", team: "DET", tier: "A",
    park: "Comerica Park", pitcher: "Cole Ragans", pitcherNote: "4.20 ERA — left-handed starters have historically given Greene an advantage.",
    matchupGrade: "B+", estOdds: "+420",
    note: "Greene hits .290 against lefties with a .490 SLG and 14 HR — one of Detroit's best offensive weapons. Ragans is a tough lefty but Greene's left-on-left numbers are premium.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 15, name: "Willy Adames", team: "ATL", tier: "A",
    park: "Truist Park", pitcher: "Nick Canning", pitcherNote: "6.47 ERA — power hitters have torched his fastball location all season.",
    matchupGrade: "A-", estOdds: "+360",
    note: "Adames signed with Atlanta in 2026 and has posted a .480 SLG and 16 HR — a natural fit for Truist Park. Canning's 6.47 ERA makes every Atlanta hitter a premium play today.",
    tags: ["💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 16, name: "Vladimir Guerrero Jr.", team: "TOR", tier: "A",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA, 2.04 WHIP — Vlad has historically crushed disaster starters.",
    matchupGrade: "A", estOdds: "+330",
    note: "Guerrero Jr. owns a .530 SLG and .280 ISO — still one of baseball's most feared right-handed power bats. Bieber's 7.64 ERA at Rogers Centre is a dome setup Vlad has dreamed of all week.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster"]
  },
  {
    id: 17, name: "George Springer", team: "TOR", tier: "A",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA — Springer feasts on veterans pitching on fumes.",
    matchupGrade: "A-", estOdds: "+380",
    note: "Springer's veteran experience and .470 SLG make him a consistent HR threat in Toronto's home dome. Bieber's 2.04 WHIP means Springer will see plenty of hittable pitches.",
    tags: ["💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 18, name: "Lars Nootbaar", team: "STL", tier: "A",
    park: "Busch Stadium", pitcher: "Brandon Pfaadt", pitcherNote: "3.85 ERA — Nootbaar's left-handed swing can get to him on the pull side.",
    matchupGrade: "B+", estOdds: "+440",
    note: "Nootbaar has blossomed into one of St. Louis's premier offensive threats — .460 SLG and 13 HR. Pfaadt is hittable enough that Nootbaar's LHB pull power gives him a real shot.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 19, name: "Masyn Winn", team: "STL", tier: "A",
    park: "Busch Stadium", pitcher: "Brandon Pfaadt", pitcherNote: "3.85 ERA, 1.12 WHIP — Winn's developing power can reach double digits.",
    matchupGrade: "B+", estOdds: "+480",
    note: "Winn has surprised with 11 HR and a .440 SLG in 2026 — his speed-first profile is adding legitimate pop. Pfaadt's 3.85 ERA at Busch Stadium is a good enough matchup to include.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 20, name: "Daulton Varsho", team: "TOR", tier: "A",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA — Varsho's left-handed pop plays great vs. disaster RHP.",
    matchupGrade: "A-", estOdds: "+390",
    note: "Varsho's .460 SLG and 14 HR from the catcher position make him one of baseball's best value power plays. Bieber's 7.64 ERA in a dome is the setup Varsho needs.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },

  // ─── B-TIER ───────────────────────────────────────────────────────────────
  {
    id: 21, name: "Ernie Clement", team: "CLE", tier: "B",
    park: "Progressive Field", pitcher: "David Festa", pitcherNote: "4.85 ERA, 1.38 WHIP — moderate disaster, hittable to contact-heavy lineups.",
    matchupGrade: "B+", estOdds: "+550",
    note: "Clement provides steady production with a .420 SLG and 10 HR. Festa's 4.85 ERA creates a serviceable matchup for Cleveland's deeper lineup options.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 22, name: "Kyle Manzardo", team: "CLE", tier: "B",
    park: "Progressive Field", pitcher: "David Festa", pitcherNote: "4.85 ERA — young hitters with raw power profiles can get to him.",
    matchupGrade: "B+", estOdds: "+560",
    note: "Manzardo's raw left-handed power and .430 SLG give him legitimate HR upside at Progressive Field. Festa's 4.85 ERA is enough to put this young bat on the radar.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 23, name: "Tyler Glasnow", team: "CLE", tier: "B",
    park: "Progressive Field", pitcher: "David Festa", pitcherNote: "4.85 ERA, 1.38 WHIP — average depth in Cleveland's lineup still has pop.",
    matchupGrade: "B", estOdds: "+580",
    note: "Cleveland's lineup runs deep and even their 7-8 hitters have demonstrated HR capability. Festa's mediocre ERA keeps the ceiling open for mid-lineup threats.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 24, name: "Gavin Lux", team: "STL", tier: "B",
    park: "Busch Stadium", pitcher: "Brandon Pfaadt", pitcherNote: "3.85 ERA — Pfaadt's average command allows LHBs occasional windows.",
    matchupGrade: "B", estOdds: "+600",
    note: "Lux brings solid contact skills and emerging HR pop — .410 SLG and 9 HR at the deadline. Pfaadt's 3.85 ERA is manageable enough for a B-tier inclusion in STL stacks.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 25, name: "Ivan Herrera", team: "STL", tier: "B",
    park: "Busch Stadium", pitcher: "Brandon Pfaadt", pitcherNote: "3.85 ERA, 1.12 WHIP — behind-the-plate pop from Herrera is genuine.",
    matchupGrade: "B", estOdds: "+620",
    note: "Herrera's catcher power and .420 SLG make him a sleeper at Busch Stadium. Pfaadt isn't a disaster but Herrera's 9 HR pace gives him value in deeper parlays.",
    tags: ["💰 Value", "🎰 Longshot"]
  },
  {
    id: 26, name: "Randy Arozarena", team: "TB", tier: "B",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA — Arozarena has punished bad starters throughout his career.",
    matchupGrade: "A-", estOdds: "+430",
    note: "Arozarena's .450 SLG and postseason pedigree translate to regular-season HR upside against bad pitching. Bieber's 7.64 ERA is as bad as it gets — Arozarena belongs in Tampa Bay stacks.",
    tags: ["💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 27, name: "Isaac Paredes", team: "TB", tier: "B",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA, 2.04 WHIP — Paredes's elite plate discipline punishes mistake pitchers.",
    matchupGrade: "A-", estOdds: "+440",
    note: "Paredes walks at an elite rate and when he swings, he does damage — .440 SLG and 13 HR. Bieber's 7.64 ERA means Paredes will see plenty of mistakes to capitalize on.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 28, name: "Harold Ramirez", team: "TB", tier: "B",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA — contact-first hitters still make contact against Bieber.",
    matchupGrade: "B+", estOdds: "+520",
    note: "Ramirez's .430 SLG and solid contact profile make him a serviceable TB option against Bieber's wreckage. A dome environment eliminates weather variance for this steady performer.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 29, name: "Brandon Lowe", team: "TB", tier: "B",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA, high HR/9 — Lowe's left-handed pull power is a great counter.",
    matchupGrade: "A-", estOdds: "+450",
    note: "Lowe's .460 SLG and 12 HR demonstrate his power ceiling when he's healthy. Bieber's 7.64 ERA at Rogers Centre is the type of dome-disaster matchup Lowe was made for.",
    tags: ["💣 SP Disaster", "🔜 Due"]
  },
  {
    id: 30, name: "Kody Clemens", team: "DET", tier: "B",
    park: "Comerica Park", pitcher: "Cole Ragans", pitcherNote: "4.20 ERA — Comerica's suppressive park limits upside but Clemens has pop.",
    matchupGrade: "B", estOdds: "+590",
    note: "Clemens provides decent value with .420 SLG and 10 HR despite Comerica Park's suppressive effects. Ragans' 4.20 ERA is good but not dominant — Clemens can get there.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 31, name: "Matt Vierling", team: "DET", tier: "B",
    park: "Comerica Park", pitcher: "Cole Ragans", pitcherNote: "4.20 ERA, 1.25 WHIP — versatile Detroit bat with developing power.",
    matchupGrade: "B", estOdds: "+580",
    note: "Vierling's athleticism and developing power stroke — .410 SLG, 8 HR — give him upside at Comerica. Ragans' 4.20 ERA is hittable enough that Vierling belongs in DET parlays.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 32, name: "Colt Keith", team: "DET", tier: "B",
    park: "Comerica Park", pitcher: "Cole Ragans", pitcherNote: "4.20 ERA — Keith's all-fields approach can generate HRs to any part of the park.",
    matchupGrade: "B", estOdds: "+600",
    note: "Keith brings solid B-tier value with .430 SLG and 11 HR in 2026. Detroit's lineup is deep enough that even their 6-7 hitters have HR upside against Ragans' 4.20 ERA.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 33, name: "Andrew Knizner", team: "STL", tier: "B",
    park: "Busch Stadium", pitcher: "Brandon Pfaadt", pitcherNote: "3.85 ERA — backup bat production but Pfaadt is hittable enough.",
    matchupGrade: "B-", estOdds: "+640",
    note: "Knizner's .400 SLG and 7 HR demonstrate honest catcher power in a manageable Busch Stadium environment. Pfaadt's 3.85 ERA keeps the floor for STL hitters reasonable.",
    tags: ["💰 Value", "🎰 Longshot"]
  },
  {
    id: 34, name: "Victor Scott II", team: "STL", tier: "B",
    park: "Busch Stadium", pitcher: "Brandon Pfaadt", pitcherNote: "3.85 ERA, 1.12 WHIP — speed-first profiles can still hit for power.",
    matchupGrade: "B-", estOdds: "+650",
    note: "Scott's blazing speed creates extra-base opportunities and his developing power — .390 SLG, 7 HR — is worth B-tier consideration. Pfaadt's ERA keeps this card playable.",
    tags: ["💰 Value", "🎰 Longshot"]
  },
  {
    id: 35, name: "Jonah Bride", team: "TOR", tier: "B",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA — depth piece Toronto can exploit against disaster SP.",
    matchupGrade: "B+", estOdds: "+550",
    note: "Bride provides Toronto's lineup depth with .410 SLG and 9 HR. Against Bieber's 7.64 ERA in the Rogers Centre dome, even bench-level bats have legitimate HR upside.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 36, name: "Danny Jansen", team: "TOR", tier: "B",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA — catcher power in a dome vs. disaster SP is underpriced.",
    matchupGrade: "B+", estOdds: "+560",
    note: "Jansen's .420 SLG and 11 HR from the catcher position make him a legitimate dome-stack value. Bieber's 7.64 ERA in a closed dome environment is the dream setup for Jansen.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 37, name: "Leo Jiménez", team: "TOR", tier: "B",
    park: "Rogers Centre", pitcher: "Shane Bieber", pitcherNote: "7.64 ERA, 2.04 WHIP — young Toronto bats feasting on a declining veteran.",
    matchupGrade: "B+", estOdds: "+580",
    note: "Jiménez has shown exciting offensive upside in 2026 — .430 SLG and 10 HR. Against Bieber's 7.64 ERA at home in a dome, Jiménez's youth and athleticism give him real upside.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 38, name: "Bo Naylor", team: "CLE", tier: "B",
    park: "Progressive Field", pitcher: "David Festa", pitcherNote: "4.85 ERA — Naylor's catcher pop is underrated and playable vs. soft starters.",
    matchupGrade: "B+", estOdds: "+540",
    note: "Bo Naylor's .440 SLG and 12 HR show legitimate power from the catching position. Festa's 4.85 ERA is soft enough that Naylor belongs in CLE stack builds.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 39, name: "David Fry", team: "CLE", tier: "B",
    park: "Progressive Field", pitcher: "David Festa", pitcherNote: "4.85 ERA, 1.38 WHIP — Cleveland's versatile bats hit him across the lineup.",
    matchupGrade: "B", estOdds: "+590",
    note: "Fry's versatility and developing power — .420 SLG and 9 HR — make him a solid B-tier add in CLE stacks. Festa's 4.85 ERA keeps Cleveland's lineup ceiling elevated.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 40, name: "Lane Thomas", team: "CLE", tier: "B",
    park: "Progressive Field", pitcher: "David Festa", pitcherNote: "4.85 ERA — Thomas's contact skills translate to extra-base hit production.",
    matchupGrade: "B", estOdds: "+610",
    note: "Thomas brings solid contact and 11 HR — a .430 SLG that plays well at Progressive Field. Festa's mediocre 4.85 ERA makes this a B-tier dart worth including in deeper builds.",
    tags: ["💰 Value", "🔜 Due"]
  },

  // ─── C-TIER ───────────────────────────────────────────────────────────────
  {
    id: 41, name: "Fernando Tatis Jr.", team: "SD", tier: "C",
    park: "Truist Park", pitcher: "Chris Sale", pitcherNote: "2.45 ERA, 0.95 WHIP — elite ace, one of baseball's best starters in 2026.",
    matchupGrade: "C+", estOdds: "+650",
    note: "Tatis brings elite raw power — .500 SLG and 19 HR — but Sale's 2.45 ERA makes this a true lottery play. Pure Tatis power vs. an elite pitcher is the definition of longshot upside.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 42, name: "Xander Bogaerts", team: "SD", tier: "C",
    park: "Truist Park", pitcher: "Chris Sale", pitcherNote: "2.45 ERA, 0.95 WHIP, elite strikeout rate vs. right-handed hitters.",
    matchupGrade: "C+", estOdds: "+700",
    note: "Bogaerts' .430 SLG and 11 HR show he can still produce, but Sale's 2.45 ERA makes this a C-tier inclusion only. A lottery play for those needing a San Diego bat.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 43, name: "Jake Cronenworth", team: "SD", tier: "C",
    park: "Truist Park", pitcher: "Chris Sale", pitcherNote: "2.45 ERA, 0.95 WHIP — Sale's slider is a nightmare for left-handed batters.",
    matchupGrade: "C", estOdds: "+750",
    note: "Cronenworth's solid .410 SLG and 10 HR translate to modest power, but Sale's elite 2.45 ERA makes him a pure longshot. Include only in max-risk parlays.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 44, name: "Ha-Seong Kim", team: "SD", tier: "C",
    park: "Truist Park", pitcher: "Chris Sale", pitcherNote: "2.45 ERA — elite command pitcher who limits walks and HRs.",
    matchupGrade: "C", estOdds: "+780",
    note: "Kim's .400 SLG and 9 HR are respectable for a middle infielder but Sale's 2.45 ERA makes this a true lottery ticket. High ceiling on a lucky day, low probability overall.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 45, name: "Manny Machado", team: "SD", tier: "C",
    park: "Truist Park", pitcher: "Chris Sale", pitcherNote: "2.45 ERA, 0.95 WHIP — Machado has historically struggled against elite lefties.",
    matchupGrade: "C+", estOdds: "+620",
    note: "Machado's .450 SLG and 14 HR make him a name brand value, but Sale's 2.45 ERA keeps this firmly in C-tier. Veteran power vs. elite lefty is a coin flip at best.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 46, name: "Kyle Isbel", team: "KC", tier: "C",
    park: "Comerica Park", pitcher: "Troy Melton", pitcherNote: "1.80 ERA — elite young starter, one of the best matchups to avoid in 2026.",
    matchupGrade: "C-", estOdds: "+800",
    note: "Isbel has decent speed and .390 SLG but Melton's 1.80 ERA makes any KC bat a pure lottery play today. Only for max-risk parlays needing a Royals inclusion.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 47, name: "Salvador Perez", team: "KC", tier: "C",
    park: "Comerica Park", pitcher: "Troy Melton", pitcherNote: "1.80 ERA, elite strikeout rate — Melton's arsenal is elite.",
    matchupGrade: "C-", estOdds: "+750",
    note: "Perez's legendary HR power — .450 SLG, 15 HR — makes him the best C-tier lottery play. Melton's 1.80 ERA is brutal but Perez's raw power can shock anyone on any given night.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 48, name: "MJ Melendez", team: "KC", tier: "C",
    park: "Comerica Park", pitcher: "Troy Melton", pitcherNote: "1.80 ERA — Melton dominates both sides of the plate with elite movement.",
    matchupGrade: "C-", estOdds: "+820",
    note: "Melendez's emerging power profile — .420 SLG, 12 HR — has promise but Melton's 1.80 ERA is a near-impossible matchup. A true lottery inclusion.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },
  {
    id: 49, name: "Edward Olivares", team: "KC", tier: "C",
    park: "Comerica Park", pitcher: "Troy Melton", pitcherNote: "1.80 ERA, 0.87 WHIP — the complete package, nearly unhittable at peak.",
    matchupGrade: "C-", estOdds: "+850",
    note: "Olivares brings raw athleticism and .400 SLG but against Melton's 1.80 ERA at suppressive Comerica, this is the definition of a lottery ticket. Max-risk parlays only.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 50, name: "Vinnie Pasquantino", team: "KC", tier: "C",
    park: "Comerica Park", pitcher: "Troy Melton", pitcherNote: "1.80 ERA — Melton's dominance makes even Pasquantino's solid power moot.",
    matchupGrade: "C-", estOdds: "+780",
    note: "Pasquantino's .440 SLG and 13 HR show legitimate power but Melton's 1.80 ERA and Comerica's suppressive park combine for the worst HR environment on the slate. Lottery only.",
    tags: ["🎰 Longshot", "🔜 Due"]
  }
];

const parlays = [
  {
    id: "4A",
    legs: 4,
    label: "THE ATLANTA CORE",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+800",
    description: "Atlanta's top four power bats vs. Canning's 6.47 ERA disaster start at Truist Park.",
    playerIds: [1, 2, 6, 7],
    strategy: "Olson, Riley, Harris, and Ozuna form the most lethal four-bat stack on the slate. Canning's 6.47 ERA has been a gift to power hitters all season — Truist Park's #10 HR ranking seals the deal. This is the lowest-risk, highest-conviction parlay of the day."
  },
  {
    id: "4B",
    legs: 4,
    label: "TAMPA BAY DOME STACK",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+850",
    description: "Four Tampa Bay power bats against Bieber's 7.64 ERA in a dome environment.",
    playerIds: [4, 5, 26, 29],
    strategy: "Díaz, Caminero, Arozarena, and Lowe represent the best of Tampa Bay's lineup against Shane Bieber's catastrophic 2026 season. Bieber's 7.64 ERA and 2.04 WHIP mean mistake pitches are coming — the Rogers Centre dome eliminates all weather variance. Four disciplined power bats at great odds."
  },
  {
    id: "5A",
    legs: 5,
    label: "ATL FIVE ALARM",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1400",
    description: "Full Atlanta lineup stack — five bats vs. Canning's disaster start at Truist Park.",
    playerIds: [1, 2, 6, 7, 15],
    strategy: "Adding Adames to the core Atlanta four gives this parlay five premium bats against Canning's 6.47 ERA. Atlanta's lineup runs top-to-bottom with HR threats — Olson's MVP-level ISO, Riley's pull power, Harris's athleticism, Ozuna's consistent thump, and Adames's new-found Atlanta pop. This is a stack built for a blowout."
  },
  {
    id: "5B",
    legs: 5,
    label: "DISASTER DUO STACK",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+1600",
    description: "Two Atlanta S-tiers plus three Tampa Bay S/A-tiers — both disaster starters on one ticket.",
    playerIds: [1, 2, 4, 5, 16],
    strategy: "Olson and Riley from Atlanta plus Díaz, Caminero, and Guerrero Jr. from Tampa Bay targets both disaster starters on the slate. Canning's 6.47 ERA and Bieber's 7.64 ERA are the two worst pitching matchups today — this five-leg parlay hits both. The dual-disaster angle is what separates this from standard stacks."
  },
  {
    id: "5C",
    legs: 5,
    label: "TORONTO DOME BOMB",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+1500",
    description: "Five Toronto and Tampa Bay bats against Bieber in the Rogers Centre dome.",
    playerIds: [4, 5, 16, 17, 20],
    strategy: "Díaz, Caminero, Guerrero Jr., Springer, and Varsho give you the best of both dome-stack lineups against Bieber's 7.64 ERA. Five quality bats in a controlled dome environment with no weather variables — the dome eliminates rain delay risk and keeps conditions perfect. Bieber's 2.04 WHIP means free base runners all night."
  },
  {
    id: "6A",
    legs: 6,
    label: "ATL-TB POWER SURGE",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2200",
    description: "Six bats from Atlanta and Tampa Bay hitting the slate's two disaster starters.",
    playerIds: [1, 2, 4, 5, 6, 16],
    strategy: "Three Atlanta S-tiers (Olson, Riley, Harris) plus three Tampa Bay bats (Díaz, Caminero, Guerrero Jr.) cover both disaster matchups. Canning's 6.47 ERA and Bieber's 7.64 ERA represent two of the worst pitching matchups in recent memory on the same slate. Six legs, two disasters, maximum upside."
  },
  {
    id: "6B",
    legs: 6,
    label: "FULL DOME STACK",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2500",
    description: "Six Rogers Centre bats — the complete dome stack vs. Bieber.",
    playerIds: [4, 5, 16, 17, 20, 29],
    strategy: "Going deep on the Rogers Centre dome game with six bats against Bieber's 7.64 ERA. Díaz, Caminero, Guerrero Jr., Springer, Varsho, and Lowe represent the best available in the Toronto vs. Tampa Bay matchup. A six-leg dome stack in a controlled environment against a disaster pitcher is the most focused approach today."
  },
  {
    id: "7A",
    legs: 7,
    label: "CROSS-SLATE POWER",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+3500",
    description: "Seven-leg parlay pulling elite bats from Atlanta, Tampa Bay, and Cleveland.",
    playerIds: [1, 2, 4, 5, 6, 9, 16],
    strategy: "Olson, Riley, Harris, Díaz, Caminero, Ramírez, and Guerrero Jr. — six S or A-tier bats across three different games. Atlanta hits Canning's 6.47 ERA, Tampa Bay/Toronto attacks Bieber's 7.64 ERA, and Cleveland's Ramírez gets Festa's 4.85 ERA. Three legitimate HR games feeding one seven-leg parlay."
  },
  {
    id: "7B",
    legs: 7,
    label: "STL ATLANTA BRIDGE",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+3800",
    description: "Seven legs spanning Atlanta and St. Louis — two deep lineups with favorable pitching.",
    playerIds: [1, 2, 6, 7, 10, 11, 18],
    strategy: "Five Atlanta bats against Canning's 6.47 ERA plus Gorman and Burleson from St. Louis against Pfaadt's 3.85 ERA. Atlanta is the anchor with the elite disaster matchup; St. Louis provides solid A-tier depth. Gorman's left-handed pull power against Pfaadt is the best cross-slate add for this ticket."
  },
  {
    id: "7C",
    legs: 7,
    label: "DOME DISASTER SEVEN",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+4000",
    description: "Seven legs from the two best matchups — Atlanta's Canning disaster and Tampa Bay's Bieber disaster.",
    playerIds: [1, 2, 4, 5, 17, 26, 29],
    strategy: "Olson and Riley anchor Atlanta while Díaz, Caminero, Springer, Arozarena, and Lowe provide Tampa Bay depth against Bieber's 7.64 ERA. This seven-leg build covers the two worst pitchers on the slate with quality power bats. The dome factor for Tampa Bay eliminates the one variable (weather) that could derail an outdoor stack."
  },
  {
    id: "8A",
    legs: 8,
    label: "EIGHT LEG POWER BLAST",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+5500",
    description: "Eight legs hitting Atlanta, Tampa Bay, and Cleveland's best HR matchups.",
    playerIds: [1, 2, 4, 5, 6, 9, 16, 17],
    strategy: "The 8-leg build escalates the cross-slate approach — Atlanta's Olson, Riley, Harris vs. Canning; Tampa Bay's Díaz and Caminero in the dome vs. Bieber; Cleveland's Ramírez vs. Festa; Toronto's Guerrero Jr. and Springer also vs. Bieber. Eight quality power bats across three SP disasters."
  },
  {
    id: "8B",
    legs: 8,
    label: "FULL ATLANTA-TB BRIDGE",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+6000",
    description: "Eight bats combining the full Atlanta disaster stack with the best Tampa Bay dome plays.",
    playerIds: [1, 2, 4, 5, 6, 7, 16, 29],
    strategy: "Going seven deep on the two disaster starters — four Atlanta bats against Canning's 6.47 ERA (Olson, Riley, Harris, Ozuna) plus four Tampa Bay/Toronto bats against Bieber's 7.64 ERA (Díaz, Caminero, Guerrero Jr., Lowe). This is the maximum conviction ticket targeting both disasters."
  },
  {
    id: "9A",
    legs: 9,
    label: "NINE LEG LOTTERY",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+9000",
    description: "Nine legs spanning all three premium HR games — high ceiling, high variance.",
    playerIds: [1, 2, 4, 5, 6, 9, 10, 16, 17],
    strategy: "Nine legs requires near-perfection but the setup is favorable — both disaster starters on the same slate. Atlanta (Olson, Riley, Harris) vs. Canning, Tampa/Toronto (Díaz, Caminero, Guerrero Jr., Springer) vs. Bieber, and Cleveland's Ramírez plus St. Louis's Gorman as bonus adds. Three separate game stacks in one high-ceiling ticket."
  },
  {
    id: "9B",
    legs: 9,
    label: "MAX DISASTER NINE",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+9500",
    description: "Nine legs of pure disaster-pitcher targeting — both Canning and Bieber on one ticket.",
    playerIds: [1, 2, 4, 5, 6, 16, 17, 26, 29],
    strategy: "This nine-leg build is laser-focused on the two disaster starters. Five bats across the Canning/Bieber matchups — Atlanta's Olson, Riley, Harris, and Tampa Bay/Toronto's Díaz, Caminero, Guerrero Jr., Springer, Arozarena, and Lowe. If both disaster starters get shelled, this ticket cashes in spectacular fashion."
  },
  {
    id: "10A",
    legs: 10,
    label: "MAX RISK LOTTERY",
    risk: "Max Risk",
    riskColor: "#9c27b0",
    estPayout: "+15000",
    description: "Ten-leg max-risk lottery spanning all five games including C-tier longshots.",
    playerIds: [1, 2, 4, 5, 6, 9, 16, 41, 43, 46],
    strategy: "The 10-leg lottery ticket requires every leg to connect — including longshots Tatis (#41 C-tier) and Cronenworth (#43 C-tier) against Sale's 2.45 ERA, plus Isbel (#46 C-tier) against Melton's 1.80 ERA. The six premium S/A legs (Olson, Riley, Díaz, Caminero, Harris, Ramírez, Guerrero Jr.) anchor the ticket while the C-tier legs provide the massive payout multiplier. Pure lottery — $15,000+ return on a hit."
  }
];
