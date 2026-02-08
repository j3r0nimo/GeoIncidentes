const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_KEY = import.meta.env.VITE_API_KEY;

// Lista de incidentes, de a 20 valores
export async function FetchIncidentes(page = 1, keyword = "", limit = 20) {
  const res = await fetch(
    `${BASE_URL}/api/incidentes?page=${page}&limit=${limit}&keyword=${encodeURIComponent(keyword)}`,
    {
      headers: {
        'x-api-key': API_KEY
      }
    }
  );
  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
}

// todos los incidentes, hasta el valor de 2000
export async function FetchMapaJitterData() {
  const res = await fetch(`${BASE_URL}/api/incidentes/mapa/jitter`, {
    headers: {
      'x-api-key': API_KEY
    }
  });
  if (!res.ok) throw new Error("Failed to fetch jitter map data");
  return res.json();
}

// todos los incidentes, hasta el valor de 2000
export async function FetchMapaCluster() {
  const res = await fetch(`${BASE_URL}/api/incidentes/mapa/cluster`, {
    headers: {
      'x-api-key': API_KEY
    }
  });
  if (!res.ok) throw new Error("Failed to fetch cluster map");
  return res.json();
}

export async function FetchIncidenteById(id) {
  const res = await fetch(`${BASE_URL}/api/incidentes/${id}`, {
    headers: {
      'x-api-key': API_KEY
    }
  });
  if (!res.ok) throw new Error("Failed to fetch incident by id");
  return res.json();
}

// Llamado a la API para producir el pdf, a partir del panel de filtros
export async function FetchIncidentesPdfReport(filters = {}) {
  const params = new URLSearchParams();

  // same logic: only send filters if they are meaningful
  if (filters.desde) params.set("desde", filters.desde);
  if (filters.hasta) params.set("hasta", filters.hasta);

  if (filters.keyword?.trim()) params.set("keyword", filters.keyword.trim());

  if (filters.tipo && filters.tipo !== "todos")
    params.set("tipo", filters.tipo);
  if (filters.medio && filters.medio !== "todos")
    params.set("medio", filters.medio);
  if (filters.sector && filters.sector !== "todos")
    params.set("sector", filters.sector);

  if (filters.periodo) params.set("periodo", filters.periodo);
  if (filters.fallecidos && filters.fallecidos !== "todos")
    params.set("fallecidos", filters.fallecidos);

  const res = await fetch(
    `${BASE_URL}/api/reports/incidentes/pdf?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/pdf",
        'x-api-key': API_KEY
      },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch PDF report");

  // IMPORTANT: return binary
  return res.blob();
}

// Llamado a la API para producir el XLSX, a partir del panel de filtros

export async function FetchIncidentesXlsxReport(filters = {}) {
  const params = new URLSearchParams();

  // IMPORTANT: only send params if they have value (avoid empty filters)
  if (filters.keyword?.trim()) params.set("keyword", filters.keyword.trim());
  if (filters.desde) params.set("desde", filters.desde);
  if (filters.hasta) params.set("hasta", filters.hasta);

  if (filters.tipo && filters.tipo !== "todos")
    params.set("tipo", filters.tipo);
  if (filters.medio && filters.medio !== "todos")
    params.set("medio", filters.medio);

  if (filters.periodo) params.set("periodo", filters.periodo);
  if (filters.fallecidos && filters.fallecidos !== "todos")
    params.set("fallecidos", filters.fallecidos);

  if (filters.sector && filters.sector !== "todos")
    params.set("sector", filters.sector);

  const res = await fetch(
    `${BASE_URL}/api/reports/incidentes/xlsx?${params.toString()}`, {
    headers: {
      'x-api-key': API_KEY
    }
  }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch XLSX report");
  }

  // XLSX is binary
  return res.blob();
}