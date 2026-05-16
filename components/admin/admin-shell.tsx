"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";

type AdminShellProps = {
  children: ReactNode;
  userEmail: string;
};

const navItems = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: Users,
  },
  {
    href: "/admin/build-log",
    label: "Build Log",
    icon: ScrollText,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
] as const;

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function createBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname() ?? "/admin";
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    setSignOutError(null);

    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      router.push("/admin/login");
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      setSignOutError("Unable to sign out. Please try again.");
      setIsSigningOut(false);
      return;
    }

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] text-[var(--navy,var(--color-navy,#0A0F1E))]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--navy,var(--color-navy,#0A0F1E))] focus:px-4 focus:py-2 focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
      >
        Skip to main content
      </a>

      <div className="flex min-h-screen">
        <aside className="sticky top-0 flex h-screen w-20 shrink-0 flex-col border-r border-[color-mix(in_srgb,var(--navy,var(--color-navy,#0A0F1E))_12%,transparent)] bg-[var(--navy,var(--color-navy,#0A0F1E))] px-3 py-5 text-white md:w-72 md:px-5">
          <Link
            href="/admin"
            className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xl font-semibold tracking-tight md:justify-start ${focusRingClasses}`}
            style={{
              fontFamily:
                "var(--font-playfair-display, 'Playfair Display', serif)",
            }}
          >
            <span aria-hidden="true" className="text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
              F
            </span>
            <span className="hidden md:inline">Fulatelier Admin</span>
            <span className="sr-only md:hidden">Fulatelier Admin</span>
          </Link>

          <nav aria-label="Admin navigation" className="mt-8">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "flex items-center justify-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition-colors md:justify-start",
                        focusRingClasses,
                        isActive
                          ? "bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] text-[var(--navy,var(--color-navy,#0A0F1E))]"
                          : "text-[var(--warm-white,var(--color-warm-white,#F5F0E8))] hover:bg-white/10 hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]",
                      ].join(" ")}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                      <span className="hidden md:inline">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[color-mix(in_srgb,var(--navy,var(--color-navy,#0A0F1E))_12%,transparent)] bg-white/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
                  Admin dashboard
                </p>
                <p className="mt-1 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
                  Signed in as{" "}
                  <span className="font-medium text-[var(--navy,var(--color-navy,#0A0F1E))]">
                    {userEmail}
                  </span>
                </p>
              </div>

              <button
                type="button"
                aria-label="Sign out of admin dashboard"
                disabled={isSigningOut}
                className={`inline-flex items-center justify-center gap-2 rounded-md bg-[var(--navy,var(--color-navy,#0A0F1E))] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--navy,var(--color-navy,#0A0F1E))] disabled:cursor-not-allowed disabled:opacity-70 ${focusRingClasses}`}
                onClick={handleSignOut}
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                {isSigningOut ? "Signing out" : "Sign out"}
              </button>
            </div>

            {signOutError ? (
              <div
                role="alert"
                className="mt-3 rounded-md border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {signOutError}
              </div>
            ) : null}
          </header>

          <main
            id="main-content"
            aria-label="Admin content"
            className="flex-1 px-4 py-8 sm:px-6 lg:px-8"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminShell;
