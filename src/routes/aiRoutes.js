import { Router } from "express";

import protect from "../middleware/authMiddleware.js";

import {
  summarizeTask,
  getTaskStatusRecommendation,
  getTaskPriorityRecommendation,
  getTaskEffortEstimate,
} from "../controllers/aiController.js";

const router = Router();

// All AI endpoints require authentication
router.use(protect);

/**
 * @swagger
 * /api/ai/tasks/{taskId}/summarize:
 *   post:
 *     summary: Generate an AI summary of a task discussion
 *     tags: [AI Assistance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task to summarize
 *     responses:
 *       200:
 *         description: Task discussion summarized successfully
 *       400:
 *         description: Invalid task ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: You cannot access this task
 *       404:
 *         description: Task not found
 *       502:
 *         description: AI service error
 *       503:
 *         description: AI service temporarily unavailable
 */
// Summarize task discussion
router.post("/tasks/:taskId/summarize", summarizeTask);

/**
 * @swagger
 * /api/ai/tasks/{taskId}/recommend-status:
 *   post:
 *     summary: Get an AI-recommended task status
 *     description: AI analyzes task details and comments to recommend a status. The recommendation does not automatically update the task.
 *     tags: [AI Assistance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Status recommendation generated successfully
 *       400:
 *         description: Invalid task ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: You cannot access this task
 *       404:
 *         description: Task not found
 *       502:
 *         description: AI service error
 *       503:
 *         description: AI service temporarily unavailable
 */
// Recommend task status
router.post("/tasks/:taskId/recommend-status", getTaskStatusRecommendation);

/**
 * @swagger
 * /api/ai/tasks/{taskId}/recommend-priority:
 *   post:
 *     summary: Get an AI-recommended task priority
 *     description: AI analyzes task details and discussion to recommend a priority. It does not automatically change the task priority.
 *     tags: [AI Assistance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Priority recommendation generated successfully
 *       400:
 *         description: Invalid task ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: You cannot access this task
 *       404:
 *         description: Task not found
 *       502:
 *         description: AI service error
 *       503:
 *         description: AI service temporarily unavailable
 */
// Recommend task priority
router.post("/tasks/:taskId/recommend-priority", getTaskPriorityRecommendation);

/**
 * @swagger
 * /api/ai/tasks/{taskId}/estimate-effort:
 *   post:
 *     summary: Estimate the effort required to complete a task
 *     description: AI analyzes task information and discussion to estimate the number of working hours required.
 *     tags: [AI Assistance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Effort estimate generated successfully
 *       400:
 *         description: Invalid task ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: You cannot access this task
 *       404:
 *         description: Task not found
 *       502:
 *         description: AI service error
 *       503:
 *         description: AI service temporarily unavailable
 */
// Estimate task effort
router.post("/tasks/:taskId/estimate-effort", getTaskEffortEstimate);

export default router;
