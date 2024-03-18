<template>
  <view class="licence">
    <!-- <div class="card-wrapper" @click="handleClick(1)"> -->
    <div class="card-wrapper" @click="showMemberCard">
      <image class="img" :src="icon.memberCard" mode="scaleToFill" />
      <!-- <view class="opreate">添加并使用</view> -->
    </div>
    <certificates-card></certificates-card>
    <!-- <image class="img" :src="icon.old" mode="scaleToFill" /> -->
    <!-- <view class="opreate">立即领取</view> -->
    <!-- </div> -->
    <div class="card-wrapper" @click="handleClick(2)">
      <image class="img" :src="icon.electronic" mode="scaleToFill" />
      <!-- <view class="opreate">添加并使用</view> -->
    </div>
    <div class="card-wrapper" @click="handleClick(3)">
      <image class="img" :src="icon.insuranceCard" mode="scaleToFill" />
      <!-- <view class="opreate">添加并使用</view> -->
    </div>
    <div class="card-wrapper" @click="handleClick(4)">
      <image class="img" :src="icon.healthy" mode="scaleToFill" />
      <!-- <view class="opreate">添加并使用</view> -->
    </div>

    <modal-know ref="noticeModal" />

    <!-- 实名认证 -->
    <real-name-pop ref="realpop" @succFlag="succFlag" />

    <!-- 会员卡弹窗 -->
    <view>
      <uni-popup ref="memberCardPopup" background="none">
        <view class="member-content">
          <view class="content" @click="getPoint">
            <image
              class="get-point-bg"
              src="https://ggllstatic.hpgjzlinfo.com/static/home/member-card-bg.png"
              mode="scaleToFill"
            />
            <view class="info">持卡人：{{ name }} &nbsp; &nbsp;&nbsp;&nbsp;年龄：{{ age }}</view>
            <view class="footer">
              <text class="label">NO.</text>
              <text class="">{{ code }}</text>
            </view>
          </view>

          <image
            class="save-btn"
            @click="extraImage"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/save-btn.png"
            mode="scaleToFill"
          />

          <image
            class="icon-close"
            @click="memberCardPopclose"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-close.png"
            mode="scaleToFill"
          />
          <view class="line"></view>
        </view>
      </uni-popup>
    </view>
    <view
      class="share-page-box"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    >
      <wxml-to-canvas class="widget" :width="canvasWidth" :height="canvasHeight"></wxml-to-canvas>
    </view>
  </view>
</template>

