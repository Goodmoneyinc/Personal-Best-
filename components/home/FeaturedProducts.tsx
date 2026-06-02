import Link from 'next/link';
import type { ReactNode } from 'react';

import { ProductGrid } from '@/components/marketplace/ProductGrid';
import { getFeaturedProducts } from '@/lib/supabase/queries';

function FeaturedProductsSection({ children }: { children: ReactNode }) {
  return (
    <section aria-labelledby="featured-products-title" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
            Marketplace
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold text-navy" id="featured-products-title">
            Featured workshop products
          </h2>
        </div>
        <Link
          className="rounded-sm text-sm font-bold text-navy underline decoration-gold decoration-2 underline-offset-8 hover:text-[#6F5921] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          href="/products"
        >
          View every product
        </Link>
      </div>
      {children}
    </section>
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <FeaturedProductsSection>
      <div aria-live="polite" className="mt-10" role="status">
        <span className="sr-only">Loading featured products.</span>
        <div aria-hidden="true" className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              className="h-[28rem] animate-pulse rounded-[2rem] border border-navy/10 bg-white/70 shadow-card"
              key={item}
            >
              <div className="h-48 rounded-t-[2rem] bg-navy/15" />
              <div className="space-y-4 p-6">
                <div className="h-4 w-28 rounded-full bg-gold/20" />
                <div className="h-8 w-3/4 rounded-full bg-navy/15" />
                <div className="h-4 rounded-full bg-slate/20" />
                <div className="h-4 w-5/6 rounded-full bg-slate/20" />
                <div className="flex items-center justify-between pt-6">
                  <div className="h-8 w-20 rounded-full bg-navy/15" />
                  <div className="h-11 w-32 rounded-full bg-gold/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FeaturedProductsSection>
  );
}

export async function FeaturedProducts() {
  try {
    const products = await getFeaturedProducts();

    if (products.length === 0) {
      return (
        <FeaturedProductsSection>
          <p className="mt-10 rounded-[2rem] border border-navy/10 bg-white/80 p-6 text-sm leading-6 text-ink/75" role="status">
            Featured products are being prepared. Please check back soon.
          </p>
        </FeaturedProductsSection>
      );
    }

    return (
      <FeaturedProductsSection>
        <ProductGrid className="mt-10" products={products} priorityCount={1} showFilters={false} />
      </FeaturedProductsSection>
    );
  } catch {
    return (
      <FeaturedProductsSection>
        <p className="mt-10 rounded-[2rem] border border-[#8A3A2B]/30 bg-[#FFF6F2] p-6 text-sm font-semibold leading-6 text-[#7A2E23]" role="status">
          Featured products could not be loaded right now. Please refresh the page or visit the marketplace.
        </p>
      </FeaturedProductsSection>
    );
  }
}
