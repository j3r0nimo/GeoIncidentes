import { useEffect, useMemo, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Badge,
    Spinner,
    Alert,
} from "react-bootstrap";

import { FetchMapaJitterData } from "../api/incidentesApi";
import { calcularKPIs } from "../utils/kpiIncidentes";
import "../styles/inicio.css";

export default function Inicio() {
    const [loading, setLoading] = useState(true);
    const [incidentes, setIncidentes] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);
                setError("");

                const res = await FetchMapaJitterData();
                const lista = res?.data || [];

                if (alive) setIncidentes(lista);
            } catch (e) {
                if (alive) setError(e.message || "Error cargando datos del mapa");
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => {
            alive = false;
        };
    }, []);

    const kpis = useMemo(() => calcularKPIs(incidentes), [incidentes]);

    const stats = [
        {
            label: "Incidentes (30 días)",
            value: loading ? null : kpis.incidentesUltimoMes,
            hint: "Últimos 30 días",
        },
        {
            label: "Zona con más choques (desde 01/01/2022)",
            value: loading ? null : kpis.zonaMasChoques,
            hint: loading ? "" : `(${kpis.choquesEnZonaMasChoques})`,
        },
        {
            label: "Zona con más secuestros (desde 01/01/2022)",
            value: loading ? null : kpis.zonaMasSecuestros,
            hint: loading ? "" : `(${kpis.secuestrosEnZonaMasSecuestros})`,
        },
    ];

    return (
        <Container className="py-4">
            <Card className="shadow-sm border-0 rounded-4 mb-4">
                <Card.Body className="p-4">
                    <h1 className="display-6 fw-bold mb-3">
                        Observatorio de Incidentes Viales - Partido de Coronel Rosales
                    </h1>

                    <p className="lead mb-3">
                        Este mapa centraliza reportes de incidentes, clasificándolos como:{" "}
                        <span className="fw-semibold">
                            choque, detención, incendio, incidente, secuestro y vuelco
                        </span>
                        .
                    </p>

                    <div className="text-muted">
                        Fuentes de datos:{" "}
                        <a
                            href="https://elrosalenio.com.ar/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-decoration-none"
                        >
                            https://elrosalenio.com.ar/
                        </a>
                    </div>

                    <div className="text-muted mt-2">
                        Cobertura de datos: <strong>desde 01/01/2022</strong> hasta la
                        actualidad.
                    </div>
                </Card.Body>
            </Card>

            {error && (
                <Alert variant="danger" className="rounded-4">
                    ⚠ {error}
                </Alert>
            )}

            <Row className="g-3 mb-4">
                {stats.map((s, idx) => (
                    <Col key={idx} xs={12} md={4}>
                        <Card className="h-100 shadow-sm rounded-4 kpi-card">
                            <Card.Body className="p-4">
                                <div className="text-muted fw-semibold fs-6">{s.label}</div>

                                <div className="display-6 fw-bold my-2 kpi-value">
                                    {loading ? <Spinner animation="border" size="sm" /> : s.value}
                                </div>

                                <div className="text-muted fw-semibold fs-6">{s.hint}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="g-3">
                <Col xs={12} md={4}>
                    <Card className="h-100 shadow-sm rounded-4 kpi-card">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-2">¿Qué es un incidente?</h5>
                            <p className="text-muted mb-0">
                                Un incidente vial es un evento reportado en la vía pública que
                                afecta la circulación o seguridad (choque, vuelco, incendio,
                                etc.). Este sistema busca centralizar y visualizar los reportes.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} md={4}>
                    <Card className="h-100 shadow-sm rounded-4 kpi-card">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-2">Clasificación</h5>
                            <p className="text-muted mb-0">
                                Los reportes se agrupan en categorías para facilitar análisis:
                                choque, detención, incendio, incidente, secuestro y vuelco.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} md={4}>
                    <Card className="h-100 shadow-sm rounded-4 kpi-card">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-2">Objetivo del mapa</h5>
                            <p className="text-muted mb-0">
                                Visualizar rápidamente “qué pasa y dónde pasa”. Esto permite
                                detectar zonas críticas y orientar acciones preventivas.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}