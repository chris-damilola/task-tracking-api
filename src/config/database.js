import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

//Get database connection string
const connectionString = process.env.DATABASE_URL;

// Create PostgreSQL adapter
const adapter = new PrismaPg({
  connectionString,
});

// Initialize Prisma Client
const prisma = new PrismaClient({
  adapter,
});

// Export Prisma Client
export default prisma;
