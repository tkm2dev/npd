<template>
  <v-container class="drug-records-container">
    <!-- ส่วนค้นหา -->
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="10">
        <v-card elevation="2" class="search-card">
          <v-card-text>
            <v-row align="center" no-gutters>
              <v-col cols="12" md="10" class="pr-md-4">
                <v-text-field
                  v-model="searchQuery"
                  label="ค้นหาด้วยชื่อหรือเลขบัตรประชาชน"
                  outlined
                  dense
                  hide-details
                  clearable
                  prefix="🔍"
                  @keyup.enter="fetchData"
                  class="search-input"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2" class="mt-3 mt-md-0">
                <v-btn color="primary" block @click="fetchData" :loading="loading" elevation="2">
                  <v-icon left>mdi-magnify</v-icon>
                  ค้นหา
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ตารางแสดงข้อมูล -->
    <v-card elevation="2" class="records-table-card">
      <v-card-title class="table-header">
        <v-icon large color="primary" class="mr-3">mdi-file-document-multiple</v-icon>
        <span class="text-h5">ข้อมูลการบันทึก {{ totalRecords }} รายการ </span>
      </v-card-title>

      <v-data-table
        :headers="tableHeaders"
        :items="drugRecords"
        :items-per-page="limit"
        :loading="loading"
        class="elevation-0"
        :footer-props="{
          page: page,
          'items-per-page': limit,
          'items-per-page-options': [5, 10, 15, 20],
          'items-per-page-text': 'แสดง:',
          'total-items': totalRecords,
        }"
        @update:page="fetchPage"
        @update:items-per-page="updateLimit"
      >
        <template v-slot:[`item.created_at`]="{ item }">
          {{ item.date_insert }}
        </template>
        <!-- คอลัมน์สถานะ -->
        <template v-slot:[`item.has_used_drugs`]="{ item }">
          <v-chip
            :color="item.has_used_drugs == 'พบ' ? 'error' : 'success'"
            small
            label
            class="status-chip"
          >
            {{ item.has_used_drugs == 'พบ' ? 'พบ' : 'ไม่พบ' }}
          </v-chip>
        </template>

        <!-- คอลัมน์การกระทำ -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="info" small elevation="2" @click="viewDetails(item)" class="action-btn">
            <v-icon left small>mdi-eye</v-icon>
            รายละเอียด
          </v-btn>
        </template>

        <!-- กรณีไม่พบข้อมูล -->
        <template v-slot:no-data>
          <v-alert type="info" class="ma-4" outlined>
            <v-icon left>mdi-information</v-icon>
            ไม่พบข้อมูลที่ค้นหา
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog แสดงรายละเอียด -->
    <v-dialog v-model="dialog" max-width="900">
      <v-card class="detail-dialog">
        <v-card-title class="dialog-header">
          <v-icon large color="primary" class="mr-3">mdi-account-details</v-icon>
          <span class="text-h5">รายละเอียดข้อมูล</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12">
              <v-sheet class="pa-4 mb-4" rounded elevation="1">
                <div class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                  ข้อมูลส่วนตัว
                </div>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <span class="detail-label">ชื่อ-นามสกุล:</span>
                      <span class="detail-value">
                        {{ selectedRecord.title }} {{ selectedRecord.first_name }}
                        {{ selectedRecord.last_name }}
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <span class="detail-label">เลขบัตรประชาชน:</span>
                      <span class="detail-value">{{ selectedRecord.id_card }}</span>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <span class="detail-label">ที่อยู่:</span>
                      <span class="detail-value">{{ formatAddress(selectedRecord.address) }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <span class="detail-label">อายุ:</span>
                      <span class="detail-value">{{ selectedRecord.age }} ปี</span>
                    </div>
                  </v-col>
                </v-row>
              </v-sheet>

              <v-sheet class="pa-4" rounded elevation="1">
                <div class="text-h6 mb-4 error--text">
                  <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
                  ข้อมูลการใช้ยา
                </div>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <span class="detail-label">สถานะการใช้ยาเสพติด:</span>
                      <v-chip
                        :color="selectedRecord.has_used_drugs ? 'error' : 'success'"
                        small
                        label
                      >
                        {{ selectedRecord.has_used_drugs }}
                      </v-chip>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6" v-if="selectedRecord.has_used_drugs">
                    <div class="detail-item">
                      <span class="detail-label">ประเภทยา:</span>
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
              <!-- ผู้บันทึก -->
              <v-sheet class="pa-4 mt-4" rounded elevation="1">
                <div class="text-h6 mb-4 success--text">
                  <v-icon color="success" class="mr-2">mdi-account-check</v-icon>
                  ข้อมูลผู้บันทึก
                </div>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <span class="detail-label">ชื่อ-นามสกุล:</span>
                      <span class="detail-value">
                        {{ selectedRecord.recordedBy }}
                      </span>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="detail-item">
                      <span class="detail-label">สังกัด:</span>
                      <span class="detail-value">{{ selectedRecord.recordedByStation }}</span>
                    </div>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { has } from 'lodash'

export default {
  setup() {
    const page = ref(1) // หน้าปัจจุบัน
    const limit = ref(10) // จำนวนรายการต่อหน้า
    const totalRecords = ref(0) // จำนวนรายการทั้งหมด

    const searchQuery = ref('')
    const drugRecords = ref([])
    const dialog = ref(false)
    const selectedRecord = reactive({})
    const loading = ref(false)

    const tableHeaders = [
      { text: 'วันที่บันทึก', value: 'created_at' },
      { text: 'ชื่อ', value: 'first_name' },
      { text: 'ชื่อสกุล', value: 'last_name' },
      { text: 'อายุ', value: 'age' },
      { text: 'เลขบัตรประชาชน', value: 'id_card' },
      { text: 'สถานะการใช้ยา', value: 'has_used_drugs' },
      { text: 'การกระทำ', value: 'actions', sortable: false },
    ]

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

    // คำหน้าชื่อ นามสกุล รวมกัน
    const fullName = (title, firstName, lastName) => {
      return `${title || ''}${firstName || ''} ${lastName || ''}`
    }
    //format date
    const formatDate = (date) => {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }
      return new Date(date).toLocaleDateString('th-TH', options)
    }

    const URL_API = import.meta.env.VITE_API_BASE_URL
    const fetchData = async () => {
      loading.value = true
      try {
        const response = await axios.get(URL_API + '/api/drug-survey', {
          // const response = await axios.get('/api/drug-survey', {
          params: { page: page.value, limit: limit.value },
        })

        if (response.data.success) {
          console.log('Data:', response.data.pagination)
          drugRecords.value = response.data.data.map((record) => ({
            ...record,
            date_insert: formatDate(record.created_at),
            address: record.address,
            fullName: fullName(record.title, record.first_name, record.last_name),
          }))
          totalRecords.value = response.data.pagination.total
        } else {
          drugRecords.value = []
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }

    const fetchPage = (newPage) => {
      page.value = newPage
      fetchData() // โหลดข้อมูลใหม่
    }

    const updateLimit = (newLimit) => {
      limit.value = newLimit
      page.value = 1 // รีเซ็ตไปหน้าแรกเมื่อเปลี่ยนจำนวนรายการ
      fetchData() // โหลดข้อมูลใหม่
    }
    const viewDetails = (item) => {
      Object.assign(selectedRecord, {
        ...item,
        drug_types: item.drug_types,
        address: item.address,
      })
      dialog.value = true
    }

    //หน้าแรกให้โหลดข้อมูล
    fetchData()

    return {
      searchQuery,
      drugRecords,
      tableHeaders,
      dialog,
      selectedRecord,
      loading,
      fetchData,
      viewDetails,
      formatAddress,
      fullName,
      formatDate,
      totalRecords,
      page,
      limit,
      fetchPage,
      updateLimit,
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
