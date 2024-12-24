<template>
  <v-container>
    <!-- Loading Overlay -->
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <!-- Header -->
    <v-row justify="center" class="mb-6">
      <v-col cols="12" class="text-center">
        <h1 class="text-h4 mb-2">แผนที่แสดงตำแหน่งบุคคล</h1>
        <p class="text-subtitle-1 text-medium-emphasis">ระบบค้นหาและแสดงตำแหน่งบุคคลบนแผนที่</p>
      </v-col>
    </v-row>

    <!-- Alert Messages -->
    <v-row v-if="errorMessage || successMessage">
      <v-col cols="12">
        <v-alert
          v-if="errorMessage"
          type="error"
          closable
          variant="tonal"
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
        <v-alert
          v-if="successMessage"
          type="success"
          closable
          variant="tonal"
          @click:close="successMessage = ''"
        >
          {{ successMessage }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Search Controls -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="searchForm.village"
              label="หมู่บ้าน"
              placeholder="กรอกชื่อหมู่บ้าน"
              variant="outlined"
              density="comfortable"
              @keyup.enter="searchOnMap"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="searchForm.tambon"
              label="ตำบล"
              placeholder="กรอกชื่อตำบล"
              variant="outlined"
              density="comfortable"
              @keyup.enter="searchOnMap"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="searchForm.amphoe"
              label="อำเภอ"
              placeholder="กรอกชื่ออำเภอ"
              variant="outlined"
              density="comfortable"
              @keyup.enter="searchOnMap"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="searchForm.province"
              label="จังหวัด"
              placeholder="กรุณาระบุจังหวัด"
              variant="outlined"
              density="comfortable"
              @keyup.enter="searchOnMap"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card-title class="pb-2">
              <v-icon icon="mdi-filter-variant" class="mr-2"></v-icon>
              เลือกประเภทที่จะแสดง
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="type in personTypes" :key="type.value" cols="12" sm="4">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      v-bind="props"
                      :elevation="isHovering ? 4 : 1"
                      :class="{ 'on-hover': isHovering }"
                      class="pa-2 transition-swing"
                      :color="
                        selectedTypes.includes(type.value) ? `${type.color}` : 'grey-lighten-3'
                      "
                    >
                      <v-checkbox
                        v-model="selectedTypes"
                        :label="type.label"
                        :value="type.value"
                        density="comfortable"
                        :color="type.color"
                        hide-details
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <v-icon :icon="type.icon" size="small" class="mr-2"></v-icon>
                            {{ type.label }}
                          </div>
                        </template>
                      </v-checkbox>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
            </v-card-text>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
              color="primary"
              block
              @click="searchOnMap"
              :loading="loading"
              prepend-icon="mdi-magnify"
            >
              ค้นหา
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.type" cols="12" sm="6" md="4">
        <v-card :color="stat.color" variant="tonal" elevation="2">
          <v-card-item>
            <v-card-title>
              <v-icon :icon="stat.icon" size="large" class="mr-2"></v-icon>
              {{ stat.label }}
            </v-card-title>
            <v-card-text>
              <div class="text-h4">{{ stat.count }}</div>
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Map -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <div class="map-container">
          <div id="map" ref="mapRef" style="height: 600px; border-radius: 8px">
            <div class="map-controls">
              <v-btn
                icon="mdi-crosshairs"
                size="small"
                variant="tonal"
                color="primary"
                @click="centerMap"
                class="mb-2"
              ></v-btn>
              <v-btn
                icon="mdi-fullscreen"
                size="small"
                variant="tonal"
                color="primary"
                @click="toggleFullscreen"
              ></v-btn>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Results Table -->
    <v-card elevation="2">
      <v-card-title class="d-flex align-center pa-4">
        <span>ผลการค้นหา</span>
        <v-spacer></v-spacer>
        <v-select
          v-model="pageSize"
          :items="pageSizes"
          label="จำนวนรายการ"
          variant="outlined"
          density="comfortable"
          hide-details
          style="max-width: 150px"
        ></v-select>
      </v-card-title>

      <v-data-table :headers="tableHeaders" :items="results" :loading="loading" hover>
        <template v-slot:item.type="{ item }">
          <v-chip :color="getChipColor(item.type)" variant="tonal" size="small">
            {{ item.type }}
          </v-chip>
        </template>
      </v-data-table>

      <v-card-actions class="justify-center pa-4">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :disabled="loading"
          @update:modelValue="searchOnMap"
          rounded="circle"
          density="comfortable"
        ></v-pagination>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import L from 'leaflet'
import { useAuthStore } from '@/stores/auth'

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
const pageSizes = [
  { title: '10 รายการ', value: 10 },
  { title: '25 รายการ', value: 25 },
  { title: '50 รายการ', value: 50 },
  { title: '100 รายการ', value: 100 },
]

const personTypes = [
  {
    id: 'type-arrest',
    value: 'บุคคลมีหมายจับ',
    label: 'บุคคลมีหมายจับ',
    icon: 'mdi-account-alert',
    color: 'error',
  },
  {
    id: 'type-released',
    value: 'บุคคลพ้นโทษ',
    label: 'บุคคลพ้นโทษ',
    icon: 'mdi-account-check',
    color: 'primary',
  },
  {
    id: 'type-criminal',
    value: 'บุคคลมีคดี',
    label: 'บุคคลมีคดี',
    icon: 'mdi-gavel',
    color: 'success',
  },
]
const markerColors = {
  บุคคลมีหมายจับ: '#dc2626',
  บุคคลพ้นโทษ: '#2563eb',
  บุคคลมีคดี: '#059669',
}

const tableHeaders = [
  { title: 'ชื่อ', key: 'name', align: 'start' },
  { title: 'หมู่บ้าน', key: 'village', align: 'start' },
  { title: 'เลขบัตรประชาชน', key: 'national_id', align: 'start' },
  { title: 'ประเภท', key: 'type', align: 'start' },
  { title: 'ตำบล', key: 'tambon', align: 'start' },
  { title: 'อำเภอ', key: 'amphoe', align: 'start' },
  { title: 'จังหวัด', key: 'province', align: 'start' },
]

const stats = ref([
  {
    type: 'arrest',
    count: 0,
    label: 'บุคคลมีหมายจับ',
    icon: 'mdi-account-alert',
    color: 'error',
  },
  {
    type: 'released',
    count: 0,
    label: 'บุคคลพ้นโทษ',
    icon: 'mdi-account-check',
    color: 'primary',
  },
  {
    type: 'criminal',
    count: 0,
    label: 'บุคคลมีคดี',
    icon: 'mdi-gavel',
    color: 'success',
  },
])

// Methods
const initMap = () => {
  map.value = L.map(mapRef.value).setView([13.736717, 100.523186], 8)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value)
}

