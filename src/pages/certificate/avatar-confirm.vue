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
        class="avatar-image"
        mode="scaleToFill"
        :src="avatarURL"
      />
      <image
        v-if="!avatarURL"
        class="avatar-image"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/headDefault.png"
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
      :loading="loading"
      :disabled="loading"
      @click="handleSubmitClick"
    >
      确认提交
    </button>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import NavigationBar from "../../components/common/navigation-bar.vue";
import { cameraAuth, startFacialRecognitionVerify } from "@/utils/utils.js";
export default {
  components: { NavigationBar },
  data() {
    return {
      loading: false,
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 头像路径 require("./static/image-certificate-avatar.png")
      avatarURL: "",
      // 上个页面传过来的数据
      info: {},
      userInfo: {},
    };
  },
  onShow(option) {
    if (!option) return;
    console.log("back的数据---", option);
    // #ifdef MP-WEIXIN
    this.weixinOnload(option.info, option.resinfo);
    // #endif
    // #ifdef MP-ALIPAY
    this.hander(option.info, option.resinfo);
    // #endif
  },
  onLoad() {
    console.log("--onload3--");
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("didOpenPageFinish", (data, resinfo) => {
      // this.hander(data, resinfo)
      console.log("===1111111---", data.faceImg);
      console.log("===222222---", resinfo);

      // #ifdef MP-WEIXIN
      this.handerResinfor(data, resinfo);
      // #endif
      // #ifdef MP-ALIPAY
      uni.removeStorageSync("info");
      this.hander(data, resinfo);
      // #endif
    });

    // this.handlerFace()
  },
  methods: {
    weixinOnload(data, resinfo) {
      this.info = data;
      this.resinfo = resinfo || {};
      const faceImgbase64 = data.faceImg;
      this.clearBgImg(faceImgbase64);
    },
    handerResinfor(data, resinfo) {
      console.log("====hahah---", data);
      console.log("===resinfo==", resinfo);
      this.info = data;
      this.resinfo = resinfo || {};
      // 如果有uactId字段，那么为帮别人领取，否则为自己领取
      this.userInfo = uni.getStorageSync("userInfo");
    },
    hander(data, resinfo) {
      this.info = data;
      this.resinfo = resinfo || {};
      // 存储本地图片上传能力
      // let faceImgbase64 = data.faceImg
      // this.clearBgImg(faceImgbase64)

      // 如果有uactId字段，那么为帮别人领取，否则为自己领取
      this.userInfo = uni.getStorageSync("userInfo");
      // #ifdef MP-ALIPAY
      this.zfb_auth_face(data.faceImg);
      // #endif

      // 查询剩余次数
      // api.getUserPenCount({
      //   data: {
      //     userId: this.userInfo.uactId,
      //   },
      //   showsLoading: true,
      //   success: (res) => {
      //     console.log('剩余次数：', res)
      //     // uni.setStorageSync('surplusImgCount', res.count)
      //     // if (res.count < 0) {
      //     //   const firstFaceImg = uni.getStorageSync('first-face-img')
      //     //   console.log("---本地查看--",firstFaceImg)
      //     //   if(firstFaceImg){
      //     //     this.resinfo = JSON.parse(firstFaceImg)
      //     //     this.avatarURL = 'data:image/jpg;base64,' + this.resinfo.photoBase64
      //     //   }
      //     //   this.$uni.showAlert({
      //     //     content: '更换照片次数已达上限，将使用您首张拍摄的照片继续申领',
      //     //     confirmText: '继续申领',
      //     //     confirm: (res) => {
      //     //       //  进行人脸比对
      //     //       this.params = this.info
      //     //       console.log('上传数据:', {
      //     //         psnName: this.params.name,
      //     //         image64: this.resinfo.photoBase64,
      //     //         certNo: this.params.idCardNumber,
      //     //         userId: this.userInfo.uactId,
      //     //       })
      //     //       api.authComparison({
      //     //         data: {
      //     //           psnName: this.params.name,
      //     //           image64: this.resinfo.photoBase64,
      //     //           certNo: this.params.idCardNumber,
      //     //           userId: this.userInfo.uactId,
      //     //         },
      //     //         showsLoading: true,
      //     //         success: (res) => {
      //     //           if (res.userPenFlag) {
      //     //             uni.setStorageSync('applicantInfo', {
      //     //               ...this.params,
      //     //               photoBase64: this.resinfo.photoBase64,
      //     //             })
      //     //             const info = { ...this.params }

      //     //             //#ifdef MP-ALIPAY
      //     //             uni.setStorageSync(
      //     //               'info',
      //     //               encodeURIComponent(JSON.stringify(info))
      //     //             )
      //     //             uni.redirectTo({
      //     //               url: `/pages/certificate/fillout-step-1`,
      //     //             })
      //     //             //#endif

      //     //             //#ifdef MP-WEIXIN
      //     //             uni.redirectTo({
      //     //               url: `/pages/certificate/fillout-step-1?info=${encodeURIComponent(
      //     //                 JSON.stringify(info)
      //     //               )}`,
      //     //             })
      //     //             //#endif
      //     //           } else {
      //     //             this.$uni.showToast('认证失败，请重新拍照或上传')
      //     //           }
      //     //         },
      //     //       })
      //     //     },
      //     //   })
      //     // }
      //   },
      // })
      // this.clearBgImg(data.faceImg)
    },
    zfb_auth_face(nowfaceImg) {
      api.getUserPenCount({
        data: {
          userId: this.userInfo.uactId,
        },
        showsLoading: true,
        success: (res) => {
          console.log("剩余次数：", res);
          uni.setStorageSync("surplusImgCount", res.count);
          if (res.count < 0) {
            const firstFaceImg = uni.getStorageSync("first-face-img");
            console.log("---本地查看--", firstFaceImg);
            if (firstFaceImg) {
              this.resinfo = JSON.parse(firstFaceImg);
              this.avatarURL =
                "data:image/jpg;base64," + this.resinfo.photoBase64;
            }
            this.$uni.showAlert({
              content: "更换照片次数已达上限，将使用您首张拍摄的照片继续申领",
              confirmText: "继续申领",
              confirm: (res) => {
                //  进行人脸比对
                this.params = this.info;
                console.log("上传数据:", {
                  psnName: this.params.name,
                  image64: this.resinfo.photoBase64,
                  certNo: this.params.idCardNumber,
                  userId: this.userInfo.uactId,
                });
                api.authComparison({
                  data: {
                    psnName: this.params.name,
                    image64: this.resinfo.photoBase64,
                    certNo: this.params.idCardNumber,
                    userId: this.userInfo.uactId,
                  },
                  showsLoading: true,
                  success: (res) => {
                    if (res.userPenFlag) {
                      uni.setStorageSync("applicantInfo", {
                        ...this.params,
                        photoBase64: this.resinfo.photoBase64,
                      });
                      const info = { ...this.params };

                      // #ifdef MP-ALIPAY
                      uni.setStorageSync(
                        "info",
                        encodeURIComponent(JSON.stringify(info))
                      );
                      uni.redirectTo({
                        url: `/pages/certificate/fillout-step-1`,
                      });
                      // #endif

                      // //#ifdef MP-WEIXIN
                      // uni.redirectTo({
                      //   url: `/pages/certificate/fillout-step-1?info=${encodeURIComponent(
                      //     JSON.stringify(info)
                      //   )}`,
                      // })
                      // //#endif
                    } else {
                      this.$uni.showToast("认证失败，请重新拍照或上传");
                    }
                  },
                });
              },
            });
          } else {
            this.clearBgImg(nowfaceImg);
          }
        },
      });
    },
    // 人脸比对
    handlerFace() {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on("didOpenPageFinish", (data, resinfo) => {
        // this.hander(data, resinfo)
        console.log("===人脸后传过来的身份信息---", data.faceImg);
        console.log("===人脸2---", resinfo);
        this.handerResinfor(data, resinfo);
      });
    },
    handleNavigationBack() {
      this.$uni.showConfirm({
        content: "您确定要中断申领电子老年人证吗?",
        confirmText: "继续申领",
        cancelText: "放弃申领",
        title: "",
        cancel: () => {
          uni.reLaunch({
            url: "/pages/certificate/electronic-card",
          });
        },
      });
    },
    //  clearBgImgReturn(photoBase64) {
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
    //  async setStoregeFaceImg(base64){
    //    const clearImage = await this.clearBgImgReturn(base64)
    //    uni.setStorageSync('first-face-img', JSON.stringify(clearImage))
    //   },
    /**
     * 重新拍照点击事件
     */
    handleTakePhotoClick() {
      // this.userInfo = uni.getStorageSync('userInfo')
      // const params = {
      //   name: this.userInfo.psnName,
      //   idCard: this.userInfo.idCard,
      //   returnUrl: '',
      // }
      // params.success = (getParam)=>{
      //   this.clearBgImg(getParam)
      // }
      // cameraAuth(params)

      // #ifdef MP-ALIPAY
      this.alipay_Photo();
      // #endif
      // #ifdef MP-WEIXIN
      this.weixin_Photo();
      // #endif
    },
    weixin_Photo() {
      this.userInfo = uni.getStorageSync("userInfo");
      const params = {
        name: this.userInfo.psnName,
        idCard: this.userInfo.idCard,
        returnUrl: "",
      };
      params.success = (getParam) => {
        this.clearBgImg(getParam);
      };
      cameraAuth(params);
    },
    alipay_Photo() {
      this.userInfo = uni.getStorageSync("userInfo");
      const params = {
        name: this.userInfo.psnName,
        idCard: this.userInfo.idCard,
        returnUrl: "www.baidu.com",
      };
      params.success = (faceimg) => {
        this.clearBgImg(faceimg);
      };
      startFacialRecognitionVerify(params);
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
        url: "/pages/certificate/local-upload",
        success: (res) => {
          res.eventChannel.emit("sendPrevImg", info);
        },
      });
    },
    /**
     * 确认提交点击事件
     */
    handleSubmitClick() {
      //  进行人脸比对  TODO surplusImgCount 后续删除处理
      this.params = this.info;
      console.log("----提交的值---", this.info);
      const surplusImgCount = uni.getStorageSync("surplusImgCount");
      if (!this.resinfo) return;
      this.loading = true;
      console.log("===确认提交参数---", this.params, this.resinfo);
      // 人脸比对接口
      api.authComparison({
        data: {
          psnName: this.params.name, // this.params.name, //'韩晓亚',// this.params.name,//TODO test
          image64: this.resinfo.photoBase64,
          certNo: this.params.idCardNumber, // this.params.idCardNumber, //'140621198908070546',//,//this.params.idCardNumber, //TODO test
          userId: this.userInfo.uactId,
        },
        success: (res) => {
          this.loading = false;
          // #ifdef MP-WEIXIN
          if (res.count && res.count == 1) {
            // 第四次  弹框提示
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
              const info = { ...this.params };
              // #ifdef MP-ALIPAY
              uni.setStorageSync(
                "info",
                encodeURIComponent(JSON.stringify(info))
              );
              uni.redirectTo({
                url: `/pages/certificate/fillout-step-1`,
              });
              // #endif

              // #ifdef MP-WEIXIN
              uni.redirectTo({
                url: `/pages/certificate/fillout-step-1?info=${encodeURIComponent(
                  JSON.stringify(info)
                )}`,
              });
              // #endif
            } else {
              this.$uni.showToast("认证失败，请重新拍照或上传");
            }
          }
          // #endif

          // TODO 这个有用？
          // 记录更换照片剩余次数，超出使用首次活检图片
          uni.setStorageSync("surplusImgCount", res.count);

          // #ifdef MP-ALIPAY
          const firstFaceImg = uni.getStorageSync("first-face-img");
          if (res.userPenFlag) {
            uni.setStorageSync("applicantInfo", {
              ...this.params,
              photoBase64: this.resinfo.photoBase64,
            });
            const info = { ...this.params };
            console.log("====人脸识别页面确认拿回来的值---", info);
            // #ifdef MP-ALIPAY
            uni.setStorageSync(
              "info",
              encodeURIComponent(JSON.stringify(info))
            );
            uni.redirectTo({
              url: `/pages/certificate/fillout-step-1`,
            });
            // #endif

            // #ifdef MP-WEIXIN
            // uni.redirectTo({
            //   url: `/pages/certificate/fillout-step-1?info=${encodeURIComponent(
            //     JSON.stringify(info)
            //   )}`,
            // })
            // //#endif
          } else {
            if (res.count && res.count <= 0) {
              this.resinfo = JSON.parse(firstFaceImg);
              this.avatarURL =
                "data:image/jpg;base64," + this.resinfo.photoBase64;
              this.$uni.showAlert({
                content:
                  "更换照片次数已达上限,将使用您首张认证成功的照片继续申领",
                confirmText: "继续申领",
                confirm: (q) => {
                  uni.setStorageSync("applicantInfo", {
                    ...this.params,
                    photoBase64: this.resinfo.photoBase64,
                  });
                  const info = {
                    ...this.params,
                    photoBase64: this.resinfo.photoBase64,
                  };
                  // TODO 之后删除
                  uni.setStorageSync("surplusImgCount", res.count);

                  //   uni.navigateTo({
                  //     url: `/pages/certificate/fillout-step-1`,
                  //     success: (res) => {
                  //       res.eventChannel.emit('didOpenPageFinish', info)
                  //     },
                  // })

                  // #ifdef MP-ALIPAY
                  uni.setStorageSync(
                    "info",
                    encodeURIComponent(JSON.stringify(info))
                  );
                  uni.redirectTo({
                    url: `/pages/certificate/fillout-step-1`,
                  });
                  // #endif

                  // //#ifdef MP-WEIXIN
                  // uni.redirectTo({
                  //   url: `/pages/certificate/fillout-step-1?info=${encodeURIComponent(
                  //     JSON.stringify(info)
                  //   )}`,
                  // })
                  // //#endif
                },
              });
              return;
            }
            this.$uni.showToast("认证失败，请重新拍照或上传");
          }
          // #endif
        },
        fail: (error) => {
          this.loading = false;
          console.log("fail---", error);
          this.$uni.showToast(error.message);
        },
      });
    },
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
