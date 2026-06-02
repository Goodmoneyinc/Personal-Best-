import { redirect } from 'next/navigation';

import { AdminShell } from '@/components/admin/AdminShell';
import { getServerAdminEmail } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminEmail = await getServerAdminEmail();

  if (!adminEmail) {
    redirect('/');
  }

  return <AdminShell>{children}</AdminShell>;
}
