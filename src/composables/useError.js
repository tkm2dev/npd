// composables/useError.js
import { ref } from 'vue'

export function useError() {
  const error = ref(null)
  const showError = ref(false)

  const handleError = (err) => {
    error.value = err.message
    showError.value = true
    setTimeout(() => {
      showError.value = false
      error.value = null
    }, 3000)
  }

  return {
    error,
    showError,
    handleError,
  }
}
