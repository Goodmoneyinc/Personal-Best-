import Link from "next/link";
import { AppWindow, Blocks, Wrench } from "lucide-react";

const serviceTypes = [
  {
    href: "/products?type=saas",
    icon: AppWindow,
    name: "Micro SaaS",
    description:
      "Focused subscription tools that automate repeatable work for small teams and local agencies.",
    price: "From $29/mo",
  },
  {
    href: "/products?type=template",
    icon: Blocks,
    name: "Templates",
    description:
      "Ready-made websites, workflow kits, and launch assets you can customize quickly.",
    price: "From $49",
  },
  {
    href: "/products?type=custom",
    icon: Wrench,
    name: "Custom Work",
    description:
      "Purpose-built websites, portals, and automations designed around your operations.",
    price: "Starting at $2,000",
  },
] as const;

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

export function ProductTypes() {
  return (
    <section
      id="service-types"
      aria-labelledby="service-types-heading"
      className="bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
            What we build
          </p>
          <h2
            id="service-types-heading"
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Pick the lane that fits your next move.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {serviceTypes.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.name}
                aria-label={`${service.name}: ${service.description}`}
                className="group rounded-2xl border border-[color-mix(in_srgb,var(--accent-gold,var(--color-accent-gold,#C9A84C))_20%,transparent)] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <Icon
                  aria-hidden="true"
                  className="h-8 w-8 text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
                />
                <h3 className="mt-5 text-xl font-semibold">{service.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
                  {service.description}
                </p>
                <p className="mt-5 font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))]">
                  {service.price}
                </p>
                <Link
                  href={service.href}
                  className={`mt-6 inline-flex rounded-md text-sm font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))] transition-colors hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] ${focusRingClasses}`}
                >
                  Explore {service.name}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
