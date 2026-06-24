type AdminNotificationData = {
  name: string;
  company: string;
  email: string;
  phone_number: string;
  submittedAt: Date;
};

type EmailPayload = { subject: string; html: string; text: string };

const LOGO_URL =
  "https://150porciento.com/wp-content/themes/150Theme/img/logo-white-update.svg";

export function buildAdminNotificationEmail({
  name,
  company,
  email,
  phone_number,
  submittedAt,
}: AdminNotificationData): EmailPayload {
  const safe = {
    name: escapeHtml(name),
    company: escapeHtml(company),
    email: escapeHtml(email),
    phone: escapeHtml(phone_number),
  };

  const timestamp = formatTimestamp(submittedAt);
  const subject = `🔔 Nuevo lead: ${name} (${company})`;

  const text = [
    "Nuevo lead recibido desde el formulario de contacto",
    "",
    `Nombre:    ${name}`,
    `Empresa:   ${company}`,
    `Email:     ${email}`,
    `Teléfono:  ${phone_number}`,
    `Recibido:  ${timestamp}`,
    "",
    `Responder: mailto:${email}`,
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
      ${safe.name} de ${safe.company} acaba de registrarse.
    </span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8fc;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(11,16,36,0.04),0 8px 32px -16px rgba(11,16,36,0.12);">
            <tr>
              <td style="background:#001643;padding:24px 32px;" align="left">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" valign="middle">
                      <img src="${LOGO_URL}" alt="150%" width="100" height="auto" style="display:block;border:0;outline:none;max-width:100px;height:auto;filter:brightness(0) invert(1);" />
                    </td>
                    <td align="right" valign="middle">
                      <span style="display:inline-block;padding:6px 12px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#001643;background:#17f1d1;border-radius:999px;">
                        Nuevo lead
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="height:4px;line-height:4px;font-size:0;background:linear-gradient(135deg,#00b1d7 0%,#17f1d1 100%);">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:32px 32px 8px 32px;" align="left">
                <h1 style="margin:0 0 6px 0;font-size:24px;line-height:32px;font-weight:700;color:#001643;mso-line-height-rule:exactly;">
                  ${safe.name}
                </h1>
                <p style="margin:0;font-size:15px;line-height:22px;color:#5a6781;mso-line-height-rule:exactly;">
                  de <strong style="color:#0b1024;">${safe.company}</strong> · recibido el ${escapeHtml(timestamp)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px 32px;" align="left">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(11,16,36,0.08);border-radius:12px;overflow:hidden;">
                  ${dataRow("Nombre", safe.name, false)}
                  ${dataRow("Empresa", safe.company, true)}
                  ${dataRow("Email", `<a href="mailto:${safe.email}" style="color:#00b1d7;text-decoration:none;">${safe.email}</a>`, true)}
                  ${dataRow("Teléfono", `<a href="tel:${safe.phone}" style="color:#00b1d7;text-decoration:none;">${safe.phone}</a>`, true)}
                  ${dataRow("Recibido", escapeHtml(timestamp), true)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px 32px;" align="left">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td bgcolor="#001643" style="border-radius:10px;">
                      <a href="mailto:${safe.email}?subject=Sobre%20tu%20solicitud%20en%20150%25" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;background:#001643;mso-padding-alt:0;">
                        ✉ Responder a ${safe.name}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 4px 32px;" align="left">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8fc;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 20px;">
                      <p style="margin:0;font-size:13px;line-height:20px;color:#5a6781;mso-line-height-rule:exactly;">
                        💡 <strong style="color:#001643;">Tip:</strong> para responder al lead, usa el botón de arriba o escríbele directamente a <a href="mailto:${safe.email}" style="color:#00b1d7;text-decoration:none;">${safe.email}</a>.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;" align="center">
                <p style="margin:0;font-size:12px;line-height:18px;color:#aab6d3;mso-line-height-rule:exactly;">
                  Notificación automática · 150% Contact Form
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}

function dataRow(label: string, value: string, withBorder: boolean): string {
  const borderTop = withBorder
    ? "border-top:1px solid rgba(11,16,36,0.08);"
    : "";
  return `
                  <tr>
                    <td style="padding:14px 20px;width:120px;${borderTop}font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#5a6781;vertical-align:top;mso-line-height-rule:exactly;line-height:18px;">
                      ${label}
                    </td>
                    <td style="padding:14px 20px;${borderTop}font-size:15px;color:#0b1024;vertical-align:top;mso-line-height-rule:exactly;line-height:22px;word-break:break-word;">
                      ${value}
                    </td>
                  </tr>`;
}

function formatTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const tzOffsetMin = -date.getTimezoneOffset();
  const sign = tzOffsetMin >= 0 ? "+" : "-";
  const tzH = pad(Math.floor(Math.abs(tzOffsetMin) / 60));
  const tzM = pad(Math.abs(tzOffsetMin) % 60);
  return `${yyyy}-${mm}-${dd} ${hh}:${mi} (${sign}${tzH}:${tzM})`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
