import pinoHttp from "pino-http";
import logger from "../config/logger.js";

const requestLogger = pinoHttp({
  logger,

  customLogLevel: (req, res, error) => {
    if (error || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed`;
  },

  customErrorMessage: (req, res, error) => {
    return `${req.method} ${req.url} failed: ${error.message}`;
  },
});

export default requestLogger;
