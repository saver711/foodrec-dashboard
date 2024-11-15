import { useAuthStore } from '@/stores/auth.store'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/public-views/login/login-view.vue'),
    },
    {
      path: '/dashboard-users',
      name: 'dashboardUsers',
      meta: { permission: { action: 'read', resource: 'dashboard_users' } },
      component: () => import('@/views/dashboard-users.vue'),
    },
    {
      path: '/recommendations',
      name: 'recommendations',
      meta: { permission: { action: 'read', resource: 'recommendations' } },
      component: () =>
        import('@/views/recommendations/recommendations-view.vue'),
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/unauthorized.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthorized = authStore.isRouteAuthorized(to.meta)
  const isAuthenticated = authStore.isAuthenticated

  if (!isAuthorized) {
    return next('/unauthorized') // Redirect if not authorized
  }

  if (to.name === 'login' && isAuthenticated) {
    return next('/')
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  next()
})
export default router
