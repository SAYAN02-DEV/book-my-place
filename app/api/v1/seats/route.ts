import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';

// Get seats for a specific show
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showId = searchParams.get('showId');

    if (!showId) {
      return NextResponse.json(
        { success: false, error: 'showId is required' },
        { status: 400 }
      );
    }

    const seats = await prisma.seat.findMany({
      where: {
        showId: parseInt(showId)
      },
      orderBy: [
        { row: 'asc' },
        { seatNo: 'asc' }
      ]
    });

    // Group seats by row
    const seatsByRow: { [key: string]: any[] } = {};
    seats.forEach(seat => {
      if (!seatsByRow[seat.row]) {
        seatsByRow[seat.row] = [];
      }
      seatsByRow[seat.row].push(seat);
    });

    return NextResponse.json({ 
      success: true,
      seats,
      seatsByRow
    });
  } catch (error) {
    console.error('Error fetching seats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch seats' },
      { status: 500 }
    );
  }
}
