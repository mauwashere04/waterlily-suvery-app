import { PrismaClient } from "@prisma/client";

// Next.js dev-mode hot reload re-imports this module on every edit, which
// would otherwise open a fresh SQLite connection each time. Caching the
// client on `globalThis` keeps one instance alive across reloads.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
