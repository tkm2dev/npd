// utils/addressParser.js
export const parseAddress = (addressString) => {
  try {
    // กรณีที่อยู่เป็น string เช่น "47 ม.15 ต.เชียงเครือ อ.เมืองสกลนคร จ.สกลนคร"
    let address = {
      houseNo: '',
      moo: '',
      tambon: '',
      amphoe: '', // default value
      province: '', // default value
    }

    if (!addressString) return address

    // แยกบ้านเลขที่และหมู่
    const houseMatch = addressString.match(/^(\d+)/)
    if (houseMatch) {
      address.houseNo = houseMatch[1]
    }

    // แยกหมู่ที่
    const mooMatch = addressString.match(/ม\.(\d+)/)
    if (mooMatch) {
      address.moo = mooMatch[1]
    }

    // แยกตำบล
    const tambonMatch = addressString.match(/ต\.([^\s]+)/)
    if (tambonMatch) {
      address.tambon = tambonMatch[1]
    }

    // แยกอำเภอ
    const amphoeMatch = addressString.match(/อ\.([^\s]+)/)
    if (amphoeMatch) {
      address.amphoe = amphoeMatch[1]
    }

    // แยกจังหวัด
    const provinceMatch = addressString.match(/จ\.([^\s]+)/)
    if (provinceMatch) {
      address.province = provinceMatch[1]
    }

    return address
  } catch (error) {
    console.error('Error parsing address:', error)
    return {
      houseNo: '',
      moo: '',
      tambon: '',
      amphoe: '',
      province: '',
    }
  }
}

// ตัวอย่างการใช้งาน:
// const address = parseAddress("47 ม.15 ต.เชียงเครือ อ.เมืองสกลนคร จ.สกลนคร")
// Result:
// {
//   houseNo: "47",
//   moo: "15",
//   tambon: "เชียงเครือ",
//   amphoe: "เมืองสกลนคร",
//   province: "สกลนคร"
// }
