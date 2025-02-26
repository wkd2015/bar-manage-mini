<script setup>
import { useStore } from "vuex";

const store = useStore();

store.dispatch("setUserInfo").then(() => {
  // TODO: 启动页倒计时
  console.warn('store.getters.userInfo')
  if (store.getters.userInfo.id) {
    uni.switchTab({
      url: "/pages/index/index",
    });
  } else {
    uni.redirectTo({
      url: "/pages/user/form",
    });
  }
});
</script>

<template>
  <view class="start">智能进销存管理</view>
</template>

<style scoped>
.start {
  width: 100vw;
  height: 100vh;
  background-color: #007aff;
  color: #f5f5f5;
  writing-mode: vertical-lr;
  font-size: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
