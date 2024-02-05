<style lang="scss" scope>
.page-order-info {
  padding-bottom: rpx(176);
  position: relative;
  z-index: 1;
  background: #f5f5f5;
  min-height: 100vh;
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
    margin: 0 32rpx;
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
    margin: 0 32rpx;
    border-radius: 16rpx;
    padding: 20rpx 24rpx;

    .store-name {
      font-size: rpx(36);
      font-weight: 500;
      display: flex;
      align-items: center;
      .icon-right {
        width: 15rpx;
        height: 27rpx;
        margin-left: 10rpx;
      }
    }

    .item-list {
      .item {
        position: relative;
        padding: rpx(30) rpx(30) rpx(20) rpx(180);
        min-height: rpx(220);
        .item-logo {
          position: absolute;
          top: rpx(30);
          left: 0;
          width: rpx(169);
          height: rpx(179);
          border: rpx(1) solid #d8d8d8;
        }

        .item-name {
          padding-left: rpx(20);
          font-size: rpx(36);
          font-weight: 500;
          @include ellipsis;
        }

        .sku-name {
          padding-left: rpx(20);
          padding-right: rpx(120);
          margin-top: rpx(17);
          font-size: rpx(36);
          height: 47rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: $color-grey;
          .item-state {
            @include middle-center-y();
            right: rpx(30);
            font-size: rpx(38);
            color: $color-lightgrey;
          }
          .item-state-label {
            color: $color-black;
            font-size: rpx(24);
          }
        }

        .item-price {
          padding-left: rpx(20);
          position: relative;
          margin-top: rpx(17);
          font-size: rpx(36);
          color: $color-black;
          font-weight: 500;

          .item-qty {
            @include middle-center-y();
            right: rpx(30);
            color: $color-lightgrey;
          }
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
      }
    }

    .remark-wrap {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding-top: rpx(30);
      padding-bottom: rpx(30);
      border-top: rpx(1) dashed #d8d8d8;
      line-height: 1.4;

      .title {
        font-size: rpx(28);
        font-weight: 500;
      }

      .value {
        margin-left: rpx(10);
        font-size: rpx(28);
        color: $color-black;
      }
    }
  }

  .cost-list {
    // padding-left: rpx(30);
    margin: 0 32rpx;
    background: #ffffff;
    border-radius: 16rpx;

    .cost {
      height: rpx(70);
      line-height: rpx(70);
      font-size: rpx(32);
      font-weight: normal;
      padding: 0 rpx(32);
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.real-pay {
        border-top: 1rpx solid #eeeeee;
        justify-content: end;
        .right {
          margin-right: 10rpx;
        }
      }
      .right {
        text-align: right;
      }

      .value {
        float: right;
        color: $color-black;
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
    padding: 0 24rpx;
    background: #ffffff;
    border-radius: 16rpx;
    font-size: 32rpx;
    position: relative;
    z-index: 2;
    &.top {
      padding-bottom: 24rpx;
      .info {
        height: 44rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 44rpx;
        margin-bottom: 16rpx;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .info-list-title {
      font-weight: 500;
      font-size: 40rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #333333;
      line-height: 56rpx;
      padding-top: 24rpx;
    }

    .info {
      line-height: rpx(70);
      color: $color-black;
    }
  }

  .footer-btn-list {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    @include middle-center-x(fixed);
    bottom: 0;
    width: 100%;
    height: 176rpx;
    padding: 0 38rpx;
    background: #ffffff;
    box-shadow: 0px -2px 0px 0px #f5f5f5;
    z-index: 1000;

    &.isIphoneHair {
      padding-bottom: rpx(68);
    }

    .btn {
      @include btn();
      width: 204rpx;
      height: 80rpx;
      line-height: 80rpx;
      background: #ffffff;
      border-radius: 47rpx;
      border: 2rpx solid #dcdee0;
      font-size: 40rpx;
      color: #333333;
      font-weight: 500;
      margin-left: 24rpx;

      &:first-child {
        background: #fff;
        border-top: rpx(2) solid #d8d8d8;
        color: $color-black;
      }
    }
  }

  .red {
    color: #ff5500;
  }
}
</style>
<template>
  <div class="page-order-info" v-if="!loading">
    <div class="order-header-bg"></div>
    <div class="order-header-status">
      <div class="status">
        <div class="txt">{{ order.orderStatusName }}</div>
        <div v-if="order.orderStatus == 1">
          订单将于<span style="color: #ff5500"
            >{{ expirationTime[0] }}分{{ expirationTime[1] }}秒</span
          >后被取消，请尽快支付！
        </div>
        <div v-if="order.orderStatus == 3">已完成</div>
        <div v-if="order.orderStatus == 4">用户取消订单，订单结束</div>
      </div>
      <image class="img-status" :src="statusUrl" mode="scaleToFill" />
    </div>
    <div class="info-list top">
      <div class="info-list-title">{{ order.supermarketName }}</div>
      <div class="info">北京出发</div>
      <div class="info">
        {{ order.detailDTO.usageTime }} 出发
        {{ order.detailDTO.expirationTime }} 返程
      </div>
      <view class="info">出行人数：{{ order.detailDTO.payNumber }}人</view>
    </div>
    <div class="line"></div>
    <div class="info-list">
      <div class="info-list-title">联系人信息</div>
      <div class="info">
        姓名：<span class="value">{{ order.detailDTO.crterName }}</span>
      </div>
      <div class="info">
        手机号码：<span class="value">{{ order.detailDTO.updterName }}</span>
      </div>
    </div>
    <div class="line"></div>
    <div class="cost-list">
      <div class="cost">
        订单总额:
        <span class="value">¥{{ formatNum(order.orderAmount) }}</span>
      </div>
      <div class="cost">
        立减:
        <span class="value red">+¥{{ formatNum(order.discountAmount) }}</span>
      </div>
      <div class="cost">
        优惠券:
        <span class="value red">-¥{{ formatNum(order.couponAmount) }}</span>
      </div>
      <div class="cost real-pay">
        <text class="right">实付款:</text>
        <span class="value red">¥{{ formatNum(order.payAmount) }}</span>
      </div>
    </div>
    <div class="line"></div>
    <div class="info-list" v-if="order.invoiceTitle">
      <div class="info-list-title">发票</div>
      <li class="info">
        发票类型:<span>{{
          order.invoiceType == 0 ? "电子普通发票" : "增值税专用发票"
        }}</span>
      </li>
      <li class="info">
        发票抬头:<span>{{ order.invoiceTitle }}</span>
      </li>
      <template v-if="order.applicantType === 1">
        <li class="info">
          纳税识别号:<span>{{ order.identifyingCode }}</span>
        </li>
      </template>
      <template v-if="order.invoiceType === 1">
        <li class="info">
          开户银行名称:<span>{{ order.bankName }}</span>
        </li>
        <li class="info">
          单位开户账号:<span>{{ order.bankAccount }}</span>
        </li>
        <li class="info">
          单位注册地址:<span>{{ order.registrationAddress }}</span>
        </li>
        <li class="info">
          单位电话号码:<span>{{ order.registrationPhone }}</span>
        </li>
      </template>
      <template v-if="order.invoiceType === 0">
        <li class="info">
          收票人手机号码:<span>{{ order.recipientPhone }}</span>
        </li>
        <li class="info">
          收票人电子邮箱:<span>{{ order.recipientEmail }}</span>
        </li>
      </template>
      <template>
        <li class="info">
          发票内容:<span>{{ order.invoiceContent }}</span>
        </li>
      </template>
    </div>

    <div class="line"></div>
    <ul class="footer-btn-list">
      <li v-if="order.orderStatus === '1'" class="btn" @click="remove(order)">
        取消订单
      </li>
      <li v-if="order.orderStatus === '1'" class="btn" @click="toPay">
        立即支付
      </li>
      <li v-if="order.orderStatus === '3'" class="btn" @click="goRefundApply">
        申请退款
      </li>
    </ul>

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
  </div>
</template>

<script>
import api from "@/apis/index";
import dayjs from "dayjs";
export default {
  data() {
    return {
      loading: true,
      order: {},
      hours: 0,
      id: "",
      popUpType: "",
      minutes: 0,
      seconds: 0,
      countDown: 0,
      isIphoneHair: App.isIphoneHair,
      expirationTime: ["", ""],
      icon: {
        address:
          "https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-address.png",
        right:
          "https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-right.png",
      },
    };
  },
  computed: {
    statusUrl() {
      // 10：创建、待付款 20：已支付、待发货 30：已发货、待收货 40：已收货、交易完成、待评价
      // 50:已评价 90：订单取消、手动取消、系统自动取消 100：交易取消
      const statusMap = {
        1: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-daifukuan.png",
        2: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-daishiyong.png",
        3: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-yiwancheng.png",
        4: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-yiguanbi.png",
        5: "",
        6: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-tuikuanwancheng1.png",
        7: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-tuikuanzhong.png",
        8: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-yiguoqi.png",
      };
      return statusMap[this.order.orderStatus];
    },
  },
  methods: {
    close() {
      this.$refs.popup.close();
    },
    formatNum(price) {
      if (!price) return "0.00";
      return (Number(price) / 100).toFixed(2);
    },
    // 取消订单
    remove(item) {
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
    async toPay() {
      uni.showLoading({ title: "正在获取...", mask: true });
      const result = await Axios.post("/payment/sign", {
        orderId: this.order.orderId,
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
        this.$uni.showToast({
          title: result.msg || "获取失败",
          icon: "none",
        });
      }
    },
    goRefundApply() {
      const currentDay = dayjs().format("YYYY-MM-DD");
      if (currentDay === this.order.detailDTO.usageTime) {
        this.$refs.popup.open();
        return;
      }
      uni.navigateTo({
        url: "/pages/benefit/refund-apply?orderId=" + this.order.orderId,
      });
    },
    async cancelOrder() {
      const delResult = await Axios.post("/order/cancel", {
        orderId: this.order.orderId,
      });
      if (delResult.code == 200) {
        console.log(delResult);
        this.loadData();
        // 触发订单刷新事件
        uni.$emit("reloadOrderList");
      } else {
        this.$uni.showToast(delResult.msg || "取消失败");
      }
    },
    async remove() {
      uni.showModal({
        title: "",
        content: "确定要取消?",
        success: (result) => {
          if (result.confirm) {
            uni.showLoading("正在提交...");
            Axios.post("/order/cancel", {
              orderId: this.order.orderId,
            }).then((delResult) => {
              uni.hideLoading();
              if (delResult.code == 200) {
                this.$uni.showToast(delResult.msg || "取消成功");
                this.loadData();
                // 触发订单刷新事件
                uni.$emit("reloadOrderList");
              } else {
                this.$uni.showToast(delResult.msg || "取消失败");
              }
            });
          }
        },
      });
    },
    invoiceContent(type) {
      switch (parseInt(type || 0)) {
        case 1:
          return "服装、鞋帽";
        case 2:
          return "箱包";
        case 3:
          return "礼品、办公用品";
        case 4:
          return "订单商品明细";
        default:
          return "";
      }
    },
    async loadData(noTime) {
      this.loading = true;
      uni.showLoading();
      api.getOrderInfo({
        data: {
          orderId: this.id,
        },
        success: (result) => {
          uni.hideLoading();
          result.invoiceContent = this.invoiceContent(result.invoiceContent);
          this.order = result;
          if (this.order.orderStatus == 1 && !noTime) {
            this.getExpTime();
          }
          this.loading = false;
        },
      });
    },
    // 计算剩余过期时间
    getExpTime() {
      const totalSecond = dayjs(this.order.expirationTime).diff(
        dayjs(),
        "second"
      );
      const munite = Math.floor(totalSecond / 60);
      const second = totalSecond - munite * 60;
      this.expirationTime = [munite, second];

      this.timer = setTimeout(() => {
        this.getExpTime();
        // 处理待使用倒计时
        this.handlerTime(totalSecond);
        if (totalSecond == 0) {
          clearTimeout(this.timer);
          this.loadData(1);
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
      // console.log(day + '天' + hours + '时' + minutes + '分')
      this.interval_time = day + "天" + hours + "时" + minutes + "分";
    },
  },
  async onShow() {
    this.id = this.$scope.options.id;
    if (!Store.getters.isLogin) {
      console.log("Store: ", Store);
      await Store.dispatch("login");
    }
    await this.loadData();
  },
  async onLoad(e) {},
  onUnload() {
    clearInterval(this.countDownTask);
    this.order = {};
  },
};
</script>
