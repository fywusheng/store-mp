<template>
  <view class="page-service-type">
    <view class="info-list">
      <view class="item">
        <view class="title">{{ orderInfo.detailDTO.productName }}</view>
        <view class="desc">北京出发</view>
        <view class="desc"
          >{{ orderInfo.detailDTO.usageTime }} 出发
          {{ orderInfo.detailDTO.expirationTime }}</view
        >
      </view>
      <view class="info">
        <view class="title">出行人数</view>
        <view class="desc">{{ orderInfo.detailDTO.payNumber }}</view>
      </view>
      <view class="info">
        <view class="title"
          >退款金额 <text class="gray">（实付金额）</text></view
        >
        <view class="desc">¥{{ formatMoney(orderInfo.payAmount) }}</view>
      </view>
      <view class="info">
        <view class="title">退款方式</view>
        <view class="desc text-right">原支付方式返回</view>
      </view>
      <view class="info n-b">
        <view class="title">退款原因<text class="gray">（必选）</text></view>
      </view>
      <view class="reason-list">
        <view
          class="reason-item"
          :class="{ active: index === reasonIndex }"
          v-for="(reason, index) in reasonList"
          :key="index"
          @click="reasonChange(index)"
          >{{ reason }}</view
        >
      </view>
      <view class="tips">
        <image
          class="icon"
          mode="scaleToFill"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-warning.png"
        />
        <view class="txt"
          >申请退款一经提交<text class="imp">不可撤销</text>
          ,提交后将进行人工审核,审核通过后退款1-3个工作日内到账</view
        >
      </view>
    </view>
    <view class="btn-submit" @click="save">
      <view class="btn">提交</view>
    </view>

    <!-- 普通弹窗 -->
    <uni-popup ref="popup" background-color="#fff">
      <view class="cont">
        <view class="txt"
          >抱歉，当前行程已经开始，无法线上申请退款，请拨打电话:<text
            class="phone"
            >185 1863 9377 </text
          >，进行电话申请，给您带来的不便，敬请谅解!</view
        >
        <view class="ok-btn" @click="close">我知道了</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import api from "@/apis/index.js";
export default {
  data() {
    return {
      reasonIndex: 0,
      orderId: 0,
      orderInfo: {},
      reasonList: ["重新购买", "价格问题", "不需要了", "其他原因"],
    };
  },
  methods: {
    formatMoney(money) {
      if (!money) return "";
      return (money / 100).toFixed(2);
    },
    // 提交
    save() {
      const currentDay = dayjs().format("YYYY-MM-DD");
      if (currentDay === this.orderInfo.detailDTO.usageTime) {
        this.$refs.popup.open();
        return;
      }
      const params = {
        uactId: uni.getStorageSync("userInfo").uactId,
        orderId: this.orderInfo.orderId,
        goodsNum: this.orderInfo.detailDTO.payNumber,
        refundAmount: this.orderInfo.payAmount,
        refundReason: this.reasonList[this.reasonIndex],
      };
      api.submitRefund({
        data: params,
        success: (res) => {
          this.$uni.showToast("提交成功");
          setTimeout(() => {
            uni.$emit("reloadOrderList");
            uni.navigateBack();
          }, 1000);
        },
      });
    },
    reasonChange(index) {
      this.reasonIndex = index;
    },
    close() {
      this.$refs.popup.close();
    },
    getOrderInfo() {
      uni.showLoading();
      api.getOrderInfo({
        data: {
          orderId: this.orderId,
        },
        success: (result) => {
          uni.hideLoading();
          this.orderInfo = result;
        },
      });
    },
  },
  async mounted() {
    if (!Store.getters.isLogin) {
      await Store.dispatch("login");
    }

    this.orderId = this.$scope.options.orderId;
    this.getOrderInfo();
  },
};
</script>

