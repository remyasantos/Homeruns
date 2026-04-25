// data.js — April 25, 2026
// Games: NYY@HOU · CHC@LAD · DET@CIN · PHI@ATL · WSH@CWS · MIN@TB · PIT@MIL · BOS@BAL
//         SEA@STL · CLE@TOR · ATH@TEX · LAA@KC · MIA@SF · SD@ARI(Mexico City)
// Postponed: COL@NYM (doubleheader Apr 26)

const TEAM_TO_GAME = {
  "BOS": "BOS@BAL",
  "BAL": "BOS@BAL",
  "NYY": "NYY@HOU",
  "HOU": "NYY@HOU",
  "CHC": "CHC@LAD",
  "LAD": "CHC@LAD",
  "DET": "DET@CIN",
  "CIN": "DET@CIN",
  "PHI": "PHI@ATL",
  "ATL": "PHI@ATL",
  "WSH": "WSH@CWS",
  "CWS": "WSH@CWS",
  "MIN": "MIN@TB",
  "TB": "MIN@TB",
  "PIT": "PIT@MIL",
  "MIL": "PIT@MIL",
  "SEA": "SEA@STL",
  "STL": "SEA@STL",
  "CLE": "CLE@TOR",
  "TOR": "CLE@TOR",
  "ATH": "ATH@TEX",
  "TEX": "ATH@TEX",
  "LAA": "LAA@KC",
  "KC": "LAA@KC",
  "MIA": "MIA@SF",
  "SF": "MIA@SF",
  "SD": "SD@ARI",
  "ARI": "SD@ARI"
};

