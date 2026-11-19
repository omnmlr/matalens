# Field Guide implementation review

These are actual Chromium captures of the built app with locally stored, synthetic QA reports. Concept boards and the product blueprint live on the separate [planning branch](https://github.com/omnmlr/matalens/tree/codex/matalens-design-planning/docs/design-planning).

| Screen or state | Evidence |
| --- | --- |
| Homepage | [Desktop light](field-guide-screenshots/home-1440-light.png) · [Desktop dark](field-guide-screenshots/home-1440-dark.png) · [390 px light](field-guide-screenshots/home-390-light.png) · [390 px dark](field-guide-screenshots/home-390-dark.png) · [320 px dark](field-guide-screenshots/home-320-dark.png) |
| Directory behavior | [Name search](field-guide-screenshots/home-search-1440-light.png) · [An area outside the catalogue](field-guide-screenshots/home-uncovered-390-dark.png) · [Explorer](field-guide-screenshots/explorer-1440-light.png) |
| Civic records | [Race](field-guide-screenshots/race-1440-light.png) · [Candidate](field-guide-screenshots/profile-390-dark.png) · [Rights guide](field-guide-screenshots/rights-390-dark.png) · [Results](field-guide-screenshots/results-390-dark.png) |
| Private actions | [Camera review](field-guide-screenshots/camera-review-390-dark.png) · [Confirmed receipt](field-guide-screenshots/camera-receipt-390-dark.png) · [My Actions](field-guide-screenshots/actions-390-dark.png) |

On desktop, the INEC calendar fits inside the forest masthead and the first three candidate rows sit beside the working finder. The rights scenario starts at roughly 745 px in the 1440 × 900 capture. At 390 px, the first complete roster row ends at about 719 px in both themes. The mobile Camera draft now reflows at 320 px, and candidate source links sit above the corresponding fact rows.

## Verification

- The build and three API tests passed. Four browser scenarios cover guest discovery, same-race comparison, preservation of search on Back, private My Ballot resume, offline preparation, both report types, interrupted upload recovery, withdrawal and historic result reconciliation.
- Chromium checks passed on eight routes at 320, 360, 390, 768, 1280 and 1440 px in both themes (96 screen checks). Axe reported no violations across 32 scans with WCAG 2 A/AA and WCAG 2.1 AA tags. A Chromium browser profile set to 200% zoom had no horizontal overflow on nine routes.
- The built localhost home transferred approximately 133 KiB of compressed JS, CSS and required font data. One Chromium mobile cold-load emulation at 900 kbps down, 500 kbps up, 150 ms latency and 4× CPU slowdown recorded about 1.92 s LCP and 0.0004 CLS. The same setup measured 4.36 s LCP before static compression. HTTP checks confirmed byte-identical decoded identity, gzip and Brotli assets, and the intake endpoint remained uncached.
- The 18 declared candidate counts total 24,025,940, matching INEC’s declaration. The public context is [INEC’s 2023 report, Annexure 2](https://wp1.inecnigeria.org/wp-content/uploads/2024/02/2023-GENERAL-ELECTION-REPORT-1.pdf#page=457). Independent rights-content review, participant walkthroughs and physical Android/iOS camera and screen-reader verification remain release checks.
