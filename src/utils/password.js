// genera el hash de una contraseña nueva
// compara el hash del ususario que intenta ingresar

import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};
