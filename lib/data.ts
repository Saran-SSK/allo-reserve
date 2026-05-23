export type InventoryItem = {
  id: string
  productId: string
  productName: string
  warehouseId: string
  warehouseName: string
  totalStock: number
  reservedStock: number
  availableStock: number
  lowStockThreshold: number
}

export type ReservationStatus = 'pending' | 'confirmed' | 'released' | 'expired'

export type Reservation = {
  id: string
  productId: string
  productName: string
  warehouseName: string
  quantity: number
  status: ReservationStatus
  expiresAt: Date
  createdAt: Date
}

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-001',
    productId: 'prod-001',
    productName: 'iPhone 15',
    warehouseId: 'wh-001',
    warehouseName: 'Chennai Warehouse',
    totalStock: 120,
    reservedStock: 18,
    availableStock: 102,
    lowStockThreshold: 15,
  },
  {
    id: 'inv-002',
    productId: 'prod-002',
    productName: 'Samsung S24',
    warehouseId: 'wh-002',
    warehouseName: 'Bangalore Warehouse',
    totalStock: 88,
    reservedStock: 24,
    availableStock: 64,
    lowStockThreshold: 10,
  },
  {
    id: 'inv-003',
    productId: 'prod-003',
    productName: 'AirPods Pro',
    warehouseId: 'wh-001',
    warehouseName: 'Chennai Warehouse',
    totalStock: 56,
    reservedStock: 9,
    availableStock: 47,
    lowStockThreshold: 8,
  },
]

export const mockReservations: Reservation[] = [
  {
    id: 'RES-001',
    productId: 'prod-001',
    productName: 'iPhone 15',
    warehouseName: 'Chennai Warehouse',
    quantity: 2,
    status: 'pending',
    expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: 'RES-002',
    productId: 'prod-003',
    productName: 'AirPods Pro',
    warehouseName: 'Chennai Warehouse',
    quantity: 1,
    status: 'confirmed',
    expiresAt: new Date(Date.now() + 1000 * 60 * 45),
    createdAt: new Date(Date.now() - 1000 * 60 * 25),
  },
]
