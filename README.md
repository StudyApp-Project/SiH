# 🇮🇳 StatVidya

### *Workforce Competency Intelligence Platform for India's Official Statistical System*
*Engineered for MoSPI & NSSTA under Mission Karmayogi (SIH 26101)*

[![SIH 26101](https://img.shields.io/badge/SIH-Problem_26101-0052CC?style=flat-square&logo=gov.in)](https://www.sih.gov.in/)
[![FRAC Grounded](https://img.shields.io/badge/Framework-FRAC_Grounded-138808?style=flat-square&logo=shield)](https://karmayogi.gov.in/)
[![iGOT Karmayogi](https://img.shields.io/badge/Ecosystem-iGOT_Karmayogi-FF9933?style=flat-square)](https://igotkarmayogi.gov.in/)
[![React 19](https://img.shields.io/badge/Frontend-React_19_+_Vite_8-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Database-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini_Flash-8E75B2?style=flat-square&logo=google)](https://ai.google.dev/)

---

## 🎯 Executive Overview

**StatVidya** is an intelligent, domain-grounded workforce competency platform built specifically for India's Official Statistical System (**MoSPI**, NSSO, ISS/SSS cadres, State DES offices).

Unlike generic LMS platforms or basic quiz generators, StatVidya fills the critical intelligence layer above **iGOT Karmayogi**: it identifies specific competency gaps, delivers offline/Hindi-first field assessments, and links training spending to real statistical outcome improvements.

```
Profile → Assess → Gap → Recommend → Learn (via iGOT) → Practice → Reassess → Repeat
```

---

## 🚀 Key Differentiation Levers

```mermaid
graph TD
    L1["🌾 1. Field-First Delivery<br/>• Offline PWA & Hindi-First UI<br/>• NSSO FOD Field Investigators"] 
    L2["📊 2. Outcome-Oriented Intelligence<br/>• Training ↔ Field Data Quality<br/>• Cadre Readiness Analytics"] 
    L3["🏛️ 3. FRAC Grounded Taxonomy<br/>• Role → Activity → Competency<br/>• Mission Karmayogi Alignment"]

    classDef lever fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    class L1,L2,L3 lever;
```

1. **Field Personnel First (NSSO FOD)**: Built for offline tablets and Hindi-first workflows for enumerators in the field—the largest and most critical workforce segment.
2. **Training → Outcome Correlation**: Measures whether training improves statistical survey output quality, moving beyond self-referential quiz scores.
3. **FRAC Grounded**: Uses Mission Karmayogi’s official **Framework of Roles, Activities and Competencies** (Role $\to$ Activity $\to$ Competency) rather than an invented taxonomy.

---

## 💡 The Core Loop

```mermaid
flowchart LR
    A["👤 Profile Ingestion<br/>(Cadre & Role)"] --> B["⚖️ Gap Engine<br/>(Priority-Weighted)"]
    B --> C["🎯 iGOT Pathways<br/>(Deep-Linked)"]
    C --> D["📑 AI Content Pipeline<br/>(PDF to MCQs)"]
    D --> E["🧪 Adaptive Assessment<br/>(3-Stage L1-L5 Tree)"]
    E --> F["🛡️ Verification & Analytics<br/>(Outcome Tracking)"]
    F -.-> A
```

---

## 👥 Personas Supported

| Persona | Primary Focus | Key Capabilities |
| :--- | :--- | :--- |
| 🌾 **Field Investigator** | NSSO FOD Field Enumeration | Offline PWA assessment, Hindi locale, zero data-loss sync |
| 👨‍💼 **Desk Officer** | MoSPI HQ / ISS / SSS Cadre | FRAC gap analysis, APAR milestone tracking, iGOT Karma Points |
| 👨‍🏫 **Trainer** | NSSTA / TPAC Faculty | AI PDF-to-MCQ batch pipeline, confidence review queue, question bank |
| 🏢 **Administrator** | Department Head / MoSPI Leadership | Macro readiness index, priority training write-back, outcome correlation |

---

## 📜 Domain Grounding & Data Provenance

StatVidya enforces a 100% visible **Provenance Labeling Policy** across all domain data:

| Label | Meaning | Coverage |
| :--- | :--- | :--- |
| ✅ **`VERIFIED_OFFICIAL`** | Real government structure or fact | FRAC methodology, Cadres (ISS/SSS/FOD), iGOT ecosystem |
| ⚠️ **`PROPOSED_FRAMEWORK`** | Product team's proposed model | Specific MoSPI competencies, L1–L5 descriptors, severity weighting |
| 🟡 **`SYNTHETIC_DEMO_DATA`** | Simulated for demonstration | Course catalog, demo question bank, mock aggregate metrics |

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Framer Motion
- **PWA & Offline**: Workbox Service Worker, IndexedDB queue, `react-i18next`
- **Backend & Auth**: Firebase Auth (Gov SSO simulation), Cloudflare Workers
- **Database & Storage**: Firebase Firestore (Realtime), Firebase Storage
- **AI & Processing**: Google Gemini Flash (Structured JSON batch mode), PDF.js

---

## ⚡ Quick Start

```bash
# 1. Clone repository
git clone https://github.com/StudyApp-Project/SiH.git
cd SiH

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env

# 4. Start dev server
npm run dev
```

---

## 📄 License & Governance

Developed for **Smart India Hackathon (SIH 26101)** for the **Ministry of Statistics and Programme Implementation (MoSPI)** / **NSSTA**.
