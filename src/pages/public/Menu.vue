<script setup lang="ts">
import { computed, ref } from 'vue'
import { Gift, Percent, Plus, Clock } from 'lucide-vue-next'
import ProductModal from '../../components/ProductModal.vue'
import { money, state } from '../../store'
import type { Product } from '../../types'

const cats = ['Todos', 'Especiales', 'Clásicos'] as const
const cat = ref<(typeof cats)[number]>('Todos')
const selected = ref<Product | null>(null)

const list = computed(() =>
  state.products.filter((p) => p.available && (cat.value === 'Todos' || p.category === cat.value)),
)
const activePromos = computed(() => state.promos.filter((p) => p.active))
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 pt-6">
    <div class="relative overflow-hidden rounded-3xl">
      <img src="/img/banner.png" alt="Local de Copo Ice con raspados" class="h-56 w-full object-cover sm:h-72" />
      <div class="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
      <div class="absolute bottom-5 left-5 right-5 text-white">
        <h1 class="font-display text-3xl font-bold sm:text-4xl">Frío que se antoja</h1>
        <p class="mt-1 flex items-center gap-1.5 text-sm text-white/85">
          <Clock :size="14" /> Preparamos al momento · retira en el local o coordina tu delivery
        </p>
      </div>
    </div>

    <div v-if="activePromos.length" class="mt-5 grid gap-3 sm:grid-cols-2">
      <div v-for="p in activePromos" :key="p.id" class="flex items-center gap-3 rounded-2xl border border-pink/20 bg-pink-soft p-4">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-pink">
          <Gift v-if="p.type === 'bxgy'" :size="20" />
          <Percent v-else :size="20" />
        </span>
        <div>
          <p class="text-sm font-semibold text-pink-dark">{{ p.name }}</p>
          <p class="text-xs text-ink/70">{{ p.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-4 pt-8" aria-labelledby="menu-title">
    <div class="flex items-center justify-between">
      <h2 id="menu-title" class="font-display text-2xl font-bold">Menú</h2>
      <div class="flex gap-1.5">
        <button
          v-for="c in cats"
          :id="`cat-${c}`"
          :key="c"
          class="rounded-full border px-3.5 py-1.5 text-sm font-medium transition"
          :class="cat === c ? 'border-cyan bg-cyan text-white' : 'border-line bg-white text-muted hover:border-cyan'"
          @click="cat = c"
        >
          {{ c }}
        </button>
      </div>
    </div>

    <ul class="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      <li v-for="p in list" :key="p.id">
        <button :id="`prod-${p.id}`" class="card group w-full overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-lg" @click="selected = p">
          <div class="aspect-[4/3] overflow-hidden bg-cream">
            <img :src="p.img" :alt="p.name" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div class="flex items-start justify-between gap-2 p-3 sm:p-4">
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold sm:text-base">{{ p.name }}</p>
              <p class="mt-0.5 line-clamp-2 hidden text-xs text-muted sm:block">{{ p.desc }}</p>
              <p class="mt-1.5 text-sm font-bold text-pink">Desde {{ money(p.base - 10) }}</p>
            </div>
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-soft text-pink transition group-hover:bg-pink group-hover:text-white">
              <Plus :size="16" />
            </span>
          </div>
        </button>
      </li>
    </ul>
  </section>

  <ProductModal :product="selected" @close="selected = null" />
</template>
