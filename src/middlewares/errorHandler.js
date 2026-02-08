// Administrador de errores
// Punto final en la cadena de errores
import multer from "multer";
import { logger } from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  // Multer: file too large & ALL possible multer errors
  if (err instanceof multer.MulterError) {
    logger.warn("Multer error", {
      code: err.code,
      route: req.originalUrl,
      ip: req.ip,
      requestId: req.requestId,
    });

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "El archivo excede el tamaño máximo permitido",
      });
    }
  }

  // 🟡 Mongoose: ValidationError
  if (err.name === "ValidationError") {
    logger.warn("Mongoose validation error", {
      message: err.message,
      errors: Object.values(err.errors).map((e) => e.message),
      path: req.originalUrl,
      requestId: req.requestId,
    });

    return res.status(400).json({
      success: false,
      error: message,
    });
  }

  // 🟡 Mongoose: CastError (only if it reaches here)
  if (err.name === "CastError") {
    logger.warn("Mongoose cast error", {
      value: err.value,
      path: err.path,
      route: req.originalUrl,
      requestId: req.requestId,
    });

    return res.status(400).json({
      success: false,
      error: `ID inválido: ${err.value}`,
    });
  }

  // 🟡 Mongoose: Duplicate key
  if (err.code === 11000) {
    logger.warn("Mongoose duplicate key", {
      key: err.keyValue,
      route: req.originalUrl,
      requestId: req.requestId,
    });

    return res.status(400).json({
      success: false,
      error: "Ya existe un registro con ese valor",
    });
  }

  // 🔴 REAL server error
  if (status >= 500) {
    logger.error("Unhandled server error", {
      message,
      // stack: err.stack,
      route: req.originalUrl,
      requestId: req.requestId,
    });
  }

  // 🔵 Client errors (404, etc.)
  else {
    logger.warn("Client error", {
      status,
      message,
      route: req.originalUrl,
      requestId: req.requestId,
    });
  }

  res.status(status).json({
    success: false,
    error: message,
  });
}
