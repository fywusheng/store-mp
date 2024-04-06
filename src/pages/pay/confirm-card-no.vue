<template>
  <view class="confirm-card-no">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <view class="back-icon"></view>
          <text class="navigation-bar__title fs-44 c-black flex-1">确认卡号</text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <image
            class="back-icon"
            @click="handleNavBack"
            src="http://192.168.1.187:10088/static/supermarket/icon-arrow-left.png"
            mode="scaleToFill"
          />

          <text class="navigation-bar__title fs-44 c-black flex-1">确认卡号</text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />

    <view class="page-header mt-16">
      <!-- #ifdef MP-ALIPAY -->
      <canvas class="canvas" id="canvas"></canvas>
      <!-- #endif -->
      <image class="img-result" :src="'data:image/jpg;base64,' + scanInfo.img" />
      <view class="title">
        {{ scanInfo.vertifyFlag ? '识别成功，请核对卡号' : '识别失败，请重新拍照' }}
      </view>
      <view class="input-item">
        <view class="label">银行卡号</view>
        <view class="input-warpper">
          <input
            class="input"
            type="text"
            :adjust-position="false"
            :focus="focus"
            placeholder-class="placeholder"
            maxlength="23"
            v-model="preCardNo"
            @input="handleChange"
          />
          <image
            v-if="scanInfo.bankCardNum.length"
            class="icon-delete"
            :src="icon.delete"
            @click="handleDel"
          />
        </view>
      </view>
    </view>
    <view class="page-footer">
      <button class="btn btn-default" @click="handleRePhone">重新拍照</button>
      <button
        class="btn btn-warning"
        @click="confirmCard"
        :disabled="!enabledNext"
        :style="{ opacity: enabledNext ? 1 : 0.5 }"
      >
        确认卡号
      </button>
    </view>

    <canvas class="canvas" id="press-canvas" canvas-id="press-canvas" />
  </view>
</template>

