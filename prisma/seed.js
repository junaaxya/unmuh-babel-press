const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/lib/hash');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com'.trim().toLowerCase();
  const password = await hashPassword('password123');
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      hashedPassword: password,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, siteName: 'My Site' }
  });
  console.log('Seed complete');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
