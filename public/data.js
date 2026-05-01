const TEAM_TO_GAME = {
  ATL: "ATL@COL",  COL: "ATL@COL",
  TEX: "TEX@DET",  DET: "TEX@DET",
  AZ:  "AZ@CHC",   CHC: "AZ@CHC",
  BAL: "BAL@NYY",  NYY: "BAL@NYY",
  HOU: "HOU@BOS",  BOS: "HOU@BOS",
  PHI: "PHI@MIA",  MIA: "PHI@MIA",
  LAD: "LAD@STL",  STL: "LAD@STL",
  TOR: "TOR@MIN",  MIN: "TOR@MIN",
  NYM: "NYM@LAA",  LAA: "NYM@LAA",
  PIT: "CIN@PIT",  CIN: "CIN@PIT",
  MIL: "MIL@WSH",  WSH: "MIL@WSH",
  KC:  "KC@SEA",   SEA: "KC@SEA",
  OAK: "CLE@OAK",  CLE: "CLE@OAK",
  SF:  "SF@TB",    TB:  "SF@TB",
  CWS: "CWS@SD",   SD:  "CWS@SD",
};

const SLATE_DATE  = "MAY 1, 2026";
const SLATE_LABEL = "FRIDAY MLB SLATE";

const CONTEXT_CARDS = [
  {
    icon: "💨",
    label: "Coors Field — W-NW Wind Gusts 30 mph",
    note: "Grant Holmes 3.62 ERA vs. Quintana 4.91 ERA — 52°F / Gusts 30mph",
    sub: "ATL@COL: Coors Field is the #1 HR park in baseball and tonight it plays with WNW gusts up to 30 mph — Quintana's 4.91 ERA and 9 Ks through 5 starts make every Atlanta bat a premier threat, while Colorado's lineup is dangerous at home even against Holmes."
  },
  {
    icon: "💣",
    label: "Comerica Park — Flaherty 5.33 ERA / 1.74 WHIP",
    note: "Flaherty: 22 BBs in 25.1 IP — walk rate disaster, 0-2 record, 1.74 WHIP",
    sub: "TEX@DET: Jack Flaherty has been a complete disaster in 2026, walking 22 batters in just 25 innings with an 0-2 record and a 5.33 ERA. The Texas Rangers' power lineup led by Corey Seager and Wyatt Langford is the best possible collection of bats to expose a control-challenged arm."
  },
  {
    icon: "🌬️",
    label: "Wrigley Field — 11.4 mph South Wind / 44°F Day Game",
    note: "AZ@CHC: South wind blowing out at Wrigley — Colin Rea vs. Zac Gallen day game",
    sub: "AZ@CHC: The south wind at Wrigley blows out toward left-center at 11.4 mph — perfect for pull-power right-handed hitters. The 44°F cold suppresses some pop but the outbound gust at one of baseball's most HR-friendly environments still makes this a wind-stack target."
  },
  {
    icon: "🔥",
    label: "loanDepot park — Open Roof / 82°F / PHI Lineup vs. Pérez",
    note: "Eury Pérez: 4.15 ERA, 27 K in 26 IP — PHI bombs in warm Miami air",
    sub: "PHI@MIA: loanDepot park's roof is open tonight in warm 82°F Miami air with 12.8 mph wind — the Phillies' explosive power core of Schwarber, Harper, and Turner targeting Pérez's 4.15 ERA in a warm open environment is one of the most complete slate-wide stacking angles of the night."
  },
];

const PARK_FACTORS = {
  "Coors Field":          { rank: 1,  label: "💨 #1 HR Park — 52°F / W-NW Gusts 30mph",       color: "#ff6b35" },
  "Wrigley Field":        { rank: 2,  label: "🌬️ #2 — Wind Out 11.4mph / 44°F Day Game",      color: "#90e0ef" },
  "Yankee Stadium":       { rank: 3,  label: "💨 #3 — 63°F / 9.2mph Wind / HR-Friendly",       color: "#90e0ef" },
  "Fenway Park":          { rank: 4,  label: "🟢 #4 — 60°F / 5.8mph / Green Monster LHB",      color: "#ffb347" },
  "loanDepot park":       { rank: 5,  label: "🔥 #5 — Open Roof / 82°F / 12.8mph Wind",        color: "#ffb347" },
  "Comerica Park":        { rank: 6,  label: "💣 #6 — Flaherty 5.33 ERA / 1.74 WHIP",          color: "#ffb347" },
  "PNC Park":             { rank: 7,  label: "🌤️ #7 — Outdoor Evening / Medium Park",          color: "#b0bec5" },
  "Busch Stadium":        { rank: 8,  label: "🌤️ #8 — Neutral / LAD Power Targets",            color: "#b0bec5" },
  "Target Field":         { rank: 9,  label: "🌤️ #9 — Cool Evening / Corbin LHP vs. MIN",      color: "#b0bec5" },
  "Angel Stadium":        { rank: 10, label: "🌤️ #10 — Warm Night / Neutral Park",             color: "#b0bec5" },
  "Nationals Park":       { rank: 11, label: "🌤️ #11 — Neutral Outdoor / MIL@WSH",             color: "#b0bec5" },
  "T-Mobile Park":        { rank: 12, label: "🏟️ #12 — Roof Likely Open / Seattle May",        color: "#b0bec5" },
  "Sutter Health Park":   { rank: 13, label: "🌤️ #13 — Sacramento 79°F Warm Outdoor",          color: "#b0bec5" },
};

