<template>
  <view class="scan-or-input-popup">
    <uni-popup ref="popup">
      <view class="popup bg-white br-16 flex-v flex-c-s">
        <text class="fs-44 fw-500 c-black mt-48">选择信息录入方式</text>
        <view class="button flex-h flex-c-c mt-80" @click="handleScanClick">
          <image class="button__icon" mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-idcard-scan.png" />
          <text class="button__text fs-44 c-primary ml-20">扫描身份证</text>
        </view>
        <view class="button flex-h flex-c-c mt-60" @click="handleInputClick">
          <image mode="scaleToFill" class="button__icon"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-idcard-input.png" />
          <text class="button__text fs-44 c-primary ml-20">手动输入</text>
        </view>
        <!-- #ifdef MP-ALIPAY -->
        <canvas class="canvas" :width="imgWidth" :height="imgHeight" id="canvas"></canvas>
        <!-- #endif -->
        <image class="close-icon" mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-close.png"
          @click="handleCloseClick" />
      </view>
    </uni-popup>
  </view>
</template>

<script>
// import UniPopup from '../uni-popup/uni-popup.vue'
import api from '@/apis/index.js'
export default {
  // components: { UniPopup },
  data() {
    return {
      imgWidth: '',
      imgHeight: ''
    }
  },
  methods: {
    /**
     * 关闭图标点击事件
     */
    handleCloseClick() {
      this.$refs.popup.close()
    },
    /**
     * 扫描身份证点击事件
     */
    handleScanClick() {
      uni.setStorageSync('typeChoice', 'scan')
      uni.chooseImage({
        sourceType: ['camera', 'album'],
        success: (res) => {
          console.log('图片success：', res)
          // #ifdef MP-WEIXIN
          uni.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0],
            encoding: 'base64',
            success: (rs) => {
              api.getIdentification({
                data: { image64: rs.data },
                showsLoading: true,
                success: (resinfo) => {
                  if (!resinfo.data) {
                    this.$uni.showToast('身份证识别失败')
                    return
                  }
                  // 拍照完成后调用后端识别接口, 并将识别结果传入下个页面
                  const info = resinfo.data
                  this.$refs.popup.close()
                  uni.navigateTo({
                    url: '/pages/certificate/identity-info',
                    success: (resLast) => {
                      const data = {
                        type: 'scan',
                        realName: this.type === '3',
                        info: {
                          name: info.name,
                          idCardNumber: info.id_num,
                          gender: info.sex,
                          birthday: info.birth,
                          nation: info.nation,
                          address: info.address
                        }
                      }
                      resLast.eventChannel.emit('didOpenPageFinish', data)
                    }
                  })
                }
              })
            }
          })
          // #endif
          // #ifdef MP-ALIPAY
          my.getImageInfo({
            src: res.tempFilePaths[0],
            success: (resImg) => {
              console.log('图片数据resImg：', resImg)
              this.imgWidth = resImg.width
              this.imgHeight = resImg.height
              console.log('图片规格imgWidth：', this.imgWidth)
              console.log('图片规格imgHeight：', this.imgHeight)
              const canvas = my.createCanvasContext('canvas')
              canvas.drawImage(
                res.tempFilePaths[0],
                0,
                0,
                this.imgWidth,
                this.imgHeight
              ) // 1. 绘制图片至canvas
              // 绘制完成后执行回调
              canvas.draw(false, () => {
                console.log('绘制完成后执行回调')
                canvas
                  .toDataURL({
                    width: this.imgWidth,
                    height: this.imgHeight,
                    quality: 1
                  })
                  .then((baseImg) => {
                    console.log('图片baseImg：', baseImg)
                    // let base64 = baseImg.replace("data:image/png;base64,", "");
                    const base64 = baseImg.split(',')[1]
                    console.log('图片base64：', base64)

                    api.getIdentification({
                      data: { image64: base64 },
                      showsLoading: true,
                      success: (resinfo) => {
                        if (!resinfo.data) {
                          this.$uni.showToast('身份证识别失败')
                          return
                        }
                        // 拍照完成后调用后端识别接口, 并将识别结果传入下个页面
                        const info = resinfo.data

                        // return
                        this.$refs.popup.close()

                        uni.navigateTo({
                          url: '/pages/certificate/identity-info',
                          success: (resLast) => {
                            const data = {
                              type: 'scan',
                              realName: this.type === '3',
                              info: {
                                name: info.name,
                                idCardNumber: info.id_num,
                                gender: info.sex,
                                birthday: info.birth,
                                nation: info.nation,
                                address: info.address
                              }
                            }
                            resLast.eventChannel.emit('didOpenPageFinish', data)
                          }
                        })
                      }
                    })
                  })
                //  console.log("图片base64：",base64)
                // base64 = base64.replace("data:image/png;base64,", "");
                // 身份证识别
              })
            }
          })
          // #endif
        },
        complete: (res) => {
          console.log('图片complete：', res)
          // #ifdef MP-ALIPAY

          // #endif
        }
      })
    },
    /**
     * 手动输入点击事件
     */
    handleInputClick() {
      // uni.navigateTo({
      //   url: "/pages/certificate/identity-info",
      //   success: (res) => {
      //     const data = {
      //       type: "input",
      //       info: {},
      //     };
      //     res.eventChannel.emit("didOpenPageFinish", data);
      //   },
      // });
      this.$refs.popup.close()
      uni.setStorageSync('typeChoice', 'input')
      uni.navigateTo({
        url: '/pages/certificate/identity-info',
        success: (res) => {
          const data = {
            type: 'input',
            realName: this.type === '3',
            info: {}
          }
          res.eventChannel.emit('didOpenPageFinish', data)
        }
      })
    },
    /**
     * 给外部调用的方法
     */
    open() {
      this.$refs.popup.open()
    }
  }
}
</script>

<style lang="scss" scoped>
.scan-or-input-popup {
  .popup {
    @include size(620, 540);
    position: relative;
    .button {
      @include size(556, 108);
      border-radius: 54rpx;
      border: 2rpx solid $color-primary;
      box-sizing: border-box;
      &__icon {
        @include square(48);
      }
      &__text {
        width: 220rpx;
      }
    }
    .close-icon {
      @include square(36);
      position: absolute;
      top: 24rpx;
      right: 32rpx;
    }
  }
  .canvas {
    position: absolute;
    z-index: -999;
    // top: 312rpx;

    opacity: 0;
  }
}
</style>
