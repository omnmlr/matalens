# MataLens hackathon release

The release branch combines Chisom’s frontend at `09c63a5` with the reviewed backend at `f2b9208`. The application package was built from `6ab00e9803908b828c951723edb0eb1aabf614ff`. [Release branch](https://github.com/omnmlr/matalens/tree/release/matalens-hackathon) · [Application commit](https://github.com/omnmlr/matalens/commit/6ab00e9803908b828c951723edb0eb1aabf614ff)

## Production deployment

Vercel project `matalens` (`prj_nP7TCf3KUfDQgLLNmv1GYeBBAcNy`) serves the production alias from deployment `dpl_7LXYsFD1zw4uayLgoDxfh1k3a4z2`. The prior deployment, `dpl_6YdjDPdmwUZWJo9X9dmtJpMJ2nee`, is the rollback target. [Production](https://matalens.vercel.app/) · [Staged build](https://matalens-ltz7dczdl-youngfrankcreator-7012.vercel.app/)

The preview passed the hosted smoke checks before publication. Vercel rejected direct promotion of the preview with HTTP 422, so the release was published from the same tested file set with the production target. All 18 uploaded file hashes match between local, preview and production. Vercel’s file-upload deployment records lack Git metadata in the returned record, so the application commit is recorded here alongside the verified deployment ID.

The canonical URL passed 17 HTTP checks for Home, Discover, Camera, a story deep link, the five-story collection, catalogue filtering, detail evidence and quizzes, the missing-story response, intake status, receipt and photo rejection, the service worker, the main script and stylesheet and both Latin fonts. Vercel reported no error or fatal runtime logs in the post-deploy check. The rollback deployment remains ready. The application package passed desktop and mobile Chromium interaction checks locally. The browser environment’s outbound tunnel rejected navigation to the Vercel domain, so the screenshots come from the matching local package.

## Chisom’s slide kit

Use Newsreader 500 for slide titles and Manrope for body, labels and data. Begin with a 16:9 canvas, 50–58 pt titles, 20–24 pt body and 12–14 pt credits. Use Forest `#155B41`, Ivory `#F8F8F0`, Soft White `#FFFEF8` and Ink `#162A21`. Use `#0B1D16` with `#EEF4E9` and `#9BDFB5` for dark slides. Give one screenshot or diagram the most space and keep source captions and page numbers in a shared footer. [Design system](brand/DESIGN_SYSTEM.md) · [Slide guide](brand/PRESENTATION_GUIDE.md) · [Brand assets](brand/BRAND_ASSETS.md)

## What shipped

- The guest journey connects the briefing, candidate discovery, sourced profiles, lessons and My Desk. Follows, saves and progress stay in the browser. The catalogue covers 248 candidacies across 22 contests and 21 parties.
- Reviewed stories link comparisons and timelines to their underlying citations. Manifesto references preserve attribution, publication precision, section and a direct document link where supplied. The feed uses the authoritative story contract and stable catalogue IDs. [Contract](STORY_CONTRACT.md)
- `npm run build:vercel` assembles the client, same-origin fonts, offline shell and read-only API. It embeds five reviewed stories. Updating that edition requires a new build and deployment. The deployment offers no continuous news feed.
- Hosted Civic Camera explicitly disables photo uploads and private receipt access. The standalone server still supports private intake, sanitization, receipt recovery and withdrawal with a service-owned persistent store. New intake requires a canonical HTTPS origin, verified private storage and working Sharp. [Operations and rollback](RELEASE_RUNBOOK.md)

## Verification

| Check | Result |
| --- | --- |
| Catalogue drift, both TypeScript projects, production build and Vercel package | Passed. Vite emitted a bundle-size warning for the 542 kB minified main chunk. |
| Node and API suite | 13 tests passed, including story validation, private storage, catalogue CRLF parity, disabled sanitization, and hosted API route handling. |
| Guest browser suite in sample and API modes | Five Chromium tests passed in each mode, including keyboard and automated accessibility checks, 320 px mobile, catalogue navigation, offline preparation and local Camera recovery and withdrawal. |
| API-mode story journey | Passed against the standalone server’s real API. Covered evidence, quiz and lesson responses, on-device preferences, retry, offline recovery, both themes and both fonts. |
| Local browser against the deployable Vercel package | Desktop light and mobile dark passed with both fonts, a saved story after reload, a quiz, read-only Camera and no API entries in the installed service-worker cache. |

[Desktop home](release-screenshots/desktop-home-light.png) · [Mobile home](release-screenshots/mobile-home-dark.png) · [Mobile story](release-screenshots/mobile-story-dark.png). These screenshots use the release package in local Chromium.

## QA disposition

- **Fixed and verified on Linux.** Catalogue checks normalize CRLF while detecting content drift. The missing-Sharp test proves intake fails closed while reviewed stories remain available. POSIX private-store checks still reject an unsafe directory.
- **Fixed, pending native Windows verification.** The Windows store uses protected NTFS ACLs and verifies existing private directories and SQLite files. Antigravity reproduced the original POSIX-mode failure on Windows. This release environment runs Linux.
- **Verified browser behavior.** An offline story shows a reconnect state and recovers when the browser comes back online. A synthetic 503 shows retry, then loads the story on the next successful request.
- **Deferred.** Windows rename contention and real iPhone HEIC handling remain untested. Intake supports JPEG, PNG and WebP. The current release keeps request retry scoped to the existing UI behavior.
- **Rejected editorial changes.** The reviewed edition preserves quoted source titles, including INEC’s published `INECPRESS` title, and its own text uses `INECPRES`. State assembly and governorship are scheduled for 6 February 2027 in the cited calendar. The release omits outlet labels and perspective percentages.

## Three-minute demo

| Time | Show | Say |
| --- | --- | --- |
| 0:00–0:30 | Open [Home](https://matalens.vercel.app/) and select **Read the briefing**. | “MataLens helps readers understand Nigerian election updates and check the original sources without creating an account. This release opens with five reviewed stories.” |
| 0:30–1:05 | Open the [INEC recruitment story](https://matalens.vercel.app/stories/inec-recruitment-deadline-2027) and show **Compare sources**. | “The INEC notice gives 2 December and the republished statement gives 3 December. We show both with their citations and attribute each date.” |
| 1:05–1:35 | Go to Discover, search for Bola Ahmed Tinubu and follow the profile. Return to Home and find the [presidential roster story](https://matalens.vercel.app/stories/presidential-roster-2027) under **Your following**. | “A follow connects stories to the candidate catalogue. It stays in this browser.” |
| 1:35–2:20 | On the roster story, show **Timeline** and open the housing commitment. Save the story, choose **18** in the quiz, and check the answer. | “The timeline distinguishes the publication from the scheduled election. The housing link goes to the campaign document. The quiz asks how many tickets name both nominees.” |
| 2:20–2:40 | Open My Desk and reload to show the saved story and progress. | “The browser keeps what you follow, save and practise.” |
| 2:40–3:00 | Open [Civic Camera](https://matalens.vercel.app/camera). | “This public demo pauses intake and private receipts until we have durable private storage. Those flows passed on the standalone server.” |
