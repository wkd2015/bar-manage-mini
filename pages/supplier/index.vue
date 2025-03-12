<script setup>
import { computed, ref } from "vue";
import { onShow } from '@dcloudio/uni-app'
import { useStore } from "vuex";
import SupplierCard from "../purchase/components/supplier/supplier-card.vue";
import { SupplierService } from "../../services/supplier";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);

const loadStatus = ref("more");
const contentText = ref({
  contentdown: "上拉显示更多",
  contentrefresh: "正在加载",
  contentnomore: "没有更多数据了",
});
const pageParams = ref({
  currentPage: 1,
  pageSize: 10
})
const supplierList = ref([]);

const getSupplierList = async () => {
  loadStatus.value = "loading";
  const params = {
    ...pageParams.value
  }
  const { data } = await SupplierService.getSuppliersByParams(params)
  const newList = data.list || []
  supplierList.value = [...supplierList.value, ...newList];
  const isLast = data.pageInfo.currentPage === data.pageInfo.totalPage
  loadStatus.value = isLast ? "nomore" : "more";
};

const onReachBottom = async () => {
	if (loadStatus.value !== 'nomore') {
    pageParams.value = {
      ...pageParams.value,
      currentPage: pageParams.value.currentPage + 1
    }
    await getSupplierList();
  } else {
    return
  }
}

const onNavClick = () => {
  uni.navigateBack({ delta: 1 });
}

onShow(async () => {
  await getSupplierList()
})
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="供应商管理" :opacity="1" showNavBack :onNavClick="onNavClick"></navbar>
    <view class="supplier-list">
      <scroll-view
        scroll-y
        @scrolltolower="onReachBottom"
        class="scroll-view-container"
      >
        <SupplierCard v-for="item in supplierList" :key="item.id" :supplier="item" :displayOnly="true" />
        <uni-load-more :status="loadStatus" :content-text="contentText" />
      </scroll-view>
    </view>
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

.supplier-list {
  height: 100%;
}

.scroll-view-container {
  height: 100%;
  padding: 12px 0;
  background-color: #f5f5f5;
}
</style>
