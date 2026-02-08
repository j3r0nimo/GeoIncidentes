/// SCRIPT para importar el contenido del archivo csv
import "../../config/env.js";

import connectDB from "../db/db.js";

import fs from "fs";
import csvParser from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

import Incidente from "../models/incidente.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("BASE DE DATOS (MONGO_URI from env):", process.env.MONGO_URI);

// Convierte "DD/MM/YYYY" → Date
const convertirFecha = (fechaStr) => {
  if (!fechaStr) return null;
  const [dia, mes, anio] = fechaStr.split("/");
  return new Date(`${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`);
};

// Promisified CSV parser (CRITICAL)
const parseCSV = (csvPath) => {
  return new Promise((resolve, reject) => {
    const resultados = [];

    fs.createReadStream(csvPath, { encoding: "utf-8" })
      .pipe(csvParser({ separator: ";" }))
      .on("data", (data) => {
        const [lat, lng] = data.posicion
          ? data.posicion.split(",").map((c) => parseFloat(c.trim()))
          : [null, null];

        resultados.push({
          fecha: convertirFecha(data.fecha),
          hora: data.hora,
          incidente: data.incidente,
          medio: data.medio,
          vehiculo: data.vehiculo || null,
          patente: data.patente || null,
          heridos: parseInt(data.heridos) || 0,
          fallecidos: parseInt(data.fallecidos) || 0,
          direccion: data.direccion,
          sector: data.sector,
          lugar: data.lugar,
          posicion: { lat, lng },
          imagen: data.imagen,
          descripcion: data.descripcion,
          web: data.web,
        });
      })
      .on("end", () => resolve(resultados))
      .on("error", reject);
  });
};

const importarCSV = async () => {
  try {
    // 1️⃣ Connect DB
    await connectDB();

    // 2️⃣ Idempotency check
    const exists = await Incidente.exists({});
    if (exists) {
      console.log(
        "📦 La colección 'incidentes' ya tiene datos. Importación cancelada.",
      );
      process.exit(0);
    }

    // 3️⃣ Parse CSV
    const csvPath = path.join(__dirname, "accidentes_punta_alta.csv");
    const resultados = await parseCSV(csvPath);

    if (resultados.length === 0) {
      console.log("⚠️ El CSV está vacío. Nada para importar.");
      process.exit(0);
    }

    // 4️⃣ Insert documents
    await Incidente.insertMany(resultados);

    console.log(
      `📥 Importación completada con éxito (${resultados.length} registros).`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante la importación:", error);
    process.exit(1);
  }
};

importarCSV();
