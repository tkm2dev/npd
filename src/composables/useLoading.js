// src/composables/useLoading.js
import { ref } from 'vue'

export function useLoading() {
  const loading = ref(false)
  const loadingText = ref('')

  const withLoading = async (callback, text = 'กำลังโหลด...') => {
    loading.value = true
    loadingText.value = text
    try {
      return await callback()
    } finally {
      loading.value = false
      loadingText.value = ''
    }
  }

  return {
    loading,
    loadingText,
    withLoading,
  }
}
