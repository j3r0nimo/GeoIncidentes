import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchIncidenteById } from "../api/incidentesApi";
import { Container, Card, Button, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Función que exporta el detalle del incidente
export default function IncidenteDetalle() {
  const navigate = useNavigate()
  const { id } = useParams();                         // Obtener el id desde la ruta
  console.log("ID from route:", id);
  const [incidente, setIncidente] = useState(null);   // variable para almacenar los datos. Es un único objeto.
  const [loading, setLoading] = useState(true);       // variable para ver si los datos se están cargando
  const [error, setError] = useState(null);           // variable para seguimiento de los errores

  // función que obtiene los datos
  useEffect(() => {
    let mounted = true;
    const getIncidentesById = async () => {
      try {
        const data = await FetchIncidenteById(id);
        console.log("Fetched incidente:", data);
        if (mounted) setIncidente(data || null);                                    // esperamos un único incidente
      } catch (err) {
        console.error("Error fetching incidente:", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    getIncidentesById();
  }, [id]);                                                                // no puede estar vacío, debe contener el id



  // renderizado previo al renderizado de datos
  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
      <p>Cargando el incidente...</p>
    </Container>
  );
  if (error) return <Container className="mt-4"><p style={{ color: "red" }}>Error: {error}</p></Container>;
  if (!incidente) return <Container className="mt-4"><p>No se encontró el incidente.</p></Container>;              // incidente es un objecto, no un arreglo → no tiene .length.

  // renderizado de datos del incidente
  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h2">Detalle del Incidente</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <b>Fecha:</b>{" "}
                {incidente.fecha
                  ? incidente.fecha.substring(0, 10).split("-").reverse().join("/")
                  : "N/A"}
              </p>
              <p><b>Hora:</b> {incidente.hora || "N/A"}</p>
              <p><b>Incidente:</b> {incidente.incidente || "N/A"}</p>
              <p><b>Medio:</b> {incidente.medio || "N/A"}</p>
              <p><b>Vehículo:</b> {incidente.vehiculo || "N/A"}</p>
              <p><b>Patente:</b> {incidente.patente || "N/A"}</p>
              <p><b>Heridos:</b> {incidente.heridos ?? "N/A"}</p>
              <p><b>Fallecidos:</b> {incidente.fallecidos ?? "N/A"}</p>
            </Col>

            <Col md={6}>
              <p><b>Sector:</b> {incidente.sector || "N/A"}</p>
              <p><b>Dirección:</b> {incidente.direccion || "N/A"}</p>
              <p>
                <b>Mapa:</b>{" "}
                {incidente.posicion?.lat && incidente.posicion?.lng ? (
                  <a
                    href={`https://www.google.com/maps?q=${incidente.posicion.lat},${incidente.posicion.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver en Google maps
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p><b>Cordenadas:</b> Lat: {incidente.posicion?.lat}  Lng: {incidente.posicion?.lng}</p>
              <p><b>Descripción:</b> {incidente.descripcion || "N/A"}</p>
              {incidente.imagenUrl && (
                <p>
                  <b>Foto:</b>{" "}
                  <a href={incidente.imagenUrl} target="_blank" rel="noopener noreferrer">
                    ver
                  </a>
                </p>
              )}
              {incidente.web && (
                <p>
                  <b>Enlace:</b>{" "}
                  <a href={incidente.web} target="_blank" rel="noopener noreferrer">
                    ver
                  </a>
                </p>
              )}
            </Col>
          </Row>

          <hr />

          <Button onClick={() => navigate('/incidentes')} variant="outline-secondary">
            ← Volver
          </Button>

        </Card.Body>
      </Card>
    </Container>
  );
}