import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const invalidInventory = await prisma.inventory.findMany({
    where: {
      reservedStock: {
        lt: 0,
      },
    },
    select: {
      id: true,
      totalStock: true,
      reservedStock: true,
    },
  })

  for (const inventory of invalidInventory) {
    await prisma.inventory.update({
      where: {
        id: inventory.id,
      },
      data: {
        reservedStock: Math.max(0, inventory.reservedStock),
      },
    })
  }

  console.log(
    `Repaired ${invalidInventory.length} inventory record${
      invalidInventory.length === 1 ? '' : 's'
    }.`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
