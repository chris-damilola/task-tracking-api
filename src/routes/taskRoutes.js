import { Router } from "express";

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = Router();

//All task endpoints require authentication
router.use(protect);

//create task
router.post("/", authorizeRoles("ADMIN", "MANAGER"), createTask);

// Get all visible tasks
router.get("/", getAllTasks);

//Get one task
router.get("/:id", getTaskById);

//update task details
router.patch("/:id", authorizeRoles("ADMIN", "MANAGER"), updateTask);

// Update task statsus
router.patch("/:id/status", updateTaskStatus);

//Delete task
router.delete("/:id", authorizeRoles("ADMIN", "MANAGER"), deleteTask);

export default router;
