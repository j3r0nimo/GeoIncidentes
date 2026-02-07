import Incidente from "../models/incidente.js";
import { mapIncidenteToReportRow } from "../reports/mappers/incidenteReportMapper.js";
import { buildIncidentesPdf } from "../reports/builders/incidentesPdfBuilder.js";
import { buildIncidentesXlsx } from "../reports/builders/incidentesXlsxBuilder.js";

// NORMAS DEL DISEÑO:
// Estilo de función: function expression (o sea: asignar la función a una variable)
// const fn = async () => {}
// Error handling: a nivel de la capa del controller
// id validation: a nivel ruta, mediante un middleware

// Lista de funciones:
// buildIncidentesPdfReport         RETORNAR UN PDF
// buildIncidentesXlsxReport        RETORNA UN XLS

const INCIDENTE_ENUM = [
  "choque",
  "detencion",
  "incendio",
  "incidente",
  "secuestro",
  "vuelco",
];

const MEDIO_ENUM = [
  "automovil",
  "bicicleta",
  "camion",
  "cuatriciclo",
  "motocicleta",
  "omnibus",
  "remolque",
];

const SECTOR_ENUM = [
  "Bahia Blanca.",
  "BNPB.",
  "Centro. Punta Alta.",
  "Ciudad Atlantida. Punta Alta.",
  "Nueva Bahia Blanca. Punta Alta.",
  "Pehuenco.",
  "RP 113.",
  "RN 229.",
  "RN 249.",
  "RN 3.",
  "Rural.",
  "Villa Arias.",
  "Villa del Mar.",
  "Villa Mora - Villa Laura. Punta Alta.",
  "Zona Norte. Punta Alta.",
];

const PERIODO_ENUM = ["maniana", "tarde", "noche"];

const FALLECIDOS_ENUM = ["con", "sin"]; // "todos" means ignore filter

const normalize = (v) => String(v ?? "").trim();

const validateEnum = (value, allowed, fieldName) => {
  const v = normalize(value);
  if (!v) return null; // not provided => ignore

  if (!allowed.includes(v)) {
    const err = new Error(
      `Invalid '${fieldName}'. Allowed values: ${allowed.join(", ")}`,
    );
    err.statusCode = 400;
    throw err;
  }

  return v;
};

const buildIncidentesReportFilter = ({
  desde,
  hasta,
  keyword = "",
  tipo,
  medio,
  sector,
  periodo,
  fallecidos,
}) => {
  const filter = {};

  // Date range
  if (desde || hasta) {
    filter.fecha = {};
    if (desde) filter.fecha.$gte = new Date(desde);
    if (hasta) filter.fecha.$lte = new Date(hasta);
  }

  // Validate enums (fail fast with 400)
  const tipoOk = validateEnum(tipo, INCIDENTE_ENUM, "tipo");
  const medioOk = validateEnum(medio, MEDIO_ENUM, "medio");

  if (tipoOk) filter.incidente = tipoOk;
  if (medioOk) filter.medio = medioOk;

  // ===== sector =====
  // frontend uses "todos" => ignore
  if (sector && sector !== "todos") {
    const sectorOk = validateEnum(sector, SECTOR_ENUM, "sector");
    if (sectorOk) filter.sector = sectorOk;
  }

  // ===== fallecidos =====
  // "con" => fallecidos > 0
  // "sin" => fallecidos == 0
  // "todos" => ignore
  if (fallecidos && fallecidos !== "todos") {
    const fallecidosOk = validateEnum(
      fallecidos,
      FALLECIDOS_ENUM,
      "fallecidos",
    );
    if (fallecidosOk === "con") filter.fallecidos = { $gt: 0 };
    if (fallecidosOk === "sin") filter.fallecidos = 0;
  }

  // ===== periodo (based on hora string HH:mm) =====
  // maniana => 07:00 - 14:00
  // tarde   => 14:01 - 21:00
  // noche   => 21:01 - 06:59  (wraps midnight)
  if (periodo) {
    const periodoOk = validateEnum(periodo, PERIODO_ENUM, "periodo");

    if (periodoOk === "maniana") {
      filter.hora = { $gte: "07:00", $lte: "14:00" };
    }

    if (periodoOk === "tarde") {
      filter.hora = { $gte: "14:01", $lte: "21:00" };
    }

    if (periodoOk === "noche") {
      // wrap around midnight => OR
      filter.$and = filter.$and ?? [];
      filter.$and.push({
        $or: [{ hora: { $gte: "21:01" } }, { hora: { $lte: "06:59" } }],
      });
    }
  }

  // ===== Keyword search =====
  if (keyword?.trim()) {
    const kw = keyword.trim();

    // if filter already has $or (from periodo noche), we must not overwrite it.
    // We'll add keyword OR inside $and to combine properly.
    const keywordOr = [
      { incidente: { $regex: kw, $options: "i" } },
      { medio: { $regex: kw, $options: "i" } },
      { vehiculo: { $regex: kw, $options: "i" } },
      { patente: { $regex: kw, $options: "i" } },
      { direccion: { $regex: kw, $options: "i" } },
      { sector: { $regex: kw, $options: "i" } },
      { lugar: { $regex: kw, $options: "i" } },
      { descripcion: { $regex: kw, $options: "i" } },
    ];

    filter.$and = filter.$and ?? [];
    filter.$and.push({ $or: keywordOr });
  }

  return filter;
};

export const buildIncidentesPdfReport = async (query) => {
  const filter = buildIncidentesReportFilter(query);

  const incidentes = await Incidente.find(filter)
    .sort({ fecha: 1, hora: 1 })
    .lean();

  const rows = incidentes.map(mapIncidenteToReportRow);

  const buffer = await buildIncidentesPdf({
    rows,
    meta: {
      title: "Reporte de Incidentes", // Titulo que va a imprimir el pdf
      generatedAt: new Date(),
      query,
    },
  });

  return {
    buffer,
    filename: `reporte-incidentes-${Date.now()}.pdf`,
  };
};

export const buildIncidentesXlsxReport = async (query) => {
  const filter = buildIncidentesReportFilter(query);

  const incidentes = await Incidente.find(filter)
    .sort({ fecha: 1, hora: 1 })
    .lean();

  const rows = incidentes.map(mapIncidenteToReportRow);

  const buffer = await buildIncidentesXlsx({
    rows,
    meta: {
      title: "Reporte de Incidentes",
      generatedAt: new Date(),
      query,
    },
  });

  return {
    buffer,
    filename: `reporte-incidentes-${Date.now()}.xlsx`,
  };
};

/**
 * This service does 5 jobs:
 * 1. Build Mongo filter from query params
 * 2. Fetch incidentes from DB
 * 3. Transform data into report rows (DTO mapping)
 * 4. Generate PDF and return { buffer, filename }
 * 5. Generate XLS and return { buffer, filename }
 */
