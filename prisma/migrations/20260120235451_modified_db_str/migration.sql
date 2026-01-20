/*
  Warnings:

  - You are about to drop the `_MovieToTheater` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `showId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MovieToTheater" DROP CONSTRAINT "_MovieToTheater_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieToTheater" DROP CONSTRAINT "_MovieToTheater_B_fkey";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "showId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_MovieToTheater";

-- CreateTable
CREATE TABLE "Show" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "theaterId" INTEGER NOT NULL,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" SERIAL NOT NULL,
    "seatNo" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "showId" INTEGER NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SeatToTicket" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SeatToTicket_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SeatToTicket_B_index" ON "_SeatToTicket"("B");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_theaterId_fkey" FOREIGN KEY ("theaterId") REFERENCES "Theater"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeatToTicket" ADD CONSTRAINT "_SeatToTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "Seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeatToTicket" ADD CONSTRAINT "_SeatToTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
