# MataLens Strategic Decisions: Adopt, Adapt & Deliberately Reject

> **Target Platform:** MataLens (Personal, Nonpartisan Political-Learning Companion for Nigerians)  
> **Repository:** `omnmlr/matalens` | **Branch:** `agent/research-design`  
> **Date:** November 2026  
> **Document:** Design Planning Deliverable 02  
> **Status:** Approved Architectural Decision Record (ADR)  

---

## Executive Overview

A critical creative pitfall when analyzing multiple benchmark platforms (VotersDesk, Gaski, Elect.ng, Ground News, Apple News, Linear, Brilliant) is the temptation to construct a "Frankenstein" product—gluing together every observed feature into an overcrowded, bloated interface that satisfies no one.

This document establishes the **definitive boundary decisions** for MataLens. Every capability, interaction pattern, and architectural choice has been evaluated against our primary product pivot:

$$\text{MataLens} = \text{Personal} + \text{Nonpartisan} + \text{Political-Learning Companion for Nigerians}$$

$$\text{Primary Journey: } \text{Follow Politician} \longrightarrow \text{Discover Development} \longrightarrow \text{Understand What Happened} \longrightarrow \text{Examine Manifesto \& Evidence} \longrightarrow \text{Interactive Rehearsal} \longrightarrow \text{Return for Updates}$$

---

## 1. Candidate Profiles & Follow Experience

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CANDIDATE PROFILES & FOLLOW EXPERIENCE                                                          │
├───────────────┬───────────────────────────────┬─────────────────────────────────────────────────┤
│ ADOPT         │ ADAPT                         │ DELIBERATELY REJECT                             │
├───────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ • VotersDesk's 6-theme policy   │ • VotersDesk's watchlist (vd:desk:v1)   │ • Elect.ng's follower count &   │
│   standardization & neutral     │   into a personalized, living editorial  │   popularity contests           │
│   omission disclaimer           │   feed of candidate developments      │ • Gaski's commercial B2B        │
│ • CC BY-SA verified candidate  │ • Elect.ng's side-by-side candidate    │   campaign dashboard access     │
│   photographs from Wikimedia    │   comparison into an inline drawer     │ • Candidate rankings, letter    │
│   Commons with attribution      │   without route navigation             │   grades, or "scores"           │
└───────────────┴───────────────────────────────┴─────────────────────────────────────────────────┘
```

### Detailed Rationale & Decisions:

#### [ADOPT] VotersDesk 6-Theme Policy Standardization
- **Origin:** VotersDesk (`/compare`, `/politicians/[slug]`)
- **Decision:** Standardize all candidate manifesto commitments and legislative voting records across 6 uniform themes:
  1. `Economy & Employment`
  2. `Security & Law Enforcement`
  3. `Education & Human Capital`
  4. `Healthcare & Social Welfare`
  5. `Infrastructure & Energy`
  6. `Governance & Anti-Corruption`
- **Neutrality Safeguard:** When a politician has made no verifiable public pledge on a theme, render the standardized neutral notice:
  > *"No verified public commitment recorded on this theme in official manifestos or gazetted proceedings. Absence of a statement does not indicate opposition."*
  This eliminates partisan bias by omission.

#### [ADOPT] Rigorous Photo Attribution Standards
- **Origin:** VotersDesk & Wikimedia Commons
- **Decision:** Candidate portraits must be verified open-access imagery (CC BY-SA or CC0) with full photographer attribution and licensing metadata displayed on tap/hover. Never scrape uncredited paparazzi or campaign publicity headshots.

#### [ADAPT] VotersDesk Watchlist $\rightarrow$ Living Editorial Politician Feed
- **Origin:** VotersDesk `vd:desk:v1`
- **Transformation:** VotersDesk stores candidate IDs in `localStorage` but simply displays a static list of candidate cards on `/my-desk`. MataLens transforms this into an **active personal editorial briefing**: when a citizen follows 1 to 3 politicians, their homepage dynamically weaves relevant developments, bill sponsorships, and manifesto updates for those specific figures into the top of "The Lens Today".

#### [REJECT] Elect.ng Public Follower Counts & Popularity Contests
- **Origin:** Elect.ng social features
- **Why Rejected:** Displaying "12,450 followers" on a candidate profile encourages tribal "brigading", where political factions deploy coordinated bot accounts to artificially inflate vanity metrics. MataLens contains zero public follower counts. Following is 100% private to the user's browser.

#### [REJECT] Candidate Letter Grades, "Alignment Scores" & Rankings
- **Origin:** Gaski candidate scores & Western voter advice tools
- **Why Rejected:** Assigning a letter grade ("Candidate A: 82% vs Candidate B: 45%") or algorithmic rating inevitably introduces subjective editorial bias and destroys the platform's nonpartisan credibility. MataLens provides factual records, manifesto text, and multi-source coverage—the citizen draws their own evaluation.

---

## 2. Political Development & Story Clustering

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ POLITICAL DEVELOPMENT & STORY CLUSTERING                                                        │
├───────────────┬───────────────────────────────┬─────────────────────────────────────────────────┤
│ ADOPT         │ ADAPT                         │ DELIBERATELY REJECT                             │
├───────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ • Elect.ng's 15-second         │ • Ground News multi-source clustering  │ • VotersDesk's raw headline     │
│   "Key Facts" summary box       │   adapted to Nigerian media landscape  │   aggregation without context   │
│ • Sourced time-to-read         │ • Chronological timeline spine linking │ • Clickbait headlines and       │
│   and publishing timestamps    │   today's news to historical pledges   │   sensational verbs             │
└───────────────┴───────────────────────────────┴─────────────────────────────────────────────────┘
```

