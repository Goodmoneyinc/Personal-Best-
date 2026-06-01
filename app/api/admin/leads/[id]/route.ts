import { NextResponse, type NextRequest } from 'next/server';

import { requireAdminApiToken } from '@/lib/admin-auth';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';


interface LeadRouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: LeadRouteContext) {
  const unauthorized = requireAdminApiToken(request);

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const supabase = getSupabaseServiceRoleClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase service role is not configured.' },
        { status: 503 },
      );
    }

    const payload: unknown = await request.json();
    const { data, error } = await supabase
      .from('leads')
      .update(payload as Record<string, unknown>)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ lead: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unable to update lead.',
      },
      { status: 500 },
    );
  }
}
