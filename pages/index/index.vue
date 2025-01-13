<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="首页" :opacity="1"></navbar>
    <tabbar-shadow />
  </view>
</template>
