import PDFDocument from "pdfkit";

/**
 * Builds a PDF report and returns a Buffer.
 * rows = array of mapped report rows (DTO)
 */
export const buildIncidentesPdf = async ({ rows, meta }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape", // MUCH better for tables
        margin: 30,
      });

      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // ===== Header =====
      doc.fontSize(16).text(meta?.title ?? "Reporte", { align: "center" });
      doc.moveDown(0.2);
      doc
        .fontSize(9)
        .text(`Fecha & hora: ${new Date().toLocaleString("es-AR")}`, {
          align: "left",
        });
      doc.moveDown(0.5);
      doc.fontSize(9).text("H: Heridos | F: Fallecidos", { align: "left" });

      if (meta?.rangeText) {
        doc.fontSize(9).text(meta.rangeText, { align: "center" });
      }

      doc.moveDown(1.3);

      // ===== Table =====
      const startX = doc.x;
      let y = doc.y;

      // Column definitions
      const columns = [
        { key: "fecha", label: "Fecha", width: 55 },
        { key: "hora", label: "Hora", width: 35 },
        { key: "tipo", label: "Hecho", width: 56 },
        { key: "medio", label: "Medio", width: 58 },
        { key: "vehiculo", label: "Vehículo", width: 115 },
        { key: "patente", label: "Patente", width: 55 },
        { key: "sector", label: "Sector", width: 145 },
        { key: "direccion", label: "Dirección", width: 210 },
        { key: "heridos", label: "H", width: 25 },
        { key: "fallecidos", label: "F", width: 25 },
      ];

      const rowHeight = 18;

      const drawHeader = () => {
        doc.fontSize(9).font("Helvetica-Bold");

        let x = startX;
        for (const col of columns) {
          doc.text(col.label, x, y, { width: col.width, align: "left" });
          x += col.width;
        }

        doc
          .moveTo(startX, y + rowHeight - 4)
          .lineTo(x, y + rowHeight - 4)
          .stroke();

        y += rowHeight;
        doc.font("Helvetica");
      };

      const ensureSpace = () => {
        if (y > doc.page.height - 50) {
          doc.addPage();
          y = doc.y;
          drawHeader();
        }
      };

      drawHeader();

      // rows
      doc.fontSize(8);

      for (const r of rows) {
        ensureSpace();

        let x = startX;
        for (const col of columns) {
          const value = r[col.key] ?? "";
          doc.text(String(value), x, y, {
            width: col.width,
            align: "left",
            ellipsis: true,
          });
          x += col.width;
        }

        y += rowHeight;
      }

      // ===== Footer summary (FIXED) =====
      const totalHeridos = rows.reduce(
        (acc, r) => acc + (Number(r.heridos) || 0),
        0,
      );
      const totalFallecidos = rows.reduce(
        (acc, r) => acc + (Number(r.fallecidos) || 0),
        0,
      );

      const footerText = `Total incidentes: ${rows.length} | Heridos: ${totalHeridos} | Fallecidos: ${totalFallecidos}`;

      // IMPORTANT: reset x position and give full width, otherwise it wraps like a cell
      const left = doc.page.margins.left;
      const width =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;

      // Move Y below the table
      y += 10;

      doc.fontSize(10).font("Helvetica-Bold");
      doc.text(footerText, left, y, {
        width,
        align: "left", // change to "left" if you prefer
        lineBreak: false,
      });

      doc.font("Helvetica");
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
