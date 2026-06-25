import type { NextApiRequest, NextApiResponse } from "next";

import { buildClearCookie } from "@/src/shared/libs/session";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  res.setHeader("Set-Cookie", buildClearCookie());
  return res.status(200).json({ success: true });
}
