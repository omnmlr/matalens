# MataLens Product Blueprint & Master Specification

> **Target Platform:** MataLens (Personal, Nonpartisan Political-Learning Companion for Nigerians)  
> **Repository:** `omnmlr/matalens` | **Branch:** `agent/research-design`  
> **Date:** November 2026  
> **Authors:** Antigravity Autonomous Lead Product Research & Creative Direction  
> **Status:** Final Master Executive Blueprint  

---

## 1. Executive Summary: The Nonpartisan Civic Companion

MataLens has completed its foundational research, reverse engineering, and creative direction pass. 

We have decisively pivoted the platform away from an overcrowded, 4-year election dashboard into a **daily, personal, nonpartisan political-learning companion for Nigerians**:

$$\textbf{The Core Journey:}\quad \text{Follow Politician} \longrightarrow \text{Discover Development} \longrightarrow \text{Understand 15s Facts} \longrightarrow \text{Examine Manifesto \& Evidence} \longrightarrow \text{Interactive Rehearsal} \longrightarrow \text{Return for Updates}$$

This master blueprint ties together the complete 10-document planning suite, providing **Chisom** (Frontend & UI/UX Owner) and **Codex Sol** (Backend & News Pipeline Owner) with an immediate, unambiguous specification to execute.

---

## 2. The Complete Documentation Suite Index

