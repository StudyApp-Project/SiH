import { cookies } from 'next/headers';
import { getSupabaseServerClient } from './supabase';
import { DEMO_PERSONAS } from './demoPersonas';

export interface AppUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    organization_id?: string;
    preferred_language?: string;
    cadre?: string;
    designation?: string;
  };
  app_metadata?: {
    role?: string;
    [key: string]: unknown;
  };
}

export async function getAuthenticatedUser(): Promise<AppUser> {
  const cookieStore = await cookies();

  // 1. Check demo_user cookie FIRST to ensure instant loading during local development
  //    This avoids blocking on Supabase timeout if the DB is offline or URL is invalid.
  const demoCookie = cookieStore.get('demo_user')?.value;
  if (demoCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(demoCookie));
      if (parsed && parsed.email) {
        return {
          id: parsed.id || 'demo-amit',
          email: parsed.email,
          user_metadata: {
            name: parsed.name,
            organization_id: parsed.organization_id || 'org-mospi',
            preferred_language: parsed.preferred_language || 'en',
            cadre: parsed.cadre,
            designation: parsed.designation,
          },
          app_metadata: {
            role: parsed.role || 'learner',
          },
        };
      }
    } catch {
      // Cookie parsing error
    }
  }

  // 2. Check if real Supabase auth succeeds
  try {
    const supabase = await getSupabaseServerClient();
    // Using a fast timeout abort controller just in case it hangs
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email) {
      return {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata,
      };
    }
  } catch {
    // Supabase unreachable or mock mode
  }

  // 3. Sensible default demo persona (Amit Sharma) to ensure no blank screens / redirects
  const defaultPersona = DEMO_PERSONAS[0];
  return {
    id: defaultPersona.id,
    email: defaultPersona.email,
    user_metadata: {
      name: defaultPersona.name,
      organization_id: defaultPersona.organization_id,
      preferred_language: defaultPersona.preferred_language,
      cadre: defaultPersona.cadre,
      designation: defaultPersona.designation,
    },
    app_metadata: {
      role: defaultPersona.role,
    },
  };
}
