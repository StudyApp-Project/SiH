import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { local_id, competency_id, user_id, final_level, answers, branch_path, created_at } = body;

    if (!local_id) {
      return NextResponse.json({ error: 'Missing required field: local_id' }, { status: 400 });
    }

    const serverAssessmentId = `srv-sync-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const submittedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      assessment_id: serverAssessmentId,
      submitted_at: submittedAt,
      local_id,
      competency_id: competency_id || 'unknown',
      user_id: user_id || 'unknown',
      final_level: final_level || 'L1',
      branch_path: branch_path || 'L1',
      answers_recorded: answers ? Object.keys(answers).length : 0,
      offline_created_at: created_at || submittedAt,
      sync_status: 'SYNCED',
    });
  } catch (error) {
    console.error('Assessment sync error:', error);
    return NextResponse.json({ error: 'Failed to synchronize offline assessment' }, { status: 500 });
  }
}
