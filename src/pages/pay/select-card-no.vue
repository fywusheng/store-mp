<template>
  <view class="select-card-no">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <view class="back-icon"></view>
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
      <view class="title">请选择您要绑定的银行卡</view>
      <view class="check-group">
        <template v-for="item in checkList">
          <view
            :key="item.label"
            class="check-item"
            :class="{ active: item.checked }"
            @click="handleRaioChecked(item)"
          >
            <image class="icon-bank" :src="icon.noChecked" />
            <view class="label">{{ item.label }}</view>
            <image
              :class="item.checked ? 'icon-check' : 'icon-noCheck'"
              :src="item.checked ? icon.checked : icon.noChecked"
            />
          </view>
        </template>
      </view>
      <view class="xieyi">
        <image
          @click="handleCheckXieyi"
          :class="checked ? 'icon-check' : 'icon-noCheck'"
          :src="checked ? icon.checked : icon.noChecked"
        />
        本人已充分阅读、理解并同意
        <text class="blue">《用户授权协议》</text>
        ， 授权
        <text class="bold">中国银联</text>
        获取本人个人信息，包括
        <text class="bold">姓名、证件类型、证件号码、手机号、所选银行卡号</text>
        等信息。
      </view>
    </view>
    <view class="page-footer">
      <button class="btn btn-warning">下一步</button>
    </view>
  </view>
</template>

<script>
  import NavigationBar from '@/components/common/navigation-bar.vue';
  export default {
    components: { NavigationBar },
    data() {
      return {
        title: '中国农业银行',
        cardType: 0, // 0 信用卡 1 储蓄卡
        checked: true,
        checkList: [
          {
            value: 0,
            label: '信用卡',
            checked: true,
          },
          {
            value: 1,
            label: '储蓄卡',
            checked: false,
          },
        ],
        // iconPath
        icon: {
          delete: 'http://192.168.1.187:10088/static/pay/icon-input-delete.png',
          checked: 'http://192.168.1.187:10088/static/pay/icon-radio-checked.png',
          noChecked: 'http://192.168.1.187:10088/static/pay/icon-radio-default.png',
          bg: 'http://192.168.1.187:10088/static/pay/icon-bank-bg.png',
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
      // 银行卡类型选择事件
      handleRaioChecked(item) {
        this.checkList.map((item) => (item.checked = false));
        item.checked = true;
      },
      handleCheckXieyi() {
        this.checked = !this.checked;
      },
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
  .select-card-no {
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
      padding: 0 32rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .bank-card {
        position: relative;
        height: 164rpx;
        width: 100%;
        display: flex;
        align-items: center;
        .icon-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .icon-back {
          width: 48rpx;
          height: 48rpx;
          margin: 0 8rpx 0 32rpx;
          z-index: 1;
        }
        .bank-name {
          z-index: 1;
          font-size: 40rpx;
          color: #ffffff;
        }
      }
      .title {
        margin: 62rpx 0 24rpx 0;
        font-size: 36rpx;
        width: 100%;
        text-align: left;
        color: #333333;
      }
      .check-group {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin-bottom: 36rpx;
        width: 100%;
        background: #ffffff;
        box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
        border-radius: 16rpx;
        border: 2rpx solid #eeeeee;
        .check-item {
          width: 100%;
          height: 120rpx;
          // background: #FFFFFF;
          // border-radius: 16rpx;
          // border: 2rpx solid #EEEEEE;
          display: flex;
          align-items: center;
          .icon-bank {
            width: 48rpx;
            height: 48rpx;
            margin: 0 12rpx 0 24rpx;
          }
          &.active {
            border-color: #ff5500;
          }
          .icon-check,
          .icon-noCheck {
            width: 44rpx;
            height: 44rpx;
            margin-left: auto;
            margin-right: 24rpx;
          }
        }
      }
      .xieyi {
        font-size: 32rpx;
        color: #333333;
        .bold {
          font-weight: bold;
        }
        .blue {
          color: #1890ff;
        }
        .icon-check,
        .icon-noCheck {
          width: 35rpx;
          height: 35rpx;
          margin-right: 8rpx;
        }
      }
    }
    .page-footer {
      margin-top: 80rpx;
      padding: 0 32rpx;
      display: flex;
      justify-content: space-between;
      .btn {
        width: 686rpx;
        height: 108rpx;
        background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
        border-radius: 54rpx;
        line-height: 108rpx;
        color: #ffffff;
        font-size: 44rpx;
        font-weight: 500;
      }
    }
  }
</style>