const players = [

  // ── ATL@COL — Coors Field — 52°F — W-NW Gusts 30mph — Holmes 3.62 ERA vs Quintana 4.91 ERA ──
  {
    id: 1,
    name: "Matt Olson",
    team: "ATL",
    tier: "S",
    park: "Coors Field",
    pitcher: "José Quintana",
    pitcherNote: "Quintana: 4.91 ERA, 1-2 record — 9 K in 5+ starts, contact-prone at altitude",
    matchupGrade: "A+",
    estOdds: "+280",
    note: "Olson is posting a 96th-percentile barrel rate and owns elite left-handed pull power to right field — the exact profile that explodes at Coors Field with a WNW wind howling at 30-mph gusts. Quintana's 4.91 ERA and career-low strikeout rate against left-handed pull hitters make Olson the single best HR play on tonight's 15-game slate.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 2,
    name: "Austin Riley",
    team: "ATL",
    tier: "S",
    park: "Coors Field",
    pitcher: "José Quintana",
    pitcherNote: "Quintana: 4.91 ERA — elevated contact rate vs. RHB power hitters this month",
    matchupGrade: "A+",
    estOdds: "+300",
    note: "Riley is one of baseball's most dangerous right-handed power threats and has posted a 94th-percentile exit velocity while mashing southpaws at a historically elite clip. Coors Field with WNW gusts to 30 mph and Quintana's deteriorating contact profile make Riley a certified S-tier run at the #1 HR park in baseball.",
    tags: ["👑 MVP/Elite", "💨 Wind Boost", "💣 SP Disaster"]
  },
  {
    id: 3,
    name: "Marcell Ozuna",
    team: "ATL",
    tier: "A",
    park: "Coors Field",
    pitcher: "José Quintana",
    pitcherNote: "Quintana: 4.91 ERA — RHB ISO against him is elevated through 5 starts",
    matchupGrade: "A",
    estOdds: "+370",
    note: "Ozuna provides the most dangerous right-handed pull power in Atlanta's lineup after Riley and has historically punished left-handed pitching with a career .520+ SLG vs. LHP. The Coors Field altitude combined with 30-mph wind gusts and Quintana's struggles make every Ozuna fly ball a live HR candidate tonight.",
    tags: ["🔥 Hot", "💨 Wind Boost", "💣 SP Disaster"]
  },
  {
    id: 4,
    name: "Michael Harris II",
    team: "ATL",
    tier: "B",
    park: "Coors Field",
    pitcher: "José Quintana",
    pitcherNote: "Quintana: limited swing-and-miss stuff — Harris's speed-power combo thrives vs. softies",
    matchupGrade: "A-",
    estOdds: "+460",
    note: "Harris is posting an improved power profile in 2026 with a pull-side approach that benefits from Coors Field's thin air and tonight's WNW wind. At plus-money, he's an excellent stack-completor in ATL-side Coors parlays targeting Quintana's contact-prone approach.",
    tags: ["💨 Wind Boost", "💰 Value", "📈 Breakout"]
  },
  {
    id: 5,
    name: "Brenton Doyle",
    team: "COL",
    tier: "A",
    park: "Coors Field",
    pitcher: "Grant Holmes",
    pitcherNote: "Holmes: 3.62 ERA in 5 starts — pitching at Coors erases ERA context entirely",
    matchupGrade: "A",
    estOdds: "+350",
    note: "Doyle is one of baseball's most dangerous center field power threats at Coors Field, posting a 93rd-percentile hard-hit rate and pulling the ball with elite authority to left-center. Holmes's 3.62 ERA is functionally irrelevant at altitude with 30-mph gusts — any hard contact at Coors tonight is a potential HR.",
    tags: ["🔥 Hot", "💨 Wind Boost"]
  },
  {
    id: 6,
    name: "Ezequiel Tovar",
    team: "COL",
    tier: "A",
    park: "Coors Field",
    pitcher: "Grant Holmes",
    pitcherNote: "Holmes: 2-1, 3.62 ERA — xFIP inflates above surface ERA at altitude in his career",
    matchupGrade: "A",
    estOdds: "+380",
    note: "Tovar is Colorado's most explosive young power bat from the right side, posting top-25 AL/NL SS exit velocity metrics and a pull approach that plays perfectly in Coors Field's right-center alley. With tonight's 30-mph gusts and Holmes pitching in a park where physics work against all starters, Tovar at this price is a premier A-tier value.",
    tags: ["📈 Breakout", "💨 Wind Boost", "💰 Value"]
  },
  {
    id: 7,
    name: "Michael Toglia",
    team: "COL",
    tier: "B",
    park: "Coors Field",
    pitcher: "Grant Holmes",
    pitcherNote: "Holmes: ERA figures don't account for his career Coors splits — xFIP suggests regression",
    matchupGrade: "B+",
    estOdds: "+500",
    note: "Toglia is a left-handed power bat at first base who is ideally constructed for Coors Field's RF-alley dimensions, posting a 91st-percentile exit velocity in April. Holmes pitching in Colorado with WNW gusts to 30 mph is essentially a weather-forced regression for any ERA claim — Toglia at value odds is a strong stack-completor.",
    tags: ["💨 Wind Boost", "💰 Value"]
  },
  {
    id: 8,
    name: "Ryan McMahon",
    team: "COL",
    tier: "B",
    park: "Coors Field",
    pitcher: "Grant Holmes",
    pitcherNote: "Holmes: young arm — McMahon's home-road ISO split is massive at Coors",
    matchupGrade: "B+",
    estOdds: "+490",
    note: "McMahon posts a career .230+ ISO at Coors Field — nearly double his road ISO — making him one of the clearest home-park beneficiaries in baseball. Tonight's 30-mph WNW gusts and Holmes's pitching assignment at altitude give McMahon a legitimate B-tier ceiling at solid value odds.",
    tags: ["💨 Wind Boost", "💰 Value"]
  },

  // ── TEX@DET — Comerica Park — Jack Flaherty 5.33 ERA / 1.74 WHIP / 22 BB in 25.1 IP ──
  {
    id: 9,
    name: "Corey Seager",
    team: "TEX",
    tier: "S",
    park: "Comerica Park",
    pitcher: "Jack Flaherty",
    pitcherNote: "Flaherty: 5.33 ERA, 1.74 WHIP, 22 BBs in 25.1 IP — 0-2, worst walk rate in AL",
    matchupGrade: "A+",
    estOdds: "+270",
    note: "Seager is the most dangerous left-handed power hitter in the AL, posting a 97th-percentile barrel rate with a pull approach that demolishes high-walk, elevated-contact pitchers like Flaherty. An 0-2 record, 1.74 WHIP, and 22 walks in 25 innings means Flaherty essentially puts himself in danger every inning — Seager at the top of the Texas lineup is the best S-tier context on tonight's slate.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 10,
    name: "Wyatt Langford",
    team: "TEX",
    tier: "A",
    park: "Comerica Park",
    pitcher: "Jack Flaherty",
    pitcherNote: "Flaherty: 5.33 ERA, arm-angle issues — Langford's exit velocity is exploding in 2026",
    matchupGrade: "A+",
    estOdds: "+330",
    note: "Langford is the breakout star of 2026, posting a 95th-percentile hard-hit rate and a pull-side flyball approach that is perfectly calibrated to punish pitchers with Flaherty's elevated walk rate and contact-prone tendencies. Texas's young power threat against a disaster-start arm at Comerica is one of the most compelling A-tier stacks on the board.",
    tags: ["📈 Breakout", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 11,
    name: "Marcus Semien",
    team: "TEX",
    tier: "B",
    park: "Comerica Park",
    pitcher: "Jack Flaherty",
    pitcherNote: "Flaherty: 22 BBs in 25.1 IP — Semien's discipline exploits walk-heavy arms perfectly",
    matchupGrade: "A-",
    estOdds: "+450",
    note: "Semien is one of baseball's most consistent power producers from the right side and has posted double-digit HR totals through the first month of the season. Flaherty's career-high walk rate and 5.33 ERA make the entire Texas lineup dangerous — Semien provides excellent parlay value as a stack-completor behind Seager.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 12,
    name: "Josh Jung",
    team: "TEX",
    tier: "B",
    park: "Comerica Park",
    pitcher: "Jack Flaherty",
    pitcherNote: "Flaherty: 0-2, 5.33 ERA — Jung's pull power from the right side targets elevated pitches",
    matchupGrade: "A-",
    estOdds: "+480",
    note: "Jung is posting his best power season as a Ranger, developing a pull-side HR profile that is specifically dangerous against control-challenged starters who leave elevated four-seamers over the plate. Flaherty's ongoing 2026 meltdown gives Jung a legitimate B-tier opportunity at Comerica tonight.",
    tags: ["💣 SP Disaster", "💰 Value", "📈 Breakout"]
  },
  {
    id: 13,
    name: "Nathaniel Lowe",
    team: "TEX",
    tier: "C",
    park: "Comerica Park",
    pitcher: "Jack Flaherty",
    pitcherNote: "Flaherty: 5.33 ERA — Lowe rarely mashes HRs despite good contact metrics",
    matchupGrade: "B",
    estOdds: "+750",
    note: "Lowe is a high-contact first baseman whose HR rate is low relative to his quality of contact, making him a lottery-ceiling play even against a disaster arm. The only rationale here is Flaherty's complete 2026 collapse — if tonight goes sideways for DET's starter, Lowe hitting behind the middle of the Rangers order could catch a meatball.",
    tags: ["🎰 Longshot", "💰 Value"]
  },

  // ── AZ@CHC — Wrigley Field — 44°F — 11.4mph South Wind Out — Colin Rea vs Zac Gallen ──
  {
    id: 14,
    name: "Ian Happ",
    team: "CHC",
    tier: "A",
    park: "Wrigley Field",
    pitcher: "Zac Gallen",
    pitcherNote: "Gallen: solid mid-rotation arm but 44°F Wrigley wind-out negates pitcher advantage",
    matchupGrade: "A-",
    estOdds: "+340",
    note: "Happ is the Cubs' most reliable left-handed power threat, posting a top-20 NL outfielder barrel rate and historically crushing right-handed pitching at Wrigley Field with elevated production in wind-out environments. The 11.4-mph south wind blowing out to left-center today makes every Happ pull fly a viable HR candidate against Gallen's contact-driven approach.",
    tags: ["🌬️ Wind Boost", "🔥 Hot"]
  },
  {
    id: 15,
    name: "Seiya Suzuki",
    team: "CHC",
    tier: "B",
    park: "Wrigley Field",
    pitcher: "Zac Gallen",
    pitcherNote: "Gallen: elevated contact rate recently — Suzuki feasts on pitch-to-contact arms",
    matchupGrade: "B+",
    estOdds: "+470",
    note: "Suzuki is one of baseball's most disciplined right-handed power hitters and uses a pull approach that targets Wrigley's left-center alley — precisely where today's south wind is blowing. Gallen's contact-first approach with a declining whiff rate gives Suzuki genuine B-tier upside in a wind-boosted Wrigley afternoon.",
    tags: ["🌬️ Wind Boost", "💰 Value"]
  },
  {
    id: 16,
    name: "Corbin Carroll",
    team: "AZ",
    tier: "A",
    park: "Wrigley Field",
    pitcher: "Colin Rea",
    pitcherNote: "Rea: back-end rotation starter — contact rate against is climbing through April",
    matchupGrade: "A-",
    estOdds: "+360",
    note: "Carroll homered recently and brings a 93rd-percentile sprint speed combined with genuine pull-power pop to a Wrigley Field environment primed by 11.4-mph outbound wind. Rea's contact-prone approach and Wrigley's HR dimensions on a wind-boosted spring afternoon make Carroll a compelling A-tier run-back at this price.",
    tags: ["♻️ Run Back", "🌬️ Wind Boost", "🔥 Hot"]
  },
  {
    id: 17,
    name: "Ketel Marte",
    team: "AZ",
    tier: "B",
    park: "Wrigley Field",
    pitcher: "Colin Rea",
    pitcherNote: "Rea: softer arm — Marte's switch-hit approach gives him extra pull angles",
    matchupGrade: "B+",
    estOdds: "+490",
    note: "Marte is a switch-hitter who attacks both sides with power and is posting a strong April barrel rate from the left side against right-handed pitching. Today's Wrigley wind context and Rea's contact-prone profile make Marte a solid B-tier stack option behind Carroll for Arizona parlays.",
    tags: ["🌬️ Wind Boost", "💰 Value"]
  },
  {
    id: 18,
    name: "Christian Walker",
    team: "AZ",
    tier: "B",
    park: "Wrigley Field",
    pitcher: "Colin Rea",
    pitcherNote: "Rea: soft four-seamer — Walker's right-handed pull power targets this profile exactly",
    matchupGrade: "B+",
    estOdds: "+500",
    note: "Walker is a right-handed pull power hitter who posts a 94th-percentile average exit velocity and excels against soft-contact starters who allow elevated flyball rates. The 11.4-mph Wrigley outbound wind today gives Walker's hard pull contact genuine home run carry on balls that would die at the track in calm conditions.",
    tags: ["🌬️ Wind Boost", "💰 Value"]
  },

  // ── BAL@NYY — Yankee Stadium — 63°F — 9.2mph Wind — Will Warren 2.59 ERA vs Cade Povich ──
  {
    id: 19,
    name: "Aaron Judge",
    team: "NYY",
    tier: "S",
    park: "Yankee Stadium",
    pitcher: "Cade Povich",
    pitcherNote: "Povich: career 5.21 ERA — elevated contact rate against, Yankee Stadium plays HR-friendly",
    matchupGrade: "A+",
    estOdds: "+260",
    note: "Judge is the most feared right-handed power hitter in baseball and owns a 99th-percentile barrel rate with elite pull power to Yankee Stadium's short right-field porch. Povich's career 5.21 ERA and above-average contact rate make every Judge fly ball in a 63°F Yankees environment a must-watch HR candidate.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 20,
    name: "Jasson Dominguez",
    team: "NYY",
    tier: "B",
    park: "Yankee Stadium",
    pitcher: "Cade Povich",
    pitcherNote: "Povich: career 5.21 ERA — Dominguez's raw power shines against contact-prone arms",
    matchupGrade: "A-",
    estOdds: "+470",
    note: "Dominguez is emerging as one of the AL's most dangerous young power threats with an elite exit velocity and a pull-heavy approach that converts Yankee Stadium's short porch into a premium HR environment. Povich's contact-prone ERA profile and the 63°F temperature make this breakout candidate a live B-tier shot.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 21,
    name: "Anthony Volpe",
    team: "NYY",
    tier: "B",
    park: "Yankee Stadium",
    pitcher: "Cade Povich",
    pitcherNote: "Povich: elevated BABIP-driven ERA — Volpe's improved power in 2026 is underrated",
    matchupGrade: "B+",
    estOdds: "+510",
    note: "Volpe is showing improved pull power after returning from his rehab stint, posting a career-high ISO through April with a swing that is now calibrated for Yankee Stadium's right-field seats. Povich pitching in the Bronx with his career 5.21 ERA gives Volpe a legitimate B-tier opportunity at this price point.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 22,
    name: "Gunnar Henderson",
    team: "BAL",
    tier: "B",
    park: "Yankee Stadium",
    pitcher: "Will Warren",
    pitcherNote: "Warren: 3-0, 2.59 ERA — elite arm; Henderson's raw power can overcome any matchup",
    matchupGrade: "B",
    estOdds: "+480",
    note: "Henderson is one of baseball's most explosive young power hitters with a 96th-percentile barrel rate, and Yankee Stadium's short right-field dimensions give even a tough matchup upside potential. Warren is sharp this season but Henderson's elite raw power means any mistake pitch can end up in the seats — a B-tier lottery angle at value odds.",
    tags: ["👑 MVP/Elite", "💰 Value", "🎰 Longshot"]
  },
  {
    id: 23,
    name: "Adley Rutschman",
    team: "BAL",
    tier: "C",
    park: "Yankee Stadium",
    pitcher: "Will Warren",
    pitcherNote: "Warren: 2.59 ERA, 3-0 — one of the AL's sharpest arms on the slate tonight",
    matchupGrade: "C+",
    estOdds: "+780",
    note: "Rutschman is a switch-hitter with genuine power from the left side, and Yankee Stadium gives every left-handed pull bat a structural HR advantage. Warren is a tough matchup but Rutschman's elite walk rate and professional approach mean he will always get pitches to hit — this is a pure longshot at a great ballpark.",
    tags: ["🎰 Longshot", "💰 Value"]
  },

  // ── HOU@BOS — Fenway Park — 60°F — 5.8mph Wind — Mike Burrows vs Connelly Early ──
  {
    id: 24,
    name: "Yordan Alvarez",
    team: "HOU",
    tier: "S",
    park: "Fenway Park",
    pitcher: "Connelly Early",
    pitcherNote: "Early: young BOS starter — limited MLB track record, velocity concerns early in 2026",
    matchupGrade: "A+",
    estOdds: "+275",
    note: "Alvarez is the most feared left-handed power bat in the AL and hits Fenway Park's Green Monster like a personal target — his left-handed pull power is precisely calibrated for the 315-foot left-field wall. Early's limited MLB experience and developing stuff make Alvarez a nearly automatic S-tier HR threat in tonight's 60°F Fenway environment.",
    tags: ["👑 MVP/Elite", "🔥 Hot", "💣 SP Disaster"]
  },
  {
    id: 25,
    name: "Rafael Devers",
    team: "BOS",
    tier: "A",
    park: "Fenway Park",
    pitcher: "Mike Burrows",
    pitcherNote: "Burrows: HOU young arm — contact rate elevated in road starts this season",
    matchupGrade: "A",
    estOdds: "+350",
    note: "Devers is Boston's most dangerous right-handed power threat and owns a career .570+ SLG at Fenway Park, where his pull approach targets the Green Monster's short porch with elite consistency. Burrows pitching on the road at Fenway in cool 60°F weather gives Devers premium A-tier HR context in one of baseball's premier bandbox environments.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 26,
    name: "Jarren Duran",
    team: "BOS",
    tier: "B",
    park: "Fenway Park",
    pitcher: "Mike Burrows",
    pitcherNote: "Burrows: HOU starter on the road — Duran's power growth in 2026 is underrated",
    matchupGrade: "A-",
    estOdds: "+460",
    note: "Duran has developed a pull-power approach at Fenway that is exploiting the Green Monster at a career-best rate, with improved launch angle mechanics and an exit velocity trending into the 91st percentile. Burrows' elevated road contact rate combined with Fenway's unique HR architecture makes Duran a premium value B-tier target tonight.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 27,
    name: "Alex Bregman",
    team: "BOS",
    tier: "B",
    park: "Fenway Park",
    pitcher: "Mike Burrows",
    pitcherNote: "Burrows: young arm with road ERA above 4.50 — Bregman is healthy after foot scare",
    matchupGrade: "B+",
    estOdds: "+490",
    note: "Bregman cleared his foot injury concern and is back in Boston's lineup, bringing a career .520+ OPS at Fenway with a right-handed pull approach that targets the Monster's inviting left-field wall. With Burrows struggling on the road and Fenway at 60°F, Bregman is a reliable B-tier completor in BOS power stacks tonight.",
    tags: ["💰 Value", "🔥 Hot"]
  },
  {
    id: 28,
    name: "Jose Altuve",
    team: "HOU",
    tier: "C",
    park: "Fenway Park",
    pitcher: "Connelly Early",
    pitcherNote: "Early: inexperienced arm — Altuve's HR rate is low relative to contact quality",
    matchupGrade: "B-",
    estOdds: "+720",
    note: "Altuve rarely goes deep — his HR rate is structurally low due to his 5-foot-6 frame and ground-ball tendencies — but Fenway's Green Monster creates a unique HR scenario for pull-side line drives. This is a pure lottery-ceiling play: if Early hangs a breaking ball and Altuve pulls it high toward the left-field wall, Fenway does the rest.",
    tags: ["🎰 Longshot", "💰 Value"]
  },

  // ── PHI@MIA — loanDepot park — Open Roof — 82°F — 12.8mph Wind — Eury Pérez 4.15 ERA ──
  {
    id: 29,
    name: "Kyle Schwarber",
    team: "PHI",
    tier: "S",
    park: "loanDepot park",
    pitcher: "Eury Pérez",
    pitcherNote: "Pérez: 4.15 ERA, 2-1, 27 K in 26 IP — walk rate creeping toward career-high",
    matchupGrade: "A+",
    estOdds: "+290",
    note: "Schwarber leads all of baseball in HR vs. right-handed pitching and has elite left-handed pull power that performs anywhere with a warm-air context — tonight's open-roof 82°F Miami heat is exactly that. Pérez's 4.15 ERA and elevated walk rate combined with the Phillies' leadoff hammer make this a must-play S-tier matchup.",
    tags: ["👑 MVP/Elite", "🔥 Hot", "💣 SP Disaster"]
  },
  {
    id: 30,
    name: "Bryce Harper",
    team: "PHI",
    tier: "A",
    park: "loanDepot park",
    pitcher: "Eury Pérez",
    pitcherNote: "Pérez: 4.15 ERA — RHB pulling Pérez's four-seamer is a 2026 statistical issue",
    matchupGrade: "A+",
    estOdds: "+310",
    note: "Harper is posting a 97th-percentile barrel rate and an elite .980+ OPS through April, making him the most dangerous right-handed power threat in Miami tonight. Pérez's 4.15 ERA and the warm open-roof loanDepot environment push Harper into a premium A-tier play right behind Schwarber in Philadelphia's power-loaded order.",
    tags: ["👑 MVP/Elite", "💣 SP Disaster", "🔥 Hot"]
  },
  {
    id: 31,
    name: "Trea Turner",
    team: "PHI",
    tier: "A",
    park: "loanDepot park",
    pitcher: "Eury Pérez",
    pitcherNote: "Pérez: 4.15 ERA — Turner's bat speed is tailor-made to attack elevated four-seamers",
    matchupGrade: "A",
    estOdds: "+380",
    note: "Turner is having one of his best April power stretches, posting a 93rd-percentile hard-hit rate and a pull-ISO profile that specifically demolishes pitchers who leave elevated fastballs in the zone. The warm Miami air and Pérez's elevated contact rate give Turner genuine A-tier HR equity tonight at loanDepot.",
    tags: ["🔥 Hot", "💣 SP Disaster"]
  },
  {
    id: 32,
    name: "Alec Bohm",
    team: "PHI",
    tier: "B",
    park: "loanDepot park",
    pitcher: "Eury Pérez",
    pitcherNote: "Pérez: 4.15 ERA — Bohm's contact-power combo is ideal against developing arms",
    matchupGrade: "A-",
    estOdds: "+450",
    note: "Bohm is hitting .310+ away from Philadelphia and uses a contact-power approach that punishes developing starters with elevated ERA profiles. Behind Harper and Turner in the order, Bohm gets high-quality plate appearances against a tiring Pérez — making him an excellent B-tier stack-completor in PHI@MIA parlays.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 33,
    name: "Nick Castellanos",
    team: "PHI",
    tier: "B",
    park: "loanDepot park",
    pitcher: "Eury Pérez",
    pitcherNote: "Pérez: elevated ISO allowed vs. right-handed pull hitters through 5 starts",
    matchupGrade: "B+",
    estOdds: "+480",
    note: "Castellanos hits the ball hard to right-center with a pull approach that produces premium HR probability in warm-air outdoor environments, and 82°F Miami is exactly that context. Pérez's elevated ERA and tonight's warm open-roof conditions give Castellanos solid B-tier value as the fifth piece of the Phillies' stack.",
    tags: ["💣 SP Disaster", "💰 Value"]
  },
  {
    id: 34,
    name: "Jake Burger",
    team: "MIA",
    tier: "C",
    park: "loanDepot park",
    pitcher: "Zack Wheeler",
    pitcherNote: "Wheeler: elite RHP, sub-2.50 ERA — Burger's raw power is his only path tonight",
    matchupGrade: "C+",
    estOdds: "+820",
    note: "Burger is one of baseball's most underrated raw power threats with a 95th-percentile exit velocity — the only question is whether he can make contact against an elite arm like Wheeler. Wheeler will dominate this matchup 9 times out of 10, but when Burger does connect, the ball travels — this is a pure meatball-lottery play at loanDepot.",
    tags: ["🎰 Longshot", "💰 Value"]
  },

  // ── LAD@STL — Busch Stadium — Matthew Liberatore vs Emmet Sheehan ──
  {
    id: 35,
    name: "Shohei Ohtani",
    team: "LAD",
    tier: "A",
    park: "Busch Stadium",
    pitcher: "Matthew Liberatore",
    pitcherNote: "Liberatore: STL mid-rotation LHP — career-high contact rate allowed in 2026",
    matchupGrade: "A",
    estOdds: "+310",
    note: "Ohtani is one of the most dangerous hitters in baseball history and attacks left-handed pitching with a 98th-percentile barrel rate and devastating pull power to Busch Stadium's right-center field. Liberatore's career-high contact rate and elevated HR-per-fly-ball ratio make every Ohtani at-bat a legitimate HR threat tonight in St. Louis.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 36,
    name: "Kyle Tucker",
    team: "LAD",
    tier: "A",
    park: "Busch Stadium",
    pitcher: "Matthew Liberatore",
    pitcherNote: "Liberatore: LHP — Tucker mashes southpaws with a career .580+ SLG vs. lefties",
    matchupGrade: "A",
    estOdds: "+340",
    note: "Tucker signed with the Dodgers this offseason and immediately provides one of baseball's most reliable power-speed profiles, combining a 94th-percentile hard-hit rate with a pull approach that specifically dominates left-handed pitching. Liberatore's elevated contact metrics and Busch Stadium's neutral dimensions give Tucker a strong A-tier context tonight.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 37,
    name: "Freddie Freeman",
    team: "LAD",
    tier: "A",
    park: "Busch Stadium",
    pitcher: "Matthew Liberatore",
    pitcherNote: "Liberatore: LHP — Freeman's left-handed pull power feasts on soft southpaws",
    matchupGrade: "A",
    estOdds: "+360",
    note: "Freeman is one of the most disciplined left-handed power hitters in baseball and historically demolishes left-handed pitching with a career .600+ SLG vs. LHP and an elite pull approach. Liberatore's career-high contact rate and the Dodgers' premium lineup position give Freeman legitimate A-tier HR equity in Busch Stadium tonight.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 38,
    name: "Nolan Gorman",
    team: "STL",
    tier: "B",
    park: "Busch Stadium",
    pitcher: "Emmet Sheehan",
    pitcherNote: "Sheehan: young LAD arm — elevated home HR rate vs. LHB pull hitters in 2026",
    matchupGrade: "B+",
    estOdds: "+500",
    note: "Gorman is St. Louis's most explosive power threat — a left-handed pull masher posting a career-best exit velocity and HR pace in 2026 with raw power that plays in any environment. Sheehan's elevated contact rate against lefties and Busch Stadium's home dimensions give Gorman a genuine B-tier opportunity against the LAD staff.",
    tags: ["📈 Breakout", "💰 Value"]
  },
  {
    id: 39,
    name: "Paul Goldschmidt",
    team: "STL",
    tier: "C",
    park: "Busch Stadium",
    pitcher: "Emmet Sheehan",
    pitcherNote: "Sheehan: sharp young arm — Goldschmidt's power metrics are declining in 2026",
    matchupGrade: "C+",
    estOdds: "+750",
    note: "Goldschmidt's HR pace has declined from his peak years but he retains legitimate pull power to left-center at Busch Stadium that gives him a structural HR ceiling in his home park. Sheehan is a tough matchup, but Goldschmidt's experience and situational plate discipline mean he'll always see a few hittable pitches — making this a pure meatball-lottery play.",
    tags: ["🎰 Longshot", "💰 Value"]
  },

  // ── TOR@MIN — Target Field — Patrick Corbin vs Simeon Woods Richardson ──
  {
    id: 40,
    name: "Vladimir Guerrero Jr.",
    team: "TOR",
    tier: "A",
    park: "Target Field",
    pitcher: "Simeon Woods Richardson",
    pitcherNote: "Woods Richardson: MIN mid-rotation RHP — elevated contact rate vs. RHB power",
    matchupGrade: "A",
    estOdds: "+330",
    note: "Guerrero is posting one of his best April power stretches with a 95th-percentile barrel rate and a career-high ISO vs. right-handed pitching — making him the most dangerous bat in Toronto's lineup on any given night. Woods Richardson's contact-prone approach and Target Field's HR-neutral park give Guerrero a quality A-tier HR context tonight.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 41,
    name: "George Springer",
    team: "TOR",
    tier: "B",
    park: "Target Field",
    pitcher: "Simeon Woods Richardson",
    pitcherNote: "Woods Richardson: low-velocity starter — Springer feasts on elevated fastballs",
    matchupGrade: "A-",
    estOdds: "+470",
    note: "Springer is in one of his best power stretches of the season, posting a 92nd-percentile hard-hit rate and targeting elevated pitches against contact-heavy starters with pinpoint discipline. Woods Richardson's lower velocity and Target Field's standard dimensions give Springer a live B-tier HR angle tonight behind Guerrero.",
    tags: ["🔥 Hot", "💰 Value"]
  },
  {
    id: 42,
    name: "Byron Buxton",
    team: "MIN",
    tier: "B",
    park: "Target Field",
    pitcher: "Patrick Corbin",
    pitcherNote: "Corbin: veteran LHP — diminished stuff makes RHB pull power dangerous",
    matchupGrade: "A-",
    estOdds: "+450",
    note: "Buxton is a 97th-percentile exit velocity machine on days when healthy and punishes left-handed pitching with a pure pull-power approach that converts Target Field's dimensions into premium HR probability. Corbin's declining velocity and 2026 command issues give Buxton a legitimate B-tier opportunity as Minnesota's most dangerous bat.",
    tags: ["💰 Value", "🔥 Hot"]
  },
  {
    id: 43,
    name: "Bo Bichette",
    team: "TOR",
    tier: "C",
    park: "Target Field",
    pitcher: "Simeon Woods Richardson",
    pitcherNote: "Woods Richardson: generates solid groundball rate — Bichette's HR rate is low",
    matchupGrade: "B-",
    estOdds: "+720",
    note: "Bichette is improving his flyball rate in 2026 and occasionally punishes elevated pitches with pull-side pop, but his structural HR rate remains below his contact quality would suggest. This is a value lottery play — if Bichette connects on a Woods Richardson mistake, Target Field's average dimensions can carry the ball over.",
    tags: ["🎰 Longshot", "💰 Value"]
  },

  // ── NYM@LAA — Angel Stadium — Juan Soto DH / Lindor / Alonso ──
  {
    id: 44,
    name: "Juan Soto",
    team: "NYM",
    tier: "A",
    park: "Angel Stadium",
    pitcher: "José Quintana",
    pitcherNote: "LAA starter: Quintana-type contact arm — Soto's OPS elite even on DH duty",
    matchupGrade: "A",
    estOdds: "+300",
    note: "Soto's forearm is improving and he remains the Mets' most feared power bat even in designated hitter mode, posting a 97th-percentile barrel rate and an elite OPS through a difficult April. Playing at warm Angel Stadium with his forearm progressing well gives Soto a prime A-tier HR context as New York's cleanup anchor tonight.",
    tags: ["👑 MVP/Elite", "🔥 Hot"]
  },
  {
    id: 45,
    name: "Pete Alonso",
    team: "NYM",
    tier: "B",
    park: "Angel Stadium",
    pitcher: "José Quintana",
    pitcherNote: "LAA starter: limited strikeout upside — Alonso's raw power dominates contact arms",
    matchupGrade: "A-",
    estOdds: "+440",
    note: "Alonso is one of the game's elite right-handed power threats and homes in on contact-first starters with a pull-heavy approach that generates 95th-percentile exit velocity at his best. Angel Stadium's neutral dimensions and tonight's warm Southern California night give Alonso a live B-tier HR opportunity behind Soto in the Mets' order.",
    tags: ["👑 MVP/Elite", "💰 Value"]
  },
  {
    id: 46,
    name: "Francisco Lindor",
    team: "NYM",
    tier: "C",
    park: "Angel Stadium",
    pitcher: "José Quintana",
    pitcherNote: "LAA starter: contact profile — Lindor is not a consistent HR threat away from Citi",
    matchupGrade: "B-",
    estOdds: "+690",
    note: "Lindor is the Mets' most complete player but his HR production is skewed toward home park contexts — at neutral Angel Stadium, his power floor drops. The only rationale is the contact pitcher on the mound for LAA and a warm Southern California night, making this a C-tier longshot that rounds out NYM parlays.",
    tags: ["🎰 Longshot", "💰 Value"]
  },

  // ── CIN@PIT — PNC Park ──
  {
    id: 47,
    name: "Oneil Cruz",
    team: "PIT",
    tier: "B",
    park: "PNC Park",
    pitcher: "Hunter Greene",
    pitcherNote: "Greene: CIN ace — sub-3 ERA, but Cruz's raw power can beat any arm on a given night",
    matchupGrade: "B",
    estOdds: "+490",
    note: "Cruz owns one of the hardest average exit velocities in baseball at 96th-percentile and is PNC Park's most feared left-handed power threat with two HR against top starters this season already. Greene is elite but Cruz's raw power ceiling means that any middle-of-the-plate fastball becomes a HR candidate regardless of pitcher quality.",
    tags: ["👑 MVP/Elite", "💰 Value", "🎰 Longshot"]
  },

  // ── MIL@WSH — Nationals Park ──
  {
    id: 48,
    name: "William Contreras",
    team: "MIL",
    tier: "C",
    park: "Nationals Park",
    pitcher: "Jake Irvin",
    pitcherNote: "Irvin: WSH starter, 4.20 ERA — Contreras is a power catcher who rarely catches up to fastballs",
    matchupGrade: "C+",
    estOdds: "+760",
    note: "Contreras is Milwaukee's starting catcher with genuine pull-side power who has posted a 91st-percentile hard-hit rate against right-handed pitching in April. Irvin's 4.20 ERA and Nationals Park's neutral outdoor dimensions make this a value lottery play for MIL parlay construction — if Contreras gets an elevated pitch, the power is real.",
    tags: ["🎰 Longshot", "💰 Value"]
  },

  // ── KC@SEA — T-Mobile Park ──
  {
    id: 49,
    name: "Salvador Perez",
    team: "KC",
    tier: "C",
    park: "T-Mobile Park",
    pitcher: "Bryan Woo",
    pitcherNote: "Woo: SEA starter — solid arm but Perez has historically launched HRs at T-Mobile",
    matchupGrade: "C+",
    estOdds: "+800",
    note: "Perez is Kansas City's most dangerous power threat with a career .490+ SLG vs. right-handed pitching and a pull-right approach that has produced multiple HR at T-Mobile Park historically. Woo is a solid SEA arm but Perez's elite raw power means one mistake pitch at the T-Mobile roof tonight could produce a thunder-strike HR.",
    tags: ["🎰 Longshot", "💰 Value"]
  },

  // ── CLE@OAK — Sutter Health Park — Sacramento 79°F ──
  {
    id: 50,
    name: "Brent Rooker",
    team: "OAK",
    tier: "C",
    park: "Sutter Health Park",
    pitcher: "Joey Cantillo",
    pitcherNote: "Cantillo: CLE LHP — limited MLB track record, Rooker mashes lefties at Sacramento",
    matchupGrade: "B-",
    estOdds: "+680",
    note: "Rooker is the Athletics' most dangerous right-handed power threat and historically demolishes left-handed pitching at Sacramento's warm 79°F outdoor environment, posting a 95th-percentile EV in April. Cantillo's limited MLB track record and the warm Sacramento night make Rooker a live C-tier longshot — one mistake pitch at Sutter Health Park travels a long way.",
    tags: ["🎰 Longshot", "💰 Value", "💣 SP Disaster"]
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
    description: "The 4 highest-probability S-tier legs on Friday's 15-game slate.",
    playerIds: [1, 2, 9, 19],
    strategy: "Olson and Riley stack the Coors Field monster — 52°F with WNW gusts to 30 mph and Quintana's 4.91 ERA make every ATL bat a potential HR. Seager targets Flaherty's 5.33 ERA / 1.74 WHIP disaster at Comerica. Judge gets the Yankee Stadium short porch against Povich's 5.21 career ERA. Four elite power hitters in four of the best individual matchup-context combinations on the entire Friday slate."
  },
  {
    id: "4B",
    legs: 4,
    label: "THE S-TIER QUAD",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+1050",
    description: "Four S-tier sluggers in the best park-and-pitcher contexts on Friday.",
    playerIds: [1, 9, 24, 29],
    strategy: "Olson obliterates Quintana at Coors with WNW 30-mph wind, Seager attacks Flaherty's walk-fest at Comerica, Alvarez assaults Connelly Early at Fenway — his pull power is literally calibrated for the Green Monster — and Schwarber opens the PHI power stack against Pérez's 4.15 ERA in warm open-roof Miami. Four elite left-handed power bats in four of the most favorable HR contexts on the board."
  },
  {
    id: "5A",
    legs: 5,
    label: "THE HIGH FIVE",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+2100",
    description: "S-tier anchors from the three best park-and-pitcher matchups on the slate.",
    playerIds: [1, 2, 9, 19, 29],
    strategy: "Olson and Riley form the Coors wind-and-ERA double-stack against Quintana's 4.91 ERA with 30-mph gusts. Seager locks in the Flaherty disaster at Comerica. Judge targets Povich's career 5.21 ERA at Yankee Stadium. Schwarber caps it off against Pérez's 4.15 ERA in open-roof 82°F Miami. Five S-tier power hitters in five of the most complete HR-context combinations on the entire Friday board."
  },
  {
    id: "5B",
    legs: 5,
    label: "THE COORS CRUSHER",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2400",
    description: "Max ATL@COL exposure — both sides of Coors with the best Friday pitching contexts.",
    playerIds: [1, 2, 3, 5, 6],
    strategy: "Olson, Riley, and Ozuna form the full ATL power core against Quintana's 4.91 ERA — three of baseball's most dangerous bats at altitude with 30-mph WNW wind. Doyle and Tovar complete the COL-side stack at home vs. Holmes — even at 3.62 ERA, pitching at Coors tonight with those gusts neutralizes any ERA claim. Five Coors Field bats targeting two mediocre pitchers at the #1 HR park in baseball with monster wind."
  },
  {
    id: "5C",
    legs: 5,
    label: "THE WIND MACHINE",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+2600",
    description: "Stack the two best wind-boosted outdoor parks — Coors and Wrigley.",
    playerIds: [1, 9, 14, 16, 19],
    strategy: "Olson gets the 30-mph WNW Coors monster. Seager attacks Flaherty's disaster ERA at Comerica. Happ and Carroll stack Wrigley Field's south-wind-out day game against Rea's contact-prone profile — 11.4 mph blowing toward left-center on a spring afternoon. Judge anchors with Yankee Stadium's right-field porch vs. Povich. Five hitters in three parks with either wind boosts or pitcher disaster contexts."
  },
  {
    id: "6A",
    legs: 6,
    label: "THE ATL COORS BOMB",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+2900",
    description: "Full ATL-side Coors stack plus the Flaherty disaster at Comerica.",
    playerIds: [1, 2, 3, 4, 9, 10],
    strategy: "Olson, Riley, Ozuna, and Harris II form the complete Atlanta power lineup against Quintana's 4.91 ERA at Coors Field with gusts to 30 mph — four hitters in the best HR environment in baseball. Seager and Langford close with the Texas one-two punch against Flaherty's career-worst ERA / WHIP combo at Comerica. Six elite bats targeting two of the three worst starting pitchers on the Friday night board."
  },
  {
    id: "6B",
    legs: 6,
    label: "THE POWER SUMMIT",
    risk: "Lower Risk",
    riskColor: "#4caf50",
    estPayout: "+3100",
    description: "All six S-tier players assembled for maximum probability concentration.",
    playerIds: [1, 2, 9, 19, 24, 29],
    strategy: "The complete S-tier — Olson, Riley, Seager, Judge, Alvarez, and Schwarber — assembled into one six-leg superstructure spanning five different parks. Each player is the single most dangerous power bat in their respective matchup-context combination tonight: Coors wind + Quintana, Comerica + Flaherty, Yankee Stadium + Povich, Fenway + Early, and loanDepot + Pérez. The highest concentration of power-context probability available in any Friday parlay."
  },
  {
    id: "7A",
    legs: 7,
    label: "THE RUN BACK STACK",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+4800",
    description: "S-tier core plus best run-back and breakout plays across the Friday slate.",
    playerIds: [1, 2, 9, 19, 24, 16, 10],
    strategy: "Olson and Riley anchor the Coors ATL stack. Seager and Langford hit the Flaherty disaster at Comerica — two of Texas's best bats against one of the AL's worst starters. Judge drives home the Yankee Stadium context. Alvarez assaults Early at Fenway. Carroll adds the Wrigley run-back angle — wind out plus a contact pitcher. Seven premium bats spread across four parks in four of the most favorable HR environments on the slate."
  },
  {
    id: "7B",
    legs: 7,
    label: "THE PARK FACTOR",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+5200",
    description: "Target the seven best individual park-factor HR contexts on Friday's 15-game slate.",
    playerIds: [1, 2, 5, 6, 9, 14, 16],
    strategy: "Olson and Riley at Coors (rank 1). Doyle and Tovar as the COL-side Coors home-park stack. Seager exploiting Flaherty's disaster ERA at Comerica (rank 6 but premium SP context). Happ and Carroll splitting the Wrigley wind-out angle (rank 2) — two hitters in the second-best HR park context of the night. Seven hitters across three parks selected purely for park-factor and pitcher-context alignment."
  },
  {
    id: "7C",
    legs: 7,
    label: "THE ELITE SEVEN",
    risk: "Medium Risk",
    riskColor: "#ff9800",
    estPayout: "+4500",
    description: "Seven of Friday's highest-probability individual power-context combinations.",
    playerIds: [1, 9, 19, 24, 29, 35, 36],
    strategy: "Olson (Coors vs. Quintana), Seager (Comerica vs. Flaherty), Judge (Yankee Stadium vs. Povich), Alvarez (Fenway vs. Early), Schwarber (loanDepot vs. Pérez), Ohtani (Busch vs. Liberatore LHP), and Tucker (Busch vs. Liberatore) — seven of the most complete power-context combinations across seven different games on Friday. Each player represents the single best contextual HR play in their respective matchup tonight."
  },
  {
    id: "8A",
    legs: 8,
    label: "THE SLUGGER SUMMIT",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+7800",
    description: "All S-tier players plus top A-tier matchups across the full 15-game slate.",
    playerIds: [1, 2, 9, 19, 24, 29, 30, 5],
    strategy: "Every S-tier player plus Harper and Doyle for maximum probability concentration: Olson, Riley, Seager, Judge, Alvarez, Schwarber all in elite contexts, with Harper adding the second PHI power piece against Pérez's disaster ERA at loanDepot, and Doyle closing the Coors COL-side angle. Eight premium bats covering six parks — the highest-probability eight-leg construction available on tonight's Friday slate."
  },
  {
    id: "8B",
    legs: 8,
    label: "THE VALUE MATRIX",
    risk: "Medium-High Risk",
    riskColor: "#ff5722",
    estPayout: "+8500",
    description: "S-tier anchors plus highest-value underpriced B-tier plays for payout inflation.",
    playerIds: [1, 9, 19, 29, 10, 7, 8, 14],
    strategy: "Olson, Seager, Judge, and Schwarber provide the premium S-tier probability anchors. Then Langford (+330), Toglia (+500), McMahon (+490), and Happ (+340) provide massive value inflation to the total payout. This parlay exploits underpriced odds on two Coors Field COL-side bats and a Wrigley wind-stack bet, while using maximum-probability anchors to protect the ticket's survival odds through the first few legs."
  },
  {
    id: "9A",
    legs: 9,
    label: "THE GRAND SALAMI",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+14500",
    description: "9-leg monster covering every premium context on Friday's full slate.",
    playerIds: [1, 2, 9, 19, 24, 29, 30, 5, 35],
    strategy: "Olson and Riley at Coors, Seager at Comerica vs. Flaherty, Judge at Yankee Stadium vs. Povich, Alvarez at Fenway vs. Early, Schwarber and Harper targeting Pérez in Miami, Doyle completing the Coors COL-side stack, and Ohtani attacking Liberatore at Busch Stadium. Nine elite-level bats across seven different parks covering every premium context on the slate — this is the highest-probability nine-leg ticket available on Friday night."
  },
  {
    id: "9B",
    legs: 9,
    label: "THE DISASTER CHAIN",
    risk: "High Risk",
    riskColor: "#e91e63",
    estPayout: "+16000",
    description: "Chain of pitcher disasters — target the four worst ERA arms on the board.",
    playerIds: [1, 2, 3, 9, 10, 24, 29, 30, 31],
    strategy: "Olson, Riley, and Ozuna form the full ATL Coors stack vs. Quintana (4.91 ERA). Seager and Langford hit Flaherty's complete 2026 meltdown (5.33 ERA, 22 BBs). Alvarez attacks Early at Fenway. Schwarber, Harper, and Turner complete the full PHI power stack against Pérez (4.15 ERA) in warm Miami. Three stacks targeting three pitchers with ERAs above 4.00 — when these arms implode, this ticket becomes legendary."
  },
  {
    id: "10A",
    legs: 10,
    label: "THE LOTTERY TICKET",
    risk: "Max Risk",
    riskColor: "#9c27b0",
    estPayout: "+29000",
    description: "Elite core plus 2 C-tier lottery legs for moon-shot payout potential.",
    playerIds: [1, 2, 9, 19, 24, 29, 30, 5, 28, 23],
    strategy: "Eight premium anchors form the elite backbone: Olson and Riley at Coors, Seager vs. Flaherty, Judge at Yankee Stadium, Alvarez at Fenway, Schwarber and Harper vs. Pérez, Doyle in the Coors COL-side slot. Jose Altuve (+720 C-tier) adds a Fenway Green Monster lottery angle — if he pulls a breaking ball high to left, that 315-foot wall does the work. Rutschman (+780 C-tier) adds the Yankee Stadium longshot angle with his switch-hit power. Hit the two lottery legs and this ticket is life-changing."
  },
];
