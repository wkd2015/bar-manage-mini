<script setup>
import { defineModel, ref, watch } from 'vue';

const formData = defineModel({
    name: "",
    estimatedPrice: 0,
    imageUrl: "",
    category: ""
})
const renderImageUrl = ref([])

const onImageSelect = (e) => {
	const tempFilePaths = e.tempFilePaths
  wx.cloud.uploadFile({
    cloudPath: `goods/imgs/${formData.value.name}-${Date.now()}.png`,
    filePath: tempFilePaths[0],
    config: {
      env: "prod-0glco3k7aad42178"
    },
    success: (res) => {
      const { fileID = '' } = res || {};
      wx.cloud.getTempFileURL({
        fileList: [fileID],
        success: (res) => {
          renderImageUrl.value = [{
            url: res.fileList[0].tempFileURL,
            name: 'file',
            extname: 'png'
          }]
        }
      })
    }
  })
}

watch(() => formData.value.imageUrl, (newVal) => {
  if (newVal) {
    renderImageUrl.value = [{
      url: newVal,
      name: 'file',
      extname: 'png'
    }];
  } else {
    renderImageUrl.value = [];
  }
}, { immediate: true })

watch(() => renderImageUrl.value, (newVal) => {
  const latestUrl = newVal[0]?.url || ''
  if(formData.value.imageUrl !== latestUrl) {
    formData.value = {
      ...formData.value,
      imageUrl: latestUrl
    }
  }
}, { deep: true })
</script>

<template>
  <view class="goods-form">
    <uni-forms
      ref="form"
      :label-width="120"
    >
      <uni-forms-item
        required
        label="商品图片"
      >
      <uni-file-picker
        v-model="renderImageUrl"
        :limit="1"
        file-mediatype="image"
        @select="onImageSelect"
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
            v-model="formData.estimatedPrice"
            :min="0"
            :max="99999"
          />
          <text>元(¥)</text>
        </view>
      </uni-forms-item>
      <uni-forms-item
        required
        label="商品分类"
      >
        <uni-easyinput
          v-model="formData.category"
          type="text"
          placeholder="请输入商品分类"
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
