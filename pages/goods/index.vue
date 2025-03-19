<script setup>
import { computed, ref } from "vue";
import { onShow } from '@dcloudio/uni-app'
import { useStore } from "vuex";
import GoodsCard from "./components/goods-card/index.vue";
import GoodsForm from "./components/goods-form/index.vue";
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
const goodsFormPopup = ref(null);
const goodsFormData = ref({
  name: "",
  estimatedPrice: 0,
  imageUrl: "",
  category: "",
});

const getGoodsList = async (isRefresh) => {
  loadStatus.value = "loading";
  const params = {
    ...pageParams.value
  }
  const { data } = await ProductService.getProductList(params)
  const newList = data.list || []
  goodsList.value = isRefresh ? newList : [...goodsList.value, ...newList];
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

const onGoodCreate = () => {
  goodsFormPopup.value.onPopupOpen();
}

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
  await getGoodsList(true);
};

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
    <uni-fab
      horizontal="right"
      vertical="bottom"
      @fab-click="onGoodCreate"
    />
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
</style>
