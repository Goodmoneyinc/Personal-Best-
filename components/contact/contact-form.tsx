"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const contactSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email."),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceInterest: z.enum(
    [
      "Micro SaaS Tool",
      "Website Template",
      "Custom Build",
      "Government/Agency",
    ],
    {
      required_error: "Select a service interest.",
    },
  ),
  budgetRange: z.enum(
    ["Under $500", "$500-$2,000", "$2,000-$10,000", "$10,000+"],
    {
      required_error: "Select a budget range.",
    },
  ),
  projectDetails: z
    .string()
    .min(20, "Project details must be at least 20 characters."),
  source: z.enum(["TikTok", "Google", "Referral", "Other"], {
    required_error: "Select how you heard about us.",
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type LeadInsertPayload = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_details: string;
  budget_range: string;
  source: string;
  status: "new";
  notes: string;
  email_sent: boolean;
};

const inputClasses =
  "w-full rounded-md border border-[color-mix(in_srgb,var(--navy,var(--color-navy,#0A0F1E))_22%,transparent)] bg-white px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

const buttonFocusClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

function createBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="text-red-700">
        *
      </span>
      <span className="sr-only">Required field</span>
    </>
  );
}

function getDescribedBy(errorId?: string, helperId?: string) {
  return [errorId, helperId].filter(Boolean).join(" ") || undefined;
}

export function ContactForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceInterest: "Custom Build",
      budgetRange: "$2,000-$10,000",
      projectDetails: "",
      source: "Referral",
    },
  });

  useEffect(() => {
    const firstErrorField = Object.keys(errors)[0] as
      | keyof ContactFormValues
      | undefined;

    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  }, [errors, setFocus]);

  async function onSubmit(values: ContactFormValues) {
    setSubmitError(null);
    setSuccessMessage(null);

    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setSubmitError("Contact form is unavailable because Supabase is not configured.");
      return;
    }

    const leadPayload: LeadInsertPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() || null,
      company: values.company?.trim() || null,
      project_details: values.projectDetails.trim(),
      budget_range: values.budgetRange,
      source: values.source,
      status: "new",
      notes: `Service interest: ${values.serviceInterest}`,
      email_sent: false,
    };

    const { error } = await supabase.from("leads").insert(leadPayload);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    await fetch("/api/send-lead-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...leadPayload,
        service_interest: values.serviceInterest,
      }),
    }).catch(() => undefined);

    setSuccessMessage(
      "Thanks for reaching out. Fulatelier received your project details and will follow up soon.",
    );
    reset();
  }

  return (
    <form className="space-y-8" noValidate onSubmit={handleSubmit(onSubmit)}>
      {submitError ? (
        <div
          role="alert"
          className="rounded-md border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {submitError}
        </div>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-md border border-green-700 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {successMessage}
        </div>
      ) : null}

      <fieldset className="space-y-6">
        <legend className="text-xl font-semibold">Contact information</legend>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full-name">
              Full Name <RequiredMark />
            </Label>
            <input
              id="full-name"
              type="text"
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClasses}
              {...register("name")}
            />
            {errors.name ? (
              <p id="name-error" role="alert" className="text-sm text-red-700">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <RequiredMark />
            </Label>
            <input
              id="email"
              type="email"
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClasses}
              {...register("email")}
            />
            {errors.email ? (
              <p id="email-error" role="alert" className="text-sm text-red-700">
                {errors.email.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <input
              id="phone"
              type="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={inputClasses}
              {...register("phone")}
            />
            {errors.phone ? (
              <p id="phone-error" role="alert" className="text-sm text-red-700">
                {errors.phone.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <input
              id="company"
              type="text"
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "company-error" : undefined}
              className={inputClasses}
              {...register("company")}
            />
            {errors.company ? (
              <p
                id="company-error"
                role="alert"
                className="text-sm text-red-700"
              >
                {errors.company.message}
              </p>
            ) : null}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-xl font-semibold">Project details</legend>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="service-interest">
              Service Interest <RequiredMark />
            </Label>
            <Select
              id="service-interest"
              aria-required="true"
              aria-invalid={Boolean(errors.serviceInterest)}
              aria-describedby={
                errors.serviceInterest ? "service-interest-error" : undefined
              }
              {...register("serviceInterest")}
            >
              <option value="Micro SaaS Tool">Micro SaaS Tool</option>
              <option value="Website Template">Website Template</option>
              <option value="Custom Build">Custom Build</option>
              <option value="Government/Agency">Government/Agency</option>
            </Select>
            {errors.serviceInterest ? (
              <p
                id="service-interest-error"
                role="alert"
                className="text-sm text-red-700"
              >
                {errors.serviceInterest.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget-range">
              Budget Range <RequiredMark />
            </Label>
            <Select
              id="budget-range"
              aria-required="true"
              aria-invalid={Boolean(errors.budgetRange)}
              aria-describedby={
                errors.budgetRange ? "budget-range-error" : undefined
              }
              {...register("budgetRange")}
            >
              <option value="Under $500">Under $500</option>
              <option value="$500-$2,000">$500-$2,000</option>
              <option value="$2,000-$10,000">$2,000-$10,000</option>
              <option value="$10,000+">$10,000+</option>
            </Select>
            {errors.budgetRange ? (
              <p
                id="budget-range-error"
                role="alert"
                className="text-sm text-red-700"
              >
                {errors.budgetRange.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-details">
            Project Details <RequiredMark />
          </Label>
          <textarea
            id="project-details"
            rows={6}
            aria-required="true"
            aria-invalid={Boolean(errors.projectDetails)}
            aria-describedby={getDescribedBy(
              errors.projectDetails ? "project-details-error" : undefined,
              "project-details-help",
            )}
            className={inputClasses}
            {...register("projectDetails")}
          />
          <p
            id="project-details-help"
            className="text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]"
          >
            Share goals, constraints, and what success would look like.
          </p>
          {errors.projectDetails ? (
            <p
              id="project-details-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.projectDetails.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">
            How did you hear about us? <RequiredMark />
          </Label>
          <Select
            id="source"
            aria-required="true"
            aria-invalid={Boolean(errors.source)}
            aria-describedby={errors.source ? "source-error" : undefined}
            {...register("source")}
          >
            <option value="TikTok">TikTok</option>
            <option value="Google">Google</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </Select>
          {errors.source ? (
            <p id="source-error" role="alert" className="text-sm text-red-700">
              {errors.source.message}
            </p>
          ) : null}
        </div>
      </fieldset>

      <button
        type="submit"
        aria-label="Submit project inquiry to Fulatelier"
        disabled={isSubmitting}
        className={`rounded-md bg-[var(--navy,var(--color-navy,#0A0F1E))] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--navy,var(--color-navy,#0A0F1E))] disabled:cursor-not-allowed disabled:opacity-70 ${buttonFocusClasses}`}
      >
        {isSubmitting ? "Sending..." : "Send project inquiry"}
      </button>
    </form>
  );
}

export default ContactForm;
