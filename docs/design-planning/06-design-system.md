# MataLens Unified Design System Specification

> **Target Platform:** MataLens (Personal, Nonpartisan Political-Learning Companion for Nigerians)  
> **Repository:** `omnmlr/matalens` | **Branch:** `agent/research-design`  
> **Date:** November 2026  
> **Document:** Design Planning Deliverable 06  
> **Status:** Approved Design System & Token Specification  

---

## 1. Design Tokens: Color Architecture

MataLens utilizes a high-status, dignified color palette rooted in Nigerian broadsheet authority and modern digital craft. It eliminates garish neon AI gradients in favor of **authoritative forest-greens, warm ivory broadsheet neutrals, and obsidian dark surfaces**.

### 1.1 Core Brand & Canvas Tokens

```css
:root {
  /* ==========================================================================
     LIGHT MODE TOKENS (Broadsheet Ivory & Deep Forest)
     ========================================================================== */
  --canvas-base: #F9FAF6;              /* Warm Alabaster Broadsheet base */
  --canvas-subtle: #F0F4F1;            /* Soft tinted container base */
  --surface-elevated: #FFFFFF;         /* Card & sheet background */
  --surface-raised: #FFFFFF;           /* Floating modal / drawer background */
  --surface-glass: rgba(249, 250, 246, 0.85); /* Frosted header glass */
  
  --brand-forest-deep: #0A4D34;        /* Primary Nigerian Forest Green */
  --brand-forest-vivid: #136847;       /* Action / Hover state */
  --brand-forest-tint: #E8F2EC;        /* Subtle badge / selection background */
  
  --text-primary: #0C1E17;            /* High-contrast broadsheet black */
  --text-secondary: #485A52;          /* Readable neutral secondary */
  --text-tertiary: #71847B;           /* Timestamps, kickers, small captions */
  --text-on-dark: #F9FAF6;            /* Text on forest green / obsidian cards */
  
  --border-subtle: rgba(10, 77, 52, 0.08); /* 1px hairline card borders */
  --border-strong: rgba(10, 77, 52, 0.20); /* Input strokes & active states */
  --divider: #E4ECE7;                 /* Horizontal dividing rules */

  /* ==========================================================================
     THE 4-PILLAR PERSPECTIVE TOKENS
     ========================================================================== */
  --perspective-incumbent: #0A4D34;    /* Deep Forest Green: State / Admin */
  --perspective-incumbent-bg: #E6F0EB;
  --perspective-opposition: #C25E00;   /* Ochre / Burnt Amber: Challenger */
  --perspective-opposition-bg: #FEF3EB;
  --perspective-watchdog: #0284C7;     /* Sky / Cobalt: Independent Watchdog */
  --perspective-watchdog-bg: #E0F2FE;
  --perspective-record: #1E3A8A;       /* Midnight Navy: Primary Public Record */
  --perspective-record-bg: #EFF6FF;

  /* ==========================================================================
     4-STATE PROMISE & CREDIBILITY TOKENS
     ========================================================================== */
  --status-delivered: #15803D;         /* Verified Delivered */
  --status-delivered-bg: #DCFCE7;
  --status-inprogress: #D97706;        /* In Progress / Active */
  --status-inprogress-bg: #FEF3C7;
  --status-notstarted: #64748B;        /* Not Started / Pending */
  --status-notstarted-bg: #F1F5F9;
  --status-broken: #B91C1C;            /* Broken / Contradicted */
  --status-broken-bg: #FEE2E2;
}

[data-theme="dark"] {
  /* ==========================================================================
     DARK MODE TOKENS (Obsidian Night & Electric Mint)
     ========================================================================== */
  --canvas-base: #071712;              /* Deep Obsidian Forest */
  --canvas-subtle: #0B2019;            /* Slightly elevated background */
  --surface-elevated: #0F2A21;         /* Elevated card base */
  --surface-raised: #14352A;           /* Drawer / Modal base */
  --surface-glass: rgba(7, 23, 18, 0.88); /* Frosted header glass */
  
  --brand-forest-deep: #5ED698;        /* Electric Mint (High visibility on dark) */
  --brand-forest-vivid: #85E8B2;       /* Action / Hover state */
  --brand-forest-tint: rgba(94, 214, 152, 0.12);
  
  --text-primary: #F4F7F5;            /* Off-white readable text */
  --text-secondary: #9EB5AA;          /* Muted forest secondary */
  --text-tertiary: #6E857A;           /* Captions & metadata */
  --text-on-dark: #FFFFFF;
  
  --border-subtle: rgba(255, 255, 255, 0.08); /* 1px hairline border */
  --border-strong: rgba(255, 255, 255, 0.18);
  --divider: #18382C;
}
```

---

## 2. Surface Craft & Restrained Gloss Token System

Borrowing Linear’s signature tactile precision, MataLens cards avoid muddy drop-shadows. Instead, they use a **crisp 1px inner top highlight** paired with an ultra-subtle border stroke.

```css
/* Tactile Top-Edge Highlight Tokens */
.surface-tactile-card {
  background: var(--surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  /* 1px top hairline bevel simulation */
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.85),
    0 1px 3px rgba(10, 77, 52, 0.04);
  transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 180ms ease;
}

[data-theme="dark"] .surface-tactile-card {
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 2px 6px rgba(0, 0, 0, 0.3);
}

.surface-tactile-card:hover {
  transform: translateY(-1px);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 4px 12px rgba(10, 77, 52, 0.08);
}
```

---

## 3. Typographic Duality & Hierarchy

