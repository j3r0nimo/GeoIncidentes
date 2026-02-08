/* builds and exports the Express app */

// Core imports
import express from "express"; // framework
import { fileURLToPath } from "url"; // para servir las imágenes
import path from "path"; // para servir las imágenes
import helmet from "helmet"; // blocks browser-side attacks
import mongoSanitize from "express-mongo-sanitize"; // avoids NoSQL-injection attempts

// para atender los llamados desde el frontend
// loads the CORS middleware
import cors from "cors";

// Config & DB imports
import { FRONTEND_URL } from "../config/env.js"; // Puerto frontend

// Swagger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";

// Routes & Middlewares imports
import incidentesRutas from "./routes/incidenteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { requireApiKey } from "./middlewares/requireApiKey.js";

// para servir las imágenes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app: instancia de express
const app = express();

/* =======================
   Global middlewares
   ======================= */

// sets secure HTTP response headers.
app.use(helmet());

// enable CORS before routes
// tells your backend to allow requests only from your React dev server
app.use(cors({ origin: FRONTEND_URL }));

// app: para servir json content
app.use(express.json());

// removes MongoDB operators from user input (Protección NoSQL Injection)
app.use((req, res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body, {
      replaceWith: "_",
    });
  }
  next();
});

// app: Helmet allows embeddable cross-origin (what Leaflet needs),
// to images on this folder ony. Security restriction
app.use("/uploads/img", (req, res, next) => {
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// app: para servir las imágenes
app.use(
  "/uploads/img",
  express.static(path.join(__dirname, "..", "uploads/img")),
);

// Swagger endpoint
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* =======================
   Routes
   ======================= */

// 🔒 API KEY required for ALL API routes
app.use("/api", requireApiKey);

// rutas
app.use("/api/incidentes", incidentesRutas);
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

// Ruta para la raiz (root)
app.get("/", (req, res) => {
  res.send("Skynet is fully operational.");
});

/* =======================
   Error handling
   ======================= */

// Middleware Error 404
app.use(notFound);

// Middleware para administración centralizada de errores
// DEBE SER el ULTIMO middleware
// DESPUES de las rutas, justo antes del inicio del servidor
app.use(errorHandler);

/* =======================
   EXPORT (critical)
   ======================= */

/* If a file exports app, it must not:
 * connect to DB
 * listen on a port
 * start background jobs
 */

export default app;
