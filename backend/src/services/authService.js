import jwt from "jsonwebtoken";
import User from "../models/users.js";
import { logger } from "../utils/logger.js";
import AuthError from "../middlewares/authError.js";
import { comparePassword, hashPassword } from "../utils/password.js";

/* LOGIN, REGISTRO, CHANGE PASSWORD - service */

// NOTA: NO SE CREAN ADMINISTRADORES EN ESTE SERVICIO

// NORMAS DEL DISEÑO:
// Estilo de función: function expression (o sea: asignar la función a una variable)
// const fn = async () => {}
// Error handling: a nivel de la capa del controller
// id validation: a nivel ruta, mediante un middleware

// Lista de funciones:
// registerUser             REGISTRAR UN NUEVO USUARIO. role: user
// loginUser                LOGIN
// changePassword           CHANGE PASSWORD

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

// REGISTRAR UN NUEVO USUARIO. role: user
export const registerUser = async ({ username, password }) => {
  // 1. Basic validation
  if (!username || !password) {
    throw new Error("Debe ingresar usuario y contraseña");
  }

  // 2. Normalize input
  const normalizedUsername = username.trim().toLowerCase();

  // 3. Check if user already exists
  const existingUser = await User.findOne({
    username: normalizedUsername,
  });

  if (existingUser) {
    logger.warn("Register failed: El usuario ya existe", {
      username: normalizedUsername,
    });

    throw new Error("Ese nombre ya esta en uso");
  }

  // 4. Hash password
  const passwordHash = await hashPassword(password);

  // 5. Create user
  const user = await User.create({
    username: normalizedUsername,
    passwordHash,
  });

  // 6. Never return sensitive data
  return {
    id: user._id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
  };
};

// LOGIN
export const loginUser = async ({ username, password }) => {
  if (typeof username !== "string" || typeof password !== "string") {
    throw new AuthError("Credenciales No Validas");
  }

  // Prevents duplicates and bypass tricks.
  const normalizedUsername = username.trim().toLowerCase();
  const user = await User.findOne({ username: normalizedUsername });

  // IMPORTANT: do not reveal user existence
  if (!user) {
    logger.warn("Login failed: El usuario no existe", {
      username: normalizedUsername,
    });

    throw new AuthError("Credenciales No Validas");
  }

  // Check if account is locked: saves CPU and avoids brute-force.
  if (user.lockUntil && user.lockUntil > Date.now()) {
    logger.warn("Failed login attempts: Cuenta temporariamente bloqueada", {
      username: normalizedUsername,
      lockUntil: user.lockUntil,
    });

    throw new AuthError("Credenciales No Validas");
  }

  // check password
  const passwordMatches = await comparePassword(password, user.passwordHash);

  // ❌ Wrong password
  if (!passwordMatches) {
    user.loginAttempts += 1;

    // Lock account if threshold reached
    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);

      logger.warn("Account locked due to repeated failures", {
        username: normalizedUsername,
        attempts: user.loginAttempts,
        lockUntil: user.lockUntil,
      });
    } else {
      logger.warn("Login failed: contraseña no valida", {
        username: normalizedUsername,
        attempts: user.loginAttempts,
      });
    }

    await user.save();
    throw new AuthError("Credenciales No Validas");
  }

  // ✅ Successful login
  user.loginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  logger.info("User logged in successfully", {
    userId: user._id.toString(),
    username: user.username,
  });

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "30m",
    },
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  };
};

// CHANGE PASSWORD
export const changePassword = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  if (!currentPassword || !newPassword) {
    throw new Error("Faltan datos");
  }

  // Find user by ID
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Verify current password
  const isMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw new Error("Contraseña actual incorrecta");
  }

  // Hash new password
  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  return { message: "Contraseña actualizada correctamente" };
};
