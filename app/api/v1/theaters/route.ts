import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';

// Get theater details by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const theaterId = searchParams.get('id');

    if (!theaterId) {
      // Return all theaters
      const theaters = await prisma.theater.findMany({
        orderBy: {
          name: 'asc'
        }
      });

      return NextResponse.json({ 
        success: true,
        theaters 
      });
    }

    const theater = await prisma.theater.findUnique({
      where: {
        id: parseInt(theaterId)
      },
      include: {
        shows: {
          include: {
            movie: true
          },
          orderBy: {
            startTime: 'asc'
          }
        }
      }
    });

    if (!theater) {
      return NextResponse.json(
        { success: false, error: 'Theater not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      theater 
    });
  } catch (error) {
    console.error('Error fetching theater:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theater' },
      { status: 500 }
    );
  }
}
