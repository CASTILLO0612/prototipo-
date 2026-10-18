<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Trash2, ClipboardCheck, AlertTriangle, X } from 'lucide-vue-next'
import { adjustStock, available, money, notify, state } from '../../store'
import type { InventoryItem } from '../../types'

type Kind = 'compra' | 'desperdicio' | 'conteo'
const target = ref<InventoryItem | null>(null)
const kind = ref<Kind>('compra')
const qty = ref<number | null>(null)
const moves = ref<{ t: string; text: string; neg: boolean }[]>([])
const canEdit = computed(() => state.role !== 'Consulta')

const kinds: { id: Kind; label: string; icon: typeof Plus }[] = [
  { id: 'compra', label: 'Compra', icon: Plus },
  { id: 'desperdicio', label: 'Desperdicio', icon: Trash2 },
  { id: 'conteo', label: 'Conteo físico', icon: ClipboardCheck },
]

const level = (i: InventoryItem) => Math.min(100, (available(i) / (i.min * 3)) * 100)
const status = (i: InventoryItem) => (available(i) <= i.min ? 'bajo' : 'ok')
const fmt = (n: number) => Math.round(n).toLocaleString('es-NI')

function open(i: InventoryItem, k: Kind) {
  target.value = i
  kind.value = k
  qty.value = null
}

function save() {
  const i = target.value
  if (!i || qty.value === null || qty.value < 0) return
  const time = new Date().toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' })
  if (kind.value === 'compra') {
    adjustStock(i.id, qty.value)
    moves.value.unshift({ t: time, text: `Compra de ${fmt(qty.value)} ${i.unit} de ${i.name}`, neg: false })
  } else if (kind.value === 'desperdicio') {
    adjustStock(i.id, -qty.value)
    moves.value.unshift({ t: time, text: `Desperdicio de ${fmt(qty.value)} ${i.unit} de ${i.name}`, neg: true })
  } else {
    const diff = qty.value - i.stock
    i.stock = qty.value
    moves.value.unshift({
      t: time,
      text: `Conteo de ${i.name}: variación ${diff >= 0 ? '+' : ''}${fmt(diff)} ${i.unit} vs. existencia teórica`,
      neg: diff < 0,
    })
  }
  notify('Movimiento registrado')
  target.value = null
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div>
      <h1 class="font-display text-3xl font-bold">Inventario</h1>
      <p class="text-sm text-muted">Existencia teórica por recetas, ajustada con compras, desperdicios y conteos físicos.</p>
    </div>

    <section class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th class="px-5 py-3">Insumo</th><th>Disponible</th><th class="hidden sm:table-cell">Reservado</th>
              <th class="hidden md:table-cell">Costo unit.</th><th class="w-32">Nivel</th><th v-if="canEdit" class="pr-5 text-right">Registrar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in state.inventory" :id="`inv-${i.id}`" :key="i.id" class="border-t border-line">
              <td class="px-5 py-3 font-medium">
                {{ i.name }}
                <AlertTriangle v-if="status(i) === 'bajo'" :size="13" class="ml-1 inline text-pink" />
              </td>
              <td :class="status(i) === 'bajo' ? 'font-semibold text-pink-dark' : ''">{{ fmt(available(i)) }} {{ i.unit }}</td>
              <td class="hidden text-muted sm:table-cell">{{ fmt(i.reserved) }} {{ i.unit }}</td>
              <td class="hidden text-muted md:table-cell">{{ money(i.cost * 100) }}/100 {{ i.unit }}</td>
              <td>
                <div class="h-1.5 overflow-hidden rounded-full bg-line">
                  <div class="h-full rounded-full transition-all duration-500" :class="status(i) === 'bajo' ? 'bg-pink' : 'bg-cyan'" :style="{ width: `${level(i)}%` }" />
                </div>
              </td>
              <td v-if="canEdit" class="pr-5">
                <div class="flex justify-end gap-1">
                  <button v-for="k in kinds" :key="k.id" class="rounded-lg border border-line p-1.5 text-muted transition hover:border-cyan hover:text-cyan-dark" :title="k.label" :aria-label="`${k.label} de ${i.name}`" @click="open(i, k.id)">
                    <component :is="k.icon" :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="moves.length" class="card p-5">
      <h2 class="mb-3 text-sm font-semibold">Movimientos de esta sesión</h2>
      <ul class="space-y-1.5 text-sm">
        <li v-for="(m, i) in moves" :key="i" :class="m.neg ? 'text-pink-dark' : ''"><span class="mr-2 text-muted">{{ m.t }}</span>{{ m.text }}</li>
      </ul>
    </section>

    <Transition name="fade">
      <div v-if="target" class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" @click.self="target = null">
        <form class="card w-full max-w-xs space-y-4 p-5 shadow-xl" @submit.prevent="save">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ target.name }}</h3>
            <button type="button" class="rounded-lg p-1 hover:bg-cream" aria-label="Cerrar" @click="target = null"><X :size="18" /></button>
          </div>
          <div class="grid grid-cols-3 gap-1 rounded-xl bg-cream p-1 text-xs font-medium">
            <button v-for="k in kinds" :key="k.id" type="button" class="rounded-lg px-1 py-1.5 transition" :class="kind === k.id ? 'bg-white shadow-sm' : 'text-muted'" @click="kind = k.id">{{ k.label }}</button>
          </div>
          <label class="block">
            <span class="mb-1.5 block text-xs text-muted">{{ kind === 'conteo' ? 'Cantidad encontrada' : 'Cantidad' }} ({{ target.unit }})</span>
            <input id="inv-qty" v-model.number="qty" type="number" min="0" class="input" autofocus />
          </label>
          <p v-if="kind === 'conteo'" class="text-xs text-muted">Existencia teórica: {{ fmt(target.stock) }} {{ target.unit }}</p>
          <button class="btn btn-primary w-full" :disabled="qty === null">Guardar</button>
        </form>
      </div>
    </Transition>
  </div>
</template>
