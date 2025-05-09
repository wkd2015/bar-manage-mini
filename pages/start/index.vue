<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const loaded = ref(false);
const isUserRegistered = computed(() => {
  return store.getters.userInfo.id;
});

const handleJump = () => {
  if (isUserRegistered.value) {
    uni.switchTab({
      url: "/pages/index/index",
    });
  } else {
    uni.redirectTo({
      url: "/pages/user/form",
    });
  }
};

onMounted(() => {
  store.dispatch("setUserInfo").then(() => {
    loaded.value = true;
  });
});
</script>

<template>
  <view :class="['container', { loaded: loaded }]">
    <!-- 装饰性背景元素 -->
    <view class="decoration">
      <view class="cocktail-glass martini-glass">
        <view class="cup"></view>
        <view class="stem"></view>
        <view class="base"></view>
      </view>
      <view class="cocktail-glass whiskey-glass">
        <view class="cup"></view>
        <view class="base"></view>
      </view>
      <view class="cocktail-glass champagne-glass">
        <view class="cup"></view>
        <view class="stem"></view>
        <view class="base"></view>
      </view>
      <view class="cocktail-glass beer-mug">
        <view class="cup"></view>
        <view class="handle"></view>
      </view>
      <view class="cocktail-glass cocktail-coupe">
        <view class="cup"></view>
        <view class="stem"></view>
        <view class="base"></view>
      </view>
      <view class="cocktail-glass collins-glass">
        <view class="cup"></view>
        <view class="base"></view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- Logo和应用名称 -->
      <view class="logo-container">
        <view class="logo">
          <view class="logo-icon">🍸</view>
        </view>
        <view class="app-name">酒吧进销存助手</view>
        <view class="app-slogan">专业酒水库存管理解决方案</view>
      </view>

      <!-- 加载动画 -->
      <view class="loading-container">
        <view class="loading-bar">
          <view class="loading-progress"></view>
        </view>
        <view class="loading-text">正在加载系统资源...</view>
      </view>

      <!-- 登录/注册按钮（加载完成后显示） -->
      <view class="auth-container">
        <view class="auth-btn" @click="handleJump">开始使用</view>
      </view>
    </view>

    <!-- 底部版权信息 -->
    <view class="footer"> 版本 1.0.0 © 2025 酒吧进销存助手 </view>
  </view>
</template>

<style scoped>
page {
  background-color: #f6f6f6;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden; /* 禁止body滚动 */
}

.container {
  margin: 0 auto;
  height: 100vh; /* 固定高度 */
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 禁止整体容器滚动 */
  background: linear-gradient(135deg, #1565c0 0%, #1976d2 35%, #2979ff 100%);
}

/* 内容区域 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  color: white;
  position: relative;
  z-index: 1;
}

/* 装饰背景 */
.decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.1;
  z-index: 0;
}

/* 酒杯装饰元素 */
.cocktail-glass {
  position: absolute;
  width: 300rpx;
  height: 400rpx;
  opacity: 0; /* 初始设置为透明 */
}

/* 酒杯入场动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideFromLeft {
  from {
    transform: translateX(-200rpx) rotate(15deg);
    opacity: 0;
  }
  to {
    transform: translateX(0) rotate(15deg);
    opacity: 1;
  }
}

@keyframes slideFromRight {
  from {
    transform: translateX(200rpx) rotate(-10deg);
    opacity: 0;
  }
  to {
    transform: translateX(0) rotate(-10deg);
    opacity: 1;
  }
}

@keyframes slideFromTop {
  from {
    transform: translateY(-200rpx) rotate(5deg);
    opacity: 0;
  }
  to {
    transform: translateY(0) rotate(5deg);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0) rotate(-15deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(-15deg);
    opacity: 1;
  }
}

@keyframes rotateIn {
  from {
    transform: rotate(180deg) scale(0.5);
    opacity: 0;
  }
  to {
    transform: rotate(10deg) scale(1);
    opacity: 1;
  }
}

@keyframes waveIn {
  0% {
    transform: translateY(200rpx) scaleY(0.8);
    opacity: 0;
  }
  60% {
    transform: translateY(-30rpx) scaleY(1.1);
    opacity: 0.7;
  }
  80% {
    transform: translateY(10rpx) scaleY(0.95);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0) scaleY(1);
    opacity: 1;
  }
}

/* 马提尼杯 */
.martini-glass {
  bottom: -30rpx;
  left: -80rpx;
  animation: slideFromLeft 0.8s ease-out 0.5s forwards;
}

