<script setup>
const formData = defineModel({
  id: 0,
  name: "",
  contactPerson: "",
  address: "",
  phone: "",
  email: "",
  createdTime: 0,
  updatedTime: 0
})
</script>

<template>
  <view class="supplier-form">
    <uni-forms
      ref="form"
      :label-width="120"
    >
      <uni-forms-item
        required
        label="供应商名称"
      >
        <uni-easyinput
          v-model="formData.name"
          type="text"
          placeholder="请输入供应商名称"
        />
      </uni-forms-item>
      <uni-forms-item
        required
        label="联系人"
      >
        <uni-easyinput
          v-model="formData.contactPerson"
          type="text"
          placeholder="请输入联系人"
        />
      </uni-forms-item>
      <uni-forms-item
        required
        label="联系电话"
      >
        <uni-easyinput
          v-model="formData.phone"
          type="text"
          placeholder="请输入联系电话"
        />
      </uni-forms-item>
      <uni-forms-item
        required
        label="联系地址"
      >
        <uni-easyinput
          v-model="formData.address"
          type="text"
          placeholder="请输入联系地址"
        />
      </uni-forms-item>
    </uni-forms>
  </view>
</template>

<style lang="scss" scoped>
.supplier-form {
  background-color: #fff;
  padding: 20px;
}
</style>
