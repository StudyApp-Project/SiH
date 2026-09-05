/**
 * src/app/(app)/assessment/[id]/page.tsx
 *
 * Assessment page: Server component that fetches assessment and passes to client
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import AssessmentClient from './AssessmentClient';

interface PageProps {
  params: { id: string };
}

export default async function AssessmentPage({ params }: PageProps) {
  const supabase = createClient();

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
    .eq('id', params.id)
    .single();

  if (compError || !competency) {
    redirect('/dashboard');
  }

  // Fetch Stage 1 question (Medium difficulty calibration)
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('*')
    .eq('competency_id', params.id)
    .eq('stage', 1)
    .limit(1);

  if (qError || !questions || questions.length === 0) {
    // No questions available for this competency
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      <AssessmentClient
        competencyId={params.id}
        competencyName={competency.name}
        competencyNameHi={competency.name_hi}
        firstQuestion={questions[0]}
        userId={user.id}
      />
    </div>
  );
}
