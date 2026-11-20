# MataLens Judge Q&A Defense Bank (Grounded Edition)

> **Event:** AIESEC × HISA Civic Innovation Hackathon  
> **Audience:** Hackathon Jury & Technical Judges  
> **Purpose:** Realistic, defensible responses grounded strictly in the implemented codebase  
> **Date:** 20 November 2026  
> **Status:** Stage-Ready Q&A Playbook  

---

## Category 1: News Intelligence & Editorial Pipeline

### Q1.1: "How does your news intelligence pipeline actually work? Are you just using ChatGPT to generate summaries?"
- **The Core Trap:** Judges suspect an uncurated LLM wrapper that hallucinates news.
- **Defensible Response:**
  > *"We explicitly do **not** use unconstrained LLM web scraping or generative text for breaking political news. In an electoral context, automated hallucinations destroy public trust.
  Our news architecture (implemented in `server/news/pipeline.ts` by Codex Sol) is a **deterministic, evidence-bounded pipeline**:
  1. **Registered Source Watchlist:** The desk tracks specific public endpoints (official INEC releases, Channels TV, Voice of Nigeria) defined in `server/news/desk.ts`.
  2. **Event Recipes:** We define event grouping recipes with strict temporal windows and required evidence terms.
  3. **Evidence Fragments:** Explanations and context are assembled only from verified evidence fragments that actually exist in the source capture.
  4. **Strict Review CLI:** Drafts cannot be published automatically. An editor must run `npm run news -- approve <id> <full-revision>` against the exact content hash before a story enters the reviewed edition (`reviewed-edition.json`).
  The current build ships with 5 thoroughly reviewed and source-linked stories. Expanding this watchlist across broader national topics is part of our post-hackathon roadmap."*

---

### Q1.2: "Why do you only have five stories in your edition? How does this scale?"
- **The Core Trap:** Challenging the breadth and production viability of the platform.
- **Defensible Response:**
  > *"We deliberately chose five high-integrity, multi-source stories for this hackathon release to prove our primary learning loop end-to-end:
  - Covering candidate lists, election administration, mock accreditation, presidential rosters, and campaign promises.
  - Demonstrating direct source comparison (e.g. comparing conflicting application cutoff dates in Story 1), dated timeline progression (Story 3), and manifesto clause linking (Story 4).
  Our backend CLI (`npm run news -- collect/queue/approve/withdraw`) provides the exact operational workflow needed for editorial teams to ingest, stage, review, and approve stories safely. Our priority for this release was **zero hallucinations and 100% evidentiary rigor**, rather than volume without accountability."*

---

## Category 2: Civic Camera, Security & Moderation

### Q2.1: "How does Civic Camera verify result sheets? Does it automatically verify them against INEC's IReV portal?"
- **The Core Trap:** Trying to catch us overclaiming automatic government API integration.
- **Defensible Response:**
  > *"No, we do **not** claim an automatic integration with INEC’s IReV system. INEC does not provide an open real-time verification API for third-party apps.
  What Civic Camera actually implements is an **abuse-controlled, guest-first evidence preservation intake**:
  1. **Guest-First Privacy:** Users do not need an account. They can submit a photo of a publicly posted Form EC8A result sheet or community facility issue immediately.
  2. **On-Device EXIF Stripping:** The client-side code strips private GPS and device metadata to protect citizen privacy.
  3. **Cryptographic Private Receipt:** Upon submission, the server issues a high-entropy receipt token (e.g., `ML-8K2P-4X1B`). The server stores only the **SHA-256 hash** of this token in SQLite (`server/store.mjs`). The user can check status or withdraw their submission using their private token.
  4. **Moderation:** Submissions enter an internal moderation queue (`server/moderate.mjs`) where reviewers evaluate clarity, reject invalid uploads (e.g., photos of marked ballot papers), and verify records."*

---

