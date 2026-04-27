// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@/lib/prismaAdapter';
import prisma from '@/lib/db';
import { comparePassword } from '@/lib/hash';
import { applyRateLimit } from '@/lib/rateLimit';

// Pastikan NEXTAUTH_URL selalu terisi
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set');
}

const { NODE_ENV, MAIL_FROM_NAME, MAIL_FROM_EMAIL } = process.env;
if (NODE_ENV === 'production' && (!MAIL_FROM_NAME || !MAIL_FROM_EMAIL)) {
  throw new Error('MAIL_FROM_NAME and MAIL_FROM_EMAIL must be set in production');
}

// Cache settings dari DB agar tidak query tiap request
let cachedSettings = null;
let cachedAt = 0;

async function getSettingsCached() {
  const now = Date.now();
  if (!cachedSettings || now - cachedAt > 60_000) {
    cachedSettings =
      (await prisma.siteSetting.findUnique({ where: { id: 1 } })) ??
      { sessionMaxAgeHours: 24 };
    cachedAt = now;
  }
  return cachedSettings;
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const user  = await prisma.user.findUnique({ where: { email } });

        if (!user || user.status !== 'ACTIVE' || !user.hashedPassword) return null;

        const valid = await comparePassword(credentials.password, user.hashedPassword);
        if (!valid) return null;

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const settings = await getSettingsCached();
        token.id   = user.id;
        token.role = user.role;
        token.exp  = Math.floor(Date.now() / 1000) + settings.sessionMaxAgeHours * 3600;
      }
      token.role = token.role || 'VIEWER';
      return token;
    },

    async session({ session, token }) {
      session.user      = session.user || {};
      session.user.id   = token.id;
      session.user.role = token.role || 'VIEWER';

      const dbUser = await prisma.user.findUnique({
        where:  { id: token.id },
        select: { name: true, image: true },
      });

      session.user.name  = dbUser?.name  || '';
      session.user.image = dbUser?.image || null;

      if (token.exp) {
        session.expires = new Date(token.exp * 1000).toISOString();
      }

      return session;
    },
  },

  pages: {
    signIn: '/admin/login',
  },
};

const handler = NextAuth(authOptions);

// GET tidak perlu rate limit
export { handler as GET };

// POST dengan rate limit di endpoint login
export async function POST(request, context) {
  const pathname = new URL(request.url).pathname;

  if (pathname === '/api/auth/callback/credentials') {
    const limited = await applyRateLimit(
      request,
      10,
      `${new URL(request.url).origin}/admin/login?error=RateLimit`
    );
    if (limited) return limited;
  }

  return handler(request, context);
}