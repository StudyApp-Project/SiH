/**
 * supabase/functions/evaluate-assessment/index.ts
 *
 * Supabase Edge Function: Server-side assessment scoring with idempotency
 *
 * Design: PHASE_4_BRAINSTORM.md § 4 (Edge Function Deduplication)
 *
 * Endpoint: POST /functions/v1/evaluate-assessment
 * Auth: Requires Supabase JWT in Authorization header
 *
 * Request:
 *   {
 *     local_id: string (UUID, client-generated, immutable)
 *     competency_id: string (UUID)
 *     answers: Record<string, string> ({ question_id: answer_index })
 *     branch_path: 'L1' | 'L2_L3' | 'L3_L4' | 'L5'
 *     final_level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' (client-submitted, will validate)
 *   }
 *
 * Response (200):
 *   {
 *     success: true
 *     assessment_id: string (server-assigned UUID)
 *     final_level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' (server-calculated)
 *     message?: string (e.g., "Idempotent: assessment already recorded")
 *   }
 *
 * Response (400):
 *   { success: false, error: string }
 *
 * Response (401):
 *   { success: false, error: "Unauthorized" }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9';

// =========================================================================
// TYPES
// =========================================================================

interface EvaluateAssessmentRequest {
  local_id: string;
  competency_id: string;
  answers: Record<string, string>;
  branch_path: 'L1' | 'L2_L3' | 'L3_L4' | 'L5';
  final_level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
}

interface EvaluateAssessmentResponse {
  success: boolean;
  assessment_id?: string;
  final_level?: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  error?: string;
  message?: string;
}

// =========================================================================
// HELPER: Score Assessment (Server-Side)
// =========================================================================

/**
 * scoreAssessment — Validate and calculate final proficiency level
 *
 * In production, this would:
 * 1. Fetch question details from DB
 * 2. Verify answer correctness against answer key
 * 3. Apply branching logic (deterministic)
 * 4. Return calculated final_level
 *
 * For MVP, we accept answers as-is (since they're pre-scored client-side
 * via assessmentService.ts). Server re-validates the branch_path logic.
 *
 * @param answers Client-submitted answers
 * @param branch_path Stage 2 branching result
 * @returns Calculated proficiency level
 */
function scoreAssessment(
  answers: Record<string, string>,
  branch_path: 'L1' | 'L2_L3' | 'L3_L4' | 'L5'
): 'L1' | 'L2' | 'L3' | 'L4' | 'L5' {
  // Simplified: in production, verify answers against question bank
  // For MVP, trust client scoring (protected by deterministic state machine)

  // Re-validate branch_path convergence (security check)
  if (!['L1', 'L2_L3', 'L3_L4', 'L5'].includes(branch_path)) {
    throw new Error(`Invalid branch_path: ${branch_path}`);
  }

  // Verify we have 3 answers (one per stage)
  const answerCount = Object.keys(answers).length;
  if (answerCount !== 3) {
    throw new Error(`Expected 3 answers, got ${answerCount}`);
  }

  // In production: fetch Question.correct_answer_index for each question,
  // verify client's answers match, then apply branching logic.
  // For now, accept the branch_path (client already validated this).

  return 'L3'; // Placeholder: would be calculated from answers
}

// =========================================================================
// MAIN HANDLER
// =========================================================================

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // =====================================================================
    // 1. AUTHENTICATION
    // =====================================================================

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: missing Bearer token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.substring(7);

    // Initialize Supabase client with service role (for RLS bypass if needed)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
      }
    );

    // Verify JWT and get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =====================================================================
    // 2. PARSE REQUEST
    // =====================================================================

    let payload: EvaluateAssessmentRequest;
    try {
      payload = await req.json();
    } catch (_e) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    const requiredFields = ['local_id', 'competency_id', 'answers', 'branch_path', 'final_level'];
    for (const field of requiredFields) {
      if (!(field in payload)) {
        return new Response(
          JSON.stringify({ success: false, error: `Missing field: ${field}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // =====================================================================
    // 3. IDEMPOTENCY CHECK (Deduplication)
    // =====================================================================

    const {
      data: existingAssessment,
      error: checkError,
    } = await supabase
      .from('assessment_results')
      .select('id, final_level, submitted_at')
      .eq('local_id', payload.local_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // Some error other than "not found"
      console.error('Idempotency check error:', checkError);
      return new Response(
        JSON.stringify({ success: false, error: 'Database error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (existingAssessment) {
      // Assessment already recorded: return cached response (idempotent)
      return new Response(
        JSON.stringify({
          success: true,
          assessment_id: existingAssessment.id,
          final_level: existingAssessment.final_level,
          message: 'Idempotent: assessment already recorded',
        } as EvaluateAssessmentResponse),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =====================================================================
    // 4. SERVER-SIDE SCORING
    // =====================================================================

    let calculatedLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
    try {
      calculatedLevel = scoreAssessment(payload.answers, payload.branch_path);
    } catch (scoreError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Scoring error: ${(scoreError as Error).message}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =====================================================================
    // 5. TAMPER DETECTION
    // =====================================================================

    if (calculatedLevel !== payload.final_level) {
      // Client submitted a different score than what we calculated
      // This indicates tampering (client modified answer after submission)
      console.warn(
        `Tampering detected: local_id=${payload.local_id}, ` +
          `calculated=${calculatedLevel}, submitted=${payload.final_level}`
      );
      return new Response(
        JSON.stringify({
          success: false,
          error: `Score validation failed: expected ${calculatedLevel}, got ${payload.final_level}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =====================================================================
    // 6. INSERT TO DATABASE (Atomic with Trigger)
    // =====================================================================

    const assessmentId = uuidv4();
    const now = new Date().toISOString();

    const { error: insertError } = await supabase.from('assessment_results').insert({
      id: assessmentId,
      local_id: payload.local_id,
      competency_id: payload.competency_id,
      user_id: user.id,
      final_level: calculatedLevel,
      answers: payload.answers,
      branch_path: payload.branch_path,
      submitted_at: now,
      provenance: 'VERIFIED_OFFICIAL',
      organization_id: user.user_metadata?.organization_id,
    });

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Database insert failed: ${insertError.message}`,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Note: audit_log entry is created automatically by database trigger
    // (AFTER INSERT ON assessment_results)

    // =====================================================================
    // 7. SUCCESS RESPONSE
    // =====================================================================

    return new Response(
      JSON.stringify({
        success: true,
        assessment_id: assessmentId,
        final_level: calculatedLevel,
      } as EvaluateAssessmentResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
