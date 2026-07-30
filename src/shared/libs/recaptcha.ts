const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const VERIFY_TIMEOUT_MS = 5_000;
const DEFAULT_MIN_SCORE = 0.5;

type SiteVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

type VerifyArgs = {
  action: string;
  ip?: string;
};

type VerifyResult =
  | { ok: true; score: number }
  | { ok: false; reason: string };

/**
 * Valida un token de reCAPTCHA v3 contra la API de Google.
 *
 * Rechaza tokens inválidos, de otra acción o con score por debajo del umbral.
 * Si la llamada a Google falla (red caída, timeout) se deja pasar el envío: una
 * incidencia de infraestructura no debe apagar la captación de leads.
 */
export async function verifyRecaptcha(
  token: string,
  { action, ip }: VerifyArgs,
): Promise<VerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing RECAPTCHA_SECRET_KEY env var");
  }

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? DEFAULT_MIN_SCORE);

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  let data: SiteVerifyResponse;
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`siteverify respondió ${res.status}`);
    data = (await res.json()) as SiteVerifyResponse;
  } catch (e) {
    console.error("[recaptcha] verificación no disponible, se deja pasar:", e);
    return { ok: true, score: -1 };
  }

  if (!data.success) {
    return {
      ok: false,
      reason: data["error-codes"]?.join(", ") ?? "verification_failed",
    };
  }

  // El token es específico de la acción con la que se generó: comprobarlo evita
  // reutilizar en /contact un token obtenido en otro punto del sitio.
  if (data.action !== action) {
    return { ok: false, reason: `action_mismatch (${data.action})` };
  }

  const score = data.score ?? 0;
  if (score < minScore) {
    return { ok: false, reason: `low_score (${score} < ${minScore})` };
  }

  return { ok: true, score };
}
