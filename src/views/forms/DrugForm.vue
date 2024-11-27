<template>
  <v-container class="form-container">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- ค้นหา -->
        <SearchPerson @select="handleSelectPerson" />
        <!-- Snackbar แจ้งเตือน -->
        <v-snackbar v-model="showAlert" :color="alertColor" :timeout="3000">
          {{ alertMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="showAlert = false"> ปิด </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-card class="drug-form-card">
      <v-card-text class="pa-6">
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
                  :rules="[(v) => !!v || 'กรุณาเลือกคำนำหน้า']"
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
                  :rules="[(v) => !!v || 'กรุณากรอกชื่อเล่น']"
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
              <v-col cols="12" md="4">
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
              <v-col cols="12" md="2">
                <v-select
                  v-model="formData.sex"
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
              <span class="text-h6">2. ประวัติการเสพยา</span>
            </div>

            <v-radio-group
              v-model="formData.hasUsedDrugs"
              row
              class="mt-4"
              :rules="[(v) => v !== null || 'กรุณาเลือกข้อมูล']"
            >
              <v-radio label="เคย" value="เคย" color="error"></v-radio>
              <v-radio label="ไม่เคย" value="ไม่เคย" color="success"></v-radio>
            </v-radio-group>
            <!-- แสดงปุ่มบันทึกทันทีถ้าเลือก "ไม่เคย" -->
            <v-expand-transition>
              <div v-if="formData.hasUsedDrugs === 'ไม่เคย'" class="mt-4">
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

          <!-- ส่วนที่ 3: รายละเอียดการเสพ (แสดงเมื่อเลือก "เคย") -->

          <v-expand-transition>
            <template v-if="formData.hasUsedDrugs === 'เคย'">
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
                    <span class="text-h6">3.3 ปริมาณและความถี่</span>
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
                    <span class="text-h6">3.4 แหล่งที่มา</span>
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
                              <v-chip v-if="source.name" class="ml-4" small outlined>
                                {{ source.name }}
                              </v-chip>
                            </div>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-row>
                              <!-- ชื่อผู้ขาย -->
                              <v-col cols="12" md="6">
                                <v-text-field
                                  v-model="source.name"
                                  label="ชื่อผู้ขาย"
                                  outlined
                                  dense
                                ></v-text-field>
                              </v-col>

                              <!-- ชื่อเล่น -->
                              <v-col cols="12" md="6">
                                <v-text-field
                                  v-model="source.nickname"
                                  label="ชื่อเล่น"
                                  outlined
                                  dense
                                ></v-text-field>
                              </v-col>

                              <!-- ช่องทางการติดต่อ -->
                              <v-col cols="12">
                                <v-card outlined class="pa-4">
                                  <div class="text-subtitle-1 mb-4">ช่องทางการติดต่อ</div>
                                  <v-row>
                                    <v-col cols="12" md="4">
                                      <v-text-field
                                        v-model="source.contact.phonefrom"
                                        label="เบอร์โทรศัพท์ผู้เสพ"
                                        outlined
                                        dense
                                        prepend-inner-icon="mdi-phone"
                                      ></v-text-field>
                                      <v-text-field
                                        v-model="source.contact.phoneto"
                                        label="เบอร์โทรศัพท์ผู้ขาย"
                                        outlined
                                        dense
                                        prepend-inner-icon="mdi-phone"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                      <v-text-field
                                        v-model="source.contact.linefrom"
                                        label="LINE ผู้เสพ"
                                        outlined
                                        dense
                                        prepend-inner-icon="mdi-message"
                                      ></v-text-field>
                                      <v-text-field
                                        v-model="source.contact.lineto"
                                        label="LINE ผู้ขาย"
                                        outlined
                                        dense
                                        prepend-inner-icon="mdi-message"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                      <v-text-field
                                        v-model="source.contact.facebookfrom"
                                        label="Facebook ผู้เสพ"
                                        outlined
                                        dense
                                        prepend-inner-icon="mdi-facebook"
                                      ></v-text-field>

                                      <v-text-field
                                        v-model="source.contact.facebookto"
                                        label="Facebook ผู้ขาย"
                                        outlined
                                        dense
                                        prepend-inner-icon="mdi-facebook"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                </v-card>
                              </v-col>

                              <!-- วิธีการชำระเงิน -->
                              <v-col cols="12">
                                <v-card outlined class="pa-4">
                                  <div class="text-subtitle-1 mb-4">วิธีการชำระเงิน</div>
                                  <v-radio-group v-model="source.payment.method" row>
                                    <v-radio label="เงินสด" value="cash"></v-radio>
                                    <v-radio label="โอนเงิน" value="transfer"></v-radio>
                                  </v-radio-group>

                                  <v-expand-transition>
                                    <div v-if="source.payment.method === 'transfer'">
                                      <v-row>
                                        <v-col cols="12" md="6">
                                          <v-select
                                            v-model="source.payment.bankfrom"
                                            :items="bankOptions"
                                            label="ธนาคารผู้โอน"
                                            outlined
                                            dense
                                          ></v-select>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                          <v-text-field
                                            v-model="source.payment.accountNumberfrom"
                                            label="เลขที่บัญชีผู้โอน"
                                            outlined
                                            dense
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="12" md="6">
                                          <v-select
                                            v-model="source.payment.bankto"
                                            :items="bankOptions"
                                            label="ธนาคารผู้รับโอน"
                                            outlined
                                            dense
                                          ></v-select>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                          <v-text-field
                                            v-model="source.payment.accountNumberto"
                                            label="เลขที่บัญชีผู้รับโอน"
                                            outlined
                                            dense
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                    </div>
                                  </v-expand-transition>
                                </v-card>
                              </v-col>
                            </v-row>

                            <v-btn
                              color="error"
                              text
                              block
                              @click="removeSource(index)"
                              class="mt-4"
                            >
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
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.lastUsage.type"
                        :items="drugTypeOptions"
                        label="ประเภทของยา*"
                        outlined
                        dense
                        :rules="[(v) => !!v || 'กรุณาเลือกประเภทของยา']"
                      ></v-select>
                    </v-col>

                    <!-- รับซื้อมาจากใคร -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.lastUsage.sellerName"
                        label="รับซื้อมาจากใคร*"
                        outlined
                        dense
                        :rules="[(v) => !!v || 'กรุณาระบุชื่อผู้ขาย']"
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
                        :rules="[(v) => !!v || 'กรุณาระบุจำนวน']"
                      ></v-text-field>
                    </v-col>

                    <!-- สถานที่ -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.lastUsage.location"
                        label="สถานที่ซื้อและส่งมอบยาเสพติดล่าสุด*"
                        outlined
                        dense
                        :rules="[(v) => !!v || 'กรุณาระบุสถานที่']"
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
                        :rules="[
                          (v) => !!v || 'กรุณาระบุเบอร์โทรผู้ขาย',
                          (v) => validatePhoneNumber(v) || 'เบอร์โทรไม่ถูกต้อง',
                        ]"
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

                    <!-- ธนาคาร -->
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="formData.lastUsage.sellerBankaccount"
                        :items="bankOptions"
                        label="ธนาคารผู้ขาย"
                        outlined
                        dense
                      ></v-select>
                    </v-col>
                    <!--  เลขบัญชี   -->
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="formData.lastUsage.sellerBankaccount"
                        label="เลขบัญชีผู้ขาย"
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
                    <span class="text-h6">4. แนบไฟล์และรูปภาพ</span>
                  </div>

                  <v-row>
                    <!-- อัปโหลดไฟล์ -->
                    <v-col cols="12" md="6">
                      <v-file-input
                        v-model="formData.uploadedFile"
                        label="แนบเอกสาร (PDF, Word)"
                        outlined
                        dense
                        accept=".pdf,.doc,.docx"
                        show-size
                        truncate-length="20"
                        :rules="[(v) => !!v || 'กรุณาแนบไฟล์เอกสาร']"
                      ></v-file-input>
                    </v-col>

                    <!-- อัปโหลดรูปภาพ -->
                    <v-col cols="12" md="6">
                      <v-file-input
                        v-model="formData.uploadedImage"
                        label="แนบรูปภาพ"
                        outlined
                        dense
                        accept="image/*"
                        show-size
                        truncate-length="20"
                        @change="previewImage"
                        :rules="[(v) => !!v || 'กรุณาแนบรูปภาพ']"
                      ></v-file-input>
                    </v-col>
                  </v-row>

                  <!-- แสดงตัวอย่างรูปภาพ -->
                  <v-row v-if="previewedImage">
                    <v-col cols="12">
                      <v-card outlined class="pa-4">
                        <div class="text-subtitle-1 mb-4">ตัวอย่างรูปภาพที่อัปโหลด:</div>
                        <v-img :src="previewedImage" aspect-ratio="16/9" max-height="200px"></v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

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
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch, nextTick, reactive, computed } from 'vue'

