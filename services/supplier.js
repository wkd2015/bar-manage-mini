import request from "./request"

const baseUrl = '/api/supplier'

export class SupplierService {
  static async createSupplier(data) {
    return request({
      path: `${baseUrl}`,
      method: 'POST',
      data
    })
  }

  static async editSupplier(data) {
    return request({
      path: `${baseUrl}/${data.id}`,
      method: 'PUT',
      data
    })
  }

  static async getSuppliersById(id) {
    return request({
      path: `${baseUrl}/${id}`,
      method: 'GET',
      data: {}
    })
  }

  static async getSuppliersByIds(ids) {
    return request({
      path: `${baseUrl}/batch`,
      method: 'GET',
      data: ids
    })
  }

  static async getSuppliersByParams(data) {
    return request({
      path: `${baseUrl}/search`,
      method: 'GET',
      data
    })
  }
}
