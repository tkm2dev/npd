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

        component: () => import('@/views/dashboard/DashboardView.vue'),
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
        name: 'รายการบุคคลเกี่ยวข้องยาเสพติด (X-Ray)',
        meta: { requiresAuth: true },

        component: () => import('@/views/forms/DrugSearchList.vue'),
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
