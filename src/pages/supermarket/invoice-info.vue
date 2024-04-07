<template>
  <view class="pages" :style="{ paddingBottom: info.status == '1' ? '180rpx' : '' }">
    <view class="item pay-info br-16">
      <view class="title flex-h flex-c-b pr-24">
        <view>电子发票</view>
        <!-- <view class="status orange">开票中</view> -->
        <view class="status green">已开票</view>
      </view>
      <view class="content">
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">申请时间</view>
          <view class="msg-right">{{ info.applicationTime | dateFilter }}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">开票时间</view>
          <view class="msg-right">{{ info.billingTime | dateFilter }}</view>
        </view>
      </view>
    </view>
    <view class="item pay-info br-16">
      <view class="title">开票信息</view>
      <view class="content">
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">发票类型</view>
          <view class="msg-right" v-if="info.typeName">{{ info.typeName }}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">发票抬头</view>
          <view class="msg-right" v-if="info.invoiceHeaderName">{{ info.invoiceHeaderName }}</view>
        </view>
        <view class="msg-item flex-h fs-36" v-if="info.typeName !== '个人'">
          <view class="msg-left">发票税号</view>
          <view class="msg-right" v-if="info.taxNo">{{ info.taxNo }}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">发票内容</view>
          <view class="msg-right">预付卡销售和充值</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">发票金额</view>
          <view class="msg-right" v-if="info.invoiceAmount">
            ￥{{ info.invoiceAmount | formaterMoney }}
          </view>
        </view>
      </view>
    </view>
    <view class="item pay-info br-16">
      <view class="title">收票人信息</view>
      <view class="content">
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">收票人姓名</view>
          <view class="msg-right" v-if="info.payeeName">{{ info.payeeName }}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">收票人手机号</view>
          <view class="msg-right" v-if="info.payeePhone">{{ info.payeePhone }}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">收票人邮箱</view>
          <view class="msg-right" v-if="info.payeeEmail">{{ info.payeeEmail }}</view>
        </view>
      </view>
    </view>

    <!-- 酒店订单 -->
    <view
      v-if="orderInfo.orderSource == 4"
      class="item-order hotel-order mt-24 mr-42 mb-24 ml-24 flex-h flex-c-b"
    >
      <view class="flex-h flex-c-s">
        <image class="logo-img" :src="orderInfo.supermarketThumbnail" mode="scaleToFill" />
        <view class="item-order-left flex-v flex-s-c">
          <view class="mb-20 fs-40 fw-bold text-over">{{ orderInfo.productName }}</view>
          <view class="address fs-34">数量：{{ orderInfo.payAmount }}</view>
          <view class="address fs-34"></view>
        </view>
      </view>
      <view class="item-order-right flex-v flex-s-c">
        <view class="fs-40 fw-bold">-￥{{ orderInfo.payAmount | formaterMoney }}</view>
      </view>
    </view>

    <!-- 其他订单 -->
    <view v-else class="item-order mt-24 mr-42 mb-24 ml-24 flex-h flex-c-b">
      <view class="flex-h flex-c-s">
        <image class="logo-img" :src="orderInfo.supermarketThumbnail" mode="scaleToFill" />
        <view class="item-order-left flex-v flex-s-c">
          <view class="mb-20 fs-40 fw-bold">{{ orderInfo.supermarketName }}</view>
          <view class="address fs-32">{{ orderInfo.orderTime }}</view>
        </view>
      </view>
      <view class="item-order-right flex-v flex-s-c">
        <view class="fs-32 fw-bold">-￥{{ orderInfo.payAmount | formaterMoney }}</view>
      </view>
    </view>

    <view class="btn-box" v-if="info.status == '1'">
      <button class="btn" @click="handleSendEmail">发送邮箱</button>
    </view>
    <input-modal
      ref="inputModal"
      cancelText="取消"
      confirmText="发送"
      @cancel="modalPopCancel"
      @confirm="modalPopConfirm"
      title="请确定邮箱地址"
    >
      <view slot="text">
        <view class="mainMin">
          <view class="content">
            <input type="text" class="email" v-model="email" placeholder=" " />
            <image
              class="icon"
              @click="email = ''"
              v-if="email"
              src="http://192.168.1.187:10088/static/supermarket/icon-close.png"
              mode="scaleToFill"
            />
          </view>
        </view>
      </view>
    </input-modal>
  </view>
</template>

