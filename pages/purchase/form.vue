<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import GoodsList from "../goods/components/goods-list/index.vue";
import GoodsForm from "../goods/components/goods-form/index.vue";
import GoodsCard from "../goods/components/goods-card/index.vue";
import { mockGoodsList } from "../../services/mock";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);

const orderDateTime = ref("");
const goodsPopup = ref(null);
const goodsList = ref(mockGoodsList);
const selectedGoodsList = ref([]);
const purchaseGoodsList = ref([]);
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
  goodsPopup.value.onPopupOpen();
};
const onGoodsPopupClose = () => {
  goodsPopup.value.onPopupClose();
};
const onGoodsSelectPopupReset = () => {
  searchText.value = "";
}
const onGoodsSelectedChange = (list) => {
  selectedGoodsList.value = (list || []).filter((item) => item.count > 0);
};
const onSearchConfirm = () => {};
const onGoodsSelectConfirm = () => {
  purchaseGoodsList.value = selectedGoodsList.value;
  goodsPopup.value.onPopupClose();
  selectedGoodsList.value = [];
};
const onPurchaseGoodsSelect = (goods) => {
  let currentPurchaseGoodsList = purchaseGoodsList.value
  if (currentPurchaseGoodsList.find(item => item.id === goods.id)) {
    currentPurchaseGoodsList = currentPurchaseGoodsList.map(item => item.id === goods.id ? goods : item)
  } else {
    currentPurchaseGoodsList.push(goods)
  }
  purchaseGoodsList.value = currentPurchaseGoodsList.filter(item => item.count > 0)
};
const toGoodsForm = () => {
  goodsFormPopup.value.onPopupOpen();
};
const resetGoodsAdd = () => {
  goodsFormData.value = {
    name: "",
    referencePrice: 0,
    thumbnail: "",
    unit: "",
  }
}
const onGoodsFormCancel = () => {
  resetGoodsAdd();
  goodsFormPopup.value.onPopupClose();
};
const onGoodsFormConfirm = () => {
  resetGoodsAdd();
  goodsFormPopup.value.onPopupClose();
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
          <view class="purchase-form-item-list">
            <GoodsCard
              v-for="item in purchaseGoodsList"
              :key="item.id"
              :goods="item"
              :initCount="item.count"
              @select-goods="onPurchaseGoodsSelect"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="supplier-popup">
      <uni-popup ref="supplierPopup" type="bottom" :safe-area="false">
      </uni-popup>
    </view>
    <fullscreen-popup
      ref="goodsPopup"
      title="选择商品"
    >
      <template #content>
        <view class="goods-content">
          <view class="goods-content-search">
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
      </template>
      <template #footer>
        <view class="goods-handles">
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
          <view class="goods-handles-confirm" @click="onGoodsSelectConfirm"> 保存商品 </view>
        </view>
      </template>
    </fullscreen-popup>
    <fullscreen-popup
      ref="goodsFormPopup"
      title="新建商品"
      @close="resetGoodsAdd"
    >
      <template #content>
        <GoodsForm v-model="goodsFormData" />
      </template>
      <template #footer>
        <view class="goods-add-handles">
          <view class="goods-add-handles-cancel" @click="onGoodsFormCancel">取消</view>
          <view class="goods-add-handles-confirm" @click="onGoodsFormConfirm">保存</view>
        </view>
      </template>
    </fullscreen-popup>
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

.goods-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  background-color: #f5f5f5;
}

.goods-content-search {
  background-color: #fff;
}

.goods-handles {
  flex: 1;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 0 12px;
}

.goods-handles-confirm {
  flex: 1;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 6px;
  background-color: #007aff;
  color: #fff;
}

.goods-add-handles {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
  gap: 16px;
}

.goods-add-handles-cancel {
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

.goods-add-handles-confirm {
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

.purchase-form-item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
