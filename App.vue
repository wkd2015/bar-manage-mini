<script setup>
import { useStore } from 'vuex'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

const store = useStore()

const setNavbarInfoStore = (info) => store.dispatch('setNavbarInfo', info)

// Set Navbar Function
function getNavBarInfo() {
	const systemInfo = wx.getSystemInfoSync()
	const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
	const statusBarHeight = systemInfo.statusBarHeight
	const navHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2
	const barHeight = navHeight + statusBarHeight
	const menuButtonWidth = menuButtonInfo.width + (systemInfo.screenWidth - menuButtonInfo.right) * 2
	setNavbarInfoStore({
		statusBarHeight,
		navHeight,
		barHeight,
		menuButtonWidth
	})
}

onLaunch(() => {
	console.log('App Launch')
	getNavBarInfo()
})

onShow(() => {
	console.log('App Show')
})

onHide(() => {
	console.log('App Hide')
})
</script>

<style>
	/*每个页面公共css */
</style>
