import { NextResponse } from "next/server";

import { getAdminAuth } from "@/lib/supabase/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Lead } from "@/lib/types";

type LeadRouteContext = {
  params: {
    id: string;
  };
};

type LeadMutationPayload = {
  status?: unknown;
  notes?: unknown;
};

const leadStatuses: Lead["status"][] = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "closed",
];

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

function sanitizeLeadPayload(payload: LeadMutationPayload) {
  const update: Partial<Pick<Lead, "status" | "notes">> = {};

  if (
    typeof payload.status === "string" &&
    leadStatuses.includes(payload.status as Lead["status"])
  ) {
    update.status = payload.status as Lead["status"];
  }

  if (typeof payload.notes === "string") {
    update.notes = payload.notes.trim() || null;
  }

  return update;
}

export async function PATCH(request: Request, { params }: LeadRouteContext) {
  const authResponse = await requireAdminResponse();

  if (authResponse) {
    return authResponse;
  }

  const payload = (await request.json()) as LeadMutationPayload;
  const update = sanitizeLeadPayload(payload);

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No valid lead fields were provided." },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin!
    .from("leads")
    .update(update)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ lead: data });
}
