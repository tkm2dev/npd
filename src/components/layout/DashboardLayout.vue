<template>
  <v-layout>
    <!-- App Bar -->
    <v-app-bar color="primary" rounded density="compact">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>ระบบบริหารจัดการข้อมูลยาเสพติด (NPD Model) </v-app-bar-title>
      <v-spacer></v-spacer>

      <!-- Search -->
      <!-- <v-text-field
        v-model="search"
        density="compact"
        variant="solo"
        prepend-inner-icon="mdi-magnify"
        label="ค้นหา..."
        single-line
        hide-details
        class="mr-4"
        style="max-width: 250px"
      ></v-text-field> -->

      <!-- Notifications -->
      <v-btn icon class="mr-2">
        <v-badge color="error" dot>
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <!-- User Menu -->
      <v-menu location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="text-none">
            <v-avatar size="32" class="mr-2">
              <v-img :src="userAvatar" :alt="userName"></v-img>
            </v-avatar>
            {{ userName }}
            <v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list width="200">
          <v-list-item
            v-for="(item, index) in userMenuItems"
            :key="index"
            :value="index"
            :to="item.to"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="handleLogout" value="logout" color="error">
            <template v-slot:prepend>
              <v-icon icon="mdi-logout" color="error"></v-icon>
            </template>
            <v-list-item-title>ออกจากระบบ</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" elevation="2">
      <!-- Logo -->
      <div class="pa-4 text-center">
        <v-img src="@/assets/logo.png" max-width="150" class="mx-auto"></v-img>
      </div>

      <v-divider></v-divider>

      <!-- Navigation List -->
      <v-list>
        <v-list-subheader>เมนูหลัก</v-list-subheader>

        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.title"
          rounded="lg"
          class="mb-1 menu-item"
        >
          <template v-slot:append v-if="item.badge">
            <v-badge :content="item.badge" color="primary" inline></v-badge>
          </template>
        </v-list-item>

        <!-- Admin Only Menus -->
        <template v-if="isAdmin">
          <v-divider class="my-4"></v-divider>
          <v-list-subheader>ผู้ดูแลระบบ</v-list-subheader>

          <v-list-item
            v-for="item in adminMenuItems"
            :key="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            :value="item.title"
            rounded="lg"
            class="mb-1 menu-item"
          ></v-list-item>
        </template>

        <!-- Reports Section -->
        <v-divider class="my-4"></v-divider>
        <v-list-subheader>รายงาน</v-list-subheader>

        <v-list-item
          v-for="item in reportMenuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.title"
          rounded="lg"
          class="mb-1 menu-item"
        ></v-list-item>
      </v-list>

      <!-- Bottom Section -->
      <template v-slot:append>
        <div class="pa-4">
          <v-list-item @click="handleLogout" value="logout" color="error">
            <template v-slot:prepend>
              <v-icon icon="mdi-logout" color="error"></v-icon>
            </template>
            <v-list-item-title>ออกจากระบบ</v-list-item-title>
          </v-list-item>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-6">
        <!-- Breadcrumbs -->
        <v-breadcrumbs :items="breadcrumbs" class="px-0 mb-4">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>

        <!-- Page Content -->
        <router-view v-slot="{ Component }">
          <v-fade-transition hide-on-leave>
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- Confirm Logout Dialog -->
    <v-dialog v-model="logoutDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6"> ยืนยันการออกจากระบบ </v-card-title>
        <v-card-text> คุณต้องการออกจากระบบใช่หรือไม่? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="logoutDialog = false"> ยกเลิก </v-btn>
          <v-btn color="error" variant="tonal" @click="logout"> ออกจากระบบ </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const drawer = ref(true)
const search = ref('')
const logoutDialog = ref(false)

// Computed
const userName = computed(() => authStore.user?.name || 'ผู้ใช้งาน')
const isAdmin = computed(() => authStore.isAdmin)
const userAvatar = computed(
  () => `https://api.dicebear.com/7.x/initials/svg?seed=${userName.value}`
)

const breadcrumbs = computed(() => {
  const items = [
    {
      title: 'หน้าหลัก',
      disabled: false,
      to: '/form-drug',
    },
  ]

  if (route.name !== 'Dashboard') {
    items.push({
      title: route.name,
      disabled: true,
    })
  }

  return items
})

// Menu Items
const menuItems = [
  {
    title: 'รายการข้อมูลบุคคลที่ (X-Ray)',
    icon: 'mdi-file-document-edit',
    to: '/list-drug',
  },
  // {
  //   title: 'ค้นหาตามพื้นที่',
  //   icon: 'mdi-file-document-edit',
  //   to: '/test',
  // },
  // /form-drug
  {
    title: 'ฟอร์มบันทึกข้อมูลแบบซักถาม (X-Ray)',
    icon: 'mdi-file-document-edit',
    to: '/form-drug',
  },
]

const adminMenuItems = [
  {
    title: 'แดชบอร์ด',
    icon: 'mdi-view-dashboard',
    to: '/dashboard',
  },
  {
    title: 'จัดการผู้ใช้',
    icon: 'mdi-account-group',
    to: '/users',
  },
  {
    title: 'ตั้งค่าระบบ',
    icon: 'mdi-cog',
    to: '/settings',
  },
]

const reportMenuItems = [
  {
    title: 'การรายงาน จ.ร้อยเอ็ด',
    icon: 'mdi-chart-box',
    to: '/reports-summary1',
  },
  {
    title: 'การรายงาน จ.สกลนคร',
    icon: 'mdi-chart-box',
    to: '/reports-summary1',
  },
  {
    title: 'การรายงาน จ.นครพนม',
    icon: 'mdi-chart-box',
    to: '/reports-summary2',
  },
  {
    title: 'บัญชีขึ้นทะเบียนผู้ค้า ภ.4',
    icon: 'mdi-chart-box',
    to: '/reports-summary3',
  },
  {
    title: 'ข้อมูล ศูนย์อำนวยการป้องกันและปราบปรามยาเสพติด จังหวัดร้อยเอ็ด',
    icon: 'mdi-chart-box',
    to: '/reports-summary4',
  },
  // {
  //   title: 'รายงานสถิติ',
  //   icon: 'mdi-chart-bar',
  //   to: '/reports/stats',
  // },
]

const userMenuItems = [
  {
    title: 'โปรไฟล์',
    icon: 'mdi-account',
    to: '/profile',
  },
  {
    title: 'ตั้งค่าบัญชี',
    icon: 'mdi-cog',
    to: '/account-settings',
  },
]

// Methods
const handleLogout = () => {
  logoutDialog.value = true
}

const logout = async () => {
  try {
    authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
.v-navigation-drawer {
  transition: width 0.2s ease-out;
}

:deep(.v-list-item__prepend) {
  padding-top: 8px;
}

:deep(.menu-item) {
  .v-list-item-title {
    white-space: normal !important;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    line-height: 1.4;
    padding: 8px 0;
  }

  .v-list-item__content {
    white-space: normal !important;
  }
}

:deep(.v-list-item) {
  min-height: unset;
  padding-top: 4px;
  padding-bottom: 4px;
  word-wrap: break-word;
}
</style>
