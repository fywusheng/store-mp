<template>
	<view class="main">
		<view class="list">
			<view class="item flex_r_h">
				<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/xt-x-icon.png" class="icon"></image>
				<view class="desc">
					<view class="name">通知公告</view>
					<view class="info">暂无最新消息</view>
				</view>
			</view>
			<view class="item flex_r_h">
				<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/xt-s-icon.png" class="icon"></image>
				<view class="desc">
					<view class="name">系统提醒</view>
					<view class="info">暂无最新消息</view>
				</view>
			</view>
		</view>
		
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
		margin-top: 16rpx;
		.list{
			justify-content: flex-start;
			padding: 0 32rpx;
			background: #fff;
			.item{
				border-bottom: 1rpx solid #EBEBEB;
				padding: 40rpx 0;
			}
			.item:last-child{
				border-bottom:0;
			}
		}
		.icon{
			width: 80rpx;
			height: 80rpx;
		}
		.desc{
			flex:1;
			margin-left: 24rpx;
			.name{
				font-size: 32rpx;
				font-weight: 500;
				color: #303133;
			}
			.info{
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
				margin-top: 8rpx;
			}
		}
	}
</style>