import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';
import jwt from 'jsonwebtoken';

// Create a new booking
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userEmail = decoded.email;

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { showId, seatIds } = data;

    if (!showId || !seatIds || seatIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'showId and seatIds are required' },
        { status: 400 }
      );
    }

    // Check if seats are available
    const seats = await prisma.seat.findMany({
      where: {
        id: { in: seatIds },
        showId: showId,
        isBooked: false
      }
    });

    if (seats.length !== seatIds.length) {
      return NextResponse.json(
        { success: false, error: 'Some seats are already booked' },
        { status: 400 }
      );
    }

    // Create ticket and update seats in a transaction
    const ticket = await prisma.$transaction(async (tx) => {
      // Create the ticket
      const newTicket = await tx.ticket.create({
        data: {
          ownerId: user.id,
          showId: showId,
          seats: {
            connect: seatIds.map((id: number) => ({ id }))
          }
        },
        include: {
          show: {
            include: {
              movie: true,
              theater: true
            }
          },
          seats: true
        }
      });

      // Mark seats as booked
      await tx.seat.updateMany({
        where: {
          id: { in: seatIds }
        },
        data: {
          isBooked: true
        }
      });

      return newTicket;
    });

    return NextResponse.json({ 
      success: true,
      message: 'Booking successful',
      ticket 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userEmail = decoded.email;

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        ownerId: user.id
      },
      include: {
        show: {
          include: {
            movie: true,
            theater: true
          }
        },
        seats: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true,
      tickets 
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
