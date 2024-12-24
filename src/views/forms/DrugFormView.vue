<template>
  <div>
    <!-- Drug Form -->
    <SearchPerson @select="handlePersonSelect" />

    <v-card>
      <v-card-title class="d-flex align-center">
        {{ isEditing ? 'แก้ไขข้อมูล' : 'แบบฟอร์มบันทึกข้อมูลเกี่ยวกข้องกับยาเสพติด' }}
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-arrow-left" variant="tonal" @click="router.back()">
          ย้อนกลับ
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-stepper v-model="uiState.currentStep" :items="steps">
          <template v-slot:item.1>
            <!-- ส่วนที่ 1: ข้อมูลส่วนตัว -->
            <v-card-text>
              <v-form ref="personalForm">
                <v-row>
                  <v-col cols="12" md="2">
                    <v-select
                      v-model="formData.คำนำหน้า"
                      :items="['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']"
                      label="คำนำหน้า"
                      :rules="rules.title"
                      outlined
                      dense
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.personalInfo.firstName"
                      label="ชื่อ"
                      :rules="rules.firstName"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.personalInfo.lastName"
                      label="นามสกุล"
                      :rules="rules.lastName"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-text-field
                      v-model="formData.personalInfo.age"
                      label="อายุ"
                      type="number"
                      :rules="rules.age"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.personalInfo.idCard"
                      label="เลขบัตรประชาชน"
                      :rules="rules.idCard"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                      maxlength="13"
                      counter="13"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.personalInfo.address.houseNo"
                      label="บ้านเลขที่"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.personalInfo.address.moo"
                      label="หมู่ที่"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.personalInfo.address.tambon"
                      label="ตำบล"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.personalInfo.address.amphoe"
                      label="อำเภอ"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.personalInfo.address.province"
                      label="จังหวัด"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </template>

          <template v-slot:item.2>
            <!-- ส่วนที่ 2: ประวัติการเสพ -->
            <v-card-text>
              <v-form ref="drugHistoryForm">
                <v-row>
                  <v-col cols="12">
                    <v-radio-group
                      v-model="formData.hasUsedDrugs"
                      label="พบเสพยาเสพติดหรือไม่"
                      :rules="rules.required"
                      required
                    >
                      <v-radio label="พบ" :value="true"></v-radio>
                      <v-radio label="ไม่พบ" :value="false"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>

                <template v-if="formData.hasUsedDrugs">
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="formData.drugTypes"
                        :items="drugTypeOptions"
                        label="ประเภทยาเสพติดที่เสพ"
                        :rules="rules.required"
                        variant="outlined"
                        density="comfortable"
                        multiple
                        chips
                        required
                      ></v-select>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.startDate"
                        label="เริ่มเสพเมื่อ"
                        type="date"
                        :rules="rules.required"
                        variant="outlined"
                        density="comfortable"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-model="formData.reasons"
                        :items="reasonOptions"
                        label="แรงจูงใจในการเสพยาเสพติด"
                        :rules="rules.required"
                        variant="outlined"
                        density="comfortable"
                        multiple
                        chips
                        required
                      ></v-select>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.usage.amountPerTime"
                        label="จำนวนที่เสพแต่ละครั้ง (เม็ด)"
                        type="number"
                        :rules="rules.required"
                        variant="outlined"
                        density="comfortable"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.usage.frequency"
                        :items="frequencyOptions"
                        label="ระยะในการเสพ"
                        :rules="rules.required"
                        variant="outlined"
                        density="comfortable"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                </template>
              </v-form>
            </v-card-text>
          </template>

          <template v-slot:item.3>
            <!-- ส่วนที่ 3: ข้อมูลการเสพครั้งล่าสุด -->
            <v-card-text>
              <v-form ref="lastUsageForm">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.lastUsage.type"
                      :items="['ยาบ้า', 'ยาไอซ์', 'กัญชา', 'อื่นๆ']"
                      label="ประเภทยาเสพติด"
                      multiple
                      outlined
                      dense
                    ></v-select>
                    <v-select
                      v-model="formData.lastUsage.type"
                      :items="drugTypeOptions"
                      label="ประเภทยาเสพติด"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      required
                    ></v-select>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.lastUsage.amount"
                      label="จำนวน (เม็ด)"
                      type="number"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.lastUsage.date"
                      label="วันที่"
                      type="date"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.lastUsage.time"
                      label="เวลา"
                      type="time"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.lastUsage.location"
                      label="สถานที่ซื้อและส่งมอบยาเสพติด"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      rows="3"
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>

                <!-- ผู้ขาย -->
                <v-row>
                  <v-col cols="12" class="mt-4">
                    <div class="text-subtitle-1 font-weight-bold mb-4">ข้อมูลผู้ขาย</div>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastDealer.firstName"
                      label="ชื่อผู้ขาย"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastDealer.lastName"
                      label="นามสกุลผู้ขาย"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastDealer.nickname"
                      label="ชื่อเล่น"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.lastDealer.pricePerUnit"
                      label="ราคาเม็ดละ (บาท)"
                      type="number"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      required
                      @update:model-value="calculateTotalPrice"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.lastDealer.totalPrice"
                      label="รวมเป็นเงิน (บาท)"
                      type="number"
                      variant="outlined"
                      density="comfortable"
                      readonly
                      disabled
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </template>

          <template v-slot:item.4>
            <!-- ส่วนที่ 4: ข้อมูลการติดต่อ -->
            <v-card-text>
              <v-form ref="contactForm">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.contact.userPhone"
                      label="เบอร์โทรผู้เสพ"
                      :rules="rules.phone"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.contact.dealerPhone"
                      label="เบอร์โทรผู้ขาย"
                      :rules="rules.phone"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.contact.userLine"
                      label="LINE ID ผู้เสพ"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.contact.dealerLine"
                      label="LINE ID ผู้ขาย"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.contact.userFacebook"
                      label="Facebook ผู้เสพ"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.contact.dealerFacebook"
                      label="Facebook ผู้ขาย"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- วิธีการชำระเงิน -->
                <v-row>
                  <v-col cols="12" class="mt-4">
                    <div class="text-subtitle-1 font-weight-bold mb-4">วิธีการชำระเงิน</div>
                    <v-radio-group
                      v-model="formData.payment.method"
                      :rules="rules.required"
                      required
                    >
                      <v-radio label="ชำระเป็นเงินสด" value="cash"></v-radio>
                      <v-radio label="โอนเงินผ่านบัญชี" value="transfer"></v-radio>
                    </v-radio-group>
                  </v-col>

                  <!-- แสดงเมื่อเลือกโอนเงิน -->
                  <template v-if="formData.payment.method === 'transfer'">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.payment.senderBank"
                        label="ธนาคารผู้โอน"
                        :rules="rules.required"
                        variant="outlined"
                        density="comfortable"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.payment.senderAccount"
                        label="เลขบัญชีผู้โอน"
                        :rules="rules.bankAccount"
                        variant="outlined"
                        density="comfortable"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.payment.receiverBank"
                        label="ธนาคารผู้รับ"
                        :rules="rules.required"
                        variant="outlined"
                        density="comfortable"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.payment.receiverAccount"
                        label="เลขบัญชีผู้รับ"
                        :rules="rules.bankAccount"
                        variant="outlined"
                        density="comfortable"
                        required
                      ></v-text-field>
                    </v-col>
                  </template>
                </v-row>

                <!-- ลายเซ็น -->
                <v-row class="mt-4">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.signature.informant"
                      label="ลงชื่อผู้ให้ข้อมูล"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.signature.interviewer"
                      label="ลงชื่อผู้ซักถาม"
                      :rules="rules.required"
                      variant="outlined"
                      density="comfortable"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </template>
        </v-stepper>

        <!-- Navigation Buttons -->
        <v-card-actions>
          <!-- <v-btn variant="outlined" :disabled="currentStep === 1" @click="currentStep--">
            ย้อนกลับ
          </v-btn> -->

          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            :loading="loading"
            @click="currentStep < steps.length ? nextStep() : handleSubmit()"
          >
            {{ currentStep < steps.length ? 'ถัดไป' : 'บันทึกข้อมูล' }}
          </v-btn>
        </v-card-actions>
      </v-card-text>

      <v-card-text>
        <v-form v-if="showForm" ref="form" v-model="valid" @submit.prevent="saveData">
          <!-- ข้อมูลส่วนตัว -->
          <v-card elevation="3" class="mb-6">
            <!-- หัวข้อ -->
            <v-toolbar color="blue darken-3" dark flat>
              <v-toolbar-title>1. ข้อมูลส่วนตัว</v-toolbar-title>
            </v-toolbar>

            <!-- ข้อมูลส่วนตัว -->
            <v-card-text>
              <v-container>
                <v-row>
                  <!-- คำนำหน้า -->
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="formData.คำนำหน้า"
                      :items="['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']"
                      label="คำนำหน้า"
                      :rules="[(v) => !!v || 'กรุณาเลือกคำนำหน้า']"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <!-- ชื่อ -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.ชื่อ"
                      label="ชื่อ"
                      outlined
                      dense
                      :rules="[(v) => !!v || 'กรุณากรอกชื่อ']"
                    ></v-text-field>
                  </v-col>

                  <!-- นามสกุล -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.นามสกุล"
                      label="นามสกุล"
                      outlined
                      dense
                      :rules="[(v) => !!v || 'กรุณากรอกนามสกุล']"
                    ></v-text-field>
                  </v-col>

                  <!-- เลขบัตรประชาชน -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.เลขบัตรประชาชน"
                      label="เลขบัตรประชาชน"
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

                  <!-- อายุ -->
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="formData.อายุ"
                      label="อายุ (ปี)"
                      type="number"
                      outlined
                      dense
                      :rules="[(v) => !!v || 'กรุณากรอกอายุ', (v) => v > 0 || 'อายุต้องมากกว่า 0']"
                    ></v-text-field>
                  </v-col>

                  <!-- เพศ -->
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
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.ที่อยู่.บ้านเลขที่"
                      label="บ้านเลขที่"
                      :rules="[(v) => !!v || 'กรุณากรอกบ้านเลขที่']"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.ที่อยู่.หมู่"
                      label="หมู่ที่"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.ที่อยู่.ตำบล"
                      label="ตำบล"
                      :rules="[(v) => !!v || 'กรุณากรอกตำบล']"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.ที่อยู่.อำเภอ"
                      label="อำเภอ"
                      :rules="[(v) => !!v || 'กรุณากรอกอำเภอ']"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.ที่อยู่.จังหวัด"
                      label="จังหวัด"
                      :rules="[(v) => !!v || 'กรุณากรอกจังหวัด']"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>

          <!-- ข้อมูลการเสพยา -->
          <v-card elevation="2" class="mb-6">
            <v-toolbar color="purple" dark flat>
              <v-toolbar-title>2. ข้อมูลการเสพยา</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-radio-group
                    v-model="formData.พบเสพ"
                    row
                    :rules="[(v) => v !== null || 'กรุณาเลือกข้อมูล']"
                  >
                    <v-radio label="พบ" :value="true"></v-radio
                    ><v-radio label="ไม่พบ" :value="false"></v-radio
                  ></v-radio-group>
                </v-col>

                <v-col cols="12" md="6" v-if="formData.พบเสพ">
                  <v-select
                    v-model="formData.ประเภทยา"
                    :items="['ยาบ้า', 'ยาไอซ์', 'กัญชา', 'อื่นๆ']"
                    label="ประเภทยาเสพติด"
                    multiple
                    outlined
                    dense
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6" v-if="formData.พบเสพ">
                  <v-text-field
                    v-model="formData.เริ่มเสพ"
                    label="เริ่มเสพตั้งแต่เมื่อไหร่"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" v-if="formData.พบเสพ">
                  <v-text-field
                    v-model="formData.จำนวนเสพ.ต่อครั้ง"
                    label="จำนวนที่เสพต่อครั้ง"
                    type="number"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" v-if="formData.พบเสพ">
                  <v-text-field
                    v-model="formData.จำนวนเสพ.ความถี่"
                    label="ความถี่ในการเสพ"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" v-if="formData.พบเสพ">
                  <v-select
                    v-model="formData.แรงจูงใจ"
                    :items="[
                      'เพื่อนชวน',
                      'ความเครียด',
                      'อยากลอง',
                      'ต้องการทำงานได้มากขึ้น(ไม่ง่วง)',
                      'ถูกบังคับ',
                      'อื่นๆ',
                    ]"
                    label="แรงจูงใจในการเสพ"
                    multiple
                    outlined
                    dense
                  ></v-select>
                </v-col>

                <v-col cols="12" v-if="formData.พบเสพ">
                  <v-subheader>รับ/ซื้อยาจากใครบ้าง</v-subheader>
                </v-col>

                <v-col cols="12" md="4" v-if="formData.พบเสพ">
                  <v-text-field
                    v-model="formData.แหล่งที่มา[0]"
                    label="แหล่งที่มา 1"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4" v-if="formData.พบเสพ">
                  <v-text-field
                    v-model="formData.แหล่งที่มา[1]"
                    label="แหล่งที่มา 2"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4" v-if="formData.พบเสพ">
                  <v-text-field
                    v-model="formData.แหล่งที่มา[2]"
                    label="แหล่งที่มา 3"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="2" class="mb-6" v-if="formData.พบเสพ">
            <v-toolbar color="deep-orange darken-1" dark flat>
              <v-toolbar-title>
                <v-icon left>mdi-account-multiple</v-icon>
                3. ข้อมูลผู้ขายยา
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="white"
                outlined
                @click="addNewDealer"
                :disabled="formData.ผู้ขาย.length >= 5"
              >
                <v-icon left>mdi-plus</v-icon>
                เพิ่มผู้ขาย ({{ formData.ผู้ขาย.length }}/5)
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <!-- ส่วนค้นหาผู้ขาย -->

              <v-row class="mb-4">
                <v-col cols="12">
                  <v-card outlined>
                    <v-card-title class="subtitle-1">
                      <v-icon left color="primary">mdi-magnify</v-icon>
                      ค้นหาข้อมูลผู้ขาย
                    </v-card-title>
                    <v-card-text>
                      <!-- ส่วนค้นหา -->
                      <v-row align="center" class="mb-4">
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="dealerSearchQuery"
                            label="ค้นหาด้วยชื่อ หรือเลขบัตรประชาชน"
                            outlined
                            dense
                            clearable
                            hide-details
                            @keyup.enter="searchDealer"
                            prepend-inner-icon="mdi-account-search"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-btn
                            color="primary"
                            @click="searchDealer"
                            :loading="isDealerSearching"
                            :disabled="!dealerSearchQuery"
                            block
                          >
                            <v-icon left>mdi-database-search</v-icon>
                            ค้นหา
                          </v-btn>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-btn color="success" @click="startNewDealerEntry" block>
                            <v-icon left>mdi-account-plus</v-icon>
                            กรอกข้อมูลใหม่
                          </v-btn>
                        </v-col>
                      </v-row>

                      <!-- ผลการค้นหา -->
                      <v-expand-transition>
                        <div v-if="showDealerResults">
                          <v-divider class="my-4"></v-divider>

                          <!-- แสดงผลเมื่อไม่พบข้อมูล -->
                          <div
                            v-if="dealerSearchResults.length === 0 && hasSearched"
                            class="text-center pa-6"
                          >
                            <v-icon size="64" color="grey lighten-1"
                              >mdi-account-search-outline</v-icon
                            >
                            <div class="title grey--text text--darken-1 mt-3">
                              ไม่พบข้อมูลผู้ขาย
                            </div>
                            <div class="subtitle-1 grey--text mb-4">คุณสามารถกรอกข้อมูลใหม่ได้</div>
                            <v-btn color="primary" @click="startNewDealerEntry">
                              <v-icon left>mdi-plus-circle</v-icon>
                              กรอกข้อมูลใหม่
                            </v-btn>
                          </div>

                          <!-- แสดงผลเมื่อพบข้อมูล -->
                          <v-data-table
                            v-else
                            :headers="dealerTableHeaders"
                            :items="dealerSearchResults"
                            :loading="isDealerSearching"
                            dense
                            :items-per-page="5"
                            class="elevation-1"
                          >
                            <template v-slot:[`item.fullName`]="{ item }">
                              <v-chip small>
                                <v-avatar left>
                                  <v-icon small>mdi-account</v-icon>
                                </v-avatar>
                                {{ item.fullName }}
                              </v-chip>
                            </template>

                            <template v-slot:[`item.pid`]="{ item }">
                              <span class="font-weight-medium">{{ formatThaiID(item.pid) }}</span>
                            </template>

                            <template v-slot:[`item.actions`]="{ item }">
                              <v-btn color="primary" small class="mr-2" @click="selectDealer(item)">
                                <v-icon left small>mdi-plus-circle</v-icon>
                                เลือก
                              </v-btn>
                            </template>
                          </v-data-table>
                        </div>
                      </v-expand-transition>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- รายการผู้ขายทั้งหมด -->
              <v-expansion-panels v-model="activeDealerPanel" multiple>
                <v-expansion-panel v-for="(dealer, index) in formData.ผู้ขาย" :key="index">
                  <v-expansion-panel-header>
                    <div class="d-flex align-center">
                      <v-avatar size="32" color="primary" class="white--text mr-3">
                        {{ index + 1 }}
                      </v-avatar>
                      <div>
                        <span class="font-weight-medium">ผู้ขายคนที่ {{ index + 1 }}</span>
                        <span class="ml-2 grey--text">
                          {{ dealer.ชื่อ || 'ยังไม่ระบุชื่อ' }}
                        </span>
                      </div>
                    </div>
                    <template v-slot:actions>
                      <v-btn
                        icon
                        small
                        color="error"
                        @click.stop="removeDealer(index)"
                        v-if="formData.ผู้ขาย.length > 1"
                      >
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <v-form ref="dealerForms" v-model="dealerFormsValid[index]">
                      <!-- ข้อมูลส่วนตัว -->
                      <v-card outlined class="mb-4">
                        <v-card-title class="subtitle-1">
                          <v-icon left color="primary">mdi-account-details</v-icon>
                          ข้อมูลส่วนตัว
                        </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="dealer.ชื่อ"
                                label="ชื่อ-นามสกุล*"
                                outlined
                                dense
                                :rules="[(v) => !!v || 'กรุณากรอกชื่อ-นามสกุล']"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="dealer.เลขบัตรประชาชน"
                                label="เลขบัตรประชาชน"
                                outlined
                                dense
                                maxlength="13"
                                counter
                                :rules="[validateThaiID]"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>

                      <!-- ที่อยู่ -->
                      <v-card outlined class="mb-4">
                        <v-card-title class="subtitle-1">
                          <v-icon left color="primary">mdi-map-marker</v-icon>
                          ที่อยู่
                        </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="dealer.ที่อยู่.บ้านเลขที่"
                                label="บ้านเลขที่"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="dealer.ที่อยู่.หมู่"
                                label="หมู่"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="dealer.ที่อยู่.ถนน"
                                label="ถนน"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                              <v-autocomplete
                                v-model="dealer.ที่อยู่.จังหวัด"
                                :items="provinces"
                                label="จังหวัด"
                                outlined
                                dense
                                @change="onProvinceChange(index)"
                              ></v-autocomplete>
                            </v-col>

                            <v-col cols="12" md="4">
                              <v-autocomplete
                                v-model="dealer.ที่อยู่.อำเภอ"
                                :items="getDistricts(dealer.ที่อยู่.จังหวัด)"
                                label="อำเภอ"
                                outlined
                                dense
                                :disabled="!dealer.ที่อยู่.จังหวัด"
                                @change="onDistrictChange(index)"
                              ></v-autocomplete>
                            </v-col>

                            <v-col cols="12" md="4">
                              <v-autocomplete
                                v-model="dealer.ที่อยู่.ตำบล"
                                :items="
                                  getSubDistricts(dealer.ที่อยู่.จังหวัด, dealer.ที่อยู่.อำเภอ)
                                "
                                label="ตำบล"
                                outlined
                                dense
                                :disabled="!dealer.ที่อยู่.อำเภอ"
                              ></v-autocomplete>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>

                      <!-- ช่องทางการติดต่อ -->
                      <v-card outlined class="mb-4">
                        <v-card-title class="subtitle-1">
                          <v-icon left color="primary">mdi-contacts</v-icon>
                          ช่องทางการติดต่อ
                        </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="dealer.ช่องทางติดต่อ.เบอร์โทร"
                                label="เบอร์โทรศัพท์"
                                outlined
                                dense
                                :rules="[validatePhoneNumber]"
                              >
                                <template v-slot:prepend-inner>
                                  <v-icon small color="primary">mdi-phone</v-icon>
                                </template>
                              </v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="dealer.ช่องทางติดต่อ.line"
                                label="LINE ID"
                                outlined
                                dense
                              >
                                <template v-slot:prepend-inner>
                                  <v-icon small color="success">mdi-line</v-icon>
                                </template>
                              </v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="dealer.ช่องทางติดต่อ.facebook"
                                label="Facebook"
                                outlined
                                dense
                              >
                                <template v-slot:prepend-inner>
                                  <v-icon small color="blue">mdi-facebook</v-icon>
                                </template>
                              </v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="dealer.ช่องทางติดต่อ.อื่นๆ"
                                label="ช่องทางอื่นๆ"
                                outlined
                                dense
                              >
                                <template v-slot:prepend-inner>
                                  <v-icon small>mdi-chat</v-icon>
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>

                      <!-- ข้อมูลการชำระเงิน -->
                      <v-card outlined>
                        <v-card-title class="subtitle-1">
                          <v-icon left color="primary">mdi-cash-multiple</v-icon>
                          ข้อมูลการชำระเงิน
                        </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-select
                                v-model="dealer.การชำระเงิน.วิธีชำระ"
                                :items="['เงินสด', 'โอนเงิน', 'เงินสด/โอนเงิน']"
                                label="วิธีการชำระเงิน*"
                                outlined
                                dense
                                :rules="[(v) => !!v || 'กรุณาเลือกวิธีการชำระเงิน']"
                              >
                                <template v-slot:prepend-inner>
                                  <v-icon small color="success">mdi-cash</v-icon>
                                </template>
                              </v-select>
                            </v-col>
                          </v-row>

                          <v-expand-transition>
                            <div v-if="dealer.การชำระเงิน.วิธีชำระ !== 'เงินสด'">
                              <v-row>
                                <v-col cols="12" md="4">
                                  <v-select
                                    v-model="dealer.การชำระเงิน.ธนาคาร"
                                    :items="bankList"
                                    label="ธนาคาร*"
                                    outlined
                                    dense
                                    :rules="bankRules"
                                  >
                                    <template v-slot:prepend-inner>
                                      <v-icon small color="primary">mdi-bank</v-icon>
                                    </template>
                                  </v-select>
                                </v-col>

                                <v-col cols="12" md="4">
                                  <v-text-field
                                    v-model="dealer.การชำระเงิน.เลขบัญชี"
                                    label="เลขบัญชี*"
                                    outlined
                                    dense
                                    :rules="accountRules"
                                  >
                                    <template v-slot:prepend-inner>
                                      <v-icon small color="primary">mdi-credit-card</v-icon>
                                    </template>
                                  </v-text-field>
                                </v-col>

                                <v-col cols="12" md="4">
                                  <v-text-field
                                    v-model="dealer.การชำระเงิน.ชื่อบัญชี"
                                    label="ชื่อบัญชี*"
                                    outlined
                                    dense
                                    :rules="[(v) => !!v || 'กรุณากรอกชื่อบัญชี']"
                                  >
                                    <template v-slot:prepend-inner>
                                      <v-icon small color="primary">mdi-account-box</v-icon>
                                    </template>
                                  </v-text-field>
                                </v-col>
                              </v-row>
                            </div>
                          </v-expand-transition>
                        </v-card-text>
                      </v-card>
                    </v-form>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
          <!-- เพิ่มปุ่มดูตัวอย่าง PDF ไว้ข้างๆ ปุ่มบันทึก -->
          <v-card-actions class="justify-center pa-4">
            <v-btn color="error" text @click="cancelEntry" :disabled="isSaving">
              <v-icon left>mdi-close</v-icon>
              ยกเลิก
            </v-btn>
            <v-btn color="info" @click="previewPDF" class="mr-2" :disabled="!valid">
              <v-icon left>mdi-file-pdf-box</v-icon>
              ดูตัวอย่าง PDF
            </v-btn>
            <v-btn color="primary" @click="saveData" :loading="isSaving" :disabled="!valid">
              <v-icon left>mdi-content-save</v-icon>
              บันทึกข้อมูล
            </v-btn>
          </v-card-actions>

          <!-- Dialog แสดงตัวอย่าง PDF -->
          <v-dialog v-model="showPdfPreview" max-width="800px" persistent>
            <v-card>
              <v-card-title class="headline primary white--text d-flex align-center">
                <span>ตัวอย่างเอกสาร PDF</span>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="showPdfPreview = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>

              <v-card-text>
                <div ref="pdfTemplate" class="pdf-content pa-6">
                  <!-- หัวเอกสาร -->
                  <div class="text-center mb-8">
                    <h2 class="text-h4 font-weight-bold primary--text">
                      แบบบันทึกข้อมูลผู้เกี่ยวข้องกับยาเสพติด
                    </h2>
                  </div>

                  <!-- ส่วนที่ 1: ข้อมูลส่วนตัว -->
                  <div class="section-container mb-8">
                    <div class="section-header">
                      <h3 class="text-h6 font-weight-bold mb-4">1. ข้อมูลส่วนตัว</h3>
                    </div>
                    <div class="section-content">
                      <v-row dense>
                        <v-col cols="12">
                          <div class="info-text">
                            ชื่อ <strong>{{ formData.ชื่อ }}</strong> นามสกุล
                            <strong>{{ formData.นามสกุล }}</strong> อายุ
                            <strong>{{ formData.อายุ }}</strong> ปี เพศ
                            <strong>{{ formData.เพศ }}</strong>
                          </div>
                        </v-col>
                        <v-col cols="12">
                          <div class="info-text">
                            เลขบัตรประชาชน
                            <strong>{{ formData.เลขบัตรประชาชน }}</strong>
                          </div>
                        </v-col>
                        <v-col cols="12">
                          <div class="info-text">
                            ที่อยู่: บ้านเลขที่
                            <strong>{{ formData.ที่อยู่.บ้านเลขที่ }}</strong>
                            <template v-if="formData.ที่อยู่.หมู่">
                              หมู่ที่
                              <strong>{{ formData.ที่อยู่.หมู่ }}</strong>
                            </template>
                            ตำบล<strong>{{ formData.ที่อยู่.ตำบล }}</strong> อำเภอ<strong>{{
                              formData.ที่อยู่.อำเภอ
                            }}</strong>
                            จังหวัด<strong>{{ formData.ที่อยู่.จังหวัด }}</strong>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </div>

                  <!-- ส่วนที่ 2: ข้อมูลการเสพยา -->
                  <div class="section-container mb-8">
                    <div class="section-header">
                      <h3 class="text-h6 font-weight-bold mb-4">2. ข้อมูลการเสพยา</h3>
                    </div>
                    <div class="section-content">
                      <v-row dense>
                        <v-col cols="12">
                          <div class="info-text">
                            พบเสพยาเสพติดหรือไม่:
                            <strong>{{ formData.usage ? 'พบ' : 'ไม่พบ' }}</strong>
                          </div>
                        </v-col>

                        <template v-if="formData.พบเสพ">
                          <v-col cols="12">
                            <div class="info-text">
                              ประเภทยาเสพติด:
                              <strong>{{ formData.ประเภทยา.join(', ') }}</strong>
                            </div>
                          </v-col>
                          <v-col cols="12">
                            <div class="info-text">
                              เริ่มเสพเมื่อ:
                              <strong>{{ formData.เริ่มเสพ }}</strong>
                            </div>
                          </v-col>
                          <v-col cols="12">
                            <div class="info-text">
                              แรงจูงใจในการเสพ:
                              <strong>{{ formData.แรงจูงใจ.join(', ') }}</strong>
                            </div>
                          </v-col>
                          <v-col cols="12">
                            <div class="info-text">
                              จำนวนที่เสพต่อครั้ง:
                              <strong>{{ formData.จำนวนเสพ.ต่อครั้ง }}</strong>
                              เม็ด
                            </div>
                          </v-col>
                          <v-col cols="12">
                            <div class="info-text">
                              ความถี่ในการเสพ:
                              <strong>{{ formData.จำนวนเสพ.ความถี่ }}</strong>
                            </div>
                          </v-col>
                          <v-col cols="12">
                            <div class="font-weight-bold mt-3 mb-2">รับ/ซื้อยาจากใครบ้าง:</div>
                            <v-list dense class="pa-0 grey lighten-4 rounded">
                              <v-list-item v-for="source in filteredSources" :key="source">
                                <v-list-item-icon class="mr-2">
                                  <v-icon small color="primary">mdi-chevron-right</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                  <v-list-item-title>{{ source }}</v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-col>
                        </template>
                      </v-row>
                    </div>
                  </div>

                  <!-- ส่วนที่ 3: ข้อมูลผู้ขาย -->
                  <template v-if="formData.พบเสพ">
                    <div class="section-container mb-8">
                      <div class="section-header">
                        <h3 class="text-h6 font-weight-bold mb-4">3. ข้อมูลผู้ขาย</h3>
                      </div>
                      <div class="section-content">
                        <v-row dense>
                          <v-col cols="12">
                            <div class="info-text">
                              ชื่อผู้ขาย:
                              <strong>{{ formData.ผู้ขาย.ชื่อ }}</strong>
                            </div>
                          </v-col>
                          <v-col cols="12">
                            <div class="info-text">
                              เบอร์โทรศัพท์:
                              <strong>{{ formData.ผู้ขาย.เบอร์โทร }}</strong>
                            </div>
                          </v-col>
                          <v-col cols="12">
                            <div class="info-text">
                              บัญชีธนาคาร:
                              <strong>{{ formData.ผู้ขาย.บัญชีธนาคาร }}</strong>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </template>

                  <!-- ส่วนลายเซ็น -->
                  <div class="mt-12 d-flex justify-space-between">
                    <div class="text-center signature-block">
                      <div class="signature-line"></div>
                      <p class="mt-2">ลงชื่อ...........................................</p>
                      <p class="mt-2">( {{ formData.ชื่อ }} {{ formData.นามสกุล }} )</p>
                      <p>ผู้ให้ข้อมูล</p>
                    </div>
                    <div class="text-center signature-block">
                      <div class="signature-line"></div>
                      <p class="mt-2">ลงชื่อ...........................................</p>
                      <p class="mt-2">(...........................................)</p>
                      <p>ผู้ซักถาม</p>
                    </div>
                  </div>
                </div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                  color="grey darken-1"
                  text
                  @click="showPdfPreview = false"
                  :disabled="isPdfGenerating"
                  class="mr-2"
                >
                  <v-icon left>mdi-close</v-icon>
                  ปิด
                </v-btn>
                <v-btn
                  color="primary"
                  @click="downloadPDF"
                  :loading="isPdfGenerating"
                  :disabled="isPdfGenerating"
                >
                  <v-icon left>mdi-file-download</v-icon>
                  {{ isPdfGenerating ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-form>
      </v-card-text>
      <!-- ฟอร์มกรอกข้อมูล -->
    </v-card>

    <!-- Confirm No History Dialog -->
    <v-dialog v-model="uiState.showConfirmNoHistory" max-width="400">
      <v-card>
        <v-card-title>ยืนยันการบันทึกข้อมูล</v-card-title>
        <v-card-text> ท่านต้องการบันทึกข้อมูลกรณีไม่พบเสพยาเสพติดใช่หรือไม่? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="uiState.showConfirmNoHistory = false">
            ยกเลิก
          </v-btn>
          <v-btn color="primary" @click="handleSaveNoHistory" :loading="uiState.isSaving">
            ยืนยัน
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Alert -->
    <v-snackbar v-model="uiState.alert.show" :color="uiState.alert.type" :timeout="3000">
      {{ uiState.alert.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="uiState.alert.show = false"> ปิด </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
// เพิ่ม imports
import { ref, reactive, computed, onMounted } from 'vue'

import { storeToRefs } from 'pinia'
import { useFormValidation } from '@/composables/useFormValidation'

import { useRouter, useRoute } from 'vue-router'
import { useFormRules } from '@/composables/useFormRules'
import { useDrugStore } from '@/stores/drug'

import SearchPerson from '@/components/search/SearchPerson.vue'

const loading = ref(false)

// Router setup
const router = useRouter()
const route = useRoute()

// Store setup
const drugStore = useDrugStore()
// const { loading } = storeToRefs(drugStore)

// Form validation setup
const { validateForm, rules } = useFormValidation()

// Form refs
const formRefs = {
  personalForm: ref(null),
  drugHistoryForm: ref(null),
  lastUsageForm: ref(null),
  contactForm: ref(null),
}

// UI State
const uiState = reactive({
  currentStep: 1,
  showConfirmNoHistory: false,
  isSaving: false,
  alert: {
    show: false,
    type: 'success',
    message: '',
  },
})

// Form Data State
const formData = reactive({
  recordType: 'drug',
  recordNumber: generateRecordNumber(),
  recordDate: new Date().toISOString().split('T')[0],
  personalInfo: {
    titleName: '',
    firstName: '',
    lastName: '',
    age: null,
    idCard: '',
    address: {
      houseNo: '',
      moo: '',
      tambon: '',
      amphoe: '',
      province: '',
    },
  },

  drugHistory: {
    hasUsedDrugs: null,
    drugTypes: [],
    startDate: '',
    reasons: [],
    usage: {
      amountPerTime: null,
      frequency: null,
    },
  },
  lastUsage: {
    type: '',
    date: '',
    time: '',
    amount: null,
    location: '',
  },
  lastDealer: {
    firstName: '',
    lastName: '',
    nickname: '',
    pricePerUnit: null,
    totalPrice: null,
  },
  contact: {
    userPhone: '',
    dealerPhone: '',
    userLine: '',
    dealerLine: '',
    userFacebook: '',
    dealerFacebook: '',
  },
  payment: {
    method: 'cash',
    senderBank: '',
    senderAccount: '',
    receiverBank: '',
    receiverAccount: '',
  },
  status: 'pending',
  createdBy: JSON.parse(localStorage.getItem('user'))?.username || 'system',
})

// Computed
const isEditing = computed(() => !!route.params.id)

const handlePersonSelect = (person) => {
  if (person) {
    try {
      // Fill personal info
      formData.personalInfo = {
        ...person.personalInfo,
      }

      // Fill contact if exists
      if (person.contact) {
        formData.contact = { ...person.contact }
      }

      showAlert('นำข้อมูลมาแสดงเรียบร้อยแล้ว', 'success')
    } catch (error) {
      showAlert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล', 'error')
    }
  } else {
    // Clear form data
    formData.personalInfo = {
      titleName: '',
      firstName: '',
      lastName: '',
      age: null,
      idCard: '',
      address: {
        houseNo: '',
        moo: '',
        tambon: '',
        amphoe: '',
        province: '',
      },
    }
    formData.contact = {
      phone: '',
      line: '',
      facebook: '',
    }
  }
}

// Methods
function generateRecordNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `NPD${year}${month}${random}`
}

async function handleSaveNoHistory() {
  uiState.isSaving = true
  try {
    formData.status = 'completed'
    formData.recordType = 'no_history'

    if (isEditing.value) {
      await drugStore.updateRecord(route.params.id, formData)
    } else {
      await drugStore.createRecord(formData)
    }

    showAlert('บันทึกข้อมูลสำเร็จ', 'success')
    router.push('/records')
  } catch (error) {
    showAlert('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error')
  } finally {
    uiState.isSaving = false
    uiState.showConfirmNoHistory = false
  }
}

function showAlert(message, type = 'success') {
  uiState.alert.message = message
  uiState.alert.type = type
  uiState.alert.show = true
}

// References
const personalForm = ref(null)
const drugHistoryForm = ref(null)
const lastUsageForm = ref(null)
const contactForm = ref(null)

// Form Steps
const steps = [
  { title: 'ข้อมูลส่วนตัว' },
  { title: 'ประวัติการเสพ' },
  { title: 'การเสพครั้งล่าสุด' },
  { title: 'ข้อมูลการติดต่อ' },
]

// Form Options
const drugTypeOptions = [
  { title: 'ยาบ้า', value: 'ยาบ้า' },
  { title: 'ยาไอซ์', value: 'ยาไอซ์' },
  { title: 'กัญชา', value: 'กัญชา' },
  { title: 'อื่นๆ', value: 'อื่นๆ' },
]

const reasonOptions = [
  { title: 'อยากลอง', value: 'อยากลอง' },
  { title: 'เพื่อนชวน', value: 'เพื่อนชวน' },
  { title: 'ต้องการทำงานได้มากขึ้น', value: 'ต้องการทำงานได้มากขึ้น' },
  { title: 'ถูกบังคับ', value: 'ถูกบังคับ' },
]

const frequencyOptions = [
  { title: 'เดือนละครั้ง', value: 'monthly' },
  { title: 'สัปดาห์ละครั้ง', value: 'weekly' },
  { title: 'วันละครั้ง', value: 'daily' },
  { title: 'เกือบทุกวัน', value: 'almost_daily' },
]

// Methods
const validateStep = async () => {
  let form = null
  switch (uiState.currentStep.value) {
    case 1:
      form = personalForm.value
      break
    case 2:
      form = drugHistoryForm.value
      break
    case 3:
      form = lastUsageForm.value
      break
    case 4:
      form = contactForm.value
      break
  }
  return form ? await form.validate() : true
}

const nextStep = async () => {
  if (await validateStep()) {
    uiState.currentStep.value++
  }
}

const calculateTotalPrice = () => {
  if (formData.lastDealer.pricePerUnit && formData.lastUsage.amount) {
    formData.lastDealer.totalPrice = formData.lastDealer.pricePerUnit * formData.lastUsage.amount
  }
}

const handleSubmit = async () => {
  if (!(await validateStep())) return

  loading.value = true
  try {
    if (isEditing.value) {
      await drugStore.updateRecord(route.params.id, formData)
    } else {
      await drugStore.createRecord(formData)
    }
  } catch (error) {
    console.error('Submit failed:', error)
    // Show error message
  } finally {
    loading.value = false
  }
}

// Lifecycle hooks
onMounted(async () => {
  if (isEditing.value) {
    try {
      const record = await drugStore.getRecord(route.params.id)
      Object.assign(formData, record)
    } catch (error) {
      showAlert('ไม่พบข้อมูลที่ต้องการ', 'error')
      router.push('/records')
    }
  }
})
</script>

<style scoped>
.v-stepper {
  box-shadow: none !important;
}
.search-results {
  max-height: 200px;
  overflow-y: auto;
}
</style>
