<script setup>
import { defineProps, ref, defineEmits } from "vue";
import GoodsDetail from "../goods-detail/index.vue";

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
const emit = defineEmits(["selectGoods"]);

const count = ref(0);
const isSelected = ref(false);
const goodsDetailPopup = ref(null);

const setGoodsCardSelected = () => {
  isSelected.value = true;
  count.value = 1;
  emit("selectGoods", { ...props.goods, count: 1 });
};

const onCountChange = (value) => {
  if (value === 0) {
    isSelected.value = false;
  }
  emit("selectGoods", { ...props.goods, count: value });
};

const toGoodsDetail = () => {
  goodsDetailPopup.value.open();
};

const toGoodsEdit = () => {};

const onGoodsDelete = () => {};
</script>

<template>
  <view class="goods-card">
    <view class="goods-card-thumbnail" @click="toGoodsDetail">
      <image class="goods-card-thumbnail-image" :src="goods.thumbnail" />
    </view>
    <view class="goods-card-info" @click="toGoodsDetail">
      <view class="goods-name">商品名称：{{ goods.name }}</view>
      <view class="goods-unit">商品单位：{{ goods.unit }}</view>
      <view class="goods-reference-price"
        >参考价格：￥{{ goods.referencePrice }}</view
      >
    </view>
    <view class="goods-card-handle">
      <view
        class="goods-card-handle-packed"
        @click="setGoodsCardSelected"
        v-if="!isSelected"
        >加入备选</view
      >
      <view class="goods-card-handle-add" v-else>
        <uni-number-box
          v-model="count"
          :min="0"
          :max="999"
          @change="onCountChange"
        />
      </view>
    </view>
    <uni-popup ref="goodsDetailPopup" type="right">
      <view class="full-screen-popup">
        <view class="full-screen-popup-header">
          <view
            class="full-screen-popup-header-close"
            @click="goodsDetailPopup.close"
          >
            <uni-icons type="left" size="24" />
          </view>
          <view class="full-screen-popup-header-title">商品详情</view>
        </view>
        <view class="full-screen-popup-content">
          <GoodsDetail :goods="goods" />
        </view>
        <view class="full-screen-popup-footer">
          <view class="full-screen-popup-footer-btn-left">
            <uni-icons type="compose" size="24" @click="toGoodsEdit" />
            <uni-icons type="trash" size="24" @click="onGoodsDelete" />
          </view>
          <view class="full-screen-popup-footer-right">
            <view
              class="goods-popup-handle-packed"
              @click="setGoodsCardSelected"
              v-if="!isSelected"
              >加入备选</view
            >
            <view class="goods-popup-handle-add" v-else>
              <uni-number-box
                v-model="count"
                :min="0"
                :max="999"
                @change="onCountChange"
              />
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
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

.full-screen-popup {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #fff;
}
</style>
