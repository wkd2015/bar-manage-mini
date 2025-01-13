<script setup>
import { defineProps, defineModel } from 'vue';

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
</script>

<template>
  <view class="goods-form">
    <uni-forms
      ref="form"
      label-width="120"
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
        <view class="uni-forms-item-content">
          <uni-number-box
            v-model="formData.referencePrice"
          />
          <text>元(¥)</text>
        </view>
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

<style scoped>
.goods-form {
  background-color: #fff;
  padding: 20px;
}

.uni-forms-item-content {
  display: flex;
  height: 100%;
  align-items: center;
  gap: 10px;
}
</style>
