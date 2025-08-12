import { withAuth } from 'next-auth/middleware';

export default withAuth(
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        if (pathname === '/admin/login') return true;
        return token?.role === 'ADMIN';
      },
    },
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
