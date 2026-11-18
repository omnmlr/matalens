# MataLens — Premium Design & Usability Direction

**Mood:** premium consumer product, human, calm, helpful, slightly glossy and tactile. **Not** a political campaign, government form, neon AI dashboard, finance clone, or a typical hackathon site.

The founder chose the name **MataLens** and expressly requested **green and white**, possibly dark/deep green for dark mode. **Ease of use and comprehension are first-class design requirements**, not concessions.

## Color starting points (working tokens)

| Role | Light | Dark |
| --- | --- | --- |
| App surface | `#F7F9F5` warm ivory | `#071D17` deep forest |
| Elevated surface | `#FFFFFF` | `#12352A` |
| Primary text | `#14392B` | `#F3F8F4` |
| Supporting text | `#567365` | `#B4CEC0` |
| Primary action | `#136847` | `#81D9A5` |
| Primary action text | `#FFFFFF` | `#082118` |
| Borders | `#DCE8DF` | `#315849` |
| Success/verified | Semantically distinct, and always with text | Same |
| Warning/error | Semantic accessible contrasts | Same |

These are launch tokens, **not a fixed final palette**. Test actual contrast and refine. Gloss belongs in a restrained glassy header/control, diffused highlights, excellent surface treatment and button feedback, not unreadable transparency or pseudo-3D clutter.

## Visual language

- A disciplined custom wordmark for **MataLens**, not an unlicensed copied logo.
- Typography: editorial clarity, controlled hierarchy, large confident headings, excellent line-height and numeral legibility.
- Spacious but efficient phone layout. Buttons and touch targets large enough for unfamiliar users.
- Soft but deliberate geometry: high-quality rounded cards, polished separators and subtle depth.
- Color restrained; important action must stand out.
- Elegant transition between steps and states; loading, success, error, offline, reminder and upload confirmation all have intentionally designed experiences.
- Consistent icons and high-quality source-backed imagery where legally usable.
- Respect reduced-motion preference and avoid heavy animation harming low-end Android devices.
- Responsive from narrow Android phones through tablets and desktops; test 320px+, keyboard, dark mode and slow connections.
- PWA installability and good offline behavior are preferable to an empty 'download app' button.
- Create proper navigation, back, footer/about, privacy and sources; no dead-end screens.

## Open-and-use experience (required)

The homepage must be useful immediately, without a sign-in gate, registration prompt, splash maze, compulsory profile wizard or modal asking for a name, PVC, email, phone number or account creation. Users may optionally choose an electoral area when they want relevant information; browsing must not require this upfront.

Prefer progressive disclosure: **Explore elections**, **Learn your rights**, **Practice**, and **Report an issue** should be understandable entry points. Candidate preparation choices are private and local. For guest photo submissions, provide a beautifully clear upload-success screen with an unguessable receipt/recovery link and instructions for saving it; never label it as government-confirmed.

Do not build sign-in/signup screens, profile completion percentage, onboarding gating, a user dashboard that redirects to login, or decorative buttons masquerading as actions.

## Interaction philosophy

At every step, show:
1. **Where am I?**
2. **What does this mean?**
3. **What should I do next?**

Use short plain-language labels. Show progress only when meaningful. Don't ask for personally sensitive information simply to personalize the UI. If official verification is required, clearly hand off to the source and explain what the user should do when returning.

Keep the home experience welcoming, not a wall of cards. The first useful action should be obvious.

## Inspiration and ethical adaptation

- **VotersDesk**: information structure, election preparation, candidate presentation, good editorial hierarchy. Study as a product reference but **do not clone distinctive screens, branding or copyrighted assets**.
- **FixMyStreet**: report-the-problem workflow, geography, photo intake, status lifecycle. Source is AGPL-family; any direct code reuse requires explicit legal/licence review and compliance. Prefer independent implementation of concepts where appropriate.
- **Ushahidi**: public-reporting usability and structure.
- **Premium consumer fintech product polish** for animation, typography and microinteractions—not for financial branding or unrelated features.

Screens to prioritize: onboarding; election preparation home; candidate view; rehearsal; upload/preview; report receipt; My Actions; theme variants; offline/error states.

## Review bar

Do not consider a screen finished just because it renders or a browser test passes:
- Inspect actual screenshots and compare mobile+desktop+light+dark.
- Conduct a 60-second first-time-user walkthrough with no instructions.
- Eliminate confusing labels, crowded screens and placeholders pretending to be functioning actions.
- Ensure all interactive controls work; no decorative buttons or dead CTAs.
- Test upload flows on mobile and slow network; handle failure clearly.
- No 'AI magic' visuals or dark sci-fi glowing orb motif.

**Premium means frictionless comprehension plus excellent craft.**
