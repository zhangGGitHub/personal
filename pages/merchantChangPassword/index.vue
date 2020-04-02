<template>
	<view style="margin-top: 20rpx;">
		<van-cell-group>
			<view class="flex justify-between" style="align-items: center">
				<van-field label="手机号" type="number" placeholder="请输入手机号" @input="getMobile" style="80%" />
				<van-button v-if="codeStatus" block type="info" custom-class="shadow_btn" @click="getVerificationCode" style="width:35%">发送验证码</van-button>
				<van-button v-else block type="info" custom-class="shadow_btn" @click="getVerificationCodeAgain(time)" style="width:35%">{{time}}s再次发送</van-button>
			</view>
			<van-field label="验证码" type="number" placeholder="请输入验证码" @input="getCode" />
			<van-field label="新密码" type="password" placeholder="请输入新密码" @input="getNewPassword" />
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
