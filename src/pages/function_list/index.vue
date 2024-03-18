<!-- author by liushuag -->
<!-- date:2.15 -->
<!-- update:3.8 -->
<template>
	<view class="main_content">
		<!-- 门店管理-功能列表 -->
		<view class="top">
			<view class="zt_icon">{{storeInfo.storeSatus==1?'合作中':'已到期'}}</view>
			<!-- <image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/zt-bg.png" mode="widthFix" class="zt_icon"></image> -->
			<view class="main">
				<view class="title">{{storeInfo.storeName}}</view>
				<view class="date">{{storeInfo.periodEndValidity}}合作到期</view>
				<view class="flex_r_h db_content">
					<view class="name flex_r_h">
						<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/yg-icon.png" mode="widthFix" class="icon"></image>
						<view>登录员工：<text>{{userInfo.name}}</text></view>
					</view>
					<view class="name flex_r_h dz_name">
						<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/dz-icon.png" mode="widthFix" class="icon"></image>
						<view>店长：<text>{{storeInfo.corporateAccount}}</text></view>
						<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/dh-icon.png" mode="widthFix" class="dh_icon"></image>
					</view>
				</view>
			</view>
			
		</view>
		<view class="bottom flex_r_h">
			<!-- <navigator url="/pages/order/index"  class="item">
				<view class="title">订单管理</view>
				<view class="go flex_r_h">立即前往<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/ddgl.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/store-management/user/index" class="item item3">
				<view class="title">用户管理</view>
				<view class="go flex_r_h">立即前往<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/yhgl.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/store-management/rebate/reconciliation" class="item item4">
				<view class="title">财务对账</view>
				<view class="go flex_r_h">立即前往<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/cwdz.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/activity/index" class="item item5">
				<view class="title">活动通知</view>
				<view class="go flex_r_h">立即前往<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/hdtz.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/report/index" class="item">
				<view class="title">综合报表</view>
				<view class="go flex_r_h">立即前往<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/zhbb.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/store-management/account_role/index" class="item item7">
				<view class="title">店员管理</view>
				<view class="go flex_r_h">立即前往<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/dygl.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/store-management/info/index" class="item item8">
				<view class="title">基本信息</view>
				<view class="go flex_r_h">立即前往<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/jbxx.png" mode="widthFix" class="img"></image>
			</navigator>
			<navigator url="/pages/user-center/message-center" class="item item9">
				<view class="title">系统提醒</view>
				<view class="go flex_r_h">立即前往<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/xttx.png" mode="widthFix" class="img"></image>
			</navigator> -->
			<!-- 活的 -->
			<navigator :url="item.path" 
			 :class="'item' +' ' +'item_'+item.id"
			 v-for="(item,index) in functionList" :key="index">
				<view class="title">{{item.pemissonName}}</view>
				<view class="go flex_r_h">立即前往<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/qw-icon.png" mode="widthFix" class="icon"></image></view>
				<image :src="item.iconUrl" mode="widthFix" class="img"></image>
			</navigator>
		</view>
	</view>
</template>
<script>
	import api from '@/apis/index.js';
	export default {
		components: {
		},
		data() {
			return{
				userInfo:Store.getters.UserInfo, //登录用户信息
				storeInfo:Store.getters.StoreInfo, //门店信息
				functionList:[]
			}
		},
		watch: {
		},
		mounted() {
		},
		onLoad(options) {
			console.log("opto",options)
			this.getFunctionList(options?.id)
		},
		onShow() {
		},
		methods: {
			getFunctionList(id){
				api.getFunctionList({
				    data: {
				       id:id
				    },
				    success:(res)=>{
						console.log("功能",res)
						const filteredArr= res.permissonList.filter(item => item.id != 1);
						this.functionList = filteredArr
				    }
				})
			}

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
		width: 750rpx;
		height: 1190rpx;
		background: linear-gradient(180deg, #FE5A08 0%, rgba(254,89,6,0) 100%);
		.top{
			padding: 24rpx 32rpx;
			position: relative;
			.zt_icon{
				position: absolute;
				right: 32rpx;
				top: 24rpx;
				width: 120rpx;
				border-radius: 0 16rpx 0 16rpx ;
				height: 50rpx;
				line-height: 50rpx;
				background: #00B47C;
				color: #FFFFFF;
				text-align: center;
			}
			.main{
				background: linear-gradient(180deg, #FFE6D9 0%, #FFFFFF 100%);
				border-radius: 16rpx;
				border: 2rpx solid #FFFFFF;
				padding: 28rpx 40rpx;
			}
			.icon{
				width: 28rpx;
				margin-right: 10rpx;
			}
			.dh_icon{
				width: 32rpx;
				margin-left: 10rpx;
			}
			.db_content{
				margin-top: 48rpx;
				.name{
					view{
						font-size: 28rpx;
						color: #999999;
						text{
							color: #333;
						}
					}
				}
				.dz_name{
					margin-left: 80rpx;
				}
			}
			.title{
				font-size: 40rpx;
				font-weight: 500;
				color: #333;
			}
			.date{
				font-size: 24rpx;
				color: #999999;
				margin-top: 8rpx;
			}
		}
		.bottom{
			padding: 24rpx 32rpx;
			 flex-wrap: wrap;
			 justify-content: space-between;
			.item{
				box-sizing: border-box;
				position: relative;
				width: 332rpx;
				height: 200rpx;
				padding:32rpx;
				background: linear-gradient(180deg, #DEEBFE 0%, #FFFFFF 100%);
				border-radius: 16rpx;
				border: 2rpx solid #FFFFFF;
				margin-bottom: 24rpx;
				.img{
					width: 156rpx;
					position: absolute;
					bottom: 0;
					right: 0;
				}
			}
			.item_3{
				background:linear-gradient(180deg, #E6EAFF 0%, #FFFFFF 100%)!important;
			}
			.item_8{
				background:linear-gradient(180deg, #E6EAFF 0%, #FFFFFF 100%)!important;
			}
			.item_4{
				background:linear-gradient(180deg, #FFEFE0 0%, #FFFFFF 100%)!important;
			}
			.item_9{
				background:linear-gradient(180deg, #FFEFE0 0%, #FFFFFF 100%)!important;
			}
			.item_5{
				background:linear-gradient(180deg, #DBF9ED 0%, #FFFFFF 100%)!important;
			}
			.item_7{
				background: linear-gradient(180deg, #FFEFF2 0%, #FFFFFF 100%);
			}
			.title{
				font-size: 32rpx;
				font-weight: 500;
				color: #521B00;
			}
			.go{
				font-size: 20rpx;
				color: #999999;
				margin-top: 16rpx;
				.icon{
					width: 16rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
