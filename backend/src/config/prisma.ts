import { PrismaClient } from "@prisma/client";

// En environnement serverless (Vercel), chaque invocation "chaude" réutilise le même
// scope de module : on met le client en cache sur globalThis pour éviter d'ouvrir une
// nouvelle connexion PostgreSQL à chaque requête.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();
globalForPrisma.prisma = prisma;
