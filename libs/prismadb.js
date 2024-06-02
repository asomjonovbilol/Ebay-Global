import { PrismaClient } from "@prisma/client";

let prisma;

// Initialize PrismaClient instance
const prismadb = prisma || new PrismaClient();

// Assign the PrismaClient instance to the global variable only in development
if (process.env.NODE_ENV !== "production") {
  prisma = prismadb;
}

export default prismadb;
