import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { FetchMapaJitterData } from "../api/incidentesApi";
import FiltroPanel from "../components/FiltroPanel";
import Resumen from "../components/Resumen";
import { getTipoColor } from "../utils/colors";
import { estaEnRango } from "../utils/timeUtils";
import { Row, Col, Container, Offcanvas, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import GraficoTorta from "../components/graficoTorta";

Chart.register(ArcElement, Tooltip, Legend);

// funcion exportada
export default function MapaJitterIncidentes() {
  const [incidentes, setIncidentes] = useState([]);
  const [filteredIncidentes, setFilteredIncidentes] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Estado para el Offcanvas
  const [showFilters, setShowFilters] = useState(false);

  // Estado para el grafico de torta
  const [showChart, setShowChart] = useState(false)

  //  Handlers para el Offcanvas
  const handleCloseFilters = () => setShowFilters(false);
  const handleShowFilters = () => setShowFilters(true);

  //  Handler para el grafico de torta
  const handleCloseChart = () => setShowChart(false);
  const handleShowChart = () => setShowChart(true);

  // filtros
  const [filters, setFilters] = useState({
    tipo: "todos",
    medio: "todos",
    periodo: "",
    fallecidos: "todos",
    sector: "todos",
    keyword: "",
    desde: "",
    hasta: ""
  });

  // Reset function
  const resetFilters = () => {
    setFilters({
      tipo: "todos",
      medio: "todos",
      periodo: "",
      fallecidos: "todos",
      sector: "todos",
      keyword: "",
      desde: "",
      hasta: ""
    });
    setFilteredIncidentes(incidentes);
  };


  // Solicita y obtiene los datos
  useEffect(() => {
    async function fetchIncidentes() {
      try {
        const json = await FetchMapaJitterData();
        console.log("Fetched jitter data:", json);
        setIncidentes(json.data || []);
        setFilteredIncidentes(json.data || []);
      } catch (err) {
        console.error("Error fetching incidentes:", err);
        setIncidentes([]);            // avoid undefined
        setFilteredIncidentes([]);    // avoid undefined
      }
      finally {
        setLoading(false);
      }
    }
    fetchIncidentes();
  }, []);


  // aplica los filtros automaticamente, cuando hay cambios en el panel de filtros
  useEffect(() => {
    let filtered = incidentes;

    if (filters.tipo && filters.tipo !== "todos") {
      filtered = filtered.filter(
        (inc) => inc.incidente?.toLowerCase() === filters.tipo.toLowerCase()
      );
    }

    if (filters.medio && filters.medio !== "todos") {
      filtered = filtered.filter(
        (inc) => inc.medio?.toLowerCase() === filters.medio.toLowerCase()
      );
    }

    if (filters.periodo) {
      filtered = filtered.filter((inc) => {
        const hora = inc.hora || "00:00";
        if (filters.periodo === "maniana") return estaEnRango(hora, "07:00", "14:00");
        if (filters.periodo === "tarde") return estaEnRango(hora, "14:01", "21:00");
        if (filters.periodo === "noche") return estaEnRango(hora, "21:01", "06:59");
        return true;
      });
    }

    if (filters.fallecidos && filters.fallecidos !== "todos") {
      filtered = filtered.filter((inc) => {
        if (filters.fallecidos === "con") return inc.fallecidos > 0;
        if (filters.fallecidos === "sin") return inc.fallecidos === 0;
        return true;
      });
    }

    if (filters.sector && filters.sector !== "todos") {
      filtered = filtered.filter(
        (inc) => inc.sector?.toLowerCase() === filters.sector.toLowerCase()
      );
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (inc) =>
          inc.direccion?.toLowerCase().includes(kw) ||
          inc.vehiculo?.toLowerCase().includes(kw) ||
          inc.patente?.toLowerCase().includes(kw) ||
          inc.sector?.toLowerCase().includes(kw) ||
          inc.descripcion?.toLowerCase().includes(kw)
      );
    }

    if (filters.desde) {
      const desdeTime = new Date(filters.desde).getTime();
      filtered = filtered.filter((inc) => {
        if (!inc.fecha) return false;
        const fechaTime = new Date(inc.fecha).getTime();
        return !isNaN(fechaTime) && fechaTime >= desdeTime;
      });
    }

    if (filters.hasta) {
      const hastaTime = new Date(filters.hasta).getTime();
      filtered = filtered.filter((inc) => {
        if (!inc.fecha) return false;
        const fechaTime = new Date(inc.fecha).getTime();
        return !isNaN(fechaTime) && fechaTime <= hastaTime;
      });
    }


    setFilteredIncidentes(filtered);
  }, [filters, incidentes]);


  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
      <p>Cargando incidentes...</p>
    </Container>
  );

  // --- Resumen en el panel ---
  const total = filteredIncidentes.length;

  const fallecidos = filteredIncidentes.reduce((acc, inc) => acc + (inc.fallecidos || 0), 0);


  return (
    <Row className="g-0">

      <Col md={4} lg={2}>

        <Offcanvas
          show={showFilters}
          onHide={handleCloseFilters}
          responsive="md"
          placement="start"
          className="bg-light p-3"
          style={{ height: "100vh", overflowY: "auto" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filtros</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <FiltroPanel
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </Offcanvas.Body>
          <Resumen total={total} fallecidos={fallecidos} />
        </Offcanvas>
      </Col>


      <Col xs={12} md="auto" lg style={{ position: 'relative' }}>

        <Button
          variant="primary"
          className="d-md-none"
          onClick={handleShowFilters}
          style={{ position: 'absolute', top: 10, left: 55, zIndex: 1000 }}
        >
          Mostrar Filtros
        </Button>
        <Button
          variant="success"
          onClick={handleShowChart}
          style={{ position: 'absolute', top: 10, right: 20, zIndex: 1000 }}
        >
          Ver Estadísticas
        </Button>

        <MapContainer
          center={[-38.85, -62.0]}
          zoom={11}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredIncidentes.map((inc, idx) => {
            const epsilon = 0.00025;
            const lat =
              inc.posicion.lat + (Math.random() * epsilon - epsilon / 2);
            const lng =
              inc.posicion.lng + (Math.random() * epsilon - epsilon / 2);

            return (
              <CircleMarker
                key={`${inc.id || idx}-${inc.incidente}-${Math.random()}`}
                center={[lat, lng]}
                radius={8}
                fillColor={getTipoColor(inc.incidente)}
                color="#000"
                weight={1}
                opacity={1}
                fillOpacity={0.8}
              >
                <Popup>
                  <strong>{inc.incidente}</strong>
                  <Button as={Link} to={`/incidentes/${inc._id}`} target="_blank" className="rounded-circle" variant="info" size="sm">
                    info
                  </Button>
                  <br />
                  {inc.direccion}
                  <br />
                  {inc.fecha?.substring(0, 10)} {inc.hora}
                  <br />
                  {inc.web && (
                    <a href={inc.web} target="_blank" rel="noopener noreferrer">
                      noticia
                    </a>
                  )}

                  <br />
                  {inc.imagenUrl && (
                    <a href={inc.imagenUrl} target="_blank" rel="noopener noreferrer">
                      <img src={inc.imagenUrl} alt="Imagen" width="150" />
                    </a>
                  )}

                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </Col>
      {showChart && (
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 20,
            width: "350px",
            background: "white",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            zIndex: 1000
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h6 style={{ margin: 0 }}>Estadísticas</h6>
            <Button variant="danger" size="sm" onClick={handleCloseChart}>
              X
            </Button>
          </div>

          <GraficoTorta incidentes={filteredIncidentes} />
        </div>
      )}
    </Row>
  );
}