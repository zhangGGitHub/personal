<template>
	<view style="width:100%;height:100%">
		<!-- <cu-custom bgColor="bg-white">
			<block slot="content">商家端首页</block>
		</cu-custom> -->
		<!-- :style="CustomBar" -->
		<view  class="bg-gradual-blue">
			<view class="group">
				<view class="box" @click="toMerchant">
					<text class="cuIcon-friendfill" />
					<p>个人中心</p>
				</view>
				<view class="box" @click="toMerchantIndex">
					<text class="cuIcon-homefill" />
					<p>首页</p>
				</view>
				<view class="box" @click="toMerchantShopManager">
					<text class="cuIcon-shopfill" />
					<p>店铺管理</p>
				</view>
				<view class="box" @click="toMerchantCommodityManeger">
					<text class="cuIcon-goodsfill" />
					<p>商品管理</p>
				</view>
				<view class="box" @click="toLogistics">
					<text class="cuIcon-deliver_fill" />
					<p>物流信息</p>
				</view>
				<view class="box" @click="toMerchantMore">
					<text class="cuIcon-more" />
					<p>更多</p>
				</view>
			</view>
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
				CustomBar: `height:calc(100vh - ${this.CustomBar}px)`
			}
		},
		onLoad: function() {
			console.log('下面是')
			console.log(this.CustomBar)
		},
		methods: {
			// 跳转商家端个人中心
			toMerchant: function() {
				uni.navigateTo({
					url:'../merchant/index'
				})
			},
			//跳转商家端首页
			toMerchantIndex: function() {
				uni.navigateTo({
					url:'../merchantIndex/index'
				})
			},
			// 跳转商家端店铺管理
			toMerchantShopManager: function() {
				uni.navigateTo({
					url:'../merchantShop/index'
				})
			},
			// 跳转商家端商品管理
			toMerchantCommodityManeger: function() {
				Toast('跳转商家端商品管理')
			},
			toLogistics:function(){
				uni.navigateTo({
					url:'../logistics/index'
				})
			},
			// 跳转商家端更多
			toMerchantMore: function() {
				Toast('跳转商家端更多')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.bg-gradual-blue{
		height:100%;
	}
	.group {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 90%;
		margin: 0 auto;
		padding-top: 200rpx;

		.box {
			width: 300rpx;
			height: 300rpx;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			box-sizing: border-box;
			box-shadow: 10rpx 10rpx 30rpx rgba($color: #000000, $alpha: 0.3);
			position: relative;
			padding: 20rpx;
			margin-bottom: 40rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;

			text {
				color: #333333;
				font-size: 80rpx;
				color: #0081ff;
			}

			p {
				padding-top: 30rpx;
				text-align: center;
				font-weight: bold;
				color: #333333;
			}
		}

		.box:active {
			top: 2rpx;
			left: 2rpx;
		}
	}
</style>
