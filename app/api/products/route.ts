import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const p = prisma as any

export async function GET() {
  try {
    const products = await p.product.findMany({
      include: {
        inventory: {
          include: {
            warehouse: true,
          },
        },
      },
    })

    const responsePayload = (products as any[]).map((product: any) => ({
      id: product.id,
      name: product.name,
      inventories: (product.inventory as any[]).map((inventory: any) => {
        const reservedStock = Math.max(0, inventory.reservedStock)

        return {
          inventoryId: inventory.id,
          warehouseId: inventory.warehouseId,
          warehouseName: inventory.warehouse.name,
          totalStock: inventory.totalStock,
          reservedStock,
          availableStock: inventory.totalStock - reservedStock,
        }
      }),
    }))

    return NextResponse.json(responsePayload)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, warehouseName, stock } = body

    if (!name || !warehouseName || stock < 0) {
      return NextResponse.json(
        {
          error: 'Invalid product data',
        },
        {
          status: 400,
        }
      )
    }

    const result = await p.$transaction(async (tx: any) => {
      let warehouse = await tx.warehouse.findFirst({
        where: {
          name: warehouseName,
        },
      })

      if (!warehouse) {
        warehouse = await tx.warehouse.create({
          data: {
            name: warehouseName,
          },
        })
      }

      const product = await tx.product.create({
        data: {
          name,
        },
      })

      const inventory = await tx.inventory.create({
        data: {
          productId: product.id,
          warehouseId: warehouse.id,
          totalStock: stock,
          reservedStock: 0,
        },
      })

      return { product, inventory }
    }, { timeout: 10000 })

    return NextResponse.json({
      product: result.product,
      inventory: result.inventory,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: 'Failed to create product',
      },
      {
        status: 500,
      }
    )
  }
}
