# MataLens Detailed Interaction Specifications

> **Target Platform:** MataLens (Personal, Nonpartisan Political-Learning Companion for Nigerians)  
> **Repository:** `omnmlr/matalens` | **Branch:** `agent/research-design`  
> **Date:** November 2026  
> **Document:** Design Planning Deliverable 07  
> **Status:** Approved Interaction Specifications  

---

## 1. Signature Interaction 1: The Political Development Timeline

The Political Development Timeline connects today's news to historical manifesto pledges, gazetted legislation, and court rulings.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ STATE MACHINE: TIMELINE SPINE & NODE INTERACTION                                               │
├─────────────────────┬───────────────────┬───────────────────────────┬───────────────────────────┤
│ STATE               │ VISUAL INDICATION │ TRIGGER                   │ SYSTEM ACTION             │
├─────────────────────┼───────────────────┼───────────────────────────┼───────────────────────────┤
│ 1. Default (Collapsed)│ Solid 2px spine   │ Page Load                 │ Renders top 3 pivotal     │
│                     │ with circular dot │                           │ historical milestones     │
├─────────────────────┼───────────────────┼───────────────────────────┼───────────────────────────┤
│ 2. Node Hover/Focus │ Dot scales 1.25x; │ Mouse hover /             │ Preloads primary document │
│                     │ Hairline glow ring│ Keyboard Tab focus        │ metadata (PDF size, date) │
├─────────────────────┼───────────────────┼───────────────────────────┼───────────────────────────┤
│ 3. Node Expanded    │ Card expands with │ Tap / Click / Enter key   │ Expands inline drawer with│
│                     │ smooth spring     │                           │ verbatim gazette excerpt  │
├─────────────────────┼───────────────────┼───────────────────────────┼───────────────────────────┤
│ 4. "Show Full Spine"│ Full chronological│ User clicks "View 5 older │ Animates full historical  │
│                     │ history revealed  │ events in this campaign"  │ sequence (spring 320ms)   │
└─────────────────────┴───────────────────┴───────────────────────────┴───────────────────────────┘
```

### Detailed Event Handling:
```typescript
interface TimelineInteractionEvent {
  nodeId: string;
  sourceType: 'manifesto' | 'court_ruling' | 'gazette' | 'hansard' | 'verified_news';
  action: 'EXPAND_EVIDENCE' | 'OPEN_DOCUMENT_VIEWER' | 'FILTER_BY_THEME';
}

function handleNodeInteraction(event: TimelineInteractionEvent) {
  // 1. Keep reading scroll position locked
  // 2. Announce expansion to screen reader via aria-live="polite"
  // 3. Render verified primary source excerpt
}
```

---

## 2. Signature Interaction 2: Inline Disclosures & Truth Anchors

To prevent reading friction, complex constitutional terms or manifesto claims appear as **interactive inline pills** directly in the text.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ INLINE TRUTH ANCHOR EXPANSION INTERACTION                                                       │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ "...passed under [Section 84(12) of the Electoral Act 2022] requiring political appointees..." │
│                           │                                                                     │
│                           ▼ (User Taps / Clicks Pill)                                           │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📜 STATUTORY TRUTH ANCHOR DRAWER (Non-Destructive Slide-Over)                               │ │
│ │ Clause: Section 84(12), Electoral Act 2022                                                  │ │
│ │ Verbatim Statutory Text:                                                                    │ │
│ │ "No political appointee at any level shall be a voting delegate or be voted for at the     │ │
│ │  convention or congress of any political party for the purpose of the nomination of        │ │
│ │  candidates for any election."                                                              │ │
│ │                                                                                             │ │
│ │ Plain English Meaning:                                                                      │ │
│ │ Ministers, Commissioners, and Special Advisers must resign before contesting party primaries│ │
│ │                                                                                             │ │
│ │ Judicial Precedent:                                                                         │ │
│ │ Supreme Court Judgment SC/CV/501/2022 (President Buhari v. National Assembly) confirmed    │ │
│ │ that Section 84(12) is constitutionally valid and binding.                                  │ │
│ │                                                                                             │ │
│ │ [Close Truth Anchor]   [Copy Sourced Excerpt]   [View Certified Act]                        │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Accessibility Specs for Inline Pills:
- `role="button"`
- `aria-expanded="false"` (transitions to `"true"` on open)
- `aria-controls="truth-anchor-drawer"`
- Keyboard accessible via `Enter` or `Space`
- Focus returns to the inline pill upon drawer dismissal.

---

## 3. Signature Interaction 3: Source Inspection & Media Transparency

When a reader interacts with the **4-Pillar Perspective Distribution Bar**, they can inspect the exact outlets covering the story and their corporate ownership.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PERSPECTIVE DISTRIBUTION POP-OVER & OWNERSHIP REGISTRY                                          │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ User clicks "Incumbent / State Media (42%)" Segment in Perspective Bar ]                      │
│                                │                                                                │
│                                ▼                                                                │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🏢 PERSPECTIVE BREAKDOWN: INCUMBENT / STATE MEDIA (9 Outlets Covering)                      │ │
│ │ Framing Summary: Emphasizes executive reform, grassroots funding, and economic gains.        │ │
│ │                                                                                             │ │
│ │ OUTLET DIRECTORY & PROPRIETOR TRANSPARENCY:                                                 │ │
│ │ 1. Nigerian Television Authority (NTA)                                                      │ │
│ │    • Ownership: Federal Government of Nigeria (State Broadcaster)                          │ │
│ │    • Headquarters: Abuja · Established: 1977 · Factuality: Mixed (State Rationale Focus)    │ │
│ │ 2. The Nation                                                                               │ │
│ │    • Ownership: Vintage Press Ltd (Proprietor: Bola Ahmed Tinubu Political Network)        │ │
│ │    • Headquarters: Lagos · Established: 2006 · Factuality: High (Standard Journalism)      │ │
│ │ 3. News Agency of Nigeria (NAN)                                                             │ │
│ │    • Ownership: Federal Government wire service                                             │ │
│ │                                                                                             │ │
│ │ [View Complete 22-Outlet Transparency Directory →]                                          │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Signature Interaction 4: The 60-Second Civic Rehearsal

Interactive learning in MataLens is an active ritual, designed to take under 60 seconds with instant cognitive reward:

1. **Inquiry Stage:** The user is presented with an authentic scenario derived from current news.
2. **Selection Stage:** Three high-contrast option cards are rendered. Tapping an option locks the selection and disables double-submission.
3. **Smooth Flip Stage:** The card performs a 3D-card-flip animation (`transform: rotateY(180deg)` / `perspective: 1000px` with spring easing `cubic-bezier(0.16, 1, 0.3, 1)`).
4. **Resolution Stage:** The back face reveals:
   - Success badge (`🟢 Correct`) or Dignified Clarification (`⚪ Constitutional Reality`)
   - Primary law citation (Electoral Act 2022 or 1999 Constitution)
   - 2-sentence actionable takeaway
   - Bookmark button saving to local device (`matalens_learning_rehearsals:v1`).
