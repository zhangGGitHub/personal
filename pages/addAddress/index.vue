<template>
	<view style="margin-top: 20rpx;">
		<van-cell-group>
			<van-field label="收货人" placeholder="请输入收货人姓名" @input="getName" />
			<van-field label="手机号码" type="number" placeholder="请输入收货人手机号码" @input="getPhone" />
			<picker mode="region" @change="getCity">
				<van-field label="所在城市" placeholder="请选择城市" :readonly="true" :value="city" is-link />
			</picker>
			<van-field label="收货地址" placeholder="请输入详细的收货地址" @input="getAddress" />
			<van-cell title="设为默认地址">
				<view slot="right-icon">
					<switch :checked="switchChecked" @change="changeSwitch" />
				</view>
			</van-cell>
		</van-cell-group>
		<view class="padding" style="padding-top: 60rpx;">
			<van-button block type="info" custom-class="shadow_btn" @click="addAddress">保存收货地址</van-button>
		</view>
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
				// 滑块开关
				switchChecked: true,
				// 省市区
				city: '',
				// 姓名
				name: '',
				// 手机号码
				phone: '',
				// 详细地址
				address: ''
			}
		},
		methods: {
			// 点击确认新增按钮
			addAddress: function() {
				if (this.address == "") {
					Toast('详细地址不能为空')
				}
				if (this.city == '') {
					Toast('请选择所在城市')
				}
				if (this.phone == "") {
					Toast('手机号码不能为空')
				}
				if (this.name == "") {
					Toast('收货人姓名不能为空')
				}
				if (this.address && this.phone && this.name && this.city) {
					this.uniFly.post({
						url: '/addr/add',
						params: {
							consignee: this.name,
							phoneNumber: this.phone,
							city: this.city,
							shippingAddress: this.address,
							isDefaultAddress: this.switchChecked ? '1' : '0',
							userId: uni.getStorageSync('userInfo').userId
						}
					}).then(res => {
						console.log('确认新增', res)
						if (res.data.code == 0) {
							Dialog.alert({
								title: '提示',
								message: '新增收货地址成功'
							}).then(() => {
								uni.navigateBack({
									delta: 1
								})
							})
						} else {
							Toast(res.data.msg)
						}
					})
				}
			},
			// 切换switch
			changeSwitch: function() {
				this.switchChecked = !this.switchChecked
			},
			// 选择城市
			getCity: function(e) {
				this.city = e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]
			},
			// 获取输入的姓名
			getName: function(e) {
				this.name = e.detail
			},
			// 获取输入的手机号
			getPhone: function(e) {
				this.phone = e.detail
			},
			// 获取输入的详细地址
			getAddress: function(e) {
				this.address = e.detail
			}
		}
	}
</script>

<style scoped>

</style>
