<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ShieldCheck, ClipboardList, Eye, ArrowLeft } from 'lucide-vue-next'
import { ROLE_ACCESS, state } from '../../store'
import { asset } from '../../data'
import type { Role } from '../../types'

const router = useRouter()
const roles: { r: Role; icon: typeof ShieldCheck; d: string }[] = [
  { r: 'Administrador', icon: ShieldCheck, d: 'Todo el sistema, finanzas incluidas' },
  { r: 'Operador', icon: ClipboardList, d: 'Pedidos e inventario operativo' },
  { r: 'Consulta', icon: Eye, d: 'Solo lectura' },
]

function enter(r: Role) {
  state.role = r
  router.push(`/admin/${ROLE_ACCESS[r][0]}`)
}
</script>

<template>
  <div class="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10">
    <img :src="asset('img/logo.jpg')" alt="Copo Ice" class="mx-auto mb-5 h-20 w-20 rounded-full ring-1 ring-line" />
    <h1 class="text-center font-display text-2xl font-bold">Panel interno</h1>
    <p class="mb-6 mt-1 text-center text-sm text-muted">Elige un rol para explorar la demostración.</p>
    <div class="space-y-2.5">
      <button
        v-for="x in roles"
        :id="`role-${x.r}`"
        :key="x.r"
        class="card flex w-full items-center gap-3 p-4 text-left transition hover:border-pink hover:shadow-md"
        @click="enter(x.r)"
      >
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-soft text-pink"><component :is="x.icon" :size="20" /></span>
        <span>
          <span class="block text-sm font-semibold">{{ x.r }}</span>
          <span class="text-xs text-muted">{{ x.d }}</span>
        </span>
      </button>
    </div>
    <router-link to="/" class="mt-6 inline-flex items-center justify-center gap-1.5 text-sm text-muted hover:text-pink">
      <ArrowLeft :size="14" /> Volver al portal
    </router-link>
  </div>
</template>
