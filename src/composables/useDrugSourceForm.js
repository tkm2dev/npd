// composables/useDrugSourceForm.js
import { reactive } from 'vue'

export const useDrugSourceForm = () => {
  const createEmptySource = () => ({
    name: '',
    nickname: '',
    contact: {
      phonefrom: '',
      linefrom: '',
      facebookfrom: '',
      phoneto: '',
      lineto: '',
      facebookto: '',
    },
    payment: {
      method: 'cash',
      bankfrom: '',
      accountNumberfrom: '',
      accountNamefrom: '',
      bankto: '',
      accountNumberto: '',
      accountNameto: '',
    },
    purchaseDetails: {
      date: '',
      time: '',
      amount: '',
      pricePerUnit: '',
      totalPrice: '',
      location: '',
    },
  })

  const validateSource = (source) => {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!source.name) return false
    if (source.payment.method === 'transfer') {
      if (!source.payment.bank || !source.payment.accountNumber) return false
    }
    return true
  }

  return {
    createEmptySource,
    validateSource,
  }
}
