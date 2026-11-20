# MataLens

**See what matters. Know what to do next.**

**MataLens is a civic information and participation platform built to make Nigerian public life easier to understand and act on.** It brings political updates, election records, voter education, personal preparation and community reporting into one mobile-friendly experience — without requiring an account.

**[Explore MataLens](https://matalens.vercel.app)** · **[View the application code](https://github.com/omnmlr/matalens/tree/release/matalens-hackathon)**

Built for the **AIESEC Innovation Hackathon**.

## The problem

Following Nigerian politics can mean jumping between news articles, election notices, candidate lists and social media posts, then trying to work out what is reliable and what it means for you. Even practical questions — who is contesting a particular election, how voting works, or how to document a civic problem — can require several disconnected services.

MataLens is designed to connect those pieces. Instead of simply displaying information, it helps people **discover, understand, prepare and participate**, with clear context and an obvious next step.

## What we built

### 1. A political briefing that explains the news

The homepage presents a curated briefing about developments in Nigerian public life. Each reviewed story provides context, explains why an event matters and links to the material behind it. Stories can also include timelines, comparisons and quick knowledge checks where supported.

Users can **follow politicians** and see related updates in their personal space. Following is for organizing information, not endorsing a candidate; these preferences remain in the browser.

This is a small, reviewed collection of stories, **not a claim of continuous, real-time news coverage**.

### 2. Election discovery and candidate exploration

The **Discover** and election sections let users navigate available races by election year, office and location. They can:

- Explore covered presidential and state-level contests.
- Read candidate and party records with clear election context.
- Compare candidates competing in the same race.
- Explore running mates and related political identities.
- Consult the archived **2023 presidential declaration** separately from information about upcoming elections.

Election coverage is intentionally bounded by the records included in the project; it is not a complete national database of every contest or polling unit.

### 3. Civic learning that people can actually use

**Learn** turns complex civic topics into short, approachable lessons and interactive questions. The platform includes:

- Voting-process rehearsal and election-day preparation.
- Guides to ballot secrecy, voter assistance, intimidation, vote buying and polling-unit procedures.
- Party and candidate recognition practice.
- A daily question and explanations that help users understand their answers.

The goal is practical civic literacy, not merely memorizing political names.

### 4. A personal civic desk

**My Desk** helps people keep track of what matters to them. Users can save stories, follow political figures, revisit relevant updates and continue their election preparation.

The app also supports private browser-saved bookmarks, a preparation checklist, notes and a downloadable calendar event for reminders. These personal choices are stored on the user's device rather than requiring a political-preference account.

### 5. Civic Camera: evidence with accountability

**Civic Camera** supports two kinds of submissions:

- **Public result sheets:** Photograph a publicly posted election result sheet and provide its polling-unit context.
- **Community issues:** Document problems such as damaged roads, flooding, waste or neglected public facilities with a photo and description.

In the standalone application with private storage enabled, a submission goes through photo review and explicit consent, then receives a **private receipt**. That receipt lets the person check its status, reopen a protected preview or withdraw the report. Reports have a limited retention period.

**Hosted-demo limitation:** The public Vercel build displays the Civic Camera experience but does **not** currently accept photos or retrieve private receipts, because that deployment has no persistent private evidence store. The standalone server implements these workflows, and the repository includes tests for them.

MataLens does not automatically count votes from photographs, certify election outcomes or send submissions to INEC or other government agencies.

## A five-minute tour for judges

1. **[Open the homepage](https://matalens.vercel.app)** to see the briefing and explore a political story, its context and supporting material.
2. **[Visit Discover](https://matalens.vercel.app/discover)** to browse election records, open a candidate profile or compare candidates in a covered race.
3. **[Try Learn](https://matalens.vercel.app/learn)** to answer a civic question and see the explanation.
4. **[Open My Desk](https://matalens.vercel.app/desk)** to see how followed people, saved items and personal preparation come together.
5. **[Explore Civic Camera](https://matalens.vercel.app/camera)** to understand the two reporting flows and their privacy boundaries. The hosted demo does not enable photo intake.

**No sign-up is required** for the browsing, learning or personal-preparation experience.

## Why it matters

MataLens is built around a simple idea: **better participation starts with clearer information and practical tools**.

Its value is in bringing together activities that usually feel disconnected — understanding a political development, checking who is contesting an election, learning one's rights, preparing to vote and documenting a public issue — in a coherent, accessible product.

The platform is designed to be **nonpartisan, privacy-conscious and explicit about evidence**. Public election records, personal preparation, editorial briefings and user-submitted photos are treated as different kinds of information. Unreviewed community evidence is never presented as an official election result.

MataLens is an independent project, **not an INEC or government service**, and it does not provide official voter registration, accreditation or certified results.

## How it works

The application uses **React, TypeScript and Vite** for its responsive interface, with a **Node.js/Express** server for its API. A reviewed political-briefing edition is served through the app's story endpoints. The standalone Civic Camera backend uses **SQLite and private file storage** for temporary evidence and receipt tracking.

The app is guest-first, offers light and dark themes and can reopen selected previously loaded material offline after its service worker is installed. Fresh updates, external official links and reporting services still require a connection.

### Run the implementation locally

Requires **Node.js 24 or later** and npm.

```bash
git clone --branch release/matalens-hackathon https://github.com/omnmlr/matalens.git
cd matalens
npm ci
npm run dev
```

Open **http://localhost:5173**. In local development, the standalone server can accept test photo submissions when its private storage and image-processing requirements are available. Use non-sensitive test photos, not personal documents or real ballots.

To run project checks:

```bash
npm test
npm run typecheck
npm run build
npm run test:browser
```

The browser-test command requires Chromium or a Playwright browser installation.

---

**MataLens — See what matters. Know what to do next.**
