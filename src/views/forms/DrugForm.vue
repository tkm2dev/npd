<template>
  <v-container class="form-container">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- ค้นหา -->
        <SearchPerson ref="searchPerson" @select="handleSelectPerson" />
        <!-- Snackbar แจ้งเตือน -->
        <v-snackbar v-model="showAlert" :color="alertColor" :timeout="3000">
          {{ alertMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="showAlert = false"> ปิด </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-card-text class="">
      <v-form ref="form" v-model="valid">
        <!-- ส่วนที่ 1: ข้อมูลเป้าหมาย -->
        <v-sheet class="section-container mb-8" rounded>
          <div class="section-header">
            <v-icon color="primary" class="mr-2">mdi-account</v-icon>
            <span class="text-h6">1. ข้อมูลเป้าหมาย</span>
          </div>

          <v-row>
            <v-col cols="12" md="2">
              <v-select
                v-model="formData.title"
                :items="['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']"
                label="คำนำหน้า"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.first_name"
                label="ชื่อ*"
                outlined
                dense
                :rules="[(v) => !!v || 'กรุณากรอกชื่อ']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.last_name"
                label="นามสกุล*"
                outlined
                dense
                :rules="[(v) => !!v || 'กรุณากรอกนามสกุล']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="formData.nickname"
                label="ชื่อเล่น/ฉายา"
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.id_card"
                label="เลขบัตรประชาชน*"
                outlined
                dense
                counter="13"
                :rules="[
                  (v) => !!v || 'กรุณากรอกเลขบัตรประชาชน',
                  (v) => v?.length === 13 || 'เลขบัตรประชาชนต้องมี 13 หลัก',
                ]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="formData.age"
                label="อายุ*"
                type="number"
                suffix="ปี"
                outlined
                dense
                :rules="[(v) => !!v || 'กรุณากรอกอายุ']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.phone"
                label="เบอร์โทรศัพท์"
                outlined
                dense
              ></v-text-field>
            </v-col>

            <!-- <v-col cols="12" md="2">
              <v-select
                v-model="formData.sex"
                :items="['ชาย', 'หญิง', 'ไม่ระบุ']"
                label="เพศ"
                outlined
                dense
                :rules="[(v) => !!v || 'กรุณาเลือกเพศ']"
              ></v-select>
            </v-col> -->
          </v-row>

          <!-- ที่อยู่ -->
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="formData.address.houseNo"
                label="บ้านเลขที่*"
                outlined
                dense
                :rules="[(v) => !!v || 'กรุณากรอกบ้านเลขที่']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formData.address.moo"
                label="หมู่ที่"
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.address.tambon"
                label="ตำบล*"
                outlined
                dense
                :rules="[(v) => !!v || 'กรุณากรอกตำบล']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.address.amphoe"
                label="อำเภอ"
                outlined
                dense
                :rules="[(v) => !!v || 'กรุณากรอกอำเภอ']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.address.province"
                label="จังหวัด"
                outlined
                dense
                :rules="[(v) => !!v || 'กรุณากรอกจังหวัด']"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-sheet>

        <!-- ส่วนที่ 2: ประวัติการเสพยา -->
        <v-sheet class="section-container mb-8" rounded elevation="2">
          <div class="section-header">
            <v-icon color="error" class="mr-2">mdi-pill</v-icon>
            <span class="text-h6">2. ผลตรวจปัสสาวะ</span>
          </div>

          <v-radio-group
            v-model="formData.hasUsedDrugs"
            row
            class="mt-4"
            :rules="[(v) => v !== null || 'กรุณาเลือกข้อมูล']"
          >
            <v-radio label="พบสารเสพติด" value="พบ" color="error"></v-radio>
            <v-radio label="ไม่พบสารเสพติด" value="ไม่พบ" color="success"></v-radio>
          </v-radio-group>
          <!-- แสดงปุ่มบันทึกทันทีถ้าเลือก "ไม่พบ" -->
          <v-expand-transition>
            <div v-if="formData.hasUsedDrugs === 'ไม่พบ'" class="mt-4">
              <v-btn
                color="primary"
                block
                :loading="loading"
                @click="submitForm"
                height="50"
                class="mt-4"
              >
                <v-icon left>mdi-content-save</v-icon>
                บันทึกข้อมูล
              </v-btn>
            </div>
          </v-expand-transition>
        </v-sheet>

        <!-- ส่วนที่ 3: รายละเอียดการเสพ (แสดงเมื่อเลือก "พบ") -->

        <v-expand-transition>
          <template v-if="formData.hasUsedDrugs === 'พบ'">
            <v-sheet class="section-container mb-8" rounded elevation="2">
              <!-- ส่วนที่ 3.1 - 3.2: ประเภทยาและระยะเวลา -->
              <div class="section-card mb-6">
                <div class="section-header">
                  <v-icon color="error" class="mr-2">mdi-pill</v-icon>
                  <span class="text-h6">3.1 ข้อมูลการเสพ</span>
                </div>

                <v-row>
                  <!-- ประเภทยา -->

                  <v-col cols="12" md="6">
                    <!-- margin 10px -->

                    <v-select
                      v-model="formData.drugTypes"
                      :items="drugTypeOptions"
                      label="ประเภทยา*"
                      outlined
                      chips
                      dense
                      multiple
                      :rules="[(v) => !!v.length || 'กรุณาเลือกประเภทยา']"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.startUsage"
                      label="เริ่มเสพเมื่อ*"
                      type="date"
                      outlined
                      dense
                      :rules="[(v) => !!v || 'กรุณาระบุวันที่']"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>

              <!-- ส่วนที่ 3.3: แรงจูงใจ -->
              <div class="section-card mb-6">
                <div class="section-header">
                  <v-icon color="warning" class="mr-2">mdi-brain</v-icon>
                  <span class="text-h6">3.2 แรงจูงใจในการเสพ</span>
                </div>

                <v-row>
                  <v-col cols="12">
                    <v-chip-group
                      v-model="formData.motivations"
                      multiple
                      column
                      class="motivation-chips"
                    >
                      <v-chip
                        v-for="motivation in motivationOptions"
                        :key="motivation.value"
                        filter
                        :value="motivation.value"
                        outlined
                      >
                        <v-icon left small>{{ motivation.icon }}</v-icon>
                        {{ motivation.text }}
                      </v-chip>
                    </v-chip-group>
                  </v-col>
                </v-row>
              </div>

              <!-- ส่วนที่ 3.4: ปริมาณและความถี่ -->
              <div class="section-card mb-6">
                <div class="section-header">
                  <v-icon color="info" class="mr-2">mdi-chart-timeline-variant</v-icon>
                  <span class="text-h6">3.3 -3.4 ปริมาณและความถี่</span>
                </div>

                <v-row>
                  <!-- จำนวนที่เสพต่อครั้ง -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.usageAmount"
                      label="จำนวนที่เสพต่อครั้ง*"
                      type="number"
                      suffix="เม็ด"
                      outlined
                      dense
                      :rules="[(v) => !!v || 'กรุณาระบุจำนวน']"
                    ></v-text-field>
                  </v-col>

                  <!-- ความถี่ -->
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.frequency"
                      :items="frequencyOptions"
                      label="ความถี่ในการเสพ*"
                      outlined
                      multiple
                      dense
                      :rules="[(v) => !!v || 'กรุณาเลือกความถี่']"
                    >
                    </v-select>
                  </v-col>

                  <!-- รายละเอียดความถี่ -->
                  <v-col cols="12" md="6" v-if="showFrequencyDetail">
                    <v-text-field
                      v-model="formData.frequencyDetail"
                      :label="frequencyDetailLabel"
                      type="number"
                      outlined
                      dense
                      :suffix="frequencyDetailSuffix"
                      :rules="[(v) => !!v || 'กรุณาระบุจำนวน']"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>

              <!-- ส่วนที่ 3.5: ข้อมูลการซื้อ/รับ -->
              <div class="section-card mb-6">
                <div class="section-header">
                  <v-icon color="purple" class="mr-2">mdi-account-arrow-right</v-icon>
                  <span class="text-h6">3.5 แหล่งที่มา รับ/ซื้อมาจากใคร</span>
                </div>

                <v-row>
                  <v-col cols="12">
                    <v-expansion-panels>
                      <v-expansion-panel v-for="(source, index) in formData.sources" :key="index">
                        <v-expansion-panel-header>
                          <div class="d-flex align-center">
                            <v-avatar size="32" color="primary" class="white--text mr-3">
                              {{ index + 1 }}
                            </v-avatar>
                            <span>แหล่งที่มาที่ {{ index + 1 }}</span>
                            <v-chip v-if="source.fullname" class="ml-4" small outlined>
                              {{ source.fullname }}
                            </v-chip>
                          </div>
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>
                          <v-row>
                            <!-- ชื่อ-สกุล -->
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="source.fullname"
                                label="ชื่อ-สกุล"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>

                            <!-- เลขบัตรประชาชน -->
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="source.idcard"
                                label="เลขบัตรประชาชน"
                                outlined
                                dense
                                maxlength="13"
                              ></v-text-field>
                            </v-col>

                            <!-- ชื่อเล่น -->
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="source.nickname"
                                label="ชื่อเล่น"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>
                          </v-row>

                          <!-- ข้อมูลติดต่อ -->
                          <v-row>
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="source.phone"
                                label="เบอร์โทรศัพท์"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="source.line"
                                label="LINE ID"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="source.facebook"
                                label="Facebook"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>
                          </v-row>

                          <!-- วิธีการชำระเงิน -->
                          <v-row>
                            <v-col cols="12" md="4">
                              <v-select
                                v-model="source.method"
                                :items="['เงินสด', 'โอน']"
                                label="วิธีการชำระเงิน"
                                outlined
                                dense
                              ></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="source.bank"
                                label="ธนาคาร"
                                outlined
                                dense
                                v-if="source.method === 'โอน'"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="source.accountNumber"
                                label="เลขที่บัญชี"
                                outlined
                                dense
                                v-if="source.method === 'โอน'"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="source.accountName"
                                label="ชื่อบัญชี"
                                outlined
                                dense
                                v-if="source.method === 'โอน'"
                              ></v-text-field>
                            </v-col>
                          </v-row>

                          <!-- รายละเอียดการซื้อ -->
                          <v-row>
                            <v-col cols="12" md="3">
                              <v-text-field
                                v-model="source.date"
                                label="วันที่ซื้อ"
                                type="date"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="2">
                              <v-text-field
                                v-model="source.time"
                                label="เวลาที่ซื้อ"
                                type="time"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="2">
                              <v-text-field
                                v-model="source.amount"
                                label="จำนวน"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="2">
                              <v-text-field
                                v-model="source.pricePerUnit"
                                label="ราคาต่อหน่วย"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="2">
                              <v-text-field
                                v-model="source.totalPrice"
                                label="ราคารวม"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="source.location"
                                label="สถานที่ซื้อ"
                                outlined
                                dense
                              ></v-text-field>
                            </v-col>
                          </v-row>

                          <v-btn color="error" text block @click="removeSource(index)" class="mt-4">
                            <v-icon left>mdi-delete</v-icon>
                            ลบแหล่งที่มานี้
                          </v-btn>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>

                    <v-btn
                      color="primary"
                      outlined
                      block
                      @click="addSource"
                      :disabled="formData.sources.length >= 3"
                      class="mt-4"
                    >
                      <v-icon left>mdi-plus</v-icon>
                      เพิ่มแหล่งที่มา ({{ formData.sources.length }}/3)
                    </v-btn>
                  </v-col>
                </v-row>
              </div>

              <div class="section-card mb-6">
                <div class="section-header">
                  <v-icon color="error" class="mr-2">mdi-clock</v-icon>
                  <span class="text-h6">3.6 การใช้งานครั้งสุดท้าย</span>
                </div>

                <v-row>
                  <!-- ประเภทยา -->
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="formData.lastUsage.type"
                      :items="drugTypeOptions"
                      label="ประเภทของยา*"
                      outlined
                      dense
                      chips
                      multiple
                      :rules="[(v) => !!v || 'กรุณาเลือกประเภทของยา']"
                    ></v-select>
                  </v-col>

                  <!-- รับซื้อมาจากใคร -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.sellerName"
                      label="รับซื้อมาจากใคร*"
                      outlined
                      dense
                      :rules="[(v) => !!v || 'กรุณาระบุ ชื่อผู้ขาย']"
                    ></v-text-field>
                  </v-col>

                  <!-- นามสกุล -->
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="formData.lastUsage.sellerLastName"
                      label="นามสกุล"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <!-- ชื่อเล่น -->
                  <v-col cols="12" md="2">
                    <v-text-field
                      v-model="formData.lastUsage.sellerNickname"
                      label="ชื่อเล่น"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <!-- อายุ -->
                  <v-col cols="12" md="2">
                    <v-text-field
                      v-model="formData.lastUsage.sellerAge"
                      label="อายุ"
                      type="number"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <!-- เลขบัตรประชาชน -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.sellerIdcard"
                      label="เลขบัตรประชาชน"
                      outlined
                      dense
                      maxlength="13"
                    ></v-text-field>
                  </v-col>

                  <!-- บ้านเลขที่ -->
                  <v-col cols="12" md="2">
                    <v-text-field
                      v-model="formData.lastUsage.sellerAddressHouseNo"
                      label="บ้านเลขที่"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <!-- หมู่่บ้าน -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.sellerAddressHouseName"
                      label="ชื่อหมู่บ้าน"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <!-- หมู่ที่ -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.sellerAddressMoo"
                      label="หมู่ที่"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <!-- ตำบล -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.sellerAddressTambon"
                      label="ตำบล"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <!-- อำเภอ -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.sellerAddressAmphoe"
                      label="อำเภอ"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <!-- จังหวัด -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.sellerAddressProvince"
                      label="จังหวัด"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <!-- วันที่ -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.date"
                      label="วันที่ใช้งานครั้งสุดท้าย*"
                      type="date"
                      outlined
                      dense
                      :rules="[(v) => !!v || 'กรุณาระบุวันที่']"
                    ></v-text-field>
                  </v-col>

                  <!-- เวลา -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.time"
                      label="เวลา"
                      type="time"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <!-- จำนวน -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.amount"
                      label="จำนวนที่ใช้ (เม็ด)*"
                      type="number"
                      suffix="เม็ด"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.pricePerUnit"
                      label="ราคา/เม็ด"
                      suffix="บาท"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.totalPrice"
                      label="รวมเป็นเงิน"
                      suffix="บาท"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <!-- สถานที่ -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.lastUsage.location"
                      label="สถานที่ซื้อและส่งมอบยาเสพติดล่าสุด*"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>

              <!-- ส่วนที่ 3.7: ติดต่อกับผู้ขายโดย -->
              <div class="section-card mb-6">
                <div class="section-header">
                  <v-icon color="purple" class="mr-2">mdi-account-arrow-right</v-icon>
                  <span class="text-h6">3.7 ติดต่อกับผู้ขาย ครั้งล่าสุด</span>
                </div>

                <v-row>
                  <!-- เบอร์โทรศัพท์ผู้ขาย -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.sellerPhone"
                      label="เบอร์โทรศัพท์ผู้ขาย"
                      outlined
                      dense
                      prepend-inner-icon="mdi-phone"
                      :rules="[(v) => !!v || 'กรุณาระบุเบอร์โทรผู้ขาย']"
                    ></v-text-field>
                  </v-col>

                  <!-- LINE ผู้ขาย -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.sellerLine"
                      label="LINE ผู้ขาย"
                      outlined
                      dense
                      prepend-inner-icon="mdi-message"
                    ></v-text-field>
                  </v-col>

                  <!-- Facebook ผู้ขาย -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.lastUsage.sellerFacebook"
                      label="Facebook ผู้ขาย"
                      outlined
                      dense
                      prepend-inner-icon="mdi-facebook"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- เงินสดหรือโอน -->
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="formData.lastUsage.paymentMethod"
                      :items="['เงินสด', 'โอน']"
                      label="วิธีการชำระเงิน"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <!-- ธนาคาร  ถ้าเป็นเงินโอนให้แสดง -->
                  <v-col cols="12" md="4" v-if="formData.lastUsage.paymentMethod === 'โอน'">
                    <v-select
                      v-model="formData.lastUsage.sellerBankaccount"
                      :items="bankOptions"
                      label="ธนาคารผู้ขาย"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4" v-if="formData.lastUsage.paymentMethod === 'โอน'">
                    <v-text-field
                      v-model="formData.lastUsage.sellerBankaccountNumber"
                      label="เลขบัญชีผู้ขาย"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!--  เลขบัญชี   -->
              </div>

              <!-- ส่วนที่ 4: แนบไฟล์และรูปภาพ -->
              <div class="section-card mb-6">
                <div class="section-header">
                  <v-icon color="teal" class="mr-2">mdi-file</v-icon>
                  <span class="text-h6">4. ผู้บันทึกข้อมูล</span>
                </div>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.recordedBy"
                      label="ผู้บันทึก"
                      outlined
                      dense
                      :rules="[(v) => !!v || 'กรุณาระบุชื่อผู้บันทึก']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.recordedByStation"
                      label="หน่วยงานที่บันทึก"
                      outlined
                      dense
                      :rules="[(v) => !!v || 'กรุณาระบุชื่อหน่วยงานที่บันทึก']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.recordedByPhone"
                      label="เบอร์โทรศัพท์ผู้บันทึก"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>

              <!-- ส่วนที่ 4: แนบไฟล์และรูปภาพ -->
              <div class="section-card mb-6">
                <div class="section-header">
                  <v-icon color="teal" class="mr-2">mdi-file</v-icon>
                  <span class="text-h6">5. แนบไฟล์และรูปภาพ</span>
                </div>
              </div>

              <v-row>
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="formData.attachments"
                    label="แนบเอกสาร (PDF, Word)"
                    outlined
                    dense
                    accept=".pdf,.doc,.docx"
                    show-size
                    truncate-length="20"
                    @update:model-value="(files) => handleFileUpload(files, 'document')"
                  ></v-file-input>
                </v-col>

                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="formData.images"
                    label="แนบรูปภาพ"
                    outlined
                    dense
                    accept="image/*"
                    show-size
                    truncate-length="20"
                    @update:model-value="(files) => handleFileUpload(files, 'image')"
                  ></v-file-input>
                </v-col>

                <!-- แสดงพรีวิวรูปภาพ -->
                <v-col cols="12" v-if="formData.imagePreviews.length > 0">
                  <v-row>
                    <v-col
                      v-for="(preview, index) in formData.imagePreviews"
                      :key="index"
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                    >
                      <v-img :src="preview" aspect-ratio="1" cover></v-img>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <!-- ปุ่มดำเนินการ -->
              <div class="d-flex justify-end mt-6">
                <v-btn color="error" text class="mr-4" @click="resetForm">
                  <v-icon left>mdi-refresh</v-icon>
                  ล้างข้อมูล
                </v-btn>
                <v-btn
                  color="primary"
                  :loading="loading"
                  :disabled="!isAllDataValid"
                  @click="submitForm"
                >
                  <v-icon left>mdi-content-save</v-icon>
                  บันทึกข้อมูล
                </v-btn>
              </div>
            </v-sheet>
          </template>
        </v-expand-transition>
      </v-form>
    </v-card-text>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

import axios from 'axios'
import SearchPerson from '@/components/search/SearchPerson.vue'

import { useFormOptions } from '@/composables/useFormOptions'

// const Urlbase = 'http//localhost:3000'
const Urlbase = import.meta.env.VITE_API_BASE_URL

const showAlert = ref(false)
const alertMessage = ref('')
const alertColor = ref('success')
const searchPerson = ref(null) // Reference to the SearchPerson component

const showNotification = (message, color = 'success') => {
  alertMessage.value = message
  alertColor.value = color
  showAlert.value = true
}

const { drugTypeOptions, motivationOptions, bankOptions, frequencyOptions } = useFormOptions()

// Icons mapping

const formData = reactive({
  title: '',
  first_name: '',
  last_name: '',
  nickname: '',
  id_card: '',
  age: '',
  phone: '',
  sex: '',
  address: {
    houseNo: '',
    moo: '',
    tambon: '',
    amphoe: '',
    province: '',
  },
  hasUsedDrugs: '',
  drugTypes: [],
  startUsage: '',
  motivations: [],
  usageAmount: '',
  frequency: [],
  frequencyDetail: [],
  sources: [], // Initialize as an empty array
  lastUsage: {
    type: [], // ประเภทยา
    sellerName: '', // ชื่อผู้ขาย
    sellerLastName: '', // นามสกุลผู้ขาย
    sellerNickname: '', // ชื่อเล่นผู้ขาย
    sellerAge: '', // อายุผู้ขาย
    sellerIdcard: '', // เลขบัตรประชาชนผู้ขาย
    sellerAddressHouseNo: '', // บ้านเลขที่ผู้ขาย
    sellerAddressHouseName: '', // หมู่บ้านผู้ขาย
    sellerAddressMoo: '', // หมู่ที่ผู้ขาย
    sellerAddressTambon: '', // ตำบลผู้ขาย
    sellerAddressAmphoe: '', // อำเภอผู้ขาย
    sellerAddressProvince: '', // จังหวัดผู้ขาย

    date: '', // วันที่ใช้งาน
    time: '', // เวลาใช้งาน
    amount: '', // จำนวนที่ใช้
    location: '', // สถานที่
    sellerPhone: '', // เบอร์โทรผู้ขาย
    sellerLine: '', // LINE ผู้ขาย
    sellerFacebook: '', // Facebook ผู้ขาย
    sellerBankaccount: '', // เลขบัญชีผู้ขาย
    sellerBankaccountNumber: '', // เลขบัญชีผู้ขาย
    // ข้อมูลผู้ขาย
  },
  attachments: ref([]),
  images: ref([]),
  imagePreviews: ref([]),
  recordedBy: '', // ผู้บันทึก
  recordedByStation: '', // หน่วยงานที่บันทึก
  recordedByPhone: '', // เบอร์โทรผู้บันทึก
})

const createEmptySource = () => ({
  fullname: '',
  idcard: '',
  nickname: '',
  contact: {
    phone: '',
    line: '',
    facebook: '',
  },
  payment: {
    method: 'เงินสด',
    bank: '',
    accountNumber: '',
    accountName: '',
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

// ฟังก์ชันตรวจสอบเบอร์โทรศัพท์
const validatePhoneNumber = (phone) => {
  if (!phone) return true // ถ้าไม่ได้กรอกให้ผ่าน
  return /^0[1-9][0-9]{8}$/.test(phone.replace(/[- ]/g, '')) // เบอร์โทร 10 หลัก
}

const form = ref(null)
const valid = ref(false)
const loading = ref(false)

// ฟังก์ชันสำหรับรับข้อมูลจาก selectPerson
const handleSelectPerson = (data) => {
  console.log('Data received:', data)
  formData.first_name = data.personalInfo.first_name
  formData.last_name = data.personalInfo.last_name
  formData.id_card = data.personalInfo.idCard
  formData.age = data.personalInfo.age
  formData.sex = data.personalInfo.sex ? 'ชาย' : 'หญิง'
  formData.address.houseNo = data.personalInfo.address.houseNo
  formData.address.moo = data.personalInfo.address.moo
  formData.address.tambon = data.personalInfo.address.tambon
  formData.address.amphoe = data.personalInfo.address.amphoe
  formData.address.province = data.personalInfo.address.province

  // แจ้งเตือนดึงข้อมูล
  showNotification('ดึงข้อมูลเรียบร้อย', 'success')
}

// เพิ่ม computed properties สำหรับตรวจสอบความถูกต้องของข้อมูล
const isBasicInfoValid = computed(() => {
  return (
    formData.title &&
    formData.first_name &&
    formData.last_name &&
    formData.age &&
    formData.id_card?.length === 13 &&
    formData.address.houseNo &&
    formData.address.tambon &&
    formData.address.amphoe &&
    formData.address.province
  )
})

const isAllDataValid = computed(() => {
  if (!isBasicInfoValid.value) return false

  // ตรวจสอบเพิ่มเติมสำหรับกรณีพบเสพ
  if (formData.hasUsedDrugs === 'พบ') {
    return (
      formData.drugTypes.length > 0
      // formData.startUsage &&
      // formData.motivations.length > 0 &&
      // formData.usageAmount &&
      // formData.frequency
    )
  }

  return true
})

const transformDataForDB = (formData) => {
  return {
    title: formData.title,
    first_name: formData.first_name,
    last_name: formData.last_name,
    nickname: formData.nickname || '',
    id_card: formData.id_card,
    phone: formData.phone,
    sex: formData.sex,
    age: parseInt(formData.age),
    // แปลง Object เป็น JSON string
    address: JSON.stringify({
      houseNo: formData.address.houseNo,
      moo: formData.address.moo,
      tambon: formData.address.tambon,
      amphoe: formData.address.amphoe,
      province: formData.address.province,
    }),

    has_used_drugs: formData.hasUsedDrugs || 'ไม่พบ',
    drug_types: JSON.stringify(formData.drugTypes || []),
    start_usage: formData.startUsage || null,
    motivations: JSON.stringify(formData.motivations || []),
    usage_amount: formData.usageAmount ? parseInt(formData.usageAmount) : null,
    frequency: JSON.stringify(formData.frequency || {}),
    frequency_detail: formData.frequencyDetail || '',

    sources: JSON.stringify(formData.sources || []),
    last_usage: JSON.stringify({
      type: formData.lastUsage?.type || '',
      sellerName: formData.lastUsage?.sellerName || '',
      sellerLastName: formData.lastUsage?.sellerLastName || '',
      sellerNickname: formData.lastUsage?.sellerNickname || '',
      sellerAge: formData.lastUsage?.sellerAge || '',
      sellerIdcard: formData.lastUsage?.sellerIdcard || '',
      sellerAddressHouseNo: formData.lastUsage?.sellerAddressHouseNo || '',
      sellerAddressHouseName: formData.lastUsage?.sellerAddressHouseName || '',
      sellerAddressMoo: formData.lastUsage?.sellerAddressMoo || '',
      sellerAddressTambon: formData.lastUsage?.sellerAddressTambon || '',
      sellerAddressAmphoe: formData.lastUsage?.sellerAddressAmphoe || '',
      sellerAddressProvince: formData.lastUsage?.sellerAddressProvince || '',

      date: formData.lastUsage?.date || '',
      time: formData.lastUsage?.time || '',
      amount: formData.lastUsage?.amount || '',
      location: formData.lastUsage?.location || '',
      sellerPhone: formData.lastUsage?.sellerPhone || '',
      sellerLine: formData.lastUsage?.sellerLine || '',
      sellerFacebook: formData.lastUsage?.sellerFacebook || '',
      sellerBankaccount: formData.lastUsage?.sellerBankaccount || '',
      sellerBankaccountNumber: formData.lastUsage?.sellerBankaccountNumber || '',
    }),
    recordedBy: formData.recordedBy || '',
    recordedByStation: formData.recordedByStation || '',
    recordedByPhone: formData.recordedByPhone || '',
    attachments: JSON.stringify([]), // จะถูกเพิ่มทีหลังผ่าน FormData
    images: JSON.stringify([]), // จะถูกเพิ่มทีหลังผ่าน FormData
  }
}

const submitForm1 = async () => {
  try {
    loading.value = true

    // Add basic form data
    const uploadFormData = new FormData()
    const transformedData = transformDataForDB(formData)
    Object.keys(transformedData).forEach((key) => {
      console.log('Key:', key, 'Value:', transformedData[key])
      if (key !== 'attachments' && key !== 'images') {
        uploadFormData.append(key, transformedData[key])
      }
    })

    // Add files
    if (formData.attachments?.length) {
      console.log('Attachments:', formData.attachments)
      Array.from(formData.attachments).forEach((file, index) => {
        uploadFormData.append(`attachments`, file)
      })
    }

    if (formData.images?.length) {
      console.log('Images:', formData.images)
      Array.from(formData.images).forEach((file, index) => {
        uploadFormData.append(`images`, file)
      })
    }

    console.log('____________Submit data:', uploadFormData)
    // ส่งข้อมูลไป API
    const response = await axios.post(`${Urlbase}/api/drug-survey`, uploadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.success) {
      showNotification('บันทึกข้อมูลสำเร็จ', 'success')
      // รีเโหลดหน้าเพื่อเคลียร์ข้อมูล
      resetForm()
    }
  } catch (error) {
    console.error('Submit error:', error)
    let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    showNotification(errorMessage, 'error')
  } finally {
    loading.value = false
  }
}

const showFrequencyDetail = computed(() => {
  return ['monthly', 'weekly', 'daily'].includes(formData.frequency)
})

const frequencyDetailLabel = computed(() => {
  switch (formData.frequency) {
    case 'monthly':
      return 'จำนวนครั้งต่อเดือน'
    case 'weekly':
      return 'จำนวนครั้งต่อสัปดาห์'
    case 'daily':
      return 'จำนวนครั้งต่อวัน'
    default:
      return ''
  }
})

const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === 'object') {
      formData[key] = Array.isArray(formData[key]) ? [] : {}
    } else {
      formData[key] = ''
    }
  })
}

