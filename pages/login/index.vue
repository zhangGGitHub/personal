<template>
	<view style="height: 100vh;background: linear-gradient(90deg,rgba(35,164,255,1) 0%,rgba(45,122,238,1) 100%);padding-top: 100rpx;">
		<view class="title">解放融媒短视频平台</view>

		<view>
			<button class="cu-btn block bg-white lg shadow btn-user" @click="type = 1" open-type="getUserInfo" @getuserinfo="getUserInfo">
				<text class="cuIcon-profile" style="font-size: 52rpx;margin-right: 40rpx;"></text>
				<text>用户登录</text>
			</button>
		</view>
		<view>
			<button id="btn-shop" class="cu-btn block bg-white margin-tb-sm lg shadow" @click="type = 2" open-type="getUserInfo"
			 @getuserinfo="getUserInfo">
				<text class="cuIcon-group_fill" style="font-size: 52rpx;margin-right: 40rpx;"></text>
				<text>商家登录</text>
			</button>
		</view>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '../../wxcomponents/vant/toast/toast';
	export default {
		data() {
			return {
				// 是否登录
				isLogin: false,
				// 临时登录凭证
				code: '',
				// 判断用户类型
				type: 0
			};
		},
		onLoad: function() {
			var that = this
			// 获取临时code
			uni.login({
				success: (e) => {
					that.code = e.code
				}
			})
		},
		methods: {
			// 用户点击登录
			getUserInfo: function(e) {
				var that = this
				if (e.detail.errMsg == 'getUserInfo:ok') {
					var code = ''
					console.log('用户点击登录', e)
					if (this.code == '') {
						// 获取临时code
						uni.login({
							success: (e) => {
								code = e.code
							}
						})
					}
					this.userDetailWx = e.detail.userInfo
					Toast.loading({
						mask: true,
						duration: 0,
						message: '登录中'
					})
					this.uniFly.post({
						url: '/user/decodeUserInfo',
						params: {
							iv: e.detail.iv,
							encryptedData: e.detail.encryptedData,
							code: that.code == '' ? code : that.code
						}
					}).then(res => {
						console.log('解密openid', res)
						if (res.data.code != 0) {
							Toast(res.data.code)
						}
						if (res.data.code == 0 && !res.data.data.openId) {
							Toast('openid解密失败,请重新登录')
						}
						if (res.data.code == 0 && res.data.data.openId) {
							// 通过openid登录
							that.loginByOpenId(e.detail.userInfo.avatarUrl, e.detail.userInfo.nickName, res.data.data.openId)
						}
					})
				}
			},
			// 通过openId登录
			loginByOpenId: function(avatarUrl, nickName, openId) {
				var that = this
				this.uniFly.post({
					url: '/user/loginByOpenId',
					params: {
						openId: openId,
						userName: nickName, 
						avatar: avatarUrl
					}
				}).then(res => {
					console.log('通过openId登录', res)
					if (res.data.code == 0) {
						this.isLogin = true
						uni.setStorageSync('isLogin', true)
						uni.setStorageSync('openId', openId)
						uni.setStorageSync('userInfo', res.data.data.userInfo)
						uni.setStorageSync('token', res.data.data.token);
						that.uniFly.headers['Token'] = res.data.data.token;
						if (that.type == 1) {
							Toast('登陆成功-普通')
							uni.setStorageSync('tokenType', 1);
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 200)
						} else if (that.type == 2) {
							uni.setStorageSync('tokenType', 2);
							Toast('登陆成功-商家')
							setTimeout(function() {
								uni.reLaunch({
									url: '../merchantSide/index'
								})
							}, 200)
						}

					} else {
						Toast('登录失败,' + res.data.msg)
					}
				})
			},
			// 跳转地址管理页面
			toAddressList: function() {
				uni.navigateTo({
					url: '../addressList/index'
				})
			}
		}
	};
</script>

<style scoped>
	.title {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		font-size: 32rpx;
		margin: 40rpx 0;
	}

	.btn-user {
		width: 80%;
		margin: 0 auto;
		color: #0081ff;
		border-radius: 60rpx;
	}

	#btn-shop {
		width: 80%;
		margin: 0 auto;
		margin-top: 60rpx;
		color: #ff5500;
		border-radius: 60rpx;
	}
</style>
