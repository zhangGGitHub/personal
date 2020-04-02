<template>
	<view class="index">
		<view style="border-bottom: 2rpx solid #EEEEEE;height: 110rpx;">
			<van-search placeholder="请输入搜索关键词" shape="round" />
		</view>
		<swiper style="height: 30vh;" indicator-color="#acacac" indicator-active-color="#FFFFFF" :indicator-dots="true"
		 :autoplay="true" :interval="2000" :duration="1000" :circular="true" @change="changeImg">
			<swiper-item v-for="(item,index) in topImageList" :key="index">
				<view class="swiper-item" style="height: 100%;">
					<image :src="item.url" mode=""></image>
				</view>
			</swiper-item>
		</swiper>

		<view class="img_group flex flex-wrap justify-between">
			<view v-for="(item,index) in 5" :key="index" class="img_list" @click="toVideoDetail">
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
				//轮播图片列表
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
			}
		}
	}
</script>

<style lang="scss" scoped>
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
