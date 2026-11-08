import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/database.js";

// Generate JWT token
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );
};

// Remove password before returning user details
const formatUser = (user) => {
  const { password, ...userDetails } = user;
  return userDetails;
};

// Register User
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email and password are required",
      });
    }

    // Validate Name
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid name",
      });
    }

    // validate email
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // validate password
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters",
      });
    }

    // check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,

        // Public registration always creates an employee.
        // Users cannot assign themselves ADMIN or MANAGER  roles
        role: "EMPLOYEE",
      },
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: formatUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN USER
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid login details",
      });
    }

    // Find User
    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email and password",
      });
    }

    // check whether account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // Generate Token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: {
        user: formatUser(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET LOGGED-IN USER
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user || !user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User account is unavailable",
      });
    }

    res.status(200).json({
      success: false,
      message: "User profile retrieved successfully",
      data: {
        user: formatUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};
