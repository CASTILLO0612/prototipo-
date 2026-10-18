import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import { state } from './store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./layouts/PublicLayout.vue'),
      children: [
        { path: '', name: 'menu', component: () => import('./pages/public/Menu.vue') },
        { path: 'pedido-nuevo', name: 'checkout', component: () => import('./pages/public/Checkout.vue') },
        { path: 'seguimiento/:code?', name: 'tracking', component: () => import('./pages/public/Tracking.vue') },
      ],
    },
    { path: '/admin/acceso', name: 'login', component: () => import('./pages/admin/Login.vue') },
    {
      path: '/admin',
      component: () => import('./layouts/AdminLayout.vue'),
      children: [
        { path: '', redirect: '/admin/pedidos' },
        { path: 'dashboard', name: 'dashboard', component: () => import('./pages/admin/Dashboard.vue') },
        { path: 'pedidos', name: 'pedidos', component: () => import('./pages/admin/Orders.vue') },
        { path: 'inventario', name: 'inventario', component: () => import('./pages/admin/Inventory.vue') },
        { path: 'promociones', name: 'promociones', component: () => import('./pages/admin/Promotions.vue') },
        { path: 'reportes', name: 'reportes', component: () => import('./pages/admin/Reports.vue') },
        { path: 'usuarios', name: 'usuarios', component: () => import('./pages/admin/Users.vue') },
      ],
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  if (to.path.startsWith('/admin') && to.name !== 'login' && !state.role) return '/admin/acceso'
})

createApp(App).use(router).mount('#app')
