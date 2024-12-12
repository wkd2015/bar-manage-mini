<template>
  <view class="container">
    <!-- 导航栏 -->
    <uni-nav-bar
      title="库存管理"
      :fixed="true"
      status-bar
      background-color="#ffffff"
    />

    <!-- 搜索栏 -->
    <view class="search-box">
      <uni-search-bar
        v-model="searchText"
        placeholder="搜索商品"
        @confirm="onSearch"
        :radius="100"
      />
    </view>

    <!-- 标签栏 -->
    <view class="tabs">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index"
        :class="['tab-item', { active: currentTab === index }]"
        @tap="switchTab(index)"
      >
        <text>{{ tab }}</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <scroll-view 
      scroll-y 
      class="product-list"
      @scrolltolower="loadMore"
    >
      <uni-swipe-action>
        <uni-swipe-action-item
          v-for="item in filteredProducts"
          :key="item.id"
          :left-options="leftOptions"
          :right-options="rightOptions"
          @click="handleSwipeClick($event, item)"
        >
          <view class="product-card">
            <view class="product-main">
              <text class="product-name">{{ item.name }}</text>
              <text :class="['product-status', item.status === '已开封' ? 'opened' : '']">
                {{ item.status }}
              </text>
            </view>
            <view class="product-sub">
              <text class="product-quantity">库存: {{ item.quantity }}</text>
              <text class="product-time">{{ item.updateTime }}</text>
            </view>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </scroll-view>

    <!-- 底部操作按钮 -->
    <view class="bottom-bar">
      <button class="btn-primary" @tap="showInStockAction">入库</button>
      <button class="btn-danger" @tap="showOutStockAction">出库</button>
    </view>

    <!-- 入库操作 ActionSheet -->
    <uni-popup ref="inStockActionPopup" type="bottom">
      <view class="action-sheet">
        <view class="action-sheet-header">
          <text class="action-sheet-title">选择商品</text>
          <button class="btn-add" @tap="showAddProduct">新增商品</button>
        </view>
        <scroll-view scroll-y class="action-sheet-content">
          <view 
            class="action-sheet-item"
            v-for="item in products"
            :key="item.id"
            @tap="selectProductForInStock(item)"
          >
            <text>{{ item.name }}</text>
            <text class="item-quantity">当前库存: {{ item.quantity }}</text>
          </view>
        </scroll-view>
      </view>
    </uni-popup>

    <!-- 出库操作 ActionSheet -->
    <uni-popup ref="outStockActionPopup" type="bottom">
      <view class="action-sheet">
        <view class="action-sheet-header">
          <text class="action-sheet-title">选择操作商品</text>
        </view>
        <scroll-view scroll-y class="action-sheet-content">
          <view 
            class="action-sheet-item"
            v-for="item in products"
            :key="item.id"
          >
            <view class="item-main">
              <text>{{ item.name }}</text>
              <text class="item-quantity">当前库存: {{ item.quantity }}</text>
            </view>
            <view class="item-actions">
              <button 
                class="btn-small"
                :disabled="item.status === '已开封'"
                @tap="handleOpen(item)"
              >
                开封
              </button>
              <button 
                class="btn-small btn-danger"
                @tap="showQuantityInput(item)"
              >
                出库
              </button>
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>

    <!-- 新增商品弹窗 -->
    <uni-popup ref="addProductPopup" type="center">
      <view class="popup-content">
        <view class="popup-title">新增商品</view>
        <uni-forms :model="newProductForm" :rules="rules" ref="newProductForm">
          <uni-forms-item label="商品名称" name="name">
            <uni-easyinput
              v-model="newProductForm.name"
              placeholder="请输入商品名称"
            />
          </uni-forms-item>
          <uni-forms-item label="初始库存" name="quantity">
            <uni-number-box
              v-model="newProductForm.quantity"
              :min="0"
            />
          </uni-forms-item>
          <uni-forms-item label="商品类型" name="category">
            <uni-data-select
              v-model="newProductForm.category"
              :localdata="categories"
              @change="handleCategoryChange"
            />
          </uni-forms-item>
          <!-- 新增类型入口 -->
          <view class="add-category" @tap="showAddCategory">
            <text class="add-icon">+</text>
            <text>新增商品类型</text>
          </view>
        </uni-forms>
        <view class="popup-buttons">
          <button class="btn-cancel" @tap="closeAddProduct">取消</button>
          <button class="btn-confirm" @tap="confirmAddProduct">确认</button>
        </view>
      </view>
    </uni-popup>

    <!-- 新增类型弹窗 -->
    <uni-popup ref="addCategoryPopup" type="center">
      <view class="popup-content">
        <view class="popup-title">新增商品类型</view>
        <uni-forms :model="newCategoryForm" :rules="categoryRules" ref="newCategoryForm">
          <uni-forms-item label="类型名称" name="name">
            <uni-easyinput
              v-model="newCategoryForm.name"
              placeholder="请输入类型名称"
            />
          </uni-forms-item>
        </uni-forms>
        <view class="popup-buttons">
          <button class="btn-cancel" @tap="closeAddCategory">取消</button>
          <button class="btn-confirm" @tap="confirmAddCategory">确认</button>
        </view>
      </view>
    </uni-popup>

    <!-- 数量输入弹窗 -->
    <uni-popup ref="quantityPopup" type="center">
      <view class="popup-content">
        <view class="popup-title">{{ isInStock ? '入库' : '出库' }}数量</view>
        <view class="quantity-input">
          <uni-number-box
            v-model="operationQuantity"
            :min="1"
            :max="isInStock ? 999 : selectedProduct?.quantity || 999"
          />
        </view>
        <view class="popup-buttons">
          <button class="btn-cancel" @tap="closeQuantityPopup">取消</button>
          <button class="btn-confirm" @tap="confirmQuantityOperation">确认</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 状态管理
