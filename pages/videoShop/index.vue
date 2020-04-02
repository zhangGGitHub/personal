<template>
	<view style="background: #333333;">
		<swiper style="height: 40vh;" indicator-color="#acacac" indicator-active-color="#FFFFFF" :indicator-dots="true"
		 :autoplay="true" :interval="2000" :duration="1000" :circular="true" @change="changeImg">
			<swiper-item v-for="(item,index) in topImageList" :key="index">
				<view class="swiper-item" style="height: 100%;">
					<image :src="item.url" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
		<!-- 轮播商品来自哪个店 -->
		<view class="mask text-white flex align-center justify-between">
			<view>
				<view class="text-sm">来自小店</view>
				<view class="text-lg text-bold padding-top-xs">{{topImageList[imgIndex].name}}</view>
			</view>
			<view>
				详情<text class="cuIcon-right" />
			</view>
		</view>
		<!-- 立即购买当前轮播商品 -->
		<view class="padding flex align-center justify-between">
			<text class="text-price text-red text-xl text-bold">{{topImageList[imgIndex].price}}</text>
			<view class="cu-btn bg-red sm btn">立即购买</view>
		</view>
		<view>
			<view class="title text-gray padding">同款</view>
			<view class="img_group flex flex-wrap justify-between">
				<view v-for="(item,index) in 7" :key="index" class="img_list" @click="toVideoDetail">
					<image src="https://dummyimage.com/600x400/ed4068/ffffff" style="width: 100%;height: 100%;"></image>
					<view class="img_detail flex align-center justify-between text-white">
						<view class="flex align-center" style="flex: 1;">
							<view class="cu-avatar sm round" style="background-image:url(https://dummyimage.com/600x400/ffffff/ed4068)" />
							<view class="margin-left-xs text-sm text-cut" style="width: 120rpx;">海鲜商贸城城</view>
						</view>
						<view class="flex align-center">
							<text class="cuIcon-like" style="font-size: 34rpx;" />
							<view class="margin-left-xs">30.1w</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 顶部图片列表
				topImageList: [{
					url: 'https://dummyimage.com/600x400/ed4068/ffffff',
					price: 20.00,
					name: '小鱼干'
				}, {
					url: 'https://dummyimage.com/600x400/569e34/ffffff',
					price: 30.00,
					name: '苹果'
				}, {
					url: 'https://dummyimage.com/600x400/e69e6e/ffffff',
					price: 19.00,
					name: '吸尘器'
				}],
				// 滑动切换的图片下标
				imgIndex: 0
			}
		},
		methods: {
			// 改变轮播图时
			changeImg: function(e) {
				this.imgIndex = e.detail.current
			},
			// 点击下方封面跳转视频详情
			toVideoDetail: function(e) {
				uni.navigateTo({
					url: '../videoDetail/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mask {
		margin-top: -148rpx;
		position: relative;
		padding: 0 30rpx 60rpx;
	}

	.mask_buy {
		background: rgba($color: #000000, $alpha: 0.2);
	}

	.btn {
		font-size: 26rpx;
		padding: 30rpx 90rpx;
		box-shadow: 0 0 10rpx #e54d42;
	}

	.btn:active {
		transform: translate(1rpx, 1rpx);
	}

	.title {
		padding-top: 0;
	}

	.img_list {
		width: 49.9%;
		height: 500rpx;
		margin-bottom: 1px;
		position: relative;

		.img_detail {
			padding: 20rpx 30rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			background-color: rgba($color: #000000, $alpha: 0.1);
			width: 100%;
		}
	}
</style>
