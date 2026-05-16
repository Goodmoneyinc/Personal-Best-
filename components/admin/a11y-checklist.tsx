"use client";

import { useEffect, useState } from "react";

type CheckStatus = "pass" | "fail" | "manual";

type AccessibilityCheck = {
  id: string;
  item: string;
  status: CheckStatus;
  details: string;
};

const statusLabels: Record<CheckStatus, string> = {
  pass: "✅ Pass",
  fail: "❌ Fail",
  manual: "⚠️ Manual Check needed",
};

const statusClasses: Record<CheckStatus, string> = {
  pass: "text-green-800",
  fail: "text-red-800",
  manual: "text-amber-800",
};

function hasAssociatedLabel(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  if (field.getAttribute("aria-label") || field.getAttribute("aria-labelledby")) {
    return true;
  }

  if (field.id && document.querySelector(`label[for="${CSS.escape(field.id)}"]`)) {
    return true;
  }

  return Boolean(field.closest("label"));
}

function runAccessibilityChecks(): AccessibilityCheck[] {
  const fields = Array.from(
    document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input:not([type='hidden']), select, textarea",
    ),
  );

  const images = Array.from(document.querySelectorAll("img"));
  const links = Array.from(document.querySelectorAll("a"));

  return [
    {
      id: "skip-link",
      item: "Skip link present",
      status: document.querySelector('a[href="#main-content"]') ? "pass" : "fail",
      details: 'Checks for a link targeting "#main-content".',
    },
    {
      id: "main-landmark",
      item: "Main landmark present",
      status: document.querySelector("main#main-content") ? "pass" : "fail",
      details: 'Checks for <main id="main-content">.',
    },
    {
      id: "image-alt",
      item: "All images have alt text",
      status: images.every((img) => img.hasAttribute("alt")) ? "pass" : "fail",
      details: `${images.length} image${images.length === 1 ? "" : "s"} checked.`,
    },
    {
      id: "input-labels",
      item: "All inputs have labels",
      status: fields.every(hasAssociatedLabel) ? "pass" : "fail",
      details:
        "Checks inputs, selects, and textareas for aria-label, aria-labelledby, an associated label[for], or a wrapping label.",
    },
    {
      id: "empty-links",
      item: "No empty links",
      status: links.every((link) => link.textContent?.trim() || link.getAttribute("aria-label"))
        ? "pass"
        : "fail",
      details: `${links.length} link${links.length === 1 ? "" : "s"} checked.`,
    },
    {
      id: "page-h1",
      item: "Page has h1",
      status: document.querySelector("h1") ? "pass" : "fail",
      details: "Checks for at least one h1 on the current page.",
    },
    {
      id: "html-lang",
      item: "Language attribute on html",
      status: document.documentElement.lang !== "" ? "pass" : "fail",
      details: `Current lang value: ${document.documentElement.lang || "missing"}.`,
    },
    {
      id: "manual-testing",
      item: "Screen reader and keyboard-only testing",
      status: "manual",
      details: "Automated DOM checks cannot verify reading order, focus order, or real assistive technology behavior.",
    },
  ];
}

export function A11yChecklist() {
  const [checks, setChecks] = useState<AccessibilityCheck[]>([]);

  useEffect(() => {
    setChecks(runAccessibilityChecks());
  }, []);

  return (
    <section aria-labelledby="a11y-checklist-heading" className="space-y-6">
      <div>
        <h1 id="a11y-checklist-heading" className="text-3xl font-semibold tracking-tight">
          Section 508 self-audit
        </h1>
        <p className="mt-2 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
          Run a lightweight automated accessibility scan against the current admin page.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-black/10">
          <caption className="sr-only">Section 508 self-audit checklist</caption>
          <thead className="bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))]">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                Checklist item
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {checks.map((check) => (
              <tr key={check.id}>
                <td className="px-4 py-4 font-medium">{check.item}</td>
                <td className={`px-4 py-4 font-semibold ${statusClasses[check.status]}`}>
                  {statusLabels[check.status]}
                </td>
                <td className="px-4 py-4 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
                  {check.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="rounded-md border border-amber-700 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        This automated check covers ~30% of 508 requirements. Manual testing with a screen reader
        (NVDA/JAWS) and keyboard-only navigation is required before government submissions.
      </p>
    </section>
  );
}

export default A11yChecklist;
