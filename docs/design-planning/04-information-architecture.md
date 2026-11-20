# MataLens Minimal Information Architecture & Navigation Specification

> **Target Platform:** MataLens (Personal, Nonpartisan Political-Learning Companion for Nigerians)  
> **Repository:** `omnmlr/matalens` | **Branch:** `agent/research-design`  
> **Date:** November 2026  
> **Document:** Design Planning Deliverable 04  
> **Status:** Approved Information Architecture Specification  

---

## 1. Architectural Philosophy: The Anti-Sprawl Imperative

### 1.1 The Pitfall of Civic Site Sprawl
Our reverse engineering of **VotersDesk** (421 sitemap URLs) and **Elect.ng** revealed a recurring anti-pattern in civic applications: **navigational bloat**. Platforms attempt to create distinct top-level pages for every conceivable entity:
- `/states/[state]`
- `/parties/[party]`
- `/elections/[year]/[race]`
- `/candidates/[slug]`
- `/stories`
- `/compare`
- `/this-week`
- `/promises`
- `/quiz`
- `/ask`
- `/ballot`

The result is navigational fatigue, high bounce rates, and broken mobile menus. When users must remember 10 different categories, they end up exploring none of them.

### 1.2 The MataLens 4-Pillar Navigation Rule
MataLens consolidates all civic discovery, political tracking, and learning into a **disciplined 4-tab model**. Every screen in the application is reachable in $\le 2$ taps from the primary navigation bar.

Contextual tasks (e.g., inspecting a manifesto excerpt, viewing a photo evidence sheet, or taking a 60-second learning scenario) are implemented as **contextual slide-over sheets and drawers**, preserving the user's reading position rather than forcing destructive page transitions.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           MATALENS 4-PILLAR PRIMARY NAVIGATION MODEL                            │
├─────────────────────┬───────────────────┬───────────────────────────┬───────────────────────────┤
│ 1. HOME             │ 2. POLITICIANS    │ 3. LEARN                  │ 4. CAMERA & ACTIONS       │
│ "The Lens Today"    │ Dossiers & Records│ Active Civic Rehearsal    │ Private Receipt Intake    │
├─────────────────────┼───────────────────┼───────────────────────────┼───────────────────────────┤
│ • Followed Leader   │ • Search & Filter │ • 60-Second Rehearsals    │ • Form EC8A Result Sheet  │
│   Briefing          │ • Candidate Cards │ • Electoral Act 2022      │   Photo Intake            │
│ • Lead Development  │ • 4-State Promise │   Interactive Scenarios   │ • Civic Incident Intake   │
│   Anchor & Timeline │   Ledger          │ • Fact-Checking Literacy  │ • Unguessable SHA-256     │
│ • Daily Rehearsal   │ • Side-by-Side    │ • Election Day Field Guide│   Receipt Retrieval       │
│ • Thematic Clusters │   Policy Compare  │ • Voter Rights & Security │ • My Actions Dashboard   │
└─────────────────────┴───────────────────┴───────────────────────────┴───────────────────────────┘
```

---

## 2. Complete URL Route Tree & Deep-Linking Structure

MataLens maintains a clean, human-readable, SEO-optimized URL hierarchy. All routes support standard HTTP `GET` requests, server-side pre-rendering, and direct social sharing via OpenGraph tags.

```
/
├── /                                          [Tab 1: The Lens Today (Homepage)]
│
├── /developments                              [All Clustered Developments Index]
│   └── /developments/[slug]                   [Single Clustered Development + Timeline Spine]
│
├── /politicians                               [Tab 2: Candidate Directory & Search]
│   ├── /politicians/[slug]                    [Politician Dossier + Promises + Timeline]
│   └── /politicians/compare                   [Standardized Side-by-Side Comparison]
│
├── /learn                                     [Tab 3: Civic Learning Hub]
│   ├── /learn/rehearsals                      [Active Comprehension Scenarios]
│   │   └── /learn/rehearsals/[slug]           [Single Interactive Civic Rehearsal]
│   ├── /learn/electoral-act                   [Interactive Guide to Electoral Act 2022]
│   └── /learn/rights                          [Voter Rights & Security Guidelines]
│
├── /camera                                    [Tab 4: Civic Camera & Reporting]
│   ├── /camera/capture                        [Camera / File Upload Flow]
│   ├── /camera/receipt/[code]                 [Private Status View via Unguessable Token]
│   └── /camera/my-actions                     [Local-First Receipt History & Active Submissions]
│
└── /utilities (Supporting Capabilities)
    ├── /utilities/polling-unit                [Polling Unit Locator & Offline Format Parser]
    ├── /utilities/calendar                    [2027 Statutory Timetable & Off-Cycle Dates]
    ├── /utilities/parties                     [Registered Parties Directory & Symbols]
    └── /about                                 [Methodology, Editorial Code & Zero-Login Privacy]
