<template>
	<view class="main">
		<image src="http://192.168.1.187:10088/static/store-mp/logo.png" class="logo"></image>
		<view class="desc">
			<view class="name">国家老龄服务平台-智慧康复平台</view>
			<view class="version">当前版本v1.0.0</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss">
	page{
		background: #FFFFFF!important;
	}
	.main{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.logo{
			width: 452rpx;
			height: 176rpx;
			margin-top: 110rpx;
		}
		.desc{
			margin-top: 26rpx;
			.name{
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}
			.version{
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
				margin-top: 10rpx;
				text-align: center;
			}
		}
	}
</style>