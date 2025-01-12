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
		default: 0
	},
	eleColor: {
		type: String,
		default: '#151515'
	},
	navBackIcon: {
		type: String,
		default: '../static/imgs/nav-back.png'
	}
})
const navbarBackIcon = computed(() => {
	// TODO: fix：navBackIcon未定义
	// eslint-disable-next-line
	return props.navBackIcon ? props.navBackIcon : navBackIcon
})
const navbarInfo = computed(() => store.getters.navbarInfo)
</script>

<template>
	<view
		class="navbar"
		:style="`height: ${navbarInfo.barHeight}px; padding-top: ${
			navbarInfo.statusBarHeight
		}px; background: rgba(255, 251, 238, ${opacity}); ${
			opacity === 1 && 'box-shadow: 0px 1px 13.4px 0px rgba(171, 128, 64, 0.34);'
		}`"
	>
		<!-- TODO: fix: 现阶段不支持传入颜色显示svg，右上角图标需要改成可配置 -->
		<image :src="navbarBackIcon" class="navbar-back" @click="onNavClick" v-if="showNavBack"></image>
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
		width: 24px;
		height: 24px;
		padding-left: 16px;
		position: fixed;
	}

	&-title {
		font-size: 16px;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
	}
}
</style>
