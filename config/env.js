import dotenv from "dotenv";

// uso de use path & fileURLToPath
// para garantizar que siempre se localizará el .env
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Si hacemos test, usamos .env.test, que usa una Base de datos diferente
const envFile = process.env.NODE_ENV === "test" ? "../.env.test" : "../.env";

// Cargar .env una sola vez
// Excepto que se trate del testing
dotenv.config({
  path:
    process.env.NODE_ENV === "test"
      ? path.resolve(__dirname, "../.env.test")
      : path.resolve(__dirname, "../.env"),
  quiet: process.env.NODE_ENV === "test", // <- hides logs for tests
});

// DEBUG LOGS
/*
console.log("⚙️ NODE_ENV =", process.env.NODE_ENV);
console.log("⚙️ MONGO_URI =", process.env.MONGO_URI);
console.log("⚙️ PORT =", process.env.PORT);
console.log("⚙️ API_KEY =", process.env.API_KEY);
console.log("⚙️ JWT_SECRET =", process.env.JWT_SECRET);
*/

// Exportar las variables
export const PORT = process.env.PORT;
export const MONGO_URI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;
export const BASE_URL = process.env.BASE_URL;
export const NODE_ENV = process.env.NODE_ENV;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const MAP_LIMIT = Math.max(1, Number(process.env.MAP_LIMIT ?? 3000));
