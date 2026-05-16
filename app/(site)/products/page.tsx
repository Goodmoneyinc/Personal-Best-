import { createClient } from "@supabase/supabase-js";

import { ProductGrid } from "@/components/marketplace/product-grid";
import type { Product, ProductType } from "@/lib/types";

type ProductsPageSearchParams = {
  type?: string | string[];
  category?: string | string[];
};

type ProductsPageProps = {
  searchParams?: ProductsPageSearchParams;
};

type ProductRecord = Record<string, unknown>;

type QueryError = {
  code?: string;
  message?: string;
};

const productTypes: ProductType[] = ["saas", "template", "custom"];

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getProductType(value: unknown, fallback?: ProductType) {
  if (typeof value !== "string") {
    return fallback;
  }

  return productTypes.includes(value as ProductType)
    ? (value as ProductType)
    : fallback;
}

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getBillingInterval(value: unknown) {
  return value === "month" || value === "year" ? value : undefined;
}

function getFeatures(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((feature): feature is string => typeof feature === "string");
  }

  if (typeof value === "string" && value.length > 0) {
    try {
      const parsed = JSON.parse(value) as unknown;

      if (Array.isArray(parsed)) {
        return parsed.filter(
          (feature): feature is string => typeof feature === "string",
        );
      }
    } catch {
      return value
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function isMissingTableError(error: QueryError) {
  const message = error.message?.toLowerCase() ?? "";

  return (
    error.code === "42P01" ||
    message.includes("does not exist") ||
    message.includes("could not find the table")
  );
}

function normalizeProduct(
  record: ProductRecord,
  fallbackType: ProductType,
): Product {
  const name = getString(record.name ?? record.title, "Untitled product");
  const description = getString(record.description, "");
  const slug = getString(record.slug, slugify(name) || `${fallbackType}-product`);

  return {
    id: getString(record.id, slug),
    name,
    slug,
    description,
    short_description: getString(
      record.short_description ?? record.shortDescription ?? record.tagline,
      description.slice(0, 140),
    ),
    product_type: getProductType(record.product_type, fallbackType) ?? fallbackType,
    price: getNumber(record.price_cents ?? record.price, 0),
    is_subscription: getBoolean(record.is_subscription, false),
    billing_interval: getBillingInterval(record.billing_interval),
    image_url: getString(
      record.image_url ?? record.thumbnail_url ?? record.screenshot_url,
      "/placeholder-product.jpg",
    ),
    demo_url: getNullableString(record.demo_url ?? record.live_url),
    demo_video_url: getNullableString(record.demo_video_url),
    stripe_price_id: getNullableString(record.stripe_price_id),
    stripe_link: getNullableString(record.stripe_link),
    features: getFeatures(record.features),
    category: getString(record.category, "general"),
    category_id: getNullableString(record.category_id),
    is_active: getBoolean(record.is_active, true),
    is_featured: getBoolean(record.is_featured, false),
    order_index: getNumber(record.order_index ?? record.display_order, 0),
    created_at: getString(record.created_at, new Date(0).toISOString()),
  };
}

async function fetchLegacyProducts(
  supabase: ReturnType<typeof createClient>,
): Promise<{ products: Product[]; error?: string }> {
  const [saasResult, templatesResult] = await Promise.all([
    supabase.from("saas_apps").select("*").eq("is_active", true),
    supabase.from("templates").select("*").eq("is_active", true),
  ]);

  const errors = [saasResult.error, templatesResult.error].filter(Boolean);
  const products = [
    ...((saasResult.data ?? []) as ProductRecord[]).map((record) =>
      normalizeProduct(record, "saas"),
    ),
    ...((templatesResult.data ?? []) as ProductRecord[]).map((record) =>
      normalizeProduct(record, "template"),
    ),
  ].sort((first, second) => {
    if (first.order_index !== second.order_index) {
      return first.order_index - second.order_index;
    }

    return second.created_at.localeCompare(first.created_at);
  });

  return {
    products,
    error:
      errors.length > 0
        ? "Some legacy product data could not be loaded."
        : undefined,
  };
}

async function fetchActiveProducts(): Promise<{
  products: Product[];
  error?: string;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      products: [],
      error: "Product data is unavailable because Supabase is not configured.",
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) {
        return fetchLegacyProducts(supabase);
      }

      return {
        products: [],
        error: "Products could not be loaded. Please try again soon.",
      };
    }

    return {
      products: ((data ?? []) as ProductRecord[]).map((record) =>
        normalizeProduct(record, "custom"),
      ),
    };
  } catch {
    return {
      products: [],
      error: "Products could not be loaded. Please try again soon.",
    };
  }
}

export default async function ProductsPage({
  searchParams = {},
}: ProductsPageProps) {
  const selectedType = getProductType(getSingleParam(searchParams.type));
  const selectedCategory = getSingleParam(searchParams.category);
  const { products, error } = await fetchActiveProducts();

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] text-[var(--navy,var(--color-navy,#0A0F1E))]"
    >
      <section
        aria-labelledby="products-heading"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
            Marketplace
          </p>
          <h1
            id="products-heading"
            className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{
              fontFamily:
                "var(--font-playfair-display, 'Playfair Display', serif)",
            }}
          >
            Practical digital tools from Fulatelier.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
            Browse micro SaaS products, ready-to-use templates, and custom work
            options built for focused teams and independent operators.
          </p>
        </div>

        {error ? (
          <p
            role="status"
            aria-live="polite"
            className="mt-8 rounded-lg border border-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] bg-white/70 px-4 py-3 text-sm"
          >
            {error}
          </p>
        ) : null}

        <ProductGrid
          products={products}
          initialType={selectedType}
          initialCategory={selectedCategory}
        />
      </section>
    </main>
  );
}
