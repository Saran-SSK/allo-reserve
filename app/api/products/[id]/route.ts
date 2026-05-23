import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid product id' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        inventory: {
          select: { id: true },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const inventoryIds = product.inventory.map((inventory) => inventory.id)

    if (inventoryIds.length > 0) {
      const activeReservationCount = await prisma.reservation.count({
        where: {
          inventoryId: { in: inventoryIds },
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
        },
      })

      if (activeReservationCount > 0) {
        return NextResponse.json(
          {
            error:
              'Cannot delete product while there are active reservations',
          },
          { status: 400 }
        )
      }
    }

    await prisma.$transaction([
      prisma.reservation.deleteMany({
        where: {
          inventoryId: { in: inventoryIds },
          status: {
            in: ['RELEASED', 'EXPIRED'],
          },
        },
      }),
      prisma.inventory.deleteMany({
        where: {
          productId,
        },
      }),
      prisma.product.delete({
        where: {
          id: productId,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: 'Failed to delete product',
      },
      {
        status: 500,
      }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid product id' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { inventoryId, name, warehouseName, totalStock } = body ?? {}

    if (
      !inventoryId ||
      typeof inventoryId !== 'string' ||
      !name ||
      typeof name !== 'string' ||
      !warehouseName ||
      typeof warehouseName !== 'string' ||
      typeof totalStock !== 'number' ||
      totalStock < 0
    ) {
      return NextResponse.json(
        { error: 'inventoryId, name, warehouseName, and totalStock are required.' },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      })

      if (!product) {
        throw new Error('PRODUCT_NOT_FOUND')
      }

      const inventory = await tx.inventory.findUnique({
        where: { id: inventoryId },
        include: { warehouse: true },
      })

      if (!inventory || inventory.productId !== productId) {
        throw new Error('INVENTORY_NOT_FOUND')
      }

      if (inventory.reservedStock > totalStock) {
        throw new Error('INSUFFICIENT_STOCK')
      }

      let warehouse = await tx.warehouse.findFirst({
        where: { name: warehouseName },
      })

      if (!warehouse) {
        warehouse = await tx.warehouse.create({
          data: { name: warehouseName },
        })
      } else if (warehouse.id !== inventory.warehouseId) {
        const existingInventory = await tx.inventory.findFirst({
          where: {
            productId,
            warehouseId: warehouse.id,
          },
        })

        if (existingInventory) {
          throw new Error('DUPLICATE_INVENTORY')
        }
      }

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { name },
      })

      const updatedInventory = await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          warehouseId: warehouse.id,
          totalStock,
        },
      })

      return {
        updatedProduct,
        updatedInventory,
        warehouse,
      }
    })

    return NextResponse.json({
      id: result.updatedProduct.id,
      name: result.updatedProduct.name,
      inventory: {
        id: result.updatedInventory.id,
        productId: result.updatedInventory.productId,
        warehouseId: result.updatedInventory.warehouseId,
        warehouseName: result.warehouse.name,
        totalStock: result.updatedInventory.totalStock,
        reservedStock: result.updatedInventory.reservedStock,
        availableStock:
          result.updatedInventory.totalStock - result.updatedInventory.reservedStock,
      },
    })
  } catch (error) {
    console.error('Product patch failed:', error)

    if (error instanceof Error) {
      if (error.message === 'PRODUCT_NOT_FOUND' || error.message === 'INVENTORY_NOT_FOUND') {
        return NextResponse.json(
          { error: 'Product or inventory not found.' },
          { status: 404 }
        )
      }

      if (error.message === 'INSUFFICIENT_STOCK') {
        return NextResponse.json(
          {
            error:
              'Total stock cannot be lower than current reserved stock.',
          },
          { status: 400 }
        )
      }

      if (error.message === 'DUPLICATE_INVENTORY') {
        return NextResponse.json(
          {
            error:
              'A product inventory already exists for the selected warehouse.',
          },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}
