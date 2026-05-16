import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarClock, FileText, ShieldCheck } from "lucide-react";

import { getSupabaseProjectRef, supabaseAdmin } from "@/lib/supabase/admin";

const PERMIT_TRACKER_PRODUCT_ID = "permit-tracker";

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function maybeDecodeBase64(value: string) {
  if (!value.startsWith("base64-")) {
    return value;
  }

  try {
    return Buffer.from(value.replace("base64-", ""), "base64").toString(
      "utf8",
    );
  } catch {
    return value;
  }
}

function getAccessTokenFromCookieValue(value: string) {
  const decodedValue = maybeDecodeBase64(decodeCookieValue(value));

  if (decodedValue.split(".").length === 3) {
    return decodedValue;
  }

  try {
    const parsed = JSON.parse(decodedValue) as unknown;

    if (Array.isArray(parsed) && typeof parsed[0] === "string") {
      return parsed[0];
    }

    if (parsed && typeof parsed === "object") {
      const session = parsed as {
        access_token?: unknown;
        currentSession?: { access_token?: unknown };
      };

      if (typeof session.access_token === "string") {
        return session.access_token;
      }

      if (typeof session.currentSession?.access_token === "string") {
        return session.currentSession.access_token;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getSupabaseAccessToken() {
  const cookieStore = cookies();
  const projectRef = getSupabaseProjectRef();
  const candidateNames = [
    projectRef ? `sb-${projectRef}-auth-token` : null,
    "sb-access-token",
    "supabase-auth-token",
    "supabase.auth.token",
  ].filter((name): name is string => Boolean(name));

  const explicitCookie = candidateNames
    .map((name) => cookieStore.get(name))
    .find(Boolean);
  const authCookie =
    explicitCookie ??
    cookieStore
      .getAll()
      .find(
        (cookie) =>
          cookie.name.startsWith("sb-") &&
          cookie.name.endsWith("-auth-token"),
      );

  return authCookie ? getAccessTokenFromCookieValue(authCookie.value) : null;
}

async function getPermitTrackerAccess() {
  if (!supabaseAdmin) {
    return {
      isAuthenticated: false,
      hasAccess: false,
    };
  }

  const accessToken = getSupabaseAccessToken();

  if (!accessToken) {
    return {
      isAuthenticated: false,
      hasAccess: false,
    };
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !user) {
    return {
      isAuthenticated: false,
      hasAccess: false,
    };
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("has_access, purchased_saas_id")
    .eq("id", user.id)
    .maybeSingle();

  return {
    isAuthenticated: true,
    hasAccess:
      profile?.has_access === true ||
      profile?.purchased_saas_id === PERMIT_TRACKER_PRODUCT_ID,
    email: user.email,
  };
}

export default async function PermitTrackerDashboardPage() {
  const access = await getPermitTrackerAccess();

  if (!access.isAuthenticated) {
    redirect("/admin/login");
  }

  if (!access.hasAccess) {
    return (
      <main
        id="main-content"
        className="min-h-screen bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] px-4 py-16 text-[var(--navy,var(--color-navy,#0A0F1E))] sm:px-6 lg:px-8"
      >
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight">
            Access restricted — subscribe to use Permit Tracker
          </h1>
          <p className="mt-4 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
            Your account is signed in, but it does not currently have access to
            the Permit Tracker Micro SaaS product.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] px-4 py-16 text-[var(--navy,var(--color-navy,#0A0F1E))] sm:px-6 lg:px-8"
    >
      <section className="mx-auto max-w-7xl" aria-labelledby="dashboard-heading">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
          Permit Tracker
        </p>
        <h1
          id="dashboard-heading"
          className="mt-3 text-4xl font-semibold tracking-tight"
        >
          Mississippi permit dashboard
        </h1>
        <p className="mt-3 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
          Signed in as {access.email ?? "your account"}. This is the starter
          dashboard template for future Fulatelier Micro SaaS tools.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <FileText
              aria-hidden="true"
              className="h-8 w-8 text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
            />
            <h2 className="mt-4 text-xl font-semibold">Active permits</h2>
            <p className="mt-2 text-3xl font-semibold">0</p>
            <p className="mt-2 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
              Permit list and filters will appear here.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <CalendarClock
              aria-hidden="true"
              className="h-8 w-8 text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
            />
            <h2 className="mt-4 text-xl font-semibold">Upcoming deadlines</h2>
            <p className="mt-2 text-3xl font-semibold">0</p>
            <p className="mt-2 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
              Renewal and inspection reminders will appear here.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <ShieldCheck
              aria-hidden="true"
              className="h-8 w-8 text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
            />
            <h2 className="mt-4 text-xl font-semibold">Compliance notes</h2>
            <p className="mt-2 text-3xl font-semibold">0</p>
            <p className="mt-2 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
              Inspector notes and follow-ups will appear here.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
