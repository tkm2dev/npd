<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- ค้นหา -->
        <SearchPerson @select="handleSelectPerson" />

        <v-card class="pa-4">
          <v-card-title class="text-h5">แบบฟอร์มข้อมูลผู้เกี่ยวข้องกับยาเสพติด</v-card-title>
          <v-card-text>
            <!-- ข้อมูลพื้นฐาน -->
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="formData.คำนำหน้า"
                  :items="['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']"
                  label="คำนำหน้า"
                  outlined
                  dense
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.ชื่อ"
                  label="ชื่อ"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'กรุณากรอกชื่อ']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="formData.นามสกุล"
                  label="นามสกุล"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'กรุณากรอกนามสกุล']"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.เลขบัตรประชาชน"
                  label="หมายเลขบัตรประชาชน"
                  outlined
                  dense
                  maxlength="13"
                  counter
                  :rules="[
                    (v) => !!v || 'กรุณากรอกเลขบัตรประชาชน',
                    (v) => v.length === 13 || 'ต้องมี 13 หลัก',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="formData.อายุ"
                  label="อายุ"
                  outlined
                  dense
                  type="number"
                  :rules="[(v) => !!v || 'กรุณากรอกอายุ']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="formData.เพศ"
                  :items="['ชาย', 'หญิง', 'ไม่ระบุ']"
                  label="เพศ"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'กรุณาเลือกเพศ']"
                ></v-select>
              </v-col>
            </v-row>

            <!-- ที่อยู่ -->
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="formData.ที่อยู่.บ้านเลขที่"
                  label="บ้านเลขที่"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'กรุณากรอกบ้านเลขที่']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="formData.ที่อยู่.หมู่"
                  label="หมู่ที่"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.ที่อยู่.ตำบล"
                  label="ตำบล"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'กรุณากรอกตำบล']"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.ที่อยู่.อำเภอ"
                  label="อำเภอ"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'กรุณากรอกอำเภอ']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.ที่อยู่.จังหวัด"
                  label="จังหวัด"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'กรุณากรอกจังหวัด']"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- การใช้งานยาเสพติด -->
            <v-row>
              <v-col cols="12">
                <v-radio-group
                  v-model="formData.พบเสพ"
                  label="พบเสพยาเสพติดหรือไม่"
                  :rules="[(v) => v !== null || 'กรุณาเลือกตัวเลือก']"
                >
                  <v-radio label="พบ" value="พบ"></v-radio>
                  <v-radio label="ไม่พบ" value="ไม่พบ"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row v-if="formData.พบเสพ === 'พบ'">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.ประเภทยาเสพติด"
                  label="ประเภทยาเสพติด"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.จำนวนที่เสพ"
                  label="จำนวนที่เสพต่อครั้ง (เม็ด)"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="submitForm">บันทึก</v-btn>
            <v-btn color="secondary" @click="resetForm">ล้างข้อมูล</v-btn>
          </v-card-actions>
        </v-card>

        <!-- Dialog แสดงผลการค้นหา -->
        <v-dialog v-model="showSearchResults" max-width="80%" scrollable>
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span>ผลการค้นหา</span>
              <!-- ปุ่มชิดขวา -->
              <v-btn icon @click="showSearchResults = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-data-table
                      :headers="tableHeaders"
                      :items="searchResults"
                      :loading="isSearching"
                      :no-data-text="'ไม่พบข้อมูล'"
                      dense
                      class="elevation-1"
                    >
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-btn color="primary" small @click="selectDataAndClose(item)">
                          เลือก
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- Snackbar แจ้งเตือน -->
        <v-snackbar v-model="showAlert" :color="alertColor" :timeout="3000">
          {{ alertMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="showAlert = false"> ปิด </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, nextTick, reactive } from 'vue'

import axios from 'axios'
import debounce from 'lodash/debounce'
import SearchPerson from '@/components/search/SearchPerson.vue'

const urlBase = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'

const form = ref(null)
const valid = ref(false)
const isSaving = ref(false)
const isSearching = ref(false)
const hasSearched = ref(false)
const showForm = ref(false)
const editMode = ref(false)
const showAlert = ref(false)
const alertMessage = ref('')
const alertColor = ref('success')
const showSearchResults = ref(false)

const searchType = ref('name')
const searchQuery = ref('')
const searchResults = ref([])

const tableHeaders = [
  { text: 'เลขบัตรประชาชน', value: 'pid', align: 'start' },
  { text: 'ชื่อ-นามสกุล', value: 'fullName', align: 'start' },
  { text: 'ที่อยู่', value: 'address' },
  { text: 'ดำเนินการ', value: 'actions', align: 'center', sortable: false },
]
const emptyData = {
  ชื่อ: '',
  เลขบัตรประชาชน: '',
  ที่อยู่: {
    บ้านเลขที่: '',
    หมู่: '',
    ถนน: '',
    ตำบล: '',
    อำเภอ: '',
    จังหวัด: '',
  },
  ช่องทางติดต่อ: {
    เบอร์โทร: '',
    line: '',
    facebook: '',
    อื่นๆ: '',
  },
  การชำระเงิน: {
    วิธีชำระ: 'เงินสด',
    ธนาคาร: '',
    เลขบัญชี: '',
    ชื่อบัญชี: '',
  },
}

const showNotification = (message, color = 'success') => {
  alertMessage.value = message
  alertColor.value = color
  showAlert.value = true
}
const searchData = debounce(async () => {
  if (!searchQuery.value) {
    searchResults.value = []
    hasSearched.value = false
    return
  }

  isSearching.value = true

  try {
    //เช็คเข้อมูลที่ค้นหาถ้าเป็น ชื่อ  นามสกุล ใช้ keyword
    //ถ้าเป็นเลขบัตรประชาชนให้ใช้ id_card

    const response = await axios.get(urlBase + '/api/search-human', {
      params: { keyword: searchQuery.value },
    })

    searchResults.value = response.data.data.map((item) => ({
      ...item,
      fullName: `${item.fname} ${item.lname}`, // สร้างฟิลด์ fullName
    }))

    console.log(searchResults.value)

    hasSearched.value = true

    if (searchResults.value.length > 0) {
      showSearchResults.value = true
    } else {
      // แสดงปุ่มกรอกข้อมูลใหม่
      showForm.value = true
      showSearchResults.value = false

      showNotification('ไม่พบข้อมูลที่ค้นหา', 'warning')
    }
  } catch (error) {
    console.error('Search error:', error)
    showNotification('เกิดข้อผิดพลาดในการค้นหา', 'error')
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}, 300)

const parseAddress = (addressString) => {
  const address = {
    บ้านเลขที่: '',
    หมู่: '',
    ตำบล: '',
    อำเภอ: '',
    จังหวัด: '',
  }

  try {
    const houseNoMatch = addressString.match(/^(\d+\/?\d*)/)
    if (houseNoMatch) address.บ้านเลขที่ = houseNoMatch[1]

    const mooMatch = addressString.match(/ม\.(\d+)/)
    if (mooMatch) address.หมู่ = mooMatch[1]

    const subdistrictMatch = addressString.match(/ต\.([^\s]+)/)
    if (subdistrictMatch) address.ตำบล = subdistrictMatch[1]

    const districtMatch = addressString.match(/อ\.([^\s]+)/)
    if (districtMatch) address.อำเภอ = districtMatch[1]

    const provinceMatch = addressString.match(/จ\.([^\s]+)/)
    if (provinceMatch) address.จังหวัด = provinceMatch[1]
  } catch (error) {
    console.error('Address parsing error:', error)
  }

  return address
}

const selectDataAndClose = (item) => {
  selectData(item)
  showSearchResults.value = false
}

const selectData = (item) => {
  const parsedAddress = parseAddress(item.address)

  formData.value = {
    ...emptyData,
    ชื่อ: item.fname,
    นามสกุล: item.lname,
    เลขบัตรประชาชน: item.pid,
    ที่อยู่: parsedAddress,
    เพศ: item.sex === '1' ? 'ชาย' : 'หญิง',
  }

  showForm.value = true
  editMode.value = true
  searchQuery.value = ''
  searchResults.value = []
}

// ฟังก์ชันสำหรับล้างการค้นหา
const clearSearch = () => {
  dealerSearchQuery.value = ''
  dealerSearchResults.value = []
  showDealerResults.value = false
  hasSearched.value = false
}

// แก้ไข ref สำหรับ panel ที่เปิด
const activeDealerPanel = ref([])
const dealerFormsValid = ref([true])

// อัพเดทฟังก์ชัน removeDealer
const removeDealer = (index) => {
  try {
    // ลบผู้ขาย
    formData.value.ผู้ขาย.splice(index, 1)
    // ลบ validation state
    dealerFormsValid.value.splice(index, 1)
    // อัพเดท activeDealerPanel
    activeDealerPanel.value = activeDealerPanel.value.filter((i) => i !== index)

    showNotification('ลบข้อมูลผู้ขายเรียบร้อย', 'success')
  } catch (error) {
    console.error('Error removing dealer:', error)
    showNotification('เกิดข้อผิดพลาดในการลบข้อมูลผู้ขาย', 'error')
  }
}

// ฟังก์ชันสำหรับจัดรูปแบบเลขบัตรประชาชน
const formatThaiID = (id) => {
  if (!id) return ''
  return id.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5')
}

const cancelEntry = () => {
  formData.value = { ...emptyData }
  showForm.value = false
  editMode.value = false
}

//  *******************************************    สร้างฟอร์มผู้ขายยา   ****************************************************
// เพิ่ม ref และค่าคงที่
const dealerSearchQuery = ref('')
const isDealerSearching = ref(false)
const showDealerResults = ref(false)
const dealerSearchResults = ref([])

const bankList = [
  'ธนาคารกรุงเทพ',
  'ธนาคารกสิกรไทย',
  'ธนาคารกรุงไทย',
  'ธนาคารไทยพาณิชย์',
  'ธนาคารกรุงศรีอยุธยา',
  'ธนาคารทหารไทยธนชาต',
  'ธนาคารออมสิน',
  'ธนาคาร ธ.ก.ส.',
  'อื่นๆ',
]

const dealerTableHeaders = [
  { text: 'เลขบัตรประชาชน', value: 'pid', align: 'start' },
  { text: 'ชื่อ-นามสกุล', value: 'fullName', align: 'start' },
  { text: 'ที่อยู่', value: 'address' },
  { text: 'เบอร์โทร', value: 'phone' },
  { text: 'ดำเนินการ', value: 'actions', align: 'center', sortable: false },
]

// สร้าง empty dealer object
const createEmptyDealer = () => ({
  ชื่อ: '',
  เลขบัตรประชาชน: '',
  ที่อยู่: {
    บ้านเลขที่: '',
    หมู่: '',
    ถนน: '',
    ตำบล: '',
    อำเภอ: '',
    จังหวัด: '',
  },
  ช่องทางติดต่อ: {
    เบอร์โทร: '',
    line: '',
    facebook: '',
    อื่นๆ: '',
  },
  การชำระเงิน: {
    วิธีชำระ: 'เงินสด',
    ธนาคาร: '',
    เลขบัญชี: '',
    ชื่อบัญชี: '',
  },
})

const selectDealer = (dealer) => {
  // ตรวจสอบว่ามี formData.ผู้ขาย แล้วหรือยัง
  if (!formData.value.ผู้ขาย) {
    formData.value.ผู้ขาย = []
  }

  // ตรวจสอบจำนวนผู้ขาย
  if (formData.value.ผู้ขาย.length >= 5) {
    showNotification('ไม่สามารถเพิ่มผู้ขายได้อีก (สูงสุด 5 คน)', 'warning')
    return
  }

  const newDealer = {
    ชื่อ: `${dealer.fname} ${dealer.lname}`,
    เลขบัตรประชาชน: dealer.pid,
    ที่อยู่: parseAddress(dealer.address),
    ช่องทางติดต่อ: {
      เบอร์โทร: dealer.phone || '',
      line: dealer.lineId || '',
      facebook: dealer.facebook || '',
      อื่นๆ: '',
    },
    การชำระเงิน: {
      วิธีชำระ: 'เงินสด',
      ธนาคาร: '',
      เลขบัญชี: '',
      ชื่อบัญชี: '',
    },
  }

  // เพิ่มผู้ขายใหม่หรืออัพเดทคนล่าสุด
  const lastDealer = formData.value.ผู้ขาย[formData.value.ผู้ขาย.length - 1]
  if (lastDealer && !lastDealer.ชื่อ) {
    formData.value.ผู้ขาย[formData.value.ผู้ขาย.length - 1] = newDealer
  } else {
    formData.value.ผู้ขาย.push(newDealer)
  }

  // อัพเดท validation state
  if (!Array.isArray(dealerFormsValid.value)) {
    dealerFormsValid.value = [true]
  }
  dealerFormsValid.value.push(true)

  // เปิด panel ใหม่
  nextTick(() => {
    const newIndex = formData.value.ผู้ขาย.length - 1
    if (!activeDealerPanel.value.includes(newIndex)) {
      activeDealerPanel.value.push(newIndex)
    }
  })

  showNotification('เพิ่มข้อมูลผู้ขายสำเร็จ', 'success')
  showDealerResults.value = false
  dealerSearchQuery.value = ''
}

// แก้ไขฟังก์ชัน startNewDealerEntry
const startNewDealerEntry = () => {
  // ตรวจสอบว่ามี formData.ผู้ขาย แล้วหรือยัง
  if (!formData.value.ผู้ขาย) {
    formData.value.ผู้ขาย = []
  }

  // ตรวจสอบจำนวนผู้ขาย
  if (formData.value.ผู้ขาย.length >= 5) {
    showNotification('ไม่สามารถเพิ่มผู้ขายได้อีก (สูงสุด 5 คน)', 'warning')
    return
  }

  // เพิ่มผู้ขายใหม่
  formData.value.ผู้ขาย.push({ ...emptyData })

  // อัพเดท validation state
  if (!Array.isArray(dealerFormsValid.value)) {
    dealerFormsValid.value = [true]
  }
  dealerFormsValid.value.push(true)

  // เปิด panel ใหม่
  nextTick(() => {
    const newIndex = formData.value.ผู้ขาย.length - 1
    if (!activeDealerPanel.value.includes(newIndex)) {
      activeDealerPanel.value.push(newIndex)
    }
  })

  clearSearch()
  showNotification('เพิ่มฟอร์มข้อมูลผู้ขายใหม่แล้ว', 'success')
}

// ฟังก์ชันจัดการผู้ขาย
const addNewDealer = () => {
  formData.value.ผู้ขาย.push(createEmptyDealer())
}

const searchDealer = debounce(async () => {
  if (!dealerSearchQuery.value) {
    dealerSearchResults.value = []
    showDealerResults.value = false
    return
  }

  isDealerSearching.value = true
  showDealerResults.value = true

  try {
    const response = await axios.get(`${urlBase}/api/search`, {
      params: {
        query: dealerSearchQuery.value,
      },
    })

    dealerSearchResults.value = response.data.data.map((item) => ({
      ...item,
      fullName: `${item.fname} ${item.lname}`,
      address: formatAddress(item.address),
    }))

    if (dealerSearchResults.value.length === 0) {
      showNotification('ไม่พบข้อมูลผู้ขาย', 'info')
    }
  } catch (error) {
    console.error('Dealer search error:', error)
    showNotification('เกิดข้อผิดพลาดในการค้นหาข้อมูลผู้ขาย', 'error')
    dealerSearchResults.value = []
  } finally {
    isDealerSearching.value = false
  }
}, 300)

// ฟังก์ชันช่วยจัดการที่อยู่
const formatAddress = (address) => {
  if (!address) return ''

  const parts = []
  if (address.houseNo) parts.push(`บ้านเลขที่ ${address.houseNo}`)
  if (address.moo) parts.push(`หมู่ ${address.moo}`)
  if (address.road) parts.push(`ถนน${address.road}`)
  if (address.subdistrict) parts.push(`ต.${address.subdistrict}`)
  if (address.district) parts.push(`อ.${address.district}`)
  if (address.province) parts.push(`จ.${address.province}`)

  return parts.join(' ')
}

// watch(
//   () => formData.value.พบเสพ,
//   (newVal) => {
//     if (!newVal) {
//       dealerSearchQuery.value = ''
//       dealerSearchResults.value = []
//       showDealerResults.value = false
//       formData.value.ผู้ขาย = [createEmptyDealer()]
//     }
//   }
// )

//  *******************************************    สิ้นสุด ฟอร์มผู้ขายยา   ****************************************************

// Save data
const saveData = async () => {
  // ตรวจสอบความถูกต้องของฟอร์มหลัก
  if (!form.value.validate()) {
    showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'error')
    return
  }

  // ตรวจสอบข้อมูลผู้ขาย
  if (formData.value.พบเสพ && !validateDealerData()) {
    return
  }

  try {
    isSaving.value = true

    // ตั้งค่าข้อมูลเมื่อเลือก "ไม่พบ" เสพยา
    if (formData.value.พบเสพ === false) {
      formData.value = {
        ...formData.value,
        ประเภทยา: [],
        เริ่มเสพ: '',
        แรงจูงใจ: [],
        จำนวนเสพ: {
          ต่อครั้ง: null,
          ความถี่: '',
        },
        ครั้งล่าสุด: {
          วันที่: '',
          เวลา: '',
          จำนวนเม็ด: null,
          สถานที่: '',
          วิธีชำระเงิน: '',
        },
        ผู้ขาย: [createEmptyDealer()], // รีเซ็ตข้อมูลผู้ขาย
      }
    } else {
      // ทำความสะอาดข้อมูลผู้ขายก่อนบันทึก
      formData.value.ผู้ขาย = formData.value.ผู้ขาย
        .filter((dealer) => dealer.ชื่อ.trim() !== '') // กรองผู้ขายที่ไม่มีชื่อออก
        .map((dealer) => {
          // ทำความสะอาดข้อมูลแต่ละคน
          const cleanDealer = { ...dealer }

          // ถ้าเป็นการชำระเงินสด ให้ลบข้อมูลบัญชีธนาคารออก
          if (cleanDealer.การชำระเงิน.วิธีชำระ === 'เงินสด') {
            cleanDealer.การชำระเงิน = {
              วิธีชำระ: 'เงินสด',
            }
          }

          // ลบช่องทางติดต่อที่ว่างออก
          Object.keys(cleanDealer.ช่องทางติดต่อ).forEach((key) => {
            if (!cleanDealer.ช่องทางติดต่อ[key]) {
              delete cleanDealer.ช่องทางติดต่อ[key]
            }
          })

          // ลบข้อมูลที่อยู่ที่ว่างออก
          Object.keys(cleanDealer.ที่อยู่).forEach((key) => {
            if (!cleanDealer.ที่อยู่[key]) {
              delete cleanDealer.ที่อยู่[key]
            }
          })

          return cleanDealer
        })
    }

    // เตรียมข้อมูลสำหรับบันทึก
    const dataToSave = {
      ...formData.value,
      วันที่บันทึก: new Date().toISOString(),
      สถานะ: 'บันทึกใหม่',
    }

    // ส่งข้อมูลไปยัง API
    const response = await axios.post(urlBase + '/api/drug-survey', dataToSave)

    // ตรวจสอบการบันทึกสำเร็จ
    if (response.data.success) {
      showNotification('บันทึกข้อมูลสำเร็จ', 'success')

      // บันทึกประวัติการทำรายการ
      try {
        await axios.post(urlBase + '/api/transaction-log', {
          action: 'บันทึกข้อมูล',
          data: {
            เลขบัตรประชาชน: formData.value.เลขบัตรประชาชน,
            ชื่อ: formData.value.ชื่อ,
            นามสกุล: formData.value.นามสกุล,
            จำนวนผู้ขาย: formData.value.ผู้ขาย.length,
          },
          timestamp: new Date().toISOString(),
        })
      } catch (logError) {
        console.error('Log error:', logError)
        // ไม่ต้อง throw error เพราะไม่ใช่การทำงานหลัก
      }

      cancelEntry()
    } else {
      throw new Error(response.data.message || 'บันทึกข้อมูลไม่สำเร็จ')
    }
  } catch (error) {
    console.error('Save error:', error)

    // แสดงข้อความ error ที่เฉพาะเจาะจง
    if (error.response) {
      // กรณีได้รับ error response จาก server
      showNotification(error.response.data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error')
    } else if (error.request) {
      // กรณีไม่ได้รับ response จาก server
      showNotification('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error')
    } else {
      // กรณีอื่นๆ
      showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message, 'error')
    }
  } finally {
    isSaving.value = false
  }
}

// ฟังก์ชันตรวจสอบความถูกต้องของข้อมูลผู้ขาย
const validateDealerData = () => {
  let isValid = true
  const errors = []

  // ตรวจสอบว่ามีผู้ขายอย่างน้อย 1 คน
  if (!formData.value.ผู้ขาย?.length) {
    errors.push('กรุณาเพิ่มข้อมูลผู้ขายอย่างน้อย 1 คน')
    isValid = false
    showNotification('กรุณาเพิ่มข้อมูลผู้ขายอย่างน้อย 1 คน', 'error')
    return false
  }

  formData.value.ผู้ขาย.forEach((dealer, index) => {
    // ตรวจสอบข้อมูลบังคับกรอก
    if (!dealer.ชื่อ?.trim()) {
      errors.push(`กรุณากรอกชื่อผู้ขายคนที่ ${index + 1}`)
      isValid = false
    }

    // ตรวจสอบเลขบัตรประชาชน (ถ้ามี)
    if (dealer.เลขบัตรประชาชน && !validateThaiID(dealer.เลขบัตรประชาชน)) {
      errors.push(`เลขบัตรประชาชนผู้ขายคนที่ ${index + 1} ไม่ถูกต้อง`)
      isValid = false
    }

    // ตรวจสอบข้อมูลการชำระเงิน
    if (dealer.การชำระเงิน.วิธีชำระ !== 'เงินสด') {
      if (!dealer.การชำระเงิน.ธนาคาร) {
        errors.push(`กรุณาเลือกธนาคารของผู้ขายคนที่ ${index + 1}`)
        isValid = false
      }
      if (!dealer.การชำระเงิน.เลขบัญชี) {
        errors.push(`กรุณากรอกเลขบัญชีของผู้ขายคนที่ ${index + 1}`)
        isValid = false
      }
    }

    // ตรวจสอบเบอร์โทร (ถ้ามี)
    if (dealer.ช่องทางติดต่อ.เบอร์โทร && !validatePhoneNumber(dealer.ช่องทางติดต่อ.เบอร์โทร)) {
      errors.push(`เบอร์โทรศัพท์ของผู้ขายคนที่ ${index + 1} ไม่ถูกต้อง`)
      isValid = false
    }
  })

  // แสดงข้อความ error ทั้งหมด
  if (!isValid) {
    errors.forEach((error) => showNotification(error, 'error'))
  }

  return isValid
}

// ฟังก์ชันตรวจสอบเลขบัตรประชาชน
const validateThaiID = (id) => {
  if (!id) return true // ถ้าไม่ได้กรอกให้ผ่าน
  if (id.length !== 13) return false

  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i)) * (13 - i)
  }
  let check = (11 - (sum % 11)) % 10
  return check === parseInt(id.charAt(12))
}

