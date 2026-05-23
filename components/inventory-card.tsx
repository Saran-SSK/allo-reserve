'use client'

import { Package, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { InventoryItem } from '@/lib/data'
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

interface InventoryCardProps {
  item: InventoryItem
  onReserve: (item: InventoryItem) => void
  onEdit: (item: InventoryItem) => void
  onDelete: (id: string) => void
}

export function InventoryCard({
  item,
  onReserve,
  onEdit,
  onDelete,
}: InventoryCardProps) {
  const lowStockThreshold = item.lowStockThreshold ?? 5

  const isLowStock =
    item.availableStock <= lowStockThreshold

  const reservedPercentage =
    item.totalStock > 0
      ? (item.reservedStock / item.totalStock) * 100
      : 0

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md">
      <CardHeader className="px-4 pb-3 sm:px-6">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0 space-y-0.5">
              <CardTitle className="break-words text-base font-semibold leading-tight text-card-foreground">
                {item.productName}
              </CardTitle>

              <p className="break-words text-xs text-muted-foreground">
                {item.warehouseName}
              </p>

              {isLowStock && (
                <div className="mt-2 inline-flex items-center rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Low Stock
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Total
            </p>

            <p className="tabular-nums text-lg font-bold text-card-foreground sm:text-xl">
              {item.totalStock.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Reserved
            </p>

            <p className="tabular-nums text-lg font-bold text-primary sm:text-xl">
              {item.reservedStock.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Available
            </p>

            <p
              className={`tabular-nums text-lg font-bold sm:text-xl ${
                isLowStock
                  ? 'text-destructive'
                  : 'text-card-foreground'
              }`}
            >
              {item.availableStock.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Stock utilization
            </span>

            <span className="font-medium text-card-foreground">
              {Math.round(reservedPercentage)}% reserved
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isLowStock
                  ? 'bg-destructive'
                  : 'bg-primary'
              }`}
              style={{
                width: `${reservedPercentage}%`,
              }}
            />
          </div>
        </div>

        <Button
          onClick={() => onReserve(item)}
          className="h-11 w-full rounded-xl font-medium transition-all sm:h-10"
          disabled={item.availableStock === 0}
        >
          Reserve Stock
        </Button>

        <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(item)}
            className="h-11 rounded-xl sm:h-10"
          >
            Edit
          </Button>

          <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button
      variant="destructive"
      size="sm"
      className="h-11 rounded-xl sm:h-10"
    >
      Delete
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent className="rounded-2xl">
    <AlertDialogHeader>
      <AlertDialogTitle>
        Delete Product?
      </AlertDialogTitle>

      <AlertDialogDescription>
        This action cannot be undone.
        This will permanently delete the
        product and all inventory records.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel className="rounded-xl">
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={() =>
          onDelete(item.productId)
        }
        className="rounded-xl bg-destructive text-white hover:bg-destructive/90"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
