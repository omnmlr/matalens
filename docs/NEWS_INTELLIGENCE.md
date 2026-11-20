# News intelligence

MataLens turns a small watchlist of Nigerian public sources into reading material with original links, context and a short sourced question. The bundled five-story edition is the default and works without publisher access. It includes official releases, reporting, the election catalogue and attributed campaign material. [Shared TypeScript contract](STORY_CONTRACT.md)

## Run the API

```sh
npm ci
npm run dev
curl http://127.0.0.1:3001/api/stories
curl http://127.0.0.1:3001/api/stories/presidential-roster-2027
curl 'http://127.0.0.1:3001/api/stories?personId=tinubu-bola-ahmed'
```

The API defaults to the repository’s [reviewed edition](../data/news/reviewed-edition.json). Set `MATALENS_NEWS_EDITION` to an operator-owned file outside web-served directories to publish later approved revisions independently. The server sees atomic edition updates without a restart. A missing or invalid configured edition yields a JSON 503. For a local demo, leave the override unset to load the bundled edition. Keeping an explicit override authoritative preserves its withdrawal decisions. Readable editions return JSON arrays and 404 for unpublished or withdrawn story IDs.

The optional person filter can support public catalogue lookups. Personalized feeds should fetch the public collection and filter in the browser. No API writes store following, reading or lesson activity.

## Collect and review

```sh
npm run news -- collect
npm run news -- queue
npm run news -- show mock-accreditation-2026
npm run news -- approve mock-accreditation-2026 <full-revision> --reviewer <label> --edition /private/path/edition.json
npm run news -- withdraw mock-accreditation-2026 <published-revision> --reviewer <label> --edition /private/path/edition.json
```

1. **Collect.** The default command uses the [recorded source evidence](../data/news/source-captures.json) and existing named election records. `collect --live` fetches registered publisher articles and reads the same versioned catalogue for election documents. Use `--drafts PATH` for a separate review queue. Live collection reports publisher failures and stages only candidates with confirmed evidence.
2. **Group.** Each event recipe specifies a date window and combinations of distinguishing terms. This groups overlapping publications about the same event. Its original release stays first. Additional documents can support specific claims, explain procedures or provide a named commitment. The presidential roster inherits its people and party links from the canonical 2027 contest, including running mates.
3. **Generate.** The desk assembles the explanation and context from short editorial paraphrases whose evidence terms exist in the source. The quiz generator checks that the correct answer appears in the supporting fact, orders the options reproducibly, and attaches source IDs for feedback. Missing required evidence holds the story back. A comparison or timeline item is omitted when its supporting evidence is absent. Missing manifesto evidence omits the commitment.
4. **Approve.** Inspect the draft and open the original source links. Check dates, factual scope, attribution, whether distractors are unambiguous, and whether promises and implementation records establish different things. Approve the exact full revision shown by the queue. Collection alone never changes the public edition. Withdrawal requires the exact published revision and hides it from both endpoints.

Use [the desk source and recipe registry](../server/news/desk.ts) to add sources and topics. Set the original publication date using the publisher’s record. Keep captures to short evidence fragments, and record the review date. Live ingestion is deliberately a bounded watchlist with date windows and a review queue. It does not automatically discover new articles or generate unrestricted summaries. Publisher redesigns can require a new headline or evidence registration. Direct requests used bounded HTTPS fetches and were blocked by the implementation workspace proxy. The actual source pages were reviewed through web retrieval. Automated tests exercise the HTML collector using controlled publisher responses.

