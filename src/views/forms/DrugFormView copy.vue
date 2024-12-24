<template>
  <div>
    <v-card>
      <v-card-title class="text-h5 font-weight-bold">
        แบบบันทึกข้อมูลผู้เกี่ยวข้องกับยาเสพติด
      </v-card-title>

      <!-- Progress Stepper -->
      <v-stepper v-model="currentStep">
        <v-stepper-header>
          <template v-for="(step, i) in steps" :key="i">
            <v-stepper-item :value="i + 1" :complete="currentStep > i + 1">
              {{ step.title }}
            </v-stepper-item>
            <v-divider v-if="i < steps.length - 1" :key="`divider-${i}`"></v-divider>
          </template>
        </v-stepper-header>

        <v-stepper-window>
          <!-- ข้อมูลส่วนตัว -->
          <v-stepper-window-item :value="1">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.firstName"
                    label="ชื่อ"
                    :rules="rules.required"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.lastName"
                    label="นามสกุล"
                    :rules="rules.required"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.age"
                    label="อายุ"
                    type="number"
                    :rules="rules.age"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.idCard"
                    label="เลขบัตรประชาชน"
                    :rules="rules.idCard"
                    counter="13"
                    maxlength="13"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.address.houseNo"
                    label="บ้านเลขที่"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.address.moo"
                    label="หมู่ที่"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.address.tambon"
                    label="ตำบล"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-stepper-window-item>

          <!-- ประวัติการเสพ -->
          <v-stepper-window-item :value="2">
            <v-card-text>
              <v-radio-group v-model="formData.hasUsedDrugs" label="พบเสพยาเสพติดหรือไม่" required>
                <v-radio label="พบ" :value="true"></v-radio>
                <v-radio label="ไม่พบ" :value="false"></v-radio>
              </v-radio-group>

              <template v-if="formData.hasUsedDrugs">
                <v-select
                  v-model="formData.drugTypes"
                  :items="drugTypeOptions"
                  label="ประเภทยาเสพติดที่เสพ"
                  multiple
                  chips
                  variant="outlined"
                  required
                ></v-select>

                <v-text-field
                  v-model="formData.startDate"
                  label="เริ่มเสพเมื่อ"
                  type="date"
                  variant="outlined"
                  required
                ></v-text-field>

                <v-select
                  v-model="formData.reasons"
                  :items="reasonOptions"
                  label="แรงจูงใจในการเสพยาเสพติด"
                  multiple
                  chips
                  variant="outlined"
                  required
                ></v-select>
              </template>
            </v-card-text>
          </v-stepper-window-item>

          <!-- รายละเอียดการเสพครั้งล่าสุด -->
          <v-stepper-window-item :value="3">
            <!-- เพิ่มฟอร์มส่วนนี้ -->
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>

      <!-- Navigation Buttons -->
      <v-card-actions>
        <v-btn v-if="currentStep > 1" variant="outlined" @click="currentStep--"> ย้อนกลับ </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="currentStep < steps.length ? currentStep++ : handleSubmit()">
          {{ currentStep < steps.length ? 'ถัดไป' : 'บันทึกข้อมูล' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'DrugFormView',
  data() {
    return {
      currentStep: 1,
      steps: [
        { title: 'ข้อมูลส่วนตัว' },
        { title: 'ประวัติการเสพ' },
        { title: 'รายละเอียดการเสพครั้งล่าสุด' },
      ],
      formData: {
        firstName: '',
        lastName: '',
        age: null,
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
        startDate: '',
        reasons: [],
      },
      drugTypeOptions: [
        { title: 'ยาบ้า', value: 'ยาบ้า' },
        { title: 'ยาไอซ์', value: 'ยาไอซ์' },
        { title: 'อื่นๆ', value: 'อื่นๆ' },
      ],
      reasonOptions: [
        { title: 'อยากลอง', value: 'อยากลอง' },
        { title: 'เพื่อนชวน', value: 'เพื่อนชวน' },
        { title: 'ต้องการทำงานได้มากขึ้น', value: 'ต้องการทำงานได้มากขึ้น' },
        { title: 'ถูกบังคับ', value: 'ถูกบังคับ' },
      ],
      rules: {
        required: [(v) => !!v || 'กรุณากรอกข้อมูล'],
        age: [
          (v) => !!v || 'กรุณากรอกอายุ',
          (v) => v > 0 || 'อายุต้องมากกว่า 0',
          (v) => v < 150 || 'อายุไม่ถูกต้อง',
        ],
        idCard: [
          (v) => !!v || 'กรุณากรอกเลขบัตรประชาชน',
          (v) => v.length === 13 || 'เลขบัตรประชาชนต้องมี 13 หลัก',
        ],
      },
    }
  },
  methods: {
    async handleSubmit() {
      // Implement form submission logic
      console.log('Form Data:', this.formData)
    },
  },
}
</script>
