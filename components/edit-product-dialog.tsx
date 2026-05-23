'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { InventoryItem } from '@/lib/data'

interface EditProductDialogProps {
  open: boolean
  item: InventoryItem | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function EditProductDialog({
  open,
  item,
  onOpenChange,
  onSaved,
}: EditProductDialogProps) {
  const [name, setName] = useState('')
  const [warehouseName, setWarehouseName] = useState('')
  const [stock, setStock] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!item) {
      setName('')
      setWarehouseName('')
      setStock(0)
      return
    }

    setName(item.productName)
    setWarehouseName(item.warehouseName)
    setStock(item.totalStock)
  }, [item])

  const handleSave = async () => {
    if (!item) {
      return
    }

    if (!name.trim() || !warehouseName.trim() || stock < 0) {
      toast.error('Please provide valid values for all fields.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/products/${item.productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventoryId: item.id,
          name: name.trim(),
          warehouseName: warehouseName.trim(),
          totalStock: stock,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to update product')
        return
      }

      onSaved()
      toast.success('Product updated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto rounded-2xl p-4 sm:max-w-md sm:p-6">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 sm:py-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Product name"
              className="h-11 sm:h-10"
            />
          </div>

          <div className="space-y-2">
            <Label>Warehouse Name</Label>
            <Input
              value={warehouseName}
              onChange={(event) => setWarehouseName(event.target.value)}
              placeholder="Warehouse name"
              className="h-11 sm:h-10"
            />
          </div>

          <div className="space-y-2">
            <Label>Total Stock</Label>
            <Input
              type="number"
              value={stock}
              onChange={(event) => setStock(Number(event.target.value))}
              className="h-11 sm:h-10"
            />
          </div>

          <div className="grid gap-2 pt-2 sm:flex sm:items-center sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-11 sm:h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="h-11 sm:h-10"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
