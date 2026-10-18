<script setup lang="ts">
import { computed, ref } from 'vue'
import { MessageCircle, Check, CheckCheck, Clock, Banknote, X, PackageX, ChevronRight, History } from 'lucide-vue-next'
import { NEXT, STATUS_LABEL, changeStatus, money, state } from '../../store'
import type { Order, OrderStatus, WaStatus } from '../../types'

const cols: OrderStatus[] = ['pendiente', 'confirmado', 'preparacion', 'listo']
const by = (s: OrderStatus) => state.orders.filter((o) => o.status === s)
const closed = computed(() => state.orders.filter((o) => ['entregado', 'cancelado', 'no_retirado'].includes(o.status)))
const canEdit = computed(() => state.role !== 'Consulta')
const detail = ref<Order | null>(null)

const waText: Record<WaStatus, string> = { sin_enviar: 'Sin enviar', enviado: 'Enviado', entregado: 'Entregado', leido: 'Leído' }
const time = (t: number) => new Date(t).toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' })
const summary = (o: Order) => o.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6">
    <div>
      <h1 class="font-display text-3xl font-bold">Pedidos</h1>
      <p class="text-sm text-muted">
        El estado del mensaje de WhatsApp es independiente del estado del pedido: la venta se confirma solo al entregar y cobrar.
      </p>
    </div>

    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <section v-for="c in cols" :key="c" class="rounded-2xl bg-white/60 p-2.5 ring-1 ring-line">
        <h2 class="mb-2 flex items-center justify-between px-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
          {{ STATUS_LABEL[c] }}
          <span class="rounded-full bg-white px-2 py-0.5 text-ink ring-1 ring-line">{{ by(c).length }}</span>
        </h2>
        <div class="space-y-2.5">
          <article v-for="o in by(c)" :id="`order-${o.code}`" :key="o.code" class="card p-3.5 text-sm">
            <button class="w-full text-left" @click="detail = o">
              <div class="flex items-center justify-between">
                <span class="font-bold text-pink">{{ o.code }}</span>
                <span class="flex items-center gap-1 text-[11px] text-muted"><Clock :size="11" /> {{ time(o.createdAt) }}</span>
              </div>
              <p class="mt-1 font-medium">{{ o.name }}</p>
              <p class="line-clamp-2 text-xs text-muted">{{ summary(o) }}</p>
            </button>
            <div class="mt-2.5 flex items-center justify-between">
              <span class="font-semibold">{{ money(o.total) }}</span>
              <span class="chip bg-cyan-soft text-cyan-dark" :title="'Estado del mensaje de WhatsApp'">
                <component :is="o.wa === 'leido' ? CheckCheck : o.wa === 'sin_enviar' ? Clock : Check" :size="12" />
                {{ waText[o.wa] }}
              </span>
            </div>
            <div v-if="canEdit" class="mt-3 flex gap-1.5">
              <button v-if="NEXT[o.status]" :id="`next-${o.code}`" class="btn btn-primary flex-1 !px-2 !py-2 !text-xs" @click="changeStatus(o.code, NEXT[o.status]!.to)">
                <Banknote v-if="o.status === 'listo'" :size="14" />
                <ChevronRight v-else :size="14" />
                {{ NEXT[o.status]!.label }}
              </button>
              <button
                v-if="o.status === 'listo'"
                class="btn btn-ghost !px-2.5 !py-2"
                title="No retirado"
                aria-label="Marcar como no retirado"
                @click="changeStatus(o.code, 'no_retirado')"
              >
                <PackageX :size="14" />
              </button>
              <button
                v-if="o.status === 'pendiente' || o.status === 'confirmado'"
                class="btn btn-ghost !px-2.5 !py-2"
                title="Cancelar"
                aria-label="Cancelar pedido"
                @click="changeStatus(o.code, 'cancelado')"
              >
                <X :size="14" />
              </button>
            </div>
          </article>
          <p v-if="!by(c).length" class="px-1.5 py-4 text-center text-xs text-muted">Sin pedidos</p>
        </div>
      </section>
    </div>

    <section class="card overflow-hidden">
      <h2 class="flex items-center gap-2 border-b border-line px-5 py-3 text-sm font-semibold"><History :size="15" /> Cerrados</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="text-xs uppercase tracking-wide text-muted">
            <tr><th class="px-5 py-2.5">Código</th><th>Cliente</th><th>Estado</th><th class="text-right">Total</th><th class="pr-5 text-right">Pago</th></tr>
          </thead>
          <tbody>
            <tr v-for="o in closed" :key="o.code" class="border-t border-line">
              <td class="px-5 py-2.5 font-semibold text-pink">{{ o.code }}</td>
              <td>{{ o.name }}</td>
              <td><span class="chip" :class="o.status === 'entregado' ? 'bg-cyan-soft text-cyan-dark' : 'bg-pink-soft text-pink-dark'">{{ STATUS_LABEL[o.status] }}</span></td>
              <td class="text-right">{{ money(o.total) }}</td>
              <td class="pr-5 text-right text-muted">{{ o.paid ? 'Efectivo' : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Transition name="fade">
      <div v-if="detail" class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" @click.self="detail = null">
        <div class="card w-full max-w-sm p-5 text-sm shadow-xl">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="font-display text-xl font-bold text-pink">{{ detail.code }}</h3>
            <button class="rounded-lg p-1 hover:bg-cream" aria-label="Cerrar" @click="detail = null"><X :size="18" /></button>
          </div>
          <p class="font-medium">{{ detail.name }} · {{ detail.phone }}</p>
          <ul class="my-3 space-y-1 text-muted">
            <li v-for="(l, i) in detail.lines" :key="i">{{ l.qty }}× {{ l.name }} ({{ l.sizeLabel }}<template v-if="l.extras.length">, {{ l.extras.join(', ') }}</template>)</li>
          </ul>
          <p class="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted"><MessageCircle :size="13" /> Historial</p>
          <ol class="space-y-1 border-l-2 border-line pl-3 text-xs">
            <li v-for="(e, i) in detail.log" :key="i"><span class="text-muted">{{ time(e.at) }}</span> · {{ e.text }}</li>
          </ol>
        </div>
      </div>
    </Transition>
  </div>
</template>
