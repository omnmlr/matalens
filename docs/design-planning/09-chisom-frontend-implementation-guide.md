# MataLens Frontend Implementation Playbook for Chisom

> **Target:** Chisom (Lead Frontend Engineer & UI/UX Owner)  
> **Backend Partner:** Codex Sol (News Intelligence & Pipeline)  
> **Source Research & Design Direction:** Antigravity Research & Creative Direction  
> **Branch:** `agent/research-design`  
> **Date:** November 2026  
> **Status:** Actionable Frontend Quick-Start Guide  

---

## 1. Quick-Start Summary for Chisom

Welcome Chisom! This document gives you an actionable blueprint to start building the MataLens frontend immediately.

### The Product Mission:
MataLens is **not** an election directory. We are pivoting to:
$$\text{Personal, Nonpartisan Political-Learning Companion for Nigerians}$$

### The Primary User Journey:
**Follow a politician → Discover a relevant development → Understand what happened (15s Key Facts) → Examine manifesto context and evidence → Learn through a short interactive experience → Return for updates.**

### Core Frontend Principles:
1. **100% Guest-First (Zero Mandatory Sign-in):** No login screens, no OTPs, no passwords. All candidate following, private notes, and saved exercises live in `localStorage`.
2. **"The Guardian / FT meets Linear":** Broadsheet authority (`Newsreader` serif) paired with crisp digital craft (`Manrope` sans, 1px top hairline bevel highlights).
3. **Strict 4-Tab Navigation:** `Home` ("The Lens Today"), `Politicians`, `Learn`, `Camera & Actions`. Deep dives open in **contextual drawers/sheets**, not page hops.

---

## 2. Immediate Setup: Fonts & Theme Tokens

