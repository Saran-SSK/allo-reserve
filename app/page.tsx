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
import type { DashboardStats, InventoryItem, Reservation } from '@/lib/data'

const emptyStats: DashboardStats = {
  totalProducts: 0,
  activeReservations: 0,
  warehouses: 0,
  lowStockItems: 0,
}

export default function DashboardPage() {
  const [search, setSearch] = useState('')

  const [inventory, setInventory] =
    useState<InventoryItem[]>([])

  const [, setReservations] =
    useState<Reservation[]>([])

  const [stats, setStats] =
    useState<DashboardStats>(emptyStats)

  const [dashboardRefreshKey, setDashboardRefreshKey] =
    useState(0)

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

              <ActionButtons
                onProductAdded={() => {
                  setDashboardRefreshKey((key) => key + 1)
                }}
              />
            </div>

            {/* Stats Overview */}
            <StatsOverview
              totalProducts={
                stats.totalProducts
              }
              activeReservations={
                stats.activeReservations
              }
              warehouses={
                stats.warehouses
              }
              lowStockItems={
                stats.lowStockItems
              }
            />

            {/* Main Dashboard Content */}
            <InventoryDashboard
              search={search}
              setInventory={setInventory}
              setReservations={
                setReservations
              }
              setStats={setStats}
              refreshKey={dashboardRefreshKey}
            />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
