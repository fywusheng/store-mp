<!-- author by liushuag -->
<!-- date：2.14 -->
<template>
	<view class="main_content">
		<!-- 代客下单-客户订单管理 -->
		<view class="top">
			<view class="search flex_r_h">
				<view class="select">
					<!-- <picker @change="bindPickerChange($event,userList)" :value="index" :range="userList" :range-key="'psName'" >
						<view class="uni-input">{{userList[index].psName?userList[index].psName:userList[index].phone}}</view>
					</picker> -->
					<view class="item"><input type="text" placeholder="输入客户手机号" v-model="phone"/></view>
					<!-- <image mode="widthFix"  src="http://192.168.1.187:10088/static/store-mp/select_icon.png" class="icon"></image> -->
				</view>
				<view class="btn" @click="handleSearch">查询</view>
			</view>
			<tabs v-model="currentIndex" height="80rpx" lineColor="#FF711A" :fixed="false" fontSize="32rpx"
				color="#333" activeColor="#FF5500" :tabs="tabList" :scroll="true" field='name' @change="clickItem">
			</tabs>
		</view>
		<!-- 订单列表 -->
		<view class="order_content">
			<view class="list" v-if="orderList.length>0">
				<view class="item" v-for="(item,index) in orderList" :key="index">
					<view class="order_top flex_r_h">
						<view class="shp_name flex_r_h">
							<image mode="widthFix" src="http://192.168.1.187:10088/static/store-mp/gou_icon.png"
								class="icon"></image>
							<view>{{item.storeName}}</view>
						</view>
						<view class="status" v-if="item.orderStatus== 40">{{item.orderStatusLabel}}</view>
						<view class="status qx" v-else>{{item.orderStatusLabel}} </view>

					</view>
					<view class="or_content flex_r_h" v-for="(goods,ind) in item.itemList" :key="ind">
						<image mode="widthFix" :src="goods.imgUrl" class="goods_img"></image>
						<view class="center">
							<view class="goods_name">{{goods.productName}}</view>
							<view class="goods_atr">{{goods.skuName}}</view>
						</view>
						<view class="right flex_c_h">
							<view class="goods_price">￥{{goods.sellingPrice}}</view>
							<view class="goods_sl">x{{goods.skuQuantity}}</view>
						</view>
					</view>
					<view class="bottom flex_r_h">
						<view class="left">
							<text class="count">共计{{item.totalQuantity}}个合计：</text>
							<text class="price">￥{{item.paidAmount}}</text>
						</view>
						<view class="details_btn" v-if="item.orderStatus === 10" @click.stop="toPay(item)">去支付</view>
						<view class="details_btn" v-if="item.orderStatus === 30" @click.stop="confirm(item)">确认收货</view>
						<view class="details_btn"  v-if="
						  order.orderStatus > 20 &&
						  order.orderStatus < 90 &&
						  order.orderStatus !== 60"
						  @click.stop="logistics(item)"
						 >查看物流</view>
						<view class="details_btn" v-if="item.orderStatus !== 30 && item.orderStatus !== 10" @click.stop="handleGoDetails(item.orderId)" >查看详情</view>
					</view>
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
	import tabs from '@/components/tab/v-tabs-center.vue';
	export default {
		components: {
			tabs
		},
		data() {
			return {
				userList: [],
				UserPhone: '',
				status: 'more',
				loadText: {
					contentdown: '轻轻上拉',
					contentrefresh: '努力加载中',
					contentnomore: '我是有底线的'
				},
				currentIndex: 0,
				// 状态（0:未知 10：待付款 20：代发货 30：待收货 40：已完成 50：已评价 90：订单取消、手动取消、系统自动取消 100：交易取消 ）
				tabList: [{
						value: '',
						name: '全部'
					},
					{
						value: 10,
						name: '待付款'
					},
					{
						value: 20,
						name: '待发货'
					},
					{
						value: 30,
						name: '待收货'
					},
					{
						value: 40,
						name: '已完成'
					},
					{
						value: 50,
						name: '已评价'
					},
					{
						value: 90,
						name: '已取消'
					},
					{
						value: 100,
						name: '退款/售后'
					}
				], //tab
				orderList: [], //用户订单
				queryParam: {
					pageNum: 1,
					pageSize: 10,
					status:''
				},
				phone:''
			}
		},
		watch: {},
		mounted() {
			this.queryOrderList()
			this.getStoreUserData()
		},
		onLoad() {},
		onShow() {},
		methods: {
			bindPickerChange(e,list){
				this.phone = list[e.detail.value].phone
			},
			/**
			 * 
			 */
			clickItem(v, index) {
				this.currentIndex = index
				this.tabName = v.name
				this.queryParam.pageNum = 1
				this.queryParam.status = v.value
				this.queryOrderList()
			},
			/**
			 * 获取订单列表
			 */
			queryOrderList() {
				this.status = 'loading';
				let params = {
					storeNo:uni.getStorageSync('storeNo'),
					// storeNo: '1', //有数据门店编号
					pageNum: this.queryParam.pageNum,
					pageSize: this.queryParam.pageSize,
					status:this.queryParam.status,
					// userLoginName:uni.getStorageSync('userLoginPhone'),
					userLoginName:this.phone,
				};
				
				try {
					api.getStoreOrderList({
						data: {
							...params
						},
						success: (data) => {
							console.log("整理前数据", data)
							if (data) {
								const res = [];
								data.list.forEach(data => {
									const itemList = []
									if (data.storeOrderItems) {
										data.storeOrderItems.forEach(orderItemModel => {
											orderItemModel.items.forEach(item => {
												item.imgUrl = XIU.getImgFormat(item
													.imgUrl, '/resize,w_400')
												itemList.push(_.pick(item, ['imgUrl',
													'productId',
													'productName',
													'skuName',
													'sellingPrice',
													'skuQuantity',
													'paidAmount'
												]))
											})
										})
										const tempData = _.pick(data, ['orderId', 'orderStatus',
											'totalQuantity', 'orderType', 'orderAmount',
											'orderStatusLabel', 'paidAmount', 'storeName',
											'storeId', 'hzhH5'
										])
										tempData.itemList = itemList
										tempData.orderMallIcon = data.storeOrderItems[0].orderMallIcon
										res.push(tempData)
									}
								})
								const orderList = res || [];
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
								this.orderList = [];
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
			async toPay(order) {
			  wx.showLoading({ title: '正在获取...', mask: true });
			  const result = await Axios.post('/payment/sign', {
			    orderId: order.orderId,
			    paymentMethodCode: 'nepsp_pay',
			    code: new Date().getTime(),
			  });
			  wx.hideLoading();
			  if (result.code == 200) {
			    // 去收银台支付
			    uni.redirectTo({
			      url: '/pages/common/webpage?url=' + encodeURIComponent(result.data.payUrl),
			    });
			  } else {
			    wx.showToast({
			      title: result.msg || '获取失败',
			      icon: 'none',
			    });
			  }
			},
			async confirm(order) {
			  const result = await wx.showModal({
			    title: '',
			    content: '确定已收货?',
			  });
			  if (result.confirm) {
			    wx.showLoading('正在提交...');
			    const delResult = await Axios.post('/order/confirm', {
			      orderId: order.orderId,
			    });
			    wx.hideLoading();
			    if (delResult.code == 200) {
			      setTimeout(() => {
			        wx.showToast({
			          title: delResult.msg || '确认成功',
			          icon: 'none',
			        });
			      }, 1500);
			      // 触发订单刷新事件
			      	this.queryOrderList()
			    } else {
			      wx.showToast(delResult.msg || '确认失败');
			    }
			  }
			},
			logistics(order) {
			  wx.navigateTo({
			    url: '/sub-pages/me/logistics/main?id=' + order.orderId,
			  });
			},
			/**
			 * getUserData获取门店用户
			 * @param {Object} id
			 */
			getStoreUserData() {
				const params = {
					storeNo: uni.getStorageSync('storeNo'),
					pageSize: 1000000,
					pageNum: 1,
					memberType:0,
				}
				api.getUserData({
					data: params,
					success: (data) => {
						this.userList = data.list
						console.log("用户",this.userList)
					}
				})
			},

			/**
			 * 去订单详情 handleGoDetails
			 */
			handleGoDetails(id) {
				uni.navigateTo({
					url: '/pages/order/details?orderId=' + id
				})
			},
			// 查询
			handleSearch(){
				this.queryParam.pageNum = 1
				this.queryOrderList()
			}
		},
		// 上拉加载
		onReachBottom() {
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
	.flex_r_h {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		top: 0;
	}

	.flex_c_h {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.main_content {
		.top {
			background: #fff;
			position: sticky;

			.search {
				padding: 24rpx 32rpx;
				justify-content: space-between;

				.select {
					width: 526rpx;
					height: 56rpx;
					line-height: 56rpx;
					background: #F5F7FA;
					border-radius: 28rpx;
					position: relative;
					.item{
						input{
							width: 526rpx;
							height: 56rpx;
							padding: 0 30rpx;
						}
					}
					.uni-input{
						height: 56rpx;
						line-height: 56rpx;
						font-size: 28rpx;
						padding: 0 20rpx;
					}
					.icon {
						width: 20rpx;
						position: absolute;
						top: 19rpx;
						right: 30rpx;
					}
				}

				.btn {
					width: 136rpx;
					height: 56rpx;
					line-height: 56rpx;
					background: linear-gradient(95deg, #FA7532 0%, #FF5500 100%);
					border-radius: 28rpx;
					color: #fff;
					text-align: center;
					font-size: 28rpx;
				}
			}

			.tab {
				// padding: 0 34rpx;
				// height:80rpx;
				// view{
				// 	width: 128rpx;
				// 	height: 44rpx;
				// 	font-size: 32rpx;
				// 	color: #333333;
				// 	text-align: center;
				// // }
				// .active{
				// 	color: #FF5500;
				// 	font-weight: 500;
				// }
				// .active::after{
				// 	width: 50rpx;
				// 	height: 5rpx;
				// 	background: #FF5500;
				// 	content: '';
				// 	display: block;
				// 	margin: auto;
				// 	margin-top: 12rpx;
				// }
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
								margin-left: 16rpx;
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
						padding: 40rpx 0;
						align-items: flex-start;
						justify-content: space-between;
						border-top: 1rpx solid #F5F7FA;
						border-bottom: 1rpx solid #F5F7FA;

						.goods_img {
							width: 136rpx;
							border-radius: 8rpx;
							height: 136rpx;
						}

						.center {
							flex: 1;
							margin: 0 24rpx;

							.goods_name {
								font-size: 32rpx;
								font-weight: 500;
								text-overflow: -o-ellipsis-lastline;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1; //行数
								line-clamp: 1; //行数
								-webkit-box-orient: vertical;
							}

							.goods_atr {
								font-size: 28rpx;
								color: #909399;
								margin-top: 40rpx;
							}
						}

						.right {
							justify-content: flex-end;

							.goods_price {
								font-size: 32rpx;
								font-weight: 500;
								color: #303133;
							}

							.goods_sl {
								font-size: 28rpx;
								font-weight: 500;
								color: #999999;
								margin-top: 8rpx;
							}
						}
					}

					.bottom {
						padding: 24rpx 0 0 0;
						justify-content: space-between;

						.left {
							.count {
								font-size: 24rpx;
								color: #999999;
							}

							.price {
								font-size: 32rpx;
								font-weight: 500;
								color: #303133;
							}
						}

						.details_btn {
							text-align: center;
							font-size: 28rpx;
							font-weight: 500;
							color: #FF5500;
							width: 192rpx;
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