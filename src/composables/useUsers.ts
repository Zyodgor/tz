import { ref, computed } from 'vue'
import axios from 'axios'

export interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    birthDate: string
    age: number
    image: string
}

export function useUsers() {
    const users = ref<User[]>([])
    const loading = ref(false)
    const searchQuery = ref('')
    const sortKey = ref<keyof User>('id')
    const sortOrder = ref<'asc' | 'desc'>('asc')
    const itemsPerPage = ref(10)
    const currentPage = ref(1)

    const loadUsers = async () => {
        loading.value = true
        try {
            const response = await axios.get('https://dummyjson.com/users', {
                params: { limit: 100 }
            })
            users.value = response.data.users || []
        } catch (error) {
            console.error('Error loading users:', error)
            users.value = []
        } finally {
            loading.value = false
        }
    }

    const filteredUsers = computed(() => {
        if (!users.value || !Array.isArray(users.value)) {
            return []
        }

        let result = [...users.value]

        if (searchQuery.value && searchQuery.value.trim()) {
            const query = searchQuery.value.toLowerCase().trim()
            result = result.filter(user =>
                user && (
                    `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
                    (user.phone && user.phone.includes(query)) ||
                    (user.email && user.email.toLowerCase().includes(query))
                )
            )
        }

        if (result.length > 0 && sortKey.value) {
            result.sort((a, b) => {
                let aVal: any = a[sortKey.value]
                let bVal: any = b[sortKey.value]

                if (sortKey.value === 'firstName') {
                    aVal = `${a.firstName} ${a.lastName}`
                    bVal = `${b.firstName} ${b.lastName}`
                }

                if (typeof aVal === 'string') {
                    return sortOrder.value === 'asc'
                        ? (aVal || '').localeCompare(bVal || '')
                        : (bVal || '').localeCompare(aVal || '')
                } else {
                    return sortOrder.value === 'asc'
                        ? (aVal || 0) - (bVal || 0)
                        : (bVal || 0) - (aVal || 0)
                }
            })
        }

        return result
    })

    const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value))
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
    const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredUsers.value.length))
    const paginatedUsers = computed(() => filteredUsers.value.slice(startIndex.value, endIndex.value))

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++
        }
    }

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--
        }
    }

    const setItemsPerPage = (value: number) => {
        itemsPerPage.value = value
        currentPage.value = 1
    }

    const setSearchQuery = (query: string) => {
        searchQuery.value = query
        currentPage.value = 1
    }

    const setSort = (key: keyof User) => {
        if (sortKey.value === key) {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortKey.value = key
            sortOrder.value = 'asc'
        }
    }

    return {
        users,
        loading,
        searchQuery,
        sortKey,
        sortOrder,
        itemsPerPage,
        currentPage,
        filteredUsers,
        totalPages,
        startIndex,
        endIndex,
        paginatedUsers,
        loadUsers,
        nextPage,
        prevPage,
        setItemsPerPage,
        setSearchQuery,
        setSort
    }
}