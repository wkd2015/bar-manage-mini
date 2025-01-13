<script setup>
import { defineProps, ref, defineEmits } from "vue";
import GoodsCard from "../goods-card/index.vue";

const props = defineProps({
  goodsList: {
    type: Array,
    default: () => [],
  }
})
const emit = defineEmits(['select-goods'])

const selectedGoodsList = ref([])

const onGoodsSelect = (goods) => {
  let currentSelectedGoodsList = selectedGoodsList.value
  if (currentSelectedGoodsList.find(item => item.id === goods.id)) {
    currentSelectedGoodsList = currentSelectedGoodsList.map(item => item.id === goods.id ? goods : item)
  } else {
    currentSelectedGoodsList.push(goods)
  }
  selectedGoodsList.value = currentSelectedGoodsList
  emit('select-goods', currentSelectedGoodsList)
}

</script>

<template>
  <view class="goods-list">
    <scroll-view scroll-y>
      <view class="goods-list-container">
        <GoodsCard v-for="item in goodsList" :key="item.id" :goods="item" @select-goods="onGoodsSelect" />
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.goods-list {
  flex: 1;
}

.goods-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
