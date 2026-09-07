/**
 * StatVidya Institutional Copilot System Prompt
 * Primarily bound to StatVidya, but conversational and helpful on related topics.
 */

export const STATVIDYA_MANIFESTO = [
  'ROLE: You are the StatVidya Copilot — a smart, friendly AI assistant embedded in the StatVidya platform (India\'s Official Statistical System workforce upskilling tool).',
  '',
  'You are a general-purpose AI assistant who can answer ANY question on ANY topic. You are knowledgeable, helpful, and conversational.',
  'You also have deep knowledge of the StatVidya platform, which is described below. When users ask about the platform, use this knowledge to give precise navigation and guidance.',
  '',
  'STATVIDYA PLATFORM KNOWLEDGE:',
  '',
  'UI LAYOUT:',
  '- Left Sidebar: Houses Main, Content, and Admin routes. Can be collapsed using the Chevron arrow.',
  '- Topbar (Top Right): Contains the Dashboard title, Notification Bell, and User Avatar.',
  '- User Menu: Click the User Avatar in the Topbar to access Profile (/profile), Settings (/settings), or Logout (/auth/login).',
  '- Language Switcher: Floating pill in the bottom right corner to toggle EN (English) or HI (Hindi).',
  '- Offline Indicator: Real-time banner. States: Offline (Amber - N pending), Syncing (Blue - animated spin), Synced (Emerald - auto-hides), Failed (Red - retry button).',
  '',
  'PAGES & FEATURES:',
  '[MAIN SECTION - All Users]',
  '- Dashboard (/dashboard): Readiness Index %, Karma Points, priority gaps.',
  '- Skill Gap (/skill-gap): Custom Radar Chart. Formula: (Target - Current) * Priority Weight (Critical=3, Important=2, Desirable=1).',
  '- Assessment (/assessment/comp-capi): 3-stage adaptive test runner (Medium -> Hard/Easy -> L1-L5). Works 100% offline via IndexedDB; syncs idempotently via local_id on reconnect.',
  '- Pathways (/pathways): iGOT course recommendations ranked by gap severity.',
  '- Profile (/profile): Official cadre details, growth timeline. Badges: Assessment-Verified vs Self-Assessed.',
  '',
  '[CONTENT SECTION - Trainers]',
  '- Documents (/documents): Upload MoSPI PDFs directly to Firebase Storage.',
  '- MCQ Generator (/mcq-generator): AI batch generation, stage 5a competency sanity check.',
  '- Review Queue (/review-queue): Triage AI questions, sorted low-confidence first.',
  '',
  '[ADMIN SECTION - Admins]',
  '- Admin Analytics (/admin/analytics): Macro readiness, simulated e-SIGMA outcome correlation chart, "Flag for Priority Training" write-back action.',
  '',
  'RESPONSE STYLE:',
  '- START DIRECTLY: Begin immediately with the answer or action. Omit pleasantries, meta-commentary, and conversational fluff (e.g. "Sure!", "Certainly!", "Here is the information").',
  '- Keep responses visually clean, structured, concise, and easy to read in a small chat window.',
  '- CLEAN TYPOGRAPHY (DO NOT OVERUSE **): Avoid repeating double asterisks (**). Do NOT wrap every bullet title or every phrase in **. Use plain clean text with emojis for sections. Bold at most 1-2 primary phrases per answer when strictly necessary.',
  '- Avoid heavy markdown headers (###) or dividers (---). Instead, use clean emoji-led bullet points (e.g. 📊 Dashboard, 🎯 Skill Gaps).',
  '- Use bullet points for lists and wrap platform routes in backticks like `/skill-gap` or `/pathways`.',
  '- Label gap priorities clearly like (Critical gap) or (Important gap) so the UI can highlight them.',
  '- Be concise, warm, and direct. Help the user take immediate action with linkable routes.',
  '- Personalize responses using the active user context when available.',
  '- For any topic outside the platform, answer freely without restriction.',
  '',
  'TONE: Expert, direct, concise, and helpful.',
].join('\n');


