<script setup>
import { defineProps } from "vue";

const props = defineProps({
  goods: {
    type: Object,
    default: () => ({
      id: "",
      name: "",
      referencePrice: 0,
      thumbnail: "",
      unit: "",
    }),
  },
});
</script>

<template>
  <view class="goods-detail">
    <view class="goods-detail-thumbnail">
      <image class="goods-detail-thumbnail-image" :src="goods.thumbnail" />
    </view>
    <view class="goods-detail-info">
      <view class="goods-name">商品名称：{{ goods.name }}</view>
      <view class="goods-unit">商品单位：{{ goods.unit }}</view>
      <view class="goods-reference-price">参考价格：￥{{ goods.referencePrice }}</view>
    </view>
  </view>
</template>

<style scoped>
.goods-detail {
  display: flex;
  background-color: #fff;
  padding: 12px;
  gap: 12px;
}

.goods-detail-thumbnail {
  width: 375px;
  height: 375px;
  overflow: hidden;
}

.goods-detail-thumbnail-image {
  width: 100%;
  height: 100%;
}

.goods-detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
