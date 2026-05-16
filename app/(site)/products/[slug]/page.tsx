import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Check } from "lucide-react";

import { ProductCard } from "@/components/marketplace/product-card";
import { PurchaseButton } from "@/components/product-detail/purchase-button";
import { VideoPlayer } from "@/components/product-detail/video-player";
import { buildMetadata } from "@/lib/metadata";
import type { Product, ProductType } from "@/lib/types";
import { formatPrice } from "@/lib/types";

type ProductPageParams = {
  slug: string;
};

type ProductPageProps = {
  params: ProductPageParams;
};

type ProductRecord = Record<string, unknown>;

type QueryError = {
  code?: string;
  message?: string;
};

export const dynamicParams = false;

const productTypes: ProductType[] = ["saas", "template", "custom"];

const productTypeLabels: Record<ProductType, string> = {
  saas: "Micro SaaS",
  template: "Template",
  custom: "Custom Work",
};

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

function getBillingInterval(value: unknown) {
  return value === "month" || value === "year" ? value : undefined;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function createSupabaseBrowserlessClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
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
): Promise<Product[]> {
  const [saasResult, templatesResult] = await Promise.all([
    supabase.from("saas_apps").select("*").eq("is_active", true),
    supabase.from("templates").select("*").eq("is_active", true),
  ]);

  return [
    ...((saasResult.data ?? []) as ProductRecord[]).map((record) =>
      normalizeProduct(record, "saas"),
    ),
    ...((templatesResult.data ?? []) as ProductRecord[]).map((record) =>
      normalizeProduct(record, "template"),
    ),
  ];
}

async function fetchLegacyProductBySlug(
  supabase: ReturnType<typeof createClient>,
  slug: string,
) {
  const [saasResult, templatesResult] = await Promise.all([
    supabase
      .from("saas_apps")
      .select("*")
      .eq("is_active", true)
      .eq("slug", slug)
      .maybeSingle(),
    supabase
      .from("templates")
      .select("*")
      .eq("is_active", true)
      .eq("slug", slug)
      .maybeSingle(),
  ]);

  if (saasResult.data) {
    return normalizeProduct(saasResult.data as ProductRecord, "saas");
  }

  if (templatesResult.data) {
    return normalizeProduct(templatesResult.data as ProductRecord, "template");
  }

  return null;
}

async function fetchActiveProducts() {
  const supabase = createSupabaseBrowserlessClient();

  if (!supabase) {
    return [];
  }

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

      return [];
    }

    return ((data ?? []) as ProductRecord[]).map((record) =>
      normalizeProduct(record, "custom"),
    );
  } catch {
    return [];
  }
}

async function fetchSingleProductBySlug(slug: string) {
  const supabase = createSupabaseBrowserlessClient();

  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      if (isMissingTableError(error)) {
        return fetchLegacyProductBySlug(supabase, slug);
      }

      return null;
    }

    return data ? normalizeProduct(data as ProductRecord, "custom") : null;
  } catch {
    return null;
  }
}

async function fetchRelatedProducts(product: Product) {
  const products = await fetchActiveProducts();

  return products
    .filter(
      (item) =>
        item.id !== product.id && item.category === product.category && item.is_active,
    )
    .slice(0, 3);
}

function getFeatureItems(product: Product) {
  if (product.features.length > 0) {
    return product.features;
  }

  return [
    product.short_description ||
      "A focused Fulatelier product built for practical digital workflows.",
  ];
}

function getDisplayPrice(product: Product) {
  if (product.product_type === "custom") {
    return "Get a Quote";
  }

  if (product.is_subscription) {
    return formatPrice(product.price, true, product.billing_interval);
  }

  return `${formatPrice(product.price)} one-time`;
}

export async function generateStaticParams() {
  const products = await fetchActiveProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await fetchSingleProductBySlug(params.slug);

  if (!product) {
    return buildMetadata({
      title: "Product not found | Fulatelier",
      description: "This Fulatelier product could not be found.",
    });
  }

  return buildMetadata({
    title: `${product.name} | Fulatelier`,
    description: product.short_description || product.description,
    image: product.image_url,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await fetchSingleProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await fetchRelatedProducts(product);
  const features = getFeatureItems(product);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] text-[var(--navy,var(--color-navy,#0A0F1E))]"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
            <li>
              <Link
                href="/"
                className="rounded-sm transition-colors hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/products"
                className="rounded-sm transition-colors hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
              >
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-[var(--navy,var(--color-navy,#0A0F1E))]">
              {product.name}
            </li>
          </ol>
        </nav>

        <section className="grid gap-10 py-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[var(--navy,var(--color-navy,#0A0F1E))] shadow-xl">
            <Image
              src={product.image_url || "/placeholder-product.jpg"}
              alt={`${product.name} product preview`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              unoptimized
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
              {productTypeLabels[product.product_type]}
            </p>
            <h1
              className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl"
              style={{
                fontFamily:
                  "var(--font-playfair-display, 'Playfair Display', serif)",
              }}
            >
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
              {product.description}
            </p>
            <p className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-base font-semibold shadow-sm">
              {getDisplayPrice(product)}
            </p>
          </div>
        </section>

        <section aria-labelledby="features-heading" className="py-10">
          <h2
            id="features-heading"
            className="text-3xl font-semibold tracking-tight"
          >
            Features
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex gap-3 rounded-2xl bg-white p-5 shadow-sm"
              >
                <Check
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 shrink-0 text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {product.demo_video_url ? (
          <section aria-labelledby="video-demo-heading" className="py-10">
            <div className="max-w-3xl">
              <h2
                id="video-demo-heading"
                className="text-3xl font-semibold tracking-tight"
              >
                Video demo
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
                This demo video shows the product workflow. A text transcript is
                available on request through the contact page.
              </p>
            </div>
            <div className="mt-6">
              <VideoPlayer
                title={product.name}
                videoUrl={product.demo_video_url}
              />
            </div>
          </section>
        ) : null}

        <section
          aria-labelledby="purchase-heading"
          className="my-10 rounded-3xl bg-[var(--navy,var(--color-navy,#0A0F1E))] p-8 text-white shadow-xl"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 id="purchase-heading" className="text-3xl font-semibold">
                Ready to get started?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--warm-white,var(--color-warm-white,#F5F0E8))]">
                Choose this product now, or start a custom Fulatelier workflow
                if you need something tailored to your operation.
              </p>
            </div>
            <PurchaseButton product={product} />
          </div>
        </section>

        <section aria-labelledby="related-heading" className="py-10">
          <h2
            id="related-heading"
            className="text-3xl font-semibold tracking-tight"
          >
            Related products
          </h2>
          {relatedProducts.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-white p-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
              No related products are available in this category yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
