import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/pages/Dashboard.vue'
import Devices from '@/pages/Devices.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import NotFound from '@/pages/NotFound.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/set-password',
    name: 'SetPassword',
    component: () => import('@/pages/SetPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/devices',
    name: 'Devices',
    component: Devices,
    meta: { requiresAuth: true }
  },
  {
    path: '/owners',
    name: 'Owners',
    component: () => import('@/pages/Owners.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/pages/Admin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/pages/Chat.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/consumption',
    name: 'Consumption',
    component: () => import('@/pages/Consumption.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    // Redirect non-admin users away from admin routes
    next('/dashboard')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    // Redirect authenticated users away from login/register pages
    if (authStore.isAdmin) {
      next('/admin')
    } else {
      next('/dashboard')
    }
  } else {
    next()
  }
})

export default router

