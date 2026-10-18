<script setup lang="ts">
import { Gift, Percent, CalendarClock } from 'lucide-vue-next'
import { notify, state } from '../../store'
import type { Promo } from '../../types'

function toggle(p: Promo) {
  p.active = !p.active
  notify(p.active ? 'Promoción activada: ya se ve en el menú' : 'Promoción pausada')
}
const ruleText = (p: Promo) =>
  p.type === 'bxgy' ? `Compra ${p.buy}, lleva ${(p.buy ?? 0) + (p.free ?? 0)} · categoría ${p.category}` : `${p.percent}% de descuento · un producto`
const date = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es-NI', { day: 'numeric', month: 'short' })
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h1 class="font-display text-3xl font-bold">Promociones</h1>
      <p class="text-sm text-muted">Los cambios se reflejan al instante en el menú y el carrito del cliente.</p>
    </div>

    <ul class="space-y-3">
      <li v-for="p in state.promos" :key="p.id" class="card flex items-center gap-4 p-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" :class="p.active ? 'bg-pink-soft text-pink' : 'bg-line text-muted'">
          <Gift v-if="p.type === 'bxgy'" :size="20" /><Percent v-else :size="20" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="font-semibold">{{ p.name }}</p>
          <p class="text-xs text-muted">{{ ruleText(p) }}</p>
          <p class="mt-1 flex items-center gap-1 text-xs text-muted"><CalendarClock :size="12" /> Vigente hasta {{ date(p.until) }}</p>
        </div>
        <button
          :id="`toggle-${p.id}`"
          role="switch"
          :aria-checked="p.active"
          :aria-label="`Activar ${p.name}`"
          class="relative h-6 w-11 shrink-0 rounded-full transition"
          :class="p.active ? 'bg-pink' : 'bg-line'"
          :disabled="state.role !== 'Administrador'"
          @click="toggle(p)"
        >
          <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" :class="p.active ? 'left-[22px]' : 'left-0.5'" />
        </button>
      </li>
    </ul>
  </div>
</template>
