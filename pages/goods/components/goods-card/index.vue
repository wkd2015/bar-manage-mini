<script setup>
import { defineProps, ref, defineEmits, watch } from "vue";
import GoodsDetail from "../goods-detail/index.vue";
import GoodsForm from "../goods-form/index.vue";

const props = defineProps({
  goods: {
    type: Object,
    default: () => ({
      id: "",
      name: "",
      estimatedPrice: 0,
      imageUrl: "",
      category: "",
      count: 0
    }),
  },
  initCount: {
    type: Number,
    default: 0
  },
  displayOnly: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["selectGoods"]);

const count = ref(0);
const isSelected = ref(false);
const goodsDetailPopup = ref(null);
const goodsEditPopup = ref(null);
const goodsFormData = ref({
  id: "",
  name: "",
  estimatedPrice: 0,
  imageUrl: "",
  category: "",
});

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
  goodsDetailPopup.value.onPopupOpen();
};

const toGoodsEdit = () => {
  goodsEditPopup.value.onPopupOpen();
};

const resetGoodsEdit = () => {
  goodsFormData.value = { ...props.goods };
}

const onGoodsEditCancel = () => {
  resetGoodsEdit()
  goodsEditPopup.value.onPopupClose()
}

const onGoodsEditSave = () => {
  // TODO：保存
  resetGoodsEdit()
  goodsEditPopup.value.onPopupClose()
}

const onGoodsDelete = () => {};

const getGoodsPrice = (price) => {
  return !price ? '时价' : `¥${price.toFixed(2)}`
};

watch(
  () => props.goods,
  (newVal) => {
    goodsFormData.value = { ...newVal };
  }
);

watch(
  () => props.initCount,
  (newVal) => {
    console.warn('initCount', newVal);
    count.value = newVal;
    isSelected.value = newVal > 0;
  },
  { immediate: true }
);
</script>

<template>
  <view class="goods-card">
    <view class="goods-card-thumbnail" @click="toGoodsDetail">
      <image class="goods-card-thumbnail-image" :src="goods.imageUrl" />
    </view>
    <view class="goods-card-info" @click="toGoodsDetail">
      <view class="goods-name">商品名称：{{ goods.name }}</view>
      <view class="goods-category">商品分类：{{ goods.category }}</view>
      <view class="goods-reference-price"
        >参考价格：{{ getGoodsPrice(goods.estimatedPrice) }}</view
      >
    </view>
    <view class="goods-card-handle" v-if="!displayOnly">
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
    <fullscreen-popup
      ref="goodsDetailPopup"
      title="商品详情"
    >
      <template #content>
        <GoodsDetail :goods="goods" />
      </template>
      <template #footer>
        <view class="goods-detail-handles">
          <view class="goods-detail-handles-left">
            <uni-icons type="compose" size="24" @click="toGoodsEdit" />
            <uni-icons type="trash" size="24" @click="onGoodsDelete" />
          </view>
          <view class="goods-detail-handles-right">
            <view
              class="goods-detail-handles-packed"
              @click="setGoodsCardSelected"
              v-if="!isSelected"
              >加入备选</view
            >
            <view class="goods-detail-handles-add" v-else>
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
    </fullscreen-popup>
    <fullscreen-popup
      ref="goodsEditPopup"
      title="商品编辑"
    >
      <template #content>
        <GoodsForm v-model="goodsFormData" />
      </template>
      <template #footer>
        <view class="goods-edit-handles">
          <view class="goods-edit-handles-cancel" @click="onGoodsEditCancel">取消</view>
          <view class="goods-edit-handles-save" @click="onGoodsEditSave">保存</view>
        </view>
      </template>
    </fullscreen-popup>
  </view>
</template>

<style scoped>
.goods-card {
  display: flex;
  background-color: #fff;
  padding: 10px 12px;
  border-bottom: 0.5px solid #eee;
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

.goods-detail-handles {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
}

.goods-detail-handles-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.goods-detail-handles-right {
  display: flex;
  align-items: center;
}

.goods-detail-handles-packed {
  padding: 2px 10px;
  border-radius: 6px;
  color: #fff;
  background-color: #007aff;
}

.goods-edit-handles {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
  gap: 16px;
}

.goods-edit-handles-cancel {
  flex: 1;
  height: 36px;
  border-radius: 6px;
  color: #007aff;
  border: 0.5px solid #007aff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.goods-edit-handles-save {
  flex: 1;
  height: 36px;
  border-radius: 6px;
  color: #fff;
  background-color: #007aff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
</style>
