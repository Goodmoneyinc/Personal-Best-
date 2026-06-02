import { NextResponse, type NextRequest } from 'next/server';

import { requireAdminRequest } from '@/lib/admin-auth';
import { adminSupabase } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const status = request.nextUrl.searchParams.get('status');
    let query = adminSupabase
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
