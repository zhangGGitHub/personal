<template>
	<!-- <p>店铺管理</p> -->
	<!-- <view class="padding-xl radius shadow-warp bg-white margin-top">翘边阴影</view> -->
	<view>
		<view class="padding-sm" v-if="status == 1">
			<view class="light bg-grey padding radius text-center shadow-blur flex justify-between:space-between">
				<image src="../../static/bg.jpeg" style="width:100rpx;height:100rpx" mode=""></image>
				<text class="shopName">凡舍</text>
				<view class="align-center">
					<text class="text-gray">编辑</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
		</view>
		<view class="apply" v-else>
			<van-cell-group>
				<view class="padding b_title">基本信息</view>
				<view class="cu-form-group">
					<view class="title">名称</view>
					<input placeholder="请输入商户名称" name="input" v-model="name"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">手机号码</view>
					<input placeholder="请输入商户手机号码" name="input" v-model="phone"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">身份证号</view>
					<input placeholder="请输入商户身份证号" name="input" v-model="idCard"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">账号</view>
					<input placeholder="请输入您的账号" name="input" v-model="account"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">密码</view>
					<input placeholder="请输入您的密码" name="input" v-model="password"></input>
				</view>
				<view class="cu-bar bg-white margin-top" style="border-top: 1rpx solid #eee;">
					<view class="action">
						图片上传
					</view>
					<view class="action">
						{{imgList.length}}/1
					</view>
				</view>
				<view class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						 <image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length<1">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
				</view>
				<view class="padding b_title">认证信息</view>
				<view class="rz flex align-center justify-between" style="padding-right: 20rpx;">
					<view class="padding" style="flex-grow: 1;">店铺认证状态</view>
					<view class='cu-tag round' style="margin-right: 20rpx;">待认证</view>
					<text class="cuIcon-right"></text>
				</view>
			</van-cell-group>
			<button class="sure" type="default" @click="sure">确认</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				status:2,
				name:'',
				phone:'',
				idCard:'',
				account:'',
				password:'',
				imgList: []
			}
		},
		methods:{
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定删除这张照片吗？',
					cancelText: '点错了',
					confirmText: '是的',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			getName: function(e) {
				this.name = e.detail
			},
			getPhone: function(e) {
				this.phone = e.detail
			},
			getIdCard: function(e) {
				this.idCard = e.detail
			},
			getAccount: function(e) {
				this.account = e.detail
			},
			getPassword: function(e) {
				this.passwod = e.detail
			},
			sure:function(){
				console.log(this.name)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shopName{
		flex-grow: 1;
		font-size: 32rpx;
		text-align: left;
		margin-left: 30rpx;
		font-weight: bold;
		color:#000000;
	}
	.sure{
		position: fixed;
		left:0;
		right:0;
		width: 90%;
		height:80rpx;
		background-color: #1989fa;
		color:#FFFFFF;
		bottom: 60rpx;
		border-radius: 60rpx;
	}
	.b_title{
		font-weight: bold;
		font-size: 34rpx;
		background-color: rgba(245,245,245,.5);
	}
</style>
