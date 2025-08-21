import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@/lib/prismaAdapter';
import { prisma } from '@/lib/db';
import { comparePassword } from '@/lib/hash';

// ensure NEXTAUTH_URL is always set to avoid configuration errors
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set');
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.status !== 'ACTIVE' || !user.hashedPassword) return null;
        // TODO: enforce 2FA when require2FA is enabled
        const valid = await comparePassword(credentials.password, user.hashedPassword);
        if (!valid) return null;
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      token.role = token.role || 'VIEWER';
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.id = token.id;
      session.user.role = token.role || 'VIEWER';
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
};

const handler = NextAuth(async () => {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const maxAge = (settings?.sessionMaxAgeHours ?? 24) * 60 * 60;
  return {
    ...authOptions,
    session: { ...authOptions.session, maxAge },
  };
});

export { handler as GET, handler as POST };