MataLens pairs the journalistic authority of an optical serif (`Newsreader`) with the functional clarity of a humanist geometric sans (`Manrope`).

```css
/* Typography Scale & Weights */
--font-serif: 'Newsreader', Garamond, Georgia, serif;
--font-sans: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Typographic Roles */
.type-command-headline {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 3.5vw, 2.75rem); /* 32px to 44px */
  line-height: 1.15;
  font-weight: 600;
  letter-spacing: -0.025em;
  font-optical-sizing: auto;
}

.type-story-title {
  font-family: var(--font-serif);
  font-size: clamp(1.375rem, 2.2vw, 1.75rem); /* 22px to 28px */
  line-height: 1.25;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.type-body-editorial {
  font-family: var(--font-serif);
  font-size: 1.125rem; /* 18px */
  line-height: 1.65;
  font-weight: 400;
  color: var(--text-primary);
}

.type-ui-kicker {
  font-family: var(--font-sans);
  font-size: 0.75rem; /* 12px */
  line-height: 1;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--brand-forest-deep);
}

.type-ui-label {
  font-family: var(--font-sans);
  font-size: 0.875rem; /* 14px */
  line-height: 1.4;
  font-weight: 500;
}

.type-tabular-nums {
  font-family: var(--font-sans);
  font-variant-numeric: tabular-nums;
}
```

---

## 4. 4px Spatial Grid & Layout Constraints

All dimensions, margins, paddings, and component heights adhere to a strict **4px baseline grid**:

- **Touch Target Minimum:** Strictly $\ge 44 \times 44\text{px}$ across all mobile viewports.
- **Reading Measure:** Editorial article text columns are constrained to a maximum width of `680px` (`max-w-2xl` / 65 to 72 characters per line) to maintain comfortable reading speed and focus.
- **Card Spacing Hierarchy:**
  - Compact Cards: `12px` padding (`p-3`)
  - Standard Cards: `16px` padding (`p-4`)
  - Elevated Feature Cards: `24px` padding (`p-6`)
  - Desktop Hero Containers: `32px` to `48px` padding (`p-8` to `p-12`)

---

## 5. Motion Choreography & Transitions

MataLens employs micro-damped physical springs for user interface transitions, eliminating jerky linear motions and juvenile bouncy animations.

```css
/* Damped Spring Tokens */
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
--duration-fast: 140ms;
--duration-standard: 220ms;
--duration-drawer: 320ms;

/* Drawer Slide-in Animation */
@keyframes slideUpIn {
  from {
    transform: translateY(100%);
    opacity: 0.8;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.drawer-enter {
  animation: slideUpIn var(--duration-drawer) var(--ease-spring) forwards;
}

/* Reduced Motion Override for Accessibility */
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

## 6. Component Anatomy & Production Blueprints

### 6.1 The 4-Pillar Perspective Distribution Meter
```html
<div class="perspective-meter" role="region" aria-label="Perspective distribution across 20 media outlets">
  <div class="meter-bar">
    <span class="segment incumbent" style="width: 45%" title="Incumbent / State Media (9 outlets: 45%)"></span>
    <span class="segment opposition" style="width: 30%" title="Opposition Media (6 outlets: 30%)"></span>
    <span class="segment watchdog" style="width: 20%" title="Independent Watchdog (4 outlets: 20%)"></span>
    <span class="segment record" style="width: 5%" title="Primary Public Record (1 gazette: 5%)"></span>
  </div>
  <div class="meter-legend">
    <span class="item"><i class="dot incumbent"></i> State 45%</span>
    <span class="item"><i class="dot opposition"></i> Opposition 30%</span>
    <span class="item"><i class="dot watchdog"></i> Watchdog 20%</span>
    <span class="item"><i class="dot record"></i> Gazette 5%</span>
  </div>
</div>
```

### 6.2 The Timeline Node (Connecting News to Pledges)
```html
<div class="timeline-node" data-status="verified">
  <div class="node-indicator">
    <div class="node-dot"></div>
    <div class="node-spine"></div>
  </div>
  <div class="node-content">
    <time class="node-timestamp">Jul 2024 · Supreme Court Ruling</time>
    <h4 class="node-headline">State-Joint Accounts Declared Unconstitutional</h4>
    <p class="node-summary">Judgment SC/CV/343/2024 barred governors from withholding local government allocations.</p>
    <a href="/documents/sc-cv-343-2024" class="node-source-link">View Certified Judgment (PDF) ↗</a>
  </div>
</div>
```

---

## 7. Responsive Breakpoint Matrix

| Breakpoint Name | Viewport Width | Layout Mode | Navigation Pattern | Max Container Width |
| :--- | :---: | :--- | :--- | :---: |
| **Mobile Narrow** | `320px - 374px` | 1-Column Compact | Fixed 4-Tab Bottom Bar | `100%` (8px gutters) |
| **Mobile Standard** | `375px - 479px` | 1-Column Fluid | Fixed 4-Tab Bottom Bar | `100%` (16px gutters) |
| **Tablet Portrait** | `480px - 767px` | 1-Column Large | Sticky Top + Bottom Bar | `100%` (24px gutters) |
| **Tablet Landscape**| `768px - 1023px`| 2-Column Asym (60/40) | Top Navigation Bar | `720px` / `960px` |
| **Desktop Standard**| `1024px - 1279px`| 2-Column Editorial (64/36)| Top Nav with Search | `1120px` (32px gutters) |
| **Desktop Wide** | `1280px - 1440px+`| 2-Column + Sidebar | Top Nav + Cmd+K Modal | `1280px` / `1400px` |
