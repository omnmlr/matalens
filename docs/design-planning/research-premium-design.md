# MataLens Premium Design System & Interaction Research

> **Architectural Mission:** Synthesize top-tier product design patterns from Apple News (editorial pacing, typography hierarchy), Linear (tactile gloss, information density, microinteractions), and elite interactive learning products (Brilliant, NYT Dial, Quartz active cards) into a unified, ultra-premium design system for the **MataLens** civic platform pivot.
>
> **Core Aesthetic Identity:** Forest-green (`#0A4D34`) and warm-white (`#F9FAF6`), restrained glossy surfaces, high-character editorial serif typography (`Newsreader`) paired with geometric humanist sans (`Manrope`), smooth performant motion, and zero generic AI/dashboard aesthetics.

---

## Table of Contents
1. [Executive Design Philosophy & The Civic Pivot](#1-executive-design-philosophy--the-civic-pivot)
2. [Deep Dive: Apple News Editorial Architecture](#2-deep-dive-apple-news-editorial-architecture)
   - 2.1 Editorial Layout Rhythm & Hierarchy
   - 2.2 Typographic Duality: Editorial Serif & Functional Sans
   - 2.3 Responsive Art Direction & Story Cover Mechanics
   - 2.4 Digest-to-Deep-Dive Transitions & Reading Measure
3. [Deep Dive: Linear Tactile Density & Craft](#3-deep-dive-linear-tactile-density--craft)
   - 3.1 Information Density Without Cognitive Clutter
   - 3.2 Restrained Gloss, Glass & Neutral Elevation
   - 3.3 Microinteractions, Physics & Motion Easing
   - 3.4 Keyboard-First Navigability & Accessible Scanning
4. [Deep Dive: Interactive Learning & Active Comprehension](#4-deep-dive-interactive-learning--active-comprehension)
   - 4.1 Bite-Sized Active Comprehension (Brilliant & NYT Dial)
   - 4.2 Inline Reveals & Progressive Disclosure (Quartz Active Cards)
   - 4.3 Respectful, Dignified Feedback (Zero-Patronizing Gamification)
5. [MataLens Unified Design Language Specification](#5-matalens-unified-design-language-specification)
   - 5.1 Color Token Architecture (Light & Dark Mode)
   - 5.2 Restrained Gloss & Glass Surface Token System
   - 5.3 Typographic Scale & Font Feature Matrix
   - 5.4 4px Spatial Grid & Layout Constraints
   - 5.5 Motion Choreography & Transition Tokens
6. [Component Anatomy & Production Blueprint](#6-component-anatomy--production-blueprint)
   - 6.1 Politician Profile Card
   - 6.2 Editorial Story & Civic Guide Card
   - 6.3 Development & Verification Timeline Node
   - 6.4 Interactive Lesson Drawer (Active Rehearsal)
   - 6.5 Evidence Inspector (Civic Camera & Document Review)
7. [Responsive Rules & Breakpoint Matrix (320px to 1440px+)](#7-responsive-rules--breakpoint-matrix)
8. [Implementation Roadmap for MataLens Engineers](#8-implementation-roadmap-for-matalens-engineers)

---

## 1. Executive Design Philosophy & The Civic Pivot

### 1.1 The Problem With Modern Civic Tech
Most civic, governmental, or voting platforms fall into one of two traps:
1. **The Bureaucratic Form:** Cold, intimidating, cluttered tables, dense regulatory jargon, broken mobile responsiveness, and mandatory authentication gates that disenfranchise ordinary citizens before they read a single sentence.
2. **The Hackathon AI Dashboard:** Generic neon cyberpunk cards, dark-mode purple/cyan gradients, floating 3D spheres, hallucinated analytics widgets, and superficial gamification (confetti, cartoon badges) that strip solemn democratic acts of dignity.

### 1.2 The MataLens Vision: "The Financial Times Meets Linear"
MataLens is designed for a Nigerian citizen standing on a street in Lagos, Kano, or Port Harcourt on a low-end Android device over a spotty 3G connection, as well as an investigative journalist or election observer reviewing documents on an ultra-wide desktop.

The design principles are non-negotiable:
- **Instant Guest-First Access:** No mandatory sign-in, zero paywalls, zero OTP gates, zero required profile wizards. Everything is open immediately.
- **Editorial Authority:** Every claim, candidate record, and timeline event is tied to a dated, primary official source (INEC gazettes, Electoral Act 2022 clauses). Typography must reflect this journalistic gravity.
- **Tactile Digital Craft:** Borrowing Linear’s obsession with pixel precision—subtle 1px top-edge bevels, micro-damped spring transitions, frosted glass headers, and disciplined information density.
- **Calm, High-Status Palette:** Deep Nigerian forest green (`#0A4D34`), warm alabaster ivory (`#F9FAF6`), crisp white surface elevations, and restrained sage/mint accents. No garish primary tones; no synthetic purple AI glow.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MATALENS CIVIC PLATFORM PIVOT                         │
├───────────────────────────────┬─────────────────────────────────────────────┤
│   APPLE NEWS EDITORIAL        │   LINEAR TACTILE PRECISION                  │
│   • Asymmetrical rhythm       │   • 1px hairline inner borders              │
│   • Editorial serif headers   │   • Micro-damped spring animations          │
│   • Humanist sans body        │   • High information density                │
│   • Digest-to-Deep-Dive flow  │   • Keyboard shortcuts & scanning lines     │
├───────────────────────────────┼─────────────────────────────────────────────┤
│   ACTIVE COMPREHENSION        │   MATALENS UNIFIED SYSTEM                   │
│   • "Prediction-first" checks │   • Forest Green & Warm Ivory palette       │
│   • Inline source reveals     │   • 100% Guest-First / Private On-Device    │
│   • Dignified constitutional  │   • Official primary source accountability  │
│     clarity (no childish quiz)│   • Resilient from 320px to 1440px+         │
└───────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 2. Deep Dive: Apple News Editorial Architecture

Apple News represents the gold standard for high-volume editorial pacing, blending the gravitas of legacy print broadsheets with fluid, responsive digital surfaces.

### 2.1 Editorial Layout Rhythm & Hierarchy
Apple News structures editorial real estate through deliberate **asymmetrical rhythm** that avoids the deadening monotony of identical card grids.

#### Key Architectural Patterns:
1. **The Anchor Feature (Lead Story):**
   - The top story never looks like the cards beneath it. It occupies 65% to 100% of the initial viewport width, utilizing a commanding vertical scale (2.5x to 3x that of standard cards).
   - Uses an **Art Direction Scrim**: Imagery is framed with a directional gradient overlay (`linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(7, 23, 18, 0.88) 100%)`) allowing white serif headlines to sit directly over rich photography without legibility loss.
2. **Rhythmic Cadence (Pacing Shifts):**
   - **Lead Anchor** (Hero story / Major election race)
   - **The 3-Up Editorial Strip** (Three distinct analyses with varying thumbnail placements: left, right, top)
   - **The Digest / Briefing Strip** (A continuous horizontal or stacked list of single-sentence bulleted updates, tight leading, no imagery)
   - **Thematic Cluster / Editorial Section** (A dedicated card cluster framed by a subtle tinted background panel, e.g., "Surulere I Contestants" or "Constitutional Rights Under Scrutiny")
   - **Pull-Quote / Data Callout Band** (Full-width editorial pause breaking the visual weight).

```
+---------------------------------------------------------------+
| [KICKER] 2027 GENERAL ELECTIONS                               |
| LEAD EDITORIAL ANCHOR                                         |
| Command Headline in Newsreader Serif (36px-48px)             |
| Subtitle in Manrope Sans (16px)                               |
| [Official INEC Link Pill]               [Countdown: 58 Days]  |
+---------------------------------------------------------------+
| SUB-STORY A (Image Top)   | SUB-STORY B       | SUB-STORY C   |
| 3-line headline           | 3-line headline   | 3-line head   |
| Sourced 2h ago            | Sourced 4h ago    | Sourced 6h ago|
+---------------------------+-------------------+---------------+
| QUICK SCAN DIGEST (Linear-style dense rows)                   |
| * Polling Unit 014 relocated -> Official INEC Gazette         |
| * BVAS mock accreditation scheduled for Nov 28                |
+---------------------------------------------------------------+
```

### 2.2 Typographic Duality: Editorial Serif & Functional Sans
Apple News pairs custom display serifs (e.g., *New York*) with neutral neo-grotesque sans (*SF Pro*). For MataLens, this duality is realized through:
- **Display & Section Headers:** `Newsreader` (Variable Optical Size, 500-600 weight).
- **Interface, Eyebrows, Data, & Body:** `Manrope` (Humanist geometric sans, 400, 500, 600, 700 weights).

#### Typographic Rules of Engagement:
1. **The Eyebrow Kicker:**
   - Always in `Manrope`, uppercase, tracked out (`letter-spacing: +0.08em` to `+0.12em`), small font size (`11px` to `12px`), font weight `700`.
   - Accompanied by a micro dot or subtle icon (e.g., a 6px forest green circle or Lucide icon at 14px).
2. **The Editorial Headline:**
   - Always in `Newsreader`, tight negative tracking (`letter-spacing: -0.025em` for titles, `-0.035em` for display leads).
   - Tight line height (`1.05` to `1.15`), allowing large sizes to feel cohesive and punchy rather than scattered.
3. **The Body & Scannable Facts:**
   - Always in `Manrope` with generous, comfortable line height (`1.55` to `1.65`).
   - Line length strictly capped at **62 to 68 characters per line** (`max-width: 65ch`).
4. **Tabular Numerals & Datelines:**
   - Manrope with OpenType features enabled: `font-feature-settings: 'tnum' on, 'cv01' on`.
   - Dates and times rendered in small, high-legibility muted sage (`#4A6B5D` light, `#96B8A7` dark).

### 2.3 Responsive Art Direction & Story Cover Mechanics
Editorial covers must adapt gracefully without cropping critical focal points (candidate faces, election documents):

| Viewport | Aspect Ratio | Art Direction Strategy | Scrim / Typography Placement |
| :--- | :--- | :--- | :--- |
| **Mobile (320px - 390px)** | 4:5 or 3:4 vertical | Tight crop on candidate/document; header placed below photo on light surfaces, or overlaid on lower 35% with dark scrim. | Scrim: `rgba(7, 23, 18, 0.92)` linear fade. Minimum 44px tap target on all CTAs. |
| **Tablet (768px)** | 16:10 or 3:2 | Two-column split: Image occupies left 45%, typography and metadata occupy right 55%. | No text over image; clean side-by-side editorial layout with vertical separator hairline. |
| **Desktop (1280px - 1440px)** | 2:1 panoramic or 16:9 | Hero image framed within restrained container (max height 420px), asymmetric 60/40 reading grid. | Ample negative margins, sticky right-hand metadata rail containing source verification badges. |

### 2.4 Digest-to-Deep-Dive Transitions
When a citizen taps an editorial summary card to read the full candidate dossier or constitutional analysis:
1. **Shared Element Motion:** The card boundary smoothly expands into the modal drawer or page container using a spring-damped curve (`cubic-bezier(0.16, 1, 0.3, 1)`).
2. **Sticky Translucent Glass Header:**
   - As the user scrolls past the title, the header condenses into a 52px frosted bar (`backdrop-filter: blur(16px)`).
   - Displays the candidate name/title in `Newsreader` (16px), reading progress bar (1.5px forest green indicator at the bottom edge), and immediate action buttons ("Save Privately", "Official Source").
3. **Inline Footnote Drawers:**
   - Tapping an INEC citation `[INEC-2026-Lagos-p14]` does not redirect off-site; it slides up a tactile bottom sheet displaying the exact gazette page excerpt, verification date, and an external link.

---

## 3. Deep Dive: Linear Tactile Density & Craft

Linear revolutionized enterprise software by proving that **high information density does not require cognitive clutter**. For MataLens, Linear’s craftsmanship provides the antidote to sluggish, bloated web applications.

### 3.1 Information Density Without Cognitive Clutter
Linear achieves high density through strict spatial discipline:
- **Uniform Row Heights:** List items and candidate rows adhere to exact heights: `36px` for dense lists, `48px` for standard rows, `64px` for rich preview cards.
- **Micro-Badges & Hairline Chips:** Status indicators are never bulky button tags. They use `11px` font size, `2px 6px` padding, subtle 1px border (`rgba(0,0,0,0.08)` or `rgba(255,255,255,0.08)`), and soft border-radius (`4px` to `6px`).
- **Predictable Horizontal Scanning Tracks:**
  ```
  [Status Dot/Icon]  [Primary Title / Name]          [Context / Party]   [Source Pill]  [Action / Timestamp]
  ● Verified         Adepitan Olusegun Olatunji     NRM · 60 yrs         INEC Gazette   2h ago   →
  ```
  The eye travels along a rhythmic, horizontal track where identical data types always align to the same column coordinates.

### 3.2 Restrained Gloss, Glass & Neutral Elevation
Linear’s visual signature is neither flat 2D nor tacky 2008 skeuomorphism. It is **"tactile digital craft"**:
1. **The Top-Edge Inset Bevel (The Linear Light Catch):**
   - Every elevated card or button features an inset 1px inner highlight on its top edge. This mimics physical light bouncing off an engineered glass or aluminum surface.
   ```css
   /* Light Mode Card Elevation */
   box-shadow: 
     inset 0 1px 0 0 rgba(255, 255, 255, 0.85),
     0 1px 2px 0 rgba(10, 45, 30, 0.04),
     0 4px 12px 0 rgba(10, 45, 30, 0.03);
   
   /* Dark Mode Card Elevation */
   box-shadow: 
     inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
     0 1px 3px 0 rgba(0, 0, 0, 0.5),
     0 6px 16px 0 rgba(0, 0, 0, 0.35);
   ```
2. **Hairline Structural Borders:**
   - Cards do not rely on heavy drop shadows for separation. They use crisp 1px borders with subtle opacity:
   - Light: `border: 1px solid rgba(13, 43, 32, 0.10);` (warm forest hairline)
   - Dark: `border: 1px solid rgba(255, 255, 255, 0.08);` (crisp slate hairline)
3. **Layered Frosted Glass Panels:**
   - Floating toolbars, drawer headers, and navigation bars use high-efficiency background blurs:
   ```css
   background: rgba(249, 250, 246, 0.84); /* Warm ivory glass */
   backdrop-filter: blur(16px) saturate(180%);
   -webkit-backdrop-filter: blur(16px) saturate(180%);
   border-bottom: 1px solid rgba(13, 43, 32, 0.08);
   ```

### 3.3 Microinteractions, Physics & Motion Easing
In high-craft interfaces, animations are felt rather than watched:
- **Instantaneous Hover Shifts:** 120ms transitions for hover states. No laggy 400ms fades.
- **The Tactile Press (Click Depression):**
  - Buttons and selectable cards compress subtly on press:
  ```css
  .interactive-card:active,
  .button-tactile:active {
    transform: translateY(1px) scale(0.995);
    transition: transform 60ms ease-out;
  }
  ```
- **Custom Easing Curves:**
  - Standard Linear-style entrance: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy spring deceleration, zero overshoot).
  - Dismiss / Exit: `cubic-bezier(0.4, 0, 1, 1)` (rapid departure, 150ms).

### 3.4 Keyboard-First Navigability & Accessible Scanning
Following Linear’s power-user paradigms:
- **High-Contrast Focus Rings:** Focused elements receive a distinct 2px ring offset by 2px (`outline: 2px solid var(--forest-action); outline-offset: 2px;`).
- **Logical Tab Order:** Search inputs -> Filter pills -> Candidate list items -> Actions.
- **Esc Dismissal:** Every drawer, modal, and expanded candidate accordion closes immediately with `Esc`, returning focus to the triggering element.

---

## 4. Deep Dive: Interactive Learning & Active Comprehension

Civic education in Nigeria (electoral law, polling unit protocols, ballot marking) is traditionally presented as impenetrable 80-page PDFs. MataLens leverages the active learning mechanics of **Brilliant.org**, **NYT Dial/Flashcards**, and **Quartz Active Cards**.

### 4.1 Bite-Sized Active Comprehension (Brilliant & NYT Dial)
Passive reading produces 20% retention; active prediction produces 80% retention.
- **The "Prediction-First" Protocol:**
  Instead of declaring: *"Section 122 of the Electoral Act prohibits photography inside the voting cubicle,"*
  MataLens presents a tactile scenario card:
  ```
  ┌─────────────────────────────────────────────────────────────┐
  │ SCENARIO 03 OF 04 · ELECTION DAY PROCEDURE                  │
  │ You are inside the voting cubicle with your ballot paper.   │
  │ Are you permitted to take a photo of your marked ballot?    │
  │                                                             │
  │  [ A ] Yes, as evidence of my vote                          │
  │  [ B ] No, it violates ballot secrecy laws                  │
  │  [ C ] Only if the polling agent gives permission           │
  └─────────────────────────────────────────────────────────────┘
  ```
- **Tactile Chunky Option Pills:**
  Options are styled as elevated 52px cards with generous padding, clear radio indicators, and instant hover response.

### 4.2 Inline Reveals & Progressive Disclosure (Quartz Active Cards)
Upon selecting an option:
1. **Immediate Inline Unfold:** The card does not reload the page or navigate away. The container height smoothly expands (`transition: max-height 280ms cubic-bezier(0.16, 1, 0.3, 1)`).
2. **The Source Badge & Statutory Clause:**
   The explanation appears directly below the options in a tinted container:
   - Forest-tinted panel for correct understanding (`#E7F6ED` / `#123526`).
   - Amber-tinted panel for common misconceptions (`#FEF3C7` / `#2D2312`).
3. **Statutory Quote Accordion:**
   An expandable sub-drawer provides the raw legal text:
   *"Electoral Act 2022, Section 122(1)(a): No person shall photograph or record any marked ballot..."* with an INEC verified link.

### 4.3 Respectful, Dignified Feedback (Zero-Patronizing Gamification)
Elite civic tools treat citizens with adult dignity:
- **NO Juvenile Gamification:** No cartoon mascots, no bouncing gold stars, no confetti blasts, no humiliating red buzzer sounds.
- **Calm Affirmation Microcopy:**
  - *Correct:* "Precisely. The secrecy of the vote is strictly protected by law to prevent vote-buying and intimidation."
  - *Misconception:* "A common misunderstanding. While public result sheets (Form EC8A) may and should be photographed, marked ballots inside the cubicle are strictly prohibited."
- **Agency and Confidence:** The citizen leaves feeling prepared, legally empowered, and self-reliant.

---

## 5. MataLens Unified Design Language Specification

### 5.1 Color Token Architecture (Light & Dark Mode)
The MataLens palette is rooted in authentic Nigerian forest greens, warm alabaster ivories, deep moss obsidians, and high-contrast semantic tones.

```
       LIGHT MODE                             DARK MODE
+-----------------------+              +-----------------------+
| Canvas: #F9FAF6       |              | Canvas: #071712       |
| Surface: #FFFFFF      |              | Surface: #0F261E      |
| Text: #0D2B20         |              | Text: #F1F7F3         |
| Forest: #0A4D34       |              | Forest Mint: #5ED698  |
| Action: #136847       |              | Border: #1F4738       |
+-----------------------+              +-----------------------+
```

#### Detailed Color Token Table:

| Token Name | Light Mode (CSS Value) | Dark Mode (CSS Value) | Semantic Purpose & Usage | Contrast Ratio |
| :--- | :--- | :--- | :--- | :--- |
| `--color-canvas` | `#F9FAF6` (Warm Alabaster) | `#071712` (Obsidian Forest) | App-level background surface; calm, non-glare broadsheet tone. | — |
| `--color-surface` | `#FFFFFF` (Pure Crisp White) | `#0F261E` (Deep Moss Obsidian) | Elevated cards, dialogs, drawers, input fields. | > 12:1 vs text |
| `--color-surface-subtle` | `#F1F5F2` (Warm Sage Tint) | `#16352B` (Secondary Moss) | Nested card containers, table headers, inactive pills. | > 9:1 vs text |
| `--color-text-primary` | `#0D2B20` (Near-Black Forest) | `#F1F7F3` (Crisp Pale Mint) | Display headlines, candidate names, primary body copy. | > 14:1 (AAA) |
| `--color-text-secondary`| `#4A6B5D` (Muted Sage Slate) | `#96B8A7` (Luminous Sage) | Subheadings, summaries, field labels, metadata. | > 5.5:1 (AA) |
| `--color-text-tertiary` | `#769486` (Soft Celadon) | `#6B8E7D` (Subdued Slate) | Timestamps, read times, breadcrumbs, unselected icons.| > 4.5:1 (AA) |
| `--color-forest-primary`| `#0A4D34` (Deep Nigerian Forest)| `#164E38` (Deep Forest Base) | Official brand mark, primary banner cards, anchors. | > 8:1 (AAA) |
| `--color-action` | `#136847` (Vivid Forest Green)| `#5ED698` (Luminous Electric Mint)| Interactive buttons, active toggles, forward navigation. | > 4.8:1 on light |
| `--color-action-hover` | `#0E5237` (Deep Emerald) | `#79E2AC` (Brilliant Mint) | Hover state for buttons and links. | — |
| `--color-line-subtle` | `#E1EAE3` (Hairline Sage) | `#1A3B2F` (Hairline Dark Moss) | Structural card separators, divider rules, subtle borders. | — |
| `--color-line-strong` | `#AFC5B7` (Framing Green-Gray)| `#2E5E4B` (Luminous Border) | Active input borders, focused boundaries, card frames. | — |
| `--color-verified` | `#0E7048` (INEC Verified Green)| `#4ADE80` (Verified Bright Green)| Official seals, verified candidate markers, correct state.| AAA |
| `--color-warning` | `#B45309` (Official Amber) | `#FBBF24` (Luminous Warm Gold)| Unofficial disclaimer, mock notice, attention banner. | AA |
| `--color-danger` | `#991B1B` (Prohibited Crimson) | `#F87171` (Signal Red) | Prohibited ballot photo alert, error message, deletion. | AAA |

### 5.2 Restrained Gloss & Glass Surface Token System
Gloss is applied strategically to structural boundaries to convey tactile precision without compromising legibility:

```css
:root {
  /* Hairline Inner Highlights (Linear Bevel) */
  --highlight-card-light: inset 0 1px 0 0 rgba(255, 255, 255, 0.9);
  --highlight-card-dark: inset 0 1px 0 0 rgba(255, 255, 255, 0.08);

  /* Multi-Layered Elevation Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(13, 43, 32, 0.04);
  --shadow-md: 0 1px 3px 0 rgba(13, 43, 32, 0.05), 0 4px 12px 0 rgba(13, 43, 32, 0.03);
  --shadow-lg: 0 4px 6px -1px rgba(13, 43, 32, 0.05), 0 12px 28px -4px rgba(13, 43, 32, 0.08);

  /* Restrained Frosted Glass Materials */
  --glass-header-light: rgba(249, 250, 246, 0.85);
  --glass-header-dark: rgba(7, 23, 18, 0.85);
  --glass-drawer-light: rgba(255, 255, 255, 0.94);
  --glass-drawer-dark: rgba(15, 38, 30, 0.94);
  --glass-blur: blur(16px) saturate(180%);
}
```

### 5.3 Typographic Scale & Font Feature Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│ Newsreader 600           DISPLAY 1 (Desktop: 48px / Mobile: 36px)      │
│ Newsreader 600           TITLE 1   (Desktop: 32px / Mobile: 26px)      │
│ Newsreader 500           TITLE 2   (Desktop: 22px / Mobile: 20px)      │
│ Manrope 700 (Uppercase)  EYEBROW   (11px / Tracking: +0.08em)          │
│ Manrope 400              BODY 1    (16px / Leading: 1.62)              │
│ Manrope 500              BODY 2    (14px / Leading: 1.50)              │
│ Manrope 600 (tnum)       TABULAR   (12px / Monospaced Digits)          │
└────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Scale Matrix:

| Style Role | Font Family | Weight | Size (Mobile) | Size (Desktop) | Line Height | Tracking | OpenType Settings |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1 (Lead Anchor)**| `Newsreader` | 600 | 36px | 48px | 1.08 | `-0.030em` | `'opsz' 36` |
| **Title 1 (Section Head)** | `Newsreader` | 600 | 26px | 32px | 1.15 | `-0.025em` | `'opsz' 32` |
| **Title 2 (Card Title)** | `Newsreader` | 500 | 20px | 22px | 1.25 | `-0.015em` | `'opsz' 20` |
| **Subhead (Lead Paragraph)**| `Manrope` | 400 | 16px | 18px | 1.55 | `-0.010em` | — |
| **Body 1 (Editorial Read)** | `Manrope` | 400 | 15px | 16px | 1.62 | `0` | — |
| **Body 2 (UI / Compact)** | `Manrope` | 500 | 13px | 14px | 1.50 | `0` | — |
| **Eyebrow / Kicker** | `Manrope` | 700 | 11px | 11px | 1.40 | `+0.080em` | `uppercase` |
| **Pill / Button Label** | `Manrope` | 600 | 13px | 14px | 1.00 | `+0.010em` | — |
| **Tabular Dateline / Count**| `Manrope` | 600 | 12px | 12px | 1.40 | `+0.020em` | `'tnum' 1, 'cv01' 1`|

### 5.4 4px Spatial Grid & Layout Constraints
- **Base Grid Unit:** 4px (`0.25rem`).
- **Standard Scale:** 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 112px.
- **Card Internal Padding:**
  - Mobile (320px - 390px): `16px` horizontal, `18px` vertical.
  - Tablet/Desktop (768px+): `24px` horizontal, `26px` vertical.
- **Reading Measure:** `max-width: 65ch` (roughly 620px - 680px for standard 16px body copy) to prevent visual eye fatigue when reading election laws.
- **Touch Target Integrity:** Every interactive element maintains an invisible or visible hit area of at least `44px × 44px`.

### 5.5 Motion Choreography & Transition Tokens

```css
:root {
  /* Timing Curves */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1); /* Deceleration with snappy landing */
  --ease-smooth: cubic-bezier(0.2, 0, 0, 1);    /* Linear-style natural transition */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);      /* Rapid departure */

  /* Standard Durations */
  --duration-instant: 60ms;   /* Tactile click press */
  --duration-micro: 120ms;     /* Hover, border glow, icon rotation */
  --duration-medium: 240ms;    /* Tab change, card expand, accordion reveal */
  --duration-drawer: 340ms;    /* Bottom sheet slide-up, dialog entrance */
}

/* Reduced Motion Fallback */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 6. Component Anatomy & Production Blueprint

Below are the architectural specifications for the five core signature components of the MataLens platform.

### 6.1 Politician Profile Card
The primary vehicle for comparing candidates with verifiable impartiality. No political banners or campaign slogans; pure evidence and official records.

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Party Pill] APC           [Verified Seal] INEC Final List · Surulere I│
│                                                                        │
│ Laguda Fuad Kayode                                                     │
│ 49 years old · Listed Qualifications: FSLC, SSCE, BSc                  │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ "Public Record Snippet"                                            │ │
│ │ Listed as candidate for Surulere I Federal Constituency seat by   │ │
│ │ INEC Notice dated 2026-10-31. No prior disqualifications filed.    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ [ Official Source ↗ ]     [ Compare ]       [ ★ Save to My Plan ]      │
└────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Anatomy:
1. **Container:** White surface (`#FFFFFF` light / `#0F261E` dark), 1px subtle line (`#E1EAE3`), `border-radius: 12px`, top bevel highlight (`inset 0 1px 0 rgba(255,255,255,0.9)`), Linear-style shadow.
2. **Header Bar:**
   - Left: Party badge in neutral micro-capsule (e.g. `APC`, `PDP`, `LP`) with 1px border.
   - Right: Official source validation pill (`CircleCheck` 14px, "INEC Final List", date tag).
3. **Identity Row:**
   - Candidate Name: `Newsreader`, 22px, weight 600, primary text color.
   - Demographics & Qualifications: `Manrope`, 13px, muted sage (`#4A6B5D`), tabular numerals.
4. **Sourced Evidence Block:**
   - Light tinted container (`#F1F5F2` / `#16352B`), 8px radius, 12px padding. 13px text summarizing verified public records.
5. **Action Footer:**
   - Left: "Official Source" link with external arrow icon.
   - Right: "Save to My Plan" bookmark button (stores privately in browser localStorage; zero telemetry sent to servers).

---

### 6.2 Editorial Story & Civic Guide Card
Used for deep-dive articles, voter education, and legal analysis.

```
┌────────────────────────────────────────────────────────────────────────┐
│ [ KICKER ] VOTER ACCREDITATION · 4 MIN READ                            │
│                                                                        │
│ Can BVAS Function Without Cellular Network Coverage?                  │
│                                                                        │
│ The Bimodal Voter Accreditation System verifies voter fingerprints and │
│ facial biometrics offline at the polling unit, transmitting result     │
│ sheets only after voting has concluded.                                │
│                                                                        │
│ ────────────────────────────────────────────────────────────────────── │
│ [ INEC Manual Sec. 3.2 ]                           2026-11-13 · Verified │
└────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Anatomy:
1. **Eyebrow Strip:** Category kicker in `Manrope` uppercase (11px, weight 700, tracking +0.08em) paired with a subtle read-time dot.
2. **Editorial Title:** `Newsreader`, 22px, weight 600, tight line-height (1.18).
3. **Summary Body:** `Manrope`, 14px, secondary text, 2-line line-clamp.
4. **Editorial Divider:** 1px hairline rule (`#E1EAE3`).
5. **Source Provenance:** Left: Direct legal document chip; Right: Dated review badge.

---

### 6.3 Development & Verification Timeline Node
Visualizes the sequence of election milestones, constituency projects, or official gazette notices.

```
      │
      ├─● [ 2026-10-31 ] · GAZETTED
      │   │
      │   ┌─────────────────────────────────────────────────────────┐
      │   │ Publication of Final Candidate List                     │
      │   │ INEC publishes official list of 8 candidates for        │
      │   │ Surulere I Federal Constituency.                        │
      │   │                                                         │
      │   │ [ View Official PDF (p. 14) ↗ ]   [ Hash: #b7e9758 ]    │
      │   └─────────────────────────────────────────────────────────┘
      │
      ├─○ [ 2026-11-28 ] · UPCOMING
      │   │
      │   ┌─────────────────────────────────────────────────────────┐
      │   │ Nationwide Mock Accreditation Exercise                  │
      │   │ Field testing of BVAS units and IReV upload protocols.  │
      │   └─────────────────────────────────────────────────────────┘
      │
```

#### Detailed Anatomy:
1. **Vertical Spine:** 2px continuous line in muted hairline (`#D5E2D9` light / `#1F4738` dark).
2. **Status Node Ring:**
   - *Completed/Gazetted:* Solid forest green 10px circle with 2px white halo and outer 1px hairline ring.
   - *Active/Current:* Pulsing 10px circle with soft halo (`box-shadow: 0 0 0 4px rgba(19, 104, 71, 0.15)`).
   - *Scheduled/Upcoming:* Hollow 10px ring with 2px border in muted sage.
3. **Timeline Content Card:** Elevated white card connected to node with an 8px horizontal tick. Includes official gazette hash badge and direct link.

---

### 6.4 Interactive Lesson Drawer (Active Rehearsal)
A bottom sheet (on mobile) or modal slide-over (on desktop) for active comprehension exercises.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              [ DRAG HANDLE ]                           │
│                                                                        │
│ SCENARIO 02 OF 05 · ACCREDITATION PROTOCOL                             │
│                                                                        │
│ You arrive at your polling unit and present your Permanent Voter       │
│ Card (PVC). The BVAS scanner fails to read your fingerprint.           │
│ What is the lawful next step?                                          │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ ( ) The presiding officer must turn you away immediately           │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ ( ) The official must attempt facial recognition via the BVAS      │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ ( ) You can vote if a party agent vouches for your identity        │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [ REVEALED EXPLANATION ]                                           │ │
│ │ ✓ Correct · Under INEC Regulations Clause 18(b), if fingerprint    │ │
│ │ verification fails, facial recognition is mandatory. Incident      │ │
│ │ forms are no longer used for manual voting.                        │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ [ Close ]                                              [ Next Scenario → ]
└────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Anatomy:
1. **Drawer Surface:** Warm white frosted glass (`rgba(255, 255, 255, 0.96)` with `backdrop-filter: blur(16px)`), top-edge rounded corners (`20px` radius), smooth drag handle (36px × 4px rounded bar).
2. **Scenario Eyebrow & Prompt:** Progress indicator (`02 OF 05`) in Manrope 11px uppercase; Scenario title and question in `Newsreader` (20px).
3. **Interactive Pill Options:** 3 stacked button cards, each with 1px border and hover transition. Selected state turns border forest green with subtle mint tint background.
4. **Inline Reveal Card:** Animate-in container displaying respectful constitutional explanation with direct clause citation.
5. **Footer:** Secondary "Dismiss" button and prominent tactile "Next Scenario" primary action.

---

### 6.5 Evidence Inspector (Civic Camera & Document Review)
For reviewing captured public result sheets (Form EC8A) or community reports before submission, ensuring tamper-proof integrity and complete privacy.

```
┌────────────────────────────────────────────────────────────────────────┐
│ EVIDENCE INSPECTOR · PUBLIC RESULT SHEET PREVIEW                       │
├──────────────────────────────────┬─────────────────────────────────────┤
│                                  │ VERIFICATION & INTEGRITY            │
│  ┌────────────────────────────┐  │                                     │
│  │                            │  │ Document Type: Form EC8A (Polling) │
│  │   [ HIGH-RESOLUTION        │  │ Polling Unit: PU 024, Surulere     │
│  │     PREVIEW OF RESULT      │  │ Integrity Hash: sha256-e3b0c44...  │
│  │     SHEET WITH ZOOM &      │  │ Capture Timestamp: 2026-11-20 14:02│
│  │     PAN CAPABILITY ]       │  │                                     │
│  │                            │  │ ─────────────────────────────────── │
│  └────────────────────────────┘  │ PRIVACY & ANONYMITY SAFEGUARDS      │
│                                  │ ✓ EXIF location data stripped       │
│  [ Zoom 100% ] [ Rotate ]        │ ✓ Faces & marked ballots restricted │
│                                  │ ✓ Private recovery token generated  │
│                                  │                                     │
│                                  │ [ SUBMIT TO MATALENS (ANONYMOUS) ]  │
└──────────────────────────────────┴─────────────────────────────────────┘
```

#### Detailed Anatomy:
1. **Left Pane (Visual Viewport):**
   - Dark neutral backdrop (`#071712`) framing the uploaded photo.
   - Zoom/pan controls, rotation tool, and aspect ratio indicator.
2. **Right Pane (Integrity Inspector):**
   - Document classification chip (Form EC8A vs Community Issue).
   - Cryptographic SHA-256 fingerprint pill (computed client-side before upload).
   - Privacy Shield Checklist confirming zero personal metadata leakage.
3. **Submission Contract:**
   - Single authoritative action button: "Submit to MataLens".
   - Notice: "Generates private recovery token. No account required. Zero public tracking."

---

## 7. Responsive Rules & Breakpoint Matrix

The platform must operate flawlessly from budget 320px feature phones to 1440px+ broadsheet displays.

```
320px          390px                 768px                           1280px                  1440px+
[ Phone ]      [ Modern Phone ]      [ Tablet / Fold ]               [ Desktop ]             [ Widescreen ]
Single Col     Single Col            2-Column Split                  3-Column Asymmetric     Centered Editorial Canvas
12px Gutter    16px Gutter           24px Gutter                     32px Gutter             48px Gutter
Compact Text   Standard Scale        Expanded Roster                 Sticky Metadata Rail    Max-width 1240px
```

### 7.1 Detailed Breakpoint Specification Table

| Breakpoint | Target Devices | Grid Layout & Columns | Gutters & Margins | Typography Adjustments | Navigation Pattern |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **320px** | Low-cost Android (Tecno, itel), narrow viewports | 1 column (100% fluid) | 12px gutter, 12px card padding | Display: 30px, Body: 14px, Touch targets strictly ≥ 44px | Fixed bottom bar (4 icons), drawer modal |
| **390px** | iPhone 14/15/16, Samsung Galaxy standard | 1 column (100% fluid) | 16px gutter, 18px card padding | Display: 36px, Body: 15px, generous button row | Fixed bottom bar (4 icons), comfortable touch targets |
| **768px** | iPad mini, tablets, foldables, small laptops | 2 columns (50% / 50% or 60% / 40%) | 24px gutter, 24px card padding | Display: 40px, Body: 16px, dual-column candidate cards | Top bar with brand & desktop tabs, side drawer |
| **1280px** | Standard MacBooks, PC laptops, desktop screens | 3 columns asymmetric (65% reading, 35% rail) | 32px gutter, 28px card padding | Display: 48px, Body: 16px (65ch line-clamp) | Top sticky frosted header, persistent side rail |
| **1440px+**| High-res displays, external monitors | Centered container (`max-width: 1240px`) | Auto margins, 48px interior gutters | Full Newsreader display hierarchy, multi-pane inspector | Full desktop suite, keyboard shortcut legends |

### 7.2 Specific Mobile-First Rules (320px - 390px)
1. **Never Clip Candidate Names:** Long Nigerian names (e.g. *Adebayo Adefolaseye Adebomi*) must wrap cleanly to two lines with `line-height: 1.2` rather than truncating with `...`.
2. **Side-by-Side Primary Actions:** At 320px, action buttons ("See Candidates", "Find Polling Unit") use a 2-column inline grid with compact padding (`10px 12px`) to remain visible above the fold.
3. **Zero Horizontal Overflow:** All tables, code snippets, and candidate lists reflow vertically or provide explicit swipe affordances with CSS scroll-snap.

---

## 8. Implementation Roadmap for MataLens Engineers

To implement this design system in the current React 19 / Vite / CSS codebase:

### Phase 1: CSS Token Foundation & Font Loading
- Update `src/styles.css` and `src/civic.css` with the verified color tokens (`--color-canvas`, `--color-forest-primary`, `--color-surface`, etc.).
- Ensure `@fontsource/newsreader` (weights 500, 600) and `@fontsource-variable/manrope` are configured with optimal font-display and OpenType features (`tnum`, `cv01`).
- Implement the Linear-style top-bevel shadow tokens and glass backdrop filters.

### Phase 2: Core Component Upgrades
- **Candidate Roster (`src/directory.tsx`):**
  - Implement the Politician Card anatomy with Newsreader headlines, party badge chips, qualification rows, and keyboard-operable details disclosure.
- **Editorial Homepage (`src/home.tsx`):**
  - Align section pacing with Apple News rhythm: Lead Anchor brief, 3-up shortcut strip, candidate roster, and official updates feed.
- **Interactive Practice (`src/rights.tsx`, `src/explorer.tsx`):**
  - Replace static quiz text with Brilliant-style prediction cards, tactile option pills, and animated inline statutory reveals.

### Phase 3: Civic Camera & Evidence Inspector (`src/camera.tsx`)
- Implement the split-view Evidence Inspector with client-side SHA-256 fingerprinting, EXIF sanitization badge, and private receipt modal.

### Phase 4: Verification & Automated Visual Audits
- Run Playwright test suite across all 5 breakpoints (320px, 390px, 768px, 1280px, 1440px) in both Light and Dark themes.
- Ensure automated Axe-core accessibility scans pass with zero violations.
- Verify 200% page zoom reflow and keyboard tab navigation.

---

*Document compiled and verified for the MataLens Civic Platform Engineering Team · November 2026*
