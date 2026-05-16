import { NextResponse } from "next/server";

import { getAdminAuth } from "@/lib/supabase/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function requireAdminResponse() {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin client is not configured." },
      { status: 503 },
    );
  }

  const auth = await getAdminAuth();

  if (auth.status === "authenticated") {
    return null;
  }

  return NextResponse.json(
    { error: auth.status === "unauthorized" ? "Forbidden" : "Unauthorized" },
    { status: auth.status === "unauthorized" ? 403 : 401 },
  );
}

export async function GET() {
  const authResponse = await requireAdminResponse();

  if (authResponse) {
    return authResponse;
  }

  const { data, error } = await supabaseAdmin!
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ leads: data ?? [] });
}
