<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import GoodsList from "../goods/components/goods-list/index.vue";
import GoodsForm from "../goods/components/goods-form/index.vue";
import GoodsCard from "../goods/components/goods-card/index.vue";
import SupplierCard from "./components/supplier/supplier-card.vue";
import SupplierForm from "./components/supplier/supplier-form.vue";
import { mockGoodsList } from "../../services/mock";
import { SupplierService } from "../../services/supplier";
import { PurchaseService } from "../../services/purchase";
import { ProductService } from "../../services/product";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);
const userInfo = computed(() => store.getters.userInfo);

const orderDateTime = ref("");
const supplierName = ref("");
const goodsPopup = ref(null);
const goodsSearchParams = ref({
  name: "",
  pageNum: 1,
  pageSize: 10
})
const goodsList = ref([]);
const selectedGoodsList = ref([]);
const purchaseGoodsList = ref([]);
const goodsFormPopup = ref(null);
const goodsFormData = ref({
  name: "",
  estimatedPrice: 0,
  imageUrl: "",
  category: "",
});
const purchasePrice = ref(0)
const supplierPopup = ref(null);
const suppliersSearchParams = ref({
  name: "",
  contactPerson: "",
  pageNum: 1,
  pageSize: 10
});
const supplierList = ref([]);
const purchaseParams = ref({
  shopId: 0,
  supplierId: 0,
  items: []
})
const supplierFormPopup = ref(null);
const supplierFormData = ref({
  name: "",
  contactPerson: "",
  phone: "",
  address: "",
})
const allGoodsRefrencePrice = computed(() => {
  return purchaseGoodsList.value.reduce((total, item) => total + item.estimatedPrice * item.count, 0);
})

const onSupplierSelect = async () => {
  supplierPopup.value.open();
}
const onSupplierPopupClose = () => {

  supplierPopup.value.close();
}
const onSuppliersSearch = async () => {
  const { data = {} } = await SupplierService.getSuppliersByParams(suppliersSearchParams.value)
  supplierList.value = data.list || []
};
const onSupplierSelectedChange = (supplier) => {
  supplierName.value = supplier.name;
  purchaseParams.supplierId = supplier.id;
  supplierPopup.value.close();
};
const toSupplierForm = () => {
  supplierFormPopup.value.onPopupOpen();
}
const onSupplierFormConfirm = async () => {
  await SupplierService.createSupplier(supplierFormData.value);
  onSuppliersSearch();
  supplierFormPopup.value.onPopupClose();
}
const onGoodsSelect = async () => {
  await onGoodsSearch();
  goodsPopup.value.onPopupOpen();
};
const onGoodsSearch = async () => {
  const { data = {} } = await ProductService.getProductList(goodsSearchParams.value)
  goodsList.value = data.list || [];
};
const onGoodsSelectedChange = (list) => {
  selectedGoodsList.value = (list || []).filter((item) => item.count > 0);
};
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
    estimatedPrice: 0,
    imageUrl: "",
    category: "",
  }
}
const onGoodsFormCancel = () => {
  resetGoodsAdd();
  goodsFormPopup.value.onPopupClose();
};
const onGoodsFormConfirm = async () => {
  console.warn('goodsFormData.value', goodsFormData.value);
  await ProductService.createProduct(goodsFormData.value);
  resetGoodsAdd();
  goodsFormPopup.value.onPopupClose();
  await onGoodsSearch();
};

const onPurchaseFormCancel = () => {
  uni.navigateBack({ delta: 1 });
};
const onPurchaseFormConfirm = async () => {
  const items = purchaseGoodsList.value.map(item => {
    return {
      productId: item.id,
      quantity: item.count
    }
  })
  const params = {
    supplierId: purchaseParams.supplierId,
    items,
    shopId: userInfo.value.shopId
  }

  await PurchaseService.createPurchase(params);
  // TODO: 表单校验

  uni.navigateBack({ delta: 1 });
};

