import { PrismaClient } from "@prisma/client";

declare global {
    var prisma : PrismaClient | undefined
}

const primsaInstance = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = primsaInstance
}

export const db = primsaInstance;