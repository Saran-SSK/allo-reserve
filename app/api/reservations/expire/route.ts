import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const p = prisma as any

export async function POST() {
  try {
    const expiredCount = await p.$transaction(async (tx: any) => {
      const expiredReservations = await tx.$queryRaw<
        { id: string; inventoryId: string; quantity: number }[]
      >`
        SELECT "id", "inventoryId", "quantity"
        FROM "Reservation"
        WHERE "status" = 'PENDING'
          AND "expiresAt" <= NOW()
        FOR UPDATE
      `

      for (const reservation of expiredReservations) {
        const inventories = await tx.$queryRaw<
          { id: string; reservedStock: number }[]
        >`
          SELECT "id", "reservedStock"
          FROM "Inventory"
          WHERE "id" = ${reservation.inventoryId}
          FOR UPDATE
        `

        const inventory = inventories[0]

        if (!inventory) {
          continue
        }

        await tx.inventory.update({
          where: {
            id: inventory.id,
          },
          data: {
            reservedStock: Math.max(
              0,
              inventory.reservedStock - reservation.quantity
            ),
          },
        })

        await tx.reservation.update({
          where: {
            id: reservation.id,
          },
          data: {
            status: 'EXPIRED',
          },
        })
      }

      return expiredReservations.length
    }, { timeout: 10000 })

    return NextResponse.json({
      expiredCount,
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
