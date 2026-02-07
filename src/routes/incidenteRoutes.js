/* REPORTES - Incidentes */

import express from "express";
import * as incidenteControlador from "../controllers/incidenteController.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { uploadImage } from "../middlewares/uploadImage.js";
import { requireAuth } from "../middlewares/requireAuth.js"; // 1️⃣ identity (siempre primero)
import { requireRole } from "../middlewares/requireRole.js";
import { parsePosicion } from "../middlewares/positionConvert.js";

const router = express.Router();

// API endpoints

router.get(
   "/:id",
   validateObjectId("id"),
   incidenteControlador.getIncidenteById,
);

router.get("/mapa/jitter", incidenteControlador.getMapaJitterData);
router.get("/mapa/cluster", incidenteControlador.getMapaClusterData);

/* =======================
   SWAGGER GET INCIDENTES
   ======================= */

/**
 * @swagger
 * /api/incidentes:
 *   get:
 *     summary: Get all incidentes
 *     tags: [Incidentes]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of incidentes
 *       401:
 *         description: Missing or invalid API key
 */

/* =======================
   SWAGGER GET INCIDENTE:id
   ======================= */

/**
 * @swagger
 * /api/incidentes/{id}:
 *   get:
 *     summary: Get incidente by ID
 *     tags: [Incidentes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 65c3f8a2e9c1a23b4f9a0d12
 *         description: MongoDB ObjectId of the incidente
 *     responses:
 *       200:
 *         description: Incidente found
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Incidente not found
 */

/* =======================
   SWAGGER GET JITTER MAP
   ======================= */

/**
 * @swagger
 * /api/incidentes/mapa/jitter:
 *   get:
 *     summary: Get jitter map data for incidentes
 *     tags: [Incidentes]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Jitter map data retrieved successfully
 *       401:
 *         description: Missing or invalid API key
 */

/* =======================
   SWAGGER GET CLUSTER MAP
   ======================= */

/**
 * @swagger
 * /api/incidentes/mapa/cluster:
 *   get:
 *     summary: Get cluster map data for incidentes
 *     tags: [Incidentes]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Cluster map data retrieved successfully
 *       401:
 *         description: Missing or invalid API key
 */

/* =======================
   SWAGGER PUT
   ======================= */

/**
 * @swagger
 * /api/incidentes/{id}:
 *   put:
 *     summary: Update an incidente
 *     description: >
 *       Updates an existing incidente.
 *       Requires API Key and JWT Bearer token.
 *       Allowed roles: user, admin.
 *     tags: [Incidentes]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the incidente
 *         schema:
 *           type: string
 *           example: 65c3f8a2e9c1a23b4f9a0d12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update (all optional)
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: 2022-01-06
 *               hora:
 *                 type: string
 *                 example: "20:00"
 *               incidente:
 *                 type: string
 *                 example: choque
 *               medio:
 *                 type: string
 *                 example: motocicleta
 *               vehiculo:
 *                 type: string
 *                 example: Ciclomotor
 *               patente:
 *                 type: string
 *                 example: JJJ999
 *               heridos:
 *                 type: integer
 *                 example: 2
 *               fallecidos:
 *                 type: integer
 *                 example: 0
 *               direccion:
 *                 type: string
 *                 example: Brown 390
 *               sector:
 *                 type: string
 *                 example: Centro. Punta Alta.
 *               lugar:
 *                 type: string
 *                 example: calle
 *               posicion:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: -38.880859
 *                   lng:
 *                     type: number
 *                     example: -62.07568
 *               descripcion:
 *                 type: string
 *                 example: Choque entre motos.
 *               web:
 *                 type: string
 *                 example: https://elrosalenio.com.ar/noticias/06/01/2022/10034816/siniestro-vial-entre-motos-deja-dos-heridos-leves
 *     responses:
 *       200:
 *        description: Incidente updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                mensaje:
 *                  type: string
 *                  example: Incidente actualizado correctamente
 *                incidente:
 *                  $ref: '#/components/schemas/Incidente'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid token / API key)
 *       403:
 *         description: Forbidden (insufficient role)
 *       404:
 *         description: Incidente not found
 */

/* =======================
   SWAGGER DELETE
   ======================= */

/**
 * @swagger
 * /api/incidentes/{id}:
 *   delete:
 *     summary: Delete an incidente
 *     description: >
 *       Deletes an existing incidente.
 *       Requires API Key and JWT Bearer token.
 *       Allowed role: admin only.
 *     tags: [Incidentes]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the incidente to delete
 *         schema:
 *           type: string
 *           example: 698464d3de88705d4eabea70
 *     responses:
 *       200:
 *         description: Incidente deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Incidente correctamente eliminado."
 *                 id:
 *                   type: string
 *                   example: "698464d3de88705d4eabea70"
 *                 tipo:
 *                   type: string
 *                   example: "choque"
 *                 medio:
 *                   type: string
 *                   example: "motocicleta"
 *                 vehiculo:
 *                   type: string
 *                   example: "Ciclomotor"
 *                 patente:
 *                   type: string
 *                   example: "JJJ999"
 *       401:
 *         description: Unauthorized (missing or invalid token / API key)
 *       403:
 *         description: Forbidden (insufficient role)
 *       404:
 *         description: Incidente not found
 *       500:
 *         description: Internal server error
 */

/* =======================
   SWAGGER POST
   ======================= */

/**
 * @swagger
 * /api/incidentes:
 *   post:
 *     summary: Create a new incidente
 *     description: >
 *       Creates a new incidente.
 *       Requires API Key and JWT Bearer token.
 *       Allowed roles: user, admin.
 *     tags: [Incidentes]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fecha
 *               - hora
 *               - incidente
 *               - medio
 *               - vehiculo
 *               - patente
 *               - heridos
 *               - fallecidos
 *               - direccion
 *               - sector
 *               - lugar
 *               - posicion.lat
 *               - posicion.lng
 *               - descripcion
 *               - web
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: 2022-01-06
 *               hora:
 *                 type: string
 *                 example: "20:00"
 *               incidente:
 *                 type: string
 *                 example: choque
 *               medio:
 *                 type: string
 *                 example: motocicleta
 *               vehiculo:
 *                 type: string
 *                 example: Ciclomotor
 *               patente:
 *                 type: string
 *                 example: JJJ999
 *               heridos:
 *                 type: integer
 *                 example: 2
 *               fallecidos:
 *                 type: integer
 *                 example: 0
 *               direccion:
 *                 type: string
 *                 example: Brown 390
 *               sector:
 *                 type: string
 *                 example: Centro. Punta Alta.
 *               lugar:
 *                 type: string
 *                 example: calle
 *               posicion.lat:
 *                 type: number
 *                 example: -38.880859
 *               posicion.lng:
 *                 type: number
 *                 example: -62.07568
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file of the incidente
 *               descripcion:
 *                 type: string
 *                 example: Choque entre motos.
 *               web:
 *                 type: string
 *                 example: https://elrosalenio.com.ar/noticias/06/01/2022/10034816/siniestro-vial-entre-motos-deja-dos-heridos-leves
 *     responses:
 *       201:
 *         description: Incidente created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Incidente creado correctamente
 *                 incidente:
 *                   $ref: '#/components/schemas/Incidente'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid token / API key)
 *       403:
 *         description: Forbidden (insufficient role)
 */

export default router;