const frequencyDetailSuffix = computed(() => {
  switch (formData.frequency) {
    case 'monthly':
      return 'ครั้ง/เดือน'
    case 'weekly':
      return 'ครั้ง/สัปดาห์'
    case 'daily':
      return 'ครั้ง/วัน'
    default:
      return ''
  }
})

// Methods
const addSource = () => {
  if (formData.sources.length < 3) {
    formData.sources.push(createEmptySource())
  }
}

const removeSource = (index) => {
  formData.sources.splice(index, 1)
}

const validateForm = () => {
  // ตรวจสอบข้อมูลพื้นฐาน
  if (!formData.drugTypes.length) return false
  if (!formData.startUsage) return false
  if (!formData.motivations.length) return false
  if (!formData.usageAmount) return false
  if (!formData.frequency) return false

  // ตรวจสอบความถี่
  if (showFrequencyDetail.value && !formData.frequencyDetail) return false

  // ตรวจสอบแหล่งที่มา
  if (formData.sources.length === 0) return false

  // ตรวจสอบข้อมูลการเสพครั้งล่าสุด
  const { lastUsage } = formData
  if (!lastUsage.date || !lastUsage.time || !lastUsage.amount) return false

  return true
}

// ฟังก์ชันสร้างพรีวิวรูปภาพ
const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}

