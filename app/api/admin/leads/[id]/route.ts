import { NextResponse, type NextRequest } from 'next/server';

import { requireAdminRequest } from '@/lib/admin-auth';
import { adminSupabase } from '@/lib/supabase/admin';

export const runtime = 'nodejs';


interface LeadRouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: LeadRouteContext) {
  const unauthorized = await requireAdminRequest(request);

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const payload: unknown = await request.json();
    const { data, error } = await adminSupabase
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
