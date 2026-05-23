'use client'

import { Bell, Search } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import type { InventoryItem } from '@/lib/data'

interface DashboardHeaderProps {
  search: string
  setSearch: (value: string) => void
  inventory?: InventoryItem[]
}

export function DashboardHeader({
  search,
  setSearch,
  inventory,
}: DashboardHeaderProps) {

  const lowStockItems = (inventory ?? []).filter(
    (item) => item.availableStock <= 5
  )

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-3 border-b bg-background px-4 py-3 sm:flex-row sm:items-center sm:px-6">
  <div className="flex items-center gap-3">
    <SidebarTrigger className="h-10 w-10 shrink-0 rounded-lg border" />
  </div>

  <div className="flex w-full min-w-0 flex-1 items-center gap-4 sm:ml-2">
    <div className="relative w-full sm:max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        placeholder="Search inventory, reservations..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="h-11 rounded-xl pl-10 text-sm sm:h-10"
      />
    </div>
  </div>

  <div className="absolute right-4 top-3 flex items-center gap-2 sm:static">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-xl"
        >
          <Bell className="h-4 w-4" />
          {lowStockItems.length > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-[10px]">
              {lowStockItems.length}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(20rem,calc(100vw-2rem))]">
        {lowStockItems.length === 0 ? (
          <DropdownMenuItem>No low stock alerts</DropdownMenuItem>
        ) : (
          lowStockItems.slice(0, 5).map((item) => (
            <DropdownMenuItem key={item.id} className="flex-col items-start gap-1">
              <span className="text-sm font-medium">{item.productName}</span>
              <span className="text-xs text-muted-foreground">
                {item.availableStock} available in {item.warehouseName}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</header>
  )
}
