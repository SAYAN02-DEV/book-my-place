import "dotenv/config";
import prisma from "../db/index";

async function seed() {
  console.log("Seeding database");

  // Clear existing data - check if models exist first
  try {
    await prisma.ticket.deleteMany();
    await prisma.seat.deleteMany();
    await prisma.show.deleteMany();
  } catch (e) {
    console.log("No existing data to clear");
  }
  
  await prisma.theater.deleteMany();
  await prisma.movie.deleteMany();

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

  const movie4 = await prisma.movie.create({
    data: {
      title: "Avengers: Endgame",
      duration: 181,
    },
  });

  const movie5 = await prisma.movie.create({
    data: {
      title: "Jawan",
      duration: 169,
    },
  });

  // Create 10 theaters near Ranchi (23.3441° N, 85.3096° E)
  const theaters = [
    {
      name: "PVR Cinemas - Nucleus Mall",
      email: "pvr.nucleus@example.com",
      latitude: 23.3441,
      longitude: 85.3096,
      address: "Nucleus Mall, Doranda, Ranchi",
    },
    {
      name: "INOX - City Centre Mall",
      email: "inox.citycenter@example.com",
      latitude: 23.3569,
      longitude: 85.3298,
      address: "City Centre Mall, Main Road, Ranchi",
    },
    {
      name: "Cinepolis - BIT Mesra",
      email: "cinepolis.bit@example.com",
      latitude: 23.4173,
      longitude: 85.4373,
      address: "Near BIT Mesra, Ranchi",
    },
    {
      name: "Carnival Cinemas - Hinoo",
      email: "carnival.hinoo@example.com",
      latitude: 23.3251,
      longitude: 85.3098,
      address: "Hinoo, Ranchi",
    },
    {
      name: "Rajhans Cinemas - Lalpur",
      email: "rajhans.lalpur@example.com",
      latitude: 23.3689,
      longitude: 85.2987,
      address: "Lalpur, Ranchi",
    },
    {
      name: "Big Cinemas - Kanke Road",
      email: "bigcinemas.kanke@example.com",
      latitude: 23.3891,
      longitude: 85.3456,
      address: "Kanke Road, Ranchi",
    },
    {
      name: "Movietime - Harmu",
      email: "movietime.harmu@example.com",
      latitude: 23.3512,
      longitude: 85.2823,
      address: "Harmu, Ranchi",
    },
    {
      name: "Gold Cinema - Morabadi",
      email: "gold.morabadi@example.com",
      latitude: 23.3378,
      longitude: 85.3234,
      address: "Morabadi, Ranchi",
    },
    {
      name: "CineMax - Kokar",
      email: "cinemax.kokar@example.com",
      latitude: 23.3289,
      longitude: 85.3189,
      address: "Kokar, Ranchi",
    },
    {
      name: "Wave Cinemas - Kadru",
      email: "wave.kadru@example.com",
      latitude: 23.2998,
      longitude: 85.3445,
      address: "Kadru, Ranchi",
    },
  ];

  const movies = [movie1, movie2, movie3, movie4, movie5];

  for (const theaterData of theaters) {
    // Randomly assign 2-3 movies to each theater
    const numMovies = Math.floor(Math.random() * 2) + 2; // 2 or 3 movies
    const shuffledMovies = [...movies].sort(() => Math.random() - 0.5);
    const selectedMovies = shuffledMovies.slice(0, numMovies);

    const theater = await prisma.theater.create({
      data: theaterData,
    });

    // Create shows for each movie at this theater
    for (const movie of selectedMovies) {
      const showTimes = ["10:00", "13:30", "17:00", "20:30"];
      const today = new Date();
      
      for (const time of showTimes) {
        const [hours, minutes] = time.split(":").map(Number);
        const showDate = new Date(today);
        showDate.setHours(hours, minutes, 0, 0);

        const show = await prisma.show.create({
          data: {
            startTime: showDate,
            price: Math.floor(Math.random() * 200) + 150, // Random price between 150-350
            movieId: movie.id,
            theaterId: theater.id,
          },
        });

        // Create seats for this show
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const seatsPerRow = 15;
        const seats = [];

        for (const row of rows) {
          for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
            seats.push({
              seatNo: `${seatNum}`,
              row: row,
              isBooked: false,
              showId: show.id,
            });
          }
        }

        await prisma.seat.createMany({
          data: seats,
        });
      }
    }
  }

  console.log("Database seeded successfully with 10 theaters near Ranchi!");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });