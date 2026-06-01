import Link from 'next/link';

import { ProductCard } from '@/components/product-card';
import { ButtonLink } from '@/components/ui/button';
import { caseStudies, getFeaturedProducts, videoLogs } from '@/lib/data/products';

const featuredProducts = getFeaturedProducts();
const featuredCaseStudy = caseStudies.find((study) => study.featured);
const featuredVideo = videoLogs.find((video) => video.is_active);

export default function HomePage() {
  return (
    <>
      <section
        aria-labelledby="home-hero-title"
        className="relative isolate overflow-hidden bg-navy text-warm"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.28),transparent_28rem)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
              Mississippi digital workshop
            </p>
            <h1
              className="mt-5 max-w-4xl font-display text-5xl font-bold leading-tight text-balance md:text-7xl"
              id="home-hero-title"
            >
              Practical web products for local operators with big plans.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-warm/80">
              Fulatelier packages booking flows, storefront starters, and custom
              portals for makers, consultants, agencies, and neighborhood teams
              across Mississippi.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/products">Browse marketplace</ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Request a custom build
              </ButtonLink>
            </div>
          </div>
          <aside
            aria-label="Fulatelier service highlights"
            className="rounded-[2rem] border border-warm/15 bg-warm/10 p-6 shadow-glow backdrop-blur"
          >
            <div className="grid gap-4">
              {[
                ['01', 'Launch-ready templates with Mississippi-specific copy'],
                ['02', 'Custom builds scoped around operations, not buzzwords'],
                ['03', 'Stripe and Supabase paths ready for paid workflows'],
              ].map(([number, text]) => (
                <div className="rounded-3xl border border-warm/15 bg-navy/55 p-5" key={number}>
                  <p className="font-display text-4xl text-gold">{number}</p>
                  <p className="mt-3 text-sm leading-6 text-warm/80">{text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

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
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} priority={index === 0} product={product} />
          ))}
        </div>
      </section>

      <section aria-labelledby="proof-title" className="bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-2 lg:px-8">
          <article className="rounded-[2rem] border border-navy/10 bg-warm p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
              Case study
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy" id="proof-title">
              {featuredCaseStudy?.title ?? 'Built for Mississippi launches'}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/75">
              {featuredCaseStudy?.description ??
                'Fulatelier turns repeatable local business needs into clean, accessible digital systems.'}
            </p>
          </article>
          <article className="rounded-[2rem] border border-navy/10 bg-navy p-8 text-warm shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
              Video log
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">
              {featuredVideo?.title ?? 'Build notes from the workshop'}
            </h2>
            <p className="mt-4 text-base leading-7 text-warm/80">
              {featuredVideo?.description ??
                'Short product walkthroughs and launch lessons will live here as the marketplace grows.'}
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
