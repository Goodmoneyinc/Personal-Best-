import { NextResponse, type NextRequest } from 'next/server';

import { requireAdminRequest } from '@/lib/admin-auth';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';


interface ProductRouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: ProductRouteContext) {
  const unauthorized = await requireAdminRequest(request);

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
      .update(payload as Record<string, unknown>)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unable to update product.',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: ProductRouteContext) {
  const unauthorized = await requireAdminRequest(request);

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

    const { error } = await supabase.from('products').delete().eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unable to delete product.',
      },
      { status: 500 },
    );
  }
}
