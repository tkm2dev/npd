<template>
  <v-row>
    <!-- ส่วนอัปโหลดเอกสาร -->
    <v-col cols="12" md="6">
      <v-file-input
        v-model="attachments"
        label="แนบเอกสาร (PDF, Word)"
        outlined
        dense
        accept=".pdf,.doc,.docx"
        show-size
        truncate-length="20"
        :rules="documentRules"
        :loading="isUploading"
        multiple
        @change="(files) => handleFileUpload(files, 'document')"
      ></v-file-input>
    </v-col>

    <!-- ส่วนอัปโหลดรูปภาพ -->
    <v-col cols="12" md="6">
      <v-file-input
        v-model="images"
        label="แนบรูปภาพ"
        outlined
        dense
        accept="image/*"
        show-size
        truncate-length="20"
        :rules="imageRules"
        :loading="isUploading"
        multiple
        @change="(files) => handleFileUpload(files, 'image')"
      ></v-file-input>
    </v-col>

    <!-- ส่วนแสดงพรีวิวรูปภาพ -->
    <v-col cols="12" v-if="imagePreviews.length">
      <v-row>
        <v-col
          v-for="(preview, index) in imagePreviews"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card>
            <v-img :src="preview" aspect-ratio="1" contain></v-img>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon small @click="removeImage(index)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEmits } from 'vue'

// ประกาศ emits
const emit = defineEmits(['notification', 'update:modelValue'])

// ค่าคงที่
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif']
const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

// reactive states
const attachments = ref([])
const images = ref([])
const imagePreviews = ref([])
const isUploading = ref(false)

// validation rules
const documentRules = computed(() => [
  (v) =>
    !v ||
    v.length === 0 ||
    v.every((file) => file.size <= MAX_FILE_SIZE) ||
    'ไฟล์ต้องมีขนาดไม่เกิน 5MB',
])

const imageRules = computed(() => [
  (v) =>
    !v ||
    v.length === 0 ||
    v.every((file) => file.size <= MAX_FILE_SIZE) ||
    'ไฟล์ต้องมีขนาดไม่เกิน 5MB',
  (v) =>
    !v ||
    v.length === 0 ||
    v.every((file) => file.type.startsWith('image/')) ||
    'กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น',
])

// ฟังก์ชันสร้างพรีวิวรูปภาพ
const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}

// ฟังก์ชันแสดงการแจ้งเตือน
const showNotification = (message, type) => {
  emit('notification', { message, type })
}

// ฟังก์ชันลบรูปภาพ
const removeImage = (index) => {
  imagePreviews.value.splice(index, 1)
  const newFiles = Array.from(images.value)
  newFiles.splice(index, 1)
  images.value = newFiles
  emit('update:modelValue', images.value)
}

// ฟังก์ชันจัดการการอัปโหลดไฟล์
const handleFileUpload = async (files, type) => {
  if (!files || !files.length) return

  isUploading.value = true

  try {
    // ตรวจสอบไฟล์
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (ไม่เกิน 5MB)`)
      }

      if (type === 'image' && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error(`ไฟล์ ${file.name} ต้องเป็นรูปภาพเท่านั้น (JPEG, PNG, GIF)`)
      }

      if (type === 'document' && !ALLOWED_DOC_TYPES.includes(file.type)) {
        throw new Error(`ไฟล์ ${file.name} ต้องเป็น PDF หรือ Word เท่านั้น`)
      }
    }

    // สร้างพรีวิวสำหรับรูปภาพ
    if (type === 'image') {
      imagePreviews.value = await Promise.all(
        Array.from(files).map((file) => createImagePreview(file))
      )
    }

    // อัปเดตข้อมูล
    if (type === 'image') {
      images.value = files
      emit('update:modelValue', files)
    } else {
      attachments.value = files
      emit('update:modelValue', files)
    }

    showNotification(`อัพโหลดไฟล์สำเร็จ`, 'success')
  } catch (error) {
    console.error('File upload error:', error)
    showNotification(error.message, 'error')
    // ล้างข้อมูลที่อัปโหลดไม่สำเร็จ
    if (type === 'image') {
      images.value = []
      imagePreviews.value = []
    } else {
      attachments.value = []
    }
    emit('update:modelValue', [])
  } finally {
    isUploading.value = false
  }
}

// expose props and methods if needed
defineExpose({
  attachments,
  images,
  imagePreviews,
  reset: () => {
    attachments.value = []
    images.value = []
    imagePreviews.value = []
  },
})
</script>
