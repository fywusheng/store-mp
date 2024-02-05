<template>
  <view class="reset-password">
    <view class="title p-60">
      <text class="fs-64 c-black">重置密码</text>
    </view>
    <view class="row flex-h flex-c-s m-0-60">
      <text class="fs-40 c-black">设置密码：</text>
      <input
        class="row__input fs-40 c-black flex-1"
        v-model="params.password"
        type="text"
        maxlength="8"
        placeholder="设置6-8位数字密码"
        placeholder-class="placeholder"
        :password="!showsPasswordText"
      />
      <image
        class="row__icon"
        :src="passwordIconURL"
        mode="scaleToFill"
        @click="showsPasswordText = !showsPasswordText"
      />
    </view>
    <view class="row flex-h flex-c-s m-0-60">
      <text class="fs-40 c-black">确认密码：</text>
      <input
        class="row__input fs-40 c-black flex-1"
        v-model="params.confirmPassword"
        type="text"
        maxlength="8"
        placeholder="请再次输入密码"
        placeholder-class="placeholder"
        :password="!showsConfirmPasswordText"
      />
      <image
        class="row__icon"
        :src="confirmPasswordIconURL"
        mode="scaleToFill"
        @click="showsConfirmPasswordText = !showsConfirmPasswordText"
      />
    </view>
    <button class="reset-button fs-44 c-white" @click="handleResetClick">
      完成
    </button>
  </view>
</template>

<script>
const Icon1 =
  "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-show-password.png";
const Icon2 =
  "https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-user-center-hide-password.png";
import api from "@/apis/index.js";
import sha256 from "crypto-js/sha256";
import { validatePassword } from "@/utils/validation.js";
export default {
  data() {
    return {
      // 是否明文显示密码
      showsPasswordText: false,
      // 是否明文显示确认密码
      showsConfirmPasswordText: false,
      // 表单数据
      params: {
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      },
      // 1.更换手机(人脸)
      type: "1",
    };
  },
  computed: {
    // 密码图标地址
    passwordIconURL() {
      return this.showsPasswordText ? Icon1 : Icon2;
    },
    // 确认密码图标地址
    confirmPasswordIconURL() {
      return this.showsConfirmPasswordText ? Icon1 : Icon2;
    },
  },
  onLoad(e) {
    this.params.phoneNumber = e.phoneNumber;
    this.type = e.type;
  },
  methods: {
    /**
     * 完成点击事件
     */
    handleResetClick() {
      if (!this.params.password) {
        this.$uni.showToast("请输入密码");
        return;
      }
      if (!validatePassword(this.params.password, /^[0-9]{6,8}$/)) {
        this.$uni.showToast("请输入 6-8 位由数字组成的密码");
        return;
      }
      if (this.params.password !== this.params.confirmPassword) {
        this.$uni.showToast("两次输入的密码不一致");
        return;
      }

      api.resetPassword({
        data: {
          mobile: this.params.phoneNumber,
          newPwd: sha256(this.params.password).toString(),
        },
        success: () => {
          this.$uni.showToast("密码设置成功");
          setTimeout(() => {
            uni.redirectTo({
              url:
                "/pages/user-center/login?goUrl=" +
                "/pages/index/index?index=4",
            });
          }, 1500);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.reset-password {
  //#ifdef MP-ALIPAY
  background-color: #fff;
  height: 100vh;
  //#endif
  .row {
    height: 120rpx;
    &__input {
      height: 88rpx;
      line-height: 88rpx;
      border-bottom: 2rpx solid #dbdbdb;
    }
    &__icon {
      @include square(66);
      position: absolute;
      right: 60rpx;
      z-index: 9;
    }
  }
  .reset-button {
    margin: 72rpx 32rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
}
</style>
