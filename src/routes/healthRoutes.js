import { Router } from "express";
import prisma from "../config/database.js";

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API and database health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API and database are healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Database connection is healthy.
 *                 database:
 *                   type: string
 *                   example: connected
 *       500:
 *         description: Database connection failed
 */
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
