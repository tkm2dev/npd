<template>
  <v-dialog v-model="dialogVisible" max-width="800" persistent>
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>
          <v-icon left>mdi-file-excel</v-icon>
          ส่งออกข้อมูลเป็น Excel
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4">
        <v-container>
          <!-- Column Selection -->
          <v-card outlined class="mb-4">
            <v-card-title class="text-subtitle-1">
              <v-icon left color="primary">mdi-table-column</v-icon>
              เลือกคอลัมน์ที่ต้องการส่งออก
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" class="d-flex justify-end mb-2">
                  <v-btn small text color="primary" @click="selectAllColumns" class="mr-2">
                    <v-icon left small>mdi-checkbox-marked</v-icon>
                    เลือกทั้งหมด
                  </v-btn>
                  <v-btn small text @click="unselectAllColumns">
                    <v-icon left small>mdi-checkbox-blank-outline</v-icon>
                    ยกเลิกทั้งหมด
                  </v-btn>
                </v-col>
                <v-col
                  v-for="column in availableColumns"
                  :key="column.value"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-checkbox
                    v-model="selectedColumns"
                    :label="column.text"
                    :value="column"
                    hide-details
                    dense
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Column Customization -->
          <v-card outlined class="mb-4">
            <v-card-title class="text-subtitle-1">
              <v-icon left color="primary">mdi-format-list-text</v-icon>
              ปรับแต่งชื่อคอลัมน์
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="customizationHeaders"
                :items="selectedColumns"
                hide-default-footer
                dense
                class="elevation-0"
              >
                <template v-slot:item.text="{ item }">
                  {{ item.text }}
                </template>
                <template v-slot:item.customText="{ item }">
                  <v-text-field
                    v-model="item.customText"
                    dense
                    outlined
                    hide-details
                    placeholder="ระบุชื่อที่ต้องการแสดง"
                  ></v-text-field>
                </template>
                <template v-slot:item.width="{ item }">
                  <v-text-field
                    v-model="item.width"
                    dense
                    outlined
                    hide-details
                    type="number"
                    style="width: 100px"
                    min="50"
                    max="500"
                  ></v-text-field>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>

          <!-- Export Settings -->
          <v-card outlined>
            <v-card-title class="text-subtitle-1">
              <v-icon left color="primary">mdi-cog</v-icon>
              ตั้งค่าการส่งออก
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="exportSettings.filename"
                    label="ชื่อไฟล์"
                    outlined
                    dense
                    :suffix=".xlsx"
                    :rules="[filenameRules.required, filenameRules.valid]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="exportSettings.sheet"
                    :items="sheetNames"
                    label="ชื่อ Sheet"
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn text :disabled="exporting" @click="handleClose" class="mr-2"> ยกเลิก </v-btn>
        <v-btn color="primary" :loading="exporting" :disabled="!isValid" @click="handleExport">
          <v-icon left>mdi-file-excel</v-icon>
          ส่งออก
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import axios from 'axios'

// Props & Emits
const emit = defineEmits(['export-success', 'export-error', 'close'])

// State
const dialogVisible = ref(false)
const exporting = ref(false)
const selectedColumns = ref([])

// Constants
const sheetNames = ['Sheet1', 'รายงาน', 'ข้อมูลยาเสพติด']
const customizationHeaders = [
  { text: 'คอลัมน์', value: 'text', sortable: false },
  { text: 'ชื่อที่ต้องการแสดง', value: 'customText', sortable: false },
  { text: 'ความกว้าง (px)', value: 'width', sortable: false },
]

