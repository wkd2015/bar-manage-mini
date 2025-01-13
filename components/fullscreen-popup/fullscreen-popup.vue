<script setup>
import { ref, computed, defineProps, defineExpose, defineEmits } from "vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
  title: {
    type: String,
    default: "",
  }
})
const emit = defineEmits(["close", "open"])
const fullscreenPopup = ref(null);
const navbarInfo = computed(() => store.getters.navbarInfo);

const onPopupClose = () => {
  emit("close");
  fullscreenPopup.value.close();
}

const onPopupOpen = () => {
  emit("open");
  fullscreenPopup.value.open();
}

defineExpose({
  onPopupClose,
  onPopupOpen
})
</script>

<template>
  <uni-popup ref="fullscreenPopup" :safe-area="false" type="right">
    <view
      class="action-sheet"
      :style="`padding-top: ${navbarInfo.statusBarHeight}px;`"
    >
      <view
        class="action-sheet-header"
        :style="`padding: 0 ${navbarInfo.menuButtonWidth}px; height: ${navbarInfo.navHeight}px;`"
      >
        <view class="action-sheet-header-close" @click="onPopupClose">
          <uni-icons type="left" size="24" />
        </view>
        <text class="action-sheet-title">{{ title }}</text>
      </view>
      <view class="action-sheet-content">
        <slot name="content"></slot>
      </view>
      <view class="action-sheet-footer">
        <slot name="footer"></slot>
      </view>
    </view>
  </uni-popup>
</template>

<style scoped>
.action-sheet {
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  z-index: 999;
}

.action-sheet-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-bottom: 0.5px solid #eee;
}

.action-sheet-header-close {
  position: absolute;
  left: 12px;
}

.action-sheet-title {
  font-size: 16px;
  font-weight: 500;
}

.action-sheet-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  background-color: #f5f5f5;
}

.action-sheet-footer {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 0 12px;
}
</style>
