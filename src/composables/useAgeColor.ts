import { computed } from 'vue'

export function useAgeColor(age: number) {
    const colorClass = computed(() => {
        if (age < 30) return 'text-green'
        if (age <= 50) return 'text-orange'
        return 'text-red'
    })

    const getAgeColor = (ageValue: number) => {
        if (ageValue < 30) return 'text-green'
        if (ageValue <= 50) return 'text-orange'
        return 'text-red'
    }

    const getColorClass = getAgeColor

    return {
        colorClass,
        getAgeColor,
        getColorClass
    }
}