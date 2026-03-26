import { ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

interface User {
    id: number
    firstName: string
    lastName: string
    email: string
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

interface Post {
    id: number
    title: string
    body: string
}

export function useUserDetail() {
    const route = useRoute()
    const user = ref<User | null>(null)
    const posts = ref<Post[]>([])
    const loading = ref(false)
    const postsLoading = ref(false)

    const loadUser = async () => {
        loading.value = true
        try {
            const response = await axios.get(`https://dummyjson.com/users/${route.params.id}`)
            user.value = response.data
        } catch (error) {
            console.error('Error loading user:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    const loadPosts = async () => {
        postsLoading.value = true
        try {
            const response = await axios.get(`https://dummyjson.com/users/${route.params.id}/posts`)
            posts.value = response.data.posts || []
        } catch (error) {
            console.error('Error loading posts:', error)
            posts.value = []
        } finally {
            postsLoading.value = false
        }
    }

    const getPostsWord = (count: number): string => {
        if (count % 10 === 1 && count % 100 !== 11) return 'пост'
        if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'поста'
        return 'постов'
    }

    return {
        user,
        posts,
        loading,
        postsLoading,
        loadUser,
        loadPosts,
        getPostsWord
    }
}