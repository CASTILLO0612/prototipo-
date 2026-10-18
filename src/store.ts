import { computed, reactive, ref, watch } from 'vue'
import { EXTRAS, INVENTORY, PRODUCTS, PROMOS, RECIPE, SIZES } from './data'
import type {
  CartLine,
  DayStat,
  InventoryItem,
  Order,
  OrderLine,
  OrderStatus,
  Product,
  Promo,
  Role,
} from './types'

const KEY = 'copoice-proto-v1'

export const money = (n: number) => `C$ ${Math.round(n).toLocaleString('es-NI')}`
export const dayKey = (d: Date) => d.toISOString().slice(0, 10)

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  preparacion: 'En preparación',
  listo: 'Listo para retirar',
  entregado: 'Entregado y pagado',
  cancelado: 'Cancelado',
  no_retirado: 'No retirado',
}

// ---------- Cálculo de líneas, promociones y recetas ----------
export const productById = (id: string) => PRODUCTS.find((p) => p.id === id)!
export const sizeById = (id: string) => SIZES.find((s) => s.id === id)!

export function unitPrice(l: Pick<CartLine, 'productId' | 'sizeId' | 'extras'>) {
  const extras = l.extras.reduce((a, id) => a + (EXTRAS.find((e) => e.id === id)?.price ?? 0), 0)
  return productById(l.productId).base + sizeById(l.sizeId).delta + extras
}

export function needOf(l: Pick<CartLine, 'sizeId' | 'extras' | 'qty'>) {
  const need: Record<string, number> = {}
  const add = (k: string, q: number) => (need[k] = (need[k] ?? 0) + q * l.qty)
  Object.entries(RECIPE[l.sizeId]).forEach(([k, q]) => add(k, q))
  l.extras.forEach((id) => {
    const inv = EXTRAS.find((e) => e.id === id)?.inv
    if (inv) add(inv.item, inv.qty)
  })
  return need
}

export function calcCart(lines: CartLine[], promos: Promo[]) {
  const subtotal = lines.reduce((a, l) => a + unitPrice(l) * l.qty, 0)
  const discounts: { id: string; name: string; amount: number }[] = []
  for (const p of promos.filter((x) => x.active)) {
    let amount = 0
    if (p.type === 'percent') {
      amount = lines
        .filter((l) => l.productId === p.productId)
        .reduce((a, l) => a + unitPrice(l) * l.qty * ((p.percent ?? 0) / 100), 0)
    } else {
      const units: number[] = []
      lines
        .filter((l) => productById(l.productId).category === p.category)
        .forEach((l) => {
          for (let i = 0; i < l.qty; i++) units.push(unitPrice(l))
        })
      units.sort((a, b) => b - a)
      const group = (p.buy ?? 0) + (p.free ?? 0)
      const groups = Math.floor(units.length / group)
      const free = groups * (p.free ?? 0)
      amount = units.slice(units.length - free).reduce((a, b) => a + b, 0)
    }
    if (amount > 0) discounts.push({ id: p.id, name: p.name, amount })
  }
  const discount = discounts.reduce((a, d) => a + d.amount, 0)
  return { subtotal, discounts, discount, total: subtotal - discount }
}

// ---------- Estado persistente ----------
function seedHistory(): DayStat[] {
  const out: DayStat[] = []
  const today = new Date()
  for (let i = 30; i >= 1; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const wk = d.getDay()
    const boost = wk === 0 || wk === 6 ? 1.35 : wk === 5 ? 1.15 : 0.9
    const trend = 1 + (30 - i) * 0.012
    const noise = 0.85 + ((i * 37) % 30) / 100
    const orders = Math.round(14 * boost * trend * noise)
    const sales = orders * (88 + ((i * 7) % 14))
    out.push({
      date: dayKey(d),
      sales,
      orders,
      cost: Math.round(sales * 0.34),
      expenses: 260 + ((i * 11) % 70),
    })
  }
  return out
}

function buildLine(c: CartLine): OrderLine {
  const p = productById(c.productId)
  const need = needOf(c)
  return {
    productId: p.id,
    name: p.name,
    category: p.category,
    sizeLabel: sizeById(c.sizeId).label,
    extras: c.extras.map((id) => EXTRAS.find((e) => e.id === id)!.label),
    unitPrice: unitPrice(c),
    qty: c.qty,
    need,
    cost: Object.entries(need).reduce(
      (a, [k, q]) => a + q * (INVENTORY.find((i) => i.id === k)?.cost ?? 0),
      0,
    ),
  }
}

