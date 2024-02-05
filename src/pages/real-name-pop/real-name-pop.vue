//实名认证方式2
<template>
  <view>
    <uni-popup ref="popup" :maskClick="maskClick" type="center">
      <view v-if="!showIdentity" class="popup">
        <image
          class="img-real"
          v-if="showImg"
          :src="headImg"
          mode="scaleToFill"
        />
        <canvas
          class="canvas"
          id="real-name-pop"
          canvas-id="real-name-pop"
        ></canvas>
        <view class="popup-top fs-40 mt-56">选择信息录入方式</view>
        <view class="popup-content flex-v flex-c-s mt-48">
          <!-- <view
            class="popup-button ocr-btn flex-h flex-c-c"
            @click="handleIdCode"
          >
            <image
              class="ocr mr-20"
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-ocr.png"
              mode="scaleToFill"
            />
            <text>扫描身份证</text>
          </view> -->
          <view
            class="popup-button flex-h flex-c-c mb-48"
            @click="handleIdNumber"
          >
            <image
              class="hand mr-20"
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-des.png"
              mode="scaleToFill"
            />
            <text>手动输入</text>
          </view>
        </view>
        <image
          class="close"
          @click="handleCloseHandle"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-close.png"
          mode="scaleToFill"
        />
      </view>

      <identity-info
        :showTop="showTop"
        v-if="showIdentity"
        :scanInfor="scan_info"
        @success_flag="success_flag"
        @closeModal="closeModal"
      ></identity-info>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import api from "@/apis/index.js";
import { getLessLimitSizeImage } from "@/utils/utils.js";
import IdentityInfo from "@/pages/real-name-pop/identityInfo.vue";
export default {
  components: { uniPopup, IdentityInfo },
  props: {
    // 导航栏透明度, 取值范围为 0 ~ 1, 默认为 0
    showImg: {
      type: Boolean,
      default: true,
    },
    headImg: {
      type: String,
      default:
        "https://ggllstatic.hpgjzlinfo.com/static/common/img-real-name.png",
    },
    showTop: {
      type: Boolean,
      default: true,
    },
    maskClick: {
      type: Boolean,
      default: true,
    },
    closeGoUrl: {
      stype: String,
      default: "",
    },
  },
  data() {
    return {
      type: "",
      imgWidth: "",
      imgHeight: "",
      showIdentity: false,
      scan_info: { type: "input", info: {} },
    };
  },
  methods: {
    success_flag(flag) {
      this.$emit("succFlag", flag);
    },
    // 扫描身份
    handleIdCode() {
      uni.setStorageSync("typeChoice", "scan");
      uni.chooseImage({
        sourceType: ["camera", "album"],
        success: (res) => {
          const file = res.tempFilePaths[0];
          getLessLimitSizeImage(
            "real-name-pop",
            file,
            0.2,
            750,
            (imagePath) => {
              uni.getFileSystemManager().readFile({
                filePath: imagePath,
                encoding: "base64",
                success: (rs) => {
                  api.getIdentification({
                    data: { image64: rs.data },
                    showsLoading: true,
                    success: (resinfo) => {
                      if (
                        !resinfo.data ||
                        Object.keys(resinfo.data).length === 0
                      ) {
                        this.$uni.showToast("身份证识别失败");
                        return;
                      }
                      // 拍照完成后调用后端识别接口, 并将识别结果传入下个页面
                      const info = resinfo.data;
                      // this.$refs.popup.close()
                      this.flag = "scan";
                      console.log("====执行到此时---");
                      this.showIdentity = true;
                      const innerData = {
                        type: "scan",
                        info: {
                          name: info.name || "",
                          idCardNumber: info.id_num || "",
                          gender: info.sex,
                          birthday: info.birth,
                          nation: info.nation,
                          address: info.address,
                          realName: this.type === "3",
                        },
                      };
                      this.scan_info = innerData; // JSON.stringify(innerData)
                    },
                  });
                },
                fail: (erro) => {
                  console.log("---异常拿到---", erro);
                },
              });
            },
            this
          );
        },
        complete: (res) => {
          console.log("图片complete：", res);
          // #ifdef MP-ALIPAY

          // #endif
        },
      });
    },
    // 手动输入
    handleIdNumber() {
      uni.setStorageSync("typeChoice", "input");
      this.showIdentity = true;
      const innerData = {
        type: "input",
        info: {},
      };
      this.scan_info = innerData;
      console.log("scan_info: ", this.scan_info);
      //   uni.navigateTo({
      //     url: '/pages/certificate/identity-info',
      //     success: (res) => {
      //       const data = {
      //         type: 'input',
      //         realName: this.type === '3' ? true : false,
      //         info: {},
      //       }
      //       res.eventChannel.emit('didOpenPageFinish', data)
      //     },
      //   })
    },
    // //关闭弹框
    handleCloseHandle() {
      if (this.maskClick) {
        this.$refs.popup.close();
      } else {
        // 关闭要去其它页面
        if (!this.closeGoUrl) return;
        uni.redirectTo({
          url: `/pages/common/webpage?url=${encodeURIComponent(
            this.closeGoUrl
          )}`,
        });
      }
    },
    // 打开弹框
    open() {
      this.$refs.popup.open();
    },
    closeModal() {
      // 目前只有订单去支付的时候，重定向到收银台
      if (!this.closeGoUrl) {
        this.$refs.popup.close();
        this.showIdentity = false;
        return;
      }
      uni.redirectTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(this.closeGoUrl)}`,
      });
    },
    close() {
      this.$refs.popup.close();
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
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.popup {
  width: 620rpx;
  height: 100%;
  border-radius: 16rpx;
  padding: 0;
  font-size: 0;
  position: relative;

  .img-real {
    width: 620rpx;
    height: 312rpx;
  }
  .canvas {
    position: absolute;
    left: -10000px;
    top: 0;
    width: 750px;
    height: 750px;
  }
  .popup-top {
    color: #333333;
    line-height: 54rpx;
    text-align: center;
  }
  .popup-content {
    .popup-button {
      flex-shrink: 0;
      width: 556rpx;
      height: 100rpx;
      border-radius: 60rpx;
      border: 2rpx solid #ff5500;
      color: #ff5500;
      font-weight: 500;
      font-size: 44rpx;
      &.ocr-btn {
        margin-bottom: 60rpx;
      }

      .ocr {
        flex-shrink: 0;
        width: 48rpx;
        height: 48rpx;
      }
      .hand {
        flex-shrink: 0;
        width: 48rpx;
        height: 50rpx;
      }
    }
  }
  .close {
    position: absolute;
    left: 50%;
    margin-left: -36rpx;
    bottom: -124rpx;
    @include size(72, 72);
  }
}
</style>
