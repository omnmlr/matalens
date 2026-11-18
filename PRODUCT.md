# MataLens — Product Specification & Hackathon Scope

## Non-negotiable guiding rule

**Build for a person who has never used an election website.** They should immediately understand what the page means and what to do next. No developer language, long forms, confusing labels, or decorative workflows with no function.

## No-login product requirement

**No sign-in, account creation, email, phone number, OTP, password, wallet, or mandatory multi-screen onboarding is permitted to access core features.** Visiting the site should immediately open a useful, understandable experience. Let visitors skip introductions and explore before selecting a location. Make localized personalization optional, incremental and clearly explained.

Reading civic information, candidate exploration, practice exercises, saved candidate-preparation choices, locally saved reminders and official polling-unit guidance must all work as a guest. Store private preferences only on-device, not on MataLens servers.

**Photograph submission and case receipts must also support guests.** Design a secure anonymous submission flow with a high-entropy receipt/recovery link or code and an appropriate private retrieval mechanism. Explain that a person who loses an unbacked-up receipt may not be able to recover the case. Do not put guessable public IDs in place of authorization. Protect uploads with rate limits, moderation, conservative file handling, privacy controls and safety checks. A user may supply contact information optionally when needed for a particular external workflow, but that must never silently become mandatory registration.

Any later optional accounts or cross-device sync are strictly an enhancement, not a prerequisite. Testing must start in a fresh private/incognito browser and demonstrate full working first-use without authentication.

## Information architecture

- **Home** — personal greeting, election/civic preparation progress, next useful action, relevant updates.
- **My Election** — step-by-step onboarding, official polling-unit guide, offices/candidates, policies/records, private preparation selections and a countdown/reminder.
- **Practice** — accessible recognition exercises and an election-day procedural rehearsal; neutral and not tied to recommending a candidate.
- **Civic Camera** — choose `Public result sheet` or `Community issue`, photograph/upload, preview, give context, add optional location, submit and receive a platform receipt.
- **My Actions** — locally saved preparation and actual submission receipts; true, auditable status messages; visibility controls and deletion where applicable.
- **Updates** — curated source-linked announcements; explicitly separate official information from media reporting and user reports.

Combine navigation to avoid six overwhelming tabs. The experience should remain obvious on a small phone.

## Journey A: First-time election preparation

1. A clear invitation to learn about civic rights, elections, and the PVC (not a claim that holding a PVC alone guarantees eligibility).
2. Simple selection of state, LGA/constituency where relevant; explain where to verify official voter registration and polling unit.
3. Guide the user to official INEC lookup; accept a polling-unit identifier/location only if the data is verified or explicitly user-supplied. Avoid inventing map coordinates.
4. Show verified election dates, contested offices for that location, and all sourced candidates **only where accurate data exists**.
5. For each candidate: name, photo (properly licensed), party/symbol, running mate when applicable, public biography, policies/statements with source and date, public records, neutral context; optional carefully sourced interesting facts. Similar/relevant candidates may be grouped by the **same office or race**, not by hidden political preference targeting.
6. Allow user-private bookmarking/preparation choices **in device-local storage**. Do not transmit or track whom they choose.
7. Interactive practice: candidate/party/name/logo recognition, spelling exercises, common procedure scenarios; impartial exposure and accessible options.
8. Optional reminders, calendar export and accessible location/directions links; explain online vs offline behavior.
9. Relevant updates with publication dates and direct sources; no invented push feed.

## Journey B: Civic Camera, election document

1. Select `Public result sheet`.
2. Explain what is and is not safe/permitted to photograph: **publicly posted results, never a filled/marked ballot**. Do not encourage confrontation at a polling unit.
3. Add the polling-unit identifier, choose image/upload, preview and confirm it is appropriate to share.
4. Store original file with integrity metadata and a stable receipt; separate submitter-private identity fields from the public record; optional geolocation only with permission.
5. Display **Submitted to MataLens / Awaiting review** or similarly truthful statuses, **not** `verified result`, `INEC confirmed` or `forwarded` without actual support.
6. Enable an export/interoperability path for consented future partnerships with verified civic-observation projects.
7. **No OCR, vote-total calculation, or independent collation requirement.** These were explicitly rejected as the product's centerpiece.

## Journey C: Civic Camera, community issue

1. Select `Community issue` (a real first-release path if capacity permits, otherwise clearly coming soon).
2. Upload one or more photos of damaged roads, drainage, unusable public facilities etc.
3. Enter a short natural description; optionally invoke an AI text helper to make it concise, factual and editable.
4. Record consented location (pin or descriptive address), rough category, and confirmation.
5. Show the accurate evidence receipt and actual platform-only status.
6. Later: credible routing to authorities, follow-up responses and a public map with moderation, privacy review and abuse controls. **Never pretend the government received a submission.**

## AI assist: small, responsible and optional

AI can help turn colloquial input into neutral, editable text and suggest categories, but must not invent details, decide if allegations are true, identify a person as guilty, verify an election result or certify a medicine as fake. Works without AI through manual entry and an optional template.

## Must-have functional acceptance criteria

- Mobile-first layouts work on narrow Android widths; light/dark theme preference persists; accessibility basics.
- Official sources are **linked explicitly**; no fabricated candidates, dates, results or polling-unit coordinates.
- Election preparation can be saved locally and reopened; nothing sends private political selections to backend/analytics.
- A simple exercise works end-to-end and is understandable without explanation.
- Civic Camera can genuinely upload a safe test photo, create a record, return a stable ID/receipt and show it in My Actions on refresh/sign-in as designed. If production storage is not configured, block public upload and show a truthful setup/disabled state.
- A user can remove/withdraw their own report where supported, subject to documented public-evidence retention rules; privacy policy is explicit.
- Honest handling of invalid files, duplicate taps, network loss, failed uploads and browser refresh.
- Source code, environment setup, migrations and runnable tests are documented.
- Do not claim agency routing, official affiliations, automated election result verification, or statewide candidate coverage unless demonstrably true.

## Priority order for the immediate build

**P0 — Prove usefulness:** landing/onboarding, election guide using official links, a curated correctly labelled single sample constituency, basic neutral recognition exercise, saved private preparation, working upload+receipt, excellent responsive design.

**P1 — Polish:** map for verified coordinates only, reminders/calendar export, multiple evidence categories, update feed with dated sources, offline cache, accessibility, AI-assisted text organizer.

**P2 — After hackathon:** broader sourced election datasets, partner interfaces, verified public cases, actual authority routing, multi-language audio, more robust moderation, public issue map, sustained civic services.

**No fake data masquerading as real.** Seed demo-only records must be clearly labelled.

## Competition posture

The hackathon is a short engineering/impact demonstration, not a promise of a nationwide deployed election-monitoring organization. Jury narrative should emphasize:
- Understand / Prepare / Document / Follow up.
- Trust, neutrality, user privacy and accessibility.
- A real photo-and-receipt infrastructure that extends beyond election season.
- Measurable usability testing and one fully working end-to-end workflow.
- Competitor overlap acknowledged, differentiated through simpler guided experience and well-connected journeys.

## Product status

This document is the **intended specification** until code, tests and deployment evidence establish implementation. Codex should keep actual verified status separately rather than quietly promoting a plan into an achieved feature.