function seedOrders(promos: Promo[]): Order[] {
  const mk = (
    code: string,
    name: string,
    status: OrderStatus,
    minsAgo: number,
    cart: Omit<CartLine, 'key' | 'note'>[],
  ): Order => {
    const lines = cart.map((c, i) => ({ ...c, key: `${code}${i}`, note: '' }))
    const r = calcCart(lines, promos)
    const ol = lines.map((l) => buildLine(l))
    const at = Date.now() - minsAgo * 60000
    return {
      code,
      name,
      phone: '8888 0000',
      notes: '',
      lines: ol,
      subtotal: r.subtotal,
      discount: r.discount,
      total: r.total,
      cost: ol.reduce((a, l) => a + l.cost, 0),
      status,
      wa: status === 'pendiente' ? 'enviado' : 'leido',
      paid: status === 'entregado',
      reserved: status === 'confirmado',
      consumed: ['preparacion', 'listo', 'entregado'].includes(status),
      createdAt: at,
      log: [{ at, text: 'Pedido registrado desde el portal' }],
    }
  }
  return [
    mk('CP-1021', 'Marisol G.', 'entregado', 190, [{ productId: 'relleno', sizeId: 's16', extras: ['coco'], qty: 2 }]),
    mk('CP-1022', 'Carlos M.', 'entregado', 120, [{ productId: 'leche', sizeId: 's16', extras: [], qty: 3 }]),
    mk('CP-1023', 'Daniela R.', 'listo', 25, [{ productId: 'oreo', sizeId: 's22', extras: ['leche'], qty: 1 }]),
    mk('CP-1024', 'Jorge A.', 'preparacion', 12, [
      { productId: 'pitahaya', sizeId: 's16', extras: [], qty: 1 },
      { productId: 'enfrutado', sizeId: 's12', extras: ['granola'], qty: 1 },
    ]),
    mk('CP-1025', 'Lucía P.', 'pendiente', 3, [{ productId: 'pina-fresa', sizeId: 's16', extras: ['fresa'], qty: 2 }]),
  ]
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignorar */
  }
  return null
}

const saved = load()
const initialPromos: Promo[] = saved?.promos ?? PROMOS.map((p) => ({ ...p }))

export const state = reactive({
  role: (saved?.role ?? null) as Role | null,
  cart: (saved?.cart ?? []) as CartLine[],
  orders: (saved?.orders ?? seedOrders(initialPromos)) as Order[],
  promos: initialPromos,
  products: (saved?.products ?? PRODUCTS.map((p) => ({ ...p }))) as Product[],
  inventory: (saved?.inventory ?? INVENTORY.map((i) => ({ ...i }))) as InventoryItem[],
  history: seedHistory(),
  counter: (saved?.counter ?? 1025) as number,
})

// reservas/consumos de los pedidos semilla
if (!saved) {
  state.orders.forEach((o) => {
    if (o.status === 'confirmado') applyReserve(o, 1)
    if (o.consumed) applyConsume(o, false)
  })
}

watch(
  () => ({
    role: state.role,
    cart: state.cart,
    orders: state.orders,
    promos: state.promos,
    products: state.products,
    inventory: state.inventory,
    counter: state.counter,
  }),
  (v) => localStorage.setItem(KEY, JSON.stringify(v)),
  { deep: true },
)

export const ui = reactive({ cartOpen: false, paletteOpen: false })
export const toast = ref('')
let toastTimer: number | undefined
export function notify(msg: string) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 2600)
}

export function resetDemo() {
  localStorage.removeItem(KEY)
  location.href = '/'
}

// ---------- Carrito ----------
export const cartCalc = computed(() => calcCart(state.cart, state.promos))
export const cartCount = computed(() => state.cart.reduce((a, l) => a + l.qty, 0))

export function addToCart(line: Omit<CartLine, 'key'>) {
  const key = `${line.productId}|${line.sizeId}|${[...line.extras].sort().join(',')}|${line.note}`
  const hit = state.cart.find((l) => l.key === key)
  if (hit) hit.qty += line.qty
  else state.cart.push({ ...line, key })
}
export function removeLine(key: string) {
  state.cart = state.cart.filter((l) => l.key !== key)
}
export function setQty(key: string, qty: number) {
  const l = state.cart.find((x) => x.key === key)
  if (!l) return
  if (qty <= 0) removeLine(key)
  else l.qty = qty
}

// ---------- Inventario ----------
function applyReserve(o: Order, sign: 1 | -1) {
  o.lines.forEach((l) =>
    Object.entries(l.need).forEach(([k, q]) => {
      const it = state.inventory.find((i) => i.id === k)
      if (it) it.reserved = Math.max(0, it.reserved + sign * q)
    }),
  )
  o.reserved = sign === 1
}
function applyConsume(o: Order, release: boolean) {
  o.lines.forEach((l) =>
    Object.entries(l.need).forEach(([k, q]) => {
      const it = state.inventory.find((i) => i.id === k)
      if (!it) return
      it.stock -= q
      if (release) it.reserved = Math.max(0, it.reserved - q)
    }),
  )
  o.consumed = true
  o.reserved = false
}
export const available = (i: InventoryItem) => i.stock - i.reserved
export const lowStock = computed(() => state.inventory.filter((i) => available(i) <= i.min))

export function adjustStock(id: string, delta: number) {
  const it = state.inventory.find((i) => i.id === id)
  if (it) it.stock = Math.max(0, it.stock + delta)
}

