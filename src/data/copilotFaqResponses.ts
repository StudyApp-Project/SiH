/**
 * src/data/copilotFaqResponses.ts
 *
 * Curated, high-fidelity pre-made responses for frequently asked questions and
 * quick-action prompts in StatVidya Copilot.
 *
 * When a user selects a suggestion or asks a standard FAQ, the Copilot can
 * respond immediately after a brief simulated AI thinking delay (~500ms),
 * saving API quota while providing a lightning-fast, delightful experience.
 */

import type { CopilotUserContext } from '@/lib/copilotPrompt';

export interface PreMadeFaq {
  id: string;
  matchPatterns: (string | RegExp)[];
  getResponse: (userContext?: CopilotUserContext) => string;
}

export const COPILOT_PREMADE_FAQS: PreMadeFaq[] = [
  {
    id: 'readiness-index',
    matchPatterns: [
      'What is my readiness index and how can I improve it?',
      /readiness\s*index/i,
      /how\s*can\s*i\s*improve\s*(my\s*)?readiness/i,
      /what\s*is\s*my\s*readiness/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      const name = ctx?.name ? `**${ctx.name}**` : isHi ? 'अधिकारी' : 'Officer';
      const designation = ctx?.designation || (isHi ? 'सांख्यिकी अधिकारी' : 'Statistical Official');

      if (isHi) {
        return `### 📊 आपका तैयारी सूचकांक (Readiness Index)

नमस्ते ${name}! एक **${designation}** के रूप में, आपका **तैयारी सूचकांक** यह दर्शाता है कि आपकी भूमिका के लिए आवश्यक कुल FRAC योग्यताओं में से कितने प्रतिशत में आपकी सत्यापित प्रवीणता लक्ष्य स्तर के बराबर या उससे अधिक है।

#### यह कैसे काम करता है:
- **गणितीय सूत्र**: तैयारी सूचकांक की गणना आपके संवर्ग के लिए आवश्यक भारित सत्यापित योग्यताओं के योग को कुल आवश्यक लक्ष्य भार से विभाजित करके की जाती है।
- **प्राथमिकता गुणक**: **गंभीर (Critical)** योग्यताओं का भार 3.0×, **महत्वपूर्ण (Important)** का 2.0×, और **वांछनीय (Desirable)** का 1.0× होता है।

#### 🚀 अपनी तैयारी बढ़ाने के 3 त्वरित उपाय:
1. **गंभीर कमियों को लक्षित करें**: \`/skill-gap\` पर जाएं और देखें कि किन उच्च-प्रभाव योग्यताओं में सबसे अधिक अंतर है।
2. **अनुकूली मूल्यांकन पूर्ण करें**: \`/assessment/comp-capi\` पर सत्यापित टेस्ट दें और अपनी प्रवीणता स्तर को L1/L2 से आगे बढ़ाएं।
3. **सिफारिश किए गए पाठ्यक्रमों में नामांकन करें**: कमियों को दूर करने के लिए \`/pathways\` पर MoSPI/iGOT शिक्षण मॉड्यूल देखें।`;
      }

      return `### 📊 Understanding Your Readiness Index

Hello ${name}! As a **${designation}**, your **Readiness Index** represents the percentage of your role's required FRAC competencies where your verified proficiency level meets or exceeds the target level.

#### How It Works:
- **Mathematical Formula**: Readiness is calculated as the sum of weighted verified competencies divided by total required target weights for your cadre.
- **Priority Multipliers**: **Critical** competencies carry a 3.0× weight, **Important** carry 2.0×, and **Desirable** carry 1.0×.

#### 🚀 3 Ways to Quickly Boost Your Readiness:
1. **Target Critical Gaps**: Head to \`/skill-gap\` to see which high-impact competencies have the largest deficit.
2. **Complete Adaptive Assessments**: Take verified assessments on \`/assessment/comp-capi\` to promote your competency level from L1/L2 to higher proficiency.
3. **Enroll in Recommended Courses**: Explore tailored MoSPI/iGOT learning modules on \`/pathways\` to close practical gaps.`;
    },
  },
  {
    id: 'skill-gaps',
    matchPatterns: [
      'Show me my top competency gaps and what to do about them',
      /top\s*(competency\s*|skill\s*)?gaps/i,
      /what\s*are\s*my\s*gaps/i,
      /skill\s*gaps/i,
      /कौशल\s*अंतर/i,
      /योग्यता\s*कमी/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 🎯 आपका योग्यता अंतराल विश्लेषण (Competency Gap Analysis)

स्टैटविद्या आपके वर्तमान सत्यापित स्तर और संवर्ग के लक्ष्य स्तर के बीच के अंतर के आधार पर कमियों को 3 गंभीरता स्तरों में वर्गीकृत करता है:

#### गंभीरता वर्गीकरण:
- **उच्च गंभीरता (गंभीर अंतर)**: किसी गंभीर योग्यता (जैसे CAPI टैबलेट संचालन या सर्वेक्षण नमूनाकरण) पर 2+ स्तरों का अंतर। इसके लिए तत्काल प्रशिक्षण हस्तक्षेप की आवश्यकता है।
- **मध्यम गंभीरता**: महत्वपूर्ण योग्यताओं पर 1 स्तर का अंतर, या वांछनीय योग्यताओं पर 2 स्तरों का अंतर।
- **दक्ष (Proficient)**: आप अपनी भूमिका के लक्ष्य मानदंड को पूरा करते हैं या उससे आगे हैं!

#### अगले कदम:
- \`/dashboard\` पर अपना इंटरैक्टिव **योग्यता रडार चार्ट** देखें।
- \`/skill-gap\` पर मूल कारणों की विस्तृत जानकारी देखें।
- \`/pathways\` पर अनुशंसित प्रशिक्षण पाठ्यक्रमों में सीधे प्रवेश लें।`;
      }

      return `### 🎯 Your Competency Gap Analysis

StatVidya classifies your competency gaps into 3 severity levels based on the deficit between your **current verified level** and your **cadre target level**:

#### Gap Severity Classifications:
- **High Severity (Critical Deficit)**: Deficit of 2+ levels on a Critical priority competency (e.g., CAPI Tablet Operations or Survey Sampling). Requires immediate training intervention.
- **Moderate Severity**: Deficit of 1 level on Critical/Important competencies, or 2 levels on Desirable competencies.
- **Proficient**: You meet or exceed your role's target benchmark!

#### Next Steps:
- Review your interactive **Competency Radar Chart** on \`/dashboard\`.
- Check detailed root-cause insights and operational impact on \`/skill-gap\`.
- Jump straight to targeted training pathways on \`/pathways\`.`;
    },
  },
  {
    id: 'take-assessment',
    matchPatterns: [
      'How do I start an assessment?',
      /start\s*(an\s*)?assessment/i,
      /take\s*(an\s*)?assessment/i,
      /how\s*to\s*test/i,
      /मूल्यांकन\s*कैसे/i,
      /परीक्षा\s*शुरू/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 📝 अनुकूली मूल्यांकन शुरू करना (Starting an Adaptive Assessment)

स्टैटविद्या पर मूल्यांकन MoSPI / NSSO प्रोटोकॉल के तहत आपके व्यावहारिक परिचालन कौशल को सत्यापित करने के लिए बनाए गए हैं।

#### मूल्यांकन इंजन कैसे काम करता है:
- **अनुकूली प्रश्न**: आपके वास्तविक समय के उत्तरों के आधार पर प्रश्न सरल, मध्यम और कठिन के बीच स्वचालित रूप से समायोजित होते हैं।
- **समयबद्ध सिमुलेशन**: मानक आकलनों में उलटी गिनती टाइमर और अंतिम सबमिशन से पहले समीक्षा पैलेट शामिल होता है।
- **स्वचालित पदोन्नति**: **70% या अधिक** अंक प्राप्त करने पर आपकी प्रोफ़ाइल में सत्यापित FRAC प्रवीणता स्तर स्वतः अपग्रेड हो जाता है।
- **ऑफ़लाइन सक्षम**: आप रुक-रुक कर आने वाले इंटरनेट के साथ भी परीक्षा पूरी कर सकते हैं — उत्तर आपके ब्राउज़र कैश में सुरक्षित रहते हैं।

👉 **शुरू करने के लिए तैयार हैं?** अपना मूल्यांकन शुरू करने के लिए \`/assessment/comp-capi\` पर जाएं!`;
      }

      return `### 📝 Starting an Adaptive Assessment

Assessments on StatVidya are designed to verify your practical operational skills under MoSPI / NSSO protocols.

#### How the Assessment Engine Works:
- **Adaptive Questions**: Questions dynamically calibrate between Easy, Medium, and Hard based on your real-time responses.
- **Timed Simulation**: Standard assessments feature a countdown timer and a review palette before final submission.
- **Automatic Promotion**: Scoring **70% or above** automatically upgrades your verified FRAC competency level in your official profile.
- **Offline Capable**: You can complete tests even with intermittent field internet — submissions queue safely in your browser cache.

👉 **Ready to test?** Visit \`/assessment/comp-capi\` to begin your CAPI Tablet Operations assessment!`;
    },
  },
  {
    id: 'recommend-courses',
    matchPatterns: [
      'Recommend iGOT courses for my skill gaps',
      /recommend\s*(igot\s*)?courses/i,
      /recommended\s*courses/i,
      /what\s*courses\s*should\s*i\s*take/i,
      /पाठ्यक्रम\s*सिफारिश/i,
      /कोर्स\s*सुझाव/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      const cadre = ctx?.cadre || (isHi ? 'आधिकारिक सांख्यिकी प्रणाली' : 'Official Statistical System');

      if (isHi) {
        return `### 🛤️ अनुशंसित iGOT कर्मयोगी पाठ्यक्रम

यहाँ **${cadre}** के लिए सर्वोच्च प्राथमिकता वाले पाठ्यक्रम दिए गए हैं:

#### 1. 📱 उन्नत CAPI टैबलेट संचालन और तुल्यकालन
- **योग्यता**: CAPI टैबलेट संचालन (L3 लक्ष्य)
- **अवधि**: 4.5 घंटे | **प्रदाता**: NSSTA / MoSPI
- **फोकस**: घरेलू सूचीकरण, त्रुटि सुलह, ऑफ़लाइन डेटा कैशिंग।

#### 2. 📊 बड़े पैमाने के सर्वेक्षणों में बहु-चरणीय स्तरीकृत नमूनाकरण
- **योग्यता**: सर्वेक्षण नमूनाकरण और डिज़ाइन (L3 लक्ष्य)
- **अवधि**: 6.0 घंटे | **प्रदाता**: NSSTA
- **फोकस**: द्वितीय-चरण चयन, गुणक गणना, नमूनाकरण भिन्नता।

#### 3. 🔍 सांख्यिकीय डेटा जांच और सत्यापन नियम
- **योग्यता**: डेटा प्रविष्टि और जांच (L3 लक्ष्य)
- **अवधि**: 3.5 घंटे | **प्रदाता**: MoSPI प्रशिक्षण प्रभाग
- **फोकस**: अनुसूची 0.0 जांच नियम, स्थिरता परीक्षण।

पूर्ण कैटलॉग देखने के लिए \`/pathways\` पर जाएं!`;
      }

      return `### 🛤️ Recommended iGOT Karmayogi Courses

Here are the highest-priority courses curated for the **${cadre}**:

#### 1. 📱 Advanced CAPI Tablet Operations & Synchronization
- **Competency**: CAPI Tablet Operation (L3 Target)
- **Duration**: 4.5 Hours | **Provider**: NSSTA / MoSPI
- **Focus**: Household listing, error flag reconciliation, offline CAPI data caching.

#### 2. 📊 Multistage Stratified Sampling in Large-Scale Surveys
- **Competency**: Survey Sampling & Design (L3 Target)
- **Duration**: 6.0 Hours | **Provider**: NSSTA
- **Focus**: Second-stage stratum selection, multiplier calculation, sampling variance.

#### 3. 🔍 Statistical Data Scrutiny, Validation Rules & Outlier Detection
- **Competency**: Data Entry & Scrutiny (L3 Target)
- **Duration**: 3.5 Hours | **Provider**: MoSPI Training Division
- **Focus**: Schedule 0.0 scrutiny rules, cross-table ratio consistency.

Visit \`/pathways\` to browse the full catalog with direct enrolment links!`;
    },
  },
  {
    id: 'frac-levels',
    matchPatterns: [
      'Explain the FRAC competency levels L1 to L5',
      /explain\s*(the\s*)?frac/i,
      /frac\s*levels/i,
      /l1\s*to\s*l5/i,
      /what\s*is\s*frac/i,
      /स्तर\s*l1/i,
      /फ्रैक\s*स्तर/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 🏛️ मिशन कर्मयोगी FRAC स्तर (L1 – L5)

**भूमिकाओं, गतिविधियों और योग्यताओं के ढांचे (FRAC)** के तहत, सांख्यिकीय प्रवीणता को पाँच प्रगतिशील स्तरों में मानकीकृत किया गया है:

- **L1 (बुनियादी जागरूकता)**: मुख्य शब्दावली, परिभाषाओं और बुनियादी मानकों को समझता है। प्रत्यक्ष पर्यवेक्षण की आवश्यकता होती है।
- **L2 (मार्गदर्शित समझ)**: न्यूनतम सहायता के साथ नियमित डेटा प्रविष्टि, CAPI प्रविष्टि और मानक अनुसूचियां भरने में सक्षम।
- **L3 (स्वतंत्र अनुप्रयोग)**: क्षेत्र में स्वतंत्र रूप से कार्य करता है। गैर-मानक स्थितियों और जांच परीक्षणों को संभालने में सक्षम।
- **L4 (विशेषज्ञ / पर्यवेक्षी)**: फील्ड टीमों का पर्यवेक्षण करता है, गुणवत्ता ऑडिट करता है और कनिष्ठ कर्मचारियों का मार्गदर्शन करता है।
- **L5 (रणनीतिक नेतृत्व)**: सर्वेक्षण पद्धति तैयार करता है, राष्ट्रीय नमूना डिजाइन परिभाषित करता है और सांख्यिकीय नीति का नेतृत्व करता है।

जैसे-जैसे आप अधिकृत शिक्षण पथ और अनुकूली आकलन पूरा करते हैं, आपका सत्यापित स्तर बढ़ता जाता है!`;
      }

      return `### 🏛️ Mission Karmayogi FRAC Levels (L1 – L5)

Under the **Framework for Roles, Activities, and Competencies (FRAC)**, statistical proficiency is standardized across five progressive tiers:

- **L1 (Basic Awareness)**: Understands core terminology, definitions, and standard acronyms. Requires direct supervision.
- **L2 (Intermediate / Guided)**: Able to carry out routine data canvassing, CAPI entry, and standard schedule filling with minimal assistance.
- **L3 (Advanced / Independent)**: Operates autonomously in the field. Capable of handling non-standard field situations and scrutiny checks.
- **L4 (Expert / Supervisory)**: Supervises field teams, conducts quality audits, scrutinizes primary schedules, and mentors junior staff.
- **L5 (Master / Strategic)**: Designs survey methodology, defines national sampling designs, and leads statistical policy formulation.

Your verified level increases as you complete authorized learning pathways and adaptive assessments!`;
    },
  },
  {
    id: 'platform-guide',
    matchPatterns: [
      'Give me a quick overview of all platform features',
      /overview\s*of\s*(all\s*)?platform/i,
      /platform\s*guide/i,
      /features\s*overview/i,
      /what\s*can\s*(this|statvidya)\s*do/i,
      /मंच\s*का\s*परिचय/i,
      /सुविधाएं/i,
    ],
    getResponse: (ctx) => {
      const isHi = ctx?.preferredLanguage === 'hi';
      if (isHi) {
        return `### 🧭 स्टैटविद्या मंच का त्वरित अवलोकन

स्टैटविद्या **सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)** के लिए भारत का समर्पित AI-संचालित क्षमता प्रबंधन मंच है।

#### मुख्य मॉड्यूल:
- 📊 **डैशबोर्ड (\`/dashboard\`)**: अपना रीयल-टाइम तैयारी सूचकांक, व्यक्तिगत प्रगति और योग्यता रडार देखें।
- 🎯 **कौशल अंतर मैट्रिक्स (\`/skill-gap\`)**: प्राथमिकता भार और उपचारात्मक सुझावों के साथ परिचालन कमियों का विश्लेषण करें।
- 📝 **अनुकूली मूल्यांकन (\`/assessment/comp-capi\`)**: तत्काल स्कोरिंग और स्तर उन्नयन के साथ लाइव परीक्षा इंजन।
- 🛤️ **अध्ययन पथ (\`/pathways\`)**: आपकी कमियों से सीधे जुड़े MoSPI और iGOT पाठ्यक्रम।
- 📑 **सर्वेक्षण दस्तावेज़ पार्सर (\`/documents\`)**: NSSO/NSSTA मैनुअल अपलोड करें और तुरंत योग्यता संरचना बनाएं।
- 🤖 **AI MCQ जनरेटर (\`/mcq-generator\`)**: आधिकारिक सांख्यिकीय हैंडबुक से प्रश्न बैंक तैयार करें।
- 🏛️ **कार्यबल शासन (\`/admin/analytics\`)**: विभागीय जांच ऑडिट, तैयारी सहसंबंध और प्राथमिकता प्रशिक्षण ध्वजारोहण।`;
      }

      return `### 🧭 StatVidya Platform Tour

StatVidya is India's dedicated AI-powered competency management system for the **Ministry of Statistics and Programme Implementation (MoSPI)**.

#### Core Platform Modules:
- 📊 **Dashboard (\`/dashboard\`)**: Track your real-time Readiness Index, personalized greeting, and competency radar overview.
- 🎯 **Skill Gap Matrix (\`/skill-gap\`)**: Drill down into operational skill gaps with priority weights and remedial suggestions.
- 📝 **Adaptive Assessments (\`/assessment/comp-capi\`)**: Live evaluation engine with instant scoring and competency upgrades.
- 🛤️ **Learning Pathways (\`/pathways\`)**: Curated MoSPI & iGOT courses matched directly to your deficits.
- 📑 **Survey Document Parser (\`/documents\`)**: Upload NSSO/NSSTA manuals and generate instant competency frameworks.
- 🤖 **AI MCQ Generator (\`/mcq-generator\`)**: Create customized question banks from official statistical handbooks.
- 🏛️ **Admin Workforce Governance (\`/admin/analytics\`)**: Departmental scrutiny audits, readiness correlations, and priority flagging.`;
    },
  },
];

/**
 * Checks if a user prompt matches any pre-made FAQ.
 * Returns the matching response string or null.
 */
export function matchPreMadeFaq(
  prompt: string,
  userContext?: CopilotUserContext
): string | null {
  const normalized = prompt.trim().toLowerCase();
  if (!normalized) return null;

  for (const faq of COPILOT_PREMADE_FAQS) {
    for (const pattern of faq.matchPatterns) {
      if (typeof pattern === 'string') {
        if (normalized === pattern.toLowerCase()) {
          return faq.getResponse(userContext);
        }
      } else if (pattern instanceof RegExp) {
        if (pattern.test(normalized)) {
          return faq.getResponse(userContext);
        }
      }
    }
  }

  return null;
}