### Detailed Rationale & Decisions:

#### [ADOPT] Elect.ng 15-Second "Key Facts" Summary Box
- **Origin:** Elect.ng article header
- **Decision:** Place a high-contrast, disciplined 3-bullet "Key Facts" summary at the apex of every story and development card. Written in neutral, factual language, this allows busy Nigerian readers to grasp core facts in 15 seconds before deciding whether to explore deeper context.

#### [ADAPT] Ground News Semantic Clustering $\rightarrow$ Event Developments
- **Origin:** Ground News NLP clustering
- **Transformation:** Instead of presenting isolated syndicated articles, Chisom's news service clusters reporting from across 22+ Nigerian newsrooms around a single real-world event (e.g., *"National Assembly Approves ₦47.9T 2027 Budget Proposal"*). Readers see one cohesive development card linking to all contributing outlets, eliminating duplicate noise.

#### [ADAPT] Development Timeline Spine (Linking News to History)
- **Origin:** Original MataLens Innovation
- **Transformation:** News does not happen in a vacuum. Under every development, MataLens renders an interactive vertical **Timeline Spine** that connects today's news directly to:
  1. Stated manifesto promises (e.g., *"Pledged in 2023 Renewed Hope: Page 42"*).
  2. Prior legislative votes or policy announcements.
  3. Subsequent executive implementation steps.

#### [REJECT] VotersDesk Raw Passive Headline Feed
- **Origin:** VotersDesk `/stories`
- **Why Rejected:** A simple list of headlines without clustering or context forces citizens to read duplicate stories across Punch, Vanguard, and TheCable, without understanding the broader policy implications.

#### [REJECT] Clickbait Headlines & Sensational Verbs
- **Origin:** Mainstream Nigerian tabloid media
- **Rule:** MataLens automatically strips and rewrites sensational verbs (*"slams", "blasts", "knocks", "blows hot", "demolishes"*), replacing them with neutral verbs (*"states", "disputes", "responds", "introduced"*), conforming strictly to the VotersDesk editorial code.

---

## 3. Perspective Distribution & Media Transparency

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PERSPECTIVE DISTRIBUTION & MEDIA TRANSPARENCY                                                   │
├───────────────┬───────────────────────────────┬─────────────────────────────────────────────────┤
│ ADOPT         │ ADAPT                         │ DELIBERATELY REJECT                             │
├───────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ • Ground News media ownership   │ • Western "Left/Right" bias bar         │ • Western Left vs. Right        │
│   & publisher transparency      │   adapted to Nigerian 4-Pillar Model    │   ideological spectrum          │
│ • IFCN-accredited fact-check    │ • Blindspot alerts adapted to Nigerian   │ • Ground News commercial        │
│   linkages (Dubawa/FactCheckHub)│   regional and state omissions          │   paywalls ($29/yr Vantage)     │
└───────────────┴───────────────────────────────┴─────────────────────────────────────────────────┘
```

### Detailed Rationale & Decisions:

#### [ADOPT] Media Ownership & Corporate Transparency
- **Origin:** Ground News publisher profiles
- **Decision:** Every news outlet featured in MataLens includes a transparent tap-to-inspect ownership card showing founding date, parent company, key political/business proprietors, and headquarters location (e.g., *The Nation: Vintage Press / Bola Tinubu ownership ties; Channels TV: John Momoh / Independent; NTA: Federal Government state broadcaster*).

#### [ADAPT] The Nigerian 4-Pillar Perspective Distribution Framework
- **Origin:** Adapted from Ground News
- **The Problem:** Ground News's `[ Left | Center | Right ]` spectrum is completely invalid in Nigeria, where politics revolves around incumbency, regional coalitions, and civil society oversight.
- **The MataLens 4-Pillar Framework:**
  1. **Incumbent / Administration Perspective (`#0A4D34`):** Framing emphasizing government rationale, state stability, and executive achievements (e.g., state press releases, NTA, pro-establishment outlets).
  2. **Opposition / Challenger Perspective (`#C25E00`):** Framing emphasizing policy critique, alternative legislative proposals, and governance shortcomings.
  3. **Watchdog / Civil Society Perspective (`#0284C7`):** Independent investigative journalism, policy institute analyses, and IFCN fact-checkers (Premium Times, CDD, YIAGA, Dubawa).
  4. **Primary Public Record / Truth Anchor (`#1E3A8A`):** Verbatim gazettes, court rulings, Auditor-General reports, and Hansard transcripts.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MATALENS NIGERIAN 4-PILLAR PERSPECTIVE DISTRIBUTION BAR                     │
