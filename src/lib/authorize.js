import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Authorize request based on NextAuth session role.
 * @param {Request} _request - kept for backward compatibility
 * @param {string[]} allowedRoles - roles permitted to proceed
 * @returns {NextResponse|null} null when authorized, or a NextResponse error
 */
export async function authorize(_request, allowedRoles = ['ADMIN', 'EDITOR']) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // No active session
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = session.user?.role;
  if (!allowedRoles.includes(role)) {
    // Session exists but role is not allowed (e.g., VIEWER)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null; // Authorized
}
