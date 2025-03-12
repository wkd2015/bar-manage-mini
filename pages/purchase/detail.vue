<script setup>
import { ref, computed, onMounted } from "vue";
import { onLoad } from '@dcloudio/uni-app'
import { useStore } from "vuex";
import { PURCHASE_CARD_STATUS, getPurchaseStatus } from "../../constants/purchase";
import { PurchaseService } from "../../services/purchase";
import dayjs from "dayjs";

const store = useStore();
const statusOptions = Object.values(PURCHASE_CARD_STATUS).map((item) => ({
  title: item.label
}));

const purchaseOrder = ref({});
const activeStatus = computed(() => {
  const purchaseStatusLabelInfo = getPurchaseStatus(purchaseOrder.value);
  const { label } = purchaseStatusLabelInfo;
  const activeIndex = statusOptions.findIndex((item) => item.title === label);
  return activeIndex;
})

const navbarInfo = computed(() => store.getters.navbarInfo);
const userInfo = computed(() => store.getters.userInfo);

const getPurchaseDetail = async (id) => {
  const { data } = await PurchaseService.getPurchaseDetail(id);
  purchaseOrder.value = data || {};
}

const onNavClick = () => {
  uni.navigateBack({ delta: 1 });
}

onLoad(async (option) => {
  console.warn(option);
  const id = option?.id || 0;
  await getPurchaseDetail(id);
});
</script>

<template>
  <view
    class="container"
    :style="`padding-top: ${navbarInfo.barHeight}px;`"
  >
    <navbar title="采购详情" class="navbar" showNavBack :onNavClick="onNavClick"></navbar>
    <view class="purchase-detail-content">
      <view class="purchase-status">
        <view class="purchase-status-title">采购状态</view>
        <uni-steps
          :options="statusOptions"
          :active="activeStatus"
          direction="column"
        />
      </view>
      <view class="purchase-goods">
        <view class="purchase-goods-title">{{ purchaseOrder.supplierInfo?.name }}</view>
        <template v-if="purchaseOrder.items.length === 0">
          <text class="purchase-goods-text purchase-goods-text-error"
            >商品信息获取失败</text
          >
        </template>
        <template v-if="purchaseOrder.items.length === 1">
          <view class="purchase-goods-single">
            <image
              class="purchase-goods-thumbnail"
              :src="purchaseOrder.items[0].productSnapshot?.imageUrl"
            />
            <view class="purchase-goods-info">
              <text class="purchase-goods-info-text"
                >名称：{{ purchaseOrder.items[0].productSnapshot?.name }}</text
              >
              <text class="purchase-goods-info-text"
                >数量：{{ purchaseOrder.items[0].quantity }}</text
              >
              <text class="purchase-goods-info-text"
                >总价：￥{{ purchaseOrder.totalAmount }}</text
              >
            </view>
          </view>
        </template>
        <template v-else>
          <view class="purchase-goods-multi">
            <scroll-view scroll-x class="purchase-goods-list-scroll">
              <view class="purchase-goods-list">
                <view
                  class="purchase-goods-list-item"
                  v-for="item in purchaseOrder.items"
                  :key="item.id"
                >
                  <view class="purchase-goods-list-item-thumbnail-wrapper">
                    <image
                      class="purchase-goods-list-item-thumbnail"
                      :src="item.productSnapshot?.imageUrl"
                    />
                    <view
                      class="purchase-goods-list-item-thumbnail-wrapper-count"
                      v-if="item.quantity > 1"
                    >
                      x {{ item.quantity }}
                    </view>
                  </view>
                  <!-- 商品数量放在图片上 -->
                  <text class="purchase-goods-list-item-name">{{
                    item.productSnapshot?.name
                  }}</text>
                </view>
              </view>
              <view class="purchase-goods-list-scroll-wrapper"></view>
            </scroll-view>
            <view class="purchase-goods-total">
              <text class="purchase-goods-total-text-price"
                >￥{{ purchaseOrder.totalAmount }}</text
              >
              <text class="purchase-goods-total-text"
                >共{{ purchaseOrder.items.length }}件</text
              >
            </view>
          </view>
        </template>
      </view>
      <view class="purchase-info">
        <view class="purchase-info-item">
          <view class="purchase-info-label">实付款</view>
          <view class="purchase-info-value">￥{{purchaseOrder.totalAmount}}</view>
        </view>
        <view class="purchase-info-item">
          <view class="purchase-info-label">订单编号</view>
          <view class="purchase-info-value">{{purchaseOrder.orderNo}}</view>
        </view>
        <view class="purchase-info-item">
          <view class="purchase-info-label">创建时间</view>
          <view class="purchase-info-value">{{ dayjs(purchaseOrder.createdTime).format("YYYY-MM-DD HH:mm:ss") }}</view>
        </view>
        <view class="purchase-info-item">
          <view class="purchase-info-label">发货时间</view>
          <view class="purchase-info-value">{{ dayjs(purchaseOrder.deliveryTime).format("YYYY-MM-DD HH:mm:ss") }}</view>
        </view>
        <view class="purchase-info-item">
          <view class="purchase-info-label">收货时间</view>
          <view class="purchase-info-value">{{ dayjs(purchaseOrder.recievedTime).format("YYYY-MM-DD HH:mm:ss") }}</view>
        </view>
        <view class="purchase-info-item">
          <view class="purchase-info-label">入库时间</view>
          <view class="purchase-info-value">{{ dayjs(purchaseOrder.stockedTime).format("YYYY-MM-DD HH:mm:ss") }}</view>
        </view>
      </view>
      <view class="purchase-footer"></view>
    </view>
  </view>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
}

.purchase-detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 10px;
  box-sizing: border-box;
}

.purchase-status {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 3px 4px 0px rgba(77, 31, 0, 0.06);
}

.purchase-status-title {
  font-size: 18px;
  font-weight: 600;
}

.purchase-goods {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 3px 4px 0px rgba(77, 31, 0, 0.06);
}

.purchase-goods-title {
  font-size: 18px;
  font-weight: 600;
}

.purchase-goods-text {
  font-size: 16px;
}

.purchase-goods-single {
  display: flex;
  gap: 10px;
  align-items: center;
}

.purchase-goods-thumbnail,
.purchase-goods-list-item-thumbnail {
  width: 80px;
  height: 80px;
}

.purchase-goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.purchase-goods-info-text {
  font-size: 12px;
  color: #666;
}

.purchase-goods-multi {
  display: flex;
  flex: 1;
  gap: 10px;
}

.purchase-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 3px 4px 0px rgba(77, 31, 0, 0.06);
}

.purchase-info-item {
  display: flex;
  justify-content: space-between;
}

.purchase-info-label {
  width: 100px;
  flex-shrink: 0;
  font-size: 14px;
  color: #333;
}

.purchase-info-value {
  font-size: 14px;
  color: #333;
}
</style>
