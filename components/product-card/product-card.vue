<template>
  <uni-swipe-action>
    <uni-swipe-action-item
      :left-options="leftOptions"
      :right-options="rightOptions"
      @click="handleSwipeClick"
    >
      <view class="product-card">
        <!-- 商品主信息 -->
        <view class="product-main">
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <uni-tag
              :text="product.status"
              :type="product.status === '已开封' ? 'warning' : 'primary'"
              size="small"
            />
          </view>
          <uni-icons
            v-if="product.quantity < minStock"
            type="info-filled"
            color="#ff0000"
            size="16"
          />
        </view>

        <!-- 商品详细信息 -->
        <view class="product-details">
          <view class="detail-item">
            <text class="detail-label">总库存</text>
            <text class="detail-value">{{ product.quantity }}</text>
          </view>
          <view class="detail-item" v-if="currentTab !== 1">
            <text class="detail-label">已开封</text>
            <text class="detail-value">{{ product.openedQuantity || 0 }}</text>
          </view>
          <view class="detail-item" v-if="currentTab !== 2">
            <text class="detail-label">未开封</text>
            <text class="detail-value">{{
              product.quantity - (product.openedQuantity || 0)
            }}</text>
          </view>
        </view>

        <!-- 底部信息 -->
        <view class="product-footer">
          <text class="product-category">{{ product.category }}</text>
          <text class="product-time">{{ product.updateTime }}</text>
        </view>
      </view>
    </uni-swipe-action-item>
  </uni-swipe-action>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  minStock: {
    type: Number,
    default: 5,
  },
  currentTab: {
    type: Number,
    default: 0, // 0: 全部, 1: 未开封, 2: 已开封
  }
});

const emit = defineEmits(["swipe", "click"]);

// 滑动操作配置
// 计算属性：根据不同 tab 显示不同的滑动操作
const leftOptions = computed(() => {
  // 已开封状态不显示入库操作
  if (props.currentTab === 2) return [];
  return [{
    text: "入库",
    style: { backgroundColor: "#007aff" }
  }];
});

const rightOptions = computed(() => {
  const options = [];
  
  // 未开封状态才显示开封操作
  if (props.currentTab !== 2 && props.product.status !== '已开封') {
    options.push({
      text: '开封',
      style: { backgroundColor: '#ff9500' }
    });
  }
  
  // 所有状态都显示出库操作
  options.push({
    text: "出库",
    style: { backgroundColor: "#dd524d" }
  });
  
  return options;
});

const handleSwipeClick = (e) => {
  emit("swipe", {
    action: e.index === 0 ? "open" : "out",
    product: props.product,
  });
};
</script>

<style scoped>
.product-card {
  background-color: #fff;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.product-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
}

.product-details {
  background-color: #f8f8f8;
  border-radius: 6px;
  padding: 8px 20px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.detail-item {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #666;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.product-category {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
