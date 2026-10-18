<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Check, Clock, ChefHat, PackageCheck, Banknote, MessageCircle, Ban, CircleCheck } from 'lucide-vue-next'
import { BUSINESS } from '../../data'
import { STATUS_LABEL, money, orderByCode } from '../../store'
import type { OrderStatus } from '../../types'

const route = useRoute()
const router = useRouter()
const input = ref('')

const order = computed(() => (route.params.code ? orderByCode(String(route.params.code)) : undefined))

const steps = [
  { id: 'pendiente', label: 'Recibido', icon: Clock },
  { id: 'confirmado', label: 'Confirmado', icon: Check },
  { id: 'preparacion', label: 'En preparación', icon: ChefHat },
  { id: 'listo', label: 'Listo para retirar', icon: PackageCheck },
  { id: 'entregado', label: 'Entregado', icon: Banknote },
] as const
const idx = computed(() => steps.findIndex((s) => s.id === (order.value?.status as OrderStatus)))
const closed = computed(() => order.value && ['cancelado', 'no_retirado'].includes(order.value.status))

const waLink = computed(() => {
  if (!order.value) return '#'
  const o = order.value
  const items = o.lines.map((l) => `- ${l.qty}x ${l.name} (${l.sizeLabel})`).join('\n')
  const text = `Hola Copo Ice, soy ${o.name}. Mi pedido ${o.code}:\n${items}\nTotal: ${money(o.total)}. Retiro en el local, pago en efectivo.`
  return `https://wa.me/${BUSINESS.waNumber}?text=${encodeURIComponent(text)}`
})

function search() {
  if (input.value.trim()) router.push(`/seguimiento/${input.value.trim().toUpperCase()}`)
}
</script>

<template>
  <div class="mx-auto max-w-xl px-4 pt-8">
    <h1 class="font-display text-3xl font-bold">Seguimiento del pedido</h1>

    <form class="mt-5 flex gap-2" @submit.prevent="search">
      <input id="t-code" v-model="input" class="input" placeholder="Código, ej. CP-1025" />
      <button id="t-search" class="btn btn-ghost shrink-0"><Search :size="16" /> Buscar</button>
    </form>

    <p v-if="route.params.code && !order" class="mt-6 text-sm text-pink">No encontramos ese código.</p>

    <section v-if="order" class="mt-6 space-y-4">
      <div class="card p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs uppercase tracking-wide text-muted">Código</p>
            <p id="t-order-code" class="font-display text-3xl font-bold text-pink">{{ order.code }}</p>
          </div>
          <span class="chip" :class="closed ? 'bg-ink/10 text-ink' : 'bg-cyan-soft text-cyan-dark'">
            {{ STATUS_LABEL[order.status] }}
          </span>
        </div>

        <ol v-if="!closed" class="mt-6 space-y-0">
          <li v-for="(s, i) in steps" :key="s.id" class="flex gap-3">
            <div class="flex flex-col items-center">
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500"
                :class="i <= idx ? 'border-pink bg-pink text-white' : 'border-line bg-white text-muted'"
              >
                <component :is="s.icon" :size="15" />
              </span>
              <span v-if="i < steps.length - 1" class="h-6 w-0.5 transition-colors duration-500" :class="i < idx ? 'bg-pink' : 'bg-line'" />
            </div>
            <p class="pt-1 text-sm" :class="i === idx ? 'font-semibold' : i < idx ? '' : 'text-muted'">{{ s.label }}</p>
          </li>
        </ol>
        <p v-else class="mt-5 flex items-center gap-2 text-sm text-muted"><Ban :size="16" /> Este pedido no continuará.</p>
      </div>

      <div class="card p-5 text-sm">
        <ul class="space-y-1.5">
          <li v-for="(l, i) in order.lines" :key="i" class="flex justify-between">
            <span>{{ l.qty }}× {{ l.name }} <span class="text-xs text-muted">· {{ l.sizeLabel }}</span></span>
            <span>{{ money(l.unitPrice * l.qty) }}</span>
          </li>
        </ul>
        <div v-if="order.discount" class="mt-2 flex justify-between text-pink-dark"><span>Promociones</span><span>− {{ money(order.discount) }}</span></div>
        <div class="mt-3 flex justify-between border-t border-line pt-3 text-base font-bold"><span>Total en efectivo</span><span>{{ money(order.total) }}</span></div>
      </div>

      <a id="t-whatsapp" :href="waLink" target="_blank" rel="noopener" class="btn btn-primary w-full !py-3">
        <MessageCircle :size="18" /> Continuar por WhatsApp
      </a>
      <p class="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        <CircleCheck :size="13" class="text-cyan" /> Tu pedido ya está guardado, aunque no envíes el mensaje.
      </p>
    </section>
  </div>
</template>
