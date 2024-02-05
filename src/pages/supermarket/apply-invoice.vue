<template>
  <view class="pages">
    <view class="item pay-info br-16">
      <view class="content">
        <view class="msg-item flex-h fs-32">
          <view class="msg-left">发票类型</view>
          <view class="msg-right">电子发票 </view>
        </view>
        <view class="msg-item flex-h fs-32">
          <view class="msg-left">发票内容</view>
          <view class="msg-right"> 预付卡销售和充值 </view>
        </view>
        <view class="msg-item flex-h fs-32">
          <view class="msg-left">发票金额</view>
          <view class="msg-right">¥{{ formaterMoney(info.orderAmount) }} </view>
        </view>
      </view>
    </view>
    <view
      class="item pay-info br-16"
      :style="{
        marginBottom:
          info.invoiceStatus == '0' && info.transactionStatus == '1'
            ? '180rpx'
            : '',
      }"
    >
      <view class="content">
        <view class="msg-item flex-h fs-32 mb-20">
          <view class="msg-left">发票抬头</view>
          <view class="msg-right flex-h choice" @click="handleChoiceClick">
            <view class="text">请选择</view>
            <image
              class="icon"
              src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/yellow-arrow.png"
              mode="scaleToFill"
            />
          </view>
        </view>
        <view class="msg-item flex-h fs-32">
          <view class="msg-left">收票人姓名：</view>
          <view class="msg-right" v-if="infoHeader.payeeName">{{
            infoHeader.payeeName
          }}</view>
        </view>
        <view class="msg-item flex-h fs-32">
          <view class="msg-left">收票人手机号：</view>
          <view class="msg-right" v-if="infoHeader.payeePhone">{{
            infoHeader.payeePhone
          }}</view>
        </view>
        <view class="msg-item flex-h fs-32">
          <view class="msg-left">收票人邮箱:</view>
          <view class="msg-right" v-if="infoHeader.payeeEmail">{{
            infoHeader.payeeEmail
          }}</view>
        </view>
      </view>
    </view>
    <view class="btn-box">
      <button class="btn" @click="handleSubmitClick">确认提交</button>
    </view>
  </view>
</template>

<script>
import api from "@/apis/index.js";
export default {
  components: {},
  data() {
    return {
      // 订单信息
      info: {
        orderAmount: "", // 金额
      },
      // 抬头信息
      infoHeader: {},

      // 订单id
      orderId: "",
    };
  },
  onLoad(e) {
    this.info = JSON.parse(e.info);
    console.log("this.info:", this.info);
    uni.$on("didSelectHeader", this.handleSetdata);

    // let info =
    // this.getOrderInfo()
    // this.drawCanvas()
  },
  onShow() {},
  methods: {
    formaterMoney(v) {
      return (v / 100).toFixed(2);
    },
    //  订单详情
    getOrderInfo() {
      api.getOrderInfo({
        data: {
          orderId: this.orderId,
        },
        success: (data) => {
          console.log("订单详情:", data);
          this.info = data;
          this.drawCanvas();
        },
      });
    },
    // 选择发票抬头
    handleChoiceClick() {
      uni.navigateTo({
        url:
          "/pages/supermarket/company-list?select=1&invoiceHeaderId=" +
          this.infoHeader.invoiceHeaderId,
      });
    },
    // 抬头信息回显
    handleSetdata(data) {
      console.log("抬头数据：", data);
      this.infoHeader = data;
    },
    // 申请开票
    handleSubmitClick() {
      if (!this.infoHeader.payeeName) {
        this.$uni.showToast("请选择发票抬头");
        return;
      }
      const data = {
        invoiceHeaderId: this.infoHeader.invoiceHeaderId, // 发票抬头ID
        email: this.infoHeader.payeeEmail, // 接收发票的邮箱地址
        titleType: this.infoHeader.invoiceType, // 发票抬头类型；P-企业，C-个人
        name:
          this.infoHeader.invoiceType === "P"
            ? this.infoHeader.invoiceHeaderName
            : this.infoHeader.payeeName, // 发票抬头；抬头类型为企业时，填企业名称，类型为个人时，填写个人名字
        taxpayerIdentityNumber:
          this.infoHeader.invoiceType === "P" ? this.infoHeader.taxNo : "", // 税号；当抬头类型为企业时，必填
        // address:this.infoHeader.invoiceType==='1'?this.infoHeader.taxNo : '',                    //企业地址；当抬头类型为企业时，可选择传入
        // tel: this.infoHeader.invoiceType==='P'? this.infoHeader.tel:this.infoHeader.payeePhone,                             //企业电话；当抬头类型为企业时，可选择传入
        tel: this.infoHeader.payeePhone, // 收票人手机号
        bankers: this.infoHeader.bankers, // 开户行；当抬头类型为企业时，可选择传入
        account: this.infoHeader.account, // 开户行账号；当抬头类型为企业时，可选择传入
        orderId: this.info.orderId, // 订单ID
        orderNo: this.info.paymentOrderNo, // 消费订单号
        invoiceAmount: this.info.orderAmount, // 发票金额
        headerTypeName: this.infoHeader.invoiceType === "P" ? "单位" : "个人", // 抬头类型名称(titleType为P时，传”单位”；为C时，传”个人”)
        payeeName: this.infoHeader.payeeName, // 收票人姓名
      };
      if (this.info.orderSource === 4) {
        data.invoiceClassify = "1";
        api.submitInvoiceByType({
          data,
          showsLoading: true,
          success: (res) => {
            console.log(res);
            uni.reLaunch({
              url:
                "/pages/supermarket/apply-success?orderId=" +
                this.info.orderId +
                "&invoiceId=" +
                res,
            });
          },
        });
      } else {
        api.submitInvoice({
          data,
          showsLoading: true,
          success: (res) => {
            console.log(res);
            uni.reLaunch({
              url:
                "/pages/supermarket/apply-success?orderId=" +
                this.info.orderId +
                "&invoiceId=" +
                res,
            });
          },
        });
      }
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
          color: #333;
          height: 62rpx;
          &.color-red {
            color: #ff5500;
          }
        }
        .msg-right {
          flex-shrink: 0;
          width: 360rpx;
          text-align: right;
          word-break: break-all;
          height: 62rpx;
          &.choice {
            align-items: center;
            justify-content: flex-end;
          }
          .text {
            color: #ff5500;
            height: 62rpx;
          }
          .icon {
            flex-shrink: 0;
            width: 38rpx;
            height: 38rpx;
            // margin-top: 4rpx;
          }
        }
      }
    }
  }
  .btn-box {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 152rpx;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    .btn {
      width: 686rpx;
      height: 108rpx;
      background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
      border-radius: 54rpx;
      text-align: center;
      line-height: 108rpx;
      font-size: 44rpx;
      color: #fff;
    }
  }
}
</style>
