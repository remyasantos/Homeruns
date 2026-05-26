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
  MIL: "MIL@STL",  STL: "MIL@STL"
};

const SLATE_DATE  = "MAY 26, 2026";
const SLATE_LABEL = "TUESDAY MLB SLATE";

const CONTEXT_CARDS = [
  {
    icon:  "💥",
    label: "Bailey Falter — SP Disaster",
    note:  "9.82 ERA / 2.86 WHIP — worst qualifying ERA in the AL",
    sub:   "Falter has been historically bad this season, surrendering multiple HRs in nearly every outing with a 2.86 WHIP that is the worst among active starters. The Yankees lineup featuring Judge and Stanton gets a clean shot at a pitcher who cannot miss bats or generate weak contact — pure free real estate for New York's elite power order."
  },
  {
    icon:  "🌬️",
    label: "Fenway Park Wind Boost",
    note:  "13.9 mph gusts tonight — top outdoor HR environment on the slate",
    sub:   "Fenway Park pairs its historic HR-friendly dimensions with 13.9 mph winds tonight, creating one of the best power contexts on the entire board. Even facing Spencer Strider's elite K arsenal, Boston's lineup gets a legitimate weather-aided edge toward the Green Monster and beyond — making Fenway the #1 outdoor park today."
  },
  {
    icon:  "🏠",
    label: "Globe Life Dome Stack",
    note:  "Rangers vs Tatsuya Imai (8.31 ERA / 1.79 WHIP) — pure matchup heaven",
    sub:   "Globe Life Field's closed roof eliminates all weather variance, delivering a controlled environment where Imai's 8.31 ERA disaster is the only variable that matters. Texas power bats Langford, Semien, and Lowe are all live in one of the cleanest dome-disaster stacks of the 2026 season — zero weather downside, maximum matchup upside."
  },
  {
    icon:  "💰",
    label: "Nick Kurtz Value Spot",
    note:  "98th-percentile barrel rate — AL's best young slugger at +430",
    sub:   "Kurtz has emerged as the AL Rookie of the Year frontrunner with a 98th-percentile barrel rate and .300+ ISO projecting for 36 HRs. Sacramento's 13.9 mph wind tonight at Sutter Health Park plus Emerson Hancock's predictable two-seamer arsenal creates outstanding value at extended odds for the Athletics' young bomber."
  }
];

