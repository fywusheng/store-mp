//扫描身份证入口
<template>
  <view>
    <uni-popup ref="popup" type="center">
      <view class="popup">
        <image class="img-real" v-if="showImg"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/img-real-name.png"
          mode="scaleToFill" />
        <canvas class="canvas" canvas-id="canvas" id="canvas"></canvas>
        <view class="popup-top fs-40 mt-56">
          选择信息录入方式
        </view>
        <view class="popup-content flex-v flex-c-s mt-48">
          <view class="popup-button ocr-btn flex-h flex-c-c" @click="handleIdCode">
            <image class="ocr mr-20"
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-ocr.png"
              mode="scaleToFill" />
            <text>扫描身份证</text>
          </view>
          <view class="popup-button flex-h flex-c-c mb-48" @click="handleIdNumber">
            <image class="hand mr-20"
              src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-des.png"
              mode="scaleToFill" />
            <text>手动输入</text>
          </view>
        </view>
        <image class="close" @click="handleCloseHandle"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-close.png" mode="scaleToFill" />
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import api from '@/apis/index.js'
import { startFacialRecognitionVerify, getLessLimitSizeImage } from '@/utils/utils.js'
export default {
  components: { uniPopup },
  props: {
    // 导航栏透明度, 取值范围为 0 ~ 1, 默认为 0
    showImg: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      type: '',
      imgWidth: '',
      imgHeight: ''
    }
  },
  computed: {},
  methods: {
    //扫描身份
    handleIdCode() {
      uni.setStorageSync('typeChoice', 'scan')
      uni.chooseImage({
        sourceType: ['camera', 'album'],
        success: (res) => {
          const file = res.tempFilePaths[0]
          getLessLimitSizeImage('canvas', file, 0.2, 750, (imagePath) => {
            uni.getFileSystemManager().readFile({
              filePath: imagePath,
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
                    let info = resinfo.data
                    this.$refs.popup.close()
                    uni.navigateTo({
                      url: '/pages/certificate/identity-info',
                      success: (resLast) => {
                        const data = {
                          type: 'scan',
                          realName: this.type === '3' ? true : false,
                          info: {
                            name: info.name,
                            idCardNumber: info.id_num,
                            gender: info.sex,
                            birthday: info.birth,
                            nation: info.nation,
                            address: info.address,
                          },
                        }
                        resLast.eventChannel.emit('didOpenPageFinish', data)
                      },
                    })
                  },
                })
              },
              fail: (erro) => {
                console.log('---异常拿到---', erro)
              }
            })
          }, this)
        },
        complete: (res) => {
          console.log('图片complete：', res)
          //#ifdef MP-ALIPAY

          //#endif
        },
      })
    },
    //手动输入
    handleIdNumber() {
      this.$refs.popup.close()
      uni.setStorageSync('typeChoice', 'input')
      uni.navigateTo({
        url: '/pages/certificate/identity-info',
        success: (res) => {
          const data = {
            type: 'input',
            realName: this.type === '3' ? true : false,
            info: {},
          }
          res.eventChannel.emit('didOpenPageFinish', data)
        },
      })
    },
    //关闭弹框
    handleCloseHandle() {
      this.$refs.popup.close()
    },
    // 打开弹框
    open(type) {
      // type 流程类型
      // 0-需实名 1-需实名+领证 2-已实名，需领证
      uni.setStorageSync('process_type', type)
      console.log('流程type---', type)
      if (type == '2') {
        // 人脸识别
        this.handleNextStepClick()
      } else if (type == '3') {
        // 走实名认证
        this.$refs.popup.open()
        this.type = '3'
      } else {
        this.$refs.popup.open()
      }
    },
    //  人脸识别
    handleNextStepClick() {
      const userInfo = uni.getStorageSync('userInfo')
      this.params = {
        name: userInfo.psnName,
        idCardNumber: userInfo.idCard,
        gender: userInfo.gender,
        nation: userInfo.naty,
        birthday: userInfo.brdy,
        city: userInfo.uactAttributionName,
        address: userInfo.hsregAddr,
      }
      const params = {
        name: userInfo.psnName,
        idCard: userInfo.idCard,
        returnUrl: 'https://www.baidu.com'
      }
      params.success = (faceimg) => {
        console.log('认证成功------2', params)
        console.log("===factimg--", faceimg)
        api.realPersonAuthenticate({
          data: {
            userName: this.params.name,
            idCard: this.params.idCardNumber
          },
          success: async () => {
            this.getUserInfo()

            // #ifdef MP-ALIPAY
            const clearImage = await this.clearBgImg(faceimg)
            uni.setStorageSync('first-face-img', JSON.stringify(clearImage))
            // #endif

            const typeChoice = uni.getStorageSync('typeChoice')
            //#ifdef MP-WEIXIN 
            const info = {
              ...this.params,
              faceImg: '',
              type: typeChoice,
            }
            // #endif

            // #ifdef MP-ALIPAY
            const info = {
              ...this.params,
              faceImg: faceimg,
              type: typeChoice,
            }
            // #endif
            console.log('---去调用时的值222info---', info)
            console.log("===图片--", faceimg)
            uni.navigateTo({
              url: '/pages/certificate/avatar-confirm',
              success: (res) => {
                console.log("----要传递的值---", info)
                res.eventChannel.emit('didOpenPageFinish', info)
              },
            })
          },
        })
      }

      // 开启人脸识别
      startFacialRecognitionVerify(params)
      // 调用活体检测, 各平台自带的或者大数据提供的, 成功后跳转到头像确认页面
      uni.setStorageSync('applicantInfo', this.params)
    },
    /**
     * 获取用户信息
     */
    getUserInfo() {
      api.getUserInfo({
        data: {
          accessToken: uni.getStorageSync('token'),
        },
        success: (data) => {
          uni.$emit('didLogin', data)
        },
      })
    },
    // 去背景图片
    clearBgImg(photoBase64) {
      return new Promise((resolve, reject) => {
        api.clearBg({
          data: { photoBase64 },
          showsLoading: true,
          success: (resInfo) => {
            // 保存第一次人脸识别图片
            resolve(resInfo)
            console.log('===图片报错成功')
            // uni.setStorageSync('first-face-img', JSON.stringify(resInfo));
          },
          fail: (erro) => {
            reject(erro)
          },
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.popup {
  width: 620rpx;
  height: auto;
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
    // z-index: -999;
    width: 750px;
    height: 750px;
    left: 0;
    top: -10000px;
    // top: 312rpx;
    background: red;
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
