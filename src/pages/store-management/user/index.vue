<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
	<view class="main_content">
		<!-- 门店管理-用户管理 -->
		<view class="top">
			<view class="form flex_r_h">
				<view class="view"><input type="text" placeholder="请输入手机号" v-model="search.phone"/></view>
				<view class="select view">
					<uni-data-select
						v-model="search.memberType"
						:localdata="userType"
						placeholder="请选择用户类型"
						:clear="false"
					 ></uni-data-select>
				</view>
			</view>
			<view class="search flex_r_h">
				<view class="date flex_r_h">
					注册时间：
					<view class="select_lang" @click="selectDate">
						<image mode="widthFix" src="/static/img/date-icon-h.png" class="icon"></image>
						<input placeholder="开始时间-结束时间" v-model="dateSelect" class="input_select" :disabled="true" />
						<image mode="widthFix" src="http://192.168.1.187:10088/static/store-mp/select_icon.png"
							class="icon_s" v-if="!showClearIcon"></image>
						<image mode="widthFix" src="http://192.168.1.187:10088/static/supermarket/icon-index.png"
							class="icon_s"  v-if="showClearIcon" @click.stop="clearIcon"></image>
					</view>
				</view>
				<view class="btn" @click.stop="handlerSearch">查询</view>
			</view>
		</view>
		<view class="order_content">
			<view class="list">
				<view class="item" v-for="(item,index) in list" :key="index">
					<view class="order_top flex_r_h">
						<view class="shp_name flex_r_h">
							<view>姓名：{{item.psnName}}</view>
						</view>
						<view :class="memberType==1?'status wc':'status qx'">{{memberType==1?'会员':'用户'}}</view>
					</view>
					<view class="or_content flex_r_h">
						<view class="left">
							<view class="flex_r_h">
								<view class="label">积分：</view><text class="desc">{{item.point}}</text>
							</view>
							<view class="flex_r_h">
								<view class="label">手机号：</view><text class="desc">{{item.phone}}</text>
							</view>
							<view class="flex_r_h">
								<view class="label">注册时间：</view><text class="desc">{{item.crteTime}}</text>
							</view>
							<view class="flex_r_h">
								<view class="label">默认地址：</view><text class="desc">{{item.districtArea}}</text>
							</view>
						</view>
					</view>
					<view class="bottom flex_r_h">
						<view class="details_btn" @click.stop="handleGoDetails(item.memberId)">查看详情</view>
					</view>
				</view>

			</view>
			<view class="loading">
				<uni-load-more :status="status" :content-text="loadText"></uni-load-more>
			</view>
		</view>
		
		<view class="footer_bottom">合计共{{total}}条</view>
		<!-- 日期选择框 -->
		<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" 
			:insert="false"
			:range="true" @confirm="confirmDate"  
		/>
	</view>
</template>

