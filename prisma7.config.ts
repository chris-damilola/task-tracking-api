import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // This tells Prisma where to find our database models
  schema: "prisma/schema.prisma",

  //This tells Prisma where to store database migration files
  migrations: {
    path: "prisma/migrations",
  },

  // This tells Prisma which PostgreSQL database to connect to
  datasource: {
    url: env("DATABASE_URL"),
  },
});
