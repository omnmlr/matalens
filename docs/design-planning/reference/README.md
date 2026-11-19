# MataLens design references

The following generated boards are planning studies. The [blueprint](../BLUEPRINT.md) governs production content, layout targets and interaction.

- [Desktop Field Guide and election directory](desktop-home-concept.png)
- [Mobile Home, rights and candidate profile](mobile-home-rights-and-profile.png)
- [Mobile Civic Camera review](civic-camera-review-concept.png)

The supplied desktop screen recording runs 4:58.4 across three sequential clips. Observations below use cumulative time. The recording and extracted frames are private. The recording does not establish mobile layouts, keyboard behavior or the completed live Camera flow.

| Time | Observed reference behavior and its design consequence |
| --- | --- |
| 00:28–00:58 | VotersDesk uses a ruled roster beside a geographic interaction and a compact calendar. The map and roster describe different offices. MataLens ties geography and roster to the same stated scope. |
| 01:28–02:08 | VotersDesk updates the heading and candidate set when the visitor selects Enugu East. Its ballot-selection feedback foregrounds a small-sample poll. MataLens updates coverage immediately and keeps bookmarks private, with inline feedback. |
| 02:10–03:26 | Party pages link to candidates and sources. VotersDesk’s preparation page puts action beside guidance, and its results page states the absence of an available result. Keep both patterns. |
| 03:35–04:23 | Candidate pages gain depth from attributable records after a compact identity section. Keep sources close to facts and use only supported sections. |
| 04:50–04:58 | FixMyStreet foregrounds location and photo intake. The recording ends before photo selection. The linked documentation and public source provide evidence for later states. |

[Reference audit](../../REFERENCE_DESIGN_AUDIT.md) · [Current MataLens captures](../../VISUAL_REDESIGN_REVIEW.md) · [Public FixMyStreet photo-first tests](https://github.com/mysociety/fixmystreet/blob/3f38dcc104a7cc94303e62b1d77fd9e07ff598fa/.cypress/cypress/e2e/photo_first.cy.js)
