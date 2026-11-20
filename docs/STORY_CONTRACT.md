# MataLens story service handoff

The proposed frontend contract is [src/story-contract.ts](../src/story-contract.ts). The fixture and HTTP adapters implement the same interface. The news service can adopt these payloads without depending on React or the election UI.

| Request | Successful response |
| --- | --- |
| GET /api/stories | JSON array of stories, newest publication first |
| GET /api/stories/:id | One JSON story. Return 404 when unavailable. |
| GET /api/stories?personId=… | Optional public catalogue filter with the same array response. |

- Use stable lowercase, URL-safe story IDs. Politician IDs come from `people` in `src/election-data.json`. Use those IDs across election years. Party codes come from the same catalogue.
- Use ISO dates. `publishedAt` refers to the original publication. `reviewedAt` refers to editorial review. The first source is the original publication and supplies the original headline and publisher. Link any additional claim, evidence or earlier commitment to its original document.
- The public UI only renders `reviewed` stories. Include optional reviewed quiz data with source IDs that resolve within the story. Keep attributed statements distinct from official records. Include dated commitments only when the primary text supports them.
- Set `VITE_STORY_PROVIDER=api` at build time once same-origin routes are available. Without it the app displays a labelled, bundled editorial sample. The browser requests the public collection and matches follows locally. It never sends follow or save state to the service. Story detail requests can retrieve individually opened public stories.
- The frontend needs a contract review with the news service owner before switching providers. There is no ingestion in this branch.
