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

// *************************************************************************************************
// CREAR un NUEVO incidente
export const newIncidente = async (req, res, next) => {
  logger.info("Se llamo a newIncidente", {
    hasImage: Boolean(req.file),
  });

  try {
    const data = { ...req.body };

    if (req.file) {
      data.imagen = req.file.filename;

      logger.info("El nuevo incidente tiene una imagen.", {
        filename: req.file.filename,
      });
    }

    const incidenteNuevo = await incidenteServicio.newIncidenteService(data);

    logger.info("Incidente creado con exito.", {
      id: incidenteNuevo._id,
      tipo: incidenteNuevo.incidente,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const incidenteResponse = mapIncidenteToResponse(
      incidenteNuevo.toObject(),
      baseUrl,
    );

    res.status(201).json(incidenteResponse);
  } catch (error) {
    // si hubo error, NO queremos guardar el archivo de imagen
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
        logger.warn(
          "No se guarda la imagen por no haberse podido crear el incidente",
          {
            filename: req.file.filename,
          },
        );
      } catch (unlinkError) {
        logger.error(
          "No se pudo eliminar la imagen subida, despues del error",
          {
            filename: req.file.filename,
            error: unlinkError.message,
          },
        );
      }
    }

    if (error.name === "ValidationError") {
      logger.warn(
        "Error de validacion mientras se creaba un nuevo incidente.",
        {
          message: error.message,
        },
      );

      return next(createError(400, error.message));
    }
    logger.error("Error inesperado en newIncidente", {
      error: error.message,
      stack: error.stack,
    });

    return next(createError(500, "Error al crear el incidente"));
  }
};

// *************************************************************************************************
// ELIMINAR un incidente
export const deleteIncidente = async (req, res, next) => {
  const { id } = req.params;

  logger.info("Se llamo a deleteIncidente", { id });

  try {
    const incidenteEliminado =
      await incidenteServicio.deleteIncidenteService(id);

    if (!incidenteEliminado) {
      logger.warn("deleteIncidente: not found. Incidente no localizado.", {
        id,
      });

      return next(
        createError(
          404,
          "No se pudo eliminar este incidente porque no se encontro el id recibido",
        ),
      );
    }

    if (incidenteEliminado.imagen) {
      const imagePath = path.resolve("uploads/img", incidenteEliminado.imagen);

      try {
        await fs.unlink(imagePath);
      } catch (err) {
        logger.warn("deleteIncidente: No se pudo borrar la imagen.", {
          id,
          image: incidenteEliminado.imagen,
          error: err.message,
        });
      }
    }

    logger.info("deleteIncidente: Se elimino el incidente.", {
      id: incidenteEliminado._id,
      hadImage: Boolean(incidenteEliminado.imagen),
    });

    res.status(200).json({
      mensaje: "Incidente correctamente eliminado.",
      id: incidenteEliminado._id,
      tipo: incidenteEliminado.incidente,
      medio: incidenteEliminado.medio,
      vehiculo: incidenteEliminado.vehiculo,
      patente: incidenteEliminado.patente,
    });
  } catch (error) {
    logger.error("deleteIncidente fallo.", {
      id,
      error: error.message,
      stack: error.stack,
    });

    return next(createError(500, `Error al eliminar el incidente.`));
  }
};

