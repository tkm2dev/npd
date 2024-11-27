// src/stores/drug.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { drugService } from '@/services/drugService'

export const useDrugStore = defineStore('drug', () => {
  const records = ref([])
  const loading = ref(false)
  const error = ref(null)

  // ดึงข้อมูลทั้งหมด
  const fetchRecords = async (params) => {
    loading.value = true
    error.value = null
    try {
      const response = await drugService.getAll(params)
      records.value = response.data
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ดึงข้อมูลตาม ID
  const getRecord = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await drugService.getById(id)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // สร้างข้อมูลใหม่
  const createRecord = async (data) => {
    loading.value = true
    error.value = null
    try {
      const response = await drugService.create(data)
      records.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // อัพเดทข้อมูล
  const updateRecord = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      const response = await drugService.update(id, data)
      const index = records.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        records.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ลบข้อมูล
  const deleteRecord = async (id) => {
    loading.value = true
    error.value = null
    try {
      await drugService.delete(id)
      records.value = records.value.filter((r) => r.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Export ข้อมูล
  const exportData = async (type) => {
    loading.value = true
    error.value = null
    try {
      const blob = await drugService.export(type)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `drug-records.${type}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    records,
    loading,
    error,
    fetchRecords,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord,
    exportData,
  }
})
