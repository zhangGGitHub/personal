<template>
	<view>
		<view class="nav flex">
			<view class="tab" :class="{'active':num==index}" v-for="(item,index) in tab" :key="index" @click="clickTab(index)">{{item}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				tab:['当天销售记录','总销售记录'],
				num:0
			}
		},
		onLoad() {
			
		},
		onShow() {
			
		},
		methods:{
			clickTab(index){
				this.num = index
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav{
		box-sizing: border-box;
		padding: 0 28rpx;
		.tab{
			width: 50%;
			box-sizing: border-box;
			padding: 30rpx 0;
			text-align: center;
		}
		.active{
			color: rgba(25,137,250,1);
			font-size: 32rpx;
			position: relative;
		}
		.active::after{
			content: '';
			position: absolute;
			left:0;
			right:0;
			margin:auto;
			bottom: 0;
			width:100rpx;
			height:10rpx;
			background-color: rgba(25,137,250,1);
		}
	}
	
</style>
