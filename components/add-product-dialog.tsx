'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddProductDialogProps {
  onProductAdded?: () => void
}

export function AddProductDialog({
  onProductAdded,
}: AddProductDialogProps) {
  const [open, setOpen] = useState(false)

  const [name, setName] = useState('')
  const [warehouseName, setWarehouseName] = useState('')
  const [stock, setStock] = useState(0)

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          warehouseName,
          stock,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to add product')
        return
      }

      setOpen(false)

      setName('')
      setWarehouseName('')
      setStock(0)

      onProductAdded?.()

      toast.success('Product added successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-10 w-full rounded-xl sm:h-9 sm:w-auto">
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto rounded-2xl p-4 sm:max-w-md sm:p-6">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 sm:py-4">
          <div className="space-y-2">
            <Label>Product Name</Label>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="MacBook Pro"
              className="h-11 sm:h-10"
            />
          </div>

          <div className="space-y-2">
            <Label>Warehouse Name</Label>

            <Input
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
              placeholder="Chennai Warehouse"
              className="h-11 sm:h-10"
            />
          </div>

          <div className="space-y-2">
            <Label>Initial Stock</Label>

            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="h-11 sm:h-10"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="h-11 w-full sm:h-10"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
