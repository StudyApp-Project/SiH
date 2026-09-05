-- StatVidya: Assessment Questions Seed Data
-- 16 Bilingual Questions grounded in official MoSPI / NSSO statistical protocols
-- Formatted for 3-Stage Adaptive Branching (Easy / Medium / Hard)

INSERT INTO questions (
  id,
  competency_id,
  organization_id,
  stem,
  stem_hi,
  options,
  correct_index,
  explanation,
  explanation_hi,
  difficulty,
  status,
  confidence,
  topic,
  provenance
) VALUES
-- ============================================================================
-- 1. COMPETENCY: Survey Sampling & Design (comp-survey-design)
-- ============================================================================

-- Q1: Medium (Stage 1 Entry)
(
  'q-sd-01'::UUID,
  'comp-survey-design'::UUID,
  'org-mospi-demo'::UUID,
  'In a multi-stage stratified sampling design used by NSSO, what is the typical First Stage Unit (FSU) in rural areas?',
  'एनएसएसओ द्वारा उपयोग किए जाने वाले बहु-स्तरीय स्तरीकृत नमूना डिजाइन में, ग्रामीण क्षेत्रों में सामान्य प्रथम चरण इकाई (FSU) क्या है?',
  '{
    "en": ["Census Village", "Urban Frame Survey (UFS) Block", "Household", "Gram Panchayat"],
    "hi": ["जनगणना ग्राम", "शहरी फ्रेम सर्वेक्षण (यूएफएस) ब्लॉक", "परिवार / गृहस्थी", "ग्राम पंचायत"]
  }'::jsonb,
  0,
  'In rural sectors, the 2011 Census villages are typically treated as the First Stage Units (FSUs).',
  'ग्रामीण क्षेत्रों में, 2011 की जनगणना के गांवों को आमतौर पर प्रथम चरण इकाई (FSU) के रूप में माना जाता है।',
  'medium',
  'approved',
  'high',
  'Sampling Frames & Units',
  'VERIFIED_OFFICIAL'
),

-- Q2: Hard (Stage 2A Branch)
(
  'q-sd-02'::UUID,
  'comp-survey-design'::UUID,
  'org-mospi-demo'::UUID,
  'When allocating sample FSUs across strata using Neyman Allocation, sample size per stratum is proportional to what product?',
  'नेयमैन आवंटन (Neyman Allocation) का उपयोग करके स्तरों में नमूना FSUs आवंटित करते समय, प्रति स्तर नमूना आकार किस गुणनफल के समानुपाती होता है?',
  '{
    "en": ["Stratum size (Nh) and stratum standard deviation (Sh)", "Stratum variance (Sh^2) and stratum mean (Yh)", "Stratum size (Nh) and stratum mean (Yh)", "Sampling fraction (fh) and stratum size (Nh)"],
    "hi": ["स्तर का आकार (Nh) और स्तर का मानक विचलन (Sh)", "स्तर का प्रसरण (Sh^2) और स्तर का माध्य (Yh)", "स्तर का आकार (Nh) और स्तर का माध्य (Yh)", "नमूना अंश (fh) और स्तर का आकार (Nh)"]
  }'::jsonb,
  0,
  'Neyman allocation determines sample size proportional to the product of stratum weight/size and stratum standard deviation (Nh * Sh).',
  'नेयमैन आवंटन नमूना आकार को स्तर के आकार और उसके मानक विचलन (Nh * Sh) के गुणनफल के अनुपात में निर्धारित करता है।',
  'hard',
  'approved',
  'high',
  'Sample Allocation Methods',
  'VERIFIED_OFFICIAL'
),

-- Q3: Easy (Stage 2B Branch)
(
  'q-sd-03'::UUID,
  'comp-survey-design'::UUID,
  'org-mospi-demo'::UUID,
  'What is the ultimate sampling unit (USU) in most socio-economic surveys conducted by NSSO?',
  'एनएसएसओ द्वारा आयोजित अधिकांश सामाजिक-आर्थिक सर्वेक्षणों में अंतिम प्रतिचयन इकाई (USU) क्या होती है?',
  '{
    "en": ["Household", "Village", "District", "Individual Person"],
    "hi": ["परिवार / गृहस्थी", "गांव", "जिला", "व्यक्तिगत नागरिक"]
  }'::jsonb,
  0,
  'In socio-economic rounds, the household is typically the Ultimate Stage Unit (USU) from which information is collected.',
  'सामाजिक-आर्थिक सर्वेक्षणों में, परिवार (गृहस्थी) आमतौर पर अंतिम चरण इकाई (USU) होती है जिससे जानकारी एकत्र की जाती है।',
  'easy',
  'approved',
  'high',
  'Sampling Units',
  'VERIFIED_OFFICIAL'
),

