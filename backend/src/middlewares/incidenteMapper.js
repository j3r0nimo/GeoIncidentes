/* middleware para dar formato al servicio de retornar un registro por su id
 * es un mapper
 */
export const mapIncidenteToResponse = (incidente, baseUrl) => {
  return {
    ...incidente,
    imagenUrl: incidente.imagen
      ? `${baseUrl}/uploads/img/${incidente.imagen}`
      : null,
  };
};