const players = [
  {
    "id": 1,
    "name": "Aaron Judge",
    "team": "NYY",
    "tier": "S",
    "park": "Daikin Park",
    "pitcher": "Mike Burrows",
    "pitcherNote": "6.75 ERA, 1-3 — confirmed disaster arm, best SP disaster on today's board",
    "matchupGrade": "A+",
    "estOdds": "+240",
    "note": "Judge leads the AL with 9 HR and a 25% barrel rate, and now gets the Crawford boxes in left field at Daikin Park (315 ft) with McCullers allowing 3+ runs in three consecutive starts — the short left-field porch plus McCullers' documented regression arc plus Judge's elite pull-power profile is the cleanest individual HR setup on Friday's full 14-game board. At +240, the AL's most dangerous right-handed bat in a short-porch dome vs a cooked SP is the board's top S-tier anchor.",
    "tags": [
      "👑 MVP/Elite",
      "💣 SP Disaster",
      "🔥 Hot",
      "💰 Value"
    ],
    "game": "NYY@HOU"
  },
  {
    "id": 2,
    "name": "Shohei Ohtani",
    "team": "LAD",
    "tier": "S",
    "park": "Dodger Stadium",
    "pitcher": "Colin Rea",
    "pitcherNote": "3.00 ERA, 3-0 — Rea solid, Ohtani still elite HR% regardless",
    "matchupGrade": "B+",
    "estOdds": "+186",
    "note": "Ohtani leads ALL MLB hitters with a 26.5% model-projected HR probability on Friday — Taillon's 6 HR in 22.2 innings is the worst active HR/9 rate among Friday starters, and Dodger Stadium's wind blowing out to center field in ideal temperature conditions maximizes every Ohtani elevated barrel. At +186, the NL MVP facing the most home-run-friendly pitcher on Friday's board at his home park with model-leading HR probability is the floor-highest probability S-tier play of the week.",
    "tags": [
      "👑 MVP/Elite",
      "💣 SP Disaster",
      "💨 Wind Boost",
      "🔥 Hot"
    ],
    "game": "CHC@LAD"
  },
  {
    "id": 3,
    "name": "Munetaka Murakami",
    "team": "CWS",
    "tier": "S",
    "park": "Guaranteed Rate Field",
    "pitcher": "Jake Irvin",
    "pitcherNote": "6.16 ERA, xERA 5.09 — Irvin confirmed regression arm, top disaster play today",
    "matchupGrade": "A",
    "estOdds": "+290",
    "note": "Murakami leads all MLB with 10 HR and an elite 40% HR-per-game rate — Mikolas has allowed 19 runs on 22 hits including 5 HR in 12.1 starter innings, making him the biggest SP regression bomb on Friday's board, and Murakami's 39% air-ball HR conversion rate faces the worst confirmed HR/FB pitcher in today's slate. At +290 for the league's most prolific HR hitter targeting the most vulnerable starting arm on the board, this is the single most underpriced S-tier leg of the week.",
    "tags": [
      "🔥 Hot",
      "💣 SP Disaster",
      "👑 MVP/Elite",
      "♻️ Run Back"
    ],
    "game": "WSH@CWS"
  },
  {
    "id": 5,
    "name": "Max Muncy",
    "team": "LAD",
    "tier": "S",
    "park": "Dodger Stadium",
    "pitcher": "Colin Rea",
    "pitcherNote": "3.00 ERA, 3-0 — solid pitcher, not a HR disaster matchup",
    "matchupGrade": "A+",
    "estOdds": "+290",
    "note": "Muncy leads the Dodgers with 8 HR in 24 games (16.7% per-game rate) and now faces Taillon's catastrophic 6 HR in 22.2 innings at Dodger Stadium with wind blowing out to center — the LHB pull profile at Dodger's shorter LCF line with Taillon's confirmed fly-ball disaster arm makes every Muncy elevated barrel a legitimate HR threat in the best late-game pitching matchup on Friday. At +290, Muncy is the best Dodger value play behind Ohtani vs the board's worst HR/9 starter.",
    "tags": [
      "🔥 Hot",
      "💣 SP Disaster",
      "💨 Wind Boost",
      "💰 Value"
    ],
    "game": "CHC@LAD"
  },
  {
    "id": 7,
    "name": "Colson Montgomery",
    "team": "CWS",
    "tier": "A",
    "park": "Guaranteed Rate Field",
    "pitcher": "Noah Schultz",
    "pitcherNote": "6.16 ERA, xERA 5.09 — Irvin regression arm, Montgomery HR surge",
    "matchupGrade": "A",
    "estOdds": "+290",
    "note": "Montgomery's 7 HR in 25 games and 28% HR-per-game rate are elite among all MLB regulars — Mikolas' 5 HR in 12.1 starter innings confirms a pitcher leaking home runs at a historic rate, and Montgomery's power profile in the cleanup spot behind Murakami against the board's most HR-surrendering arm creates peak SP-disaster value. At +290 tied with Murakami vs the same Mikolas disaster, the second CWS power bat is the best same-game stack value on Friday's board.",
    "tags": [
      "📈 Breakout",
      "💣 SP Disaster",
      "💰 Value",
      "♻️ Run Back"
    ],
    "game": "WSH@CWS"
  },
  {
    "id": 8,
    "name": "Ronald Acuña Jr.",
    "team": "ATL",
    "tier": "B",
    "park": "Truist Park",
    "pitcher": "Zack Wheeler",
    "pitcherNote": "Elite 2026 debut — Wheeler ace, bad HR matchup",
    "matchupGrade": "C",
    "estOdds": "+330",
    "note": "Acuña's healthy 2026 return shows 94th-percentile exit velocity at the top of ATL's lineup — in 77°F warm Truist Park conditions with Painter's ERA-vs-xERA gap indicating eventual regression, Acuña's elite leadoff power profile gives every elevated barrel a genuine HR chance in ideal early-season temperature. At +330 for the NL's best leadoff power bat in warm Atlanta conditions, Acuña is the best A-tier warm-weather play on Friday's slate.",
    "tags": [
      "👑 MVP/Elite",
      "🔥 Hot"
    ],
    "game": "PHI@ATL"
  },
  {
    "id": 9,
    "name": "Giancarlo Stanton",
    "team": "NYY",
    "tier": "A",
    "park": "Daikin Park",
    "pitcher": "Mike Burrows",
    "pitcherNote": "6.75 ERA, 1-3 — Burrows disaster arm, Stanton elite HR threat",
    "matchupGrade": "A",
    "estOdds": "+320",
    "note": "Stanton's 98th-percentile exit velocity and 21.1% model-projected HR probability (3rd on Friday's board) target McCullers' 3-start regression collapse at the Crawford boxes in left field — the 315-ft Daikin Park left-field porch plus Stanton's elite pull power plus McCullers' confirmed cooked status is a three-context HR setup. At +320, Stanton behind Judge in NYY's order vs the same McCullers disaster arm is the best same-game stack second bat on Friday.",
    "tags": [
      "👑 MVP/Elite",
      "💣 SP Disaster",
      "🔥 Hot"
    ],
    "game": "NYY@HOU"
  },
  {
    "id": 10,
    "name": "Ian Happ",
    "team": "CHC",
    "tier": "A",
    "park": "Dodger Stadium",
    "pitcher": "Roki Sasaki",
    "pitcherNote": "6.11 ERA, 0-2 — Sasaki struggling, Happ elite HR rate vs LAD park",
    "matchupGrade": "A",
    "estOdds": "+390",
    "note": "Happ's 7 HR in 23 games (30.4% HR rate) — the highest per-game HR rate of any confirmed starter on Friday's board — targets Sheehan's 4.78 xERA disaster arm at Dodger Stadium with wind blowing out to center field — CHC bats post a .341 wOBA and .205 ISO vs four-seam fastballs dating to 2025 and Sheehan throws that pitch as his primary offering. At +390, the highest frequency HR hitter on Friday's board vs a documented heavy-fastball arm in a favorable wind park is free real estate.",
    "tags": [
      "🔥 Hot",
      "💣 SP Disaster",
      "💨 Wind Boost",
      "💰 Value"
    ],
    "game": "CHC@LAD"
  },
  {
    "id": 11,
    "name": "Ben Rice",
    "team": "NYY",
    "tier": "A",
    "park": "Daikin Park",
    "pitcher": "Mike Burrows",
    "pitcherNote": "6.75 ERA, 1-3 — Burrows disaster, Rice elite wRC+",
    "matchupGrade": "A",
    "estOdds": "+380",
    "note": "Rice's 244 wRC+ is the highest in all of MLB and his 8 HR match Murakami for the most among any first baseman — McCullers' 3-start blowup arc at the Crawford boxes provides the ideal SP-disaster context for Rice's elite metrics to flourish in a dome with no weather variance. At +380, MLB's most dominant offensive performer by wRC+ at a short-porch dome vs a pitcher who can't stop giving up runs is the highest-floor A-tier play on Friday's board.",
    "tags": [
      "🔥 Hot",
      "💣 SP Disaster",
      "📈 Breakout"
    ],
    "game": "NYY@HOU"
  },
  {
    "id": 12,
    "name": "Seiya Suzuki",
    "team": "CHC",
    "tier": "A",
    "park": "Dodger Stadium",
    "pitcher": "Roki Sasaki",
    "pitcherNote": "6.11 ERA, 0-2 — Sasaki early struggles, Suzuki power confirmed",
    "matchupGrade": "A",
    "estOdds": "+390",
    "note": "Suzuki's 3 HR in 13 games (23.1% HR rate) target Sheehan's documented fastball vulnerability — CHC's full lineup has built a .341 wOBA and .205 ISO specifically against the heavy four-seam that Sheehan throws most, and Suzuki's elite bat speed and RHB pull profile at Dodger Stadium with wind out to center creates a wind-boosted SP-disaster setup. At +390, Suzuki alongside Happ vs Sheehan's cooked fastball in a favorable Dodger Stadium wind environment is a must-play A-tier double-stack.",
    "tags": [
      "🔥 Hot",
      "💣 SP Disaster",
      "💨 Wind Boost"
    ],
    "game": "CHC@LAD"
  },
  {
    "id": 13,
    "name": "Yordan Alvarez",
    "team": "HOU",
    "tier": "A",
    "park": "Daikin Park",
    "pitcher": "Ryan Weathers",
    "pitcherNote": "3.18 ERA, 1-2 — decent, not an obvious HR disaster arm",
    "matchupGrade": "B+",
    "estOdds": "+280",
    "note": "Alvarez leads all of MLB with 11 HR and hits at Daikin Park where the Crawford boxes are 315 ft to left field — Warren's 3.65 xERA is respectable but Alvarez's home-park dominance and MLB-leading HR frequency mean even quality pitchers face a non-trivial HR probability every single plate appearance. At +280 for the MLB HR leader in his home park regardless of pitcher quality, Alvarez is the best pure-talent home-park value on Friday's board.",
    "tags": [
      "👑 MVP/Elite",
      "🔥 Hot",
      "♻️ Run Back"
    ],
    "game": "NYY@HOU"
  },
  {
    "id": 14,
    "name": "Michael Busch",
    "team": "CHC",
    "tier": "B+",
    "park": "Dodger Stadium",
    "pitcher": "Roki Sasaki",
    "pitcherNote": "6.11 ERA, 0-2 — Sasaki hittable, Busch HR surge confirmed",
    "matchupGrade": "B+",
    "estOdds": "+520",
    "note": "Busch has found his power stroke with HRs in back-to-back games and profiles as a 30-HR bat at Dodger Stadium with wind blowing out to center — Sheehan's heavy four-seam reliance against a CHC lineup that posts .205 ISO vs that pitch makes every Busch plate appearance a legitimate HR threat. At +520 for a bat confirmed hot in back-to-back games at a wind-boosted park vs a documented fastball-throwing SP disaster, Busch is the best A-tier value in the CHC@LAD game.",
    "tags": [
      "🔥 Hot",
      "💣 SP Disaster",
      "💨 Wind Boost",
      "📈 Breakout"
    ],
    "game": "CHC@LAD"
  },
  {
    "id": 15,
    "name": "Elly De La Cruz",
    "team": "CIN",
    "tier": "A",
    "park": "Great American Ball Park",
    "pitcher": "Jack Flaherty",
    "pitcherNote": "5.32 ERA, 1-1 — Singer hittable, De La Cruz GABP elite power",
    "matchupGrade": "A",
    "estOdds": "+420",
    "note": "De La Cruz's 97th-percentile barrel rate and home-park GABP advantage put every elevated ball at the #1 HR park on Friday's board — Valdez is a quality arm but his ground-ball style means any elevated pitch to De La Cruz's elite bat speed can park instantly in a park that plays extreme for right-handed pull power. At +420 for the most dangerous bat in the CIN lineup at the best outdoor HR park on Friday in 77°F warm conditions, De La Cruz is the premier GABP home HR value.",
    "tags": [
      "🔥 Hot",
      "🏟️ Park Factor"
    ],
    "game": "DET@CIN"
  },
  {
    "id": 16,
    "name": "Tyler Stephenson",
    "team": "CIN",
    "tier": "A",
    "park": "Great American Ball Park",
    "pitcher": "Jack Flaherty",
    "pitcherNote": "5.32 ERA, 1-1 — Singer elevated HR/FB, Stephenson power window",
    "matchupGrade": "B+",
    "estOdds": "+460",
    "note": "Stephenson's RHB power profile at GABP gives him the ideal platoon advantage vs Valdez's LHP in the #1 HR park on Friday — warm 77°F Cincinnati conditions maximize every elevated Stephenson pull fly and his 93rd-percentile exit velocity confirms legitimate HR carry in ideal temperature. At +460 for a right-handed catcher with elite exit velocity facing a lefty at the best outdoor park on Friday, Stephenson is the best GABP catcher HR value on the board.",
    "tags": [
      "💰 Value",
      "🏟️ Park Factor"
    ],
    "game": "DET@CIN"
  },
  {
    "id": 17,
    "name": "Gunnar Henderson",
    "team": "BAL",
    "tier": "B+",
    "park": "Camden Yards",
    "pitcher": "Trevor Rogers",
    "pitcherNote": "4.08 ERA, 2-2 — mediocre arm, BAL slightly favored",
    "matchupGrade": "B",
    "estOdds": "+300",
    "note": "Henderson's 95th-percentile exit velocity and elite RHB pull power target Bello's fully confirmed 6.84 xERA disaster at Camden Yards with wind blowing out to left field — BAL is averaging 5.2 runs over its last five games and Henderson's elite plate approach gives him premium fastball-count exposure vs a pitcher walking 5.7 per nine. At +300 for the BAL star vs the worst xERA arm on Friday's evening board in a wind-boosted park, Henderson is the best A-tier win-boosted power play.",
    "tags": [
      "👑 MVP/Elite",
      "💣 SP Disaster",
      "💨 Wind Boost",
      "🔥 Hot"
    ],
    "game": "BOS@BAL"
  },
  {
    "id": 18,
    "name": "Freddie Freeman",
    "team": "LAD",
    "tier": "A",
    "park": "Dodger Stadium",
    "pitcher": "Colin Rea",
    "pitcherNote": "3.00 ERA, 3-0 — solid pitcher, not a HR disaster matchup",
    "matchupGrade": "A+",
    "estOdds": "+320",
    "note": "Freeman's 3 HR in 23 games (13% rate) and elite first-base power profile target Taillon's 6 HR in 22.2 innings at Dodger Stadium with wind blowing out to center — the cleanup bat in LAD's deep lineup in the best late-game park/pitcher context on Friday combines elite contact with a confirmed disaster arm. At +320, Freeman behind Ohtani and Muncy in the order vs the board's worst active HR/9 rate is the cleanest cleanup-slot value in the CHC@LAD game.",
    "tags": [
      "👑 MVP/Elite",
      "💣 SP Disaster",
      "💨 Wind Boost"
    ],
    "game": "CHC@LAD"
  },
  {
    "id": 19,
    "name": "Teoscar Hernandez",
    "team": "LAD",
    "tier": "A",
    "park": "Dodger Stadium",
    "pitcher": "Colin Rea",
    "pitcherNote": "3.00 ERA, 3-0 — solid pitcher, not a HR disaster matchup",
    "matchupGrade": "A+",
    "estOdds": "+440",
    "note": "Hernandez's 18.2% HR-per-game rate and 94th-percentile exit velocity target Taillon's fly-ball disaster at a wind-boosted Dodger Stadium — the RHB LAD outfielder's pull-power profile to left-center in the Dodger wind lane gives every elevated Hernandez fly maximum carry vs a pitcher confirmed as the board's worst HR/9 arm. At +440, Hernandez in the lower LAD lineup slot vs Taillon is the best deep-order LAD stack value on Friday's late slate.",
    "tags": [
      "🔥 Hot",
      "💣 SP Disaster",
      "💨 Wind Boost",
      "💰 Value"
    ],
    "game": "CHC@LAD"
  },
  {
    "id": 20,
    "name": "Kyle Tucker",
    "team": "LAD",
    "tier": "A",
    "park": "Dodger Stadium",
    "pitcher": "Colin Rea",
    "pitcherNote": "3.00 ERA, 3-0 — solid pitcher, not a HR disaster matchup",
    "matchupGrade": "A",
    "estOdds": "+520",
    "note": "Tucker's 13% HR rate and model-confirmed 5.5% edge at +578 vs Taillon makes him the single best statistical value play on Friday's board according to Dimers Pro — in the wind-boosted Dodger Stadium context facing the worst active HR/9 starter among Friday's arms, Tucker's elite contact profile to left-center gives his lower-order lineup spot a legitimate HR window. At +520, Tucker is the deepest-value Dodger stack leg with confirmed model edge behind Ohtani, Muncy, and Freeman.",
    "tags": [
      "💰 Value",
      "💣 SP Disaster",
      "💨 Wind Boost"
    ],
    "game": "CHC@LAD"
  },
  {
    "id": 21,
    "name": "Bobby Witt Jr.",
    "team": "KC",
    "tier": "B+",
    "park": "Kauffman Stadium",
    "pitcher": "Robbie Ray",
    "pitcherNote": "Robbie Ray LHP — Witt LHB disadvantage, slight downgrade",
    "matchupGrade": "B",
    "estOdds": "+330",
    "note": "Witt has zero HR in 25 games despite elite batted-ball metrics and borderline elite barrel rate — Kikuchi's one strong outing doesn't erase his earlier inconsistency and Witt's home-park Kauffman advantage with closer 2026 dimensions in 54°F cool conditions is the board's premier 'due' HR setup. At +330, the 2026 AL MVP candidate yet to homer in 25 games with elite underlying metrics targeting a historically inconsistent LHP at home is the strongest regression-due play on Friday.",
    "tags": [
      "🔜 Due",
      "📈 Breakout",
      "👑 MVP/Elite"
    ],
    "game": "LAA@KC"
  },
  {
    "id": 23,
    "name": "Taylor Ward",
    "team": "LAA",
    "tier": "B+",
    "park": "Kauffman Stadium",
    "pitcher": "Eury Pérez",
    "pitcherNote": "Young KC arm — Ward solid RHB power, moderate window",
    "matchupGrade": "B",
    "estOdds": "+420",
    "note": "Ward's elite RHB power profile and 93rd-percentile exit velocity target Cameron's complete command implosion — 12 runs in 9.1 innings makes Cameron the second-worst SP card on Friday's board behind Mikolas, and Ward's pull power to left-center at Kauffman's new shorter dimensions gives every elevated fly maximum HR carry. At +420 for an LAA power bat vs the board's second-most-vulnerable starting pitcher, Ward is the best individual LAA HR value on Friday.",
    "tags": [
      "💣 SP Disaster",
      "💰 Value"
    ],
    "game": "LAA@KC"
  },
  {
    "id": 24,
    "name": "Vinnie Pasquantino",
    "team": "KC",
    "tier": "B+",
    "park": "Kauffman Stadium",
    "pitcher": "Robbie Ray",
    "pitcherNote": "LHP — decent stuff, moderate matchup",
    "matchupGrade": "B",
    "estOdds": "+480",
    "note": "Pasquantino's LHB platoon advantage vs Kikuchi's LHP breaks the matchup in his favor at home in Kauffman's new 2026 dimensions — elite 56% no-doubter percentage when he does go deep and career elite xwOBA confirms legitimate power even if counting stats have been volatile. At +480 for a KC slugger at home vs an inconsistent LHP in closer dimensions, Pasquantino is the best KC non-Witt individual HR value on Friday.",
    "tags": [
      "💰 Value",
      "🏟️ Park Factor"
    ],
    "game": "LAA@KC"
  },
  {
    "id": 25,
    "name": "Austin Riley",
    "team": "ATL",
    "tier": "C",
    "park": "Truist Park",
    "pitcher": "Zack Wheeler",
    "pitcherNote": "1.50 ERA, xERA 2.29 — Bryce Elder elite, poor HR matchup",
    "matchupGrade": "C",
    "estOdds": "+380",
    "note": "Riley's .280 ISO vs RHP and 93rd-percentile barrel rate make him ATL's premier power threat in the three-hole behind Acuña — in 77°F warm Truist Park conditions, Riley's pull power to the left-center gap in ideal early-season temperature against Painter's elevated ERA confirms the right setup for his next HR. At +380 for the ATL power core behind Acuña vs a pitcher with a documented ERA-above-xERA gap in warm weather, Riley is the best ATL individual A-tier play.",
    "tags": [
      "🔥 Hot",
      "💰 Value"
    ],
    "game": "PHI@ATL"
  },
  {
    "id": 27,
    "name": "José Ramírez",
    "team": "CLE",
    "tier": "A",
    "park": "Rogers Centre",
    "pitcher": "Joey Cantillo",
    "pitcherNote": "Weak Blue Jays arm — Ramírez elite contact, strong HR window",
    "matchupGrade": "A",
    "estOdds": "+350",
    "note": "Ramírez's switch-hit power and consistent career HR production against declining vets target Scherzer's 6.10 xERA regression arc in a dome with zero weather variance — the Rogers Centre closed environment eliminates all park suppression factors and Ramírez's elite plate approach means premium fastball exposure every time Scherzer struggles with command. At +350, CLE's cleanup bat in a dome vs the worst ERA/xERA arm on Friday's board is the board's premier AL road-dome HR value.",
    "tags": [
      "👑 MVP/Elite",
      "💣 SP Disaster",
      "💰 Value"
    ],
    "game": "CLE@TOR"
  },
  {
    "id": 29,
    "name": "Bryce Harper",
    "team": "PHI",
    "tier": "C",
    "park": "Truist Park",
    "pitcher": "Bryce Elder",
    "pitcherNote": "1.50 ERA, xERA 2.29 — Bryce Elder elite, poor HR matchup",
    "matchupGrade": "C",
    "estOdds": "+350",
    "note": "Harper's 97th-percentile barrel rate and career ability to demolish first-look arms make him PHI's second S-tier individual HR play behind Schwarber — in 77°F warm Truist Park conditions with a debut/limited-exposure arm, Harper's LHB pull power to the left-field gap maximizes every elevated ball in ideal temperature. At +350 for a former MVP vs a first-look arm in warm Atlanta weather, Harper is the cleanest PHI co-anchor behind Schwarber on Friday.",
    "tags": [
      "👑 MVP/Elite",
      "💣 SP Disaster",
      "🔥 Hot"
    ],
    "game": "PHI@ATL"
  },
  {
    "id": 30,
    "name": "Willy Adames",
    "team": "SF",
    "tier": "B+",
    "park": "Oracle Park",
    "pitcher": "MacKenzie Gore",
    "pitcherNote": "Solid Marlins LHP — not ideal HR matchup",
    "matchupGrade": "B+",
    "estOdds": "+620",
    "note": "Adames' 13% HR rate at Oracle with 7 mph blowing out in 63°F conditions gives him a legitimate HR window vs Alcantara's newly exposed regression — after allowing just 2 runs through first three starts, Alcantara has been tagged for 10 runs in 11 innings showing a clear trend break. At +620, Adames at Oracle vs a pitcher whose ERA is now exploding is the best SF individual HR value on Friday's late slate.",
    "tags": [
      "💣 SP Disaster",
      "💰 Value"
    ],
    "game": "MIA@SF"
  },
  {
    "id": 31,
    "name": "Rafael Devers",
    "team": "SF",
    "tier": "B+",
    "park": "Oracle Park",
    "pitcher": "MacKenzie Gore",
    "pitcherNote": "Solid Marlins LHP — not ideal HR matchup",
    "matchupGrade": "B+",
    "estOdds": "+580",
    "note": "Devers' 95th-percentile exit velocity and former HR-champion power profile target Alcantara's clearly deteriorating stretch at Oracle — 7 mph blowing out in 63°F conditions gives every Devers elevated ball carry to the left-field wind lane and his 2 HR in 23 games confirms the power surge is overdue. At +580, the former Red Sox power bat now hitting in Oracle's wind context vs a pitcher in free fall is a premium breakout-due play on Friday's late slate.",
    "tags": [
      "📈 Breakout",
      "💣 SP Disaster",
      "🔜 Due"
    ],
    "game": "MIA@SF"
  },
  {
    "id": 53,
    "name": "Jorge Soler",
    "team": "ATL",
    "tier": "C",
    "park": "Truist Park",
    "pitcher": "Zack Wheeler",
    "pitcherNote": "1.50 ERA, xERA 2.29 — Bryce Elder elite, poor HR matchup",
    "matchupGrade": "C",
    "estOdds": "+490",
    "note": "Soler's career power profile and ability to hit HRs in fastball-count situations targets Holmes' debut arm in 77°F warm Truist Park — as the ATL DH in the middle of the lineup, Soler gets premium lineup protection behind Acuña, Riley, and Olson and first-look arms with no MLB book are classic Soler targets. At +490, the ATL fourth power bat in a full-lineup stack vs a debut arm in warm weather rounds out the best individual ATL HR stack on Friday.",
    "tags": [
      "💣 SP Disaster",
      "🔥 Hot"
    ],
    "game": "PHI@ATL"
  },
  {
    "id": 54,
    "name": "Mike Trout",
    "team": "LAA",
    "tier": "A",
    "park": "Kauffman Stadium",
    "pitcher": "Eury Pérez",
    "pitcherNote": "Young KC arm — Trout healthy return, strong HR window at Kauffman",
    "matchupGrade": "B+",
    "estOdds": "+350",
    "note": "Trout's return to full power in 2026 and elite 96th-percentile exit velocity target Cameron's complete command implosion — 12 runs on 13 hits in 9.1 innings makes Cameron one of the two worst starting pitchers on Friday's board, and Trout's ability to hit HRs vs any pitcher when healthy gives him a legitimate window in Kauffman's new closer dimensions. At +350 for a returning MLB icon vs the board's second-worst SP, Trout is the best individual LAA power-talent play on Friday.",
    "tags": [
      "👑 MVP/Elite",
      "💣 SP Disaster",
      "📈 Breakout"
    ],
    "game": "LAA@KC"
  },
  {
    "id": 55,
    "name": "Steven Kwan",
    "team": "CLE",
    "tier": "B+",
    "park": "Rogers Centre",
    "pitcher": "Joey Cantillo",
    "pitcherNote": "Weak Blue Jays arm — Kwan slap-hit profile, moderate HR window",
    "matchupGrade": "B",
    "estOdds": "+540",
    "note": "Kwan's elite plate discipline and LHB contact profile give him premium fastball-count exposure vs Scherzer's declining command at 6.10 xERA — in the Rogers Centre dome environment with zero weather variance, Kwan's ability to work counts and wait for a hittable pitch in premium at-bat depth gives him a legitimate HR window when Scherzer misses over the middle. At +540 for CLE's best on-base profile vs a clearly regressing veteran, Kwan completes the CLE@TOR HR stack.",
    "tags": [
      "💣 SP Disaster",
      "💰 Value"
    ],
    "game": "CLE@TOR"
  },
  {
    "id": 35,
    "name": "Corey Seager",
    "team": "TEX",
    "tier": "B+",
    "park": "Globe Life Field",
    "pitcher": "Cole Ragans",
    "pitcherNote": "Quality arm — not a disaster matchup for TEX bats",
    "matchupGrade": "B+",
    "estOdds": "+400",
    "note": "Seager's 96th-percentile exit velocity and LHB pull profile target Severino's insane walk rate (3+ BB in every single start) at Globe Life Field's closed dome — fastball-count opportunities are guaranteed against a pitcher who can't locate, and Seager's elite pull power in zero-weather-variance dome conditions gives every elevated ball a clean HR window. At +400 for the TEX cleanup bat vs the walk-machine starter of the slate in a dome, Seager is the best individual TEX HR anchor on Friday.",
    "tags": [
      "💣 SP Disaster",
      "💰 Value"
    ],
    "game": "ATH@TEX"
  },
  {
    "id": 36,
    "name": "Adolis Garcia",
    "team": "TEX",
    "tier": "B",
    "park": "Globe Life Field",
    "pitcher": "Cole Ragans",
    "pitcherNote": "Quality arm — not a disaster matchup for TEX bats",
    "matchupGrade": "B+",
    "estOdds": "+470",
    "note": "Garcia's 94th-percentile exit velocity and pull power give him a legitimate HR window vs Severino's command implosion in the dome — 3+ walks per start guarantees hittable fastballs and Garcia's aggressive pull approach converts premium pitch locations into maximum exit-velocity contact. At +470, the TEX RHB power bat behind Seager in the order vs the board's walk-rate disaster arm in a dome is solid B-tier dome value.",
    "tags": [
      "💣 SP Disaster",
      "💰 Value"
    ],
    "game": "ATH@TEX"
  },
  {
    "id": 56,
    "name": "Nick Kurtz",
    "team": "ATH",
    "tier": "B+",
    "park": "Globe Life Field",
    "pitcher": "TEX Starter (TBD)",
    "pitcherNote": "TBD Texas starter",
    "matchupGrade": "B+",
    "estOdds": "+450",
    "note": "Kurtz's elite first-year power profile at Daikin Park (Globe Life Field) targets Eovaldi's 5 HR in 26.2 innings in zero-weather-variance dome conditions — the ATH first baseman's power metrics in the early 2026 campaign confirm a legitimate HR threat in every game regardless of conditions and Eovaldi's elevated HR/9 provides the SP-disaster context. At +450, Kurtz in the best ATH individual slot vs a confirmed HR-prone arm in a dome is the best individual ATH play on Friday.",
    "tags": [
      "📈 Breakout",
      "💣 SP Disaster",
      "💰 Value"
    ],
    "game": "ATH@TEX"
  },
  {
    "id": 40,
    "name": "Byron Buxton",
    "team": "MIN",
    "tier": "B+",
    "park": "Tropicana Field",
    "pitcher": "Bailey Ober",
    "pitcherNote": "Mediocre — Ober gives up fly balls, Twins park favorable",
    "matchupGrade": "B+",
    "estOdds": "+480",
    "note": "Buxton's 97th-percentile exit velocity and elite no-doubter HR rate (68.6% last year) target Rasmussen's worst-start-of-the-season regression at Tropicana Field's fixed dome — the controlled environment eliminates all weather variance and Buxton's bat speed gives him a legitimate HR shot vs any pitcher who has a bad night. At +480, MLB's highest no-doubter percentage bat vs a pitcher coming off a blowup start in a dome is elite value.",
    "tags": [
      "💰 Value",
      "🔥 Hot",
      "📈 Breakout"
    ],
    "game": "MIN@TB"
  },
  {
    "id": 41,
    "name": "Carlos Correa",
    "team": "MIN",
    "tier": "B",
    "park": "Tropicana Field",
    "pitcher": "Bailey Ober",
    "pitcherNote": "Mediocre — Ober gives up fly balls, Twins park favorable",
    "matchupGrade": "B+",
    "estOdds": "+500",
    "note": "Correa's elite RHB power profile and career ability to hit HRs vs struggling pitchers targets Rasmussen's worst outing of 2026 in Tropicana's fixed dome — in a controlled environment where Correa's elite exit velocity operates without weather suppression, every Rasmussen mistake goes deep. At +500 for the MIN captain behind Buxton vs a coming-off-disaster starter in a dome, Correa is the best second-bat MIN HR value on Friday.",
    "tags": [
      "💰 Value",
      "💣 SP Disaster"
    ],
    "game": "MIN@TB"
  },
  {
    "id": 43,
    "name": "Oneil Cruz",
    "team": "PIT",
    "tier": "C",
    "park": "American Family Field",
    "pitcher": "Mitch Keller",
    "pitcherNote": "Solid veteran arm — not a disaster matchup",
    "matchupGrade": "C",
    "estOdds": "+800",
    "note": "Cruz's 97th-percentile exit velocity is the lone PIT HR path vs Woodruff's dominant xERA in a dome — two straight games with HR in his last five outings confirm he's heating up, and even elite pitchers occasionally make a mistake that Cruz's bat speed turns into a launch. At +800 for the highest raw power bat in the PIT lineup in a dome duel, Cruz is Friday's best C-tier moon-shot lottery leg.",
    "tags": [
      "🎰 Longshot",
      "📈 Breakout"
    ],
    "game": "PIT@MIL"
  },
  {
    "id": 45,
    "name": "Jorge Alfaro",
    "team": "MIA",
    "tier": "C",
    "park": "Oracle Park",
    "pitcher": "Jeffrey Springs",
    "pitcherNote": "Weak SF starter — MIA bats have moderate HR window",
    "matchupGrade": "B",
    "estOdds": "+950",
    "note": "Houser's 5.40 ERA and 5.26 xERA make him a confirmed regression target but Alfaro is a low-frequency power bat making this a pure lottery play — in 63°F Oracle conditions with 7 mph blowing out, any Alfaro pull fly against Houser's elevated HR/FB rate carries legitimate distance. At +950, this is Friday's best C-tier Houser-disaster lottery play for those wanting a moon-shot at Oracle.",
    "tags": [
      "🎰 Longshot",
      "💣 SP Disaster"
    ],
    "game": "MIA@SF"
  },
  {
    "id": 46,
    "name": "Heliot Ramos",
    "team": "SF",
    "tier": "B",
    "park": "Oracle Park",
    "pitcher": "MacKenzie Gore",
    "pitcherNote": "Solid Marlins LHP — not ideal HR matchup",
    "matchupGrade": "B+",
    "estOdds": "+800",
    "note": "Ramos' 20% HR-per-game rate at Oracle with 7 mph blowing out in 63°F conditions target Alcantara's newly exposed regression arc — Ramos' home-park pull-fly profile to the Oracle wind lane at +800 is the best SF deep-value HR play in the MIA@SF game with Alcantara now getting torched after a quality start to the year. This is a legitimate B-tier value with a Statcast backing.",
    "tags": [
      "💨 Wind Boost",
      "💣 SP Disaster",
      "📈 Breakout"
    ],
    "game": "MIA@SF"
  },
  {
    "id": 47,
    "name": "Mookie Betts",
    "team": "LAD",
    "tier": "B+",
    "park": "Dodger Stadium",
    "pitcher": "Colin Rea",
    "pitcherNote": "3.00 ERA, 3-0 — solid pitcher, not a HR disaster matchup",
    "matchupGrade": "A",
    "estOdds": "+480",
    "note": "Betts' elite RHB power profile and Dodger Stadium home-park excellence target Taillon's worst-active-HR/9 arm on Friday's board — in wind-boosted Dodger Stadium conditions with the CHC@LAD late game, Betts' ability to pull fly balls into the wind lane gives him a legitimate HR window in every at-bat vs a pitcher surrendering HRs at nearly one per start. At +480, Betts rounds out the complete LAD power stack vs Taillon on Friday.",
    "tags": [
      "👑 MVP/Elite",
      "💣 SP Disaster",
      "💨 Wind Boost"
    ],
    "game": "CHC@LAD"
  },
  {
    "id": 48,
    "name": "Will Smith",
    "team": "LAD",
    "tier": "B",
    "park": "Dodger Stadium",
    "pitcher": "Colin Rea",
    "pitcherNote": "3.00 ERA, 3-0 — solid pitcher, not a HR disaster matchup",
    "matchupGrade": "A-",
    "estOdds": "+470",
    "note": "Smith's catching power profile and Dodger Stadium home advantage target Taillon's documented fly-ball disaster in wind-boosted conditions — the LAD catcher's 8.7% HR rate is lower than lineup mates but his ability to connect on elevated pitches in Dodger's left-field wind lane makes him a legitimate lower-order stack completion value. At +470, the best-hitting catcher in the NL vs the board's worst HR/9 starter is the best dome/wind catcher play on Friday.",
    "tags": [
      "💰 Value",
      "💣 SP Disaster"
    ],
    "game": "CHC@LAD"
  },
  {
    "id": 49,
    "name": "Alex Bregman",
    "team": "CHC",
    "tier": "B+",
    "park": "Dodger Stadium",
    "pitcher": "Roki Sasaki",
    "pitcherNote": "6.11 ERA, 0-2 — Sasaki hittable, Bregman power profile",
    "matchupGrade": "B",
    "estOdds": "+540",
    "note": "Bregman's 2 HR in 25 games makes him a due power bat in a premium context — Sheehan's 4.78 xERA and CHC's .205 ISO vs four-seamers means every Bregman at-bat is a potential HR opportunity in the wind-boosted Dodger Stadium context. At +540, Bregman in the CHC lineup behind Happ and Suzuki vs Sheehan's fastball disaster in Dodger's wind lane is the best CHC secondary power stack value on Friday.",
    "tags": [
      "🔜 Due",
      "💣 SP Disaster",
      "💨 Wind Boost"
    ],
    "game": "CHC@LAD"
  }
];

