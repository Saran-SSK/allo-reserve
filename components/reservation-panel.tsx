'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
import type { Reservation } from '@/lib/data'

interface ReservationPanelProps {
  reservations: Reservation[]
  onConfirm: (id: string) => void
  onRelease: (id: string) => void
  loading?: boolean
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    variant: 'outline' as const,
    className: 'border-warning text-warning',
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle,
    variant: 'default' as const,
    className: 'bg-primary text-primary-foreground',
  },
  expired: {
    label: 'Expired',
    icon: XCircle,
    variant: 'destructive' as const,
    className: '',
  },
  released: {
    label: 'Released',
    icon: AlertCircle,
    variant: 'secondary' as const,
    className: '',
  },
}

function CountdownTimer({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)

  const calculateTimeLeft = useCallback(() => {
    const diff = expiresAt.getTime() - Date.now()
    if (diff <= 0) {
      return { display: 'Expired', urgent: true }
    }
    
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    
    return {
      display: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      urgent: minutes < 10,
    }
  }, [expiresAt])

  useEffect(() => {
    const update = () => {
      const { display, urgent } = calculateTimeLeft()
      setTimeLeft(display)
      setIsUrgent(urgent)
    }
    
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [calculateTimeLeft])

  return (
    <div className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-background/70 px-2 py-1 font-mono text-sm ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`}>
      <Clock className="h-3.5 w-3.5 shrink-0" />
      <span>{timeLeft}</span>
    </div>
  )
}

function ReservationItem({ 
  reservation, 
  onConfirm, 
  onRelease,
  index,
}: { 
  reservation: Reservation
  onConfirm: (id: string) => void
  onRelease: (id: string) => void
  index: number
}) {
  const status = statusConfig[reservation.status]
  const StatusIcon = status.icon

  return (
    <div className="group rounded-xl border border-border bg-muted/30 p-3 transition-all duration-200 hover:border-primary/20 sm:p-4">
      <div className="mb-3 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-card-foreground">
              RES-{String(index + 1).padStart(3, '0')}
            </p>
            <Badge variant={status.variant} className={`text-xs ${status.className}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>
          <p className="break-words text-xs text-muted-foreground">{reservation.productName}</p>
        </div>
        {reservation.status === 'pending' && (
          <CountdownTimer expiresAt={reservation.expiresAt} />
        )}
      </div>
      
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-card-foreground tabular-nums">{reservation.quantity}</p>
            <p className="text-xs text-muted-foreground">Units</p>
          </div>
        </div>
        
        {reservation.status === 'pending' && (
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-lg text-xs font-medium sm:h-8"
                >
                  Release
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Release Reservation?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will release reserved stock back into inventory.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">
                    Cancel
                  </AlertDialogCancel>
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
                  className="h-10 rounded-lg text-xs font-medium sm:h-8"
                >
                  Confirm
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Confirm Reservation?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently confirm the reservation
                    and deduct stock from inventory.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">
                    Cancel
                  </AlertDialogCancel>
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
        )}
        
        {reservation.status === 'confirmed' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-full rounded-lg text-xs font-medium sm:h-8 sm:w-auto"
              >
                Release
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Release Reservation?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will release reserved stock back into inventory.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onRelease(reservation.id)}
                  className="rounded-xl"
                >
                  Release Reservation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}

export function ReservationPanel({ reservations, onConfirm, onRelease, loading = false }: ReservationPanelProps) {
  const activeReservations = reservations.filter((r) => r.status === 'pending')

  return (
    <Card className="h-fit rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader className="px-4 pb-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-semibold text-card-foreground sm:text-lg">
            Active Reservations
          </CardTitle>
          <Badge variant="secondary" className="text-xs font-medium">
            {activeReservations.length} active
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-3 px-4 pt-4 sm:px-6">
        {loading ? (
          <div className="space-y-3">
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
          </div>
          ) : activeReservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-card-foreground">No active reservations</p>
            <p className="text-xs text-muted-foreground mt-1">
              Reserve inventory to see them here
            </p>
          </div>
        ) : (
          activeReservations.map((reservation, index) => (
            <ReservationItem
              key={reservation.id}
              reservation={reservation}
              onConfirm={onConfirm}
              onRelease={onRelease}
              index={index}
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}
