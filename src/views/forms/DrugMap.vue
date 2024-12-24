<template>
  <div class="loading-overlay" v-if="loading">
    <div class="spinner"></div>
  </div>

  <div class="container">
    <div class="header animate__animated animate__fadeIn">
      <h1>แผนที่แสดงตำแหน่งบุคคล</h1>
      <p class="text-gray-600">ระบบค้นหาและแสดงตำแหน่งบุคคลบนแผนที่</p>
    </div>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

    <div class="controls animate__animated animate__fadeIn">
      <div class="search-grid">
        <div class="form-group">
          <label for="village">หมู่บ้าน:</label>
          <input
            type="text"
            id="village"
            v-model="searchForm.village"
            placeholder="กรอกชื่อหมู่บ้าน"
            @keypress.enter="searchOnMap"
          />
        </div>
        <div class="form-group">
          <label for="tambon">ตำบล:</label>
          <input
            type="text"
            id="tambon"
            v-model="searchForm.tambon"
            placeholder="กรอกชื่อตำบล"
            @keypress.enter="searchOnMap"
          />
        </div>
        <div class="form-group">
          <label for="amphoe">อำเภอ:</label>
          <input
            type="text"
            id="amphoe"
            v-model="searchForm.amphoe"
            placeholder="กรอกชื่ออำเภอ"
            @keypress.enter="searchOnMap"
          />
        </div>
        <div class="form-group">
          <label for="province">จังหวัด:</label>
          <input
            type="text"
            id="province"
            v-model="searchForm.province"
            placeholder="กรุณาระบุจังหวัด"
            @keypress.enter="searchOnMap"
          />
        </div>
      </div>

      <div class="checkbox-group">
        <legend>เลือกประเภทที่จะแสดง:</legend>
        <div class="checkbox-item" v-for="type in personTypes" :key="type.value">
          <input type="checkbox" :id="type.id" :value="type.value" v-model="selectedTypes" />
          <label :for="type.id">{{ type.label }}</label>
        </div>
      </div>

      <button @click="searchOnMap" class="search-button">
        <i class="fas fa-search"></i>
        ค้นหา
      </button>

      <div class="pagination-controls">
        <select v-model="pageSize" class="page-size-select">
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }} รายการ</option>
        </select>
        <div class="pagination-buttons">
          <button class="pagination-button" :disabled="currentPage === 1" @click="prevPage">
            <i class="fas fa-chevron-left"></i> ก่อนหน้า
          </button>
          <span id="pageInfo">หน้า {{ currentPage }} จาก {{ totalPages }}</span>
          <button
            class="pagination-button"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            ถัดไป <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="stats-container animate__animated animate__fadeIn">
      <div class="stat-card" v-for="stat in stats" :key="stat.type">
        <i :class="stat.icon" style="font-size: 2em" :style="{ color: stat.color }"></i>
        <div class="stat-value">{{ stat.count }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <div class="map-container relative">
      <div id="map" ref="mapRef"></div>
      <div class="map-controls">
        <button class="map-control-button" @click="centerMap" title="จัดกึ่งกลางแผนที่">
          <i class="fas fa-crosshairs"></i>
        </button>
        <button class="map-control-button" @click="toggleFullscreen" title="เต็มหน้าจอ">
          <i class="fas fa-expand"></i>
        </button>
      </div>
    </div>

    <div class="results-table animate__animated animate__fadeIn">
      <table>
        <thead>
          <tr>
            <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in results" :key="person.national_id">
            <td>{{ person.name }}</td>
            <td>{{ person.village }}</td>
            <td>{{ person.national_id }}</td>
            <td>
              <span :class="['type-badge', getTypeBadgeClass(person.type)]">
                {{ person.type }}
              </span>
            </td>
            <td>{{ person.tambon }}</td>
            <td>{{ person.amphoe }}</td>
            <td>{{ person.province }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import L from 'leaflet'

// State
const mapRef = ref(null)
const map = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const results = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = ref(10)

const searchForm = ref({
  village: '',
  tambon: '',
  amphoe: '',
  province: '',
})

const selectedTypes = ref(['บุคคลมีหมายจับ', 'บุคคลพ้นโทษ', 'บุคคลมีคดี'])

// Constants
const pageSizes = [10, 25, 50, 100]
const personTypes = [
  { id: 'type-arrest', value: 'บุคคลมีหมายจับ', label: 'บุคคลมีหมายจับ' },
  { id: 'type-released', value: 'บุคคลพ้นโทษ', label: 'บุคคลพ้นโทษ' },
  { id: 'type-criminal', value: 'บุคคลมีคดี', label: 'บุคคลมีคดี' },
]

const markerColors = {
  บุคคลมีหมายจับ: '#dc2626',
  บุคคลพ้นโทษ: '#2563eb',
  บุคคลมีคดี: '#059669',
}

const tableHeaders = ['ชื่อ', 'หมู่บ้าน', 'เลขบัตรประชาชน', 'ประเภท', 'ตำบล', 'อำเภอ', 'จังหวัด']

const stats = ref([
  {
    type: 'arrest',
    count: 0,
    label: 'บุคคลมีหมายจับ',
    icon: 'fas fa-user-shield',
    color: '#dc2626',
  },
  { type: 'released', count: 0, label: 'บุคคลพ้นโทษ', icon: 'fas fa-door-open', color: '#2563eb' },
  { type: 'criminal', count: 0, label: 'บุคคลมีคดี', icon: 'fas fa-gavel', color: '#059669' },
])

// Methods
const initMap = () => {
  map.value = L.map(mapRef.value).setView([13.736717, 100.523186], 8)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value)
}

const getTypeBadgeClass = (type) => {
  switch (type) {
    case 'บุคคลมีหมายจับ':
      return 'type-arrest'
    case 'บุคคลพ้นโทษ':
      return 'type-released'
    case 'บุคคลมีคดี':
      return 'type-criminal'
    default:
      return ''
  }
}

const showMessage = (message, isError = false) => {
  if (isError) {
    errorMessage.value = message
    setTimeout(() => (errorMessage.value = ''), 5000)
  } else {
    successMessage.value = message
    setTimeout(() => (successMessage.value = ''), 5000)
  }
}

const updateStats = (typeDistribution) => {
  stats.value = stats.value.map((stat) => ({
    ...stat,
    count: typeDistribution[stat.label] || 0,
  }))
}

const centerMap = () => {
  map.value.setView([13.736717, 100.523186], 8)
}

const toggleFullscreen = () => {
  const mapElement = mapRef.value
  if (!document.fullscreenElement) {
    mapElement.requestFullscreen?.() || mapElement.webkitRequestFullscreen?.()
  } else {
    document.exitFullscreen?.() || document.webkitExitFullscreen?.()
  }
}

const searchOnMap = async () => {
  loading.value = true

  try {
    const response = await axios.get('http://localhost:3000/api/persons', {
      params: {
        ...searchForm.value,
        type: selectedTypes.value.join(','),
        limit: pageSize.value,
        offset: (currentPage.value - 1) * pageSize.value,
      },
    })

    const { results: searchResults, pagination, summary } = response.data
    results.value = searchResults
    totalPages.value = pagination.pages

    // Clear existing markers
    map.value.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.value.removeLayer(layer)
      }
    })

    // Add new markers
    if (searchResults.length > 0) {
      const bounds = L.latLngBounds(searchResults.map((p) => [p.latitude, p.longitude]))

      searchResults.forEach((person) => {
        const color = markerColors[person.type] || '#666666'
        L.circleMarker([person.latitude, person.longitude], {
          radius: 8,
          color,
          fillColor: color,
          fillOpacity: 0.7,
          weight: 2,
        })
          .bindPopup(
            `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">${person.name}</h3>
            <div style="margin-bottom: 5px;"><strong>หมู่บ้าน:</strong> ${person.village}</div>
            <div style="margin-bottom: 5px;"><strong>เลขบัตรประชาชน:</strong> ${
              person.national_id
            }</div>
            <div style="margin-bottom: 5px;"><strong>ประเภท:</strong> <span class="type-badge ${getTypeBadgeClass(
              person.type
            )}">${person.type}</span></div>
            <div style="margin-bottom: 5px;"><strong>ตำบล:</strong> ${person.tambon}</div>
            <div style="margin-bottom: 5px;"><strong>อำเภอ:</strong> ${person.amphoe}</div>
            <div><strong>จังหวัด:</strong> ${person.province}</div>
          </div>
        `
          )
          .addTo(map.value)
      })

      map.value.fitBounds(bounds, { padding: [50, 50] })
      showMessage(`พบข้อมูลทั้งหมด ${pagination.total} รายการ`)
    } else {
      showMessage('ไม่พบข้อมูลในประเภทที่เลือก', true)
    }

    updateStats(summary.typeDistribution)
  } catch (error) {
    console.error('Error fetching data:', error)
    const errorMessage = error.response?.data?.error || 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    showMessage(errorMessage, true)
  } finally {
    loading.value = false
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    searchOnMap()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    searchOnMap()
  }
}

