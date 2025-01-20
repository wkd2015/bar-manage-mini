export const PURCHASE_STATUS = {
  // 待采购确认/待上传发货单
  WAIT_PURCHASE_CONFIRM: 0,
  // 采购确认/已发货
  PURCHASE_CONFIRMED: 1,
  // 待入库
  WAIT_IN_STORAGE: 2,
  // 已入库
  IN_STORAGE: 3,
  // 入库失败
  IN_STORAGE_FAILED: 4,
};

export const PURCHASE_STATUS_MAP = {
  [PURCHASE_STATUS.WAIT_PURCHASE_CONFIRM]: {
    label: "待上传发货单",
    color: "#FFA500",
  },
  [PURCHASE_STATUS.PURCHASE_CONFIRMED]: {
    label: "已发货",
    color: "#008000",
  },
  [PURCHASE_STATUS.WAIT_IN_STORAGE]: {
    label: "待入库",
    color: "#FFA500",
  },
  [PURCHASE_STATUS.IN_STORAGE]: {
    label: "已入库",
    color: "#008000",
  },
  [PURCHASE_STATUS.IN_STORAGE_FAILED]: {
    label: "入库失败",
    color: "#FF0000",
  },
};
