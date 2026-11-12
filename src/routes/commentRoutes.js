import { Router } from "express";
import validate from "../middleware/validate.js";

import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/schemas.js";

import protect from "../middleware/authMiddleware.js";

import {
  createComment,
  getTaskComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = Router();

// All comment routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/tasks/{taskId}/comments:
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: The task is progressing well.
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid comment details
 *       401:
 *         description: Authentication required
 *       403:
 *         description: You cannot access this task
 *       404:
 *         description: Task not found
 */
// create a comment
router.post(
  "/tasks/:taskId/comments",
  validate(createCommentSchema),
  createComment,
);

/**
 * @swagger
 * /api/tasks/{taskId}/comments:
 *   get:
 *     summary: Get comments for a task
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: You cannot access this task
 *       404:
 *         description: Task not found
 */
// Retrieve task comment
router.get("/tasks/:taskId/comments", getTaskComment);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated comment content.
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid comment details
 *       401:
 *         description: Authentication required
 *       403:
 *         description: You can only update your own comment
 *       404:
 *         description: Comment not found
 */
// Update a comment
router.patch(
  "/comments/:commentId",
  validate(updateCommentSchema),
  updateComment,
);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: You are not authorized to delete this comment
 *       404:
 *         description: Comment not found
 */
// Delete a comment
router.delete("/comments/:commentId", deleteComment);

export default router;
