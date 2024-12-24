<template>
  <v-container fluid class="drug-records-dashboard pa-6">
    <!-- Header Card -->
    <v-card class="mb-6 rounded-lg">
      <v-card-title class="header-section py-6 px-6">
        <div class="d-flex flex-column flex-md-row justify-space-between align-center w-100">
          <div class="d-flex align-center">
            <v-icon large color="primary" class="mr-3">mdi-database-search</v-icon>
            <h1 class="text-h5 font-weight-bold primary--text mb-0">
              ระบบบันทึกข้อมูลการใช้ยาเสพติด
            </h1>
          </div>
          <div class="stat-chips mt-3 mt-md-0 d-flex flex-wrap justify-end">
            <v-chip outlined color="primary" class="mr-2 mb-2 font-weight-medium">
              <v-icon left small>mdi-file-document-multiple</v-icon>
              ข้อมูลทั้งหมด {{ totalRecords }} รายการ
            </v-chip>
            <v-chip outlined color="success" class="mb-2 font-weight-medium">
              <v-icon left small>mdi-check-circle</v-icon>
              ไม่พบการใช้ยา {{ cleanRecords }} ราย
            </v-chip>
          </div>
        </div>
      </v-card-title>

      <!-- Search and Filter Section -->
      <v-card-text class="pb-6">
        <v-row align="center" justify="center">
          <v-col cols="12" md="5">
            <v-text-field
              v-model="searchQuery"
              label="ค้นหาด้วยชื่อหรือเลขบัตรประชาชน"
              prepend-inner-icon="mdi-magnify"
              outlined
              dense
              hide-details
              clearable
              class="search-field"
              @keyup.enter="fetchData"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn color="primary" block @click="fetchData" :loading="loading" elevation="2">
              <v-icon left>mdi-magnify</v-icon>
              ค้นหา
            </v-btn>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              block
              outlined
              @click="showFilterDialog = true"
              class="filter-btn"
              color="grey darken-1"
            >
              <v-icon left>mdi-filter-variant</v-icon>
              ตัวกรอง
              <v-badge
                v-if="activeFilters > 0"
                :content="activeFilters"
                color="primary"
                offset-x="10"
                offset-y="10"
              ></v-badge>
            </v-btn>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn block color="success" @click="exportToExcel" :loading="exporting" elevation="2">
              <v-icon left>mdi-file-excel</v-icon>
              ส่งออก
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card class="rounded-lg">
          <v-card-text class="d-flex align-center">
            <v-avatar color="primary" size="50" class="mr-4">
              <v-icon dark>mdi-account-group</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 grey--text">จำนวนผู้ใช้ยาเสพติด</div>
              <div class="text-h5 font-weight-bold">{{ drugUsers }} ราย</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="rounded-lg">
          <v-card-text class="d-flex align-center">
            <v-avatar color="error" size="50" class="mr-4">
              <v-icon dark>mdi-pill</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 grey--text">ประเภทยาที่พบมากที่สุด</div>
              <div class="text-h5 font-weight-bold">{{ mostUsedDrug }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="rounded-lg">
          <v-card-text class="d-flex align-center">
            <v-avatar color="warning" size="50" class="mr-4">
              <v-icon dark>mdi-map-marker</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 grey--text">พื้นที่พบมากที่สุด</div>
              <div class="text-h5 font-weight-bold">{{ mostAffectedArea }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card class="rounded-lg">
      <v-data-table
        :headers="tableHeaders"
        :items="drugRecords"
        :items-per-page="limit"
        :loading="loading"
        :footer-props="{
          'items-per-page-options': [10, 20, 50],
          'items-per-page-text': 'แสดง:',
        }"
        class="elevation-0 custom-table"
        :server-items-length="totalRecords"
        @update:page="handlePageChange"
        @update:items-per-page="handleLimitChange"
      >
        <!-- Status Column -->
        <template v-slot:[`item.has_used_drugs`]="{ item }">
          <v-chip
            :color="item.has_used_drugs === 'พบ' ? 'error' : 'success'"
            small
            label
            class="font-weight-medium"
          >
            {{ item.has_used_drugs }}
          </v-chip>
        </template>

        <!-- Actions Column -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="info"
                small
                v-bind="attrs"
                v-on="on"
                class="action-btn text-none"
                elevation="1"
              >
                <v-icon left small>mdi-dots-vertical</v-icon>
                จัดการ
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="viewDetails(item)">
                <v-list-item-icon>
                  <v-icon>mdi-eye</v-icon>
                </v-list-item-icon>
                <v-list-item-title>ดูรายละเอียด</v-list-item-title>
              </v-list-item>
              <v-list-item @click="printRecord(item)">
                <v-list-item-icon>
                  <v-icon>mdi-printer</v-icon>
                </v-list-item-icon>
                <v-list-item-title>พิมพ์</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <!-- Loading State -->
        <template v-slot:loading>
          <v-skeleton-loader
            v-for="n in limit"
            :key="n"
            type="list-item-avatar-three-line"
            class="my-2"
          ></v-skeleton-loader>
        </template>

        <!-- No Data State -->
        <template v-slot:no-data>
          <v-alert type="info" class="ma-4" outlined>
            <v-icon left>mdi-information</v-icon>
            ไม่พบข้อมูลที่ค้นหา
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- Detail Dialog -->
    <v-dialog v-model="dialog" max-width="900" scrollable>
      <v-card class="detail-dialog">
        <v-toolbar color="primary" dark class="dialog-header" elevation="0">
          <v-icon large class="mr-3">mdi-account-details</v-icon>
          <v-toolbar-title class="text-h6">รายละเอียดข้อมูล</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12">
              <!-- Personal Information -->
              <v-sheet class="pa-4 mb-4 rounded-lg" elevation="2">
                <div class="text-h6 mb-4 primary--text d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                  ข้อมูลส่วนตัว
                </div>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <div class="detail-label">ชื่อ-นามสกุล</div>
                      <div class="detail-value">
                        {{ selectedRecord.title }} {{ selectedRecord.first_name }}
                        {{ selectedRecord.last_name }}
                      </div>
                    </div>
                    <div class="detail-item">
                      <div class="detail-label">เลขบัตรประชาชน</div>
                      <div class="detail-value">{{ selectedRecord.id_card }}</div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <div class="detail-label">ที่อยู่</div>
                      <div class="detail-value">{{ formatAddress(selectedRecord.address) }}</div>
                    </div>
                    <div class="detail-item">
                      <div class="detail-label">อายุ</div>
                      <div class="detail-value">{{ selectedRecord.age }} ปี</div>
                    </div>
                  </v-col>
                </v-row>
              </v-sheet>

              <!-- Drug Usage Information -->
              <v-sheet class="pa-4 mb-4 rounded-lg" elevation="2">
                <div class="text-h6 mb-4 error--text d-flex align-center">
                  <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
                  ข้อมูลการใช้ยา
                </div>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <div class="detail-label">สถานะการใช้ยาเสพติด</div>
                      <v-chip
                        :color="selectedRecord.has_used_drugs === 'พบ' ? 'error' : 'success'"
                        small
                        label
                      >
                        {{ selectedRecord.has_used_drugs }}
                      </v-chip>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6" v-if="selectedRecord.has_used_drugs === 'พบ'">
                    <div class="detail-item">
                      <div class="detail-label">ประเภทยา</div>
                      <div class="mt-2">
                        <v-chip
                          v-for="(drug, i) in selectedRecord.drug_types"
                          :key="i"
                          small
                          class="mr-2 mb-2"
                          color="error"
                          outlined
                        >
                          {{ drug }}
                        </v-chip>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-sheet>

              <!-- Recorder Information -->
              <v-sheet class="pa-4 rounded-lg" elevation="2">
                <div class="text-h6 mb-4 success--text d-flex align-center">
                  <v-icon color="success" class="mr-2">mdi-account-check</v-icon>
                  ข้อมูลผู้บันทึก
                </div>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <div class="detail-label">ชื่อ-นามสกุล</div>
                      <div class="detail-value">{{ selectedRecord.recordedBy }}</div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <div class="detail-label">สังกัด</div>
                      <div class="detail-value">{{ selectedRecord.recordedByStation }}</div>
                    </div>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Filter Dialog -->
    <v-dialog v-model="showFilterDialog" max-width="600">
      <v-card>
        <v-card-title class="headline">
          ตัวกรองข้อมูล
          <v-spacer></v-spacer>
          <v-btn icon @click="showFilterDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                label="สถานะการใช้ยา"
                outlined
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="filters.province"
                :items="provinceOptions"
                label="จังหวัด"
                outlined
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="filters.ageFrom"
                label="อายุตั้งแต่"
                type="number"
                outlined
                dense
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="filters.ageTo"
                label="อายุถึง"
                type="number"
                outlined
                dense
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-menu v-model="dateMenu" :close-on-content-click="false" max-width="290">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="filters.dateRange"
                    label="ช่วงวันที่"
                    readonly
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                    clearable
                    @click:clear="filters.dateRange = null"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filters.dateRange"
                  range
                  scrollable
                  @change="dateMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="resetFilters">
            <v-icon left>mdi-refresh</v-icon>
            รีเซ็ต
          </v-btn>
          <v-btn color="primary" @click="applyFilters">
            <v-icon left>mdi-check</v-icon>
            นำไปใช้
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import * as XLSX from 'xlsx'

export default {
  setup() {
    const drugRecords = ref([])
    const searchQuery = ref('')
    const loading = ref(false)
    const exporting = ref(false)
    const dialog = ref(false)
    const showFilterDialog = ref(false)
    const dateMenu = ref(false)
    const selectedRecord = reactive({})
    const totalRecords = ref(0)
    const cleanRecords = ref(0)
    const drugUsers = ref(0)
    const mostUsedDrug = ref('ยาบ้า')
    const mostAffectedArea = ref('กรุงเทพมหานคร')
    const limit = ref(10)
    const page = ref(1)
    const URL_API = import.meta.env.VITE_API_BASE_URL

    const filters = reactive({
      status: null,
      province: null,
      ageFrom: null,
      ageTo: null,
      dateRange: null,
    })

    const statusOptions = ['พบสารเสพติด', 'ไม่พบสารเสพติด']

    const provinceOptions = [
      'กรุงเทพมหานคร',
      'เชียงใหม่',
      'นครราชสีมา',
      // เพิ่มจังหวัดอื่นๆ
    ]

    const tableHeaders = [
      { text: 'จังหวัด', value: 'address.province', sortable: true },
      { text: 'ชื่อ-นามสกุล', value: 'fullname', sortable: true },
      { text: 'อายุ', value: 'age', sortable: true },
      { text: 'เลขบัตรประชาชน', value: 'id_card' },
      { text: 'สถานะการใช้ยา', value: 'has_used_drugs', align: 'center' },
      { text: 'การจัดการ', value: 'actions', align: 'center', sortable: false },
    ]

    const activeFilters = computed(() => {
      return Object.values(filters).filter((value) => value !== null).length
    })

    const formatAddress = (addressJson) => {
      try {
        const address = typeof addressJson === 'string' ? JSON.parse(addressJson) : addressJson
        return `${address.houseNo || ''} หมู่ ${address.moo || ''}, ต.${address.tambon || ''}, อ.${
          address.amphoe || ''
        }, จ.${address.province || ''} ${address.postalCode || ''}`
      } catch (error) {
        console.error('Invalid JSON format:', error)
        return 'ข้อมูลที่อยู่ไม่ถูกต้อง'
      }
    }

    const fetchData = async () => {
      loading.value = true
      try {
        const response = await axios.get(URL_API + '/api/drug-survey', {
          params: {
            page: page.value,
            limit: limit.value,
            query: searchQuery.value,
            ...filters,
          },
        })

        if (response.data.success) {
          // ปรับปรุงข้อมูลตาราง
          drugRecords.value = response.data.data
          totalRecords.value = response.data.pagination.total
          cleanRecords.value = response.data.stats.clean
          drugUsers.value = response.data.stats.users
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }

    const handlePageChange = (newPage) => {
      page.value = newPage
      fetchData()
    }

    const handleLimitChange = (newLimit) => {
      limit.value = newLimit
      page.value = 1
      fetchData()
    }

    const viewDetails = (item) => {
      Object.assign(selectedRecord, item)
      dialog.value = true
    }

    const printRecord = (item) => {
      // Implement print functionality
      window.print()
    }

    const exportToExcel = async () => {
      exporting.value = true
      try {
        // สร้าง workbook
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(drugRecords.value)
        XLSX.utils.book_append_sheet(wb, ws, 'Drug Records')

        // บันทึกไฟล์
        XLSX.writeFile(wb, 'drug_records.xlsx')
      } catch (error) {
        console.error('Export error:', error)
      } finally {
        exporting.value = false
      }
    }

    const resetFilters = () => {
      Object.keys(filters).forEach((key) => {
        filters[key] = null
      })
    }

    const applyFilters = () => {
      page.value = 1
      fetchData()
      showFilterDialog.value = false
    }

    // โหลดข้อมูลครั้งแรก
    fetchData()

    return {
      drugRecords,
      searchQuery,
      loading,
      exporting,
      dialog,
      showFilterDialog,
      dateMenu,
      selectedRecord,
      totalRecords,
      cleanRecords,
      drugUsers,
      mostUsedDrug,
      mostAffectedArea,
      limit,
      page,
      filters,
      statusOptions,
      provinceOptions,
      tableHeaders,
      activeFilters,
      formatAddress,
      fetchData,
      handlePageChange,
      handleLimitChange,
      viewDetails,
      printRecord,
      exportToExcel,
      resetFilters,
      applyFilters,
    }
  },
}
</script>

<style scoped>
.text-h5 {
  font-family: 'Sarabun', sans-serif;
}
.drug-records-container {
  max-width: 1400px;
  margin: 0 auto;
}

.search-card {
  border-radius: 12px;
  transition: transform 0.2s;
}

.search-card:hover {
  transform: translateY(-2px);
}

.records-table-card {
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  background-color: #f5f7fa;
  padding: 20px;
}

.status-chip {
  min-width: 70px;
  justify-content: center;
}

.action-btn {
  text-transform: none;
  letter-spacing: 0.5px;
}

.detail-dialog {
  border-radius: 16px;
}

.dialog-header {
  background-color: #f5f7fa;
  padding: 20px;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-label {
  font-weight: 600;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 1.1em;
}

.v-data-table ::v-deep .v-data-table__wrapper {
  border-radius: 0 0 12px 12px;
}

.v-data-table ::v-deep tbody tr:nth-of-type(odd) {
  background-color: #f9fafc;
}

.v-data-table ::v-deep tbody tr:hover {
  background-color: #f0f4f8 !important;
}
</style>
