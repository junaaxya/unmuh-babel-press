import { withAuth } from 'next-auth/middleware';

export default withAuth(
    {
        callbacks: {
            authorized: ({ token }) => token?.role === 'ADMIN',
        },
    },
    {
        secret: process.env.NEXTAUTH_SECRET || 'dev-secret',
    }
);

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|admin/login).*)'],
};