-- Q4: Hard (Stage 3 Mastery Calibration)
(
  'q-sd-04'::UUID,
  'comp-survey-design'::UUID,
  'org-mospi-demo'::UUID,
  'In circular systematic sampling of households, if sampling interval is I and random start is R, how is the j-th selected unit index determined?',
  'परिवारों के वृत्तीय व्यवस्थित प्रतिचयन (Circular Systematic Sampling) में, यदि अंतराल I और यादृच्छिक शुरुआत R है, तो j-वीं चयनित इकाई का सूचकांक कैसे निर्धारित होता है?',
  '{
    "en": ["(R + (j - 1) * I) mod N", "R + j * I", "(R * j) mod N", "R + (j - 1) * I"],
    "hi": ["(R + (j - 1) * I) mod N", "R + j * I", "(R * j) mod N", "R + (j - 1) * I"]
  }'::jsonb,
  0,
  'Circular systematic sampling computes the index as (R + (j - 1) * I) modulo total units N (with wrap-around handling).',
  'वृत्तीय व्यवस्थित प्रतिचयन में सूचकांक (R + (j - 1) * I) mod N के रूप में निकाला जाता है।',
  'hard',
  'approved',
  'high',
  'Systematic Sampling',
  'VERIFIED_OFFICIAL'
),

-- ============================================================================
-- 2. COMPETENCY: NSSO Protocol Mastery (comp-nsso-protocols)
-- ============================================================================

-- Q5: Medium (Stage 1 Entry)
(
  'q-np-01'::UUID,
  'comp-nsso-protocols'::UUID,
  'org-mospi-demo'::UUID,
  'According to NSSO Household Survey guidelines, who qualifies as a "normal member" of a household?',
  'एनएसएसओ पारिवारिक सर्वेक्षण दिशानिर्देशों के अनुसार, परिवार के "सामान्य सदस्य" के रूप में कौन योग्य है?',
  '{
    "en": ["Persons who normally live together and take meals from a common kitchen", "Any relative visiting during the survey period", "Anyone paying rent to the head of the house", "Only blood relatives living in the premises"],
    "hi": ["वे व्यक्ति जो सामान्यतः एक साथ रहते हैं और एक ही रसोई से भोजन करते हैं", "सर्वेक्षण अवधि के दौरान आने वाला कोई भी रिश्तेदार", "मकान के मुखिया को किराया देने वाला कोई भी व्यक्ति", "परिसर में रहने वाले केवल रक्त संबंधी"]
  }'::jsonb,
  0,
  'A household is defined as a group of persons normally living together and taking food from a common kitchen.',
  'एक परिवार को ऐसे व्यक्तियों के समूह के रूप में परिभाषित किया जाता है जो सामान्यतः एक साथ रहते हैं और एक ही रसोई से भोजन करते हैं।',
  'medium',
  'approved',
  'high',
  'Household Definition & Eligibility',
  'VERIFIED_OFFICIAL'
),

-- Q6: Hard (Stage 2A Branch)
(
  'q-np-02'::UUID,
  'comp-nsso-protocols'::UUID,
  'org-mospi-demo'::UUID,
  'In the Periodic Labour Force Survey (PLFS), how is "Current Weekly Status" (CWS) economic activity determined?',
  'आवधिक श्रम बल सर्वेक्षण (PLFS) में, "वर्तमान साप्ताहिक स्थिति" (CWS) आर्थिक गतिविधि का निर्धारण कैसे किया जाता है?',
  '{
    "en": ["Engaged in economic activity for at least 1 hour on any 1 day during the reference week", "Engaged in work for at least 4 hours daily for the entire week", "Worked for a majority of days during the preceding 365 days", "Having continuous formal employment during the last month"],
    "hi": ["संदर्भ सप्ताह के दौरान किसी भी 1 दिन कम से कम 1 घंटे के लिए आर्थिक गतिविधि में संलग्न होना", "पूरे सप्ताह प्रतिदिन कम से कम 4 घंटे काम करना", "पिछले 365 दिनों के दौरान अधिकांश दिनों में काम किया हो", "पिछले महीने के दौरान निरंतर औपचारिक रोजगार होना"]
  }'::jsonb,
  0,
  'Under CWS, a person is considered employed if they worked for at least 1 hour on any single day of the 7-day reference period.',
  'CWS के तहत, किसी व्यक्ति को नियोजित माना जाता है यदि उसने 7 दिनों की संदर्भ अवधि के किसी भी 1 दिन में कम से कम 1 घंटे काम किया हो।',
  'hard',
  'approved',
  'high',
  'PLFS Activity Status Rules',
  'VERIFIED_OFFICIAL'
),

