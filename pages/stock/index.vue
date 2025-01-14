<template>
  <view class="container" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="库存" :opacity="1"></navbar>
    <!-- <view class="stock-content">
      <view class="stock-search">
        <uni-search-bar
          v-model="searchText"
          placeholder="搜索商品"
          @confirm="onSearch"
        />
        <view class="stock-search-tabs">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            :class="['tab-item', { active: currentTab === index }]"
            @tap="switchTab(index)"
          >
            <text>{{ tab }}</text>
          </view>
        </view>
      </view>
    </view> -->

    <view class="search-box">
      <uni-search-bar
        v-model="searchText"
        placeholder="搜索商品"
        @confirm="onSearch"
        :radius="100"
      />
    </view>

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

    <scroll-view scroll-y class="product-list" @scrolltolower="loadMore">
      <product-card
        v-for="item in filteredProducts"
        :key="item.id"
        :product="item"
        :min-stock="5"
        :current-tab="currentTab"
        @swipe="handleProductSwipe"
      />
    </scroll-view>

    <view class="bottom-bar">
      <button class="btn-primary" @tap="showInStockAction">入库</button>
      <button class="btn-danger" @tap="showOutStockAction">出库</button>
    </view>

    <uni-popup ref="inStockActionPopup" type="bottom" :safe-area="false">
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

    <uni-popup ref="outStockActionPopup" type="bottom" :safe-area="false">
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

    <uni-popup ref="addProductPopup" type="center">
      <view class="popup-content">
        <view class="popup-title">新增商品</view>
        <uni-forms :model="newProductForm" :rules="rules" ref="newProductFormRef">
          <uni-forms-item label="商品名称" name="name">
            <uni-easyinput
              v-model="newProductForm.name"
              placeholder="请输入商品名称"
            />
          </uni-forms-item>
          <uni-forms-item label="初始库存" name="quantity">
            <uni-number-box v-model="newProductForm.quantity" :min="0" />
          </uni-forms-item>
          <uni-forms-item label="商品类型" name="category">
            <uni-data-select
              v-model="newProductForm.category"
              :localdata="categories"
              @change="handleCategoryChange"
            />
          </uni-forms-item>
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

    <uni-popup ref="openPopup" type="center">
      <view class="popup-content">
        <view class="popup-title">开封数量</view>
        <view class="quantity-input">
          <uni-number-box
            v-model="openQuantity"
            :min="1"
            :max="selectedProduct?.quantity || 999"
          />
        </view>
        <view class="popup-buttons">
          <button class="btn-cancel" @tap="closeOpenPopup">取消</button>
          <button class="btn-confirm" @tap="confirmQuantityOperation">确认</button>
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="addCategoryPopup" type="center">
      <view class="popup-content">
        <view class="popup-title">新增商品类型</view>
        <uni-forms
          :model="newCategoryForm"
          :rules="categoryRules"
          ref="newCategoryForm"
        >
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

    <uni-popup ref="quantityPopup" type="center">
      <view class="popup-content">
        <view class="popup-title">{{ isInStock ? "入库" : "出库" }}数量</view>
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
    <tabbar-shadow />
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const navbarInfo = computed(() => store.getters.navbarInfo);

// 基础状态管理
const searchText = ref("");
const currentTab = ref(0);
const tabs = ["全部", "未开封", "已开封"];

// 弹窗引用
const inStockActionPopup = ref(null);
const outStockActionPopup = ref(null);
const addProductPopup = ref(null);
const addCategoryPopup = ref(null);
const quantityPopup = ref(null);
const openPopup = ref(null);
const openQuantity = ref(1);

// 商品数据管理
const products = ref([
  {
    id: 1,
    name: "五粮液",
    quantity: 10,
    category: "白酒",
    updateTime: "12-12 14:30",
  },
  {
    id: 2,
    name: "茅台",
    quantity: 5,
    category: "白酒",
    updateTime: "12-12 13:20",
  }
]);
const currentProduct = ref(null);
const operationType = ref('');
const selectedProduct = ref(null);
const operationQuantity = ref(1);
const isInStock = ref(true);

// 商品类型数据
const categories = ref([
  { value: "白酒", text: "白酒" },
  { value: "红酒", text: "红酒" },
  { value: "啤酒", text: "啤酒" },
]);

// 表单数据
const newProductForm = ref({
  name: "",
  quantity: 0,
  category: "",
});
const newProductFormRef = ref(null);

const newCategoryForm = ref({
  name: "",
});

