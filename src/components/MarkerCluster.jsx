import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useNavigate } from "react-router-dom";

export function MarkerCluster({ incidentes }) {
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    window.irAIncidente = (id) => {
      navigate(`/incidentes/${id}`);
    };
    return () => {
      delete window.irAIncidente;
    };
  }, [navigate]);

  useEffect(() => {
    if (!map || !incidentes.length) return;

    const colorByTipo = {
      Accidente: "green",
      Choque: "red",
      Detencion: "yellow",
      Incendio: "purple",
      Secuestro: "orange",
      Vuelco: "blue",
    };

    function iconoPorTipo(tipo) {
      const color = colorByTipo[tipo] || "gray";

      return L.divIcon({
        className: "custom-div-icon",
        html: `
      <div style="
        width:20px;
        height:20px;
        border-radius:50%;
        border:2px solid white;
        box-shadow:0 0 4px rgba(0,0,0,0.4);
        background:${color};
      "></div>
    `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
      });
    }


    const markerCluster = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      spiderfyOnEveryZoom: true,
      disableClusteringAtZoom: 20,
      spiderfyDistanceMultiplier: 5,
      zoomToBoundsOnClick: true
    });


    incidentes.forEach((incidente) => {
      if (incidente.posicion?.lat && incidente.posicion?.lng) {
        const marker = L.marker([incidente.posicion.lat, incidente.posicion.lng], {
          icon: iconoPorTipo(incidente.incidente),
        });
        marker.bindPopup(`
          <strong>${incidente.incidente}</strong>
          <button class="btn btn-info btn-sm rounded-circle" style="margin-top: 5px; rounded-circle" onclick="window.irAIncidente('${incidente._id}')">info</button><br/>
          ${incidente.direccion}<br/>
          ${incidente.fecha?.substring(0, 10) || ""} ${incidente.hora}<br/>
          ${incidente.web ? `<a href="${incidente.web}" target="_blank">Noticia</a><br/><br/>` : ""}
          ${incidente.imagenUrl ? `<a href="${incidente.imagenUrl}" target="_blank"><img src="${incidente.imagenUrl}" alt="Imagen" width="100"></a>` : ""}
        `);
        markerCluster.addLayer(marker);
      }
    });

    map.addLayer(markerCluster);

    return () => {
      map.removeLayer(markerCluster);
    };
  }, [map, incidentes]);

  return null;
}
