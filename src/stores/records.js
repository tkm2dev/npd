// stores/records.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRecordsStore = defineStore('records', () => {
  const records = ref([])
  const currentPage = ref(1)
  const totalRecords = ref(0)
  const loading = ref(false)

  const totalPages = computed(() => Math.ceil(totalRecords.value / 10))

  const fetchRecords = async () => {
    loading.value = true
    try {
      // Implement API call
      const response = await fetch(`/api/records?page=${currentPage.value}`)
      const data = await response.json()
      records.value = data.records
      totalRecords.value = data.total
    } catch (error) {
      console.error('Failed to fetch records:', error)
    } finally {
      loading.value = false
    }
  }

  const deleteRecord = async (id) => {
    try {
      await fetch(`/api/records/${id}`, { method: 'DELETE' })
      records.value = records.value.filter((record) => record.id !== id)
    } catch (error) {
      console.error('Failed to delete record:', error)
      throw error
    }
  }

  return {
    records,
    currentPage,
    totalRecords,
    totalPages,
    loading,
    fetchRecords,
    deleteRecord,
  }
})
