/* connects DB
 * listens (runtime only)
 * This file is NEVER imported by tests
 */

import app from "./app.js";
import connectDB from "../../src/db/db.js"; // Conexión a MongoDB
import { PORT } from "../../config/env.js"; // Puerto backend

// inicio del servidor
(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(
        `Skynet is fully operational at http://localhost:${PORT}/api/incidentes`,
      );
    });
  } catch (error) {
    console.error("Skynet no permite la conexión...", error);
    process.exit(1);
  }
})();
