<template>
	<view>
		<swiper style="height: 100vh;" :vertical="true" @change="changeVideo">
			<swiper-item v-for="(item,index) in videoList" :key="index">
				<video :src="item.url" :loop="true" :enable-play-gesture="true" :autoplay="videoIndex==index" :id="index" :controls="false"
				 style="width: 100%;height: 100%;" />
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	let play = false
	export default {
		data() {
			return {
				videoIndex: 0,
				videoList: [{
						url: 'https://zhwl1.oss-cn-beijing.aliyuncs.com/video/1.mp4',
						id: '1'
					},
					{
						url: 'https://zhwl1.oss-cn-beijing.aliyuncs.com/video/2.mp4',
						id: "2"
					}, {
						url: 'https://zhwl1.oss-cn-beijing.aliyuncs.com/video/3.mp4',
						id: '3'
					}
				]
			}
		},
		methods: {
			changeVideo: function(e) {
				var index = e.detail.current
				this.videoCtxNext = uni.createVideoContext(index.toString(), this);
				if (index > this.videoIndex) {
					this.videoCtxNext.play()
					this.videoCtxPre = uni.createVideoContext((index - 1).toString(), this);
					this.videoCtxPre.stop()
					this.videoCtxPre.seek(0)
				} else {
					this.videoCtxNext.play()
					this.videoCtxPre = uni.createVideoContext((index + 1).toString(), this);
					this.videoCtxPre.stop()
					this.videoCtxPre.seek(0)
				}

				this.videoIndex = index
			}
		}
	}
</script>

<style scoped>

</style>
