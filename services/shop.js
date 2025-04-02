import request from "./request"

const baseUrl = '/api/shop'

export class ShopService {
  static async createShop(data) {
    return request({
      path: `${baseUrl}`,
      method: 'POST',
      data
    })
  }

  static async editShop(data) {
    return request({
      path: `${baseUrl}/${data.id}`,
      method: 'PUT',
      data
    })
  }

  static async getShopById(id) {
    return request({
      path: `${baseUrl}/${id}`,
      method: 'GET',
      data: {}
    })
  }
  
  static async getShopStaffs(id) {
    return request({
      path: `${baseUrl}/${id}/staff`,
      method: 'GET',
      data: {}
    })
  }

  static async addShopStaff(data) {
    return request({
      path: `${baseUrl}/staff`,
      method: 'POST',
      data
    })
  }
}