// ---------- Pedidos ----------
export function createOrder(data: { name: string; phone: string; notes: string }) {
  // El servidor recalcula precios y promociones antes de aceptar el pedido.
  const r = calcCart(state.cart, state.promos)
  const lines = state.cart.map((c) => buildLine(c))
  const code = `CP-${++state.counter}`
  const now = Date.now()
  const order: Order = {
    code,
    ...data,
    lines,
    subtotal: r.subtotal,
    discount: r.discount,
    total: r.total,
    cost: lines.reduce((a, l) => a + l.cost, 0),
    status: 'pendiente',
    wa: 'sin_enviar',
    paid: false,
    reserved: false,
    consumed: false,
    createdAt: now,
    log: [{ at: now, text: 'Pedido registrado y guardado' }],
  }
  state.orders.unshift(order)
  state.cart = []
  // Mensajería simulada en segundo plano (cola)
  window.setTimeout(() => setWa(code, 'enviado', 'WhatsApp: mensaje enviado'), 900)
  window.setTimeout(() => setWa(code, 'entregado', 'WhatsApp: mensaje entregado'), 2200)
  return order
}

function setWa(code: string, wa: Order['wa'], text: string) {
  const o = state.orders.find((x) => x.code === code)
  if (!o) return
  o.wa = wa
  o.log.push({ at: Date.now(), text })
}

export function orderByCode(code: string) {
  return state.orders.find((o) => o.code.toLowerCase() === code.trim().toLowerCase())
}

export const NEXT: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
  pendiente: { to: 'confirmado', label: 'Confirmar' },
  confirmado: { to: 'preparacion', label: 'Iniciar preparación' },
  preparacion: { to: 'listo', label: 'Marcar listo' },
  listo: { to: 'entregado', label: 'Entregar y cobrar' },
}

export function changeStatus(code: string, to: OrderStatus) {
  const o = orderByCode(code)
  if (!o) return
  if (to === 'confirmado') applyReserve(o, 1)
  if (to === 'preparacion') applyConsume(o, true)
  if (to === 'cancelado' && o.reserved) applyReserve(o, -1)
  if (to === 'entregado') o.paid = true
  o.status = to
  const label =
    to === 'entregado' ? 'Entregado, pago en efectivo registrado' : `Estado: ${STATUS_LABEL[to]}`
  o.log.push({ at: Date.now(), text: label })
  if (['confirmado', 'listo'].includes(to)) {
    o.wa = 'enviado'
    o.log.push({ at: Date.now(), text: 'WhatsApp: notificación enviada' })
    window.setTimeout(() => setWa(code, 'leido', 'WhatsApp: mensaje leído'), 1800)
  }
}

// ---------- Finanzas ----------
export const todayStat = computed<DayStat>(() => {
  const t = dayKey(new Date())
  const done = state.orders.filter(
    (o) => o.status === 'entregado' && o.paid && dayKey(new Date(o.createdAt)) === t,
  )
  return {
    date: t,
    sales: done.reduce((a, o) => a + o.total, 0),
    orders: done.length,
    cost: Math.round(done.reduce((a, o) => a + o.cost, 0)),
    expenses: 0,
  }
})

export const fullSeries = computed<DayStat[]>(() => [...state.history, todayStat.value])

export function periodStats(days: number) {
  const s = fullSeries.value
  const cur = s.slice(-days)
  const prev = s.slice(-days * 2, -days)
  const sum = (a: DayStat[]) =>
    a.reduce(
      (t, d) => ({
        sales: t.sales + d.sales,
        orders: t.orders + d.orders,
        cost: t.cost + d.cost,
        expenses: t.expenses + d.expenses,
      }),
      { sales: 0, orders: 0, cost: 0, expenses: 0 },
    )
  const c = sum(cur)
  const p = sum(prev)
  const gross = c.sales - c.cost
  return {
    series: cur,
    ...c,
    ticket: c.orders ? c.sales / c.orders : 0,
    gross,
    net: gross - c.expenses,
    variation: p.sales ? ((c.sales - p.sales) / p.sales) * 100 : 0,
  }
}

export const topProducts = computed(() => {
  const map = new Map<string, { name: string; units: number; revenue: number; cost: number }>()
  state.orders
    .filter((o) => o.status === 'entregado')
    .forEach((o) =>
      o.lines.forEach((l) => {
        const e = map.get(l.productId) ?? { name: l.name, units: 0, revenue: 0, cost: 0 }
        e.units += l.qty
        e.revenue += l.unitPrice * l.qty
        e.cost += l.cost
        map.set(l.productId, e)
      }),
    )
  return [...map.values()].sort((a, b) => b.revenue - a.revenue)
})

export const ROLE_ACCESS: Record<Role, string[]> = {
  Administrador: ['dashboard', 'pedidos', 'inventario', 'promociones', 'reportes', 'usuarios'],
  Operador: ['pedidos', 'inventario'],
  Consulta: ['dashboard', 'pedidos', 'inventario', 'reportes'],
}
