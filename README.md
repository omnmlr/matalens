# MataLens

**See what matters. Know what to do next.**

MataLens is an independent, mobile-first civic companion for Nigeria and a side project for the AIESEC hackathon. Guests can explore sourced election records, look up official guidance, practise election procedures, save a private plan, and document a community issue or public result sheet with a photo.

## Run locally

Use Node.js 24 or later and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite serves the app and proxies the API to port 3001. Guest photo intake is enabled in development, where reports persist in a private `.matalens/` SQLite directory. Use synthetic or non-sensitive photos for local testing. `MATALENS_ENABLE_UPLOADS=0` disables intake while leaving saved receipts retrievable.

```sh
npm test
npm run data:check
npm run typecheck
npm run build
npm run test:browser
```

Browser tests use the system Chromium if available. Otherwise run `npx playwright install chromium` first. The suite serves the built app against an ephemeral test database and writes screenshots to `test-results/screenshots/`. Use `npm run build && npm start` to exercise the installable, offline-capable build on port 3000.

## What works

- **Elections** covers both presidential rosters and selected contests in Edo, Lagos and Oyo. Guests can filter by year, office and geography, read or compare sourced profiles, and look up the full 2023 national presidential declaration. My Ballot, bookmarks, checklists, notes and reminders stay in the browser. Open a downloaded calendar event in your calendar app to set an alert.
- **Rights and practice** cover ballot secrecy, voting assistance, polling units, intimidation and vote buying. Learn through voting rehearsal, symbol clues and candidate-to-party practice. The built app can reopen guides and plans offline after the service worker has installed. INEC links, new submissions and receipt retrieval use the network.
- **Civic Camera and My Actions** accept an original image with consent and factual context, preserve it privately, and issue a 256-bit bearer receipt. Download or copy the receipt to reopen the report in another browser. Guests can check status, view a metadata-stripped preview and withdraw the evidence. Reports are received by MataLens for review.

## Political news API

The same app serves a reviewed political briefing at `/api/stories`, with source links, catalogue identities and learning questions. The [news desk guide](docs/NEWS_INTELLIGENCE.md) covers collection, review, API use and integration with the political-learning frontend.

## Run a hosted pilot

See the [production runbook](docs/RELEASE_RUNBOOK.md) for API routing, build and runtime configuration, and the bundled reviewed edition. Use the [integration checklist](docs/INTEGRATION_CHECKLIST.md) for release verification.

`npm start` serves the built client and API from the same origin. New intake requires `MATALENS_ENABLE_UPLOADS=1`, a private `MATALENS_DATA_DIR` and an HTTPS `MATALENS_ORIGIN`. See [.env.example](.env.example).

| Variable | Purpose |
| --- | --- |
| `MATALENS_ENABLE_UPLOADS=1` | Enable guest intake deliberately |
| `MATALENS_DATA_DIR` | Dedicated persistent directory with mode `0700`, outside `public/` and `dist/` |
| `MATALENS_ORIGIN` | Exact HTTPS public origin, without a path or trailing slash |
| `MATALENS_HOST`, `MATALENS_PORT` | Listener settings, defaulting to `127.0.0.1:3000` |
| `MATALENS_TRUST_LOOPBACK_PROXY=1` | Use only with a trusted loopback reverse proxy that overwrites client IP headers |

Use a single Node process with TLS termination, an encrypted private volume, and restricted operator access. Run behind a proxy with request-body limits, no request-body or Authorization logging and the same 30-day retention rules for any backup or private review copy. Keep the listener reachable only through the trusted proxy. Validate the deployment setup and assign an operator before accepting public evidence.

SQLite initializes its two tables at startup. It stores evidence and receipt records in a transaction with the original image digest and a one-way receipt-code hash. A retry with the same code returns the original case. Images are bounded by type, byte size and pixel count, with allowed decoders, strict decoding, network rate limits, a hidden spam field and concurrent upload limits. Stored evidence is capped at 512 MiB. Rate limits are in-memory and local to the process.

Use these commands from a trusted terminal. Review photos as private evidence and decline those that contain identifiable people, private documents, marked ballots, unsafe content or spam. The photo command creates a private temporary review copy that the operator must remove after review.

```sh
npm run moderate -- queue
npm run moderate -- photo <case-id> <private-preview.webp>
npm run moderate -- reviewed <case-id>
npm run moderate -- declined <case-id>
```

“Reviewed by MataLens” records a moderation decision. No government or partner receives case data through this app. Withdrawal and decline remove the photo, description and location from active storage. A minimal status record and all remaining cases expire 30 days from submission. Lost receipt links or codes cannot be recovered.

## Project notes

- [Agent instructions](AGENTS.md), [vision](VISION.md), [product](PRODUCT.md), [design](DESIGN.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md), [capability and test evidence](docs/IMPLEMENTATION_STATUS.md), [election data and sources](docs/ELECTION_DATA.md), [visual review](docs/VISUAL_REVIEW.md), [reference research](docs/REFERENCE_RESEARCH.md)
