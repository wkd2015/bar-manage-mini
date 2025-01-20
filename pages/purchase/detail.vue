<script setup>
import { ref, computed, onMounted } from "vue";
import { onLoad } from '@dcloudio/uni-app'
import { useStore } from "vuex";
import { PURCHASE_STATUS_MAP } from "../../constants/purchase";

const store = useStore();
const statusOptions = Object.values(PURCHASE_STATUS_MAP).map((item) => ({
  title: item.label
}));

const navbarInfo = computed(() => store.getters.navbarInfo);

const onNavClick = () => {
  uni.navigateBack({ delta: 1 });
}

onLoad(async (option) => {
  console.warn(option);
});
</script>

<template>
  <view
    class="purchase-detail"
    :style="`padding-top: ${navbarInfo.barHeight}px;`"
  >
    <navbar title="采购详情" class="navbar" showNavBack :onNavClick="onNavClick"></navbar>
    <view class="purchase-detail-content">
      <view class="purchase-status">
        <uni-steps
          :options="statusOptions"
          :active="2"
          direction="column"
        />
      </view>
      <view class="purchase-info"></view>
      <view class="purchase-goods"></view>
      <view class="purchase-footer"></view>
    </view>
  </view>
</template>
