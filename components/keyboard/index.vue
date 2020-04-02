<template name="keyboard">
	<view>
		<van-popup :show="true" position="bottom" :overlay="false" custom-style="background-color:#f1f1f1">
			<view class="padding-sm padding-bottom flex justify-between text-bold text-xl">
				<view class="flex flex-wrap" style="flex: 1;">
					<view v-for="(item,index) in 9" :key="index" :data-index="index+1" class="number" @click="getNum">{{item+1}}</view>
					<view class="number zero" style="margin-bottom: 0;" data-index="0" @click="getNum">0</view>
					<view class="number" style="margin-bottom: 0;" data-index="." @click="getNum">.</view>
				</view>
				<view class="flex flex-direction" style="width: 23%;">
					<view class="delete" style="width: 100%;" @click="deleteNum">
						<text class="cuIcon-backdelete" />
					</view>
					<button class="pay flex align-center justify-center text-white" @click="pay">付款</button>
				</view>
			</view>
		</van-popup>
		<van-dialog use-slot title="长按保存二维码" :show="isShowQrCodeDialog" @confirm="isShowQrCodeDialog = false,money=''">
			<view class="flex align-center justify-center">
				<image @longpress="saveQrCode" :src="'data:image/png;base64,'+payQrcode" style="width:520rpx;height: 520rpx;" />
			</view>
		</van-dialog>
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Toast from '../../wxcomponents/vant/toast/toast.js';
	import Dialog from '../../wxcomponents/vant/dialog/dialog.js';
	export default {
		name: "keyboard",
		//属性
		props: {
			isShow: {
				type: Boolean, //属性类型
				value: true
			}
		},
		data() {
			return {
				// 输入额金额
				money: '',
				// 显示支付二维码
				isShowQrCodeDialog: false,
				// 支付二维码base64
				payQrcode: ''
			}
		},
		watch: {
			money(val) {
				this.$emit('money', val); //主要
			}
		},
		methods: {
			// 获取输入的数字
			getNum: function(e) {
				uni.vibrateShort({})
				if (e.currentTarget.dataset.index == '.' && this.money == '') {
					this.money = '0.'
				} else if (e.currentTarget.dataset.index == '0' && this.money == '' || e.currentTarget.dataset.index == '0' &&
					this.money == '0') {
					this.money = '0'
				} else if (e.currentTarget.dataset.index == '.' && this.money.indexOf('.') != -1) {

				} else if (e.currentTarget.dataset.index == '0' && this.money == '0.0') {
					this.money = '0'
				} else {
					this.money = this.money.concat(e.currentTarget.dataset.index)
				}
			},
			// 点击删除按钮
			deleteNum: function() {
				uni.vibrateShort({})
				var str = this.money
				this.money = str.substr(0, str.length - 1)
			},
			// 点击付款
			pay: function() {
				var that = this
				uni.vibrateShort({})
				if (uni.getStorageSync('isLogin')) {
					if (this.money == '' || this.money == 0) {
						Toast('请输入正确金额')
					} else {
						that.getOrderNumber()
					}
				} else {
					Dialog.alert({
						title: '提示',
						message: '请先登录'
					}).then(() => {
						uni.switchTab({
							url: '../../pages/personal/index'
						})
					})
				}
			},
			// 获取订单号
			getOrderNumber: function() {
				var that = this
				this.uniFly.post({
					url: '/shops/order/add',
					params: {
						userId: uni.getStorageSync('userInfo').userId,
						shopsId: uni.getStorageSync('selectShopDetail').id,
						orderUser: "",
						phone: "",
						payDictionary: "shopsPay",
						reserve1: "",
						details: [{
							goodsId: -1,
							price: this.money,
							goodsName: '建行聚合支付',
							goodsImage: 'https://jiankangdaka.oss-cn-beijing.aliyuncs.com/pay.png',
							num: '1'
						}]
					},
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(res => {
					console.log('获取订单号', res)
					if (res.data.code == 0) {
						// 1:中金支付  2:生成建行聚合码
						if (uni.getStorageSync('selectShopDetail').reserve3 == 1) {
							Toast('中金支付')
						} else if (uni.getStorageSync('selectShopDetail').reserve3 == 2) {
							Toast.loading({
								duration: 0,
								mask: true,
								message: '建行聚合支付'
							})
							that.createQrCode(res.data.data.orderNo)
						} else {
							Toast('未知支付类型')
						}
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 生成建行聚合支付码
			createQrCode: function(orderNo) {
				var that = this
				this.uniFly.post({
					url: '/shops/order/createQrCode',
					params: {
						userId: uni.getStorageSync('userInfo').userId,
						totalPrice: this.money,
						orderNo: orderNo,
						payDictionary: 'shopsPay'
					}
				}).then(res => {
					console.log('生成建行聚合二维码', res)
					if (res.data.code == 0) {
						Toast.clear()
						that.payQrcode = res.data.data.payCode.replace(/[\r\n]/g, '');
						that.isShowQrCodeDialog = true
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 长按保存二维码
			saveQrCode: function() {
				var that = this
				uni.getSetting({
					success: (res) => {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							console.log('未授权')
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success: function() {
									console.log('用户点击了授权')
									that.getTemporaryPath(that.payQrcode)
								},
								fail: function() {
									console.log('用户拒绝了授权')
									uni.showModal({
										title: '提示',
										content: '若点击不授权，将无法使用保存图片功能',
										cancelText: '不授权',
										cancelColor: '#999',
										confirmText: '授权',
										confirmColor: '#f94218',
										success: (e) => {
											if (e.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							})
						} else {
							console.log('保存图片至本地')
							that.getTemporaryPath(that.payQrcode)
						}
					}
				})
			},
			// base64转成临时路径 保存本地
			getTemporaryPath: function(base) {
				var that = this
				var aa = uni.getFileSystemManager();
				aa.writeFile({
					filePath: wx.env.USER_DATA_PATH + '/pay.png',
					data: base,
					encoding: 'base64',
					success: res => {
						uni.saveImageToPhotosAlbum({
							filePath: wx.env.USER_DATA_PATH + '/pay.png',
							success: function(res) {
								that.isShowQrCodeDialog = false
								Toast('保存成功')
							},
							fail: function(err) {
								Toast('取消保存')
							}
						})
					},
					fail: err => {
						Toast(err)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.number {
		width: 30%;
		margin-bottom: 14rpx;
		margin-right: 18rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 4rpx;
		background-color: #FFFFFF;
		box-shadow: 4rpx 4rpx 4rpx rgba($color: #e9e9e9, $alpha: 0.7);
	}

	.zero {
		width: 63%;
	}

	.delete {
		width: 100%;
		margin-bottom: 14rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 4rpx;
		background-color: #FFFFFF;
	}

	.pay {
		margin: 0;
		flex: 1;
		background: #07C160;
		border-radius: 4rpx;
	}

	.number:active {
		background-color: #e4e4e4;
	}

	.delete:active {
		background-color: #e4e4e4;
	}

	.pay:active {
		background-color: #06ab53;
	}
</style>
