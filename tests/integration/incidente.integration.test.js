// Testing integral

/* No hay mocking, se usa una Base de datos real
 * No hay mocking de los modelos
 * Se usan los archivos de rutas, middleware, mongoDB
 * Se usan request reales via HTTP
 * Se emplea un .env separado: .env.test
 */

/* Este archivo va a :
 * spin up the app
 * connect to Mongo
 * hit real endpoints
 * clean DB after each test
 */

/* Typical targets:
 * POST /login → returns JWT
 * GET /incidentes → returns paginated data
 * GET /incidentes/:id → 404 vs 200
 * Auth-protected routes → 401 without token, 200 with token
 * Validation errors → 400
 * Basically: API behavior, not implementation
 */

import request from "supertest";
import app from "../../src/app.js";
import connectDB, { disconnectDB } from "../../src/db/db.js";
import Incidente from "../../src/models/incidente.js";
import { validIncidente } from "../fixtures/incidente.valid.js";
import { jest } from "@jest/globals";
import { logger } from "../../src/utils/logger.js";

// silence info logs during tests
jest.spyOn(logger, "info").mockImplementation(() => {});
jest.spyOn(logger, "warn").mockImplementation(() => {});
jest.spyOn(logger, "error").mockImplementation(() => {});

beforeAll(async () => {
  await connectDB();
  await Incidente.create(validIncidente);
});

afterEach(async () => {
  await Incidente.deleteMany({});
});

afterAll(async () => {
  await disconnectDB();
});

/* =============================
   TEST: SE SOLICITAN INCIDENTES
   ========================== */

describe("Incidente API - integration", () => {
  it("GET /api/incidentes retorna los incidentes almacenados", async () => {
    const res = await request(app)
      .get("/api/incidentes")
      .set("x-api-key", process.env.API_KEY);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].incidente).toBe(validIncidente.incidente);
  });

  /* =============================
     TEST: API KEY inválida o ausente
     ========================== */

  it("GET /api/incidentes falla con API KEY inválida o ausente", async () => {
    // Missing API key
    let res = await request(app).get("/api/incidentes");
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/API key required/i);

    // Invalid API key
    res = await request(app)
      .get("/api/incidentes")
      .set("x-api-key", "invalid_key");
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/API key required/i);
  });
});
