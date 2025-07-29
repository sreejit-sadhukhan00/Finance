import { PrismaClient } from "./generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
// globalThis.prisma : this global variable ensures that the prisma client is reused in development mode, preventing the exhaustion of database connections.
// in next js hot reloads during development without this eac time your application reloads a new instance of the PrismaClient is created, which can lead to too many open connections to the database.