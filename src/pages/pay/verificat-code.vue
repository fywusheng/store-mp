<template>
  <view class="verification-code">
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
      <view class="title">我的验证码是</view>
      <view class="tip">
        <text>验证码已发送至{{ cardInfo.phone }}</text>
        <text v-if="time > 0" class="">已发送({{ time }}s)</text>
        <text v-if="time === 0" class="blue" @click="sendSms">重新发送</text>
      </view>
      <view class="error-tip" :style="{ opacity: showTip ? 1 : 0 }"
        >验证码不正确或已失效，请重新发送</view
      >

      <one-input
        :maxlength="6"
        v-model="validCode"
        @finish="finishedOne"
        :autoFocus="autoFocus"
      ></one-input>
    </view>

    <view class="page-footer">
      <button
        class="btn btn-warning"
        :disabled="enableNext ? false : true"
        :style="{ opacity: enableNext ? 1 : 0.5 }"
        @click="handleNext"
      >
        下一步
      </button>
    </view>

    <!-- 预留手机号说明 -->
    <modal
      ref="phoneModal"
      cancelText=" "
      confirmText="知道了"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    >
      <template v-slot:text>
        <view class="confirm-main">
          <view class="content">验证码不正确或已失效，请尝试重发验证码</view>
        </view>
      </template>
    </modal>
  </view>
</template>

<script>
import NavigationBar from "@/components/common/navigation-bar.vue";
import Modal from "@/components/common/modal.vue";
import OneInput from "./components/myp-one.vue";
import api from "@/apis/index.js";
export default {
  components: { NavigationBar, Modal, OneInput },
  data() {
    return {
      title: "验证码",
      isValid: false,
      validCode: "",
      showTip: false,
      time: null,
      // iconPath
      checked: true,
      userInfo: {},
      cardInfo: {},
      autoFocus: true,
      icon: {
        auth: "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-warn-circle-blue.png",
        delete:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-input-delete.png",
        circleGre:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-warn-circle.png",
        checked:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-checked.png",
        noChecked:
          "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-default.png",
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
  onLoad(e) {
    this.cardInfo = JSON.parse(decodeURIComponent(e.cardInfo));
    this.userInfo = uni.getStorageSync("userInfo");
    this.sendSms();
  },
  onShow() {},
  computed: {
    enableNext() {
      return new String(this.validCode).length === 6;
    },
  },
  methods: {
    // 发送验证码
    sendSms() {
      api.getValidCodeForBindCard({
        data: {
          bankCardNum: this.cardInfo.bankCardNum,
          phone: this.cardInfo.phone,
        },
        success: (res) => {
          this.showTip = !res;
          if (res) {
            this.startTime();
            this.requestId = res;
          }
        },
      });
    },
    // 倒计时
    startTime() {
      this.time = 60;
      this.timer = setInterval(() => {
        if (this.time === 0) {
          clearInterval(this.timer);
          return false;
        }
        this.time--;
      }, 1000);
    },
    finishedOne() {},
    // 提示
    handlePopPhoneModal() {
      this.$refs.phoneModal.open();
    },
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
    // 下一步
    handleNext() {
      api.openOnlinePay({
        data: {
          requestId: this.requestId,
          smsCode: this.validCode,
        },
        success: (res) => {
          if (res) {
            uni.navigateTo({
              url: "/pages/pay/add-bank-card-success",
            });
          }
        },
        fail: () => {
          console.log("23423432423-----");
          this.showTip = true;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
//modal弹框
.confirm-main {
  width: 552rpx;
  margin: 0 auto;
  height: 180rpx;
  text-align: left;
  font-size: 40rpx;
  line-height: 180rpx;
  .wen {
    color: #ff5500;
  }
}
.verification-code {
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
    padding: 0 32rpx;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      font-size: 56rpx;
      font-weight: 500;
      color: #333333;
      margin-top: 96rpx;
      margin-bottom: 32rpx;
      width: 100%;
      text-align: left;
    }
    .tip {
      font-size: 36rpx;
      width: 100%;
      color: #999999;
      display: flex;
      justify-content: space-between;
      .blue {
        color: #1890ff;
      }
    }
    .error-tip {
      margin: 120rpx 0 26rpx 0;
      width: 100%;
      text-align: center;
      color: #ee0a24;
    }
  }
  .page-content {
    border-bottom: 2rpx solid #eeeeee;
    border-top: 2rpx solid #eeeeee;
    padding: 0 32rpx;
    .item {
      display: flex;
      justify-content: space-between;
      font-weight: 32rpx;
      color: #333333;
      height: 120rpx;
      border-bottom: 2rpx solid #eeeeee;
      display: flex;
      font-size: 40rpx;
      .label {
        line-height: 120rpx;
        width: 226rpx;
      }
      .cont {
        line-height: 120rpx;
        flex: 1;
        position: relative;
        &.gre {
          color: #999999;
        }
        .input-phone {
          height: 100%;
        }
        .icon-delete {
          width: 32rpx;
          height: 32rpx;
          position: absolute;
          top: 44rpx;
          right: 58rpx;
          z-index: 100;
        }
        .icon-circle-gre {
          width: 32rpx;
          height: 32rpx;
          position: absolute;
          top: 44rpx;
          right: 0;
          z-index: 100;
        }
      }
    }
  }
  .xieyi {
    font-size: 32rpx;
    color: #333333;
    padding: 48rpx 32rpx 0 32rpx;
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
  .page-footer {
    margin-top: 94rpx;
    padding: 0 32rpx;
    display: flex;
    justify-content: space-between;
    .btn {
      width: 100%;
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
        opacity: 0.5;
        color: #ffffff;
        background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
      }
    }
  }
}
</style>
