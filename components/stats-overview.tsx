'use client'

import {
  Package,
  ClipboardList,
  Warehouse,
  AlertTriangle,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

interface StatsOverviewProps {
  totalProducts: number
  activeReservations: number
  warehouses: number
  lowStockItems: number
}

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
}

function StatsCard({
  title,
  value,
  icon,
}: StatsCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 space-y-2 sm:space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <p className="text-2xl font-bold tabular-nums text-card-foreground sm:text-3xl">
              {value}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:h-11 sm:w-11">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsOverview({
  totalProducts,
  activeReservations,
  warehouses,
  lowStockItems,
}: StatsOverviewProps) {
  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Active Reservations',
      value: activeReservations,
      icon: <ClipboardList className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Warehouses',
      value: warehouses,
      icon: <Warehouse className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems,
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          {...stat}
        />
      ))}
    </div>
  )
}
