<template>
	<view style="margin-top: 20rpx;">
		<van-cell-group>
			<view class="cu-form-group">
				<view class="title">手机号</view>
				<input placeholder="请输入手机号" name="input" @input="getMobile"></input>
				<button v-if="codeStatus" class='cu-btn bg-green shadow' @click="getVerificationCode">验证码</button>
				<button v-else class='cu-btn bg-green shadow' @click="getVerificationCodeAgain(time)">验证码</button>
			</view>
			<view class="cu-form-group">
				<view class="title">验证码</view>
				<input placeholder="请输入验证码" name="input" @input="getCode"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">新密码</view>
				<input placeholder="请输入新密码" name="input" @input="getNewPassword"></input>
			</view>
		</van-cell-group>
		<button type="default" class="sure" @click="surePassword">确认</button>
	</view>
</template>

<script>
	import Toast from '../../wxcomponents/vant/toast/toast.js';
	import Dialog from '../../wxcomponents/vant/dialog/dialog.js';
	export default {
		data() {
			return {
				codeStatus: true,
				mobile: '',
				verificationCode: '',
				newPassword: '',
				time: 59
			}
		},
		onLoad() {

		},
		onShow() {

		},
		methods: {
			getMobile: function(e) {
				this.mobile = e.detail
			},
			// 获取输入的手机号
			getCode: function(e) {
				this.verificationCode = e.detail
			},
			// 获取输入的详细地址
			getNewPassword: function(e) {
				this.newPassword = e.detail
			},
			//获取验证码
			getVerificationCode: function() {
				if (this.mobile == "" || this.mobile.length != 11) {
					uni.showToast({
						title: '手机号码输入错误',
						icon: 'none'
					})
					}else{
						uni.showToast({
							title: '已发送',
							icon: 'none'
						})
						this.codeStatus = false
						var that = this
						let codeTime = setInterval(function() {
							that.time--
							if (that.time <= 0) {
								console.log('时间加载完毕')
								clearInterval(codeTime)
								that.codeStatus = true
								that.time = 59
							}
						}, 1000)
					}
					
				},
				//一分钟内重复点击验证码
				getVerificationCodeAgain: function(e) {
					uni.showToast({
						title: '请' + e + 's后再试',
						icon: 'none'
					})
				},
				surePassword(){
					uni.showToast({
						title: '已确认修改',
						icon: 'none'
					})
				}
			}
		}
</script>

<style lang="scss" scoped>
	.sure{
		width: 92%;
		// height: 56rpx;
		background-color: rgba(25,137,250,1);
		color: #FFFFFF;
		font-size: 32rpx;
		margin-top: 120rpx;
		border-radius: 80rpx;
	}
</style>
