<script setup>
import { computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { ShopService } from "../../services/shop";
import { StaffService } from "../../services/staff";

const store = useStore();

const POSITION_KEY = {
  BAR_OWNER: 1,
  BAR_MANAGER: 2,
  STAFF: 3,
  TRAINEE: 4
}
const POSITION_NAME = {
  [POSITION_KEY.BAR_OWNER]: '店长',
  [POSITION_KEY.BAR_MANAGER]: '主理人',
  [POSITION_KEY.STAFF]: '店员',
  [POSITION_KEY.TRAINEE]: '实习'
}
const POSITION_COLOR = {
  [POSITION_KEY.BAR_OWNER]: 'royal',
  [POSITION_KEY.BAR_MANAGER]: 'warning',
  [POSITION_KEY.STAFF]: 'primary',
  [POSITION_KEY.TRAINEE]: 'default'
}

const shopInfo = ref({
  id: 0,
  name: "",
  address: "",
  contactPerson: "",
  contactPhone: "",
  businessHours: "",
});
const staffList = ref([]);
const addStaffSearchParams = ref({
  phone: "",
  userName: "",
})
const addStaffPopup = ref(null);
const searchStaffList = ref([]);

const navbarInfo = computed(() => store.getters.navbarInfo);
const userInfo = computed(() => store.getters.userInfo);

const onNavClick = () => {
  uni.navigateBack({ delta: 1 });
}

const initShopDetail = async (shopId) => {
  const {data: shopInfoData} = await ShopService.getShopById(shopId)
  const {data: shopStaffs} = await ShopService.getShopStaffs(shopId)
  if (shopInfoData) {
    shopInfo.value = shopInfoData
  }
  staffList.value = shopStaffs || []
}

const onAddStaffClick = () => {
  addStaffPopup.value.open();
}

const onAddStaffPopupClose = () => {
  addStaffPopup.value.close()
}

const onAddStaffPopupChange = (e) => {
  if (!e.show) {
    addStaffSearchParams.value = {
      phone: "",
      userName: "",
    }
    searchStaffList.value = []
  }
}

const onSearchStaffCancel = () => {
  searchStaffList.value = []
  addStaffSearchParams.value = {
    phone: "",
    userName: "",
  }
}

const onSearchStaffConfirm = async () => {
  const { data } = await StaffService.getStaffsByParams(addStaffSearchParams.value)
  const searchStaffTempList = data || []
  console.warn(searchStaffTempList)
  searchStaffList.value = searchStaffTempList.filter(item => userInfo.value.shopId !== item.shopId)
}

const onAddStaffClickConfirm = async (id) => {
  const { data } = await ShopService.addShopStaff({
    shopId: userInfo.value.shopId,
    staffId: id
  })
    await initShopDetail(userInfo.value.shopId)
    await onSearchStaffConfirm()
}

watch(
  () => userInfo.value.shopId,
  async (shopId) => {
    if (shopId) {
      await initShopDetail(shopId)
    }
  },
  { immediate: true }
)
</script>

<template>
  <view class="shop" :style="`padding-top: ${navbarInfo.barHeight}px;`">
    <navbar title="店铺管理" :opacity="1" :showNavBack="true" :onNavClick="onNavClick"></navbar>
    <view class="shop-content">
      <view class="shop-info">
        <view class="shop-info-header">{{ shopInfo.name }}</view>
        <view class="shop-info-detail">
          <view class="shop-info-detail-item">
            <view class="shop-info-detail-item-label">地址:</view>
            <view class="shop-info-detail-item-value">{{
              shopInfo.address
            }}</view>
          </view>
          <view class="shop-info-detail-item">
            <view class="shop-info-detail-item-label">联系人:</view>
            <view class="shop-info-detail-item-value">{{
              shopInfo.contactPerson
            }}</view>
          </view>
          <view class="shop-info-detail-item">
            <view class="shop-info-detail-item-label">联系电话:</view>
            <view class="shop-info-detail-item-value">{{
              shopInfo.contactPhone
            }}</view>
          </view>
        </view>
      </view>
      <view class="shop-staffs">
        <view class="shop-staffs-header">
          <view class="shop-staffs-header-title">店员列表</view>
          <view class="shop-staffs-header-count">
            <view class="shop-staffs-header-count-text">共{{ staffList.length }}位</view>
          </view>
          <view class="shop-staffs-header-add" @click="onAddStaffClick">
            <uni-icons type="plus" size="20" />
          </view>
        </view>
        <view class="shop-staffs-list">
          <view class="shop-staffs-list-item" v-for="item in staffList" :key="item.id">
            <view class="shop-staffs-list-item-avatar">
              <image class="shop-staffs-list-item-avatar-image" :src="item.staffInfo?.avatar || '/static/imgs/avatar.png'" />
            </view>
            <view class="shop-staffs-list-item-name">{{ item.staffInfo?.userName }}</view>
            <uni-tag
              :text="POSITION_NAME[item.position]"
              size="small"
              :type="POSITION_COLOR[item.position]"
            />
            <view class="shop-staffs-list-item-phone">{{ item.staffInfo?.phone }}</view>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="addStaffPopup" type="bottom" :safe-area="false" @change="onAddStaffPopupChange">
      <view class="add-staff-popup">
        <view class="add-staff-popup-header">
          <view class="add-staff-popup-header-title">添加店员</view>
          <view class="add-staff-popup-header-close" @click="onAddStaffPopupClose">
            <uni-icons type="closeempty" size="16" />
          </view>
        </view>
        <view class="add-staff-popup-content">
          <view class="add-staff-popup-content-search">
            <view class="add-staff-popup-content-search-title">搜索店员</view>
            <view class="add-staff-popup-content-search-item">
              <view class="add-staff-popup-content-search-item-label">姓名:</view>
              <view class="add-staff-popup-content-search-item-input">
                <input type="text" v-model="addStaffSearchParams.userName" placeholder="请输入姓名" />
              </view>
            </view>
            <view class="add-staff-popup-content-search-item">
              <view class="add-staff-popup-content-search-item-label">手机号:</view>
              <view class="add-staff-popup-content-search-item-input">
                <input type="text" v-model="addStaffSearchParams.phone" placeholder="请输入手机号" />
              </view>
            </view>
            <view class="add-staff-popup-content-search-handle">
              <view class="add-staff-popup-content-search-handle-cancel" @click="onSearchStaffCancel">取消</view>
              <view class="add-staff-popup-content-search-handle-confirm" @click="onSearchStaffConfirm">确定</view>
            </view>
          </view>
          <view class="add-staff-popup-content-list">
            <view class="add-staff-popup-content-list-item" v-for="item in searchStaffList" :key="item.id">
              <view class="add-staff-popup-content-list-item-avatar">
                <image class="add-staff-popup-content-list-item-avatar-image" :src="item.avatar || '/static/imgs/avatar.png'" />
              </view>
              <view class="add-staff-popup-content-list-item-name">{{ item.userName }}</view>
              <view class="add-staff-popup-content-list-item-phone">{{ item.phone }}</view>
              <view class="add-staff-popup-content-list-item-handle">
                <view class="add-staff-popup-content-list-item-handle-add" @click="onAddStaffClickConfirm(item.id)">
                  添加
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
    <tabbar-shadow />
  </view>
</template>

<style scoped>
.add-staff-popup-content-list {
  
}

.add-staff-popup {
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  padding: 0;
  box-sizing: border-box;
  width: 100vw;
  height: 80vh;
}

.add-staff-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 0.5px solid #eee;
  margin-bottom: 10px;
}