| Doc # | Title | Core Content & Architectural Deliverable | File Link |
| :---: | :--- | :--- | :--- |
| **01** | **Reference Comparison & Evidence Ledger** | Deep reverse-engineering audit of VotersDesk, Gaski, Elect.ng, Ground News, Apple News, Linear, Brilliant with code & schema evidence. | [01-reference-comparison.md](file:///c:/Users/USER/Desktop/matalens/docs/design-planning/01-reference-comparison.md) |
| **02** | **Decisions: Adopt, Adapt & Reject** | Boundary decisions across 8 functional domains explaining what we took, modified, or rejected. | [02-decisions-adopt-adapt-reject.md](file:///c:/Users/USER/Desktop/matalens/docs/design-planning/02-decisions-adopt-adapt-reject.md) |
| **03** | **Product Concept & Living Editorial Homepage** | "The Lens Today" broadsheet architecture, Morning Briefing tray, Lead Anchor, and supporting capability tray. | [03-product-concept-homepage.md](file:///c:/Users/USER/Desktop/matalens/docs/design-planning/03-product-concept-homepage.md) |
| **04** | **Minimal Information Architecture** | 4-tab primary navigation (`Home`, `Politicians`, `Learn`, `Camera`), URL deep-linking hierarchy, and contextual drawer model. | [04-information-architecture.md](file:///c:/Users/USER/Desktop/matalens/docs/design-planning/04-information-architecture.md) |
| **05** | **Screen-by-Screen Visual Concepts** | Desktop (1280px) and Mobile (390px) structured ASCII wireframes for all 5 core views. | [05-screen-concepts.md](file:///c:/Users/USER/Desktop/matalens/docs/design-planning/05-screen-concepts.md) |
| **06** | **Unified Design System** | Color tokens (Forest Green, Broadsheet Ivory, Obsidian), typography (`Newsreader` + `Manrope`), 1px tactile bevels, 4px grid. | [06-design-system.md](file:///c:/Users/USER/Desktop/matalens/docs/design-planning/06-design-system.md) |
| **07** | **Detailed Interaction Specifications** | State machines for Political Development Timeline, 15s Key Facts, inline truth anchors, and 60s civic rehearsals. | [07-interaction-specs.md](file:///c:/Users/USER/Desktop/matalens/docs/design-planning/07-interaction-specs.md) |
| **08** | **News Service Contract (Codex Sol)** | REST API endpoints, TypeScript interfaces, 4-pillar perspective classification, and error fallbacks. | [08-news-service-contract.md](file:///c:/Users/USER/Desktop/matalens/docs/design-planning/08-news-service-contract.md) |
| **09** | **Frontend Implementation Playbook (Chisom)** | Step-by-step developer guide with Tailwind config, font imports, component specs, and `useFollowedPoliticians` hook. | [09-chisom-frontend-implementation-guide.md](file:///c:/Users/USER/Desktop/matalens/docs/design-planning/09-chisom-frontend-implementation-guide.md) |
| **10** | **Legal, Privacy & Accessibility Review** | Fair dealing under Nigerian Copyright Act 2022, NDPA 2023 zero-tracking compliance, WCAG 2.1 AA checklist, Data Saver. | [10-legal-privacy-accessibility.md](file:///c:/Users/USER/Desktop/matalens/docs/design-planning/10-legal-privacy-accessibility.md) |

---

## 3. Core Architectural Highlights for Quick Reference

### 3.1 The Visual Identity: "The Broadsheet Meets Linear"
- **Primary Brand Color:** Deep Nigerian Forest Green (`#0A4D34`) on Warm Alabaster Ivory (`#F9FAF6`).
- **Dark Mode:** Deep Obsidian (`#071712`) accented by Electric Mint (`#5ED698`).
- **Typography:** `Newsreader` (optical serif for headlines, titles, constitutional clauses) + `Manrope` (humanist geometric sans for UI controls, badges, and tabular numbers).
- **Tactile Surface:** 1px hairline top bevel highlight (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85)` in light mode, `0.08` in dark mode).

### 3.2 The Nigerian 4-Pillar Perspective Distribution Framework
Replacing Western Left vs. Right with an authentic Nigerian democratic model:
1. **Incumbent / Administration (`#0A4D34`):** State media (NTA, VON) and administration rationales.
2. **Opposition / Challenger (`#C25E00`):** Opposition party critiques and alternative legislative positions.
3. **Watchdog / Civil Society (`#0284C7`):** Independent investigative press (Premium Times, TheCable, CDD, YIAGA, Dubawa).
4. **Primary Public Record / Truth Anchor (`#1E3A8A`):** Verbatim gazettes, court judgments, Auditor-General reports.

### 3.3 Zero Mandatory Login Guarantee
- **100% Guest-First:** Every article, candidate dossier, manifesto comparison, interactive lesson, and photo submission works immediately without an account, phone number, email, password, or OTP.
- **Client-Side Storage:** Following, preparation notes, and private receipts live strictly in browser `localStorage`.
- **Civic Camera Privacy:** Submissions return an unguessable private receipt token (`ML-XXXX-XXXX`). Only its SHA-256 hash is stored server-side. Private EXIF GPS metadata is stripped client-side.

---

## 4. Division of Responsibilities & Immediate Next Steps

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 TEAM EXECUTION MATRIX                                           │
├───────────────────────────────┬───────────────────────────────┬─────────────────────────────────┤
│ CHISOM                        │ CODEX SOL                     │ RESEARCH & CREATIVE DIRECTION   │
│ (Lead Frontend & UI/UX Owner) │ (Lead Backend & News Pipeline)│ (Antigravity)                   │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────┤
│ • Build "The Lens Today" home │ • Build multi-source RSS      │ • Maintain design system and    │
│ • Build 4-tab mobile nav      │   ingestion for 22 newsrooms  │   editorial standards           │
│ • Implement `PerspectiveBar`  │ • Implement NLP story cluster │ • Deepen candidate dossier      │
│ • Implement `TimelineSpine`   │ • Deliver REST endpoints      │   research & off-cycle data     │
│ • Implement `CivicRehearsal`  │   per Doc 08 contract         │ • Audit compliance with NDPA    │
│ • Follow Doc 09 Playbook      │ • Provide local seed JSON     │   and WCAG 2.1 AA standards     │
└───────────────────────────────┴───────────────────────────────┴─────────────────────────────────┘
```