<script>
  import NavigationBar from '@/components/common/navigation-bar.vue';
  import api from '@/apis/index.js';
  import { getLessLimitSizeImage, debounce } from '@/utils/utils.js';
  export default {
    components: { NavigationBar },
    data() {
      return {
        // 识别结果
        scanInfo: {
          img: '',
          vertifyFlag: '',
          bankCardNum: '',
        },
        preCardNo: '',
        imgHeight: '',
        imgWidth: '',
        focus: false,
        // iconPath
        icon: {
          delete: 'http://192.168.1.187:10088/static/pay/icon-input-delete.png',
        },
        // 导航栏高度
        // #ifdef MP-WEIXIN
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
        // #endif
        // #ifdef MP-ALIPAY
        navigationBarHeight:
          uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
        // #endif
        // 状态栏高度
        statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
      };
    },
    computed: {
      enabledNext() {
        return this.scanInfo.bankCardNum.length > 12;
      },
    },
    onLoad(e) {
      this.scanInfo = JSON.parse(decodeURIComponent(e.cardInfo));
      this.preCardNo = this.scanInfo.bankCardNum
        .replace(/\s/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ');
      this.scanInfo.img = uni.getStorageSync('add_card_base64_img');
    },
    methods: {
      handleChange: debounce(function (e) {
        this.preCardNo = e.target.value
          .replace(/[^\d]/g, '')
          .replace(/\s/g, '')
          .replace(/(\d{4})(?=\d)/g, '$1 ');
        this.scanInfo.bankCardNum = this.preCardNo.replace(/\s*/g, '');
      }, 200),
      // 返回上一页
      handleNavBack() {
        uni.navigateBack();
      },
      // 返回首页
      handleHomeBack() {
        uni.reLaunch({
          url: '/pages/index/index',
        });
      },
      // 清空卡号
      handleDel() {
        this.preCardNo = '';
        this.scanInfo.bankCardNum = '';
        this.focus = true;
      },
      // 重新拍照
      handleRePhone() {
        uni.chooseImage({
          sourceType: ['camera', 'album'],
          success: (res) => {
            const file = res.tempFilePaths[0];
            getLessLimitSizeImage(
              'press-canvas',
              file,
              0.1,
              750,
              (imagePath) => {
                console.log(imagePath);
                uni.getFileSystemManager().readFile({
                  filePath: imagePath,
                  encoding: 'base64',
                  success: (rs) => {
                    this.getBankInfoByImg(rs.data);
                    console.log('---图片---', rs.data);
                  },
                  fail: (erro) => {
                    console.log('---异常拿到---', erro);
                  },
                });
              },
              this,
            );
          },
        });
      },
      getBankInfoByImg(image64) {
        uni.showLoading({ title: '识别中' });
        api.getBankCardInfoByImage({
          data: { image64: image64 },
          success: (resinfo) => {
            uni.hideLoading();
            if (!resinfo.vertifyFlag) {
              this.$uni.showToast('识别失败，请重新拍照');
              return;
            }
            this.scanInfo.img = image64;
            this.scanInfo.vertifyFlag = resinfo.vertifyFlag;
            this.scanInfo.bankCardNum = resinfo.bankCardNum;
            this.preCardNo = resinfo.bankCardNum
              .replace(/[^\d]/g, '')
              .replace(/\s/g, '')
              .replace(/(\d{4})(?=\d)/g, '$1 ');
          },
          fail: (res) => {
            uni.hideLoading();
            console.log(res);
          },
        });
      },
      // 确认卡号
      confirmCard() {
        const no = this.scanInfo.bankCardNum;
        if (no.length === 13) {
          this.$uni.showToast('银行卡号格式错误!');
          return false;
        }
        if (no.length > 13) {
          // 校验业务
          api.getBankByCardByNo({
            data: { bankCardNum: this.scanInfo.bankCardNum },
            showsLoading: true,
            success: (res) => {
              if (!res) {
                this.$uni.showToast('【该银行卡不支持本业务请换银行卡试试!】');
                return false;
              }
              res.realBankCardNum = this.scanInfo.bankCardNum;
              console.log('进入跳转！！！');
              uni.navigateTo({
                url: `/pages/pay/open-online-pay?cardInfo=${encodeURIComponent(
                  JSON.stringify(res),
                )}`,
                fail: function (error) {
                  console.log('无法跳转-----', error);
                },
              });
            },
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .canvas {
    position: absolute;
    top: -10000px;
    left: 0;
    width: 750px;
    height: 750px;
    opacity: 0;
  }
  .confirm-card-no {
    // 头部
    .navigation-bar {
      box-sizing: border-box;
      padding-left: 24rpx;
      width: 100vw;
      height: 100%;
      .back-icon {
        flex-shrink: 0;
        width: 44rpx;
        height: 44rpx;
        margin-right: 48rpx;
        position: relative;
        z-index: 10;
      }
      .icon-desc {
        flex-shrink: 0;
        width: 40rpx;
        height: 40rpx;
        margin-right: 12rpx;
        position: relative;
        z-index: 10;
      }
      .desc {
        color: #666666;
      }
      .navigation-bar__title {
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
      }
    }
    .page-header {
      width: 100vw;
      position: relative;
      padding: 0 48rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .img-result {
        width: 668rpx;
        height: 362rpx;
        border-radius: 16rpx;
      }
      .title {
        color: #333333;
        font-size: 40rpx;
        font-weight: 500;
        margin: 64rpx 0 32rpx 0;
      }
      .input-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 82rpx;
        width: 100%;
        .label {
          width: 176rpx;
        }
        .input-warpper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          border-bottom: 0.02rem solid #eeeeee;
          .input {
            width: 100%;
            height: 100%;
            font-size: 36rpx;
            background: none;
          }
          .icon-delete {
            width: 32rpx;
            height: 32rpx;
          }
        }
      }
    }
    .page-footer {
      margin-top: 62rpx;
      padding: 0 32rpx;
      display: flex;
      justify-content: space-between;
      .btn {
        width: 328rpx;
        height: 108rpx;
        line-height: 108rpx;
        border: 2rpx solid #dcdee0;
        border-radius: 54rpx;
        font-size: 44rpx;
        font-weight: 500;
        &-default {
          border: 2rpx solid #dcdee0;
          color: #333333;
        }
        &-warning {
          border: 2rpx solid #eb3030;
          color: #eb3030;
        }
      }
    }
  }
</style>
