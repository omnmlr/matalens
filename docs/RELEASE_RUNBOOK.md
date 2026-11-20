# MataLens production runbook

The hackathon site uses the Vercel release package below. The standalone Node deployment in the rest of this runbook supports private receipt storage. Build and verify the exact integration commit on a preview before promoting it.

## Vercel hackathon release

Build on Node 24 or later with `npm ci --include=dev` and `npm run build:vercel`. Upload the contents of `vercel-release/` as the deployment root of the existing `matalens` project. Record the source commit in deployment metadata. The packaging script enables `VITE_STORY_PROVIDER=api` at build time and validates the five reviewed stories from `data/news/reviewed-edition.json` before embedding them in the read-only function. The hosted package needs no runtime environment variables, database, or API credentials. Publishing a changed reviewed edition requires rebuilding and redeploying this package.

Vercel serves the browser bundle, fonts and service worker over HTTPS. Client deep links fall back to the app shell. The same-origin `/api/stories`, `/api/stories/:id` and `/api/intake` use the hosted function with `Cache-Control: no-store`. The service worker bypasses `/api/`. Civic Camera shows photo intake and private receipts as unavailable because this deployment has no persistent private store. The private routes return 503 and store no evidence. Followed politicians, saved stories and learning progress stay in the browser.

Stage the package on a preview URL. Check the homepage, a story deep link, both web fonts, `/api/stories` (five entries), a story detail with supporting evidence, `/api/intake` and private route rejection. Save the current production deployment ID. Promote the verified build and repeat the checks on the canonical URL. If validation fails after promotion, restore the prior deployment in Vercel and verify the canonical domain again.

## Standalone server with persistent storage

## Build and start

From the integrated repository root, build with development dependencies installed:

```sh
npm ci --include=dev
npm run data:check
npm run typecheck
npm test
VITE_STORY_PROVIDER=api npm run test:browser
VITE_STORY_PROVIDER=api npm run build
NODE_ENV=production npm start
```

Playwright needs system Chromium or `npx playwright install chromium`. Start the server from the repository root. The runtime needs `dist/`, the server modules and production dependencies, `data/news/reviewed-edition.json`, and `src/election-data.json`. The build makes the service worker and precompressed assets as well as the browser bundle. The start command defaults to `http://127.0.0.1:3000`.

## Environment

| Variable | Stage | Value and behaviour |
| --- | --- | --- |
| `VITE_STORY_PROVIDER` | Build | Set to `api` for the political-learning frontend. This value is baked into the browser bundle. The unset value selects its labelled editorial sample. Rebuild to change providers. |
| `NODE_ENV` | Runtime | Set to `production` for the server process. Install dev dependencies for the build. |
| `MATALENS_MODE` | Runtime | Leave unset for a production run. `npm run dev` sets it to `dev` and launches the Vite proxy. |
| `MATALENS_HOST` | Runtime | Keep `127.0.0.1` behind the proxy. |
| `MATALENS_PORT` | Runtime | Defaults to `3000`. Point the proxy at the same local port. |
| `MATALENS_NEWS_EDITION` | Runtime | Leave unset for the bundled five-story edition. An optional absolute path selects an operator-managed reviewed edition. |
| `MATALENS_ENABLE_UPLOADS` | Runtime | Use `0` for a read-only pilot. `1` enables new production intake when the private data directory and HTTPS origin are also configured. |
| `MATALENS_DATA_DIR` | Runtime | Absolute path to a persistent private directory outside `public/` and `dist/`, with mode `0700` on POSIX or a protected NTFS ACL on Windows. Keep the same directory across restarts and releases to preserve receipts. |
| `MATALENS_ORIGIN` | Runtime | Exact canonical HTTPS origin, with no path or trailing slash. The server compares it to the browser’s `Origin` on writes. |
| `MATALENS_TRUST_LOOPBACK_PROXY` | Runtime | Use `1` only for a trusted loopback proxy that replaces `X-Forwarded-For` with the verified client address. |