<script>
  import api from '@/apis/index.js';
  import inputModal from './components/input-modal.vue';
  import { validateEmail, validatePhoneNumber } from '@/utils/validation.js';
  import dayjs from 'dayjs';
  export default {
    components: { inputModal },
    data() {
      return {
        // 发票id
        invoiceId: '',
        info: {},
        orderInfo: {},
        email: '',
      };
    },
    onLoad(e) {
      this.invoiceId = e.invoiceId;
      // let info = JSON.parse(decodeURIComponent())
      this.getInvoiceInfo();
      // this.drawCanvas()
    },
    methods: {
      //  发票详情
      getInvoiceInfo() {
        api.getInvoiceInfo({
          data: {
            invoiceId: this.invoiceId,
          },
          success: (data) => {
            console.log('发票详情:', data);
            this.info = data;
            api.getOrderInfo({
              data: {
                orderId: this.info.orderId,
              },
              success: (orderData) => {
                console.log('订单详情:', orderData);
                this.orderInfo = orderData;
              },
            });
          },
        });
      },
      // 发送邮箱
      handleSendEmail() {
        this.email = this.info.payeeEmail;
        this.$refs.inputModal.open();
      },
      // 点击发送按钮
      modalPopConfirm() {
        if (!this.email) {
          this.$uni.showToast('请填写邮箱');
          return false;
        }
        if (!validateEmail(this.email)) {
          this.$uni.showToast('邮箱格式不正确');
          return false;
        }
        api.sendMailbox({
          data: {
            pdfUrl: this.info.pdfUrl,
            mailBox: this.email,
          },
          showsLoading: true,
          success: (res) => {
            this.$uni.showToast('发送成功');
            this.$refs.inputModal.close();
          },
        });
      },
      // 点击取消按钮
      modalPopCancel() {
        this.$refs.inputModal.close();
      },
    },
    filters: {
      formaterMoney(v) {
        return (v / 100).toFixed(2);
      },
      // 日期过滤器, 用于格式化日期
      dateFilter(value) {
        // console.log("value:",value)
        // console.log("dayjs:",dayjs(value).format("YYYY-MM-DD HH:mm:ss"))
        if (!value) return '';

        var time = new Date(Number(value));
        function add0(m) {
          return m < 10 ? '0' + m : m;
        }
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .pages {
    min-height: 100vh;
    background-color: #f5f5f5;
    overflow: hidden;
    position: relative;
    .item {
      width: 686rpx;
      height: auto;
      background-color: #fff;
      margin: 24rpx 32rpx;
      box-sizing: border-box;
      color: #333;
      background-color: #fff;
      .title {
        height: 104rpx;
        text-indent: 24rpx;
        line-height: 104rpx;
        font-weight: bold;
        color: #333333;
        border-bottom: 2rpx solid #eeeeee;
        .status {
          width: 112rpx;
          height: 40rpx;
          background: #ffffff;
          border-radius: 4rpx;
          font-size: 32rpx;
          line-height: 32rpx;
          box-sizing: border-box;
          font-weight: 400;
          text-indent: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          &.orange {
            border: 2rpx solid #ff5500;
            color: #ff5500;
          }
          &.green {
            border: 2rpx solid #12b362;
            color: #12b362;
          }
        }
      }
      .content {
        box-sizing: border-box;
        padding: 22rpx 24rpx 24rpx 24rpx;
        .msg-item {
          color: #999999;
          justify-content: space-between;
          align-items: baseline;
          line-height: 62rpx;
          .msg-left {
            flex: 1;
            margin-right: 20rpx;
            &.color-red {
              color: #ff5500;
            }
          }
          .msg-right {
            flex-shrink: 0;
            width: 360rpx;
            text-align: right;
            color: #333;
            word-break: break-all;
            &.color-red {
              color: #ff5500;
            }
          }
        }
        .bar-code {
          width: 562rpx;
          height: 128rpx;
        }
      }
    }
    .item-order {
      width: 686rpx;
      height: 180rpx;
      background-color: #fff;
      margin: 24rpx 32rpx;
      padding: 0rpx 24rpx;
      box-sizing: border-box;
      color: #333;
      .logo-img {
        flex-shrink: 0;
        width: 78rpx;
        height: 78rpx;
        margin-right: 26rpx;
      }
      .item-order-left {
        // flex: 1;
        color: #333;
        // height: 154rpx;
        // width: 520rpx;
        .address {
          flex-shrink: 0;
          // width: 520rpx;
          color: #999999;
          @include text-line(1);
        }
      }
      .item-order-right {
        color: #333333;
        font-size: 40rpx;
        // height: 154rpx;
      }
      &.hotel-order {
        .logo-img {
          width: 142rpx;
          height: 154rpx;
        }
        .item-order-left {
          flex: 1;
          height: 154rpx;
          justify-content: space-between;
          .text-over {
            width: 340rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .item-order-right {
          height: 154rpx;
          flex: 1;
          display: flex;
          white-space: nowrap;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .btn-box {
      position: fixed;
      height: 156rpx;
      width: 100vw;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background-color: #fff;
      box-sizing: border-box;
      padding-right: 32rpx;
      .btn {
        width: 296rpx;
        height: 100rpx;
        background: #ffffff;
        border-radius: 50rpx;
        border: 2rpx solid #dcdee0;
      }
    }
    .mainMin {
      padding-bottom: 170rpx;
      .content {
        width: 526rpx;
        height: 100rpx;
        background: #f2f2f2;
        border-radius: 16rpx;
        margin: 0 auto;
        position: relative;
        .email {
          display: block;
          width: 100%;
          height: 100%;
          font-size: 44rpx;
          font-weight: bold;
          color: #323233;
          padding: 0 80rpx 0 24rpx;
          box-sizing: border-box;
        }
        .icon {
          position: absolute;
          top: 34rpx;
          right: 24rpx;
          width: 32rpx;
          height: 32rpx;
        }
      }
    }
  }
</style>
