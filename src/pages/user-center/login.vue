<template>
  <view class="login">
    <image
      class="image"
      mode="scaleToFill"
      src="https://ggllstatic.hpgjzlinfo.com/static/user-center/login-new.png"
    />
    <view class="title">国家老龄服务平台</view>

    <button
      type="primary"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
      :loading="loading"
      class="button button-1 fs-44 c-white m-32"
      hover-class="none"
      @click="handleLoginClick"
    >
      <image
        class="alipay-logo"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/user-center/alipay-logo.png"
      />
      支付宝快捷登录
    </button>

    <view class="footer">
      <view class="radio">
        <image
          @click="handleCheckXieyi"
          :class="checked ? 'icon-check' : 'icon-noCheck'"
          :src="checked ? icon.checked : icon.noChecked"
        />
      </view>

      <view class="fs-36">
        我已阅读并同意
        <text class="c-code" @click="handleUserAgreementClick">
          《用户协议》 </text
        >和
        <text class="c-code" @click="handlePrivacyPolicyClick">
          《隐私协议》
        </text>
        <text>, 未注册的手机号将自动创建国家老龄平台账号</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import api from "@/apis/index.js";

let checked = ref(true);
let loading = ref(false);
let sourceUrl = ""; // 登录来源
let goUrl = "";

const icon = reactive({
  checked:
    "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-checked.png",
  noChecked:
    "https://ggllstatic.hpgjzlinfo.com/static/pay/icon-radio-default.png",
});

onLoad((e) => {
  if (e.goUrl) {
    goUrl = e.goUrl;
  }
  if (e.sourceUrl) {
    sourceUrl = e.sourceUrl;
  }
});

// 获取手机号
function getPhoneNumber(res1) {
  if (res1.detail.errorMessage === "用户取消授权") {
    this.$uni.showToast("取消授权将无法体验完整服务，请重新授权");
    return false;
  }
  uni.getPhoneNumber({
    success: (res) => {
      fastLogin(res.response);
    },
    fail: (res) => {
      console.log(res);
      console.log("getPhoneNumber_fail");
    },
  });
}
// 快捷登录
function fastLogin(encryptedData) {
  loading.value = true;
  api.alipayLogin({
    data: {
      mobile: encryptedData,
      flag: "1",
    },
    success: (data) => {
      uni.setStorageSync("token", data.accessToken);
      Store.dispatch("login");
      loading.value = false;
      uni.showToast({
        title: "登录成功",
        icon: "success",
        duration: 500,
        success: () => {
          getUserInfo(data.accessToken);
        },
      });
    },
    fail: () => {
      loading.value = false;
    },
  });
}
// 登录成功返回
function handleGoBack() {
  if (goUrl != "" && sourceUrl == "mili") {
    // 米粒跳转
    goMili();
    return;
  }

  if (sourceUrl == "" && goUrl != "") {
    uni.reLaunch({ url: goUrl });
    return;
  }

  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: "/pages/index/index" });
    },
  });
}
function goMili() {
  api.getUserAndAddress({
    data: {},
    success: (data) => {
      const { appid, sign, timestamp } = data;
      const token = encodeURIComponent(JSON.parse(data.data).token);
      const env = "alipay_miniapp" || "wechat_miniapp";
      const url = `${ENV.MILI_URL}/#/pages/encrypted-entry/index?data=${token}&appid=${appid}&timestamp=${timestamp}&sign=${sign}&env=${env}&redirectUrl=${this.goUrl}`;
      uni.reLaunch({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    fail: (error) => {
      console.log(error);
    },
  });
}
// 获取用户信息
function getUserInfo(accessToken) {
  api.getUserInfo({
    data: { accessToken },
    success: (data) => {
      uni.setStorageSync("userInfo", data);
      uni.$emit("didLogin");
      handleGoBack();
    },
  });
}
/**
 * 登录点击事件
 */
function handleLoginClick() {
  if (!checked.value) {
    uni.showToast({ title: "请阅读并勾选页面底部协议" });
    return false;
  }
}
function handleCheckXieyi() {
  checked.value = !checked.value;
}
/**
 * 用户协议点击事件
 */
function handleUserAgreementClick() {
  const url = "https://ggll.hpgjzlinfo.com/#/agreement?type=0";
  uni.navigateTo({
    url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
  });
}
/**
 * 隐私协议点击事件
 */
function handlePrivacyPolicyClick() {
  const url = "https://ggll.hpgjzlinfo.com/#/agreement?type=1";
  uni.navigateTo({
    url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
  });
}
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
.c-code {
  color: #1890ff;
}
.icon-check,
.icon-noCheck {
  width: 35rpx;
  height: 35rpx;
  margin-right: 8rpx;
  margin-top: 6rpx;
}
.login {
  background-color: #fff;
  height: 100vh;
  box-sizing: border-box;
  display: block;
  overflow: hidden;
  .title {
    height: 50rpx;
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 50rpx;
    text-align: center;
  }
  .image {
    @include size(192, 192);
    margin: 188rpx auto 38rpx;
    display: block;
    margin-bottom: 32rpx;
  }
  .row {
    height: 120rpx;
    &__label {
      // #ifdef MP-ALIPAY
      width: 180rpx;
      // #endif
      // #ifdef MP-WEIXIN
      width: 160rpx;
      // #endif
    }
    &__input {
      height: 88rpx;
      line-height: 88rpx;
      // border-bottom: 2rpx solid #dbdbdb;
    }
    &__button {
      // position: absolute;
      // right: 60rpx;
      z-index: 9;
      background: transparent;
      transition: all 0.3s;
    }
    &__icon {
      @include square(66);
      // position: absolute;
      right: 60rpx;
      z-index: 9;
    }
  }
  .button {
    height: 100rpx;
    line-height: 100rpx;
    border-radius: 54rpx;
    &-1 {
      font-size: 40rpx;
      font-weight: 400;
      margin: 0 32rpx;
      margin-top: 138rpx;
      background: linear-gradient(to right, $color-secondary, $color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      .alipay-logo {
        width: 52rpx;
        height: 52rpx;
        margin-right: 16rpx;
      }
    }
    &-2 {
      border: 2rpx solid $color-primary;
      box-sizing: border-box;
    }
  }
  .actions {
    .action {
      height: 40rpx;
      line-height: 40rpx;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100vw;
    background: #fff;
    display: flex;
    flex-direction: row;
    padding: 0 32rpx 68rpx 32rpx;
    box-sizing: border-box;
  }
}
</style>
