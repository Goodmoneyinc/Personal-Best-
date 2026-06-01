const pipeline = [
  {
    status: 'new',
    description: 'Fresh inquiries from the public intake form.',
  },
  {
    status: 'contacted',
    description: 'Replies sent and discovery questions underway.',
  },
  {
    status: 'qualified',
    description: 'Scope, budget, and operational fit are clear.',
  },
  {
    status: 'converted',
    description: 'Accepted work or checkout conversion.',
  },
  {
    status: 'closed',
    description: 'Archived or declined opportunities.',
  },
];

export const metadata = {
  title: 'Leads pipeline',
};

export default function AdminLeadsPage() {
  return (
    <section aria-labelledby="admin-leads-title" className="rounded-[2rem] bg-warm p-6 text-navy shadow-card md:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
        Leads pipeline
      </p>
      <h2 className="mt-3 font-display text-4xl font-bold" id="admin-leads-title">
        Inquiry stages
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/75">
        The protected API at /api/admin/leads can load and update Supabase lead
        records once service-role credentials and ADMIN_API_TOKEN are configured.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-5">
        {pipeline.map((column) => (
          <article
            className="rounded-3xl border border-navy/10 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow"
            key={column.status}
          >
            <h3 className="font-display text-2xl font-bold capitalize">{column.status}</h3>
            <p className="mt-3 text-sm leading-6 text-ink/75">{column.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
