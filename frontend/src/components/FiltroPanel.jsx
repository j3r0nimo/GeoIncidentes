import { Form, Button, Row, Col } from "react-bootstrap";
import ExportarPdfButton from "./ExportarPdfButton";
import ExportarXlsxButton from "./exportarXlsxButton";

export default function FiltroPanel({ filters, onChange, onReset }) {
  return (
    <Form className="small">
      <Form.Group className="mb-2" controlId="filtroHecho">
        <Form.Label className="mb-1">
          <b>Hecho</b>
        </Form.Label>
        <Form.Select
          size="sm"
          value={filters.tipo}
          onChange={(e) => onChange({ ...filters, tipo: e.target.value })}
        >
          <option value="todos">Todos</option>
          <option value="choque">Choque</option>
          <option value="detencion">Detención</option>
          <option value="incendio">Incendio</option>
          <option value="incidente">Incidente</option>
          <option value="secuestro">Secuestro</option>
          <option value="vuelco">Vuelco</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2" controlId="filtroMedio">
        <Form.Label className="mb-1">
          <b>Medio</b>
        </Form.Label>
        <Form.Select
          size="sm"
          value={filters.medio}
          onChange={(e) => onChange({ ...filters, medio: e.target.value })}
        >
          <option value="todos">Todos</option>
          <option value="automovil">Automóvil</option>
          <option value="bicicleta">Bicicleta</option>
          <option value="camion">Camión</option>
          <option value="cuatriciclo">Cuatriciclo</option>
          <option value="motocicleta">Motocicleta</option>
          <option value="omnibus">Ómnibus</option>
          <option value="remolque">Remolque</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2" controlId="filtroHoras">
        <Form.Label className="mb-1">
          <b>Horas</b>
        </Form.Label>
        <Form.Select
          size="sm"
          value={filters.periodo}
          onChange={(e) => onChange({ ...filters, periodo: e.target.value })}
        >
          <option value="">Todos</option>
          <option value="maniana">07:00 - 14:00</option>
          <option value="tarde">14:01 - 21:00</option>
          <option value="noche">21:01 - 06:59</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2" controlId="filtroFallecidos">
        <Form.Label className="mb-1">
          <b>Fallecidos</b>
        </Form.Label>
        <Form.Select
          size="sm"
          value={filters.fallecidos}
          onChange={(e) => onChange({ ...filters, fallecidos: e.target.value })}
        >
          <option value="todos">Sin filtro</option>
          <option value="con">Solo fallecidos</option>
          <option value="sin">Sin fallecidos</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2" controlId="filtroSectores">
        <Form.Label className="mb-1">
          <b>Sector</b>:
        </Form.Label>
        <Form.Select
          size="sm"
          value={filters.sector}
          onChange={(e) => onChange({ ...filters, sector: e.target.value })}
        >
          <option value="todos">Todos</option>
          <option value="Bahia Blanca.">Bahia Blanca</option>
          <option value="BNPB.">BNPB</option>
          <option value="Centro. Punta Alta.">Centro</option>
          <option value="Ciudad Atlantida. Punta Alta.">Cd Atlantida</option>
          <option value="Nueva Bahia Blanca. Punta Alta.">Nueva Bahia</option>
          <option value="Pehuenco.">Pehuenco</option>
          <option value="RP 113.">RP 113</option>
          <option value="RN 229.">RN 229</option>
          <option value="RN 249.">RN 249</option>
          <option value="RN 3.">RN 3</option>
          <option value="Rural.">Rural</option>
          <option value="Villa Arias.">Villa Arias</option>
          <option value="Villa del Mar.">Villa del Mar</option>
          <option value="Villa Mora - Villa Laura. Punta Alta.">
            V. Mora/Laura
          </option>
          <option value="Zona Norte. Punta Alta.">Zona Norte</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2" controlId="filtroBusqueda">
        <Form.Label className="mb-1">
          <b>Búsqueda</b>
        </Form.Label>
        <Form.Control
          size="sm"
          type="text"
          value={filters.keyword}
          onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
          placeholder="Ingrese palabra clave"
        />
      </Form.Group>

      <Row className="mb-2 g-2">
        <Col>
          <Form.Group controlId="filtroDesde">
            <Form.Label className="mb-1">
              <b>Desde</b>
            </Form.Label>
            <Form.Control
              size="sm"
              type="date"
              value={filters.desde}
              onChange={(e) => onChange({ ...filters, desde: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="filtroHasta">
            <Form.Label className="mb-1">
              <b>Hasta</b>
            </Form.Label>
            <Form.Control
              size="sm"
              type="date"
              value={filters.hasta}
              onChange={(e) => onChange({ ...filters, hasta: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-grid gap-1">
        {/* PDF EXPORT BUTTON */}
        <ExportarPdfButton filters={filters} />

        {/* XLSX EXPORT BUTTON */}
        <ExportarXlsxButton filters={filters} />

        {/* RESET BUTTON */}
        <Button variant="outline-danger" onClick={onReset} className="w-100">
          Resetear Filtros
        </Button>
      </div>
    </Form>
  );
}