<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);

const orderDateTime = ref('')

const onSupplierSelect = () => {}
const onGoodsSelect = () => {}
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="新建采购" class="navbar"></navbar>
    <view class="purchase-form">
      <view class="purchase-form-item">
        <view class="purchase-form-item-label">订单日期</view>
        <uni-datetime-picker
          type="datetime"
          v-model="orderDateTime"
        />
      </view>
      <view class="purchase-form-item">
        <view class="purchase-form-item-label">供应商</view>
        <view class="purchase-form-item-select" @click="onSupplierSelect">
          <view class="purchase-form-item-select-text"></view>
          <!-- icon -->
        </view>
      </view>
      <view class="purchase-form-item vertical-item">
        <view class="purchase-form-item-label">商品</view>
        <view class="purchase-form-item-btn" @click="onGoodsSelect">选择商品</view>
      </view>
    </view>
    <view class="supplier-popup">
      <uni-popup
        ref="popup"
        type="bottom"
      >
        
      </uni-popup>
    </view>
    <view class="goods-popup">
      <uni-popup
        ref="popup"
        type="bottom"
      >
        
      </uni-popup>
    </view>
  </view>
</template>

<style scoped></style>
