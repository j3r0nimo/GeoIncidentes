// Testing contra la capa controladores

/* Controller tests (integration-lite)
 * Test HTTP responses with supertest
 * Mock the service layer
 * No real DB, no real files
 */

import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
} from "@jest/globals";
import request from "supertest";
import express from "express";

// 🔇 1️⃣ Silence logger BEFORE controller is imported
await jest.unstable_mockModule("../../src/utils/logger.js", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// 2️⃣ Mock del SERVICE, no del modelo
const mockService = {
  getIncidentesService: jest.fn(),
};

await jest.unstable_mockModule(
  "../../src/services/incidenteService.js",
  () => mockService,
);

let app;

beforeAll(async () => {
  // 3️⃣ Import controller AFTER mocks
  const controllerModule =
    await import("../../src/controllers/incidenteController.js");

  app = express();
  app.use(express.json());

  app.get("/incidentes", controllerModule.getIncidentes);
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("incidenteController", () => {
  it("GET /incidentes → 200 with data", async () => {
    mockService.getIncidentesService.mockResolvedValue({
      incidentes: [{ incidente: "Choque" }],
      total: 1,
      pages: 1,
    });

    const res = await request(app).get("/incidentes");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.meta.total).toBe(1);
    expect(mockService.getIncidentesService).toHaveBeenCalled();
  });
});
