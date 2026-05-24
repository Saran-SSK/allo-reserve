'use client'

import { useCallback, useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type Reservation = {
  id: string
  productName: string
  warehouseName: string
  quantity: number
  status: 'pending' | 'confirmed' | 'released' | 'expired'
  expiresAt: string
  createdAt: string
}

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'outline' as const,
    className: 'border-warning text-warning',
  },
  confirmed: {
    label: 'Confirmed',
    variant: 'default' as const,
    className: 'bg-primary text-primary-foreground',
  },
  released: {
    label: 'Released',
    variant: 'secondary' as const,
    className: '',
  },
  expired: {
    label: 'Expired',
    variant: 'destructive' as const,
    className: '',
  },
}

function getActionErrorMessage(status: number, fallback: string) {
  if (status === 409) {
    return 'Not enough stock available'
  }

  if (status === 410) {
    return 'Reservation expired'
  }

  return fallback
}

function CountdownTimer({
  expiresAt,
  now,
}: {
  expiresAt: string
  now: number
}) {
  const diff = new Date(expiresAt).getTime() - now

  if (diff <= 0) {
    return <span className="text-sm text-muted-foreground">Finalized</span>
  }

  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  const isUrgent = minutes < 2

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono text-sm ${
        isUrgent ? 'text-destructive' : 'text-muted-foreground'
      }`}
    >
      <Clock className="h-3.5 w-3.5 shrink-0" />
      <span>
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')} remaining
      </span>
    </div>
  )
}

function ReservationStatusBadge({ status }: { status: Reservation['status'] }) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}

function ReservationTimeLeft({
  reservation,
  mounted,
  now,
}: {
  reservation: Reservation
  mounted: boolean
  now: number
}) {
  const isPending = reservation.status === 'pending'

  if (!isPending) {
    return <span className="text-sm text-muted-foreground">Finalized</span>
  }

  if (!mounted) {
    return <span className="text-sm text-muted-foreground">Pending</span>
  }

  const isActive = new Date(reservation.expiresAt).getTime() > now

  if (!isActive) {
    return <span className="text-sm text-muted-foreground">Finalized</span>
  }

  return <CountdownTimer expiresAt={reservation.expiresAt} now={now} />
}

function ReservationActions({
  reservation,
  actionPending,
  mounted,
  now,
  onConfirm,
  onRelease,
}: {
  reservation: Reservation
  actionPending: boolean
  mounted: boolean
  now: number
  onConfirm: (id: string) => void
  onRelease: (id: string) => void
}) {
  if (reservation.status !== 'pending') {
    return (
      <span className="text-sm text-muted-foreground">
        {statusConfig[reservation.status].label}
      </span>
    )
  }

  if (!mounted) {
    return <span className="text-sm text-muted-foreground">Pending</span>
  }

  const isActive = new Date(reservation.expiresAt).getTime() > now

  if (!isActive) {
    return <span className="text-sm text-muted-foreground">Expired</span>
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={actionPending}
            className="h-10 rounded-lg text-xs font-medium sm:h-8"
          >
            Release
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Release Reservation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will release reserved stock back into inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onRelease(reservation.id)}
              className="rounded-xl"
            >
              Release Reservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            disabled={actionPending}
            className="h-10 rounded-lg text-xs font-medium sm:h-8"
          >
            Confirm
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Reservation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently confirm the reservation and deduct stock
              from inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onConfirm(reservation.id)}
              className="rounded-xl"
            >
              Confirm Reservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function ReservationsTable() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [actionPending, setActionPending] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(0)

  const fetchReservations = useCallback(async () => {
    const response = await fetch('/api/reservations')
    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    setReservations(data)
  }, [])

  const refreshReservations = useCallback(async () => {
    try {
      await fetch('/api/reservations/expire', { method: 'POST' })
      await fetchReservations()
    } catch (error) {
      console.error('Failed to fetch reservations', error)
      toast.error('Failed to refresh reservations')
    } finally {
      setLoading(false)
    }
  }, [fetchReservations])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const timeout = window.setTimeout(() => {
      refreshReservations()
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [mounted, refreshReservations])

  useEffect(() => {
    if (!mounted) return

    const interval = window.setInterval(() => {
      refreshReservations()
    }, 60000)

    return () => window.clearInterval(interval)
  }, [mounted, refreshReservations])

  useEffect(() => {
    if (!mounted) return

    setNow(Date.now())

    const interval = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [mounted])

  const updateReservationStatus = async (
    id: string,
    status: Reservation['status'],
    endpoint: 'confirm' | 'release'
  ) => {
    if (actionPending) return

    const originalReservations = reservations

    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === id ? { ...reservation, status } : reservation
      )
    )
    setActionPending(true)

    try {
      const response = await fetch(`/api/reservations/${id}/${endpoint}`, {
        method: 'POST',
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const fallback =
          data && typeof data === 'object' && 'error' in data
            ? String(data.error)
            : 'Reservation action failed'

        throw new Error(getActionErrorMessage(response.status, fallback))
      }

      toast.success(
        status === 'confirmed'
          ? 'Reservation confirmed'
          : 'Reservation released'
      )
      await refreshReservations()
    } catch (error) {
      setReservations(originalReservations)
      console.error('Reservation action failed:', error)
      toast.error(
        error instanceof Error ? error.message : 'Reservation action failed'
      )
      await refreshReservations()
    } finally {
      setActionPending(false)
    }
  }

  const handleConfirm = (id: string) => {
    updateReservationStatus(id, 'confirmed', 'confirm')
  }

  const handleRelease = (id: string) => {
    updateReservationStatus(id, 'released', 'release')
  }

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
        {reservations.map((reservation, index) => (
          <div
            key={reservation.id}
            className="rounded-2xl border bg-card p-4 shadow-sm"
          >
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold">
                  RES-{String(index + 1).padStart(3, '0')}
                </p>
                <p className="break-words text-xs text-muted-foreground">
                  {reservation.productName}
                </p>
              </div>
              <ReservationStatusBadge status={reservation.status} />
            </div>

            <div className="mt-4 grid gap-3 text-sm min-[380px]:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Warehouse</p>
                <p className="break-words font-medium">{reservation.warehouseName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Quantity</p>
                <p className="font-medium tabular-nums">{reservation.quantity}</p>
              </div>
              <div className="min-[380px]:col-span-2">
                <p className="text-xs text-muted-foreground">Expires At</p>
                <p className="break-words font-medium">
                  {new Date(reservation.expiresAt).toLocaleString()}
                </p>
              </div>
              <div className="min-[380px]:col-span-2">
                <p className="text-xs text-muted-foreground">Time Left</p>
                <div className="mt-1">
                  <ReservationTimeLeft
                    reservation={reservation}
                    mounted={mounted}
                    now={now}
                  />
                </div>
              </div>
              <div className="min-[380px]:col-span-2">
                <p className="text-xs text-muted-foreground">Actions</p>
                <div className="mt-2">
                  <ReservationActions
                    reservation={reservation}
                    actionPending={actionPending}
                    mounted={mounted}
                    now={now}
                    onConfirm={handleConfirm}
                    onRelease={handleRelease}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-[13%]" />
          <col className="w-[18%]" />
          <col className="w-[16%]" />
          <col className="w-[9%]" />
          <col className="w-[11%]" />
          <col className="w-[17%]" />
          <col className="w-[16%]" />
        </colgroup>
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="p-4 text-left text-sm font-medium">
              Reservation ID
            </th>

            <th className="p-4 text-left text-sm font-medium">
              Product
            </th>

            <th className="p-4 text-left text-sm font-medium">
                Warehouse
            </th>

            <th className="p-4 text-left text-sm font-medium">
              Quantity
            </th>

            <th className="p-4 text-left text-sm font-medium">
              Status
            </th>

            <th className="p-4 text-left text-sm font-medium">
              Expires At
            </th>

            <th className="p-4 text-left text-sm font-medium">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((reservation, index) => (
            <tr
              key={reservation.id}
              className="border-b last:border-0"
            >
              <td className="p-4 text-sm font-medium">
                RES-{String(index + 1).padStart(3, '0')}
              </td>

              <td className="break-words p-4 text-sm">
                {reservation.productName}
              </td>

              <td className="break-words p-4 text-sm text-muted-foreground">
                {reservation.warehouseName}
              </td>

              <td className="p-4 text-sm">
                {reservation.quantity}
              </td>

              <td className="p-4">
                <ReservationStatusBadge status={reservation.status} />
              </td>

              <td className="p-4">
                <p className="break-words text-sm text-muted-foreground">
                  {new Date(reservation.expiresAt).toLocaleString()}
                </p>
                <div className="mt-1">
                  <ReservationTimeLeft
                    reservation={reservation}
                    mounted={mounted}
                    now={now}
                  />
                </div>
              </td>

              <td className="p-4">
                <ReservationActions
                  reservation={reservation}
                  actionPending={actionPending}
                  mounted={mounted}
                  now={now}
                  onConfirm={handleConfirm}
                  onRelease={handleRelease}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}
