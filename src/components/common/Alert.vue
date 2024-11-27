<template>
  <v-snackbar v-model="modelValue" :color="color" :timeout="timeout" location="top">
    {{ text }}

    <template v-slot:actions>
      <v-btn variant="text" @click="$emit('update:modelValue', false)"> ปิด </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  color: {
    type: String,
    default: 'success',
  },
  text: {
    type: String,
    required: true,
  },
  timeout: {
    type: Number,
    default: 3000,
  },
})

defineEmits(['update:modelValue'])
</script>