### Q2.2: "What prevents someone from uploading illegal photos of marked ballot papers or spamming the server?"
- **The Core Trap:** Violating ballot secrecy laws under Section 122 of the Electoral Act 2022.
- **Defensible Response:**
  > *"Our intake enforces strict technical and policy boundaries:
  1. **Explicit Legal Scope:** Our intake explicitly forbids photos of marked ballot papers, citizens voting in secret, or permanent voter cards (PVC). We only accept publicly displayed Form EC8A result sheets and community infrastructure issues.
  2. **Strict File Restrictions:** Client-side and server-side checks restrict uploads to JPEG, PNG, and WebP, strictly under 8MB.
  3. **Rate Limiting & Duplicate Detection:** The server enforces upload rate limits and duplicate submission detection (`server/upload.mjs`).
  4. **Immediate Decline & Purge:** Flagged or non-compliant uploads are declined and deleted through the moderation desk."*

---

## Category 3: Guest-First Privacy & Architecture

### Q3.1: "How can you personalize the briefing and follow politicians without requiring a user account?"
- **The Core Trap:** Skepticism regarding zero-login personalization and state persistence.
- **Defensible Response:**
  > *"We use **local-first client architecture** via browser `localStorage`:
  - When a user taps 'Follow' on candidate cards (e.g., Bola Ahmed Tinubu or Adewole Adebayo), the candidate ID is stored locally in the browser (`useLocal('followed', [])`).
  - The homepage dynamically filters 'Updates for you' in real-time in JavaScript without making any authenticated backend query.
  - Saved stories, election day preparation plans, and completed learning quizzes are similarly stored strictly on-device.
  This means **zero personal political profiling data ever leaves the user’s phone**, fully complying with sensitive data principles under the Nigeria Data Protection Act 2023."*

---

### Q3.2: "What happens if a user is in an area with poor cellular connectivity or goes offline?"
- **The Core Trap:** Fragility on real Nigerian 2G/3G mobile networks.
- **Defensible Response:**
  > *"MataLens was architected from day one as a mobile-first PWA:
  1. **Offline Service Worker:** Our service worker (`sw.js`) caches the core app shell, election catalog, voter rights guides, and learning modules.
  2. **Bundled Offline Fallbacks:** If the live news API is unreachable, the frontend can seamlessly render from bundled local fixtures (`src/story-fixtures.ts`).
  3. **Lightweight Assets:** The entire client build uses modern SVG iconography and optimized web fonts, avoiding bloated megabyte-sized frameworks."*

---

## Category 4: Neutrality, Feasibility & Hackathon Scope

### Q4.1: "Are you partnered with INEC or civil society organizations like YIAGA or CDD?"
- **The Core Trap:** Overclaiming official endorsements or fake partnerships.
- **Defensible Response:**
  > *"No, we are an independent civic technology initiative developed for this hackathon. We have no official endorsement from or formal partnership with INEC or any civic organization.
  What we do is cite publicly available, authoritative public records—such as official INEC election calendars, certified candidate lists, published party manifestos, and research reports like Chatham House’s 2023 BVAS assessment.
  Our goal post-hackathon is to demonstrate this working prototype to civic observation coalitions as an open-source, nonpartisan learning companion."*

---

### Q4.2: "How is MataLens different from VotersDesk or Elect.ng?"
- **The Core Trap:** "Isn't this just another election website?"
- **Defensible Response:**
  > *"VotersDesk and Elect.ng are comprehensive reference directories. They focus on cataloging hundreds of candidates and historical election results, but they operate primarily as static directories or raw news feeds.
  MataLens is fundamentally different:
  1. **The Primary Learning Loop:** We connect broken news directly to **manifesto commitments** (with exact section citations) and **dated event timelines**.
  2. **Active Comprehension:** Every story includes an interactive `QuickCheck` quiz that tests statutory and procedural understanding in under 60 seconds.
  3. **Zero Mandatory Sign-In:** Everything—from candidate following to Civic Camera photo receipts—works immediately as a guest, protecting citizen privacy."*
