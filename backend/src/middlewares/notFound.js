// middleware para evitar mensajes por ausencia de favicon
import createError from "http-errors";
import { logger } from "../utils/logger.js";

export const notFound = (req, res, next) => {
  // Ignore favicon noise
  if (req.originalUrl === "/favicon.ico") {
    return res.status(204).end();
  }

  logger.warn("Route not found", {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    requestId: req.requestId,
  });

  next(
    createError(
      404,
      `Error 404: La siguiente ruta no fue encontrada: ${req.originalUrl}`,
    ),
  );
};
