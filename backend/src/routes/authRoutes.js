/* LOGIN, REGISTRO, CHANGE PASSWORD - rutas */

import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js"; // checks JWT
import {
  register,
  login,
  changePasswordController,
} from "../controllers/authController.js";
import { loginRateLimiter } from "../middlewares/loginRateLimit.js";

const router = express.Router();

// 🔒 Change password
router.put("/change-password", requireAuth, changePasswordController);

// Register
router.post("/register", register);

// 🔒 Rate limit ONLY login
router.post("/login", loginRateLimiter, login);

/* =======================
   SWAGGER POST LOGIN
   ======================= */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful. Returns JWT token and user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT Bearer token (expires in 30 minutes)
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 698464d232bab8c4224d36ab
 *                     username:
 *                       type: string
 *                       example: propietario
 *                     role:
 *                       type: string
 *                       example: admin
 *       401:
 *         description: Invalid credentials or missing API key
 */

export default router;