// 表单验证规则
const rules = {
  name: {
    rules: [{ required: true, errorMessage: "请输入商品名称" }],
  },
  category: {
    rules: [{ required: true, errorMessage: "请选择商品类型" }],
  },
};

const categoryRules = {
  name: {
    rules: [{ required: true, errorMessage: "请输入类型名称" }],
  },
};

// 商品列表过滤计算
const filteredProducts = computed(() => {
  switch (currentTab.value) {
    case 1:
      return products.value.filter(product => {
        const unopenedQuantity = product.quantity - (product.openedQuantity || 0);
        return unopenedQuantity > 0;
      });
    case 2:
      return products.value.filter(product => {
        return (product.openedQuantity || 0) > 0;
      });
    default:
      return products.value;
  }
});

// 搜索商品
const onSearch = (searchValue) => {
  const searchResult = products.value.filter(product => 
    product.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  if (searchResult.length === 0) {
    uni.showToast({
      title: '未找到相关商品',
      icon: 'none'
    });
    return;
  }
  
  // 重置搜索框
  searchText.value = '';
  
  // 显示搜索结果
  products.value = searchResult;
};

// 切换标签页
const switchTab = (index) => {
  currentTab.value = index;
};

// 显示入库操作面板
const showInStockAction = () => {
  inStockActionPopup.value.open();
  isInStock.value = true;
};

// 显示出库操作面板
const showOutStockAction = () => {
  outStockActionPopup.value.open();
  isInStock.value = false;
};

// 处理商品滑动操作
const handleProductSwipe = ({ action, product }) => {
  selectedProduct.value = product;
  if (action === 'out') {
    isInStock.value = false;
    quantityPopup.value.open();
  } else if (action === 'open') {
    openPopup.value.open();
  }
};

// 显示新增商品弹窗
const showAddProduct = () => {
  inStockActionPopup.value.close();
  addProductPopup.value.open();
};

// 显示新增类型弹窗
const showAddCategory = () => {
  addCategoryPopup.value.open();
};

// 选择入库商品
const selectProductForInStock = (product) => {
  selectedProduct.value = product;
  isInStock.value = true;
  inStockActionPopup.value.close();
  quantityPopup.value.open();
};

// 关闭开封弹窗
const closeOpenPopup = () => {
  openPopup.value.close();
  openQuantity.value = 1;
};

// 关闭数量操作弹窗
const closeQuantityPopup = () => {
  quantityPopup.value.close();
};

// 确认数量操作
const confirmQuantityOperation = async () => {
  try {
    if (!currentProduct.value) return;
    
    const isStockIn = operationType.value === 'in';
    const updatedProduct = {
      ...currentProduct.value,
      quantity: isStockIn 
        ? currentProduct.value.quantity + operationQuantity.value 
        : currentProduct.value.quantity - operationQuantity.value,
      openedQuantity: isStockIn 
        ? currentProduct.value.openedQuantity 
        : Math.max(0, currentProduct.value.openedQuantity - operationQuantity.value),
      updateTime: new Date().toISOString()
    };

    await updateProduct(updatedProduct);
    
    const index = products.value.findIndex(p => p.id === currentProduct.value.id);
    if (index !== -1) {
      products.value[index] = updatedProduct;
    }

    quantityPopup.value.close();
  } catch (error) {
    console.error('操作失败:', error);
  }
};

// 关闭新增商品弹窗
const closeAddProduct = () => {
  addProductPopup.value.close();
};

// 确认添加商品
const confirmAddProduct = async () => {
  try {
    await newProductFormRef.value.validate();
    products.value.push({
      id: products.value.length + 1,
      ...newProductForm.value,
      updateTime: formatTime(new Date()),
    });
    closeAddProduct();
    uni.showToast({
      title: "添加成功",
      icon: "success",
    });
  } catch (e) {
    console.error(e);
  }
};

// 关闭新增类型弹窗
const closeAddCategory = () => {
  addCategoryPopup.value.close();
};

// 确认添加类型
const confirmAddCategory = async () => {
  try {
    await newCategoryForm.value.validate();
    categories.value.push({
      value: newCategoryForm.value.name,
      text: newCategoryForm.value.name,
    });
    closeAddCategory();
    uni.showToast({
      title: "添加成功",
      icon: "success",
    });
  } catch (e) {
    console.error(e);
  }
};

// 格式化时间
const formatTime = (date) => {
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  const hh = date.getHours().toString().padStart(2, "0");
  const mi = date.getMinutes().toString().padStart(2, "0");
  return `${mm}-${dd} ${hh}:${mi}`;
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
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
  content: "";
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
  box-sizing: border-box;
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
