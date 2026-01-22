import prisma from "@/db";

type station = {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    distance: number
}

type stationList = station[];

/*
Use this function to fetch stations nearby to users giving the users coordinates and radius
Optionally filter by movie ID to get theaters showing a specific movie
*/
const fetchStations = async (
  userLat: number,
  userLong: number,
  radius: number = 20,
  movieId?: number
): Promise<stationList> => {
  if (movieId) {
    const theaters = await prisma.$queryRaw<stationList>`
      SELECT DISTINCT
        t.id,
        t.name,
        t.latitude,
        t.longitude,
        (
          6371 * acos(
            cos(radians(${userLat}))
            * cos(radians(t.latitude))
            * cos(radians(t.longitude) - radians(${userLong}))
            + sin(radians(${userLat}))
            * sin(radians(t.latitude))
          )
        ) AS distance
      FROM "Theater" t
      INNER JOIN "Show" s ON t.id = s."theaterId"
      WHERE s."movieId" = ${movieId}
        AND (
          6371 * acos(
            cos(radians(${userLat}))
            * cos(radians(t.latitude))
            * cos(radians(t.longitude) - radians(${userLong}))
            + sin(radians(${userLat}))
            * sin(radians(t.latitude))
          )
        ) <= ${radius}
      ORDER BY distance;
    `;
    return theaters;
  }

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

export default fetchStations;
/*

*/