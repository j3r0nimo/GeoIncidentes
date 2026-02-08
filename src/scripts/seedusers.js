import connectDB, { disconnectDB } from "../db/db.js";
import User from "../models/users.js";
import { hashPassword } from "../utils/password.js";

const runUsuario = async () => {
  await connectDB();

  const username = "propietario".toLowerCase();

  const exists = await User.findOne({ username });
  if (exists) {
    console.log("El administrador ya existe");
    await disconnectDB();
    process.exit(0);
  }

  const passwordHash = await hashPassword("SuperSecret138");

  const user = await User.create({
    username: "propietario",
    passwordHash,
    role: "admin",
  });

  console.log("Admin created:", {
    username: user.username,
    role: user.role,
  });
  await disconnectDB();
  process.exit(0);
};

runUsuario();