.add-staff-popup-header-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.add-staff-popup-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
  background-color: #f5f5f5;
}

.add-staff-popup-content-search {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: #fff;
  border-bottom: 0.5px solid #eee;
}

.add-staff-popup-content-search-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.add-staff-popup-content-search-item-label {
  font-size: 14px;
  color: #666;
  width: 60px;
}
.add-staff-popup-content-search-item-input {
  flex: 1;
  display: flex;
  align-items: center;
}
.add-staff-popup-content-search-item-input input {
  flex: 1;
  height: 30px;
  border: 0.5px solid #eee;
  border-radius: 5px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
  color: #333;
}
.add-staff-popup-content-search-handle {
  display: flex;
  gap: 10px;
}
.add-staff-popup-content-search-handle-cancel,
.add-staff-popup-content-search-handle-confirm {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  border-radius: 5px;
  background-color: #f5f5f5;
  height: 35px;
}
.add-staff-popup-content-search-handle-cancel {
  border: 0.5px solid #eee;
  color: #333;
}
.add-staff-popup-content-search-handle-confirm {
  background-color: #007aff;
  color: #fff;
}
.add-staff-popup-content-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: #fff;
}
.add-staff-popup-content-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 0.5px solid #eee;
  border-radius: 5px;
}
.add-staff-popup-content-list-item-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
}
.add-staff-popup-content-list-item-avatar-image {
  width: 100%;
  height: 100%;
}
.add-staff-popup-content-list-item-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}
.add-staff-popup-content-list-item-phone {
  font-size: 12px;
  color: #666;
}
.add-staff-popup-content-list-item-handle {
  display: flex;
  gap: 10px;
}
.add-staff-popup-content-list-item-handle-add {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  border-radius: 5px;
  background-color: #ff6f00;
  height: 24px;
  color: #fff;
}

.shop-staffs-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #fff;
}
.shop-staffs-header-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.shop-staffs-header-count {
  display: flex;
  align-items: center;
  gap: 5px;
}
.shop-staffs-header-count-text {
  font-size: 12px;
  color: #666;
}
.shop-staffs-header-add {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.shop {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
}

.shop-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
  background-color: #f5f5f5;
}

.shop-info {
  padding: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.shop-info-header {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.shop-info-detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.shop-info-detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.shop-info-detail-item-label {
  font-size: 14px;
  color: #666;
}

.shop-info-detail-item-value {
  font-size: 14px;
  color: #333;
}

.shop-staffs {
  padding: 0 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.shop-staffs-header {
  font-size: 20px;
  font-weight: 500;
  padding: 10px 0;
  color: #333;
  border-bottom: 0.5px solid #eee;
}

.shop-staffs-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.shop-staffs-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 0.5px solid #eee;
}

.shop-staffs-list-item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 0.5px solid #eee;
  overflow: hidden;
}

.shop-staffs-list-item-avatar-image {
  width: 100%;
  height: 100%;
}

.shop-staffs-list-item-name {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shop-staffs-list-item-phone {
  font-size: 14px;
  color: #333;
  flex: 1;
  text-align: right;
}
</style>
