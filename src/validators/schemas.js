import { z } from "zod";

// USER REGISTRATION
export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must contain at least 2 characters"),

    email: z.string().trim().pipe(z.email("Enter a valid email address")),

    password: z.string().min(8, "Password must contain at least 8 characters"),
  }),
});

// USER LOGIN
export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().pipe(z.email("Enter a valid email address")),

    password: z.string().min(1, "Password is required"),
  }),
});

// CREATE TASK
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(200),

    description: z.string().max(5000).nullable().optional(),

    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),

    dueDate: z
      .union([z.iso.datetime({ offset: true }), z.iso.date()])
      .nullable()
      .optional(),

    estimatedHours: z.number().positive().nullable().optional(),

    assignedToId: z.string().pipe(z.uuid()).nullable().optional(),
  }),
});

// UPDATE TASK
export const updateTaskSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(3).max(200).optional(),

      description: z.string().max(5000).nullable().optional(),

      priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),

      dueDate: z
        .string()
        .pipe(z.iso.datetime({ offset: true }))
        .nullable()
        .optional(),

      estimatedHours: z.number().positive().nullable().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Provide at least one field to update.",
    ),
});

// UPDATE TASK STATUS
export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "TODO",
      "IN_PROGRESS",
      "IN_REVIEW",
      "BLOCKED",
      "COMPLETED",
    ]),
  }),
});

// CREATE COMMENT
export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1).max(5000),
  }),
});

// UPDATE COMMENT
export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1).max(5000),
  }),
});
