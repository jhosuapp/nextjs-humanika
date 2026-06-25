import "dotenv/config";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Debe coincidir EXACTAMENTE con src/shared/libs/password.ts (formato y parámetros).
const hashPassword = (plain) => {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(plain, salt, 64);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
};

const USERNAME = process.env.SEED_ADMIN_USERNAME ?? "admin";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Back150*";

async function main() {
  const passwordHash = hashPassword(PASSWORD);
  const user = await prisma.adminUser.upsert({
    where: { username: USERNAME },
    update: { passwordHash },
    create: { username: USERNAME, passwordHash },
  });
  console.log(`Admin user listo: "${user.username}" (id ${user.id})`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
