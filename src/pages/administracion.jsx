import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Container } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function ManejadorClics({ alHacerClic, posicionActual }) {
    useMapEvents({
        click(e) {
            alHacerClic(e.latlng);
        },
    });
    return posicionActual ? <Marker position={posicionActual} /> : null;
}

export default function Administracion() {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const URL = `${BASE_URL}/api/incidentes`;

    const API_KEY = import.meta.env.VITE_API_KEY;

    const [listaIncidentes, setListaIncidentes] = useState([]);
    const [idEdicion, setIdEdicion] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    const datosIniciales = {
        incidente: "choque",
        descripcion: "",
        lat: "",
        lng: "",
        fecha: "",
        hora: "",
        medio: "automovil",
        vehiculo: "",
        patente: "",
        direccion: "",
        sector: "",
        lugar: "calle",
        heridos: 0,
        fallecidos: 0,
        web: "",
        imagen: ""
    };
    const [datos, setDatos] = useState(datosIniciales);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('isAdmin') !== 'true') {
            navigate('/acceso-interno', { replace: true });
        }
    }, [navigate]);
    useEffect(() => {
        cargarIncidentes();
    }, []);

    const cargarIncidentes = async () => {
        try {
            const res = await fetch(`${URL}?limit=5000`, {
                headers: {
                    'x-api-key': API_KEY
                }
            });
            const data = await res.json();
            setListaIncidentes(data.data || []);
        } catch (error) {
            console.error("Error cargando lista:", error);
        }
    };

    const handleChange = (e) => {
        let value;

        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else if (e.target.type === 'file') {
            value = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        } else {
            value = e.target.value;
        }
        setDatos({
            ...datos,
            [e.target.name]: value
        });
    };

    const handleMapaClick = (coordenadas) => {
        setDatos({
            ...datos,
            lat: coordenadas.lat,
            lng: coordenadas.lng
        });
    };

    const handleSeleccionarParaEditar = (item) => {
        setIdEdicion(item._id);
        setDatos({
            ...item,
            lat: item.posicion?.lat || item.lat || "",
            lng: item.posicion?.lng || item.lng || "",
            fecha: item.fecha ? item.fecha.substring(0, 10) : ""
        });
        window.scrollTo({ top: 0 });
    };

    const handleCancelarEdicion = () => {
        setIdEdicion(null);
        setDatos(datosIniciales);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!datos.lat || !datos.lng) {
            alert("Por favor selecciona una ubicación en el mapa");
            return;
        }
        const token = localStorage.getItem('token');

        const incidenteFinal = {
            ...datos,
            fecha: datos.fecha || new Date().toISOString(),
            posicion: {
                lat: parseFloat(datos.lat),
                lng: parseFloat(datos.lng)
            }
        };

        const formData = new FormData();

        Object.keys(incidenteFinal).forEach(key => {
            if (key === 'posicion') {
                formData.append('posicion[lat]', incidenteFinal.posicion.lat);
                formData.append('posicion[lng]', incidenteFinal.posicion.lng);
            } else if (incidenteFinal[key] !== null && incidenteFinal[key] !== "") {
                formData.append(key, incidenteFinal[key]);
            }
        });

        try {
            let response;
            const config = {
                method: idEdicion ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-api-key': API_KEY
                },
                body: formData
            };
            const urlFinal = idEdicion ? `${URL}/${idEdicion}` : URL;
            response = await fetch(urlFinal, config);

            if (response.ok) {
                alert(idEdicion ? "¡Incidente actualizado!" : "¡Incidente creado!");
                handleCancelarEdicion();
                cargarIncidentes();
            } else {
                alert("Error al guardar en el servidor");
            }

        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este incidente?")) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-api-key': API_KEY
                }
            });

            if (response.ok) {
                cargarIncidentes();
                if (idEdicion === id) handleCancelarEdicion();
            } else {
                alert("No se pudo eliminar el incidente (posible falta de permisos).");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const handleCerrar = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminName');
        navigate('/acceso-interno', { replace: true });
    };

    const marcadorActual = (datos.lat && datos.lng)
        ? { lat: parseFloat(datos.lat), lng: parseFloat(datos.lng) }
        : null;

    const incidentesFiltrados = listaIncidentes.filter((inc) => {
        const texto = busqueda.toLowerCase();
        const coincideTexto = !texto ||
            inc.incidente?.toLowerCase().includes(texto) ||
            inc.patente?.toLowerCase().includes(texto) ||
            inc.medio?.toLowerCase().includes(texto) ||
            inc.vehiculo?.toLowerCase().includes(texto) ||
            inc.direccion?.toLowerCase().includes(texto);

        if (!fechaDesde && !fechaHasta) return coincideTexto;

        const fechaInc = new Date(inc.fecha);
        fechaInc.setHours(0, 0, 0, 0);

        let coincideFecha = true;

        if (fechaDesde) {
            const desde = new Date(fechaDesde);
            desde.setHours(0, 0, 0, 0);
            if (fechaInc.getTime() < desde.getTime()) coincideFecha = false;
        }

        if (fechaHasta) {
            const hasta = new Date(fechaHasta);
            hasta.setHours(23, 59, 59, 999);
            if (fechaInc.getTime() > hasta.getTime()) coincideFecha = false;
        }

        return coincideTexto && coincideFecha;
    });

    const limpiarFiltros = (e) => {
        e.preventDefault();
        setBusqueda("");
        setFechaDesde("");
        setFechaHasta("");
    };

    return (
        <Container fluid className="mt-3">
            <Row className="mb-3">
                <Col>
                    <Button variant="danger" size="sm" onClick={handleCerrar}>
                        Cerrar sesión
                    </Button>
                </Col>
            </Row>
            <Row>
                <div className={`card p-3 ${idEdicion ? "border-warning" : "border-primary"}`}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h3 className={idEdicion ? "text-warning" : "text-primary"}>
                            {idEdicion ? "Editar Incidente" : "Nuevo Incidente"}
                        </h3>
                        {idEdicion && (
                            <Button variant="secondary" onClick={handleCancelarEdicion}>
                                Cancelar Edición
                            </Button>
                        )}
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo de Incidente</Form.Label>
                                    <Form.Select name="incidente" value={datos.incidente} onChange={handleChange}>
                                        <option value="choque">Choque</option>
                                        <option value="detencion">Detención</option>
                                        <option value="incendio">Incendio</option>
                                        <option value="incidente">Incidente</option>
                                        <option value="secuestro">Secuestro</option>
                                        <option value="vuelco">Vuelco</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Medio</Form.Label>
                                    <Form.Select name="medio" value={datos.medio} onChange={handleChange}>
                                        <option value="automovil">Automóvil</option>
                                        <option value="motocicleta">Motocicleta</option>
                                        <option value="cuatriciclo">Cuatriciclo</option>
                                        <option value="camion">Camión</option>
                                        <option value="bicicleta">Bicicleta</option>
                                        <option value="omnibus">Ómnibus</option>
                                        <option value="remolque">Remolque</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Vehículo</Form.Label>
                                    <Form.Control type="text" name="vehiculo" value={datos.vehiculo} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Patente</Form.Label>
                                    <Form.Control type="text" name="patente" value={datos.patente} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={1}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Heridos</Form.Label>
                                    <Form.Control type="number" name="heridos" value={datos.heridos} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={1}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fallecidos</Form.Label>
                                    <Form.Control type="number" name="fallecidos" value={datos.fallecidos} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control type="text" name="direccion" value={datos.direccion} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Lugar</Form.Label>
                                    <Form.Select name="lugar" value={datos.lugar} onChange={handleChange} >
                                        <option value="calle">Calle</option>
                                        <option value="esquina">Esquina</option>
                                        <option value="ruta">Ruta</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sector / Barrio</Form.Label>
                                    <Form.Select name="sector" value={datos.sector} onChange={handleChange} required>
                                        <option value="">Elija un Sector</option>
                                        <option value="Bahia Blanca.">Bahia Blanca</option>
                                        <option value="BNPB.">BNPB</option>
                                        <option value="Centro. Punta Alta.">Centro, Punta Alta</option>
                                        <option value="Ciudad Atlantida. Punta Alta.">Ciudad Atlantida Punta Alta</option>
                                        <option value="Nueva Bahia Blanca. Punta Alta.">Nueva Bahia Blanca Punta Alta</option>
                                        <option value="Pehuenco.">Pehuenco</option>
                                        <option value="RP 113.">RP 113</option>
                                        <option value="RN 229.">RN 229</option>
                                        <option value="RN 249.">RN 249</option>
                                        <option value="RN 3.">RN 3</option>
                                        <option value="Rural.">Rural</option>
                                        <option value="Villa Arias.">Villa Arias</option>
                                        <option value="Villa del Mar.">Villa del Mar</option>
                                        <option value="Villa Mora - Villa Laura. Punta Alta.">Villa Mora - Villa Laura, Punta Alta</option>
                                        <option value="Zona Norte. Punta Alta.">Zona Norte, Punta Alta</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hora</Form.Label>
                                    <Form.Control type="time" name="hora" value={datos.hora} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha</Form.Label>
                                    <Form.Control type="date" name="fecha" value={datos.fecha} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Coordenadas (Hace clic en el mapa)</Form.Label>
                                    <div className="d-flex gap-2 mb-2">
                                        <Form.Control
                                            type="number"
                                            step="any"
                                            name="lat"
                                            value={datos.lat}
                                            onChange={handleChange}
                                            placeholder="Latitud"
                                        />
                                        <Form.Control
                                            type="number"
                                            step="any"
                                            name="lng"
                                            value={datos.lng}
                                            onChange={handleChange}
                                            placeholder="Longitud"
                                        />
                                    </div>

                                    <MapContainer
                                        center={[-38.8762, -62.0686]}
                                        zoom={13}
                                        style={{ height: '300px', width: '100%', borderRadius: '5px' }}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        <ManejadorClics
                                            alHacerClic={handleMapaClick}
                                            posicionActual={marcadorActual}
                                        />
                                    </MapContainer>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>

                            <Col md={5}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control as="textarea" rows={1} name="descripcion" value={datos.descripcion} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Noticia (URL)</Form.Label>
                                    <Form.Control type="text" name="web" value={datos.web} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Label>Subir Imagen</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="imagen"
                                    accept="image/*"
                                    onChange={handleChange}
                                    required={!idEdicion}
                                />
                            </Col>
                        </Row>
                        <Button
                            type="submit"
                            className="w-100"
                            variant={idEdicion ? "warning" : "primary"}
                        >
                            {idEdicion ? "Guardar Cambios" : "Crear Incidente"}
                        </Button>
                    </Form>
                </div>
            </Row>
            <br />
            <Row className="mb-3">
                <Col md={12}>
                    <div className="card p-3 bg-light">
                        <h5>Filtros de Búsqueda</h5>
                        <Form className="row g-3 align-items-end" onSubmit={(e) => e.preventDefault()}>
                            <Col md={4}>
                                <Form.Label>Buscar (Incidente, Patente, Medio, Vehiculo, Dirección)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe para buscar..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Desde Fecha</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fechaDesde}
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Hasta Fecha</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fechaHasta}
                                    onChange={(e) => setFechaHasta(e.target.value)}
                                />
                            </Col>
                            <Col md={2}>
                                <Button variant="secondary" onClick={limpiarFiltros} className="w-100">
                                    Limpiar Filtros
                                </Button>
                            </Col>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Row>
                <h3 className="text-danger">Editar Incidentes Existentes</h3>
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th className="col-1">Incidente</th>
                                <th className='col-2'>Fecha</th>
                                <th className='col-1'>Patente</th>
                                <th className='col-1'>Medio</th>
                                <th className='col-2'>Vehiculo</th>
                                <th className="col-4">Dirección</th>
                                <th className="col-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidentesFiltrados.slice().reverse().map((inc) => (
                                <tr key={inc._id} className={idEdicion === inc._id ? "table-primary" : ""}>
                                    <td>{inc.incidente}</td>
                                    <td>
                                        {inc.fecha ? new Date(inc.fecha).toLocaleDateString('es-AR') : ""}
                                    </td>
                                    <td>{inc.patente}</td>
                                    <td>{inc.medio}</td>
                                    <td>{inc.vehiculo}</td>
                                    <td>{inc.direccion}</td>

                                    <td>
                                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleSeleccionarParaEditar(inc)}>
                                            Editar
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleEliminar(inc._id)}>
                                            X
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {incidentesFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-3">
                                        No hay incidentes que coincidan con los filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Row>
        </Container >
    );
};