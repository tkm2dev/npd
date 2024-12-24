<template>
  <div>
    <!-- Drug Form -->
    <SearchPerson @select="handlePersonSelect" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchPerson from '@/components/search/SearchPerson.vue'
</script>

