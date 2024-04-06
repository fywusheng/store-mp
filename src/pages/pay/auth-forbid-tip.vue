<template>
  <view class="auth-forbid-tip">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <text class="navigation-bar__title fs-44 c-black flex-1">{{ title }}</text>
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
          <text class="navigation-bar__title fs-44 c-black flex-1">{{ title }}</text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />

    <view class="page-header mt-16">
      <image class="icon-forbid" :src="icon.forbid" />
      <view class="txt">用户暂不授权请点击左上角返回</view>
    </view>
  </view>
</template>

<script>
  import NavigationBar from '@/components/common/navigation-bar.vue';
  export default {
    components: { NavigationBar },
    data() {
      return {
        title: '中国银行',
        // iconPath
        icon: {
          forbid: 'http://192.168.1.187:10088/static/pay/icon-forbid-auth.png',
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
        uni.navigateBack();
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
  .auth-forbid-tip {
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
        // width: 40rpx;
        // height: 40rpx;
        margin-left: 24rpx;
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
      .navigation-bar__complete {
        position: absolute;
        right: 36rpx;
      }
    }
    .page-header {
      width: 100vw;
      margin-top: 182rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .icon-forbid {
        width: 440rpx;
        height: 228rpx;
      }
      .txt {
        width: 288rpx;
        height: 100rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 50rpx;
        text-align: center;
        margin-top: 38rpx;
      }
    }
  }
</style>
