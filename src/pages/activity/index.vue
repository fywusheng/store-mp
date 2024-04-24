<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
	<view class="main_content">
		<!-- 门店管理-活动通知 -->
		<view class="hd_list" v-for="(item,index) in list" :key="index" @click="handleGoDetails(item,item.dqStatus)">
			<view class="date">{{item.createTime}}</view>
			<view class="content">
				<view class="img">
					<image :src="item.activityPic" mode="widthFix" class="hd_img"></image>
					<view class="hdend_mask flex_r_h" v-if="item.dqStatus">
						<image src="http://192.168.1.187:10088/static/store-mp/hdend_icon.png" mode="widthFix"
							class="end_img"></image>
					</view>
				</view>
				<view class="hd_main">
					<view class="hd_title">{{item.activityTitle}}</view>
					<view class="desc">{{item.activityDesc}}</view>
				</view>
			</view>
		</view>
		<view class="loading">
			<uni-load-more :status="status" :content-text="loadText"></uni-load-more>
		</view>
	</view>
</template>
<script>
	import api from '@/apis/index.js';
	export default {
		data() {
			return {
				status: 'more',
				loadText: {
					contentdown: '轻轻上拉',
					contentrefresh: '努力加载中',
					contentnomore: '我是有底线的'
				},
				// 数据列表
				list: [],
				show: false,
				mode: 'date',
				queryParam: {
					pageNum: 1,
					pageSize: 10,
				},
			};
		},
		created() {

		},
		mounted() {
			this.getActivityList();
		},
		onLoad(e) {},
		methods: {

			/**
			 * 获取活动列表
			 */
			getActivityList() {
				let params = {
					queryObject: {
						storeNos:uni.getStorageSync('storeNo'),
					},
					...this.queryParam
				};
				this.status = 'loading';
				try {
					api.getActivityList({
						data: {
							...params
						},
						success: (data) => {
							console.log("整理前数据", data)
							const dayjs = require('dayjs');
							// 获取当前日期
							const currentDate = dayjs();
							if (data) {
								const list = data.list || [];
								list.forEach(item => {
									item.dqStatus = currentDate.isAfter(dayjs(item.endTime))
								})
								if (this.pageNum == 1) this.list = [];
								if (list.length) {
									this.list = this.list.concat(list);
									this.status = data.totalPages > data.pageNum ? "more" : "noMore";
								} else {
									this.status = "noMore";
								}
								if (this.list.length == 0) {
									this.status = "noMore";
								}
							} else {
								this.list = []
								this.status = "noMore";
							}
						},
						fail: (err) => {
							this.$uni.showToast(err.message);
							uni.stopPullDownRefresh()
							uni.hideLoading()
						}
					})
				} catch (error) {
					this.status = "noMore";
				}
			},
			/**
			 * 去详情 handleGoDetails
			 */
			handleGoDetails(items, status) {
				if (status) {
					this.$uni.showToast('活动已到期');
				} else {
					uni.navigateTo({
						url: '/pages/activity/details?details=' + JSON.stringify(items)
					})
				}

			},

		},
		// 上拉加载
		onReachBottom() {
			console.log('上拉', this.status, this.queryParam.pageNum)
			if (this.status === 'noMore') return;
			this.queryParam.pageNum++;
			this.getActivityList()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.queryParam.pageNum = 1;
			this.getActivityList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 200);
		},
		onShow() {},
		destroyed() {

		},
	};
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
	.flex_r_h {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.flex_c_h {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.main_content {
		padding: 24rpx 32rpx;

		.hd_list {
			margin-bottom: 38rpx;

			.date {
				width: 280rpx;
				height: 48rpx;
				line-height: 48rpx;
				background: rgba(0, 0, 0, 0.1);
				border-radius: 27rpx;
				text-align: center;
				font-size: 24rpx;
				color: #FFFFFF;
				margin: auto;
				margin-bottom: 32rpx;
				padding: 0 30rpx;
			}

			.content {
				border-radius: 16rpx;

				.img {
					position: relative;

					.hd_img {
						width: 100%;
					}

					.hdend_mask {
						position: absolute;
						top: 0;
						right: 0;
						left: 0;
						bottom: 0;
						background: rgba(0, 0, 0, 0.6);
						justify-content: center;
						border-radius: 16rpx;

						.end_img {
							width: 260rpx;
						}
					}
				}

				.hd_main {
					padding: 24rpx;
					background: #FFFFFF;

					.title {
						font-size: 32rpx;
						font-weight: 500;
						color: #333333;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.desc {
						font-size: 28rpx;
						color: #999999;
						margin-top: 16rpx;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
						text-overflow: ellipsis;

					}
				}
			}

		}
	}
</style>