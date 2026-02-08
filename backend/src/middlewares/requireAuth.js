// Donde verificamos JWT?
// la verificacion de JWT ocurre en requireAuth

import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (err) {
    logger.warn("Invalid or expired JWT", {
      error: err.message,
    });

    return res.status(401).json({
      success: false,
      error: "No autorizado",
    });
  }
};
