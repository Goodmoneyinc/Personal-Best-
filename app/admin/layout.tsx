import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminAuth } from "@/lib/supabase/admin-auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const auth = await getAdminAuth();

  if (auth.status === "unauthorized") {
    redirect("/?toast=Admin%20access%20required");
  }

  if (auth.status !== "authenticated") {
    redirect("/admin/login");
  }

  return (
    <AdminShell userEmail={auth.user.email ?? "Admin"}>{children}</AdminShell>
  );
}
