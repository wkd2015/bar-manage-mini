<script setup>
import { computed, ref } from "vue";
import { onShow } from '@dcloudio/uni-app'
import { useStore } from "vuex";
import SupplierCard from "../purchase/components/supplier/supplier-card.vue";
import SupplierForm from "../purchase/components/supplier/supplier-form.vue";
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
const supplierFormPopup = ref(null);
const supplierFormData = ref({
  name: "",
  contactPerson: "",
  phone: "",
  address: "",
})

const getSupplierList = async (isRefresh) => {
  loadStatus.value = "loading";
  const params = {
    ...pageParams.value
  }
  const { data } = await SupplierService.getSuppliersByParams(params)
  const newList = data.list || []
  supplierList.value = isRefresh ? newList : [...supplierList.value, ...newList];
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

const onSupplierCreate = () => {
  supplierFormPopup.value.onPopupOpen();
}
const resetSupplierAdd = () => {
  supplierFormData.value = {
    name: "",
    estimatedPrice: 0,
    imageUrl: "",
    category: "",
  }
}
const onSupplierFormCancel = () => {
  resetSupplierAdd();
  supplierFormPopup.value.onPopupClose();
};
const onSupplierFormConfirm = async () => {
  await SupplierService.createSupplier(supplierFormData.value);
  resetSupplierAdd();
  supplierFormPopup.value.onPopupClose();
  await getSupplierList(true);
};

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
    <uni-fab
      horizontal="right"
      vertical="bottom"
      @fab-click="onSupplierCreate"
    />
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

.supplier-add-handles {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
  gap: 16px;
}

.supplier-add-handles-cancel {
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

.supplier-add-handles-confirm {
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
