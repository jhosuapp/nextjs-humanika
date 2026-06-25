import crypto from "crypto";

/**
 * Hash de contraseñas con scrypt (incluido en Node, sin dependencias externas).
 * Formato almacenado: "<salt-hex>:<hash-hex>".
 *
 * IMPORTANTE: el seed de la base de datos (prisma/seed.mjs) replica exactamente
 * este mismo formato y parámetros. Si cambias algo aquí, cámbialo también allí.
 */

const KEYLEN = 64;

const hashPassword = (plain: string): string => {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(plain, salt, KEYLEN);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
};

const verifyPassword = (plain: string, stored: string): boolean => {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const derived = crypto.scryptSync(plain, salt, expected.length);

  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
};

export { hashPassword, verifyPassword };