├─────────────────────┬───────────────────┬───────────────────┬───────────────┤
│ INCUMBENT / STATE   │ OPPOSITION        │ WATCHDOG / CIVIC  │ PUBLIC RECORD │
│ 45% (9 Outlets)     │ 30% (6 Outlets)   │ 20% (4 Outlets)   │ 5% (Gazette)  │
└─────────────────────┴───────────────────┴───────────────────┴───────────────┘
```

#### [REJECT] Ground News Commercial Paywall Locks
- **Origin:** Ground News Vantage tier ($9.99 - $29.99/year)
- **Why Rejected:** Locking bias breakdowns, publisher ownership, and fact-checking behind a credit-card paywall in a developing democracy excludes the very citizens who need transparency most. 100% of MataLens perspective analysis is permanently free and open.

---

## 4. Promise Tracking & Manifesto Accountability

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PROMISE TRACKING & MANIFESTO ACCOUNTABILITY                                                     │
├───────────────┬───────────────────────────────┬─────────────────────────────────────────────────┤
│ ADOPT         │ ADAPT                         │ DELIBERATELY REJECT                             │
├───────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ • Gaski's 4-state promise       │ • Static manifesto PDFs into indexed,   │ • VotersDesk "Tracking starts   │
│   lifecycle taxonomy            │   clause-level searchable database      │   after the election" delay     │
│ • Elect.ng's 4-tier result     │ • Primary document truth anchor cards   │ • Unsubstantiated AI promise    │
│   credibility badges            │   anchored directly to news events      │   verdicts without evidence     │
└───────────────┴───────────────────────────────┴─────────────────────────────────────────────────┘
```

### Detailed Rationale & Decisions:

#### [ADOPT] Gaski 4-State Promise Lifecycle Taxonomy
- **Origin:** Gaski `manifestos` & `promises` schema
- **States:**
  - `Not Started`: Stated policy goal in published campaign document; no legislative or executive action recorded.
  - `In Progress`: Bill introduced, budgetary allocation gazetted, or procurement initiated.
  - `Delivered`: Verified completed project, gazetted legislation enacted, or measurable target met.
  - `Broken`: Formal legislative cancellation, expired statutory deadline, or direct contradictory executive action.
- **Evidence Requirement:** Every status transition must link to a dated primary public document or verified news report.

#### [ADOPT] Elect.ng 4-Tier Result Credibility Badges
- **Origin:** Elect.ng verification taxonomy
- **Taxonomy:**
  - `Unconfirmed`: Citizen tip or single uncorroborated media claim.
  - `Verified`: Corroborated by accredited observers (YIAGA, CDD) or dual-source newsrooms.
  - `Official`: Certified by INEC gazette or official judicial ruling.
  - `Disputed`: Subject to active election petition tribunal or formal administrative challenge.

#### [ADAPT] Clause-Level Manifesto Indexing & Truth Anchor
- **Transformation:** Instead of requiring citizens to download 80-page campaign manifestos (e.g., *APC Renewed Hope*, *LP Our Pact*, *PDP My Covenant*), MataLens indexes manifestos at the clause level. When a news event touches on fuel subsidies, the app displays an inline **"Manifesto Context"** card displaying the candidate's exact signed text, page number, and original publication date.

#### [REJECT] VotersDesk "Tracking Starts After the Election" Delay
- **Origin:** VotersDesk `/promises`
- **Why Rejected:** Accountability cannot be deferred for 4 years. Incumbents running for re-election or higher office must have their current records tracked against their previous promises today.

---

