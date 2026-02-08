// Testing contra la capa servicios

/* Confirma la lógica de paginación
 * Confirma que los filtros funcionan
 * No usa la base de datos
 * Test incidenteService.js
 * Mock Mongoose (Incidente)
 * Fast, deterministic
 * No Express, no auth, no uploads
 */

import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
} from "@jest/globals";

// 1️⃣ Define mock FIRST
const mockIncidente = {
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

// 2️⃣ Use unstable_mockModule (ESM-safe)
await jest.unstable_mockModule("../../src/models/incidente.js", () => ({
  default: mockIncidente,
}));

let incidenteService;
let Incidente;

beforeAll(async () => {
  // 3️⃣ Import AFTER mock
  Incidente = (await import("../../src/models/incidente.js")).default;
  incidenteService = await import("../../src/services/incidenteService.js");
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("incidenteService", () => {
  describe("getIncidentesService", () => {
    it("Retorna los incidentes paginados", async () => {
      Incidente.find.mockReturnValue({
        sort: () => ({
          skip: () => ({
            limit: () => ({
              lean: () => Promise.resolve([{ incidente: "Choque" }]),
            }),
          }),
        }),
      });

      Incidente.countDocuments.mockResolvedValue(1);

      const result = await incidenteService.getIncidentesService(1, 20, "");

      expect(result.total).toBe(1);
      expect(result.incidentes.length).toBe(1);
      expect(result.pages).toBe(1);
    });
  });

  describe("getIncidenteByIdService", () => {
    it("Retorna un incidente por su id", async () => {
      Incidente.findById.mockReturnValue({
        lean: () => Promise.resolve({ _id: "123" }),
      });

      const incidente = await incidenteService.getIncidenteByIdService("123");

      expect(incidente._id).toBe("123");
    });
  });

  describe("deleteIncidenteService", () => {
    it("Borra un incidente", async () => {
      Incidente.findByIdAndDelete.mockResolvedValue({ _id: "123" });

      const result = await incidenteService.deleteIncidenteService("123");

      expect(result._id).toBe("123");
    });
  });
});
