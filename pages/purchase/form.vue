<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="新建采购" class="navbar"></navbar>
  </view>
</template>

<style scoped></style>