const availableColumns = [
  { text: 'รหัสเคส', value: 'code', customText: 'รหัสเคส', width: 120 },
  { text: 'คำนำหน้า', value: 'title', customText: 'คำนำหน้า', width: 80 },
  { text: 'ชื่อ', value: 'first_name', customText: 'ชื่อ', width: 120 },
  { text: 'นามสกุล', value: 'last_name', customText: 'นามสกุล', width: 120 },
  { text: 'เลขบัตรประชาชน', value: 'id_card', customText: 'เลขบัตรประชาชน', width: 130 },
  { text: 'อายุ', value: 'age', customText: 'อายุ', width: 60 },
  { text: 'เพศ', value: 'gender', customText: 'เพศ', width: 60 },
  { text: 'บ้านเลขที่', value: 'address.houseNo', customText: 'บ้านเลขที่', width: 100 },
  { text: 'หมู่', value: 'address.moo', customText: 'หมู่', width: 60 },
  { text: 'ตำบล', value: 'address.tambon', customText: 'ตำบล', width: 100 },
  { text: 'อำเภอ', value: 'address.amphoe', customText: 'อำเภอ', width: 100 },
  { text: 'จังหวัด', value: 'address.province', customText: 'จังหวัด', width: 100 },
  { text: 'สถานะการใช้ยา', value: 'has_used_drugs', customText: 'สถานะการใช้ยา', width: 120 },
  { text: 'ประเภทยา', value: 'drug_types', customText: 'ประเภทยา', width: 150 },
  { text: 'วันที่บันทึก', value: 'created_at', customText: 'วันที่บันทึก', width: 120 },
]

// Settings
const exportSettings = reactive({
  filename: 'drug_survey_report',
  sheet: 'รายงาน',
})

// Validation Rules
const filenameRules = {
  required: (v) => !!v || 'กรุณาระบุชื่อไฟล์',
  valid: (v) =>
    /^[a-zA-Z0-9_-]+$/.test(v) || 'ชื่อไฟล์ต้องประกอบด้วยตัวอักษร ตัวเลข - และ _ เท่านั้น',
}

// Computed
const isValid = computed(() => {
  return (
    selectedColumns.value.length > 0 &&
    exportSettings.filename &&
    filenameRules.valid(exportSettings.filename)
  )
})

// Methods
const showDialog = () => {
  selectedColumns.value = [...availableColumns]
  dialogVisible.value = true
}

const handleClose = () => {
  if (!exporting.value) {
    dialogVisible.value = false
    emit('close')
  }
}

const selectAllColumns = () => {
  selectedColumns.value = [...availableColumns]
}

const unselectAllColumns = () => {
  selectedColumns.value = []
}

const handleExport = async () => {
  if (!isValid.value) return

  exporting.value = true
  try {
    const response = await fetchDataForExport()
    if (response.data) {
      await exportToExcel(response.data)
      emit('export-success')
      handleClose()
    }
  } catch (error) {
    console.error('Export error:', error)
    emit('export-error', error)
  } finally {
    exporting.value = false
  }
}

const fetchDataForExport = async () => {
  try {
    return await axios.get('/api/drug-survey/export')
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลได้')
  }
}

const exportToExcel = async (data) => {
  const wb = XLSX.utils.book_new()
  const exportData = formatExportData(data)
  const ws = XLSX.utils.json_to_sheet(exportData)

  // Set column widths
  ws['!cols'] = selectedColumns.value.map((col) => ({
    wch: Math.floor(parseInt(col.width) / 7), // Convert px to character width
  }))

  XLSX.utils.book_append_sheet(wb, ws, exportSettings.sheet)
  XLSX.writeFile(wb, `${exportSettings.filename}.xlsx`)
}

const formatExportData = (data) => {
  return data.map((record) => {
    const row = {}
    selectedColumns.value.forEach((column) => {
      let value = null

      if (column.value.includes('address.')) {
        const addressKey = column.value.split('.')[1]
        value = record.address?.[addressKey] || ''
      } else if (column.value === 'drug_types') {
        value = Array.isArray(record.drug_types) ? record.drug_types.join(', ') : ''
      } else if (column.value === 'created_at') {
        value = formatDateTime(record[column.value])
      } else {
        value = record[column.value] || ''
      }

      row[column.customText] = value
    })
    return row
  })
}

const formatDateTime = (date) => {
  return date ? format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: th }) : ''
}

// Expose methods
defineExpose({
  showDialog,
})
</script>

<style scoped>
.v-data-table ::v-deep .v-data-table__wrapper {
  overflow-x: auto;
}

.v-data-table ::v-deep th {
  white-space: nowrap;
  background-color: #f5f5f5 !important;
}
</style>
