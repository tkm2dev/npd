// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
// import vuetify from 'vite-plugin-vuetify' // ถ้ายังมีปัญหาให้ comment บรรทัดนี้ไว้ก่อน

export default defineConfig({
  plugins: [
    vue(),
    // vuetify({ autoImport: true }), // ถ้ายังมีปัญหาให้ comment บรรทัดนี้ไว้ก่อน
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
  },
  define: {
    'process.env': process.env,
  },
})
