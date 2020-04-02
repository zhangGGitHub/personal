<template>
	<view class="container">
		<view class="top flex align-center justify-between">
			<view>
				<view class="text-black text-bold text-xl">
					付款给商家
				</view>
				<view class="padding-top-xs text-gray text-bold">
					名称：{{shopDetail.shopsName}}
				</view>
			</view>
			<view>
				<image :src="shopDetail.shopsImage" />
			</view>
		</view>
		<view class="money padding">
			<view class="text-xl text-grey text-bold margin-bottom">金额</view>
			<view class="flex align-center money_input">
				<text class="text-black text-bold" style="font-size: 72rpx;">￥</text>
				<view class="text-black text-bold" style="font-size: 66rpx;flex: 1;" v-if="money">{{money}}</view>
				<view class="text-gray" :class="isActive && money=='' ? 'cursor':''" style="font-size: 60rpx;flex: 1;" @click="isActive = true"
				 v-else>请输入金额</view>
			</view>
		</view>
		<keyboard @money="getMoney" />
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import keyboard from '../../components/keyboard/index.vue'
	import Toast from '../../wxcomponents/vant/toast/toast.js';
	import Dialog from '../../wxcomponents/vant/dialog/dialog.js';
	export default {
		components: {
			keyboard
		},
		data() {
			return {
				// 输入的金额
				money: '',
				// 是否点击输入
				isActive: false,
				// 商家详情
				shopDetail: {}
			}
		},
		onLoad: function() {
			if (uni.getStorageSync('selectShopDetail')) {
				this.shopDetail = uni.getStorageSync('selectShopDetail')
			} else {
				Dialog.alert({
					title: '提示',
					message: '请先选择商铺'
				}).then(() => {
					uni.switchTab({
						url: '../index/index'
					})
				})
			}
		},
		onShow: function() {
			if (uni.getStorageSync('selectShopDetail')) {
				this.shopDetail = uni.getStorageSync('selectShopDetail')
				Dialog.close()
			} else {
				Dialog.alert({
					title: '提示',
					message: '请先选择商铺'
				}).then(() => {
					uni.switchTab({
						url: '../index/index'
					})
				})
			}
		},
		methods: {
			getMoney: function(e) {
				this.money = e
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		background-color: #FFFFFF;

		.top {
			padding: 30rpx 30rpx 70rpx;
			height: 200rpx;
			background-color: #f8f8f8;

			image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 4rpx;
			}
		}

		.money {
			padding: 40rpx 50rpx;
			position: relative;
			top: -30rpx;
			background-color: #FFFFFF;
			border-top-right-radius: 40rpx;
			border-top-left-radius: 40rpx;

			.money_input {
				border-bottom: 2rpx solid #F1F1F1;

				.cursor {
					position: relative;
				}

				.cursor:after {
					content: '';
					display: block;
					width: 4rpx;
					height: 70rpx;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					background-color: #454545;
					animation: adzcc 1s infinite;
					opacity: 1;
				}

				@keyframes adzcc {

					0%,
					100% {
						opacity: 0;
					}

					50% {
						opacity: 1;
					}
				}
			}
		}
	}
</style>
