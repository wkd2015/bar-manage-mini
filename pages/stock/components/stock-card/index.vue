<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  stockInfo: {
    type: Object,
    default: {
      id: '',
      thumbnail: '',
      name: '',
      stockNum: 0,
      openedNum: 0,
      price: 0,
      unit: ''
    }
  }
})

const emits = defineEmits(['open', 'in-stock', 'out-stock'])
</script>

<template>
  <view class="stock-card">
    <view class="stock-card-top">
      <view class="stock-card-thumbnail">
        <image class="stock-card-thumbnail-image" :src="stockInfo.thumbnail" />
      </view>
      <view class="stock-card-info">
        <view class="stock-card-info-goods">
          <view class="stock-card-info-name">商品名称：{{ stockInfo.name }}</view>
          <view class="stock-card-info-price">零售价格: ￥{{ stockInfo.price }}</view>
          <view class="stock-card-info-unit">单位：{{ stockInfo.unit }}</view>
        </view>
        <view class="stock-card-info-stock">
          <uni-tag
            :text="`库存： ${stockInfo.stockNum}`"
            size="small"
            type="primary"
          />
          <uni-tag
            :text="`开封： ${stockInfo.openedNum}`"
            size="small"
            type="success"
          />
        </view>
      </view>
    </view>
    <view class="stock-card-bottom">
      <view class="stock-card-bottom-button-in-out">入库/出库</view>
      <view class="stock-card-bottom-button-open">开封</view>
      <view class="stock-card-bottom-button-detail">查看详情</view>
    </view>
  </view>
</template>

<style scoped>
.stock-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 16px 10px;
  border-bottom: 0.5px solid #eee;
  gap: 10px;
}

.stock-card-top {
  display: flex;
}

.stock-card-thumbnail {
  width: 90px;
  height: 90px;
  border-radius: 6px;
  margin-right: 12px;
  overflow: hidden;
}

.stock-card-thumbnail-image {
  width: 100%;
  height: 100%;
}

.stock-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #666;
}

.stock-card-info-goods {
  flex: 1;
}

.stock-card-info-stock {
  display: flex;
  gap: 10px;
  padding-bottom: 5px;
}

.stock-card-bottom {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.stock-card-bottom-button-in-out,
.stock-card-bottom-button-open,
.stock-card-bottom-button-detail {
  width: 70px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

.stock-card-bottom-button-in-out {
  border: 0.1px solid #2979ff;
  color: #2979ff;
}

.stock-card-bottom-button-open {
  border: 0.1px solid #18bc37;
  color: #18bc37;
}

.stock-card-bottom-button-detail {
  border: 0.1px solid #666;
  color: #666;
}
</style>
