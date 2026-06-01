const checklist = [
  'Skip navigation link is present before the header.',
  'Every interactive element has a visible 2px focus outline with offset.',
  'Inputs use label elements with htmlFor and matching ids.',
  'Meaningful images include descriptive alt text.',
  'Sections use semantic landmarks and aria-labelledby where helpful.',
  'Loading and submission states use role="status" with aria-live="polite".',
  'Color contrast meets WCAG 2.1 AA for normal and large text.',
];

export const metadata = {
  title: 'Accessibility checklist',
};

export default function AdminA11yChecklistPage() {
  return (
    <section aria-labelledby="admin-a11y-title" className="rounded-[2rem] bg-warm p-6 text-navy shadow-card md:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
        Section 508 / WCAG 2.1 AA
      </p>
      <h2 className="mt-3 font-display text-4xl font-bold" id="admin-a11y-title">
        Launch accessibility checklist
      </h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Accessibility checklist">
        {checklist.map((item) => (
          <li
            className="rounded-3xl border border-navy/10 bg-white p-5 text-sm font-semibold leading-6 text-navy shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow"
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
