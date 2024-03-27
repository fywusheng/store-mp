<template>
	<view class="main">
		<image src="http://192.168.1.187:10088/static/store-mp/logo.png" class="logo"></image>
		<view class="desc">
			<view class="name">松辉医疗门店管理助手</view>
			<view class="version">当前版本{{version}}</view>
		</view>
	</view>
</template>

<script>

export default {
  data() {
    return {
      version: ENV.VERSION
    }
  },

  methods: {
    /**
     * 用户协议点击事件
     */
    handleUserAgreementClick() {
      const url = 'https://ggll.hpgjzlinfo.com/#/agreement?type=0'
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`
      })
    },
    /**
     * 隐私协议点击事件
     */
    handlePrivacyPolicyClick() {
      const url = 'https://ggll.hpgjzlinfo.com/#/agreement?type=1'
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`
      })
    }
  }

}
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