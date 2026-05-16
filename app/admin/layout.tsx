import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getSupabaseProjectRef, supabaseAdmin } from "@/lib/supabase/admin";

type AdminLayoutProps = {
  children: ReactNode;
};

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

async function getAdminUser() {
  if (!supabaseAdmin) {
    return null;
  }

  const accessToken = getSupabaseAccessToken();

  if (!accessToken) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !user) {
    return null;
  }

  const { data: adminUser, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminUser) {
    redirect("/?toast=Admin%20access%20required");
  }

  return user;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminShell userEmail={user.email ?? "Admin"}>{children}</AdminShell>;
}
