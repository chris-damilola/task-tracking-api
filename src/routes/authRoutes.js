import { Router } from "express";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = Router();

//Public routes
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new employee
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Chris Johnson
 *               email:
 *                 type: string
 *                 example: chris@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: Employee registered successfully
 *       400:
 *         description: Invalid registration details
 *       409:
 *         description: Email already exists
 */
router.post("/register", validate(registerSchema), registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to an account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: chris@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid request details
 *       401:
 *         description: Incorrect email or password
 */
router.post("/login", validate(loginSchema), loginUser);

// Protected routes

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.get("/me", protect, getCurrentUser);

export default router;
