<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
// TODO: 抽取Hook。https://ask.dcloud.net.cn/question/180260

const store = useStore()

const props = defineProps({
	title: {
		type: String,
		default: ''
	},
	showNavBack: {
		type: Boolean,
		default: false
	},
	onNavClick: {
		type: Function,
		default: null
	},
	opacity: {
		type: Number,
		default: 1
	},
	eleColor: {
		type: String,
		default: '#ffffff'
	}
})
const navbarInfo = computed(() => store.getters.navbarInfo)
</script>

<template>
	<view
		class="navbar"
		:style="`height: ${navbarInfo.barHeight}px; padding-top: ${
			navbarInfo.statusBarHeight
		}px; background: rgba(21, 101, 192, ${opacity});`"
	>
		<image src="/static/imgs/nav-back.png" class="navbar-back" @click="onNavClick" v-if="showNavBack" />
		<view class="navbar-title" :style="`height: ${navbarInfo.navHeight}px; color: ${eleColor}`">{{
			title
		}}</view>
	</view>
</template>

<style lang="scss" scoped>
.navbar {
	margin: 0;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 99;

	&-back {
		padding-left: 16px;
		position: fixed;
		width: 24px;
		height: 24px;
	}

	&-title {
		font-size: 18px;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
	}
}
</style>
