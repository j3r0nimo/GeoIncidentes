// Soluciona un problema que apareción al documentar con Swagger
// dado que hay incompatibilidad desde mongoDB
// contra la forma en que Swagger envía los datos de posición,
// que no se ajusta a lo indicado por el modelo de incidentes

export const parsePosicion = (req, res, next) => {
  if (
    req.body["posicion.lat"] !== undefined &&
    req.body["posicion.lng"] !== undefined
  ) {
    req.body.posicion = {
      lat: Number(req.body["posicion.lat"]),
      lng: Number(req.body["posicion.lng"]),
    };
    delete req.body["posicion.lat"];
    delete req.body["posicion.lng"];
  }
  next();
};
