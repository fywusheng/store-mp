<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
	<view class="main_content">
		<!-- 门店管理-返佣明细 -->
		<view class="info_content">
			<view class="top_title">基本信息</view>
			<view class="table_content">
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">业务类型</view>
						<view class="right">{{info.sceneType}}</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">订单编号</view>
						<view class="right line-height40">{{info.orderId}}</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">订单金额</view>
						<view class="right">{{info.orderAmount}}</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">应付金额</view>
						<view class="right">{{info.payableAmount}}</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">累计退款</view>
						<view class="right">{{info.sceneType}}</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">差异金额</view>
						<view class="right">{{info.sceneType}}</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">下单时间</view>
						<view class="right line-height40">{{info.createdTime}}</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">核对时间</view>
						<view class="right line-height40">{{info.sceneType}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="info_content">
			<view class="top_title">返佣明细</view>
			<view class="table_content" v-for="(item,index) in orderItem" :key="index">
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">LOGO</view>
						<view class="right flex_r_h">
							<image :src="item.imgUrl" class="good_img"></image>
						</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">商品名称</view>
						<view class="right text_sl">{{item.productName}}</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">SKUID</view>
						<view class="right line-height40">{{item.skuId}}</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">SKU编码</view>
						<view class="right line-height40">{{item.skuNo}}</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">商品ID</view>
						<view class="right line-height40">{{item.productId}}</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">商品编码</view>
						<view class="right line-height40">{{item.productNo}}</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">SKU规格</view>
						<view class="right">{{item.skuName}}</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">单价</view>
						<view class="right">{{item.sellingPrice}}</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="col flex_r_h">
						<view class="left">退款金额</view>
						<view class="right">{{item.returnsPrice || '-'}}</view>
					</view>
					<view class="col flex_r_h">
						<view class="left">返佣金额</view>
						<view class="right">{{item.rebateAmount || '-'}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="footer">
			合计返佣金额：<text>￥{{info.rebateAmount || '0'}}</text>
		</view>
	</view>
</template>
<script>
	import api from '@/apis/index.js';
	export default {
		data() {
			return {
				info:null,//信息
				orderItem:[] //订单明细
			}
		},
		onLoad(options) {
			this.queryOrderDetails(options?.id)
		},
		methods: {
			/**
			 * 获取订单详情
			 */
			queryOrderDetails(id) {
				let params = {
					orderId: id
				};
				api.getUserOrderDetails({
					data: params,
					success: (data) => {
						console.log("order详情", data)
						this.info = data;
						const itemList = [];
						if (data.storeOrderItems) {
							data.storeOrderItems.forEach(orderItemModel => {
								orderItemModel.items.forEach(item => {
									item.imgUrl = XIU.getImgFormat(item.imgUrl,
										'/resize,w_400')
									itemList.push(_.pick(item, ['imgUrl', 'productId',
										'productName', 'skuName', 'sellingPrice',
										'skuQuantity', 'payableAmount','skuId','skuNo',
										'productNo'
									]))
								})
							})
						}
						console.log("数据", itemList)
						this.orderItem = itemList
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
		padding-bottom:100rpx ;
		.deal_status_content{
			padding: 24rpx 32rpx;
			background: #FFFFFF;
			margin-bottom: 16rpx;
		}
		.status_btn{
			width: 212rpx;
			height: 56rpx;
			line-height: 56rpx;
			text-align: center;
			background: #FFFFFF;
			border-radius: 28rpx;
			border: 1rpx solid #FF5500;
			font-size: 24rpx;
			color: #FF5500;
			margin: 32rpx 0;
		}
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
			margin-bottom: 16rpx;
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
						width: 150rpx;
						background: #F5F6F6;
						height: 96rpx;
						line-height: 96rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: rgba(0,0,0,0.88);
						padding: 0 8rpx;
					}
					.width200{
						width: 160rpx;
					}
					.right{
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
						-webkit-line-clamp: 1;
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
		.footer{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 166rpx;
			line-height: 166rpx;
			color: #000;
			text-align: right;
			padding: 0 32rpx;
			background: #FFFFFF;
			text{
				font-size: 60rpx;
				font-weight: 600;
				color: #FF5500;
			}
		}
	}
</style>
