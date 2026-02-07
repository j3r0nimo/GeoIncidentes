import { logger } from "../utils/logger.js";
import { MAP_LIMIT } from "../../config/env.js";
import * as incidenteServicio from "../services/incidenteService.js";
import { mapIncidenteToResponse } from "../middlewares/incidenteMapper.js";
import fs from "fs/promises";
import path from "path";
import createError from "http-errors";

// NORMAS DEL DISEÑO:
// Estilo de funcion: function expression (o sea: asignar la funcion a una variable)
// const fn = async () => {}
// Error handling: a nivel de la capa del controller
// id validation: a nivel ruta, mediante un middleware

// Lista de funciones:
// getIncidentes            RESPONDER CON LA LISTA DE TODOS LOS INCIDENTES
// getIncidenteById         RESPONDER CON UN INCIDENTE POR SU /:id
// getMapaJitterData        RESPONDER CON LA LISTA DE TODOS LOS INCIDENTES SIN FILTRAR TIPO JITTER
// getMapaClusterData       RESPONDER CON LA LISTA DE TODOS LOS INCIDENTES SIN FILTRAR TIPO CLUSTER
// newIncidente             CREAR UN NUEVO INCIDENTE
// deleteIncidente          ELIMINAR UN INCIDENTE
// updateIncidente          ACTUALIZA UN INCIDENTE

// *************************************************************************************************
// RETORNAR un incidente por su /:id
export const getIncidenteById = async (req, res, next) => {
  const { id } = req.params;

  logger.info("Se llamo a getIncidenteById", { id });

  try {
    const incidente = await incidenteServicio.getIncidenteByIdService(id);
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (!incidente) {
      logger.warn("getIncidenteById not found. Incidente no localizado.", {
        id,
      });

      return next(createError(404, "Incidente no encontrado"));
    }

    const incidenteResponse = mapIncidenteToResponse(incidente, baseUrl);

    logger.info("getIncidenteById success", { id });

    res.status(200).json(incidenteResponse);
  } catch (error) {
    logger.error("getIncidenteById fallo.", {
      id,
      error: error.message,
      stack: error.stack,
    });

    return next(createError(500, `Error al obtener el incidente.`));
  }
};

// *************************************************************************************************
// RETORNAR los datos para renderizar los datos en el front
// intencion: que la API no renderize, que solo retorne un json
// Problema: puntos coincidentes se ven como uno solo
// En const { incidentes } se ajusta el limite de valores que devuelve (ej: 3000)

// version jitter
export const getMapaJitterData = async (req, res, next) => {
  logger.info("Se llamo a getMapaJitterData", {
    limit: MAP_LIMIT,
  });

  try {
    const { incidentes } = await incidenteServicio.getIncidentesService(
      1,
      MAP_LIMIT,
      "",
    );

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const mapped = incidentes.map((inc) =>
      mapIncidenteToResponse(inc, baseUrl),
    );

    if (mapped.length === MAP_LIMIT) {
      logger.warn("getMapaJitterData llego al MAP_LIMIT", {
        limit: MAP_LIMIT,
        returned: mapped.length,
        hint: "Posible recorte de los datos usados en el render del mapa.",
      });
    }

    logger.info("getMapaJitterData cargo los incidentes", {
      type: "jitter",
      count: mapped.length,
    });

    res.status(200).json({
      success: true, // status flag
      type: "jitter", // Para que el frontend sepa que visualizacion usar
      count: mapped.length, // Cantidad de incidentes que se retornan
      data: mapped, // La lista de los incidentes
    });
  } catch (err) {
    logger.error("getMapaJitterData fallo.", {
      type: "jitter",
      limit: MAP_LIMIT,
      error: err.message,
      stack: err.stack,
    });

    return next(createError(500, "Error al obtener datos para mapa jitter"));
  }
};

// version cluster
export const getMapaClusterData = async (req, res, next) => {
  logger.info("Se llamo a getMapaClusterData", {
    limit: MAP_LIMIT,
  });

  try {
    const { incidentes } = await incidenteServicio.getIncidentesService(
      1,
      MAP_LIMIT,
      "",
    );

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const mapped = incidentes.map((inc) =>
      mapIncidenteToResponse(inc, baseUrl),
    );

    if (mapped.length === MAP_LIMIT) {
      logger.warn("getMapaClusterData llego al MAP_LIMIT", {
        limit: MAP_LIMIT,
        returned: mapped.length,
        hint: "Posible recorte de los datos usados en el render del mapa.",
      });
    }

    logger.info("getMapaClusterData cargo los incidentes", {
      type: "cluster",
      count: mapped.length,
    });

    res.status(200).json({
      success: true, // status flag
      type: "cluster", // Para que el frontend sepa que visualizacion usar
      count: mapped.length, // Cantidad de incidentes que se retornan
      data: mapped, // La lista de los incidentes
    });
  } catch (err) {
    logger.error("getMapaClusterData fallo.", {
      type: "cluster",
      limit: MAP_LIMIT,
      error: err.message,
      stack: err.stack,
    });

    return next(createError(500, "Error al obtener datos para mapa cluster"));
  }
};
