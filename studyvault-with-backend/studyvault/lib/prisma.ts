import { PrismaClient } from "@prisma/client";

// Prevents Next.js dev-mode hot-reload from creating a new PrismaClient
// (and a new DB connection) on every file save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
