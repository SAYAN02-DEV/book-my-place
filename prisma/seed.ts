import "dotenv/config";
import prisma from "../db/index.js";

async function seed() {
  console.log("Seeding database");

  // Clear existing data
//   await prisma.user.deleteMany();
//   await prisma.movie.deleteMany();
//   await prisma.theater.deleteMany();

  // Create test users
  // await prisma.user.createMany({
  //   data: [
  //     {
  //       name: "John Doe",
  //       email: "john@example.com",
  //       password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u", // "password123"
  //       oauth: false,
  //     },
  //     {
  //       name: "Jane Smith",
  //       email: "jane@example.com",
  //       password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
  //       oauth: false,
  //     },
  //     {
  //       name: "Bob Wilson",
  //       email: "bob@example.com",
  //       password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
  //       oauth: true,
  //     },
  //     {
  //       name: "Alice Johnson",
  //       email: "alice@example.com",
  //       password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
  //       oauth: false,
  //     },
  //   ],
  // });

  // Create test movies
  const movie1 = await prisma.movie.create({
    data: {
      title: "The Dark Knight",
      duration: 152,
    },
  });

  const movie2 = await prisma.movie.create({
    data: {
      title: "Inception",
      duration: 148,
    },
  });

  const movie3 = await prisma.movie.create({
    data: {
      title: "Interstellar",
      duration: 169,
    },
  });

  // Create test theaters
  await prisma.theater.create({
    data: {
      name: "PVR Cinemas - Phoenix Mall",
      email: "pvr.phoenix@example.com",
      latitude: 12.9941,
      longitude: 77.6097,
      address: "Whitefield, Bangalore, India",
      movies: {
        connect: [{ id: movie1.id }, { id: movie2.id }],
      },
    },
  });

  await prisma.theater.create({
    data: {
      name: "INOX - Forum Mall",
      email: "inox.forum@example.com",
      latitude: 12.9352,
      longitude: 77.6245,
      address: "Koramangala, Bangalore, India",
      movies: {
        connect: [{ id: movie2.id }, { id: movie3.id }],
      },
    },
  });

  await prisma.theater.create({
    data: {
      name: "Cinepolis - Orion Mall",
      email: "cinepolis.orion@example.com",
      latitude: 13.0101,
      longitude: 77.5562,
      address: "Rajajinagar, Bangalore, India",
      movies: {
        connect: [{ id: movie1.id }, { id: movie3.id }],
      },
    },
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