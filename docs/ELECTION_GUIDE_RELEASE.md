# MataLens election guide release

MataLens now opens with a guide to Nigeria’s 2027 elections. It helps a reader find a candidate, see what was published and inspect the record behind it. The app remains available to guests.

## Deployment

- **Live.** The new homepage, 2027-first discovery, 2023 archive and evidence reader shipped from `28a9eaf9f74b0e36c4e374120e6c6b09f482ffb9`. Vercel deployment `dpl_9nUKjq5TVBeiJwzAeYcowBfnRgaX` passed 12 staged and 13 public HTTP checks. The previous deployment `dpl_7LXYsFD1zw4uayLgoDxfh1k3a4z2` remains available for rollback. [Production](https://matalens.vercel.app/)
- **Preview.** The watchlist, profile layout and quiz progress follow-up at `22fb288c61024280c9e9eac0e9288a8b9b604695` passed all 12 Vercel preview checks. Automatic approval review requires separate approval to replace the live deployment with this follow-up. [Tested preview](https://matalens-agplsst48-youngfrankcreator-7012.vercel.app/)

Each preview’s 18 uploaded file hashes matched its local test package. The live alias and its 18 file hashes were also verified separately. No paid plan or infrastructure was added.

| Journey | Previous release | Election guide |
| --- | --- | --- |
| Start | The homepage opened as a political briefing. | Start with election discovery or go straight to a worked evidence comparison. The schedule links to covered contests and the INEC calendar. |
| Find who is contesting | Candidate search combined election years by default. | Discover and the explorer open on 2027 records. Search by name or party, then narrow by office and area. The 2023 archive has its own entry and declaration. |
| Inspect a claim | The two INEC deadline dates were buried in prose. | The recruitment reader puts both dates and their sources together, labels the official notice and the republication, and states what remains uncertain. |
| Return to research | Following mixed shared roster stories into a personal feed. | In the follow-up preview, My Desk opens on a browser-only watchlist with links to candidacy, party, available commitments and person-specific reviewed developments. |
| Learn from a source | Every submitted answer counted as completed. | In the follow-up preview, an incorrect answer records an attempt. A correct answer marks the exercise complete. Retry returns focus to the answer choices. Earlier progress is carried forward as attempts because the old app recorded no correctness. |

## Test results

- The catalogue check, both TypeScript checks and production package passed. Vite warned that the main bundle is above 500 kB before compression.
- 13 Node/API tests passed. All five guest browser tests passed in both API and sample modes. They cover keyboard access, offline preparation and the standalone Camera’s upload, recovery and withdrawal journey.
- The real-API browser journey passed for both builds. The follow-up also passed a browser smoke test against the packaged Vercel handler. It checked the evidence deep-link focus after reload, incorrect-answer status, the read-only Camera display and service-worker cache separation.
- The live HTTP checks covered the election guide, Discover, 2023 archive, elections, the evidence deep link, all five stories, nested detail with the two source URLs, intake and private-route behavior, fonts, script, stylesheet and service worker. The Vercel log query found no error or fatal messages after publishing.

## Browser screenshots

Captured in Chromium from the matching API-mode packages on desktop light and mobile dark. The workspace tunnel blocked direct Chromium navigation to Vercel and direct HTTP requests to both publishers. The browser suite checked the two exact links in the reviewed edition. The hosted HTTP checks used the Vercel connector.

| Screen | Live build | Follow-up preview |
| --- | --- | --- |
| Election guide | [Desktop](election-guide-screenshots/live/home-desktop.png) · [Mobile](election-guide-screenshots/live/home-mobile.png) | [Desktop](election-guide-screenshots/home-desktop.png) · [Mobile](election-guide-screenshots/home-mobile.png) |
| Candidate discovery | [Desktop](election-guide-screenshots/live/discover-desktop.png) · [Mobile](election-guide-screenshots/live/discover-mobile.png) | [Desktop](election-guide-screenshots/discover-desktop.png) · [Mobile](election-guide-screenshots/discover-mobile.png) |
| Candidate profile | [Desktop](election-guide-screenshots/live/profile-desktop.png) · [Mobile](election-guide-screenshots/live/profile-mobile.png) | [Desktop](election-guide-screenshots/profile-desktop.png) · [Mobile](election-guide-screenshots/profile-mobile.png) |
| Recruitment evidence | [Desktop](election-guide-screenshots/live/evidence-desktop.png) · [Mobile](election-guide-screenshots/live/evidence-mobile.png) | [Desktop](election-guide-screenshots/evidence-desktop.png) · [Mobile](election-guide-screenshots/evidence-mobile.png) |

## Three-minute demonstration

1. **0:00–0:35** Open the [election guide](https://matalens.vercel.app/). Show the two scheduled rounds and the separate 2023 archive. Explain that the catalogue covers the national presidential contest and selected local contests.
2. **0:35–1:05** Open **Find candidates and parties**, search for a candidate and open their published record. Show the office, the 2027 election label and the link to the source.
3. **1:05–2:15** Return Home and select **See the evidence**. Show 2 December in INEC’s own notice and 3 December in the republication. Open each source link. The two records agree on the extension and differ on the revised date. Before applying, consult INEC’s current notice or official portal. [Recruitment comparison](https://matalens.vercel.app/stories/inec-recruitment-deadline-2027#source-comparison)
4. **2:15–3:00** Answer the recruitment quiz, save the story and open **My Desk** to show the saved record. Explain that the site serves five reviewed developments and stores saved items in this browser.

## Boundaries

The hosted API serves the five reviewed records and has no continuous collection schedule. Candidate coverage is national for the presidential contest and selective in Edo, Lagos and Oyo. Archive results cover the 2023 national presidential declaration. Hosted Civic Camera shows that uploads and private receipts are unavailable until there is durable private storage. [Release runbook](RELEASE_RUNBOOK.md)
