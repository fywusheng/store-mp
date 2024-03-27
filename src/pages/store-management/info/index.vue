
<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
	<view class="main_content">
		<!-- 门店管理-基本信息-->
		<view class="top flex_r_h">
			<view class="left item">
				<view class="title">门店状态</view>
				<view class="desc">{{storeInfo.storeSatus==1?'合作中':'已到期'}}</view>
			</view>
			<view class="right item">
				<view class="title">合同有效期至</view>
				<view class="desc">{{storeInfo.periodEndValidity}}</view>
			</view>
		</view>
		<view class="content">
			<view class="title_text">企业基本信息</view>
			<view class="info_content">
				<view class="row flex_r_h">
					<view class="label">门店名称</view>
					<view class="desc red">{{storeInfo.storeName}}</view>
				</view>
				<view class="row flex_r_h">
					<view class="label">合作年限</view>
					<view class="desc">{{hzYears}}年</view>
				</view>
				<view class="row flex_r_h">
					<view class="label">售卖区域</view>
					<view class="desc">{{storeInfo.salesArea}}</view>
				</view>
				<view class="row flex_r_h">
					<view class="label">经营范围</view>
					<view class="desc">{{storeInfo.businessScope}}</view>
				</view>
				<view class="row flex_r_h">
					<view class="label">经营品牌</view>
					<view class="desc">{{storeInfo.operatingBrand}}</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="title_text">企业佣金信息</view>
			<view class="info_content">
				<view class="row flex_r_h">
					<view class="label">佣金计算方式</view>
					<view class="desc">{{storeInfo.commissionCalculation}}</view>
				</view>
				<view class="row flex_r_h">
					<view class="label">佣金结算方式</view>
					<view class="desc">{{storeInfo.commissionSettlement}}</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="title_text">企业对公账户信息</view>
			<view class="info_content">
				<view class="row flex_r_h">
					<view class="label">对公账户名</view>
					<view class="desc">{{storeInfo.corporateAccount}}</view>
				</view>
				<view class="row flex_r_h">
					<view class="label">对公银行卡号</view>
					<view class="desc">{{storeInfo.corporateBank}}</view>
				</view>
				<view class="row flex_r_h">
					<view class="label">开户银行及支行</view>
					<view class="desc">{{storeInfo.corporateBankBranch}}</view>
				</view>
			</view>
		</view>
		<view class="btn" @click="renewalFunction" v-if="storeInfo.reviewStatus==2">申请合作续签</view>
	</view>
</template>

<script>
	import api from '@/apis/index.js';
	const dayjs = require('dayjs');
	// import duration from 'dayjs/plugin/duration';
	export default {
		data() {
			return {
				storeInfo: null, //门店信息
				hzYears: 0
			};
		},
		created() {

		},
		mounted() {
			this.getStoreInfo()
			
		},
		onLoad(option) {},
		methods: {
			getStoreInfo() {
				api.getStoreInfo({
					data: {
						id: uni.getStorageSync('storeId')
					},
					success: (res) => {
						const dayjs = require('dayjs');
						let today = dayjs();
						if (res) {
							const endTime = dayjs(res.periodEndValidity);
							if (today.isBefore(endTime)) {
								res.storeSatus = 1; //1合作中
								uni.setStorageSync('storeSatus', 1)
							} else {
								res.storeSatus = 2; //2已过期
								uni.setStorageSync('storeSatus', 2)
							}
						}
						this.storeInfo = res
						// 假设有两个日期字符串
						const date1 = res.periodStartValidity;
						const date2 = res.periodEndValidity;
						// 使用dayjs处理日期
						const d1 = dayjs(date1);
						const d2 = dayjs(date2);
						// 计算两个日期之间的年数
						const years = d2.diff(d1, 'year');
						this.hzYears = years
						console.log("nianxian ", years)
					}
				})
			},
			// 门店续签
			renewalFunction() {
				api.saveStores({
					data: {
						id: uni.getStorageSync('storeId'),
						renewalStatus: 0,
					},
					success: (res) => {
						this.$refs.alertDialog.open()
					}
				})
			}
		},
		onShow() {

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
		height: 480rpx;
		background: linear-gradient(180deg, #FE5A08 0%, rgba(254, 89, 6, 0) 100%);
		padding: 24rpx 32rpx;

		.top {
			height: 160rpx;
			background: linear-gradient(180deg, #FFE6D9 0%, #FFFFFF 100%);
			border-radius: 16rpx;
			border: 2rpx solid #FFFFFF;

			.item {
				width: 344rpx;
				text-align: center;
				padding: 34rpx 0;

				.title {
					font-size: 24rpx;
					color: #999999;
				}

				.desc {
					font-size: 32rpx;
					font-weight: 500;
					color: #00B47C;
					margin-top: 16rpx;
				}
			}

			.left {
				.desc {
					color: #00B47C;
				}
			}

			.right {
				.desc {
					color: #333;
				}
			}
		}

		.title_text {
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
			border-bottom: 1rpx solid #F5F7FA;
			padding-bottom: 24rpx;
		}

		.title_text::before {
			width: 6rpx;
			height: 24rpx;
			background: #FF5500;
			content: '';
			display: inline-block;
			margin-right: 12rpx;
		}

		.content {
			background: #FFFFFF;
			border-radius: 16rpx;
			padding: 24rpx;
			margin-top: 24rpx;

			.info_content {
				.row {
					justify-content: space-between;
					margin-top: 24rpx;

					.label {
						font-size: 28rpx;
						color: #999999;
					}

					.desc {
						font-size: 28rpx;
						color: #333333;
					}

					.red {
						color: #FF5500;
					}
				}
			}
		}

		.btn {
			height: 80rpx;
			line-height: 80rpx;
			background: linear-gradient(95deg, #FA7532 0%, #FF5500 100%);
			border-radius: 44rpx;
			text-align: center;
			font-size: 32rpx;
			color: #FFFFFF;
			margin-top: 36rpx;
		}
	}
</style>