<template>
  <v-app>
    <router-view></router-view>

    <!-- Global Loader -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      loading: false,
    }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Global styles */
html {
  overflow-y: auto;
}

body {
  font-family: 'Sarabun', sans-serif;
}

:root {
  --primary-color: #1976d2;
  --error-color: #ff5252;
  --success-color: #4caf50;
  --warning-color: #fb8c00;
  --info-color: #2196f3;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Utility classes */
.cursor-pointer {
  cursor: pointer;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Print styles */
@media print {
  .v-navigation-drawer,
  .v-app-bar {
    display: none !important;
  }

  .v-main {
    padding: 0 !important;
  }
}
</style>
