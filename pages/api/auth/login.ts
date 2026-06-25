import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/src/shared/libs/prisma";
import { withRateLimit } from "@/src/shared/libs/rate-limit";
import { verifyPassword } from "@/src/shared/libs/password";
import { buildSessionCookie } from "@/src/shared/libs/session";

type LoginResponse = { success: true } | { error: string };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const { username, password } = req.body ?? {};

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "invalid_field_types" });
  }

  try {
    const admin = await prisma.adminUser.findUnique({ where: { username } });

    // Verifica el hash incluso si el usuario no existe (con un hash dummy) para
    // no filtrar por tiempo si un usuario es válido o no.
    const stored =
      admin?.passwordHash ??
      "00000000000000000000000000000000:0000000000000000000000000000000000000000000000000000000000000000";
    const passOk = verifyPassword(password, stored);

    if (!admin || !passOk) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    res.setHeader("Set-Cookie", buildSessionCookie());
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: "internal_server_error" });
  }
}

export default withRateLimit(handler);
