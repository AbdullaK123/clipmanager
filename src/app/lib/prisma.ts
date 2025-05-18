// app/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

console.log("[prisma.ts] Initializing Prisma Client module...");
console.log("[prisma.ts] Current globalThis.prisma:", typeof globalThis.prisma);

const prismaInstance = globalThis.prisma || new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

console.log("[prisma.ts] prismaInstance created/reused. Type:", typeof prismaInstance);

if (process.env.NODE_ENV !== "production") {
    if (!globalThis.prisma) {
        console.log("[prisma.ts] Setting new instance to globalThis.prisma in development.");
    }
    globalThis.prisma = prismaInstance;
}

console.log("[prisma.ts] Exporting 'db'. Type:", typeof prismaInstance);
export const db = prismaInstance; // Exporting 'prismaInstance' (corrected typo) as 'db'