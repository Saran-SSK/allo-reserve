import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const p = prisma as any

export async function POST() {
  try {
    const now = new Date()

    const expiredReservations = await p.reservation.findMany({
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
      await p.$transaction(
        [
          p.inventory.update({
            where: {
              id: reservation.inventoryId,
            },
            data: {
              reservedStock: {
                decrement: reservation.quantity,
              },
            },
          }),

          p.reservation.update({
            where: {
              id: reservation.id,
            },
            data: {
              status: 'EXPIRED',
            },
          }),
        ],
        { timeout: 10000 }
      )
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