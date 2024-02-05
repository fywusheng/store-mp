//本地上传图片
<template>
  <view class="local-upload flex-v flex-c-b">
    <view class="avatar flex-v flex-c-c mt-24">
      <image
        class="border-image"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/certificate/bg-certificate-avatar-border.png"
      />
      <!-- #ifdef MP-ALIPAY -->
      <canvas
        class="canvas"
        :width="imgWidth"
        :height="imgHeight"
        id="canvas"
      ></canvas>
      <!-- #endif -->
      <image
        class="avatar-image"
        mode="scaleToFill"
        v-if="avatarURL"
        :src="avatarURL"
      />
      <view class="add flex-v flex-c-c" v-else @click="handleChooseImageClick">
        <image
          class="add-icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/certificate/icon-certificate-avatar-add.png"
        />
        <text class="fs-36 c-black mt-12">点击添加照片</text>
      </view>
    </view>
    <button
      class="reselect-button fs-40 c-primary"
      hover-class="none"
      v-if="avatarURL"
      @click="handleChooseImageClick"
    >
      重新选择
    </button>
    <view class="tips flex-1">
      <text class="fs-36 c-primary">温馨提示：</text>
      <text class="fs-36 c-lightgrey">
        您上传的照片尺寸须为1寸或2寸，请确保您的面部清晰可见，否则会检测失败，建议最好是证件照。
      </text>
    </view>
    <button
      class="normal-button fs-44 c-white"
      hover-class="none"
      :class="{ disabled: !avatarURL }"
      @click="handleUploadClick"
    >
      确认上传
    </button>
  </view>
</template>

<script>
import api from "@/apis/index.js";
export default {
  data() {
    return {
      // 头像路径
      avatarURL: "",
      // 身份证照数据
      params: {},
      // 用户数据
      userInfo: {},

      imgWidth: "",
      imgHeight: "",
    };
  },
  onLoad(e) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("sendPrevImg", (info) => {
      this.params = info;
    });
  },
  methods: {
    /**
     * 添加图片点击事件
     */
    handleChooseImageClick() {
      uni.chooseImage({
        sourceType: ["album"],
        count: 1,
        success: (res) => {
          // uni.getFileSystemManager().readFile({
          //   filePath: res.tempFilePaths[0],
          //   encoding: 'base64',
          //   success: (rs) => {
          //     // 去背景图片
          //     this.getBackGroundImg(rs.data)
          //   },
          // })

          // #ifdef MP-WEIXIN

          uni.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0],
            encoding: "base64",
            success: (rs) => {
              console.log("图片选取成功：", rs);
              // 去背景图片
              this.getBackGroundImg(rs.data);
            },
          });
          // #endif

          // #ifdef MP-ALIPAY
          my.getImageInfo({
            src: res.tempFilePaths[0],
            success: (resImg) => {
              console.log("图片数据resImg：", resImg);
              this.imgWidth = resImg.width;
              this.imgHeight = resImg.height;
              const canvas = my.createCanvasContext("canvas");
              canvas.drawImage(
                res.tempFilePaths[0],
                0,
                0,
                this.imgWidth,
                this.imgHeight
              );
              // 1. 绘制图片至canvas
              // 绘制完成后执行回调
              canvas.draw(false, () => {
                console.log("绘制完成后执行回调");
                canvas
                  .toDataURL({
                    width: this.imgWidth,
                    height: this.imgHeight,
                    quality: 1,
                  })
                  .then((baseImg) => {
                    console.log("图片baseImg：", baseImg);
                    // let base64 = baseImg.replace("data:image/png;base64,", "");
                    const base64 = baseImg.split(",")[1];
                    console.log("图片base64：", base64);
                    this.getBackGroundImg(base64);
                  });
                //  console.log("图片base64：",base64)
                // base64 = base64.replace("data:image/png;base64,", "");
                // 身份证识别
              });
            },
          });

          // #endif
        },
      });
    },
    /**
     * 确认上传点击事件
     */
    handleUploadClick() {
      uni.setStorageSync("customFace", this.resinfo);
      uni.navigateBack({
        delta: 1,
      });

      // uni.navigateTo({
      //   url: '/pages/certificate/avatar-confirm-other',
      //   success: (res) => {
      //     console.log('成功com:', res)
      //     res.eventChannel.emit('didOpenPageFinish', info, this.resinfo)
      //   },
      //   complete: (com) => {
      //     console.log('完成com:', com)
      //   },
      //   fail: (err) => {
      //     console.log('出错err:', err)
      //   },
      // })
    },
    /**
     * 获取去除背景图片
     */
    getBackGroundImg(faceImg) {
      api.clearBg({
        data: {
          photoBase64: faceImg,
        },
        showsLoading: true,
        success: (resinfo) => {
          console.log("抠图结果resinfo:", resinfo);
          this.avatarURL = "data:image/jpg;base64," + resinfo.photoBase64;
          this.resinfo = resinfo;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.local-upload {
  min-height: 100vh;
  .avatar {
    @include size(318, 440);
    .border-image {
      @include size(318, 440);
      position: absolute;
    }
    .canvas {
      position: absolute;
      z-index: -100;
      opacity: 0;
    }
    .avatar-image {
      @include size(310, 432);
    }
    .add {
      position: relative;
      width: 100%;
      height: 100%;
      background: #f2f2f2;
      &-icon {
        @include square(132);
      }
    }
  }
  .reselect-button {
    @include size(260, 72);
    position: absolute;
    top: 520rpx;
    line-height: 72rpx;
    border-radius: 36rpx;
    border: 2rpx solid $color-primary;
    box-sizing: border-box;
  }
  .tips {
    margin: 182rpx 32rpx 0;
  }
  .normal-button {
    @include size(686, 108);
    margin: 0 32rpx 64rpx;
    line-height: 108rpx;
    border-radius: 54rpx;
    background: linear-gradient(to right, $color-secondary, $color-primary);
  }
  .disabled {
    opacity: 0.3;
  }
}
</style>
