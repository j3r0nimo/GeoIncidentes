// función para el panel de filtros
// contribuye a separar los incidentes en tres grupos

/**
 * Checks if a time string (HH:MM) is within a start-end range (HH:MM)
 * Handles ranges that cross midnight.
 *
 * @param {string} horaStr - time to check, format "HH:MM"
 * @param {string} inicio - start time, format "HH:MM"
 * @param {string} fin - end time, format "HH:MM"
 * @returns {boolean} - true if horaStr is within the range
 */
export function estaEnRango(horaStr, inicio, fin) {
  const [h, m] = horaStr.split(":").map(Number);
  const horaMinutos = h * 60 + m;

  const [hi, mi] = inicio.split(":").map(Number);
  const inicioMinutos = hi * 60 + mi;

  const [hf, mf] = fin.split(":").map(Number);
  const finMinutos = hf * 60 + mf;

  if (inicioMinutos <= finMinutos) {
    return horaMinutos >= inicioMinutos && horaMinutos <= finMinutos;
  } else {
    // crosses midnight
    return horaMinutos >= inicioMinutos || horaMinutos <= finMinutos;
  }
}
