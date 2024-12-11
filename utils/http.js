import { config } from '../config.js'

class HTTP {
	constructor() {
		this.baseUrl = config.base_url
	}

	request({ url, data = {}, method = 'GET', useOrigin = false, withoutAuth = false }) {
		return new Promise((resolve, reject) => {
			this._request(url, resolve, reject, data, method, useOrigin, withoutAuth)
		})
	}

	_request(url, resolve, reject, data = {}, method = 'GET', useOrigin = false, withoutAuth) {
		uni.request({
			url: `${this.baseUrl}${url}`,
			method: method,
			data: data,
			header: {
				'content-type': 'application/json',
				appId: config.appId,
				...(!withoutAuth ? { Authorization: `Bearer ${uni.getStorageSync('AuthTokens')}` } : {})
			},
			success: (res) => {
				if (res.data) {
					if (!useOrigin) {
						const _success = res.data.code === 1 || res.data.code === 200
						if (_success) {
							resolve(res.data)
						} else {
							reject(res.data.msg || res.data.message)
							const error_code = res.data.code
							const _message = res.data.msg || res.data.message
							this._show_error(error_code, _message)
						}
					} else {
						resolve(res.data)
					}
				} else {
					reject(res.msg || res.message)
				}
			},
			fail: (err) => {
				reject()
				this._show_error(err.msg || err.message)
			}
		})
	}

	_show_error(error_code, _message) {
		uni.showToast({
			title: `${_message}`,
			icon: 'none',
			duration: 2000
		})
	}
}

export { HTTP }
