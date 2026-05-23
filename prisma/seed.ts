import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.reservation.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.product.deleteMany()
  await prisma.warehouse.deleteMany()

  const products = await prisma.product.createMany({
    data: [
      { name: 'iPhone 15' },
      { name: 'Samsung S24' },
      { name: 'AirPods Pro' },
    ],
  })

  const warehouses = await prisma.warehouse.createMany({
    data: [
      { name: 'Chennai Warehouse' },
      { name: 'Bangalore Warehouse' },
    ],
  })

  const productRecords = await prisma.product.findMany()
  const warehouseRecords = await prisma.warehouse.findMany()

  const inventoryData = []

  for (const product of productRecords) {
    for (const warehouse of warehouseRecords) {
      const stockValue =
        product.name === 'iPhone 15'
          ? warehouse.name === 'Chennai Warehouse'
            ? 42
            : 28
          : product.name === 'Samsung S24'
          ? warehouse.name === 'Chennai Warehouse'
            ? 35
            : 22
          : warehouse.name === 'Chennai Warehouse'
          ? 18
          : 12

      inventoryData.push({
        productId: product.id,
        warehouseId: warehouse.id,
        totalStock: stockValue,
        reservedStock: 0,
    })
    }
  }

  await prisma.inventory.createMany({ data: inventoryData })

  console.log('Seed data created successfully.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
