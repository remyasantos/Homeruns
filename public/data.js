const TEAM_TO_GAME = {
  "TB": "TB@LAD", "LAD": "TB@LAD",
  "COL": "COL@CHC", "CHC": "COL@CHC",
  "NYM": "NYM@CIN", "CIN": "NYM@CIN",
  "MIA": "MIA@PHI", "PHI": "MIA@PHI",
  "KC": "KC@WSH", "WSH": "KC@WSH",
  "SD": "SD@STL", "STL": "SD@STL",
  "PIT": "PIT@ATH", "ATH": "PIT@ATH",
  "DET": "DET@HOU", "HOU": "DET@HOU",
  "LAA": "LAA@ARI", "ARI": "LAA@ARI",
  "CLE": "CLE@MIL", "MIL": "CLE@MIL"
};

const SLATE_DATE = "JUNE 15, 2026";
const SLATE_LABEL = "MONDAY MLB SLATE";

const CONTEXT_CARDS = [
  {
    icon: "💥",
    label: "Michael Lorenzen — SP Disaster Stack",
    note: "7.54 ERA · 2-8 Record · Wrigley Wind 9 MPH Out",
    sub: "Colorado's Lorenzen is the worst starter on today's slate — 7.54 ERA, 2-8 record, 5.82 FIP. He faces a Cubs lineup with Happ (.205 ISO), Suzuki (.188 ISO), and Bregman (.165 ISO) at Wrigley with wind blowing out at 9 MPH. Three-man stack with built-in redundancy."
  },
  {
    icon: "💨",
    label: "Busch Stadium — 15 MPH Tailwind",
    note: "SD@STL · Wind Out to Left-Center · Dustin May 4.21 ERA",
    sub: "Busch Stadium has 15.2 MPH wind blowing out toward left-center. Dustin May's homer-prone 4.21 ERA and 1.35 HR/9 is the SP context on top of the wind — Tatis Jr. (.200 ISO) and Machado (.175 ISO) are the visiting targets, while Arenado faces Giolito's 4.35 ERA in the same conditions."
  },
  {
    icon: "🏟️",
    label: "Daikin Park — HOU Power Trio",
    note: "Yordan + Tucker + Altuve vs. Reese Olson 4.20 ERA",
    sub: "Houston's power core — Yordan Alvarez (.230 ISO, 20 HR), Kyle Tucker (.190 ISO, 18 HR), and Jose Altuve (.160 ISO, 12 HR) — all face DET's Reese Olson (4.20 ERA, 1.31 HR/9) inside Daikin Park's closed dome. Cleanest dome stack of the day with controlled conditions."
  },
  {
    icon: "💰",
    label: "Oneil Cruz — Elite Power Mispriced",
    note: "99th Pct Exit Velocity · Las Vegas 84°F · Ginn xFIP 4.38",
    sub: "Oneil Cruz posts 95.2 MPH average exit velocity (99th percentile) but opens at +450 today. He visits Las Vegas Ballpark in 84°F afternoon heat against J.T. Ginn whose 3.15 ERA is propped by .282 BABIP — xFIP of 4.38 reveals the true profile. Best underpriced A-tier play on the board."
  }
];

const PARK_FACTORS = {
  "Dodger Stadium":           { rank: 1,  label: "🔥 #1 HR Context Today",       color: "#ff6b35" },
  "Great American Ball Park": { rank: 2,  label: "🔥 #2 HR Park",                color: "#ff6b35" },
  "Wrigley Field":            { rank: 3,  label: "💨 Wind + SP Disaster Stack",  color: "#90e0ef" },
  "Citizens Bank Park":       { rank: 4,  label: "🔥 SP Disaster Context",       color: "#ffb347" },
  "Busch Stadium":            { rank: 5,  label: "💨 Wind Boost 15 MPH Out",     color: "#90e0ef" },
  "Las Vegas Ballpark":       { rank: 6,  label: "☀️ 84°F Hot Outdoor Park",     color: "#ffb347" },
  "Daikin Park":              { rank: 7,  label: "🏟️ Dome/Roof Closed",          color: "#b0bec5" },
  "American Family Field":    { rank: 8,  label: "🏟️ Dome/Roof Closed",          color: "#b0bec5" },
  "Chase Field":              { rank: 9,  label: "🏟️ Dome/Roof Closed",          color: "#b0bec5" },
  "Nationals Park":           { rank: 10, label: "⚾ Pitcher-Friendly Park",      color: "#78909c" }
};

