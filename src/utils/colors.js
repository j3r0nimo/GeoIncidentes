// colors.js

// Color mapping for "tipo"
export function getTipoColor(tipo) {
  const colors = {
    choque: "#FF0000",     // red
    secuestro: "#FFA500",  // orange
    vuelco: "#0000FF",     // blue
    incendio: "#800080",   // purple
    incidente: "#008000",  // green
    detencion: "#FFFF00",  // yellow
  };

  return colors[tipo?.toLowerCase()] || "#808080"; // default gray
}

// Color mapping for "medio"
export function getMedioColor(medio) {
  const colors = {
    automovil: "#1f77b4",
    bicicleta: "#2ca02c",
    camion: "#d62728",
    cuatriciclo: "#ebce0e",
    motocicleta: "#ff7f0e",
    omnibus: "#9467bd",
    remolque: "#8c564b",
  };

  return colors[medio?.toLowerCase()] || "#808080"; // default gray
}