<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
	<view>
		<web-view :src="nfo.activityUrl" v-if="info.activityUrl"></web-view>
		<view class="main_content" v-else>
			<!-- 门店管理-活动详情 -->
			<view class="hd_detail">
				<view class="top">
					<image :src="info.activityPic" mode="widthFix" class="hd_img"></image>
					<view class="date">活动时间：{{info.beginTime}} 至 {{info.endTime}}</view>
				</view>
				<view class="hd_main">
					<view class="details">
						<view class="title">{{info.activityTitle}}</view>
						<view class="desc">
							{{info.activityDesc}}
						</view>
					</view>
				</view>
			</view>
			<view class="footer">
				 <button open-type="share" class="share_btn">分享活动</button>
			</view>
		</view>
	</view>
	
</template>
<script>
	import api from '@/apis/index.js';
	export default {
		data() {
			return {
				info:null,//信息
			}
		},
		onLoad(options) {
			// this.queryActivityDetails(options?.id)
			
			this.info = JSON.parse(options?.details)
			console.log(this.info)
		},
		onShareAppMessage() {
		  return {
		    title: this.info.activityTitle,
		    path:  '/pages/activity/details?details=' + JSON.stringify(this.info),
		    imageUrl:  this.info.activityPic,
		    success(res) {
		      uni.showToast({
		        title: '分享成功'
		      })
		    },
		    fail(res) {
		      uni.showToast({
		        title: '分享失败',
		        icon: 'none'
		      })
		    }
		  }
		},
		methods: {
			/**
			 * 获取活动详情==弃用
			 */
			queryActivityDetails(id) {
				let params = {
					id: id
				};
				this.list = [];
				api.getActivityDetails({
					data: params,
					success: (data) => {
						console.log("活动详情", data)
						this.info = data;
						
					}
				})
			},
			
			
		}
	}
</script>
<style>
	page {
		display: flex;
		flex-direction: column;
		height: 100%;
		/* #ifdef H5 */
		background-color: #fff;
		/* #endif */

	}
</style>
<style lang="scss">
	.flex_r_h{
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.flex_c_h{
		display: flex;
		align-items: center;
		justify-content:center;
		flex-direction: column;
	}
	.main_content{
		.hd_detail{
			margin-bottom: 38rpx;
			.top{
				background: #FFFFFF;
				.hd_img{
					width: 100%;
				}
				.date{
					padding: 16rpx 0;
					width: 100%;
					text-align: center;
				}
			}
			.hd_main{
				padding: 24rpx 32rpx;
				.details{
					height: 116rpx;
					background: linear-gradient(180deg, rgba(255,85,0,0.17) 0%, rgba(255,85,0,0.04) 58%, rgba(255,255,255,0) 100%);
					border-radius: 16rpx;
				}
				.title{
					font-size: 36rpx;
					font-weight: 500;
					color: #FF5500;
					padding: 32rpx 0 34rpx 0;
					text-align: center;
					border-bottom: 1rpx solid #EEEEEE;
				}
				.desc{
					padding: 24rpx;
					font-size: 28rpx;
					color: #303133;
				}
			}
			
		}
		.footer{
			position: fixed;
			bottom: 0;
			height: 166rpx;
			padding: 16rpx 32rpx 62rpx 32rpx;
			width: 100%;
			background: #FFFFFF;
			.share_btn{
				width: 100%;
				height: 88rpx;
				line-height: 88rpx;
				background: linear-gradient(135deg, #FF8800 0%, #FF5500 100%);
				border-radius: 44rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
			}
		}
	}
</style>