<script>
	import api from '@/apis/index.js';
	export default {
		data() {
			return {
				showClearIcon:false,
				list: [], //用户列表
				userType: [
					{
						value: '',
						text: '全部'
					},
					{
						value: 0,
						text: '用户'
					},
					{
						value: 1,
						text: '会员'
					},
				],
				userTypeShow: false,
				search:{
					crteStartTime:'',
					crteEndTime:'',
					memberType:'',
					pageNum: 1,
					pageSize:10,
					storeNo	:uni.getStorageSync('storeNo'),
					phone:''
				},
				dateSelect:'',
				total:0,
				status: 'more',
				loadText: {
					contentdown: '轻轻上拉',
					contentrefresh: '努力加载中',
					contentnomore: '我是有底线的'
				},
			};
		},
		created() {

		},
		mounted() {
		},
		onLoad(e) {},
		// 下拉刷新
		onPullDownRefresh() {},
		onShareAppMessage() {

		},
		methods: {
			clearIcon: function() {
				this.dateSelect = '';
				this.search.crteStartTime =''
				this.search.crteEndTime = ''
				this.showClearIcon = false;
			},
			/**
			 * 打开时间
			 */
			selectDate() {
				this.$refs.calendar.open()
			},
			confirmDate(obj){
				if(obj.range.data.length == 0){
					this.$uni.showToast('请选择时间区间范围');
					return;
				}
				this.search.crteStartTime = obj.range.data[0]
				this.search.crteEndTime = obj.range.data[obj.range.data.length-1]
				this.dateSelect =  obj.range.data[0]+'~' + obj.range.data[obj.range.data.length-1]
				this.showClearIcon = true;
			},
			/**
			 * 获取用户分页
			 * getUserData
			 */
			queryUserList() {
				this.status = 'loading';
				let params = {
					...this.search,
				}
				try {
					api.getUserData({
						data: {
							...params
						},
						success: (data) => {
							if (data) {
								console.log("数据", data)
								const list = data.list || [];
								if (this.search.pageNum == 1) this.list = [];
								this.total = data.total
								if (list.length) {
									this.list = this.list.concat(list);
									this.status = data.total.totalPages > data.pageNum ? "more" : "noMore";
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
			 * 查询
			 */
			handlerSearch() {
				this.search.pageNum = 1
				this.queryUserList()
			},
			/**
			 * 会员详情跳转
			 * @param {memberId}  
			 */
			handleGoDetails(id){
				uni.navigateTo({
					url: '/pages/store-management/user/details?memberId=' + id
				})
			}
		},
		// 上拉加载
		onReachBottom() {
			console.log('上拉', this.status, this.search.pageNum)
			if (this.status === 'nomore') return;
			this.search.pageNum++;
			this.queryUserList()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.search.pageNum = 1
			this.queryUserList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow() {
			uni.startPullDownRefresh();
		},
		destroyed() {},
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
<style lang="scss" scoped>
	.main_content {
		padding-bottom: 60rpx;
		.input_select {
			width: 100%;
			font-size: 24rpx;
			padding: 0 24rpx;
			height: 56rpx;
			line-height: 56rpx;
		}
		.top {
			padding: 24rpx 32rpx;
			background: #fff;

			.form {
				justify-content: space-between;

				.view {
					background: #F5F7FA;
					border-radius: 40rpx;
					width: 330rpx;
					input {
						font-size: 24rpx;
						padding: 0 24rpx;
						height:56rpx;
						line-height: 56rpx;
					}
				}

				.select {
					width: 310rpx;
					background: #F5F7FA;
					border-radius: 28rpx;
					position: relative;
					padding: 0 24rpx;
					z-index: 2;
				}

			}

			.search {
				margin-top: 32rpx;
				justify-content: space-between;

				.date {
					font-size: 24rpx;
					color: #333333;

					.date_content {
						width: 360rpx;
						height: 56rpx;
						background: #F5F7FA;
						border-radius: 28rpx;
						z-index: -1;
					}

					.select_lang {
						width: 410rpx;
						background: #F5F7FA;
						border-radius: 28rpx;
						position: relative;
						padding: 0 24rpx;
						z-index: 0;
						.icon {
							width: 35rpx;
							position: absolute;
							top: 10rpx;
							left: 13rpx;
						}
						.icon_s {
							width: 20rpx;
							position: absolute;
							top: 18rpx;
							right: 18rpx
						}
					}
				}

				.btn {
					width: 136rpx;
					height: 56rpx;
					line-height: 56rpx;
					text-align: center;
					background: linear-gradient(95deg, #FA7532 0%, #FF5500 100%);
					border-radius: 28rpx;
					color: #fff;
					font-size: 28rpx;
					font-weight: 500;
				}
			}
		}

		.order_content {
			padding: 34rpx;

			.list {
				.item {
					background: #FFFFFF;
					border-radius: 16rpx;
					padding: 24rpx;
					margin-bottom: 24rpx;

					.order_top {
						justify-content: space-between;
						padding: 0 0 24rpx 0;

						.shp_name {
							.icon {
								width: 32rpx;
							}

							view {
								font-size: 28rpx;
								font-weight: 500;
								color: #333333;
							}
						}

						.status {
							width: 104rpx;
							height: 50rpx;
							line-height: 50rpx;
							text-align: center;
							border-radius: 8rpx;
							font-size: 24rpx;

						}

						.qx {
							color: #999999;
							background: #F5F7FA;
						}

						.wc {
							color: #FF5500;
							background: #FFEEE6;
						}
					}

					.or_content {
						padding: 40rpx 0 20rpx 0;
						align-items: flex-start;
						justify-content: space-between;
						border-top: 1rpx solid #F5F7FA;
						border-bottom: 1rpx solid #F5F7FA;
						flex-wrap: wrap;

						.left {
							width: 100%;
							color: #333333;
							font-size: 26rpx;
							.flex_r_h {
								align-items: flex-start;
								line-height: 26rpx;
							}

							.label {
								width: 130rpx;
								text-align: justify;
								color: #999999;
							}

							.label:after {
								content: '';
								width: 100%;
								display: inline-block;
							}

							.desc {
								color: #333333;
							}
						}

					}

					.bottom {
						padding: 24rpx 0 0 0;
						justify-content: space-between;

						.details_btn {
							text-align: center;
							font-size: 32rpx;
							font-weight: 500;
							color: #FF5500;
							width: 100%;
							height: 68rpx;
							line-height: 68rpx;
							border-radius: 36rpx;
							border: 2rpx solid #FF5500;
						}
					}
				}
			}
		}
	}
	.footer_bottom{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #FFEEE6;
		border: 1rpx solid #FF5500;
		color: #FF5500;
		padding: 8rpx 0;
		text-align: center;
		@include iphoneAdaptive(m, 0rpx)
	}
</style>