import prisma from "@/db";

interface station{
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    distance: number
}

type stationList = station[];

const fetchStations = async (
  userLat: number,
  userLong: number,
  radius: number
): Promise<stationList> => {
  const theaters = await prisma.$queryRaw<stationList>`
    SELECT 
      id,
      name,
      latitude,
      longitude,
      (
        6371 * acos(
          cos(radians(${userLat}))
          * cos(radians(latitude))
          * cos(radians(longitude) - radians(${userLong}))
          + sin(radians(${userLat}))
          * sin(radians(latitude))
        )
      ) AS distance
    FROM "Theater"
    WHERE (
      6371 * acos(
        cos(radians(${userLat}))
        * cos(radians(latitude))
        * cos(radians(longitude) - radians(${userLong}))
        + sin(radians(${userLat}))
        * sin(radians(latitude))
      )
    ) <= ${radius}
    ORDER BY distance;
  `;
  return theaters;
};