import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface FavoriteUser {
    id: number
    firstName: string
    lastName: string
    phone: string
    birthDate: string
    image?: string
}

export const useFavoritesStore = defineStore('favorites', () => {
    const favorites = ref<FavoriteUser[]>([])
    const currentUserId = ref<number | null>(null)

    function loadFavorites(userId: number) {
        currentUserId.value = userId
        const key = `favorites_${userId}`
        const stored = localStorage.getItem(key)

        if (stored) {
            try {
                favorites.value = JSON.parse(stored)
            } catch (error) {
                console.error('Error parsing favorites:', error)
                favorites.value = []
            }
        } else {
            favorites.value = []
        }
    }

    function saveFavorites() {
        if (currentUserId.value) {
            const key = `favorites_${currentUserId.value}`
            localStorage.setItem(key, JSON.stringify(favorites.value))
        }
    }

    function addFavorite(user: FavoriteUser) {
        if (!favorites.value.find(f => f.id === user.id)) {
            favorites.value.push(user)
            saveFavorites()
        }
    }

    function removeFavorite(userId: number) {
        favorites.value = favorites.value.filter(f => f.id !== userId)
        saveFavorites()
    }

    function isFavorite(userId: number): boolean {
        return favorites.value.some(f => f.id === userId)
    }

    function clearFavorites() {
        favorites.value = []
        if (currentUserId.value) {
            const key = `favorites_${currentUserId.value}`
            localStorage.removeItem(key)
        }
    }

    return {
        favorites,
        loadFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
    }
})