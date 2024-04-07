<template>
  <view v-if="info" class="pages"
    :style="{paddingBottom:(info.transactionStatus == '1')? '180rpx':''}">
    <view class="item pay-info br-16">
      <view class="title">支付信息</view>
      <view class="content ">
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">支付订单编号</view>
          <view class="msg-right" v-if="info.orderId">{{info.orderId}}</view>
        </view>
        <!-- <view class="msg-item flex-h fs-36">
          <view class="msg-left">银行卡订单编号</view>
          <view class="msg-right"
                v-if="info.bankOrderNo">{{info.bankOrderNo}}</view>
        </view> -->
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">交易参考号</view>
          <view class="msg-right" v-if="info.transactionReferenceNo">{{info.transactionReferenceNo}}
          </view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">交易流水号</view>
          <view class="msg-right" v-if="info.transactionSerialNo">{{info.transactionSerialNo}}
          </view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left" v-if="info.voucherNo">凭证号</view>
          <view class="msg-right" v-if="info.voucherNo">{{info.voucherNo}}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">订单金额</view>
          <view class="msg-right">￥{{info.orderAmount|formaterMoney}}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">优惠金额</view>
          <view class="msg-right  color-red">￥{{info.discountAmount|formaterMoney}}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">实付金额</view>
          <view class="msg-right">￥{{info.payAmount|formaterMoney}}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">交易时间</view>
          <view class="msg-right" v-if="info.orderTime">{{info.orderTime}}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">交易状态</view>
          <view class="msg-right" v-if="info.transactionStatusName">{{info.transactionStatusName}}
          </view>
        </view>
      </view>
    </view>
    <view class="item pay-info br-16">
      <view class="title">电子预付卡支付信息</view>
      <view class="content ">
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">商户名称</view>
          <view class="msg-right" v-if="info.supermarketName">{{info.supermarketName}}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">门店号</view>
          <view class="msg-right" v-if="info.supermarketStoreNo">{{info.supermarketStoreNo}}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">门店名称</view>
          <view class="msg-right" v-if="info.supermarketStoreName">{{info.supermarketStoreName}}
          </view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">支付卡号</view>
          <view class="msg-right" v-if="info.paymentCardNo">{{info.paymentCardNo}}</view>
        </view>
        <view class="msg-item flex-h fs-36">
          <view class="msg-left">支付金额</view>
          <view class="msg-right" v-if="info.paymentAmount">￥{{info.paymentAmount|formaterMoney}}
          </view>
        </view>
      </view>
    </view>
    <view class="item pay-info br-16">
      <view class="title">退货码</view>
      <view class="content ">
        <view class="msg-item flex-h fs-36" v-if="info.transactionStatus == '2'">
          <view class="msg-left color-red">已退款</view>
          <view class="msg-right" v-if="info.refundTime">{{info.refundTime}}</view>
        </view>

        <view class="flex-v flex-c-s " v-if=" info.transactionStatus == '1'">
          <canvas canvas-id="bar-code" id="bar-code" class="bar-code" />
          <view class="lh-56 fs-40" v-if="info.refundCode">{{info.refundCode}}</view>
        </view>
      </view>
    </view>

    <cover-view class="btn-box">
      <!-- invoiceStatus: 0 申请开票  1 已开票 2 不可开票 -->
      <button class="btn" v-if="info.invoiceStatus == '0'" @click="handleApplyClick">申请开票</button>
      <button class="btn" v-if="info.invoiceStatus == '1'" @click="handleInvoiceClick">查看开票</button>
    </cover-view>
  </view>
</template>

<script>
import api from '@/apis/index.js'
import generator from '@/utils/code-generator.js'
export default {
  components: {},
  data() {
    return {
      // 订单信息
      info: null,
      // 选中tab
      tabIndex: '0',
      // 订单id
      orderId: ''
    }
  },
  onLoad(e) {
    this.orderId = e.orderId
    // let info = JSON.parse(decodeURIComponent())
    this.getOrderInfo()
    // this.drawCanvas()
  },
  methods: {
    // 申请开票
    handleApplyClick() {
      // let info = JSON.stringify(this.info)
      api.getOrderInfo({
        data: {
          orderId: this.orderId
        },
        success: (data) => {
          switch (data.orderStatus) {
            case '3':
            case '5':
              if (data.invoiceStatus !== '2') {
                uni.navigateTo({
                  url: '/pages/supermarket/apply-invoice?info=' + JSON.stringify(data)
                })
              } else {
                this.$uni.showToast('该笔订单无法申请开票，请联系客服400-0610-100')
              }
              break
            case '6':
              if (data.invoiceStatus === '1') {
                uni.navigateTo({
                  url: '/pages/supermarket/apply-invoice?info=' + JSON.stringify(data)
                })
              } else {
                this.$uni.showToast('该笔订单已退款，无法申请开票')
              }
              break
            case '7':
              if (data.invoiceStatus === '1') {
                uni.navigateTo({
                  url: '/pages/supermarket/apply-invoice?info=' + JSON.stringify(data)
                })
              } else {
                this.$uni.showToast('当前正在退款中，无法申请开票')
              }
              break
          }
        }
      })
    },
    // 查看开票
    handleInvoiceClick() {
      uni.navigateTo({
        url: '/pages/supermarket/invoice-info?invoiceId=' + this.info.invoiceId
      })
    },
    //  订单详情
    getOrderInfo() {
      api.getOrderInfo({
        data: {
          orderId: this.orderId
        },
        success: (data) => {
          console.log('订单详情:', data)
          this.info = data || {}
          this.$nextTick(() => {
            this.drawCanvas()
          })
        }
      })
    },
    drawCanvas() {
      if (!this.info.refundCode) return
      generator.barcode('bar-code', this, this.info.refundCode, 562, 128)
    }
  },
  filters: {
    formaterMoney(v) {
      return (v / 100).toFixed(2)
    }
  }
}
</script>

<style  lang="scss" scoped>
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
    z-index: 1000;
    .btn {
      width: 296rpx;
      height: 100rpx;
      background: #ffffff;
      border-radius: 50rpx;
      border: 2rpx solid #dcdee0;
    }
  }
}
</style>
