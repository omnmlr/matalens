# Implementation status

First engineering pass based on `main` at `8ebe734`. The built app and browser tests ran against local SQLite. Browser fixtures were synthetic and no external civic service received submissions.

| Capability | Status | Evidence and limits |
| --- | --- | --- |
| Guest access | Working | Fresh Chromium contexts open or deep-link to every core page. No authentication screens or identity fields. |
| Official voting guides and dates | Working | Current schedule and procedural links sourced to INEC. The app presents both general-election dates and countdowns. INEC runs the official polling-unit and voter-status lookups. |
| Candidate exploration | Partially working | All eight Surulere I House of Representatives entries from INEC’s Lagos PDF, with party, listed age, qualifications, links, search and private bookmarks. Other races go to INEC. Candidate photos, records and policy profiles require further sourcing and licensing. |
| Private preparation | Working | Browser test saves a state, LGA, polling-unit note, checklist, candidate bookmark and reminder, exports a calendar event and reopens preparation offline. The flow makes no write requests. Reminders require the user to import the event for calendar alerts. |
| Practice | Working | Polling-day rehearsal with immediate feedback and a score, plus a candidate-to-party-abbreviation exercise covering the local race. Sources are linked. |
| Guest Civic Camera | Working | Mobile browser completes both report types with a real image upload using synthetic fixtures. API tests confirm content and size safeguards, independent evidence storage and retry deduplication. |
| Receipt, follow-up and withdrawal | Working | Browser test retries after a simulated connection interruption, downloads the receipt, reloads My Actions, and opens the report in a fresh session using the receipt link. It loads the private preview then withdraws the report. API tests confirm restart persistence, moderation status, evidence removal and expiry. |
| Responsive theme and accessibility | Working | Inspected Chromium screenshots at desktop and mobile, including 320 px and forest dark mode. Tested keyboard skip navigation, theme persistence, no horizontal overflow and axe WCAG A/AA rules on the home and camera screens. Physical handset camera capture and a participant usability study remain unverified. |
| Offline and installation | Partially working | Service worker precaches the built app and self-hosted assets. Chromium reloads a saved plan offline. Camera submissions and receipt lookups require connectivity. Browser installation on physical handsets remains unverified. |
| Hosted photo intake and moderation | External dependency | The production entry point disables new uploads by default. A hosted pilot needs HTTPS, private encrypted persistent storage and a staffed moderation process. Local moderation CLI, abuse controls and retention exist. |
| Maps, public reports, AI assistance, authority routing, OCR | Not implemented | The current product has an official INEC handoff, a text-only location field and private manual intake. |
| Reference tools | External dependency | No callable REA in Codex. Public web documents and open-source reference files were reviewed. See [research notes](REFERENCE_RESEARCH.md). |

## Verification

- `npm test` runs three API integration tests.
- `npm run build` typechecks, creates production assets and builds the offline cache manifest.
- `npm run test:browser` runs three Chromium end-to-end tests and saves screenshots to `test-results/screenshots/`.
- `npm audit --omit=dev --audit-level=high` reports zero runtime dependency advisories. The full audit flags a Picomatch advisory in the Vite development toolchain. MataLens does not pass user-supplied glob patterns to that toolchain.
