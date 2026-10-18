export type Role = 'Administrador' | 'Operador' | 'Consulta'

export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'preparacion'
  | 'listo'
  | 'entregado'
  | 'cancelado'
  | 'no_retirado'

export type WaStatus = 'sin_enviar' | 'enviado' | 'entregado' | 'leido'

export interface Size {
  id: string
  label: string
  oz: number
  delta: number
}

export interface Extra {
  id: string
  label: string
  price: number
  inv?: { item: string; qty: number }
}

export interface Product {
  id: string
  name: string
  category: 'Especiales' | 'Clásicos'
  desc: string
  img: string
  base: number
  available: boolean
}

export interface CartLine {
  key: string
  productId: string
  sizeId: string
  extras: string[]
  qty: number
  note: string
}

export interface Promo {
  id: string
  name: string
  desc: string
  type: 'bxgy' | 'percent'
  buy?: number
  free?: number
  percent?: number
  category?: Product['category']
  productId?: string
  active: boolean
  until: string
}

export interface InventoryItem {
  id: string
  name: string
  unit: string
  stock: number
  reserved: number
  min: number
  cost: number
}

export interface OrderLine {
  productId: string
  name: string
  category: Product['category']
  sizeLabel: string
  extras: string[]
  unitPrice: number
  qty: number
  cost: number
  need: Record<string, number>
}

export interface Order {
  code: string
  name: string
  phone: string
  notes: string
  lines: OrderLine[]
  subtotal: number
  discount: number
  total: number
  cost: number
  status: OrderStatus
  wa: WaStatus
  paid: boolean
  reserved: boolean
  consumed: boolean
  createdAt: number
  log: { at: number; text: string }[]
}

export interface DayStat {
  date: string
  sales: number
  orders: number
  cost: number
  expenses: number
}