### 2.1 Google Fonts to Import (`index.html` or CSS)
Import `Newsreader` (optical sizing 6pt-72pt, weights 400, 600, 700) and `Manrope` (weights 400, 500, 600, 700):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&display=swap" rel="stylesheet">
```

### 2.2 Tailwind CSS Configuration (`tailwind.config.js`)
Add the font families and core color tokens to your Tailwind config:
```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Garamond', 'Georgia', 'serif'],
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand: {
          forest: '#0A4D34',    // Primary Deep Forest Green
          vivid: '#136847',     // Hover / Action Green
          mint: '#5ED698',      // Electric Mint (Dark Mode accent)
          tint: '#E8F2EC',      // Soft badge tint
          obsidian: '#071712',  // Dark Mode base
        },
        broadsheet: {
          ivory: '#F9FAF6',     // Light Mode canvas base
          subtle: '#F0F4F1',    // Tinted container base
          card: '#FFFFFF',      // Surface elevated
        },
        perspective: {
          incumbent: '#0A4D34', // State / Administration
          opposition: '#C25E00',// Challenger / Opposition
          watchdog: '#0284C7',  // Investigative / Civil Society
          record: '#1E3A8A',    // Primary Public Record
        },
      },
      boxShadow: {
        'tactile-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 1px 3px rgba(10, 77, 52, 0.04)',
        'tactile-dark': 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 6px rgba(0, 0, 0, 0.3)',
      },
    },
  },
};
```

---

## 3. The 5 Core Components Chisom Should Build First

### Component 1: `FollowedLeadersBar.tsx` (Homepage Apex)
- **Props:** `followedIds: string[]`, `onSelectLeader: (id: string) => void`, `onAddLeader: () => void`
- **Behavior:**
  - Reads followed candidate IDs from `localStorage` (`matalens_followed_politicians:v1`).
  - If array has items: renders a sleek horizontal scroll tray with circular candidate avatars (48px), name, office, and small status dot (`🟢 1 new bill`, `🟡 1 speech`).
  - If array is empty: renders a welcoming prompt: *"Follow 1 to 3 Nigerian leaders to receive sourced updates on their actions."* with a quick `[+ Select Leaders]` button.

### Component 2: `LeadDevelopmentAnchor.tsx` (Hero of "The Lens Today")
- **Visual Composition (Apple News + Linear):**
  - **Kicker:** Small uppercase sans label in vivid green (`CONSTITUTIONAL REFORM · 3H AGO`).
  - **Command Headline:** Large serif (`font-serif font-semibold text-2xl md:text-4xl text-slate-900 leading-tight`).
  - **15-Second Key Facts Box:** A light green container (`bg-[#F4F7F4] border border-[#0A4D34]/20 rounded-lg p-4`) containing 3 bullet points that summarize the event in 15 seconds.
  - **Perspective Distribution Bar:** A multi-segmented horizontal bar (`h-2.5 rounded-full overflow-hidden flex`) showing percentages for Incumbent (Forest), Opposition (Amber), Watchdog (Sky), Record (Navy).
  - **Call to Action:** `[Examine Manifesto Context & Timeline →]` button launching the development detail.

### Component 3: `PerspectiveBar.tsx` (Reusable Ground News Indicator)
```tsx
interface PerspectiveProps {
  incumbentPercent: number;
  oppositionPercent: number;
  watchdogPercent: number;
  publicRecordPercent: number;
  totalOutlets: number;
  onInspect?: () => void;
}

export function PerspectiveBar({ incumbentPercent, oppositionPercent, watchdogPercent, publicRecordPercent, onInspect }: PerspectiveProps) {
  return (
    <div className="space-y-1.5 cursor-pointer" onClick={onInspect} role="button" aria-label="Perspective breakdown">
      <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-200">
        <div style={{ width: `${incumbentPercent}%` }} className="bg-[#0A4D34]" title="Incumbent / State Media" />
        <div style={{ width: `${oppositionPercent}%` }} className="bg-[#C25E00]" title="Opposition Media" />
        <div style={{ width: `${watchdogPercent}%` }} className="bg-[#0284C7]" title="Watchdog / Civil Society" />
        <div style={{ width: `${publicRecordPercent}%` }} className="bg-[#1E3A8A]" title="Primary Public Record" />
      </div>
      <div className="flex justify-between text-xs text-gray-500 font-sans tabular-nums">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0A4D34]" /> State {incumbentPercent}%</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C25E00]" /> Opp {oppositionPercent}%</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0284C7]" /> Watchdog {watchdogPercent}%</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1E3A8A]" /> Record {publicRecordPercent}%</span>
      </div>
    </div>
  );
}
```

### Component 4: `DevelopmentTimelineSpine.tsx` (Historical Anchoring)
- **Props:** `nodes: Array<{ id: string; date: string; title: string; summary: string; type: string; isCurrent: boolean }>`
- **Visuals:** Vertical 2px line (`border-l-2 border-[#0A4D34]/30 pl-4 space-y-4`) with circular nodes.
- **Node States:** Completed past event (`bg-[#0A4D34]`), Current event (`bg-[#136847] ring-4 ring-[#136847]/20`), Pending statutory step (`bg-white border-2 border-gray-400`).

### Component 5: `CivicRehearsalCard.tsx` (60-Second Active Learning)
- **Props:** `scenario: string`, `question: string`, `options: string[]`, `correctIndex: number`, `truthAnchorText: string`, `keyTakeaway: string`
- **Behavior:**
  - Displays scenario and 3 clickable options.
  - When user taps an option: smooth flip or slide reveals the correct answer, citations from the 1999 Constitution or Electoral Act 2022, and a 2-sentence actionable takeaway.
  - Saves completed rehearsal ID to `localStorage` (`matalens_learning_rehearsals:v1`).

---

## 4. Local-First Client State Store Hook (`useCivicStore.ts`)

Chisom can implement this simple, zero-dependency custom hook using `useSyncExternalStore` for seamless reactive local state across components:

```typescript
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'matalens_followed_politicians:v1';

export function useFollowedPoliticians() {
  const [followed, setFollowed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFollow = (slug: string) => {
    setFollowed((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return next;
    });
  };

  return { followed, toggleFollow, isFollowing: (slug: string) => followed.includes(slug) };
}
```

---

## 5. Navigation Structure (Bottom Tab Bar on Mobile)

```tsx
// 4-Tab Bottom Navigation Bar for Mobile (Sticky at bottom, safe-area padded)
export function MobileTabBar({ currentTab, onChangeTab }: { currentTab: string; onChangeTab: (t: string) => void }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'politicians', label: 'Leaders', icon: '👤' },
    { id: 'learn', label: 'Learn', icon: '📖' },
    { id: 'camera', label: 'Camera', icon: '📷' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#F9FAF6]/90 backdrop-blur-md border-t border-black/5 md:hidden pb-safe">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full text-xs font-sans transition-colors ${
              currentTab === tab.id ? 'text-[#0A4D34] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
```

---

## 6. Integration Contract with Codex Sol's News Pipeline

Codex Sol will provide developments matching the `PoliticalDevelopment` interface in `docs/design-planning/08-news-service-contract.md`. 

While Codex Sol is wiring the backend, Chisom can use the mock development payload provided in `docs/design-planning/08-news-service-contract.md` (Section 3.1) to build and verify all UI components instantly.
