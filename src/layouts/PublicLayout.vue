<script setup lang="ts">
import { ShoppingBag, PackageSearch, MapPin, Phone, AtSign } from 'lucide-vue-next'
import CartDrawer from '../components/CartDrawer.vue'
import { BUSINESS, asset } from '../data'
import { cartCount, ui } from '../store'
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <router-link to="/" class="flex items-center gap-2.5">
        <img :src="asset('img/logo.jpg')" alt="Logo de Copo Ice" class="h-10 w-10 rounded-full object-cover ring-1 ring-line" />
        <div class="leading-tight">
          <p class="font-display text-lg font-bold text-cyan-dark">Copo Ice</p>
          <p class="text-[11px] text-muted">{{ BUSINESS.slogan }}</p>
        </div>
      </router-link>
      <div class="flex items-center gap-2">
        <router-link id="nav-seguimiento" to="/seguimiento" class="btn btn-ghost">
          <PackageSearch :size="16" /> <span class="hidden sm:inline">Seguir pedido</span>
        </router-link>
        <button id="nav-carrito" class="btn btn-primary relative" @click="ui.cartOpen = true">
          <ShoppingBag :size="16" /> <span class="hidden sm:inline">Carrito</span>
          <span
            v-if="cartCount"
            class="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan px-1 text-[11px] font-bold text-white"
          >
            {{ cartCount }}
          </span>
        </button>
      </div>
    </div>
  </header>

  <main><router-view /></main>

  <footer class="mt-16 border-t border-line bg-white">
    <div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <p class="flex items-center gap-2"><MapPin :size="15" class="text-pink" /> {{ BUSINESS.address }}</p>
      <p class="flex items-center gap-2"><Phone :size="15" class="text-pink" /> {{ BUSINESS.phone }}</p>
      <p class="flex items-center gap-2"><AtSign :size="15" class="text-pink" /> {{ BUSINESS.instagram }}</p>
    </div>
  </footer>
  <CartDrawer />
</template>
