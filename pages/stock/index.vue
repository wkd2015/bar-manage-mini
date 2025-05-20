<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="库存"></navbar>
    <view class="page-content">
      <view class="page-content-header">
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
            <view class="data-overview-item-value">10</view>
            <view class="data-overview-item-label">预警商品</view>
          </view>
        </view>
        <view class="stocks-handle">
          <view class="stocks-handle-item">
            <text class="stocks-handle-item-icon">📥</text>
            <text class="stocks-handle-item-label">批量入库</text>
          </view>
          <view class="stocks-handle-item">
            <text class="stocks-handle-item-icon">📤</text>
            <text class="stocks-handle-item-label">批量出库</text>
          </view>
        </view>
      </view>
      <view class="page-content-body">
        <view class="stock-list">
          <scroll-view
            scroll-y
            @scrolltolower="onReachBottom"
            class="scroll-view-container"
          >
            <StockCard
              v-for="item in stockList"
              :key="item.id"
              :stock-info="item"
              @stock-change="getInventoryList"
            />
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import StockCard from "./components/stock-card/index.vue";
import { InventoryService } from "../../services/inventory";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);
const userInfo = computed(() => store.getters.userInfo);

const stockList = ref([]);

const getInventoryList = async () => {
  const { data } = await InventoryService.getInventoryList(userInfo.value.shopId);
  stockList.value = data || [];
}

onMounted(async () => {
  await getInventoryList();
})
</script>

<style>
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

.stocks-handle {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.stocks-handle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  flex: 1;
}

.stocks-handle-item-icon {
  font-size: 26px;
  margin-bottom: 16rpx;
  color: #ffffff;
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

.stock-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  margin: 12px 0;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}
</style>