const getChipColor = (type) => {
  switch (type) {
    case 'บุคคลมีหมายจับ':
      return 'error'
    case 'บุคคลพ้นโทษ':
      return 'primary'
    case 'บุคคลมีคดี':
      return 'success'
    default:
      return 'default'
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
  const authStore = useAuthStore()

  try {
    const url_baes = 'http://localhost:3000'
    const response = await axios.get(url_baes + '/api/persons', {
      params: {
        ...searchForm.value,
        type: selectedTypes.value.join(','),
        limit: pageSize.value,
        offset: (currentPage.value - 1) * pageSize.value,
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`,
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
              <div style="margin-bottom: 5px;"><strong>เลขบัตรประชาชน:</strong> ${person.national_id}</div>
              <div style="margin-bottom: 5px;"><strong>ประเภท:</strong> ${person.type}</div>
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
/* Import Leaflet CSS */
@import 'leaflet/dist/leaflet.css';

.map-container {
  position: relative;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Custom popup styles */
.leaflet-popup-content-wrapper {
  padding: 16px;
  border-radius: 8px;
}

.leaflet-popup-content {
  margin: 0;
}

/* Custom marker styles */
.leaflet-div-icon {
  background: transparent;
  border: none;
}

/* Map height for different screen sizes */
@media (min-width: 768px) {
  #map {
    height: 600px;
  }
}

@media (max-width: 767px) {
  #map {
    height: 400px;
  }
}

/* Ensure map container takes full width */
.map-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

/* Custom marker popup styles */
.marker-popup {
  font-family: inherit;
}

.marker-popup h3 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
  font-weight: 600;
}

.marker-popup-details {
  margin-bottom: 5px;
  font-size: 0.9em;
}

.marker-popup-details strong {
  font-weight: 600;
  min-width: 100px;
  display: inline-block;
}

/* Animation for statistics */
.stat-value {
  transition: all 0.3s ease;
}

/* Custom scrollbar for tables */
.v-data-table {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.v-data-table::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.v-data-table::-webkit-scrollbar-track {
  background: transparent;
}

.v-data-table::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .v-data-table {
    font-size: 0.9em;
  }

  .v-card-title {
    flex-direction: column;
    gap: 16px;
  }

  .page-size-select {
    width: 100%;
    max-width: none;
  }
}
</style>