const submitForm = async () => {
  try {
    loading.value = true
    console.log('Starting form submission')

    const formDataToSend = new FormData()

    console.log('Form data:', formData)
    // เตรียมข้อมูลพื้นฐาน
    const transformedData = transformDataForDB(formData)
    Object.entries(transformedData).forEach(([key, value]) => {
      if (key !== 'attachments' && key !== 'images') {
        formDataToSend.append(key, typeof value === 'object' ? JSON.stringify(value) : value)
      }
    })
    // ตรวจสอบและเพิ่มไฟล์เอกสาร
    if (formData.attachments && formData.attachments.length > 0) {
      console.log('Adding attachments:', formData.attachments)
      for (const file of formData.attachments) {
        if (file instanceof File) {
          formDataToSend.append('attachments', file, file.name)
          console.log('Added attachment:', file.name)
        }
      }
    }

    // ตรวจสอบและเพิ่มรูปภาพ
    if (formData.images && formData.images.length > 0) {
      console.log('Adding images:', formData.images)
      for (const file of formData.images) {
        if (file instanceof File) {
          formDataToSend.append('images', file, file.name)
          console.log('Added image:', file.name)
        }
      }
    }

    // Log FormData contents
    console.log('FormData contents:')
    for (const [key, value] of formDataToSend.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes)`)
      } else {
        console.log(`${key}:`, value)
      }
    }

    const response = await axios.post(`${Urlbase}/api/drug-survey`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })

    // ตรวจสอบผลลัพธ์
    if (response.data.success || response.status === 201) {
      showNotification('บันทึกข้อมูลสำเร็จ', 'success')
      resetForm()
    } else {
      throw new Error(response.data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  } catch (error) {
    console.error('Submit error:', error)
    let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    showNotification(errorMessage, 'error')
  } finally {
    loading.value = false
  }
}

// ปรับฟังก์ชัน handleFileUpload
const handleFileUpload = async (files, type) => {
  try {
    // ตรวจสอบว่ามีไฟล์หรือไม่
    if (!files) return

    // แปลงเป็น Array
    let fileArray = []
    if (files instanceof FileList) {
      fileArray = Array.from(files)
    } else if (files instanceof File) {
      fileArray = [files]
    } else if (Array.isArray(files)) {
      fileArray = files
    }

    if (fileArray.length === 0) return

    // ตรวจสอบไฟล์แต่ละไฟล์
    const MAX_FILE_SIZE = 5 * 1024 * 1024
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif']
    const ALLOWED_DOC_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    for (const file of fileArray) {
      // ตรวจสอบขนาดไฟล์
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (ไม่เกิน 5MB)`)
      }

      // ตรวจสอบประเภทไฟล์
      if (type === 'image' && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error(`ไฟล์ ${file.name} ต้องเป็นรูปภาพเท่านั้น (JPEG, PNG, GIF)`)
      }
      if (type === 'document' && !ALLOWED_DOC_TYPES.includes(file.type)) {
        throw new Error(`ไฟล์ ${file.name} ต้องเป็น PDF หรือ Word เท่านั้น`)
      }
    }

    // อัพเดทข้อมูลไฟล์
    if (type === 'image') {
      // สร้างพรีวิวสำหรับรูปภาพ
      const previews = await Promise.all(fileArray.map((file) => createImagePreview(file)))
      formData.imagePreviews = previews
      formData.images = fileArray
    } else {
      formData.attachments = fileArray
    }

    showNotification('อัพโหลดไฟล์สำเร็จ', 'success')
  } catch (error) {
    console.error('File upload error:', error)
    showNotification(error.message, 'error')

    // ล้างข้อมูลเมื่อเกิดข้อผิดพลาด
    if (type === 'image') {
      formData.images = []
      formData.imagePreviews = []
    } else {
      formData.attachments = []
    }
  }
}
</script>

