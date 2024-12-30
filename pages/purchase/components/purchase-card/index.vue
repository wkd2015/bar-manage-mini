<script setup>
import { ref } from 'vue'

const props = defineProps({
  purchaseParams: {
    type: Object,
    default: () => ({
      supplierName: '',
      status: '',
      thumbnail: '',
      productName: '',
      totalPrice: 100,
      count: 1,
    })
  }
})
</script>

<template>
  <view class="purchase-card">
    <view class="card-title">
      <text class="card-title-text">{{ purchaseParams.supplierName }}</text>
      <text class="card-title-status">{{ purchaseParams.status }}</text>
    </view>
    <view class="card-content">
      <view class="card-content-thumbnail">
        <image
          class="card-content-thumbnail-image"
          :src="purchaseParams.thumbnail"
        />
      </view>
      <view class="card-content-info">
        <text class="card-content-info-text">{{ purchaseParams.productName }}</text>
        <text class="card-content-info-text">总价：{{ purchaseParams.totalPrice }}</text>
        <text class="card-content-info-text">数量：{{ purchaseParams.count }}</text>
        <text class="card-content-info-text">下单：{{ purchaseParams.createTime }}</text>
      </view>
    </view>
    <view class="card-footer"></view>
  </view>
</template>

<style scoped>
.purchase-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  padding: 16px 10px;
  margin: 0 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title-text {
  font-size: 16px;
  font-weight: bold;
}

.card-title-status {
  font-size: 14px;
  color: #999;
}

.card-content {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.card-content-thumbnail {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
}

.card-content-thumbnail-image {
  width: 100%;
  height: 100%;
}

.card-content-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-content-info-text {
  font-size: 12px;
  color: #666;
}
</style>