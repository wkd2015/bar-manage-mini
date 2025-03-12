export const PURCHASE_STATUS = {
  // 待主理人确认
  INIT: 1,
  // 采购中
  PURCHASING: 2,
  // 上传发货单【付款 || 未付款】及主理人签字
  DELIVERED: 3,
  // 确认收货
  RECEIVED: 4,
  // 入库
  STOCKED: 5
};

export const PURCHASE_PAYMENT_STATUS = {
  // 已付款
  PAID: 2,
  // 未付款
  UNPAID: 1
};

export const PURCHASE_APPROVAL_STATUS = {
  UNAPPROVED: 1,
  APPROVED: 2
}

export const getPurchaseStatus = (purchaseOrder) => {
  if (purchaseOrder.status === PURCHASE_STATUS.INIT) {
    return {
      label: "待确认",
      color: "#FFA500",
    }
  }
  if (purchaseOrder.status === PURCHASE_STATUS.PURCHASING){
    // TODO: 测试逻辑，后续补充下面注释判断
    // && purchaseOrder.approvalStatus === PURCHASE_APPROVAL_STATUS.UNAPPROVED) {
    return {
      label: "待发货",
      color: "#008000",
    }
  }
  if (purchaseOrder.status === PURCHASE_STATUS.DELIVERED) {
    return {
      label: "已发货",
      color: "#008000",
    }
  }
  if (purchaseOrder.status === PURCHASE_STATUS.RECEIVED) {
    return {
      label: "确认收货",
      color: "#008000",
    }
  }
  if (purchaseOrder.status === PURCHASE_STATUS.STOCKED) {
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
