// src/components/ExportarPdfButton.jsx
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FetchIncidentesPdfReport } from "../api/incidentesApi";

export default function ExportarPdfButton({ filters }) {
  const [loading, setLoading] = useState(false);

  const handleExportPdf = async () => {
    try {
      setLoading(true);

      const pdfBlob = await FetchIncidentesPdfReport(filters);
      const url = window.URL.createObjectURL(pdfBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-incidentes-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("No se pudo generar el PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline-primary"
      className="w-100"
      onClick={handleExportPdf}
      disabled={loading}
    >
      {loading ? (
        <>
          <Spinner size="sm" className="me-2" />
          Exportando PDF...
        </>
      ) : (
        "Exportar PDF"
      )}
    </Button>
  );
}