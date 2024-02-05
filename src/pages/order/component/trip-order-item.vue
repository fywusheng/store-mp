<template>
  <view class="pages">
    <view class="hotel-list">
      <view class="item" @click="toDetail(item)">
        <view class="header_line">
          <view class="left">
            <image class="t_icon" :src="item.logoPath" mode="scaleToFill" />
            <view class="type">出行旅游</view>
          </view>
          <view class="right"> {{ item.orderStatusName }}</view>
          <!-- <view class="process" v-else>{{item.orderStatus|formateOrderStatus}}</view> -->
        </view>
        <template>
          <view class="_topLine">
            <view class="left_part">
              <view class="cont">
                <view class="name">{{ item.productName }}</view>
                <view class="label l-1">出发日期：{{ item.usageTime }}</view>
                <view class="label l-1"
                  >返程日期：{{ item.expirationTime }}</view
                >
                <view class="label l-1">联系人：{{ item.crterName }}</view>
              </view>
            </view>
          </view>
        </template>
        <view class="total"
          >实付:
          <text class="salePrice">
            &nbsp;¥{{ formaterMoney(item.paymentAmount) }}</text
          >
        </view>
        <div class="footer-btn" @click.stop="">
          <!-- <div class="btn-active" @click="confirm(orderItem)">申请退款</div> -->
          <div
            v-if="item.orderStatus === '1'"
            class="btn-active"
            @click="toPay(item)"
          >
            立即支付
          </div>
          <div
            v-if="item.orderStatus === '1'"
            class="btn-link"
            @click="remove(item)"
          >
            取消订单
          </div>
          <div class="btn-link" @click="toDetail(item)">查看详情</div>
          <div
            v-if="item.orderStatus === '3'"
            class="btn-active"
            @click="goRefundApply(item)"
          >
            申请退款
          </div>
        </div>

        <!-- 普通弹窗 -->
        <uni-popup ref="popup" background-color="#fff">
          <view class="modal-cont">
            <view class="txt"
              >抱歉，当前行程已经开始，无法线上申请退款，请拨打电话:<text
                class="phone"
                >18518639377</text
              >，进行电话申请，给您带来的不便，敬请谅解!</view
            >
            <view class="ok-btn" @click="close">我知道了</view>
          </view>
        </uni-popup>
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";
import apis from "@/apis/index";
export default {
  name: "shop-order",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      icon: "https://ggllstatic.hpgjzlinfo.com/static/life/warning-circle.png",
    };
  },
  onLoad(e) {},
  methods: {
    close() {
      this.$refs.popup.close();
    },
    goRefundApply(item) {
      const currentDay = dayjs().format("YYYY-MM-DD");
      if (currentDay === item.usageTime) {
        this.$refs.popup.open();
        return;
      }
      uni.navigateTo({
        url: "/pages/benefit/refund-apply?orderId=" + item.orderId,
      });
    },
    formateOrderStatus(v) {
      // 10：创建、待付款
      // 20：已支付、待发货
      // 30：已发货、待收货
      // 40：已收货、交易完成、待评价
      // 50:已评价
      // 90：订单取消、手动取消、系统自动取消
      // 100：交易取消
      const mapObj = {
        1: "待付款",
        2: "待使用",
        3: "已完成",
        4: "已关闭",
        5: "部分退款",
        6: "已退款",
        7: "退款中",
        8: "已过期",
      };
      return mapObj[v] || "";
    },
    formaterMoney(v) {
      return (Number(v) / 100).toFixed(2);
    },
    // 日期过滤器, 用于格式化日期
    dateFilter(value) {
      return dayjs(value).format("YYYY-MM-DD HH:mm");
    },
    // 取消订单
    async remove(item) {
      uni.showModal({
        title: "",
        content: "确定要取消?",
        success: (result) => {
          if (result.confirm) {
            uni.showLoading("正在提交...");
            apis.cancelByOrderId({
              data: {
                orderNo: item.orderId,
                orderStatus: "4",
              },
              success: (res) => {
                uni.hideLoading();
                this.$uni.showToast("取消成功");
                // 触发订单刷新事件
                uni.$emit("reloadOrderList");
              },
            });
          }
        },
      });
    },
    async toPay(order) {
      uni.showLoading({ title: "正在获取...", mask: true });
      const result = await Axios.post("/payment/sign", {
        orderId: order.orderId,
        paymentMethodCode: "nepsp_pay",
        code: new Date().getTime(),
      });
      uni.hideLoading();
      if (result.code == 200) {
        // 去收银台支付
        uni.reLaunch({
          url:
            "/pages/common/webpage?url=" +
            encodeURIComponent(result.data.payUrl),
        });
      } else {
        uni.showToast({
          title: result.msg || "获取失败",
          icon: "none",
        });
      }
    },
    toDetail(data) {
      uni.navigateTo({
        url: `/pages/benefit/order-info?id=${data.orderId}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pages {
  background-color: #f2f2f2;
  position: relative;
  padding: 0 32rpx;
  .modal-cont {
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
  .status {
    position: sticky;
    top: 0;
    height: 128rpx;
    width: 100%;
    z-index: 1;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .status-label {
      width: 140rpx;
      height: 80rpx;
      color: #333333;
      background: #eeeeee;
      font-size: 32rpx;
      border-radius: 40rpx;
      text-align: center;
      line-height: 80rpx;
      &.active {
        color: #ff5500;
        background: rgba(255, 73, 0, 0.11);
      }
    }
  }
  .hotel-list {
    overflow: hidden;
    .item {
      background-color: #fff;
      margin: 32rpx 0 0;
      padding: 0 32rpx 16rpx;
      box-sizing: border-box;
      color: #333;
      border-radius: 16rpx;
      .header_line {
        // height: 50rpx;
        display: flex;
        justify-content: space-between;
        padding-top: 24rpx;
        margin-bottom: 30rpx;
        .left {
          display: flex;
          height: 50rpx;
          line-height: 50rpx;
          .t_icon {
            width: 40rpx;
            height: 40rpx;
            margin-top: 6rpx;
            margin-right: 10rpx;
          }
          .type {
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 50rpx;
          }
        }
        .process {
          color: #ff5500;
        }
        .right {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 50rpx;
        }
      }
      ._topLine {
        display: flex;
        flex-direction: column;
        margin-bottom: 16rpx;
        // justify-content:space-between;
        .left_part {
          display: block;
          // justify-content: center;
          .logo-img {
            width: 160rpx;
            height: 160rpx;
            flex-shrink: 0;
          }
          .cont {
            display: block;
            // flex-direction: column;
            // justify-content: space-between;
            .label {
              font-size: 32rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              margin-bottom: 16rpx;
              &.l-1 {
                // width: 350rpx;
                height: 40rpx;
                display: -webkit-box;
                overflow: hidden; /*超出隐藏*/
                text-overflow: ellipsis; /*隐藏后添加省略号*/
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1; //想显示多少行
              }
            }
            .label2 {
              margin-top: 30rpx;
            }
            &.right {
              flex: 1;
              justify-content: unset;
              text-align: right;
              .label {
                color: #999999;
                font-size: 36rpx;
              }
              .name {
                font-size: 36rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #999999;
              }
            }
          }
          .name {
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            margin-bottom: 16rpx;
            &.l-2 {
              // width: 350rpx;
              height: 87rpx;
              display: -webkit-box;
              overflow: hidden; /*超出隐藏*/
              text-overflow: ellipsis; /*隐藏后添加省略号*/
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2; //想显示多少行
            }
          }
        }
        .r_pay {
          display: flex;
          // justify-content: right;
          // margin: 20rpx 0  24rpx;
          margin-top: 20rpx;
          .pay {
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            margin-left: auto;
          }
          .money {
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }
      }
      .item-img-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
        overflow-x: auto;
        &::before {
          display: block;
          content: "";
          height: 100%;
          width: 66rpx;
          position: absolute;
          right: 0;
          top: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.76) 61%,
            #ffffff 100%
          );
        }
        .img-item {
          // background: #ff5500;
          .item-logo {
            width: 152rpx;
            height: 152rpx;
            border-radius: 8rpx;
            margin-right: 24rpx;
          }
        }
      }
      .total {
        height: 80rpx;
        font-size: 32rpx;
        font-weight: 400;
        color: #999999;
        line-height: 80rpx;
        text-align: right;
        .salePrice {
          font-size: 40rpx;
          font-weight: 500;
          color: #333333;
        }
      }
      .footer-btn {
        display: flex;
        flex-direction: row-reverse;
        padding: 16rpx;
        border-top: 2rpx solid #f5f5f5;
        .btn-link,
        .btn-active {
          display: inline-block;
          margin-left: 20rpx;
          height: 68rpx;
          line-height: 68rpx;
          border-radius: 128rpx;
          text-align: center;
          width: 180rpx;
          font-size: 32rpx;
          color: #333333;
          border: 2rpx solid #333333;
        }

        .btn-active {
          color: #ff711a;
          background: #ffffff;
          border: 2rpx solid #ff711a;
          font-weight: 500;
        }
      }
    }
  }
  .status-box {
    padding-top: 300rpx;
    .icon-img {
      width: 440rpx;
      height: 270rpx;
      margin-bottom: 24rpx;
    }
    .status-text {
      height: 50rpx;
      color: $color-grey;
    }
  }
}
</style>
