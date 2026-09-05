import { NextRequest, NextResponse } from 'next/server';
import { getDemoPersonaByEmail } from '@/lib/demoPersonas';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  const lang = request.nextUrl.searchParams.get('lang') as 'en' | 'hi' | null;

  if (!email) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const persona = getDemoPersonaByEmail(email);

  if (!persona) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const userObj = {
    id: persona.id,
    name: persona.name,
    email: persona.email,
    role: persona.role,
    organization_id: persona.organization_id,
    cadre: persona.cadre,
    designation: persona.designation,
    preferred_language: lang || persona.preferred_language,
    department: persona.department,
  };

  const response = NextResponse.redirect(new URL('/dashboard', request.url));
  response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(userObj)), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
  });
  response.cookies.set('locale', lang || persona.preferred_language || 'en', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, lang } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const persona = getDemoPersonaByEmail(email);

    if (!persona) {
      return NextResponse.json({ error: 'Unknown demo persona' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      persona: {
        id: persona.id,
        name: persona.name,
        email: persona.email,
        role: persona.role,
        organization_id: persona.organization_id,
        cadre: persona.cadre,
        designation: persona.designation,
        preferred_language: lang || persona.preferred_language,
        department: persona.department,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