```

---

## 3. Contextual Drawer & Modal Architecture (Preserving Reading Flow)

To avoid disruptive route hops, MataLens executes secondary deep-dives through non-destructive UI layers:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ VIEWPORT ROOT (Current Page: e.g., /developments/senate-electoral-act-amendment)               │
│                                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ USER CLICKS "[Section 84(12) Electoral Act]" INLINE PILL                                 │  │
│  └─────────────────────────────────────────────────────────────┬─────────────────────────────┘  │
│                                                                │                                │
│                                                                ▼                                │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ CONTEXTUAL DRAWER: "LEGAL TRUTH ANCHOR" (Slides in from bottom on mobile; right on desktop)│  │
│  ├───────────────────────────────────────────────────────────────────────────────────────────┤  │
│  │ • Exact Statutory Text: Section 84(12), Electoral Act 2022                                │  │
│  │ • Plain-English Translation: "Political appointees must resign before party primaries."   │  │
│  │ • Judicial History: Supreme Court Judgment SC/CV/501/2022 striking down Buhari's suit.    │  │
│  │ • [Close / Continue Reading] (Returns focus directly to reading position)                  │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### The 4 Standard Contextual Overlays:

1. **The Legal & Manifesto Truth Anchor Drawer:**
   - **Trigger:** Clicking a manifesto quote badge or statutory citation pill.
   - **Content:** Exact verbatim clause text, publication date, verified PDF page number, and plain-English civic summary.
2. **The Perspective Breakdown Drawer:**
   - **Trigger:** Tapping any segment of the 4-Pillar Perspective Distribution bar.
   - **Content:** Complete list of reporting outlets grouped by perspective (`Incumbent`, `Opposition`, `Watchdog`, `Public Record`), along with publisher ownership disclosure and IFCN factuality rating.
3. **The Evidence & Result Sheet Modal:**
   - **Trigger:** Tapping an EC8A result sheet thumbnail or civic photo.
   - **Content:** High-resolution zoomable viewer, date/time stamp, LGA/Ward verification tag, and official INEC collation comparison.
4. **The Data Saver & Offline Settings Sheet:**
   - **Trigger:** Clicking the `[Data Saver]` pill in the header or footer.
   - **Content:** Toggle for image compression, offline cache status, and clearing on-device local storage data.

---

## 4. User Journeys & State Transitions

### Journey A: The First-Time Visitor (Frictionless Onboarding)
```
[ Open Web App: https://matalens.ng/ ]
                 │
                 ▼
[ "The Lens Today" loads instantly (<1.2s on 3G) ]
                 │
                 ▼
[ Top Banner: "Follow 1-3 Nigerian Leaders for Sourced Updates" ]
                 │
        ┌────────┴────────┐
        ▼                 ▼
[ Taps "Follow" on   [ Taps "Skip" ]
  Gov. Sanwo-Olu ]        │
        │                 ▼
        │        [ Homepage renders full ]
        │        [ national curated digest ]
        ▼
[ Local storage updated: matalens_followed_politicians:v1 ]
[ Morning Briefing tray appears with Sanwo-Olu's recent actions ]
```

### Journey B: Discovering a Development & Verifying Evidence
```
[ User scrolls "The Lens Today" ]
                 │
                 ▼
[ Sees Lead Development: "Local Government Autonomy Bill" ]
                 │
                 ▼
[ Reads 15-second Key Facts box ]
                 │
                 ▼
[ Taps "Examine Manifesto Context & Perspectives" ]
                 │
                 ▼
[ Navigates to /developments/local-government-financial-autonomy ]
                 │
        ┌────────┴────────────────────────┬──────────────────────┐
        ▼                                 ▼                      ▼
[ Reads 4-Pillar          [ Taps Timeline Node:   [ Taps "Civic Rehearsal" ]
  Perspective framing:      "2024 Supreme Court     Opens 60-second scenario:
  State vs Opp vs Watchdog]  Ruling" -> reads text] "Can Governor freeze funds?" ]
```

### Journey C: Following a Politician to Their Full Dossier
```
[ User taps "Politicians" tab (/politicians) ]
                 │
                 ▼
[ Instant client-side search: "Ireti" -> Sen. Ireti Kingibe ]
                 │
                 ▼
[ Opens /politicians/ireti-kingibe ]
                 │
        ┌────────┴────────────────────────┬──────────────────────┐
        ▼                                 ▼                      ▼
[ Taps "Follow"         [ Reviews 4-State        [ Reviews Legislative   ]
  (Saves locally to       Promise Ledger:         Voting Record & Sourced]
  localStorage) ]         2 Delivered / 3 In Prog] Manifesto Commitments ]
```

### Journey D: Submitting a Polling Unit Result Sheet (Civic Camera)
```
[ User taps "Camera" tab (/camera) ]
                 │
                 ▼
[ Reads Strict Intake Guidance: Form EC8A Result Sheets Only. No Marked Ballots. ]
                 │
                 ▼
[ Takes / Uploads photo of EC8A sheet posted on polling booth wall ]
                 │
                 ▼
[ Selects State, LGA, Ward, Polling Unit Code (Auto-validated) ]
                 │
                 ▼
[ App strips private EXIF GPS metadata client-side ]
                 │
                 ▼
[ Submits anonymously -> Receives Private Receipt: ML-9K2P-4X1B-87TR ]
                 │
                 ▼
[ Token saved to local localStorage (matalens_receipts:v1) ]
[ User can download receipt PDF or check verification status anytime ]
```

---

## 5. Breadcrumb & Backward Navigation Rules

To guarantee predictable, frustration-free navigation across desktop and mobile browsers:
1. **Physical Browser Back Button Integrity:** Every contextual drawer that opens updates browser history using `history.pushState(..., "#drawer")`. Tapping the native Android back button or browser back smoothly dismisses the drawer without navigating away from the underlying article.
2. **Minimal Semantic Breadcrumbs:** On desktop, interior pages render a compact, non-intrusive broadsheet breadcrumb:
   `Home / Developments / Fiscal Reform / Local Govt Autonomy`
3. **Persistent Tab Bar on Mobile:** The bottom 4-tab bar remains fixed at all times across primary routes (`/`, `/politicians`, `/learn`, `/camera`), with `padding-bottom: calc(env(safe-area-inset-bottom) + 56px)` to guarantee zero collision with native device navigation bars.
