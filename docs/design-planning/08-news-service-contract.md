# MataLens & Chisom's News Service: API & Data Contract

> **Target Platform:** MataLens (Personal, Nonpartisan Political-Learning Companion for Nigerians)  
> **Repository:** `omnmlr/matalens` | **Branch:** `agent/research-design`  
> **Date:** November 2026  
> **Document:** Design Planning Deliverable 08  
> **Status:** Final API Specification & Data Contract  

---

## 1. Overview & Service Responsibilities

To power the **living editorial homepage ("The Lens Today")**, the **Political Development Timeline**, and the **4-Pillar Perspective Engine**, MataLens integrates with Chisom's specialized backend news aggregation service.

### Service Responsibilities (Chisom's Service):
1. **Multi-Source Ingestion:** Ingests articles from 22 verified Nigerian newsrooms via RSS, webhooks, and news APIs.
2. **Semantic Event Clustering:** Deduplicates and clusters related articles around real-world political events using natural language processing (NLP).
3. **Entity Linking:** Automatically tags political figures (`politician_id`), political parties (`party_id`), legislative bills (`bill_id`), and constitutional clauses (`section_id`).
4. **4-Pillar Perspective Classification:** Classifies each reporting outlet into one of the four Nigerian pillars: `incumbent`, `opposition`, `watchdog`, or `public_record`.
5. **Manifesto Linkage:** Maps developments against indexed campaign manifesto clauses (e.g., APC *Renewed Hope*, LP *Our Pact*, PDP *My Covenant*).

---

## 2. Core TypeScript Interfaces

```typescript
/**
 * Nigerian 4-Pillar Perspective Categories
 */
export type PerspectiveType = 'incumbent' | 'opposition' | 'watchdog' | 'public_record';

/**
 * 4-State Promise & Verification Taxonomy
 */
export type PromiseStatus = 'not_started' | 'in_progress' | 'delivered' | 'broken';

/**
 * Result Credibility Badges (Elect.ng Model)
 */
export type CredibilityBadge = 'unconfirmed' | 'verified' | 'official' | 'disputed';

/**
 * Single Article from a Verified Newsroom
 */
export interface SourceArticle {
  id: string;
  outletName: string;
  outletSlug: string;
  proprietorInfo: {
    owner: string;
    foundingYear: number;
    headquarters: string;
    stateAffiliation: string | null;
  };
  headline: string;
  originalUrl: string;
  publishedAt: string; // ISO 8601
  perspective: PerspectiveType;
  framingSummary: string; // 1-2 sentence neutral summary of this outlet's angle
  isFactCheck: boolean;
  factCheckRating?: 'True' | 'Mostly True' | 'Half True' | 'Misleading' | 'False';
}

/**
 * Linked Primary Public Document / Truth Anchor
 */
export interface PrimaryDocumentAnchor {
  id: string;
  title: string;
  documentType: 'constitution' | 'electoral_act' | 'court_judgment' | 'gazette' | 'hansard';
  statutoryClause: string; // e.g. "Section 84(12)"
  verbatimExcerpt: string;
  plainEnglishTranslation: string;
  officialSourceUrl: string;
  certifiedPdfUrl?: string;
}

/**
 * Linked Manifesto Commitment
 */
export interface LinkedManifestoClause {
  manifestoId: string;
  candidateSlug: string;
  candidateName: string;
  partyAcronym: string;
  documentTitle: string; // e.g. "Renewed Hope 2023"
  theme: 'economy' | 'security' | 'education' | 'health' | 'infrastructure' | 'governance';
  clausePageNumber: number;
  verbatimQuote: string;
  status: PromiseStatus;
  statusRationale: string;
}

/**
 * Node on the Political Development Timeline Spine
 */
export interface TimelineSpineNode {
  id: string;
  timestamp: string; // ISO 8601
  nodeType: 'manifesto_pledge' | 'executive_order' | 'legislative_vote' | 'court_ruling' | 'current_development';
  title: string;
  summary: string;
  primaryDocumentUrl?: string;
  isCurrentEvent: boolean;
}

/**
 * Clustered Master Political Development (Core Payload)
 */
export interface PoliticalDevelopment {
  id: string;
  slug: string;
  kicker: string;
  headline: string;
  category: 'governance' | 'fiscal_reform' | 'security' | 'infrastructure' | 'elections';
  keyFacts: [string, string, string]; // Strict 3-bullet 15-second summary
  neutralSynthesis: string; // 2-3 paragraphs in Newsreader Serif
  timeToReadMinutes: number;
  updatedAt: string;
  
  // Perspective Distribution
  perspectives: {
    incumbentPercent: number;
    oppositionPercent: number;
    watchdogPercent: number;
    publicRecordPercent: number;
    totalOutlets: number;
  };
  
  // Tagged Entities
  taggedPoliticians: Array<{
    slug: string;
    name: string;
    office: string;
    party: string;
    portraitUrl: string;
  }>;
  
  // Linked Primary Documents & Manifesto Context
  truthAnchor: PrimaryDocumentAnchor;
  manifestoContext?: LinkedManifestoClause;
  
  // Timeline Spine
  timelineSpine: TimelineSpineNode[];
  
  // Contributing Newsroom Articles
  articles: SourceArticle[];
  
  // Sourced 60-Second Civic Rehearsal
  rehearsal?: {
    id: string;
    scenario: string;
    question: string;
    options: [string, string, string];
    correctIndex: number;
    statutoryTruthAnchor: string;
    actionableTakeaway: string;
  };
}
```