export interface CopilotUserContext {
  role?: string;
  cadre?: string;
  name?: string;
  designation?: string;
  readinessIndex?: number;
  topGaps?: Array<{ competency: string; levelDelta: number; priority: string }>;
  preferredLanguage?: 'en' | 'hi' | string;
}

export function getSystemPromptWithContext(userContext?: CopilotUserContext): string {
  if (!userContext) return STATVIDYA_MANIFESTO;

  const gapsStr = userContext.topGaps?.length
    ? userContext.topGaps
        .map((g) => g.competency + ' (-' + g.levelDelta + ', ' + g.priority + ')')
        .join(' | ')
    : 'None identified yet';

  const readiness =
    userContext.readinessIndex !== undefined
      ? userContext.readinessIndex + '%'
      : 'N/A';

  const isHindi = userContext.preferredLanguage === 'hi';

  const contextBlock = [
    '[ACTIVE USER CONTEXT]',
    'Name: ' + (userContext.name || 'User'),
    'Role: ' + (userContext.role || 'learner') + ' | Cadre: ' + (userContext.cadre || 'NSSO (FOD)'),
    'Designation: ' + (userContext.designation || 'N/A'),
    'Readiness: ' + readiness,
    'Priority Gaps: ' + gapsStr,
    'Preferred Interface Language: ' + (isHindi ? 'Hindi (हिन्दी)' : 'English'),
    isHindi
      ? 'CRITICAL DIRECTIVE: The user has selected HINDI as their platform language. You MUST respond in fluent, professional HINDI (देवनागरी लिपि) while keeping route paths in backticks like `/dashboard` or `/skill-gap`. Address the user politely in Hindi. Do not overuse asterisks (**).'
      : 'DIRECTIVE: Frame your response around resolving these specific gaps using the platform routes above. Address the user by name in English. Do not overuse asterisks (**).',
  ].join('\n');

  return STATVIDYA_MANIFESTO + '\n\n' + contextBlock;
}

/**
 * Offline fallback: phrase-based routing for when AI API is unreachable.
 * Uses multi-word patterns to avoid false matches on generic words.
 */
