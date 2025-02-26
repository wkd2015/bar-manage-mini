<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import dayjs from "dayjs";
import {
  getPurchaseStatus,
  PURCHASE_STATUS,
} from "../../../../constants/purchase";
import { PurchaseService } from "../../../../services/purchase";

const store = useStore();

const props = defineProps({
  purchaseParams: {
    type: Object,
    default: () => ({
      id: "",
      orderNo: "",
      supplier: {
        name: "",
        id: "",
      },
      status: "",
      imageUrl: "",
      items: [
        {
          name: "",
          price: 0,
          unit: "",
          imageUrl: "",
          count: 0,
        },
      ],
      totalAmount: 0,
      createTime: "",
    }),
  },
});

const signaturePopupVisible = ref(false);
const signaturePopup = ref(null);
const signatureRef = ref(null);
// const signature
const statusInfo = computed(() => getPurchaseStatus(props.purchaseParams));
const userInfo = computed(() => store.getters.userInfo);
const operationRole = computed(() =>
  ["SUPER_ADMIN", "OPERATION"].some((item) => userInfo.value.roles?.includes(item))
);
const purchaseRole = computed(() =>
  ["SUPER_ADMIN", "PURCHASE"].some((item) => userInfo.value.roles?.includes(item))
);

const toPurchaseDetail = () => {
  uni.navigateTo({
    url: "/pages/purchase/detail?id=" + props.purchaseParams.id,
  });
};

const onSignaturePopupClose = () => {
  signaturePopup.value.close();
}

const onSignaturePopupChange = (e) => {
  signaturePopupVisible.value = e.show;
  if (!e.show) {
    signatureRef.value.clear();
  }
}

const onSignatureConfirm = () => {
  signatureRef.value.canvasToTempFilePath({
    success: (res) => {
      if (res.tempFilePath) {
        wx.cloud.uploadFile({
          cloudPath: `signature/${props.purchaseParams.orderNo}.png`,
          filePath: res.tempFilePath,
          config: {
            env: "prod-0glco3k7aad42178"
          },
          success: async (res) => {
            const { fileID = '' } = res || {};
            await PurchaseService.confirmPurchase({
              id: props.purchaseParams.id,
              signature: fileID
            })
            signaturePopup.value.close();
          }
        })
      }
    }
  })
}

const onSignatureClear = () => {
  signatureRef.value.clear();
}

const onSignatureUndo = () => {
  signatureRef.value.undo();
}

const onPurchaseOrderConfirm = () => {
  signaturePopup.value.open();
}
</script>

