<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if(uni.getStorageSync('tokenType') == 2){
				console.log('商户')
				uni.reLaunch({
					url:'pages/merchantSide/index'
				}) 
			}else{
				console.log('用户')
				uni.switchTab({
					url:'pages/index/index' 
				})
			}
			if (!uni.getStorageSync('isLogin')) {
				uni.setStorageSync('isLogin', false)
			}
			// 检查是否有token 有的话检查token是否失效 没有就重新登录
			if (uni.getStorageSync('token')) {
				this.uniFly.post({
					url: '/user/checkToken',
					params: {
						token: uni.getStorageSync('token')
					}
				}).then(res => {
					console.log('检测token是否失效', res)
					if (res.data.code == 0) {
						uni.setStorageSync('isLogin', true)
					} else {
						uni.setStorageSync('isLogin', false)
						uni.removeStorageSync('token')
					}
				})
			} else {
				uni.setStorageSync('isLogin', false)
			}

			// 获取系统导航栏的高度
			uni.getSystemInfo({
				success: function(e) {
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
				} 
			})
		},
		onShow: function() {
			console.log('App Show') 
			console.log(uni.getStorageSync('tokenType'))
			// if(uni.getStorageSync('tokenType') == 1){
			// 	console.log('用户')
			// 	uni.switchTab({
			// 		url:'pages/index/index' 
			// 	})   
			// }else{
			// 	console.log('商户')
			// 	uni.reLaunch({  
			// 		url:'pages/merchantSide/index'
			// 	}) 
			// }
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";
	page,html{
		height:100%;
		background-color: #FFFFFF;
	}
	.van-submit-bar__text {
		text-align: left !important;
		padding-left: 50rpx;
	}

	.van-stepper__input--disabled {
		color: #323233 !important;
	}

	.shadow_btn {
		box-shadow: 10rpx 10rpx 10rpx rgba($color: #000000, $alpha: 0.3);
	}
</style>
