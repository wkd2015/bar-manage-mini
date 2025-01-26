import request from "./request"

const baseUrl = '/api'

export class ProductClass {
  static async createProduct(data) {
    return request({
      path: `${baseUrl}/product/create`,
      method: 'POST',
      data
    })
  }
  static async updateProduct(data) {
    return request({
      path: `${baseUrl}/product/update/${data.id}`,
      method: 'POST',
      data
    })
  }
  static async getProductDetail(id) {
    return request({
      path: `${baseUrl}/product/get/${id}`,
      method: 'GET'
    })
  }
  static async getProductList(data) {
    return request({
      path: `${baseUrl}/product/search`,
      method: 'GET',
      data
    })
  }
}