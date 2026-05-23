'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

type Reservation = {
  id: string
  productName: string
  warehouseName: string
  quantity: number
  status: string
  expiresAt: string
}

export function ReservationsTable() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/reservations')
        const data = await response.json()

        setReservations(data)
      } catch (error) {
        console.error('Failed to fetch reservations', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
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
              <Badge className="shrink-0">
                {reservation.status}
              </Badge>
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
            </div>
          </div>
        ))}
      </div>

    <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
      <table className="w-full table-fixed">
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
                <Badge>
                  {reservation.status}
                </Badge>
              </td>

              <td className="break-words p-4 text-sm text-muted-foreground">
                {new Date(reservation.expiresAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}