-- Q7: Easy (Stage 2B Branch)
(
  'q-np-03'::UUID,
  'comp-nsso-protocols'::UUID,
  'org-mospi-demo'::UUID,
  'What is the standard reference period for collecting Usual Principal Activity Status in NSS rounds?',
  'एनएसएस दौरों में सामान्य प्रमुख गतिविधि स्थिति (Usual Principal Status) के लिए मानक संदर्भ अवधि क्या है?',
  '{
    "en": ["Preceding 365 days", "Preceding 7 days", "Preceding 30 days", "Preceding 15 days"],
    "hi": ["पिछले 365 दिन", "पिछले 7 दिन", "पिछले 30 दिन", "पिछले 15 दिन"]
  }'::jsonb,
  0,
  'The Usual Status approach uses a reference period of 365 days preceding the date of survey.',
  'सामान्य स्थिति (Usual Status) दृष्टिकोण सर्वेक्षण की तारीख से पहले के 365 दिनों की संदर्भ अवधि का उपयोग करता है।',
  'easy',
  'approved',
  'high',
  'Reference Periods',
  'VERIFIED_OFFICIAL'
),

-- Q8: Hard (Stage 3 Mastery Calibration)
(
  'q-np-04'::UUID,
  'comp-nsso-protocols'::UUID,
  'org-mospi-demo'::UUID,
  'When an FSU has a population exceeding 1,200 or 300 households, what mandatory protocol must the Field Investigator execute?',
  'जब किसी FSU की जनसंख्या 1,200 या 300 परिवारों से अधिक हो जाती है, तो क्षेत्र अन्वेषक को कौन सा अनिवार्य प्रोटोकॉल निष्पादित करना चाहिए?',
  '{
    "en": ["Form hamlet-groups (hg) or sub-blocks (sb) and sample among them", "Exclude the village from the sample and request a replacement", "Survey all households in the entire village without sampling", "Split the survey between two separate survey quarters"],
    "hi": ["टोला-समूह (hamlet-groups) या उप-ब्लॉक बनाएं और उनमें से नमूना चुनें", "गांव को नमूने से बाहर करें और प्रतिस्थापन का अनुरोध करें", "बिना किसी नमूने के पूरे गांव के सभी परिवारों का सर्वेक्षण करें", "सर्वेक्षण को दो अलग-अलग तिमाहियों में विभाजित करें"]
  }'::jsonb,
  0,
  'Large FSUs must be subdivided into approximately equal hamlet-groups (rural) or sub-blocks (urban) followed by random selection of designated hg/sb.',
  'बड़े FSUs को लगभग समान टोला-समूहों या उप-ब्लॉकों में विभाजित किया जाना चाहिए और फिर निर्दिष्ट hg/sb का चयन किया जाता है।',
  'hard',
  'approved',
  'high',
  'Hamlet Group Formation',
  'VERIFIED_OFFICIAL'
),

-- ============================================================================
-- 3. COMPETENCY: CAPI Tablet Operation (comp-capi-tablet)
-- ============================================================================

