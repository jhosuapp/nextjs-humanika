import { WHATSAPP_URL } from "@/src/config/site";

type UserConfirmationData = { name: string };

type EmailPayload = { subject: string; html: string; text: string };

const LOGO_URL =
  "https://150porciento.com/wp-content/themes/150Theme/img/logo.svg";
const SITE_URL = "https://150porciento.ai";

export function buildUserConfirmationEmail({
  name,
}: UserConfirmationData): EmailPayload {
  const safeName = escapeHtml(name);
  const subject = `¡Gracias, ${name}! Recibimos tu solicitud en 150%`;

  const text = [
    `¡Hola ${name}!`,
    "",
    "Recibimos tu solicitud en 150% y ya estamos sobre ella.",
    "Uno de nuestros especialistas te contactará en menos de 24 horas",
    "para entender mejor tu proyecto y darte los siguientes pasos.",
    "",
    "Mientras tanto, puedes conocer más sobre nuestro trabajo:",
    SITE_URL,
    "",
    "— El equipo de 150%",
    "",
    "© 2026 Humanika, una iniciativa de 150 Por Ciento. Todos los derechos reservados.",
  ].join("\n");

  // NOTE: el logo viene en SVG. Gmail/Outlook no renderizan SVG inline en <img>.
  // Si tras el primer envío real se ve roto, reemplazar LOGO_URL por un PNG ~600px.
  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f8fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0b1024;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">
      Recibimos tu solicitud. Te contactaremos en menos de 24 horas.
    </span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8fc;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(11,16,36,0.04),0 8px 32px -16px rgba(11,16,36,0.12);">
            <tr>
              <td style="padding:28px 32px 20px 32px;background:#ffffff;" align="left">
                <img src="${LOGO_URL}" alt="150%" width="120" height="auto" style="display:block;border:0;outline:none;max-width:120px;height:auto;" />
              </td>
            </tr>
            <tr>
              <td style="height:4px;line-height:4px;font-size:0;background:linear-gradient(135deg,#00b1d7 0%,#17f1d1 100%);">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:40px 32px 16px 32px;" align="left">
                <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#00b1d7;mso-line-height-rule:exactly;line-height:18px;">
                  Solicitud recibida
                </p>
                <h1 style="margin:0;font-size:28px;line-height:36px;font-weight:700;color:#001643;mso-line-height-rule:exactly;">
                  ¡Gracias, ${safeName}!
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 8px 32px;" align="left">
                <p style="margin:0 0 16px 0;font-size:16px;line-height:26px;color:#0b1024;mso-line-height-rule:exactly;">
                  Recibimos tu solicitud y ya estamos sobre ella. Uno de nuestros especialistas te contactará en <strong style="color:#001643;">menos de 24 horas</strong> para entender tu proyecto y darte los siguientes pasos.
                </p>
                <p style="margin:0 0 24px 0;font-size:16px;line-height:26px;color:#5a6781;mso-line-height-rule:exactly;">
                  Mientras tanto, puedes conocer más sobre cómo ayudamos a empresas como la tuya a multiplicar resultados con IA.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 8px 32px;" align="left">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td bgcolor="#001643" style="border-radius:10px;">
                      <a href="${WHATSAPP_URL}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;background:#001643;mso-padding-alt:0;">
                        Escribir vía WhatsApp
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 0 32px;" align="left">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8fc;border-radius:12px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#001643;mso-line-height-rule:exactly;line-height:18px;">
                        ¿Qué sigue?
                      </p>
                      <p style="margin:0;font-size:14px;line-height:22px;color:#5a6781;mso-line-height-rule:exactly;">
                        Revisaremos tu información, prepararemos una propuesta inicial y te escribiremos desde un correo de 150% — atento a tu bandeja (y a la carpeta de spam por si acaso).
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 32px 32px;" align="left">
                <p style="margin:0;font-size:15px;line-height:22px;color:#0b1024;mso-line-height-rule:exactly;">
                  — El equipo de <strong style="color:#001643;">150%</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#001643;padding:24px 32px;" align="center">
                <p style="margin:0 0 6px 0;font-size:13px;line-height:20px;color:#aab6d3;mso-line-height-rule:exactly;">
                  <a href="${SITE_URL}" style="color:#17f1d1;text-decoration:none;">150porciento.ai</a>
                  &nbsp;·&nbsp;
                  <a href="mailto:contacto@150porciento.com" style="color:#17f1d1;text-decoration:none;">contacto@150porciento.com</a>
                </p>
                <p style="margin:0;font-size:12px;line-height:18px;color:#aab6d3;mso-line-height-rule:exactly;">
                  © 2026 Humanika, una iniciativa de 150 Por Ciento. Todos los derechos reservados.
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0 0;font-size:11px;line-height:16px;color:#5a6781;">
            Recibiste este correo porque registraste una solicitud en 150porciento.ai.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
