export function useDateFormat() {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const formatFullDate = (date: string) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        formatDate,
        formatFullDate
    }
}