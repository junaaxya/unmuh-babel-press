import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ActivitiesPageClient from './ActivitiesPageClient';

export default async function ActivitiesPage() {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
    redirect('/admin/login');
  }
  return <ActivitiesPageClient />;
}