<script>
  import ModalKnow from '@/pages/user-center/common/modal-know.vue';
  import CertificatesCard from './common/certificates-card.vue';
  import { desensitizeName } from '@/utils/desensitization.js';
  const { wxml, style } = require('@/utils/DomData.js');
  export default {
    components: { ModalKnow, CertificatesCard },
    data() {
      return {
        icon: {
          // 会员权益卡
          memberCard: 'https://ggllstatic.hpgjzlinfo.com/static/user-center/card-member.png',
          // 老年卡
          old: 'https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-old-card-new.png',
          // 电子凭证
          electronic:
            'https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-electronic-card-new.png',
          // 医保卡
          insuranceCard:
            'https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-insurance-card-new.png',
          // 健康码
          healthy: 'https://ggllstatic.hpgjzlinfo.com/static/user-center/icon-healthy-card-new.png',
        },
        userInfo: {},
        succFlag: false,
        // 生成图片
        canvasWidth: 632 / 2, // 默认canvas宽高
        canvasHeight: 345 / 2,
        screenWidth: null, // 设备宽度
        name: '',
        age: '',
        code: '',
        widget: null,
        msg: '加载中，请稍等...', // 提示语
      };
    },

    methods: {
      memberCardPopclose() {
        this.$refs.memberCardPopup.close();
      },
      memberPopclose() {
        this.$refs.memberPopup.close();
      },
      showMemberCard() {
        this.userInfo = uni.getStorageSync('userInfo');
        // 未登录, 跳转到登录页面
        if (!uni.getStorageSync('token')) {
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }

        // 未实名
        if (this.userInfo.crtfStas === '0') {
          this.$refs.realpop.open(1);
          return;
        }

        // 已实名但小于60周岁
        if (this.userInfo.age < 50) {
          this.$uni.showToast('抱歉，您未满50周岁，无法使用会员权益卡');
          return;
        }

        setTimeout(() => {
          this.renderImgFile();
        }, 1000);
        this.$refs.memberCardPopup.open();
      },
      // 生成图片并保存
      renderImgFile() {
        this.name = desensitizeName(this.userInfo.psnName);
        this.age = this.userInfo.age;
        this.code = this.userInfo.authCode;

        // 获取设备信息
        wx.getSystemInfo({
          success: (res) => {
            this.screenWidth = res.screenWidth;
            // this.canvasWidth = this.screenWidth * 0.9;
            // this.canvasHeight = this.screenWidth * 1.1;
            console.log('screenWidth', this.screenWidth);

            this.show = true;
            // 数字容器宽度 动态设置
            setTimeout(() => {
              // wx.showLoading({ title: '图片生成中...' });
              this.widget = this.selectComponent('.widget');
              this.renderToCanvas();
            }, 1000);
          },
        });
      },
      // wxml 转 canvas
      renderToCanvas() {
        console.log('this.widget', this.widget);
        const _wxml = wxml(this.name, this.age, this.code);
        const _style = style(this.screenWidth, this.canvasWidth, this.canvasHeight);
        const p1 = this.widget.renderToCanvas({ wxml: _wxml, style: _style });
        p1.then((res) => {
          console.log('图片生成成功');
          wx.hideLoading();
          // this.container = res
        }).catch((err) => {
          console.log('生成失败');
        });
      },
      // 保存到朋友圈
      extraImage() {
        debugger;
        console.log('12312');
        if (!this.show) {
          wx.showToast({ title: '海报生成失败，无法分享到朋友圈', icon: 'none' });
          return;
        }
        const p2 = this.widget.canvasToTempFilePath();
        let that = this;
        p2.then((result) => {
          let path = result.tempFilePath;
          wx.getSetting({
            success: (res) => {
              // 非初始化且未授权的情况，需要再次弹窗提示授权
              if (
                res.authSetting['scope.writePhotosAlbum'] != undefined &&
                res.authSetting['scope.writePhotosAlbum'] != true
              ) {
                wx.showModal({
                  title: '是否授权相册权限',
                  content: '需要获取相册权限，请确认授权，否则无法使用相关功能',
                  success: (res) => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (dataAu) => {
                          if (dataAu.authSetting['scope.writePhotosAlbum'] == true) {
                            wx.showToast({
                              title: '授权成功',
                              icon: 'none',
                              duration: 1000,
                            });
                            that.saveIMg(path);
                          } else {
                            wx.showToast({
                              title: '授权失败',
                              icon: 'success',
                              duration: 1000,
                            });
                          }
                        },
                      });
                    }
                  },
                });
              } else {
                // 初始化且未授权，系统默认会弹窗提示授权
                // 非初始化且已授权，也会进入这里
                that.saveIMg(path);
              }
            },
          });
        });
      },
      // 保存到相册
      async saveIMg(tempFilePath) {
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: async (res) => {
            this.$uni.showToast('图片已保存');
          },

          fail: function (res) {
            wx.showToast({
              title: '您取消了授权',
              icon: 'none',
              duration: 2000,
            });
          },
        });
      },
      async succFlag(flag) {
        if (flag == 1) {
          const userinfor = await this.getUserInfo();
          uni.setStorageSync('userInfo', userinfor);
          this.userInfo = userinfor;
          this.$refs.realpop.close();
          uni.navigateTo({
            url: `/pages/user-center/real-name-result2?back=${'/pages/user-center/licence'}`,
          });
        }
      },
      /**
       * 获取用户信息
       */
      getUserInfo() {
        return new Promise((resolve, reject) => {
          api.getUserInfo({
            data: {
              accessToken: uni.getStorageSync('token'),
            },
            success: (data) => {
              resolve(data);
            },
            fail: (error) => {
              reject(error);
            },
          });
        });
      },
      handleShowCardClick() {
        this.$refs.memberCardPopup.open();
      },
      handleClick() {
        //    this.$refs.noticeModal.open();
        // https://api.hpgjzlinfo.com/nepsp-api/nun/api/family/removeFamily
        this.$uni.showToast({
          title: '当前所在地区功能开通中',
          duration: 2000,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .licence {
    width: 100%;
    // height: 100vh;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    .share-page-box {
      position: absolute;
      top: 0;
      left: 10000px;
    }

    .member-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 667rpx;
      position: relative;
      .content {
        width: 632rpx;
        height: 346rpx;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: red;

        .info {
          position: absolute;
          top: 197rpx;
          right: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 24rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #62291b;
          line-height: 33rpx;
          .txt {
            margin-right: 42rpx;
          }
        }
        .footer {
          position: absolute;
          bottom: 23rpx;
          right: 30rpx;
          font-size: 24rpx;
          font-family: DingTalk, DingTalk;
          font-weight: normal;
          color: #a63117;
          line-height: 29rpx;
          .label {
            font-weight: bold;
          }
        }
        .title {
          font-size: 50rpx;
          font-weight: 500;
          margin-top: 40rpx;
          margin-bottom: 32rpx;
        }
        .cont {
          font-size: 36rpx;
        }
        .get-point-bg {
          position: absolute;
          left: 0;
          top: 0;
          width: 632rpx;
          height: 346rpx;
          z-index: -1;
        }
        .card-btn {
          position: absolute;
          left: 72rpx;
          bottom: 42rpx;
          width: 460rpx;
          height: 96rpx;
          z-index: -1;
        }
      }

      .icon-close {
        position: absolute;
        bottom: 0;
        right: 0rpx;
        width: 56rpx;
        height: 56rpx;
      }
      .line {
        position: absolute;
        bottom: 56rpx;
        right: 28rpx;
        width: 2rpx;
        height: 271rpx;
        background: #ffffff;
      }
      .save-btn {
        width: 460rpx;
        height: 88rpx;
        margin-top: 57rpx;
      }
    }
    // padding-top: 120rpx;
    .card-wrapper {
      width: 686rpx;
      height: 306rpx;
      border-radius: 16rpx;
      margin-bottom: 48rpx;
      .img {
        width: 100%;
        height: 100%;
      }
      // .opreate {
      //     position: absolute;
      //     bottom: 0;
      //     left: 0;

      // }
    }
  }
</style>
