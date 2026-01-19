import { PrismaClient } from "../lib/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log("Seeding database");

  // Clear existing data
//   await prisma.user.deleteMany();

  // Create test users
  await prisma.user.createMany({
    data: [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u", // "password123"
        oauth: false,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
        oauth: false,
      },
      {
        name: "Bob Wilson",
        email: "bob@example.com",
        password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
        oauth: true,
      },
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
        oauth: false,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });