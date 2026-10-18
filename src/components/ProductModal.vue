<script setup lang="ts">
import { computed, ref } from 'vue'
import { Minus, Plus, X } from 'lucide-vue-next'
import { EXTRAS, SIZES } from '../data'
import { addToCart, money, notify, ui } from '../store'
import type { Product } from '../types'

const props = defineProps<{ product: Product | null }>()
const emit = defineEmits<{ close: [] }>()

const sizeId = ref('s16')
const extras = ref<string[]>([])
const qty = ref(1)
const note = ref('')

const price = computed(() => {
  if (!props.product) return 0
  const s = SIZES.find((x) => x.id === sizeId.value)!
  const e = extras.value.reduce((a, id) => a + EXTRAS.find((x) => x.id === id)!.price, 0)
  return props.product.base + s.delta + e
})

function toggle(id: string) {
  extras.value = extras.value.includes(id) ? extras.value.filter((x) => x !== id) : [...extras.value, id]
}

function add() {
  if (!props.product) return
  addToCart({ productId: props.product.id, sizeId: sizeId.value, extras: [...extras.value], qty: qty.value, note: note.value.trim() })
  notify('Agregado al carrito')
  sizeId.value = 's16'
  extras.value = []
  qty.value = 1
  note.value = ''
  emit('close')
  ui.cartOpen = true
}
</script>

<template>
  <Transition name="fade">
    <div v-if="product" class="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4" @click.self="emit('close')">
      <div id="product-modal" class="card flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-b-none shadow-xl sm:rounded-b-2xl">
        <div class="relative h-48 shrink-0">
          <img :src="product.img" :alt="product.name" class="h-full w-full object-cover" />
          <button class="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 shadow" aria-label="Cerrar" @click="emit('close')">
            <X :size="18" />
          </button>
        </div>
        <div class="space-y-5 overflow-y-auto p-5">
          <div>
            <h2 class="font-display text-2xl font-bold">{{ product.name }}</h2>
            <p class="mt-1 text-sm text-muted">{{ product.desc }}</p>
          </div>

          <fieldset>
            <legend class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Tamaño</legend>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="s in SIZES"
                :key="s.id"
                class="rounded-xl border px-2 py-2.5 text-center text-sm transition"
                :class="sizeId === s.id ? 'border-pink bg-pink-soft text-pink-dark' : 'border-line bg-white hover:border-cyan'"
                @click="sizeId = s.id"
              >
                <span class="block font-semibold">{{ s.label }}</span>
                <span class="text-xs opacity-70">{{ s.oz }} oz</span>
              </button>
            </div>
          </fieldset>

          <fieldset>
            <legend class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Extras</legend>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="e in EXTRAS"
                :key="e.id"
                class="rounded-full border px-3 py-1.5 text-sm transition"
                :class="extras.includes(e.id) ? 'border-cyan bg-cyan-soft text-cyan-dark' : 'border-line bg-white hover:border-cyan'"
                @click="toggle(e.id)"
              >
                {{ e.label }} <span class="text-xs opacity-70">+{{ e.price }}</span>
              </button>
            </div>
          </fieldset>

          <label class="block">
            <span class="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">Nota (opcional)</span>
            <input v-model="note" class="input" placeholder="Ej. poca miel" />
          </label>
        </div>

        <div class="flex items-center gap-3 border-t border-line bg-white p-4">
          <div class="flex items-center gap-1 rounded-xl border border-line">
            <button class="p-2.5 hover:text-pink" aria-label="Menos" @click="qty = Math.max(1, qty - 1)"><Minus :size="16" /></button>
            <span class="w-6 text-center font-semibold">{{ qty }}</span>
            <button class="p-2.5 hover:text-pink" aria-label="Más" @click="qty++"><Plus :size="16" /></button>
          </div>
          <button id="modal-add" class="btn btn-primary flex-1 !py-3" @click="add">Agregar · {{ money(price * qty) }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>
