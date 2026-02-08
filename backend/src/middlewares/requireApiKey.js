// Va a solicitar la API KEY a todas las llamadas entrantes
import { logger } from "../utils/logger.js";

export const requireApiKey = (req, res, next) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey || apiKey !== process.env.API_KEY) {
    logger.warn("Blocked request: invalid API key", {
      path: req.originalUrl,
      ip: req.ip,
    });

    return res.status(401).json({
      success: false,
      error: "Unauthorized (API key required)",
    });
  }

  next();
};
