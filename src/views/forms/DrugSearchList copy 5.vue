<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// State
const surveys = ref([])
const loading = ref(false)
const error = ref(null)
const searchDialog = ref(false)
const headers = ref([
  { title: 'รหัส', key: 'id', align: 'start' },
  { title: 'ชื่อ-สกุล', key: 'fullName' },
  { title: 'เลขบัตรประชาชน', key: 'id_card' },
  { title: 'อายุ', key: 'age' },
  { title: 'ที่อยู่', key: 'address' },
  { title: 'วันที่ตรวจ', key: 'check_date' },
  { title: 'ผลตรวจ', key: 'result' },
  { title: 'ประเภทยา', key: 'drug_type' },
  { title: 'ผู้บันทึก', key: 'recorder_name' },
])

const searchParams = ref({
  startDate: '',
  endDate: '',
  name: '',
  idCard: '',
  province: '',
  district: '',
  subDistrict: '',
  result: '',
  drugType: '',
  age: null,
  ageRange: [0, 100],
})

// Options for dropdowns
const provinces = ['สกลนคร', 'นครพนม']
const districts = ref([])
const subDistricts = ref([])
const results = ['พบ', 'ไม่พบ']
const drugTypes = ['ยาบ้า', 'กัญชา', 'ไอซ์', 'อื่นๆ']

// Table options with default values
const tableOptions = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: ['id'],
  sortDesc: [true],
})

const URL_API = import.meta.env.VITE_API_BASE_URL

// Fetch data with improved error handling
const fetchSurveys = async () => {
  loading.value = true
  error.value = null

  try {
    // Remove empty values from searchParams
    const cleanedParams = Object.entries(searchParams.value).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {})

    console.log('Clean search params:', cleanedParams)

    const response = await axios.get(`${URL_API}/api/drug-survey`, {
      params: {
        ...cleanedParams,
        page: tableOptions.value.page,
        per_page: tableOptions.value.itemsPerPage,
        sort_by: tableOptions.value.sortBy?.[0] || 'id',
        sort_desc: tableOptions.value.sortDesc?.[0] ?? true,
      },
    })

    if (response.data && Array.isArray(response.data.data)) {
      surveys.value = response.data.data
    } else {
      surveys.value = []
      error.value = 'ข้อมูลที่ได้รับไม่ถูกต้องตามรูปแบบ'
    }
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'เกิดข้อผิดพลาดในการดึงข้อมูล: ' + (err.response?.data?.message || err.message)
    surveys.value = []
  } finally {
    loading.value = false
  }
}

// Improved data processing with error handling
const processedSurveys = computed(() => {
  return surveys.value.map((survey) => {
    try {
      const address =
        typeof survey.address === 'string' ? JSON.parse(survey.address) : survey.address || {}

      const drugInfo =
        typeof survey.drug_info === 'string' ? JSON.parse(survey.drug_info) : survey.drug_info || {}

      return {
        ...survey,
        fullName:
          `${survey.title || ''}${survey.firstname || ''} ${survey.lastname || ''}`.trim() ||
          'ไม่ระบุ',
        address:
          `${address.tambon || ''} ${address.amphoe || ''} ${address.province || ''}`.trim() ||
          'ไม่ระบุ',
        drug_type: drugInfo.type || '-',
        drug_amount: drugInfo.amount || '-',
      }
    } catch (err) {
      console.error('Error processing survey data:', err, survey)
      return {
        ...survey,
        fullName: 'ข้อมูลไม่สมบูรณ์',
        address: 'ไม่ระบุ',
        drug_type: '-',
        drug_amount: '-',
      }
    }
  })
})

// Reset search with confirmation
const resetSearch = () => {
  if (window.confirm('ต้องการรีเซ็ตการค้นหาใช่หรือไม่?')) {
    searchParams.value = {
      startDate: '',
      endDate: '',
      name: '',
      idCard: '',
      province: '',
      district: '',
      subDistrict: '',
      result: '',
      drugType: '',
      age: null,
      ageRange: [0, 100],
    }
    fetchSurveys() // Fetch data after reset
  }
}

