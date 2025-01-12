<script setup>
import { defineProps, ref, defineEmits } from "vue"

const props = defineProps({
  goods: {
    type: Object,
    default: () => ({
      id: "",
      name: "",
      referencePrice: 0,
      thumbnail: "",
      unit: ""
    })
  },
})
const emit = defineEmits(['selectGoods'])

const count = ref(0)
const isSelected = ref(false)

const setGoodsCardSelected = () => {
  isSelected.value = true
  count.value = 1
  emit('selectGoods', { ...props.goods, count: 1 })
}

const onCountChange = (value) => {
  if (value === 0) {
    isSelected.value = false
  }
  emit('selectGoods', { ...props.goods, count: value })
}
</script>

<template>
  <view class="goods-card">
    <view class="goods-card-thumbnail">
      <image class="goods-card-thumbnail-image" :src="goods.thumbnail" />
    </view>
    <view class="goods-card-info">
      <view class="goods-name">商品名称：{{ goods.name }}</view>
      <view class="goods-unit">商品单位：{{ goods.unit }}</view>
      <view class="goods-reference-price">参考价格：￥{{ goods.referencePrice }}</view>
    </view>
    <view class="goods-card-handle">
      <view class="goods-card-handle-packed" @click="setGoodsCardSelected" v-if="!isSelected">加入备选</view>
      <view class="goods-card-handle-add" v-else>
        <uni-number-box
          v-model="count"
          :min="0"
          :max="999"
          @change="onCountChange"
        />
      </view>
    </view>
  </view>
</template>

<style scoped>
.goods-card {
  display: flex;
  background-color: #fff;
  padding: 10px 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.goods-card-thumbnail {
  display: flex;
  justify-content: center;
  align-items: center;
}

.goods-card-thumbnail-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
}

.goods-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 12px;
  font-size: 14px;
  color: #666;
}

.goods-card-handle {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

.goods-card-handle-packed {
  padding: 2px 10px;
  border-radius: 6px;
  color: #fff;
  background-color: #007aff;
}
</style>
