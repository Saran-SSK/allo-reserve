import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const p = prisma as any

export async function GET() {
  try {
    const reservations = await p.reservation.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      include: {
        inventory: {
          include: {
            product: true,
            warehouse: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedReservations = (reservations as any[]).map((reservation: any) => ({
      id: reservation.id,
      productId: reservation.inventory.product.id,
      productName: reservation.inventory.product.name,
      warehouseName: reservation.inventory.warehouse.name,
      quantity: reservation.quantity,
      status: reservation.status.toLowerCase(),
      expiresAt: reservation.expiresAt,
      createdAt: reservation.createdAt,
    }))

    return NextResponse.json(formattedReservations)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch reservations.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (
      !body ||
      typeof body.inventoryId !== 'string' ||
      !body.inventoryId.trim() ||
      typeof body.quantity !== 'number' ||
      body.quantity <= 0
    ) {
      return NextResponse.json(
        { error: 'inventoryId and quantity are required and must be valid.' },
        { status: 400 }
      )
    }

    const { inventoryId, quantity } = body

    const result = await p.$transaction(async (tx: any) => {
      const inventories = await tx.$queryRaw<
        { id: string; totalStock: number; reservedStock: number }[]
      >`
        SELECT "id", "totalStock", "reservedStock"
        FROM "Inventory"
        WHERE "id" = ${inventoryId}
        FOR UPDATE
      `

      const inventory = inventories[0]

      if (!inventory) {
        return { inventoryNotFound: true }
      }

      const availableStock = inventory.totalStock - inventory.reservedStock

      if (availableStock < quantity) {
        return { insufficientStock: true }
      }

      const updatedInventory = await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          reservedStock: {
            increment: quantity,
          },
        },
      })

      const reservation = await tx.reservation.create({
        data: {
          inventoryId,
          quantity,
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      })

      return { reservation, updatedInventory }
    }, { timeout: 10000 })

    if (result && 'insufficientStock' in result) {
      return NextResponse.json(
        { error: 'Insufficient stock for the requested reservation quantity.' },
        { status: 409 }
      )
    }

    return NextResponse.json(result.reservation)
  } catch (error) {
    if (error instanceof Error && error.message === 'Inventory not found') {
      return NextResponse.json({ error: 'Inventory not found.' }, { status: 404 })
    }

    const message = error instanceof Error ? error.message : 'An unexpected server error occurred.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
