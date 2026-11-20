# MataLens Screen-by-Screen Visual & Structural Concepts

> **Target Platform:** MataLens (Personal, Nonpartisan Political-Learning Companion for Nigerians)  
> **Repository:** `omnmlr/matalens` | **Branch:** `agent/research-design`  
> **Date:** November 2026  
> **Document:** Design Planning Deliverable 05  
> **Status:** Approved Screen Concepts & UI Specification  

---

## Screen 1: Home — "The Lens Today"

### 1.1 Desktop Visual & Structural Specification (1280px / 1440px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [TOP NAVIGATION BAR: 64px Height · Sticky · Frosted Glass Backdrop (rgba(249, 250, 246, 0.85) / blur 12px) · 1px Bottom Border]  │
│ [MATALENS (Newsreader 22px/700)]   Home   Politicians   Learn   Camera & Actions      [🔍 Search Cmd+K]  [Data Saver ⚡]  [Offline ✓] │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ SECTION A: "MY FOLLOWED LEADERS" BRIEFING TRAY (Height: 120px · Background: #FFFFFF · 1px Border #E2E8E4 · Radius: 12px)     │ │
│ │ ┌───────────────────┐  ┌───────────────────────────────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 📌 YOUR WATCHLIST │  │ [Card 1: Sen. Ireti Kingibe]    [Card 2: Gov. Sanwo-Olu]      [Card 3: Peter Obi]     [+ Follow More] │ │ │
│ │ │ 3 Representatives │  │ LP · FCT Senator                APC · Lagos Governor          LP · 2023 Presidential  Discover Leaders│ │ │
│ │ │ Tracked locally   │  │ 🟢 1 Bill Introduced (FCT Tax)  🟡 1 Policy Speech (Blue Line) ⚪ No new actions      Search by State │ │ │
│ │ └───────────────────┘  └───────────────────────────────────────────────────────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────┐ │
│ │ SECTION B: LEAD DEVELOPMENT ANCHOR (Width: 64% · 820px)                  │ SECTION C: EDITORIAL SIDEBAR (Width: 34% · 420px) │ │
│ │                                                                          │                                                   │ │
│ │ [KICKER: CONSTITUTIONAL GOVERNANCE · 3 HOURS AGO · 4 MIN READ]           │ ┌───────────────────────────────────────────────┐ │ │
│ │ Local Government Financial Autonomy: Senate Enacts                       │ │ 🧭 PERSPECTIVE RADAR: THE BLINDSPOT           │ │ │
│ │ Direct Federation Account Allocations to 774 Councils                    │ │ Topic: Federal Road Maintenance Concessions   │ │ │
│ │                                                                          │ │ • 82% Opposition Outlets Covering             │ │ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐ │ │ • Only 18% State Broadcasters Mentioning       │ │ │
│ │ │ 15-SECOND KEY FACTS BOX (Background: #F4F7F4 · 1px Stroke #0A4D34)   │ │ │ [Read Multi-Source Analysis →]              │ │ │
│ │ │ • Abolishes State-Joint Local Government Accounts (SJLGA).          │ │ └───────────────────────────────────────────────┘ │ │
│ │ │ • Mandates FAAC direct electronic disbursement to council accounts.  │ │                                                   │ │
│ │ │ • Requires 24 of 36 State Assembly ratifications for implementation. │ │ ┌───────────────────────────────────────────────┐ │ │
│ │ └──────────────────────────────────────────────────────────────────────┘ │ │ 🎯 TODAY'S CIVIC REHEARSAL (60 Seconds)       │ │ │
│ │                                                                          │ │ "A State Governor suspends an elected council │ │ │
│ │ [4-PILLAR PERSPECTIVE DISTRIBUTION BAR]                                  │ │ chairman. Does the 2024 Supreme Court       │ │ │
│ │ ┌──────────────────────┬──────────────────────┬─────────────┬──────────┐ │ │ judgment permit this?"                        │ │ │
│ │ │ INCUMBENT / STATE    │ OPPOSITION           │ WATCHDOG    │ RECORD   │ │ │                                               │ │ │
│ │ │ 42% (9 Outlets)      │ 33% (7 Outlets)      │ 20% (4 Out) │ 5% (SC)  │ │ │ [ Option A: Yes, State law governs LGAs ]     │ │ │
│ │ └──────────────────────┴──────────────────────┴─────────────┴──────────┘ │ │ [ Option B: No, Supreme Court barred this ]    │ │ │
│ │                                                                          │ │ (Tap to test your constitutional knowledge)   │ │ │
│ │ [SIGNATURE DEVELOPMENT TIMELINE SPINE]                                   │ └───────────────────────────────────────────────┘ │ │
│ │  ● Jul 2024: Supreme Court Landmark Judgment SC/CV/343/2024              │                                                   │ │
│ │  ● Oct 2024: Senate Review Committee tables Constitutional Amendment     │ ┌───────────────────────────────────────────────┐ │ │
│ │  ● TODAY: Bill passes 3rd reading with two-thirds majority (88 votes)   │ │ 📊 PROMISE IN FOCUS: APC RENEWED HOPE         │ │ │
│ │  ◌ PENDING: Transmitted to 36 State Houses of Assembly for ratification  │ │ "Decentralise policing and judicial autonomy" │ │ │
│ │                                                                          │ │ Clause: Page 14 · Stated in 2023              │ │ │
│ │ [Button: Examine Full Perspective Breakdown & Primary Documents →]       │ │ Status: IN PROGRESS (Draft Bill Gazetted)     │ │ │
│ └──────────────────────────────────────────────────────────────────────────┴─┴─────────────────────────────────────────────────┘ │
│                                                                                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ SECTION D: THEMATIC EDITORIAL CLUSTER — "THE 2027 RED CHAMBER WATCH"                                                         │ │
│ │ ┌─────────────────────────────┐  ┌─────────────────────────────┐  ┌─────────────────────────────┐  ┌────────────────────────┐ │ │
│ │ │ Sen. Abiru (Lagos East)     │  │ Sen. Ndume (Borno South)    │  │ Sen. Wadada (Nasarawa West) │  │ Sen. Akpabio (Akwa Ibom)│ │ │
│ │ │ Tax Reform Bill: Explaining │  │ Security Appropriation:     │  │ Public Accounts Committee:  │  │ Senate Leadership &    │ │ │
│ │ │ VAT redistribution formulas │  │ Scrutinising defence grants │  │ Unaudited agency queries    │  │ Statutory Timetable     │ │ │
│ │ └─────────────────────────────┘  └─────────────────────────────┘  └─────────────────────────────┘  └────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ SECTION E: SUPPORTING CAPABILITIES TRAY (Height: 88px · Background: #0F261E · Text: #F9FAF6 · Radius: 12px)                 │ │
│ │ [🗳️ Polling Unit Guidance: Find Code]  [📅 2027 Election Timetable: Key Dates]  [📷 Civic Camera: Anonymous Receipt Intake]   │ │
│ └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Mobile Visual & Structural Specification (390px Viewport)

```
┌──────────────────────────────────────────┐
│ [TOP BAR: 52px · Sticky · Forest Ivory]  │
│ [MATALENS (18px)]          [⚡ Data Saver]│
├──────────────────────────────────────────┤
│ MY FOLLOWED LEADERS                      │
│ ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┤
│ │ (Img) │  │ (Img) │  │ (Img) │  │  [+]  │
│ │ Ireti │  │ Sanwo │  │ Obi   │  │ Follow│
│ │ 🟢Bill │  │ 🟡Spch│  │ ⚪Idle │  │ Leaders
│ └───────┘  └───────┘  └───────┘  └───────┤
├──────────────────────────────────────────┤
│ LEAD DEVELOPMENT                         │
│ [GOVERNANCE · 3H AGO]                    │
│ Local Govt Financial Autonomy            │
│ Enacted by Senate                        │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ 15-SECOND KEY FACTS                  │ │
│ │ • Direct FAAC funding to 774 councils│ │
│ │ • State joint accounts abolished     │ │
│ │ • Awaits 24 State Assembly votes     │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ PERSPECTIVE DISTRIBUTION                 │
│ ┌───────┬───────┬───────┬──────┐         │
│ │State  │Opp    │Watch  │Record│         │
│ │ 42%   │ 33%   │ 20%   │ 5%   │         │
│ └───────┴───────┴───────┴──────┘         │
│                                          │
│ [Explore Perspectives & Timeline →]      │
├──────────────────────────────────────────┤
│ TODAY'S CIVIC REHEARSAL (60 Seconds)     │
│ "Can a Governor remove an elected LGA    │
│  chairman under 2024 Supreme Court rule?"│
│ [ Option A: Yes, state law controls ]    │
│ [ Option B: No, Supreme Court barred it ]│
├──────────────────────────────────────────┤
│ THEMATIC CLUSTER: 2027 SENATE WATCH      │
│ • Lagos East: Tax Reform Bill Explainer  │
│ • Borno South: Military Budget Scrutiny  │
├──────────────────────────────────────────┤
│ [BOTTOM NAVIGATION BAR: 4 TABS · 60px]   │
│ [🏠 Home]   [👤 Leaders]  [📖 Learn]  [📷 Camera] │
└──────────────────────────────────────────┘
```

---

## Screen 2: Followed Politician Dossier

### 2.1 Desktop Visual & Structural Specification (1280px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [TOP BAR: Back to Leaders / Breadcrumbs: Home / Politicians / Senator Ireti Heebah Kingibe]                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ POLITICIAN HERO HEADER (Background: #FFFFFF · 1px Border #E2E8E4 · 24px Padding · Radius: 16px)                             │ │
│ │ ┌───────────────────┐  Kingibe, Ireti Heebah                                     [⭐ FOLLOWING (Saved Locally)]             │ │
│ │ │                   │  Senator for Federal Capital Territory (FCT) Abuja         [WhatsApp Share]  [Copy Link]                 │ │
│ │ │ Verified Portrait │  Labour Party (LP) · Sworn in: June 2023                                                                 │ │
│ │ │ (CC BY-SA 4.0)    │  Committees: Women Affairs (Chairman), Federal Character, Works                                          │ │
│ │ │ Photo: Nosa A.    │                                                                                                          │ │
│ │ └───────────────────┘  Biography: Civil engineer and Nigerian politician representing the nation's capital.                         │ │
│ └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                  │
│ ┌───────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────┐ │
│ │ LEFT COLUMN: 4-STATE MANIFESTO PROMISE LEDGER (55%)       │ RIGHT COLUMN: LEGISLATIVE TIMELINE & RECORD (45%)                │ │
│ │                                                           │                                                                  │ │
│ │ [Filter: All (6) | Delivered (2) | In Progress (3) | (1)] │ [CHRONOLOGICAL LEGISLATIVE TIMELINE]                             │ │
│ │                                                           │                                                                  │ │
│ │ ┌───────────────────────────────────────────────────────┐ │  ● Nov 2026: Co-sponsored FCT Mayoral Autonomy Bill               │ │
│ │ │ PROMISE 1: FCT Mayoralty Autonomy Bill                │ │    Record: Introduced on floor; passed 1st reading (Hansard p. 12) │ │
│ │ │ Theme: Governance · Stated: 2023 Campaign Pledges     │ │                                                                  │ │
│ │ │ Status: 🟢 IN PROGRESS (1st Reading Passed)            │ │  ● Sep 2026: Motion on FCT Rural Infrastructure Deficit        │ │
│ │ │ Primary Source: National Assembly Order Paper #42     │ │    Action: Urged Minister of FCT to address satellite roads      │ │
│ │ └───────────────────────────────────────────────────────┘ │                                                                  │ │
│ │ ┌───────────────────────────────────────────────────────┐ │  ● Jun 2024: Voted in favour of National Minimum Wage Act     │ │
│ │ │ PROMISE 2: Primary Healthcare Upgrade in 6 Area Ccls  │ │    Voting Record: AYE (Official Senate Roll Call vote)          │ │
│ │ │ Theme: Healthcare · Stated: 2023 Town Hall            │ │                                                                  │ │
│ │ │ Status: 🟢 DELIVERED (₦1.2B Allocation Gazetted)       │ │  ● Mar 2024: Public hearing on FCT Security Surveillance        │ │
│ │ │ Primary Source: 2024 Appropriation Act (Budget Office)│ │    Watchdog Record: Premium Times investigative verification    │ │
│ │ └───────────────────────────────────────────────────────┘ │                                                                  │ │
│ │ ┌───────────────────────────────────────────────────────┐ │ ┌────────────────────────────────────────────────────────────────┐ │ │
│ │ │ PROMISE 3: Youth Technical Training Hubs              │ │ │ HEAD-TO-HEAD CANDIDATE COMPARISON                              │ │ │
│ │ │ Theme: Education · Stated: 2023 Youth Manifesto       │ │ │ Compare Sen. Ireti Kingibe side-by-side with prospective       │ │ │
│ │ │ Status: ⚪ NOT STARTED (No procurement recorded)       │ │ │ 2027 challengers on 6 standardized themes.                    │ │ │
│ │ └───────────────────────────────────────────────────────┘ │ │ [Launch Comparison Drawer →]                                  │ │ │
│ └───────────────────────────────────────────────────────────┴─┴────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Screen 3: Story & Development Detail ("The Perspective View")

### 3.1 Desktop Layout & Reading Anatomy (1280px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [TOP BAR: Back to The Lens Today · Category: Constitutional Governance · Published Nov 20, 2026 · 5 min read]                    │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                  │
│ ┌───────────────────────────────────────────────────────────────────────────────────────────────┬──────────────────────────────┐ │
│ │ MAIN EDITORIAL & PERSPECTIVE PANE (68% Col · Max Measure 720px)                               │ CONTEXTUAL SIDEBAR (32% Col) │ │
│ │                                                                                               │                              │ │
│ │ [KICKER: LEGISLATIVE REFORM · CERTIFIED AUDIO RECORDING AVAILABLE]                            │ ┌──────────────────────────┐ │ │
│ │ Senate Passes Landmark Local Government Financial Autonomy Bill                               │ │ MEDIA OWNERSHIP DIRECTORY│ │ │
│ │ In Two-Thirds Majority Vote                                                                   │ │ Reporting Outlets (12):   │ │ │
│ │                                                                                               │ │ • NTA: Federal State     │ │ │
│ │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │ │ • Punch: Independent     │ │ │
│ │ │ 15-SECOND KEY FACTS (Elect.ng Model)                                                      │ │ │ • Premium Times: Indep /  │ │ │
│ │ │ • Section 162 of the 1999 Constitution amended to mandate direct Federation Account       │ │ │   Investigative Watchdog │ │ │
│ │ │   disbursements to 774 Local Government Areas.                                            │ │ │ • TheCable: Independent    │ │ │
│ │ │ • State-Joint Local Government Accounts (SJLGA) abolished.                                │ │ └──────────────────────────┘ │ │
│ │ │ • Requires ratification by 24 State Houses of Assembly before presidential assent.        │ │                              │ │
│ │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │ ┌──────────────────────────┐ │ │
│ │                                                                                               │ │ PRIMARY SOURCE DOCUMENTS │ │ │
│ │ [THE NIGERIAN 4-PILLAR PERSPECTIVE DISTRIBUTION BAR]                                          │ │ 📜 Supreme Court Ruling  │ │ │
│ │ ┌─────────────────────────┬─────────────────────────┬─────────────────────────┬─────────────┐ │ │    SC/CV/343/2024 (PDF)  │ │ │
│ │ │ INCUMBENT / STATE       │ OPPOSITION              │ WATCHDOG / CIVIC        │ PUB RECORD  │ │ │ 📜 Senate Order Paper    │ │ │
│ │ │ 42% (9 Outlets)         │ 33% (7 Outlets)         │ 20% (4 Outlets)         │ 5% (Record) │ │ │    Votes & Proceedings   │ │ │
│ │ └─────────────────────────┴─────────────────────────┴─────────────────────────┴─────────────┘ │ └──────────────────────────┘ │ │
│ │                                                                                               │                              │ │
│ │ [SIDE-BY-SIDE FRAMING COMPARISON: HOW OUTLETS REPORTED THE SAME EVENT]                        │ ┌──────────────────────────┐ │ │
│ │ ┌───────────────────────────────────────────────┐ ┌─────────────────────────────────────────┐ │ │ TAKE CIVIC REHEARSAL     │ │ │
│ │ │ INCUMBENT / STATE MEDIA FRAMING               │ │ OPPOSITION & WATCHDOG FRAMING           │ │ │ Test your understanding  │ │ │
│ │ │ Headline: "Grassroots Development Unlocked as │ │ Headline: "Governors Plot Assembly      │ │ │ of this legislative vote.│ │ │
│ │ │ Senate Enacts Council Autonomy"               │ │ Pushback Over Council Funds"            │ │ │ [Start 60s Rehearsal →]  │ │ │
│ │ │ Focus: Grassroots service delivery, praise.   │ │ Focus: State Assembly lobbying, delay.  │ │ └──────────────────────────┘ │ │
│ │ └───────────────────────────────────────────────┘ └─────────────────────────────────────────┘ │                              │ │
│ │                                                                                               │                              │ │
│ │ [EDITORIAL SYNTHESIS (Neutral Newsreader Serif · 18px / 1.65 line-height)]                   │                              │ │
│ │ The Nigerian Senate on Wednesday passed the Constitution Alteration Bill No. 4, formally     │                              │ │
│ │ granting financial and administrative autonomy to all 774 local government councils in       │                              │ │
│ │ Nigeria. The vote follows a July 2024 Supreme Court ruling that declared State-Joint         │                              │ │
│ │ Accounts illegal under [Section 162] of the 1999 Constitution.                               │                              │ │
│ │ (Clicking [Section 162] opens an inline verified drawer without leaving the page).          │                              │ │
│ └───────────────────────────────────────────────────────────────────────────────────────────────┴──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Screen 4: Learn — "Civic Rehearsal" (Active Comprehension)

### 4.1 Structural Anatomy & Active Pedagogical States

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ACTIVE STATE 1: THE SCENARIO (Prediction-First Inquiry)                                          │
│                                                                                                  │
│ [Category: Electoral Act 2022 · 60 Seconds · Difficulty: Foundational]                           │
│ SCENARIO: A registered voter arrives at Polling Unit 004 at 2:15 PM. Voting officially ends      │
│ at 2:30 PM. The queue has 40 people. At 2:30 PM, the Presiding Officer announces that the polls │
│ are closed and tells the remaining citizens to go home.                                          │
│                                                                                                  │
│ QUESTION: Under Section 50 of the Electoral Act 2022 and INEC Regulations, is the Presiding      │
│ Officer's action lawful?                                                                         │
│                                                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [Option A] Yes: Once it is 2:30 PM, polling unit operations must cease immediately.          │ │
│ ├──────────────────────────────────────────────────────────────────────────────────────────────┤ │
│ │ [Option B] No: Any voter who was on the queue before 2:30 PM is lawfully entitled to be     │ │
│ │            accredited and cast their vote, regardless of how long it takes.                   │ │
│ ├──────────────────────────────────────────────────────────────────────────────────────────────┤ │
│ │ [Option C] It is at the discretion of the Police Officer on election duty.                    │ │
│ └──────────────────────────────────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ACTIVE STATE 2: THE REVEAL & DIGNIFIED EXPLANATION (Instant Smooth Transition on Tap)            │
│                                                                                                  │
│ 🟢 CORRECT: Option B                                                                             │
│                                                                                                  │
│ STATUTORY TRUTH ANCHOR:                                                                          │
│ Section 50(1), Electoral Act 2022 & INEC Regulations and Guidelines (Clause 28):                 │
│ "Voting shall commence at 8:30 AM and close at 2:30 PM, provided that any voter already in the   │
│ queue at 2:30 PM shall be accredited and allowed to vote."                                       │
│                                                                                                  │
│ KEY CIVIC TAKEAWAY:                                                                              │
│ If you join the queue at 2:29 PM, you cannot be turned away. The Presiding Officer is legally    │
│ required to place an official or security personnel at the back of the queue at 2:30 PM to mark  │
│ the final eligible voter.                                                                        │
│                                                                                                  │
│ [⭐ Saved to Your Civic Pocket]   [Share Sourced Card]   [Next 60-Second Rehearsal →]             │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Screen 5: Civic Camera & My Actions

### 5.1 Intake & Private Receipt Flow

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CIVIC CAMERA INTAKE SPECIFICATION                                                                │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ STRICT INTAKE RULES (Preventing Violations)                                                  │ │
│ │ ✔ ACCEPTED: Official Form EC8A Polling Unit Result Sheets posted publicly on election walls.  │ │
│ │ ✔ ACCEPTED: Polling booth accessibility issues, missing officials, or broken equipment.      │ │
│ │ ✖ FORBIDDEN: Photographs of marked ballot papers, citizens voting, or Voter's Cards (PVC).   │ │
│ └──────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ PHOTO CAPTURE ZONE (Drag & drop or Native Camera Launch)                                     │ │
│ │ ┌──────────────────────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ [ 📷 Launch Camera / Select Result Sheet Image ]                                          │ │ │
│ │ │ • Strips private GPS/EXIF metadata on-device before upload                                │ │ │
│ │ │ • Validates file size (max 8MB, compressed to WebP client-side)                           │ │ │
│ │ └──────────────────────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                                              │ │
│ │ POLLING UNIT IDENTIFIERS (Standardized 4-Tier Selection):                                    │ │
│ │ [ State: Lagos ]  [ LGA: Surulere ]  [ Ward: Yaba / Ojuelegba ]  [ PU Code: 24/18/04/008 ]   │ │
│ │                                                                                              │ │
│ │ [SUBMIT ANONYMOUS CIVIC RECORD BUTTON (Height: 48px · Forest Green)]                         │ │
│ └──────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ PRIVATE RECEIPT ISSUANCE (Zero-Login Token Architecture)                                     │ │
│ │                                                                                              │ │
│ │ Your report has been securely registered with MataLens.                                       │ │
│ │ PRIVATE RECEIPT TOKEN: [ ML-8K3P-9X2M-417Z ] [Copy Code]                                     │ │
│ │                                                                                              │ │
│ │ 🔒 Privacy Guarantee: Your submission is indexed strictly by this unguessable token. No name,  │ │
│ │    email, phone number, or IP address was recorded.                                          │ │
│ │                                                                                              │ │
│ │ [Download Receipt PDF]   [View in My Actions Tray]   [Return to The Lens Today]             │ │
│ └──────────────────────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```
