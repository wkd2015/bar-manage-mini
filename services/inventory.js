import request from "./request"

const baseUrl = '/api/inventory'

export class InventoryService {
  static async updateInventory(data) {
    return request({
      path: `${baseUrl}`,
      method: 'POST',
      data
    })
  }
  static async getInventoryList(shopId) {
    return request({
      path: `${baseUrl}/shop/${shopId}`,
      method: 'GET',
      data: {}
    })
  }
}