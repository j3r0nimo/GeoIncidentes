import mongoose from "mongoose";
import { MONGO_URI } from "../../config/env.js";
import { NODE_ENV } from "../../config/env.js";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI no está definida en las variables de entorno");
    }

    // 🔒 HARD SAFETY GUARD (never remove this)
    // Para que no ejecute test de integracion contra la base de datos real
    if (NODE_ENV === "test" && !MONGO_URI.toLowerCase().includes("test")) {
      throw new Error("❌ Refusing to run tests against a NON-test database");
    }    

    await mongoose.connect(MONGO_URI);
    // console.log("Sistema conectado a MongoDB");
    return mongoose.connection;
  } catch (err) {
    // console.error("Error de conección a MongoDB", err);
    process.exit(1);
  }
};

/*
 * Disconnect from MongoDB (safe for scripts)
 */

export const disconnectDB = async () => {
  // 0 = disconnected
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    // console.log("MongoDB desconectado");
  }
};

export default connectDB;
