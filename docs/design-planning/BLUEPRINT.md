# MataLens design blueprint and implementation handoff

The Field Guide puts a working election directory alongside a sourced calendar, real candidate records and a practical rights scenario. The design aims to give users something they can act on before asking them to learn the product structure. It supports first-time voters, researchers looking up one name, and residents arriving with a photo to document. The design baseline is commit `672243d536c3dfca03e517f99364298ab1900f52`. The concepts are available in the [visual reference index](reference/README.md).

## Homepage

| Section | Desktop | Mobile |
| --- | --- | --- |
| Header | 64 px shell with a wordmark, Elections, Rights, Civic Camera, My Actions and a labelled theme control. | Wordmark and theme at the top. Four labelled bottom destinations in browsing views. The wordmark returns home. No primary section is marked current on Home. |
| Masthead and calendar | Shallow forest band. Use a 7/5 grid with a fine dividing rule. Lead with “Make sense of your election”, one sentence, Polling-unit lookup and Start a report. Give the next absolute date visual weight and display the second published date in a ruled row. | Brief heading and sentence, side-by-side task links where space permits, a compact date and an official source link. The full calendar carries the second date. |
| Explore elections | Four columns for the sage finder and eight for the results. Keep headings aligned, with a visible office, area, source and three named candidate rows. | One reading column. Keep the active control directly above the roster. Names can wrap. Keep the full-roster link and source visible. |
| Rights feature | Inset sage in Light, raised forest in Dark. Present a right beside a realistic situation and a practical action, with links to two related rights. | Stack the right, situation, action and related links. The default treatment is stationary. |
| Preparation, updates and archive | A ruled task list beside dated notices. Give a returning user Continue my plan in the usual task position. Show one verified archive preview. | Preparation precedes notices and archive. Dates and provenance remain visible. |

The finder begins with **By place** and **All covered places**. Show the Surulere I preview with its Lagos and House of Representatives scope. A state or FCT selection filters the preview immediately. Show a race selector only when multiple reviewed races match. An uncovered state keeps an official source link and a route back to the covered directory.

**By name** provides a labelled search for candidate name, party name and abbreviation. Submit shows up to three records with scope and links. More results link to the full Explorer with the public query. A zero-result search offers a reset. Announce results without moving focus, and preserve inputs across mode changes within the visit. Use All elections as the section-level link and one full-roster action inside the preview. At 320 px, keep finder, polling-unit lookup, rights and reporting entry points in the initial viewport. At 390 × 844, aim to show the first named candidate. At 1440 × 900, show the complete finder, three candidates and the start of the rights feature.

