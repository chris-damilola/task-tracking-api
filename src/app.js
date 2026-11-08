import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

//middleware
app.use(express.json({ limit: "10kb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TASK TRACKING API IS RUNNING!",
  });
});

// API ROUTES
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Handles unknown Routes
app.use(notFound);

//Global error Handler
app.use(errorHandler);

export default app;
