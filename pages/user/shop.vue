<script setup>
import { computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { ShopService } from "../../services/shop";

const store = useStore();

const POSITION_KEY = {
  BAR_OWNER: 1,
  BAR_MANAGER: 2,
  STAFF: 3,
  TRAINEE: 4
}
const POSITION_NAME = {
  [POSITION_KEY.BAR_OWNER]: '店长',
  [POSITION_KEY.BAR_MANAGER]: '主理人',
  [POSITION_KEY.STAFF]: '店员',
  [POSITION_KEY.TRAINEE]: '实习'
}
const POSITION_COLOR = {
  [POSITION_KEY.BAR_OWNER]: 'royal',
  [POSITION_KEY.BAR_MANAGER]: 'warning',
  [POSITION_KEY.STAFF]: 'primary',
  [POSITION_KEY.TRAINEE]: 'default'
}

const shopInfo = ref({
  id: 0,
  name: "",
  address: "",
  contactPerson: "",
  contactPhone: "",
  businessHours: "",
});
const staffList = ref([]);

const navbarInfo = computed(() => store.getters.navbarInfo);
const userInfo = computed(() => store.getters.userInfo);

const onNavClick = () => {
  uni.navigateBack({ delta: 1 });
}

const initShopDetail = async (shopId) => {
  const {data: shopInfoData} = await ShopService.getShopById(shopId)
  const {data: shopStaffs} = await ShopService.getShopStaffs(shopId)
  if (shopInfoData) {
    shopInfo.value = shopInfoData
  }
  staffList.value = shopStaffs || []
}

watch(
  () => userInfo.value.shopId,
  async (shopId) => {
    if (shopId) {
      await initShopDetail(shopId)
    }
  },
  { immediate: true }
)
</script>

<template>
  <view class="shop" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="店铺管理" :opacity="1" :showNavBack="true" :onNavClick="onNavClick"></navbar>
    <view class="shop-content">
      <view class="shop-info">
        <view class="shop-info-header">{{ shopInfo.name }}</view>
        <view class="shop-info-detail">
          <view class="shop-info-detail-item">
            <view class="shop-info-detail-item-label">地址:</view>
            <view class="shop-info-detail-item-value">{{
              shopInfo.address
            }}</view>
          </view>
          <view class="shop-info-detail-item">
            <view class="shop-info-detail-item-label">联系人:</view>
            <view class="shop-info-detail-item-value">{{
              shopInfo.contactPerson
            }}</view>
          </view>
          <view class="shop-info-detail-item">
            <view class="shop-info-detail-item-label">联系电话:</view>
            <view class="shop-info-detail-item-value">{{
              shopInfo.contactPhone
            }}</view>
          </view>
        </view>
      </view>
      <view class="shop-staffs">
        <view class="shop-staffs-header">店员</view>
        <view class="shop-staffs-list">
          <view class="shop-staffs-list-item" v-for="item in staffList" :key="item.id">
            <view class="shop-staffs-list-item-avatar">
              <image class="shop-staffs-list-item-avatar-image" :src="item.staffInfo?.avatar || '/static/imgs/avatar.png'" />
            </view>
            <view class="shop-staffs-list-item-name">{{ item.staffInfo?.userName }}</view>
            <uni-tag
              :text="POSITION_NAME[item.position]"
              size="small"
              :type="POSITION_COLOR[item.position]"
            />
            <view class="shop-staffs-list-item-phone">{{ item.staffInfo?.phone }}</view>
          </view>
        </view>
      </view>
    </view>
    <tabbar-shadow />
  </view>
</template>

<style scoped>
.shop {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
}

.shop-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
  background-color: #f5f5f5;
}

.shop-info {
  padding: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.shop-info-header {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.shop-info-detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.shop-info-detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.shop-info-detail-item-label {
  font-size: 14px;
  color: #666;
}

.shop-info-detail-item-value {
  font-size: 14px;
  color: #333;
}

.shop-staffs {
  padding: 0 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.shop-staffs-header {
  font-size: 20px;
  font-weight: 500;
  padding: 10px 0;
  color: #333;
  border-bottom: 0.5px solid #eee;
}

.shop-staffs-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.shop-staffs-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 0.5px solid #eee;
}

.shop-staffs-list-item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 0.5px solid #eee;
  overflow: hidden;
}

.shop-staffs-list-item-avatar-image {
  width: 100%;
  height: 100%;
}

.shop-staffs-list-item-name {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shop-staffs-list-item-phone {
  font-size: 14px;
  color: #333;
  flex: 1;
  text-align: right;
}
</style>
