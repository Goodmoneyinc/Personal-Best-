import { NextResponse } from "next/server";

import { getAdminAuth } from "@/lib/supabase/admin-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ProductRouteContext = {
  params: {
    id: string;
  };
};

type ProductMutationPayload = {
  name?: unknown;
  slug?: unknown;
  description?: unknown;
  short_description?: unknown;
  product_type?: unknown;
  price?: unknown;
  is_subscription?: unknown;
  billing_interval?: unknown;
  image_url?: unknown;
  demo_url?: unknown;
  demo_video_url?: unknown;
  stripe_price_id?: unknown;
  features?: unknown;
  category?: unknown;
  is_active?: unknown;
  is_featured?: unknown;
};

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

function getString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function getNullableString(value: unknown) {
  const stringValue = getString(value);
  return stringValue.length > 0 ? stringValue : null;
}

function getBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function getPrice(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function getFeatures(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((feature): feature is string => typeof feature === "string")
    .map((feature) => feature.trim())
    .filter(Boolean);
}

function sanitizeProductPayload(payload: ProductMutationPayload) {
  const isSubscription = getBoolean(payload.is_subscription);
  const billingInterval =
    payload.billing_interval === "month" || payload.billing_interval === "year"
      ? payload.billing_interval
      : null;

  return {
    name: getString(payload.name),
    slug: getString(payload.slug),
    description: getString(payload.description),
    short_description: getString(payload.short_description),
    product_type:
      payload.product_type === "saas" ||
      payload.product_type === "template" ||
      payload.product_type === "custom"
        ? payload.product_type
        : "custom",
    price: getPrice(payload.price),
    is_subscription: isSubscription,
    billing_interval: isSubscription ? billingInterval : null,
    image_url: getString(payload.image_url),
    demo_url: getNullableString(payload.demo_url),
    demo_video_url: getNullableString(payload.demo_video_url),
    stripe_price_id: getNullableString(payload.stripe_price_id),
    features: getFeatures(payload.features),
    category: getString(payload.category, "general"),
    is_active: getBoolean(payload.is_active, true),
    is_featured: getBoolean(payload.is_featured),
  };
}

export async function PATCH(request: Request, { params }: ProductRouteContext) {
  const authResponse = await requireAdminResponse();

  if (authResponse) {
    return authResponse;
  }

  const payload = (await request.json()) as ProductMutationPayload;
  const product = sanitizeProductPayload(payload);

  const { data, error } = await supabaseAdmin!
    .from("products")
    .update(product)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(_request: Request, { params }: ProductRouteContext) {
  const authResponse = await requireAdminResponse();

  if (authResponse) {
    return authResponse;
  }

  const { error } = await supabaseAdmin!
    .from("products")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
