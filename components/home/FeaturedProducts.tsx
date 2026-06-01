import Link from 'next/link';

import { ProductGrid } from '@/components/marketplace/ProductGrid';
import type { Product } from '@/lib/types';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
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
      <ProductGrid className="mt-10 md:grid-cols-3" products={products} priorityCount={1} />
    </section>
  );
}
