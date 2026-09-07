'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { type GeneratedQuestion } from '@/services/mcqService';
import { Sparkles, RefreshCw, BookOpen, Bot, FileText, SlidersHorizontal, Hash, CheckCircle2 } from 'lucide-react';
import { DocumentPracticeCard, type AnswerRecord } from '@/components/mcq/DocumentPracticeCard';
import { Skeleton } from '@/components/ui/Skeleton';

interface IngestedDoc {
  id: string;
  title: string;
  cadre: string;
  competencyId: string;
  competencyName: string;
  citation: string;
  chunks?: Array<{ text: string; metadata?: { section?: string; pageNumber?: number; wordCount?: number } }>;
}

const COMPETENCY_NAME_MAP: Record<string, string> = {
  'comp-capi': 'CAPI Tablet Operation',
  'comp-nsso': 'NSSO Protocol Mastery',
  'comp-survey': 'Survey Sampling & Design',
  'comp-data': 'Data Entry & Scrutiny Rules',
  'comp-demarcation': 'Block Demarcation & Urban Frame Survey',
  'comp-scrutiny': 'Field Scrutiny & Validation Rules',
};

const INGESTED_DOCS: IngestedDoc[] = [
  {
    id: 'doc-plfs-2024',
    title: 'Periodic Labour Force Survey (PLFS) — Field Staff Instructions Manual 2024-25',
    cadre: 'Field Operations Division (FOD)',
    competencyId: 'comp-capi',
    competencyName: 'CAPI Tablet Operation',
    citation: 'PLFS Manual 2024, Chapter 3: Household Listing & Mobile Verification Protocol',
  },
  {
    id: 'doc-nsso-instructions',
    title: 'NSSO FOD Operational Guidelines & Village Cadastral Scrutiny (Vol. 1)',
    cadre: 'Subordinate Statistical Service (SSS)',
    competencyId: 'comp-nsso',
    competencyName: 'NSSO Protocol Mastery',
    citation: 'NSSO FOD Guidelines Vol. 1, Section 4.2: Hamlets Demarcation & Schedule 0.0 Scrutiny',
  },
  {
    id: 'doc-nssta-sampling',
    title: 'NSSTA Training Module — Advanced Sampling Techniques & Multi-Stage Stratification',
    cadre: 'Indian Statistical Service (ISS)',
    competencyId: 'comp-survey',
    competencyName: 'Survey Sampling & Design',
    citation: 'NSSTA Module 4: Stratified Multi-Stage Cluster Variance & Design Effect (DEFF)',
  },
  {
    id: 'doc-cpi-rural-urban',
    title: 'Consumer Price Index (CPI) Rural & Urban Price Collection Manual 2024',
    cadre: 'Field Operations Division (FOD)',
    competencyId: 'comp-capi',
    competencyName: 'CAPI Tablet Operation',
    citation: 'CPI Price Collection Manual 2024, Section 2: Specification Matching & Substitution',
  },
];

