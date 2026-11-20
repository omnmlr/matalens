# MataLens Product Concept & Living Editorial Homepage Architecture

> **Target Platform:** MataLens (Personal, Nonpartisan Political-Learning Companion for Nigerians)  
> **Repository:** `omnmlr/matalens` | **Branch:** `agent/research-design`  
> **Date:** November 2026  
> **Document:** Design Planning Deliverable 03  
> **Status:** Approved Core Product Architecture  

---

## 1. Executive Summary & The Product Pivot

### 1.1 Why the Election Dashboard Fails Citizens
Traditional civic tech platforms treat citizens like bureaucratic administrators. When a user opens platforms like VotersDesk or INEC portals, they are greeted by an overwhelming, static dashboard:
- 36 states in alphabetical dropdowns
- 109 senatorial districts and 360 federal constituencies
- Lists of hundreds of political candidates with identical placeholder badges
- Dense tables of election dates and procedural requirements

**This model fails Nigerian voters for three psychological and structural reasons:**
1. **Decision Paralysis & Cognitive Overload:** An everyday citizen in Ikeja, Kaduna, or Aba does not want to wade through 400 national profiles. They care deeply about **their specific representatives** and **the major issues impacting their daily livelihood** (cost of food, electricity tariffs, security, education).
2. **Episodic Irrelevance:** Dashboards only feel relevant for 48 hours once every four years on election day. Between elections, they become digital ghost towns.
3. **Passive, Uncontextualized Aggregation:** Dumping raw newspaper headlines without explaining *what actually happened*, *who is accountable*, or *what the law says* leaves citizens cynical and confused.

### 1.2 The MataLens Breakthrough: "The Personal Political-Learning Companion"
MataLens fundamentally pivots the paradigm. It is not an election directory; it is a **living, personal companion for democratic understanding**. 

It transforms democracy from an opaque 4-year spectacle into a daily, digestible, high-status ritual of personal learning and accountability.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE SIGNATURE MATALENS CIVIC LEARNING LOOP                            │
│                                                                                                 │
│   ┌─────────────────────┐       ┌──────────────────────┐       ┌────────────────────────────┐   │
│   │ 1. FOLLOW           │       │ 2. DISCOVER          │       │ 3. UNDERSTAND              │   │
│   │ Follow 1-3          │ ────> │ Curated development  │ ────> │ 15-second Key Facts        │   │
│   │ politicians of      │       │ on "The Lens Today"  │       │ + 4-Pillar Perspective    │   │
│   │ personal interest   │       │ with verified claims │       │ Distribution Analysis      │   │
│   └─────────────────────┘       └──────────────────────┘       └─────────────┬──────────────┘   │
│                                                                              │                  │
│   ┌─────────────────────┐       ┌──────────────────────┐                     │                  │
│   │ 6. RETURN           │       │ 5. REHEARSE          │       ┌─────────────▼──────────────┐   │
│   │ Return for living   │ <──── │ 60-second active     │ <──── │ 4. EXAMINE EVIDENCE        │   │
│   │ updates & timeline  │       │ civic comprehension  │       │ Truth Anchor: manifesto    │   │
│   │ developments        │       │ micro-scenario       │       │ clauses & gazetted records │   │
│   └─────────────────────┘       └──────────────────────┘       └────────────────────────────┘   │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Core Architecture: "The Lens Today" (Living Editorial Homepage)

The MataLens homepage ceases to be a static grid of links. It becomes **"The Lens Today"**—a dynamic broadsheet that blends the editorial pacing of *Apple News* with the tactile craft of *Linear*.

