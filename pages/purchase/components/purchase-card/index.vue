<script setup>
import {
  PURCHASE_STATUS,
  PURCHASE_STATUS_MAP,
} from "../../../../constants/purchase";

const props = defineProps({
  purchaseParams: {
    type: Object,
    default: () => ({
      id: "",
      supplier: {
        name: "",
        id: "",
      },
      status: "",
      thumbnail: "",
      goodsList: [
        {
          name: "",
          price: 0,
          unit: "",
          thumbnail: "",
          count: 0,
        },
      ],
      totalPrice: 0,
      createTime: "",
    }),
  },
});

const toPurchaseDetail = () => {
  uni.navigateTo({
    url: '/pages/purchase/detail?id=' + props.purchaseParams.id
  })
}
</script>

<template>
  <view class="purchase-card">
    <view class="card-title" @click="toPurchaseDetail">
      <text class="card-title-text">{{ purchaseParams.supplier.name }}</text>
      <text
        class="card-title-status"
        :style="{
          color: PURCHASE_STATUS_MAP[purchaseParams.status || 0].color,
        }"
        >{{ PURCHASE_STATUS_MAP[purchaseParams.status || 0].label }}</text
      >
    </view>
    <view class="card-content" @click="toPurchaseDetail">
      <template v-if="purchaseParams.goodsList.length === 0">
        <text class="card-content-text card-content-text-error"
          >商品信息获取失败</text
        >
      </template>
      <template v-if="purchaseParams.goodsList.length === 1">
        <view class="card-content-goods-single">
          <image
            class="card-content-thumbnail"
            :src="purchaseParams.goodsList[0].thumbnail"
          />
          <view class="card-content-info">
            <text class="card-content-info-text"
              >名称：{{ purchaseParams.goodsList[0].name }}</text
            >
            <text class="card-content-info-text"
              >数量：{{ purchaseParams.goodsList[0].count }}</text
            >
            <text class="card-content-info-text"
              >总价：￥{{ purchaseParams.totalPrice }}</text
            >
          </view>
        </view>
      </template>
      <template v-else>
        <view class="card-content-goods-multi">
          <scroll-view scroll-x class="card-content-goods-list-scroll">
            <view class="card-content-goods-list">
              <view
                class="card-content-goods-list-item"
                v-for="item in purchaseParams.goodsList"
                :key="item.id"
              >
                <view class="card-content-goods-list-item-thumbnail-wrapper">
                  <image
                    class="card-content-goods-list-item-thumbnail"
                    :src="item.thumbnail"
                  />
                  <view
                    class="card-content-goods-list-item-thumbnail-wrapper-count"
                    v-if="item.count > 1"
                  >
                    x {{ item.count }}
                  </view>
                </view>
                <!-- 商品数量放在图片上 -->
                <text class="card-content-goods-list-item-name">{{
                  item.name
                }}</text>
              </view>
            </view>
            <view class="card-content-goods-list-scroll-wrapper"></view>
          </scroll-view>
          <view class="card-content-goods-total">
            <text class="card-content-goods-total-text-price"
              >￥{{ purchaseParams.totalPrice }}</text
            >
            <text class="card-content-goods-total-text"
              >共{{ purchaseParams.goodsList.length }}件</text
            >
          </view>
        </view>
      </template>
    </view>
    <text class="card-footer-text"
      >采购时间：{{ purchaseParams.createTime }}</text
    >
    <view class="card-footer">
      <view class="card-footer-more">更多</view>
      <view class="card-footer-handles">
        <view
          class="card-footer-handle-item"
          v-if="purchaseParams.status === PURCHASE_STATUS.WAIT_PURCHASE_CONFIRM"
          >上传发货单</view
        >
        <view
          class="card-footer-handle-item"
          v-if="purchaseParams.status === PURCHASE_STATUS.WAIT_IN_STORAGE"
          >确认入库</view
        >
        <view
          class="card-footer-handle-item"
          v-if="purchaseParams.status === PURCHASE_STATUS.IN_STORAGE"
          >导出入库单</view
        >
        <view class="card-footer-handle-item">导出采购单</view>
        <view class="card-footer-handle-item">上传发票</view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.purchase-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 16px 10px;
  border-bottom: 0.5px solid #eee;
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
  margin-top: 10px;
}

.card-content-goods-single {
  display: flex;
  gap: 10px;
  align-items: center;
}

.card-content-goods-multi {
  display: flex;
  flex: 1;
  gap: 10px;
}

.card-content-goods-list-scroll {
  width: 300px;
}

.card-content-goods-list {
  display: flex;
  gap: 10px;
}

.card-content-goods-list-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.card-content-goods-list-item-thumbnail-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.card-content-goods-list-item-thumbnail-wrapper-count {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 0 5px 5px 0;
}

.card-content-thumbnail,
.card-content-goods-list-item-thumbnail {
  width: 80px;
  height: 80px;
}

.card-content-goods-total {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
}
/* TODO: 滚动区域遮罩 */
/* .card-content-goods-total::before {
  content: "";
} */

.card-content-goods-total-text-price {
  font-size: 16px;
  font-weight: bold;
  color: #333;
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

.card-footer-text {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 14px;
}

.card-footer-more {
  color: #666;
}

.card-footer-handles {
  display: flex;
  gap: 10px;
}

.card-footer-handle-item {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #f0f0f0;
}
</style>
