import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { formatPrice, type Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const typeLabels: Record<Product['product_type'], string> = {
  saas: 'SaaS',
  template: 'Template',
  custom: 'Custom build',
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-navy/10 bg-white/80 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy">
        <Image
          alt={`${product.name} marketplace preview`}
          className="object-cover transition duration-500 group-hover:scale-105"
          fill
          priority={priority}
          src={product.image_url}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{typeLabels[product.product_type]}</Badge>
          <span className="text-sm font-semibold text-slate">{product.category}</span>
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold text-navy">
          {product.name}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-ink/75">
          {product.short_description}
        </p>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="font-display text-2xl font-bold text-navy">
            {formatPrice(product.price, product.is_subscription, product.billing_interval)}
          </p>
          <ButtonLink href={`/products/${product.slug}`} variant="ghost">
            View details
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
