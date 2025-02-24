<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);
const userInfo = computed(() => store.getters.userInfo);

const toShopDetail = () => {
  uni.navigateTo({
    url: "/pages/user/shop",
  });
}
</script>

<template>
  <view class="user" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="我的" :opacity="1"></navbar>
    <view class="user-content">
      <view class="user-info">
        <view class="user-info-avatar">
          <image class="user-info-avatar-image" :src="userInfo.avatar || '/static/imgs/avatar.png'" />
          <view class="user-info-avatar-name">{{ userInfo.userName }}</view>
        </view>
        <view class="user-info-detail">
          <view class="user-info-detail-item">
            <view class="user-info-detail-item-label">手机号:</view>
            <view class="user-info-detail-item-value">{{ userInfo.phone }}</view>
          </view>
        </view>
      </view>
      <view class="user-menu">
        <view class="user-menu-item" @click="toShopDetail">
          <text>店铺管理</text>
          <uni-icons type="arrowright" size="16" />
        </view>
      </view>
    </view>
    <tabbar-shadow />
  </view>
</template>

<style scoped>
.user {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
}

.user-content {
  flex: 1;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
}

.user-info-avatar {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.user-info-avatar-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 0.5px solid #eee;
}

.user-info-avatar-name {
  font-size: 20px;
  font-weight: 500;
}

.user-info-detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.user-info-detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.user-info-detail-item-label {
  font-size: 14px;
  color: #666;
}

.user-info-detail-item-value {
  font-size: 14px;
  color: #333;
}

.user-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  border-radius: 8px;
}

.user-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
}
</style>