### 2.1 Compositional Hierarchy & Pacing

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DESKTOP HOMEPAGE WIREFRAME: "THE LENS TODAY" (1280px / 1440px)                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Top Bar: Brand "MataLens" · Data Saver Toggle · Search (Cmd+K) · Offline Sync Pill]            │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ SECTION 1: MY FOLLOWED BRIEFING (Zero-Login / Local-First)                                  │ │
│ │ "Good morning. Here is what your followed representatives did this week."                   │ │
│ │ ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────────┐ │ │
│ │ │ Gov. Sanwo-Olu    │ │ Sen. Ireti Kingibe│ │ Peter Obi         │ │ + Follow Another      │ │ │
│ │ │ 2 new developments│ │ 1 bill sponsored  │ │ 1 policy speech   │ │ Discover candidates   │ │ │
│ │ └───────────────────┘ └───────────────────┘ └───────────────────┘ └───────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                 │
│ ┌───────────────────────────────────────────────────────┬─────────────────────────────────────┐ │
│ │ SECTION 2: THE LEAD DEVELOPMENT ANCHOR (65% Col)     │ SECTION 3: EDITORIAL DIGEST (35%)   │ │
│ │                                                       │                                     │ │
│ │ [KICKER: FISCAL REFORM · SIGNED EXECUTIVE ORDER]     │ ┌─────────────────────────────────┐ │ │
│ │ 2027 Budget Allocation: Fuel Subsidy & Power          │ │ PERSPECTIVE RADAR               │ │ │
│ │ Tariffs Under Legislative Review                      │ │ Story: Electoral Act Amendment  │ │ │
│ │                                                       │ │ [Incumbent: 70% | Opp: 30%]     │ │ │
│ │ ┌───────────────────────────────────────────────────┐ │ └─────────────────────────────────┘ │ │
│ │ │ 15-SECOND KEY FACTS                               │ │                                     │ │
│ │ │ • Senate approves ₦47.9T aggregate framework      │ │ ┌─────────────────────────────────┐ │ │
│ │ │ • Capital expenditure pegged at 38% of total     │ │ │ DAILY CIVIC REHEARSAL         │ │ │
│ │ │ • Opposition questions debt servicing ratio       │ │ │ "Can a Governor remove an     │ │ │
│ │ └───────────────────────────────────────────────────┘ │ │  elected LGA Chairman?"         │ │ │
│ │                                                       │ │ [Take 60-Second Scenario]       │ │ │
│ │ [ 4-Pillar Perspective Distribution Bar ]             │ └─────────────────────────────────┘ │ │
│ │ [Incumbent 45%] [Opposition 30%] [Watchdog 20%] [Gaz] │                                     │ │
│ │                                                       │ ┌─────────────────────────────────┐ │ │
│ │ [Timeline Spine: 3 Prior Linked Commitments]          │ │ PROMISE IN FOCUS                │ │ │
│ │ • 2023 Manifesto Pledge: Renewed Hope, p. 18        │ │ 10,000MW Power Grid Pledge      │ │ │
│ │ • Oct 2024 FEC Approval                             │ │ Status: IN PROGRESS (FEC Award) │ │ │
│ │ • Today: Appropriations Committee Hearing           │ └─────────────────────────────────┘ │ │
│ └───────────────────────────────────────────────────────┴─────────────────────────────────────┘ │
│                                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ SECTION 4: THEMATIC EDITORIAL CLUSTER: "THE BATTLE FOR THE RED CHAMBER"                     │ │
│ │ Deep-dive cluster on key Senate seats, legislative voting records, and manifesto alignment  │ │
│ │ ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────────────┐ │ │
│ │ │ Lagos East: Tax Bill    │ │ Kano Central: Security  │ │ Rivers South-East: Oil Revenue  │ │ │
│ │ │ Voting Record Analysis  │ │ Oversight Hearing       │ │ Host Community Compliance       │ │ │
│ │ └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ SECTION 5: SUPPORTING CAPABILITIES TRAY                                                      │ │
│ │ ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────────────┐ │ │
│ │ │ 🗳️ Polling Unit Guidance │ │ 📅 Key 2027 Dates       │ │ 📷 Civic Camera & My Actions    │ │ │
│ │ │ Find your PU code       │ │ INEC statutory schedule │ │ Secure receipt-backed intake    │ │ │
│ │ └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Breakdown