<style scoped>
body {
  font-family: 'Sarabun', sans-serif;
}
.text-h6,
.text-h5,
.text-h4,
.text-h3,
.text-h2,
.text-h1 {
  font-family: 'Sarabun', sans-serif;
  font-size: 1.5rem;
}

.text-h7 {
  font-size: 14px;
  margin-bottom: 8px;
}

.text-subtitle-1 {
  font-size: 1rem;
}
.v-text-field.v-text-field--enclosed {
  margin: 0;
  padding: 0;
}

.v-label {
  font-size: 0.875rem;
}

.v-input--selection-controls {
  margin: 0;
  padding: 0;
}

/* เพิ่ม styles สำหรับ PDF preview */
#pdfTemplate {
  font-size: 16px;
  line-height: 1.5;
  color: #000;
}

#pdfTemplate h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

#pdfTemplate h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

#pdfTemplate p {
  margin-bottom: 8px;
}

#pdfTemplate ul {
  margin-top: 0;
  margin-bottom: 16px;
}

.pdf-content {
  background-color: white;
  min-height: 800px;
}

.section-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}

.section-header {
  border-bottom: 2px solid var(--v-primary-base);
  margin-bottom: 16px;
}

.info-text {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.87);
}

.signature-line {
  width: 200px;
  border-bottom: 1px solid #000;
  margin: 0 auto;
}