// Export to Excel with error handling
const exportToExcel = () => {
  try {
    if (!surveys.value.length) {
      alert('ไม่มีข้อมูลสำหรับการ Export')
      return
    }

    const data = processedSurveys.value.map((survey) => ({
      รหัส: survey.id,
      'ชื่อ-สกุล': survey.firstname + ' ' + survey.lastname,
      เลขบัตรประชาชน: survey.id_card,
      อายุ: survey.age,
      ที่อยู่: survey.address,
      วันที่ตรวจ: survey.check_date,
      ผลตรวจ: survey.result,
      ประเภทยา: survey.drug_type,
      จำนวน: survey.drug_amount,
      ผู้บันทึก: survey.recorder_name,
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Drug Survey')
    XLSX.writeFile(workbook, `drug_survey_report_${new Date().toISOString().slice(0, 10)}.xlsx`)
  } catch (err) {
    console.error('Error exporting to Excel:', err)
    alert('เกิดข้อผิดพลาดในการ Export ข้อมูล')
  }
}

// Handle search with validation
const handleSearch = () => {
  if (searchParams.value.startDate && searchParams.value.endDate) {
    if (new Date(searchParams.value.startDate) > new Date(searchParams.value.endDate)) {
      alert('วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด')
      return
    }
  }

  searchDialog.value = false
  fetchSurveys()
}

// Initialize
onMounted(() => {
  fetchSurveys()
})
</script>

<template>
  <v-container fluid>
    <!-- Search Dialog -->
    <v-dialog v-model="searchDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">ค้นหาข้อมูล</span>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchParams.name"
                label="ชื่อ-สกุล"
                prepend-icon="mdi-account"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchParams.idCard"
                label="เลขบัตรประชาชน"
                prepend-icon="mdi-card-account-details"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-menu
                ref="startMenu"
                v-model="startMenu"
                :close-on-content-click="false"
                transition="scale-transition"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="searchParams.startDate"
                    label="วันที่เริ่มต้น"
                    prepend-icon="mdi-calendar"
                    v-bind="props"
                    clearable
                  />
                </template>
                <v-date-picker v-model="searchParams.startDate" @click="startMenu = false" />
              </v-menu>
            </v-col>
            <v-col cols="12" md="6">
              <v-menu
                ref="endMenu"
                v-model="endMenu"
                :close-on-content-click="false"
                transition="scale-transition"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="searchParams.endDate"
                    label="วันที่สิ้นสุด"
                    prepend-icon="mdi-calendar"
                    v-bind="props"
                    clearable
                  />
                </template>
                <v-date-picker v-model="searchParams.endDate" @click="endMenu = false" />
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="searchParams.province"
                :items="provinces"
                label="จังหวัด"
                prepend-icon="mdi-map-marker"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="searchParams.district"
                :items="districts"
                label="อำเภอ"
                prepend-icon="mdi-map-marker"
                clearable
                :disabled="!searchParams.province"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="searchParams.subDistrict"
                :items="subDistricts"
                label="ตำบล"
                prepend-icon="mdi-map-marker"
                clearable
                :disabled="!searchParams.district"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="searchParams.result"
                :items="results"
                label="ผลตรวจ"
                prepend-icon="mdi-flask"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="searchParams.drugType"
                :items="drugTypes"
                label="ประเภทยา"
                prepend-icon="mdi-pill"
                clearable
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-label>ช่วงอายุ</v-label>
              <v-range-slider
                v-model="searchParams.ageRange"
                :min="0"
                :max="100"
                thumb-label="always"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="resetSearch">รีเซ็ต</v-btn>
          <v-btn color="primary" @click="handleSearch">ค้นหา</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Main Content -->
    <v-card>
      <v-card-title class="d-flex align-center">
        <span>ข้อมูลการตรวจสารเสพติด</span>
        <v-spacer />
        <v-btn color="primary" prepend-icon="mdi-magnify" @click="searchDialog = true" class="mr-2">
          ค้นหา
        </v-btn>
        <v-btn color="success" prepend-icon="mdi-microsoft-excel" @click="exportToExcel">
          Export Excel
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="processedSurveys"
        :loading="loading"
        v-model:options="tableOptions"
        class="elevation-1"
      >
        <!-- Custom column formatting -->
        <template v-slot:item.result="{ item }">
          <v-chip :color="item.result === 'พบ' ? 'error' : 'success'" :text-color="white">
            {{ item.result }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
