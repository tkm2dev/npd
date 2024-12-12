<template>
  <v-card class="mb-4">
    <!-- ตัวเลือกค้นหาที่อยู่ -->

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
          <v-text-field v-model="searchForm.house_no" label="บ้านเลขที่" outlined dense clearable />
        </v-col>
      </v-row>
      <v-btn color="primary" @click="searchData" :loading="loading" class="mr-2">ค้นหา</v-btn>
    </v-card-text>

    <v-card-title>ค้นหาข้อมูลบุคคล</v-card-title>
    <v-card-text>
      <!-- Search Input -->
      <v-text-field
        v-model="searchQuery"
        label="ค้นหาข้อมูล"
        placeholder="ระบุชื่อ, นามสกุล หรือเลขบัตรประชาชน"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        clearable
        @keyup.enter="performSearch"
      >
        <template v-slot:append-inner>
          <v-fade-transition leave-absolute>
            <v-progress-circular
              v-if="isSearching"
              size="24"
              color="primary"
              indeterminate
            ></v-progress-circular>
            <v-icon v-else @click="performSearch"> mdi-magnify </v-icon>
          </v-fade-transition>
        </template>
      </v-text-field>

      <!-- Search Results Dialog -->
      <v-dialog
        v-model="showResults"
        max-width="600"
        :scrim="false"
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar color="primary" title="ผลการค้นหา">
            <template v-slot:append>
              <v-btn icon="mdi-close" @click="showResults = false"></v-btn>
            </template>
          </v-toolbar>

          <v-card-text>
            <div v-if="isSearching" class="d-flex justify-center align-center pa-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>

            <div v-else-if="searchResults.length === 0" class="text-center pa-4">
              <v-icon icon="mdi-alert-circle" color="warning" size="48"></v-icon>
              <div class="text-h6 mt-2">ไม่พบข้อมูล</div>
              <div class="text-body-2 text-grey">
                ไม่พบข้อมูลที่ตรงกับคำค้นหา กรุณาลองค้นหาด้วยคำอื่น
              </div>
            </div>

            <v-list v-else lines="two" select-strategy="single-select">
              <v-list-item
                v-for="person in searchResults"
                :key="person.pid"
                :value="person"
                rounded="lg"
                class="mb-2"
                hover
              >
                <template v-slot:prepend>
                  <v-avatar color="primary">
                    {{ getInitials(person.fname, person.lanme) }}
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ formatFullName(person.fname, person.lname) }}
                  <v-chip size="small" variant="flat" color="warning" class="ml-2">
                    {{ formatIdCard(person.pid) }}
                  </v-chip>
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ person.address }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    color="primary"
                    variant="tonal"
                    size="small"
                    @click.stop="selectPerson(person)"
                  >
                    เลือก
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Selected Person -->
      <v-expand-transition>
        <div v-if="selectedPerson" class="mt-4">
          <v-alert color="info" variant="tonal" closable @click:close="clearSelection">
            <div class="d-flex align-center">
              <v-avatar color="info" class="mr-3">
                {{ getInitials(selectedPerson.fname, selectedPerson.lname) }}
              </v-avatar>
              <div>
                <div class="text-subtitle-1 font-weight-medium">
                  {{ formatFullName(selectedPerson.fname, selectedPerson.lname) }}
                </div>
                <div class="text-body-3">
                  ({{ formatIdCard(selectedPerson.pid) }})
                  <br />
                  {{ selectedPerson.address }}
                </div>
              </div>
            </div>
          </v-alert>
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch, reactive, onMounted } from 'vue'
import { searchService } from '@/services/searchService'
import { formatIdCard, formatFullName, formatAddress, getInitials } from '@/utils/formatters'
import { parseAddress } from '@/utils/addressParser'

const Urlbase = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'

const emit = defineEmits(['select'])

// State
const searchQuery = ref('')
const searchResults = ref([])
const selectedPerson = ref(null)
const showResults = ref(false)
const isSearching = ref(false)

const type_search = ref('person')

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
const totalItems = ref(0)
const loading = ref(false)
const options = reactive({})
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
        // showNotification('ไม่พบข้อมูลที่ค้นหา', 'info')
      } else {
        // showNotification(`พบข้อมูล ${totalItems.value} รายการ`, 'success')
      }
    } else {
      throw new Error(data.message || 'เกิดข้อผิดพลาดในการค้นหา')
    }
  } catch (error) {
    console.error('Error searching:', error)
    searchResults.value = []
    totalItems.value = 0
    // showNotification(`เกิดข้อผิดพลาด: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// Methods
const performSearch = async () => {
  if (!searchQuery.value?.trim()) return

  try {
    isSearching.value = true
    showResults.value = true
    // ถ้าค้นที่อยู่่ ใช้ searchService.searchAddress

    if (type_search.value === 'person') {
      const results = await searchService.searchPerson(searchQuery.value)
      searchResults.value = results.data

      if (results.data.length === 1) {
        // Auto select if only one result
        selectPerson(results.data[0])
      }
    } else {
      const results = await searchService.searchAddress(searchQuery.value)
      searchResults.value = results.data

      if (results.data.length === 1) {
        // Auto select if only one result
        selectPerson(results.data[0])
      }
    }
  } catch (error) {
    console.error('Search failed:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

// Load initial data
onMounted(() => {
  loadProvinces()
})

// // Debounced search
// const handleSearch = debounce(async (value) => {
//   if (value?.length >= 2) {
//     await performSearch()
//   } else {
//     searchResults.value = []
//   }
// }, 300)

const selectPerson = (person) => {
  selectedPerson.value = person
  showResults.value = false

  const parsedAddress = parseAddress(person.address)

  // Emit ข้อมูลทั้งหมดที่ต้องการ map ไปยังฟอร์ม

  emit('select', {
    personalInfo: {
      first_name: person.fname,
      last_name: person.lname,
      fullName: formatFullName(person.fname, person.lname),
      age: person.age || '',
      idCard: person.pid,
      address: {
        houseNo: parsedAddress?.houseNo || '',
        moo: parsedAddress?.moo || '',
        tambon: parsedAddress?.tambon || '',
        amphoe: parsedAddress?.amphoe || '',
        province: parsedAddress?.province || '',
      },
    },
    contact: {
      userPhone: person.phone || '',
      userLine: person.line || '',
      userFacebook: person.facebook || '',
    },
  })
}

const clearSelection = () => {
  selectedPerson.value = null
  searchQuery.value = ''
  searchResults.value = []
  emit('select', null)
}

// Clear results when query is empty
watch(searchQuery, (value) => {
  if (!value) {
    searchResults.value = []
    showResults.value = false
  }
})
</script>

<style scoped>
.v-list-item {
  transition: all 0.2s ease;
}

.v-list-item:hover {
  transform: translateY(-2px);
}
</style>
