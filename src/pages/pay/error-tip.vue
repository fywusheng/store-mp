<template>
  <view class="error-tip">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <view class="back-icon"></view>
          <image
            class="icon-desc"
            @click="handleHomeBack"
            src="http://192.168.1.187:10088/static/supermarket/icon-index.png"
            mode="scaleToFill"
          />

          <text class="navigation-bar__title fs-44 c-black flex-1">提示</text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <image
            class="back-icon"
            @click="handleNavBack"
            src="http://192.168.1.187:10088/static/supermarket/icon-arrow-left.png"
            mode="scaleToFill"
          />
          <image
            class="icon-desc"
            @click="handleHomeBack"
            src="http://192.168.1.187:10088/static/supermarket/icon-index.png"
            mode="scaleToFill"
          />

          <text class="navigation-bar__title fs-44 c-black flex-1">提示</text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />

    <view class="page-header mt-16">
      <image class="icon-error" :src="icon.error" />
      <view class="error-txt">
        交易查询失败,请以收银机交易结果为准!如果交易失败,您已经付款,系统将会自动退回金额。
      </view>
    </view>
  </view>
</template>

<script>
  import NavigationBar from '@/components/common/navigation-bar.vue';
  export default {
    components: { NavigationBar },
    data() {
      return {
        // iconPath
        icon: {
          error: 'http://192.168.1.187:10088/static/pay/icon-error.png',
        },
        // 导航栏高度
        //#ifdef MP-WEIXIN
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
        //#endif
        //#ifdef MP-ALIPAY
        navigationBarHeight:
          uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
        //#endif
        // 状态栏高度
        statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
      };
    },
    onLoad(e) {},
    onShow() {},
    methods: {
      // 返回上一页
      handleNavBack() {
        this.$refs.tipModal.open();
        //   uni.navigateBack();
      },
      // 返回首页
      handleHomeBack() {
        uni.reLaunch({
          url: '/pages/index/index',
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .error-tip {
    // 头部
    .navigation-bar {
      box-sizing: border-box;
      padding-left: 24rpx;
      width: 100vw;
      height: 100%;
      .back-icon {
        flex-shrink: 0;
        width: 44rpx;
        height: 44rpx;
        margin-right: 48rpx;
        position: relative;
        z-index: 10;
      }
      .icon-desc {
        flex-shrink: 0;
        width: 40rpx;
        height: 40rpx;
        margin-right: 12rpx;
        position: relative;
        z-index: 10;
      }
      .desc {
        color: #666666;
      }
      .navigation-bar__title {
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
      }
    }
    .page-header {
      width: 100vw;
      position: relative;
      padding: 0 48rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .icon-error {
        margin: 62rpx 0;
        width: 144rpx;
        height: 142rpx;
      }
      .error-txt {
        color: #666666;
        font-size: 36rpx;
        text-align: center;
      }
    }
  }
</style>
