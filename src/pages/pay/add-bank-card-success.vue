<template>
  <view class="add-bank-card-success">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <text class="icon-desc" @click="hanldeComplete">完成</text>
          <text class="navigation-bar__title fs-44 c-black flex-1">{{ title }}</text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <text class="icon-desc" @click="hanldeComplete">完成</text>
          <text class="navigation-bar__title fs-44 c-black flex-1">{{ title }}</text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />

    <view class="page-header mt-16">
      <image v-if="resultType === 0" class="icon-error" :src="icon.success" />
      <image v-else class="icon-error" :src="icon.fail" />
      <view class="error-txt">添加银行卡成功！</view>
    </view>
  </view>
</template>

<script>
  import NavigationBar from '@/components/common/navigation-bar.vue';
  export default {
    components: { NavigationBar },
    data() {
      return {
        // 结果类型 0-成功 1-失败
        resultType: 0,
        title: '绑定银行卡',
        // iconPath
        icon: {
          success: 'http://192.168.1.187:10088/static/pay/icon-success.png',
          fail: 'http://192.168.1.187:10088/static/pay/icon-fail.png',
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
    onBackPress(e) {
      console.log('----监听返回1111----');
      // uni.redirectTo({
      //    url: '/pages/pay/my-bank-card'
      // });
    },
    methods: {
      hanldeComplete() {
        // uni.navigateTo({
        //    url: '/pages/pay/my-bank-card'
        // });
        uni.reLaunch({
          url: '/pages/pay/my-bank-card',
        });
      },

      // 返回上一页
      handleNavBack() {
        this.$refs.tipModal.open();
        // uni.navigateBack();
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
  .add-bank-card-success {
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
        margin-left: 56rpx;
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
      .icon-error {
        margin: 62rpx 0;
        width: 144rpx;
        height: 142rpx;
      }
      .error-txt {
        color: #333333;
        font-size: 40rpx;
        text-align: center;
        margin-bottom: 24rpx;
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
          border: 2rpx solid #eb3030;
          color: #eb3030;
        }
      }
    }
  }
</style>
