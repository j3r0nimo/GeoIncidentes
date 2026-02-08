// CONTROL del nivel del rol del usuario logueado

import { logger } from "../utils/logger.js";

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "No autenticado",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn("Role: Autorizacion denegada", {
        userId: req.user.id,
        role: req.user.role,
        requiredRoles: allowedRoles,
        route: req.originalUrl,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        error: "Acceso denegado",
      });
    }

    next();
  };
};
