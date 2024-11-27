// composables/useSearch.js
import { ref } from 'vue'
import { drugService } from '@/services/drugService'

export function useSearch() {
  const searchTerm = ref('')
  const searchResults = ref([])
  const isSearching = ref(false)
  const searchError = ref(null)

  const searchPerson = async (params) => {
    if (!params.query) return

    isSearching.value = true
    searchError.value = null

    try {
      const results = await drugService.searchPersons(params)
      searchResults.value = results
      return results
    } catch (error) {
      searchError.value = error.message
      throw error
    } finally {
      isSearching.value = false
    }
  }

  const getPersonHistory = async (idCard) => {
    try {
      const history = await drugService.getPersonHistory(idCard)
      return history
    } catch (error) {
      searchError.value = error.message
      throw error
    }
  }

  const clearSearch = () => {
    searchTerm.value = ''
    searchResults.value = []
    searchError.value = null
  }

  return {
    searchTerm,
    searchResults,
    isSearching,
    searchError,
    searchPerson,
    getPersonHistory,
    clearSearch,
  }
}
