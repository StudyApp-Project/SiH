import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import SkillGapClient from './SkillGapClient';

export const dynamic = 'force-dynamic';

export default async function SkillGapPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <SkillGapClient />;
}