<script setup>
import { ref, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useStore } from "vuex";
import PurchaseCard from "./components/purchase-card/index.vue";
import { PurchaseService } from "../../services/purchase";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);
const userInfo = computed(() => store.getters.userInfo);

const loadStatus = ref("more");
const contentText = ref({
  contentdown: "上拉显示更多",
  contentrefresh: "正在加载",
  contentnomore: "没有更多数据了",
});
const purchaseList = ref([]);
const pageParams = ref({
  currentPage: 1,
  pageSize: 10,
});

const getPurchaseList = async (isRefresh) => {
  loadStatus.value = "loading";
  const params = {
    ...pageParams.value,
    shopId: userInfo.value.shopId,
  };
  const { data = {} } = await PurchaseService.getPurchaseList(params);
  console.warn(data);
  const newList = data.list || [];
  purchaseList.value = isRefresh
    ? newList
    : [...purchaseList.value, ...newList];
  const isLast = data.pageInfo.currentPage === data.pageInfo.totalPage;
  loadStatus.value = isLast ? "nomore" : "more";
};

const onPurchaseCreate = () => {
  uni.navigateTo({
    url: "/pages/purchase/form",
  });
};

const onReachBottom = async () => {
  if (loadStatus.value !== "nomore") {
    pageParams.value = {
      ...pageParams.value,
      currentPage: pageParams.value.currentPage + 1,
    };
    await getPurchaseList();
  } else {
    return;
  }
};

onShow(async () => {
  console.warn("onShow");
  await getPurchaseList(true);
});
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="采购" />
    <view class="page-content">
      <view class="page-content-header">
        <view class="data-overview">
          <view class="data-overview-item">
            <view class="data-overview-item-value">248</view>
            <view class="data-overview-item-label">待处理</view>
          </view>
          <view class="data-overview-item">
            <view class="data-overview-item-value">56</view>
            <view class="data-overview-item-label">待入库</view>
          </view>
          <view class="data-overview-item">
            <view class="data-overview-item-value">￥1000</view>
            <view class="data-overview-item-label">本月采购额</view>
          </view>
        </view>
        <view class="page-content-header-search">
          <uni-search-bar class="page-content-header-search-input" placeholder="搜索订单" @confirm="onSearch" />
          <view class="page-content-header-search-filter">⚙️</view>
        </view>
      </view>
      <!-- TODO: 采购列表搜索 -->
      <!-- TODO: 采购列表筛选可入库订单（按照角色权限区分提醒） -->
      <!-- TODO: 滚动列表组件封装 -->
      <!-- TODO: 库存列表加滚动功能 -->
      <!-- TODO: 新增店铺功能 -->
      <view class="page-content-body">
        <!-- <view class="purchase-search">
        <view class="purchase-search-box">
          <uni-search-bar
            v-model="searchText"
            placeholder="搜索订单"
            @confirm="onSearch"
          />
        </view>
        <view class="purchase-search-filter" @click="openFilterPopup">
          <image
            src="../../static/imgs/filter-icon.png"
            class="purchase-search-filter-icon"
          />
        </view>
      </view> -->
        <view class="purchase-list">
          <scroll-view
            scroll-y
            @scrolltolower="onReachBottom"
            class="scroll-view-container"
          >
            <view class="purchase-list-container">
              <PurchaseCard
                :purchaseParams="item"
                v-for="item in purchaseList"
                :key="item.id"
                @order-status-change="() => getPurchaseList(true)"
              />
            </view>
            <uni-load-more :status="loadStatus" :content-text="contentText" />
          </scroll-view>
        </view>
      </view>
    </view>
    <uni-fab
      horizontal="right"
      vertical="bottom"
      @fab-click="onPurchaseCreate"
    />
    <tabbar-shadow />
  </view>
</template>

<style scoped>
.container {
  margin: 0 auto;
  background-color: #f6f6f6;
  height: 100vh; /* 固定高度 */
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-content-header {
  background: linear-gradient(180deg, #1565c0 0%, #1565c0 10%, #2979ff 100%);
  color: #fff;
  padding: 0 32rpx 60rpx;
  width: 100%;
  box-sizing: border-box;
  margin-top: -1px;
}

.data-overview {
  display: flex;
  justify-content: space-between;
  margin: 10rpx 0 40rpx;
}

.data-overview-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  position: relative;
}

.data-overview-item:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 25%;
  width: 1px;
  height: 50%;
  background-color: rgba(255, 255, 255, 0.3);
}

.data-overview-item-label {
  font-size: 12px;
  opacity: 0.8;
}

.data-overview-item-value {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4rpx;
}

.page-content-header-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-content-header-search-input {
  width: 100%;
}

:deep(.page-content-header-search-input .uni-searchbar__box) {
  background-color: rgba(255, 255, 255, 0.2)!important;
}

:deep(.page-content-header-search-input .uni-searchbar__box-icon-search) {
  color: rgba(255, 255, 255, 0.8)!important;
}

:deep(.page-content-header-search-input .uni-searchbar__box-search-input) {
  color: #fff!important;
  background-color: transparent!important;
}

:deep(.page-content-header-search-input .uni-searchbar__text-placeholder) {
  color: rgba(255, 255, 255, 0.8)!important;
}

:deep(.page-content-header-search-input .uni-searchbar__cancel) {
  color: #fff!important;
}

.page-content-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f0f7ff 0%, #f8fbff 50%, #ffffff 100%);
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  margin-top: -40rpx;
}

.purchase-list {
  height: 100%;
}

.scroll-view-container {
  height: 100%;
  padding: 12px 0;
  background-color: #f5f5f5;
}

.purchase-list-container {
  display: flex;
  flex-direction: column;
}
</style>
