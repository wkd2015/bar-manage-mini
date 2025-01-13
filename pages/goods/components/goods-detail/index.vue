<script setup>
import { defineProps, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
  goods: {
    type: Object,
    default: () => ({
      id: "",
      name: "",
      referencePrice: 0,
      thumbnail: "",
      unit: "",
    }),
  },
});
const screenWidth = computed(() => store.getters.navbarInfo.screenWidth);
</script>

<template>
  <view class="goods-detail">
    <view class="goods-detail-thumbnail" :style="`width: ${screenWidth - 40}px; height: ${screenWidth - 40}px;`">
      <image class="goods-detail-thumbnail-image" :src="goods.thumbnail" />
    </view>
    <view class="goods-detail-info">
      <view class="goods-name">商品名称：{{ goods.name }}</view>
      <view class="goods-unit">商品单位：{{ goods.unit }}</view>
      <view class="goods-reference-price">参考价格：￥{{ goods.referencePrice }}</view>
    </view>
  </view>
</template>

<style scoped>
.goods-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  gap: 12px;
}

.goods-detail-thumbnail {
  width: 335px;
  height: 335px;
  overflow: hidden;
}

.goods-detail-thumbnail-image {
  width: 100%;
  height: 100%;
}

.goods-detail-info {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
