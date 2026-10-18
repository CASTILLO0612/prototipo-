import type { Extra, InventoryItem, Product, Promo, Size } from './types'

export const BUSINESS = {
  name: 'Copo Ice',
  slogan: 'Frío que se antoja',
  address: 'De los bomberos 1c y ½ al sur',
  phone: '7555 6228',
  waNumber: '50575556228',
  instagram: '@copoicenicaragua',
  currency: 'C$',
}

export const PALETTE = [
  { name: 'Rosa Copo', hex: '#EC1F7A', use: 'Acción principal, acentos' },
  { name: 'Azul Hielo', hex: '#1AB3E0', use: 'Marca, información' },
  { name: 'Crema', hex: '#FFFAF5', use: 'Fondo general' },
  { name: 'Tinta', hex: '#1E2A3A', use: 'Texto principal' },
  { name: 'Rosa Suave', hex: '#FDE8F1', use: 'Superficies de acento' },
  { name: 'Azul Suave', hex: '#E3F6FC', use: 'Superficies informativas' },
]

export const SIZES: Size[] = [
  { id: 's12', label: 'Pequeño', oz: 12, delta: -10 },
  { id: 's16', label: 'Mediano', oz: 16, delta: 0 },
  { id: 's22', label: 'Grande', oz: 22, delta: 25 },
]

/** Receta estándar por tamaño (cantidades ilustrativas, pendientes de validar). */
export const RECIPE: Record<string, Record<string, number>> = {
  s12: { hielo: 250, jarabe: 45, vaso: 1, cuchara: 1 },
  s16: { hielo: 350, jarabe: 60, vaso: 1, cuchara: 1 },
  s22: { hielo: 480, jarabe: 80, vaso: 1, cuchara: 1 },
}

export const EXTRAS: Extra[] = [
  { id: 'leche', label: 'Leche condensada', price: 10, inv: { item: 'leche', qty: 20 } },
  { id: 'coco', label: 'Coco rallado', price: 8, inv: { item: 'coco', qty: 15 } },
  { id: 'granola', label: 'Granola', price: 10, inv: { item: 'granola', qty: 20 } },
  { id: 'fresa', label: 'Fresa en trozos', price: 15, inv: { item: 'fresa', qty: 40 } },
  { id: 'torta', label: 'Torta al centro', price: 20, inv: { item: 'torta', qty: 1 } },
]

export const PRODUCTS: Product[] = [
  {
    id: 'oreo',
    name: 'Especial Oreo y Fresa',
    category: 'Especiales',
    desc: 'Galleta triturada, fresa natural y leche condensada.',
    img: '/img/oreo.png',
    base: 110,
    available: true,
  },
  {
    id: 'enfrutado',
    name: 'Enfrutado de Piña',
    category: 'Especiales',
    desc: 'Trozos de fresa y piña, granola y leche condensada.',
    img: '/img/enfrutado.jpg',
    base: 100,
    available: true,
  },
  {
    id: 'pina-fresa',
    name: 'Enfrutado Piña y Fresa',
    category: 'Especiales',
    desc: 'Fresa fresca con leche condensada, sabor balanceado.',
    img: '/img/pina-fresa.jpg',
    base: 100,
    available: true,
  },
  {
    id: 'pitahaya',
    name: 'Raspado de Pitahaya',
    category: 'Especiales',
    desc: 'Miel de pitahaya, 100% fruta natural.',
    img: '/img/pitahaya.jpg',
    base: 90,
    available: true,
  },
  {
    id: 'relleno',
    name: 'Raspado Relleno',
    category: 'Especiales',
    desc: 'Miel de leche con torta y coco rallado.',
    img: '/img/relleno.jpg',
    base: 95,
    available: true,
  },
  {
    id: 'leche',
    name: 'Raspado de Leche',
    category: 'Clásicos',
    desc: 'El tradicional, con leche condensada.',
    img: '/img/leche.jpg',
    base: 60,
    available: true,
  },
  {
    id: 'pina-coco',
    name: 'Raspado de Piña',
    category: 'Clásicos',
    desc: 'Piña acompañada de coco rallado.',
    img: '/img/pina-coco.jpg',
    base: 60,
    available: true,
  },
]

export const PROMOS: Promo[] = [
  {
    id: 'p1',
    name: 'Compra 2, el 3.º gratis',
    desc: 'En raspados Clásicos. El más económico es gratis.',
    type: 'bxgy',
    buy: 2,
    free: 1,
    category: 'Clásicos',
    active: true,
    until: '2026-10-31',
  },
  {
    id: 'p2',
    name: '10% en Pitahaya',
    desc: 'Descuento directo en el raspado de pitahaya.',
    type: 'percent',
    percent: 10,
    productId: 'pitahaya',
    active: true,
    until: '2026-10-25',
  },
]

export const INVENTORY: InventoryItem[] = [
  { id: 'hielo', name: 'Hielo', unit: 'g', stock: 38000, reserved: 0, min: 10000, cost: 0.004 },
  { id: 'jarabe', name: 'Jarabe', unit: 'ml', stock: 9800, reserved: 0, min: 3000, cost: 0.05 },
  { id: 'leche', name: 'Leche condensada', unit: 'ml', stock: 5200, reserved: 0, min: 1500, cost: 0.07 },
  { id: 'vaso', name: 'Vasos', unit: 'u', stock: 140, reserved: 0, min: 50, cost: 2.5 },
  { id: 'cuchara', name: 'Cucharas', unit: 'u', stock: 180, reserved: 0, min: 50, cost: 0.6 },
  { id: 'coco', name: 'Coco rallado', unit: 'g', stock: 420, reserved: 0, min: 500, cost: 0.08 },
  { id: 'granola', name: 'Granola', unit: 'g', stock: 1800, reserved: 0, min: 500, cost: 0.06 },
  { id: 'fresa', name: 'Fresa', unit: 'g', stock: 2300, reserved: 0, min: 800, cost: 0.09 },
  { id: 'torta', name: 'Torta', unit: 'u', stock: 24, reserved: 0, min: 8, cost: 8 },
]

export const USERS = [
  { name: 'Propietaria', role: 'Administrador', scope: 'Configuración, finanzas, reportes, catálogo, promociones, usuarios e inventario' },
  { name: 'Personal de barra', role: 'Operador', scope: 'Pedidos, estados, preparación, registro de pago e inventario operativo' },
  { name: 'Contador', role: 'Consulta', scope: 'Lectura de información autorizada sin modificar' },
]
