<script setup>
import { defineProps } from "vue"

const props = defineProps({
  goods: {
    type: Object,
    default: () => ({
      name: "",
      referencePrice: 0,
      thumbnail: "",
      unit: ""
    })
  },
})
</script>

<template>
  <view class="goods-card">
    <view class="goods-card-thumbnail">
      <image class="goods-card-thumbnail-image" :src="goods.thumbnail" />
    </view>
    <view class="goods-card-info">
      <view class="goods-name">{{ goods.name }}</view>
      <view class="goods-reference-price">{{ goods.referencePrice }}</view>
    </view>
  </view>
</template>

<style scoped></style>
