import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        inventory: {
          include: {
            warehouse: true,
          },
        },
      },
    })

    const responsePayload = products.map((product) => ({
      id: product.id,
      name: product.name,
      inventories: product.inventory.map((inventory) => ({
        inventoryId: inventory.id,
        warehouseId: inventory.warehouseId,
        warehouseName: inventory.warehouse.name,
        totalStock: inventory.totalStock,
        reservedStock: inventory.reservedStock,
        availableStock: inventory.totalStock - inventory.reservedStock,
      })),
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

    let warehouse = await prisma.warehouse.findFirst({
      where: {
        name: warehouseName,
      },
    })

    if (!warehouse) {
      warehouse = await prisma.warehouse.create({
        data: {
          name: warehouseName,
        },
      })
    }

    const product = await prisma.product.create({
      data: {
        name,
      },
    })

    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        warehouseId: warehouse.id,
        totalStock: stock,
        reservedStock: 0,
      },
    })

    return NextResponse.json({
      product,
      inventory,
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