import { Prisma } from "../../generated/prisma/client.ts";
import logger from "../config/logger.js";

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong.";

  // Duplicate database record
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = 409;
      message = "A record with this information already exists.";
    }

    // Record not found
    if (error.code === "P2025") {
      statusCode = 404;
      message = "Requested record was not found.";
    }

    // Foreign key constraint
    if (error.code === "P2003") {
      statusCode = 400;
      message = "Invalid relationship reference.";
    }
  }

  if (statusCode >= 500) {
    logger.error(
      {
        err: error,
        method: req.method,
        url: req.originalUrl,
      },
      "Internal server error",
    );

    message =
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : message;
  } else {
    logger.warn(
      {
        statusCode,
        method: req.method,
        url: req.originalUrl,
        message,
      },
      "Request error",
    );
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