Schedules use Africa/Lagos, absolute dates and a visible INEC link. If sources conflict or a future date is unavailable, keep the official calendar link. The recording’s sample date is a reference for design, so confirm dates and scope before release. [INEC calendar](https://www.inecnigeria.org/elections/calendar)

## Visual system

- Self-host Manrope. Desktop H1 44/48, mobile 32/36, section headings 28/34 and 24/30, body 16/25, metadata 14/20. Use tabular numerals for data and allow names to wrap.
- Light uses canvas `#F8FAF6`, reading surface `#FFFFFF`, sage `#EDF4EB`, text `#142820`, secondary `#485F53`, action `#006746`. Dark uses `#0B1913`, `#10271E`, `#193629`, `#F2F8F3`, `#B7C9BD` and `#78DEAB` respectively.
- Content has a 1200 px maximum. Use twelve grid columns from 960 px, eight from 600 px and four below. Use 32, 24 and 16 px gutters, with 12 px at 320. Section spacing is 48 px desktop and 32 px mobile. Let the masthead expand for zoom and translation.
- Use fine rules and changes in surface color for separation, with 6 px controls and 10 px contained previews. Reserve shadows for floating controls and dialogs. Use a slight inset highlight on the masthead. Minimum 44 × 44 px targets and visible focus. Use 120–200 ms state feedback and immediate reduced-motion alternatives. Convey state with text and an icon.
- The search, records, calendar and guides carry the visual interest. Treat generated boards as composition studies. Follow this text for labels, links, keyboard behavior and missing-data states.

## Product and delivery phases

### P0 · Guest journeys

- **Explorer and race pages.** Start with the INEC 2027 calendar and the eight Surulere I House of Representatives entries. Distinguish calendar scope from local roster coverage. Use filters for year, office and place. Restore public filters and scroll position on Back. Give the race detail a title, boundary, office, date, list provenance, full roster and preparation routes. [INEC Lagos list, page 14](https://www.inecnigeria.org/documents/uploads/2026/10/b7e9758b-56ae-4068-89c0-8a4b38dd5d35-final-list-lagos-house-of-representatives.pdf#page=14)
- **Candidate records.** Stable public URL, full name, party, office, constituency, current listing status, qualifications as listed and exact document, page and row. Use a reading column and source rail on desktop. Keep the evidence close to the fact on mobile. Provide private Save with undo and public-link Share. Consolidate unavailable fields into a short coverage note.
- **My Ballot and My Actions.** An optional route from location to applicable race, research and preparation. Allow Back, Skip and Finish later. Ask for an LGA only when a reviewed mapping helps. When multiple races remain possible, offer candidates for each explicitly labelled constituency. Persist progress, checklist, reminders and bookmarks locally. Preserve the receipt recovery path and distinguish removing local information from a server withdrawal.
- **Rights and practice.** Start with ballot secrecy, voting assistance and assigned polling units. Scope each guide to the source jurisdiction, with a realistic situation, safe next step and official link. Use sections 50 and 126, 54 and 56 respectively. Send official enquiries to INEC’s verified landing page. Keep election-day rehearsal and source-backed party-list recognition. If editorial playback is ever added, provide an explicit Play control, pause on interaction, and keep every guide directly reachable. [Electoral Act 2026](https://nass.gov.ng/documents/download/11248) · [INEC guidelines](https://www.inecnigeria.org/elections/guidelines) · [INEC contact centre](https://www.inecnigeria.org/contact)
- **Civic Camera.** Keep community issues and publicly posted result sheets distinct. Explain eligibility before the picker. Offer camera and library, whole-image preview, Replace or Remove, editable context, then explicit review and consent. Keep selected photos through Back and recoverable errors. Clear consent when the image changes. Warn that originals may retain location metadata and identify MataLens as recipient. Preserve the endpoint’s format, size and consent validation, retry deduplication, private storage, moderation and 30-day expiry. An uncertain response offers retry with the same token or receipt lookup. An offline draft stays in the active page and waits for a user-initiated send.
- **Receipts and help.** Show a confirmed receipt only after a successful API response. Give actual status, expiry, download and recovery instructions. Use real withdrawal and local removal controls with separate consequences. Provide Updates, Sources, Corrections, Privacy and Help. A correction carries public context only. Use a verified monitored destination when one exists. Otherwise offer a copyable note and describe delivery status.

### P1 · Evidence depth

- Add biographies, public service, earlier campaigns and attributed positions only where dated evidence supports them. Treat a person and each candidacy as different data. Keep same-race comparison private and use equivalent fields with neutral ordering. Offer equal columns on desktop and one field with adjacent candidate values on mobile.
- Connect documented parties and races. Distinguish current and historical registrations. Link to INEC for fuller coverage and provide a clear scope statement. [INEC party register](https://www.inecnigeria.org/parties)
- Begin the official archive with the 2023 presidential declaration in Annexure 2. Verify the whole table and check arithmetic. Display scope, declaration date, raw totals and provenance. Link IReV separately for polling-unit sheets. Camera evidence never goes into official totals. [INEC report](https://wp1.inecnigeria.org/wp-content/uploads/2024/02/2023-GENERAL-ELECTION-REPORT-1.pdf) · [IReV](https://irev.inecnigeria.org/)
- Add voting intimidation and vote buying after domain review of the guidance, jurisdiction and relevant contact channels.

### P2 · Verified expansion

Add reviewed race batches and source maintenance ownership. Add a map after licensing, accurate electoral boundaries and an equivalent keyboard-accessible index are established. Reviewed language editions, public integrations and wider reporting require ownership and operating capacity.

## Engineering boundaries

Keep React, TypeScript, Vite, CSS and the current report API. Maintain typed, versioned public content linking races, people, candidacies, parties, declarations, guides and sources. Record publication and check dates, the smallest applicable jurisdiction and precise source locations. Preserve legacy `/election` and candidate anchors, `/practice`, saved bookmark IDs and receipt fragments.

Keep the shell and reviewed guides available offline after download. Keep political selections local and keep private receipt content, upload data and secrets out of analytics, logs and service-worker caches. Recheck the official schedule weekly and daily in the final fortnight. Review candidate lists after amendments and official channels ahead of polling. Link published documents and use only legally reusable artwork. The reference recording and extracted frames remain private. [Capability baseline](../IMPLEMENTATION_STATUS.md) · [Source and licensing audit](../REFERENCE_DESIGN_AUDIT.md)

## Verification and visual approval

- Capture Home, the changed-place and empty states, Explorer, a sparse profile, a rights guide, Camera review and a private receipt. Review 1440 × 900 and 390 × 844 first, in Light and Dark. Compare the density, hierarchy and ease of finding a real record.
- Check 320, 360, 390, 768, 1280 and 1440 px. Test keyboard operation, 200% browser zoom, contrast, live announcements, reduced motion, TalkBack and VoiceOver. Target no horizontal overflow, ≤250 KiB compressed initial JS, CSS and fonts, LCP ≤2.5 s and CLS ≤0.1 on a documented throttled Android profile. Verify a returning visit offline.
- Run build, API and browser tests. Exercise both upload types, wrong format, oversized file, disabled intake, duplicate submits, uncertain response, recovery in a new browser, expiry and withdrawal with synthetic fixtures. Test physical Android and iOS camera or picker.
- Walk eight Nigerian participants through finding a candidate source, a rights action and receipt recovery. Target seven unassisted completions per task. Misunderstanding a private bookmark as a cast vote, a receipt as a complaint to authorities, an uncovered race as an empty ballot or an IReV sheet as a declared result blocks release.
