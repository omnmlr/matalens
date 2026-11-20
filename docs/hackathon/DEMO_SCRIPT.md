# MataLens Hackathon Live Demo Script (Verified Build Edition)

> **Event:** AIESEC × HISA Civic Innovation Hackathon  
> **Pitch Duration:** Exactly 3 Minutes (180 Seconds)  
> **Audience:** Hackathon Jury, Civic Technologists & General Public  
> **Target Branch:** `codex/matalens-political-learning` (Frontend) + `codex/matalens-news-intelligence` (Backend API)  
> **Edition:** Bundled 5-Story Reviewed Edition (`data/news/reviewed-edition.json`)  
> **Date:** 20 November 2026  
> **Status:** Stage-Ready Production Walkthrough (100% Verifiable on Current Build)  

---

## 1. Pitch Architecture & Timing

$$\text{Opening Hook } (25\text{s}) \longrightarrow \text{The Problem \& Pivot } (25\text{s}) \longrightarrow \text{Live Product Walkthrough } (100\text{s}) \longrightarrow \text{Architecture \& Closing } (30\text{s})$$

### The 10-Second Elevator Pitch:
> *"MataLens is Nigeria’s personal, nonpartisan political-learning companion. We turn overwhelming election cycles into daily, sourced clarity—connecting breaking developments directly to primary candidate records, signed manifesto clauses, and interactive comprehension exercises, with zero mandatory sign-in."*

---

