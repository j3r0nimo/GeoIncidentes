import Incidente from "../models/incidente.js";

// NORMAS DEL DISEÑO:
// Estilo de función: function expression (o sea: asignar la función a una variable)
// const fn = async () => {}
// Error handling: a nivel de la capa del controller
// id validation: a nivel ruta, mediante un middleware

// Lista de funciones:
// getIncidentesService             RETORNAR EL LISTADO DE INCIDENTES
// getIncidenteByIdService          RETORNAR EL INCIDENTE POR SU /:id (.lean() -> Plain js)
// newIncidenteService              CREAR UN NUEVO INCIDENTE
// deleteIncidenteService           ELIMINAR UN INCIDENTE
// updateIncidenteService           ACTUALIZAR UN INCIDENTE
// getIncidenteDocumentByIdService  RETORNAR EL INCIDENTE POR SU /:id (Mongoose document)


// RETORNAR un incidente por su /:id (retorna plain js)
export const getIncidenteByIdService = async (id) => {
  return Incidente.findById(id).lean();
};


// RETORNAR un incidente por su /:id (retorna un Mongoose document)
export const getIncidenteDocumentByIdService = async (id) => {
  return Incidente.findById(id);
};

// CREAR un NUEVO incidente
export const newIncidenteService = async (data) => {
  return new Incidente(data).save();
};

// ELIMINAR un incidente
export const deleteIncidenteService = async (id) => {
  return Incidente.findByIdAndDelete(id);
};

// ACTUALIZAR un incidente
export const updateIncidenteService = async (id, data) => {
  return Incidente.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};
/*
 * version final
 * 19 enero 2026
 * Persistence only (Mongoose queries only)
 * No HTTP concerns
 * No URL building
 * No error formatting
 * No id validation
 */
