<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, ClipboardList, Boxes, Tag, BarChart3, Users, LogOut, Lock } from 'lucide-vue-next'
import { ROLE_ACCESS, state } from '../store'

const route = useRoute()
const router = useRouter()

const items = [
  { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
  { id: 'pedidos', label: 'Pedidos', icon: ClipboardList },
  { id: 'inventario', label: 'Inventario', icon: Boxes },
  { id: 'promociones', label: 'Promociones', icon: Tag },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'usuarios', label: 'Usuarios', icon: Users },
]
const allowed = computed(() => (state.role ? ROLE_ACCESS[state.role] : []))
const current = computed(() => String(route.path.split('/')[2] ?? ''))
const denied = computed(() => !!state.role && !allowed.value.includes(current.value))

function logout() {
  state.role = null
  router.push('/admin/acceso')
}
</script>

<template>
  <div class="flex min-h-[calc(100vh-30px)] flex-col md:flex-row">
    <aside class="border-b border-line bg-white md:w-56 md:shrink-0 md:border-b-0 md:border-r">
      <div class="hidden items-center gap-2.5 px-4 py-5 md:flex">
        <img src="/img/logo.jpg" alt="Copo Ice" class="h-9 w-9 rounded-full ring-1 ring-line" />
        <div class="leading-tight">
          <p class="font-display font-bold text-cyan-dark">Copo Ice</p>
          <p class="text-[11px] text-muted">{{ state.role }}</p>
        </div>
      </div>
      <nav class="flex gap-1 overflow-x-auto p-2 md:flex-col md:p-3">
        <template v-for="i in items" :key="i.id">
          <router-link
            v-if="allowed.includes(i.id)"
            :id="`nav-${i.id}`"
            :to="`/admin/${i.id}`"
            class="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-cream hover:text-ink"
            active-class="!bg-pink-soft !text-pink-dark"
          >
            <component :is="i.icon" :size="17" /> {{ i.label }}
          </router-link>
        </template>
        <button
          class="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-cream hover:text-ink md:mt-4"
          @click="logout"
        >
          <LogOut :size="17" /> Salir
        </button>
      </nav>
    </aside>

    <main class="min-w-0 flex-1 p-4 md:p-8">
      <div v-if="denied" class="card mx-auto mt-10 max-w-sm p-8 text-center">
        <Lock :size="28" class="mx-auto mb-3 text-muted" />
        <p class="text-sm font-semibold">Sin permiso para esta sección</p>
        <p class="mt-1 text-xs text-muted">El servidor valida los permisos de cada rol.</p>
      </div>
      <router-view v-else />
    </main>
  </div>
</template>
