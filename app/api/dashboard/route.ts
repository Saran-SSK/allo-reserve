import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const p = prisma as any

async function expirePendingReservations() {
  return p.$transaction(async (tx: any) => {
    const expiredReservations = await tx.$queryRaw<
      { id: string; inventoryId: string; quantity: number }[]
    >`
      SELECT "id", "inventoryId", "quantity"
      FROM "Reservation"
      WHERE "status" = 'PENDING'
        AND "expiresAt" <= NOW()
      FOR UPDATE
    `

    if (expiredReservations.length === 0) {
      return 0
    }

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
}

export async function GET() {
  try {
    await expirePendingReservations()

    const [inventoryRows, reservationRows] = await Promise.all([
      p.inventory.findMany({
        select: {
          id: true,
          productId: true,
          warehouseId: true,
          totalStock: true,
          reservedStock: true,
          product: {
            select: {
              name: true,
            },
          },
          warehouse: {
            select: {
              name: true,
            },
          },
        },
      }),
      p.reservation.findMany({
        where: {
          status: 'PENDING',
        },
        select: {
          id: true,
          quantity: true,
          status: true,
          expiresAt: true,
          createdAt: true,
          inventory: {
            select: {
              productId: true,
              product: {
                select: {
                  name: true,
                },
              },
              warehouse: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])

    const inventory = (inventoryRows as any[]).map((item: any) => {
      const reservedStock = Math.max(0, item.reservedStock)
      const lowStockThreshold = Math.max(1, Math.round(item.totalStock * 0.1))

      return {
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        warehouseId: item.warehouseId,
        warehouseName: item.warehouse.name,
        totalStock: item.totalStock,
        reservedStock,
        availableStock: item.totalStock - reservedStock,
        lowStockThreshold,
      }
    })

    const reservations = (reservationRows as any[]).map((reservation: any) => ({
      id: reservation.id,
      productId: reservation.inventory.productId,
      productName: reservation.inventory.product.name,
      warehouseName: reservation.inventory.warehouse.name,
      quantity: reservation.quantity,
      status: reservation.status.toLowerCase(),
      expiresAt: reservation.expiresAt,
      createdAt: reservation.createdAt,
    }))

    const stats = {
      totalProducts: inventory.length,
      activeReservations: reservations.length,
      warehouses: new Set(inventory.map((item: any) => item.warehouseId)).size,
      lowStockItems: inventory.filter(
        (item: any) => item.availableStock <= item.lowStockThreshold
      ).length,
    }

    return NextResponse.json({
      stats,
      inventory,
      reservations,
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to load dashboard data.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
