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
</style>
