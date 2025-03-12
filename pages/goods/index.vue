<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import GoodsList from "./components/goods-list/index.vue";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);
const userInfo = computed(() => store.getters.userInfo);

const goodsList = ref([]);

const onGoodsSelectedChange = () => {};
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="首页" :opacity="1"></navbar>
    <GoodsList
      :goodsList="goodsList"
      @select-goods="onGoodsSelectedChange"
    />
  </view>
</template>

<style scoped></style>
