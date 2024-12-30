<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import purchaseCard from "./components/purchase-card/index.vue";

import { mockPurchaseList } from "../../services/mock";

const store = useStore();


const loadStatus = ref('more')
const contentText = ref({
	contentdown: '上拉显示更多',
	contentrefresh: '正在加载',
	contentnomore: '没有更多数据了'
})
const navbarInfo = computed(() => store.getters.navbarInfo);

const onPurchaseCreate = () => {
  uni.navigateTo({
    url: "/pages/purchase/form",
  });
};
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="采购" class="navbar"></navbar>
    <view class="purchase-list">
			<scroll-view scroll-y @scrolltolower="onReachBottom" class="scroll-view-container">
        <view class="purchase-list-container">
          <purchaseCard :purchaseParams="item" v-for="item in mockPurchaseList" :key="item.id" />
        </view>
        <uni-load-more :status="loadStatus" :content-text="contentText" />
      </scroll-view>
    </view>
    <uni-fab
      horizontal="right"
      vertical="bottom"
      @fab-click="onPurchaseCreate"
    />
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
  gap: 12px;
}
</style>