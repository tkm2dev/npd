<template>
  <div class="looker-studio-container">
    <iframe
      :src="reportUrl"
      frameborder="0"
      style="width: 100%; height: 100%"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'LookerStudio',
  data() {
    return {
      reportUrl:
        'https://lookerstudio.google.com/reporting/21e29420-722e-49cf-98e0-1e8c404c4fc1/page/FxrWE',
    }
  },
}
</script>

<style>
.looker-studio-container {
  width: 100%;
  height: 100vh; /* ปรับขนาดตามความต้องการ */
  overflow: hidden;
}
</style>
