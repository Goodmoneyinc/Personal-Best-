"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PackageOpen } from "lucide-react";

import { ProductCard } from "@/components/marketplace/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, ProductType } from "@/lib/types";

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

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

function getProductFilter(value: string | null, fallback?: ProductType) {
  if (value === "saas" || value === "template" || value === "custom") {
    return value;
  }

  return fallback ?? "all";
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
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 3}
              />
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
