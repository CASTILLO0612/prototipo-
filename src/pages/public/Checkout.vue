<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Info, Banknote, Gift, ArrowLeft } from 'lucide-vue-next'
import { EXTRAS } from '../../data'
import { cartCalc, createOrder, money, productById, sizeById, state } from '../../store'

const router = useRouter()
const form = reactive({ name: '', phone: '', notes: '' })
const tried = ref(false)

const phoneOk = computed(() => /^\d{8}$/.test(form.phone.replace(/\D/g, '')))
const valid = computed(() => form.name.trim().length > 1 && phoneOk.value && state.cart.length > 0)

const extrasText = (ids: string[]) => ids.map((id) => EXTRAS.find((e) => e.id === id)?.label).join(', ')

function submit() {
  tried.value = true
  if (!valid.value) return
  const o = createOrder({ ...form, name: form.name.trim() })
  router.replace(`/seguimiento/${o.code}`)
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 pt-8">
    <router-link to="/" class="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-pink">
      <ArrowLeft :size="15" /> Volver al menú
    </router-link>
    <h1 class="font-display text-3xl font-bold">Confirmar pedido</h1>

    <div v-if="!state.cart.length" class="card mt-6 p-8 text-center text-sm text-muted">
      Tu carrito está vacío.
    </div>

    <div v-else class="mt-6 grid gap-6 md:grid-cols-5">
      <form class="card space-y-4 p-5 md:col-span-3" novalidate @submit.prevent="submit">
        <label class="block">
          <span class="mb-1.5 block text-sm font-medium">Nombre</span>
          <input id="f-name" v-model="form.name" class="input" placeholder="Tu nombre" autocomplete="name" />
          <span v-if="tried && form.name.trim().length < 2" class="mt-1 block text-xs text-pink">Ingresa tu nombre.</span>
        </label>
        <label class="block">
          <span class="mb-1.5 block text-sm font-medium">Teléfono (WhatsApp)</span>
          <input id="f-phone" v-model="form.phone" class="input" inputmode="tel" placeholder="8 dígitos" autocomplete="tel" />
          <span v-if="tried && !phoneOk" class="mt-1 block text-xs text-pink">Ingresa un número de 8 dígitos.</span>
        </label>
        <label class="block">
          <span class="mb-1.5 block text-sm font-medium">Observaciones</span>
          <textarea id="f-notes" v-model="form.notes" rows="3" class="input" placeholder="Opcional" />
        </label>

        <div class="flex gap-2.5 rounded-xl bg-cyan-soft p-3 text-xs text-ink/80">
          <Info :size="16" class="mt-0.5 shrink-0 text-cyan-dark" />
          <p>El pedido se retira en el local o puedes coordinar tu propio delivery. No hacemos entregas a domicilio.</p>
        </div>
        <div class="flex gap-2.5 rounded-xl bg-pink-soft p-3 text-xs text-ink/80">
          <Banknote :size="16" class="mt-0.5 shrink-0 text-pink" />
          <p>El pago se realiza en efectivo al retirar.</p>
        </div>

        <button id="f-submit" type="submit" class="btn btn-primary w-full !py-3">Registrar pedido</button>
      </form>

      <aside class="card h-fit space-y-3 p-5 md:col-span-2">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Resumen</h2>
        <ul class="space-y-2.5 text-sm">
          <li v-for="l in state.cart" :key="l.key" class="flex justify-between gap-2">
            <span class="min-w-0">
              <span class="font-medium">{{ l.qty }}× {{ productById(l.productId).name }}</span>
              <span class="block truncate text-xs text-muted">
                {{ sizeById(l.sizeId).label }}<template v-if="l.extras.length"> · {{ extrasText(l.extras) }}</template>
              </span>
            </span>
          </li>
        </ul>
        <div class="space-y-1.5 border-t border-line pt-3 text-sm">
          <div class="flex justify-between text-muted"><span>Subtotal</span><span>{{ money(cartCalc.subtotal) }}</span></div>
          <div v-for="d in cartCalc.discounts" :key="d.id" class="flex justify-between text-pink-dark">
            <span class="flex items-center gap-1.5"><Gift :size="13" /> {{ d.name }}</span><span>− {{ money(d.amount) }}</span>
          </div>
          <div class="flex justify-between pt-1 text-lg font-bold"><span>Total</span><span>{{ money(cartCalc.total) }}</span></div>
        </div>
      </aside>
    </div>
  </div>
</template>
