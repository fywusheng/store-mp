<template>
  <view class="real-name-authentication">
    <view class="form m-32">
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">姓名(必填)</text>
        <input
          class="fs-40 c-black flex-1"
          placeholder="请输入姓名"
          placeholder-class="placeholder"
          v-model="params.name"
        />
      </view>
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">身份证号(必填)</text>
        <input
          class="fs-40 c-black flex-1"
          type="idcard"
          placeholder="请输入身份证号"
          placeholder-class="placeholder"
          v-model="params.idCardNumber"
        />
      </view>
    </view>
    <button
      class="next-step-button bg-primary fs-44 c-white"
      @click="handleNextStepClick"
    >
      下一步
    </button>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import { validateIDCardNumber } from "@/utils/validation.js";
import staticData from "@/utils/dataBase64.js";
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
        api.realPersonAuthenticate({
          data: {
            userName: this.params.name,
            idCard: this.params.idCardNumber,
            faceImg: `data:image/jpg;base64,${decodeURIComponent(img)}`,
          },
          success: () => {
            this.$uni.showToast("认证成功");
            this.getUserInfo();
          },
        });
      }
    },
    /**
     * 下一步点击事件
     */
    handleNextStepClick() {
      if (!this.chackInput()) return;
      // 唤起人脸识别
      this.startFacialRecognitionVerify();
      uni.setStorageSync("applicantInfo", this.params);
      return;
      const url = `http://120.42.37.86:10013/#/?psnName=${this.params.name}&idCard=${this.params.idCardNumber}&url=/pages/common/face-recognition-result&platform=miniProgram`;
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
    },
    /**
     * 人脸识别
     */
    startFacialRecognitionVerify() {
      // #ifdef MP-WEIXIN
      wx.startFacialRecognitionVerify({
        name: this.params.name, // 姓名
        idCardNumber: this.params.idCardNumber, // 身份证号码
        // checkAliveType: "", 人脸核验的交互方式，默认读数字（见表1）
        success: (res) => {
          // errCode为0时表示人脸通过完成
          if (res.errCode == 0) {
            api.realPersonAuthenticate({
              data: {
                userName: this.params.name,
                idCard: this.params.idCardNumber,
                faceImg: staticData.faceImg,
              },
              success: () => {
                this.$uni.showToast("认证成功");
                this.getUserInfo();
              },
            });
          }
        },
        fail: (err) => {
          console.log(err, "err");
        },
      });
      // #endif
      console.log("param---", this.params);
      // #ifdef MP-ALIPAY
      api.getAliPayCertifyParams({
        data: {
          bizCode: "FACE",
          userName: this.params.name,
          idCard: this.params.idCardNumber,
          returnUrl: "/pages/user-center/real-name-authentication",
        },
        success: (data) => {
          if (data.code == 0) {
            my.startAPVerify({
              url: data.certifyUrl,
              certifyId: data.certifyId,
              success: (res) => {
                console.log("success", res);
                api.realPersonAuthenticate({
                  data: {
                    userName: this.params.name,
                    idCard: this.params.idCardNumber,
                    faceImg: staticData.faceImg,
                  },
                  success: () => {
                    this.$uni.showToast("认证成功");
                    this.getUserInfo();
                  },
                });
              },
              fail: function (res) {
                console.log("fail", res);
              },
              complete: function (res) {
                console.log("complete", res);
              },
            });
          }
        },
      });

      // #endif
    },
    /**
     * 获取用户信息
     */
    getUserInfo() {
      api.getUserInfo({
        data: {
          accessToken: uni.getStorageSync("token"),
        },
        success: (data) => {
          uni.$emit("didLogin", data);
          setTimeout(uni.navigateBack, 1500);
        },
      });
    },
    /**
     * 输入信息校验
     */
    chackInput() {
      if (!this.params.name) {
        this.$uni.showToast("请输入姓名");
        return false;
      }
      if (!this.params.idCardNumber) {
        this.$uni.showToast("请输入身份证号");
        return false;
      }
      if (!validateIDCardNumber(this.params.idCardNumber)) {
        this.$uni.showToast("身份证号格式错误，请重新输入");
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.real-name-authentication {
  .form {
    .row {
      min-height: 120rpx;
      border-bottom: 2rpx solid $color-line;
      box-sizing: border-box;
      &__indicator {
        width: 24rpx;
        text-align: center;
        color: #eb3030;
      }
      &__label {
        width: 200rpx;
      }
    }
  }
  .next-step-button {
    margin: 128rpx 32rpx;
    height: 108rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    box-sizing: border-box;
  }
}
</style>
