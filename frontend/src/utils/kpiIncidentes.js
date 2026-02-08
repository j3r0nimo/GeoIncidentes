export function calcularKPIs(incidentes = []) {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - 30);

  const normalize = (v) =>
    String(v || "")
      .toLowerCase()
      .trim();

  const incidentesUltimoMes = incidentes.reduce((acc, i) => {
    const fecha = new Date(i?.fecha);
    if (!isNaN(fecha) && fecha >= cutoff) return acc + 1;
    return acc;
  }, 0);

  const contarSectores = (tipo) => {
    const counts = {};

    for (const i of incidentes) {
      if (!i) continue;

      const tipoIncidente = normalize(i.incidente);
      if (tipoIncidente !== tipo) continue;

      const sector = i.sector || "Sin sector";
      counts[sector] = (counts[sector] || 0) + 1;
    }

    return counts;
  };

  const obtenerTopSector = (counts) => {
    let topSector = "—";
    let topCount = 0;

    for (const [sector, count] of Object.entries(counts)) {
      if (count > topCount) {
        topSector = sector;
        topCount = count;
      }
    }

    return { topSector, topCount };
  };

  const choquesTop = obtenerTopSector(contarSectores("choque"));
  const secuestrosTop = obtenerTopSector(contarSectores("secuestro"));

  return {
    incidentesUltimoMes,

    zonaMasChoques: choquesTop.topSector,
    choquesEnZonaMasChoques: choquesTop.topCount,

    zonaMasSecuestros: secuestrosTop.topSector,
    secuestrosEnZonaMasSecuestros: secuestrosTop.topCount,
  };
}