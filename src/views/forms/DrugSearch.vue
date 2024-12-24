<template>
  <div>
    <!-- Search Section -->
    <v-card>
      <v-card-title>ค้นหาตามพื้นที่</v-card-title>
      <v-card-text>
        <v-row>
          <!-- Province -->
          <v-col cols="12" md="3">
            <v-select
              v-model="searchForm.province"
              :items="provinces"
              label="จังหวัด"
              :loading="loading"
              outlined
              dense
              clearable
            />
          </v-col>

          <!-- Amphoe -->
          <v-col cols="12" md="3">
            <v-select
              v-model="searchForm.amphoe"
              :items="amphoes"
              label="อำเภอ"
              :loading="loading"
              :disabled="!searchForm.province"
              outlined
              dense
              clearable
            />
          </v-col>

          <!-- Tambon -->
          <v-col cols="12" md="3">
            <v-select
              v-model="searchForm.tambon"
              :items="tambons"
              label="ตำบล"
              :loading="loading"
              :disabled="!searchForm.amphoe"
              outlined
              dense
              clearable
            />
          </v-col>

          <!-- Moo -->
          <v-col cols="12" md="3">
            <v-text-field
              v-model="searchForm.moo"
              label="หมู่"
              type="number"
              outlined
              dense
              clearable
            />
          </v-col>

          <!-- House No -->
          <v-col cols="12" md="3">
            <v-text-field
              v-model="searchForm.house_no"
              label="บ้านเลขที่"
              outlined
              dense
              clearable
            />
          </v-col>
        </v-row>
        <v-btn color="primary" @click="searchData" :loading="loading" class="mr-2">ค้นหา</v-btn>
      </v-card-text>
    </v-card>

    <!-- Search Results -->
    <v-data-table
      :headers="[
        { text: 'ชื่อ-สกุล', value: 'fullname' },
        { text: 'เพศ', value: 'sex' },
        { text: 'อายุ', value: 'age' },
        { text: 'ที่อยู่', value: 'address' },
      ]"
      :items="searchResults"
      :loading="loading"
      :server-items-length="totalItems"
      v-model:options="options"
      hide-default-header
    >
      <template v-slot:[`item.fullname`]="{ item }">
        <div>
          <div class="font-weight-medium">{{ item.fullname }}</div>
          <div class="text-caption text-grey">
            <v-icon x-small class="mr-1"
              >mdi-gender-{{ item.sex === '1' ? 'male' : 'female' }}</v-icon
            >
            {{ item.age }} ปี
          </div>
        </div>
      </template>
      <template v-slot:[`item.address`]="{ item }">
        <div>{{ item.address }}</div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

//ถ้า production ให้เปลี่ยน Urlbase ให้เป็น url ของ production

const Urlbase = process.env.NODE_ENV === 'production' ? '' : 'https://npd.mazcat.net'

const searchForm = reactive({
  province: '',
  amphoe: '',
  tambon: '',
  moo: '',
  house_no: '',
})
const provinces = ref([])
const amphoes = ref([])
const tambons = ref([])
const searchResults = ref([])
const totalItems = ref(0)
const loading = ref(false)
const options = reactive({})

const notification = ref({
  show: false,
  message: '',
  type: 'info',
})

const showNotification = (message, type) => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

// Load provinces
const loadProvinces = async () => {
  try {
    const response = await fetch(Urlbase + '/api/provinces')
    const data = await response.json()
    provinces.value = data.data
  } catch (error) {
    console.error('Error loading provinces:', error)
  }
}

// Watch province changes
watch(
  () => searchForm.province,
  async (newProvince) => {
    searchForm.amphoe = ''
    searchForm.tambon = ''
    amphoes.value = []
    tambons.value = []
    if (newProvince) {
      loading.value = true
      try {
        const encodedProvince = encodeURIComponent(newProvince)
        const response = await fetch(Urlbase + `/api/amphoes?province=${encodedProvince}`)
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          amphoes.value = data.data
        }
      } catch (error) {
        console.error('Error loading amphoes:', error)
      } finally {
        loading.value = false
      }
    }
  }
)

// Watch amphoe changes
watch(
  () => searchForm.amphoe,
  async (newAmphoe) => {
    searchForm.tambon = ''
    tambons.value = []
    if (searchForm.province && newAmphoe) {
      loading.value = true
      try {
        const encodedProvince = encodeURIComponent(searchForm.province)
        const encodedAmphoe = encodeURIComponent(newAmphoe)
        const response = await fetch(
          Urlbase + `/api/tambons?province=${encodedProvince}&amphoe=${encodedAmphoe}`
        )
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          tambons.value = data.data
        }
      } catch (error) {
        console.error('Error loading tambons:', error)
      } finally {
        loading.value = false
      }
    }
  }
)

// Search data
const searchData = async () => {
  loading.value = true
  try {
    const filteredForm = Object.entries(searchForm).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value
      }
      return acc
    }, {})
    const params = new URLSearchParams({
      ...filteredForm,
      page: options.page || 1,
      limit: options.itemsPerPage || 10,
    })
    const response = await fetch(Urlbase + `/api/area-search?${params}`)
    const data = await response.json()
    if (data.success) {
      console.log(data.data)
      searchResults.value = data.data
      totalItems.value = data.data.length

      if (searchResults.value.length === 0) {
        showNotification('ไม่พบข้อมูลที่ค้นหา', 'info')
      } else {
        showNotification(`พบข้อมูล ${totalItems.value} รายการ`, 'success')
      }
    } else {
      throw new Error(data.message || 'เกิดข้อผิดพลาดในการค้นหา')
    }
  } catch (error) {
    console.error('Error searching:', error)
    searchResults.value = []
    totalItems.value = 0
    showNotification(`เกิดข้อผิดพลาด: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// Load initial data
onMounted(() => {
  loadProvinces()
})
</script>

<style scoped>
.font-weight-medium {
  font-weight: 500;
}
.text-grey {
  color: grey;
}
</style>
