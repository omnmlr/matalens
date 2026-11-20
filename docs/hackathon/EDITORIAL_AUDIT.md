# MataLens Political Accuracy & Editorial Audit (Corrected Edition)

> **Target Platform:** MataLens (AIESEC × HISA Hackathon Release)  
> **Auditor:** Lead Editorial Accuracy & Fact-Checking Auditor  
> **Reviewed Edition:** `data/news/reviewed-edition.json` (Revision `v1`)  
> **Backend Implementation:** Codex Sol (`codex/matalens-news-intelligence`)  
> **Date:** 20 November 2026  
> **Status:** Verified Against Actual Published Edition  

---

## 1. Executive Summary & Editorial Governance

MataLens is designed as a **strictly nonpartisan political-learning companion**. In Nigerian politics, where ethnic, regional, and partisan sensitivities run high, every headline, date, and candidate association must be grounded in primary public evidence.

This audit evaluates the **five bundled reviewed stories**, their **supporting source captures**, their **statutory citations**, and their **comprehension quizzes** against the actual codebase in `data/news/reviewed-edition.json` and `server/news/desk.ts`.

### Core Audit Findings:
1. **Source Sourcing Integrity (100% Passed):** Every story cites primary documents (official INEC notices, certified candidate PDFs, published party manifestos, or established newsrooms: Channels TV, Voice of Nigeria).
2. **Fact vs. Attribution Rigor (100% Passed):** Stories scrupulously separate legally certified facts (e.g. 18 named presidential tickets on INEC roster) from political claims (e.g. Adebayo's security promises).
3. **Statutory Calendar Accuracy (Verified):** The official INEC calendar schedules:
   - **Presidential & National Assembly Elections:** **16 January 2027**
   - **Governorship & State Houses of Assembly Elections:** **6 February 2027**
   - **Nationwide Mock Accreditation:** **28 November 2026**
   *(Note: The previous audit draft incorrectly referenced 20 March; Sol’s reviewed story already accurately recorded and tested 6 February 2027).*
4. **Authentic Source Discrepancies:** The edition highlights genuine evidentiary discrepancies (e.g., INEC notice citing 2 December vs syndicated republication citing 3 December for staff recruitment) rather than smoothing over conflicting records.
5. **Minor Typo Flagged:** Story 1 (`inec-recruitment-deadline-2027`) title spells the recruitment portal `"INECPRESS"` (two S's) instead of the official statutory name `"INECPRES"` (one S — *INEC Portal for Recruitment of Election Staff*).

---

## 2. Story-by-Story Forensic Audit Against Working Build

---

### Story 1: INEC Extends the Election Staff Application Deadline
- **Story ID:** `inec-recruitment-deadline-2027`
- **Topic:** `Election administration` | **Published Date:** `2026-11-19` | **Review Status:** `reviewed`
- **Sources in Reviewed Edition:**
  1. `recruitment-notice`: Title: *"INEC Updates Closing Date for INECPRESS Ad-Hoc Staff Recruitment"*, Publisher: *Independent National Electoral Commission (INEC)*, URL: `https://inecnigeria.org/press/inec-updates-closing-date-for-inecpress-ad-hoc-staff-recruitment`, Published: `2026-11-19`.
  2. `recruitment-statement`: Title: *"Extension of deadline for the registration of ad hoc staff on the INECPRES portal"*, Publisher: *Press Release Naija · INEC statement*, URL: `https://pressreleasenaija.com.ng/extension-of-deadline-for-the-registration-of-ad-hoc-staff-on-the-inecpres-portal/`, Published: `2026-11-19`.
- **Factual Assessment & Source Comparison:**
  - **The Discrepancy Highlight:** INEC’s official press release states **2 December 2026**, whereas the syndicated release on Press Release Naija states **3 December 2026**.
  - **Civic Sourcing:** MataLens surfaces this discrepancy directly to the reader in `sourceComparisons`:
    > *"INEC’s own notice gives 2 December. The version republished by Press Release Naija gives 3 December. If applying, check INEC’s current notice or the official recruitment portal."*
- **Timeline Entries:**
  - `2026-11-19` (`published`): *"INEC publishes its deadline update"*
  - `2026-12-02` (`scheduled`): *"Revised cutoff stated in INEC’s own notice"*
- **Comprehension Quiz (`recruitment-window`):**
  - **Prompt:** *"Which revised deadline appears in INEC’s own recruitment notice?"*
  - **Options:** `["3 December 2026", "2 December 2026", "18 November 2026"]`
  - **Key & Distractors:** Correct answer is index 1 (`"2 December 2026"`). Distractor 0 (`"3 December 2026"`) is the syndicated date; distractor 2 (`"18 November 2026"`) is the original expired deadline.
- **Editorial Correction Flagged:**
  - Source 1 title uses `"INECPRESS"` (two S's). The statutory name is **INECPRES** (single 'S' — *INEC Portal for Recruitment of Election Staff*), as correctly used in Source 2 and the context text.
  - *Recommendation for Codex Sol:* Correct spelling to `INECPRES` in `data/news/reviewed-edition.json`.

---

### Story 2: INEC Publishes State Assembly Candidate Lists
- **Story ID:** `state-assembly-lists-2027`
- **Topic:** `Candidate records` | **Published Date:** `2026-11-14` | **Review Status:** `reviewed`
- **Sources in Reviewed Edition:**
  1. `assembly-notice`: Title: *"Updated list of candidates for 2027 State Houses of Assembly elections"*, Publisher: *Independent National Electoral Commission (INEC)*, URL: `https://www.inecnigeria.org/press/updated-list-of-candidates-for-2027-state-houses-of-assembly-elections`, Published: `2026-11-14`.
  2. `election-calendar`: Title: *"Full Election Calendar & Timetable"*, Publisher: *Independent National Electoral Commission (INEC)*, URL: `https://www.inecnigeria.org/elections/calendar`.
- **Factual Assessment & Statutory Dates:**
  - **Statutory Authority:** Under Section 28 and Section 32 of the Electoral Act 2022, INEC publishes notices of elections and the particulars of nominated candidates.
  - **Accurate Calendar Date:** As correctly recorded in Sol’s implementation, the published INEC calendar schedules the **State Houses of Assembly elections alongside Governorship elections on 6 February 2027** (with Presidential and National Assembly elections scheduled for **16 January 2027**).
  - **Significance:** Cites how checking constituency headings allows voters to verify candidate listings ahead of the 6 February 2027 poll.
- **Timeline Entries:**
  - `2026-11-14` (`published`): *"INEC posts updated state assembly lists"*
  - `2027-02-06` (`scheduled`): *"State assembly elections scheduled"*
- **Comprehension Quiz (`state-election-date`):**
  - **Prompt:** *"When did the published INEC calendar schedule state assembly elections?"*
  - **Options:** `["6 February 2027", "16 January 2027", "28 November 2026"]`
  - **Key & Distractors:** Correct answer is index 0 (`"6 February 2027"`). Distractor 1 (`"16 January 2027"`) is the Presidential/NASS date; distractor 2 (`"28 November 2026"`) is the mock accreditation date.
- **Editorial Verdict:** **Accurate, verified, and correctly aligned with INEC statutory notices.**

---

### Story 3: What INEC’s Mock Accreditation Will Test
- **Story ID:** `mock-accreditation-2026`
- **Topic:** `Election administration` | **Published Date:** `2026-11-13` | **Review Status:** `reviewed`
- **Sources in Reviewed Edition:**
  1. `mock-notice`: Title: *"INEC sets 28th November, 2026 for nationwide mock accreditation exercise"*, Publisher: *Independent National Electoral Commission (INEC)*, URL: `https://inecnigeria.org/press/inec-sets-28th-november-2026-for-nationwide-mock-accreditation-exercise`, Published: `2026-11-13`.
  2. `mock-report`: Title: *"INEC fixes Nov 28 for nationwide mock accreditation ahead of 2027 general elections"*, Publisher: *Channels Television*, URL: `https://www.channelstv.com/2026/11/12/inec-fixes-nov-28-for-nationwide-mock-accreditation-ahead-of-2027-general-elections/`, Published: `2026-11-12`.
  3. `chatham-house-report`: Title: *"Nigeria's 2023 elections: Evaluating the performance of the Bimodal Voter Accreditation System (BVAS)"*, Publisher: *Chatham House*, URL: `https://www.chathamhouse.org/2023/04/nigerias-2023-elections-evaluating-performance-bimodal-voter-accreditation-system-bvas`.
- **Factual Assessment & Provenance:**
  - **Multi-Source Provenance:** Shows that Channels Television reported the decision on 12 November 2026 based on chairman statements, followed by the official INEC press notice on 13 November 2026.
  - **Contextual Independence:** Cites Chatham House's independent evaluation of 2023 BVAS performance, explaining why testing accreditation and electronic result transmission under field conditions is essential.
- **Timeline Entries:**
  - `2026-11-12` (`reported`): *"Channels Television reports exercise date"*
  - `2026-11-13` (`published`): *"INEC posts official mock accreditation notice"*
  - `2026-11-28` (`scheduled`): *"Nationwide mock accreditation exercise"*
- **Comprehension Quiz (`mock-purpose`):**
  - **Prompt:** *"What did INEC say it would test during the mock exercise?"*
  - **Options:** `["Paper ballot printing", "Accreditation and electronic result transmission", "Campaign spending limits"]`
  - **Key:** Index 1 (`"Accreditation and electronic result transmission"`).
- **Editorial Verdict:** **Exemplary provenance and context tracking.**

---

### Story 4: Nigeria’s 2027 Presidential Roster Begins to Take Shape
- **Story ID:** `presidential-roster-2027`
- **Topic:** `Candidate records` | **Published Date:** `2026-10-31` | **Review Status:** `reviewed`
- **Tagged Entities:** `tinubu-bola-ahmed`, `national-adebayo-adewole-ebenezer` | **Parties:** `APC`, `SDP`
- **Sources in Reviewed Edition:**
  1. `presidential-notice`: Title: *"Updated list of candidates for 2027 presidential election"*, Publisher: *Independent National Electoral Commission (INEC)*, URL: `https://www.inecnigeria.org/press/updated-list-of-candidates-for-2027-presidential-election`, Published: `2026-10-31`.
  2. `presidential-pdf`: Title: *"Final List – Presidential"*, Publisher: *Independent National Electoral Commission (INEC)*, URL: `https://inecnigeria.org/documents/uploads/2026/10/b5af9099-864c-4d5e-924d-e1a2c771c529-final-list-presidential.pdf`, Published: `2026-10-31`.
  3. `apc-manifesto`: Title: *"From Reforms to Prosperity · APC manifesto for the 2027 presidential election"*, Publisher: *All Progressives Congress (APC)*, URL: `https://renewedhope02.com/manifesto` (also cited in `document` as `https://apc.com.ng/apc-2027-manifesto.pdf`).
- **Factual Assessment & Manifesto Commitments:**
  - **Candidate List Precision:** Mentions that the official list names 18 presidential tickets, and specifically highlights that Accord (A) has no nominees listed and is marked *"COURT ORDER"*. This reflects authentic Nigerian gazetted election listings where pending party primary court disputes freeze nominee names.
  - **Documented Commitment:** Links candidate *Bola Ahmed Tinubu* to his manifesto commitment:
    - *Title:* *"Expand social housing and affordable mortgages"*
    - *Document:* `https://apc.com.ng/apc-2027-manifesto.pdf`, Section: *"Pillar 2 · Housing, Urban Development and Mortgages"*
    - *Comparison Discipline:* *"The later roster establishes the candidacy. Assessing delivery would require a documented action, a timeline and relevant implementation records."*
- **Timeline Entries:**
  - `2026-10-31` (`published`): *"INEC posts final presidential candidate list"*
  - `2027-01-16` (`scheduled`): *"Presidential and National Assembly elections"*
- **Comprehension Quiz (`named-tickets`):**
  - **Prompt:** *"How many party tickets are named on INEC’s published 2027 list?"*
  - **Options:** `["20", "18", "19"]`
  - **Key:** Index 1 (`18`). Explanation notes 18 named tickets plus the unnominated Accord court-order entry.
- **Editorial Verdict:** **Verified against official INEC PDF and manifesto text.**

---

### Story 5: Adewole Adebayo Names Security as a Priority
- **Story ID:** `adebayo-security-statement`
- **Topic:** `Campaign statement` | **Published Date:** `2026-08-06` | **Review Status:** `reviewed`
- **Tagged Entities:** `national-adebayo-adewole-ebenezer` | **Parties:** `SDP`
- **Sources in Reviewed Edition:**
  1. `sdp-statement`: Title: *"2027 Election: SDP Candidate Prioritises Security"*, Publisher: *Voice of Nigeria*, URL: `https://von.gov.ng/2027-election-sdp-candidate-prioritises-security/`, Published: `2026-08-06`.
  2. `presidential-pdf`: Official INEC Presidential List PDF.
- **Factual Assessment & Attribution Discipline:**
  - **Speech vs Official Filing:** Correctly notes that Voice of Nigeria reported remarks from a security summit in Kaduna on 6 August 2026, while official INEC candidacy was published later on 31 October 2026.
  - **Documented Commitment:** Lists kind as `public-statement` (not manifesto), noting: *"Assessing delivery would require a documented action, a timeline and relevant implementation records."*
- **Timeline Entries:**
  - `2026-08-06` (`reported`): *"Voice of Nigeria reports Adebayo’s remarks"*
  - `2026-10-31` (`published`): *"INEC lists Adebayo as the SDP nominee"*
- **Comprehension Quiz (`sdp-security-priority`):**
  - **Prompt:** *"What priority did Voice of Nigeria report that Adebayo named?"*
  - **Options:** `["National security", "Housing construction", "Tax collection"]`
  - **Key:** Index 0 (`"National security"`).
- **Editorial Verdict:** **Approved. Balances incumbent coverage with third-party challenger analysis.**

---

## 3. Nonpartisan Neutrality Checklist

| Neutrality Criteria | Verification Status | Evidence / Notes |
| :--- | :---: | :--- |
| **No Endorsements** | **PASSED** | Zero candidate rankings, endorsements, or scores in the edition. |
| **Loaded Verbs Banned** | **PASSED** | Uses neutral verbs (*"states", "publishes", "reports", "extends"*). |
| **Equal Scrutiny** | **PASSED** | Incumbent pledges (APC housing) and opposition statements (SDP security) both explicitly require independent implementation records. |
| **Statutory Primacy** | **PASSED** | Official gazetted calendars and certified candidate lists take precedence over party press releases. |

---

## 4. Final Editorial Correction Item for Codex Sol

- **File:** `data/news/reviewed-edition.json`
- **Item:** Story 1 (`inec-recruitment-deadline-2027`), source `recruitment-notice`.
- **Change:** Change `"INECPRESS"` to `"INECPRES"` in the title:
  ```json
  "title": "INEC Updates Closing Date for INECPRES Ad-Hoc Staff Recruitment"
  ```
