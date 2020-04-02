<template>
	<view style="background: #000000;height: 100vh;position: relative;">
		<video class="video" :src="videoUrl" :loop="true" :autoplay="true" :show-fullscreen-btn="false" :show-play-btn="true"
		 :enable-play-gesture="true" :auto-pause-if-navigate="true"></video>
		<view class="padding-left back text-white flex align-center" :style="'margin-top:'+statusBarHeight +';height:'+customHeight"
		 @click="navgateback">
			<text class="cuIcon-right text-bold round" style="font-size: 40rpx;display: block;transform: rotate(180deg);padding: 10rpx;"></text>返回
		</view>
		<view class="shop bg-white padding round flex align-center justify-center" @click="showShopCard = true">
			<text class="cuIcon-shop text-red" style="font-size: 40rpx;" />
		</view>
		<view>
			<van-popup :show="showShopCard" position="bottom" closeable round close-icon="close" @close="showShopCard = false">
				<view class="padding text-bold">购物车</view>
				<view class="padding padding-top-none flex align-center border-bottom">
					<image src="https://dummyimage.com/600x400/7f83e0/000000" style="width:220rpx;height: 180rpx;border-radius: 10rpx;"></image>
					<view style="height: 180rpx;" class="flex flex-direction margin-left-sm justify-around">
						<text class="text-price" style="font-size: 44rpx;color: #ee0a24;">1.00</text>
						<text class="text-sm" style="color: #969799;">剩余 134 件</text>
						<text class="text-sm" style="color: #969799;">选择 数量；尺寸；</text>
					</view>
				</view>
				<view class="padding flex align-center justify-between border-bottom">
					<view>购买数量</view>
					<van-stepper :value="1" :disable-input="true" />
				</view>
				<view class="padding">
					<button class="left_btn">立即购买</button>
				</view>
			</van-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 视频播放地址
				videoUrl: 'https://zhwl1.oss-cn-beijing.aliyuncs.com/video/1.mp4',
				// 顶部导航栏高度
				statusBarHeight: this.StatusBar + 'px',
				// 自定义高度
				customHeight: this.CustomBar + 'rpx',
				// 是否展示购物车
				showShopCard: false
			}
		},
		onLoad: function() {
			console.log('系统栏高度:', this.StatusBar)
			console.log('自定义高度', this.CustomBar)
		},
		methods: {
			navgateback: function() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.video {
		width: 100%;
		height: 98vh;
	}

	.back {
		position: absolute;
		top: 0;
	}

	.shop {
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		bottom: 14%;
		left: 8%;
		box-shadow: 0 0 40rpx #FFFFFF;
	}

	.padding-top-none {
		padding-top: 0;
	}

	.border-bottom {
		position: relative;
	}

	.border-bottom:after {
		content: '';
		display: block;
		width: 93%;
		height: 1px;
		background-color: #ebedf0;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	.left_btn {
		color: #FFFFFF;
		height: 80rpx;
		font-weight: 500;
		font-size: 28rpx;
		line-height: 80rpx;
		border: none;
		border-radius: 40rpx;
		background: linear-gradient(to right, #70a1ff, #3742fa);
		box-shadow: 4rpx 4rpx 10rpx rgba($color: #70a1ff, $alpha: 1.0);
	}

	.left_btn:active {
		transform: translate(2rpx, 2rpx);
	}
</style>
