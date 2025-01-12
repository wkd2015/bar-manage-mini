<script setup></script>

<template>
  <view class="goods-detail">
    <view class="goods-detail-thumbnail">
      <image class="goods-detail-thumbnail-image" :src="goods.thumbnail" />
    </view>
    <view class="goods-detail-info">
      <view class="goods-name">{{ goods.name }}</view>
      <view class="goods-reference-price">{{ goods.referencePrice }}</view>
    </view>
  </view>
</template>

<style scoped></style>
