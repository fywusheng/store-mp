<!-- author by liushuag -->
<!-- date：2.14 -->
<template>
	<view class="index_content">
		<!-- 首页 -->
		<image src="http://192.168.1.187:10088/static/store-mp/index_bg.png" mode="widthFix" class="bg_img"/>
		<view class="main">
			<view class="top">
				<view class="info flex_r_h">
					<view class="shp_name">{{storeInfo.storeName}}</view>
					<view class="shp_tag">{{storeInfo.storeSatus==1?'合作中':'已到期'}}</view>
					<view class="shp_date">{{storeInfo.periodEndValidity}}到期</view>
				</view>
				<image src="http://192.168.1.187:10088/static/store-mp/set-icon.png" mode="widthFix" class="set_img" @click="setAccout"/>
			</view>
			<view class="dl_info flex_r_h">
				<view class="info flex_r_h">
					<view class="yg_name">登录员工 ： {{userInfo.name}}</view>
					<view class="h-icon">|</view>
					<view class="">店长：{{storeInfo.corporateAccount}}</view>
				</view>
				<image src="http://192.168.1.187:10088/static/store-mp/call-icon.png" mode="widthFix" class="set_img" @click="makeCall"/>
			</view>
			<view class="xs_count_content">
				<image src="http://192.168.1.187:10088/static/store-mp/tj-bg.png" mode="widthFix" class="xs_bg_img"/>
				<image src="http://192.168.1.187:10088/static/store-mp/date-icon.png" mode="widthFix" class="date_img" @click="handleCalerdarShow"/>
				<view class="content">
					<view class="tab flex_r_h">
						<view :class="tabActive == item.id ? 'active':''" v-for="(item,index) in tabList" :key="index" @click="handleTab(item.id)">{{item.lable}}</view>
					</view>
					<view class="xs_main jye_content flex_r_h">
						<view class="item">
							<view class="text">订单交易总额</view>
							<view class="price">￥{{dataCount.totalOrderAmount || 0}}</view>
						</view>
						<view class="item">
							<view class="text">已退款总金额</view>
							<view class="price">￥{{dataCount.totalRefundAmount || 0}}</view>
						</view>
						<view class="item">
							<view class="text">订单实付总额</view>
							<view class="price">￥{{dataCount.totalPaidAmount || 0}}</view>
						</view>
					</view>
					<view class="xs_main dd_content flex_r_h">
						<view class="item">
							<view class="text">订单总数</view>
							<view class="price">{{dataCount.totalOrders || 0}}</view>
						</view>
						<view class="item">
							<view class="text">退款单数</view>
							<view class="price">{{dataCount.totalRefundOrders || 0}}</view>
						</view>
						<view class="item">         
							<view class="text">注册用户</view>
							<view class="price">{{dataCount.registerNum || 0}}</view>
						</view>
						<view class="item">
							<view class="text">会员客户</view>
							<view class="price">{{dataCount.memberTypeNum || 0}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 活动通知 -->
			<view class='notice acea-row row-middle row-between' v-if="scrollingNews.length">
				<view class="pic">
					<image src="http://192.168.1.187:10088/static/store-mp/hdtz-img.png" />
				</view>
				<text class='line'>|</text>
				<view class='swipers'>
					<swiper :indicator-dots="false" :autoplay="true" interval="2500" duration="500"
			    vertical="true" circular="true">
						<block v-for="(item,index) in scrollingNews" :key='index'>
							<swiper-item @click="handleGoDetails(item.id)">
								<!-- <navigator class='item' :url='item.url' hover-class='none'> -->
									<view class='line1'>{{ item.name }}</view>
								<!-- </navigator> -->
							</swiper-item>
						</block>
					</swiper>
				</view>
				<view class="iconfont icon-xiangyou" />
			</view>
			<!-- 代客下单 -->
			<view class="dkxd_main flex_r_h">
				 <navigator url="/pages/store-management/dkxd/index" class="btn_item left flex_r_h" v-if="functionList.length!=0">
					<image src="http://192.168.1.187:10088/static/store-mp/dkbg.png" mode="widthFix" class="bg"/>
					<view>代客下单</view>
					<image src="http://192.168.1.187:10088/static/store-mp/dkxd_icon.png" mode="widthFix" class="icon_img"/>
				</navigator>
				<navigator :url="'/pages/function_list/index?id='+userId" class="btn_item right flex_r_h">
					<image src="http://192.168.1.187:10088/static/store-mp/mdbg.png" mode="widthFix" class="bg"/>
					<view>门店管理</view>
					<image src="http://192.168.1.187:10088/static/store-mp/md-icon.png" mode="widthFix" class="icon_img"/>
				</navigator>
			</view>
		</view>
		<view class="footer">门店支持电话：400-8888-666</view>
		<!-- 日期选择框 -->
		<!-- 日期选择框 -->
		<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" 
			:insert="false"
			:range="true" @confirm="confirmDate"  
		/>
	</view>
</template>
<script>
	import api from '@/apis/index.js';
	const dayjs = require("dayjs");
	export default {
		data() {
			return {
				tabActive:0,
				//tab
				tabList:[
					{
						id:0,
						lable:'全部'
					},
					{
						id:1,
						lable:'近1天'
					},
					{
						id:2,
						lable:'近7天'
					},
					{
						id:3,
						lable:'近30天'
					},
				],
				// 活动通知
				scrollingNews: [], 
				// 日历
				dateShow:false,
				userInfo:Store.getters.UserInfo, //登录用户信息
				storeInfo:Store.getters.StoreInfo, //门店信息
				dataCount:{},
				search:{
					queryStartTime:'',
					queryEndTime:''
				},
				userId:'',
				functionList:[]
			};
		},
		created() {

		},
		mounted() {
			this.getIndexCountByStore()
			this.getActivityList()
		},
		onLoad(option) {
			this.userId = option?.userId
			this.getFunctionList(this.userId)
		},
		methods: {
			// 获取统计数据
			getIndexCountByStore(){
				api.getIndexCountByStore({
				 data: {
				   queryType:this.tabActive,// 1: 1天 2:7天 3:30天
				   storeNo:Store.getters.StoreInfo.storeNo,
				   queryStartTime:this.search.queryStartTime,
				   queryEndTime:this.search.queryEndTime
				 },
				 success:(res)=>{
					this.dataCount = res
				 }
			   })
			},
			
			// tab切换选择筛选天数
			handleTab(day){
				this.tabActive = day
				this.getIndexCountByStore()
			},
			//弹出日历
			handleCalerdarShow(){
				this.$refs.calendar.open()
			},
			confirmDate(obj){
				if(obj.range.data.length == 0){
					this.$uni.showToast('请选择时间区间范围');
					return;
				}
				this.search.queryStartTime = obj.range.data[0]
				this.search.queryEndTime = obj.range.data[obj.range.data.length-1]
				this.dateSelect =  obj.range.data[0]+'~' + obj.range.data[obj.range.data.length-1]
				console.log(obj,this.search)
				this.getIndexCountByStore()
			},
			// 打电话
			makeCall(){
				uni.makePhoneCall({
					phoneNumber: '114' //仅为示例
				});
			},
			// 账号设置
			setAccout(){
				uni.navigateTo({
					url: '/pages/user-center/setting'
				})
			},
			/**
			 * 获取活动列表
			 */
			getActivityList() {
				let params = {
					queryObject:{
						auditState:1
					},
					pageNum:1,
					pageSize:15,
				};
				this.status = 'loading';
				try {
					api.getActivityList({
						data: {
							...params
						},
						success: (data) => {
							const dayjs = require('dayjs');
							// 获取当前日期
							const currentDate = dayjs();
							if (data) {
								const list = data.list || [];
								list.forEach(item => {
									item.dqStatus = currentDate.isAfter(dayjs(item.endTime))
								})
								const filteredArr = list.filter(activity => !activity.dqStatus);
								this.scrollingNews = filteredArr
							} 
						},
						fail: (err) => {
							this.$uni.showToast(err.message);
							uni.hideLoading()
						}
					})
				} catch (error) {
					this.status = "noMore";
					console.log(error);
				}
			},
			/**
			 * 去详情 handleGoDetails
			 */
			handleGoDetails(id,status) {
				if(status){
					this.$uni.showToast('活动已到期');
				}else{
					uni.navigateTo({
						url: '/pages/activity/details?id=' + id 
					})
				}
				
			},
			// 判断是否有代客下单权限 
			getFunctionList(id){
				api.getFunctionList({
				    data: {
				       id:id
				    },
				    success:(res)=>{
						const filteredArr= res.permissonList.filter(item => item.id == 1);
						this.functionList = filteredArr
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
	.flex_r_h{
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.index_content{
		position: relative;
		.bg_img{
			width: 100%;
			position: absolute;
			z-index: -1;
		}
		.main{
			padding: 32rpx;
		}
		.top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 44rpx;
			.info{
				view{
					color: #fff;
					font-size: 24rpx;
				}
				.shp_name{
					font-size: 32rpx;
					font-weight: 500;
				}
				.shp_tag{
					padding: 2rpx 8rpx;
					border-radius: 6rpx;
					border: 1rpx solid #fff;
					margin: 0 16rpx;
				}
			}
		}
		.dl_info{
			margin-top: 24rpx;
			.info{
				margin-right: 18rpx;
				view{
					color: #fff;
					font-size: 28rpx;
				}
				.h-icon{
					margin: 0 16rpx;
				}
			}
		}
		.set_img{
			width: 40rpx;
		}
		.xs_count_content{
			margin-top: 36rpx;
			position: relative;
			.xs_bg_img{
				width: 100%;
			}
			.date_img{
				width: 72rpx;
				position: absolute;
				top: 78rpx;
				right: 0;
			}
			.tab{
				position: absolute;
				top: 78rpx;
				left: 40rpx;
				view{
					width: 116rpx;
					height: 52rpx;
					line-height: 52rpx;
					border-radius: 52rpx;
					text-align: center;
					color: #fff;
					font-size: 28rpx;
					margin-right: 30rpx;
				}
				.active{
					background: #fff;
					color: #FF5500;
					font-weight: 500;
				}
			}
			.xs_main{
				position: absolute;
				justify-content: space-between;
				.item{
					view{
						color: #fff;
						text-align: center;
					}
					.text{
						font-size: 24rpx;
					}
					.price{
						font-size: 28rpx;
						font-weight: 500;
						margin-top: 12rpx;
					}
				}
			}
			.jye_content{
				top: 180rpx;
				left: 40rpx;
				right: 40rpx;
			}
			.dd_content{
				top: 322rpx;
				left: 54rpx;
				right: 54rpx;
				.item{
					view{
						color: #999;
					}
					.price{
						color: #303133;
					}
				}
			}
		}
		.notice{
			height: 88rpx;
			border-radius: 88rpx;
			background-color: #FFFFFF;
			margin-bottom: 25rpx;
			line-height: 88rpx;
			padding: 0 28rpx;
			margin-top:24rpx;
			.line {
				color: #CCCCCC;
				height:auto;
				background-color: #fff;
			}
			.pic{
				width: 56rpx;
				height: 56rpx;
				image{
					width: 100%;
					height: 100%;
					display: block !important;
				}
			}
			.swipers {
				height: 100%;
				width: 444rpx;
				overflow: hidden;
				swiper {
					height: 100%;
					width: 100%;
					overflow: hidden;
					font-size: 22rpx;
					color: #333333;
				}
			}
			.iconfont {
				color: #999999;
				font-size: 20rpx;
			}
		}
		.line1 {
		    overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
		}
		.dkxd_main{
			justify-content: space-between;
			margin-top: 34rpx;
			.btn_item{
				position: relative;
				.bg{
					width: 325rpx;
				}
				view{
					position: absolute;
					left: 22rpx;
					font-size: 36rpx;
					font-weight: bold;
				}
				.icon_img{
					width: 88rpx;
					position: absolute;
					right: 34rpx;
				}
			}
		}
		.footer{
			position: fixed;
			bottom: 40rpx;
			text-align: center;
			width: 100%;
			font-size: 24rpx;
			color: #303133;
		}
	}
</style>