| Stories | Original records |
| --- | --- |
| Recruitment deadline | [INEC notice](https://inecnigeria.org/press/inec-updates-closing-date-for-inecpress-ad-hoc-staff-recruitment) · [Republished INEC statement](https://pressreleasenaija.com.ng/extension-of-deadline-for-the-registration-of-ad-hoc-staff-on-the-inecpres-portal/) |
| State assembly lists | [INEC state lists](https://www.inecnigeria.org/press/updated-list-of-candidates-for-2027-state-houses-of-assembly-elections) · [INEC calendar](https://www.inecnigeria.org/elections/calendar) |
| Mock accreditation | [INEC notice](https://inecnigeria.org/press/inec-sets-28th-november-2026-for-nationwide-mock-accreditation-exercise) · [Channels Television coverage](https://www.channelstv.com/2026/11/12/inec-fixes-nov-28-for-nationwide-mock-accreditation-ahead-of-2027-general-elections/) · [INEC voter education](https://www.inecnigeria.org/voters/education) |
| Presidential candidate roster | [INEC notice](https://www.inecnigeria.org/press/updated-list-of-candidates-for-2027-presidential-election) · [Official roster PDF](https://inecnigeria.org/documents/uploads/2026/10/b5af9099-864c-4d5e-924d-e1a2c771c529-final-list-presidential.pdf) · [APC campaign manifesto](https://renewedhope02.com/manifesto) |
| Adebayo’s security priority | [Voice of Nigeria reporting](https://von.gov.ng/2027-election-sdp-candidate-prioritises-security/) · [Official roster PDF](https://inecnigeria.org/documents/uploads/2026/10/b5af9099-864c-4d5e-924d-e1a2c771c529-final-list-presidential.pdf) |


## Research incorporated

The research blueprint’s practical additions are direct source comparisons, dated story timelines and a precise manifesto locator. The API keeps the story contract and serves these fields as optional additions. Comparison describes the specific coverage and shared provenance, and a scheduled entry records what the source planned. The manifesto excerpt is attributed to its party and includes a section reference for checking the original document. [Research blueprint](https://github.com/omnmlr/matalens/blob/30d355143ea75b1bb8ab1d9abc38bb2e279d9213/docs/design-planning/BLUEPRINT.md)

The recruitment story illustrates a documented discrepancy. INEC’s own notice gives 2 December 2026. The statement republished by Press Release Naija gives 3 December. The quiz asks specifically about INEC’s notice. The presidential story locates the housing proposal in Pillar 2 of the APC’s 2027–2031 commitments, including the proposed counts of homes handed over and mortgaged. Delivery requires its own public records. [INEC notice](https://inecnigeria.org/press/inec-updates-closing-date-for-inecpress-ad-hoc-staff-recruitment) · [Republished statement](https://pressreleasenaija.com.ng/extension-of-deadline-for-the-registration-of-ad-hoc-staff-on-the-inecpres-portal/) · [Manifesto PDF](https://apc.com.ng/apc-2027-manifesto.pdf)

## Verify the handoff locally

`npm test` runs the news pipeline, public API, and Civic Camera API checks. `npm run test:browser` runs the release client’s election and reporting workflows.

For the separate political-learning frontend, build a checkout of its branch with `VITE_STORY_PROVIDER=api npm run build`. Then run the following from the backend checkout. The integration test serves that build and the real backend at one local origin. Captures are written to the frontend checkout’s `test-results/integration/` directory.

```sh
MATALENS_FRONTEND_DIR=/absolute/path/to/frontend node --test tests/news-browser.integration.mjs
```

## Demo walkthrough

In an integrated checkout, run `VITE_STORY_PROVIDER=api npm run build`, then `npm start`. Open `http://127.0.0.1:3000` with the edition override unset. The briefing comes from the local story API and the bundled five-story edition. The Home and story walkthrough needs no publisher connection. Opening a publisher’s original link uses the network.

1. Open the recruitment story to compare the two reported cutoff dates.
2. Open the mock-accreditation story to review the announcement, publication and scheduled exercise in order.
3. Open the presidential roster via the briefing or a followed candidate. The election list and the campaign’s housing proposal cite separate records.
4. Complete a quiz, save the story and return to the briefing. Reload to demonstrate on-device following and progress.