### 3.1 The "My Followed Briefing" Strip (Zero-Login Personalization)
- **Problem Solved:** How to personalize a user's experience without an account or login gate.
- **Mechanism:**
  - On first visit, MataLens displays an elegant, non-intrusive onboarding prompt:
    > *"Follow 1 to 3 Nigerian politicians to receive clear, sourced updates on their promises and actions."*
  - The citizen taps to follow any candidate (e.g., their State Governor, local Senator, or a Presidential candidate).
  - The selection is stored strictly on-device in `localStorage` (`matalens_followed_politicians:v1`).
  - On subsequent visits, the top of the homepage highlights a **Morning Briefing Tray** showing recent developments, bill sponsorships, or speech checks for those specific individuals.
  - If zero politicians are followed, this space smoothly collapses into a curated "Suggested Representatives in the News" carousel.

### 3.2 The Lead Development Anchor
The primary story on "The Lens Today" is not a static link to an external article. It is an **integrated development card** containing five layered zones of comprehension:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE 1: EDITORIAL KICKER & HEADLINE                                         │
│ Category: Constitutional Governance · 4 Hours Ago · 3 min read              │
│ National Assembly Passes Landmark Local Government Financial Autonomy Bill  │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE 2: 15-SECOND KEY FACTS (Elect.ng Model)                                │
│ • Section 162 of the 1999 Constitution amended to mandate direct Federation  │
│   Account allocation disbursements to all 774 Local Government Areas.       │
│ • State-Joint Local Government Accounts (SJLGA) formally abolished.          │
│ • Bill passed with 88 Senate votes; transmitted to 36 State Assemblies.     │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE 3: 4-PILLAR PERSPECTIVE DISTRIBUTION BAR (Nigerian Ground News Model)  │
│ [State Broadcasters: 40%] [Opposition Lawmakers: 35%] [Civil Society: 25%]  │
│ • State View: "Direct funding will accelerate grassroots development."      │
│ • Opp. View: "Risk of local corruption without state oversight audit."      │
│ • Watchdog View (CDD/YIAGA): "Historic step, but enforcement rests on EFCC."│
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE 4: TRUTH ANCHOR (Primary Document Verification)                        │
│ 📜 Primary Source: Supreme Court Judgment SC/CV/343/2024 (Certified Copy)   │
│ 🔍 Manifesto Link: APC Renewed Hope, p. 24 ("Empowering Grassroots Councils")│
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE 5: SIGNATURE DEVELOPMENT TIMELINE SPINE                                │
│ ○ Jul 2024: Supreme Court rules State-Joint accounts unconstitutional       │
│ ○ Oct 2024: Senate Committee on Constitutional Review introduces amendment │
│ ● Today: Bill passes 3rd reading with two-thirds majority in Senate        │
│ ◌ Pending: Ratification by at least 24 of 36 State Houses of Assembly      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 The Signature "Political Development Timeline Spine"
A major flaw of modern political news is **temporal amnesia**: a politician announces an initiative today, and nobody remembers that the same initiative was announced three years ago, or that it directly contradicts a pledge made during the campaign.

The MataLens **Development Timeline Spine** connects news to historical context:
1. **Vertical Progression:** A subtle, solid 2px forest-tinted line (`border-left: 2px solid #0A4D34`) runs down the left edge of the development.
2. **Node States:**
   - **Solid Node (`#0A4D34`):** Completed historical event with verified documentation (court judgment, official gazette, recorded vote).
   - **Active Current Node (`#136847` with pulse):** Today's breaking development.
   - **Dashed / Hollow Node (`#D4DCD6`):** Stated future milestone or required statutory next step (e.g., *"Presidential Assent required within 30 days under Section 58"*).
3. **Interactive Inspection:** Clicking any prior node expands a 2-sentence summary and a link to the primary source document.

