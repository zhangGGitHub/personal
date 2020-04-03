<template>
	<view>
		<view class="background">
			<image src="../../static/bg.jpeg" mode="aspectFill" style="width: 100vw;height: 350rpx;" />
		</view>
		<view class="text-white user flex align-center text-lg">
			<image :src="userDetailWx.avatarUrl" class="shadow-warp" />
			<text class="text-bold" style="margin-left: 30rpx;flex:1">欢迎你，{{userDetailWx.nickName}}</text>
		</view>
		
		<view class="money bg-white radius shadow flex justify-between">
			<view class="flex flex-direction align-center">
				<text class="text-black text-bold text-xl">0</text>
				<text class="padding-top-xs text-sm">当天金额</text>
			</view>
			<view class="flex flex-direction align-center">
				<text class="text-black text-bold text-xl">0.00</text>
				<text class="padding-top-xs text-sm">总金额</text>
			</view>
		</view>
		
		<view class="list bg-white radius shadow">
			<van-cell-group>
				<van-cell title="修改密码" @click="toMerchantChangPassword" />
				<van-cell title="售卖详情" @click="toSellDetails" />
			</van-cell-group>
		</view>
	</view>
	
</template>

<script>
	import Toast from '../../wxcomponents/vant/toast/toast.js';
	import Dialog from '../../wxcomponents/vant/dialog/dialog.js';
	export default{
		data(){
			return{
				isLogin:false,
				userDetailWx:{}
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
		methods:{
			// 跳转商家端修改密码
			toMerchantChangPassword: function() {
				// Toast('跳转商家端修改密码')
				uni.navigateTo({
					url:'../merchantChangPassword/index'
				})
			},
			// 跳转商家端售卖详情
			toSellDetails: function() {
				uni.navigateTo({
					url:'../sellDetails/index'
				})
			},
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
	.money {
		width: 90%;
		margin: 0 auto 30rpx;
		padding: 30rpx 50rpx;
		// justify-content: center;
		.flex{
			width: 50%;
		}
	}
	.list {
		width: 90%;
		margin: 30rpx auto 0;
	}
</style>
