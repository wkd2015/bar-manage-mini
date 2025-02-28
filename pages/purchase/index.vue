<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import PurchaseCard from "./components/purchase-card/index.vue";
import {PurchaseService} from "../../services/purchase";

import { mockPurchaseList } from "../../services/mock";

const store = useStore();

const loadStatus = ref("more");
const contentText = ref({
  contentdown: "上拉显示更多",
  contentrefresh: "正在加载",
  contentnomore: "没有更多数据了",
});
const navbarInfo = computed(() => store.getters.navbarInfo);
const purchaseList = ref([]);

const getPurchaseList = async () => {
  const {data = {}} = await PurchaseService.getPurchaseList({})
  // console.warn(res)
  purchaseList.value = data.list || []
}

const onPurchaseCreate = () => {
  uni.navigateTo({
    url: "/pages/purchase/form",
  });
};

onMounted(async () => {
  console.log("6932938u");
  await getPurchaseList();
})
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar
      title="采购"
      :opacity="1"
    />
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
            @order-status-change="getPurchaseList"
          />
        </view>
        <uni-load-more :status="loadStatus" :content-text="contentText" />
      </scroll-view>
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
  min-height: 100vh;
  box-sizing: border-box;
}

.purchase-list {
  flex: 1;
  display: flex;
}

.scroll-view-container {
  padding: 12px 0;
  background-color: #f5f5f5;
  flex: 1;
}

.purchase-list-container {
  display: flex;
  flex-direction: column;
}
</style>
