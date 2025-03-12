<script setup>
import { defineProps, ref, defineEmits, computed } from "vue";
import { useStore } from "vuex";
import { InventoryService } from "@/services/inventory";

const store = useStore();
const userInfo = computed(() => store.getters.userInfo);

const props = defineProps({
  stockInfo: {
    type: Object,
    default: {
      id: "",
      imageUrl: "",
      name: "",
      totalQuantity: 0,
      usedQuantity: 0,
      price: 0,
      category: "",
    },
  },
});

const stockInOutType = ref("stockIn");
const stockOutType = ref("opened")
const stockInOutPopup = ref(null);
const stockInNum = ref(0);
const stockOutNum = ref(0);
const stockInOutTypeList = ref([
  { value: "stockIn", text: "入库" },
  { value: "stockOut", text: "出库" },
])
const stockOutTypeList = ref([
  { value: "opened", text: "已开封" },
  { value: "unOpened", text: "未开封" },
])
const stockOpenPopup = ref(null);
const stockOpenNum = ref(0);

const emit = defineEmits(["stock-change"]);

const onStockInOut = () => {
  stockInOutPopup.value.open();
};

const onStockInOutPopupChange = (e) => {
  if (!e.show) {
    stockInOutType.value = "stockIn";
    stockOutType.value = 'opened'
    stockInNum.value = 0;
    stockOutNum.value = 0;
  }
}

const onStockInOutPopupClose = () => {
  stockInOutPopup.value.close();
}

const onStockInOutConfirm = async () => {
  const type = stockInOutType.value === "stockIn" ? 1 : 2;
  const verifyType = stockOutType.value === 'opened' ? 2 : 1
  const params = {
    type,
    shopId: userInfo.value.shopId,
    productId: props.stockInfo.productId,
    quantity: type === 1 ? stockInNum.value : stockOutNum.value,
    ...(type === 2 ? { verifyType } : {})
  }
  await InventoryService.updateInventory(params);
  emit("stock-change"); 
  onStockInOutPopupClose();
}

const onStockOpen = () => {
  stockOpenPopup.value.open();
}

const onStockOpenPopupChange = (e) => {
  if (!e.show) {
    stockOpenNum.value = 0;
  }
}

const onStockOpenPopupClose = () => {
  stockOpenPopup.value.close();
}

const onStockOpenConfirm = async () => {
  const params = {
    type: 3,
    shopId: userInfo.value.shopId,
    productId: props.stockInfo.productId,
    quantity: stockOpenNum.value
  }
  await InventoryService.updateInventory(params);
  onStockOpenPopupClose();
  emit("stock-change");
}
</script>

