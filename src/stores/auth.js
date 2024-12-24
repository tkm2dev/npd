import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Mock users data
  const users = {
    npd: {
      username: 'npd',
      password: '2339',
      role: 'user',
      name: 'ผู้ใช้ทั่วไป',
    },
    adminnpd: {
      username: 'admin',
      password: 'adminnpd',
      role: 'admin',
      name: 'ผู้ดูแลระบบ',
    },
  }

  // Actions
  const login = async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = Object.values(users).find(
          (user) => user.username.toLowerCase() === credentials.username.toLowerCase(),
        )
        if (!foundUser) {
          reject(new Error('ชื่อผู้ใช้ไม่ถูกต้อง')) // ข้อผิดพลาดหากไม่พบผู้ใช้
          return
        }

        if (foundUser.password === credentials.password) {
          console.log('Login successful for:', foundUser.username) // Debug: ล็อกอินสำเร็จ
          const mockToken = btoa(
            JSON.stringify({
              username: foundUser.username,
              role: foundUser.role,
              timestamp: Date.now(),
            }),
          )

          // อัปเดตสถานะ
          user.value = {
            username: foundUser.username,
            role: foundUser.role,
            name: foundUser.name,
          }
          token.value = mockToken

          // บันทึกลง localStorage
          localStorage.setItem('token', mockToken)
          localStorage.setItem('user', JSON.stringify(user.value))

          resolve(user.value)
        } else {
          reject(new Error('รหัสผ่านไม่ถูกต้อง')) // ข้อผิดพลาดหากรหัสผ่านไม่ตรงกัน
        }
      }, 500)
    })
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    try {
      if (savedToken && savedUser) {
        const decodedToken = JSON.parse(atob(savedToken))
        const now = Date.now()

        // ตรวจสอบว่าโทเค็นหมดอายุหรือไม่
        if (decodedToken.timestamp + 3600 * 1000 > now) {
          token.value = savedToken
          user.value = JSON.parse(savedUser)
          return true
        } else {
          console.warn('Token expired. Logging out...')
          logout()
        }
      }
    } catch (error) {
      console.error('Error parsing auth data:', error)
      logout()
    }
    return false
  }

  // Initialize state from localStorage
  const initialize = () => {
    checkAuth()
  }

  // Run initialization
  initialize()

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuth,
  }
})