-- Q9: Medium (Stage 1 Entry)
(
  'q-ct-01'::UUID,
  'comp-capi-tablet'::UUID,
  'org-mospi-demo'::UUID,
  'When conducting field interviews with the CAPI application in areas with zero cellular connectivity, what is the required operational mode?',
  'शून्य सेलुलर कनेक्टिविटी वाले क्षेत्रों में CAPI एप्लिकेशन के साथ साक्षात्कार करते समय आवश्यक संचालन मोड क्या है?',
  '{
    "en": ["Offline data entry with encrypted local persistence and delayed auto-sync", "Pause interview until cellular connection is re-established", "Switch to paper schedules and discard electronic records", "Use Bluetooth transfer to neighboring village towers"],
    "hi": ["एन्क्रिप्टेड स्थानीय स्टोरेज और बाद में ऑटो-सिंक के साथ ऑफलाइन डेटा प्रविष्टि", "सेलुलर कनेक्शन बहाल होने तक साक्षात्कार रोकें", "कागजी अनुसूचियों पर स्विच करें और इलेक्ट्रॉनिक रिकॉर्ड हटा दें", "पड़ोसी गांव के टावरों पर ब्लूटूथ स्थानांतरण का उपयोग करें"]
  }'::jsonb,
  0,
  'CAPI tablets persist encrypted responses locally in SQLite/IndexedDB, queueing them for automatic sync upon reconnecting.',
  'सीएपीआई टैबलेट डेटा को स्थानीय रूप से सुरक्षित रखते हैं और नेटवर्क मिलने पर स्वचालित सिंक के लिए कतारबद्ध करते हैं।',
  'medium',
  'approved',
  'high',
  'Offline Data Synchronization',
  'VERIFIED_OFFICIAL'
),

-- Q10: Hard (Stage 2A Branch)
(
  'q-ct-02'::UUID,
  'comp-capi-tablet'::UUID,
  'org-mospi-demo'::UUID,
  'If a soft validation rule triggers a warning ("Value outside standard range") during expenditure data entry in CAPI, what is the protocol?',
  'यदि CAPI में व्यय डेटा प्रविष्टि के दौरान एक सॉफ्ट सत्यापन चेतावनी ("मान मानक सीमा से बाहर है") ट्रिगर होती है, तो प्रोटोकॉल क्या है?',
  '{
    "en": ["Re-verify with respondent, record supervisor remarks/explanation, and proceed", "Hard-lock the tablet and require central HQ administrator reset", "Round the value to the nearest permissible boundary value", "Delete the household record and substitute with neighbor"],
    "hi": ["उत्तरदाता के साथ पुन: पुष्टि करें, स्पष्टीकरण दर्ज करें और आगे बढ़ें", "टैबलेट को हार्ड-लॉक करें और मुख्यालय रीसेट की प्रतीक्षा करें", "मान को निकटतम स्वीकार्य सीमा तक पूर्णांकित करें", "परिवार का रिकॉर्ड हटाएं और पड़ोसी से बदलें"]
  }'::jsonb,
  0,
  'Soft validation warnings require confirmation and recording a justification remark before allowing the enumerator to proceed.',
  'सॉफ्ट सत्यापन चेतावनियों के लिए उत्तरदाता से पुष्टि और आगे बढ़ने से पहले टिप्पणी दर्ज करना आवश्यक है।',
  'hard',
  'approved',
  'high',
  'Validation Warning Protocols',
  'VERIFIED_OFFICIAL'
),

-- Q11: Easy (Stage 2B Branch)
(
  'q-ct-03'::UUID,
  'comp-capi-tablet'::UUID,
  'org-mospi-demo'::UUID,
  'What must a field investigator do prior to departing the FOD regional office for a multi-day village survey?',
  'कई दिनों के ग्रामीण सर्वेक्षण के लिए FOD क्षेत्रीय कार्यालय छोड़ने से पहले क्षेत्र अन्वेषक को क्या करना चाहिए?',
  '{
    "en": ["Download allotted FSU sample frames and ensure complete offline battery & storage readiness", "Upload completed blank forms to server", "Clear all application cache and system databases", "Change default system time to match GMT"],
    "hi": ["आवंटित FSU नमूना फ्रेम डाउनलोड करें और बैटरी व स्टोरेज की तत्परता सुनिश्चित करें", "सर्वर पर पूरे खाली फॉर्म अपलोड करें", "सभी एप्लिकेशन कैश और सिस्टम डेटाबेस साफ करें", "जीएमटी से मेल खाने के लिए सिस्टम का समय बदलें"]
  }'::jsonb,
  0,
  'Before proceeding to the field, investigators must pre-download sampling frames and verify tablet readiness.',
  'क्षेत्र में जाने से पहले अन्वेषकों को नमूना फ्रेम पहले से डाउनलोड करना और टैबलेट की तैयारी सुनिश्चित करनी चाहिए।',
  'easy',
  'approved',
  'high',
  'Pre-field Preparation',
  'VERIFIED_OFFICIAL'
),

