'use client'

import { useEffect, useState } from 'react'

import { InventoryCard } from '@/components/inventory-card'
import { ReservationPanel } from '@/components/reservation-panel'
import { EditProductDialog } from '@/components/edit-product-dialog'

import type {
  InventoryItem,
  Reservation,
} from '@/lib/data'

import { toast } from 'sonner'

interface InventoryDashboardProps {
  search: string
  setInventory: (inventory: InventoryItem[]) => void
  setReservations: (reservations: Reservation[]) => void
}

type ProductResponse = {
  id: string
  name: string
  inventories: {
    inventoryId: string
    warehouseId: string
    warehouseName: string
    totalStock: number
    reservedStock: number
    availableStock: number
  }[]
}

type ReservationResponse = {
  id: string
  productId: string
  productName: string
  warehouseName: string
  quantity: number
  status: Reservation['status']
  expiresAt: string
  createdAt: string
}

export function InventoryDashboard({
  search,
  setInventory,
  setReservations,
}: InventoryDashboardProps) {
  const [inventory, setInventoryState] = useState<
    InventoryItem[]
  >([])

  const [
    reservations,
    setReservationsState,
  ] = useState<Reservation[]>([])

  const [loading, setLoading] =
    useState(true)

  const [editOpen, setEditOpen] =
    useState(false)

  const [editingItem, setEditingItem] =
    useState<InventoryItem | null>(null)

  const fetchInventory = async () => {
    try {
      const response = await fetch(
        '/api/products'
      )

      const data = (await response.json()) as ProductResponse[]

      const formattedInventory: InventoryItem[] =
        data.flatMap((product) =>
          product.inventories.map(
            (inv) => ({
              id: inv.inventoryId,
              productId: product.id,
              productName: product.name,
              warehouseId: inv.warehouseId,
              warehouseName:
                inv.warehouseName,
              totalStock: inv.totalStock,
              reservedStock:
                inv.reservedStock,
              availableStock:
                inv.availableStock,

              lowStockThreshold:
                Math.max(
                  1,
                  Math.round(
                    inv.totalStock * 0.1
                  )
                ),
            })
          )
        )

      setInventoryState(
        formattedInventory
      )

      setInventory(formattedInventory)
    } catch (error) {
      console.error(
        'Failed to fetch inventory:',
        error
      )
    }
  }

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        '/api/reservations'
      )

      const data = (await response.json()) as ReservationResponse[]

      const formattedReservations: Reservation[] =
        data
          .filter(
            (reservation) =>
              reservation.status ===
                'pending' ||
              reservation.status ===
                'confirmed'
          )
          .map((reservation) => ({
            id: reservation.id,
            productId:
              reservation.productId,
            productName:
              reservation.productName,
            warehouseName:
              reservation.warehouseName,
            quantity:
              reservation.quantity,
            status: reservation.status,
            expiresAt: new Date(
              reservation.expiresAt
            ),
            createdAt: new Date(
              reservation.createdAt
            ),
          }))

      setReservationsState(
        formattedReservations
      )

      setReservations(
        formattedReservations
      )
    } catch (error) {
      console.error(
        'Failed to fetch reservations:',
        error
      )
    }
  }

  const expireReservations =
    async () => {
      try {
        await fetch(
          '/api/reservations/expire',
          {
            method: 'POST',
          }
        )
      } catch (error) {
        console.error(
          'Failed to expire reservations:',
          error
        )
      }
    }

  useEffect(() => {
    const loadData = async () => {
      await expireReservations()

      await Promise.all([
        fetchInventory(),
        fetchReservations(),
      ])

      setLoading(false)
    }

    loadData()

    const interval = setInterval(
      async () => {
        await expireReservations()

        await Promise.all([
          fetchInventory(),
          fetchReservations(),
        ])
      },
      15000
    )

    return () =>
      clearInterval(interval)
  }, [])

  const handleReserve = async (
    item: InventoryItem
  ) => {
    try {
      const response = await fetch(
        '/api/reservations',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            inventoryId: item.id,
            quantity: 1,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        toast.error(
          data.error ||
            'Reservation failed'
        )

        return
      }

      await Promise.all([
        fetchInventory(),
        fetchReservations(),
      ])

      toast.success(
        'Reservation created successfully'
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Reservation failed'
      )
    }
  }

  const handleDelete = async (
    productId: string
  ) => {
    try {
      const response = await fetch(
        `/api/products/${productId}`,
        {
          method: 'DELETE',
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        toast.error(
          data.error ||
            'Delete failed'
        )

        return
      }

      await Promise.all([
        fetchInventory(),
        fetchReservations(),
      ])

      toast.success(
        'Product deleted successfully'
      )
    } catch (error) {
      console.error(error)

      toast.error('Delete failed')
    }
  }

  const handleEdit = (
    item: InventoryItem
  ) => {
    setEditingItem(item)
    setEditOpen(true)
  }

  const handleEditSaved =
    async () => {
      await Promise.all([
        fetchInventory(),
        fetchReservations(),
      ])

      setEditOpen(false)

      setEditingItem(null)
    }

  const handleConfirm = async (
    id: string
  ) => {
    try {
      const response = await fetch(
        `/api/reservations/${id}/confirm`,
        {
          method: 'POST',
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        toast.error(
          data.error ||
            'Confirmation failed'
        )

        return
      }

      await Promise.all([
        fetchInventory(),
        fetchReservations(),
      ])

      toast.success(
        'Reservation confirmed'
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Confirmation failed'
      )
    }
  }

  const handleRelease = async (
    id: string
  ) => {
    try {
      const response = await fetch(
        `/api/reservations/${id}/release`,
        {
          method: 'POST',
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        toast.error(
          data.error ||
            'Release failed'
        )

        return
      }

      await Promise.all([
        fetchInventory(),
        fetchReservations(),
      ])

      toast.success(
        'Reservation released'
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Release failed'
      )
    }
  }

  if (loading) {
    return (
    <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-2xl bg-muted" />
        <div className="h-32 animate-pulse rounded-2xl bg-muted" />
        <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-4">
        <div className="flex min-w-0 items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground sm:text-lg">
              Inventory Items
            </h2>

            <p className="text-sm text-muted-foreground">
              {inventory.length}{' '}
              inventory records
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {inventory
            .filter((item) => {
              const searchTerm =
                search.toLowerCase()

              return (
                item.productName
                  .toLowerCase()
                  .includes(
                    searchTerm
                  ) ||
                item.warehouseName
                  .toLowerCase()
                  .includes(
                    searchTerm
                  )
              )
            })
            .map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                onReserve={
                  handleReserve
                }
                onEdit={handleEdit}
                onDelete={
                  handleDelete
                }
              />
            ))}
        </div>

        <EditProductDialog
          open={editOpen}
          item={editingItem}
          onOpenChange={(open) => {
            if (!open) {
              setEditingItem(null)
            }

            setEditOpen(open)
          }}
          onSaved={handleEditSaved}
        />
      </div>

      <div className="min-w-0 xl:sticky xl:top-24 xl:self-start">
        <ReservationPanel
          reservations={reservations.filter(
            (reservation) => {
              const searchTerm =
                search.toLowerCase()

              return (
                reservation.productName
                  .toLowerCase()
                  .includes(
                    searchTerm
                  ) ||
                reservation.warehouseName
                  .toLowerCase()
                  .includes(
                    searchTerm
                  )
              )
            }
          )}
          onConfirm={handleConfirm}
          onRelease={handleRelease}
          loading={loading}
        />
      </div>
    </div>
  )
}