<template>
  <view class="stock-card">
    <view class="stock-card-top">
      <view class="stock-card-thumbnail">
        <image class="stock-card-thumbnail-image" :src="stockInfo.productInfo?.imageUrl" />
      </view>
      <view class="stock-card-info">
        <view class="stock-card-info-goods">
          <view class="stock-card-info-name"
            >商品名称：{{ stockInfo.productInfo?.name }}</view
          >
          <view class="stock-card-info-price"
            >零售价格: ￥{{ stockInfo.productInfo?.estimatedPrice }}</view
          >
          <view class="stock-card-info-category"
            >分类：{{ stockInfo.productInfo?.category }}</view
          >
        </view>
        <view class="stock-card-info-stock">
          <uni-tag
            :text="`库存：${stockInfo.totalQuantity}`"
            size="small"
            type="primary"
          />
          <uni-tag
            :text="`开封：${stockInfo.usedQuantity}`"
            size="small"
            type="success"
          />
        </view>
      </view>
    </view>
    <view class="stock-card-bottom">
      <view class="stock-card-bottom-button-in-out" @click="onStockInOut"
        >入库/出库</view
      >
      <view class="stock-card-bottom-button-open" @click="onStockOpen">开封</view>
      <!-- <view class="stock-card-bottom-button-detail">查看详情</view> -->
    </view>
    <uni-popup ref="stockInOutPopup" type="bottom" :safe-area="false" @change="onStockInOutPopupChange">
      <view class="stock-in-out-popup">
        <view class="stock-in-out-popup-header">
          <view class="stock-in-out-popup-header-title">入库/出库</view>
          <view
            class="stock-in-out-popup-header-close"
            @click="onStockInOutPopupClose"
          >
            <uni-icons type="closeempty" size="16" />
          </view>
        </view>
        <view class="stock-in-out-popup-content">
          <view class="stock-in-out-popup-content-item">
            <text class="stock-in-out-popup-content-item-label">商品名称</text>
            <text class="stock-in-out-popup-content-item-value">{{
              stockInfo.productInfo?.name
            }}</text>
          </view>
          <view class="stock-in-out-popup-content-item">
            <text class="stock-in-out-popup-content-item-label">操作类型</text>
            <view class="stock-in-out-popup-content-item-content">
              <uni-data-checkbox
                v-model="stockInOutType"
                :localdata="stockInOutTypeList"
                mode="tag"
                size="small"
              />
            </view>
          </view>
          <view class="stock-in-out-popup-content-item" v-if="stockInOutType === 'stockOut'">
            <text class="stock-in-out-popup-content-item-label">出库类型</text>
            <view class="stock-in-out-popup-content-item-content">
              <uni-data-checkbox
                v-model="stockOutType"
                :localdata="stockOutTypeList"
                mode="tag"
                size="small"
              />
            </view>
          </view>
          <view
            class="stock-in-out-popup-content-item"
            v-if="stockInOutType === 'stockIn'"
          >
            <text class="stock-in-out-popup-content-item-label">入库数量</text>
            <uni-number-box
              class="stock-in-out-popup-content-item-input"
              :step="1"
              :min="1"
              :max="10000"
              size="small"
              v-model="stockInNum"
            />
          </view>
          <view class="stock-in-out-popup-content-item" v-else>
            <text class="stock-in-out-popup-content-item-label">出库数量</text>
            <uni-number-box
              class="stock-in-out-popup-content-item-input"
              :step="1"
              :min="1"
              :max="10000"
              size="small"
              v-model="stockOutNum"
            />
          </view>
        </view>
        <view class="stock-in-out-popup-footer">
          <view class="stock-in-out-popup-footer-cancel" @click="onStockInOutPopupClose">取消</view>
          <view class="stock-in-out-popup-footer-confirm" @click="onStockInOutConfirm">确定</view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="stockOpenPopup" type="bottom" :safe-area="false" @change="onStockOpenPopupChange">
      <view class="stock-open-popup">
        <view class="stock-open-popup-header">
          <view class="stock-open-popup-header-title">开封</view>
          <view class="stock-open-popup-header-close" @click="onStockOpenPopupClose">
            <uni-icons type="closeempty" size="16" />
          </view>
        </view>
        <view class="stock-open-popup-content">
          <view class="stock-open-popup-content-item">
            <text class="stock-open-popup-content-item-label">商品名称</text>
            <text class="stock-open-popup-content-item-value">{{
              stockInfo.productInfo?.name
            }}</text>
          </view>
          <view class="stock-open-popup-content-item">
            <text class="stock-open-popup-content-item-label">开封数量</text>
            <uni-number-box
              class="stock-open-popup-content-item-input"
              :step="1"
              :min="1"
              :max="10000"
              size="small"
              v-model="stockOpenNum"
            />
          </view>
        </view>
        <view class="stock-open-popup-footer">
          <view class="stock-open-popup-footer-cancel" @click="onStockOpenPopupClose">取消</view>
          <view class="stock-open-popup-footer-confirm" @click="onStockOpenConfirm">确定</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style scoped>
.stock-in-out-popup,
.stock-open-popup {
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  padding: 0;
  box-sizing: border-box;
  width: 100vw;
}

.stock-in-out-popup-header,
.stock-open-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 0.5px solid #eee;
  margin-bottom: 10px;
}

.stock-in-out-popup-header-title,
.stock-open-popup-header-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.stock-in-out-popup-content,
.stock-open-popup-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 10px 10px 10px;
  box-sizing: border-box;
  overflow-y: scroll;
  max-height: 60vh;
}

.stock-in-out-popup-content-item,
.stock-open-popup-content-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stock-in-out-popup-content-item-label,
.stock-open-popup-content-item-label {
  font-size: 14px;
  width: 100px;
  color: #666;
}

.stock-in-out-popup-content-item-value,
.stock-open-popup-content-item-value {
  font-size: 14px;
  color: #333;
}

.stock-in-out-popup-content-item-content {
  flex: 1;
}

.stock-in-out-popup-footer,
.stock-open-popup-footer {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
}

.stock-in-out-popup-footer-cancel,
.stock-open-popup-footer-cancel {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  border-radius: 5px;
  background-color: #f5f5f5;
  height: 35px;
  flex: 1;
}

.stock-in-out-popup-footer-confirm,
.stock-open-popup-footer-confirm {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  border-radius: 5px;
  background-color: #007aff;
  height: 35px;
  flex: 1;
  color: #fff;
}

.stock-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 16px 10px;
  border-bottom: 0.5px solid #eee;
  gap: 10px;
}

.stock-card-top {
  display: flex;
}

.stock-card-thumbnail {
  width: 90px;
  height: 90px;
  border-radius: 6px;
  margin-right: 12px;
  overflow: hidden;
}

.stock-card-thumbnail-image {
  width: 100%;
  height: 100%;
}

.stock-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #666;
}

.stock-card-info-goods {
  flex: 1;
}

.stock-card-info-stock {
  display: flex;
  gap: 10px;
  padding-bottom: 5px;
}

.stock-card-bottom {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.stock-card-bottom-button-in-out,
.stock-card-bottom-button-open,
.stock-card-bottom-button-detail {
  width: 70px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

.stock-card-bottom-button-in-out {
  border: 0.1px solid #2979ff;
  color: #2979ff;
}

.stock-card-bottom-button-open {
  border: 0.1px solid #18bc37;
  color: #18bc37;
}

.stock-card-bottom-button-detail {
  border: 0.1px solid #666;
  color: #666;
}
</style>
