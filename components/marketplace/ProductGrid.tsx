'use client';

import { useMemo, useState } from 'react';

import { ProductCard } from '@/components/marketplace/ProductCard';
import { cn } from '@/lib/utils';
import type { Product, ProductType } from '@/lib/types';

type ProductFilter = 'all' | ProductType;

const filters: Array<{
  label: string;
  value: ProductFilter;
}> = [
  { label: 'All', value: 'all' },
  { label: 'SaaS', value: 'saas' },
  { label: 'Templates', value: 'template' },
  { label: 'Custom', value: 'custom' },
];

interface ProductGridProps {
  products: Product[];
  className?: string;
  priorityCount?: number;
  showFilters?: boolean;
}

export function ProductGrid({
  products,
  className,
  priorityCount = 2,
  showFilters = true,
}: ProductGridProps) {
  const [activeFilter, setActiveFilter] = useState<ProductFilter>('all');
  const filteredProducts = useMemo(
    () =>
      activeFilter === 'all'
        ? products
        : products.filter((product) => product.product_type === activeFilter),
    [activeFilter, products],
  );

  return (
    <div className={className}>
      {showFilters ? (
        <div aria-label="Filter products by type" className="flex flex-wrap gap-3" role="group">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                aria-pressed={isActive}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-bold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                  isActive
                    ? 'border-gold bg-gold text-navy shadow-glow'
                    : 'border-navy/15 bg-white/80 text-navy hover:-translate-y-0.5 hover:border-gold hover:bg-warm',
                )}
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                type="button"
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {filteredProducts.length > 0 ? (
        <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', showFilters ? 'mt-8' : undefined)}>
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} priority={index < priorityCount} product={product} />
          ))}
        </div>
      ) : (
        <p className={cn('rounded-[2rem] border border-navy/10 bg-white/80 p-6 text-sm leading-6 text-ink/75', showFilters ? 'mt-8' : undefined)} role="status">
          No products match this filter yet.
        </p>
      )}
    </div>
  );
}
