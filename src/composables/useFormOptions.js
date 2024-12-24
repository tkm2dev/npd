// composables/useFormOptions.js
export const useFormOptions = () => {
  const drugTypeOptions = ['ยาบ้า', 'ยาไอซ์', 'กัญชา', 'อื่นๆ']

  const motivationOptions = [
    { text: 'อยากลอง', value: 'อยากลอง' },
    { text: 'เพื่อนชวน', value: 'เพื่อนชวน' },
    { text: 'ต้องการทำงานได้มากขึ้น (ไม่ง่วง)', value: 'ต้องการทำงานได้มากขึ้น (ไม่ง่วง)' },
    { text: 'ถูกบังคับ', value: 'ถูกบังคับ' },
    { text: 'อื่นๆ', value: 'อื่นๆ' },
  ]

  const frequencyOptions = ['เดือนละครั้ง', 'สัปดาห์ละครั้ง', 'วันละครั้ง', 'เกือบทุกวัน']

  const bankOptions = [
    'ธนาคารกรุงเทพ',
    'ธนาคารกสิกรไทย',
    'ธนาคารกรุงไทย',
    'ธนาคารไทยพาณิชย์',
    'ธนาคารกรุงศรีอยุธยา',
    'ธนาคารทหารไทยธนชาต',
    'ธนาคารออมสิน',
    'ธนาคาร ธ.ก.ส.',
    'บัญชี ทรูมันนี่ วอลเล็ท',
    'อื่นๆ',
  ]

  return {
    drugTypeOptions,
    motivationOptions,
    frequencyOptions,
    bankOptions,
  }
}
