import Link from 'next/link';

const adminCards = [
  {
    href: '/admin/products',
    title: 'Products manager',
    description: 'Review active offers, Stripe readiness, featured status, and order.',
  },
  {
    href: '/admin/leads',
    title: 'Leads pipeline',
    description: 'Track new, contacted, qualified, converted, and closed inquiries.',
  },
  {
    href: '/admin/a11y-checklist',
    title: 'Accessibility checklist',
    description: 'Keep WCAG 2.1 AA and Section 508 checks visible before launch.',
  },
];

export const metadata = {
  title: 'Admin',
};

export default function AdminOverviewPage() {
  return (
    <section aria-labelledby="admin-overview-title" className="rounded-[2rem] bg-warm p-6 text-navy shadow-card md:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
        Operations dashboard
      </p>
      <h2 className="mt-3 font-display text-4xl font-bold" id="admin-overview-title">
        Marketplace control room
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {adminCards.map((card) => (
          <Link
            className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            href={card.href}
            key={card.href}
          >
            <h3 className="font-display text-2xl font-bold">{card.title}</h3>
            <p className="mt-3 text-sm leading-6 text-ink/75">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
