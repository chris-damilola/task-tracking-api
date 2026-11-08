import { Router } from "express";
import prisma from "../config/database.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    // check PostgreSQL connection
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "API and Database are working correctly!",
      database: "connected",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
