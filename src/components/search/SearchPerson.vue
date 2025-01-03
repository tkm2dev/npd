<template>
  <v-card class="mb-4">
    <v-card-text class="pa-2">
      <!-- General Search Input -->
      <v-text-field
        v-model="searchQuery"
        label="ค้นหาข้อมูล"
        placeholder="ระบุชื่อ, นามสกุล, เลขบัตรประชาชน"
        variant="outlined"
        density="compact"
        hide-details="auto"
        clearable
        class="mb-2"
        @keyup.enter="performSearch"
      >
        <template v-slot:append-inner>
          <v-fade-transition leave-absolute>
            <v-progress-circular
              v-if="isSearching"
              size="20"
              color="primary"
              indeterminate
            ></v-progress-circular>
            <v-icon v-else @click="performSearch" size="small"> mdi-magnify </v-icon>
          </v-fade-transition>
        </template>
      </v-text-field>

      <!-- Area Search Form -->
      <v-row dense>
        <!-- ข้อมูลที่อยู่ -->
        <v-col cols="12">
          <div class="text-subtitle-2 font-weight-medium mb-1">ข้อมูลที่อยู่</div>
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="searchForm.province"
            :items="provinces"
            label="จังหวัด"
            :loading="loading"
            variant="outlined"
            density="compact"
            hide-details="auto"
            clearable
            class="mb-2"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="searchForm.amphoe"
            :items="amphoes"
            label="อำเภอ"
            :loading="loading"
            :disabled="!searchForm.province"
            variant="outlined"
            density="compact"
            hide-details="auto"
            clearable
            class="mb-2"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="searchForm.tambon"
            :items="tambons"
            label="ตำบล"
            :loading="loading"
            :disabled="!searchForm.amphoe"
            variant="outlined"
            density="compact"
            hide-details="auto"
            clearable
            class="mb-2"
          />
        </v-col>

        <v-col cols="12" md="1">
          <v-text-field
            v-model="searchForm.moo"
            label="หมู่"
            type="number"
            variant="outlined"
            density="compact"
            hide-details="auto"
            clearable
            class="mb-2"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field
            v-model="searchForm.house_no"
            label="บ้านเลขที่"
            variant="outlined"
            density="compact"
            hide-details="auto"
            clearable
            class="mb-2"
          />
        </v-col>

        <!-- ข้อมูลส่วนบุคคล -->
        <v-col cols="12">
          <div class="text-subtitle-2 font-weight-medium mb-1">ข้อมูลส่วนบุคคล</div>
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field
            v-model="searchForm.age"
            label="อายุ"
            type="number"
            min="0"
            max="150"
            variant="outlined"
            density="compact"
            hide-details="auto"
            clearable
            class="mb-2"
            suffix="ปี"
            @input="validateAge"
          />
        </v-col>
      </v-row>

      <div class="mt-2">
        <v-btn color="primary" @click="performSearch" :loading="loading" size="small" class="mr-2">
          <v-icon start size="small">mdi-magnify</v-icon>
          ค้นหา
        </v-btn>
        <v-btn
          color="secondary"
          @click="clearForm"
          :disabled="loading"
          variant="outlined"
          size="small"
        >
          <v-icon start size="small">mdi-refresh</v-icon>
          ล้างข้อมูล
        </v-btn>
      </div>
    </v-card-text>
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
                <v-avatar color="primary"> {{ person.age }} ปี </v-avatar>
              </template>

              <v-list-item-title class="font-weight-medium">
                {{ person.fullname }}
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
            <v-avatar color="info" class="mr-3"> {{ selectedPerson.age }} ปี </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                {{ selectedPerson.fullname }}
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
  </v-card>
</template>

<script setup>
import { ref, watch, reactive, onMounted } from 'vue'
import { formatIdCard, formatFullName } from '@/utils/formatters'
import { parseAddress } from '@/utils/addressParser'

const emit = defineEmits(['select', 'notification'])

const Urlbase = import.meta.env.VITE_API_BASE_URL

// State
const searchQuery = ref('')
const searchResults = ref([])
const selectedPerson = ref(null)
const showResults = ref(false)
const isSearching = ref(false)
const loading = ref(false)
const options = reactive({})

const resetSearch = () => {
  // รีเซ็ตค่าทั้งหมด
  searchQuery.value = ''
  searchResults.value = []
}

// Form state
const searchForm = reactive({
  province: '',
  amphoe: '',
  tambon: '',
  moo: '',
  house_no: '',
  sex: '',
  age: '',
})

const provinces = ref([])
const amphoes = ref([])
const tambons = ref([])

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

// Combined search function
const performSearch = async () => {
  if (!searchQuery.value?.trim() && !hasAreaSearchCriteria()) return

  try {
    isSearching.value = true
    loading.value = true
    showResults.value = true

    const params = new URLSearchParams({
      page: options.page || 1,
      limit: options.itemsPerPage || 10,
    })

    if (searchQuery.value?.trim()) {
      params.append('keyword', searchQuery.value.trim())
    }

    // เพิ่มพารามิเตอร์ใหม่
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value !== '' && value !== null) {
        params.append(key, value)
      }
    })

    // Call the unified search endpoint

    const response = await fetch(Urlbase + `/api/search-human?${params.toString()}`)
    const data = await response.json()

    if (data.success) {
      searchResults.value = data.data
      if (data.data.length === 1) {
        // Auto select if only one result
        selectPerson(data.data[0])
      }
    } else {
      throw new Error(data.message || 'การค้นหาล้มเหลว')
    }
  } catch (error) {
    console.error('Error searching:', error)
    searchResults.value = []
    showNotification(`เกิดข้อผิดพลาด: ${error.message}`, 'error')
  } finally {
    isSearching.value = false
    loading.value = false
  }
}

const hasAreaSearchCriteria = () => {
  return Object.values(searchForm).some((value) => value !== '')
}

const clearForm = () => {
  searchQuery.value = ''
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = ''
  })
  clearSelection()
}

const showNotification = (message, type) => {
  emit('notification', { message, type })
}

const selectPerson = (person) => {
  selectedPerson.value = person
  showResults.value = false

  const parsedAddress = parseAddress(person.address)

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
  searchResults.value = []
  emit('select', null)
}

// Load initial data
onMounted(() => {
  loadProvinces()
})

const loadProvinces = async () => {
  try {
    const response = await fetch(Urlbase + '/api/provinces')
    const data = await response.json()
    provinces.value = data.data
  } catch (error) {
    console.error('Error loading provinces:', error)
  }
}
</script>
<style scoped>
.v-col {
  padding-top: 4px;
  padding-bottom: 4px;
}

.text-subtitle-2 {
  font-size: 0.875rem;
}
</style>
