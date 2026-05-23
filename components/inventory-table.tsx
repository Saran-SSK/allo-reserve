'use client'

import { useEffect, useMemo, useState } from 'react'

type InventoryItem = {
  id: string
  productName: string
  warehouseName: string
  totalStock: number
  reservedStock: number
  availableStock: number
}

type ProductResponse = {
  name: string
  inventories: {
    inventoryId: string
    warehouseName: string
    totalStock: number
    reservedStock: number
    availableStock: number
  }[]
}

export function InventoryTable() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/products')
        const data = (await response.json()) as ProductResponse[]

        const formattedInventory: InventoryItem[] = data.flatMap(
          (product) =>
            product.inventories.map((inv) => ({
              id: inv.inventoryId,
              productName: product.name,
              warehouseName: inv.warehouseName,
              totalStock: inv.totalStock,
              reservedStock: inv.reservedStock,
              availableStock: inv.availableStock,
            }))
        )

        setInventory(formattedInventory)
      } catch (error) {
        console.error('Failed to fetch inventory', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [])

  const filteredInventory = useMemo(() => {
  return inventory.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase()) ||
    item.warehouseName.toLowerCase().includes(search.toLowerCase())
  )
}, [inventory, search])

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
    <div className="min-w-0 space-y-4">
        <input
        type="text"
        placeholder="Search products or warehouses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-11 w-full rounded-xl border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary sm:h-10"
        />

      <div className="grid gap-3 md:hidden">
        {filteredInventory.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border bg-card p-4 shadow-sm"
          >
            <div className="min-w-0 space-y-1">
              <p className="break-words text-sm font-semibold">
                {item.productName}
              </p>
              <p className="break-words text-xs text-muted-foreground">
                {item.warehouseName}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold tabular-nums">{item.totalStock}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reserved</p>
                <p className="font-semibold tabular-nums">{item.reservedStock}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="font-semibold tabular-nums">{item.availableStock}</p>
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
              Product
            </th>

            <th className="p-4 text-left text-sm font-medium">
              Warehouse
            </th>

            <th className="p-4 text-left text-sm font-medium">
              Total
            </th>

            <th className="p-4 text-left text-sm font-medium">
              Reserved
            </th>

            <th className="p-4 text-left text-sm font-medium">
              Available
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredInventory.map((item) => (
            <tr
              key={item.id}
              className="border-b last:border-0"
            >
              <td className="break-words p-4 text-sm font-medium">
                {item.productName}
              </td>

              <td className="break-words p-4 text-sm text-muted-foreground">
                {item.warehouseName}
              </td>

              <td className="p-4 text-sm">
                {item.totalStock}
              </td>

              <td className="p-4 text-sm">
                {item.reservedStock}
              </td>

              <td className="p-4 text-sm font-medium">
                {item.availableStock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}
