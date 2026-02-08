import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';
import IncidentesLista from "./pages/IncidentesList";
import IncidenteDetalle from "./components/IncidenteDetail";
import MapaJitterIncidentes from "./pages/MapaJitter";
import MapaClusterIncidentes from "./pages/MapaCluster";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginAdmin from "./pages/login";
import NuevoIncidente from "./pages/administracion";
import Inicio from "./pages/inicio";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">Incidentes viales</Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/incidentes">Incidentes</Nav.Link>
                <Nav.Link as={Link} to="/incidentes/mapa-jitter">Mapa Jitter</Nav.Link>
                <Nav.Link as={Link} to="/incidentes/mapa-cluster">Mapa Cluster</Nav.Link>
                <Nav.Link as={Link} to="/acceso-interno">Login </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/acceso-interno" element={<LoginAdmin />} />
            <Route path="/administracion" element={< NuevoIncidente />} />
            <Route path="/incidentes" element={<IncidentesLista />} />
            <Route path="/incidentes/:id" element={<IncidenteDetalle />} />
            <Route path="/incidentes/mapa-jitter" element={<MapaJitterIncidentes />} />
            <Route path="/incidentes/mapa-cluster" element={<MapaClusterIncidentes />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;