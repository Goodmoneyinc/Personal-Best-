'use client';

import { useEffect, useMemo, useState } from 'react';

import { Select } from '@/components/ui/select';
import type { Lead } from '@/lib/types';

const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'converted', 'closed'];

const statusDescriptions: Record<Lead['status'], string> = {
  new: 'Fresh inquiries from the public intake form.',
  contacted: 'Replies sent and discovery questions underway.',
  qualified: 'Scope, budget, and operational fit are clear.',
  converted: 'Accepted work or checkout conversion.',
  closed: 'Archived or declined opportunities.',
};

function isLead(value: unknown): value is Lead {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value &&
    'status' in value
  );
}

function isLeadsResponse(value: unknown): value is { leads: Lead[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'leads' in value &&
    Array.isArray((value as { leads?: unknown }).leads)
  );
}

function getErrorMessage(value: unknown, fallback: string) {
  if (typeof value === 'object' && value !== null && 'error' in value) {
    const error = (value as { error?: unknown }).error;
    if (typeof error === 'string') {
      return error;
    }
  }

  return fallback;
}

export function LeadPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadLeads() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch('/api/admin/leads');
        const data: unknown = await response.json();

        if (!response.ok) {
          throw new Error(getErrorMessage(data, 'Unable to load leads.'));
        }

        if (!isLeadsResponse(data)) {
          throw new Error('Leads response was not in the expected format.');
        }

        setLeads(data.leads.filter(isLead));
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load leads.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadLeads();
  }, []);

  const leadsByStatus = useMemo(
    () =>
      statuses.reduce<Record<Lead['status'], Lead[]>>(
        (groups, status) => ({
          ...groups,
          [status]: leads.filter((lead) => lead.status === status),
        }),
        {
          new: [],
          contacted: [],
          qualified: [],
          converted: [],
          closed: [],
        },
      ),
    [leads],
  );

  async function updateLeadStatus(lead: Lead, status: Lead['status']) {
    const previousStatus = lead.status;
    setLeads((currentLeads) =>
      currentLeads.map((item) => (item.id === lead.id ? { ...item, status } : item)),
    );
    setMessage(`${lead.name} moved to ${status}.`);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(data, 'Unable to update lead status.'));
      }
    } catch (error) {
      setLeads((currentLeads) =>
        currentLeads.map((item) =>
          item.id === lead.id ? { ...item, status: previousStatus } : item,
        ),
      );
      setMessage('');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update lead status.');
    }
  }

  return (
    <section aria-labelledby="admin-leads-title" className="rounded-[2rem] bg-warm p-6 text-navy shadow-card md:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
        Leads pipeline
      </p>
      <h2 className="mt-3 font-display text-4xl font-bold" id="admin-leads-title">
        Inquiry stages
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/75">
        Review intake form submissions and move each inquiry through the
        follow-up pipeline.
      </p>

      <div className="mt-5 min-h-6">
        {errorMessage ? (
          <p className="text-sm font-semibold text-red-700" role="alert">
            {errorMessage}
          </p>
        ) : (
          <p aria-live="polite" className="text-sm font-semibold text-ink/75" role="status">
            {message || (isLoading ? 'Loading leads...' : `${leads.length} leads loaded.`)}
          </p>
        )}
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-5">
        {statuses.map((status) => (
          <section
            aria-labelledby={`lead-status-${status}`}
            className="rounded-3xl border border-navy/10 bg-white p-4 shadow-card"
            key={status}
          >
            <h3 className="font-display text-2xl font-bold capitalize" id={`lead-status-${status}`}>
              {status}
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink/75">{statusDescriptions[status]}</p>
            <div className="mt-5 space-y-4">
              {leadsByStatus[status].map((lead) => {
                const selectId = `lead-status-select-${lead.id}`;

                return (
                  <article
                    className="rounded-2xl border border-navy/10 bg-warm p-4"
                    key={lead.id}
                  >
                    <h4 className="font-display text-xl font-bold text-navy">{lead.name}</h4>
                    <a
                      className="mt-2 block rounded-sm text-sm font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-[#6F5921] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                      href={`mailto:${lead.email}`}
                    >
                      {lead.email}
                    </a>
                    <dl className="mt-3 space-y-1 text-sm text-ink/75">
                      <div>
                        <dt className="sr-only">Budget</dt>
                        <dd>Budget: {lead.budget_range ?? 'Not provided'}</dd>
                      </div>
                      <div>
                        <dt className="sr-only">Timeline</dt>
                        <dd>Timeline: {lead.timeline ?? 'Not provided'}</dd>
                      </div>
                    </dl>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/75">
                      {lead.project_details}
                    </p>
                    <label className="mt-4 block text-sm font-semibold text-navy" htmlFor={selectId}>
                      Update status
                    </label>
                    <Select
                      id={selectId}
                      onChange={(event) =>
                        void updateLeadStatus(lead, event.target.value as Lead['status'])
                      }
                      value={lead.status}
                    >
                      {statuses.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </article>
                );
              })}
              {!isLoading && leadsByStatus[status].length === 0 ? (
                <p className="rounded-2xl border border-navy/10 bg-warm p-4 text-sm text-ink/75">
                  No {status} leads.
                </p>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
