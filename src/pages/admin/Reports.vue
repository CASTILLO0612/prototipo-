<script setup lang="ts">
import { FileText, FileSpreadsheet } from 'lucide-vue-next'
import { money, notify, topProducts } from '../../store'
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="font-display text-3xl font-bold">Reportes</h1>
        <p class="text-sm text-muted">Ventas, costo y ganancia estimada por producto.</p>
      </div>
      <div class="flex gap-2">
        <button id="export-pdf" class="btn btn-ghost" @click="notify('PDF generado (simulación)')"><FileText :size="16" /> PDF</button>
        <button id="export-xlsx" class="btn btn-ghost" @click="notify('Excel generado (simulación)')"><FileSpreadsheet :size="16" /> Excel</button>
      </div>
    </div>

    <section class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="text-xs uppercase tracking-wide text-muted">
            <tr><th class="px-5 py-3">Producto</th><th class="text-right">Unidades</th><th class="text-right">Ingresos</th><th class="text-right">Costo</th><th class="pr-5 text-right">Ganancia bruta</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in topProducts" :key="p.name" class="border-t border-line">
              <td class="px-5 py-3 font-medium">{{ p.name }}</td>
              <td class="text-right">{{ p.units }}</td>
              <td class="text-right">{{ money(p.revenue) }}</td>
              <td class="text-right text-muted">{{ money(p.cost) }}</td>
              <td class="pr-5 text-right font-semibold text-pink">{{ money(p.revenue - p.cost) }}</td>
            </tr>
            <tr v-if="!topProducts.length"><td colspan="5" class="px-5 py-8 text-center text-muted">Completa un pedido para ver datos.</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
