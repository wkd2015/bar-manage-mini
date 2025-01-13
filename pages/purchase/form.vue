<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import GoodsList from "../goods/components/goods-list/index.vue";
import GoodsForm from "../goods/components/goods-form/index.vue";
import { mockGoodsList } from "../../services/mock";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);

const orderDateTime = ref("");
const goodsPopup = ref(null);
const goodsList = ref(mockGoodsList);
const selectedGoodsList = ref([]);
const searchText = ref("");
const goodsFormPopup = ref(null);
const goodsFormData = ref({
  name: "",
  referencePrice: 0,
  thumbnail: "",
  unit: "",
});

const onSupplierSelect = () => {};
const onGoodsSelect = () => {
  goodsPopup.value.open();
};
const onGoodsPopupClose = () => {
  goodsPopup.value.close();
};
const onGoodsSelectPopupReset = () => {
  searchText.value = "";
}
const onGoodsSelectedChange = (list) => {
  selectedGoodsList.value = (list || []).filter((item) => item.count > 0);
};
const onSearchConfirm = () => {};
const onGoodsSelectConfirm = () => {};
const toGoodsForm = () => {
  goodsFormPopup.value.open();
};
const onGoodsFormPopupClose = () => {
  goodsFormPopup.value.close();
};
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="新建采购" class="navbar"></navbar>
    <view class="purchase-form">
      <view class="purchase-form-group">
        <view class="purchase-form-item">
          <view class="purchase-form-item-label">订单日期</view>
          <uni-datetime-picker
            type="datetime"
            :border="false"
            v-model="orderDateTime"
          />
        </view>
        <view class="purchase-form-item">
          <view class="purchase-form-item-label">供应商</view>
          <view class="purchase-form-item-select" @click="onSupplierSelect">
            <view class="purchase-form-item-select-text"></view>
            <uni-icons type="right" size="12" />
          </view>
        </view>
      </view>
      <view class="purchase-form-group">
        <view class="purchase-form-vertical-item">
          <view class="purchase-form-item-label">商品</view>
          <view class="purchase-form-item-btn" @click="onGoodsSelect"
            >选择商品</view
          >
        </view>
      </view>
    </view>
    <view class="supplier-popup">
      <uni-popup ref="supplierPopup" type="bottom" :safe-area="false">
      </uni-popup>
    </view>
    <uni-popup ref="goodsPopup" type="right" :safe-area="false">
      <view
        class="action-sheet"
        :style="`padding-top: ${navbarInfo.statusBarHeight}px;`"
      >
        <view
          class="action-sheet-header"
          :style="`padding: 0 ${navbarInfo.menuButtonWidth}px; height: ${navbarInfo.navHeight}px;`"
        >
          <view class="action-sheet-header-close" @click="onGoodsPopupClose">
            <uni-icons type="left" size="24" />
          </view>
          <text class="action-sheet-title">选择商品</text>
        </view>
        <view class="action-sheet-content">
          <view class="action-sheet-search">
            <uni-search-bar
              v-model="searchText"
              placeholder="搜索商品"
              cancelButton="none"
              @confirm="onSearchConfirm"
            />
          </view>
          <GoodsList
            :goodsList="goodsList"
            @select-goods="onGoodsSelectedChange"
          />
        </view>
        <view class="action-sheet-footer">
          <!-- TODO: 点击弹出已选商品 -->
          <uni-badge
            size="small"
            :text="selectedGoodsList.length"
            absolute="rightTop"
            type="primary"
          >
            <uni-icons type="cart" size="24" />
          </uni-badge>
          <view class="action-sheet-add-goods" @click="toGoodsForm">
            <uni-icons type="plus" size="24" />
          </view>
          <view class="action-sheet-confirm" @click="onGoodsSelectConfirm"> 保存商品 </view>
        </view>
      </view>
    </uni-popup>
    <uni-popup
      ref="goodsFormPopup"
      :safe-area="false"
      type="right"
    >
      <view
        class="action-sheet"
        :style="`padding-top: ${navbarInfo.statusBarHeight}px;`"
      >
        <view
          class="action-sheet-header"
          :style="`padding: 0 ${navbarInfo.menuButtonWidth}px; height: ${navbarInfo.navHeight}px;`"
        >
          <view class="action-sheet-header-close" @click="onGoodsFormPopupClose">
            <uni-icons type="left" size="24" />
          </view>
          <text class="action-sheet-title">新建商品</text>
        </view>
        <view class="action-sheet-content">
          <GoodsForm v-model="goodsFormData" />
        </view>
        <view class="action-sheet-footer">
          <view class="action-sheet-form-cancel" @click="onGoodsFormCancel"> 取消 </view>
          <view class="action-sheet-form-confirm" @click="onGoodsFormConfirm"> 保存 </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
}

.purchase-form {
  padding: 12px;
  background-color: #f5f5f5;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.purchase-form-group {
  background-color: #fff;
  border-radius: 6px;
  padding: 0 12px;
  margin-bottom: 12px;
}

.purchase-form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.5px solid #eee;
}

.purchase-form-vertical-item {
  width: 100%;
  border-bottom: none;
  padding: 6px 0 12px 0;
}

.purchase-form-vertical-item .purchase-form-item-label {
  font-weight: 500;
  font-size: 16px;
  width: 100%;
  border-bottom: 0.5px solid #eee;
}

.purchase-form-vertical-item .purchase-form-item-btn {
  width: 100%;
  height: 30px;
  border-radius: 10px;
  color: #333;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  font-size: 14px;
}

.purchase-form-group .purchase-form-item:last-child {
  border-bottom: none;
}

.purchase-form-item-label {
  font-size: 14px;
  line-height: 35px;
  width: 100px;
  color: #333;
}

.purchase-form-item-select {
  display: flex;
  align-items: center;
  height: 35px;
  line-height: 35px;
  font-size: 12px;
  color: #333;
}

:deep(.icon-calendar) {
  display: none;
}

.action-sheet {
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  z-index: 999;
}

.action-sheet-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-bottom: 0.5px solid #eee;
}

.action-sheet-header-close {
  position: absolute;
  left: 12px;
}

.action-sheet-title {
  font-size: 16px;
  font-weight: 500;
}

.action-sheet-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  background-color: #f5f5f5;
}

.action-sheet-search {
  background-color: #fff;
}

.action-sheet-footer {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 0 12px;
}

.action-sheet-confirm {
  flex: 1;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 6px;
}

.action-sheet-confirm {
  background-color: #007aff;
  color: #fff;
}
</style>
