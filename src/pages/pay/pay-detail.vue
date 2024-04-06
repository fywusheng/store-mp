<template>
  <view class="pay-detail">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <view class="back-icon"></view>
          <image
            class="icon-desc"
            @click="handleHomeBack"
            src="http://192.168.1.187:10088/static/supermarket/icon-index.png"
            mode="scaleToFill"
          />

          <text class="navigation-bar__title fs-44 c-black flex-1">支付详情</text>
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
          <image
            class="icon-desc"
            @click="handleHomeBack"
            src="http://192.168.1.187:10088/static/supermarket/icon-index.png"
            mode="scaleToFill"
          />

          <text class="navigation-bar__title fs-44 c-black flex-1">支付详情</text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />

    <view class="page-header mt-16">
      <view class="account-info">
        <view class="text">订单应付金额</view>
        <view class="order-account">¥{{ formData.payAmount | formaterMoney }}</view>
      </view>
      <view class="order-info">
        <view class="list-item">
          <view class="label">收款商户</view>
          <view class="content">{{ formData.supermarketName }}</view>
        </view>
        <view class="list-item">
          <view class="label">订单编号</view>
          <view class="content">{{ formData.orderId }}</view>
        </view>
        <view class="list-item">
          <view class="label">支付方式</view>
          <view class="content" @click="handlePayWayPop">
            <image class="icon-back" :src="payCardInfo.bankIcon" />
            <view>{{ payCardInfo.bankName }}({{ payCardInfo.encryptCardNum }})</view>
            <image class="icon-arrow" :src="icon.arrow" />
          </view>
        </view>
        <view class="list-item b-t valid-code">
          <view class="label">验证码</view>
          <view class="content">
            <input
              type="number"
              :adjust-position="false"
              maxlength="6"
              placeholder="请输入验证码"
              class="input-code f-s-36"
              v-model="validCode"
            />

            <button class="btn-code" @click="sendCode" hover-class="none" :disabled="enableSend">
              {{ codeTxt }}
            </button>
          </view>
        </view>
      </view>
    </view>

    <view class="btn-box">
      <button class="agree-button fs-44 fw-bold c-white" @click="handleAgreeClick">立即支付</button>
    </view>

    <pay-way-list
      ref="payWayPop"
      :list="bankList"
      :selectIndex="selectIndex"
      @select="handleSelect"
    />

    <modal
      ref="tipModal"
      cancelText="继续支付"
      confirmText="放弃"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    >
      <view slot="text">
        <view class="confirm-main">
          <view class="content">您是否放弃本次支付？</view>
        </view>
      </view>
    </modal>

    <modal ref="codeModal" cancelText=" " confirmText="知道了" @confirm="handlKnow">
      <view slot="text">
        <view class="confirm-main">
          <view class="content">{{ errorMsg }}</view>
        </view>
      </view>
    </modal>
  </view>
</template>

