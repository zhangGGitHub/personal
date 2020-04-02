<template>
	<view>
		<view class="bg-white">
			<view class="padding text-white head">
				<picker mode="selector" :range="shopNameList" :value="selectShopIndex" @change="changeShopList">
					<view class="text-bold text-xxl margin-bottom-xl">
						<text>{{selectShopDetail==null ? '请选择商铺':selectShopDetail.shopsName}}</text>
						<text class="cuIcon-triangledownfill" />
					</view>
				</picker>
				<view class="card flex justify-between">
					<view @click="jumpToPayPage()">
						<text class="cuIcon-refund" />
						<text class="text-xl text-bold margin-left-sm">买单</text>
					</view>
					<view @click="jumpToPersonal()">
						<text class="cuIcon-my" />
						<text class="text-xl text-bold margin-left-sm">我的</text>
					</view>
				</view>
			</view>
			<view class="padding flex align-center">
				<text class="cuIcon-location text-blue" />
				<text v-if="selectShopDetail==null">
					请先选择商铺
				</text>
				<text v-else class="text-grey text-cut margin-left-xs" style="flex: 1;">
					{{selectShopDetail.province}}{{selectShopDetail.city}}{{selectShopDetail.county}}{{selectShopDetail.address}}
				</text>
			</view>
		</view>
		<view class="margin-top-sm padding bg-white">
			<view class="flex justify-between align-center">
				<text class="text-lg text-black text-bold">公告</text>
				<text class="cuIcon-unfold text-grey" style="display: inline-block;transform: rotate(-90deg);" />
			</view>
			<view class="margin-top-sm text-black">
				{{selectShopDetail==null ? '请先选择商铺':selectShopDetail.reserve2}}
			</view>
		</view>
		<view class="margin-top-sm padding bg-white flex">
			<view class="flex align-center justify-between padding-right" style="flex: 1;border-right: 2rpx solid #eeeeee;"
			 @click="toMyCoupon">
				<view>
					<p class="text-black text-bold">我的优惠券</p>
					<p class="text-gray text-sm margin-top-xs">
						<text class="text-yellow">0</text>
						<text>张可用</text>
					</p>
				</view>
				<view>
					<image src="../../static/coupon.png" style="width: 70rpx;height: 70rpx;" />
				</view>
			</view>
			<view class="flex align-center justify-between padding-left" style="flex: 1;" @click="toMyVip">
				<view>
					<p class="text-black text-bold">我的会员卡</p>
					<p class="text-gray text-sm margin-top-xs">尊享会员优惠</p>
				</view>
				<view>
					<image src="../../static/vip.png" style="width: 76rpx;height: 50rpx;" />
				</view>
			</view>
		</view>
		<view class="margin-top-sm padding bg-white">
			<view class="text-lg text-black text-bold">热销推荐</view>
			<view class="margin-top-sm text-black flex align-center justify-between">
				<view v-for="(item,index) in shopHotList" :key="index" style="width: 32%;" @click="toShop">
					<image :src="item.goodsImage" style="width: 100%;height: 200rpx;border-radius: 10rpx;" />
					<p class="text-bold">{{item.goodsName}}</p>
					<p class="text-sm padding-top-xs padding-bottom-xs">销量：{{item.sellNum}}</p>
					<p>
						<text class="text-price text-red">{{item.price}}</text>
					</p>
				</view>
			</view>
		</view>
		<view class="margin-top-sm padding bg-white flex justify-center">
			<image src="../../static/more.png" style="width: 90%;height: 100rpx;" @click="toVideoShop" />
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
				// 是否登录
				isLogin: false,
				// 商铺列表 - 原数据
				shopList: [],
				// 商铺名称列表 - piker数据
				shopNameList: [],
				// 选择的商铺详情
				selectShopDetail: null,
				// 选择的商铺下标
				selectShopIndex: 0,
				// 热销商品
				shopHotList: []
			}
		},
		onLoad: function() {
			// 检查是否登录
			this.isLogin = uni.getStorageSync('isLogin')
			// 如果之前选择过商铺 拿到 默认信息/热销商品 并更新已存储的商铺
			if (uni.getStorageSync('selectShopDetail')) {
				// this.selectShopDetail = uni.getStorageSync('selectShopDetail')
				// 更新已存的商铺信息
				this.updateShopDetail(uni.getStorageSync('selectShopDetail').id)
				// 获取热销商品
				this.getHotShop(uni.getStorageSync('selectShopDetail').id)
			}
		},
		onShow: function() {
			// 检查是否登录
			this.isLogin = uni.getStorageSync('isLogin')
			// 获取商铺列表
			this.getShopList()
		},
		methods: {
			// 获取商铺列表
			getShopList: function() {
				var that = this
				this.shopList = []
				this.shopNameList = []
				this.uniFly.post({
					url: '/shops/shops/list'
				}).then(res => {
					console.log('获取商铺列表', res)
					if (res.data.code == 0) {
						this.shopList = res.data.rows
						res.data.rows.forEach(r => {
							this.shopNameList.push(r.shopsName)
						})
						if (uni.getStorageSync('selectShopDetail')) {
							for (var i = 0; i < res.data.rows.length; i++) {
								if (res.data.rows[i].id == uni.getStorageSync('selectShopDetail').id) {
									that.selectShopIndex = i
									return
								}
							}
						}
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 更新已存的商铺信息
			updateShopDetail: function(e) {
				this.uniFly.post({
					url: '/shops/shops/selectById',
					params: {
						id: e
					}
				}).then(res => {
					console.log('已选择,更新商铺信息', res)
					if (res.data.code == 0) {
						this.selectShopDetail = res.data.data
						uni.setStorageSync('selectShopDetail', res.data.data)
					} else {
						Toast(res.data.msg)
					}
				})
			},
			//选择商铺
			changeShopList: function(e) {
				console.log('切换商铺', e)
				this.selectShopIndex = e.detail.value
				this.selectShopDetail = this.shopList[e.detail.value]
				uni.setStorageSync('selectShopDetail', this.shopList[e.detail.value])
				this.getHotShop(this.shopList[e.detail.value].id)
			},
			// 获取首页热销商品
			getHotShop: function(id) {
				this.uniFly.post({
					url: '/shops/goods/selectGoods',
					params: {
						shopsId: id
					}
				}).then(res => {
					console.log('商品分类', res)
					if (res.data.code == 0) {
						this.shopHotList = res.data.data.filter(r => {
							return r.typeName == '热搜'
						})[0].goods
					} else {
						Toast(res.data.msg)
					}
				})
			},
			// 跳转支付页面
			jumpToPayPage: function() {
				uni.switchTab({
					url: '../pay/index'
				})
			},
			// 跳转个人中心页面
			jumpToPersonal: function() {
				uni.switchTab({
					url: '../personal/index'
				})
			},
			// 跳转我的优惠券
			toMyCoupon: function() {
				Toast('敬请期待')
			},
			// 跳转我的会员卡页面
			toMyVip: function() {
				Toast('敬请期待')
			},
			// 跳转商品页面
			toShop: function() {
				uni.switchTab({
					url: '../shop/index'
				})
			},
			// 跳转视频商品页面
			toVideoShop: function() {
				uni.navigateTo({
					url:'../videoShop/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head {
		background: url(../../static/bg.jpeg);
		background-size: 100% auto;
		padding-top: 160rpx;
		border-bottom-left-radius: 40rpx;
		border-bottom-right-radius: 40rpx;
		height: 33vh;
		overflow: hidden;

		.card {
			width: 100%;
			margin: 0 auto;

			view {
				width: 49%;
				background-color: rgba($color: #ffffff, $alpha: 0.5);
				border-top-left-radius: 10rpx;
				border-top-right-radius: 10rpx;
				height: calc(33vh - 270rpx);
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 60rpx;
			}
		}
	}
</style>
