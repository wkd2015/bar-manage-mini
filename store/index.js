import { createStore } from 'vuex'
import { StaffService } from '../services/staff'

const store = createStore({
	state: {
		navbarInfo: {
			statusBarHeight: 0,
			navHeight: 0,
			barHeight: 0,
			menuButtonWidth: 0,
			screenWidth: 0
		},
		userInfo: {
			id: 0,
			userName: "",
			phone: "",
			avatar: "",
			gender: 0
		}
	},
	mutations: {
		SET_NAVBAR_INFO: (state, navbarInfo) => {
			state.navbarInfo = navbarInfo
		},
		SET_USER_INFO: (state, userInfo) => {
			state.userInfo = userInfo
		}
	},
	actions: {
		setNavbarInfo({ commit }, navbarInfo) {
			commit('SET_NAVBAR_INFO', navbarInfo)
		},
		async setUserInfo({ commit }) {
			const { data } = await StaffService.getCurrentStaff()
			if (data) {
				commit('SET_USER_INFO', data)
			}
		}
	},
	getters: {
		navbarInfo: (state) => state.navbarInfo,
		userInfo: (state) => state.userInfo
	}
})

export default store