.signature-block {
  min-width: 250px;
}

@media print {
  .pdf-content {
    padding: 20mm !important;
    font-family: 'Sarabun', sans-serif;
  }

  .section-container {
    break-inside: avoid;
  }
}

/* เพิ่ม style สำหรับลายเซ็น */
.signature-line {
  border-bottom: 1px solid #000;
  width: 200px;
  margin: 0 auto;
  margin-bottom: 8px;
}

/* Styles for PDF content */
.pdf-content {
  background-color: white;
  font-size: 16px;
  line-height: 1.5;
  color: #000;
}

.signature-line {
  border-bottom: 1px solid #000;
  width: 200px;
  margin: 0 auto;
  margin-bottom: 8px;
}

.form-container {
  max-width: 1200px;
  margin: 0 auto;
}

.drug-form-card {
  border-radius: 16px;
  overflow: hidden;
}

.section-container {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e9ecef;
}

.v-chip {
  margin: 4px;
}

/* Animations */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
/* เพิ่ม styles ใหม่ */
.v-radio-group {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.v-radio {
  margin-right: 32px !important;
}

.section-container {
  position: relative;
  transition: all 0.3s ease;
}

.section-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-btn {
  text-transform: none;
  letter-spacing: 0.5px;
}

.section-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e9ecef;
}

.motivation-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.v-chip {
  margin: 4px !important;
}

.v-expansion-panels {
  border-radius: 8px;
}

.v-expansion-panel {
  margin-bottom: 8px;
}

.v-expansion-panel-header {
  padding: 16px;
}

.v-expansion-panel-content {
  padding: 16px;
}

.drug-type-selector {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}

.drug-chip {
  margin: 4px !important;
  font-weight: 500 !important;
  transition: all 0.3s ease;
}

.drug-chip.selected-chip {
  transform: scale(1.05);
}

.drug-chip:hover {
  opacity: 0.8;
}

.selected-drugs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.error-message {
  display: flex;
  align-items: center;
}

.v-chip {
  margin: 4px !important;
}

.v-chip.selected-chip {
  background-color: var(--v-error-base) !important;
  color: white !important;
}

.v-chip.close:hover {
  background-color: var(--v-error-lighten1) !important;
}

.drug-select ::v-deep .v-select__selections {
  min-height: 32px;
}

.drug-select ::v-deep .v-chip {
  margin: 2px;
}
.mb-2 {
  margin-bottom: 8px !important;
}
</style>
