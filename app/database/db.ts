import { PrismaClient } from "@prisma/client";
import { env } from "env.mjs";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NEXT_PUBLIC_VERCEL_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NEXT_PUBLIC_VERCEL_ENV !== "production") globalForPrisma.prisma = db;
