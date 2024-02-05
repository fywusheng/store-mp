<template>
  <view class="pages">
    <view class="status">
      <view
        v-for="(i, index) in statusList"
        :key="i.id"
        :class="{ active: activeIndex === index, 'status-label': true }"
        @click="handleItemClick(index, i)"
        >{{ i.label }}</view
      >
    </view>

    <view class="hotel-list" v-if="list.length > 0">
      <template v-for="item in list">
        <trip-order-item :item="item.orderDetailDTO"></trip-order-item>
      </template>
    </view>
    <view class="status-box flex-v flex-c-s" v-if="list.length === 0">
      <image
        class="icon-img"
        src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/no-order.png"
        mode="scaleToFill"
      />
      <view>您还没有相关订单</view>
    </view>
  </view>
</template>

<script>
import TripOrderItem from "./trip-order-item.vue";
import pick from "lodash/pick";
import dayjs from "dayjs";
export default {
  name: "shop-order",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  components: { TripOrderItem },
  data() {
    return {
      activeIndex: 0,
      dialogContent: "",
      icon: "https://ggllstatic.hpgjzlinfo.com/static/life/warning-circle.png",
      statusList: [
        { id: null, label: "全部" },
        { id: 1, label: "待付款" },
        { id: 3, label: "已完成" },
        { id: 6, label: "退款/售后" },
      ],
    };
  },
  created() {},
  onLoad(e) {},
  methods: {
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
      return Number(v).toFixed(2);
    },
    // 日期过滤器, 用于格式化日期
    dateFilter(value) {
      return dayjs(value).format("YYYY-MM-DD HH:mm");
    },
    // 查看券码
    lookQrCode(hzhH5) {
      const url = encodeURIComponent(hzhH5);
      uni.navigateTo({ url: `/pages/common/webpage?url=${url}` });
    },
    // 店铺详情
    goStoreDetail(item) {
      uni.navigateTo({
        url: "/sub-pages/index/store/main?supplierId=" + item.storeId,
      });
    },
    logistics(order) {
      uni.navigateTo({
        url: "/sub-pages/me/logistics/main?id=" + order.orderId,
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
    async confirm(order) {
      const result = await uni.showModal({
        title: "",
        content: "确定已收货?",
      });
      if (result.confirm) {
        uni.showLoading("正在提交...");
        const delResult = await Axios.post("/order/confirm", {
          orderId: order.orderId,
        });
        uni.hideLoading();
        if (delResult.code == 200) {
          setTimeout(() => {
            uni.showToast({
              title: delResult.msg || "确认成功",
              icon: "none",
            });
          }, 1500);
          this.changeStatus(this.status);
        } else {
          uni.showToast(delResult.msg || "确认失败");
        }
      }
    },
    toDetail(data) {
      uni.navigateTo({
        url: `/sub-pages/me/order-detail/main?id=${data.orderId}&popUpType=1`,
      });
    },
    handleItemClick(index, i) {
      this.activeIndex = index;
      this.$emit("resetOptions", i.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.pages {
  background-color: #f2f2f2;
  position: relative;
  // padding-bottom: 96rpx;
  .status {
    position: sticky;
    top: 0;
    height: 128rpx;
    width: 100%;
    padding: 0 32rpx;
    z-index: 1;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .status-label {
      height: 80rpx;
      min-width: 144rpx;
      padding: 0 16rpx;
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
      margin: 32rpx 0;
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
          display: flex;
          // justify-content: center;
          .logo-img {
            width: 160rpx;
            height: 160rpx;
            flex-shrink: 0;
          }
          .cont {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 16rpx;
            .label {
              font-size: 32rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
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
        line-height: 80rpx;
        font-size: 32rpx;
        font-weight: 400;
        color: #999999;
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
