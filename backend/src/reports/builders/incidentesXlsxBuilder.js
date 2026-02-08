import ExcelJS from "exceljs";

/**
 * Builds an XLSX report and returns a Buffer.
 * rows = array of mapped report rows (DTO)
 */
export const buildIncidentesXlsx = async ({ rows, meta }) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Skynet";
  workbook.created = new Date();

  // =========================
  // Sheet 1: Incidentes
  // =========================
  const sheet = workbook.addWorksheet("Incidentes");

  // Title row
  sheet.addRow([meta?.title ?? "Reporte"]);
  sheet.getRow(1).font = { bold: true, size: 16 };
  sheet.mergeCells("A1:M1");

  // Date row
  sheet.addRow([`Fecha & hora: ${new Date().toLocaleString("es-AR")}`]);
  sheet.mergeCells("A2:M2");

  // Legend row
  sheet.addRow(["H: Heridos | F: Fallecidos"]);
  sheet.mergeCells("A3:M3");

  // Empty line
  sheet.addRow([]);

  // Table header
  const header = [
    "Fecha",
    "Hora",
    "Hecho",
    "Medio",
    "Vehículo",
    "Patente",
    "Sector",
    "Dirección",
    "Lugar",
    "H",
    "F",
    "Descripcion",
    "Web",
  ];

  const headerRowIndex = sheet.lastRow.number + 1;
  sheet.addRow(header);

  const headerRow = sheet.getRow(headerRowIndex);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: "middle", horizontal: "left" };

  // Column widths
  sheet.columns = [
    { key: "fecha", width: 12 },
    { key: "hora", width: 8 },
    { key: "tipo", width: 12 },
    { key: "medio", width: 12 },
    { key: "vehiculo", width: 22 },
    { key: "patente", width: 10 },
    { key: "sector", width: 25 },
    { key: "direccion", width: 35 },
    { key: "lugar", width: 12 },
    { key: "heridos", width: 6 },
    { key: "fallecidos", width: 6 },
    { key: "descripcion", width: 25 },
    { key: "web", width: 25 },
  ];

  // Data rows
  for (const r of rows) {
    sheet.addRow([
      r.fecha ?? "",
      r.hora ?? "",
      r.tipo ?? "",
      r.medio ?? "",
      r.vehiculo ?? "",
      r.patente ?? "",
      r.sector ?? "",
      r.direccion ?? "",
      r.lugar ?? "",
      Number(r.heridos ?? 0),
      Number(r.fallecidos ?? 0),
      r.descripcion ?? "",
      r.web ?? "",
    ]);
  }

  // Freeze panes (keep header visible)
  sheet.views = [{ state: "frozen", ySplit: headerRowIndex }];

  // Totals row
  const totalHeridos = rows.reduce(
    (acc, r) => acc + (Number(r.heridos) || 0),
    0,
  );
  const totalFallecidos = rows.reduce(
    (acc, r) => acc + (Number(r.fallecidos) || 0),
    0,
  );

  sheet.addRow([]);
  const totalsRow = sheet.addRow([
    "Totales",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    totalHeridos,
    totalFallecidos,
    "",
    "",
  ]);
  totalsRow.font = { bold: true };

  // =========================
  // Sheet 2: Resumen
  // =========================
  const resumen = workbook.addWorksheet("Resumen");

  resumen.columns = [
    { key: "a", width: 30 },
    { key: "b", width: 12 },
    { key: "c", width: 12 },
    { key: "d", width: 12 },
  ];

  const normalizeKey = (v) => {
    const s = String(v ?? "").trim();
    return s.length ? s : "Sin dato";
  };

  const groupStats = (keyFn) => {
    const map = new Map();

    for (const r of rows) {
      const key = normalizeKey(keyFn(r));

      if (!map.has(key)) {
        map.set(key, { count: 0, heridos: 0, fallecidos: 0 });
      }

      const item = map.get(key);
      item.count += 1;
      item.heridos += Number(r.heridos) || 0;
      item.fallecidos += Number(r.fallecidos) || 0;
    }

    // Sort desc by count
    return [...map.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, stats]) => ({ key, ...stats }));
  };

  const addSection = (title, data) => {
    // Section title
    resumen.addRow([title]);
    const tRow = resumen.getRow(resumen.lastRow.number);
    tRow.font = { bold: true, size: 14 };

    // Header row
    resumen.addRow(["Categoría", "Cantidad", "Heridos", "Fallecidos"]);
    const hRow = resumen.getRow(resumen.lastRow.number);
    hRow.font = { bold: true };

    // Data
    for (const item of data) {
      resumen.addRow([item.key, item.count, item.heridos, item.fallecidos]);
    }

    // Empty line
    resumen.addRow([]);
  };

  const porTipo = groupStats((r) => r.tipo); // incidente enum
  const porMedio = groupStats((r) => r.medio);
  const porSector = groupStats((r) => r.sector);

  // Metadata top
  resumen.addRow([meta?.title ?? "Reporte"]);
  resumen.getRow(1).font = { bold: true, size: 16 };
  resumen.mergeCells("A1:D1");

  resumen.addRow([`Fecha & hora: ${new Date().toLocaleString("es-AR")}`]);
  resumen.mergeCells("A2:D2");

  resumen.addRow([]);

  addSection("Resumen por Hecho (Tipo)", porTipo);
  addSection("Resumen por Medio", porMedio);
  addSection("Resumen por Sector", porSector);

  // Freeze top rows in resumen (optional)
  resumen.views = [{ state: "frozen", ySplit: 3 }];

  // Return XLSX buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};
