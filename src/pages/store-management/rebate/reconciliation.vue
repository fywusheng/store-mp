<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
	<view class="main_content">
		<!-- 门店管理-财务对账 -->
		<view class="top">
			<view class="form flex_r_h">
				<view><input type="text" placeholder="选择业务类型" v-model="queryParam.sceneType"/></view>
				<view><input type="text" placeholder="输入订单编号" v-model="queryParam.orderId" /></view>
			</view>
			<view class="search flex_r_h">
				<view class="date flex_r_h">
					对账时间：
					<view class="select_lang" @click="selectDate">
						<image mode="widthFix" src="/static/img/date-icon-h.png" class="icon"></image>
						<input placeholder="开始时间-结束时间" v-model="dateSelect" class="input_select" :disabled="true" />
						<image mode="widthFix" src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/select_icon.png"
							class="icon_s"></image>
					</view>
				</view>
				<view class="btn" @click.stop="handSearch">查询</view>
			</view>
		</view>
		<view class="order_content">
			<view class="list">
				<view class="item" v-for="(item,index) in orderList":key="index">
					<view class="order_top flex_r_h">
						<view class="shp_name flex_r_h">
							<view>订单编号：{{item.orderId}}</view>
						</view>
						<view class="status wc">{{item.sceneType}}</view>
					</view>
					<view class="or_content flex_r_h">
						<view  class="flex_r_h">订单金额：<text>{{item.orderAmount}}</text></view>
						<view  class="flex_r_h">实付金额：<text>{{item.paidAmount}}</text></view>
						<view  class="flex_r_h">累计退款金额：<text>{{item.returnsPrice?item.returnsPrice:'-'}}</text></view>
						<view  class="flex_r_h">差异金额：<text>{{item.paidAmount && item.returnsPrice ? (item.paidAmount - item.returnsPrice) : '-'}}</text></view>
						<view  class="flex_r_h">下单时间：<text>{{item.createdTime}}</text></view>
						<view  class="flex_r_h">核对时间：<text>{{item.orderAmount}}</text></view>
					</view>
					<view class="bottom flex_r_h">
						<view class="left flex_r_h">
							<image mode="widthFix" src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/yb-icon.png">
							</image>
							<view class="price">返佣金额：<text>￥{{item.rebateAmount}}</text></view>
						</view>
						<view class="details_btn" @click.stop="handleGoDetails(item.orderId)">查看返佣明细</view>
					</view>
				</view>

			</view>
			<view class="loading">
				<uni-load-more :status="status" :content-text="loadText"></uni-load-more>
			</view>
		</view>
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
				// 状态（0:未知 10：待付款 20：代发货 30：待收货 40：已完成 50：已评价 90：订单取消、手动取消、系统自动取消 100：交易取消 ）
				tabList: [{
						value: '',
						text: '全部'
					},
					{
						value: 10,
						text: '待付款'
					},
					{
						value: 20,
						text: '待发货'
					},
					{
						value: 30,
						text: '待收货'
					},
					{
						value: 40,
						text: '已完成'
					},
					{
						value: 90,
						text: '已取消'
					}
					// {
					// 	value: 6,
					// 	text: '退款/售后'
					// }
				], //tab
				status: 'more',
				loadText: {
					contentdown: '轻轻上拉',
					contentrefresh: '努力加载中',
					contentnomore: '我是有底线的'
				},
				// 数据列表
				orderList: [],
				show: false,
				mode: 'date',
				queryParam: {
					pageNum: 1,
					pageSize: 10,
				},
				dateSelect: ''
			};
		},
		created() {

		},
		mounted() {
			this.queryOrderList();
		},
		onLoad(e) {},
		methods: {
			/**
			 * 打开时间
			 */
			selectDate() {
				this.$refs.calendar.open()
			},
			confirmDate(obj) {
				if (obj.range.data.length == 0) {
					this.$uni.showToast('请选择时间区间范围');
					return;
				}
				this.queryParam.startTime = obj.range.data[0]
				this.queryParam.endTime = obj.range.data[obj.range.data.length - 1]
				this.dateSelect = obj.range.data[0] + '~' + obj.range.data[obj.range.data.length - 1]
				console.log(obj, this.queryParam)
			},
			/**
			 * 获取订单列表
			 */
			queryOrderList() {
				let params = {
					storeNo:uni.getStorageSync('storeNo'),
					// storeNo: '1',
					...this.queryParam
				};
				this.status = 'loading';
				try {
					api.getUserOrderList({
						data: {
							...params
						},
						success: (data) => {
							if (data) {
								console.log("数据", data)
								const orderList = data.list || [];
								if (this.queryParam.pageNum == 1) this.orderList = [];
								if (orderList.length) {
									this.orderList = this.orderList.concat(orderList);
									this.status = data.totalPages > data.pageNum ? "more" : "noMore";
								} else {
									this.status = "noMore";
								}
								if (this.orderList.length == 0) {
									this.status = "noMore";
								}
							} else {
								this.orderList = []
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
					console.log(error);
				}
			},
			/**
			 * 去返佣明细 
			 */
			handleGoDetails(id) {
				uni.navigateTo({
					url: '/pages/store-management/rebate/index?id=' + id
				})
			},
			// 查询
			handSearch() {
				this.queryParam.pageNum = 1;
				this.queryOrderList()
			}
		},
		// 上拉加载
		onReachBottom() {
			console.log('上拉', this.status, this.queryParam.pageNum)
			if (this.status === 'noMore') return;
			this.queryParam.pageNum++;
			this.queryOrderList()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.queryParam.pageNum = 1;
			this.queryOrderList()
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
<style lang="scss" scoped>
	.main_content {
		.top {
			padding: 24rpx 32rpx;
			background: #fff;

			.form {
				justify-content: space-between;

				view {
					background: #F5F7FA;
					border-radius: 40rpx;
					width: 332rpx;
					line-height:56rpx;
					height:56rpx;
					input {
						font-size: 24rpx;
						padding: 0 24rpx;
						line-height:56rpx;
						height:56rpx;
					}
				}
			}

			.search {
				margin-top: 44rpx;
				justify-content: space-between;
				line-height:56rpx;
				height:56rpx;
				.date {
					font-size: 24rpx;
					color: #333333;
					.select_lang {
						width: 410rpx;
						background: #F5F7FA;
						border-radius: 28rpx;
						position: relative;
						padding: 0 24rpx;
						z-index: 0;
						line-height:56rpx;
				        height:56rpx;
						.icon {
							width: 35rpx;
							position: absolute;
							top: 11rpx;
							left: 18rpx;
						}

						.input_select {
							width: 100%;
							font-size: 24rpx;
							padding: 0 24rpx;
							margin-left: 12rpx;
							line-height:56rpx;
							height:56rpx;
						}

						.icon_s {
							width: 20rpx;
							position: absolute;
							top: 19rpx;
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
							width: 128rpx;
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
						padding: 40rpx 0;
						align-items: flex-start;
						justify-content: space-between;
						border-top: 1rpx solid #F5F7FA;
						border-bottom: 1rpx solid #F5F7FA;
						flex-wrap: wrap;

						view {
							width: 50%;
							font-size: 24rpx;
							color: #999999;
							margin: 16rpx 0;
							align-items: flex-start;
						
							text {
								color: #333333;
								display: block;
								flex: 1;
							}
						}
					}

					.bottom {
						padding: 24rpx 0 0 0;
						justify-content: space-between;

						.left {
							image {
								width: 32rpx;
								margin-right: 16rpx;
							}

							.price {
								font-size: 32rpx;
								font-weight: 500;
								color: #333333;

								text {
									color: #FF5500;
								}
							}
						}

						.details_btn {
							text-align: center;
							font-size: 32rpx;
							font-weight: 500;
							color: #FF5500;
							width: 248rpx;
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
</style>