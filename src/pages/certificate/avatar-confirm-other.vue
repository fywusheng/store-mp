//老年卡拍照留存 3
<template>
  <view class="avatar-confirm flex-v flex-c-b">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :shows-back-button="true" />
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view class="avatar flex-v flex-c-c mt-24">
      <image
        class="border-image"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/bg-certificate-avatar-border.png"
      />
      <image
        v-if="avatarURL"
        mode="scaleToFill"
        class="avatar-image"
        :src="avatarURL"
      />
    </view>
    <view class="tips flex-1">
      <text class="fs-36 c-primary">温馨提示：</text>
      <text class="fs-36 c-lightgrey">
        当前照片将会做为电子老年人证照片，若不满意，可重新拍照或本地上传照片。提交后，也可在“证照管理-证照信息变更”中修改照片。
      </text>
    </view>
    <button
      class="plain-button fs-44 c-primary"
      hover-class="none"
      @click="handleTakePhotoClick"
    >
      重新拍照
    </button>
    <button
      class="plain-button fs-44 c-primary"
      hover-class="none"
      @click="handleLocalUploadClick"
    >
      本地上传
    </button>
    <button
      class="normal-button fs-44 c-white"
      hover-class="none"
      :disabled="showLoading"
      @click="handleSubmitClick"
    >
      确认提交
    </button>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import { startFacialRecognitionVerify } from "@/utils/utils.js";
