<template>
  <view class="submit-result">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :shows-back-button="true" title="申请结果" />
    <!-- #endif -->

    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view class="flex-v flex-c-s">
      <image
        class="result-icon mt-80"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-submit-success.png"
      />
      <text class="fs-50 c-primary mt-32">恭喜您</text>
      <text class="fs-50 c-primary">您的申领已提交成功</text>
      <text class="fs-40 c-grey mt-32"> 预计将在2个工作日内完成审核 </text>
      <text class="fs-40 c-grey">请您耐心等待</text>
      <button
        class="button fs-44 c-white"
        hover-class="none"
        @click="handleBackToHomeClick"
      >
        返回首页
      </button>
    </view>
  </view>
</template>

<script>
import NavigationBar from "../../components/common/navigation-bar.vue";
export default {
  components: { NavigationBar },
  data() {
    return {
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 是否为自己申领
      isForSelf: false,
      // 是否显示积分弹窗
      showsCreditsPopup: false,
    };
  },
  methods: {
    /**
     * 导航栏返回键的点击事件
     */
    handleNavigationBack() {
      console.log("处理导航栏返回键点击事件");
      uni.reLaunch({
        url: "/pages/index/index?index=0",
      });
    },
    /**
     * 返回首页点击事件
     */
    handleBackToHomeClick() {
      uni.reLaunch({
        url: "/pages/index/index?index=0",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.submit-result {
  .result-icon {
    @include size(220, 176);
  }
  .button {
    @include size(686, 108);
    margin-top: 200rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    border: 2rpx solid $color-primary;
    box-sizing: border-box;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
  .credits-popup {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    .credits-image {
      @include size(750, 812);
    }
    .close-icon {
      @include square(72);
    }
  }
}
</style>
