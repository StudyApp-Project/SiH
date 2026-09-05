/**
 * src/app/(app)/assessment/[id]/page.tsx
 *
 * Assessment page: Server component that fetches assessment and passes to client
 */

import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import AssessmentClient from './AssessmentClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssessmentPage({ params }: PageProps) {
  const { id: competencyId } = await params;
  const supabase = await getSupabaseServerClient();

  // Get user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  // Fetch competency details
  const { data: competency, error: compError } = await supabase
    .from('competencies')
    .select('*')
    .eq('id', competencyId)
    .single();

  if (compError || !competency) {
    // If not found in database, fallback to a sensible default if demo
    redirect('/dashboard');
  }

  // Fetch Stage 1 question (Medium difficulty calibration)
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('*')
    .eq('competency_id', competencyId)
    .eq('difficulty', 'medium')
    .limit(1);

  // Fallback question if database doesn't have it yet (e.g. offline or unseeded)
  let firstQuestion = null;

  if (questions && questions.length > 0) {
    const q = questions[0];
    const optionsEn = Array.isArray(q.options?.en) ? q.options.en : ['Option A', 'Option B', 'Option C', 'Option D'];
    const optionsHi = Array.isArray(q.options?.hi) ? q.options.hi : optionsEn;

    firstQuestion = {
      id: q.id,
      question_text: q.stem,
      question_text_hi: q.stem_hi || q.stem,
      answer_choices: optionsEn,
      answer_choices_hi: optionsHi,
      difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
      stage: 1,
    };
  } else {
    firstQuestion = {
      id: `q-${competencyId}-1`,
      question_text: `Initial assessment question for ${competency.name}`,
      question_text_hi: `${competency.name_hi || competency.name} के लिए प्रारंभिक मूल्यांकन प्रश्न`,
      answer_choices: [
        'Adhere to standard operational protocols',
        'Bypass verification to save time',
        'Submit estimates without raw records',
        'Delegate critical tasks without supervision',
      ],
      answer_choices_hi: [
        'मानक परिचालन प्रोटोकॉल का पालन करें',
        'समय बचाने के लिए सत्यापन छोड़ें',
        'कच्चे रिकॉर्ड के बिना अनुमान प्रस्तुत करें',
        'बिना पर्यवेक्षण के महत्वपूर्ण कार्य सौंपें',
      ],
      difficulty: 'medium' as const,
      stage: 1,
    };
  }

  return (
    <div className="min-h-screen bg-background">
      <AssessmentClient
        competencyId={competencyId}
        competencyName={competency.name}
        competencyNameHi={competency.name_hi}
        firstQuestion={firstQuestion}
        userId={user.id}
      />
    </div>
  );
}
