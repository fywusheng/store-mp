<template>
  <view class="auth">
    <view class="banner p-0-32">
      <image
        class="img"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/auth-ban.png"
        mode="scaleToFill"
      />
      <view class="title flex-h flex-s-s">
        <image
          class="logo mr-16"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/auth-logo.png"
          mode="scaleToFill"
        />
        <view class="c-white fs-44 fw-bold">电子老年人证</view>
      </view>
      <view class="mt-44 fs-36 c-white">享受优惠待遇</view>
    </view>
    <view class="btn-box mt-80 mb-32">
      <button
        class="agree-button fs-44 fw-bold c-white"
        @click="handleAgreeClick"
      >
        同意协议并授权
      </button>
    </view>

    <view class="arguments">
      查看<text class="c-blue">《用户授权协议》</text
      ><text class="c-blue">《电子老年人证用户协议》</text
      ><text class="c-blue">《人脸识别认证服务须知》</text
      >，授权电子老年人证获取你的姓名、手机号、身份证用于实名领卡，并经由国家老龄服务平台上传您的相片、姓名、社会保障号码信息以完成实人认证。
    </view>
    <view class="page-bottom">
      <view class="flex-h flex-c-c">
        <image
          class="img-line"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/text-line-left.png"
          mode="scaleToFill"
        />
        <view class="line-text">电子老年人证服务</view>
        <image
          class="img-line"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/text-line-right.png"
          mode="scaleToFill"
        />
      </view>
      <view class="last">本服务由国家老龄服务平台提供</view>
    </view>
    <show-points ref="showPoints" @success_flag="success_flag"></show-points>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import { startFacialRecognitionVerify } from "@/utils/utils.js";
import { showPoints } from "./components/showPoints.vue";
export default {
  components: { showPoints },
  data() {
    return {
      name: "",
      idCard: "",
      userInfo: {},
    };
  },
  onLoad(e) {
    api.getUserInfo({
      showsLoading: true,
      data: {
        accessToken: uni.getStorageSync("token"),
      },
      success: (data) => {
        this.userInfo = data;
        uni.setStorageSync("userInfo", data);
        this.idCard = this.userInfo.idCard;
        this.name = this.userInfo.psnName;
      },
    });
  },
  methods: {
    success_flag(successFlag) {
      // this.$emit("success_flag",successFlag)
    },
    handleAgreeClick() {
      const params = {
        name: this.name,
        idCard: this.idCard,
      };
      console.log("提交的参数params:", params);
      params.success = async () => {
        // 其他渠道授權接口
        api.executeActivation({
          data: {
            idNo: this.idCard,
            userName: this.name,
          },
          showsLoading: true,
          success: (res) => {
            api.findPopoverList({
              data: {
                userId: this.userInfo.uactId,
              },
              success: (res) => {
                let msgId = "";
                const popStatus = res.some((popItem, popIndex) => {
                  if (popItem.popoverType === "0") {
                    msgId = popItem.msgId;
                    return true;
                  }
                });
                if (popStatus) {
                  // 弹出弹框
                  this.$refs.showPoints.showsCreditsPopup = true;
                  api.markPopover({
                    data: {
                      msgId: msgId,
                      channel: "miniprogram",
                    },
                    success: (res) => {
                      console.log("500积分弹出成功");
                      setTimeout(() => {
                        uni.reLaunch({
                          url: "/pages/index/index",
                        });
                      }, 2500);
                    },
                  });
                } else {
                  setTimeout(() => {
                    uni.reLaunch({
                      url: "/pages/index/index",
                    });
                  }, 20);
                }
              },
            });
          },
        });

        // 进行实名认证 身份信息+头像
      };
      // this.demo();
      // 开启人脸识别
      startFacialRecognitionVerify(params);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.auth {
  .banner {
    position: relative;
    width: 100vw;
    height: 276rpx;
    box-sizing: border-box;
    .img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 276rpx;
      z-index: -1;
    }
    .title {
      padding-top: 26rpx;
      .logo {
        flex-shrink: 0;
        width: 64rpx;
        height: 64rpx;
      }
    }
  }
  .btn-box {
    width: 100vw;
    height: 108rpx;
    line-height: 108rpx;
    .agree-button {
      width: 686rpx;
      height: 108rpx;
      background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
      border-radius: 54rpx;
      margin: 0 auto;
    }
  }
  .arguments {
    box-sizing: border-box;
    padding: 0 32rpx;
    font-size: 32rpx;
    color: #333333;
    line-height: 44rpx;
    text-align: justify;
    .c-blue {
      color: #0059ff;
    }
  }
  .page-bottom {
    position: fixed;
    bottom: 42rpx;
    left: 0;
    width: 100vw;
    .img-line {
      flex-shrink: 0;
      width: 194rpx;
      height: 4rpx;
    }
    .line-text {
      flex-shrink: 0;
      margin: 0 8rpx;
      color: #333;
      font-size: 36rpx;
    }
    .last {
      color: #999;
      font: 36rpx;
      text-align: center;
    }
  }
}
</style>
