<script setup>
import { defineModel, ref } from 'vue';

const formData = defineModel({
    id: 0,
    userName: "",
    phone: "",
    avatar: "",
    gender: 0
})
const genderList = ref([
  {
    value: 1,
    text: "男"
  },
  {
    value: 2,
    text: "女"
  },
  {
    value: 0,
    text: "保密"
  }
])
</script>

<template>
  <view class="user-form">
    <uni-forms
      ref="form"
      :label-width="75"
    >
      <uni-forms-item
        label="头像"
      >
        <uni-file-picker
          v-model="formData.avatar"
          :limit="1"
          file-mediatype="image"
        />
      </uni-forms-item>
      <uni-forms-item
        required
        label="手机"
      >
        <uni-easyinput
          v-model="formData.phone"
          type="text"
          placeholder="请输入手机号码"
        />
      </uni-forms-item>
      <uni-forms-item
        required
        label="姓名"
      >
        <uni-easyinput
          v-model="formData.userName"
          type="text"
          placeholder="请输入姓名"
        />
      </uni-forms-item>
      <uni-forms-item
        label="性别"
      >
        <uni-data-checkbox
          v-model="formData.gender"
          :localdata="genderList"
          mode="tag"
          size="large"
        />
      </uni-forms-item>
    </uni-forms>
  </view>
</template>
