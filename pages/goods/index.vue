<script setup>
import { computed, ref } from "vue";
import { onShow } from '@dcloudio/uni-app'
import { useStore } from "vuex";
import GoodsCard from "./components/goods-card/index.vue";
import { ProductService } from "../../services/product";

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
const goodsList = ref([]);

const getGoodsList = async () => {
  loadStatus.value = "loading";
  const params = {
    ...pageParams.value
  }
  const { data } = await ProductService.getProductList(params)
  const newList = data.list || []
  goodsList.value = [...goodsList.value, ...newList];
  const isLast = data.pageInfo.currentPage === data.pageInfo.totalPage
  loadStatus.value = isLast ? "nomore" : "more";
};

const onReachBottom = async () => {
	if (loadStatus.value !== 'nomore') {
    pageParams.value = {
      ...pageParams.value,
      currentPage: pageParams.value.currentPage + 1
    }
    await getGoodsList();
  } else {
    return
  }
}

const onNavClick = () => {
  uni.navigateBack({ delta: 1 });
}

onShow(async () => {
  await getGoodsList()
})
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="商品管理" :opacity="1" showNavBack :onNavClick="onNavClick"></navbar>
    <view class="goods-list">
      <scroll-view
        scroll-y
        @scrolltolower="onReachBottom"
        class="scroll-view-container"
      >
        <GoodsCard v-for="item in goodsList" :key="item.id" :goods="item" :displayOnly="true" />
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

.goods-list {
  height: 100%;
}

.scroll-view-container {
  height: 100%;
  padding: 12px 0;
  background-color: #f5f5f5;
}
</style>