// Watchers
watch(pageSize, () => {
  currentPage.value = 1
  searchOnMap()
})

// Lifecycle hooks
onMounted(() => {
  initMap()
})
</script>


<style scoped>
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --success-color: #059669;
  --danger-color: #dc2626;
  --warning-color: #d97706;
  --background-color: #f8fafc;
  --border-radius: 8px;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

body {
  font-family: 'Sarabun', system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: var(--background-color);
  color: #1f2937;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.controls {
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 1.5rem;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.checkbox-group {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
}

.checkbox-group legend {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}

.checkbox-item input[type='checkbox'] {
  margin-right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
}

.search-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.search-button:hover {
  background-color: var(--secondary-color);
}

#map {
  height: 600px;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 1.5rem;
  position: relative;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: white;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.map-control-button {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.25rem;
  transition: background-color 0.2s;
}

.map-control-button:hover {
  background: #f3f4f6;
}

.results-table {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-top: 2rem;
}

.results-table table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th {
  background-color: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
}

.results-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.results-table tbody tr:hover {
  background-color: #f8fafc;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  text-align: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: var(--primary-color);
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
}

.type-arrest {
  background-color: #fee2e2;
  color: var(--danger-color);
}

.type-released {
  background-color: #dbeafe;
  color: var(--primary-color);
}

.type-criminal {
  background-color: #dcfce7;
  color: var(--success-color);
}

.pagination-controls {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.page-size-select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius);
  background: white;
  cursor: pointer;
}

.pagination-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius);
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.pagination-button:not(:disabled):hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message,
.success-message {
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  animation: fadeIn 0.3s ease-in-out;
}

.error-message {
  background: #fee2e2;
  color: var(--danger-color);
}

.success-message {
  background: #dcfce7;
  color: var(--success-color);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  body {
    padding: 10px;
  }

  .search-grid {
    grid-template-columns: 1fr;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .map-controls {
    bottom: 10px;
    top: auto;
    right: 10px;
    display: flex;
    flex-direction: column;
  }

  .results-table {
    overflow-x: auto;
  }
}
</style>
