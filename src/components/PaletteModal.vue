<script setup lang="ts">
import { X, Copy } from 'lucide-vue-next'
import { PALETTE } from '../data'
import { notify, ui } from '../store'

function copy(hex: string) {
  navigator.clipboard?.writeText(hex)
  notify(`${hex} copiado`)
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="ui.paletteOpen"
      class="fixed inset-0 z-[65] flex items-center justify-center bg-ink/40 p-4"
      @click.self="ui.paletteOpen = false"
    >
      <div class="card w-full max-w-md p-6 shadow-xl">
        <div class="mb-1 flex items-center justify-between">
          <h2 class="font-display text-xl font-bold">Paleta de Copo Ice</h2>
          <button class="rounded-lg p-1 hover:bg-cream" aria-label="Cerrar" @click="ui.paletteOpen = false">
            <X :size="18" />
          </button>
        </div>
        <p class="mb-4 text-sm text-muted">Colores tomados del logotipo y del local.</p>
        <ul class="grid grid-cols-2 gap-3">
          <li v-for="c in PALETTE" :key="c.hex">
            <button class="card w-full overflow-hidden text-left transition hover:shadow-md" @click="copy(c.hex)">
              <div class="h-14 border-b border-line" :style="{ background: c.hex }" />
              <div class="p-2.5">
                <p class="text-sm font-semibold">{{ c.name }}</p>
                <p class="flex items-center gap-1 text-xs text-muted">
                  <Copy :size="11" /> {{ c.hex }}
                </p>
                <p class="mt-0.5 text-[11px] text-muted">{{ c.use }}</p>
              </div>
            </button>
          </li>
        </ul>
        <div class="mt-4 grid grid-cols-2 gap-2 text-xs text-muted">
          <p><span class="font-display text-base font-bold text-ink">Playfair Display</span><br />Títulos</p>
          <p><span class="text-base font-semibold text-ink">Inter</span><br />Interfaz y datos</p>
        </div>
      </div>
    </div>
  </Transition>
</template>
