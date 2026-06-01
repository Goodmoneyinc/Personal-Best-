import { NextResponse, type NextRequest } from 'next/server';

import { requireAdminApiToken } from '@/lib/admin-auth';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
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

    const status = request.nextUrl.searchParams.get('status');
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ leads: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unable to load leads.',
      },
      { status: 500 },
    );
  }
}
