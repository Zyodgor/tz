import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export interface User {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    phone: string
    birthDate: string
    age: number
    gender: string
    image: string
    company: {
        name: string
        department: string
        title: string
    }
}

export interface AuthResponse {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    gender: string
    image: string
    token: string
}

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const token = ref<string | null>(null)
    const user = ref<User | null>(null)
    const isAuthenticated = computed(() => !!token.value)

    function init() {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            token.value = storedToken
            user.value = JSON.parse(storedUser)
        }
    }

    async function login(username: string, password: string) {
        try {
            const response = await axios.post<AuthResponse>('https://dummyjson.com/auth/login', {
                username,
                password,
                expiresInMins: 30,
            })
            const { token: newToken, ...userData } = response.data
            token.value = newToken
            user.value = userData as User
            localStorage.setItem('token', newToken)
            localStorage.setItem('user', JSON.stringify(userData))
            return { success: true }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, error: 'Invalid credentials' }
        }
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
    }

    function checkAuth() {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            token.value = storedToken
            user.value = JSON.parse(storedUser)
            return true
        }
        return false
    }

    init()

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout,
        checkAuth,
        init,
    }
})