<template>
  <view class="container">
    <navbar title="批量入库"></navbar>
    <view class="page-content">
      <view class="page-content-card">
        <view class="import-excel-btn">
          <text>导入Excel表格</text>
        </view>
        <view class="import-excel-template">
          <text>请按照模板格式填写数据</text>
          <text>模板下载</text>
        </view>
        <view class="import-excel-tips">
          支持.xlsx、.xls、.csv格式文件，文件大小不超过5MB
        </view>
      </view>
      <view class="page-content-card">
        <view class="scan-icon">📷</view>
        <view class="scan-text">点击扫描商品条码</view>
        <view class="scan-tips">
          自动添加商品到列表
        </view>
      </view>
      <view class="page-content-card">
        <view class="stock-list-title">
          <text>手动录入</text>
        </view>
        <view class="stock-list-table">
          <view class="stock-list-table-header">
            <text>商品</text>
            <text>数量</text>
            <text>类型</text>
          </view>
          <view class="stock-list-table-body">
            <view class="stock-list-table-body-item">
              <easy-input v-model="stockList" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

