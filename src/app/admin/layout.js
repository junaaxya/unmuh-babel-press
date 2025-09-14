'use client';

import AdminLayout from '@/components/admin/layouts/AdminLayout';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { NotificationProvider } from '@/hooks/useNotification';

export default function Layout({ children }) {
  const pathname = usePathname();

  // Routes yang tidak perlu AdminLayout (sidebar)
  const publicAdminRoutes = ['/admin/login', '/admin/reset-password', '/admin/forgot-password'];

  const content = publicAdminRoutes.includes(pathname) ? (
    <div className="admin-auth-layout">{children}</div>
  ) : (
    <AdminLayout>{children}</AdminLayout>
  );

  return (
    <SessionProvider>
      <NotificationProvider>{content}</NotificationProvider>
    </SessionProvider>
  );
}