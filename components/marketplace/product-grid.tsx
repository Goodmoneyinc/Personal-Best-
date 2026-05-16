"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ExternalLink, PackageOpen } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import type { Product, ProductType } from "@/lib/types";
import { formatPrice } from "@/lib/types";

type ProductFilter = ProductType | "all";

type ProductGridProps = {
  products: Product[];
  initialType?: ProductType;
  initialCategory?: string;
};

const tabs: { value: ProductFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "saas", label: "Micro SaaS" },
  { value: "template", label: "Templates" },
  { value: "custom", label: "Custom Work" },
];

const skeletonCards = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
] as const;

const productTypeLabels: Record<ProductType, string> = {
  saas: "Micro SaaS",
  template: "Template",
  custom: "Custom Work",
};

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

function getProductFilter(value: string | null, fallback?: ProductType) {
  if (value === "saas" || value === "template" || value === "custom") {
    return value;
  }

  return fallback ?? "all";
}

function getProductHref(product: Product) {
  if (product.stripe_link) {
    return product.stripe_link;
  }

  if (product.demo_url) {
    return product.demo_url;
  }

  if (product.product_type === "custom") {
    return "/products/custom-work";
  }

  return `/products/${product.slug}`;
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function ProductCard({ product }: { product: Product }) {
  const href = getProductHref(product);
  const isExternal = isExternalHref(href);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent-gold,var(--color-accent-gold,#C9A84C))_18%,transparent)] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[4/3] overflow-hidden bg-[var(--navy,var(--color-navy,#0A0F1E))]">
        <img
          src={product.image_url}
          alt={`${product.name} preview`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
              {productTypeLabels[product.product_type]}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))]">
              {product.name}
            </h2>
          </div>
          <p className="shrink-0 rounded-full bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] px-3 py-1 text-sm font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))]">
            {formatPrice(
              product.price,
              product.is_subscription,
              product.billing_interval,
            )}
          </p>
        </div>

        <p className="mt-4 text-sm leading-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
          {product.short_description || product.description}
        </p>

        {product.features.length > 0 ? (
          <ul className="mt-5 space-y-2 text-sm text-[var(--navy,var(--color-navy,#0A0F1E))]">
            {product.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex flex-1 items-end">
          <a
            href={href}
            aria-label={`View ${product.name}`}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={`inline-flex items-center gap-2 rounded-md bg-[var(--navy,var(--color-navy,#0A0F1E))] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--navy,var(--color-navy,#0A0F1E))] ${focusRingClasses}`}
          >
            View product
            {isExternal ? (
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            ) : null}
          </a>
        </div>
      </div>
    </article>
  );
}

function ProductGridSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading products"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span className="sr-only">Loading products</span>
      {skeletonCards.map((card) => (
        <div
          key={card}
          className="overflow-hidden rounded-2xl border border-black/10 bg-white p-6"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <Skeleton className="mt-6 h-4 w-24" />
          <Skeleton className="mt-4 h-6 w-3/4" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-6 h-10 w-32 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({
  products,
  initialType,
  initialCategory,
}: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeType = getProductFilter(searchParams.get("type"), initialType);
  const selectedCategory = searchParams.get("category") ?? initialCategory;

  const filteredProducts = useMemo(() => {
    const normalizedCategory = selectedCategory?.toLowerCase();

    return products.filter((product) => {
      const matchesType =
        activeType === "all" || product.product_type === activeType;
      const matchesCategory =
        !normalizedCategory ||
        product.category.toLowerCase() === normalizedCategory;

      return matchesType && matchesCategory;
    });
  }, [activeType, products, selectedCategory]);

  function handleTabChange(nextType: ProductFilter) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextType === "all") {
      params.delete("type");
    } else {
      params.set("type", nextType);
    }

    const queryString = params.toString();

    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-label="Filter products by type"
        className="flex flex-wrap gap-3"
      >
        {tabs.map((tab) => {
          const isSelected = activeType === tab.value;

          return (
            <button
              key={tab.value}
              id={`product-tab-${tab.value}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls="product-list"
              className={[
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                focusRingClasses,
                isSelected
                  ? "border-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] bg-[var(--navy,var(--color-navy,#0A0F1E))] text-white"
                  : "border-[color-mix(in_srgb,var(--navy,var(--color-navy,#0A0F1E))_18%,transparent)] bg-white text-[var(--navy,var(--color-navy,#0A0F1E))] hover:border-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]",
              ].join(" ")}
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <span role="status" className="sr-only">
        {filteredProducts.length} products found
      </span>

      <section
        id="product-list"
        role="tabpanel"
        aria-labelledby={`product-tab-${activeType}`}
        aria-busy={isPending}
        className="mt-8"
      >
        {isPending ? (
          <ProductGridSkeleton />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--navy,var(--color-navy,#0A0F1E))_22%,transparent)] bg-white px-6 py-16 text-center">
            <PackageOpen
              aria-hidden="true"
              className="mx-auto h-10 w-10 text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
            />
            <p className="mt-4 text-lg font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))]">
              No products in this category yet — check back soon
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductGrid;