A process manager can set the runtime environment, or the server reads a root `.env` file at startup. Keep environment files and private paths out of public assets. Browser-exposed variables beginning with `VITE_` are public.

## HTTPS routing

Point the external HTTPS host at the same loopback Node listener for every path. Serve static assets and the application shell through that server. Forward `/api/*` unchanged, with its HTTP method, query, multipart body and `Origin`, `Sec-Fetch-Site` and `Authorization` headers. Send the canonical public host and HTTPS scheme to the loopback server. At the trusted edge, discard incoming forwarding headers you are replacing. In particular, use the proxy’s verified client address for `X-Forwarded-For`, since Civic Camera rate limits use it when trust is enabled.

| Route | Expected behaviour |
| --- | --- |
| `/api/stories` and `/api/stories/:id` | Reviewed JSON. `?personId=…` is an optional public catalogue filter. |
| `/api/intake` | JSON reporting whether new photo intake is enabled and stating the retention period. |
| `POST /api/reports` | Guest report upload with a private bearer receipt and the same-origin check. |
| `GET /api/receipt`, `GET /api/receipt/photo`, `DELETE /api/receipt` | Private receipt status, preview and withdrawal. |
| Unknown `/api/*` | API error with JSON and HTTP 404. |
| `/assets/*`, `/sw.js` and app deep links | Build assets, service worker and SPA entry page for client navigation. |

Respect the app’s `Cache-Control: no-store` on every API route. Apply the HTML fallback to client routes only. Preserve the app’s response security headers and asset cache policy. Avoid proxy logs that include request bodies, bearer tokens or raw receipt data. Set the inbound upload body limit to accommodate an 8 MiB photo plus up to 64 KiB of multipart overhead, for example 9 MiB at the edge. The application still enforces its own stricter photo and multipart limits.

## Reviewed edition and rollback

The bundled edition is checked into the release and contains five reviewed stories. It is the default data returned by the actual API, including when external publishers are unreachable. Serving this edition is independent of collection. The frontend’s editorial sample is a separate build mode. An unreachable API produces an error or offline state in API mode.

If using `MATALENS_NEWS_EDITION`, keep the approved file outside web-served directories and preserve its approvals and withdrawals across releases. A missing or invalid override produces HTTP 503. Restore a reviewed edition that preserves recorded withdrawals before reopening the feed. For a separate demo with no operator edition, unset the override to select the bundled five. Roll back the app build and server together, keeping the private receipt database on its persistent volume. Review any restored evidence backups and copies against the retention and withdrawal policy. [News desk operations](NEWS_INTELLIGENCE.md)

## Civic Camera operations

Use TLS and a service-owned encrypted volume that is accessible only to the service and authorised operators. On Windows, keep the data path under a service-controlled parent on NTFS. Provision a new leaf by running the server as its service identity. Windows PowerShell sets and checks a protected ACL restricted to the service identity, SYSTEM and local Administrators. For an existing store, the app verifies the directory and checks the database and its sidecar files before opening SQLite. Have an administrator correct an unverified ACL before reusing that store. Write moderation exports inside a separately verified private directory. Keep SQLite and its WAL private. The server stores the original photo, a metadata-stripped preview and a one-way receipt hash. Uploaded originals can contain metadata. Maintain the 30-day retention policy for backups and operator review copies. Restrict and promptly remove temporary review copies. [Moderation commands](../README.md#run-a-hosted-pilot)

The native Sharp installation must support reading still JPEG, PNG and WebP images and writing sanitized WebP previews. If Sharp cannot load or initialize, new intake reports as unavailable and rejects uploads. The story API and existing private receipt operations remain available.

The public app can remain read-only with `MATALENS_ENABLE_UPLOADS=0` while the server still opens existing receipt links from the configured persistent database. Before enabling new intake, review moderation ownership, test both report types with synthetic photos and confirm the proxy preserves the existing security controls. If an intake problem occurs, disable new uploads with `0`, restart, and keep the data directory mounted for receipt recovery and withdrawal. [Integration and smoke checklist](INTEGRATION_CHECKLIST.md)
