import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { PurchaseButton } from '@/components/product-detail/PurchaseButton';
import { VideoPlayer } from '@/components/product-detail/VideoPlayer';
import { ButtonLink } from '@/components/ui/button';
import { getProductBySlug, getProducts } from '@/lib/supabase/queries';
import { formatPrice, type Product } from '@/lib/types';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

const typeLabels: Record<Product['product_type'], string> = {
  saas: 'Managed SaaS starter',
  template: 'Template product',
  custom: 'Custom build',
};

export async function generateStaticParams() {
  try {
    const products = await getProducts();

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  let product: Product | null = null;

  try {
    product = await getProductBySlug(params.slug);
  } catch {
    product = null;
  }

  if (!product) {
    return {
      title: 'Product not found',
    };
  }

  return {
    title: product.name,
    description: product.short_description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <section className="bg-navy px-6 py-16 text-warm lg:px-8" aria-labelledby="product-title">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-warm/15 bg-warm/10 shadow-glow">
            <Image
              alt={`${product.name} product interface preview`}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              src={product.image_url}
            />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
              {typeLabels[product.product_type]}
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-balance md:text-6xl" id="product-title">
              {product.name}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-warm/80">
              {product.description}
            </p>
            <p className="mt-7 font-display text-4xl font-bold text-gold">
              {formatPrice(product.price, product.is_subscription, product.billing_interval)}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
              <PurchaseButton
                stripe_link={product.stripe_link}
                stripe_price_id={product.stripe_price_id}
              />
              {product.demo_url ? (
                <ButtonLink
                  href={product.demo_url}
                  rel="noopener noreferrer"
                  target="_blank"
                  variant="ghost"
                >
                  View demo
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="features-title" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
              What is included
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-navy" id="features-title">
              Built with practical workflows first.
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/75">
              Fulatelier keeps the surface area focused: clear copy, accessible
              components, and a path to payments or data when the offer needs it.
            </p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2">
            {product.features.map((feature) => (
              <li
                className="rounded-3xl border border-navy/10 bg-white/80 p-5 text-sm font-semibold leading-6 text-navy shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow"
                key={feature}
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {product.demo_video_url ? (
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8" aria-label="Product video">
          <VideoPlayer title={product.name} videoUrl={product.demo_video_url} />
        </section>
      ) : null}
    </>
  );
}
