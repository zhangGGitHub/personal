<template>
	<view class="container">
		<view style="border-bottom: 2rpx solid #EEEEEE;height: 110rpx;">
			<van-search placeholder="请输入搜索关键词" shape="round" />
		</view>
		<scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-top="scrollTop">
			<view v-for="(item,index) in commodityGroup" :key="index" class="tab-bar-item" :class="[commodityGroupIndex==index ? 'active' : '']"
			 :data-current="index" @tap.stop="swichNav">
				<text>{{item.typeName}}</text>
			</view>
		</scroll-view>

		<scroll-view scroll-y class="right-box">
			<block v-for="(item,index) in commodityGroup[commodityGroupIndex].goods" :key="index">
				<view class="padding-top-xs flex">
					<view>
						<image :src="item.goodsImage" style="width: 140rpx;height: 140rpx;" />
					</view>
					<view class="padding-left-xs flex flex-direction padding-right" style="flex: 1;">
						<view>{{item.goodsName}}</view>
						<view class="text-gray text-sm">销量{{item.sellNum}} 库存{{item.stock}}</view>
						<view class="flex justify-between align-center" style="margin-top: auto;">
							<text class="text-price">{{item.price}}</text>
							<view v-if="item.num!=0">
								<van-stepper :value="item.num" :disable-input="true" :long-press="false" :min="0" @minus="goodsLessNum(item.id)"
								 @plus="goodsAddNum(item.id)" />
							</view>
							<view v-else>
								<view class="num" @click="goodsAddNum(item.id)"></view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<view>
			<van-submit-bar :price="totalPrice*100" :disabled="totalPrice==0 ? true:false" button-text="提交订单" button-type="info"
			 @submit="isShowShopCar=true" />
		</view>
		<van-popup :show="isShowShopCar" position="bottom" @click-overlay="isShowShopCar=false">
			<view class="padding">
				<view class="padding-bottom text-center text-bold text-xl">已购商品</view>
				<view class="flex align-center justify-between padding-bottom padding-left-xs padding-right-xs" style="font-size: 30rpx;"
				 v-for="(item,index) in selectCommodityList" :key="index">
					<view style="width: 33%;">{{item.goodsName}}</view>
					<view style="width: 33%;">单价：<text class="text-price text-orange">{{item.price}}</text></view>
					<view class="text-center" style="width: 33%;">数量：x{{item.num}}</view>
				</view>
				<view style="border-top: 2rpx solid #F1F1F1;" v-if="isDefaultAddress">
					<view class="padding-bottom padding-top flex align-center justify-between">
						<view>配送至默认收货地址:</view>
						<view @click="toModify">
							<van-tag plain type="primary" size="medium">去更改</van-tag>
						</view>
					</view>
					<view class="address1" style="flex: 1;padding: 20rpx 0 20rpx 20rpx;">
						<view class="flex align-center">
							<view>收货人：{{defaultAddress.consignee}}</view>
							<view class="margin-left">手机号：{{defaultAddress.phoneNumber}}</view>
						</view>
						<view class="padding-top-xs">
							地址：{{defaultAddress.city}}-{{defaultAddress.shippingAddress}}
						</view>
					</view>
				</view>
				<view class="padding-top-sm flex justify-center">
					<van-button type="info" size="normal" @click="confirmPay">确认付款</van-button>
				</view>
			</view>
		</van-popup>
		<van-dialog use-slot title="长按保存二维码" :show="isShowQrCodeDialog" @confirm="isShowQrCodeDialog = false">
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
		data() {
			return {
				// 商品的分类
				commodityGroup: [],
				// 选择的商品分类下标 默认第一个
				commodityGroupIndex: 0,
				// tab标题的滚动条位置
				scrollTop: 0,
				// 总价格
				totalPrice: 0,
				// 选择的商品
				selectCommodityList: [],
				// 是否设置默认收货地址
				isDefaultAddress: false,
				// 默认收货地址
				defaultAddress: {},
				// 是否展示弹出层
				isShowShopCar: false,
				// 显示支付二维码
				isShowQrCodeDialog: false,
				// 支付二维码base64
				payQrcode: ''
			}
		},
		onLoad: function() {
			if (uni.getStorageSync('selectShopDetail')) {
				this.getCommodityGroup(uni.getStorageSync('selectShopDetail').id)
			} else {
				this.commodityGroup = []
				Dialog.alert({
					title: '提示',
					message: '检测到未选择商铺,请先选择商铺'
				}).then(() => {
					uni.switchTab({
						url: '../index/index'
					})
				})
			}
		},
		onShow: function() {
			if (uni.getStorageSync('isLogin')) {
				this.checkDefaultAddress()
			}
			if (uni.getStorageSync('selectShopDetail')) {
				Dialog.close()
			}
			if (uni.getStorageSync('selectShopDetail') && this.totalPrice == 0) {
				this.getCommodityGroup(uni.getStorageSync('selectShopDetail').id)
			}
		},
		watch: {
			commodityGroup: { //监听的对象
				deep: true, //深度监听设置为 true
				handler: function(e) {
					var price = 0
					var arr = []
					// 所有商品放入arr中
					e.forEach(r => {
						r.goods.forEach(rr => {
							arr.push(rr)
						})
					})
					// 接收去重后的数据
					var result = [];
					// 判断去重
					var obj = {};
					// 去重
					for (var i = 0; i < arr.length; i++) {
						if (!obj[arr[i].id]) {
							result.push(arr[i]);
							obj[arr[i].id] = true;
						}
					}
					// 去重后计算总价
					result.forEach(r => {
						price += r.num * r.price
					})
					this.selectCommodityList = result.filter(r => {
						return r.num != 0
					})
					this.totalPrice = price
				}
			}
		},
		methods: {
			// 点击确认付款 --> 检查是否登录 --> 检查有没有默认收货地址 --> 生成订单 --> 支付
			confirmPay: function() {
				var that = this
				// 检查是否登录
				if (uni.getStorageSync('isLogin')) {
					// 检查有没有默认地址
					if (this.isDefaultAddress) {
						this.isShowShopCar = false
						Toast.loading({
							duration: 0,
							mask: true,
							message: '生成订单'
						})
						// 获取订单号
						this.getOrderNumber()
					} else {
						this.isShowShopCar = false
						Dialog.confirm({
							title: '提示',
							message: '检测到未设置收货地址',
							confirmButtonText: '去设置'
						}).then(() => {
							uni.navigateTo({
								url: '../addressList/index'
							})
						}).catch(() => {
							Dialog.close()
						})
					}
				} else {
					this.isShowShopCar = false
					Dialog.alert({
						title: '提示',
						message: '请先登录'
					}).then(() => {
						uni.navigateTo({
							url:'../login/index'
						})
					})
				}
			},
			// 上传商品获取订单号
			getOrderNumber: function() {
				var that = this
				var detail = []
				this.selectCommodityList.forEach(r => {
					detail.push({
						goodsId: r.id,
						goodsName: r.goodsName,
						goodsImage: r.goodsImage,
						num: r.num
					})
				})
				this.uniFly.post({
					url: '/shops/order/add',
					params: {
						userId: uni.getStorageSync('userInfo').userId,
						shopsId: uni.getStorageSync('selectShopDetail').id,
						orderUser: that.defaultAddress.consignee,
						phone: that.defaultAddress.phoneNumber,
						payDictionary: 'shopsPay',
						reserve1: that.defaultAddress.city + '-' + that.defaultAddress.shippingAddress,
						details: detail
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
						totalPrice: this.totalPrice.toFixed(2),
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
			},
			// 查询默认地址
			checkDefaultAddress: function() {
				var that = this
				this.uniFly.post({
					url: '/addr/getDefault',
					params: {
						userId: uni.getStorageSync('userInfo').userId
					}
				}).then(res => {
					console.log('查询默认地址', res)
					if (res.data.code == 0) {
						if (res.data.data) {
							that.isDefaultAddress = true
							that.defaultAddress = res.data.data
						} else {
							that.isDefaultAddress = false
						}
					} else {
						that.isDefaultAddress = false
						Toast(res.data.msg)
					}
				})
			},
			// 修改配送地址
			toModify: function() {
				uni.navigateTo({
					url: '../addressList/index'
				})
			},
			// 商品加数量
			goodsAddNum: function(e) {
				var that = this
				// this.commodityGroup[this.commodityGroupIndex].goods[e].num++
				for (var i = 0; i < this.commodityGroup.length; i++) {
					for (var j = 0; j < this.commodityGroup[i].goods.length; j++) {
						if (this.commodityGroup[i].goods[j].id == e) {
							this.commodityGroup[i].goods[j].num++
						}
					}
				}
			},
			// 商品减数量
			goodsLessNum: function(e) {
				var that = this
				// this.commodityGroup[this.commodityGroupIndex].goods[e].num--
				for (var i = 0; i < this.commodityGroup.length; i++) {
					for (var j = 0; j < this.commodityGroup[i].goods.length; j++) {
						if (this.commodityGroup[i].goods[j].id == e) {
							this.commodityGroup[i].goods[j].num--
						}
					}
				}
			},
			// 获取商品和分类
			getCommodityGroup: function(id) {
				this.uniFly.post({
					url: '/shops/goods/selectGoods',
					params: {
						shopsId: id
					}
				}).then(res => {
					console.log('商品分类', res)
					res.data.data.forEach(r => {
						r.goods.forEach(rr => {
							rr.num = 0
						})
					})
					this.commodityGroup = res.data.data
				})
			},
			// 点击标题切换当前页时改变样式
			swichNav: function(e) {
				let cur = e.currentTarget.dataset.current;
				if (this.commodityGroupIndex == cur) {
					return false;
				} else {
					this.commodityGroupIndex = cur;
					this.checkCor();
				}
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor: function() {
				let that = this;
				//这里计算按照实际情况进行修改，动态数据要进行动态分析
				//思路：窗体高度/单个分类高度 200rpx 转px计算 =>得到一屏幕所显示的个数，结合后台传回分类总数进行计算
				//数据很多可以多次if判断然后进行滚动距离计算即可
				if (that.commodityGroupIndex > 7) {
					that.scrollTop = 500
				} else {
					that.scrollTop = 0
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fcfcfc;
	}

	/* 左侧导航布局 start*/

	/* 隐藏scroll-view滚动条*/

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.tab-view {
		/* height: 100%; */
		height: calc(100vh - 210rpx);
		width: 200upx;
		position: fixed;
		top: 110rpx;
		left: 0;
		z-index: 10;
		background: #f6f6f6;
	}

	.tab-bar-item {
		width: 200upx;
		height: 110upx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26upx;
		color: #444;
		font-weight: 400;
	}

	.active {
		position: relative;
		color: #007AFF;
		font-size: 30upx;
		font-weight: 600;
		background: #fcfcfc;
		transition: all .2s;
	}

	.active::before {
		content: "";
		position: absolute;
		border-left: 8upx solid #007AFF;
		height: 30upx;
		left: 0;
	}

	/* 左侧导航布局 end*/

	.right-box {
		height: calc(100vh - 210rpx);
		width: 100%;
		position: fixed;
		padding-left: 220upx;
		box-sizing: border-box;
		left: 0;
		top: 110rpx;
	}


	.num {
		position: relative;
		display: inline-block;
		box-sizing: border-box;
		margin: 1px;
		vertical-align: middle;
		border: 0;
		background-color: #f2f3f5;
		color: #323233;
		width: 28px;
		height: 28px;
		padding: 4px;
		border-radius: 0 8rpx 8rpx 0;
	}

	.num::before {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		background-color: currentColor;
		content: "";
		width: 9px;
		height: 1px;
	}

	.num::after {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		background-color: currentColor;
		content: "";
		width: 1px;
		height: 9px;
	}

	.address1 {
		border: 2rpx solid #F6F6F6;

		.modify1 {
			width: 20%;
			height: 130rpx;
			line-height: 130rpx;
			border-left: 2rpx solid #F6F6F6;
		}

		.modify1:active {
			background-color: #F0F0F0;
		}
	}
</style>
