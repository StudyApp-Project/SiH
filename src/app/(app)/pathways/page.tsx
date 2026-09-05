import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import PathwaysClient from './PathwaysClient';

export const dynamic = 'force-dynamic';

export default async function PathwaysPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <PathwaysClient />;
}