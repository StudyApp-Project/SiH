import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <ProfileClient />;
}
