<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <view class="goods-form"></view>
</template>

<style scoped></style>
