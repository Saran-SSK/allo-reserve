import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    const now = new Date()

    const expiredReservations = await prisma.reservation.findMany({
      where: {
        status: 'PENDING',
        expiresAt: {
          lte: now,
        },
      },
      include: {
        inventory: true,
      },
    })

    for (const reservation of expiredReservations) {
      await prisma.$transaction([
        prisma.inventory.update({
          where: {
            id: reservation.inventoryId,
          },
          data: {
            reservedStock: {
              decrement: reservation.quantity,
            },
          },
        }),

        prisma.reservation.update({
          where: {
            id: reservation.id,
          },
          data: {
            status: 'EXPIRED',
          },
        }),
      ])
    }

    return NextResponse.json({
      expiredCount: expiredReservations.length,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: 'Failed to expire reservations',
      },
      {
        status: 500,
      }
    )
  }
}