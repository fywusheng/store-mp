<template>
  <view class="card-detail">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <text class="navigation-bar__title fs-44 c-black flex-1">{{ title }}</text>
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
          <text class="navigation-bar__title fs-44 c-black flex-1">{{ title }}</text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />

    <view class="page-header mt-16">
      <view class="bank-card" :style="{ background: cardInfo.cardColor }">
        <image class="icon-bank-circle" :src="icon.bank" />
        <view class="icon-unbind-tap" @click="openBind">
          <image class="icon-unbind" :src="icon.unBind" />
        </view>
        <view class="bank-name">
          <view class="icon-wrapper">
            <image class="icon-bank" :src="cardInfo.bankIcon" />
          </view>

          <view class="bank-txt">{{ cardInfo.bankName }}</view>
        </view>
        <view class="bank-no">{{ cardInfo.bankCardNum | formatBankNum }}</view>
      </view>

      <view class="line mb-32"></view>
      <view class="static-input">
        <view class="label">银行卡单笔限额</view>
        <view class="money">¥{{ cardInfo.singleLimit || '--' }}</view>
      </view>
      <view class="static-input">
        <view class="label">银行卡每日限额</view>
        <view class="money">¥{{ cardInfo.dailyLimit || '--' }}</view>
      </view>
      <view class="line"></view>
    </view>

    <!--人脸识别未通过提示 -->
    <modal
      ref="tipModal"
      cancelText="稍后再说"
      confirmText="再试一次"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    >
      <view slot="text">
        <view class="confirm-main" style="height: auto; line-height: 1.5">
          <view class="content">您没有通过人像认证</view>
        </view>
      </view>
    </modal>
    <uni-popup class="popup" ref="popup" type="bottom" :mask-click="true">
      <view class="share-pop">
        <view @click="handleUnBind" class="cancle bg-white flex-h flex-c-c _line _padding">
          解绑银行卡
        </view>
        <view @click="handleCloseClick" class="cancle bg-white flex-h flex-c-c _line">取消</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import NavigationBar from '@/components/common/navigation-bar.vue';
  import Modal from '@/components/common/modal.vue';
  import api from '@/apis/index.js';
  import { startFacialRecognitionVerify, getBankBg } from '@/utils/utils.js';
  export default {
    components: { NavigationBar, Modal },
    data() {
      return {
        isClick: true,
        timer: '',
        title: '我的银行卡',
        // iconPath
        checked: true,
        cardInfo: {},
        icon: {
          bank: 'http://192.168.1.187:10088/static/pay/icon-bank-pattern.png',
          // bank: 'http://192.168.1.187:10088/static/pay/icon-bank-bg-circle.png',
          unBind: 'http://192.168.1.187:10088/static/pay/icon-unbind.png',
        },
        // 导航栏高度
        //#ifdef MP-WEIXIN
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
        //#endif
        //#ifdef MP-ALIPAY
        navigationBarHeight:
          uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
        //#endif
        // 状态栏高度
        statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
      };
    },
    onLoad(e) {
      console.log(e);
      this.recordId = e.recordId;
      this.userInfo = uni.getStorageSync('userInfo');
      this.getCardDetail(this.recordId);
    },
    onShow() {},
    destroyed() {
      clearTimeout(this.timer);
    },
    methods: {
      openBind() {
        this.$refs.popup.open();
      },
      handleCloseClick() {
        this.$refs.popup.close();
      },
      // 获取银行卡背景
      getBankBg(name) {
        return getBankBg(name);
      },
      // 获取银行卡详情
      getCardDetail(recordId) {
        api.getBankCardDetail({
          data: { recordId },
          success: (res) => {
            this.cardInfo = res;
          },
        });
      },
      // 解绑银行卡
      handleUnBind() {
        if (this.isClick) {
          this.isClick = false;
          // 开启人脸识别
          startFacialRecognitionVerify({
            name: this.userInfo.psnName,
            idCard: this.userInfo.idCard,
            returnUrl: '/pages/certificate/avatar-confirm', // 认证成功返回页面
            success: () => {
              api.deleteBankCard({
                data: { recordId: this.recordId },
                success: (res) => {
                  if (res) {
                    this.$uni.showToast('解绑成功');
                    setTimeout(() => {
                      uni.reLaunch({
                        url: '/pages/pay/my-bank-card',
                      });
                    }, 1500);
                  }
                },
              });
            },
            fail: () => {
              this.$refs.tipModal.open();
            },
          });
          this.timer = setTimeout(() => {
            this.isClick = true;
          }, 3000);
        }
      },
      // 稍后再说
      handleCancel() {
        uni.navigateTo({
          url: '/pages/pay/my-bank-card',
        });
      },
      // 再试一次
      handleConfirm() {
        this.handleUnBind();
      },
      // 返回上一页
      handleNavBack() {
        // this.$refs.tipModal.open()
        uni.navigateBack();
      },
      // 返回首页
      handleHomeBack() {
        uni.reLaunch({
          url: '/pages/index/index',
        });
      },
    },
    filters: {
      formatBankNum(bankNum) {
        if (!bankNum) return '';
        let val = bankNum;
        let front = 4;
        let back = 4;
        let placeholder = 8;
        const length = val.length;
        placeholder = placeholder || length - front - back;

        if (length > front + back) {
          const frontVal = val.slice(0, front);
          const backVal = back ? val.slice(-back) : '';
          return frontVal + ' ' + '*'.repeat(placeholder) + ' ' + backVal;
        }

        return val;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .share-pop {
    background-color: #f2f2f2;
    ._padding {
      padding-top: 10rpx;
    }
    ._line {
      height: 78rpx;
      margin-bottom: 8rpx;
    }
  }
  //modal弹框
  .confirm-main {
    width: 552rpx;
    margin: 0 auto;
    height: 180rpx;
    text-align: left;
    font-size: 40rpx;
    line-height: 180rpx;
    .wen {
      color: #ff5500;
    }
  }
  .card-detail {
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
        // width: 40rpx;
        // height: 40rpx;
        margin-left: 24rpx;
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
      .navigation-bar__complete {
        position: absolute;
        right: 36rpx;
      }
    }
    .page-header {
      width: 100vw;
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .img-warpper {
        display: flex;
        justify-content: center;
        text-align: center;
        height: 132rpx;
        font-size: 32rpx;
        color: #323233;
        background: #e8effa;
        padding: 20rpx 32rpx;
        box-sizing: border-box;
        .icon-circle {
          margin-right: 16rpx;
          width: 66rpx;
          height: 36rpx;
        }
      }
      .bank-card {
        width: 686rpx;
        height: 200rpx;
        box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
        border-radius: 16rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        position: relative;
        .icon-bank-circle {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        .icon-unbind-tap {
          position: absolute;
          top: 0;
          right: 32rpx;
          z-index: 1000;
          height: 42rpx;
          width: 42rpx;
          .icon-unbind {
            width: 42rpx;
            height: 10rpx;
          }
        }
        .bank-name {
          display: flex;
          align-items: center;
          margin: 32rpx 0 32rpx 36rpx;
          font-size: 40rpx;
          color: #ffffff;
          font-weight: 500;
          z-index: 12;
          .icon-wrapper {
            width: 60rpx;
            height: 60rpx;
            border-radius: 30rpx;
            margin-right: 12rpx;
            background: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon-bank {
              width: 48rpx;
              height: 48rpx;
            }
          }
        }
        .bank-no {
          text-align: center;
          font-size: 40rpx;
          color: #ffffff;
          z-index: 12;
        }
      }
      .static-input {
        flex: 1;
        width: calc(100% - 64rpx);
        margin: 0 auto 32rpx;
        font-size: 36rpx;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
      }
      .line {
        height: 2rpx;
        border-bottom: 2rpx solid #eeeeee;
        width: calc(100% - 64rpx);
      }
    }
  }
</style>
