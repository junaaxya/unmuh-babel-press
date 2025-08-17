// src/lib/prismaAdapter.js
// Minimal Prisma Adapter implementation to avoid external dependency
// Provides the methods required by NextAuth for Prisma-based persistence.
export function PrismaAdapter(prisma) {
  return {
    async createUser(data) {
      return prisma.user.create({ data });
    },
    async getUser(id) {
      return prisma.user.findUnique({ where: { id } });
    },
    async getUserByEmail(email) {
      return prisma.user.findUnique({ where: { email } });
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true }
      });
      return account?.user ?? null;
    },
    async updateUser(data) {
      const { id, ...rest } = data;
      return prisma.user.update({ where: { id }, data: rest });
    },
    async deleteUser(id) {
      return prisma.user.delete({ where: { id } });
    },
    async linkAccount(data) {
      return prisma.account.create({ data });
    },
    async unlinkAccount({ providerAccountId, provider }) {
      return prisma.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } }
      });
    },
    async createSession(data) {
      return prisma.session.create({ data });
    },
    async getSessionAndUser(sessionToken) {
      const sessionWithUser = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true }
      });
      if (!sessionWithUser) return null;
      const { user, ...session } = sessionWithUser;
      return { session, user };
    },
    async updateSession(data) {
      const { sessionToken, ...rest } = data;
      return prisma.session.update({ where: { sessionToken }, data: rest });
    },
    async deleteSession(sessionToken) {
      return prisma.session.delete({ where: { sessionToken } });
    },
    async createVerificationToken(data) {
      return prisma.verificationToken.create({ data });
    },
    async useVerificationToken({ identifier, token }) {
      try {
        return await prisma.verificationToken.delete({
          where: { identifier_token: { identifier, token } }
        });
      } catch {
        return null;
      }
    }
  };
}
