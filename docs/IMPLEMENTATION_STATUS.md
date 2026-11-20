# Implementation status

The product overhaul builds on `035c5c8` on `codex/matalens-first-release`. The application remains guest-first. [Election data and source ledger](ELECTION_DATA.md) · [Browser captures and review](VISUAL_REVIEW.md)

| Capability | Status | Evidence and boundary |
| --- | --- | --- |
| Presidential discovery | Working | First action on Home opens the official 2027 roster. INEC names 18 tickets. The Accord court-order entry has no names. The 2023 nomination list and results have separate source references. |
| Election catalogue | Working for published coverage | 248 candidacies in 22 contests, 21 parties and 70 attached running mates. Year, date, office, state, district and constituency filters reflect the indexed source records. Local coverage is selected contests in Edo, Lagos and Oyo. An unsupported region gets an official handoff. |
| Candidate profiles and comparison | Partially working | Every indexed candidate has a shareable sourced profile and an expandable directory row. Profiles can show a ticket, listed qualifications, declared votes and linked election history. The same-race comparison stays in the browser. Selected profiles have supplementary public records. Wider biography, policy, legislative and photo coverage needs source review and media clearance. |
| Political parties and recognition | Partially working | Twenty-one searchable party records link to their contests. Recognition includes illustrated symbol clues and candidate-to-party drills from the official 2027 presidential list. Official logo artwork and photo-identification exercises remain dependent on licensed, retrievable media. |
| Results | Working for one declaration | All 18 national candidate totals from INEC’s 2023 declaration, with the declared winner, 24,025,940 valid votes and 939,278 rejected votes. IReV and private Civic Camera evidence have separate roles. State breakdowns and additional historic contests are outside the present archive. |
| Rights education | Working | Five searchable guides and a homepage carousel with pause, keyboard navigation, reduced-motion support and expandable scenarios. Sources include the Electoral Act 2026 and official INEC links. Legal text should receive an independent domain review before public launch. |
| Private preparation | Working | State-based My Ballot resume, candidate bookmarks, checklist, free-text LGA and polling-unit notes, voting rehearsal and calendar export. Exact ballot-to-polling-unit mapping is an external dependency. Guests confirm their electoral areas with INEC. |
| Offline and installation | Partially working | The service worker pre-caches the production assets. Tested offline reopening of the saved voting plan after installation. Official site handoffs, new uploads and receipt retrieval require a connection. Physical-device installation remains unverified. |
| Civic Camera and My Actions | Working in the local test deployment | Both report types reach the private storage API. Browser tests cover upload validation, preview, review, interruption and retry, recoverable receipt, metadata-stripped view and withdrawal. Handler, moderation and retention use the existing server implementation. |
| Corrections and integrations | External dependency | The correction page generates a copyable factual note. A monitored correction channel, government submission and hosted intake operations require verified destinations and operating arrangements. |
| Photos, data expansion and maps | External dependency | Media and VotersDesk CSV access are documented in the data ledger. Geographic boundaries, nationwide nominations, additional results and the ability to match a polling unit to the exact ballot require further verified source data. |
| Responsive interaction and access | Working in Chromium testing | Verified narrow layout, both themes, keyboard controls, search and browser Back. See screenshot and test evidence. Human usability and physical Android/iOS coverage remain unverified. |

## Verification commands

- `npm run build` checks catalogue drift, typechecks, creates the compiled app and builds the offline cache manifest.
- `npm test` exercises the report API and real storage with temporary fixtures.
- `npm run test:browser` walks local elections, education, preparation and report journeys against the built app using Chromium.
