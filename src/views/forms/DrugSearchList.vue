// DrugSurvey.vue
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'

// Constants
const URL_API = import.meta.env.VITE_API_BASE_URL
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

// State
const surveys = ref([])
const loading = ref(false)
const error = ref(null)
const searchDialog = ref(false)
const dateFromMenu = ref(false)
const dateToMenu = ref(false)
const totalRecords = ref(0)
const detailDialog = ref(false)
const selectedItem = ref(null)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

// Table config
const headers = ref([
  {
    title: 'จังหวัด',
    key: 'province',
    align: 'start',
    sortable: true,
    width: '80px',
  },
  {
    title: 'ชื่อ-สกุล',
    key: 'fullname',
    sortable: true,
    width: '200px',
  },
  {
    title: 'เลขบัตรประชาชน',
    key: 'id_card',
    sortable: true,
    width: '150px',
  },
  {
    title: 'อายุ',
    key: 'age',
    sortable: true,
    width: '80px',
    align: 'center',
  },
  {
    title: 'ที่อยู่',
    key: 'address',
    width: '250px',
  },
  {
    title: 'สถานะตรวจ',
    key: 'status',
    sortable: true,
    width: '100px',
    align: 'center',
  },
  {
    title: 'วันที่ตรวจ',
    key: 'check_date',
    sortable: true,
    width: '120px',
  },
  {
    title: 'ผู้บันทึก',
    key: 'recorder_name',
    sortable: true,
    width: '150px',
  },
])

// Search parameters
const searchParams = ref({
  query: '',
  province: '',
  amphoe: '',
  tambon: '',
  sex: '',
  status: '',
  ageFrom: '',
  ageTo: '',
  dateFrom: '',
  dateTo: '',
})

// State
const statistics = ref({
  totalRecords: 0,
  foundCases: 0,
  cleanCases: 0,
  maleCases: 0,
  femaleCases: 0,
  uniqueCases: 0,
  topProvince: '',
  topProvinceCases: 0,
})

// Options for dropdowns
const provinces = ['สกลนคร', 'นครพนม']
const districts = ref([])
const subDistricts = ref([])
const sexOptions = ['ชาย', 'หญิง']
const statusOptions = ['พบ', 'ไม่พบ']

// Table options
const tableOptions = ref({
  page: 1,
  itemsPerPage: 50,
  sortBy: ['created_at'],
  sortDesc: [true],
})

const handleQuickSearch = debounce(async () => {
  tableOptions.value.page = 1 // รีเซ็ตกลับไปหน้าแรก
  await fetchSurveys()
}, 500) // หน่วงเวลา 500ms

// เพิ่ม import debounce
import { debounce } from 'lodash'

// computed สำหรับการแบ่งหน้า
const totalPages = computed(() => {
  return Math.ceil(totalRecords.value / tableOptions.value.itemsPerPage)
})

// อัพเดทฟังก์ชัน resetSearch
const resetSearch = () => {
  if (window.confirm('ต้องการรีเซ็ตการค้นหาใช่หรือไม่?')) {
    // รีเซ็ตทั้ง quick search และ advanced search
    Object.keys(searchParams.value).forEach((key) => {
      searchParams.value[key] = ''
    })
    tableOptions.value.page = 1
    fetchSurveys()
    showSnackbar('รีเซ็ตการค้นหาเรียบร้อย')
  }
}

const foundDrugCases = computed(() => {
  if (!Array.isArray(surveys.value)) return 0
  return surveys.value.filter((s) => s.has_used_drugs === 'พบ').length
})

// Computed properties
const processedSurveys = computed(() => {
  return surveys.value.map((survey) => {
    if (!survey)
      return {
        id: '',
        fullname: 'ข้อมูลไม่สมบูรณ์',
        address: 'ไม่ระบุ',
        province: 'ไม่ระบุ',
        check_date: '-',
        recorder_name: '-',
      }

    try {
      const address =
        typeof survey.address === 'string' ? JSON.parse(survey.address) : survey.address || {}

      return {
        ...survey,
        address:
          `${address.houseNo || ''} ม. ${address.moo || ''} ต.${address.tambon || ''} อ.${
            address.amphoe || ''
          } จ.${address.province || ''}`.trim() || 'ไม่ระบุ',
        province: address.province || 'ไม่ระบุ',
        check_date: survey.created_at_local,
        status: survey.has_used_drugs, // แก้ไขตรงนี้

        recorder_name: `${survey.recordedBy || ''} ${survey.recordedByStation || ''}`,
      }
    } catch (err) {
      console.error('Error processing survey data:', err, survey)
      return {
        ...survey,
        fullname: 'ข้อมูลไม่สมบูรณ์',
        address: 'ไม่ระบุ',
      }
    }
  })
})