import axios from 'axios'
import SearchPerson from '@/components/search/SearchPerson.vue'

import { useFormOptions } from '@/composables/useFormOptions'

const urlBase = process.env.NODE_ENV === 'production' ? 'https://npd.mazcat.net' : ''

const isSaving = ref(false)

const showAlert = ref(false)
const alertMessage = ref('')
const alertColor = ref('success')

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
  sources: [],
  lastUsage: {
    type: '', // ประเภทยา
    sellerName: '', // ชื่อผู้ขาย
    date: '', // วันที่ใช้งาน
    time: '', // เวลาใช้งาน
    amount: '', // จำนวนที่ใช้
    location: '', // สถานที่
    sellerPhone: '', // เบอร์โทรผู้ขาย
    sellerLine: '', // LINE ผู้ขาย
    sellerFacebook: '', // Facebook ผู้ขาย
    sellerBankaccount: '', // เลขบัญชีผู้ขาย
  },
  attachments: [], // เก็บไฟล์เอกสาร
  images: [], // เก็บไฟล์รูปภาพ
  imagePreviews: [], // เก็บ URL สำหรับแสดงตัวอย่างรูปภาพ
})

const createEmptySource = () => ({
  name: '',
  nickname: '',
  contact: {
    phone: '',
    line: '',
    facebook: '',
  },
  payment: {
    method: 'cash',
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

//ไฟล์และรูปภาพ
const handleImageUpload = (files) => {
  formData.imagePreviews = []
  files.slice(0, 3).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.imagePreviews.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  formData.images.splice(index, 1)
  formData.imagePreviews.splice(index, 1)
}

const validateSource = (source) => {
  // ตรวจสอบข้อมูลที่จำเป็น
  if (!source.name) return false
  if (source.payment.method === 'transfer') {
    if (!source.payment.bank || !source.payment.accountNumber) return false
  }
  return true
}

// ฟังก์ชันตรวจสอบความถูกต้องของข้อมูลผู้ขาย
const validateDealerData = () => {
  let isValid = true
  const errors = []

  // ตรวจสอบว่ามีผู้ขายอย่างน้อย 1 คน
  if (!formData.value.ผู้ขาย?.length) {
    errors.push('กรุณาเพิ่มข้อมูลผู้ขายอย่างน้อย 1 คน')
    isValid = false
    showNotification('กรุณาเพิ่มข้อมูลผู้ขายอย่างน้อย 1 คน', 'error')
    return false
  }

  formData.value.ผู้ขาย.forEach((dealer, index) => {
    // ตรวจสอบข้อมูลบังคับกรอก
    if (!dealer.ชื่อ?.trim()) {
      errors.push(`กรุณากรอกชื่อผู้ขายคนที่ ${index + 1}`)
      isValid = false
    }

    // ตรวจสอบเลขบัตรประชาชน (ถ้ามี)
    if (dealer.เลขบัตรประชาชน && !validateThaiID(dealer.เลขบัตรประชาชน)) {
      errors.push(`เลขบัตรประชาชนผู้ขายคนที่ ${index + 1} ไม่ถูกต้อง`)
      isValid = false
    }

    // ตรวจสอบข้อมูลการชำระเงิน
    if (dealer.การชำระเงิน.วิธีชำระ !== 'เงินสด') {
      if (!dealer.การชำระเงิน.ธนาคาร) {
        errors.push(`กรุณาเลือกธนาคารของผู้ขายคนที่ ${index + 1}`)
        isValid = false
      }
      if (!dealer.การชำระเงิน.เลขบัญชี) {
        errors.push(`กรุณากรอกเลขบัญชีของผู้ขายคนที่ ${index + 1}`)
        isValid = false
      }
    }

    // ตรวจสอบเบอร์โทร (ถ้ามี)
    if (dealer.ช่องทางติดต่อ.เบอร์โทร && !validatePhoneNumber(dealer.ช่องทางติดต่อ.เบอร์โทร)) {
      errors.push(`เบอร์โทรศัพท์ของผู้ขายคนที่ ${index + 1} ไม่ถูกต้อง`)
      isValid = false
    }
  })

  // แสดงข้อความ error ทั้งหมด
  if (!isValid) {
    errors.forEach((error) => showNotification(error, 'error'))
  }

  return isValid
}

// ฟังก์ชันตรวจสอบเลขบัตรประชาชน
const validateThaiID = (id) => {
  if (!id) return true // ถ้าไม่ได้กรอกให้ผ่าน
  if (id.length !== 13) return false

  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i)) * (13 - i)
  }
  let check = (11 - (sum % 11)) % 10
  return check === parseInt(id.charAt(12))
}

