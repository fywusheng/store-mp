<template>
  <view class="modify-by-phone-number">
    <view class="title">
      <text class="fs-64 c-black">请输入验证码</text>
    </view>
    <view class="tips">
      <text class="fs-32 c-black">
        验证码将发送至手机：{{ phoneNumberFilter(params.phoneNumber) }}
      </text>
    </view>
    <view class="row flex-h flex-c-s m-0-60">
      <text class="fs-40 c-black">验证码：</text>
      <input
        class="row__input fs-40 c-black flex-1"
        type="number"
        maxlength="6"
        v-model="params.smsCode"
      />
      <button
        class="row__button fs-36 c-primary"
        hover-class="none"
        :class="{ 'c-grey': seconds > 0 }"
        :disabled="seconds > 0"
        @click="handleSencSMSCodeClick"
      >
        {{ seconds > 0 ? "重新发送(" + seconds + "s)" : "发送验证码" }}
      </button>
    </view>
    <button class="next-step-button fs-44 c-white" @click="handleNextStepClick">
      下一步
    </button>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import { desensitizeInfo } from "@/utils/desensitization.js";
import { validatePhoneNumber } from "@/utils/validation.js";
export default {
  data() {
    return {
      // 发送验证码倒计时
      seconds: 0,
      // 表单数据
      params: {
        phoneNumber: "",
        smsCode: "",
      },
      // 2为修改手机号，4为修改密码
      type: "2",
    };
  },
  onLoad(options) {
    this.type = options.type;
    const userInfo = uni.getStorageSync("userInfo");
    this.params.phoneNumber = userInfo.tel;
  },
  methods: {
    // 手机号过滤器, 用于手机号脱敏
    phoneNumberFilter(value) {
      return desensitizeInfo(value);
    },
    /**
     * 发送验证码点击事件
     */
    handleSencSMSCodeClick() {
      if (!this.params.phoneNumber) {
        this.$uni.showToast("请输入手机号");
        return;
      }
      if (!validatePhoneNumber(this.params.phoneNumber)) {
        this.$uni.showToast("手机号格式错误，请重新输入");
        return;
      }
      api.sendSMSCode({
        data: {
          mobile: this.params.phoneNumber,
          sceneFlag: this.type,
          source: "source",
          tmplId: "340701587045712968",
        },
        success: () => {
          this.$uni.showToast("发送成功");
          this.seconds = 60;
          this.timer = setInterval(() => {
            this.seconds -= 1;
            if (this.seconds < 0) clearInterval(this.timer);
          }, 1000);
        },
      });
    },
    /**
     * 下一步点击事件
     */
    handleNextStepClick() {
      if (this.params.smsCode.length !== 6) {
        this.$uni.showToast("请输入正确的验证码");
        return;
      }
      api.checkSMSCode({
        data: {
          mobile: this.params.phoneNumber,
          code: this.params.smsCode,
          sceneFlag: this.type,
        },
        success: () => {
          if (this.type === "2") {
            // 修改手机号
            uni.navigateTo({
              url: `/pages/user-center/set-phone-number?phoneNumber=${this.params.phoneNumber}&type=${this.type}`,
            });
          } else if (this.type === "4") {
            // 修改密码
            uni.navigateTo({
              url: `/pages/user-center/reset-password?phoneNumber=${this.params.phoneNumber}`,
            });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.modify-by-phone-number {
  background-color: #fff;
  .title {
    padding: 60rpx 60rpx 0;
  }
  .tips {
    margin: 16rpx 60rpx 60rpx;
  }
  .row {
    height: 120rpx;
    &__input {
      height: 88rpx;
      line-height: 88rpx;
      border-bottom: 2rpx solid #dbdbdb;
    }
    &__button {
      position: absolute;
      right: 60rpx;
      z-index: 9;
      background: transparent;
      transition: all 0.3s;
    }
  }
  .next-step-button {
    margin: 72rpx 32rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
}
</style>
