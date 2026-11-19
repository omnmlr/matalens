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
npm run typecheck
npm run build
npm run test:browser
```

Browser tests use the system Chromium if available. Otherwise run `npx playwright install chromium` first. The suite serves the built app against an ephemeral test database and writes screenshots to `test-results/screenshots/`. Use `npm run build && npm start` to exercise the installable, offline-capable build on port 3000.

## What works

- **Elections** has place and name search, the published INEC calendar, and individual profiles for the eight candidates on INEC’s Surulere I House of Representatives list. Guests can compare candidates from this race, read the 2023 presidential declaration and follow official sources for other races. My Ballot, bookmarks, checklists, notes and reminders stay in the browser. Open a downloaded calendar event in your calendar app to set an alert.
- **Rights and practice** explain ballot secrecy, voting assistance and assigned polling units with official links. Practice covers polling-day procedures and candidate-to-party abbreviations. The built app can reopen guides and plans offline after the service worker has installed. INEC links, new submissions and receipt retrieval use the network.
- **Civic Camera and My Actions** accept an original image with consent and factual context, preserve it privately, and issue a 256-bit bearer receipt. Download or copy the receipt to reopen the report in another browser. Guests can check status, view a metadata-stripped preview and withdraw the evidence. Reports are received by MataLens for review.

## Run a hosted pilot

`npm start` serves the built client and API from the same origin. New intake stays disabled until all of these variables are supplied. See [.env.example](.env.example).

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
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md), [capability and test evidence](docs/IMPLEMENTATION_STATUS.md), [reference research and sourcing](docs/REFERENCE_RESEARCH.md)
