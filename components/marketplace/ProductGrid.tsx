import { ProductCard } from '@/components/marketplace/ProductCard';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
  className?: string;
  priorityCount?: number;
}

export function ProductGrid({ products, className, priorityCount = 2 }: ProductGridProps) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      {products.map((product, index) => (
        <ProductCard key={product.id} priority={index < priorityCount} product={product} />
      ))}
    </div>
  );
}
