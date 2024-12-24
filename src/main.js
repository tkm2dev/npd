// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'leaflet/dist/leaflet.css'

import 'vuetify/styles'

import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia) // ต้องเพิ่ม pinia ก่อนใช้ store
app.use(router)
app.use(vuetify)
app.use(VueApexCharts)

app.mount('#app')
