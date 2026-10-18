<script setup lang="ts">
import { Minus, Plus, Trash2, X, ShoppingBag, Gift } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { EXTRAS } from '../data'
import { cartCalc, money, productById, removeLine, setQty, sizeById, state, ui, unitPrice } from '../store'

const router = useRouter()
const extrasText = (ids: string[]) => ids.map((id) => EXTRAS.find((e) => e.id === id)?.label).join(', ')

function checkout() {
  ui.cartOpen = false
  router.push('/pedido-nuevo')
}
</script>

<template>
  <Transition name="fade">
    <div v-if="ui.cartOpen" class="fixed inset-0 z-50 bg-ink/40" @click="ui.cartOpen = false" />
  </Transition>
  <Transition name="slide">
    <aside
      v-if="ui.cartOpen"
      id="cart-drawer"
      class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
    >
      <div class="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 class="font-display text-xl font-bold">Tu carrito</h2>
        <button class="rounded-lg p-1 hover:bg-white" aria-label="Cerrar carrito" @click="ui.cartOpen = false">
          <X :size="20" />
        </button>
      </div>

      <div v-if="!state.cart.length" class="flex flex-1 flex-col items-center justify-center gap-3 text-muted">
        <ShoppingBag :size="40" class="text-line" />
        <p class="text-sm">Aún no has agregado productos.</p>
      </div>

      <ul v-else class="flex-1 space-y-3 overflow-y-auto p-4">
        <li v-for="l in state.cart" :key="l.key" class="card flex gap-3 p-3">
          <img :src="productById(l.productId).img" :alt="productById(l.productId).name" class="h-16 w-16 rounded-xl object-cover" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ productById(l.productId).name }}</p>
            <p class="text-xs text-muted">
              {{ sizeById(l.sizeId).label }} · {{ sizeById(l.sizeId).oz }} oz
              <template v-if="l.extras.length"> · {{ extrasText(l.extras) }}</template>
            </p>
            <div class="mt-2 flex items-center justify-between">
              <div class="flex items-center gap-1 rounded-lg border border-line bg-white">
                <button class="p-1.5 hover:text-pink" aria-label="Quitar uno" @click="setQty(l.key, l.qty - 1)"><Minus :size="14" /></button>
                <span class="w-5 text-center text-sm font-semibold">{{ l.qty }}</span>
                <button class="p-1.5 hover:text-pink" aria-label="Agregar uno" @click="setQty(l.key, l.qty + 1)"><Plus :size="14" /></button>
              </div>
              <span class="text-sm font-semibold">{{ money(unitPrice(l) * l.qty) }}</span>
            </div>
          </div>
          <button class="self-start rounded-lg p-1 text-muted hover:text-pink" aria-label="Eliminar" @click="removeLine(l.key)">
            <Trash2 :size="16" />
          </button>
        </li>
      </ul>

      <div v-if="state.cart.length" class="space-y-2 border-t border-line bg-white p-5 text-sm">
        <div class="flex justify-between text-muted"><span>Subtotal</span><span>{{ money(cartCalc.subtotal) }}</span></div>
        <div v-for="d in cartCalc.discounts" :key="d.id" class="flex items-center justify-between rounded-lg bg-pink-soft px-2.5 py-1.5 text-pink-dark">
          <span class="flex items-center gap-1.5"><Gift :size="14" /> {{ d.name }}</span>
          <span class="font-semibold">− {{ money(d.amount) }}</span>
        </div>
        <div class="flex justify-between pt-1 text-lg font-bold"><span>Total</span><span>{{ money(cartCalc.total) }}</span></div>
        <button id="cart-checkout" class="btn btn-primary w-full !py-3" @click="checkout">Continuar con el pedido</button>
      </div>
    </aside>
  </Transition>
</template>
