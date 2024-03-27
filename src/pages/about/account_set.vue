<template>
	<view class="main">
		<view class="list">
			<view class="item flex_r_h" @click="updateAccoutPhone">
				<view class="name">更换绑定手机号</view>
				<view class="desc flex_r_h">
					<view>{{ userInfo.accountPhone | phoneNumberFilter }}</view>
					<image src=" http://192.168.1.187:10088/static/store-mp/qw-icon.png" class="icon"></image>
				</view>
			</view>
			<view class="item flex_r_h" @click="aboutYy">
				<view class="name">关于应用</view>
				<view class="desc flex_r_h">
					<image src=" http://192.168.1.187:10088/static/store-mp/qw-icon.png" class="icon"></image>
				</view>
			</view>
		</view>
		<view class="exit_btn" @click="exitLoad">退出登录</view>
	</view>
</template>

<script>
	import api from '@/apis/index.js';
	import { desensitizeInfo } from "@/utils/desensitization.js";
	export default {
		data() {
			return {
				userInfo: Store.getters.UserInfo, //登录用户信息
			};
		},
		created() {

		},
		mounted() {
			
		},
		onLoad(option) {
		},
		filters: {
		  // 手机号过滤器, 用于手机号脱敏
		  phoneNumberFilter(value) {
		    return desensitizeInfo(value);
		  },
		},
		methods: {
			
			/**
			 * 更换手机号
			 */
			updateAccoutPhone() {
				uni.navigateTo({
					url: '/pages/user-center/modify-phone-number' 
				})
			},
			aboutYy(){
				uni.navigateTo({
					url: '/pages/about/index'
				})
			},
			exitLoad() {
			  this.$uni.showConfirm({
			    content: '是否退出登录',
			    confirm: () => {
			      api.logout({
			        success: () => {
			          Store.dispatch('logout')
			          uni.reLaunch({
			            url: '/pages/login/index'
			          })
			        }
			      })
			    }
			  })
			},
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
		/* #endif */	}
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
	.main{
		border-top: 1rpx solid #EBEBEB;
		.list{
			padding: 0 32rpx;
			background: #fff;
			.item{
				border-bottom: 1rpx solid #EBEBEB;
				padding: 40rpx 0;
				justify-content: space-between;
				.name{
					font-size: 28rpx;
					font-weight: 400;
					color: #333333;
				}
				.desc{
					view{
						font-size: 28rpx;
						color: #999999;
						margin-right: 22rpx;
					}
				}
			}
			.item:last-child{
				border-bottom:0;
			}
		}
		.icon{
			width: 24rpx;
			height: 24rpx;
		}
		.exit_btn{
			width: 100%;
			padding: 30rpx;
			text-align: center;
			font-size: 28rpx;
			color: #FF3B30;
			text-align: center;
			margin-top: 16rpx;
			background-color: #fff;
		}
	
	}
</style>