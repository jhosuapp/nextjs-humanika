import type { NextApiRequest, NextApiResponse } from "next";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/src/shared/libs/prisma";
import { isAuthenticated } from "@/src/shared/libs/session";
import {
  contactsQueryValidation,
  type ContactsResponse,
} from "@/src/features/dashboard/validations/contacts-query.validation";

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactsResponse | ErrorResponse>,
) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: "unauthorized" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const parsed = contactsQueryValidation.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_query" });
  }

  const { page, pageSize, search, from, to } = parsed.data;

  const conditions: Prisma.ContactFormWhereInput[] = [];

  if (search) {
    conditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone_number: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (from) {
    conditions.push({ createdAt: { gte: new Date(`${from}T00:00:00.000Z`) } });
  }

  if (to) {
    conditions.push({ createdAt: { lte: new Date(`${to}T23:59:59.999Z`) } });
  }

  const where: Prisma.ContactFormWhereInput =
    conditions.length > 0 ? { AND: conditions } : {};

  try {
    const [items, total] = await prisma.$transaction([
      prisma.contactForm.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contactForm.count({ where }),
    ]);

    return res.status(200).json({
      items: items.map((it) => ({
        ...it,
        createdAt: it.createdAt.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch {
    return res.status(500).json({ error: "internal_server_error" });
  }
}
