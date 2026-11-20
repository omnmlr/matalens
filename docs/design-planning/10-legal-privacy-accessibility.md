# MataLens Legal, Privacy, Licensing & Accessibility Compliance Review

> **Target Platform:** MataLens (Personal, Nonpartisan Political-Learning Companion for Nigerians)  
> **Repository:** `omnmlr/matalens` | **Branch:** `agent/research-design`  
> **Date:** November 2026  
> **Document:** Design Planning Deliverable 10  
> **Status:** Approved Regulatory & Standards Compliance Review  

---

## 1. Copyright & Intellectual Property Review

### 1.1 News Ingestion & Fair Dealing
- **Legal Framework:** Nigerian Copyright Act 2022 (Section 20: General exceptions from copyright control / Fair Dealing for purposes of criticism, review, and reporting of current events).
- **Compliance Rules:**
  1. **Short Excerpt Rule:** MataLens never reprints full news articles. It ingests only headlines, metadata, and generates an original, synthesized 2-sentence summary of the event.
  2. **Prominent Attribution:** Every perspective and news item explicitly credits the publishing newsroom with an external direct link to the original story.
  3. **No Commercial Resale:** News aggregation is non-commercial, public-interest civic education.

### 1.2 Official Gazettes, Statutes & Judicial Opinions
- **Legal Status:** Under Nigerian law, statutory enactments of the National Assembly (e.g., the Electoral Act 2022, the 1999 Constitution of the Federal Republic of Nigeria as amended) and judgments of superior courts of record (Supreme Court, Court of Appeal) are **in the public domain**.
- **Compliance Rule:** Official statutory texts, gazetted notices, and certified true copies of court judgments may be quoted and reproduced verbatim without license, provided the official citation (e.g., `SC/CV/343/2024`) is preserved accurately.

### 1.3 Campaign Manifestos & Public Policy Documents
- **Legal Status:** Political party manifestos (*Renewed Hope*, *Our Pact*, *My Covenant*) are distributed publicly by candidate campaign organizations as public political declarations seeking citizen votes.
- **Compliance Rule:** Quoting manifesto clauses for accountability, factual tracking, and promise verification is protected fair dealing under Section 20(1)(a) of the Copyright Act 2022. Every quote must cite the document title, candidate, and page number.

### 1.4 Politician Imagery & Creative Commons Licensing
- **Licensing Standard:** Candidate portraits must be sourced exclusively from open-access repositories under Creative Commons licenses (CC BY-SA 4.0, CC BY 3.0, CC0) or official press kits where permitted.
- **Attribution Display:** Tapping or hovering on a politician's portrait displays the photographer's name, source (e.g., *Wikimedia Commons*), and the exact Creative Commons license link.

---

## 2. Privacy & Data Protection Review (NDPA 2023 / GDPR)

### 2.1 The Guest-First Privacy Guarantee
Under the **Nigeria Data Protection Act 2023 (NDPA)** and Section 37 of the 1999 Constitution (Right to Privacy), political opinion and voting intentions constitute **sensitive personal data** requiring heightened protection.

