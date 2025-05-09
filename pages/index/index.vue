<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { ShopService } from "../../services/shop";
import { gridNavConfig } from "./settings/config";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);
const userInfo = computed(() => store.getters.userInfo);

// TODO: 迁移到vuex
const shopInfo = ref({
  id: 0,
  name: "",
  address: "",
  contactPerson: "",
  contactPhone: "",
  businessHours: "",
});

const initShopInfo = async () => {
  const { data } = await ShopService.getShopById(userInfo.value.shopId);
  if (data) {
    shopInfo.value = data;
  }
};

const onGridNavClick = (item) => {
  uni.navigateTo({ url: `/pages/${item}/index` });
};

watch(
  () => userInfo.value.shopId,
  async (shopId) => {
    if (shopId) {
      await initShopInfo();
    }
  },
  { immediate: true }
);
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="首页"></navbar>
    <view class="page-content">
      <view class="page-content-header">
        <view class="shop-name">{{ shopInfo.name }}</view>
        <view class="data-overview">
          <view class="data-overview-item">
            <view class="data-overview-item-value">248</view>
            <view class="data-overview-item-label">库存总数</view>
          </view>
          <view class="data-overview-item">
            <view class="data-overview-item-value">56</view>
            <view class="data-overview-item-label">已开封</view>
          </view>
          <view class="data-overview-item">
            <view class="data-overview-item-value">¥4,235</view>
            <view class="data-overview-item-label">本月销售</view>
          </view>
        </view>
        <view class="quick-access-primary">
          <view
            class="quick-access-primary-item"
            v-for="item in gridNavConfig"
            :key="item.label"
            @click="onGridNavClick(item.url)"
          >
            <image :src="item.icon" class="quick-access-primary-item-icon" />
            <view class="quick-access-primary-item-label">{{
              item.label
            }}</view>
          </view>
        </view>
      </view>
      <view class="page-content-body">
        <view class="quick-operations">
          <view class="quick-operation-item">
            <text class="operation-icon">📥</text>
            <text class="operation-label">批量入库</text>
          </view>
          <view class="quick-operation-item">
            <text class="operation-icon">📤</text>
            <text class="operation-label">批量出库</text>
          </view>
        </view>
        <view class="task-list">
          <view class="task-header">
            <view class="task-title">任务</view>
            <view class="view-more">
              <text class="view-more-text">查看更多</text>
              <image src="/static/imgs/more-icon.png" class="view-more-icon" />
            </view>
          </view>
          <view class="task-items-container"></view>
        </view>
      </view>
    </view>
    <tabbar-shadow />
  </view>
</template>

<style scoped>
.container {
  margin: 0 auto;
  background-color: #f6f6f6;
  height: 100vh; /* 固定高度 */
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-content-header {
  background: linear-gradient(180deg, #1565c0 0%, #1565c0 10%, #2979ff 100%);
  color: #fff;
  padding: 0 32rpx 60rpx;
  width: 100%;
  box-sizing: border-box;
  margin-top: -1px;
}

.shop-name {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 30rpx;
}

.data-overview {
  display: flex;
  justify-content: space-between;
  margin: 10rpx 0 40rpx;
}

.data-overview-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  position: relative;
}

.data-overview-item:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 25%;
  width: 1px;
  height: 50%;
  background-color: rgba(255, 255, 255, 0.3);
}

.data-overview-item-label {
  font-size: 12px;
  opacity: 0.8;
}

.data-overview-item-value {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4rpx;
}

.quick-access-primary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.quick-access-primary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.quick-access-primary-item-icon {
  width: 72rpx;
  height: 72rpx;
}

.quick-access-primary-item-label {
  margin-top: 8rpx;
  font-size: 12px;
  opacity: 0.8;
}

.page-content-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f0f7ff 0%, #f8fbff 50%, #ffffff 100%);
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  margin-top: -40rpx;
}

.quick-operations {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  margin: 24rpx;
}

.quick-operation-item {
  background: white;
  border: 1px solid rgba(25, 118, 210, 0.15);
  border-radius: 12px;
  color: #1976d2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24rpx;
  transition: transform 0.2s, box-shadow 0.2s;
}

.operation-icon {
  font-size: 26px;
  margin-bottom: 16rpx;
  color: #2979ff;
}

.task-list {
  margin: 0 24rpx 24rpx 24rpx;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0; /* 防止收缩 */
}

.task-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.view-more {
  display: flex;
  align-items: center;
  height: 20px;
  gap: 4rpx;
}

.view-more-text {
  font-size: 12px;
  line-height: 12px;
  color: #2979ff;
}

.view-more-icon {
  width: 12px;
  height: 12px;
}

.task-items-container {
  flex: 1;
  overflow-y: auto;
  height: 100%;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.task-items-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