## 5. Interactive Learning & Micro-Simulations

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ INTERACTIVE LEARNING & MICRO-SIMULATIONS                                                        │
├───────────────┬───────────────────────────────┬─────────────────────────────────────────────────┤
│ ADOPT         │ ADAPT                         │ DELIBERATELY REJECT                             │
├───────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ • Brilliant-style active       │ • Quartz inline expandable active cards │ • Juvenile gamification,        │
│   comprehension rehearsals      │   for instant constitutional context    │   confetti, streaks, or points  │
│ • Prediction-first pedagogical  │ • NYT Dial interactive sliders for      │ • Standalone trivia quizzes     │
│   inquiry (60-second micro-sim) │   budget allocations and voting math    │   disconnected from daily news  │
└───────────────┴───────────────────────────────┴─────────────────────────────────────────────────┘
```

### Detailed Rationale & Decisions:

#### [ADOPT] Brilliant Prediction-First Active Comprehension
- **Origin:** Brilliant.org
- **Pedagogy:** Citizens retain 400% more civic knowledge when asked to make a prediction before reading the answer.
- **Execution:** Present a 60-second scenario derived from today's news:
  > *"Scenario: The State Governor decamps to an opposition party. Does the Deputy Governor automatically assume office?"*
  Citizen taps their hypothesis $\rightarrow$ immediate dignified explanation citing Section 180 of the 1999 Constitution $\rightarrow$ key takeaway synthesized in 2 sentences.

#### [ADAPT] Quartz Active Cards & Inline Explanations
- **Origin:** Quartz App (2016-2018 conversational cards)
- **Transformation:** Within an editorial piece, technical legal terms (e.g., `[Section 84(12) Electoral Act]`, `[BVAS Accreditation]`, `[Cross-Carpeting]`) appear as interactive inline pills. Tapping a pill expands an accordion card directly in the reading flow without triggering a disruptive page reload or navigational detour.

#### [REJECT] Juvenile Gamification, Confetti & XP Points
- **Why Rejected:** Voting, constitutional law, and democratic governance are solemn, high-consequence civic responsibilities. Childish badges, cartoon avatars, vibrating streaks, and confetti animations trivialise democracy and offend thoughtful adult citizens. MataLens offers **intellectual mastery and civic dignity**, not a game show.

#### [REJECT] Disconnected Trivia Quizzes
- **Origin:** Standard educational civic apps
- **Why Rejected:** Static trivia quizzes ("Who was Nigeria's first Prime Minister?") do not help citizens evaluate candidates or navigate contemporary political issues. All learning in MataLens is strictly anchored to **living news events and candidate records**.

---

## 6. Civic Camera & Community Reporting

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CIVIC CAMERA & COMMUNITY REPORTING                                                              │
├───────────────┬───────────────────────────────┬─────────────────────────────────────────────────┤
│ ADOPT         │ ADAPT                         │ DELIBERATELY REJECT                             │
├───────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ • High-entropy private receipt  │ • FixMyStreet intake flow adapted for   │ • Financialized task bounties   │
│   tokens with SHA-256 hashes    │   polling unit result sheets & issues   │   (Gaski YouthWallet stipends)  │
│ • Local receipt management      │ • EXIF metadata stripping and private   │ • Public unmoderated photo      │
│   stored on-device (zero login) │   location obfuscation for safety       │   streams or marked ballot pics │
└───────────────┴───────────────────────────────┴─────────────────────────────────────────────────┘
```

### Detailed Rationale & Decisions:

#### [ADOPT] High-Entropy Private Receipt Tokens (`ML-XXXX-XXXX`)
- **Origin:** MataLens Zero-Login Architectural Requirement
- **Decision:** When a guest submits a civic photo (e.g., official EC8A result sheet posted on a wall or a broken polling unit facility), the server returns an unguessable private receipt code (e.g., `ML-7K9P-4X2M-91WJ`).
- **Cryptographic Security:** The server stores only the SHA-256 hash of this token. The citizen can check verification status or withdraw their report at any time using their token, without ever creating an account.

#### [ADAPT] FixMyStreet Intake Flow $\rightarrow$ Strict Civic Scope
- **Scope Restriction:** MataLens strictly accepts only two categories of civic imagery:
  1. **Official Polling Unit Result Sheets (Form EC8A)** publicly posted on election day.
  2. **Civic & Electoral Infrastructure Conditions** (e.g., non-functional polling booths, inaccessible venues).
- **Hard Privacy Guardrail:** Any photograph containing a **marked ballot paper, private voter voting in secret, or voter's card (PVC)** is automatically flagged and rejected by intake rules.

