import path from "node:path";

/**
 * Los clientes de correo (Gmail, Outlook, Apple Mail) no renderizan SVG en <img>,
 * así que el logo se envía como PNG incrustado por CID (Content-ID). Esto funciona
 * en todos los clientes y no depende de que el asset esté desplegado en una URL
 * pública. Los PNG viven en `public/emails/` (generados desde los SVG de marca).
 *
 * En la plantilla se referencia con `src="cid:humanika-logo"`.
 */
export const EMAIL_LOGO_CID = "humanika-logo";

type LogoVariant = "white" | "color";

const FILE_BY_VARIANT: Record<LogoVariant, string> = {
  // Marca "Humanika" en cian — legible sobre fondos oscuros (header navy).
  white: "logo-humanika-white.png",
  // Lockup completo "Humanika by 150%" — para fondos claros (header blanco).
  color: "logo-humanika.png",
};

export function humanikaLogoAttachment(variant: LogoVariant) {
  const file = FILE_BY_VARIANT[variant];
  return {
    filename: file,
    path: path.join(process.cwd(), "public", "emails", file),
    cid: EMAIL_LOGO_CID,
    contentDisposition: "inline" as const,
  };
}
