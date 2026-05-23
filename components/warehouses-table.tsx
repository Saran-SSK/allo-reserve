'use client'

import { useEffect, useState } from 'react'

type Warehouse = {
  warehouseName: string
  totalProducts: number
  totalUnits: number
}

type ProductResponse = {
  inventories: {
    warehouseName: string
    totalStock: number
  }[]
}

export function WarehousesTable() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch('/api/products')
        const data = (await response.json()) as ProductResponse[]

        const warehouseMap = new Map<
          string,
          { totalProducts: number; totalUnits: number }
        >()

        data.forEach((product) => {
          product.inventories.forEach((inv) => {
            if (!warehouseMap.has(inv.warehouseName)) {
              warehouseMap.set(inv.warehouseName, {
                totalProducts: 0,
                totalUnits: 0,
              })
            }

            const warehouse = warehouseMap.get(inv.warehouseName)!

            warehouse.totalProducts += 1
            warehouse.totalUnits += inv.totalStock
          })
        })

        const formattedWarehouses: Warehouse[] = Array.from(
          warehouseMap.entries()
        ).map(([warehouseName, value]) => ({
          warehouseName,
          totalProducts: value.totalProducts,
          totalUnits: value.totalUnits,
        }))

        setWarehouses(formattedWarehouses)
      } catch (error) {
        console.error('Failed to fetch warehouses', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWarehouses()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 rounded-2xl bg-muted animate-pulse" />
        <div className="h-20 rounded-2xl bg-muted animate-pulse" />
        <div className="h-20 rounded-2xl bg-muted animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-w-0">
      <div className="grid gap-3 md:hidden">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.warehouseName}
            className="rounded-2xl border bg-card p-4 shadow-sm"
          >
            <p className="break-words text-sm font-semibold">
              {warehouse.warehouseName}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Products</p>
                <p className="font-semibold tabular-nums">{warehouse.totalProducts}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Units</p>
                <p className="font-semibold tabular-nums">{warehouse.totalUnits}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
      <table className="w-full table-fixed">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="p-4 text-left text-sm font-medium">
              Warehouse
            </th>

            <th className="p-4 text-left text-sm font-medium">
              Products Stored
            </th>

            <th className="p-4 text-left text-sm font-medium">
              Total Units
            </th>
          </tr>
        </thead>

        <tbody>
          {warehouses.map((warehouse) => (
            <tr
              key={warehouse.warehouseName}
              className="border-b last:border-0"
            >
              <td className="break-words p-4 text-sm font-medium">
                {warehouse.warehouseName}
              </td>

              <td className="p-4 text-sm">
                {warehouse.totalProducts}
              </td>

              <td className="p-4 text-sm font-medium">
                {warehouse.totalUnits}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}