const searchText = ref('')
const currentTab = ref(0)
const tabs = ['全部', '未开封', '已开封']

// 弹窗引用
const inStockActionPopup = ref(null)
const outStockActionPopup = ref(null)
const addProductPopup = ref(null)
const addCategoryPopup = ref(null)
const quantityPopup = ref(null)

// 商品数据
const products = ref([
  {
    id: 1,
    name: '五粮液',
    quantity: 10,
    status: '未开封',
    category: '白酒',
    updateTime: '12-12 14:30'
  },
  {
    id: 2,
    name: '茅台',
    quantity: 5,
    status: '已开封',
    category: '白酒',
    updateTime: '12-12 13:20'
  }
])

// 商品类型
const categories = ref([
  { value: '白酒', text: '白酒' },
  { value: '红酒', text: '红酒' },
  { value: '啤酒', text: '啤酒' }
])

// 表单数据
const newProductForm = ref({
  name: '',
  quantity: 0,
  category: ''
})

const newCategoryForm = ref({
  name: ''
})

// 操作相关
const selectedProduct = ref(null)
const operationQuantity = ref(1)
const isInStock = ref(true)

// 滑动操作配置
const leftOptions = [
  {
    text: '入库',
    style: {
      backgroundColor: '#007aff'
    }
  }
]

const rightOptions = [
  {
    text: '出库',
    style: {
      backgroundColor: '#dd524d'
    }
  }
]

// 表单验证规则
const rules = {
  name: {
    rules: [
      { required: true, errorMessage: '请输入商品名称' }
    ]
  },
  category: {
    rules: [
      { required: true, errorMessage: '请选择商品类型' }
    ]
  }
}

const categoryRules = {
  name: {
    rules: [
      { required: true, errorMessage: '请输入类型名称' }
    ]
  }
}

// 计算属性：过滤后的商品列表
const filteredProducts = computed(() => {
  let result = [...products.value]
  
  if (searchText.value) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchText.value.toLowerCase())
    )
  }
  
  if (currentTab.value !== 0) {
    const status = currentTab.value === 1 ? '未开封' : '已开封'
    result = result.filter(item => item.status === status)
  }
  
  return result
})

// 方法
const switchTab = (index) => {
  currentTab.value = index
}

const showInStockAction = () => {
  inStockActionPopup.value.open()
  isInStock.value = true
}

const showOutStockAction = () => {
  outStockActionPopup.value.open()
  isInStock.value = false
}

const handleSwipeClick = (e, item) => {
  selectedProduct.value = item
  if (e.index === 0) {
    isInStock.value = true
    quantityPopup.value.open()
  } else {
    isInStock.value = false
    quantityPopup.value.open()
  }
}

