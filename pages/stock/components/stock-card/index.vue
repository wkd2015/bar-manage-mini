<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  stockInfo: {
    type: Object,
    default: {
      id: '',
      imageUrl: '',
      name: '',
      totalQuantity: 0,
      usedQuantity: 0,
      price: 0,
      category: ''
    }
  }
})

const onStockInOut = () => {
  
}
</script>

<template>
  <view class="stock-card">
    <view class="stock-card-top">
      <view class="stock-card-thumbnail">
        <image class="stock-card-thumbnail-image" :src="stockInfo.imageUrl" />
      </view>
      <view class="stock-card-info">
        <view class="stock-card-info-goods">
          <view class="stock-card-info-name">商品名称：{{ stockInfo.name }}</view>
          <view class="stock-card-info-price">零售价格: ￥{{ stockInfo.price }}</view>
          <view class="stock-card-info-category">分类：{{ stockInfo.category }}</view>
        </view>
        <view class="stock-card-info-stock">
          <uni-tag
            :text="`库存：${stockInfo.totalQuantity}`"
            size="small"
            type="primary"
          />
          <uni-tag
            :text="`开封：${stockInfo.usedQuantity}`"
            size="small"
            type="success"
          />
        </view>
      </view>
    </view>
    <view class="stock-card-bottom">
      <view class="stock-card-bottom-button-in-out" @click="onStockInOut">入库/出库</view>
      <view class="stock-card-bottom-button-open">开封</view>
      <view class="stock-card-bottom-button-detail">查看详情</view>
    </view>
    <uni-popup ref="stockInOutPopup" type="bottom" :safe-area="false">
      <view class="stock-in-out-popup">
        <view class="stock-in-out-popup-header">
          <view class="stock-in-out-popup-header-title">入库/出库</view>
          <view class="stock-in-out-popup-header-close" @click="onStockInOutPopupClose">
            <uni-icons type="closeempty" size="16" />
          </view>
        </view>
        <view class="stock-in-out-popup-content">
          <view class="stock-in-out-popup-content-item">
            <text class="stock-in-out-popup-content-item-label">商品名称</text>
            <text class="stock-in-out-popup-content-item-value">{{ stockInfo.name }}</text>
          </view>
          <view class="stock-in-out-popup-content-item">
            <text class="stock-in-out-popup-content-item-label">数量</text>
            <input class="stock-in-out-popup-content-item-input" />
          </view>
        </view>
        <view class="stock-in-out-popup-footer">
          <view class="stock-in-out-popup-footer-cancel">取消</view>
          <view class="stock-in-out-popup-footer-confirm">确定</view>
        </view>
      </view>
    </uni-popup>
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
