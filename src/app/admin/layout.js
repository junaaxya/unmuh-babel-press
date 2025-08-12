'use client';

import AdminLayout from '@/components/admin/layouts/AdminLayout';
import { usePathname } from 'next/navigation';


export default function Layout({ children }) {
  const pathname = usePathname();
  
  // Routes yang tidak perlu AdminLayout (sidebar)
  const publicAdminRoutes = ['/admin/login', '/admin/register', '/admin/forgot-password'];
  
  // Jika route adalah public admin route, render tanpa AdminLayout
  if (publicAdminRoutes.includes(pathname)) {
    return (
      <div className="admin-auth-layout">
        {children}
      </div>
    );
  }
  
  // Jika bukan public route, gunakan AdminLayout
  return <AdminLayout>{children}</AdminLayout>;
}