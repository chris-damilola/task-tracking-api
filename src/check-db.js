import prisma from "./config/database.js";

const testDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully!");
    console.log("Prisma Client is working correctly!");
  } catch (error) {
    console.log("Database connection failed:", error.message);
  } finally {
    await prisma.$connect();
  }
};

testDatabase();
