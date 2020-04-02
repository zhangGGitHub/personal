<template>
	<view style="margin-top: 20rpx;">
		<van-cell-group>
			<van-field label="收货人" :value="addressDefault.consignee" placeholder="请输入收货人姓名" @input="getName" />
			<van-field label="手机号码" :value="addressDefault.phoneNumber" type="number" placeholder="请输入收货人手机号码" @input="getPhone" />
			<picker mode="region" @change="getCity">
				<van-field label="所在城市" placeholder="请选择城市" :readonly="true" :value="city" is-link />
			</picker>
			<van-field label="收货地址" :value="addressDefault.shippingAddress" placeholder="请输入详细的收货地址" @input="getAddress" />
			<van-cell title="设为默认地址">
				<view slot="right-icon">
					<switch :checked="switchChecked" @change="changeSwitch" />
				</view>
			</van-cell>
		</van-cell-group>
		<view class="padding" style="padding-top: 60rpx;">
			<view class="margin-bottom">
				<van-button block type="info" custom-class="shadow_btn" @click="modifyAddress">修改收货地址</van-button>
			</view>
			<van-button block type="danger" custom-class="shadow_btn" @click="deleteAddress">删除收货地址</van-button>
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
				// 收货地址id
				addressId: '',
				// 收货地址默认值
				addressDefault: {},
				// 滑块开关
				switchChecked: true,
				// 省市区
				city: '',
				// 姓名
				name: '',
				// 手机号码
				phone: '',
				// 收货地址
				address: ''

			}
		},
		onLoad: function(options) {
			this.addressId = options.id
			this.getAddressDefaultById(options.id)
		},
		methods: {
			// 点击修改收货地址
			modifyAddress: function() {
				if (this.address == "") {
					Toast('详细地址不能为空')
				}
				if (this.phone == "") {
					Toast('手机号码不能为空')
				}
				if (this.name == "") {
					Toast('收货人姓名不能为空')
				}
				if (this.address && this.phone && this.name) {
					this.uniFly.post({
						url: '/addr/update',
						params: {
							id: this.addressId,
							consignee: this.name,
							phoneNumber: this.phone,
							city: this.city,
							shippingAddress: this.address,
							isDefaultAddress: this.switchChecked ? '1' : '0',
							userId: uni.getStorageSync('userInfo').userId
						}
					}).then(res => {
						console.log('修改地址', res)
						if (res.data.code == 0) {
							Dialog.alert({
								title: '提示',
								message: '地址修改成功'
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
			// 点击删除收货地址
			deleteAddress: function() {
				var that = this
				Dialog.confirm({
					title: '提示',
					message: '确认删除当前收货地址？'
				}).then(() => {
					Dialog.close()
					that.uniFly.post({
						url: '/addr/delete',
						params: {
							bookId: that.addressId
						}
					}).then(res => {
						console.log('点击删除', res)
						if (res.data.code == 0) {
							Dialog.alert({
								title: '提示',
								message: '删除成功'
							}).then(() => {
								uni.navigateBack({
									delta: 1
								})
							})
						} else {
							Toast(res.data.msg)
						}
					})
				}).catch(() => {
					Dialog.close()
				})
			},
			// 获取当前id的地址默认信息
			getAddressDefaultById: function(id) {
				this.uniFly.post({
					url: '/addr/list',
					params: {
						userId: uni.getStorageSync('userInfo').userId
					}
				}).then(res => {
					console.log('地址列表', res)
					if (res.data.code == 0) {
						this.addressDefault = res.data.data.filter(r => {
							return r.id == id
						})[0]
						this.name = res.data.data.filter(r => {
							return r.id == id
						})[0].consignee
						this.phone = res.data.data.filter(r => {
							return r.id == id
						})[0].phoneNumber
						this.city = res.data.data.filter(r => {
							return r.id == id
						})[0].city
						this.address = res.data.data.filter(r => {
							return r.id == id
						})[0].shippingAddress
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 切换switch
			changeSwitch: function() {
				// uni.vibrateShort({})
				this.switchChecked = !this.switchChecked
			},
			// 获取输入姓名
			getName: function(e) {
				this.name = e.detail
			},
			// 获取输入手机号
			getPhone: function(e) {
				this.phone = e.detail
			},
			// 获取输入详细地址
			getAddress: function(e) {
				this.address = e.detail
			},
			// 选择城市
			getCity: function(e) {
				console.log(e.detail.value)
				this.city = e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]
			}
		}
	}
</script>

<style scoped>

</style>
