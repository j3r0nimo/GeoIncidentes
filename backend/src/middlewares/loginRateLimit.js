/* LIMITACIÓN DE TASA (RATE LIMITING)
 * Rate limiting = puerta de control en la entrada
 * Servicio de autenticación = cerraduras dentro del sistema
 * El rate limiting protege los puntos de entrada, no la lógica de negocio.
 * Y el login es el punto de entrada #1 que debe estar limitado.
 * 10 minutos → alineado con el tiempo de bloqueo de cuenta
 * 10 intentos → experiencia de usuario razonable, protección sólida
 * Basado en IP → detiene ataques masivos antes de llegar a la DB/bcrypt
 * Mensaje en JSON → respuestas de API consistentes
 */

import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      error: "Demasiados intentos. Intente más tarde.",
    });
  },
});
