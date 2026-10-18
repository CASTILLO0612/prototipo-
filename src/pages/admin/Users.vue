<script setup lang="ts">
import { ShieldCheck, ClipboardList, Eye } from 'lucide-vue-next'
import { USERS } from '../../data'

const icon = { Administrador: ShieldCheck, Operador: ClipboardList, Consulta: Eye } as const
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h1 class="font-display text-3xl font-bold">Usuarios y roles</h1>
      <p class="text-sm text-muted">Los permisos se validan en el servidor, aunque la interfaz oculte un botón.</p>
    </div>
    <ul class="space-y-3">
      <li v-for="u in USERS" :key="u.name" class="card flex items-center gap-4 p-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-soft text-cyan-dark">
          <component :is="icon[u.role as keyof typeof icon]" :size="20" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="font-semibold">{{ u.name }}</p>
          <p class="text-xs text-muted">{{ u.scope }}</p>
        </div>
        <span class="chip bg-pink-soft text-pink-dark">{{ u.role }}</span>
      </li>
    </ul>
  </div>
</template>
