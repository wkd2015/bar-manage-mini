<script setup>
import { defineProps, ref, computed, defineModel } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

const formData = defineModel({
    name: "",
    referencePrice: 0,
    thumbnail: "",
    unit: ""
})
const isEditForm = computed(() => !!props.id)
</script>

<template>
  <view class="goods-form">
    <uni-forms
      ref="form"
    >
      <uni-forms-item
        required
        label="商品图片"
      >
      <uni-file-picker
        v-model="formData.thumbnail"
        :limit="9"
        file-mediatype="image"
      />
      </uni-forms-item>
      <uni-forms-item
        required
        label="商品名称"
      >
        <uni-easyinput
          v-model="formData.name"
          type="text"
          placeholder="请输入商品名称"
        />
      </uni-forms-item>
      <uni-forms-item
        required
        label="参考价格"
      >
        <uni-number-box
          v-model="formData.referencePrice"
        />
      </uni-forms-item>
      <uni-forms-item
        required
        label="商品单位"
      >
        <uni-easyinput
          v-model="formData.unit"
          type="text"
          placeholder="请输入商品单位"
        />
      </uni-forms-item>
    </uni-forms>
  </view>
</template>

<style scoped></style>
