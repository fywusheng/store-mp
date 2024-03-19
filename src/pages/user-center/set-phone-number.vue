<template>
  <view class="set-phone-number">
    <view class="title">
      <text class="fs-64 c-black">更改手机号</text>
    </view>
    <view class="tips">
      <text class="fs-32 c-black">
        更换手机号后，下次登录可以使用新手机号登录，当前绑定手机号为{{
          currentPhoneNumber | phoneNumberFilter
        }}
      </text>
    </view>
    <view class="row flex-h flex-c-s m-0-60">
      <text class="fs-40 c-black">手机号：</text>
      <input
        class="row__input fs-40 c-black flex-1"
        type="number"
        placeholder="请输入手机号"
        placeholder-class="placeholder"
        maxlength="11"
        v-model="params.phoneNumber"
      />
    </view>
    <view class="row flex-h flex-c-s m-0-60">
      <text class="fs-40 c-black">验证码：</text>
      <input
        class="row__input fs-40 c-black flex-1"
        type="number"
        placeholder="输入验证码"
        placeholder-class="placeholder"
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
      确认
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
      currentPhoneNumber: "",
      // 表单数据
      params: {
        phoneNumber: "",
        smsCode: "",
      },
    };
  },
  filters: {
    // 手机号过滤器, 用于手机号脱敏
    phoneNumberFilter(value) {
      return desensitizeInfo(value);
    },
  },
  onLoad() {
    const userInfo = uni.getStorageSync("userInfo");
    this.currentPhoneNumber = userInfo.tel;
  },
  methods: {
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
          sceneFlag: "2",
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
      if (!this.params.phoneNumber) {
        this.$uni.showToast("请输入手机号");
        return;
      }
      if (!validatePhoneNumber(this.params.phoneNumber)) {
        this.$uni.showToast("手机号格式错误，请重新输入");
        return;
      }
      if (this.params.smsCode.length !== 6) {
        this.$uni.showToast("请输入正确的验证码");
        return;
      }
       api.updateMobile({
            data: {
              newMobile: this.params.phoneNumber,
              verifyCode: this.params.smsCode,
            },
            success:(res)=>{
              this.$uni.showToast("手机号修改成功，请重新登录");
              setTimeout(()=>{
                uni.redirectTo({
                  url: '/pages/user-center/login?goUrl='+'/pages/index/index?index=4'
              });
              },1500)
             
            }
          })
      // api.checkSMSCode({
      //   data: {
      //     mobile: this.params.phoneNumber,
      //     code: this.params.smsCode,
      //     sceneFlag: "4",
      //   },
      //   success: () => {
      //     api.updateMobile({
      //       data: {
      //         newMobile: this.params.phoneNumber,
      //         verifyCode: this.params.smsCode,
      //       },
      //       success:(res)=>{
      //         this.$uni.showToast("手机号修改成功，请重新登录");
      //         setTimeout(()=>{
      //           uni.reLaunch({
      //             url: '/pages/user-center/login'
      //         });
      //         },1500)
             
      //       }
      //     })
         
      //   },
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.set-phone-number {
   background-color:#fff;
   margin-top:-10%;
   padding-top:50rpx;
  .title {
    margin: 60rpx 60rpx 0;
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
