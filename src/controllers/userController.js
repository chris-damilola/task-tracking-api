import prisma from "../config/database.js";

//GET ALL USERS
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: req.user.role === "MANAGER" ? { role: "EMPLOYEE" } : {},
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE USER
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // employees can only view their own profile
    if (req.user.role === "EMPLOYEE" && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "You cannot access another user's profile",
      });
    }

    // Managers can only view employee profiles
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user.role === "MANAGER" && user.role !== "EMPLOYEE") {
      return res.status(403).json({
        success: false,
        message: "You cannot access this user's profile",
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE USER
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // only ADMIN can update another user's information.
    if (req.user.role !== "ADMIN" && user.role.id !== id) {
      return res.status(403).json({
        success: false,
        message: "You cannot update another user's profile",
      });
    }

    if (name === undefined && email === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide a name or email to update",
      });
    }

    const data = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid name",
        });
      }

      data.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string") {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email address",
        });
      }

      data.email = normalizedEmail;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "This email address is already in use",
      });
    }
    next(error);
  }
};

// CHANGE USER ROLE

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role provided",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    next(error);
  }
};

// DEACTIVATE USER

export const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User account deactivated successfully",
      data: user,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    next(error);
  }
};

// REACTIVATE USER
export const reactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User account reactivated successfully",
      data: user,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    next(error);
  }
};
