<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="库存" :opacity="1"></navbar>
    <view class="stock-content" :style="`height: calc(100vh - ${navbarInfo.barHeight}px);`">
      <view class="stock-search">
        <view class="stock-search-box">
          <uni-search-bar
            v-model="searchText"
            placeholder="搜索商品"
            @confirm="onSearch"
          />
        </view>
        <view class="stock-search-filter" @click="openFilterPopup">
          <image
            src="../../static/imgs/filter-icon.png"
            class="stock-search-filter-icon"
          />
        </view>
      </view>

      <view class="stock-list">
        <StockCard 
          v-for="item in stockList"
          :key="item.id"
          :stock-info="item"
          @open="openStockPopup"
          @in-stock="handleInStock"
          @out-stock="handleOutStock"
        />
      </view>
      <view class="stock-bottom">
        <view class="stock-bottom-out" @click="openPurchaseStockInPopup">批量出库</view>
        <view class="stock-bottom-open" @click="openPurchaseStockOutPopup">批量开封</view>
      </view>
    </view>
    <uni-popup
      ref="filterPopup"
      type="right"
    >
      <view class="filter-popup">
        <view class="filter-popup-content" :style="`padding-top: ${navbarInfo.barHeight}px;`">
          <view class="filter-popup-content-item">
            <text class="filter-popup-content-item-label">开封状态</text>
            <view class="filter-popup-content-item-content">
              <uni-data-checkbox
                v-model="filterParams.openStatus"
                :localdata="filterOpenStatusList"
                mode="tag"
                size="small"
              />
            </view>
          </view>
          <view class="filter-popup-content-item">
            <text class="filter-popup-content-item-label">库存状态</text>
            <view class="filter-popup-content-item-content">
              <uni-data-checkbox
                v-model="filterParams.stockStatus"
                :localdata="filterStockStatusList"
                mode="tag"
                size="small"
              />
            </view>
          </view>
          <view class="filter-popup-content-btns">
            <view class="filter-popup-content-btns-reset" @click="onFilterReset">重置</view>
            <view class="filter-popup-content-btns-confirm" @click="onFilterConfirm">确定</view>
          </view>
        </view>
      </view>
    </uni-popup>
    <fullscreen-popup
      ref="purchaseStockInPopup"
      title="采购入库"
    >
      <template #content>
        <view class="purchase-stock-in-popup">
          <view class="purchase-stock-in-popup-content">
          </view>
        </view>
      </template>
    </fullscreen-popup>
    <uni-fab
      horizontal="right"
      vertical="bottom"
      direction="vertical"
      :content="fabContentList"
      :popMenu="showFabContent"
      @trigger="onFabContentClick"
      @fabClick="onFabClick"
    />
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import StockCard from "./components/stock-card/index.vue";
import { mockStockList } from "../../services/mock";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);

const stockList = ref(mockStockList);
const filterOpenStatusList = ref([
  {value: 0, text: "全部"},
  {value: 1, text: "已开封"},
  {value: 2, text: "未开封"}
]);
const filterStockStatusList = ref([
  {value: 0, text: "全部"},
  {value: 1, text: "无库存"}
])
const filterParams = ref({
  searchText: "",
  openStatus: 0,
  stockStatus: 0,
  page: 1,
  pageSize: 10,
});
const filterPopup = ref(null);
const fabContentList = ref([
  {
    iconPath: "/static/imgs/purchase-stock-in.png",
    selectedIconPath: "/static/imgs/purchase-stock-in.png",
    text: "采购入库"
  },
  {
    iconPath: "/static/imgs/other-stock-in.png",
    selectedIconPath: "/static/imgs/other-stock-in.png",
    text: "其他入库"
  }
])
const showFabContent = ref(true)
const purchaseStockInPopup = ref(null);

const openFilterPopup = () => {
  filterPopup.value.open();
}
const closeFilterPopup = () => {
  filterPopup.value.close();
}
const onFilterReset = () => {
  filterParams.value = {
    searchText: "",
    openStatus: 0,
    stockStatus: 0,
    page: 1,
    pageSize: 10,
  };
  closeFilterPopup();
  getStockList();
}
const onFilterConfirm = () => {
  closeFilterPopup();
  getStockList();
}

const onFabContentClick = (clickFab) => {
  if (clickFab.index === 0) {
    purchaseStockInPopup.value.onPopupOpen();
  }
}
const onFabClick = () => {
  fabContentList.value = fabContentList.value.map((item) => Object.assign({}, item, {active: false}));
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.stock-content {
  display: flex;
  flex-direction: column;
}

.stock-search {
  padding-top: 10px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stock-search-box {
  flex: 1;
}

.stock-search-filter {
  padding-right: 10px;
  width: 24px;
  height: 24px;
}

.stock-search-filter-icon {
  width: 100%;
  height: 100%;
}

.stock-list {
  flex: 1;
  overflow-y: scroll;
  margin: 10px 0;
}

.filter-popup {
  height: 100vh;
  width: 80vw;
  background-color: #f5f5f5;
}

.filter-popup-content {
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  height: 50vh;
  display: flex;
  flex-direction: column;
}

.filter-popup-content-item {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.filter-popup-content-item-label {
  font-size: 14px;
  font-weight: bold;
}

:deep(.filter-popup-content-item .checklist-text) {
  font-size: 12px!important;
}

.filter-popup-content-btns {
  display: flex;
  flex: 1;
  align-items: flex-end;
  gap: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.filter-popup-content-btns-reset {
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #666;
  height: 28px;
}

.filter-popup-content-btns-confirm {
  flex: 1;
  background-color: #007aff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #fff;
  height: 28px;
}

.stock-bottom {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid #f5f5f5;
  font-size: 12px;
  gap: 5px;
  padding: 0 10px;
}

.stock-bottom-out,.stock-bottom-open {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  height: 32px;
  box-sizing: border-box;
  color: #fff;
}

.stock-bottom-out {
  background-color: #007aff;
}

.stock-bottom-open {
  background-color: #18bc37;
}

:deep(.uni-fab--rightBottom) {
  bottom: 90px!important;
}
:deep(.uni-fab__circle--rightBottom) {
  bottom: 90px!important;
}
</style>
