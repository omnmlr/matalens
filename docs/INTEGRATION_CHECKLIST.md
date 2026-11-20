# MataLens integration checklist

The backend review branch is [codex/matalens-news-intelligence](https://github.com/omnmlr/matalens/tree/codex/matalens-news-intelligence). Chisom’s frontend starts from [f80c393](https://github.com/omnmlr/matalens/commit/f80c393a74351ad61eb977deeb935a8ec6f8d7dd). Use his pushed branch for the final integration and record both input commit SHAs with the demo results.

The [release handoff](RELEASE_HANDOFF.md) records the pinned frontend and backend commits, the integrated test results and the production deployment.

## Merge review

- [ ] Fetch the two remote heads. Check the frontend history against `f80c393`, inspect each branch’s changes from its merge base, and dry-run the merge with `git merge-tree --write-tree <backend-ref> <frontend-ref>`.
- [ ] Create a dedicated branch from the tested backend in a separate worktree when the frontend head is available. Merge the pinned frontend commit into that worktree.
- [ ] Keep the frontend’s UI changes and the authoritative API contract. The rehearsal against `f80c393` found add/add conflicts in `src/story-contract.ts` and `docs/STORY_CONTRACT.md`, which were introduced independently on the two branches. Retain the backend contract, including the optional source comparisons, timeline and manifesto reference. Review any additional conflict using the actual frontend diff.
- [ ] Check shared dependencies, npm scripts, the lockfile, API routes and fallback data. Preserve backend dependencies and both TypeScript checks. Verify client calls remain relative to `/api/stories`, date precision is preserved, and optional fields can be absent. Keep the existing Camera request paths, receipt format, service-worker API exclusion and server protections intact.
- [ ] Review the existing browser tests against the final navigation and labels. Update selectors that changed while keeping the Civic Camera and electoral preparation assertions. Verify the built client through the real API before pushing the integration branch for review.

## Automated tests

Run these against the integrated checkout using Node 24 or later and Chromium:

```sh
npm ci --include=dev
npm run data:check
npm run typecheck
npm test
VITE_STORY_PROVIDER=api npm run test:browser
MATALENS_FRONTEND_DIR="$PWD" node --test tests/news-browser.integration.mjs
git diff --check
```

The Playwright suite builds the app with the provided environment and an isolated testing server. The separate integration test consumes that API-mode build from `dist/`. Update its selectors to match the final UI if necessary. It should still verify collection and detail requests, the followed-person journey, saving and completing a story or lesson, and client-only personalisation.

## Browser acceptance

- [ ] **Briefing and API.** In a fresh guest context verify the actual API returns the five reviewed stories in reverse publication order. Open a story from the briefing and reload its deep link. Verify the original headline, publisher and source link. Check detail, a known person filter, and a missing story ID.
- [ ] **Evidence.** Open the recruitment story and check that each cutoff is attributed to its source. In the mock accreditation story check the chronology and the scheduled label. Check the presidential story’s manifesto link, section locator and month precision. Confirm the UI behaves correctly for an earlier payload without these optional fields.
- [ ] **Private learning.** Follow a politician in discovery or the candidate profile, see the relevant story in the personalised feed, save it, answer the quiz, and reopen the feed or desk after reload. Confirm no follow data, saved IDs, lesson answers or private preparation travel to the server. Confirm guest access, existing election records, bookmark persistence and practice work.
- [ ] **Disabled and offline states.** Test a failed stories request and offline reload after the service worker activates. Restore the connection and confirm retry works. Preserved local preparation should remain accessible. Test the app with new Camera intake disabled and confirm it shows the unavailable state.
- [ ] **Civic Camera.** With test intake enabled and synthetic photos, submit a community issue and a public result sheet. Check the report-type fields, consent, validation, preview and review screen. Simulate an interrupted upload and retry with the same receipt. Reopen the private receipt after reload and from a new browser context, view the metadata-stripped preview, withdraw, and confirm the evidence is gone. Keep the exact-origin checks, bearer protection, supported formats, upload limits, rate limits, moderation and 30-day expiry. Verify the no-store headers and that service-worker caching skips the API.
- [ ] **Responsive and accessibility.** Check 390 px mobile and 1440 px desktop in light and dark themes. Check 320 px for horizontal overflow and keyboard access for navigation, story disclosure and quiz controls. Run the existing accessibility and reduced-motion checks in the suite.
- [ ] **Demo evidence.** Capture the briefing and a story showing source context at both widths and themes. Include a quiz result and, if it helps the demo, a synthetic Camera screen with no visible receipt token or private data. Record the tested commit, viewport, theme and passing commands. Capture mobile and desktop after reviewing the actual combined build.

## Standalone production-mode smoke check

Follow the [production runbook](RELEASE_RUNBOOK.md) to run the exact candidate locally. Use a clean shell with `MATALENS_NEWS_EDITION` unset and `MATALENS_ENABLE_UPLOADS=0`:

```sh
VITE_STORY_PROVIDER=api npm run build
MATALENS_ENABLE_UPLOADS=0 NODE_ENV=production npm start
```

From a second terminal:

```sh
curl -fsS -i http://127.0.0.1:3000/api/stories
curl -fsS -i http://127.0.0.1:3000/api/stories/presidential-roster-2027
curl -fsS -i http://127.0.0.1:3000/api/intake
curl -sS -i http://127.0.0.1:3000/api/receipt
curl -sS -i http://127.0.0.1:3000/api/unavailable
```

Expect a five-item reviewed collection, a sourced detail, `uploadsEnabled: false`, HTTP 401 for a receipt request without a bearer token, and a JSON 404 in that order. Open the built client on the same origin and use the [demo walkthrough](RELEASE_HANDOFF.md#three-minute-demo).

## Vercel smoke check

- [ ] Compare the deployment’s uploaded file hashes to `vercel-release/`. Check both Home and a story deep link, the referenced script and stylesheet, `/sw.js`, and the bundled Manrope and Newsreader fonts.
- [ ] Check the five reviewed stories, a known catalogue filter and at least one nested story detail. Verify the public API and the private route errors use `Cache-Control: no-store`. Confirm a missing story or invalid API route returns JSON 404.
- [ ] Confirm `/api/intake` reports `persistent-storage-unavailable` and `/api/receipt/photo` and `/api/reports` return 503. In the browser, confirm the Camera page explains what is unavailable and omits the file picker.
- [ ] After the service worker activates, verify the shell can reopen and that no private API entries are cached. Open Discover, follow a candidate, save a story, answer its quiz, and reload My Desk.
- [ ] Stage and verify the release before promotion. Repeat the hosted checks at the production URL and retain the prior deployment for rollback. [Runbook](RELEASE_RUNBOOK.md)
