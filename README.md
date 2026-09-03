# 🏛️ EduWrap — Competency Intelligence & Adaptive Learning Ecosystem
### *Engineered for India's Official Statistical System (MoSPI / NSSTA) under Mission Karmayogi*

[![SIH Problem 26101](https://img.shields.io/badge/SIH-Problem_26101-0052CC?style=flat-square&logo=gov.in)](https://www.sih.gov.in/)
[![FRAC Alignment](https://img.shields.io/badge/Framework-FRAC_Aligned-138808?style=flat-square&logo=shield)](https://karmayogi.gov.in/)
[![iGOT Karmayogi](https://img.shields.io/badge/Integration-iGOT_DSEP_Ready-FF9933?style=flat-square)](https://igotkarmayogi.gov.in/)
[![React 19](https://img.shields.io/badge/Frontend-React_19_+_Vite_8-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase Firestore](https://img.shields.io/badge/Database-Firestore_(Realtime)-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Backend-Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini_Flash-8E75B2?style=flat-square&logo=google)](https://ai.google.dev/)

---

## 🎯 Strategic Alignment: SIH 26101

| Parameter | Operational Specification |
| :--- | :--- |
| **Problem Statement** | **SIH 26101**: AI-enabled learning platform for India's Official Statistical System |
| **Nodal Ministry & Academy** | **MoSPI** (Ministry of Statistics and Programme Implementation) & **NSSTA** (National Statistical Systems Training Academy) |
| **Target Cadres** | Indian Statistical Service (**ISS**), Subordinate Statistical Service (**SSS**), **NSSO** Field Operations Division (**FOD**) Enumerators, State **DES** |
| **National Framework** | **FRAC** (Framework of Roles, Activities and Competencies) under **Mission Karmayogi** |
| **Core Innovation** | Priority-weighted gap analysis + 3-stage adaptive diagnostic assessment + PDF-to-MCQ AI pipeline + DSEP iGOT synergy |

---

## 🔄 1. The Closed-Loop Competency Architecture

EduWrap eliminates the gap between static training and real-time field proficiency through a self-reinforcing, six-stage intelligence cycle:

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#0284c7', 'edgeLabelBackground':'#0f172a'}}}%%
flowchart TD
    subgraph S1["Stage 1: FRAC Role & Competency Mapping"]
        A["👤 Profile Ingestion<br/>• Cadre (ISS / SSS / NSSO FOD)<br/>• FRAC Role Mapping<br/>• Baseline Self-Assessment (✍️)"]
    end

    subgraph S2["Stage 2: Priority-Weighted Gap Engine"]
        B["⚖️ Dynamic Gap Severity<br/>• Severity = Δ × Priority Weight<br/>• Critical Field Priorities Ranked First"]
    end

    subgraph S3["Stage 3: Targeted Learning & iGOT Synergy"]
        C["🎯 Course Recommendations<br/>• NSSTA Pathways (Foundational → Capstone)<br/>• iGOT Deep Links & Karma Points<br/>• APAR Appraisal Readiness"]
    end

    subgraph S4["Stage 4: Content & AI Generation Pipeline"]
        D["📑 Automated Content Pipeline<br/>• MoSPI Manual PDF + OCR Ingestion<br/>• Single-Prompt Batch AI MCQs<br/>• Stage 5a Sanity Check & Trainer Review"]
    end

    subgraph S5["Stage 5: Dynamic Adaptive Assessment"]
        E["🧪 3-Stage Adaptive Engine<br/>• Stage 1: Medium Baseline<br/>• Stage 2/3: Dynamic Hard / Easy Branching<br/>• Topic Diagnostic Feedback"]
    end

    subgraph S6["Stage 6: Outcome Verification & Cadre Analytics"]
        F["🛡️ Closed-Loop Verification<br/>• Promotes L1 → L5 with Verified Badge (🛡️)<br/>• Workforce Heatmaps & Cadre Readiness<br/>• Admin Priority Training Write-Back"]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F -.->|"Continuous Skill Tracking"| A

    classDef stageNode fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    class A,B,C,D,E,F stageNode;
```

---

## 🗺️ 2. FRAC Framework Mapping (Role $\to$ Activity $\to$ Competency)

The platform strictly mirrors Mission Karmayogi's **Role $\to$ Activity $\to$ Competency** data architecture across **Behavioural**, **Functional**, and **Domain** competencies:

```mermaid
%%{init: {'theme': 'dark'}}%%
graph LR
    subgraph Roles["🏛️ ROLES (MoSPI Cadres)"]
        R1["Junior Statistical Officer (JSO)"]
        R2["NSSO Field Enumerator (FOD)"]
        R3["Deputy Director (ISS)"]
    end

    subgraph Activities["📋 ACTIVITIES (Operational Tasks)"]
        A1["Conduct NSS Household Surveys"]
        A2["CAPI Field Data Enumeration"]
        A3["National Accounts Compilation"]
        A4["Cadre Capacity Building"]
    end

    subgraph Competencies["🧠 COMPETENCIES (FRAC Taxonomy)"]
        C1["Survey Sampling & Estimation<br/><i>[Domain]</i>"]
        C2["CAPI Software Operations<br/><i>[Functional]</i>"]
        C3["Statistical Quality Assurance<br/><i>[Functional]</i>"]
        C4["National Income Accounting<br/><i>[Domain]</i>"]
        C5["Analytical Problem Solving<br/><i>[Behavioural]</i>"]
    end

    subgraph Levels["🎖️ PROFICIENCY"]
        L1["L1: Novice"]
        L2["L2: Competent"]
        L3["L3: Advanced"]
        L4["L4: Expert"]
        L5["L5: Master"]
    end

    R1 --> A1
    R1 --> A3
    R2 --> A1
    R2 --> A2
    R3 --> A3
    R3 --> A4

    A1 -->|"Critical (x3)"| C1
    A2 -->|"Critical (x3)"| C2
    A1 -->|"Important (x2)"| C3
    A3 -->|"Critical (x3)"| C4
    A4 -->|"Important (x2)"| C5

    C1 -.-> Levels
    C2 -.-> Levels
    C3 -.-> Levels
    C4 -.-> Levels
    C5 -.-> Levels
```

### Institutional Cadre Mapping Matrix

| Cadre Role | Operational Activity | Associated Competency | Type | Target | Priority Weight |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Junior Statistical Officer (JSO)** | Conduct NSS Household Surveys | Survey Sampling & Estimation | Domain | **L3** | 🔴 **Critical ($\times 3$)** |
| **Junior Statistical Officer (JSO)** | Scrutiny of Survey Schedules | Statistical Quality Assurance | Functional | **L3** | 🟡 **Important ($\times 2$)** |
| **NSSO Field Enumerator (FOD)** | Field Household Data Collection | CAPI Hardware/Software Tools | Functional | **L4** | 🔴 **Critical ($\times 3$)** |
| **NSSO Field Enumerator (FOD)** | Ground Relisting & Boundary Mapping | GIS & Ground Truthing | Domain | **L2** | 🟢 **Desirable ($\times 1$)** |
| **Senior Statistical Officer (SSO)** | Index Number Calculation (CPI/IIP) | Economic Statistics & Indexing | Domain | **L4** | 🔴 **Critical ($\times 3$)** |
| **Deputy Director (ISS)** | National Accounts & GDP Estimation | National Accounts Statistics (NAS) | Domain | **L5** | 🔴 **Critical ($\times 3$)** |
| **All Statistical Personnel** | Cross-Cadre Statistical Coordination | Analytical Problem Solving | Behavioural | **L3** | 🟡 **Important ($\times 2$)** |

---

## ⚖️ 3. Priority-Weighted Gap Analysis Engine

Traditional platforms compute skill gaps as a naive subtraction ($\text{Target} - \text{Current}$). EduWrap weights each deficit by the operational criticality of the official's duties:

$$\Large \text{Severity Score} = (\text{Target Level} - \text{Current Level}) \times \text{Priority Weight}$$

$$\text{Where: } \text{Critical} = 3 \quad\vert\quad \text{Important} = 2 \quad\vert\quad \text{Desirable} = 1$$

### Worked Example: JSO Amit Sharma (NSSO FOD)

```
Target Role: Junior Statistical Officer (JSO) | Total Readiness Index: 58%
```

| Competency | Required | Current Verified | Gap ($\Delta$) | Activity Priority | Severity Score | Action Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Survey Sampling & Estimation** | **L3** | **L1** (✍️ Self) | $\Delta = 2$ | 🔴 Critical ($\times 3$) | **$2 \times 3 = 6$** | 🚨 **Critical Gap (Rank 1)** |
| **CAPI Data Collection** | **L3** | **L2** (🛡️ Verified) | $\Delta = 1$ | 🔴 Critical ($\times 3$) | **$1 \times 3 = 3$** | ⚠️ **Urgent Action (Rank 2)** |
| **Statistical Quality Assurance** | **L3** | **L2** (✍️ Self) | $\Delta = 1$ | 🟡 Important ($\times 2$) | **$1 \times 2 = 2$** | 🟡 **Moderate Gap (Rank 3)** |
| **GIS Ground Truthing** | **L2** | **L1** (✍️ Self) | $\Delta = 1$ | 🟢 Desirable ($\times 1$) | **$1 \times 1 = 1$** | 🟢 **Low Priority (Rank 4)** |
| **Analytical Problem Solving** | **L3** | **L3** (🛡️ Verified) | $\Delta = 0$ | 🟡 Important ($\times 2$) | **$0 \times 2 = 0$** | ✅ **Proficient** |

> **Key Takeaway**: A 1-level gap on a Critical Activity ($1 \times 3 = 3$) outranks a 1-level gap on an Important Activity ($1 \times 2 = 2$).

---

## 🧪 4. Dynamic Adaptive Assessment Engine

Assessments use a **3-stage dynamic difficulty branching tree** that adjusts test difficulty in real time based on cumulative answers:

```mermaid
%%{init: {'theme': 'dark'}}%%
graph TD
    Start["🚀 Assessment Start<br/>Competency: Survey Sampling"] --> S1["Stage 1: Baseline Pool<br/>(4 Questions • Medium Difficulty)"]

    S1 -->|"Score ≥ 75% (3-4 Correct)"| S2H["Stage 2A: Advanced Pool<br/>(4 Questions • Hard Difficulty)"]
    S1 -->|"Score < 75% (0-2 Correct)"| S2L["Stage 2B: Fundamental Pool<br/>(4 Questions • Easy Difficulty)"]

    S2H -->|"Score ≥ 75%"| S3H["Stage 3A: Expert Pool<br/>(4 Questions • Very Hard)"]
    S2H -->|"Score < 75%"| S3M1["Stage 3B: Applied Pool<br/>(4 Questions • Medium/Hard)"]

    S2L -->|"Score ≥ 50%"| S3M2["Stage 3C: Standard Pool<br/>(4 Questions • Medium)"]
    S2L -->|"Score < 50%"| S3E["Stage 3D: Remedial Pool<br/>(4 Questions • Basic Easy)"]

    S3H --> Out5["🏆 Level Promoted to L5<br/>(Master / Verified 🛡️)"]
    S3M1 --> Out4["🎖️ Level Promoted to L4<br/>(Expert / Verified 🛡️)"]
    S3M2 --> Out3["🎖️ Level Promoted to L3<br/>(Advanced / Verified 🛡️)"]
    S3E --> Out2["⚠️ Level Calibrated to L1/L2<br/>(Remedial Pathway Generated)"]

    classDef poolNode fill:#1e293b,stroke:#0ea5e9,stroke-width:2px,color:#f8fafc;
    classDef highNode fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    classDef lowNode fill:#7f1d1d,stroke:#f87171,stroke-width:2px,color:#f8fafc;

    class S1,S2H,S2L,S3H,S3M1,S3M2,S3E poolNode;
    class Out5,Out4,Out3 highNode;
    class Out2 lowNode;
```

---

## 📑 5. Content Intelligence & Batch AI MCQ Pipeline

The content pipeline ingests unstructured MoSPI training manuals and transforms them into validated assessment banks without exceeding rate limits:

```mermaid
%%{init: {'theme': 'dark'}}%%
sequenceDiagram
    autonumber
    actor Trainer as 👨‍🏫 Training Faculty (NSSTA)
    participant Client as 🖥️ Client UI (EduWrap)
    participant OCR as 📑 PDF.js + Tesseract OCR
    participant Worker as ⚡ Cloudflare Worker Proxy
    participant Gemini as ✨ Google Gemini AI
    participant DB as 🔥 Cloud Firestore

    Trainer->>Client: Uploads MoSPI Training Manual (PDF)
    Note over Client: Enforces 15-Page / Chapter Window<br/>to protect browser memory
    Client->>OCR: Extracts text & performs OCR on tables
    OCR-->>Client: Structured text chunks (3,000 tokens)
    Trainer->>Client: Configures Generation (12 MCQs, L3 Target)
    Client->>Worker: Dispatches single batch generation request
    Note over Worker: Enforces 15-RPM throttle & attaches system schema
    Worker->>Gemini: Single-Prompt Batch Request (JSON Mode)
    Gemini-->>Worker: 12 Structured MCQs + Confidence Tags
    Worker-->>Client: Parsed Questions ({stem, options, answer, confidence})
    Client->>Trainer: Stage 5a Sanity Check ("Topics: Stratification, Allocation. Match?")
    Trainer->>Client: Confirms topic alignment
    Note over Client: Questions Sorted: Low-Confidence First (🔴)
    Trainer->>Client: Edits & Approves MCQs into Bank
    Client->>DB: Publishes verified questions to institutional Question Bank
```

---

## 🛡️ 6. Closed-Loop Verification & iGOT Karma Points Flow

```mermaid
%%{init: {'theme': 'dark'}}%%
sequenceDiagram
    autonumber
    actor Learner as 👨‍💼 Statistical Officer
    participant App as 🖥️ EduWrap App
    participant Worker as ⚡ Cloudflare Worker
    participant DB as 🔥 Cloud Firestore
    participant iGOT as 🇮🇳 iGOT Karmayogi (DSEP)

    Learner->>App: Submits Adaptive Assessment Answers
    Note over App: Client cannot self-promote level
    App->>Worker: Dispatches answers to /api/evaluate-assessment
    Worker->>Worker: Evaluates difficulty tree & computes score (82%)
    Worker->>DB: Writes immutable record to assessment_results/
    Worker->>DB: Promotes competency_records/{uid} (L1 → L2 Verified 🛡️)
    Worker->>DB: Logs audit trail to audit_log/
    Worker-->>App: Returns verified results + topic breakdown
    App->>iGOT: Syncs Karma Points (+40 KP) & updates APAR progress
    App->>Learner: Displays updated Radar Chart & closes priority gap
```

---

## 👥 7. Role-Based Feature Matrix

| Feature / Capability | 👨‍💼 Learner (Officer) | 👨‍🏫 Trainer (Faculty) | 🏢 Administrator (DG) |
| :--- | :---: | :---: | :---: |
| **Simulated Jan-Parichay Gov SSO** | ✅ | ✅ | ✅ |
| **Bilingual Toggle (English / हिंदी)** | ✅ | ✅ | ✅ |
| **Competency Radar & Dual-Tier Badges (🛡️/✍️)** | ✅ *(Self)* | ✅ | ✅ *(Cadre Aggregates)* |
| **Priority-Weighted Gap Analysis** | ✅ | ❌ | ✅ *(Macro Overview)* |
| **Dynamic Adaptive Assessments** | ✅ | ❌ | ❌ |
| **Question Flagging Affordance** | ✅ | ❌ | ❌ |
| **MoSPI Manual PDF Ingestion & OCR** | ❌ | ✅ | ❌ |
| **Batch AI MCQ Generation Pipeline** | ❌ | ✅ | ❌ |
| **Confidence-Sorted Review Queue** | ❌ | ✅ | ❌ |
| **Institutional Question Bank Management** | ❌ | ✅ | ✅ |
| **iGOT Karma Points & APAR Tracking** | ✅ | ❌ | ✅ *(Read-Only)* |
| **Workforce Skill Heatmap** | ❌ | ❌ | ✅ |
| **AI Macro Gap Narrative Summaries** | ❌ | ❌ | ✅ |
| **Priority Training Write-Back Action** | ❌ | ❌ | ✅ |

---

## 🏗️ 8. System Architecture Topology

```mermaid
%%{init: {'theme': 'dark'}}%%
graph TB
    subgraph Client["🖥️ CLIENT APPLICATION LAYER (Vite 8 + React 19)"]
        UI["Tailwind CSS v4 + Framer Motion UI Components"]
        Bilingual["🌐 Bilingual Localization (EN / HI)"]
        GovSSO["🇮🇳 Simulated Jan-Parichay Gov SSO"]
        PDFEng["📑 PDF.js + Tesseract.js OCR Engine"]
    end

    subgraph Serverless["⚡ TRUSTED SERVERLESS LAYER (Cloudflare Worker)"]
        RateLimiter["⏱️ Server-Side Rate Limiter"]
        EvalEngine["🧮 Assessment Evaluator & Level Promotion Engine"]
        AIProxy["🤖 AI Provider Proxy (Dynamic GEMINI_MODEL)"]
        AdminSDK["🔑 Firebase Admin SDK Service Account"]
    end

    subgraph Storage["🗄️ PERSISTENCE LAYER (Firebase)"]
        Firestore[("🔥 Cloud Firestore<br/>• users/<br/>• competency_records/ [PROTECTED]<br/>• assessment_results/ [IMMUTABLE]<br/>• questions/<br/>• audit_log/")]
        FStorage["📦 Firebase Storage<br/>(MoSPI Training Manuals & Circulars)"]
    end

    subgraph Integration["🌐 NATIONAL ECOSYSTEM INTEGRATIONS"]
        Gemini["✨ Google Gemini AI API (Structured JSON Mode)"]
        iGOT["🇮🇳 iGOT Karmayogi (DSEP Interface + Deep Links)"]
    end

    UI -->|"Direct Reactive Read (Org Scoped)"| Firestore
    UI -->|"Manual Upload"| FStorage
    UI -->|"Submit Assessments & AI Generation"| Serverless
    EvalEngine --> AdminSDK
    AIProxy --> Gemini
    AdminSDK -->|"Trusted Server Writes"| Firestore
    UI -.->|"Karma Points & Course Links"| iGOT
```

---

## 🗂️ 9. Entity-Relationship Data Model

```mermaid
%%{init: {'theme': 'dark'}}%%
erDiagram
    ROLE ||--o{ ACTIVITY : "deconstructed into"
    ACTIVITY ||--o{ ACTIVITY_COMPETENCY : "requires"
    COMPETENCY ||--o{ ACTIVITY_COMPETENCY : "defined by"
    USER ||--o{ COMPETENCY_RECORD : "maintains"
    COMPETENCY ||--o{ COMPETENCY_RECORD : "evaluated in"
    DOCUMENT ||--o{ QUESTION : "generates"
    COMPETENCY ||--o{ QUESTION : "tagged to"
    ASSESSMENT ||--o{ QUESTION : "assembles"
    USER ||--o{ ASSESSMENT_RESULT : "submits"
    ASSESSMENT ||--o{ ASSESSMENT_RESULT : "evaluates"
    COURSE ||--o{ COMPETENCY : "covers"

    ROLE {
        string id PK
        string title "JSO | SSO | FOD"
        string cadre "ISS | SSS | NSSO"
        string organizationId FK
    }

    ACTIVITY {
        string id PK
        string roleId FK
        string name "Conduct NSS Household Surveys"
        string priority "critical | important | desirable"
    }

    COMPETENCY {
        string id PK
        string name "Survey Sampling & Estimation"
        string category "Behavioural | Functional | Domain"
        object levels "L1-L5 Descriptors"
    }

    COMPETENCY_RECORD {
        string id PK
        string userId FK
        string competencyId FK
        int currentLevel "1-5"
        string verificationStatus "self_assessed | assessment_verified"
        timestamp updatedAt
    }

    QUESTION {
        string id PK
        string competencyId FK
        string documentId FK
        string difficulty "easy | medium | hard"
        string status "pending | approved | rejected"
        string confidence "high | medium | low"
    }
```

---

## 📜 10. Data Provenance & Trust Classification

All domain and framework definitions are classified by institutional provenance to guarantee transparency:

| Classification | Data Entity | Justification & Source |
| :--- | :--- | :--- |
| ✅ **VERIFIED OFFICIAL** | **FRAC Methodology** | Framework of Roles, Activities and Competencies (One of Six Pillars of Mission Karmayogi). |
| ✅ **VERIFIED OFFICIAL** | **Government Cadre Designations** | Indian Statistical Service (ISS), Subordinate Statistical Service (SSS), NSSO FOD Enumerators. |
| ✅ **VERIFIED FACT** | **iGOT Karmayogi Ecosystem** | 1+ crore registered civil servants, Sunbird/DIKSHA backend, DSEP Protocol, Karma Points linked to APAR. |
| ⚠️ **PROPOSED FRAMEWORK** | **MoSPI Competency Framework** | Specific MoSPI statistical competencies nested under Behavioural, Functional, and Domain categories. |
| ⚠️ **PROPOSED METHODOLOGY** | **Severity & Scoring Rules** | Priority-weighted gap formula: $\text{Severity} = \Delta \times \text{Priority Weight}$; 3-stage adaptive branching logic. |
| 🟡 **SYNTHETIC DEMO DATA** | **Simulation Assets** | Mock employee profiles, demonstration questions, and synthetic course catalog. |

---

## ⚡ 11. Quick Start & Developer Guide

### Prerequisites
* **Node.js**: v18.0+
* **npm**: v9.0+

```bash
# 1. Clone repository
git clone https://github.com/StudyApp-Project/EduWrap.git
cd EduWrap

# 2. Install all dependencies
npm install

# 3. Configure environment variables (.env)
cp .env.example .env

# 4. Start local development server
npm run dev

# 5. Production quality verification gate
npm run lint       # Clean ESLint audit
npm run build      # Clean Vite 8 production build
```

---

## 🏛️ Institutional Governance

* **Competition Problem**: Smart India Hackathon (SIH 26101)
* **Designated Beneficiary**: Ministry of Statistics and Programme Implementation (**MoSPI**) / National Statistical Systems Training Academy (**NSSTA**)
* **License**: Open Source under the **ISC License**
