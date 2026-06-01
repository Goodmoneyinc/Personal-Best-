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

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ products: data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unable to load products.',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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
      .from('products')
      .insert(payload as Record<string, unknown>)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unable to create product.',
      },
      { status: 500 },
    );
  }
}
