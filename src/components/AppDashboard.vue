<template>
  <v-app>
    <v-container>
      <!-- Header -->
      <v-row>
        <v-col cols="12" class="text-center">
          <h1>ผลการดำเนินงานบำบัดรักษาผู้ติดยาเสพติด</h1>
          <h2>จังหวัดนครพนม</h2>
        </v-col>
      </v-row>

      <!-- Summary Section -->
      <v-row>
        <v-col cols="4">
          <v-card outlined>
            <v-card-title>ประชากรทั้งหมด</v-card-title>
            <v-card-subtitle>
              <h2>69,208</h2>
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card outlined>
            <v-card-title>คัดกรองแล้ว</v-card-title>
            <v-card-subtitle>
              <h2>2,952</h2>
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card outlined>
            <v-card-title>พบผู้เสพ</v-card-title>
            <v-card-subtitle>
              <h2>197</h2>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>

      <!-- Chart Section -->
      <v-row>
        <v-col cols="6">
          <v-card outlined>
            <v-card-title>ผลการคัดกรอง</v-card-title>
            <div id="pie-chart"></div>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card outlined>
            <v-card-title>การบำบัดตามกลุ่มสี</v-card-title>
            <div id="bar-chart"></div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Table Section -->
      <v-row>
        <v-col cols="12">
          <v-card outlined>
            <v-card-title>ผลการ Re X-ray</v-card-title>
            <v-data-table :headers="headers" :items="tableData" class="elevation-1"></v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'ลำดับ', value: 'index' },
        { text: 'ตำบล', value: 'location' },
        { text: 'เป้าหมาย', value: 'target' },
        { text: 'X-ray สะสม', value: 'xray' },
        { text: 'Negative', value: 'negative' },
        { text: 'Positive', value: 'positive' },
      ],
      tableData: [
        { index: 1, location: 'ศรีสงคราม', target: 6253, xray: 3369, negative: 113, positive: 107 },
        { index: 2, location: 'หาดแพง', target: 3851, xray: 3512, negative: 320, positive: 32 },
        // เพิ่มข้อมูลเพิ่มเติมที่นี่
      ],
    }
  },
}
</script>

<style>
body {
  font-family: 'Kanit', sans-serif;
}
</style>
