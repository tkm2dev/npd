// composables/useFilters.js
import { ref, computed } from 'vue'

export function useFilters(items) {
  const searchQuery = ref('')
  const selectedType = ref('')
  const selectedStatus = ref('')

  const filteredItems = computed(() => {
    return items.value.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesType = !selectedType.value || item.type === selectedType.value
      const matchesStatus = !selectedStatus.value || item.status === selectedStatus.value
      return matchesSearch && matchesType && matchesStatus
    })
  })

  return {
    searchQuery,
    selectedType,
    selectedStatus,
    filteredItems,
  }
}
