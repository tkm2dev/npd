export function useFormRules() {
  // Validate Thai ID Card
  const validateThaiID = (id) => {
    if (id.length !== 13) return false
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(id.charAt(i)) * (13 - i)
    }
    const check = (11 - (sum % 11)) % 10
    return check === parseInt(id.charAt(12))
  }

  const rules = {
    required: [(v) => !!v || 'กรุณากรอกข้อมูล'],
    name: [
      (v) => !!v || 'กรุณากรอกชื่อ',
      (v) => v?.length >= 2 || 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร',
    ],
    age: [
      (v) => !!v || 'กรุณากรอกอายุ',
      (v) => v > 0 || 'อายุต้องมากกว่า 0',
      (v) => v < 150 || 'อายุไม่ถูกต้อง',
    ],
    idCard: [
      (v) => !!v || 'กรุณากรอกเลขบัตรประชาชน',
      (v) => v?.length === 13 || 'เลขบัตรประชาชนต้องมี 13 หลัก',
      (v) => /^\d+$/.test(v) || 'เลขบัตรประชาชนต้องเป็นตัวเลขเท่านั้น',
      (v) => validateThaiID(v) || 'เลขบัตรประชาชนไม่ถูกต้อง',
    ],
    phone: [
      (v) => !v || v.length === 10 || 'เบอร์โทรศัพท์ต้องมี 10 หลัก',
      (v) => !v || /^0\d{9}$/.test(v) || 'เบอร์โทรศัพท์ไม่ถูกต้อง',
    ],
    bankAccount: [
      (v) => !v || (v.length >= 10 && v.length <= 12) || 'เลขบัญชีต้องมี 10-12 หลัก',
      (v) => !v || /^\d+$/.test(v) || 'เลขบัญชีต้องเป็นตัวเลขเท่านั้น',
    ],
  }

  return {
    rules,
  }
}
