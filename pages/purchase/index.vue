<script setup>
import { ref, computed } from "vue";
import { onShow } from '@dcloudio/uni-app'
import { useStore } from "vuex";
import PurchaseCard from "./components/purchase-card/index.vue";
import {PurchaseService} from "../../services/purchase";

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
  pageSize: 10
})

const getPurchaseList = async (isRefresh) => {
  loadStatus.value = "loading";
  const params = {
    ...pageParams.value,
    shopId: userInfo.value.shopId
  }
  const {data = {}} = await PurchaseService.getPurchaseList(params)
  console.warn(data)
  const newList = data.list || []
  purchaseList.value = isRefresh ? newList : [...purchaseList.value, ...newList];
  const isLast = data.pageInfo.currentPage === data.pageInfo.totalPage
  loadStatus.value = isLast ? "nomore" : "more";
}

const onPurchaseCreate = () => {
  uni.navigateTo({
    url: "/pages/purchase/form",
  });
};

const onReachBottom = async () => {
	if (loadStatus.value !== 'nomore') {
    pageParams.value = {
      ...pageParams.value,
      currentPage: pageParams.value.currentPage + 1
    }
    await getPurchaseList();
  } else {
    return
  }
}

onShow(async () => {
  console.warn('onShow')
  await getPurchaseList(true)
})
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar
      title="采购"
      :opacity="1"
    />
    <!-- TODO: 采购列表搜索 -->
    <!-- TODO: 采购列表筛选可入库订单（按照角色权限区分提醒） -->
     <!-- TODO: 滚动列表组件封装 -->
    <!-- TODO: 库存列表加滚动功能 -->
     <!-- TODO: 新增店铺功能 -->
    <view class="purchase-content" :style="`height: calc(100vh - ${navbarInfo.barHeight}px);`">
      <view class="purchase-search">
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
      </view>
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
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
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