<style lang="scss" scoped>
.page-service-type {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 187rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  .imp {
    color: #eb3030;
  }
  .info-list {
    .item {
      position: relative;
      padding: 54rpx 32rpx 32rpx;
      margin-bottom: 24rpx;
      background: #fff;
      .title {
        line-height: rpx(40);
        font-size: rpx(40);
        color: #333333;
      }
      .desc {
        margin-top: rpx(16);
        font-size: rpx(32);
        color: #333333;
      }
    }
    .info {
      display: flex;
      align-items: center;
      position: relative;
      // border-bottom: rpx(1) solid #e5e5e5;
      background: #fff;
      position: relative;
      &::after {
        position: absolute;
        bottom: 0;
        left: 32rpx;
        content: "";
        display: block;
        width: 686rpx;
        height: 1rpx;
        background: #e5e5e5;
      }
      &.n-b::after {
        height: 0;
      }
      .gray {
        color: #999999;
      }
      &.cont {
        align-items: unset;
        flex-direction: column;
      }
      .title {
        height: rpx(100);
        line-height: rpx(100);
        font-size: rpx(36);
        color: #333333;
        font-weight: 400;
        margin-left: 32rpx;
        .more {
          font-size: 32rpx;
          color: #999999;
          margin-left: 8rpx;
        }
      }
      .money {
        color: #ff5500;
        font-size: rpx(36);
        display: flex;
        align-items: center;
        @include middle-center-y();
        right: rpx(30);
      }
      .desc {
        display: flex;
        align-items: center;
        @include middle-center-y();
        // width: rpx(500);
        right: rpx(30);
        font-size: rpx(36);
        color: #333333;
        font-weight: 400;
        .icon-right {
          @include middle-center-y();
          right: 0;
          width: rpx(16);
          height: rpx(27);
        }
      }
      .address-desc {
        margin-left: 32rpx;
        padding-bottom: 24rpx;
        font-size: 32rpx;
        color: #999999;
      }
      .remark {
        width: rpx(540);
        margin-left: rpx(40);
        height: rpx(80);
        line-height: rpx(80);
        font-size: rpx(36);
      }
    }
    .n-b {
      border-bottom: unset;
    }
    .reason-list {
      background: #ffffff;
      padding: 0 32rpx 32rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .reason-item {
        width: 161rpx;
        height: 80rpx;
        background: #ffffff;
        border: 2rpx solid #eeeeee;
        font-size: 32rpx;
        font-weight: 400;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: center;
        &.active {
          border: 2rpx solid #ff9500;
          color: #ff5500;
        }
      }
    }
  }
  .upload-wrap {
    display: flex;
    padding-left: rpx(32);
    padding-bottom: rpx(30);
    flex-wrap: wrap;
    .img-wrap {
      position: relative;
      width: rpx(150);
      height: rpx(150);
      margin-left: rpx(20);
      margin-bottom: 30rpx;
      .btn-delete {
        position: absolute;
        right: 0;
        top: 0;
        width: rpx(27);
        height: rpx(29);
      }

      .img {
        width: rpx(150);
        height: rpx(150);
      }
    }

    .btn-upload {
      // margin-left: rpx(20);
      width: rpx(150);
      height: rpx(150);
    }
  }
  .btn-submit {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 187rpx;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      @include btn();
      width: 90%;
      line-height: rpx(100);
      height: 100rpx;
      text-align: center;
      font-size: rpx(36);
      background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
      color: #fff;
      z-index: 1000;
      border-radius: 64rpx;
    }
  }
  .tips {
    display: flex;
    padding: 0 36rpx;
    margin-top: 30rpx;
    .icon {
      width: 36rpx;
      height: 36rpx;
      margin: 8rpx 12rpx 0 0;
      flex-shrink: 0;
    }
    .txt {
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323233;
      line-height: 52rpx;
    }
  }
  .m-b-24 {
    margin-bottom: 24rpx;
  }
  .new-remark {
    margin-left: 36rpx;
  }
  .text-right {
    text-align: right;
  }

  .cont {
    width: 620rpx;
    height: 412rpx;
    background: #ffffff;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .msg {
      font-size: 48rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .ok-btn {
      width: 620rpx;
      height: 720rpx;
      background: #ffffff;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 24rpx;

      width: 512rpx;
      height: 50rpx;
      font-size: 44rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff5500;
      line-height: 50rpx;
    }
    .phone {
      color: #ff5500;
      word-break: break-all;
    }
    .txt {
      width: 512rpx;
      line-height: 54rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      word-wrap: break-word;
    }
  }
}
</style>
