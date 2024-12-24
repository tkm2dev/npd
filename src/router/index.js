import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const routes = [
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true }, // ต้องล็อกอินก่อน
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: { requiresAuth: true },
        component: () => import('@/views/forms/DrugMap.vue'),
      },
      {
        path: '/person-map',
        name: 'PersonMap',
        meta: {
          requiresAuth: true,
          title: 'แผนที่แสดงตำแหน่งบุคคล',
        },
        component: () => import('@/views/forms/PersonMap.vue'),
      },
      {
        path: '/form-drug',
        name: 'แบบฟอร์มบันทึกข้อมูลเกี่ยวกข้องกับยาเสพติด',
        meta: { requiresAuth: true },

        component: () => import('@/views/forms/DrugForm.vue'),
        // icon ใหม่
      },
      {
        path: '/list-drug',
        name: 'รายการบุคคลเกี่ยวข้องยาเสพติด',
        meta: { requiresAuth: true },

        component: () => import('@/views/forms/DrugSearchList.vue'),
      },

      {
        path: '/main-dashboard',
        name: 'Dashboard',

        component: () => import('@/views/forms/DrugDashboard.vue'),
        // icon ใหม่
      },

      {
        path: 'reports-summary2',
        name: 'บันทึกข้อมูลผู้เกี่ยวข้องกับยาเสพติด (Google Sheets) จ.นครพนม',
        meta: {
          externalLink:
            'https://docs.google.com/spreadsheets/d/16x7airE029Jz54eYZ07OtJsrH4JQsUzUNkPX_thZcyw/edit#gid=0',
        },
      },
      {
        path: 'reports-summary1',
        name: 'บันทึกข้อมูลผู้เกี่ยวข้องกับยาเสพติด (Google Sheets) จ.สกลนคร',

        meta: {
          externalLink:
            'https://docs.google.com/spreadsheets/d/16x7airE029Jz54eYZ07OtJsrH4JQsUzUNkPX_thZcyw/edit#gid=0',
        },
      },
      {
        path: 'reports-summary3',
        name: 'บัญชีขึ้นทะเบียนผู้ค้า ภ.4',

        meta: {
          externalLink:
            'https://docs.google.com/spreadsheets/d/1W1cGIz_WLXbHsEQ3aKf4MoCnL69QJLF0H0t7kXCCKzk/edit?gid=1529821866#gid=1529821866',
        },
      },
      {
        path: 'reports-summary3',
        name: 'บัญชีขึ้นทะเบียนผู้ค้า ภ.4',

        meta: {
          externalLink:
            'https://docs.google.com/spreadsheets/d/1W1cGIz_WLXbHsEQ3aKf4MoCnL69QJLF0H0t7kXCCKzk/edit?gid=1529821866#gid=1529821866',
        },
      },
      {
        path: 'reports-summary4',
        name: 'ข้อมูล ศูนย์อำนวยการป้องกันและปราบปรามยาเสพติด จังหวัดร้อยเอ็ด',
        meta: {
          externalLink:
            'https://lookerstudio.google.com/reporting/0be10b8d-da40-4ab6-ab20-87eebc6f27db/page/p_xzffj3msld',
        },
      },
      {
        path: 'npd-model',
        name: 'ข้อมูลต้นแบบ ธวัชบุรีโมเดล',
        meta: {
          externalLink:
            'https://drive.google.com/drive/folders/1ffw1hNguctfN47Q1g0zGNPR_OC9g62NZ?usp=sharing',
        },
      },
      // เพิ่ม เมนู แบบรายงานด้านปราบ - นครพนมโมเดล
      {
        path: 'report-nakhon-phanom',
        name: 'แบบรายงานด้านปราบ-นครพนมโมเดล',
        meta: {
          externalLink:
            'https://docs.google.com/spreadsheets/d/1PR92fubHHHhy-EWnlhIauXroetk1ryqRy41v4_4vbAs/edit?gid=393867346#gid=393867346',
        },
      },
      {
        path: 'report-sakon-nakhon',
        name: 'แบบรายงานด้านปราบ-สกลนครโมเดล',
        meta: {
          externalLink:
            'https://docs.google.com/spreadsheets/d/1rTfaUFfPlyj_P5rmeH9vi9SlU6BPMxV-BdR2tPJAy50/edit?gid=393867346#gid=393867346',
        },
      },
      {
        path: 'report-nakhon-phanom-dashboard',
        name: 'Dashboard นครพนม',
        meta: {
          externalLink:
            'https://lookerstudio.google.com/u/0/reporting/265f4e2a-3310-46dc-aea9-a7d87943efe1/page/Vm7WE',
        },
      },
      {
        path: 'report-sakon-nakhon-dashboard',
        name: 'Dashboard สกลนคร',
        meta: {
          externalLink:
            'https://lookerstudio.google.com/u/0/reporting/38155b76-1d84-4062-b818-2b968d066a77/page/Vm7WE',
        },
      },
      {
        path: '/drug-search-red-zone',
        name: 'ค้นหาข้อมูลผู้เกี่ยวข้องยาเสพติด พื้นที่แดง',
        component: () => import('@/views/forms/DrugSearchoRedZone.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  // Check if route requires authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  }
  // Check if route requires admin role
  else if (requiresAdmin && !authStore.isAdmin) {
    next('/')
  }
  // Check if route has external link
  else if (to.meta.externalLink) {
    window.open(to.meta.externalLink, '_blank')
    next(false) // ป้องกันการนำทางภายในแอพ
  }
  // Allow access
  else {
    next()
  }
})

export default router
