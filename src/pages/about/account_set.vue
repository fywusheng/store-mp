<template>
	<view class="main">
		<view class="list">
			<view class="item flex_r_h">
				<view class="name">更换绑定手机号</view>
				<view class="desc flex_r_h">
					<view>1378999999</view>
					<image src=" https://ggllstatic.hpgjzlinfo.com/static/store-mp/qw-icon.png" class="icon"></image>
				</view>
			</view>
			<view class="item flex_r_h">
				<view class="name">关于应用</view>
				<view class="desc flex_r_h">
					<image src=" https://ggllstatic.hpgjzlinfo.com/static/store-mp/qw-icon.png" class="icon"></image>
				</view>
			</view>
		</view>
		<view class="exit_btn">退出登录</view>
	</view>
</template>

<script>
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