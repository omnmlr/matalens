# Implementation status

The implementation branch began with `main` at `8ebe734`. The Field Guide adds a working home directory, sourced records and a rights guide while retaining the existing guest-reporting contract. Browser tests run against local SQLite with synthetic fixtures. [Field Guide captures and verification](FIELD_GUIDE_REVIEW.md)

| Capability | Status | Evidence and limits |
| --- | --- | --- |
| Guest access | Working | Fresh Chromium contexts open or deep-link to every core page. No authentication screens or identity fields. |
| Official voting guides and dates | Working | Current schedule and procedural links sourced to INEC. The app presents both general-election dates and countdowns. INEC runs the official polling-unit and voter-status lookups. |
| Candidate exploration | Working for one covered race | Eight Surulere I entries from INEC’s Lagos PDF, with a place/name directory, individual profiles, party records, same-race comparison, source links and private bookmarks. One profile includes dated legislative proceedings. Other areas go to official sources. Further profiles and photos require sourcing and licensing. |
| Official results | Working for one historic contest | All 18 rows from INEC’s 2023 presidential declaration. Polling-unit sheets and private reports have separate destinations. |
| Rights and corrections | Partially working | Three source-linked rights guides. Correction notes can be copied locally. Delivery needs a verified monitored destination. Rights content awaits independent domain review before public release. |
| Private preparation | Working | Browser tests resume My Ballot and exercise a state, LGA, polling-unit note, checklist, candidate bookmark and reminder, a calendar export and an offline reopening. The flow makes no write requests. Reminders require the user to import the event for calendar alerts. |
| Practice | Working | Polling-day rehearsal with immediate feedback and a score, plus a candidate-to-party-abbreviation exercise covering the local race. Sources are linked. |
| Guest Civic Camera | Working | Mobile browser completes both report types through photo selection, preview, explicit review and a real image upload using synthetic fixtures. API tests confirm content and size safeguards, independent evidence storage and retry deduplication. |
| Receipt, follow-up and withdrawal | Working | Browser test retries after a simulated connection interruption, downloads the receipt, reloads My Actions, and opens the report in a fresh session using the receipt link. It loads the private preview then withdraws the report. API tests confirm restart persistence, moderation status, evidence removal and expiry. |
| Responsive theme and accessibility | Working | Inspected Chromium screenshots at desktop and mobile, including 320 px and both themes. Tested keyboard navigation, theme persistence, reflow and axe WCAG A/AA rules. Physical handset camera capture and a participant usability study remain unverified. |
| Offline and installation | Partially working | Service worker precaches the built app and self-hosted assets. Chromium reloads a saved plan offline. Camera submissions and receipt lookups require connectivity. Browser installation on physical handsets remains unverified. |
| Hosted photo intake and moderation | External dependency | The production entry point disables new uploads by default. A hosted pilot needs HTTPS, private encrypted persistent storage and a staffed moderation process. Local moderation CLI, abuse controls and retention exist. |
| Maps, public reports, AI assistance, authority routing, OCR | Not implemented | The current product has an official INEC handoff, a text-only location field and private manual intake. |
| Reference tools | External dependency | Managed tool discovery did not expose REA. The locally configured CLI subprocess exposed 229 tools and handled a successful audit invocation. [Reference design audit](REFERENCE_DESIGN_AUDIT.md) |

## Verification

- `npm test` runs three API integration tests.
- `npm run build` typechecks, creates production assets and builds the offline cache manifest.
- `npm run test:browser` runs four Chromium end-to-end tests and saves screenshots to `test-results/screenshots/`.
- `npm audit --omit=dev --audit-level=high` reports zero runtime dependency advisories. The full audit flags a Picomatch advisory in the Vite development toolchain. MataLens does not pass user-supplied glob patterns to that toolchain.
