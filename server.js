import "dotenv/config";

import app from "./src/app.js";
import prisma from "./src/config/database.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // connect to PostgreSQL
    await prisma.$connect();

    console.log("PostgreSQL connected successfully!");

    // start Express server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        await prisma.$disconnect();
        console.log("Database disconnected.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.log("Failed to start server:", error.message);

    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