// ฟังก์ชันตรวจสอบเบอร์โทรศัพท์
const validatePhoneNumber = (phone) => {
  if (!phone) return true // ถ้าไม่ได้กรอกให้ผ่าน
  return /^0[1-9][0-9]{8}$/.test(phone.replace(/[- ]/g, '')) // เบอร์โทร 10 หลัก
}

// ตัวอย่างการใช้งาน PDF
import html2pdf from 'html2pdf.js'

// เพิ่ม data properties
const showPdfPreview = ref(false)

// เพิ่ม methods
const previewPDF = () => {
  if (!form.value.validate()) {
    showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'error')
    return
  }
  showPdfPreview.value = true
}

// สร้าง ref สำหรับอ้างอิง element
const pdfTemplate = ref(null)
const isPdfGenerating = ref(false)

const downloadPDF = async () => {
  try {
    isPdfGenerating.value = true

    // รอให้ DOM อัพเดทเสร็จก่อน
    await nextTick()

    // ตรวจสอบว่ามี element หรือไม่
    if (!pdfTemplate.value) {
      throw new Error('PDF template element not found')
    }

    const opt = {
      margin: 10,
      filename: `แบบบันทึกข้อมูล_${formData.value.ชื่อ}_${formData.value.นามสกุล}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true,
        windowWidth: pdfTemplate.value.offsetWidth,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    }

    // สร้าง PDF
    await html2pdf().from(pdfTemplate.value).set(opt).save()

    showNotification('ดาวน์โหลด PDF สำเร็จ')
  } catch (error) {
    console.error('PDF generation error:', error)
    showNotification('เกิดข้อผิดพลาดในการสร้างไฟล์ PDF', 'error')
  } finally {
    isPdfGenerating.value = false
  }
}

// สร้าง PDF preview แยก

//****************************** */

watch(searchType, () => {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
})

//รับข้อมูลจาก SearchPerson.vue
// สร้าง formData เพื่อเก็บข้อมูลในฟอร์ม
const formData = reactive({
  คำนำหน้า: '',
  ชื่อ: '',
  นามสกุล: '',
  เลขบัตรประชาชน: '',
  อายุ: '',
  เพศ: '',
  ที่อยู่: {
    บ้านเลขที่: '',
    หมู่: '',
    ตำบล: '',
    อำเภอ: '',
    จังหวัด: '',
  },
  พบเสพ: null,
  ประเภทยาเสพติด: '',
  จำนวนที่เสพ: '',
})

const submitForm = () => {
  console.log('Form Data:', formData)
}

const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === 'object') {
      Object.keys(formData[key]).forEach((subKey) => {
        formData[key][subKey] = ''
      })
    } else {
      formData[key] = ''
    }
  })
}

// ฟังก์ชันสำหรับรับข้อมูลจาก selectPerson
const handleSelectPerson = (data) => {
  console.log('Data received:', data)
  formData.ชื่อ = data.personalInfo.firstName
  formData.นามสกุล = data.personalInfo.lastName
  formData.เลขบัตรประชาชน = data.personalInfo.idCard
  formData.อายุ = data.personalInfo.age
  formData.ที่อยู่.บ้านเลขที่ = data.personalInfo.address.houseNo
  formData.ที่อยู่.หมู่ = data.personalInfo.address.moo
  formData.ที่อยู่.ตำบล = data.personalInfo.address.tambon
  formData.ที่อยู่.อำเภอ = data.personalInfo.address.amphoe
  formData.ที่อยู่.จังหวัด = data.personalInfo.address.province
}
</script>

<style scoped>
body {
  font-family: 'Sarabun', sans-serif;
}
.text-h6,
.text-h5,
.text-h4,
.text-h3,
.text-h2,
.text-h1 {
  font-family: 'Sarabun', sans-serif;
  font-size: 1.5rem;
}

.text-subtitle-1 {
  font-size: 1rem;
}
.v-text-field.v-text-field--enclosed {
  margin: 0;
  padding: 0;
}

.v-label {
  font-size: 0.875rem;
}

.v-input--selection-controls {
  margin: 0;
  padding: 0;
}

/* เพิ่ม styles สำหรับ PDF preview */
#pdfTemplate {
  font-size: 16px;
  line-height: 1.5;
  color: #000;
}

#pdfTemplate h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

#pdfTemplate h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

#pdfTemplate p {
  margin-bottom: 8px;
}

#pdfTemplate ul {
  margin-top: 0;
  margin-bottom: 16px;
}

.pdf-content {
  background-color: white;
  min-height: 800px;
}

.section-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}

.section-header {
  border-bottom: 2px solid var(--v-primary-base);
  margin-bottom: 16px;
}

.info-text {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.87);
}

.signature-line {
  width: 200px;
  border-bottom: 1px solid #000;
  margin: 0 auto;
}

.signature-block {
  min-width: 250px;
}

@media print {
  .pdf-content {
    padding: 20mm !important;
    font-family: 'Sarabun', sans-serif;
  }

  .section-container {
    break-inside: avoid;
  }
}

/* เพิ่ม style สำหรับลายเซ็น */
.signature-line {
  border-bottom: 1px solid #000;
  width: 200px;
  margin: 0 auto;
  margin-bottom: 8px;
}

/* Styles for PDF content */
.pdf-content {
  background-color: white;
  font-size: 16px;
  line-height: 1.5;
  color: #000;
}

.signature-line {
  border-bottom: 1px solid #000;
  width: 200px;
  margin: 0 auto;
  margin-bottom: 8px;
}
</style>
