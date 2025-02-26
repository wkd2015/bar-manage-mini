import request from "./request"

const baseUrl = '/api/purchase-orders'

export class PurchaseService {
  static async createPurchase(data) {
    return request({
      path: `${baseUrl}`,
      method: 'POST',
      data
    })
  }
  static async confirmPurchase(data) {
    return request({
      path: `${baseUrl}/${data.id}/confirm`,
      method: 'POST',
      data: {
        signature: data.signature
      }
    })
  }
  static async confirmPurchasePayment(data) {
    return request({
      path: `${baseUrl}/${data.id}/payment`,
      method: 'POST',
      data
    })
  }
  static async confirmPurchaseDelivery(data) {
    return request({
      path: `${baseUrl}/${data.id}/delivery`,
      method: 'POST',
      data
    })
  }
  static async confirmPurchaseReceipt(data) {
    return request({
      path: `${baseUrl}/${data.id}/receipt`,
      method: 'GET'
    })
  }
  static async confirmSettlement(data) {
    return request({
      path: `${baseUrl}/${data.id}/settlement`,
      method: 'POST',
      data
    })
  }
  static async confirmSupplierPayment(data) {
    return request({
      path: `${baseUrl}/${data.id}/supplier-payment`,
      method: 'POST',
      data
    })
  }
  static async getPurchaseDetail(id) {
    return request({
      path: `${baseUrl}/${id}`,
      method: 'GET'
    })
  }
  static async getPurchaseList(data) {
    return request({
      path: `${baseUrl}`,
      method: 'GET',
      data
    })
  }
  static async getPurchaseOperations(id) {
    return request({
      path: `${baseUrl}/${id}/operations`,
      method: 'GET'
    })
  }
}