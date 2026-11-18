# Instructions for coding agents — MataLens

Read **README.md**, **VISION.md**, **PRODUCT.md** and **DESIGN.md** before implementing anything.

## What this project is

A new, small, excellent **mobile-first civic platform** for the AIESEC hackathon. It is a **side project**; do not consume the founder's attention with unrelated courses or feature sprawl. **MY-AI**, the AI-native physical companion/OS project, is separate and is the founder's primary ambition. **AGUS**, the Solana/financial agent, is separate.

## Operating principles

- **Act:** after reviewing the repo and writing a concise implementation plan, **implement a useful running product**, not merely planning documents or a landing-page mockup.
- **Keep a factual capability ledger** (`docs/IMPLEMENTATION_STATUS.md`) with `working`, `partially working`, `not implemented`, `external dependency`, and evidence/tests. No invented integrations or results.
- **Prioritize easy-to-use.** A new user should understand every screen. Remove unnecessary steps, jargon, and clutter.
- **Design quality is essential.** Premium, intentional, forest-green and white, restrained glossy surfaces, smooth but performant motion. No generic AI aesthetic.
- **Be politically neutral.** No candidate endorsements, rankings, party persuasion, targeting, fabricated news, or hidden political-preference analytics. Every material candidate/public-process claim needs a dated source.
- **Keep private candidate choices and voting-preparation notes client-side.** No party-preference profiling, PVC images or IDs, and no analytics event containing political selections.
- **Do not photograph marked ballots**. Only accept images of publicly displayed result sheets or safe civic issues under the intake rules. Handle uploads with server-side content-type/size checks, privacy review, spam/rate limiting and honest provenance.
- **Never imply official government affiliation.** 'Submitted to MataLens' is not 'Submitted to INEC', an authority or a civic partner. A third-party partnership requires explicit integration/evidence.
- **No fake functionality.** Real photo uploads or an explicitly blocked state; clearly distinguish test data and actual source records.
- **Do not overbuild.** No automatic election-result OCR/aggregation or government submission engine in the first iteration. Founder explicitly rejected this as the main goal.
- **Security:** public repo; no secrets, test credentials, personal data, hardcoded API keys or unsafe unrestricted public storage buckets. Protect report submissions and metadata; track moderation and retention.
- **Open-source ethics:** research VotersDesk, FixMyStreet and Ushahidi, but do not copy protected visual assets or silently import AGPL code. Obtain licence clearance before direct code reuse.
- **Architecture:** choose and explain a sensible modern mobile-first stack; Next.js/TypeScript/PWA/PostgreSQL/object storage/MapLibre are *candidates*, not mandatory if they cause avoidable complexity. Ensure development works with explicit env vars and free/local development paths.
- **Quality:** targeted automated tests, build/lint/typecheck where available, responsive screenshots, useful README setup, and documented failure states. Test before claiming completion.

## What to build in the first autonomous engineering pass

1. Confirm current repository state and available tools; write a concise plan at `docs/IMPLEMENTATION_PLAN.md`.
2. Implement a clean running application and reusable theme system.
3. Deliver onboarding and election preparation guided by sourced official links, plus a narrowly scoped genuinely accurate sample constituency/profile.
4. Deliver an impartial interactive exercise and private local save/restore.
5. Deliver a functioning photo-upload + receipt + My Actions view (or implement secure dev storage with a truthful production-disabled boundary until secure storage is configured).
6. Deliver polished responsive UX and minimal tests.
7. Track scope and evidence in `docs/IMPLEMENTATION_STATUS.md`.
8. Commit changes to an implementation branch and open a PR if tools permit. Do not silently deploy to production or merge without the owner's approval.

**Do not invent nationwide candidate data, polling-unit coordinates, official election dates, user counts, prizes or platform partnerships.** Research and source any external claims before including them.

The goal is not to impress with sheer file count. The goal is **a beautiful product that works and can be demonstrated confidently.**
