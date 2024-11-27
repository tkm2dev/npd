// src/components/common/LoadingOverlay.vue
<template>
  <v-overlay v-if="loading" :value="loading" class="align-center justify-center">
    <v-progress-circular :size="70" :width="7" color="primary" indeterminate>
      <span v-if="text" class="text-center">{{ text }}</span>
    </v-progress-circular>
  </v-overlay>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: 'กำลังโหลด...',
  },
})
</script>
