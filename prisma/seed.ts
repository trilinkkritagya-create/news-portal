import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

import bcrypt from "bcryptjs";

import { Pool } from "pg";
import { UserRole } from "@/generated/prisma/enums";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const authorPassword = await bcrypt.hash("author123", 10);
  const memberPassword = await bcrypt.hash("member123", 10);

  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "author1@gmail.com" },
    update: {},
    create: {
      name: "Author 1",
      email: "author1@gmail.com",
      password: authorPassword,
      role: UserRole.AUTHOR,
    },
  });

  await prisma.user.upsert({
    where: { email: "author2@gmail.com" },
    update: {},
    create: {
      name: "Author 2",
      email: "author2@gmail.com",
      password: authorPassword,
      role: UserRole.AUTHOR,
    },
  });

  await prisma.user.upsert({
    where: { email: "member1@gmail.com" },
    update: {},
    create: {
      name: "Member 1",
      email: "member1@gmail.com",
      password: memberPassword,
      role: UserRole.MEMBER,
    },
  });

  await prisma.user.upsert({
    where: { email: "member2@gmail.com" },
    update: {},
    create: {
      name: "Member 2",
      email: "member2@gmail.com",
      password: memberPassword,
      role: UserRole.MEMBER,
    },
  });

  await prisma.user.upsert({
    where: { email: "member3@gmail.com" },
    update: {},
    create: {
      name: "Member 3",
      email: "member3@gmail.com",
      password: memberPassword,
      role: UserRole.MEMBER,
    },
  });

  console.log("Development users seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
