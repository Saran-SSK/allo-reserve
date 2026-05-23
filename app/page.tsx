'use client'

import { useState } from 'react'

import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar'

import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { StatsOverview } from '@/components/stats-overview'
import { InventoryDashboard } from '@/components/inventory-dashboard'
import { ActionButtons } from '@/components/action-buttons'
import type { InventoryItem, Reservation } from '@/lib/data'

export default function DashboardPage() {
  const [search, setSearch] = useState('')

  const [inventory, setInventory] =
    useState<InventoryItem[]>([])

  const [reservations, setReservations] =
    useState<Reservation[]>([])

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex min-w-0 flex-col">
        <DashboardHeader
          search={search}
          setSearch={setSearch}
          inventory={inventory}
        />

        <main className="min-w-0 flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-6">
            {/* Page Header */}
            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Dashboard Overview
                </h1>

                <p className="text-sm text-muted-foreground sm:text-base">
                  Real-time inventory and reservation metrics
                </p>
              </div>

              <ActionButtons />
            </div>

            {/* Stats Overview */}
            <StatsOverview
              totalProducts={
                inventory.length
              }
              activeReservations={
                reservations.length
              }
              warehouses={
                new Set(
                  inventory.map(
                    (item) =>
                      item.warehouseName
                  )
                ).size
              }
              lowStockItems={
                inventory.filter(
                  (item) =>
                    item.availableStock <= 5
                ).length
              }
            />

            {/* Main Dashboard Content */}
            <InventoryDashboard
              search={search}
              setInventory={setInventory}
              setReservations={
                setReservations
              }
            />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
