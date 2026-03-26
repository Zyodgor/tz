import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            meta: { requiresGuest: true }
        },
        {
            path: '/',
            name: 'users',
            component: () => import('../views/UsersView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/users/:id',
            name: 'user-detail',
            component: () => import('../views/UserDetailView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: () => import('../views/FavoritesView.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()
    const isAuth = authStore.checkAuth()

    if (to.meta.requiresAuth && !isAuth) {
        next('/login')
    } else if (to.meta.requiresGuest && isAuth) {
        next('/')
    } else {
        next()
    }
})

export default router