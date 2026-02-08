// DTO para la construccion del reporte

export const mapIncidenteToReportRow = (inc) => {
  return {
    fecha: inc.fecha ? new Date(inc.fecha).toLocaleDateString("es-AR", { timeZone: "UTC" }) : "",
    hora: inc.hora ?? "",
    tipo: inc.incidente ?? "",
    medio: inc.medio ?? "",
    vehiculo: inc.vehiculo ?? "",
    sector: inc.sector ?? "",
    direccion: inc.direccion ?? "",
    heridos: inc.heridos ?? 0,
    fallecidos: inc.fallecidos ?? 0,
    patente: inc.patente ?? "-",
    descripcion: inc.descripcion ?? "-",
    web: inc.web ?? "",
    lugar: inc.lugar ?? "",
  };
};