## 2. Minute-by-Minute Stage Script & Actions

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [0:00 - 0:25] THE HOOK: THE POST-ELECTION BLACKOUT                                              │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PRESENTER SPEAKS:                                                                               │
│ "In 2023, less than 27% of registered Nigerian voters turned out to vote.                       │
│ Why? Because our democratic process feels like a 4-year blackout interrupted by two weeks of    │
│ chaotic noise.                                                                                  │
│ You are handed 80-page manifestos nobody reads, bombarded with unverified claims on social      │
│ media, and once election day passes, there is no simple way to track what your leaders actually │
│ do or compare their promises to official public records."                                       │
│                                                                                                 │
│ ACTION: Presenter faces jury; slides transition from a chaotic news collage to MataLens.        │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [0:25 - 0:50] THE PROBLEM & OUR STRATEGIC PIVOT                                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PRESENTER SPEAKS:                                                                               │
│ "Most civic tech platforms make this worse. They build massive bureaucratic dashboards listing  │
│ 400 candidates across 36 states, and they force you to enter a phone number or upload your PVC   │
│ before you can read a single line.                                                              │
│                                                                                                 │
│ We built MataLens around a different philosophy:                                                │
│ 100% Guest-First. Zero mandatory sign-in. Zero tracking of your political choices.             │
│ Let me show you how it works live."                                                             │
│                                                                                                 │
│ ACTION: Presenter switches to live browser at http://localhost:3000 ("The Nigeria briefing").  │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [0:50 - 1:25] DEMO STEP 1: HOMEPAGE ("THE BRIEFING") & GUEST-FIRST FOLLOWING                    │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PRESENTER SPEAKS:                                                                               │
│ "This is the MataLens homepage: 'The Nigeria briefing — Politics in focus'.                     │
│ Right here at the top, I can follow the political figures I care about—for example,             │
│ Bola Ahmed Tinubu, Peter Obi, or Adewole Adebayo.                                               │
│                                                                                                 │
│ Notice: I did not create an account. I did not enter an email or phone number.                  │
│ My following list is stored 100% on-device in browser local storage.                            │
│ The homepage immediately filters 'Updates for you' showing verified developments specifically   │
│ concerning the leaders I track."                                                                │
│                                                                                                 │
│ LIVE ACTION:                                                                                    │
│ 1. Scroll past the 2027 Presidential guide card to 'Your following'.                           │
│ 2. Click 'Follow' on candidate cards (e.g. Bola Ahmed Tinubu / Adewole Adebayo).                │
│ 3. Point out the instant 'Updates for you' reactive stream below.                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [1:25 - 2:05] DEMO STEP 2: DISCOVERING A SOURCED STORY & MANIFESTO COMMITMENTS                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PRESENTER SPEAKS:                                                                               │
│ "Let’s open a verified story from today’s reviewed edition:                                     │
│ 'Nigeria’s 2027 presidential roster begins to take shape'.                                      │
│                                                                                                 │
│ Notice how MataLens structures this:                                                            │
│ First, a clear neutral explanation: INEC has officially published 18 presidential tickets.      │
│ Second, we can open 'Original sources' to inspect the actual INEC final list PDF.               │
│ Third, look at 'Compare with commitments':                                                      │
│ We link candidate Bola Ahmed Tinubu directly to his campaign manifesto:                         │
│ 'Pillar 2 · Housing, Urban Development and Mortgages'.                                          │
│ We cite the exact pledge—500,000 affordable housing units—alongside a direct link to the        │
│ manifesto document, while explicitly stating that assessing delivery requires verified federal  │
│ budget records.                                                                                 │
│                                                                                                 │
│ [Roadmap Note: In our next release, this source comparison expands into our multi-category     │
│ 4-Pillar Perspective Distribution bar across 22 accredited Nigerian newsrooms]."               │
│                                                                                                 │
│ LIVE ACTION:                                                                                    │
│ 1. Click into story 'presidential-roster-2027'.                                                 │
│ 2. Expand 'Original sources' showing the certified INEC PDF link.                               │
│ 3. Expand 'Compare with commitments' showing the APC Manifesto Pillar 2 citation.               │
│ 4. Click the 'Save story' button in the masthead (stored locally).                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [2:05 - 2:35] DEMO STEP 3: 60-SECOND ACTIVE CIVIC REHEARSAL (QUICKCHECK QUIZ)                   │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PRESENTER SPEAKS:                                                                               │
│ "Reading news is passive; learning requires active engagement.                                  │
│ At the bottom of every story, MataLens provides a short, sourced comprehension check.           │
│ The question asks: 'How many party tickets are named on INEC’s published 2027 list?'            │
│ Options: 20, 18, 19.                                                                            │
│ I select 18.                                                                                    │
│ Instantly, the interface confirms: Correct!                                                     │
│ It explains that while there are 19 party rows, the Accord entry is marked 'COURT ORDER' with   │
│ neither nominee named, leaving 18 confirmed tickets.                                            │
│ In under 60 seconds, a voter has learned how candidate litigation impacts actual ballot papers."│
│                                                                                                 │
│ LIVE ACTION:                                                                                    │
│ 1. Scroll to 'Check your understanding' section.                                                │
│ 2. Click option '18'.                                                                           │
│ 3. Green success state and sourced explanation appear immediately.                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [2:35 - 2:55] DEMO STEP 4: MY DESK & CIVIC CAMERA WITH PRIVATE RECEIPT                          │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PRESENTER SPEAKS:                                                                               │
│ "Now let's open 'My Desk'.                                                                      │
│ My followed politicians are here. My saved stories are here. My completed exercises are checked │
│ off—all private to this browser.                                                                │
│                                                                                                 │
│ And for election day, we have Civic Camera:                                                     │
│ Citizens can submit photos of publicly displayed Form EC8A result sheets or community issues.   │
│ Client-side code strips private EXIF GPS metadata.                                              │
│ The server returns an unguessable private receipt token—ML-8K2P-4X1B.                           │
│ Only the SHA-256 hash lives on the server. The citizen can check status or withdraw anytime,    │
│ completely anonymously."                                                                        │
│                                                                                                 │
│ LIVE ACTION:                                                                                    │
│ 1. Click 'My Desk' in navigation. Show saved story and completed learning checkmark.            │
│ 2. Click 'Start a report' under Civic Camera, show the clean intake screen and receipt code.    │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [2:55 - 3:00] CLOSING STATEMENT                                                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PRESENTER SPEAKS:                                                                               │
│ "Nigeria does not lack laws, manifestos, or news stories. What Nigerians lack is a clear lens to│
│ understand them.                                                                                │
│ MataLens is that lens: Guest-first. Sourced. Nonpartisan.                                       │
│ Thank you."                                                                                     │
│                                                                                                 │
│ ACTION: Presenter concludes; display project URL and team credits.                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Presenter Pre-Flight Checklist

1. **Verify Backend Edition:** Confirm backend starts with `data/news/reviewed-edition.json` (5 reviewed stories).
2. **Verify Browser State:** Open a clean browser window at `http://localhost:3000`. Test clicking **Follow** on a leader and completing a story quiz.
3. **Pacing:** Stick strictly to the time markers. The primary wow factor is the seamless flow from **Followed Leader $\rightarrow$ Sourced Story $\rightarrow$ Manifesto Evidence $\rightarrow$ Interactive Rehearsal $\rightarrow$ Private Receipt**.
