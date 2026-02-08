import {
  registerUser,
  loginUser,
  changePassword,
} from "../services/authService.js";
import { logger } from "../utils/logger.js";

// import * as incidenteServicio from "../services/incidenteService.js"; //

/* LOGIN, REGISTRO, CHANGE PASSWORD - controller */

// NORMAS DEL DISEÑO:
// Estilo de función: function expression (o sea: asignar la función a una variable)
// const fn = async () => {}
// Error handling: a nivel de la capa del controller
// id validation: a nivel ruta, mediante un middleware

// Lista de funciones:
// register                   REGISTRAR UN NUEVO USUARIO. role: user
// login                      LOGIN
// changePasswordController   CHANGE PASSWORD

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    logger.info("User registered - Se creo el usuario", {
      userId: user.id,
      username: user.username,
      ip: req.ip,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { token, user } = await loginUser(req.body);

    logger.info("User logged in - Usuario logueado", {
      userId: user.id,
      username: user.username,
      ip: req.ip,
      route: req.originalUrl,
      requestId: req.requestId,
    });

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// CHANGE PASSWORD
export const changePasswordController = async (req, res, next) => {
  try {
    const userId = req.user.id; // set by requireAuth
    const { currentPassword, newPassword } = req.body;

    const result = await changePassword({
      userId,
      currentPassword,
      newPassword,
    });

    logger.info("User changed password", {
      userId,
      ip: req.ip,
    });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error); // let your error handler middleware respond
  }
};