<template>
  <view class="purchase-card">
    <view class="card-title" @click="toPurchaseDetail">
      <text class="card-title-text">{{ purchaseParams.supplierInfo?.name }}</text>
      <text
        class="card-title-status"
        :style="{
          color: statusInfo.color,
        }"
        >{{ statusInfo.label }}</text
      >
    </view>
    <view class="card-content" @click="toPurchaseDetail">
      <template v-if="purchaseParams.items.length === 0">
        <text class="card-content-text card-content-text-error"
          >商品信息获取失败</text
        >
      </template>
      <template v-if="purchaseParams.items.length === 1">
        <view class="card-content-goods-single">
          <image
            class="card-content-thumbnail"
            :src="purchaseParams.items[0].productSnapshot?.imageUrl"
          />
          <view class="card-content-info">
            <text class="card-content-info-text"
              >名称：{{ purchaseParams.items[0].productSnapshot?.name }}</text
            >
            <text class="card-content-info-text"
              >数量：{{ purchaseParams.items[0].quantity }}</text
            >
            <text class="card-content-info-text"
              >总价：￥{{ purchaseParams.totalAmount }}</text
            >
          </view>
        </view>
      </template>
      <template v-else>
        <view class="card-content-goods-multi">
          <scroll-view scroll-x class="card-content-goods-list-scroll">
            <view class="card-content-goods-list">
              <view
                class="card-content-goods-list-item"
                v-for="item in purchaseParams.items"
                :key="item.id"
              >
                <view class="card-content-goods-list-item-thumbnail-wrapper">
                  <image
                    class="card-content-goods-list-item-thumbnail"
                    :src="item.productSnapshot?.imageUrl"
                  />
                  <view
                    class="card-content-goods-list-item-thumbnail-wrapper-count"
                    v-if="item.quantity > 1"
                  >
                    x {{ item.quantity }}
                  </view>
                </view>
                <!-- 商品数量放在图片上 -->
                <text class="card-content-goods-list-item-name">{{
                  item.productSnapshot?.name
                }}</text>
              </view>
            </view>
            <view class="card-content-goods-list-scroll-wrapper"></view>
          </scroll-view>
          <view class="card-content-goods-total">
            <text class="card-content-goods-total-text-price"
              >￥{{ purchaseParams.totalAmount }}</text
            >
            <text class="card-content-goods-total-text"
              >共{{ purchaseParams.items.length }}件</text
            >
          </view>
        </view>
      </template>
    </view>
    <text class="card-footer-text"
      >采购时间：{{
        dayjs(purchaseParams.createTime).format("YYYY-MM-DD")
      }}</text
    >
    <view class="card-footer">
      <view class="card-footer-more">更多</view>
      <view class="card-footer-handles">
        <view
          class="card-footer-handle-item"
          v-if="purchaseParams.status === PURCHASE_STATUS.INIT && operationRole"
          @click="onPurchaseOrderConfirm"
        >
          确认采购单(签字)
        </view>
        <view
          class="card-footer-handle-item"
          v-if="
            purchaseParams.status === PURCHASE_STATUS.PURCHASING && purchaseRole
          "
          >上传发货单</view
        >
        <view
          class="card-footer-handle-item"
          v-if="
            purchaseParams.status === PURCHASE_STATUS.DELIVERED &&
            purchaseParams.paymentStatus === PURCHASE_PAYMENT_STATUS.UNPAID &&
            operationRole
          "
        >
          确认付款(签字)
        </view>
        <view
          class="card-footer-handle-item"
          v-if="
            purchaseParams.status === PURCHASE_STATUS.DELIVERED &&
            purchaseParams.paymentStatus === PURCHASE_PAYMENT_STATUS.PAID &&
            operationRole
          "
        >
          确认入库(签字)
        </view>
        <view
          class="card-footer-handle-item"
          v-if="purchaseParams.status === PURCHASE_STATUS.IN_STORAGE"
          >导出入库单</view
        >
        <view class="card-footer-handle-item">导出采购单</view>
        <view class="card-footer-handle-item">上传发票</view>
      </view>
    </view>
    <uni-popup ref="signaturePopup" type="bottom" :safe-area="false" @change="onSignaturePopupChange">
      <view class="signature-popup">
        <view class="signature-popup-header">
          <view class="signature-popup-header-title">签字</view>
          <view class="signature-popup-header-close" @click="onSignaturePopupClose">
            <uni-icons type="closeempty" size="16" />
          </view>
        </view>
        <l-signature disableScroll ref="signatureRef" :landscape="true" backgroundColor="#dfe2e5" style="margin: 0 10px;" v-if="signaturePopupVisible" />
        <view class="signature-popup-handle">
          <view class="signature-popup-handle-clear" @click="onSignatureClear">清空</view>
          <view class="signature-popup-handle-undo" @click="onSignatureUndo">撤销</view>
          <view class="signature-popup-handle-confirm" @click="onSignatureConfirm">确认</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style scoped>
.signature-popup {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  padding: 0;
  box-sizing: border-box;
  width: 100vw;
}

.signature-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 0.5px solid #eee;
  margin-bottom: 10px;
}

.signature-popup-header-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.signature-popup-handle {
  display: flex;
  margin-top: 10px;
  padding: 0 10px 10px 10px;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.signature-popup-handle > view {
  flex: 1;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 6px;
  color: #fff;
  box-sizing: border-box;
}

.signature-popup-handle-clear {
  background-color: #e43d33;
}

.signature-popup-handle-undo {
  background-color: #f3a73f;
}

.signature-popup-handle-confirm {
  background-color: #007aff;
}

.purchase-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 16px 10px;
  border-bottom: 0.5px solid #eee;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title-text {
  font-size: 16px;
  font-weight: bold;
}

.card-title-status {
  font-size: 14px;
  color: #999;
}

.card-content {
  display: flex;
  margin-top: 10px;
}

.card-content-goods-single {
  display: flex;
  gap: 10px;
  align-items: center;
}

.card-content-goods-multi {
  display: flex;
  flex: 1;
  gap: 10px;
}

.card-content-goods-list-scroll {
  width: 300px;
}

.card-content-goods-list {
  display: flex;
  gap: 10px;
}

.card-content-goods-list-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.card-content-goods-list-item-thumbnail-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.card-content-goods-list-item-thumbnail-wrapper-count {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 0 5px 5px 0;
}

.card-content-thumbnail,
.card-content-goods-list-item-thumbnail {
  width: 80px;
  height: 80px;
}

.card-content-goods-list-item-name {
  width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-content-goods-total {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
}
/* TODO: 滚动区域遮罩 */
/* .card-content-goods-total::before {
  content: "";
} */

.card-content-goods-total-text-price {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.card-content-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-content-info-text {
  font-size: 12px;
  color: #666;
}

.card-footer-text {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 14px;
}

.card-footer-more {
  color: #666;
}

.card-footer-handles {
  display: flex;
  gap: 10px;
}

.card-footer-handle-item {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #f0f0f0;
}
</style>
