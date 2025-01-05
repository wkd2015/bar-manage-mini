<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const navbarInfo = computed(() => store.getters.navbarInfo);
</script>

<template>
  <view
    class="purchase-detail"
    :style="`padding-top: ${navbarInfo.barHeight}px;`"
  >
    <navbar title="采购详情" class="navbar"></navbar>
    <view class="purchase-detail-content">
      <view class="purchase-status"></view>
      <view class="purchase-info"></view>
      <view class="purchase-goods"></view>
      <view class="purchase-footer"></view>
    </view>
  </view>
</template>
