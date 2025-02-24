<script setup>
const props = defineProps({
  supplier: {
    type: Object,
    default: () => ({
      id: 0,
      name: "",
      contactPerson: "",
      address: "",
      phone: "",
      email: ""
    })
  }
})

const emit = defineEmits(["click"])

const onCardClick = () => {
  emit("select-supplier", props.supplier)
}
</script>

<template>
  <view class="supplier-card" @click="onCardClick">
    <view class="supplier-card-header">{{ supplier.name }}</view>
    <view class="supplier-card-content">
      <view class="supplier-card-content-item">
        联系人:{{ supplier.contactPerson }}
      </view>
      <view class="supplier-card-content-item">地址:{{ supplier.address }}</view>
      <view class="supplier-card-content-item">电话:{{ supplier.phone }}</view>
      <view class="supplier-card-content-item">邮箱:{{ supplier.email || "-" }}</view>
    </view>
  </view>
</template>

<style scoped>
.supplier-card {
  padding: 12px;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 10px;
  border-bottom: 0.5px solid #eee;
}

.supplier-card-header {
  font-size: 16px;
  font-weight: bold;
}

.supplier-card-content {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  gap: 4px;
  font-size: 12px;
  color: #666;
}
</style>
