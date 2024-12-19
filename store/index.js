import { createStore } from 'vuex'

const store = createStore({
	state: {
		navbarInfo: {
			statusBarHeight: 0,
			navHeight: 0,
			barHeight: 0
		}
	},
	mutations: {
		SET_NAVBAR_INFO: (state, navbarInfo) => {
			state.navbarInfo = navbarInfo
		}
	},
	actions: {
		setNavbarInfo({ commit }, navbarInfo) {
			commit('SET_NAVBAR_INFO', navbarInfo)
		}
	},
	getters: {
		navbarInfo: (state) => state.navbarInfo
	}
})

export default store
