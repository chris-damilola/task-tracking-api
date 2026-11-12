import prisma from "../config/database.js";

//validate UUID
const isValidUUID = (id) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id,
  );
};

// check whether a user can access a task
const canAccessTask = (user, task) => {
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

// Create COMMENT
export const createComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;

    if (!isValidUUID(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required.",
      });
    }
    if (content.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 5000 characters.",
      });
    }

    // Find Task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check task access
    if (!canAccessTask(req.user, task)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to comment on this task.",
      });
    }

    // Create comment and activity record together
    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content: content.trim(),
          taskId,
          authorId: req.user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

      await tx.taskActivity.create({
        data: {
          action: "COMMENT_ADDED",
          details: `A comment was added by ${req.user.name}.`,
          taskId,
          actorId: req.user.id,
        },
      });
      return newComment;
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// GET TASK COMMENTS
export const getTaskComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    if (!isValidUUID(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 50.",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }
    if (!canAccessTask(req.user, task)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these comments.",
      });
    }

    const skip = (page - 1) * limit;

    const [comments, totalComments] = await Promise.all([
      prisma.comment.findMany({
        where: { taskId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        skip,
        take: limit,
      }),

      prisma.comment.count({
        where: { taskId },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Task comments retrieved successfully.",
      pagination: {
        totalComments,
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        limit,
      },
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

//UPDATE COMMENT
export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidUUID(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required.",
      });
    }

    if (content.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 5000 characters.",
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: true,
      },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }
    if (!canAccessTask(req.user, comment.task)) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this task.",
      });
    }

    // Only the comment author can edit it
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own comments.",
      });
    }

    const updateComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
      data: updateComment,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE COMMENT
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!isValidUUID(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID.",
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: true,
      },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (!canAccessTask(req.user, comment.task)) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this task.",
      });
    }

    // Author or administration can delete
    if (comment.authorId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments.",
      });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
