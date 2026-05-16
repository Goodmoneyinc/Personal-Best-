import { BuildLogPreview } from "@/components/home/build-log-preview";
import { CaseStudies } from "@/components/home/case-studies";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { ProductTypes } from "@/components/home/product-types";

const sectionLinks = [
  { href: "#hero", label: "Skip to hero" },
  { href: "#service-types", label: "Skip to service types" },
  { href: "#featured-products", label: "Skip to featured products" },
  { href: "#recent-work", label: "Skip to recent work" },
  { href: "#build-log-preview", label: "Skip to build log preview" },
  { href: "#start-project", label: "Skip to start project" },
] as const;

export default function HomePage() {
  return (
    <main id="main-content">
      <nav
        aria-label="Home page section navigation"
        className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:left-4 focus-within:top-20 focus-within:z-50 focus-within:rounded-lg focus-within:bg-white focus-within:p-4 focus-within:shadow-xl"
      >
        <ul className="space-y-2">
          {sectionLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-sm text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Hero />
      <ProductTypes />
      <FeaturedProducts />
      <CaseStudies />
      <BuildLogPreview />
      <CtaSection />
    </main>
  );
}
