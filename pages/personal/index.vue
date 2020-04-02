<template>
	<view>
		<view class="background">
			<image src="../../static/bg.jpeg" mode="aspectFill" style="width: 100vw;height: 440rpx;" />
		</view>
		<view class="text-white user flex align-center text-lg" v-if="isLogin">
			<image :src="userDetailWx.avatarUrl" class="shadow-warp" />
			<text class="text-bold" style="margin-left: 30rpx;flex:1">欢迎你，{{userDetailWx.nickName}}</text>
		</view>
		<view class="text-white user flex align-center" style="height: 220rpx;" v-else>
			<van-button plain hairline type="info" @click="toLogin">点击登录</van-button>
		</view>
		<view class="bg-white radius padding-top padding-bottom order shadow">
			<view class="padding flex align-center justify-between" style="border-bottom: 2rpx solid #EEEEEE;padding-top: 0;">
				<text class="text-black text-bold text-xl">我的订单</text>
				<view @click="toOrederList(0)">
					<text>查看全部订单</text>
					<text class="cuIcon-unfold" style="display:inline-block;transform:rotate(-90deg);"></text>
				</view>
			</view>
			<view class="padding flex justify-around align-center" style="padding-bottom: 0;">
				<view class="flex flex-direction align-center" @click="toOrederList(1)">
					<text class="cuIcon-cart icon" />
					<text class="text">未支付</text>
				</view>
				<view class="flex flex-direction align-center" @click="toOrederList(2)">
					<text class="cuIcon-sponsor icon" />
					<text class="text">已支付</text>
				</view>
				<view class="flex flex-direction align-center" @click="toOrederList(3)">
					<text class="cuIcon-goodsnew icon" />
					<text class="text">已发货</text>
				</view>
				<view class="flex flex-direction align-center" @click="toOrederList(4)">
					<text class="cuIcon-deliver icon" />
					<text class="text">已退货</text>
				</view>
			</view>
		</view>
		<view class="money bg-white radius shadow flex justify-between" @click="showToast">
			<view class="flex flex-direction align-center">
				<text class="text-black text-bold text-xl">0</text>
				<text class="padding-top-xs text-sm">优惠券</text>
			</view>
			<view class="flex flex-direction align-center">
				<text class="text-black text-bold text-xl">0.00</text>
				<text class="padding-top-xs text-sm">余额</text>
			</view>
			<view class="flex flex-direction align-center">
				<text class="text-black text-bold text-xl">0</text>
				<text class="padding-top-xs text-sm">积分</text>
			</view>
			<view class="flex flex-direction align-center">
				<text class="text-black text-bold text-xl">0</text>
				<text class="padding-top-xs text-sm">赠品</text>
			</view>
		</view>
		<view class="list bg-white radius shadow">
			<van-cell-group>
				<van-cell title="地址管理" is-link @click="toAddressList" />
				<van-cell title="更多" is-link @click="isShowActionSheet = true" />
			</van-cell-group>
		</view>
		<van-action-sheet cancel-text="取消" :show="isShowActionSheet" :actions="actions" @close="isShowActionSheet=false"
		 @cancel="isShowActionSheet=false" />
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Toast from '../../wxcomponents/vant/toast/toast.js';
	import Dialog from '../../wxcomponents/vant/dialog/dialog.js';
	export default {
		data() {
			return {
				// 是否登录
				isLogin: false,
				// 用户微信信息
				userDetailWx: {},
				// 分享上拉菜单
				isShowActionSheet: false,
				// 上拉菜单的内容
				actions: [{
					name: '分享',
					openType: 'share'
				}]
			}
		},
		onLoad: function() {
			this.isLogin = uni.getStorageSync('isLogin')
			if (uni.getStorageSync('isLogin')) {
				this.userDetailWx.nickName = uni.getStorageSync('userInfo').userName
				this.userDetailWx.avatarUrl = uni.getStorageSync('userInfo').avatar
			}
		},
		onShow: function() {
			this.isLogin = uni.getStorageSync('isLogin')
			if (uni.getStorageSync('isLogin')) {
				this.userDetailWx.nickName = uni.getStorageSync('userInfo').userName
				this.userDetailWx.avatarUrl = uni.getStorageSync('userInfo').avatar
			}
		},
		methods: {
			// 点击跳转登录页面
			toLogin: function() {
				uni.navigateTo({
					url: '../login/index'
				})
			},
			// 跳转地址管理页面
			toAddressList: function() {
				uni.navigateTo({
					url: '../addressList/index'
				})
			},
			// 跳转订单列表
			toOrederList: function(index) {
				if (this.isLogin) {
					if (uni.getStorageSync('selectShopDetail')) {
						// 0:全部 1:未支付 2:已支付 3:已发货 4:已退货
						uni.navigateTo({
							url: '../orderList/index?active=' + index
						})
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
				} else {
					Toast('请先登录')
				}
			},
			// 点击优惠券等
			showToast: function() {
				Toast('敬请期待')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.background {
		position: absolute;
		z-index: -999;
		border-bottom-left-radius: 30%;
		border-bottom-right-radius: 30%;
		overflow: hidden;
	}

	.user {
		padding: 40rpx 50rpx;

		// color: #E8F4D9;
		image {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			border: 2px solid #FFFFFF;
		}
	}

	.order {
		width: 90%;
		margin: 0 auto;

		.icon {
			font-size: 54rpx;
		}

		.text {
			font-size: 24rpx;
			padding-top: 10rpx;
		}
	}

	.money {
		width: 90%;
		margin: 30rpx auto 0;
		padding: 30rpx 50rpx;
	}

	.list {
		width: 90%;
		margin: 30rpx auto 0;
	}
</style>
