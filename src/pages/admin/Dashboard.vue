<script setup lang="ts">
import { computed, ref } from 'vue'
import { TrendingUp, TrendingDown, Banknote, Receipt, Wallet, PiggyBank, AlertTriangle } from 'lucide-vue-next'
import { available, lowStock, money, periodStats, topProducts, state } from '../../store'

const periods = [
  { id: 1, label: 'Hoy' },
  { id: 7, label: 'Semana' },
  { id: 30, label: 'Mes' },
]
const days = ref(7)
const s = computed(() => periodStats(days.value))
const chartSeries = computed(() => periodStats(Math.max(days.value, 7)).series)
const max = computed(() => Math.max(1, ...chartSeries.value.map((d) => d.sales)))
const open = computed(() => state.orders.filter((o) => ['pendiente', 'confirmado', 'preparacion', 'listo'].includes(o.status)).length)

const kpis = computed(() => [
  { l: 'Ventas', v: money(s.value.sales), i: Banknote, c: 'bg-pink-soft text-pink' },
  { l: 'Pedidos completados', v: String(s.value.orders), i: Receipt, c: 'bg-cyan-soft text-cyan-dark' },
  { l: 'Ticket promedio', v: money(s.value.ticket), i: Wallet, c: 'bg-cyan-soft text-cyan-dark' },
  { l: 'Ganancia bruta est.', v: money(s.value.gross), i: PiggyBank, c: 'bg-pink-soft text-pink' },
])
const dayLabel = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es-NI', { weekday: 'short' }).slice(0, 3)
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="font-display text-3xl font-bold">Resumen</h1>
        <p class="text-sm text-muted">{{ open }} pedidos abiertos ahora</p>
      </div>
      <div class="flex gap-1 rounded-xl border border-line bg-white p-1">
        <button
          v-for="p in periods"
          :id="`per-${p.id}`"
          :key="p.id"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition"
          :class="days === p.id ? 'bg-ink text-white' : 'text-muted hover:text-ink'"
          @click="days = p.id"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div v-for="k in kpis" :key="k.l" class="card p-4">
        <span class="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" :class="k.c"><component :is="k.i" :size="18" /></span>
        <p class="text-xl font-bold">{{ k.v }}</p>
        <p class="text-xs text-muted">{{ k.l }}</p>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <section class="card p-5 lg:col-span-2">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold">Ventas por día</h2>
          <span
            class="chip"
            :class="s.variation >= 0 ? 'bg-cyan-soft text-cyan-dark' : 'bg-pink-soft text-pink-dark'"
          >
            <component :is="s.variation >= 0 ? TrendingUp : TrendingDown" :size="13" />
            {{ s.variation >= 0 ? '+' : '' }}{{ s.variation.toFixed(1) }}% vs. periodo anterior
          </span>
        </div>
        <div class="flex h-44 items-end gap-2">
          <div v-for="d in chartSeries" :key="d.date" class="group flex flex-1 flex-col items-center justify-end gap-1.5">
            <span class="text-[10px] font-medium text-muted opacity-0 transition group-hover:opacity-100">{{ money(d.sales) }}</span>
            <div class="w-full rounded-t-lg bg-gradient-to-t from-pink to-pink/60 transition-all duration-500 group-hover:from-cyan group-hover:to-cyan/60" :style="{ height: `${Math.max(4, (d.sales / max) * 120)}px` }" />
            <span class="text-[10px] capitalize text-muted">{{ dayLabel(d.date) }}</span>
          </div>
        </div>
      </section>

      <section class="card p-5">
        <h2 class="mb-3 text-sm font-semibold">Resultado estimado</h2>
        <dl class="space-y-2.5 text-sm">
          <div class="flex justify-between"><dt class="text-muted">Ventas</dt><dd>{{ money(s.sales) }}</dd></div>
          <div class="flex justify-between"><dt class="text-muted">Costo de productos</dt><dd>− {{ money(s.cost) }}</dd></div>
          <div class="flex justify-between border-t border-line pt-2"><dt class="font-medium">Ganancia bruta</dt><dd class="font-semibold">{{ money(s.gross) }}</dd></div>
          <div class="flex justify-between"><dt class="text-muted">Gastos operativos</dt><dd>− {{ money(s.expenses) }}</dd></div>
          <div class="flex justify-between border-t border-line pt-2 text-base"><dt class="font-semibold">Ganancia neta</dt><dd class="font-bold text-pink">{{ money(s.net) }}</dd></div>
        </dl>
        <p class="mt-3 text-[11px] leading-snug text-muted">Estimación basada en recetas, compras y gastos registrados.</p>
      </section>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <section class="card p-5">
        <h2 class="mb-3 text-sm font-semibold">Más vendidos</h2>
        <ul class="space-y-2.5 text-sm">
          <li v-for="(p, i) in topProducts.slice(0, 4)" :key="p.name" class="flex items-center justify-between">
            <span><span class="mr-2 text-muted">{{ i + 1 }}</span>{{ p.name }}</span>
            <span class="text-muted">{{ p.units }} u · {{ money(p.revenue) }}</span>
          </li>
          <li v-if="!topProducts.length" class="text-muted">Sin ventas completadas todavía.</li>
        </ul>
      </section>
      <section class="card p-5">
        <h2 class="mb-3 flex items-center gap-2 text-sm font-semibold"><AlertTriangle :size="15" class="text-pink" /> Inventario bajo</h2>
        <ul class="space-y-2.5 text-sm">
          <li v-for="i in lowStock" :key="i.id" class="flex justify-between">
            <span>{{ i.name }}</span><span class="text-pink-dark">{{ available(i).toLocaleString('es-NI') }} {{ i.unit }}</span>
          </li>
          <li v-if="!lowStock.length" class="text-muted">Todo en orden.</li>
        </ul>
      </section>
    </div>
  </div>
</template>
