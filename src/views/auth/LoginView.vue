<!-- src/views/auth/LoginView.vue -->
<template>
  <v-container fluid class="auth-container fill-height pa-0">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12">
        <div class="login-container">
          <v-card class="login-card">
            <v-card-text class="pa-6">
              <div class="d-flex align-center mb-4">
                <v-icon color="info" class="mr-2">mdi-information</v-icon>
                <span class="text-h5">เข้าสู่ระบบ</span>
              </div>
              <v-form ref="form" v-model="valid" @submit.prevent="handleLogin" :disabled="loading">
                <!-- Error Alert -->
                <v-expand-transition>
                  <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable>
                    <template v-slot:prepend>
                      <v-icon size="24">mdi-alert-circle</v-icon>
                    </template>
                    {{ error }}
                  </v-alert>
                </v-expand-transition>

                <!-- Username Field -->
                <v-text-field
                  v-model="username"
                  label="ชื่อผู้ใช้"
                  prepend-inner-icon="mdi-account"
                  :rules="[(v) => !!v || 'กรุณากรอกชื่อผู้ใช้']"
                  required
                  variant="outlined"
                  class="mb-4 login-input"
                  autocomplete="username"
                  :error-messages="usernameError"
                  @focus="clearErrors"
                />

                <!-- Password Field -->
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label="รหัสผ่าน"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="showPassword = !showPassword"
                  :rules="[(v) => !!v || 'กรุณากรอกรหัสผ่าน']"
                  required
                  variant="outlined"
                  class="mb-4 login-input"
                  autocomplete="current-password"
                  :error-messages="passwordError"
                  @focus="clearErrors"
                />

                <!-- Remember Me -->
                <div class="d-flex align-center justify-space-between mb-6">
                  <v-checkbox
                    v-model="rememberMe"
                    label="จดจำการเข้าสู่ระบบ"
                    color="primary"
                    hide-details
                  />
                </div>

                <!-- Login Button -->
                <v-btn
                  color="primary"
                  :loading="loading"
                  :disabled="!valid || loading"
                  @click="handleLogin"
                  block
                  height="48"
                  class="login-btn"
                >
                  <v-icon left>mdi-login</v-icon>
                  เข้าสู่ระบบ
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Test Accounts Card -->
          <v-card class="mt-6 info-card">
            <v-card-text>
              <div class="d-flex align-center mb-4">
                <v-icon color="info" class="mr-2">mdi-information</v-icon>
                <span class="text-h6">ข้อมูลทดลองใช้งาน</span>
              </div>
              <v-divider class="mb-4"></v-divider>
              <div class="account-info">
                <div class="account-type mb-4">
                  <div class="text-subtitle-1 font-weight-bold mb-2">
                    <v-icon small color="success" class="mr-1">mdi-account</v-icon>
                    ผู้ใช้ทั่วไป
                  </div>
                  <div class="account-details">
                    <code>Username: npd</code>
                    <code>Password: 1632</code>
                  </div>
                </div>
                <div class="account-type">
                  <div class="text-subtitle-1 font-weight-bold mb-2">
                    <v-icon small color="error" class="mr-1">mdi-shield-account</v-icon>
                    ผู้ดูแลระบบ
                  </div>
                  <div class="account-details">
                    <code>Username: admin</code>
                    <code>Password: adminnpd</code>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Contact Info -->
          <v-card class="mt-4 info-card">
            <v-card-text class="text-center">
              <div class="text-subtitle-1 font-weight-bold mb-2">
                <v-icon color="primary" class="mr-1">mdi-headphones</v-icon>
                ติดต่อสอบถาม
              </div>
              <div class="text-body-1">
                <div>โทร: 042-xxx-xxx</div>
                <div>Email: admin@example.com</div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form Data
const form = ref(null)
const valid = ref(false)
const loading = ref(false)
const error = ref('')
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const usernameError = ref('')
const passwordError = ref('')

// Features List
const features = [
  { icon: 'mdi-database-lock', text: 'ระบบจัดการข้อมูลที่ปลอดภัย' },
  { icon: 'mdi-chart-box', text: 'รายงานสถิติแบบเรียลไทม์' },
  { icon: 'mdi-account-group', text: 'จัดการข้อมูลผู้เกี่ยวข้อง' },
]

// Methods
const clearErrors = () => {
  error.value = ''
  usernameError.value = ''
  passwordError.value = ''
}

const handleLogin = async () => {
  if (!valid.value) return

  loading.value = true
  clearErrors()

  console.log('Attempting login with:', username.value, password.value) // ตรวจสอบข้อมูลที่ส่ง

  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    })
    console.log('Login successful') // แสดงข้อความเมื่อสำเร็จ

    router.push('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
/* ใช้ font Sarabun */
@import url('https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

/* ส่วนที่เป็น CSS ของ LoginView */
.text-h3 .text-h4,
.text-h5,
.text-h6,
.text-subtitle-1,
.text-body-1 {
  font-family: 'Sarabun', sans-serif; /* ใช้ Sarabun เป็น font-family หลัก */
}
.auth-container {
  position: relative;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
}

.left-section {
  position: relative;
  z-index: 1;
  padding: 3rem;
}

.left-content {
  max-width: 500px;
  margin: 0 auto;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.right-section {
  padding: 2rem;
}

.login-container {
  max-width: 480px;
  margin: 0 auto;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

.login-input {
  border-radius: 8px;
}

.login-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.info-card {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.account-details {
  display: flex;
  gap: 1rem;
  margin-left: 1.5rem;
}

code {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  animation: fadeIn 0.6s ease-out;
}

.info-card {
  animation: fadeIn 0.6s ease-out 0.2s both;
}

/* Responsive */
@media (max-width: 960px) {
  .auth-background {
    width: 100%;
    clip-path: polygon(0 0, 100% 0, 100% 25%, 0 25%);
    height: 25%;
  }

  .login-container {
    padding-top: 1rem;
  }
}
</style>
