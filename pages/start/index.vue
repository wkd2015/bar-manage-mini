<script setup>
import { useStore } from "vuex";

const store = useStore();

store.dispatch("setUserInfo").then(() => {
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

<style scoped></style>
