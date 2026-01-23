import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';

export async function GET(request: NextRequest) {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true,
      movies 
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}