---

## 3. REST API Endpoint Specifications

### 3.1 `GET /api/v1/developments`
Returns a paginated list of clustered political developments for "The Lens Today" homepage.

#### Query Parameters:
- `page` (integer, default: `1`)
- `limit` (integer, default: `10`, max: `25`)
- `category` (optional, string: `governance`, `fiscal_reform`, etc.)
- `politician` (optional, string: candidate slug, e.g. `ireti-kingibe`)
- `data_saver` (optional, boolean: suppresses article thumbnails and verbose text)

#### Response Header Requirements:
- `Cache-Control: public, max-age=300, stale-while-revalidate=600`
- `Content-Encoding: br` (Brotli compression mandatory)

#### Sample Response Payload:
```json
{
  "status": "success",
  "data": {
    "developments": [
      {
        "id": "dev_9942a1",
        "slug": "local-government-financial-autonomy-enacted",
        "kicker": "CONSTITUTIONAL REFORM",
        "headline": "Senate Enacts Direct Federation Account Allocations to 774 Local Councils",
        "category": "governance",
        "keyFacts": [
          "Section 162 of 1999 Constitution altered to disburse FAAC allocations directly to councils.",
          "State-Joint Local Government Accounts (SJLGA) formally abolished.",
          "Requires ratification by 24 of 36 State Houses of Assembly for implementation."
        ],
        "neutralSynthesis": "The Nigerian Senate on Wednesday passed Constitution Alteration Bill No. 4...",
        "timeToReadMinutes": 4,
        "updatedAt": "2026-11-20T10:15:00Z",
        "perspectives": {
          "incumbentPercent": 42,
          "oppositionPercent": 33,
          "watchdogPercent": 20,
          "publicRecordPercent": 5,
          "totalOutlets": 12
        },
        "taggedPoliticians": [
          {
            "slug": "godswill-akpabio",
            "name": "Akpabio, Godswill",
            "office": "Senate President",
            "party": "APC",
            "portraitUrl": "/images/candidates/akpabio.webp"
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 8,
      "totalRecords": 74
    }
  }
}
```

---

### 3.2 `GET /api/v1/developments/:slug`
Fetches a single deep-dive development with the full timeline spine, primary truth anchors, and framing quotes from all 22 newsrooms.

---

### 3.3 `GET /api/v1/politicians/:slug/timeline`
Retrieves the complete historical development and promise ledger for a specific politician.

---

### 3.4 `GET /api/v1/perspectives/radar`
Retrieves daily blindspot analytics identifying stories with high coverage disparity between state media and opposition/watchdog outlets.

---

## 4. Error Handling & Fallback Guarantees

To ensure that the MataLens frontend remains 100% resilient on spotty mobile connections, Chisom's service adheres to strict resilience contracts:

1. **Standardized Error Envelope:**
```json
{
  "status": "error",
  "error": {
    "code": "OUTLET_UNAVAILABLE",
    "message": "The requested primary gazette source is temporarily offline.",
    "fallbackAvailable": true
  }
}
```
2. **Client Offline Fallback (Local Mock Seed):** If Chisom's news service is unreachable or returns a `5xx` error, the MataLens client automatically serves cached local developments from `localStorage` or statically bundled seed files in `src/data/seed/developments.json`. The user never encounters a blank screen or broken crash page.