// *************************************************************************************************
// ACTUALIZAR un incidente
export const updateIncidente = async (req, res, next) => {
  const { id } = req.params;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  let nuevaImagen = null;
  let imagenAnterior = null;

  logger.info("Se llamo a updateIncidente", {
    id,
    hasFile: Boolean(req.file),
  });

  try {
    const data = { ...req.body };

    // 1 si se añade una imagen, la incluimos en el update
    if (req.file) {
      nuevaImagen = req.file.filename;
      data.imagen = nuevaImagen;

      logger.info("updateIncidente: Se agrega una nueva imagen.", {
        id,
        nuevaImagen,
      });
    }

    // 2 primero: tomamos el incidente (para saber el nombre de la imagen anterior)
    const incidenteExistente =
      await incidenteServicio.getIncidenteDocumentByIdService(id);

    if (!incidenteExistente) {
      logger.warn(
        "updateIncidente: incident not found. No se encontro el incidente.",
        { id },
      );

      if (nuevaImagen) {
        await fs
          .unlink(path.resolve("uploads/img", nuevaImagen))
          .catch(() => { });
      }

      return next(createError(404, "Incidente no encontrado"));
    }

    imagenAnterior = incidenteExistente.imagen;

    // 3 actualizar la base de datos
    const incidenteActualizado = await incidenteServicio.updateIncidenteService(
      id,
      data,
    );

    // 4 borrar la imagen anterior (solo si la cambiamos)
    if (nuevaImagen && imagenAnterior) {
      const oldImagePath = path.resolve("uploads/img", imagenAnterior);

      try {
        await fs.unlink(oldImagePath);
      } catch (err) {
        logger.warn("updateIncidente: No se pudo borrar la imagen previa.", {
          id,
          imagenAnterior,
          error: err.message,
        });
      }
    }

    // retornamos siempre la version mapped, no el raw Mongoose document
    const incidenteResponse = mapIncidenteToResponse(
      incidenteActualizado.toObject?.() ?? incidenteActualizado,
      baseUrl,
    );

    logger.info("updateIncidente. El incidente se actualizo correctamente.", {
      id,
      imageReplaced: Boolean(nuevaImagen),
    });

    res.status(200).json({
      mensaje: "Incidente actualizado correctamente",
      incidente: incidenteResponse,
    });
  } catch (error) {
    // 5 revertir la nueva imagen si el update falla
    if (nuevaImagen) {
      await fs.unlink(path.resolve("uploads/img", nuevaImagen)).catch(() => { });
    }

    if (error.name === "ValidationError") {
      logger.warn("updateIncidente. Error de validacion.", {
        id,
        error: error.message,
      });
      return next(
        createError(400, "Datos invalidos para actualizar el incidente"),
      );
    }

    logger.error("updateIncidente fallo.", {
      id,
      error: error.message,
    });

    return next(createError(500, "Error al actualizar el incidente"));
  }
};
// RETORNAR la lista de todos los incidentes
export const getIncidentes = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
    const keyword = req.query.keyword || ""; // ej.: ?keyword=Choque

    logger.info("Se llamo a getIncidentes", {
      page,
      limit,
      keyword,
    });

    const { incidentes, total, pages } =
      await incidenteServicio.getIncidentesService(page, limit, keyword);

    const baseUrl = `${req.protocol}://${req.get("host")}`; // completa el enlace de las imagenes

    const collectionUrl = `${baseUrl}${req.baseUrl}`; // completa el enlace de paginacion

    const responseData = incidentes.map((incidente) =>
      mapIncidenteToResponse(incidente, baseUrl),
    );

    res.status(200).json({
      success: true,
      data: responseData,
      meta: {
        total,
        page,
        pages,

        firstPage:
          total > 0
            ? `${collectionUrl}?page=1&limit=${limit}&keyword=${encodeURIComponent(keyword)}`
            : null,

        // ternario para asignar valor a prevPage
        prevPage:
          page > 1
            ? `${collectionUrl}?page=${
                page - 1
              }&limit=${limit}&keyword=${encodeURIComponent(keyword)}`
            : null,

        // ternario para asignar valor a nextPage
        nextPage:
          page < pages
            ? `${collectionUrl}?page=${
                page + 1
              }&limit=${limit}&keyword=${encodeURIComponent(keyword)}`
            : null,

        lastPage: pages
          ? `${collectionUrl}?page=${pages}&limit=${limit}&keyword=${encodeURIComponent(keyword)}`
          : null,

        hasPrev: page > 1, // bool. Asi el front sabe si usar el boton "PREVIO"

        hasNext: page < pages, // bool. Asi el front sabe si usar el boton "NEXT"
      },
    });
  } catch (err) {
    logger.error("getIncidentes fallo", {
      error: err.message,
      stack: err.stack,
    });

    return next(createError(500, "Error al obtener el listado de incidentes"));
  }
};

/*
 * version final
 * 23 enero 2026
 * Production-ready en terminos de diseño, arquitectura y cumplimiento de su razón de ser
 * HTTP
 * status codes
 * request/response shaping
 * file handling
 * Logger: catch errors and log them.
 * Image handling
 */

