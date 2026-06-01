import { ProductCard } from '@/components/product-card';
import { getActiveProducts } from '@/lib/data/products';

const products = getActiveProducts();

export const metadata = {
  title: 'Marketplace',
  description:
    'Browse Fulatelier templates, SaaS starters, and custom build offers for Mississippi businesses.',
};

export default function ProductsPage() {
  const categories = Array.from(new Set(products.map((product) => product.category)));

  return (
    <>
      <section aria-labelledby="products-title" className="bg-navy px-6 py-16 text-warm lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
            Fulatelier marketplace
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold text-balance md:text-6xl" id="products-title">
            Digital products shaped for Mississippi work.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-warm/80">
            Start with a template, subscribe to a managed starter, or begin a
            custom portal when the workflow needs more care.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Product categories">
            {categories.map((category) => (
              <li
                className="rounded-full border border-warm/20 bg-warm/10 px-4 py-2 text-sm font-semibold text-warm"
                key={category}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section aria-labelledby="products-grid-title" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
              Offers
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-navy" id="products-grid-title">
              Browse products
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-ink/75">
            Each product is built to stay accessible, easy to adapt, and ready
            for Stripe or Supabase when a workflow needs payments or data.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} priority={index < 2} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
