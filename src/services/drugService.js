// src/services/drugService.js
import api from './api'

export const drugService = {
  // ดึงข้อมูลทั้งหมด
  async getAll(params = {}) {
    const response = await api.get('/drugs', { params })
    return response.data
  },

  // ดึงข้อมูลตาม ID
  async getById(id) {
    const response = await api.get(`/drugs/${id}`)
    return response.data
  },

  // สร้างข้อมูลใหม่
  async create(data) {
    const response = await api.post('/drugs', data)
    return response.data
  },

  // อัพเดทข้อมูล
  async update(id, data) {
    const response = await api.put(`/drugs/${id}`, data)
    return response.data
  },

  // ลบข้อมูล
  async delete(id) {
    const response = await api.delete(`/drugs/${id}`)
    return response.data
  },

  // สร้าง Export
  async export(type = 'excel') {
    const response = await api.get(`/drugs/export/${type}`, {
      responseType: 'blob',
    })
    return response.data
  },
  // ค้นหาข้อมูล
  async searchPersons(params) {
    try {
      const response = await api.get('/search', { params })
      return response.data
    } catch (error) {
      throw new Error('ไม่สามารถค้นหาข้อมูลได้')
    }
  },

  // ดึงข้อมูลประวัติ
  async getPersonHistory(idCard) {
    try {
      const response = await api.get(`/persons/${idCard}/history`)
      return response.data
    } catch (error) {
      throw new Error('ไม่สามารถดึงข้อมูลประวัติได้')
    }
  },
}
