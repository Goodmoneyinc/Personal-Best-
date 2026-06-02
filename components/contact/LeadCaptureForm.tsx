'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface LeadFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  project_details: string;
  budget_range: string;
  timeline: string;
}

const initialValues: LeadFormValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  project_details: '',
  budget_range: '',
  timeline: '',
};

function getTrimmedValues(values: LeadFormValues): LeadFormValues {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    company: values.company.trim(),
    project_details: values.project_details.trim(),
    budget_range: values.budget_range,
    timeline: values.timeline,
  };
}

function getValidationMessage(values: LeadFormValues) {
  if (!values.name) {
    return 'Please enter your name.';
  }

  if (!values.email) {
    return 'Please enter your email address.';
  }

  if (!values.project_details) {
    return 'Please describe the project you need help with.';
  }

  if (values.project_details.length < 20) {
    return 'Project details must be at least 20 characters.';
  }

  return '';
}

export function LeadCaptureForm() {
  const [values, setValues] = useState<LeadFormValues>(initialValues);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  const isSubmitting = status === 'submitting';

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedValues = getTrimmedValues(values);
    const validationMessage = getValidationMessage(trimmedValues);

    if (validationMessage) {
      setStatus('error');
      setMessage(validationMessage);
      return;
    }

    setStatus('submitting');
    setMessage('');

    const payload = {
      name: trimmedValues.name,
      email: trimmedValues.email,
      phone: trimmedValues.phone || null,
      company: trimmedValues.company || null,
      project_details: trimmedValues.project_details,
      budget_range: trimmedValues.budget_range || null,
      timeline: trimmedValues.timeline || null,
      source: 'website',
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

      setValues(initialValues);
      setStatus('success');
      setMessage('Thanks. Fulatelier received your project details and will follow up soon.');
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? `Unable to send your inquiry: ${error.message}`
          : 'Unable to send your inquiry. Please try again or email Fulatelier directly.',
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
          <Input
            autoComplete="name"
            disabled={isSubmitting}
            id="name"
            name="name"
            onChange={handleInputChange}
            required
            type="text"
            value={values.name}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-navy" htmlFor="email">
            Email
          </label>
          <Input
            autoComplete="email"
            disabled={isSubmitting}
            id="email"
            name="email"
            onChange={handleInputChange}
            required
            type="email"
            value={values.email}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-navy" htmlFor="phone">
            Phone
          </label>
          <Input
            autoComplete="tel"
            disabled={isSubmitting}
            id="phone"
            name="phone"
            onChange={handleInputChange}
            type="tel"
            value={values.phone}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-navy" htmlFor="company">
            Company or organization
          </label>
          <Input
            autoComplete="organization"
            disabled={isSubmitting}
            id="company"
            name="company"
            onChange={handleInputChange}
            type="text"
            value={values.company}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-navy" htmlFor="budget_range">
            Budget range
          </label>
          <Select
            disabled={isSubmitting}
            id="budget_range"
            name="budget_range"
            onChange={handleInputChange}
            value={values.budget_range}
          >
            <option value="">Select a range</option>
            <option value="Under $1k">Under $1k</option>
            <option value="$1k–$5k">$1k–$5k</option>
            <option value="$5k–$15k">$5k–$15k</option>
            <option value="$15k+">$15k+</option>
          </Select>
        </div>
        <div>
          <label className="text-sm font-semibold text-navy" htmlFor="timeline">
            Ideal timeline
          </label>
          <Select
            disabled={isSubmitting}
            id="timeline"
            name="timeline"
            onChange={handleInputChange}
            value={values.timeline}
          >
            <option value="">Select a timeline</option>
            <option value="ASAP">ASAP</option>
            <option value="1–3 months">1–3 months</option>
            <option value="3–6 months">3–6 months</option>
            <option value="Flexible">Flexible</option>
          </Select>
        </div>
      </div>
      <div className="mt-5">
        <label className="text-sm font-semibold text-navy" htmlFor="project_details">
          Project details
        </label>
        <Textarea
          disabled={isSubmitting}
          id="project_details"
          minLength={20}
          name="project_details"
          onChange={handleInputChange}
          required
          value={values.project_details}
        />
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-6">
          {status === 'error' ? (
            <p className="text-sm font-semibold text-red-700" role="alert">
              {message}
            </p>
          ) : (
            <p
              aria-live="polite"
              className="text-sm font-semibold text-ink/75"
              role={status === 'success' ? 'status' : undefined}
            >
              {message || 'Tell us what you need built, improved, or launched.'}
            </p>
          )}
        </div>
        <Button aria-busy={isSubmitting} disabled={isSubmitting} type="submit" variant="secondary">
          {isSubmitting ? 'Sending...' : 'Send inquiry'}
        </Button>
      </div>
    </form>
  );
}
