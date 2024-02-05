<template>
  <view class="auth-tip">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
        <view
          class="navigation-bar flex-h flex-c-s"
          :style="{ height: '44px' }"
        >
          <text class="navigation-bar__title fs-44 c-black flex-1">{{
            title
          }}</text>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
        <view
          class="navigation-bar flex-h flex-c-s"
          :style="{ height: '44px' }"
        >
          <image
            class="back-icon"
            @click="handleNavBack"
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-arrow-left.png"
            mode="scaleToFill"
          />
          <text class="navigation-bar__title fs-44 c-black flex-1">{{
            title
          }}</text>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />

    <view class="page-header mt-16">
      <view class="img-warpper">
        <image class="icon-error auth1" :src="icon.auth1" />
        <image class="icon-error auth2" :src="icon.auth2" />
        <image class="icon-error auth3" :src="icon.auth3" />
      </view>
      <view class="error-txt"
        >授权 招商银行 获取您的
        身份信息（姓名、证件号)及以下信息为您提供相关服务。</view
      >
    </view>
    <view class="page-content">
      <view class="item">
        <view class="label">手机号</view>
        <view class="cont">138****7810</view>
      </view>
      <view class="item">
        <view class="label">银行卡号</view>
        <view class="cont">您已绑定的属于该银行的银行卡</view>
      </view>
    </view>

    <view class="page-footer">
      <button class="btn btn-default" @click="handleHomeBack">暂不授权</button>
      <button class="btn btn-warning">确认授权</button>
    </view>
  </view>
</template>

<script>
import NavigationBar from "@/components/common/navigation-bar.vue";
export default {
  components: { NavigationBar },
  data() {
    return {
      title: "授权提示",
      // iconPath
      icon: {
        auth1: "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-auth-1.png",
        auth2: "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-auth-2.png",
        auth3: "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-auth-3.png",
      },
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 状态栏高度
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
    };
  },
  onLoad(e) {},
  onShow() {},
  methods: {
    // 返回上一页
    handleNavBack() {
      // this.$refs.tipModal.open()
      uni.navigateBack();
    },
    // 返回首页
    handleHomeBack() {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-tip {
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
    position: relative;
    padding: 0 32rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img-warpper {
      display: flex;
      align-items: center;
      .icon-error {
        margin: 62rpx 0;
        width: 164rpx;
        height: 164rpx;
        &.auth2 {
          width: 64rpx;
          height: 42rpx;
          margin: 62rpx 42rpx;
        }
        &.auth3 {
          width: 80rpx;
          height: 80rpx;
          padding: 22rpx;
          border-radius: 16rpx;
          background: #ffffff;
        }
      }
    }

    .error-txt {
      color: #333333;
      font-size: 32rpx;
      margin-bottom: 84rpx;
    }
    .pay-account {
      font-size: 48rpx;
      color: #333333;
      margin-bottom: 76rpx;
    }
  }
  .page-content {
    border-bottom: 2rpx solid #eeeeee;
    border-top: 2rpx solid #eeeeee;
    padding: 32rpx;
    .item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32rpx;
      font-weight: 32rpx;
      color: #333333;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .page-footer {
    margin-top: 94rpx;
    padding: 0 32rpx;
    display: flex;
    justify-content: space-between;
    .btn {
      width: 328rpx;
      height: 108rpx;
      line-height: 108rpx;
      border: 2rpx solid #dcdee0;
      border-radius: 54rpx;
      font-size: 44rpx;
      font-weight: 500;
      &-default {
        border: 2rpx solid #dcdee0;
        color: #333333;
      }
      &-warning {
        border: none;
        color: #ffffff;
        background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
      }
    }
  }
}
</style>
