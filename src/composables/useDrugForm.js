// composables/useDrugForm.js
import { ref, reactive, computed } from 'vue'

export const useDrugForm = () => {
  // Form State
  const form = ref(null)
  const loading = ref(false)
  const error = ref('')

  // Form Data
  const formData = reactive({
    firstName: '',
    lastName: '',
    age: '',
    idCard: '',
    address: {
      houseNo: '',
      moo: '',
      tambon: '',
      amphoe: 'ธวัชบุรี',
      province: 'ร้อยเอ็ด',
    },
    hasUsedDrugs: null,
    drugTypes: [],
    startUsage: '',
    motivations: [],
    usageAmount: '',
    frequency: '',
    sources: [],
    lastUsage: {
      date: '',
      time: '',
      amount: '',
      dealer: {
        name: '',
        lastName: '',
        nickname: '',
      },
      price: {
        perUnit: '',
        total: '',
      },
      location: '',
      contact: {
        userPhone: '',
        dealerPhone: '',
        userLine: '',
        dealerLine: '',
        userFacebook: '',
        dealerFacebook: '',
      },
      payment: {
        method: 'cash', // 'cash', 'transfer', 'other'
        userBank: '',
        userAccount: '',
        dealerBank: '',
        dealerAccount: '',
        otherMethod: '',
      },
    },
  })

  // Computed Properties
  const isBasicInfoValid = computed(() => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.age &&
      formData.idCard?.length === 13 &&
      formData.address.houseNo &&
      formData.address.tambon &&
      formData.hasUsedDrugs !== null
    )
  })

  const isDetailedInfoValid = computed(() => {
    if (!formData.hasUsedDrugs) return true

    return (
      formData.drugTypes.length > 0 &&
      formData.startUsage &&
      formData.motivations.length > 0 &&
      formData.usageAmount &&
      formData.frequency
    )
  })

  const isAllDataValid = computed(() => {
    return isBasicInfoValid.value && isDetailedInfoValid.value
  })

  // Methods
  const resetForm = () => {
    if (form.value) {
      form.value.reset()
    }
    formData.sources = []
    formData.hasUsedDrugs = null
    error.value = ''
  }

  const addSource = () => {
    if (formData.sources.length < 3) {
      formData.sources.push('')
    }
  }

  const removeSource = (index) => {
    formData.sources.splice(index, 1)
  }

  const submitForm = async () => {
    if (!isBasicInfoValid.value) {
      error.value = 'กรุณากรอกข้อมูลพื้นฐานให้ครบถ้วน'
      return
    }

    if (formData.hasUsedDrugs && !isDetailedInfoValid.value) {
      error.value = 'กรุณากรอกข้อมูลการเสพให้ครบถ้วน'
      return
    }

    loading.value = true
    try {
      const submitData = {
        ...formData,
        drugTypes: formData.hasUsedDrugs ? formData.drugTypes : [],
        startUsage: formData.hasUsedDrugs ? formData.startUsage : null,
        motivations: formData.hasUsedDrugs ? formData.motivations : [],
        usageAmount: formData.hasUsedDrugs ? formData.usageAmount : null,
        frequency: formData.hasUsedDrugs ? formData.frequency : null,
        sources: formData.hasUsedDrugs ? formData.sources : [],
        lastUsage: formData.hasUsedDrugs ? formData.lastUsage : null,
      }

      // API call here
      // await api.submitDrugForm(submitData)

      console.log('Form submitted:', submitData)
      return true
    } catch (err) {
      error.value = err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    formData,
    loading,
    error,
    isBasicInfoValid,
    isDetailedInfoValid,
    isAllDataValid,
    resetForm,
    addSource,
    removeSource,
    submitForm,
  }
}
