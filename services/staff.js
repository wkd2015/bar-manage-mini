import request from "./request"

const baseUrl = '/api/staff'

export class StaffService {
  static async createStaff(data) {
    return request({
      path: `${baseUrl}`,
      method: 'POST',
      data
    })
  }

  static async editStaff(data) {
    return request({
      path: `${baseUrl}/${data.id}`,
      method: 'PUT',
      data
    })
  }

  static async editStaffRoles(data) {
    return request({
      path: `${baseUrl}/${data.id}`,
      method: 'PUT',
      data: data.roles
    })
  }

  static async getStaffsByIds(ids) {
    return request({
      path: `${baseUrl}/batch`,
      method: 'GET',
      data
    })
  }

  static async getCurrentStaff() {
    return request({
      path: `${baseUrl}/current`,
      method: 'GET',
      data: {}
    })
  }

  static async getStaffsByParams(data) {
    return request({
      path: `${baseUrl}/search`,
      method: 'GET',
      data
    })
  }
}
