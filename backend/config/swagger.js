// SWAGGER: Documentacion de la API

import { fileURLToPath } from "url";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import { BASE_URL } from "./env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Incidentes Viales Coronel Rosales",
      version: "1.0.0",
      description: `
      Elementos de seguridad de la API:
      - API Key (requerido en todas las rutas, ver email)
      - JWT Bearer token (requerido para POST, PUT, DELETE)

      Authentication flow:
      1. Se debe poseer el API Key (requerido en todas las rutas, ver email)
      2. Ingreso inicial mediante: AUTH POST /api/auth/login
      3. Copiar el JWT token
      4. Para incidentes POST, PUT, DELETE: click Authorize → BearerAuth → pegar "Bearer <token>"
      5. ⚠️ JWT tokens expira luego de 30 minutos. Re-autenticar si se reciben 401 responses.
      6. ⚠️ Importante: Cuando ingrese el token, pegue SOLAMENTE el token. NO incluya el prefijo Bearer
      `,
    },
    servers: [
      {
        url: BASE_URL,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: { type: "apiKey", in: "header", name: "x-api-key" },
        BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        Incidente: {
          type: "object",
          required: [
            "_id",
            "fecha",
            "hora",
            "incidente",
            "medio",
            "posicion",
            "descripcion",
            "web",
          ],
          properties: {
            _id: { type: "string", example: "698464d3de88705d4eabea70" },
            fecha: { type: "string", format: "date", example: "2022-01-06" },
            hora: { type: "string", example: "20:00" },
            incidente: { type: "string", example: "choque" },
            medio: { type: "string", example: "motocicleta" },
            vehiculo: { type: "string", example: "Ciclomotor" },
            patente: { type: "string", example: "JJJ999" },
            heridos: { type: "integer", example: 2 },
            fallecidos: { type: "integer", example: 0 },
            direccion: { type: "string", example: "Brown 390" },
            sector: { type: "string", example: "Centro. Punta Alta." },
            lugar: { type: "string", example: "calle" },
            posicion: {
              type: "object",
              required: ["lat", "lng"],
              properties: {
                lat: { type: "number", example: -38.880859 },
                lng: { type: "number", example: -62.07568 },
              },
            },
            descripcion: { type: "string", example: "Choque entre motos." },
            web: { type: "string", example: "https://elrosalenio.com.ar/..." },
            imagenUrl: {
              type: "string",
              example: "http://localhost:3000/uploads/img/1.jpg",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },

    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "../src/routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
