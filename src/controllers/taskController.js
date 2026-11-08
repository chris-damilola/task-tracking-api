import prisma from "../config/database.js";

const allowedStatuses = ["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED"];

const allowedPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

// Check whether the current user can access a task
const canAccessTask = (user, task) => {
  if (user.role === "ADMIN") {
    return true;
  }

  if (user.role === "MANAGER") {
    return task.createdById === user.id;
  }

  return task.assignedToId === user.id;
};

// Check whether user can manage task details
const canManageTask = (user, task) => {
  return (
    user.role === "ADMIN" ||
    (user.role === "MANAGER" && task.createdById === user.id)
  );
};

// Create task
export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      estimatedHours,
      assignedToId,
    } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    if (priority !== undefined && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task priority",
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }

    if (
      estimatedHours !== undefined &&
      (typeof estimatedHours !== "number" ||
        !Number.isFinite(estimatedHours) ||
        estimatedHours < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Estimated hours must be a non-negativ number",
      });
    }

    let parsedDueDate;

    if (dueDate !== undefined && dueDate !== null) {
      parsedDueDate = new Date(dueDate);

      if (Number.isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid due date",
        });
      }
    }

    // verify assigned employee
    if (assignedToId !== undefined && assignedToId !== null) {
      const employee = await prisma.user.findUnique({
        where: { id: assignedToId },
        select: {
          id: true,
          role: true,
          isActive: true,
        },
      });

      if (!employee || !employee.isActive) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found or inactive",
        });
      }

      if (employee.role !== "EMPLOYEE") {
        return res.status(400).json({
          success: false,
          message: "Tasks can only be assigned to employees",
        });
      }
    }

    // create task and activity together
    const task = await prisma.$transaction(async (tx) => {
      const newTask = await tx.task.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          priority: priority || "MEDIUM",
          dueDate: parsedDueDate,
          estimatedHours,
          createdById: req.user.id,
          assignedToId: assignedToId || null,
        },

        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await tx.taskActivity.create({
        data: {
          taskId: newTask.id,
          actorId: req.user.id,
          action: "TASK_CREATED",
          details: `Task "${newTask.title}" was created`,
        },
      });

      if (assignedToId) {
        await tx.taskActivity.create({
          data: {
            taskId: newTask.id,
            actorId: req.user.id,
            action: "TASK_ASSIGNED",
            details: `Task assigned to ${newTask.assignedTo.name}`,
          },
        });
      }

      return newTask;
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL TASKS
export const getAllTasks = async (req, res, next) => {
  try {
    const {
      page = "1",
      limit = "10",
      status,
      priority,
      search,
      assignedToId,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 50",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task priority",
      });
    }

    const where = {};

    // Apply role-based visibility
    if (req.user.role === "MANAGER") {
      where.createdById = req.user.id;
    } else if (req.user.role === "EMPLOYEE") {
      where.assignedToId = req.user.id;
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // only ADMIN and MANAGER can filter by another user's ID.
    if (assignedToId) {
      if (req.user.role === "EMPLOYEE") {
        return res.status(403).json({
          success: false,
          message: "You cannot filter tasks by another user",
        });
      }
      where.assignedToId = assignedToId;
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        skip,
        take: limitNumber,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.task.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },

      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE TASK
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "asc",
          },
        },
        activities: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    if (!canAccessTask(req.user, task)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this task",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE TASK DETAILS
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      priority,
      dueDate,
      estimatedHours,
      assignedToId,
    } = req.body;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!canManageTask(req.user, task)) {
      return res.status(403).json({
        success: false,
        message: "You cannot modify this task",
      });
    }

    const data = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Task title cannot be empty",
        });
      }

      data.title = title.trim();
    }

    if (description !== undefined) {
      if (description !== null && typeof description !== "string") {
        return res.status(400).json({
          success: false,
          message: "Description must be a string or null",
        });
      }

      data.description = description?.trim() || null;
    }

    if (priority !== undefined) {
      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task priority",
        });
      }
      data.priority = priority;
    }

    if (dueDate !== undefined) {
      if (dueDate === null) {
        data.dueDate = null;
      } else {
        const parsedDate = new Date(dueDate);

        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid due date",
          });
        }

        data.dueDate = parsedDate;
      }
    }

    if (estimatedHours !== undefined) {
      if (
        estimatedHours !== null &&
        (typeof estimatedHours !== "number" ||
          !Number.isFinite(estimatedHours) ||
          estimatedHours < 0)
      ) {
        return res.status(400).json({
          success: false,
          message: "Estimated hours must be a non-negative number or null",
        });
      }

      data.estimatedHours = estimatedHours;
    }

    if (assignedToId !== undefined) {
      if (assignedToId === null) {
        data.assignedToId = null;
      } else {
        const employee = await prisma.user.findUnique({
          where: { id: assignedToId },
          select: {
            id: true,
            role: true,
            isActive: true,
          },
        });

        if (!employee || !employee.isActive || employee.role !== "EMPLOYEE") {
          return res.status(400).json({
            success: false,
            message: "Please select an active employee",
          });
        }
        data.assignedToId = assignedToId;
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    const updatedTask = await prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id },
        data,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (data.priority && data.priority !== task.priority) {
        await tx.taskActivity.create({
          data: {
            taskId: id,
            actorId: req.user.id,
            action: "PRIORITY_CHANGED",
            details: `Priority changed from ${task.priority} to ${data.priority}`,
          },
        });
      }

      if (
        data.assignedToId !== undefined &&
        data.assignedToId !== task.assignedToId
      ) {
        await tx.taskActivity.create({
          data: {
            taskId: id,
            actorId: req.user.id,
            action: "TASK_ASSIGNED",
            details: data.assignedToId
              ? `Task assigned to ${updated.assignedTo.name}`
              : "Task assignment removed",
          },
        });
      }
      await tx.taskActivity.create({
        data: {
          taskId: id,
          actorId: req.user.id,
          action: "TASK_UPDATED",
          details: "Task details were updated",
        },
      });

      return updated;
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE TASK STATUS
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this task",
      });
    }

    const updatedTask = await prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id },
        data: { status },
      });

      if (task.status !== status) {
        await tx.taskActivity.create({
          data: {
            taskId: id,
            actorId: req.user.id,
            action: "STATUS_CHANGED",
            details: `Status changed from ${task.status} to ${status}`,
          },
        });
      }

      return updated;
    });

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE TASK
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!canManageTask(req.user, task)) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this task",
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
