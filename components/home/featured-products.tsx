import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

import { ProductCard } from "@/components/marketplace/product-card";
import type { Product, ProductType } from "@/lib/types";

type ProductRecord = Record<string, unknown>;

const productTypes: ProductType[] = ["saas", "template", "custom"];

function getString(value: unknown, fallback = "") {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function getNullableString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function getNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function getBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function getProductType(value: unknown) {
  return typeof value === "string" && productTypes.includes(value as ProductType)
    ? (value as ProductType)
    : "custom";
}

function getBillingInterval(value: unknown) {
  return value === "month" || value === "year" ? value : undefined;
}

function getFeatures(value: unknown) {
  return Array.isArray(value)
    ? value.filter((feature): feature is string => typeof feature === "string")
    : [];
}

function normalizeProduct(record: ProductRecord): Product {
  const name = getString(record.name, "Untitled product");
  const description = getString(record.description);

  return {
    id: getString(record.id),
    name,
    slug: getString(record.slug, name.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
    description,
    short_description: getString(record.short_description, description.slice(0, 140)),
    product_type: getProductType(record.product_type),
    price: getNumber(record.price),
    is_subscription: getBoolean(record.is_subscription),
    billing_interval: getBillingInterval(record.billing_interval),
    image_url: getString(record.image_url, "/placeholder-product.jpg"),
    demo_url: getNullableString(record.demo_url),
    demo_video_url: getNullableString(record.demo_video_url),
    stripe_price_id: getNullableString(record.stripe_price_id),
    stripe_link: getNullableString(record.stripe_link),
    features: getFeatures(record.features),
    category: getString(record.category, "general"),
    category_id: getNullableString(record.category_id),
    is_active: getBoolean(record.is_active, true),
    is_featured: getBoolean(record.is_featured, true),
    order_index: getNumber(record.order_index),
    created_at: getString(record.created_at, new Date(0).toISOString()),
  };
}

async function fetchFeaturedProducts() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("order_index", { ascending: true })
    .limit(6);

  if (error) {
    return [];
  }

  return ((data ?? []) as ProductRecord[]).map(normalizeProduct);
}

export async function FeaturedProducts() {
  const products = await fetchFeaturedProducts();

  return (
    <section
      id="featured-products"
      aria-labelledby="featured-products-heading"
      className="bg-white px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
              Marketplace
            </p>
            <h2
              id="featured-products-heading"
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Featured Products
            </h2>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] p-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
            Featured products are coming soon.
          </p>
        )}

        <div className="mt-10">
          <Link
            href="/products"
            className="inline-flex rounded-md font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))] transition-colors hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
          >
            View all products
          </Link>
        </div>
      </div>
    </section>
  );
}
