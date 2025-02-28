export const PURCHASE_STATUS = {
  // 待主理人确认
  INIT: 1,
  // 采购中
  PURCHASING: 2,
  // 上传发货单【付款 || 未付款】及主理人签字
  DELIVERED: 3,
  // 确认收货
  // TODO: 入库与收货是否自动化
  RECEIVED: 4
};

export const PURCHASE_PAYMENT_STATUS = {
  // 已付款
  PAID: 2,
  // 未付款
  UNPAID: 1
};

export const getPurchaseStatus = (purchaseOrder) => {
  if (purchaseOrder.status === PURCHASE_STATUS.INIT) {
    return {
      label: "待确认",
      color: "#FFA500",
    }
  }
  if (purchaseOrder.status === PURCHASE_STATUS.PURCHASING && purchaseOrder.paymentStatus === PURCHASE_PAYMENT_STATUS.UNPAID) {
    return {
      label: "采购中",
      color: "#008000",
    }
  }
  if (purchaseOrder.status === PURCHASE_STATUS.PURCHASING && purchaseOrder.paymentStatus === PURCHASE_PAYMENT_STATUS.PAID) {
    return {
      label: "待发货",
      color: "#FFA500",
    }
  }
  if (purchaseOrder.status === PURCHASE_STATUS.DELIVERED && purchaseOrder.paymentStatus === PURCHASE_PAYMENT_STATUS.PAID) {
    return {
      label: "已发货",
      color: "#008000",
    }
  }
  if (purchaseOrder.status === PURCHASE_STATUS.RECEIVED) {
    return {
      label: "已入库",
      color: "#008000",
    }
  }
  return {
    label: "未知",
    color: "#FFA500",
  }
};
