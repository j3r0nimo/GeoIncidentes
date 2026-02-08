// jest.config.js
// Archivo de configuracion de jest
// Jest es un potente framework de pruebas
// Supertest simplifica las pruebas de solicitudes HTTP

export default {
  testEnvironment: "node",
  clearMocks: true,
  transform: {}, // 👈 IMPORTANT: disable Babel transforms
};