// Methods
const formatDetailAddress = (address) => {
  try {
    const addr = typeof address === 'string' ? JSON.parse(address) : address || {}
    return {
      houseNo: addr.houseNo || 'ไม่ระบุ',
      moo: addr.moo || 'ไม่ระบุ',
      tambon: addr.tambon || 'ไม่ระบุ',
      amphoe: addr.amphoe || 'ไม่ระบุ',
      province: addr.province || 'ไม่ระบุ',
    }
  } catch (err) {
    console.error('Error parsing address:', err)
    return {
      houseNo: 'ไม่ระบุ',
      moo: 'ไม่ระบุ',
      tambon: 'ไม่ระบุ',
      amphoe: 'ไม่ระบุ',
      province: 'ไม่ระบุ',
    }
  }
}

const showSnackbar = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color,
  }
}

const handleRowClick = (item) => {
  selectedItem.value = item
  detailDialog.value = true
}

// API calls
const fetchSurveys = async () => {
  loading.value = true
  error.value = null

  try {
    const params = {
      page: tableOptions.value.page,
      limit: tableOptions.value.itemsPerPage,
      sort: {
        sortBy: tableOptions.value.sortBy?.[0] || 'id',
        sortOrder: tableOptions.value.sortDesc?.[0] ? 'DESC' : 'ASC',
      },
      // ปรับ filters ให้ตรงกับ API
      query: searchParams.value.query || null,
      province: searchParams.value.province || null,
      amphoe: searchParams.value.amphoe || null,
      tambon: searchParams.value.tambon || null,
      sex: searchParams.value.sex || null,
      status: searchParams.value.status || null,
      age: {
        from: searchParams.value.ageFrom || null,
        to: searchParams.value.ageTo || null,
      },
      created_at: {
        from: searchParams.value.dateFrom || null,
        to: searchParams.value.dateTo || null,
      },
    }

    const response = await axios.get(`${URL_API}/api/drug-survey`, { params })
    if (response.data.success) {
      surveys.value = response.data.data || []
      totalRecords.value = response.data.total || 0

      // อัพเดท statistics ถ้ามี
      if (response.data.statistics) {
        statistics.value = {
          totalRecords: response.data.statistics.totalRecords || 0,
          foundCases: response.data.statistics.foundCases || 0,
          cleanCases: response.data.statistics.cleanCases || 0,
          maleCases: response.data.statistics.maleCases || 0,
          femaleCases: response.data.statistics.femaleCases || 0,
          uniqueCases: response.data.statistics.uniqueCases || 0,
          topProvince: response.data.statistics.topProvince || '',
          topProvinceCases: response.data.statistics.topProvinceCases || 0,
        }
      }
    } else {
      throw new Error('ไม่สามารถดึงข้อมูลได้')
    }
  } catch (err) {
    console.error('API Error:', err)
    error.value = 'เกิดข้อผิดพลาดในการดึงข้อมูล: ' + (err.response?.data?.message || err.message)
    surveys.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // Validate age range
  if (searchParams.value.ageFrom && searchParams.value.ageTo) {
    if (parseInt(searchParams.value.ageFrom) > parseInt(searchParams.value.ageTo)) {
      showSnackbar('ช่วงอายุไม่ถูกต้อง', 'error')
      return
    }
  }

  // Validate date range
  if (searchParams.value.dateFrom && searchParams.value.dateTo) {
    if (new Date(searchParams.value.dateFrom) > new Date(searchParams.value.dateTo)) {
      showSnackbar('ช่วงวันที่ไม่ถูกต้อง', 'error')
      return
    }
  }

  tableOptions.value.page = 1
  searchDialog.value = false
  fetchSurveys()
}

// Watchers
watch([() => tableOptions.value.page, () => tableOptions.value.itemsPerPage], () => {
  fetchSurveys()
})

const resetFilters = () => {
  searchParams.value.query = ''
  searchParams.value.province = ''
  tableOptions.value.page = 1
  handleQuickSearch()
}

// Lifecycle hooks
onMounted(() => {
  fetchSurveys()
})
</script>

<template>
  <v-container fluid>
    <!-- ส่วนแสดงสถิติ -->
    <!-- <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h5 mb-1">{{ statistics.totalRecords }}</div>
            <div class="text-caption">จำนวนทั้งหมด</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h5 mb-1 text-error">{{ statistics.foundCases }}</div>
            <div class="text-caption">พบการใช้สารเสพติด</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h5 mb-1 text-success">{{ statistics.cleanCases }}</div>
            <div class="text-caption">ไม่พบการใช้สารเสพติด</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h5 mb-1">{{ statistics.uniqueCases }}</div>
            <div class="text-caption">จำนวนผู้ใช้รายใหม่</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->

    <v-card class="mb-4">
      <v-toolbar color="primary">
        <v-toolbar-title>ข้อมูลการตรวจสารเสพติด (X-Ray)</v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- ช่องค้นหาด่วน -->
        <v-text-field
          v-model="searchParams.query"
          placeholder="ค้นหา ชื่อ, เลขบัตร..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          class="mx-2"
          style="max-width: 300px"
          bg-color="white"
          clearable
          @update:model-value="handleQuickSearch"
        ></v-text-field>

        <!-- เลือกจังหวัด -->
        <v-select
          v-model="searchParams.province"
          :items="provinces"
          label="จังหวัด"
          variant="outlined"
          density="compact"
          hide-details
          class="mx-2"
          style="max-width: 200px"
          bg-color="white"
          @update:model-value="handleQuickSearch"
          clearable
        ></v-select>

        <!-- Pagination Controls -->
        <div class="d-flex align-center mx-2">
          <v-select
            v-model="tableOptions.itemsPerPage"
            :items="ITEMS_PER_PAGE_OPTIONS"
            label="แสดง"
            variant="outlined"
            density="compact"
            hide-details
            class="mx-2"
            style="max-width: 100px"
            bg-color="white"
          ></v-select>

          <v-pagination
            v-model="tableOptions.page"
            :length="Math.ceil(totalRecords / tableOptions.itemsPerPage)"
            :total-visible="3"
            density="compact"
            class="mx-2"
            color="white"
          ></v-pagination>
        </div>

        <!-- ปุ่มค้นหาขั้นสูง -->
        <v-btn
          color="white"
          variant="outlined"
          prepend-icon="mdi-file-search"
          @click="searchDialog = true"
          class="ml-2"
        >
          ค้นหาขั้นสูง
        </v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="processedSurveys"
        :loading="loading"
        v-model:options="tableOptions"
        :items-per-page="tableOptions.itemsPerPage"
        :items-per-page-options="ITEMS_PER_PAGE_OPTIONS"
        :server-items-length="totalRecords"
        hover
        class="elevation-1"
      >
        <!-- Loading Progress -->
        <template v-slot:progress>
          <v-progress-linear color="primary" indeterminate></v-progress-linear>
        </template>

        <!-- Custom Status Column -->
        <template v-slot:item.has_used_drugs="{ item }">
          <v-chip
            :color="item.raw.has_used_drugs === 'พบ' ? 'error' : 'success'"
            size="small"
            label
          >
            <v-icon
              :icon="item.raw.has_used_drugs === 'พบ' ? 'mdi-alert-circle' : 'mdi-check-circle'"
              start
              size="small"
            ></v-icon>
            {{ item.raw.has_used_drugs }}
          </v-chip>
        </template>

        <!-- Custom Date Column -->
        <template v-slot:item.created_at_local="{ item }">
          <span>{{ item.raw.created_at_local }}</span>
        </template>

        <!-- No Data Message -->
        <template v-slot:no-data>
          <v-alert type="info" variant="tonal" icon="mdi-alert-circle-outline">
            ไม่พบข้อมูล
          </v-alert>
        </template>

        <!-- Bottom Slot for Summary -->
        <template v-slot:bottom>
          <div class="pa-4 d-flex justify-end">
            <v-chip color="primary" class="mr-2">
              จำนวนทั้งหมด: {{ statistics.totalRecords }} รายการ
            </v-chip>
            <v-chip :color="foundDrugCases > 0 ? 'error' : 'grey'">
              พบ: {{ foundDrugCases }} รายการ
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-data-table {
  border-radius: 8px;
}

.v-data-table :deep(th) {
  font-weight: 600 !important;
  background-color: #f5f5f5 !important;
}

.v-data-table :deep(td) {
  padding: 8px 16px !important;
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
}

.v-toolbar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.text-subtitle-2 {
  margin-bottom: 4px;
}

.v-card-text {
  max-height: 80vh;
  overflow-y: auto;
}

:deep(.v-pagination__item) {
  color: white;
}

:deep(.v-pagination__item--is-active) {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

/* ปรับขนาด select ให้กะทัดรัด */
:deep(.v-field__input) {
  min-height: unset !important;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}
</style>