-- Q12: Hard (Stage 3 Mastery Calibration)
(
  'q-ct-04'::UUID,
  'comp-capi-tablet'::UUID,
  'org-mospi-demo'::UUID,
  'What security mechanism guarantees non-repudiation of geo-tagged survey submissions on official CAPI devices?',
  'आधिकारिक CAPI उपकरणों पर भू-टैग किए गए सर्वेक्षण सबमिशन के गैर-अस्वीकरण (Non-repudiation) की गारंटी कौन सा सुरक्षा तंत्र देता है?',
  '{
    "en": ["Cryptographic digital signatures combining hardware tamper tokens, GPS timestamp, and enumerator PKI keys", "Plain text CSV exports emailed to the supervisor", "User login with standard 4-digit PIN", "Weekly manual register signatures"],
    "hi": ["हार्डवेयर सुरक्षा टोकन, जीपीएस टाइमस्टैम्प और पीकेआई कुंजियों को मिलाकर क्रिप्टोग्राफिक डिजिटल हस्ताक्षर", "पर्यवेक्षक को ईमेल किए गए सादे टेक्स्ट सीएसवी निर्यात", "मानक 4-अंकीय पिन के साथ उपयोगकर्ता लॉगिन", "साप्ताहिक हस्तलिखित रजिस्टर हस्ताक्षर"]
  }'::jsonb,
  0,
  'Field integrity relies on hardware-backed PKI signatures, GPS timestamp stamping, and HMAC message integrity.',
  'क्षेत्रीय डेटा की प्रामाणिकता हार्डवेयर समर्थित डिजिटल हस्ताक्षर और जीपीएस टाइमस्टैम्प पर निर्भर करती है।',
  'hard',
  'approved',
  'high',
  'Data Security & Integrity',
  'VERIFIED_OFFICIAL'
),

-- ============================================================================
-- 4. COMPETENCY: Communication & Reporting (comp-comm)
-- ============================================================================

-- Q13: Medium (Stage 1 Entry)
(
  'q-cm-01'::UUID,
  'comp-comm'::UUID,
  'org-mospi-demo'::UUID,
  'When presenting official statistics to non-technical policymakers, what is the best practice for communicating sampling errors?',
  'गैर-तकनीकी नीति निर्माताओं को आधिकारिक आंकड़े प्रस्तुत करते समय, नमूना त्रुटियों (Sampling Errors) को संप्रेषित करने का सर्वोत्तम अभ्यास क्या है?',
  '{
    "en": ["Provide concise confidence intervals with plain-language risk and precision interpretations", "Omit all variance metrics to avoid confusing the audience", "Only present raw mathematical formulas without numerical values", "Report only single-point estimates as absolute certainty"],
    "hi": ["सरल भाषा में व्याख्या के साथ संक्षिप्त विश्वास अंतराल (Confidence Intervals) प्रदान करें", "श्रोताओं को भ्रमित करने से बचने के लिए सभी भिन्नता मीट्रिक छोड़ दें", "संख्यात्मक मानों के बिना केवल कच्चे गणितीय सूत्र प्रस्तुत करें", "एकल-बिंदु अनुमानों को पूर्ण निश्चितता के रूप में प्रस्तुत करें"]
  }'::jsonb,
  0,
  'Statistical guidelines encourage communicating precision clearly via confidence intervals and understandable summaries.',
  'सांख्यिकीय दिशानिर्देश विश्वास अंतराल और समझने योग्य सारांशों के माध्यम से स्पष्टता से संप्रेषित करने को प्रोत्साहित करते हैं।',
  'medium',
  'approved',
  'high',
  'Statistical Dissemination Standards',
  'PROPOSED_FRAMEWORK'
),