// ฟังก์ชันตรวจสอบเบอร์โทรศัพท์
const validatePhoneNumber = (phone) => {
  if (!phone) return true // ถ้าไม่ได้กรอกให้ผ่าน
  return /^0[1-9][0-9]{8}$/.test(phone.replace(/[- ]/g, '')) // เบอร์โทร 10 หลัก
}

const form = ref(null)
const valid = ref(false)
const loading = ref(false)

// Form state
const menus = reactive({
  startDate: false,
  lastUsageDate: false,
  lastUsageTime: false,
})

// ฟังก์ชันสำหรับรับข้อมูลจาก selectPerson
const handleSelectPerson = (data) => {
  console.log('Data received:', data)
  formData.first_name = data.personalInfo.first_name
  formData.last_name = data.personalInfo.last_name
  formData.id_card = data.personalInfo.id_card
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

  // ตรวจสอบเพิ่มเติมสำหรับกรณีเคยเสพ
  if (formData.hasUsedDrugs === 'เคย') {
    return (
      formData.drugTypes.length > 0 &&
      formData.startUsage &&
      formData.motivations.length > 0 &&
      formData.usageAmount &&
      formData.frequency
    )
  }

  return true
})

const prepareFormDataForSubmission = (formData) => {
  const uploadFormData = new FormData()

  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
      // กรณีที่เป็น Object เช่น address, lastUsage
      uploadFormData.append(key, JSON.stringify(formData[key]))
    } else if (Array.isArray(formData[key])) {
      // กรณีที่เป็น Array เช่น drugTypes, attachments
      formData[key].forEach((item, index) => {
        if (key === 'attachments' || key === 'images') {
          uploadFormData.append(`${key}[${index}]`, item) // แนบไฟล์โดยตรง
        } else {
          uploadFormData.append(`${key}[${index}]`, JSON.stringify(item)) // Array อื่น ๆ
        }
      })
    } else {
      // กรณีเป็น Field ปกติ
      uploadFormData.append(key, formData[key])
    }
  })

  return uploadFormData
}

