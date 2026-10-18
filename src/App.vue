<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import DemoBar from './components/DemoBar.vue'
import PaletteModal from './components/PaletteModal.vue'
import { toast } from './store'
</script>

<template>
  <div class="flex min-h-full flex-col">
    <DemoBar />
    <div class="flex-1">
      <router-view />
    </div>
    <PaletteModal />
    <Transition name="rise">
      <div
        v-if="toast"
        id="toast"
        class="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-lg"
      >
        <Check :size="16" class="text-cyan" /> {{ toast }}
      </div>
    </Transition>
  </div>
</template>
