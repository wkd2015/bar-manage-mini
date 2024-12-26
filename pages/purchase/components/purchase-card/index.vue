<script setup></script>

<template>
  <view class="purchase-card">
    <view class="card-title">
      <text class="card-title-text">{{ supplierName }}</text>
      <uni-tag
        :text="purchaseStatus"
        size="normal"
        type="primary"
      />
    </view>
    <view class="card-content">
      <view class="card-content-thumbnail">
        <image
          class="card-content-thumbnail-image"
          :src="thumbnail"
        />
      </view>
      <view class="card-content-info">
        <text class="card-content-info-text">{{ productName }}</text>
      </view>
    </view>
    <view class="card-footer"></view>
  </view>
</template>

<style scoped>
.
</style>