const parlays = [
  {
    "id": "4A",
    "legs": 4,
    "label": "THE CORE FOUR",
    "risk": "Lower Risk",
    "riskColor": "#4caf50",
    "estPayout": "+900",
    "description": "Two S-tier anchors + two A-tier power bats across four independent games.",
    "playerIds": [
      1,
      2,
      17,
      7
    ],
    "strategy": "Judge (S · NYY@HOU), Ohtani (S · CHC@LAD), Henderson (A · BOS@BAL · 6.84 xERA wind), Montgomery (A · WSH@CWS · Mikolas HR/FB disaster). Four legs · four games · 2S/2A."
  },
  {
    "id": "4B",
    "legs": 4,
    "label": "POWER CROSS-SLATE",
    "risk": "Lower Risk",
    "riskColor": "#4caf50",
    "estPayout": "+1100",
    "description": "Four elite bats across four separate games — no park stacking.",
    "playerIds": [
      1,
      2,
      17,
      15
    ],
    "strategy": "Judge (S · NYY@HOU), Ohtani (S · CHC@LAD), Henderson (A · BOS@BAL), De La Cruz (A · DET@CIN GABP #1 HR park). Four legs · four games · 2S/2A."
  },
  {
    "id": "5A",
    "legs": 5,
    "label": "THE HIGH FIVE",
    "risk": "Lower Risk",
    "riskColor": "#4caf50",
    "estPayout": "+2000",
    "description": "2S + 3A across five independent games.",
    "playerIds": [
      1,
      2,
      17,
      15,
      27
    ],
    "strategy": "Judge (S · NYY@HOU), Ohtani (S · CHC@LAD), Henderson (A · BOS@BAL), De La Cruz (A · DET@CIN), Ramírez (A · CLE@TOR vs Scherzer 6.10 xERA). Five legs · five games · 2S/3A."
  },
  {
    "id": "5B",
    "legs": 5,
    "label": "THE EV SPECIAL",
    "risk": "Medium Risk",
    "riskColor": "#ff9800",
    "estPayout": "+2500",
    "description": "Five highest exit-velocity bats across five independent games.",
    "playerIds": [
      1,
      2,
      7,
      17,
      29
    ],
    "strategy": "Judge (25% barrel · NYY@HOU), Ohtani (95th+ EV · CHC@LAD), Montgomery (28% HR rate · WSH@CWS), Henderson (95th EV · BOS@BAL), Harper (97th barrel · PHI@ATL). Five legs · five games · 2S/3A."
  },
  {
    "id": "5C",
    "legs": 4,
    "label": "THE REGRESSION BOMB",
    "risk": "Medium Risk",
    "riskColor": "#ff9800",
    "estPayout": "+2400",
    "description": "Five bats targeting Friday's five biggest xERA regression arms — one per game.",
    "playerIds": [
      3,
      17,
      15,
      27
    ],
    "strategy": "Murakami vs Mikolas (WSH@CWS · worst HR/FB arm on the board), Henderson vs Bello 6.84 xERA (BOS@BAL), De La Cruz at GABP vs Valdez (DET@CIN), Alonso vs Lorenzen 7.48 ERA (COL@NYM), Ramírez vs Scherzer 6.10 xERA collapse (CLE@TOR). Five legs · five games · 1S/4A."
  },
  {
    "id": "6A",
    "legs": 6,
    "label": "SP DISASTER CROSS-SLATE",
    "risk": "Lower Risk",
    "riskColor": "#4caf50",
    "estPayout": "+3200",
    "description": "2S / 3A / 1B across six independent games.",
    "playerIds": [
      1,
      2,
      17,
      15,
      27,
      25
    ],
    "strategy": "Judge (S · NYY@HOU), Ohtani (S · CHC@LAD), Henderson (A · BOS@BAL), De La Cruz (A · DET@CIN), Alonso (B+ · COL@NYM vs Lorenzen 7.48 ERA), Riley (A · PHI@ATL warm Truist). Six legs · six games · 2S/3A/1B."
  },
  {
    "id": "6B",
    "legs": 6,
    "label": "SP DISASTER CROSS-SLATE II",
    "risk": "Lower Risk",
    "riskColor": "#4caf50",
    "estPayout": "+3100",
    "description": "Six bats across six independent SP-disaster matchups — 2S/3A/1B.",
    "playerIds": [
      1,
      3,
      17,
      15,
      27,
      21
    ],
    "strategy": "Judge (S · NYY@HOU), Murakami (S · WSH@CWS · MLB HR leader vs worst HR/FB pitcher), Henderson (A · BOS@BAL), De La Cruz (A · DET@CIN), Alonso (B+ · COL@NYM), Witt (A · LAA@KC · most overdue power bat). Six legs · six games · 2S/3A/1B."
  },
  {
    "id": "7A",
    "legs": 7,
    "label": "THE SP DISASTER MONSTER",
    "risk": "Medium Risk",
    "riskColor": "#ff9800",
    "estPayout": "+6500",
    "description": "2S / 3A / 2B across seven independent games.",
    "playerIds": [
      1,
      2,
      7,
      17,
      15,
      27,
      21
    ],
    "strategy": "Judge (S · NYY@HOU), Ohtani (S · CHC@LAD), Montgomery (A · WSH@CWS · Mikolas disaster), Henderson (A · BOS@BAL · 6.84 xERA), De La Cruz (A · DET@CIN · GABP), Alonso (B+ · COL@NYM), Witt (A · LAA@KC). Seven legs · seven games · 2S/3A/2B."
  },
  {
    "id": "7B",
    "legs": 7,
    "label": "THE WIND CHASER",
    "risk": "Medium Risk",
    "riskColor": "#ff9800",
    "estPayout": "+6000",
    "description": "Seven wind-boosted and SP-disaster bats across seven independent games.",
    "playerIds": [
      2,
      3,
      17,
      27,
      21,
      46,
      40
    ],
    "strategy": "Ohtani (S · CHC@LAD · Dodger wind out CF), Murakami (S · WSH@CWS · Mikolas disaster), Henderson (A · BOS@BAL · Camden wind out LF), Ramírez (A · CLE@TOR · Scherzer xERA), Witt (A · LAA@KC · overdue power), Ramos (B · MIA@SF · Oracle wind 7mph), Buxton (B+ · MIN@TB · dome no-doubter king). Seven legs · seven games · 2S/3A/2B."
  },
  {
    "id": "7C",
    "legs": 7,
    "label": "THE HOT HAND",
    "risk": "Medium Risk",
    "riskColor": "#ff9800",
    "estPayout": "+6800",
    "description": "Seven confirmed peak-form bats across seven independent games.",
    "playerIds": [
      1,
      2,
      7,
      8,
      17,
      27,
      54
    ],
    "strategy": "Judge (S · NYY@HOU · 9 HR 25% barrel), Ohtani (S · CHC@LAD · model-leading 26.5% HR prob), Montgomery (A · WSH@CWS · 28% HR rate), Acuña (A · PHI@ATL · 94th EV healthy return), Henderson (A · BOS@BAL · 95th EV), Ramírez (A · CLE@TOR · elite contact), Trout (A · LAA@KC · healthy-return power). Seven legs · seven games · 2S/5A."
  },
  {
    "id": "8A",
    "legs": 8,
    "label": "THE SLUGGER SUMMIT",
    "risk": "Medium-High Risk",
    "riskColor": "#ff5722",
    "estPayout": "+9500",
    "description": "2S / 4A / 2B across eight independent games.",
    "playerIds": [
      1,
      2,
      17,
      8,
      15,
      23,
      40,
      27
    ],
    "strategy": "Judge (S · NYY@HOU), Ohtani (S · CHC@LAD), Henderson (A · BOS@BAL), Acuña (A · PHI@ATL), De La Cruz (A · DET@CIN), Ward (A · LAA@KC · Cameron disaster arm), Buxton (B+ · MIN@TB), Lindor (B+ · COL@NYM). Eight legs · eight games · 2S/4A/2B."
  },
  {
    "id": "8B",
    "legs": 8,
    "label": "THE VALUE MATRIX",
    "risk": "Medium-High Risk",
    "riskColor": "#ff5722",
    "estPayout": "+9200",
    "description": "2S + 6 value legs for maximum odds spread across eight independent games.",
    "playerIds": [
      1,
      2,
      7,
      17,
      21,
      27,
      40,
      46
    ],
    "strategy": "Judge (S · NYY@HOU), Ohtani (S · CHC@LAD), Montgomery (A · WSH@CWS · Mikolas disaster +290), Henderson (A · BOS@BAL · wind+xERA +300), Witt (A · LAA@KC · overdue +330), Ramírez (A · CLE@TOR · Scherzer +350), Buxton (B+ · MIN@TB · no-doubter king +480), Ramos (B · MIA@SF · Oracle wind +800). Eight legs · eight games · 2S/6A."
  },
  {
    "id": "9A",
    "legs": 8,
    "label": "THE GRAND SALAMI",
    "risk": "High Risk",
    "riskColor": "#e91e63",
    "estPayout": "+18000",
    "description": "2S / 5A / 2B across nine independent games.",
    "playerIds": [
      1,
      2,
      17,
      8,
      15,
      23,
      40,
      27
    ],
    "strategy": "Judge (S · NYY@HOU), Ohtani (S · CHC@LAD), Henderson (A · BOS@BAL), Acuña (A · PHI@ATL), De La Cruz (A · DET@CIN), Ward (A · LAA@KC), Buxton (B+ · MIN@TB), Lindor (B+ · COL@NYM), Ramírez (A · CLE@TOR). Nine legs · nine games · 2S/5A/2B."
  },
  {
    "id": "9B",
    "legs": 9,
    "label": "THE SLEEPER STACK",
    "risk": "High Risk",
    "riskColor": "#e91e63",
    "estPayout": "+17000",
    "description": "2S + breakout/value mix across nine independent games.",
    "playerIds": [
      1,
      2,
      7,
      8,
      21,
      27,
      17,
      40,
      46
    ],
    "strategy": "Judge (S · NYY@HOU), Ohtani (S · CHC@LAD), Montgomery (A · WSH@CWS), Acuña (A · PHI@ATL), Witt (A · LAA@KC · most overdue power bat), Ramírez (A · CLE@TOR), Henderson (A · BOS@BAL), Buxton (B+ · MIN@TB), Ramos (B · MIA@SF · Oracle wind +800). Nine legs · nine games · 2S/5A/2B."
  },
  {
    "id": "10A",
    "legs": 10,
    "label": "THE LOTTERY TICKET",
    "risk": "Max Risk",
    "riskColor": "#9c27b0",
    "estPayout": "+35000",
    "description": "2S / 5A / 1B / 2C moon shots across ten legs, nine games.",
    "playerIds": [
      1,
      2,
      17,
      15,
      7,
      40,
      27,
      21,
      43,
      45
    ],
    "strategy": "Judge (S · NYY@HOU), Ohtani (S · CHC@LAD), Henderson (A · BOS@BAL), De La Cruz (A · DET@CIN), Montgomery (A · WSH@CWS · Mikolas disaster), Buxton (B+ · MIN@TB), Ramírez (A · CLE@TOR), Witt (A · LAA@KC), Cruz (C · +800 · PIT@MIL · 97th EV lottery), Alfaro (C · +950 · MIA@SF · Houser disaster). Ten legs · nine games · 2S/5A/1B/2C."
  }
];
