<template>
  <view class="applyRefund">
    <!-- 订单详情 -->
    <view class="item">
      <image class="logo" :src="item.supermarketThumbnail" mode="scaleToFill" />
      <view class="top">
        <view class="top_c">
          <view class="name">{{ item.productName }}</view>
        </view>
      </view>
    </view>

    <view class="list">
      <view class="list-item">
        <view class="label">数量</view>
        <view class="cont">{{ item.payNumber }}</view>
      </view>
      <view class="list-item">
        <view class="label"
          >退款金额 <text class="grey">（实付金额）</text></view
        >
        <view class="cont">¥{{ formatMoney(item.payAmount) }}</view>
      </view>
      <view class="list-item">
        <view class="label">退款方式</view>
        <view class="cont">原支付方式返回</view>
      </view>
      <view class="list-item">
        <view class="label">退款原因 <text class="grey">（必须）</text></view>
        <view class="cont">
          <view class="return-list">
            <view
              v-for="(item, index) in reasons"
              :class="{ item: true, active: index === selectIndex }"
              :key="item.id"
              @click="handleClick(index)"
              >{{ item.content }}</view
            >
          </view>
        </view>
      </view>
    </view>

    <view class="tip-cont">
      <view class="tip-logo-w">
        <image
          class="tip-logo"
          src="https://ggllstatic.hpgjzlinfo.com/static/life/warning-circle.png"
          mode="scaleToFill"
        />
      </view>

      <view class="cont"
        >申请退款一经提交
        <text class="strong">不可撤销</text
        >,提交后将进行人工审核,审核通过后退款1-3个工作日内到账</view
      >
    </view>

    <!-- 底部提交订单 -->
    <view class="bottom_fix">
      <button class="btn" @click="buy">提交</button>
    </view>
  </view>
</template>
<script>
import api from "@/apis/index.js";
export default {
  data() {
    return {
      orderId: "",
      //  商品信息
      item: {},
      selectIndex: 0,
      //  退款原因
      reasons: [
        { id: 1, content: "需要重新购买" },
        { id: 2, content: "价格问题" },
        { id: 3, content: "预约问题" },
        { id: 4, content: "商户引导退款" },
        { id: 5, content: "不需要了" },
        { id: 6, content: "其他原因" },
      ],
    };
  },
  created() {},
  onLoad(option) {
    this.orderId = option.orderId;
    this.getOrderInfo();
  },
  methods: {
    formatMoney(money) {
      if (!money) return "";
      return (money / 100).toFixed(2);
    },
    handleClick(index) {
      this.selectIndex = index;
    },
    // 提交
    buy() {
      const params = {
        uactId: uni.getStorageSync("userInfo").uactId,
        orderId: this.item.orderId,
        goodsNum: this.item.payNumber,
        refundAmount: this.item.payAmount,
        refundReason: this.reasons[this.selectIndex].content,
      };
      api.submitRefund({
        data: params,
        success: (res) => {
          this.$uni.showToast("提交成功");
          setTimeout(() => {
            uni.$emit("openOrderInfoPage");
            uni.navigateBack();
          }, 1000);
        },
      });
    },
    //  订单详情
    getOrderInfo() {
      api.getOrderInfo({
        data: {
          orderId: this.orderId,
        },
        success: (data) => {
          this.item = data;
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.applyRefund {
  position: relative;
  background-color: #f5f5f5;
  width: 100vw;
  height: 100vh;
  .item {
    width: 100%;
    height: 242rpx;
    background: #ffffff;
    padding: 34rpx 30rpx 48rpx;
    box-sizing: border-box;
    display: flex;
    .logo {
      width: 160rpx;
      height: 160rpx;
    }
    .top {
      position: relative;
      .top_c {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-left: 24rpx;
        box-sizing: border-box;
      }
      .name {
        font-size: 40rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .price {
        font-size: 36rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ff5000;
      }
    }
  }
  .list {
    width: 100%;
    background: #ffffff;
    margin-top: 16rpx;
    padding: 0 32rpx;
    box-sizing: border-box;

    .list-item {
      width: 100%;
      height: 88rpx;
      box-sizing: border-box;
      border-bottom: 1rpx solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 36rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      &:last-child {
        border-bottom: none;
        flex-direction: column;
        height: unset;
        .label {
          height: 88rpx;
          width: 100%;
          display: flex;
          align-items: center;
        }
        .cont {
          width: 100%;
          .return-list {
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            justify-content: space-between;
            .item {
              width: 216rpx;
              height: 80rpx;
              font-size: 32rpx;
              padding: 0;
              margin-bottom: 32rpx;
              background: #ffffff;
              border: 2rpx solid #eeeeee;
              color: #333333;
              box-sizing: border-box;
              justify-content: center;
              align-items: center;
              &.active {
                border: 2rpx solid #ff5500;
                color: #ff5500;
              }
            }
          }
        }
      }
      .label {
        .grey {
          color: #999999;
        }
      }
    }
  }
  .tip-cont {
    padding: 0 32rpx;
    margin-top: 32rpx;
    display: flex;
    font-size: 32rpx;
    color: #323233;
    .tip-logo-w {
      margin-right: 16rpx;
      .tip-logo {
        width: 36rpx;
        height: 36rpx;
        margin-top: 8rpx;
      }
    }
    .cont {
      line-height: 52rpx;
      .strong {
        color: #eb3030;
      }
    }
  }
  .bottom_fix {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 178rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
    box-sizing: border-box;
    font-size: 40rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    background: #ffffff;
    .btn {
      width: 100%;
      height: 94rpx;
      color: #ffffff;
      background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
      border-radius: 47rpx;
    }
  }
}
</style>