const PARK_FACTORS = {
  "Fenway Park": {
    rank: 1,
    label: "💨 Wind Boost — 13.9 MPH Tonight",
    color: "#90e0ef"
  },
  "Dodger Stadium": {
    rank: 2,
    label: "🔥 Elite HR Park",
    color: "#ff6b35"
  },
  "Sutter Health Park": {
    rank: 3,
    label: "💨 Wind + Inland Heat — 13.9 MPH",
    color: "#90e0ef"
  },
  "Camden Yards": {
    rank: 4,
    label: "✅ Good HR Environment",
    color: "#ffb347"
  },
  "Guaranteed Rate Field": {
    rank: 5,
    label: "✅ Above Average HR Park",
    color: "#ffb347"
  },
  "Kauffman Stadium": {
    rank: 6,
    label: "⚾ Neutral HR Context",
    color: "#b0bec5"
  },
  "PNC Park": {
    rank: 7,
    label: "⚾ Neutral / Slight HR Friendly",
    color: "#b0bec5"
  },
  "Busch Stadium": {
    rank: 8,
    label: "⚾ Neutral HR Environment",
    color: "#b0bec5"
  },
  "Progressive Field": {
    rank: 9,
    label: "📉 Slightly Suppressive",
    color: "#b0bec5"
  },
  "Citi Field": {
    rank: 10,
    label: "📉 Slight Pitcher Advantage",
    color: "#b0bec5"
  },
  "Rogers Centre": {
    rank: 11,
    label: "Dome/Roof Closed",
    color: "#b0bec5"
  },
  "Globe Life Field": {
    rank: 12,
    label: "Dome/Roof Closed",
    color: "#b0bec5"
  },
  "Comerica Park": {
    rank: 13,
    label: "🥶 Suppressive — Large Outfield",
    color: "#78909c"
  },
  "Petco Park": {
    rank: 14,
    label: "🥶 Suppressive Park",
    color: "#78909c"
  },
  "Oracle Park": {
    rank: 15,
    label: "❄️ Most Suppressive Today",
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
    pitcher: "Bailey Falter",
    pitcherNote: "9.82 ERA / 2.86 WHIP — worst active ERA in the AL, walking batters freely with HR/9 over 2.0 in recent starts.",
    matchupGrade: "A+",
    estOdds: "+240",
    note: "Judge has cracked 17 HR and homers in over 30% of his games this season, making him the most dangerous right-handed bat alive. Bailey Falter's 9.82 ERA is the single worst matchup on the entire slate — Kauffman Stadium's neutral dimensions cannot save a pitcher this broken.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 2,
    name: "Giancarlo Stanton",
    team: "NYY",
    tier: "S",
    park: "Kauffman Stadium",
    pitcher: "Bailey Falter",
    pitcherNote: "9.82 ERA / 2.86 WHIP — surrenders hard contact on virtually every outing, HR/9 over 2.0 in current stretch.",
    matchupGrade: "A+",
    estOdds: "+270",
    note: "Stanton's 99th-percentile raw power and .910 OPS make him the most physically intimidating cleanup threat in the AL. Falter's 9.82 ERA creates a can't-miss setup — when the league's hardest-hitting slugger meets the worst starting pitcher, the math always favors the bomb.",
    tags: ["💣 SP Disaster", "🔥 Hot", "💰 Value"]
  },
  {
    id: 3,
    name: "Shohei Ohtani",
    team: "LAD",
    tier: "S",
    park: "Dodger Stadium",
    pitcher: "Kyle Freeland",
    pitcherNote: "4.40 ERA / 1.42 WHIP — command that breaks down against left-handed power bats, elevated hard-hit rate all season.",
    matchupGrade: "A",
    estOdds: "+225",
    note: "Ohtani's .828 OPS and elite barrel rate make him the premier power threat in the National League at Dodger Stadium — baseball's top HR environment. Freeland's 4.40 ERA and inability to generate consistent weak contact give Ohtani the green light to go deep in a venue built for home runs.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
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
    note: "Garcia's 23% barrel rate and all-or-nothing power profile are purpose-built to punish pitchers who cannot command the ball. Imai's 8.31 ERA disaster inside Globe Life Field's controlled dome gives Garcia a clean, weather-free shot at deep right-center.",
    tags: ["💣 SP Disaster", "🔥 Hot", "💰 Value"]
  },
  {
    id: 5,
    name: "Kyle Schwarber",
    team: "PHI",
    tier: "S",
    park: "Petco Park",
    pitcher: "Randy Vasquez",
    pitcherNote: "2.96 ERA but xFIP of 3.87 — outperforming peripherals with HR/9 and hard-hit rate signaling regression coming fast.",
    matchupGrade: "B+",
    estOdds: "+265",
    note: "Schwarber leads all of MLB with 20 HR and a .947 OPS through late May — the most prolific power hitter alive right now. Even Petco's suppressive dimensions cannot stop a man projecting for 65+ HRs; Vasquez's soft-contact approach is a time bomb waiting to explode against elite barrel rates.",
    tags: ["👑 MVP/Elite", "🔥 Hot", "📈 Breakout"]
  },
  {
    id: 6,
    name: "Yordan Alvarez",
    team: "HOU",
    tier: "S",
    park: "Globe Life Field",
    pitcher: "Kumar Rocker",
    pitcherNote: "3.60 ERA / 1.38 WHIP — struggles to retire left-handed power bats with secondary pitches, walk rate trending upward.",
    matchupGrade: "B+",
    estOdds: "+310",
    note: "Alvarez's .895 OPS and monster exit velocity make him a legitimate HR threat even against a pitcher with a respectable ERA. The Globe Life dome removes all weather risk, and Alvarez has historically crushed hard-throwing righties at this park with elite barrel authority.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },

  // ─── A-TIER ────────────────────────────────────────────────────────────────
  {
    id: 7,
    name: "Jazz Chisholm Jr.",
    team: "NYY",
    tier: "A",
    park: "Kauffman Stadium",
    pitcher: "Bailey Falter",
    pitcherNote: "9.82 ERA / 2.86 WHIP — absolutely cooked, cannot generate weak contact or limit damage against any lineup spot.",
    matchupGrade: "A",
    estOdds: "+320",
    note: "Chisholm has posted 12 HR and a .870 OPS in a breakout 2026 campaign, adding elite bat speed to his already explosive athleticism. Falter's 9.82 ERA means Chisholm is getting a free pass to go for the fences — the Yankees stack at Kauffman is the top team play on the board.",
    tags: ["💣 SP Disaster", "📈 Breakout", "🔥 Hot"]
  },
  {
    id: 8,
    name: "Wyatt Langford",
    team: "TEX",
    tier: "A",
    park: "Globe Life Field",
    pitcher: "Tatsuya Imai",
    pitcherNote: "8.31 ERA / 1.79 WHIP — historically bad stretch, walking batters in bunches with no reliable put-away pitch.",
    matchupGrade: "A",
    estOdds: "+340",
    note: "Langford has arrived as a legitimate star with 14 HR and an .880 OPS proving he's the real deal in his second MLB season. Imai's 8.31 ERA disaster inside the Globe Life dome is the cleanest double-stack situation Texas has had all year.",
    tags: ["📈 Breakout", "💣 SP Disaster"]
  },
  {
    id: 9,
    name: "Marcus Semien",
    team: "TEX",
    tier: "A",
    park: "Globe Life Field",
    pitcher: "Tatsuya Imai",
    pitcherNote: "8.31 ERA / 1.79 WHIP — worst qualifying ERA in the AL, HR/9 over 2.0 with command that disappears under pressure.",
    matchupGrade: "A",
    estOdds: "+340",
    note: "Semien is quietly excellent with 10 HR and a .820 OPS, providing veteran power from the middle of the Texas lineup all season. Globe Life's dome plus Imai's 8.31 ERA makes Semien underpriced at his current odds — this is the most complete Texas value stack on the slate.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 10,
    name: "Nathaniel Lowe",
    team: "TEX",
    tier: "A",
    park: "Globe Life Field",
    pitcher: "Tatsuya Imai",
    pitcherNote: "8.31 ERA / 1.79 WHIP — no reliable off-speed to slow down left-handed power bats, HR/9 is historically elevated.",
    matchupGrade: "A-",
    estOdds: "+370",
    note: "Lowe has produced 9 HR and a .840 OPS as the Rangers' steady left-handed complement to their right-handed core. Imai's 8.31 ERA in the dome is pure disaster stacking material — Lowe's line-drive swing profiles perfectly against a pitcher who can't locate his fastball.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 11,
    name: "Nick Kurtz",
    team: "ATH",
    tier: "A",
    park: "Sutter Health Park",
    pitcher: "Emerson Hancock",
    pitcherNote: "3.60 ERA / 1.20 WHIP — predictable two-seam approach that Kurtz's elite bat speed has proven capable of torching.",
    matchupGrade: "B+",
    estOdds: "+430",
    note: "Kurtz is the AL Rookie of the Year frontrunner with a 98th-percentile barrel rate and .300+ ISO projecting for 36 HR this season. Sutter Health Park's 13.9 mph wind tonight plus Hancock's lack of a true swing-and-miss pitch creates outstanding value at extended odds for the Athletics' young bomber.",
    tags: ["📈 Breakout", "💨 Wind Boost", "💰 Value"]
  },
  {
    id: 12,
    name: "Bryce Harper",
    team: "PHI",
    tier: "A",
    park: "Petco Park",
    pitcher: "Randy Vasquez",
    pitcherNote: "2.96 ERA / xFIP 3.87 — overperforming peripherals all season, HR/9 regression imminent against power-hitting lefties.",
    matchupGrade: "B+",
    estOdds: "+360",
    note: "Harper has slashed his way to 11 HR and a .970 OPS, continuing to be one of the NL's elite left-handed power bats. Even at suppressive Petco Park, Vasquez's underlying xFIP of 3.87 leaves Harper as the Phillies' top power threat against right-handed starters.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },
  {
    id: 13,
    name: "Freddie Freeman",
    team: "LAD",
    tier: "A",
    park: "Dodger Stadium",
    pitcher: "Kyle Freeland",
    pitcherNote: "4.40 ERA / 1.42 WHIP — gives up line-drive contact at alarming rates against elite left-handed bats, fly-ball heavy approach.",
    matchupGrade: "A-",
    estOdds: "+340",
    note: "Freeman has raked for 10 HR and a .890 OPS through late May, delivering consistent middle-order pop at one of MLB's premier HR parks. Freeland's 4.40 ERA at Dodger Stadium — where the ball carries exceptionally well — puts Freeman in a classic buy-low, sell-high setup.",
    tags: ["💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 14,
    name: "Mookie Betts",
    team: "LAD",
    tier: "A",
    park: "Dodger Stadium",
    pitcher: "Kyle Freeland",
    pitcherNote: "4.40 ERA / 1.42 WHIP — flat slider leaves him exposed to contact-plus hitters who drive the ball to all fields.",
    matchupGrade: "A-",
    estOdds: "+370",
    note: "Betts brings a .870 OPS and one of the best contact-plus-power profiles in the NL, thriving in Dodger Stadium's elite HR environment. Freeland's 4.40 ERA is the largest pitching mismatch Betts will see all week, and the Dodger Stadium setting makes every hard contact a potential bomb.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 15,
    name: "Jose Ramirez",
    team: "CLE",
    tier: "A",
    park: "Progressive Field",
    pitcher: "Cade Cavalli",
    pitcherNote: "4.60 ERA / 1.40 WHIP — fastball-heavy approach with below-average movement that Ramirez's pull-heavy swing dissects.",
    matchupGrade: "B+",
    estOdds: "+320",
    note: "Ramirez has 13 HR and a .915 OPS through late May, doing his usual elite damage at Progressive Field where he historically torches right-handers. Cavalli's 4.60 ERA and command lapses in the middle innings make JRam the single most underpriced A-tier bat on Tuesday's board.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },
  {
    id: 16,
    name: "Gunnar Henderson",
    team: "BAL",
    tier: "A",
    park: "Camden Yards",
    pitcher: "Griffin Jax",
    pitcherNote: "3.80 ERA / 1.30 WHIP — reliever-converted-starter who struggles to navigate lineups multiple times through the order.",
    matchupGrade: "B+",
    estOdds: "+310",
    note: "Henderson has erupted for 14 HR and a .930 OPS becoming one of the AL's premier power threats at just 24 years old. Camden Yards' hitter-friendly dimensions plus Jax's 3.80 ERA give Henderson a prime setup — he's been the best home-run value in the AL all month.",
    tags: ["📈 Breakout", "🔥 Hot"]
  },
  {
    id: 17,
    name: "Cal Raleigh",
    team: "SEA",
    tier: "A",
    park: "Sutter Health Park",
    pitcher: "Luis Severino",
    pitcherNote: "4.90 ERA / 1.38 WHIP — declining velocity and injury history have left him prone to hard contact against right-handed power.",
    matchupGrade: "B+",
    estOdds: "+390",
    note: "Raleigh has established himself as the best power-hitting catcher in baseball with 12 HR and an .870 OPS through late May. Sacramento's 13.9 mph wind tonight plus Severino's 4.90 ERA makes this a two-factor edge spot — wind and a hittable veteran at the same time.",
    tags: ["💨 Wind Boost", "💰 Value"]
  },
  {
    id: 18,
    name: "Elly De La Cruz",
    team: "CIN",
    tier: "A",
    park: "Citi Field",
    pitcher: "Nolan McLean",
    pitcherNote: "5.40 ERA over last two starts — unable to command his breaking ball, leaving elevated fastballs that result in hard contact.",
    matchupGrade: "A-",
    estOdds: "+360",
    note: "Elly De La Cruz has announced himself as a true five-tool star with 13 HR and a .285 ISO showcasing elite power at just 23. McLean's 5.40 ERA over back-to-back brutal starts makes this an SP disaster spot — Elly's elite bat speed against a struggling lefty at Citi Field is a genuine A-tier setup.",
    tags: ["📈 Breakout", "💣 SP Disaster"]
  },
  {
    id: 19,
    name: "Julio Rodriguez",
    team: "SEA",
    tier: "A",
    park: "Sutter Health Park",
    pitcher: "Luis Severino",
    pitcherNote: "4.90 ERA / 1.38 WHIP — lacks the swing-and-miss to keep elite athletes in check through a full lineup rotation.",
    matchupGrade: "B+",
    estOdds: "+420",
    note: "Rodriguez has developed 11 HR and an .850 OPS continuing his growth into one of baseball's brightest young stars. At Sutter Health Park with 13.9 mph wind tonight against Severino's 4.90 ERA, Rodriguez's raw athleticism and improving power profile make him a compelling wind-boost value play.",
    tags: ["📈 Breakout", "💨 Wind Boost"]
  },
  {
    id: 20,
    name: "Anthony Santander",
    team: "BAL",
    tier: "A",
    park: "Camden Yards",
    pitcher: "Griffin Jax",
    pitcherNote: "3.80 ERA / 1.30 WHIP — repertoire lacks a consistent put-away pitch against right-handed power bats through the order.",
    matchupGrade: "B+",
    estOdds: "+330",
    note: "Santander has quietly put up 12 HR and an .880 OPS as Baltimore's most consistent power source in the middle of the order all season. Camden Yards plays as one of the AL's better HR environments, and Jax's 3.80 ERA makes this a repeatable Orioles value spot.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 21,
    name: "Teoscar Hernandez",
    team: "LAD",
    tier: "A",
    park: "Dodger Stadium",
    pitcher: "Kyle Freeland",
    pitcherNote: "4.40 ERA / 1.42 WHIP — unable to limit pop-up-to-fly-ball conversion for pull-side right-handed hitters in this venue.",
    matchupGrade: "B+",
    estOdds: "+400",
    note: "Hernandez has cranked 10 HR and an .850 OPS as the Dodgers' underrated power bat in a stacked elite lineup. Dodger Stadium against Freeland's 4.40 ERA offers genuine HR context for Hernandez's pull-side power — this is the LA stack's most underpriced entry today.",
    tags: ["🔥 Hot", "💰 Value"]
  },

  // ─── B-TIER ────────────────────────────────────────────────────────────────
  {
    id: 22,
    name: "Bobby Witt Jr.",
    team: "KC",
    tier: "B",
    park: "Kauffman Stadium",
    pitcher: "Cam Schlittler",
    pitcherNote: "1.50 ERA / 0.86 WHIP — historically elite this season, multi-pitch mix generates whiffs across all quadrants of the zone.",
    matchupGrade: "C+",
    estOdds: "+470",
    note: "Witt is a generational talent with 13 HR and a .920 OPS — arguably the most complete player in the AL right now. However, Schlittler's elite 1.50 ERA and 0.86 WHIP are the most dominant marks on the board, making this a B-tier lottery even for a player of Witt's caliber.",
    tags: ["👑 MVP/Elite", "🔜 Due"]
  },
  {
    id: 23,
    name: "Juan Soto",
    team: "NYM",
    tier: "B",
    park: "Citi Field",
    pitcher: "Chase Burns",
    pitcherNote: "1.83 ERA / 0.92 WHIP — 6-1 record with 64 strikeouts, generating a 30%+ K-rate and virtually no premium contact allowed.",
    matchupGrade: "C+",
    estOdds: "+480",
    note: "Soto is the most dangerous hitter in the Mets lineup with an elite plate approach and premium power projecting for 38 HR this season. Burns' 1.83 ERA is the best number on the board — this is a B-tier spot purely on pitcher quality, not on Soto's elite talent.",
    tags: ["👑 MVP/Elite", "🔜 Due"]
  },
  {
    id: 24,
    name: "Francisco Lindor",
    team: "NYM",
    tier: "B",
    park: "Citi Field",
    pitcher: "Chase Burns",
    pitcherNote: "1.83 ERA — dominant 64-strikeout pace through late May makes him nearly untouchable for even elite lineups.",
    matchupGrade: "C",
    estOdds: "+510",
    note: "Lindor has posted 9 HR and an .880 OPS as one of the most complete shortstops in the game this season. Burns' 1.83 ERA suppresses this spot heavily — but Lindor's line-drive contact and opposite-field approach keep him alive as a B-tier dice-roll.",
    tags: ["👑 MVP/Elite", "🔜 Due"]
  },
  {
    id: 25,
    name: "Ian Happ",
    team: "CHC",
    tier: "B",
    park: "PNC Park",
    pitcher: "Braxton Ashcraft",
    pitcherNote: "5.20 ERA / 1.45 WHIP — young starter who hasn't found a consistent out pitch against disciplined left-handed bats.",
    matchupGrade: "B-",
    estOdds: "+460",
    note: "Happ has compiled 7 HR and an .830 OPS as the Cubs' reliable switch-hitting power bat in the middle of the order. Ashcraft's 5.20 ERA at slightly HR-friendly PNC Park gives Happ a legitimate shot — he's particularly dangerous when ahead in the count against fly-ball pitchers.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 26,
    name: "Kerry Carpenter",
    team: "DET",
    tier: "B",
    park: "Comerica Park",
    pitcher: "Jack Kochanowicz",
    pitcherNote: "4.20 ERA / 1.32 WHIP — fastball-dependent approach that struggles to put away left-handed hitters with authority.",
    matchupGrade: "B-",
    estOdds: "+480",
    note: "Carpenter has slugged 9 HR and an .830 OPS as the Tigers' most consistent power bat despite Comerica Park's notorious suppressive dimensions. Kochanowicz's 4.20 ERA presents a hittable matchup even in the cavernous outfield — Carpenter's pull-side stroke is the Tigers' best HR bet tonight.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 27,
    name: "Triston Casas",
    team: "BOS",
    tier: "B",
    park: "Fenway Park",
    pitcher: "Spencer Strider",
    pitcherNote: "2.80 ERA / 0.98 WHIP — elite 12 K/9 rate, though HR/9 of 1.2 shows even dominant arms give up mistakes to power hitters.",
    matchupGrade: "C+",
    estOdds: "+490",
    note: "Casas has roped 10 HR and an .870 OPS as Boston's most patient and powerful bat — his platoon splits against right-handers are exceptional. Fenway's 13.9 mph wind boost tonight partially offsets Strider's elite K arsenal — this is the wind-aided longshot that could cash in a bounce-back spot.",
    tags: ["💨 Wind Boost", "🔜 Due"]
  },
  {
    id: 28,
    name: "George Springer",
    team: "TOR",
    tier: "B",
    park: "Rogers Centre",
    pitcher: "Sandy Alcantara",
    pitcherNote: "4.00 ERA — Tommy John comeback season, velocity and sink not fully restored, giving up hard contact at elevated rate.",
    matchupGrade: "B-",
    estOdds: "+500",
    note: "Springer has 8 HR and an .820 OPS continuing to provide pop from the top of Toronto's order with his veteran power approach. Alcantara's 4.00 ERA in his TJ-return season inside the Rogers Centre dome makes this a viable Springer spot in a controlled environment.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 29,
    name: "Spencer Steer",
    team: "CIN",
    tier: "B",
    park: "Citi Field",
    pitcher: "Nolan McLean",
    pitcherNote: "5.40 ERA — back-to-back disaster outings signal a command breakdown on both fastball and curveball location.",
    matchupGrade: "B",
    estOdds: "+450",
    note: "Steer has accumulated 7 HR and an .820 OPS as Cincinnati's versatile left-handed power contributor from the middle of the order. McLean's 5.40 ERA makes the Reds' lineup a legitimate stacking spot — Steer is the secondary Cincinnati value play behind De La Cruz tonight.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 30,
    name: "Corbin Carroll",
    team: "AZ",
    tier: "B",
    park: "Oracle Park",
    pitcher: "Tyler Mahle",
    pitcherNote: "3.80 ERA — Tommy John return has left diminished velocity, creating hitter-favorable pitch counts against athletic bats.",
    matchupGrade: "B-",
    estOdds: "+460",
    note: "Carroll has improved his power game with 7 HR and an .820 OPS showing genuine ISO growth in his third big-league season. Mahle's 3.80 ERA at suppressive Oracle Park keeps this at B-tier, but Carroll's elite athleticism and improving pull rate make him a viable sleeper.",
    tags: ["📈 Breakout", "🔜 Due"]
  },
  {
    id: 31,
    name: "Matt Chapman",
    team: "SF",
    tier: "B",
    park: "Oracle Park",
    pitcher: "Eduardo Rodriguez",
    pitcherNote: "4.80 ERA / 1.38 WHIP — declining velocity has made him a fly-ball machine against patient right-handed hitters.",
    matchupGrade: "B-",
    estOdds: "+470",
    note: "Chapman has powered up for 8 HR and an .850 OPS as San Francisco's premier home run threat despite Oracle Park's marine-layer suppression. Rodriguez's 4.80 ERA gives Chapman a window to pull one to left-center — his opposite-field authority is the Giants' best HR angle tonight.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 32,
    name: "Royce Lewis",
    team: "MIN",
    tier: "B",
    park: "Guaranteed Rate Field",
    pitcher: "Sean Burke",
    pitcherNote: "5.80 ERA / 1.60 WHIP — young White Sox starter with no reliable put-away pitch who surrenders hard contact all game long.",
    matchupGrade: "B",
    estOdds: "+430",
    note: "Lewis has been electric when healthy with 10 HR and a .900 OPS providing elite power from the top of Minnesota's order. Burke's 5.80 ERA is a genuine SP disaster spot at Guaranteed Rate Field — Lewis and the Twins lineup is a legitimate stacking target.",
    tags: ["💣 SP Disaster", "🔜 Due"]
  },
  {
    id: 33,
    name: "Matt Wallner",
    team: "MIN",
    tier: "B",
    park: "Guaranteed Rate Field",
    pitcher: "Sean Burke",
    pitcherNote: "5.80 ERA / 1.60 WHIP — lacks a consistent breaking ball, exploitable for left-handed pull hitters who sit on the fastball.",
    matchupGrade: "B",
    estOdds: "+450",
    note: "Wallner has showcased legitimate plus power with 8 HR and an .850 OPS as Minnesota's best-kept offensive secret this season. Burke's 5.80 ERA gives Wallner and the Twins a stack-worthy setup at Guaranteed Rate — Minnesota's left-handed duo is underpriced for a road game.",
    tags: ["📈 Breakout", "🔜 Due"]
  },
  {
    id: 34,
    name: "Bo Bichette",
    team: "TOR",
    tier: "B",
    park: "Rogers Centre",
    pitcher: "Sandy Alcantara",
    pitcherNote: "4.00 ERA — reduced velocity in TJ comeback leaves him vulnerable to line-drive contact from right-handed bats.",
    matchupGrade: "B-",
    estOdds: "+510",
    note: "Bichette has put up 7 HR and an .820 OPS showing continued offensive contributions from his contact-plus approach in the Rogers Centre dome. Alcantara's 4.00 ERA TJ-return season represents a hittable matchup for Bichette's line-drive power to right-center.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 35,
    name: "Ketel Marte",
    team: "AZ",
    tier: "B",
    park: "Oracle Park",
    pitcher: "Tyler Mahle",
    pitcherNote: "3.80 ERA — post-Tommy John velocity decline leaves him exposed to contact from both sides of the plate.",
    matchupGrade: "B-",
    estOdds: "+480",
    note: "Marte has accumulated 9 HR and an .870 OPS as one of the NL's most underrated switch-hitting power bats through late May. Mahle's 3.80 ERA at suppressive Oracle Park keeps this at B-tier, but Marte's barrel quality gives him an outside shot at going deep.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 36,
    name: "Tyler Stephenson",
    team: "CIN",
    tier: "B",
    park: "Citi Field",
    pitcher: "Nolan McLean",
    pitcherNote: "5.40 ERA — command breakdowns on secondary pitches lead to hittable counts and hard contact for power catchers.",
    matchupGrade: "B",
    estOdds: "+520",
    note: "Stephenson has slugged 7 HR and an .840 OPS from behind the plate — his opposite-field power to right is a genuine asset in his lineup spot. McLean's 5.40 ERA makes this another legitimate Reds stack entry alongside De La Cruz and Steer at neutral Citi Field.",
    tags: ["💣 SP Disaster", "🔜 Due"]
  },
  {
    id: 37,
    name: "Josh Naylor",
    team: "CLE",
    tier: "B",
    park: "Progressive Field",
    pitcher: "Cade Cavalli",
    pitcherNote: "4.60 ERA / 1.40 WHIP — offspeed command issues force him to come back to the fastball in key counts.",
    matchupGrade: "B-",
    estOdds: "+440",
    note: "Naylor has hit 8 HR and an .820 OPS as Cleveland's physical first baseman providing middle-of-the-order pop behind Ramirez. Cavalli's 4.60 ERA at Progressive Field gives Naylor a viable swing for value — the Cleveland duo of Ramirez and Naylor is the best Guardians stack option.",
    tags: ["🔜 Due", "💰 Value"]
  },
  {
    id: 38,
    name: "Jackson Chourio",
    team: "MIL",
    tier: "B",
    park: "Busch Stadium",
    pitcher: "Michael McGreevy",
    pitcherNote: "2.40 ERA but xFIP of 4.03 — one of the largest ERA-to-FIP gaps in baseball, with HR regression heavily overdue.",
    matchupGrade: "B",
    estOdds: "+450",
    note: "Chourio has developed into a genuine breakout star with 8 HR and elite bat speed ranking in the 90th percentile this season. McGreevy's 4.03 FIP versus his 2.40 ERA represents a massive disconnect — HR regression is coming, and Chourio's pull-power is perfectly positioned to trigger it.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 39,
    name: "Fernando Tatis Jr.",
    team: "SD",
    tier: "B",
    park: "Petco Park",
    pitcher: "Aaron Nola",
    pitcherNote: "3.40 ERA / 1.15 WHIP — elite command and spin rate make him one of the toughest right-handers to hit for power.",
    matchupGrade: "C+",
    estOdds: "+510",
    note: "Tatis Jr. has racked up 11 HR and an .870 OPS showing his full return to form as one of the NL's premiere power threats. Nola's 3.40 ERA at suppressive Petco Park keeps this firmly at B-tier — but Tatis's raw power can clear any park on a single mistake pitch.",
    tags: ["👑 MVP/Elite", "🎰 Longshot"]
  },
  {
    id: 40,
    name: "Steven Kwan",
    team: "CLE",
    tier: "B",
    park: "Progressive Field",
    pitcher: "Cade Cavalli",
    pitcherNote: "4.60 ERA — regularly allows hard contact on elevated four-seamers to contact-oriented leadoff bats.",
    matchupGrade: "C+",
    estOdds: "+600",
    note: "Kwan has 4 HR and an .800 OPS — primarily a contact hitter, but his recent power uptick and improved pull rate have him entering the HR conversation. Cavalli's 4.60 ERA gives Kwan a legitimate outside shot in a slightly suppressive environment as a pure value play.",
    tags: ["🔜 Due", "🎰 Longshot"]
  },
  {
    id: 41,
    name: "Seiya Suzuki",
    team: "CHC",
    tier: "B",
    park: "PNC Park",
    pitcher: "Braxton Ashcraft",
    pitcherNote: "5.20 ERA — slider command lapses leave him vulnerable to opposite-field contact from disciplined right-handed bats.",
    matchupGrade: "B-",
    estOdds: "+460",
    note: "Suzuki has hit 8 HR and an .840 OPS as the Cubs' reliable right-handed power bat providing a balanced attack in the middle of the order. Ashcraft's 5.20 ERA at PNC Park gives Suzuki a decent but suppressed matchup — he's the Cubs' best secondary HR option behind Happ.",
    tags: ["🔜 Due", "💰 Value"]
  },

  // ─── C-TIER ────────────────────────────────────────────────────────────────
  {
    id: 42,
    name: "Salvador Perez",
    team: "KC",
    tier: "C",
    park: "Kauffman Stadium",
    pitcher: "Cam Schlittler",
    pitcherNote: "1.50 ERA / 0.86 WHIP — historically dominant this season, four-seam/slider combo generates 30%+ strikeout rate.",
    matchupGrade: "C-",
    estOdds: "+680",
    note: "Perez has 8 HR and an .820 OPS carrying his trademark veteran power from behind the plate in Kansas City. Schlittler's elite 1.50 ERA is the most dominant mark on the slate — this is a pure lottery play despite Perez's proven ability to generate HRs against any arm.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 43,
    name: "Vinnie Pasquantino",
    team: "KC",
    tier: "C",
    park: "Kauffman Stadium",
    pitcher: "Cam Schlittler",
    pitcherNote: "1.50 ERA / 0.86 WHIP — elite command on all four pitches makes him nearly impossible to get extended at-bats against.",
    matchupGrade: "C-",
    estOdds: "+720",
    note: "Pasquantino has 7 HR and an .810 OPS as Kansas City's patient first baseman who occasionally launches one to right on a mistake. Against Schlittler's 1.50 ERA this is a low-probability dart throw for a secondary Royals stack at long odds.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 44,
    name: "Brenton Doyle",
    team: "COL",
    tier: "C",
    park: "Dodger Stadium",
    pitcher: "Eric Lauer",
    pitcherNote: "4.30 ERA / 1.35 WHIP — changeup-heavy approach that leaves elevated pitches over the zone for visiting power hitters.",
    matchupGrade: "C",
    estOdds: "+750",
    note: "Doyle has 6 HR and a .770 OPS as Colorado's speedy outfielder with surprising pull power when he gets a pitch to drive. Lauer's 4.30 ERA at Dodger Stadium — where the ball carries exceptionally well — provides the park-aided upside needed for this visiting Rockie longshot.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },
  {
    id: 45,
    name: "Bryan Ramos",
    team: "CWS",
    tier: "C",
    park: "Guaranteed Rate Field",
    pitcher: "Joe Ryan",
    pitcherNote: "4.10 ERA / 1.28 WHIP — tends to avoid disasters but elevated fly-ball rate against first-pitch-swinging right-handed hitters.",
    matchupGrade: "C",
    estOdds: "+780",
    note: "Ramos has 5 HR and a .740 OPS as one of Chicago's developing young power prospects showing promising bat speed this season. Joe Ryan's 4.10 ERA makes him beatable on good days — Ramos at long odds in a homer-friendly park is a pure C-tier lottery entry for a secondary White Sox stack.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  },
  {
    id: 46,
    name: "Andrew Vaughn",
    team: "CWS",
    tier: "C",
    park: "Guaranteed Rate Field",
    pitcher: "Joe Ryan",
    pitcherNote: "4.10 ERA — fly-ball rate suggests vulnerability against first-pitch-aggressive right-handed power hitters.",
    matchupGrade: "C",
    estOdds: "+800",
    note: "Vaughn has 6 HR and a .780 OPS as the White Sox's best pure power hitter in their ongoing rebuild. Ryan's 4.10 ERA at homer-friendly Guaranteed Rate gives Vaughn a slim but real shot at going deep as a pure underdog value play.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 47,
    name: "Lars Nootbaar",
    team: "STL",
    tier: "C",
    park: "Busch Stadium",
    pitcher: "Kyle Harrison",
    pitcherNote: "1.77 ERA — MLB's first pitcher to reach 100 strikeouts this season, elite across all four quadrants of the zone.",
    matchupGrade: "C-",
    estOdds: "+850",
    note: "Nootbaar has 5 HR and a .760 OPS as St. Louis's patient leadoff bat with hidden pull power when he squares up a pitch. Harrison's 1.77 ERA and 100-strikeout total make this a near-impossible matchup — pure C-tier lottery for gamblers who need a Cardinals entry in a Busch Stadium stack.",
    tags: ["🎰 Longshot", "🔜 Due"]
  },
  {
    id: 48,
    name: "Rafael Devers",
    team: "BOS",
    tier: "C",
    park: "Fenway Park",
    pitcher: "Spencer Strider",
    pitcherNote: "2.80 ERA / 0.98 WHIP — elite 12 K/9 rate, though 1.2 HR/9 shows even aces give up bombs to power hitters on mistakes.",
    matchupGrade: "C+",
    estOdds: "+640",
    note: "Devers has hit 8 HR and an .860 OPS as Boston's most dangerous right-handed bat — his pull-power to right is tailor-made for Fenway's unique park geometry. Strider's 2.80 ERA makes this a C-tier lottery, but Fenway's 13.9 mph wind boost tonight gives Devers a small but real weather edge.",
    tags: ["💨 Wind Boost", "🎰 Longshot"]
  },
  {
    id: 49,
    name: "Nolan Jones",
    team: "COL",
    tier: "C",
    park: "Dodger Stadium",
    pitcher: "Eric Lauer",
    pitcherNote: "4.30 ERA / 1.35 WHIP — changeup-heavy approach creates elevated pitches that travel far at Dodger Stadium.",
    matchupGrade: "C",
    estOdds: "+770",
    note: "Jones has 5 HR and a .760 OPS showing raw left-handed power when he squares up an elevated fastball or hangs changeup. Lauer's 4.30 ERA at Dodger Stadium — baseball's most HR-friendly park — is the park-aided silver lining that makes this a viable C-tier longshot.",
    tags: ["🎰 Longshot", "💰 Value"]
  },
  {
    id: 50,
    name: "Michael Toglia",
    team: "COL",
    tier: "C",
    park: "Dodger Stadium",
    pitcher: "Eric Lauer",
    pitcherNote: "4.30 ERA — predictable fastball-changeup sequencing that left-handed first basemen have historically exploited.",
    matchupGrade: "C-",
    estOdds: "+880",
    note: "Toglia has 5 HR and a .760 OPS as Colorado's big left-handed first baseman whose raw power translates to big flies when he catches one. At Dodger Stadium against Lauer's 4.30 ERA, this is a maximum-longshot entry that still offers real HR upside in the sport's best HR venue.",
    tags: ["🎰 Longshot", "📈 Breakout"]
  }
];

const parlays = [
  {
    id: "4A",
    legs: 4,
    label: "THE DYNASTY FOUR",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+800",
    description: "The four best power threats on the slate stacked into a four-leg core parlay.",
    playerIds: [1, 2, 3, 6],
    strategy: "Judge and Stanton against Falter's 9.82 ERA is the cleanest HR spot on the slate — both sluggers have power profiles that destroy high-ERA pitchers on contact. Ohtani and Alvarez complete this elite core with a combined 30+ HR and barrel rates that rank among baseball's best. This is the minimum-risk, maximum-quality parlay where every single leg is a legitimate S-tier threat."
  },
  {
    id: "4B",
    legs: 4,
    label: "DISASTER DOUBLE-STACK",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1200",
    description: "Two SP disaster matchups stacked — Garcia vs Imai and Schwarber vs Vasquez anchor this four-leg value play.",
    playerIds: [4, 5, 7, 9],
    strategy: "Garcia's 23% barrel rate against Imai's 8.31 ERA is one of the best individual power matchups in the sport — the Globe Life dome just amplifies it. Schwarber's 20 HR and .947 OPS against Vasquez's xFIP-3.87 regression spot plus Chisholm and Semien in disaster matchups makes every leg here a live play. This parlay offers better odds than 4A while featuring the same quality matchup tier."
  },
  {
    id: "5A",
    legs: 5,
    label: "THE POWER FIVE",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1800",
    description: "Three S-tier disasters plus Ramirez's value and Semien's dome stack form the best five-leg lineup.",
    playerIds: [1, 4, 5, 9, 15],
    strategy: "Judge, Garcia, and Schwarber represent three of the four clearest SP-disaster scenarios on the board — Falter's 9.82, Imai's 8.31, and Vasquez's lurking FIP regression are all exploitable tonight. Semien brings the dome-stack value angle and Ramirez's .915 OPS against Cavalli's 4.60 ERA provides the fifth proven power leg. This is the highest-conviction five-leg parlay on the slate with no wasted legs."
  },
  {
    id: "5B",
    legs: 5,
    label: "THE BREAKOUT BOARD",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2200",
    description: "Three emerging stars plus proven power bats in favorable matchups create the best medium-risk five-leg combo.",
    playerIds: [7, 11, 13, 17, 25],
    strategy: "Chisholm and Kurtz represent the best breakout value plays on the slate — Chisholm vs Falter's disaster and Kurtz at +430 in Sacramento's 13.9 mph wind. Freeman's .890 OPS at Dodger Stadium and Raleigh's wind-boosted spot against Severino's 4.90 ERA round out the proven power tier. Happ completes the five with Ashcraft's 5.20 ERA providing a secondary SP disaster angle at PNC."
  },
  {
    id: "5C",
    legs: 5,
    label: "FIVE ALARM FIRE",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2000",
    description: "Five A-tier power bats across multiple disaster matchups and premium parks.",
    playerIds: [4, 12, 14, 18, 20],
    strategy: "Garcia vs Imai's 8.31 ERA anchors this five-leg parlay with one of the cleanest dome-disaster setups of the season. Betts and Harper add two of the game's best pure power hitters in prime matchups — Freeman at Dodger Stadium and Harper against Vasquez's lurking regression. Elly De La Cruz vs McLean's 5.40 ERA rounds this out as five legitimate live legs across four different games."
  },
  {
    id: "6A",
    legs: 6,
    label: "WEST COAST POWER",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+3200",
    description: "The Dodger Stadium stack plus Texas and Philly disasters form the best six-leg medium-risk parlay.",
    playerIds: [3, 5, 7, 9, 13, 21],
    strategy: "Ohtani and Freeman at Dodger Stadium vs Freeland's 4.40 ERA give this parlay two of the game's elite left-handed power bats in baseball's best HR venue. Schwarber's 20 HR pace plus Chisholm and Semien in the two biggest SP disaster matchups create three additional live legs with proven track records. Teoscar Hernandez is the value add at +400 — a third Dodger bat often overlooked in the LAD power stack."
  },
  {
    id: "6B",
    legs: 6,
    label: "VALUE STACK",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+3800",
    description: "Six underpriced A-tier bats across favorable matchups — the best payout-per-quality-leg ratio on the slate.",
    playerIds: [11, 15, 16, 17, 26, 33],
    strategy: "Kurtz at +430, Raleigh at +390, and Wallner at +450 give this parlay three of the most underpriced bats on the entire board. Ramirez's .915 OPS vs Cavalli and Henderson's 14 HR at Camden Yards are the quality anchors that make these odds genuinely valuable. Carpenter vs Kochanowicz's 4.20 ERA rounds out a six-leg parlay where every player is getting a number that doesn't match their actual production."
  },
  {
    id: "7A",
    legs: 7,
    label: "THE MAGNIFICENT SEVEN",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+5500",
    description: "The elite S-tier core expands to seven legs — the premium medium-high parlay for tonight.",
    playerIds: [1, 4, 8, 9, 13, 14, 25],
    strategy: "Judge vs Falter's 9.82 ERA and Garcia vs Imai's 8.31 ERA are the two most dominant matchup advantages on the entire slate — adding both to any parlay raises the floor instantly. Langford, Semien, and Freeman add three more proven power bats in live disaster matchups across the dome and Dodger Stadium. Betts and Happ give this parlay geographic and lineup diversification across four different games — a well-built seven-leg ladder."
  },
  {
    id: "7B",
    legs: 7,
    label: "MULTI-GAME SPREAD",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+6000",
    description: "Seven bats across six different games — maximum diversification at medium-high risk.",
    playerIds: [7, 12, 18, 19, 23, 30, 36],
    strategy: "Chisholm vs Falter, Elly vs McLean's 5.40 ERA, and Stephenson vs McLean stack the two biggest pitcher disasters with multiple Reds hitters. Harper at +360 against Vasquez's regression and Julio Rodriguez in Sacramento's wind-boosted environment give this two strong A-tier value legs. Soto and Carroll round out the diversification — this is the widest-spread seven-leg parlay available tonight."
  },
  {
    id: "7C",
    legs: 7,
    label: "SLEEPER STACK",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+5800",
    description: "Seven value bats at extended odds — the underpriced seven-leg ticket for sharp money.",
    playerIds: [15, 16, 17, 20, 29, 34, 37],
    strategy: "Ramirez, Henderson, and Raleigh form a three-headed value core where every player is underpriced against their actual production level. Santander at Camden Yards and Raleigh in Sacramento's wind add two park-advantage angles to the blend. Steer, Bichette, and Naylor complete the seven with secondary matchup value — this parlay pays significantly better than comparable quality parlays."
  },
  {
    id: "8A",
    legs: 8,
    label: "THE SUPER EIGHT",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+8500",
    description: "Eight of the board's best power bats in a balanced mix of S and A-tier talent.",
    playerIds: [1, 3, 7, 8, 9, 11, 15, 22],
    strategy: "Judge, Ohtani, and Chisholm bring elite S-tier talent vs the board's two worst starters — Falter at 9.82 and Freeland at 4.40 in baseball's best HR park. Langford and Semien double the Texas dome-disaster stack while Kurtz adds the Sacramento wind-boost angle at value odds. Ramirez vs Cavalli and Witt Jr. at +470 despite his .920 OPS give this eight-leg parlay legitimate depth at every spot."
  },
  {
    id: "8B",
    legs: 8,
    label: "DIAMOND DISTRICT",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+9000",
    description: "Eight A-tier power bats across five games — the quality-depth eight-leg parlay.",
    playerIds: [12, 13, 16, 17, 18, 20, 25, 32],
    strategy: "Harper and Freeman bring two of baseball's best left-handed power bats against today's matchups — Freeman at Dodger Stadium vs Freeland, Harper at Petco where Vasquez's FIP regression looms. Henderson at Camden Yards and Raleigh in Sacramento's wind represent the two most underpriced A-tier spots on the board. Elly vs McLean's 5.40 ERA and Lewis vs Burke's 5.80 ERA stack two SP disasters — eight legs of genuine conviction across diverse games."
  },
  {
    id: "9A",
    legs: 9,
    label: "THE BIG NINE",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+15000",
    description: "Nine of the board's best power threats — the premium high-risk parlay for tonight's full slate.",
    playerIds: [1, 4, 5, 9, 12, 13, 15, 22, 39],
    strategy: "Judge and Garcia anchor two of the three biggest SP disaster matchups on the slate — Falter's 9.82 and Imai's 8.31 ERA are the two most glaring pitcher vulnerabilities. Schwarber's 20 HR pace, Semien in the dome, Harper and Freeman at elite venues, and Ramirez's .915 OPS add five proven power bats with A+ matchup grades. Witt Jr. and Tatis give the nine-leg parlay its two upside wildcards — elite talent at extended odds that could punch this ticket into five figures."
  },
  {
    id: "9B",
    legs: 9,
    label: "PACIFIC COAST POWER",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+14500",
    description: "West Coast and multi-game power spread — the diversified nine-leg high-risk play.",
    playerIds: [3, 6, 7, 14, 15, 16, 18, 24, 30],
    strategy: "Ohtani and Alvarez lead the West Coast contingent with elite barrel profiles at Globe Life and Dodger Stadium — two of the game's best HR environments. Chisholm vs Falter's disaster and Elly vs McLean's 5.40 ERA bring the strongest matchup edges to this nine-leg spread. Betts at Dodger Stadium, Henderson at Camden Yards, Raleigh in Sacramento's wind, Lindor's talent despite Burns, and Carroll's athleticism round out nine legs spanning six games."
  },
  {
    id: "10A",
    legs: 10,
    label: "THE LOTTERY BOARD",
    risk: "Max Risk",
    riskColor: "#9c27b0",
    estPayout: "+25000",
    description: "Ten legs including three C-tier lottery plays — the maximum-risk, maximum-reward parlay for tonight.",
    playerIds: [1, 4, 9, 13, 18, 22, 35, 42, 43, 45],
    strategy: "Judge vs Falter and Garcia vs Imai anchor this ten-leg lottery with the board's two biggest SP disasters — without those elite legs, no ten-leg parlay is worth building. Freeman at Dodger Stadium, Semien in the dome, and Elly vs McLean complete the five proven legs before the lottery tier begins. Perez, Pasquantino, and Ramos are three C-tier wildcards at +680, +720, and +780 respectively — three longshots who only need one bad Schlittler or Ryan inning to cash alongside the elite legs."
  }
];
