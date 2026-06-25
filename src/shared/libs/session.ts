import crypto from "crypto";
import type { NextApiRequest } from "next";
import type { GetServerSidePropsContext } from "next";

/**
 * Sesión de administrador firmada con HMAC-SHA256 (sin dependencias externas).
 * El token viaja en una cookie httpOnly; el cliente nunca puede leerlo ni falsificarlo
 * porque no conoce AUTH_SECRET. Se usa para proteger el dashboard y la API admin.
 */

const COOKIE_NAME = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 horas

type SessionPayload = { sub: "admin"; exp: number };

const getSecret = (): string => {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET no está configurado (o es demasiado corto). Define una cadena larga y aleatoria.",
    );
  }
  return secret;
};

const base64url = (input: Buffer | string): string =>
  Buffer.from(input).toString("base64url");

const sign = (payload: string): string =>
  crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");

const createSessionToken = (): { token: string; maxAge: number } => {
  const payload: SessionPayload = {
    sub: "admin",
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  };
  const encoded = base64url(JSON.stringify(payload));
  const signature = sign(encoded);
  return { token: `${encoded}.${signature}`, maxAge: MAX_AGE_SECONDS };
};

const verifySessionToken = (token: string | undefined): boolean => {
  if (!token) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  const expected = sign(encoded);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;
    return payload.sub === "admin" && payload.exp > Date.now();
  } catch {
    return false;
  }
};

const buildSessionCookie = (): string => {
  const { token, maxAge } = createSessionToken();
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${COOKIE_NAME}=${token}; HttpOnly;${secure} SameSite=Lax; Path=/; Max-Age=${maxAge}`;
};

const buildClearCookie = (): string => {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${COOKIE_NAME}=; HttpOnly;${secure} SameSite=Lax; Path=/; Max-Age=0`;
};

const isAuthenticated = (
  req: NextApiRequest | GetServerSidePropsContext["req"],
): boolean => verifySessionToken(req.cookies?.[COOKIE_NAME]);

export {
  COOKIE_NAME,
  buildSessionCookie,
  buildClearCookie,
  isAuthenticated,
};
