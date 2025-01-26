import request from "./request"

const baseUrl = '/api'

export class PurchaseService {
  static async createPurchase(data) {
    return request({
      path: `${baseUrl}/purchase-orders`,
      method: 'POST',
      data
    })
  }
  static async confirmPurchase(data) {
    return request({
      path: `${baseUrl}/purchase-orders/${data.id}/confirm`,
      method: 'POST',
      data
    })
  }
  static async confirmPurchasePayment(data) {
    return request({
      path: `${baseUrl}/purchase-orders/${data.id}/payment`,
      method: 'POST',
      data
    })
  }
  static async confirmPurchaseDelivery(data) {
    return request({
      path: `${baseUrl}/purchase-orders/${data.id}/delivery`,
      method: 'POST',
      data
    })
  }
  static async confirmPurchaseReceipt(data) {
    return request({
      path: `${baseUrl}/purchase-orders/${data.id}/receipt`,
      method: 'GET'
    })
  }
  static async confirmSettlement(data) {
    return request({
      path: `${baseUrl}/purchase-orders/${data.id}/settlement`,
      method: 'POST',
      data
    })
  }
  static async confirmSupplierPayment(data) {
    return request({
      path: `${baseUrl}/purchase-orders/${data.id}/supplier-payment`,
      method: 'POST',
      data
    })
  }
  static async getPurchaseDetail(id) {
    return request({
      path: `${baseUrl}/purchase-orders/${id}`,
      method: 'GET'
    })
  }
  static async getPurchaseList(data) {
    return request({
      path: `${baseUrl}/purchase-orders`,
      method: 'GET',
      data
    })
  }
  static async getPurchaseOperations(id) {
    return request({
      path: `${baseUrl}/purchase-orders/${id}/operations`,
      method: 'GET'
    })
  }
}