<template>
  <view class="reset-password-by-id-card-number">
    <view class="title m-60">
      <text class="fs-64 c-black">忘记密码</text>
    </view>
    <view class="row flex-h flex-c-s m-0-60">
      <text class="fs-40 c-black">姓名：</text>
      <input class="row__input fs-40 c-black flex-1" v-model="params.name" />
    </view>
    <view class="row flex-h flex-c-s m-0-60">
      <text class="fs-40 c-black">身份证号：</text>
      <input
        class="row__input fs-40 c-black flex-1"
        type="idcard"
        maxlength="18"
        v-model="params.idCardNumber"
      />
    </view>
    <button class="next-step-button fs-44 c-white" @click="handleNextStepClick">
      下一步
    </button>
    <button
      class="fs-40 c-primary"
      hover-class="none"
      @click="handleResetByPhoneNumber"
    >
      通过手机验证码找回
    </button>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import { validateIDCardNumber } from "@/utils/validation.js";
export default {
  data() {
    return {
      // 表单数据
      params: {
        name: "",
        idCardNumber: "",
      },
    };
  },
  onLoad() {
    uni.$on("faceRecognitionFinished", this.handleFaceRecognitionFinish);
  },
  onShow() {
    // 人脸认证结束后回填预先保存的信息
    const idCardInfo = uni.getStorageSync("idCardInfo");
    if (idCardInfo) {
      this.params = idCardInfo;
      uni.removeStorageSync("idCardInfo");
    }
  },
  onUnload() {
    uni.$off("faceRecognitionFinished");
  },
  methods: {
    /**
     * 人脸认证结果回调
     */
    handleFaceRecognitionFinish(result) {
      // 人脸认证结束后处理结果
      const { ismatch, img } = result;
      if (ismatch) {
        api.getFaceRecognitionResult({
          data: {
            userName: this.params.name,
            idCard: this.params.idCardNumber,
            faceImg: `data:image/jpg;base64,${decodeURIComponent(img)}`,
          },
          success: () => {
            api.getPhoneNumberByIDCardNumber({
              data: {
                idCard: this.params.idCardNumber,
                name: this.params.name,
              },
              success: (data) => {
                uni.navigateTo({
                  url: `/pages/user-center/reset-password?phoneNumber=${data.tel}`,
                });
              },
            });
          },
        });
      }
    },
    /**
     * 下一步点击事件
     */
    handleNextStepClick() {
      if (!this.params.name) {
        this.$uni.showToast("请输入姓名");
        return;
      }
      if (!this.params.idCardNumber) {
        this.$uni.showToast("请输入身份证号");
        return false;
      }
      if (!validateIDCardNumber(this.params.idCardNumber)) {
        this.$uni.showToast("身份证号格式错误，请重新输入");
        return false;
      }

      uni.setStorageSync("idCardInfo", this.params);

      const url = `http://120.42.37.86:10013/#/?psnName=${this.params.name}&idCard=${this.params.idCardNumber}&url=/pages/common/face-recognition-result&platform=miniProgram`;
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    /**
     * 通过手机验证码找回点击事件
     */
    handleResetByPhoneNumber() {
      uni.redirectTo({
        url: "/pages/user-center/reset-password-by-phone-number",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.reset-password-by-id-card-number {
  .row {
    height: 120rpx;
    &__input {
      height: 88rpx;
      line-height: 88rpx;
      border-bottom: 2rpx solid #dbdbdb;
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