onMounted(async () => {
  await onSuppliersSearch();
})
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="新建采购" class="navbar" :showNavBack="true" :onNavClick="onPurchaseFormCancel"></navbar>
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
            <view class="purchase-form-item-select-text">{{ supplierName }}</view>
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
        <view class="purchase-form-item">
          <view class="purchase-form-item-label">参考价格</view>
          <view class="purchase-form-item-content">￥{{ allGoodsRefrencePrice }}</view>
        </view>
        <!-- <view class="purchase-form-item">
          <view class="purchase-form-item-label">实付价格</view>
          <uni-number-box
            v-model="purchasePrice"
            :min="0"
            :max="99999"
          />
        </view> -->
        <view class="purchase-form-item">
          <view class="purchase-form-item-label">付款账户</view>
          <uni-easyinput
            v-model="bankAccount"
            type="text"
            placeholder="请输入付款账户"
          />
        </view>
      </view>
      <view class="purchase-form-footer">
        <view class="purchase-form-footer-cancel" @click="onPurchaseFormCancel">取消</view>
        <view class="purchase-form-footer-confirm" @click="onPurchaseFormConfirm">确认</view>
      </view>
    </view>
    <fullscreen-popup
      ref="goodsPopup"
      title="选择商品"
    >
      <template #content>
        <view class="goods-content">
          <view class="goods-content-search">
            <uni-search-bar
              v-model="goodsSearchParams.name"
              placeholder="搜索商品"
              cancelButton="none"
              @confirm="onGoodsSearch"
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
    <uni-popup
      ref="supplierPopup"
      type="bottom"
      :safe-area="false"
    >
      <view class="supplier-popup">
        <view class="supplier-popup-header">
          <view class="supplier-popup-header-title">
            <text>选择供应商</text>
            <view class="supplier-popup-header-add" @click="toSupplierForm">
              <uni-icons type="plus" size="24" />
            </view>
          </view>
          <view class="supplier-popup-header-close" @click="onSupplierPopupClose">
            <uni-icons type="closeempty" size="24" />
          </view>
        </view>
        <view class="supplier-content">
          <view class="supplier-content-search">
            <uni-search-bar
              v-model="suppliersSearchParams.name"
              placeholder="搜索供应商"
              cancelButton="none"
              @confirm="onSuppliersSearch"
            />
          </view>
          <view class="supplier-content-list">
            <SupplierCard
              v-for="item in supplierList"
              :key="item.id"
              :supplier="item"
              @select-supplier="onSupplierSelectedChange"
            />
          </view>
        </view>
      </view>
    </uni-popup>
    <fullscreen-popup
      ref="supplierFormPopup"
      title="新建供应商"
      @close="resetSupplierAdd"
    >
      <template #content>
        <SupplierForm v-model="supplierFormData" />
      </template>
      <template #footer>
        <view class="supplier-add-handles">
          <view class="supplier-add-handles-cancel" @click="onSupplierFormCancel">取消</view>
          <view class="supplier-add-handles-confirm" @click="onSupplierFormConfirm">保存</view>
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

.supplier-popup {
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 100vw;
  z-index: 999;
}

.supplier-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 0.5px solid #eee;
}

.supplier-popup-header-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.supplier-popup-header-add {
  margin-left: 12px;
}

.supplier-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.supplier-content-list {
  flex: 1;
  overflow-y: scroll;
  background-color: #f5f5f5;
  padding: 10px;
}

.purchase-form {
  background-color: #f5f5f5;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.purchase-form-group {
  background-color: #fff;
  padding: 0 12px;
  margin: 12px 0;
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

.purchase-form-item-content {
  font-size: 14px;
  line-height: 35px;
  color: #333;
  flex: 1;
}

.purchase-form-vertical-item .purchase-form-item-btn {
  width: 100%;
  height: 30px;
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
  flex: 1;
  align-items: center;
  height: 35px;
  line-height: 35px;
  font-size: 12px;
  color: #333;
}

.purchase-form-item-select-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 12px;
  text-align: right;
  font-size: 14px;
  color: #333;
}

.purchase-form-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  height: calc(50px + env(safe-area-inset-bottom));
  padding: 0 12px;
  background-color: #fff;
  margin-top: auto;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
}

.purchase-form-footer-confirm {
  flex: 1;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 6px;
  background-color: #007aff;
  color: #fff;
  box-sizing: border-box;
}

.purchase-form-footer-cancel {
  flex: 1;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 6px;
  border: 0.5px solid #007aff;
  color: #007aff;
  box-sizing: border-box;
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