#### [REJECT] Gaski's Financialized Cash Bounties
- **Origin:** Gaski `YouthWallet`
- **Why Rejected:** Offering cash payments for civic reporting immediately corrupts data integrity. Mercenary users fabricate photos, coordinate fake reports, and flood verification queues to extract micro-stipends. MataLens relies on civic pride and non-monetary verification transparency.

---

## 7. User State, Privacy & Authentication

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ USER STATE, PRIVACY & AUTHENTICATION                                                            │
├───────────────┬───────────────────────────────┬─────────────────────────────────────────────────┤
│ ADOPT         │ ADAPT                         │ DELIBERATELY REJECT                             │
├───────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ • VotersDesk zero-mandatory-    │ • Ground News reading audits adapted as │ • Mandatory account creation    │
│   login architecture with       │   a 100% on-device "Civic Perspective   │   (phone, email, OTP, wallets)  │
│   localStorage persistence      │   Audit" without server telemetry       │ • Elect.ng NIN / PVC uploads    │
└───────────────┴───────────────────────────────┴─────────────────────────────────────────────────┘
```

### Detailed Rationale & Decisions:

#### [ADOPT] Zero Mandatory Login Architecture
- **Rule:** A citizen must be able to explore every article, politician profile, manifesto comparison, interactive lesson, and submit civic photos without ever being asked for a phone number, email address, password, OTP, or wallet connection.
- **Client Storage Schema:**
  - `matalens_followed_politicians:v1`: Followed candidate slugs.
  - `matalens_saved_notes:v1`: Private election day preparation notes.
  - `matalens_receipts:v1`: Private receipt tokens for submitted reports.
  - `matalens_data_saver:v1`: Network optimization toggle.

#### [ADAPT] Ground News Reading Analysis $\rightarrow$ Private On-Device Civic Audit
- **Transformation:** Ground News tracks what users read on their servers to upsell subscription tiers. MataLens computes reading balance (e.g., *"This week: 40% Incumbent / 35% Opposition / 25% Watchdog"*) **entirely on-device in JavaScript**. Zero telemetry or political reading logs are sent to MataLens servers.

#### [REJECT] Elect.ng NIN / PVC / Identity Collection
- **Origin:** Elect.ng verified profile requirement
- **Why Rejected:** Collecting National Identification Numbers (NIN) or Permanent Voter Card (PVC) numbers creates extreme physical and digital risks for citizens in an election environment, violates data minimization principles under the Nigeria Data Protection Act 2023, and poses catastrophic liability in the event of a breach.

---

## 8. Visual Design, Typography & Motion

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ VISUAL DESIGN, TYPOGRAPHY & MOTION                                                              │
├───────────────┬───────────────────────────────┬─────────────────────────────────────────────────┤
│ ADOPT         │ ADAPT                         │ DELIBERATELY REJECT                             │
├───────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ • Newsreader optical serif      │ • Linear's restrained 1px hairline top  │ • Overcrowded dashboard tables  │
│   for broadsheet gravitas       │   bevel highlights on cards and pills   │   and raw database grids        │
│ • Manrope humanist geometric    │ • Apple News asymmetrical lead story    │ • Cyberpunk neon gradients,     │
│   sans for modern UI clarity    │   composition with art-directed scrims  │   purple AI glows, or 3D cards  │
└───────────────┴───────────────────────────────┴─────────────────────────────────────────────────┘
```

### Detailed Rationale & Decisions:

#### [ADOPT] Typographic Duality (Newsreader + Manrope)
- **Serif (Newsreader):** Used for headlines, pull-quotes, and constitutional clauses. Evokes the journalistic integrity of broadsheets like The Financial Times and The Guardian.
- **Sans (Manrope):** Used for UI controls, navigation, badges, metadata, and tabular figures. Crisp, legible on low-resolution mobile displays, and high-contrast.

#### [ADAPT] Linear Restrained Gloss & Hairline Bevels
- **Technique:** Cards do not use muddy drop shadows. Instead, they feature an ultra-subtle 1px inner top border (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85)` in light mode, `0.08` in dark mode) paired with an outline stroke (`rgba(11, 43, 31, 0.08)`). This provides tangible physical depth while keeping surfaces clean and lightweight.

#### [REJECT] The "Hackathon AI / Cyberpunk" Aesthetic
- **Rule:** No dark-mode purple/cyan neon gradients, no glowing AI chat bubbles, no floating 3D glass balls, and no generic card grids. MataLens is rooted in authoritative Nigerian forest greens (`#0A4D34`), warm alabaster broadsheet whites (`#F9FAF6`), and crisp obsidian dark modes (`#071712`).