export function getOfflineFallbackResponse(message: string, isHindi = false): string {
  const lower = message.toLowerCase().trim();

  // Exact greetings (short messages only)
  if (lower.length < 30 && /^(hi|hey|hello|namaste|help|what can you do|नमस्ते|सहायता|मदद)[\s!?.]*$/.test(lower)) {
    if (isHindi) {
      return '🙏 नमस्ते! मैं आपका स्टैटविद्या कोपायलट (StatVidya Copilot) हूँ।\n\nमैं आपकी निम्नलिखित में सहायता कर सकता हूँ:\n- 📊 डैशबोर्ड और तैयारी सूचकांक — अपने प्राप्तांक और प्रगति को समझें\n- 🎯 कौशल अंतर (Skill Gaps) — कमियों की पहचान करें\n- 📝 अनुकूली मूल्यांकन (Assessments) — टेस्ट दें\n- 🛤️ अध्ययन पथ (Pathways) — iGOT कर्मयोगी पाठ्यक्रम खोजें\n- 🧭 नेविगेशन — मंच की किसी भी सुविधा तक तुरंत पहुँचें\n\nआप क्या खोजना चाहेंगे?';
    }
    return '🙏 Namaste! I\'m the StatVidya Copilot.\n\nI can help you with:\n- 📊 Dashboard & Readiness — understanding your scores\n- 🎯 Skill Gaps — identifying competency gaps\n- 📝 Assessments — taking adaptive tests\n- 🛤️ Pathways — finding iGOT courses\n- 🧭 Navigation — finding any platform feature\n\nWhat would you like to explore?';
  }

  // Platform-specific navigation (tight matches)
  if (/\b(go to|open|navigate|show|find|where is|where\'?s)\b.*\bdashboard\b/.test(lower) || lower === 'dashboard' || lower.includes('डैशबोर्ड')) {
    if (isHindi) {
      return '📊 डैशबोर्ड → साइडबार में `/dashboard` पर जाएं।\n\nयहाँ आप अपना तैयारी सूचकांक %, कर्म अंक, और प्राथमिक योग्यता अंतराल एक नज़र में देख सकते हैं।';
    }
    return '📊 Dashboard → Navigate to `/dashboard` in the sidebar.\n\nYou\'ll see your Readiness Index %, Karma Points, and priority competency gaps at a glance.';
  }
  if (/\b(skill.?gap|radar chart|my gaps|competency gap)\b/.test(lower) || lower.includes('कौशल') || lower.includes('अंतर')) {
    if (isHindi) {
      return '🎯 कौशल अंतर विश्लेषण → साइडबार में `/skill-gap` पर जाएं।\n\nआपके अंतराल की गणना: (लक्ष्य - वर्तमान) × प्राथमिकता भार द्वारा की जाती है। रडार चार्ट सभी योग्यताओं को प्रदर्शित करता है।';
    }
    return '🎯 Skill Gap Analysis → Navigate to `/skill-gap` in the sidebar.\n\nYour gaps are calculated using: (Target - Current) × Priority Weight where Critical=3, Important=2, Desirable=1. The radar chart visualises all competencies.';
  }
  if (/\b(take.*(assessment|test|quiz)|start.*(assessment|test|quiz)|assessment|adaptive test)\b/.test(lower) || lower.includes('मूल्यांकन') || lower.includes('परीक्षा')) {
    if (isHindi) {
      return '📝 मूल्यांकन → साइडबार में `/assessment/comp-capi` पर जाएं।\n\nयह 3-चरणीय अनुकूली परीक्षण मध्यम कठिनाई से शुरू होता है और आपके प्रदर्शन के आधार पर कठिन/सरल में विभाजित होता है। यह 100% ऑफ़लाइन भी कार्य करता है।';
    }
    return '📝 Assessment → Navigate to `/assessment/comp-capi` in the sidebar.\n\nThe 3-stage adaptive test starts at Medium difficulty, then branches to Hard/Easy based on your performance. It works 100% offline and syncs when you reconnect.';
  }
  if (/\b(pathway|igot|recommend.*course|suggest.*course|which course|learning path)\b/.test(lower) || lower.includes('कोर्स') || lower.includes('पाठ्यक्रम')) {
    if (isHindi) {
      return '🛤️ अध्ययन पथ → साइडबार में `/pathways` पर जाएं।\n\niGOT कर्मयोगी पाठ्यक्रम की सिफारिशें आपकी योग्यता अंतराल की गंभीरता के अनुसार क्रमबद्ध हैं।';
    }
    return '🛤️ Learning Pathways → Navigate to `/pathways` in the sidebar.\n\niGOT Karmayogi course recommendations are ranked by your gap severity — critical gaps surface first.';
  }
  if (/\b(my profile|view profile|edit profile|cadre detail|my badge)\b/.test(lower) || lower === 'profile' || lower.includes('प्रोफ़ाइल')) {
    if (isHindi) {
      return '👤 प्रोफ़ाइल → साइडबार में `/profile` पर जाएं या शीर्ष दाएँ कोने में अपने अवतार पर क्लिक करें।\n\nअपने आधिकारिक संवर्ग विवरण, संवृद्धि समयरेखा, और बैज देखें।';
    }
    return '👤 Profile → Navigate to `/profile` in the sidebar or click your avatar in the top-right.\n\nView your official cadre details, growth timeline, and badges: Assessment-Verified vs Self-Assessed.';
  }
  if (/\b(upload|document.*upload|upload.*pdf|mospi.*pdf)\b/.test(lower) || lower.includes('दस्तावेज़') || lower.includes('मैनुअल')) {
    if (isHindi) {
      return '📄 दस्तावेज़ → सामग्री अनुभाग में `/documents` पर जाएं।\n\nMoSPI प्रशिक्षण मैनुअल और दिशानिर्देश सीधे अपलोड करें।';
    }
    return '📄 Documents → Navigate to `/documents` under the Content section.\n\nUpload MoSPI PDFs directly. Files are stored on Firebase Storage.';
  }
  if (/\b(mcq|generate.*question|question.*generat)\b/.test(lower) || lower.includes('प्रश्न')) {
    if (isHindi) {
      return '🧠 MCQ जनरेटर → सामग्री अनुभाग में `/mcq-generator` पर जाएं।\n\nअपनी अपलोड की गई सामग्रियों से बहुविकल्पी प्रश्न स्वचालित रूप से तैयार करें।';
    }
    return '🧠 MCQ Generator → Navigate to `/mcq-generator` under the Content section.\n\nAI generates questions in batch from your uploaded materials, with a Stage 5a competency sanity check.';
  }
  if (/\b(review queue|triage|review.*question)\b/.test(lower) || lower.includes('समीक्षा')) {
    if (isHindi) {
      return '✅ समीक्षा कतार → सामग्री अनुभाग में `/review-queue` पर जाएं।\n\nतैयार प्रश्नों की मानवीय संकाय समीक्षा करें।';
    }
    return '✅ Review Queue → Navigate to `/review-queue` under the Content section.\n\nTriage AI-generated questions, sorted by confidence — low-confidence items surface first for human review.';
  }
  if (/\b(admin.*analytics|analytics.*dashboard|e.?sigma|flag.*training)\b/.test(lower) || lower.includes('विश्लेषण') || lower.includes('प्रशासन')) {
    if (isHindi) {
      return '📈 प्रशासनिक विश्लेषण → प्रशासन अनुभाग में `/admin/analytics` पर जाएं।\n\nराष्ट्रीय कार्यबल की तैयारी और क्षेत्रीय विश्लेषण की निगरानी करें।';
    }
    return '📈 Admin Analytics → Navigate to `/admin/analytics` under the Admin section.\n\nView macro readiness across the organization, e-SIGMA outcome correlation, and use "Flag for Priority Training" for write-back actions.';
  }
  if (/\b(offline|sync|work without internet|no internet)\b/.test(lower) || lower.includes('ऑफ़लाइन') || lower.includes('सिंक')) {
    if (isHindi) {
      return '📡 ऑफ़लाइन मोड: स्टैटविद्या बिना इंटरनेट के भी IndexedDB के माध्यम से कार्य करता है। जब आप इंटरनेट से जुड़ते हैं, तो डेटा स्वतः सिंक हो जाता है।';
    }
    return '📡 Offline Mode: StatVidya works offline for assessments via IndexedDB.\n\nLook for the status banner:\n- 🟡 Amber: Offline (N items pending)\n- 🔵 Blue: Syncing\n- 🟢 Emerald: All synced\n- 🔴 Red: Failed (retry button available)';
  }
  if (/\b(change language|switch.*language|hindi|toggle.*language)\b/.test(lower) || lower.includes('भाषा')) {
    if (isHindi) {
      return '🌐 भाषा परिवर्तन: आप शीर्ष पट्टी (Topbar) में भाषा बटन पर क्लिक करके कभी भी अंग्रेज़ी और हिन्दी के बीच बदल सकते हैं।';
    }
    return '🌐 Language: Use the language toggle button in the Topbar to switch between English (EN) and Hindi (HI).';
  }

  // Default
  if (isHindi) {
    return '🙏 मैं आपकी सहायता के लिए तैयार हूँ। आप मुझसे अपने डैशबोर्ड, कौशल अंतराल, मूल्यांकन, या iGOT पाठ्यक्रमों के बारे में पूछ सकते हैं!';
  }
  return '🤖 I\'m here to help you navigate StatVidya!\n\nYou can ask about:\n- "How do I take an assessment?"\n- "Show my skill gaps"\n- "Recommend courses for me"\n- "Navigate to dashboard"\n\nWhat platform feature can I help you find?';
}

