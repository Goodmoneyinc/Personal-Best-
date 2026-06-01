'use client';

import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export function LeadForm() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState('submitting');
    setMessage('Sending your project details...');

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: getFormValue(formData, 'name'),
      email: getFormValue(formData, 'email'),
      phone: getFormValue(formData, 'phone') || null,
      company: getFormValue(formData, 'company') || null,
      project_details: getFormValue(formData, 'project_details'),
      budget_range: getFormValue(formData, 'budget_range') || null,
      timeline: getFormValue(formData, 'timeline') || null,
      source: 'website-contact',
      status: 'new' as const,
      email_sent: false,
    };

    try {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        throw new Error('Lead storage is not configured yet.');
      }

      const { error } = await supabase.from('leads').insert(payload);

      if (error) {
        throw error;
      }

      event.currentTarget.reset();
      setSubmitState('success');
      setMessage('Thanks. Fulatelier will review your project details and follow up.');
    } catch (error) {
      setSubmitState('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while sending your inquiry.',
      );
    }
  }

  return (
    <form
      className="rounded-[2rem] border border-navy/10 bg-white/85 p-6 shadow-card md:p-8"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-navy" htmlFor="name">
            Name
          </label>
          <input
            className="mt-2 min-h-12 w-full rounded-xl border border-navy/20 bg-warm px-4 text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            id="name"
            name="name"
            required
            type="text"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-navy" htmlFor="email">
            Email
          </label>
          <input
            className="mt-2 min-h-12 w-full rounded-xl border border-navy/20 bg-warm px-4 text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-navy" htmlFor="phone">
            Phone
          </label>
          <input
            className="mt-2 min-h-12 w-full rounded-xl border border-navy/20 bg-warm px-4 text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            id="phone"
            name="phone"
            type="tel"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-navy" htmlFor="company">
            Company or organization
          </label>
          <input
            className="mt-2 min-h-12 w-full rounded-xl border border-navy/20 bg-warm px-4 text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            id="company"
            name="company"
            type="text"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-navy" htmlFor="budget_range">
            Budget range
          </label>
          <select
            className="mt-2 min-h-12 w-full rounded-xl border border-navy/20 bg-warm px-4 text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            id="budget_range"
            name="budget_range"
          >
            <option value="">Select a range</option>
            <option value="$500-$1,500">$500-$1,500</option>
            <option value="$1,500-$5,000">$1,500-$5,000</option>
            <option value="$5,000-$12,000">$5,000-$12,000</option>
            <option value="$12,000+">$12,000+</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-navy" htmlFor="timeline">
            Ideal timeline
          </label>
          <select
            className="mt-2 min-h-12 w-full rounded-xl border border-navy/20 bg-warm px-4 text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            id="timeline"
            name="timeline"
          >
            <option value="">Select a timeline</option>
            <option value="This month">This month</option>
            <option value="Next 60 days">Next 60 days</option>
            <option value="This quarter">This quarter</option>
            <option value="Exploring options">Exploring options</option>
          </select>
        </div>
      </div>
      <div className="mt-5">
        <label className="text-sm font-semibold text-navy" htmlFor="project_details">
          Project details
        </label>
        <textarea
          className="mt-2 min-h-36 w-full rounded-xl border border-navy/20 bg-warm px-4 py-3 text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          id="project_details"
          name="project_details"
          required
        />
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          aria-live="polite"
          className={
            submitState === 'error'
              ? 'text-sm font-semibold text-red-700'
              : 'text-sm font-semibold text-ink/75'
          }
          role="status"
        >
          {message || 'Tell us what you need built, improved, or launched.'}
        </p>
        <Button disabled={submitState === 'submitting'} type="submit" variant="secondary">
          {submitState === 'submitting' ? 'Sending...' : 'Send inquiry'}
        </Button>
      </div>
    </form>
  );
}
