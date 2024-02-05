<style lang="scss" scope>
.page-order-info {
  padding-bottom: rpx(176);
  position: relative;
  z-index: 1;
  background: #f5f5f5;
  .order-header-bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: 338rpx;
    background: linear-gradient(
      180deg,
      #ffd1bb 0%,
      rgba(255, 229, 216, 0.93) 51%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .order-header-status {
    height: 192rpx;
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
    padding-top: 34rpx;
    .status {
      font-size: 32rpx;
      color: #333333;
      display: flex;
      justify-content: space-evenly;
      flex-direction: column;
      padding-left: 32rpx;
      .txt {
        font-size: 44rpx;
        font-weight: 500;
        // margin-bottom: 40rpx;
      }
    }
    .img-status {
      width: 274rpx;
      height: 192rpx;
    }
  }

  .order-header {
    padding: rpx(30);
    background-color: $color-primary;

    .status {
      position: relative;
      padding-top: rpx(10);
      padding-bottom: rpx(20);
      font-size: rpx(32);
      font-weight: 500;
      color: #fff;

      .total-price {
        @include middle-center-y();
        font-size: rpx(24);
        right: 0;

        .span {
          padding-left: rpx(10);
          padding-right: rpx(5);
          font-size: rpx(34);
        }
      }
    }

    .pay-count-down {
      padding-top: rpx(25);
      font-size: rpx(26);
      color: #fff;
    }
  }

  .receive-info {
    padding: rpx(30);
    margin: 40rpx 32rpx 0 32rpx;
    background: #ffffff;
    border-radius: 16rpx;
    position: relative;
    z-index: 2;

    .info-item {
      display: flex;
      align-items: center;
      .address-icon {
        width: 80rpx;
        height: 80rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
      }
      .name {
        position: relative;
        font-size: rpx(40);
        color: #333333;
        font-weight: 500;
      }
      .phone {
        font-size: 36rpx;
        color: #666666;
        margin-left: 32rpx;
      }
      .address {
        padding-top: rpx(10);
        font-size: rpx(36);
        color: #666666;
      }
    }
  }

  .store-list {
    background: #ffffff;
    margin: 32rpx;
    border-radius: 16rpx;
    padding: 20rpx 24rpx;

    .item-list {
      .item {
        position: relative;
        padding: rpx(30) rpx(0) rpx(5) rpx(180);
        min-height: rpx(220);
        // border-bottom: 2rpx solid #eeeeee;
        .item-logo {
          position: absolute;
          top: rpx(30);
          left: 0;
          width: rpx(169);
          height: rpx(179);
        }

        .item-name {
          height: 89rpx;
          line-height: 45rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

          padding-left: rpx(20);
          font-size: rpx(36);
          font-weight: 500;
        }
        .flex-box {
          display: flex;
          justify-content: space-between;
          .sku-name {
            padding-left: rpx(20);
            padding-right: rpx(120);
            margin-top: rpx(50);
            font-size: rpx(36);
            height: 47rpx;
            line-height: 47rpx;
            color: $color-grey;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .item-qty {
            // margin-top: rpx(50);
            @include middle-center-y();
            right: rpx(0);
            color: $color-lightgrey;
            top: 197rpx;
          }
        }

        .item-price {
          padding-left: rpx(20);
          margin-top: rpx(17);
          font-size: rpx(40);
          font-weight: 500;
          text-align: right;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #ff5500;
        }
        .btn-link {
          margin-top: rpx(10);
          width: rpx(120);
          height: rpx(50);
          line-height: rpx(45);
          text-align: center;
          border: 1px solid #666;
          border-radius: 5px;
          color: #666;
          font-size: rpx(24);
        }
        .bottom_line {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          // height: 104rpx;
          .btn-link {
            width: 192rpx;
            height: 74rpx;
            line-height: 74rpx;
            background: #ffffff;
            border-radius: 128rpx;
            border: 2rpx solid #bfbaba;
            font-size: 36rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }
      }
      .info {
        padding-bottom: 20rpx;
        padding-top: 5rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        border-bottom: 2rpx solid #f5f5f5;
      }
    }
  }

  .cost-list {
    margin: 0 32rpx;
    background: #ffffff;
    border-radius: 16rpx;
    margin-bottom: 120rpx;
    padding: 14rpx 0;
    .top-border {
      border-top: 2rpx solid #eeeeee;
      height: 94rpx;
      line-height: 100rpx;
      text-align: right;
      padding: 0 24rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
    .cost {
      height: rpx(70);
      line-height: rpx(70);
      font-size: rpx(32);
      font-weight: normal;
      padding: 0 rpx(32);
      .right {
        text-align: right;
      }

      .value {
        float: right;
        color: $color-black;
        line-height: 70rpx;
        &.red {
          color: #ff5500;
        }

        .span {
          color: #333333;
        }
      }
    }
  }

  .info-list {
    margin: 0 32rpx;
    padding: 14rpx 24rpx;
    background: #ffffff;
    border-radius: 16rpx;
    font-size: 32rpx;

    .info-list-title {
      line-height: rpx(70);
      font-weight: 500;
    }

    .info {
      line-height: rpx(70);
      color: $color-black;
    }
  }
  .fix-bottom {
    width: 100%;
    @include middle-center-x(fixed);
    bottom: 0;
    z-index: 1000;
    .return-old {
      width: 100%;
      height: 88rpx;
      background: #ffe8dd;
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ff5500;
      line-height: 88rpx;
      text-align: center;
    }
    .footer-btn-list {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;

      width: 100%;
      height: 176rpx;
      padding: 0 38rpx;
      background: #ffffff;
      box-shadow: 0px -2px 0px 0px #f5f5f5;

      .btn-link,
      .btn-active {
        display: inline-block;
        margin-left: 20rpx;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 47rpx;
        text-align: center;
        width: 204rpx;
        font-size: 40rpx;
        color: #333333;
      }
      .btn-link {
        border: 2rpx solid #dcdee0;
      }
      .btn-active {
        background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
        color: #ffffff;
        font-weight: 500;
      }
    }
  }

  .red {
    color: #ff5500;
  }
}
</style>
<template>
  <div class="page-order-info">
    <div class="order-header-bg"></div>
    <div class="order-header-status">
      <div class="status">
        <div class="txt">{{ statusText[itemValue.orderStatus] }}</div>
        <!-- 待付款 -->
        <div v-if="itemValue.orderStatus == '1'">
          订单将于<span style="color: #ff5500">{{ dateInfor }}</span
          >后被取消，请尽快支付！
        </div>
        <!-- 待发货 -->
        <div v-if="itemValue.orderStatus == '2'">
          我们会尽快安排发货，请您耐心等待哦！
        </div>
        <!-- 待收货 -->
        <div v-if="itemValue.orderStatus == '10'">商品妥投后自动确认收货</div>
        <!-- 已完成 -->
        <div v-if="itemValue.orderStatus == '3'">
          您的订单已收货,欢迎下次光临
        </div>
        <!-- 已取消 -->
        <div v-if="itemValue.orderStatus == '9'">用户取消订单，订单结束</div>
        <!-- 已关闭 -->
        <div v-if="itemValue.orderStatus == '4'">您的订单已超时</div>
        <!-- 部分退款 -->
        <div v-if="itemValue.orderStatus == '5'">部分退款,请耐心等待!</div>
        <!-- 已退款 -->
        <div v-if="itemValue.orderStatus == '6'">退款完成，欢迎下次光临!</div>
        <!-- 退款中 -->
        <div v-if="itemValue.orderStatus == '7'">退款处理中，请耐心等待!</div>
      </div>
      <image
        class="img-status"
        :src="statusMap[itemValue.orderStatus]"
        mode="scaleToFill"
      />
    </div>
    <div class="receive-info">
      <div class="info-item">
        <image class="address-icon" :src="icon.address" mode="scaleToFill" />
        <div class="info">
          <div class="name">
            {{ itemValue.contact
            }}<span class="phone">{{ itemValue.phone }}</span>
          </div>
          <div class="address">
            {{
              itemValue.province +
              itemValue.city +
              itemValue.area +
              itemValue.street
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="store-list" v-for="(line, i) in itemValue.childList" :key="i">
      <ul class="item-list">
        <view class="chil">
          <div class="info">
            子订单号：<span class="value">{{ line.childOrderNo }}</span>
          </div>
          <li
            class="item"
            v-for="(item, index) in line.detailList"
            :key="index"
          >
            <view @click.stop="shopDetail(item)">
              <img
                class="item-logo"
                mode="scaleToFill"
                :lazy-load="true"
                :src="item.picUrl"
              />
              <div class="item-name">{{ item.spuTitle }}</div>
              <view class="flex-box">
                <view class="sku-name">{{ item.skuTitle }}</view>
                <view class="item-qty">X{{ item.qty }}</view>
              </view>
              <div class="item-price">¥{{ item.payPrice }}</div>
              <view class="bottom_line" v-if="itemValue.orderStatus == '10'">
                <view
                  class="btn-link"
                  @click.stop="watchFlow(item, line.childOrderNo)"
                  >查看物流</view
                >
              </view>
            </view>
          </li>
        </view>
      </ul>
    </div>
    <div class="info-list">
      <div class="info">
        主订单号：<span class="value">{{ itemValue.orderNo }}</span>
      </div>
      <div class="info">
        下单时间：<span class="value">{{ itemValue.createTime }}</span>
      </div>
    </div>
    <div class="line"></div>
    <div class="cost-list">
      <div class="cost">
        订单总额: <span class="value">¥{{ itemValue.payPrice }}</span>
      </div>
      <div class="cost">
        运费: <span class="value red">+¥{{ itemValue.payFreight }}</span>
      </div>
      <div class="top-border">
        <text>实付款：</text>
        <span class="value red">¥{{ itemValue.payTotal }}</span>
      </div>
    </div>
    <view class="fix-bottom">
      <view class="return-old">预估返养老金 ¥{{ itemValue.payPension }}</view>
      <div
        class="footer-btn-list"
        @click.stop=""
        v-if="['1', '2', '3', '10'].includes(itemValue.orderStatus)"
      >
        <!-- 待付款 -->
        <template v-if="itemValue.orderStatus == '1'">
          <view class="btn-active" @click="toPay">立即支付</view>
          <view class="btn-link" @click="cancel(itemValue)">取消订单</view>
        </template>
        <!-- 待发货 -->
        <template v-if="itemValue.orderStatus == '2'">
          <view class="btn-link" @click="applyRefund(itemValue)">申请退款</view>
        </template>
        <!-- 待收货 -->
        <template v-if="itemValue.orderStatus == '10'">
          <view class="btn-active" @click="confirmGoods(itemValue)"
            >确认收货</view
          >
          <view class="btn-link" @click="applyRefund(itemValue)">申请退款</view>
        </template>
        <!-- 已完成-->
        <view
          class="btn-link"
          v-if="itemValue.orderStatus == '3' && refundBtnFlag"
          @click="applyRefund(itemValue)"
        >
          申请退款</view
        >
        <!-- <template v-if="itemValue.orderStatus == '3'">
          <view class="btn-link" @click="applyRefund(itemValue)">申请退款</view>
        </template> -->
      </div>
    </view>
  </div>
</template>

<script>
import dayjs from "dayjs";
import api from "@/apis/index.js";

export default {
  data() {
    return {
      activeIndex: "",
      refundBtnFlag: false, // 是否显示退款按钮
      refundDeadlineTime: "", // 退款过期时间
      closer: null,
      timesFlag: null,
      dateInfor: "",
      // 1-待付款 2-待发货 10-待收货 3-已完成 9-已取消 4-已关闭
      statusMap: {
        1: "https://ggllstatic.hpgjzlinfo.com/static/images/order/wait-fukuan.png",
        2: "https://ggllstatic.hpgjzlinfo.com/static/images/order/wait-fahuo.png",
        10: "https://ggllstatic.hpgjzlinfo.com/static/images/order/wait-shouhuo.png",
        3: "https://ggllstatic.hpgjzlinfo.com/static/images/order/completed.png",
        50: "https://ggllstatic.hpgjzlinfo.com/static/images/order/completed.png",
        9: "https://ggllstatic.hpgjzlinfo.com/static/images/order/canceled.png",
        4: "https://ggllstatic.hpgjzlinfo.com/static/images/order/canceled.png",
        5: "https://ggllstatic.hpgjzlinfo.com/static/images/order/refund.png",
        6: "https://ggllstatic.hpgjzlinfo.com/static/images/order/refund.png",
        7: "https://ggllstatic.hpgjzlinfo.com/static/images/order/refund.png",
      },
      itemValue: {},
      orderId: "",
      // 订单状态
      statusText: {
        1: "待付款",
        2: "待发货",
        10: "待收货",
        3: "已完成",
        9: "已取消",
        4: "已关闭",
        5: "部分退款",
        6: "已退款",
        7: "退款中",
      },
      demo: 3, // 测试用
      loading: true,
      order: {},
      hours: 0,
      minutes: 0,
      seconds: 0,
      countDown: 0,
      icon: {
        address:
          "https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-address.png",
        right:
          "https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-right.png",
      },
    };
  },
  filters: {
    formatNum(price) {
      return Number(price).toFixed(2);
    },
    dateFilter(value) {
      return dayjs(value).format("YYYY-MM-DD hh:mm:ss");
    },
  },
  onLoad(e) {
    this.activeIndex = e.activeIndex;
    if (e.orderId) {
      this.orderId = e.orderId;
    }
  },
  onShow() {
    if (this.timesFlag) {
      clearInterval(this.timesFlag);
      this.timesFlag = null;
    }
    this.getDetailData();
  },
  onUnload() {
    if (this.closer) {
      clearTimeout(this.closer);
      this.closer = null;
    }
    if (this.timesFlag) {
      clearInterval(this.timesFlag);
      this.timesFlag = null;
    }
  },
  methods: {
    applyRefund(item) {
      if (item.orderStatus == "3") {
        const currentTime = new Date().getTime();
        const refundTime = new Date(this.refundDeadlineTime).getTime();
        if (currentTime > refundTime) {
          this.$uni.showToast("已超过退款时间,无法退款!");
          return;
        }
      }
      // 子订单号
      const childOrderId = item.childList[0].childOrderNo || "";
      const mainOrderId = item.orderNo;
      const url = `${ENV.MILI_URL}/#/pages/order-apply-refund/index?order_no=${childOrderId}&master_order_no=${mainOrderId}`;
      this.miliAuth(url);

      // #ifdef MP-ALIPAY
      uni.navigateTo({
        url: `/pages/common/webpage?ecodeUrl=${encodeURIComponent(url)}`,
      });
      // #endif

      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
      // #endif
    },
    shopDetail(v) {
      const detailUrl = `${ENV.MILI_URL}/#/pages/goods-info/index?id=${v.skuId}`;
      const url = `${ENV.MILI_URL}/#/pages/sdk-entry/index?env=alipay_miniapp&redirectUrl=${detailUrl}`;
      // #ifdef MP-ALIPAY
      uni.navigateTo({
        url: `/pages/common/webpage?ecodeUrl=${encodeURIComponent(url)}`,
      });
      // #endif

      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
      // #endif
    },
    toPay() {
      const url = `${ENV.H5}/#/checkstand?cashId=${this.itemValue.orderId}`;
      // #ifdef MP-ALIPAY
      uni.reLaunch({
        url: `/pages/common/webpage?url=${url}`,
      });
      // #endif

      // #ifdef MP-WEIXIN
      uni.reLaunch({
        url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
      });
      // #endif
    },
    async cancel(item) {
      const result = await uni.showModal({
        title: "",
        content: "确认取消此订单吗?",
      });
      if (result[1].confirm) {
        api.orderCancelML({
          data: { orderNo: item.orderNo || "" },
          success: (res) => {
            if (res) {
              this.$uni.showToast("取消成功");
              uni.$emit("reloadOrderList", this.activeIndex);
              this.getDetailData();
            }
          },
        });
      }
    },
    async confirmGoods(item) {
      const result = await uni.showModal({
        title: "确认收到货了吗",
        content: "为保障售后权益,请检查后再确认收货",
      });
      if (result[1].confirm) {
        api.recvconfirm({
          data: { childOrderNo: item.childList[0].childOrderNo },
          success: (res) => {
            if (res) {
              this.$uni.showToast("确认成功");
              uni.$emit("reloadOrderList", this.activeIndex);
              this.getDetailData();
            }
          },
        });
      }
    },
    watchFlow(item, childOrderNum) {
      console.log(
        "flow:",
        item.parentOrderNo,
        "skuid--",
        item.skuId,
        "--childOrderNum--",
        childOrderNum
      );
      // 查看物流 mili第一次对接使用的是主订单号  目前更改为子订单号
      const url_flow = `${ENV.MILI_URL}/#/pages/order-express/index?order_no=${childOrderNum}&sku_id=${item.skuId}`;
      this.miliAuth(url_flow);
    },
    miliAuth(redirectUrl) {
      const encodeUrl = encodeURIComponent(redirectUrl);
      api.getUserAndAddress({
        data: {},
        success: (data) => {
          const { appid, sign, timestamp } = data;
          const token = encodeURIComponent(JSON.parse(data.data).token);
          const env = "alipay_miniapp" || "wechat_miniapp";
          const url = `${ENV.MILI_URL}/#/pages/encrypted-entry/index?redirectUrl=${encodeUrl}&data=${token}&appid=${appid}&timestamp=${timestamp}&sign=${sign}&env=${env}`;
          // #ifdef MP-ALIPAY
          uni.navigateTo({
            url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
          });
          // #endif

          // #ifdef MP-WEIXIN
          uni.navigateTo({
            url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
          });
          // #endif
        },
        fail: (error) => {
          console.log(error);
        },
      });
    },
    getDetailData() {
      api.detailData({
        data: { orderNo: this.orderId },
        success: (res) => {
          this.itemValue = res;
          this.refundDeadlineTime = res.refundDeadlineTime || "";
          const currentTime = new Date().getTime();
          if (res.refundDeadlineTime) {
            const refundTime = new Date(res.refundDeadlineTime).getTime();
            if (currentTime < refundTime) {
              this.refundBtnFlag = true;
            }
          }
          if (res.orderStatus == "1") {
            this.countDown = res.expirationTime || "";
            this.getExpTime();
          }
        },
      });
    },
    // 计算剩余过期时间
    getExpTime() {
      var now = new Date().getTime();
      var end = new Date(this.countDown).getTime();
      var allTime = Math.floor((end - now) / 1000);
      this.timesFlag = setInterval(() => {
        allTime--;
        this.dateInfor = this.handlerTime(allTime);
        if (allTime == 0) {
          clearInterval(this.timesFlag);
          this.timesFlag = null;
          this.closer = setTimeout(() => {
            uni.$emit("reloadOrderList", this.activeIndex);
            this.getDetailData();
          }, 2000);
        }
      }, 1000);
    },
    handlerTime(allt) {
      var day = Math.floor(allt / (60 * 60 * 24));
      var hours = Math.floor((allt - day * 60 * 60 * 24) / (60 * 60));
      var minutes = Math.floor(
        (allt - day * 60 * 60 * 24 - hours * 60 * 60) / 60
      );
      var seconds = allt - day * 60 * 60 * 24 - hours * 60 * 60 - minutes * 60;
      var resutTime = "";
      if (day > 0) {
        resutTime = day + "天";
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return minutes + "分" + seconds + "秒";
    },
  },
};
</script>