const transformDataForDB = (formData) => {
  return {
    title: formData.title,
    first_name: formData.first_name,
    last_name: formData.last_name,
    nickname: formData.nickname || '',
    id_card: formData.id_card,
    age: parseInt(formData.age),
    sex: formData.sex,
    // แปลง Object เป็น JSON string
    address: JSON.stringify({
      houseNo: formData.address.houseNo,
      moo: formData.address.moo,
      tambon: formData.address.tambon,
      amphoe: formData.address.amphoe,
      province: formData.address.province,
    }),
    has_used_drugs: formData.hasUsedDrugs,
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
      date: formData.lastUsage?.date || '',
      time: formData.lastUsage?.time || '',
      amount: formData.lastUsage?.amount || '',
      location: formData.lastUsage?.location || '',
      sellerPhone: formData.lastUsage?.sellerPhone || '',
      sellerLine: formData.lastUsage?.sellerLine || '',
      sellerFacebook: formData.lastUsage?.sellerFacebook || '',
      sellerBankaccount: formData.lastUsage?.sellerBankaccount || '',
    }),
    attachments: JSON.stringify([]), // จะถูกเพิ่มทีหลังผ่าน FormData
    images: JSON.stringify([]), // จะถูกเพิ่มทีหลังผ่าน FormData
  }
}

