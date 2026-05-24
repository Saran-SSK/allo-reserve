'use client'

import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AddProductDialog } from '@/components/add-product-dialog'

type ProductExportResponse = {
  name: string
  inventories: {
    warehouseName: string
    totalStock: number
    reservedStock: number
    availableStock: number
  }[]
}

interface ActionButtonsProps {
  onProductAdded?: () => void | Promise<void>
}

export function ActionButtons({ onProductAdded }: ActionButtonsProps) {
  const handleExport = async () => {
    try {
      const response = await fetch('/api/products')
      const products = (await response.json()) as ProductExportResponse[]

      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += 'Product Name,Warehouse,Total Stock,Reserved Stock,Available Stock\n'

      products.forEach((product) => {
        product.inventories.forEach((inv) => {
          const row = [
            `"${product.name}"`,
            `"${inv.warehouseName}"`,
            inv.totalStock,
            inv.reservedStock,
            inv.availableStock,
          ].join(',')
          csvContent += row + '\n'
        })
      })

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `inventory-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Inventory exported successfully')
    } catch (error) {
      console.error(error)
      toast.error('Export failed')
    }
  }

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
      <Button
        variant="outline"
        size="sm"
        className="h-10 rounded-xl sm:h-9"
        onClick={handleExport}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>

      <AddProductDialog onProductAdded={onProductAdded} />
    </div>
  )
}
