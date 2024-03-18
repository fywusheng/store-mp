<template>
  <view class="submit-result">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar title="申请结果" :shows-back-button="true" />
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view class="flex-v flex-c-s">
      <image class="result-icon mt-80" mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-submit-success.png" />
      <text class="fs-50 c-primary mt-54">恭喜你实名认证成功</text>

      <button class="button fs-44 c-white" hover-class="none" @click="handleBackToHomeClick">
        返回
      </button>

    </view>
  </view>
</template>

<script>
import NavigationBar from '../../components/common/navigation-bar.vue'
export default {
  components: { NavigationBar },
  data() {
    return {
      backUrl: '',
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 是否为自己申领
      isForSelf: false,
      // 是否显示积分弹窗
      showsCreditsPopup: false
    }
  },
  onLoad(option) {
    if (option.index && option.back) {
      this.backUrl = option.back + '?index=' + option.index
    } else if (option.info && option.back) {
      this.backUrl = option.back + '?info=' + option.info
    } else {
      this.backUrl = option.back
    }
    // const url = JSON.parse(option.back)
    console.log('===返回的制止---', this.backUrl)
  },
  methods: {
    goback() {
      const back = getCurrentPages()
      var currpage = back[back.length - 1]
      var prepage = back[back.length - 2]
      console.log('===返回---', back)
      console.log('----currpage---', currpage.$page.fullPath)
      console.log('----prepage---', prepage.$page.fullPath)
      if (back && back.length > 1) {
        uni.redirectTo({
          url: this.backUrl
        })
      } else {
        history.back()
      }
    },
    /**
     * 导航栏返回键的点击事件
     */
    handleNavigationBack() {
      console.log('处理导航栏返回键点击事件')
      this.goback()
      //   uni.reLaunch({
      //     url: "/pages/index/index?index=2",
      //   });
    },
    /**
     * 返回首页点击事件
     */
    handleBackToHomeClick() {
      console.log('===fanh')
      //  uni.navigateBack({
      //          delta: 1
      //       });
      this.goback()
      //   uni.reLaunch({
      //     url: "/pages/index/index?index=2",
      //   });
    }
  }
}
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
