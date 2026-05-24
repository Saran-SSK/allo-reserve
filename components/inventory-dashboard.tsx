'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { InventoryCard } from '@/components/inventory-card'
import { ReservationPanel } from '@/components/reservation-panel'
import { EditProductDialog } from '@/components/edit-product-dialog'

import type {
  DashboardStats,
  InventoryItem,
  Reservation,
} from '@/lib/data'

import { toast } from 'sonner'

interface InventoryDashboardProps {
  search: string
  setInventory: (inventory: InventoryItem[]) => void
  setReservations: (reservations: Reservation[]) => void
  setStats: (stats: DashboardStats) => void
  refreshKey: number
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

type DashboardResponse = {
  stats: DashboardStats
  inventory: InventoryItem[]
  reservations: ReservationResponse[]
}

let cachedDashboardData: DashboardResponse | null = null
let dashboardFetchPromise: Promise<DashboardResponse> | null = null

export function InventoryDashboard({
  search,
  setInventory,
  setReservations,
  setStats,
  refreshKey,
}: InventoryDashboardProps) {
  const [inventory, setInventoryState] = useState<InventoryItem[]>([])
  const [reservations, setReservationsState] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [actionPending, setActionPending] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const isFetchingRef = useRef(false)
  const fetchVersionRef = useRef(0)

  const normalizeReservations = (data: ReservationResponse[]) =>
    data
      .filter((reservation) => reservation.status === 'pending')
      .map((reservation) => ({
        id: reservation.id,
        productId: reservation.productId,
        productName: reservation.productName,
        warehouseName: reservation.warehouseName,
        quantity: reservation.quantity,
        status: reservation.status,
        expiresAt: new Date(reservation.expiresAt),
        createdAt: new Date(reservation.createdAt),
      }))

  const buildStats = useCallback(
    (items: InventoryItem[], activeReservations: Reservation[]) => ({
      totalProducts: items.length,
      activeReservations: activeReservations.length,
      warehouses: new Set(items.map((item) => item.warehouseId)).size,
      lowStockItems: items.filter(
        (item) => item.availableStock <= item.lowStockThreshold
      ).length,
    }),
    []
  )

  const updateDashboardState = useCallback((
    items: InventoryItem[],
    activeReservations: Reservation[],
    stats?: DashboardStats
  ) => {
    setInventoryState(items)
    setInventory(items)
    setReservationsState(activeReservations)
    setReservations(activeReservations)
    setStats(stats ?? buildStats(items, activeReservations))
  }, [buildStats, setInventory, setReservations, setStats])

  const fetchDashboardData = useCallback(async (force = false) => {
    if (!force && cachedDashboardData) {
      return cachedDashboardData
    }

    if (!force && dashboardFetchPromise) {
      return dashboardFetchPromise
    }

    dashboardFetchPromise = fetch('/api/dashboard')
      .then(async (response) => {
        const data = await response.json()

        if (!response.ok) {
          throw data
        }

        cachedDashboardData = data as DashboardResponse
        return cachedDashboardData
      })
      .finally(() => {
        dashboardFetchPromise = null
      })

    return dashboardFetchPromise
  }, [])

  const loadServerState = useCallback(async (force = false) => {
    if (isFetchingRef.current && !force) return

    isFetchingRef.current = true
    const fetchVersion = ++fetchVersionRef.current

    try {
      const data = await fetchDashboardData(force)

      if (fetchVersion !== fetchVersionRef.current) {
        return
      }

      updateDashboardState(
        data.inventory,
        normalizeReservations(data.reservations),
        data.stats
      )
    } catch (error) {
      console.error('Failed to load dashboard data', error)
      toast.error('Failed to load dashboard data')
    } finally {
      if (fetchVersion === fetchVersionRef.current) {
        isFetchingRef.current = false
        setLoading(false)
      }
    }
  }, [fetchDashboardData, updateDashboardState])

  const expireReservations = async () => {
    try {
      const response = await fetch('/api/reservations/expire', {
        method: 'POST',
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        console.error('Expire reservations request failed', errorBody)
        return
      }

      const data = await response.json()

      if (typeof data.expiredCount === 'number' && data.expiredCount > 0) {
        await loadServerState(true)
      }
    } catch (error) {
      console.error('Failed to expire reservations:', error)
    }
  }

  useEffect(() => {
    loadServerState()
  }, [loadServerState])

  useEffect(() => {
    if (refreshKey === 0) return

    cachedDashboardData = null
    loadServerState(true)
  }, [loadServerState, refreshKey])

  useEffect(() => {
    const interval = window.setInterval(() => {
      expireReservations()
    }, 60000)

    return () => window.clearInterval(interval)
  }, [])

  const handleReserve = async (item: InventoryItem) => {
    if (actionPending) return

    const originalInventory = inventory
    const originalReservations = reservations

    const updatedInventory = inventory.map((current) =>
      current.id === item.id
        ? {
            ...current,
            reservedStock: Math.max(0, current.reservedStock) + 1,
            availableStock: Math.max(
              0,
              current.totalStock - (Math.max(0, current.reservedStock) + 1)
            ),
          }
        : current
    )

    const optimisticReservation: Reservation = {
      id: `temp-${item.id}-${Date.now()}`,
      productId: item.productId,
      productName: item.productName,
      warehouseName: item.warehouseName,
      quantity: 1,
      status: 'pending',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      createdAt: new Date(),
    }

    const optimisticReservations = [optimisticReservation, ...reservations]

    updateDashboardState(updatedInventory, optimisticReservations)
    setActionPending(true)

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventoryId: item.id,
          quantity: 1,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw data
      }

      const confirmedReservation: Reservation = {
        ...optimisticReservation,
        id: data.id,
        expiresAt: new Date(data.expiresAt),
        createdAt: new Date(data.createdAt),
      }

      const nextReservations = optimisticReservations.map((reservation) =>
        reservation.id === optimisticReservation.id
          ? confirmedReservation
          : reservation
      )

      cachedDashboardData = null
      updateDashboardState(updatedInventory, nextReservations)
      toast.success('Reservation created successfully')
    } catch (error) {
      updateDashboardState(originalInventory, originalReservations)
      console.error('Reservation failed:', error)
      toast.error(
        (error && typeof error === 'object' && 'error' in error
          ? (error as any).error
          : 'Reservation failed') as string
      )
      await loadServerState(true)
    } finally {
      setActionPending(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (actionPending) return

    const originalInventory = inventory
    const originalReservations = reservations
    const filteredInventory = inventory.filter(
      (item) => item.productId !== productId
    )
    const filteredReservations = reservations.filter(
      (reservation) => reservation.productId !== productId
    )

    updateDashboardState(filteredInventory, filteredReservations)
    setActionPending(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw data
      }

      cachedDashboardData = null
      toast.success('Product deleted successfully')
    } catch (error) {
      updateDashboardState(originalInventory, originalReservations)
      console.error('Delete failed:', error)
      toast.error(
        (error && typeof error === 'object' && 'error' in error
          ? (error as any).error
          : 'Delete failed') as string
      )
      await loadServerState(true)
    } finally {
      setActionPending(false)
    }
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setEditOpen(true)
  }

  const handleEditSaved = async () => {
    setActionPending(true)
    try {
      await loadServerState(true)
    } finally {
      setActionPending(false)
      setEditOpen(false)
      setEditingItem(null)
    }
  }

  const handleConfirm = async (id: string) => {
    if (actionPending) return

    const reservation = reservations.find((item) => item.id === id)

    if (!reservation) {
      return
    }

    const originalInventory = inventory
    const originalReservations = reservations
    const updatedReservations = reservations.filter((item) => item.id !== id)
    const updatedInventory = inventory.map((item) => {
      if (
        item.productId !== reservation.productId ||
        item.warehouseName !== reservation.warehouseName
      ) {
        return item
      }

      const reservedStock = Math.max(0, item.reservedStock - reservation.quantity)
      const totalStock = Math.max(0, item.totalStock - reservation.quantity)

      return {
        ...item,
        reservedStock,
        totalStock,
        availableStock: Math.max(0, totalStock - reservedStock),
      }
    })

    updateDashboardState(updatedInventory, updatedReservations)
    setActionPending(true)

    try {
      const response = await fetch(`/api/reservations/${id}/confirm`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw data
      }

      cachedDashboardData = null
      toast.success('Reservation confirmed')
    } catch (error) {
      updateDashboardState(originalInventory, originalReservations)
      console.error('Confirmation failed:', error)
      toast.error(
        (error && typeof error === 'object' && 'error' in error
          ? (error as any).error
          : 'Confirmation failed') as string
      )
      await loadServerState(true)
    } finally {
      setActionPending(false)
    }
  }

  const handleRelease = async (id: string) => {
    if (actionPending) return

    const reservation = reservations.find((item) => item.id === id)

    if (!reservation) {
      return
    }

    const originalInventory = inventory
    const originalReservations = reservations
    const updatedReservations = reservations.filter((item) => item.id !== id)
    const updatedInventory = inventory.map((item) => {
      if (
        item.productId !== reservation.productId ||
        item.warehouseName !== reservation.warehouseName
      ) {
        return item
      }

      const reservedStock = Math.max(0, item.reservedStock - reservation.quantity)

      return {
        ...item,
        reservedStock,
        availableStock: Math.max(0, item.totalStock - reservedStock),
      }
    })

    updateDashboardState(updatedInventory, updatedReservations)
    setActionPending(true)

    try {
      const response = await fetch(`/api/reservations/${id}/release`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw data
      }

      cachedDashboardData = null
      toast.success('Reservation released')
    } catch (error) {
      updateDashboardState(originalInventory, originalReservations)
      console.error('Release failed:', error)
      toast.error(
        (error && typeof error === 'object' && 'error' in error
          ? (error as any).error
          : 'Release failed') as string
      )
      await loadServerState(true)
    } finally {
      setActionPending(false)
    }
  }

  const filteredInventory = useMemo(() => {
    const term = search.toLowerCase()
    return inventory.filter(
      (item) =>
        item.productName.toLowerCase().includes(term) ||
        item.warehouseName.toLowerCase().includes(term)
    )
  }, [inventory, search])

  const filteredReservations = useMemo(() => {
    const term = search.toLowerCase()
    return reservations.filter(
      (reservation) =>
        reservation.productName.toLowerCase().includes(term) ||
        reservation.warehouseName.toLowerCase().includes(term)
    )
  }, [reservations, search])

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-4">
        <div className="flex min-w-0 items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground sm:text-lg">
              Inventory Items
            </h2>

            <p className="text-sm text-muted-foreground">
              {inventory.length} inventory records
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-2xl bg-muted"
                />
              ))
            : filteredInventory.map((item) => (
                <InventoryCard
                  key={item.id}
                  item={item}
                  onReserve={handleReserve}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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
          reservations={filteredReservations}
          onConfirm={handleConfirm}
          onRelease={handleRelease}
          loading={loading}
        />
      </div>
    </div>
  )
}
