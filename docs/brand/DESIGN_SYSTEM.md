# MataLens design system

MataLens is a guest-first, nonpartisan way to understand Nigerian elections, review evidence and learn by doing. Its visual voice is calm, precise and editorial. “See what matters. Know what to do next.” is the brand line.

- Lead with a clear headline, a useful next action and a visible distinction between reporting, official records and campaign material.
- Use published dates, named publishers and direct sources. Give comparisons and timelines room to explain what each source establishes.
- Keep following, saving and preparation visibly personal. Spell out genuine limitations, including unavailable intake or offline content.

## Colour

The release uses the effective cascade in `src/styles.css`, `src/civic.css` and `src/editorial.css`. It carries forward Antigravity’s editorial grid and shallow surface treatment, with the application’s established palette.

| Role | Light | Dark | Use |
| --- | --- | --- | --- |
| Canvas | `#F8F8F0` | `#0B1D16` | Full page or slide |
| Surface | `#FFFEF8` | `#142A20` | Cards, forms and reading surfaces |
| Main text | `#162A21` | `#EEF4E9` | Headlines and readable content |
| Secondary text | `#4E6054` | `#B4C7B8` | Body supporting copy and metadata |
| Action / link | `#155B41` | `#9BDFB5` | Primary action, links, accents |
| Action foreground | `#FFFFFF` | `#0C241B` | Text inside primary actions |
| Action hover | `#0E4834` | `#CDF4D7` | Hover or interaction emphasis |
| Rule | `#D6DFD3` | `#344E40` | Quiet separators |
| Strong rule | `#A0B4A2` | `#668676` | Outlined controls and emphasized separation |
| Selection / tint | `#E8EFE4` | `#1B3B2B` | Selected cards, small surfaces |
| Strong tint | `#DCEADE` | `#244837` | Stronger emphasis |
| Quiet tint | `#F0F3E9` | `#10281E` | Footer and secondary framing |
| Folio | `#ECEFE1` | `#162E23` | Featured story and learning panels |
| Strong folio | `#DCE7D7` | `#214332` | Secondary evidence emphasis |
| Focus | `#207B51` | `#C5EBBC` | Visible keyboard ring |
| Error text / background | `#973C32` / `#FBEEE9` | `#FFC4B7` / `#442D28` | Validation, destructive actions |
| Notice background | `#F3EDDA` | `#383522` | Caveat or connection notice with theme text |
| Editorial cover | `#153D2E` | `#193E2E` | Feature cover with `#F4F5E6` text |
| Cover accent | `#DCEBA9` | `#DCEBA9` | Small decorative highlights |
| Header overlay | `#F8F8F0F5` | `#0B1D16F5` | Header surface with subtle blur |

Use action green and an explicit label or check icon for success. Use ink and muted text for pending or unavailable states. Pair colour with a visible word, icon or underline. Keep chart colours independent of political affiliation. Verify small text pairs at WCAG AA contrast and keep text clear of decorative cover artwork.

## Typography

The application bundles static Newsreader 500 normal and italic through `@fontsource/newsreader`. Manrope Variable is imported from `@fontsource-variable/manrope`. Vite emits local WOFF2 assets for both. Keep the existing imports. Fallbacks are Georgia for Newsreader and system UI, Segoe UI or Arial for Manrope.

| App role | Family and weight | Size, line height, tracking |
| --- | --- | --- |
| Briefing hero | Newsreader 500, italic for emphasis | 54–70 px mobile, 64–113 px larger screens, 0.99 line height, −0.057 em |
| Editorial page / story title | Newsreader 500 | 45–91 px fluid, 0.99 line height, −0.057 em |
| Section heading | Newsreader 500 | 29–53 px, approximately 1.0 line height, −0.025 to −0.04 em |
| Body / explanation | Manrope 400–500 | 15–18 px, 1.55–1.65 line height, normal tracking |
| UI labels / buttons | Manrope 650–790 | 13–15 px, 1.35–1.5 line height |
| Metadata / captions | Manrope 650–760 | 11–13 px, 1.45–1.55 line height |
| Editorial kicker | Manrope 800–830 | 11–12 px, 1.5 line height, approximately +0.13 em, uppercase |

Use italic sparingly. Use tabular figures for aligned statistics. Presentation sizes are in the [slide guide](PRESENTATION_GUIDE.md).

## Layout and surfaces

- The desktop shell tops out at 1152 px with 32 px side gutters. Use 16–19 px on mobile and a readable single column. Limit sustained reading to roughly 60–68 characters. Use an 8 px spacing rhythm and 4 px for tight alignments.
- Keep straight editorial rules and one featured surface per section. Use 6–8 px for controls, 9–12 px for cards and covers, and a 1 px border. Use subtle highlights or shadows only when they communicate depth.
- Use original abstract cover geometry or properly credited public-source imagery. Keep political photos attributed and use a neutral profile icon when no licensed image is available.
- Use the app’s Lucide line-icon style. Pair unfamiliar icons with a label and retain a 44 px target for primary controls. Keep icons, charts and screenshots subordinate to the headline.

## Component patterns

| Component | Pattern |
| --- | --- |
| Action | One filled primary action per section. Secondary actions use an outline or a clear text link. Keep focus visible. |
| Story card | Topic and date, serif headline, short explanation and one reading link. Use a tinted leading story, plain rows for secondary stories. |
| Citation | Name publisher, title and date where known. Mark the external link. Attach citations to the relevant claim as well as the source list. |
| Profile | Name and role first, then follow control, dated electoral history and evidence. Keep campaign statements and verified records visibly distinct. |
| Evidence | Use titled disclosures for source comparisons and timelines. Give timeline items a date and status label. Give a manifesto source its document title or section locator. |
| Learning | Explain the question before options. Use native selectable options, plain answer feedback and the supporting source. Persist progress locally. |
| State | Brief loading, empty and offline copy with a recovery action where available. Use truthful intake and receipt messages. |

## Motion

Use 140–220 ms transitions for hover, focus and expansion feedback. Keep the layout and reading position stable. Respect reduced motion and remove continuous movement. Keep dates, citations, progress and essential controls visible at rest.

## In use

Use a clear headline, one editorial accent and room for the underlying evidence. Keep chart denominators and source dates visible. Avoid full-slide gradients, heavy shadows, ornamental metrics, generic AI imagery and competing hero graphics. [Brand assets](BRAND_ASSETS.md)
