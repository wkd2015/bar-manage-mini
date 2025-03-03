<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { ShopService } from "../../services/shop";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);
const userInfo = computed(() => store.getters.userInfo);

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
}

watch(
  () => userInfo.value.shopId,
  async (shopId) => {
    if (shopId) {
      await initShopInfo();
    }
  },
  { immediate: true }
)
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="首页" :opacity="1"></navbar>
    <view class="index-content">
      <view class="shop-info">
        <view class="shop-info-item">
          <view class="shop-info-item-label">店铺名称:</view>
          <view class="shop-info-item-value">{{ shopInfo.name }}</view>
        </view>
        <view class="shop-info-item">
          <view class="shop-info-item-label">店铺地址:</view>
          <view class="shop-info-item-value">{{ shopInfo.address }}</view>
        </view>
        <view class="shop-info-item">
          <view class="shop-info-item-label">联系人:</view>
          <view class="shop-info-item-value">{{ shopInfo.contactPerson }}</view>
        </view>
        <view class="shop-info-item">
          <view class="shop-info-item-label">联系电话:</view>
          <view class="shop-info-item-value">{{ shopInfo.contactPhone }}</view>
        </view>
        <view class="shop-info-item">
          <view class="shop-info-item-label">营业时间:</view>
          <view class="shop-info-item-value">{{ shopInfo.businessHours }}</view>
        </view>
      </view>
      <view class="quick-access-grid">
        <view class="quick-access-grid-item">
          <view class="quick-access-grid-item-icon">
            <uni-icons type="home" size="20" />
          </view>
          <view class="quick-access-grid-item-label">商品</view>
        </view>
        <view class="quick-access-grid-item">
          <view class="quick-access-grid-item-icon">
            <uni-icons type="home" size="20" />
          </view>
          <view class="quick-access-grid-item-label">供应商</view>
        </view>
        <view class="quick-access-grid-item">
          <view class="quick-access-grid-item-icon">
            <uni-icons type="home" size="20" />
          </view>
          <view class="quick-access-grid-item-label">库存</view>
        </view>
        <view class="quick-access-grid-item">
          <view class="quick-access-grid-item-icon">
            <uni-icons type="home" size="20" />
          </view>
          <view class="quick-access-grid-item-label">采购单</view>
        </view>
      </view>
      <view class="task-list-area">
        <view class="task-list-header">
          <view class="task-list-header-title">任务列表</view>
        </view>
        <view class="task-list">
          <view class="task-list-item" v-for="item in 3" :key="item">
            <view class="task-list-item-header">
              <view class="task-list-item-header-title">任务名称</view>
              <view class="task-list-item-header-status">进行中</view>
            </view>
            <view class="task-list-item-detail">
              <view class="task-list-item-detail-item">
                <view class="task-list-item-detail-item-label">任务内容:</view>
                <view class="task-list-item-detail-item-value">任务内容</view>
              </view>
              <view class="task-list-item-detail-item">
                <view class="task-list-item-detail-item-label">任务时间:</view>
                <view class="task-list-item-detail-item-value">任务时间</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <tabbar-shadow />
  </view>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
}

.index-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 10px;
  box-sizing: border-box;
}

.shop-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.shop-info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.shop-info-item-label {
  font-size: 14px;
  color: #666;
  width: 100px;
  flex-shrink: 0;
}

.shop-info-item-value {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.quick-access-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-list-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.task-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.task-list-header-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.task-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  box-sizing: border-box;
}

.task-list-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f5f5f5;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-list-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.task-list-item-header-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-list-item-header-status {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-list-item-detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
