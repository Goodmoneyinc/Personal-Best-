"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Lead } from "@/lib/types";

type LeadsApiResponse = {
  leads?: Lead[];
  error?: string;
};

type LeadApiResponse = {
  lead?: Lead;
  error?: string;
};

const statuses: { value: Lead["status"]; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

const actionButtonClasses = [
  "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
  "hover:border-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]",
  focusRingClasses,
].join(" ");

function formatStatus(status: Lead["status"]) {
  return statuses.find((item) => item.value === status)?.label ?? status;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getProjectSnippet(value: string) {
  if (value.length <= 120) {
    return value;
  }

  return `${value.slice(0, 117)}...`;
}

function getNextStatus(status: Lead["status"]) {
  const currentIndex = statuses.findIndex((item) => item.value === status);
  return statuses[currentIndex + 1]?.value;
}

export function LeadPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isTableView, setIsTableView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notesLead, setNotesLead] = useState<Lead | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const leadsByStatus = useMemo(() => {
    return statuses.reduce<Record<Lead["status"], Lead[]>>(
      (groups, status) => ({
        ...groups,
        [status.value]: leads.filter((lead) => lead.status === status.value),
      }),
      {
        new: [],
        contacted: [],
        qualified: [],
        converted: [],
        closed: [],
      },
    );
  }, [leads]);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const response = await fetch("/api/admin/leads", {
      cache: "no-store",
    });
    const body = (await response.json()) as LeadsApiResponse;

    if (!response.ok) {
      setLeads([]);
      setErrorMessage(body.error ?? "Leads could not be loaded.");
      setIsLoading(false);
      return;
    }

    setLeads(body.leads ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  function openNotesDialog(lead: Lead) {
    setNotesLead(lead);
    setNotesValue(lead.notes ?? "");
  }

  async function updateLead(
    lead: Lead,
    payload: Partial<Pick<Lead, "status" | "notes">>,
  ) {
    setIsSaving(true);
    setErrorMessage(null);

    const response = await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as LeadApiResponse;

    if (!response.ok || !body.lead) {
      setErrorMessage(body.error ?? "Lead could not be updated.");
      setIsSaving(false);
      return null;
    }

    setLeads((currentLeads) =>
      currentLeads.map((currentLead) =>
        currentLead.id === body.lead!.id ? body.lead! : currentLead,
      ),
    );
    setIsSaving(false);

    return body.lead;
  }

  async function moveLeadForward(lead: Lead) {
    const nextStatus = getNextStatus(lead.status);

    if (!nextStatus) {
      return;
    }

    const updatedLead = await updateLead(lead, { status: nextStatus });

    if (updatedLead) {
      setStatusMessage(`Lead moved to ${formatStatus(updatedLead.status)}`);
    }
  }

  async function saveNotes() {
    if (!notesLead) {
      return;
    }

    const updatedLead = await updateLead(notesLead, { notes: notesValue });

    if (updatedLead) {
      setStatusMessage(`Notes updated for ${updatedLead.name}`);
      setNotesLead(null);
    }
  }

  function renderLeadCard(lead: Lead) {
    const createdDate = formatDate(lead.created_at);
    const nextStatus = getNextStatus(lead.status);

    return (
      <article
        key={lead.id}
        role="article"
        aria-label={`${lead.name}'s lead from ${createdDate}`}
        className="rounded-2xl border bg-white p-4 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">{lead.name}</h3>
            <a
              href={`mailto:${lead.email}`}
              className={`mt-1 inline-flex rounded-sm text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))] hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] ${focusRingClasses}`}
            >
              {lead.email}
            </a>
          </div>
          <time
            dateTime={lead.created_at}
            className="shrink-0 text-xs text-[var(--slate-gray,var(--color-slate-gray,#64748B))]"
          >
            {createdDate}
          </time>
        </div>

        <p className="mt-3 text-sm leading-6">
          {getProjectSnippet(lead.project_details)}
        </p>

        <p className="mt-3 text-sm">
          <span className="font-semibold">Budget:</span>{" "}
          {lead.budget_range || "Not provided"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            aria-label={
              nextStatus
                ? `Move ${lead.name} to ${formatStatus(nextStatus)}`
                : `${lead.name} is already closed`
            }
            disabled={!nextStatus || isSaving}
            className={`${actionButtonClasses} disabled:cursor-not-allowed disabled:opacity-60`}
            onClick={() => void moveLeadForward(lead)}
          >
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
            Move
          </button>
          <button
            type="button"
            aria-label={`View full details for ${lead.name}`}
            className={actionButtonClasses}
            onClick={() => setSelectedLead(lead)}
          >
            <Eye aria-hidden="true" className="h-4 w-4" />
            Details
          </button>
          <button
            type="button"
            aria-label={`Add or edit notes for ${lead.name}`}
            className={actionButtonClasses}
            onClick={() => openNotesDialog(lead)}
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Notes
          </button>
        </div>
      </article>
    );
  }

  return (
    <section aria-labelledby="lead-pipeline-heading" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            id="lead-pipeline-heading"
            className="text-3xl font-semibold tracking-tight"
          >
            Lead pipeline
          </h1>
          <p className="mt-2 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
            Review inquiries, update notes, and advance leads without relying
            on drag-and-drop.
          </p>
        </div>
        <button
          type="button"
          aria-pressed={isTableView}
          className={`rounded-md bg-[var(--navy,var(--color-navy,#0A0F1E))] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--navy,var(--color-navy,#0A0F1E))] ${focusRingClasses}`}
          onClick={() => setIsTableView((current) => !current)}
        >
          {isTableView ? "Switch to Board View" : "Switch to Table View"}
        </button>
      </div>

      {statusMessage ? (
        <div role="status" aria-live="polite" className="rounded-md border border-green-700 bg-green-50 px-4 py-3 text-sm text-green-800">
          {statusMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div role="alert" className="rounded-md border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div role="status" aria-live="polite" className="rounded-2xl bg-white p-6 shadow-sm">
          Loading leads...
        </div>
      ) : isTableView ? (
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-black/10">
            <caption className="sr-only">Lead pipeline table view</caption>
            <thead className="bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))]">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                  Budget
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                  Created
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {leads.map((lead) => {
                const nextStatus = getNextStatus(lead.status);

                return (
                  <tr key={lead.id}>
                    <td className="px-4 py-4">{lead.name}</td>
                    <td className="px-4 py-4">
                      <a
                        href={`mailto:${lead.email}`}
                        className={`rounded-sm hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] ${focusRingClasses}`}
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-4 py-4">{formatStatus(lead.status)}</td>
                    <td className="px-4 py-4">{lead.budget_range || "Not provided"}</td>
                    <td className="px-4 py-4">{formatDate(lead.created_at)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          aria-label={
                            nextStatus
                              ? `Move ${lead.name} to ${formatStatus(nextStatus)}`
                              : `${lead.name} is already closed`
                          }
                          disabled={!nextStatus || isSaving}
                          className={`${actionButtonClasses} disabled:cursor-not-allowed disabled:opacity-60`}
                          onClick={() => void moveLeadForward(lead)}
                        >
                          Move
                        </button>
                        <button
                          type="button"
                          aria-label={`View full details for ${lead.name}`}
                          className={actionButtonClasses}
                          onClick={() => setSelectedLead(lead)}
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          aria-label={`Add or edit notes for ${lead.name}`}
                          className={actionButtonClasses}
                          onClick={() => openNotesDialog(lead)}
                        >
                          Notes
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-5">
          {statuses.map((status) => {
            const columnLeads = leadsByStatus[status.value];

            return (
              <section
                key={status.value}
                role="region"
                aria-label={`${status.label} leads`}
                className="rounded-2xl border bg-white/70 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">{status.label}</h2>
                  <span
                    aria-label={`${columnLeads.length} leads in ${status.label} status`}
                    className="rounded-full bg-[var(--navy,var(--color-navy,#0A0F1E))] px-3 py-1 text-xs font-semibold text-white"
                  >
                    {columnLeads.length}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {columnLeads.length > 0 ? (
                    columnLeads.map((lead) => renderLeadCard(lead))
                  ) : (
                    <p className="rounded-xl border border-dashed p-4 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
                      No leads in this status.
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <Dialog open={Boolean(selectedLead)} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent
          aria-labelledby="lead-details-title"
          aria-describedby="lead-details-description"
        >
          <DialogHeader>
            <DialogTitle id="lead-details-title">
              {selectedLead?.name ?? "Lead"} details
            </DialogTitle>
            <DialogDescription id="lead-details-description">
              Full lead inquiry information and contact context.
            </DialogDescription>
          </DialogHeader>
          {selectedLead ? (
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-semibold">Email</dt>
                <dd>{selectedLead.email}</dd>
              </div>
              <div>
                <dt className="font-semibold">Phone</dt>
                <dd>{selectedLead.phone || "Not provided"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Company</dt>
                <dd>{selectedLead.company || "Not provided"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Timeline</dt>
                <dd>{selectedLead.timeline || "Not provided"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Budget</dt>
                <dd>{selectedLead.budget_range || "Not provided"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Source</dt>
                <dd>{selectedLead.source}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold">Project details</dt>
                <dd className="mt-1 whitespace-pre-wrap">{selectedLead.project_details}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold">Notes</dt>
                <dd className="mt-1 whitespace-pre-wrap">
                  {selectedLead.notes || "No notes yet."}
                </dd>
              </div>
            </dl>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(notesLead)} onOpenChange={(open) => !open && setNotesLead(null)}>
        <DialogContent
          aria-labelledby="lead-notes-title"
          aria-describedby="lead-notes-description"
        >
          <DialogHeader>
            <DialogTitle id="lead-notes-title">
              Notes for {notesLead?.name ?? "lead"}
            </DialogTitle>
            <DialogDescription id="lead-notes-description">
              Add internal context for future follow-up.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-3">
            <Label htmlFor="lead-notes">Lead notes</Label>
            <textarea
              id="lead-notes"
              rows={8}
              value={notesValue}
              className="w-full rounded-md border border-[color-mix(in_srgb,var(--navy,var(--color-navy,#0A0F1E))_22%,transparent)] bg-white px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
              onChange={(event) => setNotesValue(event.target.value)}
            />
          </div>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className={`rounded-md border px-4 py-2 text-sm font-semibold ${focusRingClasses}`}
              onClick={() => setNotesLead(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving}
              className={`rounded-md bg-[var(--navy,var(--color-navy,#0A0F1E))] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 ${focusRingClasses}`}
              onClick={() => void saveNotes()}
            >
              {isSaving ? "Saving..." : "Save notes"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default LeadPipeline;
