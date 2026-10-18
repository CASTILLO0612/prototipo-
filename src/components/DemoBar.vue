<script setup lang="ts">
import { Palette, RotateCcw, Smartphone, LayoutDashboard } from 'lucide-vue-next'
import { resetDemo, ui } from '../store'
</script>

<template>
  <div class="z-[60] flex items-center justify-between gap-3 bg-ink px-4 py-1.5 text-xs text-white/80">
    <span class="hidden font-medium tracking-wide sm:inline">PROTOTIPO DE DEMOSTRACIÓN · datos ficticios</span>
    <nav class="mx-auto flex items-center gap-1 sm:mx-0">
      <router-link
        id="demo-portal"
        to="/"
        class="flex items-center gap-1.5 rounded-lg px-2.5 py-1 hover:bg-white/10"
        active-class="!bg-white/15 text-white"
        exact-active-class="!bg-white/15 text-white"
      >
        <Smartphone :size="14" /> Portal cliente
      </router-link>
      <router-link
        id="demo-admin"
        to="/admin"
        class="flex items-center gap-1.5 rounded-lg px-2.5 py-1 hover:bg-white/10"
        active-class="!bg-white/15 text-white"
      >
        <LayoutDashboard :size="14" /> Panel interno
      </router-link>
    </nav>
    <div class="flex items-center gap-1">
      <button
        id="demo-palette"
        class="flex items-center gap-1.5 rounded-lg px-2.5 py-1 hover:bg-white/10"
        @click="ui.paletteOpen = true"
      >
        <Palette :size="14" /> <span class="hidden sm:inline">Paleta</span>
      </button>
      <button
        id="demo-reset"
        class="flex items-center gap-1.5 rounded-lg px-2.5 py-1 hover:bg-white/10"
        @click="resetDemo"
      >
        <RotateCcw :size="14" /> <span class="hidden sm:inline">Reiniciar</span>
      </button>
    </div>
  </div>
</template>
