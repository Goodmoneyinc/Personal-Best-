import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";

import type { Product, ProductType } from "@/lib/types";

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const productTypeLabels: Record<ProductType, string> = {
  saas: "Micro SaaS",
  template: "Template",
  custom: "Custom",
};

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

const buttonClasses = [
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors",
  focusRingClasses,
].join(" ");

function formatCardPrice(product: Product) {
  if (product.product_type === "custom") {
    return "Get a Quote";
  }

  const dollars = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: product.price % 100 === 0 ? 0 : 2,
  }).format(product.price / 100);

  if (product.is_subscription) {
    return `${dollars}/${product.billing_interval === "year" ? "yr" : "mo"}`;
  }

  return `${dollars} one-time`;
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const detailHref = `/products/${product.slug}`;
  const previewHref = product.demo_url;
  const isExternalPreview = previewHref ? isExternalHref(previewHref) : false;

  return (
    <article
      aria-label={product.name}
      className="group relative flex h-full translate-y-0 flex-col overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent-gold,var(--color-accent-gold,#C9A84C))_18%,transparent)] bg-white shadow-sm transition-[transform,box-shadow] duration-200 ease-in-out hover:-translate-y-1 hover:shadow-xl"
    >
      {product.is_featured ? (
        <div className="absolute right-0 top-0 z-10 rounded-bl-xl bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--navy,var(--color-navy,#0A0F1E))] shadow-md">
          Featured
        </div>
      ) : null}

      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--navy,var(--color-navy,#0A0F1E))]">
        <Image
          src={product.image_url || "/placeholder-product.jpg"}
          alt={`${product.name} product preview`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
          unoptimized
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span className="rounded-full bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--navy,var(--color-navy,#0A0F1E))]">
            {productTypeLabels[product.product_type]}
          </span>
          <span className="rounded-full bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] px-3 py-1 text-sm font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))]">
            {formatCardPrice(product)}
          </span>
        </div>

        <h2 className="mt-5 text-xl font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))]">
          {product.name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
          {product.short_description}
        </p>

        <div className="mt-6 flex flex-1 flex-col justify-end gap-3 sm:flex-row sm:items-end">
          {previewHref ? (
            <a
              href={previewHref}
              aria-label={`Preview ${product.name}`}
              target={isExternalPreview ? "_blank" : undefined}
              rel={isExternalPreview ? "noopener noreferrer" : undefined}
              className={`${buttonClasses} border border-[var(--navy,var(--color-navy,#0A0F1E))] text-[var(--navy,var(--color-navy,#0A0F1E))] hover:border-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]`}
            >
              <Eye aria-hidden="true" className="h-4 w-4" />
              Preview
            </a>
          ) : (
            <button
              type="button"
              aria-label={`Preview unavailable for ${product.name}`}
              disabled
              className={`${buttonClasses} cursor-not-allowed border border-[color-mix(in_srgb,var(--slate-gray,var(--color-slate-gray,#64748B))_35%,transparent)] text-[var(--slate-gray,var(--color-slate-gray,#64748B))] opacity-70`}
            >
              <Eye aria-hidden="true" className="h-4 w-4" />
              Preview
            </button>
          )}

          <Link
            href={detailHref}
            aria-label={`Get This ${product.name}`}
            className={`${buttonClasses} bg-[var(--navy,var(--color-navy,#0A0F1E))] text-white hover:bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--navy,var(--color-navy,#0A0F1E))]`}
          >
            <ShoppingBag aria-hidden="true" className="h-4 w-4" />
            Get This
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
