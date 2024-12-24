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
  //search จาก ทีอยู่
  async searchAddress(query) {
    try {
      // ส่งค่า query ไปที่ api ด้วย params ชื่อ keyword
      // fetch(Urlbase + `/api/area-search?${params}`)
      console.log('query', query)
      const response = await api.get('/area-search', {
        params: { query },
      })

      return response.data
    } catch (error) {
      throw new Error('ไม่สามารถค้นหาข้อมูลได้')
    }
  },
}
