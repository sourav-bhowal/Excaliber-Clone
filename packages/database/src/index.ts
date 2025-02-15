import { PrismaClient } from "@prisma/client";

// Singleton pattern to avoid multiple instances of PrismaClient in development
const PrismaClientSingleton = () => {
  return new PrismaClient();
};

// Global object to store the PrismaClient instance
declare const globalThis: {
  prismaGlobal: ReturnType<typeof PrismaClientSingleton>;
} & typeof global;

// Check if the global object already has a PrismaClient instance
const prisma = globalThis.prismaGlobal ?? PrismaClientSingleton();

// Export the PrismaClient instance
export default prisma;

// If the environment is not production, store the PrismaClient instance in the global object
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
