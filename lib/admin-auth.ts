import { NextResponse, type NextRequest } from 'next/server';

import { adminSupabase } from '@/lib/supabase/admin';
import {
  getSupabaseRouteClient,
  getSupabaseServerClient,
} from '@/lib/supabase/server';

type AdminUserRow = {
  email: string;
};

async function isAdminEmail(email: string) {
  const { data, error } = await adminSupabase
    .from('admin_users')
    .select('email')
    .eq('email', email)
    .maybeSingle()
    .overrideTypes<AdminUserRow, { merge: false }>();

  if (error) {
    console.error('Unable to verify admin user:', error);
    return false;
  }

  return Boolean(data);
}

export async function getServerAdminEmail() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.email) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return null;
  }

  return (await isAdminEmail(user.email)) ? user.email : null;
}

export async function requireAdminRequest(request: NextRequest): Promise<NextResponse | null> {
  const supabase = getSupabaseRouteClient(request);

  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase admin auth is not configured.' },
      { status: 503 },
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email || !(await isAdminEmail(user.email))) {
    return NextResponse.json({ error: 'Unauthorized admin request.' }, { status: 401 });
  }

  return null;
}