function MCQGeneratorInner() {
  const searchParams = useSearchParams();
  const initialComp = searchParams.get('competency');
  const matchedDoc = initialComp ? INGESTED_DOCS.find((d) => d.competencyId === initialComp)?.id : null;
  const initialDocId = searchParams.get('docId') || matchedDoc || 'doc-plfs-2024';
  const initialDocTitle = searchParams.get('docTitle');

  // Build initial list including URL passed custom doc if not already present
  const [docList, setDocList] = useState<IngestedDoc[]>(() => {
    if (initialDocId && initialDocTitle && !INGESTED_DOCS.some((d) => d.id === initialDocId)) {
      return [
        {
          id: initialDocId,
          title: decodeURIComponent(initialDocTitle),
          cadre: 'My Uploaded Document',
          competencyId: initialComp || 'comp-capi',
          competencyName: COMPETENCY_NAME_MAP[initialComp || ''] || 'Statistical Competency',
          citation: `${decodeURIComponent(initialDocTitle)}, Section 1`,
        },
        ...INGESTED_DOCS,
      ];
    }
    return INGESTED_DOCS;
  });

  const [selectedDocId, setSelectedDocId] = useState(initialDocId);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionFocus, setQuestionFocus] = useState<'protocols' | 'thresholds' | 'scrutiny'>('protocols');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<GeneratedQuestion | null>(null);
  const [questionList, setQuestionList] = useState<GeneratedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState<Record<number, AnswerRecord>>({});
  const [stagedToQueue, setStagedToQueue] = useState(false);
  const [approvedToBank, setApprovedToBank] = useState(false);
  const [viewMode, setViewMode] = useState<'practice' | 'inspector'>('practice');

  const activeQuestion = questionList[currentIndex] || generatedQuestion;

  useEffect(() => {
    if (!activeQuestion) {
      setStagedToQueue(false);
      setApprovedToBank(false);
      return;
    }
    try {
      const existingRaw = localStorage.getItem('statvidya_review_queue');
      const queue = existingRaw ? JSON.parse(existingRaw) : [];
      const item = queue.find(
        (q: { id?: string; stem?: string }) =>
          (activeQuestion.id && q.id === activeQuestion.id) ||
          q.stem === activeQuestion.stemEn
      );
      if (item) {
        if (item.status === 'APPROVED') {
          setApprovedToBank(true);
          setStagedToQueue(false);
        } else {
          setStagedToQueue(true);
          setApprovedToBank(false);
        }
      } else {
        setStagedToQueue(false);
        setApprovedToBank(false);
      }
    } catch {
      // ignore
    }
  }, [activeQuestion, currentIndex]);

  // Fetch live documents from backend Firestore
  useEffect(() => {
    let active = true;
    fetch('/api/documents')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.documents) return;
        interface ApiDoc {
          id: string;
          title: string;
          filename?: string;
          userId?: string;
          targetCompetencies?: string[];
          chunks?: Array<{ text: string; metadata?: { section?: string; pageNumber?: number; wordCount?: number } }>;
        }
        const mapped: IngestedDoc[] = data.documents.map((d: ApiDoc) => {
          const compId = d.targetCompetencies?.[0] || 'comp-capi';
          const compName = COMPETENCY_NAME_MAP[compId] || 'Statistical Competency';
          const isUserUpload = d.userId && d.userId !== 'public' && d.userId !== 'system';
          return {
            id: d.id,
            title: d.title,
            cadre: isUserUpload ? 'My Upload' : 'Official MoSPI Guide',
            competencyId: compId,
            competencyName: compName,
            citation: `${d.title} (${d.filename || 'manual'})`,
            chunks: d.chunks,
          };
        });

        const existingIds = new Set(mapped.map((m) => m.id));
        const nonDupDefaults = INGESTED_DOCS.filter((d) => !existingIds.has(d.id));
        const combined = [...mapped, ...nonDupDefaults];
        setDocList(combined);

        if (initialDocId && combined.some((d) => d.id === initialDocId)) {
          setSelectedDocId(initialDocId);
        }
      })
      .catch((err) => console.warn('Could not fetch documents for MCQ generator:', err));

    return () => {
      active = false;
    };
  }, [initialDocId]);

  const activeDoc = docList.find((d) => d.id === selectedDocId) || docList[0] || INGESTED_DOCS[0];
  const competencyId = activeDoc.competencyId;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStagedToQueue(false);
    setApprovedToBank(false);
    setSessionAnswers({});

    try {
      const res = await fetch('/api/mcq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competencyId,
          difficulty,
          topicPrompt: activeDoc.title,
          citationSource: activeDoc.citation,
          docTitle: activeDoc.title,
          docText: activeDoc.chunks?.[0]?.text || activeDoc.title,
          questionFocus,
          count: questionCount,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const questions: GeneratedQuestion[] = data.questions || (data.question ? [data.question] : []);
        if (questions.length > 0) {
          questions.forEach((q) => {
            q.citation = activeDoc.citation;
          });
          setQuestionList(questions);
          setGeneratedQuestion(questions[0]);
          setCurrentIndex(0);
        }
      }
    } catch (err) {
      console.error('Failed to generate questions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePushToReview = (customStatus: 'PENDING' | 'APPROVED' = 'PENDING') => {
    const qToPush = questionList[currentIndex] || generatedQuestion;
    if (!qToPush) return;

    try {
      const existingRaw = localStorage.getItem('statvidya_review_queue');
      const queue = existingRaw ? JSON.parse(existingRaw) : [];

      const newItem = {
        id: qToPush.id || `rq-${Date.now()}`,
        competency: activeDoc.competencyName,
        stem: qToPush.stemEn,
        stemHi: qToPush.stemHi,
        options: qToPush.optionsEn,
        optionsHi: qToPush.optionsHi,
        correctIndex: qToPush.correctIndex,
        citation: qToPush.citation,
        consensusScore: qToPush.consensusScore,
        status: customStatus,
        sourceDoc: activeDoc.title,
        createdAt: new Date().toISOString(),
      };

      const updated = [
        newItem,
        ...queue.filter(
          (item: { id: string; stem?: string }) =>
            item.id !== newItem.id && item.stem !== newItem.stem
        ),
      ];
      localStorage.setItem('statvidya_review_queue', JSON.stringify(updated));
      if (customStatus === 'APPROVED') {
        setApprovedToBank(true);
        setStagedToQueue(false);
      } else {
        setStagedToQueue(true);
        setApprovedToBank(false);
      }
    } catch (err) {
      console.error('Failed to stage item to review queue:', err);
      if (customStatus === 'APPROVED') {
        setApprovedToBank(true);
      } else {
        setStagedToQueue(true);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              MoSPI Practice & Calibration
            </span>
            <span className="text-xs text-stone-500">• Clause 4.3 FRAC Calibrated Generator</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Document Practice & MCQ Station
          </h1>
          <p className="text-sm text-stone-600">
            Generate authentic self-paced questions grounded in your uploaded manuals and official MoSPI guidelines.
          </p>
        </div>
        <ProvenanceBadge provenance="PROPOSED_METHODOLOGY" />
      </div>

      {/* Generator & Composition Controls */}
      <Card className="border-stone-200 bg-white shadow-xs">
        <CardHeader className="bg-stone-50/50 border-b border-stone-100 pb-4">
          <CardTitle className="text-base font-semibold text-stone-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#8b9a6e]" />
            Document Grounding & Question Composition
          </CardTitle>
          <CardDescription className="text-xs text-stone-500">
            Select an ingested manual and tailor difficulty and operational focus for question generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Document Grounding Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Ingested MoSPI Document Grounding
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full text-xs sm:text-sm border border-stone-300 rounded-lg p-2.5 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8b9a6e]"
              >
                {docList.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.cadre === 'My Upload' ? `📁 [My Upload] ${doc.title}` : `[${doc.cadre}] ${doc.title}`}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 truncate">
                <BookOpen className="h-3 w-3 text-amber-600 shrink-0" />
                <span className="truncate">{activeDoc.citation}</span>
              </p>
            </div>

            {/* Difficulty Calibration */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Target Difficulty Calibration
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full text-xs sm:text-sm border border-stone-300 rounded-lg p-2.5 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8b9a6e]"
              >
                <option value="medium">Medium (L3 Operational Field Work)</option>
                <option value="easy">Easy (L1-L2 Foundational Recall)</option>
                <option value="hard">Hard (L4-L5 Advanced Scrutiny & Edge Cases)</option>
              </select>
              <p className="text-[11px] text-stone-500 mt-1">
                Competency: <span className="font-semibold text-[#7a885f]">{activeDoc.competencyName}</span>
              </p>
            </div>

            {/* Question Composition Focus */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Question Composition Focus
              </label>
              <select
                value={questionFocus}
                onChange={(e) => setQuestionFocus(e.target.value as 'protocols' | 'thresholds' | 'scrutiny')}
                className="w-full text-xs sm:text-sm border border-stone-300 rounded-lg p-2.5 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8b9a6e]"
              >
                <option value="protocols">Operational Field Protocols & SOPs</option>
                <option value="thresholds">Numerical Cutoffs, Limits & Rules</option>
                <option value="scrutiny">Data Scrutiny & Discrepancy Checks</option>
              </select>
              <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                <SlidersHorizontal className="h-3 w-3 text-[#555934]" />
                Targeted cognitive framing
              </p>
            </div>

            {/* Question Volume Slider (1 to 25) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5 text-[#555934]" />
                  Question Volume
                </label>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#555934]/10 text-[#555934] border border-[#555934]/20">
                  {questionCount} {questionCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Slider between 1 and 25 */}
              <input
                type="range"
                min={1}
                max={25}
                step={1}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full accent-[#555934] cursor-pointer h-2 bg-stone-200 rounded-lg"
              />

              {/* Preset selection chips */}
              <div className="flex items-center justify-between gap-1 mt-2">
                {[1, 5, 10, 25].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuestionCount(preset)}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded transition ${
                      questionCount === preset
                        ? 'bg-[#555934] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {preset} Q{preset > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Engine: <strong>MoSPI Cognitive Engine</strong> • Verified contextual inference
            </span>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#555934] hover:bg-primary-dark text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition active:scale-95 disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating {questionCount} Items...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate {questionCount} {questionCount === 1 ? 'Question' : 'Questions'}
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Result: Interactive Practice Mode or Admin Inspector */}
      {generatedQuestion && (
        <div className="space-y-4">
          {/* Mode Switcher */}
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-semibold text-stone-500">
              Active Session: <strong>{questionList.length || 1} Questions Generated</strong>
            </div>
            <div className="flex rounded-lg bg-stone-100 p-1 border border-stone-200">
              <button
                onClick={() => setViewMode('practice')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  viewMode === 'practice'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Self-Paced Practice
              </button>
              <button
                onClick={() => setViewMode('inspector')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  viewMode === 'inspector'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Faculty Inspector
              </button>
            </div>
          </div>

          {viewMode === 'practice' ? (
            <DocumentPracticeCard
              key={`${activeQuestion.id}-${currentIndex}`}
              question={activeQuestion}
              docTitle={activeDoc.title}
              difficulty={difficulty}
              currentIndex={currentIndex}
              totalCount={questionList.length || 1}
              sessionAnswers={sessionAnswers}
              onRecordAnswer={(qIdx, optIdx, isChecked) => {
                setSessionAnswers((prev) => ({
                  ...prev,
                  [qIdx]: { selectedIndex: optIdx, isChecked },
                }));
              }}
              onNextQuestion={() => setCurrentIndex((prev) => Math.min(questionList.length - 1, prev + 1))}
              onPreviousQuestion={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              onJumpToQuestion={(idx) => setCurrentIndex(idx)}
              onResetSession={handleGenerate}
              isGeneratingNext={isGenerating}
              onStageToQueue={() => handlePushToReview('PENDING')}
              stagedToQueue={stagedToQueue}
              onApproveToBank={() => handlePushToReview('APPROVED')}
              approvedToBank={approvedToBank}
            />
          ) : (
            <Card className="border-stone-200 bg-white shadow-sm">
              <CardHeader className="border-b border-stone-100 pb-4 bg-stone-50/40">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-stone-900">
                      Faculty Quality & Distractor Breakdown
                    </CardTitle>
                    <CardDescription className="text-xs text-stone-500 flex items-center gap-2 mt-1">
                      <Bot className="h-3.5 w-3.5 text-blue-600" />
                      Evaluated by {activeQuestion.modelsEvaluated.join(', ')}
                    </CardDescription>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                    Consensus Score: {(activeQuestion.consensusScore * 100).toFixed(0)}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold text-stone-500 block mb-1">ENGLISH STEM</span>
                  <p className="text-sm font-medium text-stone-900">{activeQuestion.stemEn}</p>
                  <span className="text-xs font-bold text-stone-500 block mt-3 mb-1">HINDI STEM</span>
                  <p className="text-sm font-medium text-stone-900">{activeQuestion.stemHi}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-500 block">OPTIONS & VERIFIED KEY</span>
                  {activeQuestion.optionsEn.map((opt, idx) => {
                    const isCorrect = idx === activeQuestion.correctIndex;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-3 ${
                          isCorrect
                            ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 font-medium'
                            : 'border-stone-200 bg-white text-stone-700'
                        }`}
                      >
                        <span className="font-bold">{String.fromCharCode(65 + idx)}.</span>
                        <div className="flex-1">
                          <div>{opt}</div>
                          <div className="text-xs text-stone-500 mt-0.5">{activeQuestion.optionsHi[idx]}</div>
                        </div>
                        {isCorrect && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Key
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                  <strong>MoSPI Justification:</strong> {activeQuestion.rationaleEn}
                  <div className="mt-1 text-amber-800 font-medium">Source: {activeQuestion.citation}</div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                  <button
                    onClick={() => handlePushToReview('PENDING')}
                    disabled={stagedToQueue || approvedToBank}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 disabled:bg-stone-100 disabled:text-stone-400 text-xs font-bold rounded-lg transition border border-stone-300"
                  >
                    {stagedToQueue && !approvedToBank ? 'Staged in Faculty Queue' : 'Stage into Review Queue'}
                  </button>
                  <button
                    onClick={() => handlePushToReview('APPROVED')}
                    disabled={approvedToBank}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-200 disabled:text-emerald-800 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {approvedToBank ? 'Certified & Approved into Exam Bank' : 'Certify & Approve into Exam Bank'}
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function MCQGeneratorPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-5xl mx-auto py-6 animate-fadeIn">
          <div className="rounded-2xl bg-white p-6 shadow-card space-y-3">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      }
    >
      <MCQGeneratorInner />
    </Suspense>
  );
}

