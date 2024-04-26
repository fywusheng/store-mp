<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
	<view class="main_content">
		<!-- 门店管理-用户详情 -->
		<view class="info_content">
			<view class="top_title">基本信息</view>
			<view class="table_content">
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">用户姓名</view>
						<view class="right">{{info.psnName}}</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">注册手机</view>
						<view class="right">{{info.phone}}</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">证件号码</view>
						<view class="right line-height40 text_sl">{{info.idCard}}</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">性别</view>
						<view class="right">{{info.sex==0?'男':'女'}}</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">年龄</view>
						<view class="right">{{info.age}}</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">出生年月</view>
						<view class="right">{{info.brdy}}</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="col col-100 flex_r_h">
						<view class="left">默认地址</view>
						<view class="right">{{info.districtArea}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="top">
			<view class="search flex_r_h">
				<view class="top_title">下单记录</view>
				<view class="date flex_r_h">
					<view class="select_lang" @click="selectDate">
						<image mode="widthFix" src="/static/img/date-icon-h.png" class="icon"></image>
						<input placeholder="开始时间-结束时间" v-model="dateSelect" class="input_select" :disabled="true" />
						<image mode="widthFix" src="http://192.168.1.187:10088/static/store-mp/select_icon.png"
							class="icon_s"></image>
					</view>
				</view>
				<view class="btn" @click="handSearch">查询</view>
			</view>
		</view>
		<view class="order_content">
			<view class="list">
				<view class="item" v-for="(item,index) in orderList" :key="index">
					<view class="order_top flex_r_h">
						<view class="shp_name flex_r_h">
							<view>订单编号：{{item.orderId}}</view>
						</view>
						<view :class="(item.orderStatus==90 ||item.orderStatus==100)?'status qx':'status wc' ">
							{{item.orderStatusLabel}}
						</view>
					</view>
					<view class="or_content flex_r_h">
						<view class="flex_r_h">订单金额：<text>￥{{item.orderAmount}}</text></view>
						<view class="flex_r_h">实付金额：<text>￥{{item.paidAmount}}</text></view>
						<view class="flex_r_h">下单账号：<text>{{item.userLoginName}}</text></view>
						<view class="flex_r_h">下单时间：<text>{{item.createdTime}}</text></view>
					
					</view>
					<view class="bottom flex_r_h">
						<view class="details_btn" @click.stop="handleGoDetails(item.orderId)">查看详情</view>
					</view>
				</view>
				<view class="loading">
					<uni-load-more :status="status" :content-text="loadText"></uni-load-more>
				</view>
			</view>
		</view>
		<view class="footer">合计共{{total}}条</view>
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
				info:null,//信息
				queryParam: {
					pageNum: 1,
					pageSize: 10
				},
				orderList:[],
				total:0,
				dateSelect:'',
				status: 'more',
				loadText: {
					contentdown: '轻轻上拉',
					contentrefresh: '努力加载中',
					contentnomore: '我是有底线的'
				},
			}
		},
		onLoad(options) {
			this.queryDetails(options?.memberId)
		},
		methods: {
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
			    this.queryParam.startTime = obj.range.data[0]
			    this.queryParam.endTime = obj.range.data[obj.range.data.length-1]
			    this.dateSelect =  obj.range.data[0]+'~' + obj.range.data[obj.range.data.length-1]
			    console.log(obj,this.queryParam)
			   },
			/**
			 * 获取详情
			 */
			queryDetails(id) {
				let params = {
					memberId: id
				};
				api.getUserDataDetails({
					data: params,
					success: (data) => {
						console.log("member详情", data)
						this.info = data;
						this.$nextTick(()=>{
							this.queryOrderList()
						})
					}
				})
			},
			/**
			 * 获取订单列表
			 */
			queryOrderList() {
				let params = {
					storeNo:uni.getStorageSync('storeNo'),
					// storeNo: '1',
					userLoginName:this.info.phone,
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
								this.total = data.totalCount;
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
			 * 去订单详情 handleGoDetails
			 */
			handleGoDetails(id) {
				uni.navigateTo({
					url: '/pages/order/details?orderId=' + id
				})
			},
			// 查询
			handSearch(){
				this.queryParam.pageNum = 1;
				this.queryOrderList()
			}
		},
		// 上拉加载
		onReachBottom() {
			if (this.status === 'noMore') return;
			this.queryParam.pageNum++;
			this.queryOrderList()
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
		.top_title{
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
		}
		.top_title::before{
			width: 6rpx;
			height: 24rpx;
			background: #FF5500;
			content: '';
			display: inline-block;
			margin-right: 12rpx;
		}
		.info_content{
			padding: 24rpx 32rpx;
			background: #FFFFFF;
		}
		.table_content{
			border:1rpx solid #EBEBEB;
			border-bottom: 0;
			margin-top:32rpx;
			border-radius: 16rpx;
			.row{
				
				.col{
					width: 50%;
					border-bottom:1rpx solid #EBEBEB;
					.left{
						width: 128rpx;
						background: #F5F6F6;
						height: 96rpx;
						line-height: 96rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: rgba(0,0,0,0.88);
						padding: 0 8rpx;
					}
					.right {
						padding: 0 8rpx;
						flex: 1;
						height: 96rpx;
						line-height: 96rpx;
						word-break: break-all;
						font-size: 24rpx;
						.good_img{
							width: 100rpx;
							height: 100rpx;
							margin:auto
						}
					}
					.line-height40 {
						line-height: 45rpx;
					}
					.text_sl{
						overflow: hidden;
						-webkit-line-clamp: 2;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
					}
				}
				.col-100{
					width: 100%;
				}
			}
		}
		.top{
			padding: 24rpx 32rpx;
			background: #fff;
			margin-top: 16rpx;
			.form{
				justify-content: space-between;
				view{
					background: #F5F7FA;
					border-radius: 40rpx;
					width: 212rpx;
					input{
						font-size: 24rpx;
						padding: 12rpx 24rpx;
					}
				}
			}
			.search{
				margin-top: 44rpx;
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
						width: 320rpx;
						background: #F5F7FA;
						border-radius: 28rpx;
						position: relative;
						padding: 0 24rpx;
						z-index: 0;
						height: 56rpx;
						line-height: 56rpx;
						.icon {
							width: 35rpx;
							position: absolute;
							top: 12rpx;
							left: 18rpx;
						}
				
						.input_select {
							width: 100%;
							font-size: 24rpx;
							padding: 0 24rpx;
							margin-left: 12rpx;
							height: 56rpx;
							line-height: 56rpx;
						}
				
						.icon_s {
							width: 20rpx;
							position: absolute;
							top: 18rpx;
							right: 18rpx
						}
					}
				}
				.btn{
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
		.order_content{
			padding: 34rpx;
			background: #FFFFFF;
			.list{
				.item{
					background: #FFFFFF;
					border-radius: 16rpx;
					padding: 24rpx;
					margin-bottom: 24rpx;
					box-shadow: 0rpx 2rpx 12rpx 0rpx rgba(0,0,0,0.15);
					.order_top{
						justify-content: space-between;
						padding: 0 0 24rpx 0;
						.shp_name{
							.icon{
								width: 32rpx;
							}
							view{
								font-size: 28rpx;
								font-weight: 500;
								color: #333333;
							}
						}
						.status{
							width: 104rpx;
							height: 50rpx;
							line-height: 50rpx;
							text-align: center;
							border-radius: 8rpx;
							font-size: 24rpx;
							
						}
						.qx{
							color: #999999;
							background: #F5F7FA;
						}
						.wc{
							color: #FF5500;
							background: #FFEEE6;
						}
					}
					.or_content{
						padding: 40rpx 0;
						align-items: flex-start;
						justify-content: space-between;
						border-top: 1rpx solid #F5F7FA;
						border-bottom: 1rpx solid #F5F7FA;
						flex-wrap: wrap;
						view{
							width: 50%;
							font-size: 24rpx;
							color: #999999;
							margin: 16rpx 0;
							text{
								color: #333333;
							}
						}
					}
					.bottom{
						padding: 24rpx 0 0 0;
						justify-content: space-between;
						.details_btn{
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
		.footer{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 50rpx;
			line-height: 50rpx;
			background: #FFEEE6;
			border: 1rpx solid #FF5500;
			color: #FF5500;
			text-align: center;
			@include iphoneAdaptive(m, -20rpx)
		}
	}
</style>
