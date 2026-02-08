/* REPORTES - rutas */

import express from "express";
import { getIncidentesPdfReport } from "../controllers/reportController.js";
import { getIncidentesXlsxReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/incidentes/pdf", getIncidentesPdfReport);
router.get("/incidentes/xlsx", getIncidentesXlsxReport);

/* =======================
   SWAGGER GET PDF REPORT
   ======================= */

/**
 * @swagger
 * /api/reports/incidentes/pdf:
 *   get:
 *     summary: Download PDF incidents report
 *     description: >
 *       Genera y descarga un reporte en PDF de todos los incidentes registrados.
 *       Requiere API Key.
 *     tags: [Reportes]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: API Key inválido o ausente
 *       500:
 *         description: Error interno del servidor
 */

/* =======================
   SWAGGER GET XLSX REPORT
   ======================= */

/**
 * @swagger
 * /api/reports/incidentes/xlsx:
 *   get:
 *     summary: Download XLSX incidents report
 *     description: >
 *       Genera y descarga un archivo XLSX con todos los incidentes registrados.
 *       Requiere API Key.
 *     tags: [Reportes]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: XLSX generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: API Key inválido o ausente
 *       500:
 *         description: Error interno del servidor
 */

export default router;
