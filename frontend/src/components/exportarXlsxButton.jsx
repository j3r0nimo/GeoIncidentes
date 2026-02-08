import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FetchIncidentesXlsxReport } from "../api/incidentesApi";

export default function ExportarXlsxButton({ filters }) {
  const [loading, setLoading] = useState(false);

  const handleExportXlsx = async () => {
    try {
      setLoading(true);

      const blob = await FetchIncidentesXlsxReport(filters);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-incidentes-${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error al exportar XLSX");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline-success"
      className="w-100"
      onClick={handleExportXlsx}
      disabled={loading}
    >
      {loading ? (
        <>
          <Spinner size="sm" className="me-2" />
          Exportando...
        </>
      ) : (
        "Exportar XLSX"
      )}
    </Button>
  );
}