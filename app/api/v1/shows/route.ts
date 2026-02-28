import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';

// Get shows by movie ID or theater ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');
    const theaterId = searchParams.get('theaterId');

    if (!movieId && !theaterId) {
      return NextResponse.json(
        { success: false, error: 'movieId or theaterId required' },
        { status: 400 }
      );
    }

    const where: any = {};
    if (movieId) where.movieId = parseInt(movieId);
    if (theaterId) where.theaterId = parseInt(theaterId);

    const shows = await prisma.show.findMany({
      where,
      include: {
        movie: true,
        theater: true,
        _count: {
          select: { seats: { where: { isBooked: false } } }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return NextResponse.json({ 
      success: true,
      shows 
    });
  } catch (error) {
    console.error('Error fetching shows:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shows' },
      { status: 500 }
    );
  }
}
