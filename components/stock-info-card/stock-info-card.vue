<script setup>
import { ref } from 'vue'

const stockAdd = ref(0)
const stockOut = ref(0)
const totalStock = ref(0)
</script>

<template>
  <view class="stock-info-card">
    <text>今日库存</text>
    <view>
      <text>+{{ stockAdd }}</text>
      <text>-{{ stockOut }}</text>
    </view>
    <view>总库存：{{ totalStock }}</view>
  </view>
</template>

<style scoped></style>
