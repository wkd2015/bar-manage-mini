<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import GoodsList from "../goods/components/goods-list/index.vue";
import { mockGoodsList } from "../../services/mock";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);

const orderDateTime = ref("");
const goodsPopup = ref(null);
const goodsList = ref(mockGoodsList);
const selectedGoodsList = ref([]);

const onSupplierSelect = () => {};
const onGoodsSelect = () => {
  goodsPopup.value.open("bottom");
};
const onGoodsSelectedChange = (list) => {
  selectedGoodsList.value = list;
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
      <uni-popup ref="supplierPopup" type="bottom" :safe-area="false"> </uni-popup>
    </view>
    <uni-popup ref="goodsPopup" type="bottom" :safe-area="false">
      <view class="action-sheet" :style="{
        height: `calc(100vh - ${navbarInfo.barHeight}px)`,
      }">
        <view class="action-sheet-header">
          <text class="action-sheet-title">选择商品</text>
          <view class="action-sheet-add-btn">添加</view>
        </view>
        <view class="action-sheet-content">
          <GoodsList :goodsList="goodsList" @select-goods="onGoodsSelectedChange" />
        </view>
        <view class="action-sheet-footer">
          <uni-badge size="small" :text="selectedGoodsList.length" absolute="rightTop" type="primary">
            <uni-icons type="cart" size="24" />
          </uni-badge>
          <view
          class="action-sheet-confirm"
            @click=""
          >
            保存商品
          </view>
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
}

.action-sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 0.5px solid #eee;
}

.action-sheet-add-btn {
  font-size: 12px;
  border-radius: 6px;
  color: #333;
  border: 0.5px solid #333;
  padding: 2px 10px;
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
