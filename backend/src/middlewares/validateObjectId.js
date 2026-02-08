// VALIDACION DEL ID
/* Esta version permite mayor flexibilidad
 * porque no solo trabaja con /:id
 * sino también con versiones como /:clienteId
 */

import mongoose from "mongoose";
import createError from "http-errors";
import { logger } from "../utils/logger.js";

export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      logger.warn("Se recibio un ObjectId invalido.", {
        param: paramName,
        value: id,
        route: req.originalUrl,
        method: req.method,
      });

      return next(createError(400, `Este Id no es válido: ${id}`));
    }

    next();
  };
};

/* (paramName = "id") hace que el middleware sea configurable, no esté hardcodeado.
 * Se puede validar (sin duplicar código):
 * /incidentes/:id
 * /clientes/:clienteId
 * /compras/:compraId
 */

/* 'if (!id ||' previene la posibilidad de que el id esté ausente
 */

/* Este middleware verifica solo la sintaxis / formato:
 * ✔ Longitud correcta (24 caracteres hexadecimales)
 * ✔ Caracteres hexadecimales válidos
 * ✔ Compatible con la estructura de MongoDB ObjectId
 * No consulta la base de datos
 * No verifica si el documento existe
 */