### 3.4 Sourced Micro-Learning Card: "Civic Rehearsal"
To reinforce active learning directly on the homepage, MataLens embeds a **Daily Civic Rehearsal Card** (inspired by Brilliant's active inquiry methodology):
- **Headline:** *"60-Second Civic Rehearsal: The Decamping Clause"*
- **Scenario:** *"Senator X leaves the PDP and joins the APC, claiming 'division' in the national executive. Under Section 68(1)(g) of the Constitution, what must happen for him to retain his seat?"*
- **Interactive Options:**
  - `[ Option A ]` The Senate President must automatically declare the seat vacant.
  - `[ Option B ]` He retains the seat if he proves an irremediable split exists in the party's national structure.
  - `[ Option C ]` A recall petition signed by 50% of registered constituents is mandatory.
- **Immediate Dignified Resolution:** On selection, the card flips smoothly to reveal the correct legal answer (`Option B`), cites the leading Supreme Court authority (*Abegunde v. Ondo State House of Assembly*), and highlights the key lesson in plain English.
- **Local Progress:** Stored in `localStorage` (`matalens_learning_rehearsals:v1`), allowing the user to track how many civic concepts they have mastered.

### 3.5 Supporting Capabilities Tray
The essential civic utilities that previously cluttered the homepage are respectfully tucked into an accessible, high-utility **Supporting Capabilities Tray** at the base of the page:
1. **Polling Unit Guidance (`/polling-unit`):** Quick code lookup (`XX/XX/XX/XXX`) and offline map guidance.
2. **Election Calendar & Timetable (`/calendar`):** Key statutory dates for the 2027 general elections and off-cycle gubernatorial races.
3. **Civic Camera & My Actions (`/camera`):** Anonymous, receipt-backed photo intake of official result sheets (Form EC8A) and local polling issues.

---

## 4. Mobile Architecture (390px Viewport)

On mobile devices (the dominant medium for over 85% of Nigerian users), "The Lens Today" adapts into a focused, highly readable single-column stream with zero horizontal overflow:

```
┌────────────────────────────────────────┐
│ 390px MOBILE HOMEPAGE ARCHITECTURE     │
├────────────────────────────────────────┤
│ [=] MataLens              [Data Saver] │
├────────────────────────────────────────┤
│ MY FOLLOWED LEADERS                    │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌──────┐ │
│ │(Photo)│ │(Photo)│ │(Photo)│ │ [+]  │ │
│ │Sanwo  │ │Ireti  │ │Obi    │ │Follow│ │
│ └───────┘ └───────┘ └───────┘ └──────┘ │
├────────────────────────────────────────┤
│ LEAD DEVELOPMENT                       │
│ [Kicker: Supreme Court Ruling]         │
│ Local Govt Financial Autonomy Enacted  │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ 15-SECOND KEY FACTS                │ │
│ │ • Direct FAAC allocations to LGAs  │ │
│ │ • Joint accounts abolished         │ │
│ └────────────────────────────────────┘ │
│                                        │
│ PERSPECTIVE DISTRIBUTION               │
│ [State: 40%] [Opp: 35%] [Watch: 25%]   │
│                                        │
│ [View Full Development & Timeline ->]  │
├────────────────────────────────────────┤
│ TODAY'S CIVIC REHEARSAL                │
│ "Can a Governor remove an LGA Chair?"  │
│ [ Take 60s Rehearsal ]                 │
├────────────────────────────────────────┤
│ THEMATIC CLUSTER: 2027 SENATE WATCH   │
│ • Lagos East: Tax Reform Bill Vote     │
│ • Kano Central: Security Oversight     │
├────────────────────────────────────────┤
│ [ BOTTOM NAVIGATION: 4 TABS ]          │
│ [Home]   [Politicians]  [Learn]  [Cam] │
└────────────────────────────────────────┘
```

---

## 5. Nonpartisan Guardrails & Neutrality Guarantees

To ensure that the living editorial homepage never becomes an instrument of partisan bias or government propaganda, MataLens enforces four strict programmatic guardrails:

1. **The 40% Publisher Cap:** No single political party, media house, or political figure can occupy more than 40% of the featured stories in any 7-day rolling window.
2. **The Mandatory Perspective Rule:** No lead development can be published on "The Lens Today" without at least **two opposing perspectives** or an official **Primary Public Record** citation.
3. **Neutral Verbs Filter:** All headlines ingested from external newsrooms are automatically stripped of sensationalist, inflammatory verbs (*"slams", "blasts", "bombs", "destroys"*) and replaced with disciplined journalistic language.
4. **Zero Editorial Endorsement:** MataLens never publishes staff opinions, editorial endorsements, candidate report cards, or speculative polling projections.
