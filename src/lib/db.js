// src/lib/db.js
import { PrismaClient } from "@prisma/client";

// Reuse Prisma client across hot reloads to avoid exhausting database connections
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
export { prisma };

