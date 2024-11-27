// src/services/searchService.js
import api from './api'

export const searchService = {
  async searchPerson(query) {
    try {
      const response = await api.get('/search-human', {
        params: { keyword: query },
      })

      return response.data
    } catch (error) {
      throw new Error('ไม่สามารถค้นหาข้อมูลได้')
    }
  },
}