<script>
  import NavigationBar from '@/components/common/navigation-bar.vue';
  import PayWayList from './components/pay-way-list.vue';
  import Modal from '@/components/common/modal.vue';
  import api from '@/apis/index.js';
  export default {
    components: { NavigationBar, PayWayList, Modal },
    data() {
      return {
        // 商店信息
        icon: {
          arrow: 'http://192.168.1.187:10088/static/home/arrow.png',
        },
        errorMsg: '',
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
        codeTxt: '发送验证码',
        validCode: '',
        enableSend: false,
        bankList: [],
        selectIndex: 0,
        payCardInfo: {},
        formData: {},
      };
    },
    onLoad(e) {
      this.formData = JSON.parse(decodeURIComponent(e.info));
      this.getBankList();
    },
    onShow() {},
    methods: {
      // 银行列表
      getBankList() {
        api.getBankList({
          data: {},
          success: (res) => {
            this.bankList = res;
            this.payCardInfo = this.bankList[0];
          },
        });
      },
      handleSelect(index) {
        this.selectIndex = index;
        this.payCardInfo = this.bankList[index];
      },
      // 返回收银台
      handleNavBack() {
        if (this.formData.orderSource === 0) {
          //保留之前优惠买单逻辑
          uni.navigateTo({
            url: '/pagas/supermarket/index',
          });
        } else {
          const url = `${ENV.H5}/#/checkstand?cashId=` + this.formData.cashId;
          uni.navigateTo({
            url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
          });
        }

        // api.getPayCodePage({
        //   data: {supermarketId: this.formData.supermarketId},
        //   success: data => {
        //     uni.navigateTo({
        //        url: '/pages/pay/show-pay-code?url=' + encodeURIComponent(data.result)
        //     });
        //   }
        // })
      },
      // 返回首页
      handleHomeBack() {
        this.$refs.tipModal.open();
      },
      // 发送验证码
      sendCode() {
        api.sendSmsOnPay({
          showsLoading: true,
          data: {
            bankCardRecordId: this.payCardInfo.recordId,
            orderNo: this.formData.orderId,
            orderAmount: this.formData.payAmount,
          },
          success: (res) => {
            this.$uni.showToast('验证码短信已发送');
            this.enableSend = true;
            this.startTimer();
            this.requestId = res;
          },
        });
      },
      startTimer() {
        this.startTime = 15;
        this.timer = setInterval(() => {
          this.codeTxt = this.startTime + 's重发';
          if (this.startTime === 0) {
            this.codeTxt = '发送验证码';
            this.enableSend = false;
            clearInterval(this.timer);
            return;
          }
          this.startTime--;
        }, 1000);
      },
      handlePayWayPop() {
        this.$refs.payWayPop.open();
      },
      handlKnow() {
        this.$refs.codeModal.close();
      },
      // 放弃
      handleConfirm() {
        if (this.formData.orderSource === 0) {
          uni.reLaunch({
            url: '/pages/index/index',
          });
        } else {
          //全部订单  其余类型
          uni.reLaunch({
            url: '/pages/index/index?index=3',
          });
        }
      },
      // 继续支付
      handleCancel() {
        this.$refs.tipModal.close();
      },
      // 立即支付
      handleAgreeClick() {
        api.confirmPay({
          data: {
            requestId: this.requestId,
            smsCode: this.validCode,
            orderAmount: this.formData.payAmount,
            productName: this.formData.supermarketName,
            orderNo: this.formData.orderId,
          },
          success: (res) => {
            switch (res) {
              case 'SUCCESS':
                this.formData.type = 0;
                uni.navigateTo({
                  url:
                    '/pages/pay/pay-result?payInfo=' +
                    encodeURIComponent(JSON.stringify(this.formData)),
                });
                break;
              case 'PROCESS':
                uni.navigateTo({
                  url: '/pages/pay/error-tip',
                });
                break;
              case 'FAILURE':
                this.formData.type = 1;
                uni.navigateTo({
                  url:
                    '/pages/pay/pay-result?payInfo=' +
                    encodeURIComponent(JSON.stringify(this.formData)),
                });
                break;
              default:
                break;
            }
          },
          fail: (res) => {
            this.errorMsg = res.message;
            this.$refs.codeModal.open();
          },
        });
      },
    },
    filters: {
      formaterMoney(v) {
        return (v / 100).toFixed(2);
      },
    },
  };
</script>

<style lang="scss" scoped>
  //modal弹框
  .confirm-main {
    width: 552rpx;
    margin: 0 auto;
    height: 180rpx;
    text-align: center;
    font-size: 40rpx;
    line-height: 180rpx;
    .wen {
      color: #ff5500;
    }
  }
  .pay-detail {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
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
      padding: 0 30rpx;
      box-sizing: border-box;
      .account-info {
        width: 100%;
        height: 288rpx;
        display: flex;
        justify-content: center;
        flex-direction: column;
        .text {
          text-align: center;
          font-size: 36rpx;
          color: #666666;
        }
        .order-account {
          text-align: center;
          font-size: 64rpx;
          color: #333333;
          margin-top: 24rpx;
        }
      }
      .order-info {
        margin-top: 32rpx;
        background: #ffffff;
        box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
        padding: 24rpx 20rpx;
        box-sizing: border-box;
        border-radius: 16rpx;
        .list-item {
          width: 100%;
          display: flex;
          align-items: center;
          font-size: 36rpx;
          color: #333333;
          margin-bottom: 32rpx;
          .label {
            width: 176rpx;
            color: #999999;
          }
          &.valid-code {
            padding: 16rpx 0;
            padding-bottom: 0;
            margin-bottom: 0;
          }
          .content {
            display: flex;
            // justify-content: space-between;
            align-items: center;
            flex: 1;
            word-break: break-all;
            .input-code {
              background: transparent;
            }
            .icon-back {
              width: 44rpx;
              height: 48rpx;
              margin-right: 18rpx;
            }
            .icon-arrow {
              width: 15rpx;
              height: 27rpx;
              margin-left: auto;
            }
            .btn-code {
              white-space: nowrap;
              color: #0059ff;
              cursor: pointer;
              // width: 220rpx;
              flex: none;
              :active {
                background: none;
              }
            }
          }
        }
      }
    }
    .btn-box {
      // position: fixed;
      // bottom: 0;
      // left: 0;
      width: 100vw;
      height: 152rpx;
      padding: 80rpx 0;
      box-sizing: border-box;
      // background-color: #fff;
      // box-shadow: 0px -2px 0px 0px #eeeeee;
      .agree-button {
        width: 686rpx;
        height: 108rpx;
        line-height: 108rpx;
        background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
        border-radius: 54rpx;
        margin: 0 auto;
      }
    }
    .b-t {
      border-top: 2rpx solid #eeeeee;
    }
    .b-b {
      border-bottom: 2rpx solid #eeeeee;
    }
    .p-32 {
      //   padding: 32rpx 0;
    }
  }
</style>
