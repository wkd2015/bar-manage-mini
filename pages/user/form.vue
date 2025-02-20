<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import UserForm from "./components/user-form/index.vue";
import { StaffService } from "../../services/staff";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);

const formData = ref({
  id: 0,
  userName: "",
  phone: "",
  avatar: "",
  gender: 0,
});
const navTitle = computed(() => {
  return formData.value.id ? "编辑用户" : "注册用户";
})

const onNavClick = () => {
  uni.navigateBack({ delta: 1 });
}

const onFormChangeSubmit = async () => {
  const isEdit = !!formData.value.id;
  if (isEdit) {
    await StaffService.editStaff(formData.value);
  } else {
    await StaffService.createStaff(formData.value);
  }
  store.dispatch('setUserInfo');
  onNavClick();
}

onMounted(() => {
  const userInfo = store.getters.userInfo;
  formData.value = {
    ...formData.value,
    ...userInfo
  }
})
</script>

<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar :title="navTitle" class="navbar" :showNavBack="!!formData.id" :onNavClick="onNavClick"></navbar>
    <view class="user-form-content">
      <UserForm v-model="formData" />
      <view class="user-form-button">
        <button type="primary" @tap="onFormChangeSubmit">确认</button>
        <button type="default" v-if="!!formData.id">取消</button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
}

.user-form-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 12px;
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
