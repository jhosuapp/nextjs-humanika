import { useCallback } from "react";

type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SCRIPT_ID = "recaptcha-v3";
const LOAD_TIMEOUT_MS = 10_000;

// El script se inyecta una sola vez por sesión de página aunque el hook se monte
// varias veces: la promesa vive a nivel de módulo, no de componente.
let loadPromise: Promise<Grecaptcha> | null = null;

const getSiteKey = (): string => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) throw new Error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY no está definida");
  return siteKey;
};

const loadRecaptcha = (): Promise<Grecaptcha> => {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<Grecaptcha>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("recaptcha solo se carga en el navegador"));
      return;
    }
    if (window.grecaptcha) {
      resolve(window.grecaptcha);
      return;
    }

    const siteKey = getSiteKey();

    const timeout = window.setTimeout(() => {
      // Si el script nunca llega (adblock, red corporativa) se descarta la promesa
      // para que un reintento posterior pueda volver a inyectarlo.
      loadPromise = null;
      reject(new Error("timeout cargando recaptcha"));
    }, LOAD_TIMEOUT_MS);

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.clearTimeout(timeout);
      if (window.grecaptcha) resolve(window.grecaptcha);
      else {
        loadPromise = null;
        reject(new Error("recaptcha cargó sin exponer window.grecaptcha"));
      }
    };

    script.onerror = () => {
      window.clearTimeout(timeout);
      loadPromise = null;
      script.remove();
      reject(new Error("no se pudo cargar el script de recaptcha"));
    };

    document.head.appendChild(script);
  });

  // Evita un unhandled rejection si nadie está esperando la promesa todavía
  // (load() se llama al primer tecleo, mucho antes del submit).
  loadPromise.catch(() => {});

  return loadPromise;
};

const executeRecaptcha = async (action: string): Promise<string> => {
  const grecaptcha = await loadRecaptcha();
  const siteKey = getSiteKey();

  await new Promise<void>((resolve) => grecaptcha.ready(resolve));

  return grecaptcha.execute(siteKey, { action });
};

/**
 * reCAPTCHA v3 con carga perezosa: `load()` inyecta el script bajo demanda
 * (no al montar la página) y `execute()` devuelve el token para enviar al backend.
 */
const useRecaptcha = () => {
  const load = useCallback(() => {
    loadRecaptcha().catch(() => {});
  }, []);

  const execute = useCallback(
    (action: string) => executeRecaptcha(action),
    [],
  );

  return { load, execute };
};

export { useRecaptcha };
