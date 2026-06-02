import { LeadCaptureForm } from '@/components/contact/LeadCaptureForm';

export const metadata = {
  title: 'Start a project',
  description:
    'Send Fulatelier details about a Mississippi web product, storefront, booking flow, or custom portal project.',
};

export default function ContactPage() {
  return (
    <>
      <section aria-labelledby="contact-title" className="bg-navy px-6 py-16 text-warm lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
            Custom build intake
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-tight text-balance md:text-6xl" id="contact-title">
            Tell Fulatelier what needs to work better.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-warm/80">
            Share the workflow, audience, budget range, and launch context. The
            first pass is about finding the smallest useful system to build.
          </p>
        </div>
      </section>
      <section aria-labelledby="contact-form-title" className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
            Project notes
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold text-navy" id="contact-form-title">
            A clear intake makes the build sharper.
          </h2>
          <p className="mt-4 text-base leading-7 text-ink/75">
            Fulatelier works best on booking systems, storefronts, client
            portals, launch pages, and operational dashboards for Mississippi
            teams.
          </p>
          <p className="mt-4 text-base leading-7 text-ink/75">
            Use the intake form for project requests, or reach out directly if
            you want to compare options before choosing a scope.
          </p>
          <div className="mt-8 rounded-[2rem] border border-navy/10 bg-white/80 p-6 shadow-card">
            <h3 className="font-display text-2xl font-bold text-navy">
              Contact Fulatelier
            </h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-navy">
              <li>
                <a
                  className="rounded-sm underline decoration-gold decoration-2 underline-offset-4 hover:text-[#6F5921] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  href="mailto:hello@fulatelier.com"
                >
                  hello@fulatelier.com
                </a>
              </li>
              <li>
                <a
                  className="rounded-sm underline decoration-gold decoration-2 underline-offset-4 hover:text-[#6F5921] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  href="https://www.tiktok.com/@fulatelier"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  TikTok build notes
                </a>
              </li>
              <li>
                <a
                  className="rounded-sm underline decoration-gold decoration-2 underline-offset-4 hover:text-[#6F5921] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  href="https://www.instagram.com/fulatelier"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Instagram workshop updates
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-8 rounded-[2rem] border border-navy/10 bg-white/80 p-6 shadow-card">
            <h3 className="font-display text-2xl font-bold text-navy">
              Useful details to include
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/75">
              <li>Who uses the system and what they need to finish.</li>
              <li>What tools you already use for payments, data, or email.</li>
              <li>Any launch date, event, campaign, or seasonal deadline.</li>
            </ul>
          </div>
        </div>
        <div>
          <LeadCaptureForm />
        </div>
      </section>
    </>
  );
}
