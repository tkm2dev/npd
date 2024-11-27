<template>
  <div>
    <!-- Stats Cards -->
    <v-row>
      <v-col v-for="(card, index) in statCards" :key="index" cols="12" sm="6" lg="3">
        <v-card :color="card.color" variant="flat" class="h-100">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar :color="card.iconBg" rounded size="48">
                <v-icon :icon="card.icon" :color="card.iconColor" size="24"></v-icon>
              </v-avatar>
            </template>

            <v-card-title>
              {{ card.title }}
              <div class="text-h5 font-weight-bold mt-2">
                {{ card.value }}
                <span v-if="card.trend" class="text-caption ml-2">
                  <v-icon :color="card.trend > 0 ? 'success' : 'error'" size="small">
                    {{ card.trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                  </v-icon>
                  {{ Math.abs(card.trend) }}%
                </span>
              </div>
            </v-card-title>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Section -->
    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-item>
            <v-card-title>
              สถิติการบันทึกข้อมูลรายเดือน
              <v-spacer></v-spacer>
              <v-select
                v-model="selectedYear"
                :items="years"
                variant="outlined"
                density="compact"
                hide-details
                class="ml-4"
                style="max-width: 120px"
              ></v-select>
            </v-card-title>
          </v-card-item>

          <v-card-text>
            <v-sheet class="pa-4" height="300">
              <!-- Monthly Stats Chart -->
              <apexchart
                type="line"
                :options="chartOptions"
                :series="chartSeries"
                height="100%"
              ></apexchart>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-item>
            <v-card-title>สัดส่วนประเภทยาเสพติด</v-card-title>
          </v-card-item>

          <v-card-text>
            <v-sheet class="pa-4" height="300">
              <!-- Pie Chart -->
              <apexchart
                type="pie"
                :options="pieOptions"
                :series="pieSeries"
                height="100%"
              ></apexchart>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Records -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-item>
            <v-card-title>
              รายการบันทึกล่าสุด
              <v-spacer></v-spacer>
              <v-btn prepend-icon="mdi-plus" color="primary" @click="goToForm"> บันทึกใหม่ </v-btn>
            </v-card-title>
          </v-card-item>

          <v-table>
            <thead>
              <tr>
                <th class="text-left">วันที่</th>
                <th class="text-left">ชื่อ-สกุล</th>
                <th class="text-left">ประเภท</th>
                <th class="text-left">ผู้บันทึก</th>
                <th class="text-left">สถานะ</th>
                <th class="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recentRecords" :key="item.id">
                <td>{{ formatDate(item.date) }}</td>
                <td>
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="primary" class="mr-2">
                      <span class="text-white">{{ getInitials(item.name) }}</span>
                    </v-avatar>
                    {{ item.name }}
                  </div>
                </td>
                <td>
                  <v-chip :color="getTypeColor(item.type)" size="small" variant="flat">
                    {{ item.type }}
                  </v-chip>
                </td>
                <td>{{ item.recorder }}</td>
                <td>
                  <v-chip :color="getStatusColor(item.status)" size="small">
                    {{ item.status }}
                  </v-chip>
                </td>
                <td>
                  <div class="d-flex justify-center">
                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      size="small"
                      color="primary"
                      class="mr-2"
                      @click="editRecord(item)"
                    ></v-btn>
                    <v-btn
                      icon="mdi-eye"
                      variant="text"
                      size="small"
                      color="info"
                      class="mr-2"
                      @click="viewRecord(item)"
                    ></v-btn>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      size="small"
                      color="error"
                      @click="confirmDelete(item)"
                    ></v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-divider></v-divider>

          <!-- Pagination -->
          <v-card-actions>
            <v-row class="px-4 py-2">
              <v-col cols="12" sm="6" class="d-flex align-center">
                แสดง {{ startIndex }} ถึง {{ endIndex }} จาก {{ totalRecords }} รายการ
              </v-col>
              <v-col cols="12" sm="6" class="d-flex justify-end">
                <v-pagination
                  v-model="currentPage"
                  :length="totalPages"
                  :total-visible="7"
                ></v-pagination>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title class="text-h6"> ยืนยันการลบข้อมูล </v-card-title>
        <v-card-text>
          คุณต้องการลบข้อมูลของ {{ selectedRecord?.name }} ใช่หรือไม่?
          <br />
          <small class="text-red">*การดำเนินการนี้ไม่สามารถยกเลิกได้</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="deleteDialog = false"> ยกเลิก </v-btn>
          <v-btn color="error" variant="tonal" :loading="deleting" @click="deleteRecord">
            ยืนยันการลบ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

const router = useRouter()

// Stats Data
const statCards = ref([
  {
    title: 'บันทึกทั้งหมด',
    value: '2,845',
    icon: 'mdi-file-document',
    color: 'blue-lighten-5',
    iconBg: 'primary',
    iconColor: 'white',
    trend: 12,
  },
  {
    title: 'บันทึกในเดือนนี้',
    value: '156',
    icon: 'mdi-calendar-month',
    color: 'green-lighten-5',
    iconBg: 'success',
    iconColor: 'white',
    trend: 5,
  },
  {
    title: 'รอดำเนินการ',
    value: '45',
    icon: 'mdi-clock-outline',
    color: 'orange-lighten-5',
    iconBg: 'warning',
    iconColor: 'white',
    trend: -8,
  },
  {
    title: 'เสร็จสิ้น',
    value: '1,892',
    icon: 'mdi-check-circle',
    color: 'blue-grey-lighten-5',
    iconBg: 'blue-grey',
    iconColor: 'white',
    trend: 15,
  },
])

// Chart Data
const selectedYear = ref('2024')
const years = ['2024', '2023', '2022']

const chartOptions = {
  chart: {
    type: 'line',
    toolbar: {
      show: false,
    },
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  xaxis: {
    categories: [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย.',
      'ธ.ค.',
    ],
  },
  yaxis: {
    title: {
      text: 'จำนวนบันทึก',
    },
  },
  colors: ['#1867C0'],
}

const chartSeries = [
  {
    name: 'จำนวนบันทึก',
    data: [65, 78, 90, 85, 92, 88, 95, 100, 88, 92, 95, 98],
  },
]

const pieOptions = {
  chart: {
    type: 'pie',
  },
  labels: ['ยาบ้า', 'ยาไอซ์', 'อื่นๆ'],
  colors: ['#1867C0', '#4CAF50', '#FF9800'],
}

const pieSeries = [65, 25, 10]

// Table Data
const currentPage = ref(1)
const itemsPerPage = 10
const totalRecords = ref(125)
const recentRecords = ref([
  {
    id: 1,
    date: '2024-01-24',
    name: 'สมชาย ใจดี',
    type: 'ยาบ้า',
    recorder: 'เจ้าหน้าที่ A',
    status: 'เสร็จสิ้น',
  },
  {
    id: 2,
    date: '2024-01-23',
    name: 'สมหญิง รักดี',
    type: 'ยาไอซ์',
    recorder: 'เจ้าหน้าที่ B',
    status: 'รอดำเนินการ',
  },
  // Add more mock data here
])

// Delete Dialog
const deleteDialog = ref(false)
const selectedRecord = ref(null)
const deleting = ref(false)

// Computed Properties
const totalPages = computed(() => Math.ceil(totalRecords.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, totalRecords.value))

// Methods
const formatDate = (date) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: th })
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

const getTypeColor = (type) => {
  const colors = {
    ยาบ้า: 'primary',
    ยาไอซ์: 'success',
    อื่นๆ: 'warning',
  }
  return colors[type] || 'grey'
}

const getStatusColor = (status) => {
  const colors = {
    เสร็จสิ้น: 'success',
    รอดำเนินการ: 'warning',
    ยกเลิก: 'error',
  }
  return colors[status] || 'grey'
}

const goToForm = () => {
  router.push('/form')
}

const editRecord = (item) => {
  router.push(`/form/${item.id}`)
}

const viewRecord = (item) => {
  router.push(`/view/${item.id}`)
}

const confirmDelete = (item) => {
  selectedRecord.value = item
  deleteDialog.value = true
}

const deleteRecord = async () => {
  try {
    deleting.value = true
    // Implement delete logic here
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    // Remove item from list
    recentRecords.value = recentRecords.value.filter((item) => item.id !== selectedRecord.value.id)
    deleteDialog.value = false
  } catch (error) {
    console.error('Delete failed:', error)
  } finally {
    deleting.value = false
  }
}

// Lifecycle Hooks
onMounted(() => {
  // Fetch initial data
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>
