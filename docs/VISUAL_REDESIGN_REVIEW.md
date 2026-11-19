# MataLens visual redesign review

19 November 2026 · Chromium captures from the implementation branch

## Screenshots

| View | Desktop | Mobile |
| --- | --- | --- |
| Home · light | [1440 × 1000](redesign-screenshots/home-desktop-light.png) | [360 × 800](redesign-screenshots/home-mobile-light.png) |
| Home · dark | [1440 × 1000](redesign-screenshots/home-desktop-dark.png) | [360 × 800](redesign-screenshots/home-mobile-dark.png) · [320 × 830](redesign-screenshots/home-narrow-dark.png) |
| Ballot · candidate details open | [Light](redesign-screenshots/ballot-desktop-light.png) | [Dark](redesign-screenshots/ballot-mobile-dark.png) |
| Practice · answered question |  | [Light](redesign-screenshots/practice-mobile-light.png) |
| Civic Camera · report details and review | [Report details · light](redesign-screenshots/camera-desktop-light.png) | [Review · dark](redesign-screenshots/camera-review-mobile-dark.png) |
| Civic Camera · private receipt |  | [Light](redesign-screenshots/receipt-mobile-light.png) |

The camera review and receipt use an explicitly labelled synthetic fixture in a local, temporary data store. The receipt capture displays the case ID and status returned by the server. Private recovery material is available through the app’s download and copy controls.

## Comparison with the rejected sample

The earlier 320 px capture used most of the first screen for a slogan and an illustration. Its primary action opened a general page and the election date was part of the illustration. In the redesigned capture, the two primary actions share one row, the calendar shows named upcoming elections with its own INEC link, and Civic Camera has a dedicated entry before the candidate roster. The first names and parties are visible above navigation at 360 px. [Rejected mobile capture](reference-design-evidence/matalens-home-320-dark.jpg) · [Redesigned 360 px capture](redesign-screenshots/home-mobile-dark.png)

The wide layout uses a two-column opening and an editorial register separated by rules. The ballot includes the exact constituency, office, and source beside the register. Each candidate has the same fields and a private bookmark control. The phone layout keeps those fields in reading order with searchable names and party abbreviations. [Desktop ballot](redesign-screenshots/ballot-desktop-light.png) · [Mobile ballot](redesign-screenshots/ballot-mobile-dark.png)

## Critique from the captures

- The initial narrow capture put the lookup below the candidate button. That shift pushed actual names behind the bottom navigation. The final layout fits both actions side by side at 320 px, with enough vertical space for the source and the start of the roster. Long names still need two lines at that width. Allowing them to wrap keeps full names readable. [320 px capture](redesign-screenshots/home-narrow-dark.png)
- The mobile ballot originally squeezed source details and constituency metadata into narrow competing columns. On phones, the constituency and office now have a full line above a separate date and source row. A complete expanded candidate with all the factual fields still takes a substantial part of the first screen. Collapsed rows serve quick comparisons, and the browser disclosure keeps the same search, scroll and focus when revisiting details. [Mobile candidate capture](redesign-screenshots/ballot-mobile-dark.png)
- The first report review and rehearsal captures repeated large page headings, pushing the most relevant task controls out of view. The active steps now use compact headings. The report preview remains large enough to inspect the selected photo, and the send action follows the entered context and consent. Longer descriptions will still require scrolling. [Report review](redesign-screenshots/camera-review-mobile-dark.png) · [Rehearsal](redesign-screenshots/practice-mobile-light.png)
- The design was checked against the prior audit and rendered MataLens captures. The audit’s evidence for VotersDesk comes from public page retrieval, so it cannot establish a live side-by-side visual comparison. No first-time participant study or physical handset camera session was conducted. [Reference audit](REFERENCE_DESIGN_AUDIT.md)

## Functional evidence

- The production build and existing API integration suite passed. The browser suite covers guest election navigation, a privately saved candidate and plan, calendar export, both exercises, offline prep, both photo report types, an interrupted response retried with the same receipt, and recovery and withdrawal in a fresh browser. It also runs keyboard and automated accessibility checks. [Browser scenarios](../tests/guest.spec.mjs) · [API scenarios](../tests/api.test.mjs)
- Chromium was checked at 320, 360, 390, 768 and 1280 px in both themes across the five core routes. All five routes also reflowed at 200% Chromium page zoom. Twenty automated axe scans across desktop and mobile in both themes reported zero violations. The candidate-specific URL opened the intended facts and focused the disclosure. Keyboard closing preserved focus. Party-name search, empty results and clearing the filter were exercised without console errors.
- A disabled intake check let the guest preview a selected photo and blocked submission before any upload request. A separate enabled run returned HTTP 201 and displayed the private receipt.