import NavigationBar from "../../components/common/navigation-bar.vue";
import { cameraAuth } from "@/utils/utils.js";
export default {
  components: { NavigationBar },
  data() {
    return {
      // 导航栏高度
      //#ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      //#endif
      //#ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      //#endif
      // 头像路径
      avatarURL: "",
      // 上个页面传过来的数据
      info: {},
      uactId: "",
      showLoading: false,
    };
  },
  onLoad() {
    //#ifdef MP-ALIPAY
    uni.removeStorageSync("otherInfo");
    //#endif
    var iscustomFace = uni.getStorageSync("customFace");
    console.log("iscustomFace:", iscustomFace);
    if (iscustomFace) {
      uni.removeStorageSync("customFace");
    }
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("didOpenPageFinish", (data) => {
      this.info = data;
      //#ifdef MP-ALIPAY
      this.clearBgImg(data.faceImg);
      //#endif
      this.uactId = data.uactId;
      this.getUserPenCount();
    });
  },
  onShow() {
    this.getUserPenCount();
  },
  methods: {
    // 获取对比次数
    getUserPenCount() {
      let customFace = uni.getStorageSync("customFace");
      console.log("customFace:", customFace);
      if (customFace) {
        this.resinfo = customFace;
        this.avatarURL = "data:image/jpg;base64," + customFace.photoBase64;
        uni.removeStorageSync("customFace");
        return;
      }
      //#ifdef MP-ALIPAY

      api.getUserPenCount({
        data: {
          userId: this.uactId, // this.uactId,
        },
        showsLoading: true,
        success: (res) => {
          console.log("剩余次数：", res);
          uni.setStorageSync("photoUploadTimes", res.count);

          if (res.count < 0) {
            const firstFaceImg = uni.getStorageSync("other-first-face-img");
            if (firstFaceImg) {
              this.resinfo = JSON.parse(firstFaceImg);
              this.avatarURL =
                "data:image/jpg;base64," + this.resinfo.photoBase64;
            }
            this.$uni.showAlert({
              content: "更换照片次数已达上限，将使用您首张拍摄的照片继续申领",
              confirmText: "继续申领",
              confirm: () => {
                //  进行人脸比对
                this.params = {
                  ...this.info,
                  userId: this.uactId,
                };
                uni.setStorageSync("applicantInfo", {
                  ...this.params,
                  photoBase64: this.resinfo.photoBase64,
                });
                const info = { ...this.params, type: "input" };
                //#ifdef MP-ALIPAY
                uni.setStorageSync(
                  "otherInfo",
                  encodeURIComponent(JSON.stringify(info))
                );
                uni.redirectTo({
                  url: `/pages/certificate/other-fillout-step-1`,
                });
                //#endif

                //#ifdef MP-WEIXIN
                // uni.redirectTo({
                //   url: `/pages/certificate/other-fillout-step-1?info=${encodeURIComponent(JSON.stringify(info))}`,
                //   success: (resp) => {
                //   },
                // })
                //#endif
              },
            });
          } else {
            let customFace = uni.getStorageSync("customFace");
            console.log("customFace:", customFace);
            if (customFace) {
              this.resinfo = customFace;
              this.avatarURL =
                "data:image/jpg;base64," + customFace.photoBase64;
              uni.removeStorageSync("customFace");
              return;
            }
          }
        },
      });
      //#endif
    },
    // 去背景图片
    clearBgImg(photoBase64) {
      api.clearBg({
        data: { photoBase64 },
        showsLoading: true,
        success: (resinfo) => {
          this.avatarURL = "data:image/jpg;base64," + resinfo.photoBase64;
          this.resinfo = resinfo;
        },
      });
    },
    // clearBgImgReturn(photoBase64) {
    //   return new Promise((resolve, reject) => {
    //     api.clearBg({
    //       data: { photoBase64 },
    //       showsLoading: true,
    //       success: (resInfo) => {
    //         // 保存第一次人脸识别图片
    //         this.avatarURL = 'data:image/jpg;base64,' + resInfo.photoBase64
    //         this.resinfo = resInfo
    //         resolve(resInfo)
    //       },
    //       fail: (erro) => {
    //         reject(erro)
    //       },
    //     })
    //   })
    // },
    //  async setStoregeFaceImg(base64){
    //   const clearImage = await this.clearBgImgReturn(base64)
    //   uni.setStorageSync('other-first-face-img', JSON.stringify(clearImage))
    // },
    /**
     * 重新拍照点击事件
     */
    handleTakePhotoClick() {
      //#ifdef MP-WEIXIN
      const params = {
        returnUrl: "",
      };
      params.success = (getParam) => {
        let faceImgbase64 = getParam;
        this.clearBgImg(faceImgbase64);
      };
      cameraAuth(params);
      //#endif
      //#ifdef MP-ALIPAY
      const params = {
        name: this.name,
        idCard: this.idCard,
        returnUrl: "www.baidu.com",
      };
      //人脸识别成功
      params.success = (getbase64) => {
        console.log("人脸识别成功：");
        this.clearBgImg(getbase64);
        // uni.getFileSystemManager().readFile({
        //   filePath: 'https://ggllstatic.hpgjzlinfo.com/static/certificate/05f08ce3a4c8ce77b5c0af61c35619c.jpg',
        //   encoding: 'base64',
        //   success: (res) => {
        //     this.clearBgImg(getbase64)
        //   },
        // })
      };
      // 开启人脸识别
      console.log("开启人脸");
      startFacialRecognitionVerify(params);
      //#endif
    },
    /**
     * 本地上传点击事件
     */
    handleLocalUploadClick() {
      const info = {
        ...this.info,
        faceImg: this.avatarURL,
        resinfo: this.resinfo,
      };
      uni.navigateTo({
        url: "/pages/certificate/other-local-upload",
        success: (res) => {
          res.eventChannel.emit("sendPrevImg", info);
        },
      });
    },
    /**
     * 确认提交点击事件
     */
    handleSubmitClick() {
      this.params = this.info;
      this.showLoading = true;
      api.authComparison({
        data: {
          psnName: this.params.name, //this.params.name,
          image64: this.resinfo.photoBase64,
          certNo: this.params.idCardNumber, //this.params.idCardNumber,
          userId: this.uactId, //this.uactId,
        },
        showsLoading: true,
        success: (res) => {
          //  去填写基本信息
          this.showLoading = false;
          //#ifdef MP-WEIXIN
          if (res.count && res.count == 1) {
            //第四次  弹框提示
            uni.showModal({
              title: "",
              content: "您还可以更换照片1次,请按照提示上传照片",
              showCancel: false,
              confirmText: "继续申领",
              success: function (res) {
                if (res.confirm) {
                }
              },
            });
          }
          if (res.count && res.count < 0) {
            uni.showModal({
              title: "",
              content: "更换照片次数已达上限,请明天再试",
              showCancel: false,
              confirmText: "知道了",
              success: function (res) {
                if (res.confirm) {
                  uni.reLaunch({ url: "/pages/index/index" });
                }
              },
            });
            return;
          }
          if ((res.count && res.count > 0) || res.count == 0) {
            if (res.userPenFlag) {
              uni.setStorageSync("applicantInfo", {
                ...this.params,
                photoBase64: this.resinfo.photoBase64,
              });
              const info = { ...this.params, type: "input" };
              //#ifdef MP-ALIPAY
              uni.setStorageSync(
                "otherInfo",
                encodeURIComponent(JSON.stringify(info))
              );
              uni.redirectTo({
                url: `/pages/certificate/other-fillout-step-1`,
              });
              //#endif

              //#ifdef MP-WEIXIN
              uni.redirectTo({
                url: `/pages/certificate/other-fillout-step-1?info=${encodeURIComponent(
                  JSON.stringify(info)
                )}`,
                success: (resp) => {},
              });
              //#endif
            } else {
              this.$uni.showToast("认证失败，请重新拍照或上传");
            }
          }
          //#endif
          //#ifdef MP-ALIPAY
          if (res.userPenFlag) {
            uni.setStorageSync("applicantInfo", {
              ...this.params,
              photoBase64: this.resinfo.photoBase64,
            });
            const info = { ...this.params, type: "input" };
            //#ifdef MP-ALIPAY
            uni.setStorageSync(
              "otherInfo",
              encodeURIComponent(JSON.stringify(info))
            );
            uni.redirectTo({
              url: `/pages/certificate/other-fillout-step-1`,
            });
            //#endif

            //#ifdef MP-WEIXIN
            // uni.redirectTo({
            //   url: `/pages/certificate/other-fillout-step-1?info=${encodeURIComponent(JSON.stringify(info))}`,
            //   success: (resp) => {
            //   },
            // })
            //#endif
          } else {
            // 记录更换照片剩余次数，超出使用首次活检图片
            if (res.count < 0) {
              const firstFaceImg = uni.getStorageSync("other-first-face-img");
              this.resinfo = JSON.parse(firstFaceImg);
              this.params = this.info;
              this.avatarURL =
                "data:image/jpg;base64," + this.resinfo.photoBase64;
              this.$uni.showAlert({
                content: "更换照片次数已达上限，将使用您首张拍摄的照片继续申领",
                confirmText: "继续申领",
                confirm: () => {
                  this.params = this.info;
                  console.log("上传数据2:", {
                    ...this.params,
                    userId: this.uactId,
                  });
                  uni.setStorageSync("applicantInfo", {
                    ...this.params,
                    photoBase64: this.resinfo.photoBase64,
                  });
                  const info = { ...this.params, type: "input" };

                  //#ifdef MP-ALIPAY
                  uni.setStorageSync(
                    "otherInfo",
                    encodeURIComponent(JSON.stringify(info))
                  );
                  uni.redirectTo({
                    url: `/pages/certificate/other-fillout-step-1`,
                  });
                  //#endif

                  //#ifdef MP-WEIXIN
                  // uni.redirectTo({
                  //   url: `/pages/certificate/other-fillout-step-1?info=${encodeURIComponent(JSON.stringify(info))}`,
                  //   success: (resp) => {
                  //   },
                  // })
                  //#endif
                },
              });
              return;
            }
            this.$uni.showToast("认证失败，请重新拍照或上传");
          }
          //#endif
        },
        fail: (erro) => {
          this.showLoading = false;
          uni.showToast(erro.message);
        },
      });
    },
    // 点击返回
    handleNavigationBack() {
      this.$uni.showConfirm({
        content: "您确定要中断申领电子老年人证吗?",
        confirmText: "继续申领",
        cancelText: "放弃申领",
        title: "",
        cancel: () => {
          uni.navigateBack({
            delta: 1,
          });
        },
      });
    },
  },
  onUnload() {
    uni.$off("faceRecognitionFinished");
  },
};
</script>

<style lang="scss" scoped>
.avatar-confirm {
  min-height: 100vh;
  .avatar {
    @include size(318, 440);
    .border-image {
      @include size(318, 440);
      position: absolute;
    }
    .avatar-image {
      @include size(310, 432);
    }
  }
  .tips {
    margin: 76rpx 32rpx 0;
  }
  .plain-button {
    @include size(686, 108);
    margin: 0 32rpx 24rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    border: 2rpx solid $color-primary;
    box-sizing: border-box;
  }
  .normal-button {
    @include size(686, 108);
    margin: 0 32rpx 64rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
}
</style>