.martini-glass .cup {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 240rpx;
  height: 160rpx;
  background: transparent;
  border-top: 240rpx solid rgba(255, 255, 255, 0.9);
  border-left: 120rpx solid transparent;
  border-right: 120rpx solid transparent;
  box-sizing: content-box;
}

.martini-glass .stem {
  position: absolute;
  top: 240rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 20rpx;
  height: 140rpx;
  background-color: rgba(255, 255, 255, 0.9);
}

.martini-glass .base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 20rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
}

/* 威士忌杯 */
.whiskey-glass {
  top: -50rpx;
  right: -60rpx;
  animation: slideFromRight 0.8s ease-out 0.8s forwards;
}

.whiskey-glass .cup {
  position: absolute;
  bottom: 100rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 160rpx;
  height: 200rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
}

.whiskey-glass .base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 140rpx;
  height: 100rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
}

/* 香槟杯 */
.champagne-glass {
  top: 20%;
  right: 10%;
  animation: slideFromTop 0.8s ease-out 1.1s forwards;
}

.champagne-glass .cup {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 240rpx;
  background-color: transparent;
  border-radius: 5px 5px 40px 40px;
  border: 5px solid rgba(255, 255, 255, 0.9);
}

.champagne-glass .stem {
  position: absolute;
  top: 250rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 16rpx;
  height: 140rpx;
  background-color: rgba(255, 255, 255, 0.9);
}

.champagne-glass .base {
  position: absolute;
  top: 380rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 20rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
}

/* 啤酒杯 */
.beer-mug {
  top: 10%;
  left: 15%;
  animation: scaleIn 0.8s ease-out 1.4s forwards;
}

.beer-mug .cup {
  position: absolute;
  top: 0;
  left: 0;
  width: 160rpx;
  height: 240rpx;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px 10px 20px 20px;
  border: 8px solid rgba(255, 255, 255, 0.9);
}

.beer-mug .handle {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  width: 66rpx;
  height: 120rpx;
  border: 16rpx solid rgba(255, 255, 255, 0.9);
  border-left: 0;
  border-radius: 0 100rpx 100rpx 0;
}

/* 鸡尾酒杯 */
.cocktail-coupe {
  bottom: 5%;
  right: 5%;
  animation: rotateIn 0.8s ease-out 1.7s forwards;
}

.cocktail-coupe .cup {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 240rpx;
  height: 80rpx;
  background-color: transparent;
  border: 5px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  border-bottom-left-radius: 160rpx 80rpx;
  border-bottom-right-radius: 160rpx 80rpx;
}

.cocktail-coupe .stem {
  position: absolute;
  top: 90rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 16rpx;
  height: 100rpx;
  background-color: rgba(255, 255, 255, 0.9);
}

.cocktail-coupe .base {
  position: absolute;
  top: 180rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 20rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
}

/* 柯林杯 */
.collins-glass {
  bottom: 25%;
  left: 0;
  transform-origin: bottom center;
  animation: waveIn 1.2s ease-out 2s forwards;
}

.collins-glass .cup {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 320rpx;
  background-color: rgba(255, 255, 255, 0.7);
  border: 5px solid rgba(255, 255, 255, 0.9);
  border-radius: 5px 5px 15px 15px;
}

.collins-glass .base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 20rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
}

/* Logo 区域 */
.logo-container {
  margin-bottom: 80rpx;
  text-align: center;
}

.logo {
  width: 180rpx;
  height: 180rpx;
  background-color: white;
  border-radius: 44rpx;
  margin: 0 auto 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.logo-icon {
  font-size: 40px;
  color: #1565c0;
}

.app-name {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 16rpx;
}

.app-slogan {
  font-size: 15px;
  opacity: 0.9;
  letter-spacing: 0.5px;
}

/* 加载动画 */
.loading-container {
  margin-top: 120rpx;
  text-align: center;
}

.loading-bar {
  width: 400rpx;
  height: 8rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 30rpx;
}

.loading-progress {
  height: 100%;
  width: 30%;
  background-color: white;
  border-radius: 2px;
  position: relative;
  animation: progress-animation 2s ease infinite;
}

@keyframes progress-animation {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
}

.loading-text {
  font-size: 13px;
  opacity: 0.7;
}

/* 底部版权信息 */
.footer {
  text-align: center;
  padding: 40rpx;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

/* 登录/注册容器 */
.auth-container {
  margin-top: 100rpx;
  display: none; /* 默认隐藏，加载完成后显示 */
}

.auth-btn {
  padding: 24rpx 60rpx;
  background-color: white;
  color: #1565c0;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 400rpx;
  text-align: center;
}

/* 预加载完成后的状态 */
.loaded .loading-container {
  display: none;
}

.loaded .auth-container {
  display: block;
  animation: fade-in 0.5s ease forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
