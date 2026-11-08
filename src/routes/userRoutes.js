import { Router } from "express";

import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deactivateUser,
  reactivateUser,
} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = Router();

//All user routes require authentication
router.use(protect);

//ADMIN and MANAGER can view the users permitted by their roles
router.get("/", authorizeRoles("ADMIN", "MANAGER"), getAllUsers);

// ADMIN, MANAGER and EMPLOYEE can access this route
// The controller checks which profile they can view
router.get("/:id", getUserById);

// Users can update their own profile
// ADMIN can update other users
router.patch("/:id", updateUser);

// Only ADMIN can change user roles
router.patch("/:id/role", authorizeRoles("ADMIN"), updateUserRole);

// Only ADMIN can deactivate accounts
router.patch("/:id/deactivate", authorizeRoles("ADMIN"), deactivateUser);

// Only ADMIN can reactivate accounts
router.patch("/:id/reactivate", authorizeRoles("ADMIN"), reactivateUser);

export default router;