const showAddProduct = () => {
  inStockActionPopup.value.close()
  addProductPopup.value.open()
}

const showAddCategory = () => {
  addCategoryPopup.value.open()
}

const selectProductForInStock = (product) => {
  selectedProduct.value = product
  isInStock.value = true
  inStockActionPopup.value.close()
  quantityPopup.value.open()
}

const handleOpen = (product) => {
  // 实现开封逻辑
  const index = products.value.findIndex(item => item.id === product.id)
  if (index !== -1) {
    products.value[index].status = '已开封'
  }
  uni.showToast({
    title: '已开封',
    icon: 'success'
  })
}

const confirmQuantityOperation = () => {
  if (!selectedProduct.value) return
  
  const index = products.value.findIndex(item => item.id === selectedProduct.value.id)
  if (index !== -1) {
    if (isInStock.value) {
      products.value[index].quantity += operationQuantity.value
    } else {
      if (products.value[index].quantity >= operationQuantity.value) {
        products.value[index].quantity -= operationQuantity.value
      } else {
        uni.showToast({
          title: '库存不足',
          icon: 'none'
        })
        return
      }
    }
    products.value[index].updateTime = formatTime(new Date())
  }
  
  quantityPopup.value.close()
  uni.showToast({
    title: isInStock.value ? '入库成功' : '出库成功',
    icon: 'success'
  })
}

const confirmAddProduct = async () => {
  try {
    await newProductForm.value.validate()
    products.value.push({
      id: products.value.length + 1,
      ...newProductForm.value,
      status: '未开封',
      updateTime: formatTime(new Date())
    })
    addProductPopup.value.close()
    uni.showToast({
      title: '添加成功',
      icon: 'success'
    })
  } catch (e) {
    console.error(e)
  }
}

const confirmAddCategory = async () => {
  try {
    await newCategoryForm.value.validate()
    categories.value.push({
      value: newCategoryForm.value.name,
      text: newCategoryForm.value.name
    })
    addCategoryPopup.value.close()
    uni.showToast({
      title: '添加成功',
      icon: 'success'
    })
  } catch (e) {
    console.error(e)
  }
}

// 工具函数
const formatTime = (date) => {
  const mm = (date.getMonth() + 1).toString().padStart(2, '0')
  const dd = date.getDate().toString().padStart(2, '0')
  const hh = date.getHours().toString().padStart(2, '0')
  const mi = date.getMinutes().toString().padStart(2, '0')
  return `${mm}-${dd} ${hh}:${mi}`
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.search-box {
  padding: 10px;
  background-color: #fff;
}

.tabs {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

/* 接上面的样式继续 */
.tab-item {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.tab-item.active {
  color: #007aff;
  position: relative;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 2px;
  background-color: #007aff;
}

.product-list {
  flex: 1;
  padding: 10px;
}

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
  margin-bottom: 4px;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
}

.product-status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: #e8f3ff;
  color: #007aff;
}

.product-status.opened {
  background-color: #fff3e8;
  color: #ff9500;
}

.product-sub {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.bottom-bar {
  padding: 10px 15px;
  background-color: #fff;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.btn-primary,
.btn-danger {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #007aff;
  color: #fff;
}

.btn-danger {
  background-color: #ff3b30;
  color: #fff;
}

.action-sheet {
  background-color: #fff;
  border-radius: 16px 16px 0 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.action-sheet-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.action-sheet-title {
  font-size: 16px;
  font-weight: 500;
}

.btn-add {
  font-size: 14px;
  color: #007aff;
  background: none;
  padding: 5px 10px;
}

.action-sheet-content {
  max-height: 60vh;
}

.action-sheet-item {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}

.item-main {
  flex: 1;
}

.item-quantity {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.btn-small {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.btn-small.btn-danger {
  background-color: #ff3b30;
  color: #fff;
}

.popup-content {
  background-color: #fff;
  border-radius: 12px;
  width: 280px;
  padding: 20px;
}

.popup-title {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
}

.popup-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  height: 36px;
  border-radius: 18px;
  font-size: 14px;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #333;
}

.btn-confirm {
  background-color: #007aff;
  color: #fff;
}

.quantity-input {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.add-category {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 0;
  color: #007aff;
}

.add-icon {
  font-size: 18px;
  font-weight: bold;
}

/* 适配 iPhone 安全区域 */
.safe-area-inset-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
