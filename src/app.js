import express from "express";
import cors from "cors";
import helmet from "helmet";
import {
  apiLimiter,
  authLimiter,
  aiLimiter,
} from "./middleware/rateLimiter.js";
import healthRoutes from "./routes/healthRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import requestLogger from "./middleware/requestLogger.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use(requestLogger);

//middleware
app.use(helmet());

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

//welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TASK TRACKING API IS RUNNING!",
  });
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/ai", aiLimiter);

// API ROUTES
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", commentRoutes);
app.use("/api/ai", aiRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Handles unknown Routes
app.use(notFound);

//Global error Handler
app.use(errorHandler);

export default app;