const players = [
  {
    id: 1, name: "Kyle Schwarber", team: "PHI", tier: "S",
    park: "Citizens Bank Park", pitcher: "Ryan Gusto", matchupGrade: "A+",
    estOdds: "+280", hr: 22, ops: 0.885, iso: 0.225, avg: 0.235, compositeScore: 93,
    pitcherNote: "5.70 ERA with 1.52 HR/9 and 1.48 WHIP — Gusto gets destroyed by left-handed power.",
    note: ".885 OPS and 22 HR pace, leading NL in HR rate against right-handers this season. Ryan Gusto's 5.70 ERA and 1.52 HR/9 at hitter-friendly Citizens Bank Park makes this a prime setup for another bomb.",
    tags: ["💣 SP Disaster", "👑 MVP/Elite", "🔥 Hot", "💰 Value"]
  },
  {
    id: 2, name: "Bryce Harper", team: "PHI", tier: "S",
    park: "Citizens Bank Park", pitcher: "Ryan Gusto", matchupGrade: "A+",
    estOdds: "+290", hr: 18, ops: 0.900, iso: 0.200, avg: 0.290, compositeScore: 90,
    pitcherNote: "5.70 ERA, 1.52 HR/9, 1.48 WHIP — disaster outing waiting to happen at Citizens Bank Park.",
    note: ".900 OPS with 18 HR already, elite contact rate and raw power still unmatched in the NL. Gusto's 5.70 ERA and tendency to leave elevated fastballs against premium contact hitters seals this matchup.",
    tags: ["💣 SP Disaster", "👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 3, name: "Ian Happ", team: "CHC", tier: "S",
    park: "Wrigley Field", pitcher: "Michael Lorenzen", matchupGrade: "A+",
    estOdds: "+310", hr: 18, ops: 0.790, iso: 0.205, avg: 0.250, compositeScore: 90,
    pitcherNote: "7.54 ERA, 2-8 record, FIP 5.82 — worst starter on today's full slate by a wide margin.",
    note: ".790 OPS with .205 ISO against right-handers, plus elite opposite-field power to the friendly Wrigley bleachers. Michael Lorenzen is posting a 7.54 ERA in his worst season, and 9 MPH wind blowing out seals the disaster stack.",
    tags: ["💣 SP Disaster", "💨 Wind Boost", "🔥 Hot"]
  },
  {
    id: 4, name: "Shohei Ohtani", team: "LAD", tier: "S",
    park: "Dodger Stadium", pitcher: "Nick Martínez", matchupGrade: "A-",
    estOdds: "+300", hr: 21, ops: 0.955, iso: 0.230, avg: 0.290, compositeScore: 87,
    pitcherNote: "2.29 ERA, 1.19 WHIP — genuine ace; Ohtani's elite power profile still gives this play real upside.",
    note: ".955 OPS and 21 HR through 65 games, one of three players on pace for 50+ HR again. Dodger Stadium's elite HR environment and Ohtani's historic power profile keep him S-tier even against a good Martínez.",
    tags: ["👑 MVP/Elite", "🔥 Hot", "💰 Value"]
  },
  {
    id: 5, name: "Yandy Diaz", team: "TB", tier: "S",
    park: "Dodger Stadium", pitcher: "Eric Lauer", matchupGrade: "A",
    estOdds: "+330", hr: 12, ops: 0.840, iso: 0.160, avg: 0.280, compositeScore: 86,
    pitcherNote: "5.74 ERA with 1.38 WHIP and 1.45 HR/9 — homer-prone lefty pitching in the worst possible ballpark.",
    note: ".840 OPS and disciplined .280 average against LHP Eric Lauer at the premier HR park in baseball. Lauer's 5.74 ERA and 1.38 WHIP signal a prime explosion game at Dodger Stadium.",
    tags: ["💣 SP Disaster", "💰 Value", "🔥 Hot"]
  },
  {
    id: 6, name: "Brandon Lowe", team: "TB", tier: "S",
    park: "Dodger Stadium", pitcher: "Eric Lauer", matchupGrade: "A",
    estOdds: "+340", hr: 18, ops: 0.815, iso: 0.192, avg: 0.245, compositeScore: 85,
    pitcherNote: "5.74 ERA, 1.38 WHIP, 1.45 HR/9 — fly-ball specialist getting exposed at Dodger Stadium.",
    note: ".815 OPS with .192 ISO, known power-over-average profile that punishes mistake pitches. Eric Lauer's 5.74 ERA at Dodger Stadium creates the ideal conditions for Lowe's fly-ball stroke.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 7, name: "Seiya Suzuki", team: "CHC", tier: "A",
    park: "Wrigley Field", pitcher: "Michael Lorenzen", matchupGrade: "A",
    estOdds: "+360", hr: 16, ops: 0.830, iso: 0.188, avg: 0.285, compositeScore: 82,
    pitcherNote: "7.54 ERA, FIP 5.82 — Lorenzen historically struggles vs. contact hitters with exit velocity.",
    note: ".830 OPS and .188 ISO in 2026, 16 HR making strong contact at Wrigley's power alleys. Lorenzen's 7.54 ERA and the 9 MPH outbound wind create elite HR conditions for Chicago's lineup.",
    tags: ["💣 SP Disaster", "💨 Wind Boost"]
  },
  {
    id: 8, name: "Alex Bregman", team: "CHC", tier: "A",
    park: "Wrigley Field", pitcher: "Michael Lorenzen", matchupGrade: "A",
    estOdds: "+380", hr: 15, ops: 0.808, iso: 0.165, avg: 0.270, compositeScore: 80,
    pitcherNote: "7.54 ERA and 1.48 WHIP — homer rate against left-handed power is alarming in any park.",
    note: ".808 OPS and disciplined approach generating 15 HR against right-handers, excellent gap power to left-center. Lorenzen at 7.54 ERA plus Wrigley wind is a certified SP disaster setup.",
    tags: ["💣 SP Disaster", "💨 Wind Boost"]
  },
  {
    id: 9, name: "Trea Turner", team: "PHI", tier: "A",
    park: "Citizens Bank Park", pitcher: "Ryan Gusto", matchupGrade: "A-",
    estOdds: "+370", hr: 15, ops: 0.820, iso: 0.170, avg: 0.285, compositeScore: 80,
    pitcherNote: "5.70 ERA, 1.52 HR/9, 1.48 WHIP — disaster starter in a hitter-friendly environment.",
    note: ".820 OPS with 15 HR, elite sprint speed adding infield production on top of a rising HR rate. Gusto's 5.70 ERA and high HR/9 at Citizens Bank Park makes this a premium speed-and-power opportunity.",
    tags: ["💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 10, name: "Yordan Alvarez", team: "HOU", tier: "A",
    park: "Daikin Park", pitcher: "Reese Olson", matchupGrade: "A-",
    estOdds: "+350", hr: 20, ops: 0.945, iso: 0.230, avg: 0.295, compositeScore: 79,
    pitcherNote: "4.20 ERA with 1.31 HR/9 and fly-ball tendencies — exposed vs. elite left-handed power.",
    note: ".945 OPS and 20 HR already, posting elite .230 ISO against right-handed pitching across all park contexts. Reese Olson's 4.20 ERA and 1.31 HR/9 makes the Yordan spot a top dome-stack anchor.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 11, name: "Noelvi Marte", team: "CIN", tier: "A",
    park: "Great American Ball Park", pitcher: "Tobias Myers", matchupGrade: "B+",
    estOdds: "+390", hr: 15, ops: 0.800, iso: 0.185, avg: 0.275, compositeScore: 78,
    pitcherNote: "5.40 ERA over 15 IP in 3 starts — reliever-turned-starter with walk rate of 4.8 BB/9.",
    note: ".800 OPS with .185 ISO at Great American Ball Park, one of the three best HR parks in baseball. Tobias Myers is making just his 3rd start in a rotation role, and his 5.40 ERA over 15 IP signals major command issues.",
    tags: ["📈 Breakout", "💣 SP Disaster"]
  },
  {
    id: 12, name: "Freddie Freeman", team: "LAD", tier: "A",
    park: "Dodger Stadium", pitcher: "Nick Martínez", matchupGrade: "B+",
    estOdds: "+380", hr: 18, ops: 0.890, iso: 0.195, avg: 0.305, compositeScore: 77,
    pitcherNote: "2.29 ERA, 1.19 WHIP — elite command limits Freeman's power upside despite Dodger Stadium.",
    note: ".890 OPS and 18 HR, posting elite line-drive rate with power to all fields at Dodger Stadium. Martínez's 2.29 ERA dampens the ceiling, but Freeman's contact ability keeps this an A-tier play.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 13, name: "Oneil Cruz", team: "PIT", tier: "A",
    park: "Las Vegas Ballpark", pitcher: "J.T. Ginn", matchupGrade: "B+",
    estOdds: "+450", hr: 20, ops: 0.818, iso: 0.200, avg: 0.250, compositeScore: 76,
    pitcherNote: "xFIP of 4.38 behind a .282 BABIP-backed 3.15 ERA — regression target at a hot outdoor park.",
    note: ".818 OPS and 20 HR already, 99th percentile exit velocity at 95.2 MPH making him the most dangerous bat PIT has. J.T. Ginn's xFIP of 4.38 and Las Vegas Ballpark's desert conditions give Cruz a real longball opportunity.",
    tags: ["💰 Value", "📈 Breakout"]
  },
  {
    id: 14, name: "Junior Caminero", team: "TB", tier: "A",
    park: "Dodger Stadium", pitcher: "Eric Lauer", matchupGrade: "B+",
    estOdds: "+420", hr: 15, ops: 0.790, iso: 0.175, avg: 0.265, compositeScore: 76,
    pitcherNote: "5.74 ERA, 1.38 WHIP — Lauer struggles vs. right-handed power at this stage of the season.",
    note: ".790 OPS and .175 ISO against left-handed pitching, 15 HR showing consistent raw power for the 22-year-old. Eric Lauer's 5.74 ERA at Dodger Stadium gives Caminero prime HR conditions vs. a homer-prone southpaw.",
    tags: ["💣 SP Disaster", "📈 Breakout"]
  },
  {
    id: 15, name: "Nick Castellanos", team: "PHI", tier: "A",
    park: "Citizens Bank Park", pitcher: "Ryan Gusto", matchupGrade: "B+",
    estOdds: "+410", hr: 14, ops: 0.808, iso: 0.165, avg: 0.275, compositeScore: 75,
    pitcherNote: "5.70 ERA, high HR/9 — leaves balls elevated in the zone vs. right-handed contact hitters.",
    note: ".808 OPS with 14 HR against right-handers at Citizens Bank Park, steady production in one of the most homer-friendly NL environments. Gusto's 5.70 ERA makes every PHI at-bat a potential HR play today.",
    tags: ["💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 16, name: "Bobby Witt Jr.", team: "KC", tier: "A",
    park: "Nationals Park", pitcher: "Jake Irvin", matchupGrade: "B+",
    estOdds: "+360", hr: 22, ops: 0.860, iso: 0.195, avg: 0.290, compositeScore: 75,
    pitcherNote: "4.50 ERA with 1.38 WHIP and 1.22 HR/9 — fly-ball tendencies against middle-of-the-order bats.",
    note: ".860 OPS and 22 HR pace leading all AL shortstops, posting .195 ISO against all pitcher types. Jake Irvin's 4.50 ERA and moderate HR/9 at Nationals Park provides a solid A-tier opportunity.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 17, name: "Teoscar Hernandez", team: "LAD", tier: "A",
    park: "Dodger Stadium", pitcher: "Nick Martínez", matchupGrade: "B",
    estOdds: "+400", hr: 17, ops: 0.800, iso: 0.180, avg: 0.255, compositeScore: 74,
    pitcherNote: "2.29 ERA, 1.19 WHIP — elite pitcher suppressing the matchup value but raw power keeps it alive.",
    note: ".800 OPS and 17 HR, elite pull-side power showing up in every park context this season. Even Martínez at 2.29 ERA can't fully contain Hernandez's plus exit velocity of 93.1 MPH.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 18, name: "Pete Alonso", team: "NYM", tier: "A",
    park: "Great American Ball Park", pitcher: "Chase Burns", matchupGrade: "B",
    estOdds: "+390", hr: 19, ops: 0.825, iso: 0.195, avg: 0.245, compositeScore: 74,
    pitcherNote: "2.95 xERA with 29.7% K-rate — Chase Burns has electric stuff but GABP mitigates his effectiveness.",
    note: ".825 OPS and 19 HR, elite power profile at Great American Ball Park — one of the three most homer-friendly venues in baseball. Chase Burns' 2.95 xERA limits ceiling, but GABP's short fences make Alonso dangerous regardless.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },
  {
    id: 19, name: "José Ramírez", team: "CLE", tier: "A",
    park: "American Family Field", pitcher: "Jacob Misiorowski", matchupGrade: "B",
    estOdds: "+380", hr: 18, ops: 0.850, iso: 0.188, avg: 0.280, compositeScore: 73,
    pitcherNote: "4.10 ERA, 1.35 WHIP — fly-ball tendencies exposed by Cleveland's veteran power hitters.",
    note: ".850 OPS and 18 HR, posting .188 ISO against right-handed pitching with elite fly-ball distance data. Jacob Misiorowski's 4.10 ERA and 1.35 WHIP at American Family Field creates a strong A-tier value.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 20, name: "Mookie Betts", team: "LAD", tier: "A",
    park: "Dodger Stadium", pitcher: "Nick Martínez", matchupGrade: "B",
    estOdds: "+390", hr: 16, ops: 0.870, iso: 0.185, avg: 0.285, compositeScore: 72,
    pitcherNote: "2.29 ERA, 1.19 WHIP — Martínez's command and movement limit Betts's raw HR probability today.",
    note: ".870 OPS and 16 HR with elite plate discipline and contact rate, producing consistent power across all park contexts. Dodger Stadium's HR-friendly dimensions keep Betts in play despite Martínez's elite 2.29 ERA.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 21, name: "Fernando Tatis Jr.", team: "SD", tier: "B",
    park: "Busch Stadium", pitcher: "Dustin May", matchupGrade: "B",
    estOdds: "+440", hr: 20, ops: 0.840, iso: 0.200, avg: 0.265, compositeScore: 67,
    pitcherNote: "4.21 ERA, 1.35 HR/9 — homer-prone starter pitching in wind conditions favoring visiting right-handed power.",
    note: ".840 OPS and 20 HR with .200 ISO, showing full return to form after injury-shortened 2025. Dustin May's 4.21 ERA at Busch Stadium with 15 MPH wind blowing out creates an underrated B-tier opportunity.",
    tags: ["💨 Wind Boost", "🔥 Hot"]
  },
  {
    id: 22, name: "Manny Machado", team: "SD", tier: "B",
    park: "Busch Stadium", pitcher: "Dustin May", matchupGrade: "B-",
    estOdds: "+480", hr: 15, ops: 0.810, iso: 0.175, avg: 0.275, compositeScore: 65,
    pitcherNote: "4.21 ERA with HR/9 of 1.35 — struggles with elevated offspeed vs. right-handed pull power.",
    note: ".810 OPS and 15 HR with disciplined approach generating consistent fly-ball contact. Dustin May's 4.21 ERA and the Busch Stadium wind boost make Machado's power a real consideration today.",
    tags: ["💨 Wind Boost", "💰 Value"]
  },
  {
    id: 23, name: "Nolan Arenado", team: "STL", tier: "B",
    park: "Busch Stadium", pitcher: "Lucas Giolito", matchupGrade: "B-",
    estOdds: "+490", hr: 14, ops: 0.800, iso: 0.165, avg: 0.270, compositeScore: 64,
    pitcherNote: "4.35 ERA, 1.42 WHIP, velocity down — mid-rotation arm struggling against disciplined veteran hitters.",
    note: ".800 OPS and 14 HR, elite third-base power with strong pull tendencies toward Busch's left-field porch. Lucas Giolito's 4.35 ERA with diminished velocity creates favorable conditions for Arenado's trademark pull stroke.",
    tags: ["💨 Wind Boost", "🔜 Due"]
  },
  {
    id: 24, name: "Kyle Tucker", team: "HOU", tier: "B",
    park: "Daikin Park", pitcher: "Reese Olson", matchupGrade: "B",
    estOdds: "+460", hr: 18, ops: 0.840, iso: 0.190, avg: 0.280, compositeScore: 63,
    pitcherNote: "4.20 ERA with 1.31 HR/9 — fly-ball pitcher exposed by Houston's two-through-five hitters.",
    note: ".840 OPS and 18 HR, all-around offensive producer with elite plate discipline generating fly-ball power. Reese Olson's 4.20 ERA keeps Tucker firmly in play despite the Daikin Park dome context.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 25, name: "Ketel Marte", team: "ARI", tier: "B",
    park: "Chase Field", pitcher: "Reid Detmers", matchupGrade: "B-",
    estOdds: "+500", hr: 16, ops: 0.820, iso: 0.175, avg: 0.280, compositeScore: 62,
    pitcherNote: "4.75 ERA overall, 1.76 ERA last 4 starts — due for regression but today's matchup still favors ARI.",
    note: ".820 OPS and 16 HR with consistent contact and strong ISO at Chase Field across multiple seasons. Reid Detmers's overall 4.75 ERA offers opportunity despite his recent 4-start hot streak.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 26, name: "Josh Naylor", team: "CLE", tier: "B",
    park: "American Family Field", pitcher: "Jacob Misiorowski", matchupGrade: "B-",
    estOdds: "+510", hr: 16, ops: 0.800, iso: 0.180, avg: 0.265, compositeScore: 62,
    pitcherNote: "4.10 ERA, 1.35 WHIP — walks too many batters (4.2 BB/9) and hittable in dome context.",
    note: ".800 OPS and 16 HR with .180 ISO showing a growing power profile for Cleveland's lineup anchor. Misiorowski's 4.10 ERA and 1.35 WHIP at American Family Field keeps Naylor in solid B territory.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 27, name: "Lawrence Butler", team: "ATH", tier: "B",
    park: "Las Vegas Ballpark", pitcher: "Jared Jones", matchupGrade: "B-",
    estOdds: "+490", hr: 18, ops: 0.800, iso: 0.185, avg: 0.255, compositeScore: 61,
    pitcherNote: "4.82 ERA, 1.44 WHIP, 1.38 HR/9 — volatile arm struggling vs. power lineups in outdoor parks.",
    note: ".800 OPS and 18 HR showing impressive power development in Las Vegas's hot outdoor environment. Jared Jones's 4.82 ERA and 1.38 HR/9 makes Butler an underpriced value at Las Vegas Ballpark.",
    tags: ["💰 Value", "📈 Breakout"]
  },
  {
    id: 28, name: "Vinnie Pasquantino", team: "KC", tier: "B",
    park: "Nationals Park", pitcher: "Jake Irvin", matchupGrade: "C+",
    estOdds: "+520", hr: 14, ops: 0.810, iso: 0.165, avg: 0.285, compositeScore: 60,
    pitcherNote: "4.50 ERA, 1.38 WHIP — hittable zone approach exploited by disciplined first basemen.",
    note: ".810 OPS and 14 HR, elite bat-to-ball skill generating consistent fly-ball contact at any venue. Jake Irvin's 4.50 ERA and moderate WHIP gives Pasquantino a reasonable B-tier opportunity in Washington.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 29, name: "CJ Abrams", team: "WSH", tier: "B",
    park: "Nationals Park", pitcher: "Cole Ragans", matchupGrade: "C+",
    estOdds: "+530", hr: 12, ops: 0.780, iso: 0.160, avg: 0.265, compositeScore: 59,
    pitcherNote: "2.60 ERA, 1.08 WHIP — elite K-rate limiting Washington's offensive upside significantly.",
    note: ".780 OPS and 12 HR showing continued development in his third full season, with improving power numbers. Jake Irvin's 4.50 ERA across Washington's home schedule provides solid home-field HR context.",
    tags: ["💰 Value", "📈 Breakout"]
  },
  {
    id: 30, name: "Brent Rooker", team: "ATH", tier: "B",
    park: "Las Vegas Ballpark", pitcher: "Jared Jones", matchupGrade: "B-",
    estOdds: "+500", hr: 20, ops: 0.820, iso: 0.200, avg: 0.250, compositeScore: 58,
    pitcherNote: "4.82 ERA, 1.44 WHIP — homer-prone young arm in hot-weather outdoor setting.",
    note: ".820 OPS and 20 HR with true-power profile — 94th percentile exit velocity producing consistent fly-ball damage. Jones's 4.82 ERA at Las Vegas Ballpark heat creates real B-tier upside for Rooker's plus raw power.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 31, name: "Christian Walker", team: "ARI", tier: "B",
    park: "Chase Field", pitcher: "Reid Detmers", matchupGrade: "C+",
    estOdds: "+520", hr: 15, ops: 0.800, iso: 0.180, avg: 0.255, compositeScore: 58,
    pitcherNote: "4.75 ERA overall — command inconsistencies exposed by right-handed power hitters at Chase Field.",
    note: ".800 OPS and 15 HR with elite pull-side power profile at Chase Field across his career. Detmers's 4.75 ERA overall keeps Walker in play despite the dome context limiting wind-related boosts.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 32, name: "Jake Cronenworth", team: "SD", tier: "B",
    park: "Busch Stadium", pitcher: "Dustin May", matchupGrade: "C+",
    estOdds: "+540", hr: 12, ops: 0.770, iso: 0.155, avg: 0.260, compositeScore: 57,
    pitcherNote: "4.21 ERA, 1.35 HR/9 — leaves pitches over the plate vs. veteran hitters in count-based situations.",
    note: ".770 OPS and 12 HR, consistent contact hitter showing modest but steady power gains. Dustin May's 4.21 ERA and Busch Stadium's wind boost create a favorable context for Cronenworth's left-handed stroke.",
    tags: ["💨 Wind Boost", "💰 Value"]
  },
  {
    id: 33, name: "Will Smith", team: "LAD", tier: "B",
    park: "Dodger Stadium", pitcher: "Nick Martínez", matchupGrade: "C+",
    estOdds: "+530", hr: 14, ops: 0.800, iso: 0.175, avg: 0.270, compositeScore: 57,
    pitcherNote: "2.29 ERA, 1.19 WHIP — tough matchup for the full LA lineup today.",
    note: ".800 OPS and 14 HR with elite catcher power, plus Dodger Stadium's favorable HR dimensions adding lift. Martínez's 2.29 ERA depresses ceiling, but Smith's hot bat keeps him a live B-tier catcher play.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 34, name: "José Altuve", team: "HOU", tier: "B",
    park: "Daikin Park", pitcher: "Reese Olson", matchupGrade: "C+",
    estOdds: "+520", hr: 12, ops: 0.810, iso: 0.160, avg: 0.280, compositeScore: 56,
    pitcherNote: "4.20 ERA with 1.31 HR/9 — hittable in the zone vs. veteran contact hitters.",
    note: ".810 OPS and 12 HR showing veteran production inside the Daikin dome, strong contact quality against right-handed starters. Reese Olson at 4.20 ERA makes Altuve a solid B-tier dome-stack option for Houston's lineup.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 35, name: "Corbin Carroll", team: "ARI", tier: "B",
    park: "Chase Field", pitcher: "Reid Detmers", matchupGrade: "C+",
    estOdds: "+550", hr: 10, ops: 0.760, iso: 0.155, avg: 0.255, compositeScore: 55,
    pitcherNote: "4.75 ERA overall — 1.22 HR/9 providing moderate longball risk for Arizona's lineup.",
    note: ".760 OPS and 10 HR, speed-first profile with emerging power showing more fly-ball intent in 2026. Detmers's 4.75 ERA overall gives Carroll a reasonable B window at Chase Field's dome context.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 36, name: "Riley Greene", team: "DET", tier: "B",
    park: "Daikin Park", pitcher: "Troy Melton", matchupGrade: "B-",
    estOdds: "+510", hr: 12, ops: 0.790, iso: 0.168, avg: 0.270, compositeScore: 55,
    pitcherNote: "2.81 ERA but FIP of 4.72 and xERA of 4.80 — BABIP luck masking serious regression risk.",
    note: ".790 OPS and 12 HR with strong pull tendencies driving fly-ball distance to left-center at Daikin Park. Troy Melton's .197 BABIP-propped 2.81 ERA masks his true 4.72 FIP — Detroit's power bats could expose the regression.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 37, name: "Tommy Edman", team: "LAD", tier: "B",
    park: "Dodger Stadium", pitcher: "Nick Martínez", matchupGrade: "C+",
    estOdds: "+570", hr: 8, ops: 0.730, iso: 0.140, avg: 0.255, compositeScore: 55,
    pitcherNote: "2.29 ERA, 1.19 WHIP — elite arm suppressing the full LA lineup today.",
    note: ".730 OPS and 8 HR, contact-first profile with sneaky pop to the pull side at Dodger Stadium. Martínez's tough 2.29 ERA limits upside but Dodger Stadium's dimensions keep Edman as a deep roster option.",
    tags: ["💰 Value", "🔜 Due"]
  },
  {
    id: 38, name: "Jackson Chourio", team: "MIL", tier: "B",
    park: "American Family Field", pitcher: "Tanner Bibee", matchupGrade: "C+",
    estOdds: "+530", hr: 14, ops: 0.780, iso: 0.170, avg: 0.260, compositeScore: 57,
    pitcherNote: "3.50 ERA, 1.18 WHIP — solid mid-rotation arm containing Milwaukee's lineup.",
    note: ".780 OPS and 14 HR, elite athleticism translating to growing fly-ball power inside American Family Field's dome. Bibee's 3.50 ERA limits the matchup ceiling, but Chourio's raw tools maintain B-tier value.",
    tags: ["📈 Breakout", "🔜 Due"]
  },
  {
    id: 39, name: "Paul Goldschmidt", team: "STL", tier: "B",
    park: "Busch Stadium", pitcher: "Lucas Giolito", matchupGrade: "C+",
    estOdds: "+540", hr: 12, ops: 0.790, iso: 0.160, avg: 0.260, compositeScore: 56,
    pitcherNote: "4.35 ERA, 1.42 WHIP, velocity down — Giolito's decreased spin rate creating opportunities for veteran hitters.",
    note: ".790 OPS and 12 HR from the veteran, still generating elite exit velocity off first-pitch strikes. Giolito's 4.35 ERA and declining velocity create a matchup window for Goldschmidt's trademark pull power.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 40, name: "Christian Yelich", team: "MIL", tier: "B",
    park: "American Family Field", pitcher: "Tanner Bibee", matchupGrade: "C+",
    estOdds: "+520", hr: 14, ops: 0.800, iso: 0.175, avg: 0.270, compositeScore: 55,
    pitcherNote: "3.50 ERA, 1.18 WHIP — contains left-handed power with solid changeup and fastball command.",
    note: ".800 OPS and 14 HR showing the vintage pull approach at American Family Field's friendly dome context. Bibee's 3.50 ERA dampens upside but Yelich's elite launch angle data keeps him a B-tier dome option.",
    tags: ["🔜 Due", "🔥 Hot"]
  },
  {
    id: 41, name: "Bryan Reynolds", team: "PIT", tier: "C",
    park: "Las Vegas Ballpark", pitcher: "J.T. Ginn", matchupGrade: "C",
    estOdds: "+650", hr: 14, ops: 0.790, iso: 0.175, avg: 0.265, compositeScore: 48,
    pitcherNote: "3.15 ERA with xFIP of 4.38 — regression candidate, but still too good for reliable HR production.",
    note: ".790 OPS and 14 HR at a solid contact rate, steady all-around hitter with modest power upside at Las Vegas Ballpark. J.T. Ginn's low 3.15 ERA limits the matchup quality, making Reynolds a longshot C-tier play.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 42, name: "Spencer Torkelson", team: "DET", tier: "C",
    park: "Daikin Park", pitcher: "Troy Melton", matchupGrade: "C",
    estOdds: "+700", hr: 12, ops: 0.750, iso: 0.165, avg: 0.240, compositeScore: 47,
    pitcherNote: "2.81 ERA, FIP 4.72 — regression candidate giving Torkelson's power a slim window today.",
    note: ".750 OPS and 12 HR, raw right-handed power profile still developing inside Daikin Park's closed dome. Troy Melton's luck-driven 2.81 ERA (xERA 4.80) is the one bright spot keeping Torkelson in lottery range.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },
  {
    id: 43, name: "Ke'Bryan Hayes", team: "PIT", tier: "C",
    park: "Las Vegas Ballpark", pitcher: "J.T. Ginn", matchupGrade: "C",
    estOdds: "+750", hr: 8, ops: 0.740, iso: 0.140, avg: 0.260, compositeScore: 45,
    pitcherNote: "3.15 ERA with xFIP of 4.38 — decent arm that limits Ke'Bryan's home run ceiling significantly.",
    note: ".740 OPS and 8 HR, elite defense-first third baseman with below-average power for his position. J.T. Ginn's manageable xFIP of 4.38 offers a minor angle but Las Vegas conditions alone don't elevate Hayes.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 44, name: "Salvador Perez", team: "KC", tier: "C",
    park: "Nationals Park", pitcher: "Jake Irvin", matchupGrade: "C-",
    estOdds: "+720", hr: 14, ops: 0.770, iso: 0.160, avg: 0.265, compositeScore: 45,
    pitcherNote: "4.50 ERA, 1.38 WHIP — Irvin's fly-ball profile is the only angle keeping Perez in C-tier range.",
    note: ".770 OPS and 14 HR, reliable power producer who has declined from peak seasons but still posts regular HR totals. Jake Irvin's 4.50 ERA at Nationals Park offers a slim matchup window for Perez's right-handed power.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 45, name: "Lane Thomas", team: "WSH", tier: "C",
    park: "Nationals Park", pitcher: "Cole Ragans", matchupGrade: "C-",
    estOdds: "+800", hr: 10, ops: 0.740, iso: 0.155, avg: 0.250, compositeScore: 44,
    pitcherNote: "2.60 ERA, 1.08 WHIP — elite K-rate making Lane Thomas a longshot despite home-field advantage.",
    note: ".740 OPS and 10 HR, journeyman outfielder with modest power profile facing one of today's better starters. Cole Ragans's elite 2.60 ERA and 1.08 WHIP make Thomas a pure lottery play in Washington today.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 46, name: "Luke Raley", team: "TB", tier: "C",
    park: "Dodger Stadium", pitcher: "Eric Lauer", matchupGrade: "C",
    estOdds: "+680", hr: 11, ops: 0.740, iso: 0.160, avg: 0.240, compositeScore: 44,
    pitcherNote: "5.74 ERA — Lauer is hittable, but Raley's profile is better suited for smaller, hitter-friendly parks.",
    note: ".740 OPS and 11 HR, lefty power bat better suited for weaker pitchers in hitter-friendly environments. Eric Lauer's 5.74 ERA at Dodger Stadium is a real asset, but the park partially suppresses away-team HR production.",
    tags: ["🎰 Longshot", "💣 SP Disaster"]
  },
  {
    id: 47, name: "Ezequiel Tovar", team: "COL", tier: "C",
    park: "Wrigley Field", pitcher: "Shota Imanaga", matchupGrade: "C-",
    estOdds: "+850", hr: 8, ops: 0.750, iso: 0.150, avg: 0.275, compositeScore: 44,
    pitcherNote: "2.70 ERA, 0.94 WHIP — elite command and premium sweeper make Tovar a longshot at best.",
    note: ".750 OPS and 8 HR, Rockies shortstop facing one of the game's best pitchers away from Coors Field. Shota Imanaga's 2.70 ERA and 0.94 WHIP make this essentially a lottery bet at Wrigley today.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 48, name: "Joey Wiemer", team: "MIL", tier: "C",
    park: "American Family Field", pitcher: "Tanner Bibee", matchupGrade: "C-",
    estOdds: "+900", hr: 8, ops: 0.710, iso: 0.155, avg: 0.235, compositeScore: 42,
    pitcherNote: "3.50 ERA, 1.18 WHIP — solid command against strikeout-prone lineup targets like Wiemer.",
    note: ".710 OPS and 8 HR, high-strikeout power bat who hits for streaks inside American Family Field's closed dome. Bibee's 3.50 ERA and consistent command limit Wiemer to a pure dome-lottery role today.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },
  {
    id: 49, name: "Michael Massey", team: "KC", tier: "C",
    park: "Nationals Park", pitcher: "Jake Irvin", matchupGrade: "C-",
    estOdds: "+880", hr: 8, ops: 0.720, iso: 0.145, avg: 0.255, compositeScore: 42,
    pitcherNote: "4.50 ERA, 1.38 WHIP — only above-average HR rate to right-handed power keeps Massey in the conversation.",
    note: ".720 OPS and 8 HR, second baseman with modest power profile facing a vulnerable starting pitcher. Jake Irvin's 4.50 ERA at Nationals Park provides the lone viable angle for Massey's C-tier lottery inclusion.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 50, name: "Ryan Noda", team: "ATH", tier: "C",
    park: "Las Vegas Ballpark", pitcher: "Jared Jones", matchupGrade: "C",
    estOdds: "+750", hr: 9, ops: 0.720, iso: 0.155, avg: 0.245, compositeScore: 41,
    pitcherNote: "4.82 ERA, 1.44 WHIP, 1.38 HR/9 — volatile young arm giving Noda a slim home-park edge.",
    note: ".720 OPS and 9 HR, patient walks-over-power profile at Las Vegas Ballpark's outdoor heat conditions. Jared Jones's 4.82 ERA and 1.44 WHIP is the strongest argument for Noda in today's C-tier lottery.",
    tags: ["🎰 Longshot", "💰 Value"]
  }
];

const parlays = [
  {
    id: "4A", legs: 4, label: "THE CORE FOUR",
    risk: "Lower Risk", riskColor: "#4caf50", estPayout: "+850",
    description: "Four blue-chip SP disasters across today's best HR environments.",
    playerIds: [1, 3, 5, 10],
    strategy: "This parlay targets the two biggest pitcher disasters on today's slate — Gusto (5.70 ERA) and Lorenzen (7.54 ERA) — anchored by Yordan's elite dome-stack profile against Olson's 4.20 ERA. Yandy Diaz visiting Dodger Stadium against Lauer (5.74 ERA) is the hidden gem that ties the whole ticket together."
  },
  {
    id: "4B", legs: 4, label: "PARK POWER",
    risk: "Lower Risk", riskColor: "#4caf50", estPayout: "+950",
    description: "Four elite hitters across premium park-pitcher combos.",
    playerIds: [3, 4, 10, 16],
    strategy: "Ian Happ anchors this with the best single matchup on the slate — Lorenzen's 7.54 ERA at Wrigley with wind blowing out. Ohtani's elite power at Dodger Stadium plus Yordan's dome floor make this a premium 4-legger even with Martínez's 2.29 ERA suppressing the LAD side."
  },
  {
    id: "5A", legs: 5, label: "FIVE STAR ELITE",
    risk: "Lower Risk", riskColor: "#4caf50", estPayout: "+1600",
    description: "Five S-tier anchors across today's top SP disasters and park contexts.",
    playerIds: [1, 3, 4, 5, 10],
    strategy: "The purest high-conviction 5-legger on the board. Gusto (5.70) and Lorenzen (7.54) are both getting wrecked today while Dodger Stadium and Daikin Park provide elite environments. Yandy visiting Lauer (5.74 ERA) at Dodger Stadium is the sleeper leg that elevates this ticket's floor."
  },
  {
    id: "5B", legs: 5, label: "ROAD WARRIORS",
    risk: "Medium Risk", riskColor: "#ff9800", estPayout: "+1800",
    description: "Five elite road bats in favorable visiting-team matchups today.",
    playerIds: [2, 6, 7, 13, 16],
    strategy: "Harper and Lowe both benefit from Citizens Bank Park and Dodger Stadium's elite HR contexts. Seiya Suzuki gets Lorenzen's 7.54 ERA at Wrigley, while Cruz's 99th-percentile exit velocity targets Ginn's inflated xFIP of 4.38 at Las Vegas Ballpark. Witt Jr.'s .860 OPS is the stable floor leg."
  },
  {
    id: "5C", legs: 5, label: "SP DISASTER FIVE",
    risk: "Medium Risk", riskColor: "#ff9800", estPayout: "+1750",
    description: "Five hitters targeting the worst pitchers and best parks on today's slate.",
    playerIds: [1, 3, 5, 10, 11],
    strategy: "Stack the three clearest SP disasters: Gusto (5.70 ERA) at Citizens Bank, Lorenzen (7.54 ERA) at Wrigley, and Lauer (5.74 ERA) at Dodger Stadium. Noelvi Marte's 5th spot targets Myers' 5.40 ERA at GABP — the fourth-best park on today's slate. Yordan anchors the middle with elite .230 ISO."
  },
  {
    id: "6A", legs: 6, label: "MURDER SLATE",
    risk: "Medium Risk", riskColor: "#ff9800", estPayout: "+3200",
    description: "Six S-tier powerhouses across the three biggest SP disaster matchups today.",
    playerIds: [1, 2, 3, 4, 5, 6],
    strategy: "Three separate SP disasters are stacked: Gusto (5.70) giving up PHI power, Lorenzen (7.54) against Chicago's lineup, and Lauer (5.74) at Dodger Stadium. TB's Yandy/Lowe tandem and PHI's Schwarber/Harper anchor the disaster stack on both ends, with Ohtani as the elite wildcard in the middle."
  },
  {
    id: "6B", legs: 6, label: "SLATE SWEEPER",
    risk: "Medium Risk", riskColor: "#ff9800", estPayout: "+3800",
    description: "Six players across six different games targeting SP disaster and elite park contexts.",
    playerIds: [1, 3, 5, 10, 11, 13],
    strategy: "Maximum game diversification with six different matchups. SP disasters Lorenzen (7.54) and Lauer (5.74) anchor the top end while Yordan's dome floor (Olson 4.20) and Noelvi's GABP position (Myers 5.40) cover the middle. Cruz targets Ginn's inflated xFIP at Las Vegas Ballpark to complete the cross-slate sweep."
  },
  {
    id: "7A", legs: 7, label: "MAGNIFICENT SEVEN",
    risk: "Medium-High Risk", riskColor: "#ff5722", estPayout: "+7500",
    description: "Seven of today's top HR threats across premium parks and SP disaster matchups.",
    playerIds: [1, 2, 3, 4, 5, 6, 10],
    strategy: "Adding Yordan's elite dome-stack ceiling to the 6A slate sweeps all three SP disasters (Gusto, Lorenzen, Lauer) plus Houston's power core vs Olson's 4.20 ERA. PHI's Schwarber-Harper combo and TB's Yandy-Lowe pair give this ticket redundancy across the best matchups on today's full slate."
  },
  {
    id: "7B", legs: 7, label: "SP DISASTER PLUS",
    risk: "Medium-High Risk", riskColor: "#ff5722", estPayout: "+8500",
    description: "Seven hitters targeting the top SP disasters with A-tier reinforcements.",
    playerIds: [1, 3, 5, 9, 10, 11, 16],
    strategy: "The Lorenzen-Gusto-Lauer triple disaster is the backbone, with Trea Turner adding a second Citizens Bank leg vs Gusto's 5.70 ERA. Yordan's dome floor, Noelvi's GABP position vs Myers' shaky 5.40 ERA over 15 IP, and Witt Jr.'s strong overall .860 OPS profile round out a diversified 7-legger."
  },
  {
    id: "7C", legs: 7, label: "POWER MIX",
    risk: "Medium-High Risk", riskColor: "#ff5722", estPayout: "+9200",
    description: "Seven power bats from seven different games across favorable matchup contexts.",
    playerIds: [2, 6, 8, 10, 13, 15, 19],
    strategy: "Maximum single-game diversification across 7 different matchups. Harper and Castellanos stack the PHI disaster (Gusto 5.70), while Cruz (Ginn xFIP 4.38 at Las Vegas), Ramirez (Misiorowski 4.10 ERA), and Yordan (Olson 4.20 ERA) layer the cross-slate angles. Bregman (Lorenzen 7.54) and Lowe (Lauer 5.74) complete the SP disaster coverage."
  },
  {
    id: "8A", legs: 8, label: "THE BEHEMOTH",
    risk: "Medium-High Risk", riskColor: "#ff5722", estPayout: "+14000",
    description: "Eight elite players anchored by the three biggest SP disasters on today's full slate.",
    playerIds: [1, 2, 3, 4, 5, 6, 9, 10],
    strategy: "The Gusto-Lorenzen-Lauer triple SP disaster stack gets maximum PHI and TB legs: Schwarber, Harper, Turner cover Citizens Bank while Yandy, Lowe target Lauer at Dodger Stadium. Adding Ohtani's elite profile and Yordan's dome anchor makes this the highest-quality 8-legger available — every player is S or A tier."
  },
  {
    id: "8B", legs: 8, label: "CROSS-SLATE CANNON",
    risk: "Medium-High Risk", riskColor: "#ff5722", estPayout: "+16500",
    description: "Eight players spanning eight different games for maximum cross-slate exposure.",
    playerIds: [1, 3, 5, 10, 11, 13, 16, 21],
    strategy: "Schwarber (Gusto 5.70) and Happ (Lorenzen 7.54) anchor the SP disasters while Yandy targets Lauer at Dodger Stadium. Noelvi (Myers 5.40 at GABP), Cruz (Ginn xFIP 4.38 at Las Vegas), and Tatis (Dustin May 4.21 plus Busch wind) extend coverage across four more games. Witt Jr. and Yordan provide the elite A-tier floor."
  },
  {
    id: "9A", legs: 9, label: "THE NINE",
    risk: "High Risk", riskColor: "#e91e63", estPayout: "+28000",
    description: "Nine top hitters spanning the five best HR matchups on today's full slate.",
    playerIds: [1, 2, 3, 4, 5, 6, 9, 10, 11],
    strategy: "Three full SP disasters are represented: Gusto (Schwarber, Harper, Turner), Lorenzen (Happ), Lauer (Yandy, Lowe) — plus Ohtani's elite ceiling at Dodger Stadium even vs Martínez. Yordan anchors the dome stack and Noelvi adds GABP's top-4 park factor against Myers' shaky 5.40 ERA over 15 IP."
  },
  {
    id: "9B", legs: 9, label: "DIVERSIFIED NINE",
    risk: "High Risk", riskColor: "#e91e63", estPayout: "+33000",
    description: "Nine legs spanning seven different games for a diversified high-risk play.",
    playerIds: [1, 3, 5, 9, 10, 11, 13, 16, 21],
    strategy: "SP disasters Gusto and Lorenzen anchor the top (Schwarber, Happ) while Yandy targets Lauer at Dodger Stadium. Noelvi, Cruz, and Tatis add cross-slate value — GABP power context, Las Vegas outdoor heat (Ginn xFIP 4.38), and Busch Stadium 15 MPH wind (Dustin May 4.21 ERA). Witt Jr. and Yordan provide the elite A-tier floor legs."
  },
  {
    id: "10A", legs: 10, label: "LOTTERY KING",
    risk: "Max Risk", riskColor: "#9c27b0", estPayout: "+65000",
    description: "Ten-leg max risk with two C-tier lottery entries and six different game angles.",
    playerIds: [1, 3, 5, 10, 11, 13, 23, 24, 41, 42],
    strategy: "The SP disaster backbone (Lorenzen 7.54, Lauer 5.74, Gusto 5.70) fuels the first three legs — Happ, Yandy, and Schwarber. Arenado (Giolito 4.35 ERA plus Busch wind 15 MPH) and Tucker (dome stack vs Olson 4.20) extend game coverage. Reynolds and Torkelson are pure lottery additions — PIT's big-swing profile at Las Vegas and DET's regression play vs Melton's inflated 2.81 ERA masking a 4.72 FIP."
  }
];
