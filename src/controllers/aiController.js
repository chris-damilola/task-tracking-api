import prisma from "../config/database.js";

import {
  summarizeTaskDiscussion,
  recommendTaskStatus,
  recommendTaskPriority,
  estimateTaskEffort,
} from "../services/geminiService.js";

// CHECK TASK ACCESS
const canAccessTask = (user, task) => {
  if (!user || !task) {
    return false;
  }

  if (user.role === "ADMIN") {
    return true;
  }

  if (user.role === "MANAGER") {
    return task.createdById === user.id;
  }

  if (user.role === "EMPLOYEE") {
    return task.assignedToId === user.id;
  }

  return false;
};

// GET TASK AND COMMENTS

const getTaskContext = async (taskId, user) => {
  if (
    typeof taskId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      taskId,
    )
  ) {
    const error = new Error("Invalid task ID.");
    error.statusCode = 400;
    throw error;
  }

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      comments: {
        take: 50,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!canAccessTask(user, task)) {
    const error = new Error("You are not authorized to access this task.");
    error.statusCode = 403;
    throw error;
  }

  // Restore chronological order after retrieving the latest 50 comments
  task.comments.reverse();

  return task;
};

// SUMMARIZE TASK DISCUSSION

export const summarizeTask = async (req, res, next) => {
  try {
    const task = await getTaskContext(req.params.taskId, req.user);

    const result = await summarizeTaskDiscussion(task, task.comments);

    return res.status(200).json({
      success: true,
      message: "Task discussion summarized successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to process AI request.",
    });
  }
};

// RECOMMEND TASK STATUS

export const getTaskStatusRecommendation = async (req, res, next) => {
  try {
    const task = await getTaskContext(req.params.taskId, req.user);

    const result = await recommendTaskStatus(task, task.comments);

    const allowedStatuses = [
      "TODO",
      "IN_PROGRESS",
      "IN_REVIEW",
      "BLOCKED",
      "COMPLETED",
    ];

    if (!allowedStatuses.includes(result.recommendedStatus)) {
      throw new Error("AI returned an invalid task status.");
    }

    return res.status(200).json({
      success: true,
      message: "Task status recommendation generated successfullly.",
      data: {
        currentStatus: task.status,
        ...result,
        applied: false,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to process AI request.",
    });
  }
};

// RECOMMEND TASK PRIORITY

export const getTaskPriorityRecommendation = async (req, res, next) => {
  try {
    const task = await getTaskContext(req.params.taskId, req.user);

    const result = await recommendTaskPriority(task, task.comments);

    const allowedPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

    if (!allowedPriorities.includes(result.recommendedPriority)) {
      throw new Error("AI returned an invalid task priority.");
    }

    return res.status(200).json({
      success: true,
      message: "Task priority recommendation generated successfully.",
      data: {
        currentPriority: task.priority,
        ...result,
        applied: false,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to process AI request.",
    });
  }
};

// ESTIMATE TASK EFFORT

export const getTaskEffortEstimate = async (req, res, next) => {
  try {
    const task = await getTaskContext(req.params.taskId, req.user);

    const result = await estimateTaskEffort(task, task.comments);

    const hours = Number(result.estimatedHours);

    if (!Number.isFinite(hours) || hours <= 0) {
      throw new Error("AI returned an invalid effort estimate.");
    }

    return res.status(200).json({
      success: true,
      message: "Task effort estimate generated successfully.",
      data: {
        currentEstimatedHours: task.estimatedHours,
        ...result,
        applied: false,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to process AI request.",
    });
  }
};
