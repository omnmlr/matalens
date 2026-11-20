# MataLens story service handoff

The shared frontend and backend contract is [src/story-contract.ts](../src/story-contract.ts). The fixture and HTTP adapters implement the same interface. The news API serves these payloads from the reviewed edition. See the [news desk documentation](NEWS_INTELLIGENCE.md) for collection and review.

| Request | Successful response |
| --- | --- |
| GET /api/stories | JSON array of stories, newest publication first |
| GET /api/stories/:id | One JSON story. Return 404 when unavailable. |
| GET /api/stories?personId=… | Optional public catalogue filter with the same array response. |

- Use stable lowercase, URL-safe story IDs. Politician IDs come from `people` in `src/election-data.json`. Use those IDs across election years. Party codes come from the same catalogue.
- Use YYYY-MM-DD for story, source and review dates. Commitments may use YYYY-MM when an original document gives only a month. `publishedAt` refers to the original publication. `reviewedAt` refers to editorial review. The first source is the original publication and supplies the original headline and publisher. Link any additional claim, evidence or earlier commitment to its original document.
- The public UI only renders `reviewed` stories. Include optional reviewed quiz data with source IDs that resolve within the story. Keep attributed statements distinct from official records. Include dated commitments only when the primary text supports them.
- Set `VITE_STORY_PROVIDER=api` at build time once same-origin routes are available. Without it the app displays a labelled, bundled editorial sample. The browser requests the public collection and matches follows locally. It never sends follow or save state to the service. Story detail requests can retrieve individually opened public stories.
- `sourceComparisons` is optional. Each entry summarises how at least two distinct sources in the same story agree, differ or supply different evidence. Display the cited sources alongside the summary. Compare the actual publications and flag shared provenance where applicable.
- `timeline` is optional and ordered by day. Each entry cites source IDs in the same story. `reported` and `published` mark a report or publication. `scheduled` is a documented planned date, even when it has passed. The collection and detail responses carry the same evidence fields.
- A manifesto commitment can include `document` with a direct publisher link and a section locator. The commitment date can retain month precision. Its comparison describes what the source supports and what evidence would be needed to assess implementation.
- The backend serves only `reviewed` stories. Missing or withdrawn IDs return 404. The list returns 400 for repeated or malformed `personId` parameters and an empty array when a valid ID has no stories. A missing or invalid edition returns 503.
