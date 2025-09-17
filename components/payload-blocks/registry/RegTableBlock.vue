<template>
  <div class="reg-table-block">
    <table>
      <thead v-if="tableData.headers && tableData.headers.length">
        <tr>
          <th v-for="(header, i) in tableData.headers" :key="i">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in tableData.rows" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="tableData.caption" class="table-caption">{{ tableData.caption }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

type RegTableBlockProps = {
  block: {
    blockType: string;
    headers?: string[];
    rows: string[][];
    caption?: string;
  }
};

const props = defineProps<RegTableBlockProps>();

const tableData = {
  headers: props.block.headers || [],
  rows: props.block.rows || [],
  caption: props.block.caption || ''
};
</script>

<style scoped>
.reg-table-block {
  margin: 2rem 0;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}
th, td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  text-align: left;
}
thead {
  background: #f9fafb;
}
.table-caption {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #6b7280;
  text-align: left;
}
</style>