-- Q14: Hard (Stage 2A Branch)
(
  'q-cm-02'::UUID,
  'comp-comm'::UUID,
  'org-mospi-demo'::UUID,
  'Under the UN Fundamental Principles of Official Statistics, how must national statistical agencies handle erroneous interpretations of data in the media?',
  'आधिकारिक सांख्यिकी के संयुक्त राष्ट्र मूलभूत सिद्धांतों के तहत, राष्ट्रीय सांख्यिकीय एजेंसियों को मीडिया में आंकड़ों की गलत व्याख्या को कैसे संभालना चाहिए?',
  '{
    "en": ["Issue prompt, transparent, and factual public clarifications explaining the correct methodology", "Immediately sue the news publication without issuing clarifications", "Privately alter future data releases to conform to media interpretation", "Remain strictly silent and avoid public commentary"],
    "hi": ["सही कार्यप्रणाली की व्याख्या करते हुए त्वरित, पारदर्शी और तथ्यात्मक सार्वजनिक स्पष्टीकरण जारी करें", "स्पष्टीकरण जारी किए बिना तुरंत समाचार प्रकाशन पर मुकदमा करें", "मीडिया की व्याख्या के अनुरूप भविष्य के डेटा विज्ञप्ति को बदलें", "पूरी तरह चुप रहें और सार्वजनिक टिप्पणी से बचें"]
  }'::jsonb,
  0,
  'Principle 4 of UN Fundamental Principles states agencies are entitled to comment on erroneous interpretation and misuse of statistics.',
  'संयुक्त राष्ट्र सिद्धांत 4 के अनुसार सांख्यिकीय एजेंसियों को आंकड़ों के दुरुपयोग और गलत व्याख्या पर तथ्यात्मक टिप्पणी करने का अधिकार है।',
  'hard',
  'approved',
  'high',
  'UN Fundamental Principles',
  'PROPOSED_FRAMEWORK'
),

-- Q15: Easy (Stage 2B Branch)
(
  'q-cm-03'::UUID,
  'comp-comm'::UUID,
  'org-mospi-demo'::UUID,
  'What is the primary objective of publishing a Data Release Calendar by statistical offices?',
  'सांख्यिकीय कार्यालयों द्वारा डेटा रिलीज कैलेंडर प्रकाशित करने का मुख्य उद्देश्य क्या है?',
  '{
    "en": ["Ensure transparency, predictability, and equal access to data for all stakeholders", "Provide advance notice only to selected commercial trading firms", "Comply with international holiday schedules", "Allow ministries to pre-approve politically sensitive findings"],
    "hi": ["सभी हितधारकों के लिए डेटा की पारदर्शिता, पूर्वानुमेयता और समान पहुंच सुनिश्चित करना", "केवल चयनित वाणिज्यिक फर्मों को अग्रिम सूचना प्रदान करना", "अंतर्राष्ट्रीय अवकाश कार्यक्रम का पालन करना", "मंत्रालयों को निष्कर्षों को पूर्व-स्वीकृत करने की अनुमति देना"]
  }'::jsonb,
  0,
  'Advance release calendars guarantee impartial, predictable, and simultaneous access to all users.',
  'अग्रिम रिलीज कैलेंडर सभी उपयोगकर्ताओं को निष्पक्ष और समयबद्ध पहुंच की गारंटी देता है।',
  'easy',
  'approved',
  'high',
  'Data Dissemination Policy',
  'PROPOSED_FRAMEWORK'
),

-- Q16: Hard (Stage 3 Mastery Calibration)
(
  'q-cm-04'::UUID,
  'comp-comm'::UUID,
  'org-mospi-demo'::UUID,
  'When publishing microdata files for public research, what anonymization technique is standard to protect respondent confidentiality?',
  'सार्वजनिक अनुसंधान के लिए माइक्रोडाटा फाइलें प्रकाशित करते समय, उत्तरदाता की गोपनीयता की रक्षा के लिए कौन सी तकनीक मानक है?',
  '{
    "en": ["De-identification (removing direct identifiers) combined with k-anonymity / top-coding of sensitive continuous variables", "Publishing exact names but removing mobile phone numbers", "Converting all numerical variables into random dummy values", "Password-protecting the file with a single public password"],
    "hi": ["डी-आइडेंटिफिकेशन (पहचान हटाना) और संवेदनशील चरों का k-अनामता / टॉप-कोडिंग", "सटीक नाम प्रकाशित करना लेकिन मोबाइल नंबर हटाना", "सभी संख्यात्मक चरों को यादृच्छिक मानों में बदलना", "फ़ाइल को एकल सार्वजनिक पासवर्ड से सुरक्षित करना"]
  }'::jsonb,
  0,
  'Microdata disclosure control applies strict de-identification, top/bottom coding of outliers, and perturbation to ensure confidentiality.',
  'माइक्रोडाटा सुरक्षा में गोपनीयता सुनिश्चित करने के लिए प्रत्यक्ष पहचानकर्ता हटाना और संवेदनशील डेटा की टॉप-कोडिंग शामिल है।',
  'hard',
  'approved',
  'high',
  'Microdata Confidentiality Protocols',
  'PROPOSED_FRAMEWORK'
);
