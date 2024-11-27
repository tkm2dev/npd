// src/utils/formatters.js

// จัดรูปแบบเลขบัตรประชาชน: 1234567890123 -> 1-2345-67890-12-3
export const formatIdCard = (id) => {
  if (!id) return ''
  return id.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5')
}

// จัดรูปแบบเบอร์โทรศัพท์: 0812345678 -> 081-234-5678
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
}

// จัดรูปแบบวันที่: 2024-01-25 -> 25 มกราคม 2567
export const formatDate = (date) => {
  if (!date) return ''
  const thaiMonths = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ]

  const d = new Date(date)
  return `${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`
}

// จัดรูปแบบเวลา: 14:30:00 -> 14:30 น.
export const formatTime = (time) => {
  if (!time) return ''
  return time.substring(0, 5) + ' น.'
}

// จัดรูปแบบจำนวนเงิน: 1234.56 -> ฿1,234.56
export const formatMoney = (amount) => {
  if (!amount) return '฿0'
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(amount)
}

// จัดรูปแบบชื่อ-นามสกุล
export const formatFullName = (firstName, lastName) => {
  return [firstName, lastName].filter(Boolean).join(' ')
}

// สร้างชื่อย่อ (Initials) จากชื่อ-นามสกุล: สมชาย ใจดี -> สจ
export const getInitials = (firstName, lastName) => {
  return (
    (firstName ? firstName.charAt(0) : '') + (lastName ? lastName.charAt(0) : '')
  ).toUpperCase()
}

// จัดรูปแบบที่อยู่
export const formatAddress = (address) => {
  if (!address) return ''

  const parts = [
    address.houseNo && `บ้านเลขที่ ${address.houseNo}`,
    address.moo && `หมู่ ${address.moo}`,
    address.tambon && `ต.${address.tambon}`,
    address.amphoe && `อ.${address.amphoe}`,
    address.province && `จ.${address.province}`,
  ].filter(Boolean)

  return parts.join(' ')
}

// จัดรูปแบบประวัติ
export const formatHistory = (history) => {
  if (!history) return ''

  const parts = []
  if (history.drugTypes?.length > 0) {
    parts.push(`ประเภท: ${history.drugTypes.join(', ')}`)
  }
  if (history.lastUsage) {
    parts.push(`ครั้งล่าสุด: ${formatDate(history.lastUsage.date)}`)
  }
  if (history.status) {
    const statusMap = {
      active: 'กำลังติดตาม',
      completed: 'เสร็จสิ้น',
      pending: 'รอดำเนินการ',
    }
    parts.push(`สถานะ: ${statusMap[history.status] || history.status}`)
  }

  return parts.join(' | ')
}

// จัดรูปแบบสถานะ
export const formatStatus = (status) => {
  const statusMap = {
    pending: {
      text: 'รอดำเนินการ',
      color: 'warning',
    },
    active: {
      text: 'กำลังดำเนินการ',
      color: 'info',
    },
    completed: {
      text: 'เสร็จสิ้น',
      color: 'success',
    },
    cancelled: {
      text: 'ยกเลิก',
      color: 'error',
    },
  }

  return (
    statusMap[status] || {
      text: status,
      color: 'grey',
    }
  )
}

// จัดรูปแบบความถี่
export const formatFrequency = (frequency) => {
  const frequencyMap = {
    daily: 'วันละครั้ง',
    weekly: 'สัปดาห์ละครั้ง',
    monthly: 'เดือนละครั้ง',
    almost_daily: 'เกือบทุกวัน',
  }
  return frequencyMap[frequency] || frequency
}

// Utility function สำหรับตรวจสอบค่าว่าง
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

// Utility function สำหรับตรวจสอบค่าที่ต้องกรอก
export const isRequired = (fieldName) => {
  return `กรุณากรอก${fieldName}`
}

// ตัวอย่างการใช้งาน:
// import { formatIdCard, formatDate, formatMoney } from '@/utils/formatters'
//
// const idCard = formatIdCard('1234567890123')  // '1-2345-67890-12-3'
// const date = formatDate('2024-01-25')         // '25 มกราคม 2567'
// const money = formatMoney(1234.56)            // '฿1,234.56'