const submitForm = async () => {
  try {
    loading.value = true

    // แปลงข้อมูลให้ตรงกับ DB
    const transformedData = transformDataForDB(formData)

    // สร้าง FormData สำหรับส่งไฟล์
    const uploadFormData = new FormData()

    // เพิ่มข้อมูลทั่วไป
    Object.keys(transformedData).forEach((key) => {
      uploadFormData.append(key, transformedData[key])
    })

    // เพิ่มไฟล์แนบ (ถ้ามี)
    if (formData.attachments?.length) {
      formData.attachments.forEach((file) => {
        uploadFormData.append('attachments', file)
      })
    }

    // เพิ่มรูปภาพ (ถ้ามี)
    if (formData.images?.length) {
      formData.images.forEach((image) => {
        uploadFormData.append('images', image)
      })
    }

    // ส่งข้อมูลไป API
    const response = await axios.post(`${urlBase}/api/drug-survey`, uploadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.success) {
      showNotification('บันทึกข้อมูลสำเร็จ', 'success')
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

// ปรับปรุงฟังก์ชัน submitForm
const submitForm1 = async () => {
  // if (!isBasicInfoValid.value) {
  //   showNotification('กรุณากรอกข้อมูลพื้นฐานให้ครบถ้วน', 'error')
  //   return
  // }

  if (formData.attachments.length > 3) {
    showNotification('อัปโหลดไฟล์ได้ไม่เกิน 3 ไฟล์', 'error')
    return
  }

  if (formData.images.length > 3) {
    showNotification('อัปโหลดรูปภาพได้ไม่เกิน 3 รูป', 'error')
    return
  }

  if (formData.hasUsedDrugs === 'เคย' && !isAllDataValid.value) {
    // แสดง error message
    showNotification('กรุณากรอกข้อมูลการเสพให้ครบถ้วน')
    return
  }

  loading.value = true
  try {
    // Prepare data
    const submitData = {
      ...formData,
      // ถ้าไม่เคยเสพ ให้เซ็ตค่าเป็น null หรือ []
      drugTypes: formData.hasUsedDrugs === 'เคย' ? formData.drugTypes : [],
      startUsage: formData.hasUsedDrugs === 'เคย' ? formData.startUsage : null,
      motivations: formData.hasUsedDrugs === 'เคย' ? formData.motivations : [],
      usageAmount: formData.hasUsedDrugs === 'เคย' ? formData.usageAmount : null,
      frequency: formData.hasUsedDrugs === 'เคย' ? formData.frequency : null,
      sources: formData.hasUsedDrugs === 'เคย' ? formData.sources : [],
      lastUsage: formData.hasUsedDrugs === 'เคย' ? formData.lastUsage : null,
    }

    // Call API
    console.log('Submitting:', submitData)

    // ส่งข้อมูลไปยัง API
    const response = await axios.post(urlBase + '/api/drug-survey', submitData)

    // ตรวจสอบการบันทึกสำเร็จ
    if (response.data.success) {
      showNotification('บันทึกข้อมูลสำเร็จ', 'success')

      // บันทึกประวัติการทำรายการ
      try {
        await axios.post(urlBase + '/api/transaction-log', {
          action: 'บันทึกข้อมูล',
          data: {
            เลขบัตรประชาชน: formData.value.เลขบัตรประชาชน,
            ชื่อ: formData.value.ชื่อ,
            นามสกุล: formData.value.นามสกุล,
            จำนวนผู้ขาย: formData.value.ผู้ขาย.length,
          },
          timestamp: new Date().toISOString(),
        })
      } catch (logError) {
        console.error('Log error:', logError)
        // ไม่ต้อง throw error เพราะไม่ใช่การทำงานหลัก
      }
    } else {
      throw new Error(response.data.message || 'บันทึกข้อมูลไม่สำเร็จ')
    }

    // Show success message
    showNotification('บันทึกข้อมูลสำเร็จ', 'success')

    // Reset form if needed
    // if (autoReset.value) {
    //   resetForm()
    // }
  } catch (error) {
    showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล' + error, 'error')
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

const formatThaiDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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
