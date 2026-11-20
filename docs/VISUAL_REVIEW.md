# Visual review

Actual Chromium captures of the built MataLens interface. The desktop home and intake captures show the full page. Mobile captures show the working viewport and bottom navigation. Civic Camera review and receipt use a synthetic local test fixture.

| Screen | Desktop light | Desktop dark | Mobile light | Mobile dark |
| --- | --- | --- | --- | --- |
| Homepage | [1440 px](visual-review/home-1440-light.webp) | [1440 px](visual-review/home-1440-dark.webp) | [390 px](visual-review/home-390-light.webp) | [390 px](visual-review/home-390-dark.webp) |
| Election explorer | [1440 px](visual-review/explorer-1440-light.webp) | [1440 px](visual-review/explorer-1440-dark.webp) | [390 px](visual-review/explorer-390-light.webp) | [390 px](visual-review/explorer-390-dark.webp) |
| 2027 presidential roster with candidate disclosure | [1440 px](visual-review/presidential-1440-light.webp) | [1440 px](visual-review/presidential-1440-dark.webp) | [390 px](visual-review/presidential-390-light.webp) | [390 px](visual-review/presidential-390-dark.webp) |
| Presidential candidate profile | [1440 px](visual-review/profile-1440-light.webp) | [1440 px](visual-review/profile-1440-dark.webp) | [390 px](visual-review/profile-390-light.webp) | [390 px](visual-review/profile-390-dark.webp) |
| Rights library | [1440 px](visual-review/rights-1440-light.webp) | [1440 px](visual-review/rights-1440-dark.webp) | [390 px](visual-review/rights-390-light.webp) | [390 px](visual-review/rights-390-dark.webp) |
| Homepage rights reminder expanded | [1440 px](visual-review/rights-reminder-1440-light.webp) | [1440 px](visual-review/rights-reminder-1440-dark.webp) | [390 px](visual-review/rights-reminder-390-light.webp) | [390 px](visual-review/rights-reminder-390-dark.webp) |
| Party directory | [1440 px](visual-review/party-1440-light.webp) | [1440 px](visual-review/party-1440-dark.webp) | [390 px](visual-review/party-390-light.webp) | [390 px](visual-review/party-390-dark.webp) |
| Party recognition exercise | [1440 px](visual-review/practice-1440-light.webp) | [1440 px](visual-review/practice-1440-dark.webp) | [390 px](visual-review/practice-390-light.webp) | [390 px](visual-review/practice-390-dark.webp) |
| Official results archive | [1440 px](visual-review/results-1440-light.webp) | [1440 px](visual-review/results-1440-dark.webp) | [390 px](visual-review/results-390-light.webp) | [390 px](visual-review/results-390-dark.webp) |
| Voting preparation | [1440 px](visual-review/plan-1440-light.webp) | [1440 px](visual-review/plan-1440-dark.webp) | [390 px](visual-review/plan-390-light.webp) | [390 px](visual-review/plan-390-dark.webp) |
| Civic Camera intake | [1440 px](visual-review/camera-1440-light.webp) | [1440 px](visual-review/camera-1440-dark.webp) | [390 px](visual-review/camera-390-light.webp) | [390 px](visual-review/camera-390-dark.webp) |
| Civic Camera review | [1440 px](visual-review/camera-review-1440-light.webp) | [1440 px](visual-review/camera-review-1440-dark.webp) | [390 px](visual-review/camera-review-390-light.webp) | [390 px](visual-review/camera-review-390-dark.webp) |
| Civic Camera private receipt | [1440 px](visual-review/camera-receipt-1440-light.webp) | [1440 px](visual-review/camera-receipt-1440-dark.webp) | [390 px](visual-review/camera-receipt-390-light.webp) | [390 px](visual-review/camera-receipt-390-dark.webp) |

## Design decisions after inspecting the screens

- The homepage presents the presidential date and roster alongside its main action. The next section gives visitors real candidate rows and the dated election calendar. Polling-unit guidance, ballot preparation and Civic Camera remain visible on a 390 px phone before the lower content sections.
- Newsreader carries the headline and main page titles. Manrope holds navigation, forms and data. Fine rules group dense rows. Warm off-white, forest green and muted mint establish the light and dark systems. Two static Newsreader files reduced the font bytes needed for the first viewport.
- The first mobile review put the Accord source note and running-mate details below long rosters and profile fields. The revised screens put the listing note beside the count and the running mate immediately below the profile actions. Party practice now opens directly from the top of the directory.
- The desktop layout gives sources their own column. Mobile results use compact numerical columns and a labelled vote-share chart. The offline and private report flows use the same controls and visual hierarchy as the rest of the app.
- The profile header is visually quieter with the portrait fallback. The directory and recognition exercise identify illustrated clues explicitly while access to reusable political media remains a dependency.

## Verification

- Reviewed 10 screens across 320, 360, 390, 768, 1280 and 1440 px in both themes. The matrix checked 120 layouts for horizontal overflow, applied theme and browser exceptions. At 390 and 1440 px across both themes, 40 screens were scanned with axe WCAG tags for 2.0 A/AA, 2.1 AA and 2.2 AA. These scans reported zero violations.
- Tested reflow in Chromium at actual 200% browser zoom and exercised keyboard focus, browser Back, filter persistence, candidate and rights disclosure, carousel pause and reduced motion.
- Walked the official-roster to candidate-profile journey at 400 kb/s with 400 ms emulated latency and 4× CPU slowdown. The final local throttled run reached the homepage presidential action in 4.8 seconds. Cold load time is sensitive to device, network and hosting conditions.
- Three API integration tests and five browser journeys passed. The browser uploaded synthetic photos through both report types and recovered an interrupted submission. Receipt retrieval, withdrawal and offline plan recovery used the built frontend and the real local API.
- Release review still needs a first-time-voter walkthrough, manual assistive-technology checks and physical Android/iOS camera and installation checks. [Implementation status](IMPLEMENTATION_STATUS.md)
