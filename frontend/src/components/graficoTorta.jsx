import { useState, useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Form } from "react-bootstrap";
import { getTipoColor } from "../utils/colors";
import { estaEnRango } from "../utils/timeUtils";

export default function GraficoTorta({ incidentes }) {
    const [agrupacion, setAgrupacion] = useState("tipo");

    const datosAgrupados = useMemo(() => {
        if (!incidentes || incidentes.length === 0) return {};

        return incidentes.reduce((acc, inc) => {
            let clave = "";

            switch (agrupacion) {
                case "tipo":
                    clave = inc.incidente || "Desconocido";
                    break;
                case "medio":
                    clave = inc.medio || "Desconocido";
                    break;
                case "sector":
                    clave = inc.sector || "Desconocido";
                    break;
                case "fallecidos":
                    clave = inc.fallecidos > 0 ? "Con fallecidos" : "Sin fallecidos";
                    break;
                case "hora":
                    const hora = inc.hora || "00:00";

                    if (estaEnRango(hora, "07:00", "14:00")) {
                        clave = "7:00-14:00";
                    } else if (estaEnRango(hora, "14:01", "21:00")) {
                        clave = "14:01-21:00";
                    } else if (estaEnRango(hora, "21:01", "06:59")) {
                        clave = "21:01-06:59";
                    } else {
                        clave = "Sin horario";
                    }
                    break;
                default:
                    clave = "Otros";
            }

            acc[clave] = (acc[clave] || 0) + 1;
            return acc;
        }, {});
    }, [incidentes, agrupacion]);

    const labels = Object.keys(datosAgrupados);
    const values = Object.values(datosAgrupados);

    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor:
                    agrupacion === "tipo"
                        ? labels.map((l) => getTipoColor(l))
                        : labels.map(() =>
                            `hsl(${Math.random() * 360}, 70%, 60%)`
                        ),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.raw;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div style={{ padding: "15px" }}>
            <h5>Distribución</h5>

            <Form.Select
                value={agrupacion}
                onChange={(e) => setAgrupacion(e.target.value)}
                className="mb-3"
            >
                <option value="tipo">Por hecho</option>
                <option value="medio">Por medio</option>
                <option value="sector">Por sector</option>
                <option value="fallecidos">Por fallecidos</option>
                <option value="hora">Por horario</option>
            </Form.Select>

            {values.length > 0 ? (
                <Pie data={data} options={options} />
            ) : (
                <p>No hay datos para mostrar</p>
            )}
        </div>
    );
}
