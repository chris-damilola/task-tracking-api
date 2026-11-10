import { Router } from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createComment,
  getTaskComment,
  updatedComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = Router();

// All comment routes require authentication
router.use(protect);

// create a comment
router.post("/tasks/:taskId/comments", createComment);

// Retrieve task comment
router.get("/tasks/:taskId/comments", getTaskComment);

// Update a comment
router.patch("/comments/:commentId", updatedComment);

// Delete a comment
router.delete("/comments/:commentId", deleteComment);

export default router;
