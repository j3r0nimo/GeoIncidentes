// Incidente ficticio estandar para el test de integración

// La imagen no necesita existir, mongoose solo verifica si hay un string
// no verifica si el archivo existe, si lo puede localizar o si es una imagen

export const validIncidente = {
  incidente: "choque",
  medio: "automovil",
  vehiculo: "Ferrari 488 Pista",
  fecha: "2026-02-01",
  hora: "11:30",
  direccion: "Ruta Nacional 229, Km 18",
  sector: "RN 229.",
  lugar: "ruta",
  posicion: {
    lat: -38.792417,
    lng: -62.11255,
  },
  descripcion: "Test incidente",
  imagen: "fake-image-for-tests.jpg",
  web: "https://noticias.autocosmos.com.ar/2022/02/17/otra-ferrari-al-desarmadero",
  fallecidos: 0,
  heridos: 1,
};
