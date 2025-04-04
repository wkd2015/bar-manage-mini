import request from "./request"

const baseUrl = '/api/product'

export class ProductService {
  static async createProduct(data) {
    return request({
      path: `${baseUrl}`,
      method: 'POST',
      data
    })
  }
  static async updateProduct(data) {
    return request({
      path: `${baseUrl}/update/${data.id}`,
      method: 'POST',
      data
    })
  }
  static async getProductDetail(id) {
    return request({
      path: `${baseUrl}/get/${id}`,
      method: 'GET'
    })
  }
  static async getProductList(data) {
    return request({
      path: `${baseUrl}/search`,
      method: 'GET',
      data
    })
  }
}