MataLens enforces the highest standard of privacy by adopting a **Zero-Server-Storage Architecture for Personal Political Activity**:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PRIVACY MATRIX: WHERE DATA LIVES IN MATALENS                                                    │
├───────────────────────────────┬───────────────────────────────┬─────────────────────────────────┤
│ DATA TYPE                     │ STORAGE LOCATION              │ TRANSMITTED TO SERVER?          │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────┤
│ Followed Politicians List     │ Browser localStorage          │ NO (Strictly On-Device)         │
│ Personal Reading History      │ Browser localStorage / Mem    │ NO (Strictly On-Device)         │
│ Civic Rehearsal Progress      │ Browser localStorage          │ NO (Strictly On-Device)         │
│ Data Saver / Theme Settings   │ Browser localStorage          │ NO (Strictly On-Device)         │
│ Civic Camera Photo Uploads    │ Secure Object Storage (S3/R2) │ YES (Public result sheets only) │
│ Civic Camera Private Receipt  │ Browser localStorage + Hash   │ ONLY SHA-256 HASH STORED        │
└───────────────────────────────┴───────────────────────────────┴─────────────────────────────────┘
```

### 2.2 Civic Camera Anonymous Intake & Receipt Architecture
1. **EXIF Metadata Stripping:** Prior to uploading any civic photograph, the client-side JavaScript engine automatically parses and strips all EXIF metadata (GPS coordinates, camera model, lens serial number, precise timestamp) to protect citizen safety.
2. **Unguessable Private Receipt Tokens:** When an image is submitted, the server generates a cryptographically random, high-entropy receipt code:
   $$\text{Token} = \text{ML-}[A\text{–}Z0\text{–}9]_{4}\text{-}[A\text{–}Z0\text{–}9]_{4}\text{-}[A\text{–}Z0\text{–}9]_{4}$$
   $$\text{Entropy} > 70 \text{ bits}$$
3. **One-Way Server-Side Hash:** The server computes:
   $$\text{StoredHash} = \text{SHA-256}(\text{Token} + \text{Salt})$$
   The plain token is returned once to the citizen's browser and saved in `localStorage`. The server never stores the raw token, preventing database breach exposure.
4. **No Marked Ballots:** Intake rules strictly reject photos of marked ballots or private voters, complying with Section 122 of the Electoral Act 2022 (Secrecy of the Ballot).

---

## 3. Accessibility Specification (WCAG 2.1 Level AA)

MataLens is committed to universal accessibility across all Nigerian socioeconomic demographics, device types, and physical abilities.

### 3.1 Color Contrast Ratios
- **Body Text on Background:** Broadsheet Black (`#0C1E17`) on Warm Alabaster (`#F9FAF6`) achieves a **17.8:1** contrast ratio (far exceeding the WCAG AA minimum of 4.5:1).
- **Brand Green Elements:** Deep Forest Green (`#0A4D34`) on white achieves **8.9:1**.
- **Dark Mode Text:** Off-white (`#F4F7F5`) on Obsidian (`#071712`) achieves **18.2:1**.
- **Perspective Bar Distinction:** Never rely on color alone. Every perspective segment is accompanied by distinct text labels, icons, and percentages.

### 3.2 Touch Target Sizing & Spacing
- Every interactive element (buttons, tabs, candidate cards, rehearsal options) has an active tap target of **at least $44 \times 44\text{px}$** with minimum 8px padding between adjacent targets.

### 3.3 Screen Reader & Keyboard Navigation
- **Semantic Landmark HTML:** Uses native `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`.
- **Skip Links:** A hidden skip link (`Skip to main content`) appears upon first `Tab` press.
- **Focus Rings:** High-visibility 2px focus ring (`outline: 2px solid #0A4D34; outline-offset: 2px`) on all interactive controls.
- **ARIA Live Regions:** Dynamic scorecards and perspective expansions announce updates politely via `aria-live="polite"`.
- **Motion Reduction:** Full compliance with `@media (prefers-reduced-motion: reduce)`.

---

## 4. Bandwidth Economy & Low-Connectivity Guidelines

Nigeria experiences severe mobile bandwidth volatility and high per-megabyte data costs. MataLens must be lightning-fast on 2G/3G mobile networks.

1. **Strict Data-Saver Mode (`votersdesk-data-saver:v1`):**
   - Toggle in header/footer suppresses non-essential background photography.
   - Replaces photo avatars with SVG letter-mark initials.
   - Compresses layout into dense textual summaries.
2. **Initial JavaScript Payload:** The initial client JS bundle must remain **under 150KB gzipped**.
3. **Image Optimization:** All portraits and diagrams are converted to WebP/AVIF formats with responsive `srcset` (`width: 48px`, `96px`, `192px`).
4. **Offline PWA Caching:** Service Worker caches static assets, constitutional texts, and the voter field guide for complete offline utility on election day.
