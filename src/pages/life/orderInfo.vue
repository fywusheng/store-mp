<template>
  <view class="orderInfo" v-if="info">
    <view class="top-bg"></view>

    <!-- 订单状态 -->
    <view class="top">
      <view class="top-left">
        <view class="bold">{{ formateOrderStatus(info.orderStatus) }}</view>
        <view v-if="info.orderStatus == 1"
          >剩余 <text class="red">{{ expirationTime[0] }}</text
          >分<text class="red">{{ expirationTime[1] }}</text
          >秒 订单自动取消</view
        >
        <view v-else-if="info.orderStatus == 2"
          >还有 <text class="red">{{ interval_time }}</text
          >过期,请尽快使用</view
        >
        <view v-else>{{ formateOrderStatusText(info.orderStatus) }}</view>
      </view>
      <image
        class="status-bg"
        :src="getIconByStatus(info.orderStatus)"
        mode="scaleToFill"
      />
    </view>

    <!-- 套餐详情 -->
    <view class="panel" @click="goHotelDetail">
      <view class="panel-body">
        <view class="top_c">
          <image
            class="hotel-logo"
            :src="info.supermarketThumbnail"
            mode="scaleToFill"
          />
          <view class="top_c-right">
            <view class="hotel-name">{{ info.productName }}</view>
            <view>数量：{{ info.payNumber }}</view>
            <view>有效期至{{ dateFilter(info.expirationTime) }}</view>
            <view class="price">¥{{ dateFilter(info.orderAmount) }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 适用酒店 -->
    <view class="panel">
      <view class="panel-title">
        <view class="title">适用酒店</view>
      </view>

      <view class="panel-body">
        <!-- 位置 -->
        <view class="panel-card" @click="goHotelDetail">
          <view class="card-title">{{ info.supermarketName }}</view>
          <view class="card-cont">
            <view class="cont-left">{{ info.hotel.address }}</view>
            <view class="cont-right" @click.stop="goMap">
              <view class="line"></view>
              <image
                class="icon-address"
                src="https://ggllstatic.hpgjzlinfo.com/static/life/micon.png"
                mode="scaleToFill"
              />
              <view class="_map">地图</view>
            </view>
          </view>
        </view>

        <!-- 待使用 || 已过期 || 退款中 6已退款-->
        <view
          v-if="['6', '7', '8'].includes(info.orderStatus)"
          class="panel-card has-expre"
          style="height: unset"
        >
          <view class="card-title">您需要提前预定,方可享受该服务</view>
          <view class="nor">·同一商品同一时间只可预定1个</view>
          <view class="nor">·请提前2-3天预定,预定前24小时不可取消预定</view>
          <button class="pre-btn unable">立即预定</button>
        </view>
        <!-- 已付款-->
        <view
          v-if="['2'].includes(info.orderStatus)"
          class="panel-card has-expre"
          style="height: unset"
        >
          <!-- 待使用 已过预定时间订单状态为 已完成-->
          <view v-if="info.productStatus == 1">
            <!-- 立即预定 -->
            <view class="card-title">您需要提前预定,方可享受该服务</view>
            <view class="nor">·同一商品同一时间只可预定1个</view>
            <view class="nor">·请提前2-3天预定,预定前24小时不可取消预定</view>
            <button class="pre-btn" @click="handlePre(true)">立即预定</button>
          </view>
          <!-- 已预订 -->
          <view v-if="info.productStatus == 2">
            <!-- 取消预定 -->
            <view v-if="isCancel == '1'">
              <!-- 可以取消 -->
              <view class="card-title"
                >预约到店时间：{{ formatDateTime(info.usageTime) }}</view
              >
              <button class="pre-btn cancel" @click="handlePre(false)">
                取消预定
              </button>
            </view>
            <view v-if="isCancel == '2'">
              <!-- 不可以取消 -->
              <view class="card-title"
                >预约到店时间：{{ formatDateTime(info.usageTime) }}</view
              >
              <view class="card-cont flex-left">
                <image
                  class="icon-tip"
                  src="https://ggllstatic.hpgjzlinfo.com/static/life/warning-circle.png"
                  mode="scaleToFill"
                />
                <view class="pre-time">预定前24小时不可取消预订</view>
              </view>
            </view>
          </view>
        </view>

        <!-- 提示信息 已完成 -->
        <view v-if="info.orderStatus == 3" class="panel-card">
          <view class="card-title"
            >预约到店时间：{{ formatDateTime(info.usageTime) }}</view
          >
          <view class="card-cont flex-left">
            <image
              class="icon-tip"
              src="https://ggllstatic.hpgjzlinfo.com/static/life/warning-circle.png"
              mode="scaleToFill"
            />
            <view class="pre-time">预定前24小时不可取消预订</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 券码 -->
    <view
      class="panel"
      v-if="['2', '3', '6', '7', '8'].includes(info.orderStatus)"
    >
      <view class="panel-title">
        <view class="title">券码</view>
        <view class="right" :class="qrClass">{{
          formateOrderStatus(info.orderStatus)
        }}</view>
      </view>
      <view class="panel-body">
        <view class="qr-code">
          <view class="code">{{ info.transactionReferenceNo }}</view>
          <view class="text">到店后请提供券码</view>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="panel">
      <view class="panel-title">
        <view class="title">订单信息</view>
      </view>
      <view class="panel-body">
        <view class="static">
          <view class="txt">订单编号：{{ info.orderId || "" }}</view>
          <view class="txt">下单时间：{{ formatTime(info.orderTime) }}</view>
          <view class="txt" v-if="!['1', '4'].includes(info.orderStatus)">
            付款时间：{{ formatTime(info.paymentTime) }}</view
          >
          <view class="txt"
            >订单总价：¥{{ formaterMoney(info.orderAmount) }}</view
          >
          <view class="txt" v-if="['1', '4'].includes(info.orderStatus)">
            应付金额：¥{{ formaterMoney(info.payAmount) }}</view
          >
          <view class="txt" v-else
            >实付金额：¥{{ formaterMoney(info.paymentAmount) }}</view
          >
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view v-if="info.orderStatus == 1" class="bottom_fix"
      ><button class="btn active" @click="handlePay(info)">
        立即支付
      </button></view
    >
    <view
      v-if="
        info.orderStatus == 2 && !(info.productStatus == 2 && isCancel == '2')
      "
      class="bottom_fix _right"
    >
      <button class="btn" @click="handleReturn">申请退款</button>
    </view>
    <!-- invoiceStatus 发票状态（0-未开票，1-已开票，2-不可开发票） -->
    <view
      class="bottom_fix"
      v-if="info.orderStatus == 3 && info.invoiceStatus == 0"
    >
      <button class="btn" @click="handleApplyClick">申请开票</button>
    </view>
    <view
      class="bottom_fix"
      v-if="info.orderStatus == 3 && info.invoiceStatus == 1"
    >
      <button class="btn" @click="handleInvoiceClick">查看开票</button>
    </view>
    <!-- 提示弹窗 -->
    <modal
      ref="callPhonePop"
      title=" "
      cancelText="取消"
      confirmText="拨打电话"
      @cancel="marketPopCancel"
      @confirm="marketPopConfirm"
    >
      <template v-slot:text>
        <view class="confirm-main">
          <view class="content">
            {{ dialogContent }}
          </view>
        </view>
      </template>
    </modal>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import dayjs from "dayjs";
import Modal from "@/components/common/modal.vue";
export default {
  components: { Modal },
  data() {
    return {
      //  订单详情
      info: null,
      orderId: null,
      dialogContent: "",
      interval_time: "",
      expirationTime: ["", ""],
      isCancel: "", // ‘1’-可以取消 ‘2’-不可以取消
    };
  },
  created(e) {},
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
    // return {
    //         title:'酒店',
    //         path:"/pages/life/hotelHome",
    //      };
  },
  onLoad(e) {
    this.orderId = e.orderId;
    this.getOrderInfo();
    // 监听页面打开事件
    uni.$on("openOrderInfoPage", (data) => {
      this.getOrderInfo();
    });
  },
  computed: {
    qrClass() {
      if (!this.info) return "";
      const mapObj = {
        2: "green", // 待使用
        3: "grey", // 已使用
        6: "bron", // 已失效
        7: "bron", // 退款中
        8: "bron", // 已过期
      };
      return mapObj[this.info.orderStatus] || "";
    },
  },
  onUnload() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  methods: {
    /**
     * 订单状态
     * （1:待付款、2:已付款(待使用，已预订)、3:交易完成、4:关单、5:部分退款、6:已退款、7:退款中、8：已过期）
     */
    formateOrderStatus(v) {
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
    /**
     * 提示文本
     * （1:待付款、2:已付款、3:交易完成、4:关单、5:部分退款、6:已退款、7:退款中、8：已过期）
     */
    formateOrderStatusText(v) {
      const mapObj = {
        1: "剩29分28秒 订单自动取消",
        2: "还有365天过期 请尽快使用",
        3: "您的订单已完成 欢迎下次光临",
        4: "超时支付 订单已自动关闭",
        5: " ",
        6: "退款完成 欢迎下次光临",
        7: "订单退款中 请耐心等待",
        8: "商品已过有效期 欢迎下次光临",
      };
      return mapObj[v] || "";
    },
    // 金钱格式化
    formaterMoney(v) {
      if (!v) return "";
      return (v / 100).toFixed(2);
    },
    // 日期过滤器, 用于格式化日期
    dateFilter(value) {
      if (!value) return "";
      return dayjs(value).format("YYYY-MM-DD HH:mm");
    },
    // 日期过滤器, 用于格式化日期
    formatTime(value) {
      if (!value) return "";
      return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
    },
    formatDateTime(value) {
      if (!value) return "";
      return dayjs(value).format("YYYY年MM月DD日");
    },
    // 申请开票
    handleApplyClick() {
      api.getOrderInfo({
        data: {
          orderId: this.orderId,
        },
        success: (data) => {
          switch (data.orderStatus) {
            case "3":
            case "5":
              if (data.invoiceStatus !== "2") {
                uni.navigateTo({
                  url:
                    "/pages/supermarket/apply-invoice?info=" +
                    JSON.stringify(data),
                });
              } else {
                this.$uni.showToast(
                  "该笔订单无法申请开票，请联系客服400-0610-100"
                );
              }
              break;
            case "6":
              if (data.invoiceStatus === "1") {
                uni.navigateTo({
                  url:
                    "/pages/supermarket/apply-invoice?info=" +
                    JSON.stringify(data),
                });
              } else {
                this.$uni.showToast("该笔订单已退款，无法申请开票");
              }
              break;
            case "7":
              if (data.invoiceStatus === "1") {
                uni.navigateTo({
                  url:
                    "/pages/supermarket/apply-invoice?info=" +
                    JSON.stringify(data),
                });
              } else {
                this.$uni.showToast("当前正在退款中，无法申请开票");
              }
              break;
          }
        },
      });
    },
    // 查看开票
    handleInvoiceClick() {
      uni.navigateTo({
        url: "/pages/supermarket/invoice-info?invoiceId=" + this.info.invoiceId,
      });
    },
    // 申请退款
    handleReturn() {
      const orderId = this.info.orderId;
      uni.navigateTo({
        url: `/pages/life/applyRefund?orderId=${orderId}`,
      });
    },
    // 套餐详情
    goHotelDetail() {
      const { hotelName, hotelId, hotelDiscountId } = this.info.hotel;
      const change = 1;
      api.queryByDiscountId({
        data: { hotelDiscountId, isTransaction: change },
        success: (res) => {
          if (res) {
            uni.navigateTo({
              url:
                "/pages/life/hotelDetail?hotelDiscountId=" +
                hotelDiscountId +
                "&change=1" +
                "&hotelName=" +
                hotelName +
                "&hotelId=" +
                hotelId,
            });
          } else {
            uni.showToast("商品过期不存在！");
          }
        },
        fail: (res) => {},
      });
    },
    // 地图
    goMap() {
      const { address, hotelName, hotelId, hotelPhoto, lat, lon } =
        this.info.hotel;
      const { latitude, longitude } = uni.getStorageSync("location");
      api.getInfoByHotelId({
        data: { lat: latitude, lon: longitude, hotelId },
        success: (res) => {
          const params = {
            name: hotelName,
            longitude: lon - 0,
            latitude: lat - 0,
            distance: res.distance,
            address,
            hotelPhoto,
          };
          uni.navigateTo({
            url:
              "/pages/life/mapShow?params=" +
              `${encodeURIComponent(JSON.stringify(params))}`,
          });
        },
      });
    },
    // 支付
    handlePay(info) {
      const url = `https://api.hpgjzlinfo.com/#/checkstand?cashId=${info.orderId}`;
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
    // 预定
    handlePre(isPre) {
      if (isPre) {
        this.dialogContent = "您需要拨打电话预定酒店服务，是否立即拨打";
      } else {
        this.dialogContent = "您已预定酒店服务，是否拨打电话取消预定";
      }

      this.$refs.callPhonePop.open();
    },
    // 拨打电话
    marketPopConfirm() {
      this.$refs.callPhonePop.close();
      uni.makePhoneCall({
        phoneNumber: this.info.customerService,
      });
    },
    // 取消
    marketPopCancel() {
      this.$refs.callPhonePop.close();
    },
    //  订单详情
    getOrderInfo(noTime) {
      api.getOrderInfo({
        data: {
          orderId: this.orderId,
        },
        success: (data) => {
          this.info = data;
          const usageTime = new Date(this.info.usageTime).getTime();
          const now = new Date().getTime();
          const toalTime = usageTime - now;
          const chaValue = Math.floor(toalTime / 3600000); // 小时
          // TODO 按照逻辑来说待使用超过预定时间，订单应该变更为已完成。但目前待使用状态变更为已完成需要客乐芙返回。
          if (chaValue > 0 && chaValue <= 24) {
            this.isCancel = "2"; // 不可以取消
          } else if (chaValue > 24) {
            this.isCancel = "1"; // 可以取消
          }
          if (!noTime) {
            this.getExpTime();
          }
        },
      });
    },
    // 计算剩余过期时间
    getExpTime() {
      const totalSecond = dayjs(this.info.expirationTime).diff(
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
          this.getOrderInfo(1);
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
    // 获取状态图片
    getIconByStatus(orderStatus) {
      const mapObj = {
        1: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-daifukuan.png",
        2: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-daishiyong.png",
        3: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-yiwancheng.png",
        4: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-yiguanbi.png",
        5: "",
        6: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-tuikuanwancheng1.png",
        7: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-tuikuanzhong.png",
        8: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-yiguoqi.png",
      };
      return mapObj[orderStatus] || "";
    },
    clickItem(type) {
      this.type = type;
    },
  },
};
</script>
<style lang="scss" scoped>
.red {
  color: #ff5000;
}
.confirm-main {
  width: 552rpx;
  margin: 0 auto;
  height: 180rpx;
  text-align: center;
  font-size: 40rpx;
  line-height: 54rpx;
  .wen {
    color: #ff5500;
  }
}
.orderInfo {
  position: relative;
  background-color: #f5f5f5;
  z-index: 1;
  min-height: 100vh;
  padding-bottom: 180rpx;
  //  height:100%;
  .top-bg {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    height: 514rpx;
    background: linear-gradient(
      180deg,
      #ffd1bb 0%,
      rgba(255, 229, 216, 0.93) 51%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .top {
    height: 194rpx;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    padding-left: 32rpx;
    box-sizing: border-box;
    .top-left {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 32rpx;
      color: #333333;
      .bold {
        font-size: 44rpx;
        font-weight: 500;
      }
    }
    .status-bg {
      width: 274rpx;
      height: 192rpx;
    }
  }
  .panel {
    //  position: absolute;
    //  top: 3.8rem;
    width: 686rpx;
    // height: 334rpx;
    background: #ffffff;
    box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 16rpx;
    // margin:52rpx 32rpx 32rpx 32rpx;
    padding: 24rpx 20rpx;
    box-sizing: border-box;
    margin: 32rpx auto;
    .panel-title {
      display: flex;
      justify-content: space-between;
      .title {
        // width: 160px;
        height: 56rpx;
        font-size: 40rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 56rpx;
      }
      .right {
        width: 140rpx;
        height: 56rpx;
        line-height: 56rpx;
        background: #ffffff;
        border-radius: 8rpx;
        border: 2rpx solid #999999;
        color: #999999;
        text-align: center;
        &.green {
          border: 2rpx solid #12b362;
          color: #12b362;
        }
        &.bron {
          border: 2rpx solid #ff5500;
          color: #ff5500;
        }
        &.grey {
          border: 2rpx solid #999999;
          color: #999999;
        }
      }
    }
    .top {
      width: 686rpx;
      height: 162rpx;
      position: relative;

      .bgimg {
        width: 100%;
        height: 100%;
      }
      .name {
        font-size: 40rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333;
        line-height: 56rpx;
        width: 418rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        margin-right: 70rpx;
      }
      .price {
        font-size: 48rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ff9500;
        line-height: 66rpx;
      }
    }
    .bottom {
      margin-left: 24rpx;
      background: #fff9f3;
      border-radius: 16rpx;
      padding: 28rpx 12rpx 28rpx 12rpx;
      margin-right: 24rpx;
      margin-bottom: 32rpx;
      .infor {
        display: flex;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        height: 50rpx;
        display: flex;
        margin-bottom: 10rpx;
        width: 630rpx;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // word-wrap: break-word;
        // white-space: normal !important;
        // -webkit-line-clamp: 1;
        // -webkit-box-orient: vertical;
        .hourse {
          width: 40rpx;
          height: 40rpx;
          margin-right: 10rpx;
          vertical-align: sub;
        }
      }
      .time {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        display: flex;
        height: 50rpx;
        width: 630rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        .hourse {
          width: 40rpx;
          height: 40rpx;
          margin-right: 10rpx;
          vertical-align: sub;
        }
      }
    }
  }
  .top_c {
    // position:absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 220rpx;
    .hotel-logo {
      width: 202rpx;
      height: 218rpx;
      margin-right: 26rpx;
    }
    .top_c-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 32rpx;
      font-weight: 400;
      flex: 1;
      height: 218rpx;
      .hotel-name {
        font-size: 40rpx;
        font-weight: 500;
      }
      .price {
        color: #ff5000;
        font-size: 36rpx;
      }
    }
  }
  .panel-card {
    width: 100%;
    height: 162rpx;
    background: #f6f7f9;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    padding: 24rpx;
    box-sizing: border-box;
    font-size: 36rpx;
    margin-bottom: 24rpx;
    &:first-child {
      margin-top: 24rpx;
    }
    &:last-child {
      margin-bottom: 0;
    }
    .card-title {
      // width: 316rpx;
      height: 50%;
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      display: flex;
      align-items: center;
    }
    .card-cont {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.flex-left {
        justify-content: left;
      }
      .cont-left {
        color: #666666;
        width: 500rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .cont-right {
        display: flex;
        align-items: center;
        .line {
          width: 2rpx;
          height: 26rpx;
          background: #979797;
          margin-left: 10rpx;
        }
        .icon-address {
          width: 28rpx;
          height: 32rpx;
          margin: 0 8rpx 0 24rpx;
        }
        ._map {
          width: max-content;
        }
      }
      .icon-tip {
        width: 36rpx;
        height: 36rpx;
        margin-right: 16rpx;
      }
      .pre-time {
        font-size: 32rpx;
        font-weight: 400;
      }
    }
  }
  .qr-code {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .code {
      height: 84rpx;
      font-size: 60rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 84rpx;
    }
    .text {
      height: 50rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 50rpx;
    }
  }
  .static {
    .txt {
      height: 44rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 44rpx;
      margin: 12rpx 0;
      &:last-child {
        margin: 0;
      }
    }
  }
  .has-expre {
    font-size: 32rpx;
    font-weight: 400;
    .card-title {
      margin-bottom: 20rpx;
    }
    .nor {
      margin-bottom: 16rpx;
      &:first-child {
        margin-top: 20rpx;
      }
    }
    .pre-btn {
      width: 342rpx;
      height: 72rpx;
      color: #ffffff;
      background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
      border-radius: 36rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      font-size: 40rpx;
      box-sizing: border-box;
      &.unable {
        opacity: 0.3;
      }
      &.cancel {
        color: #ff5500;
        border: 2px solid #ff5500;
        background: #ffffff;
      }
    }
  }

  .bottom_fix {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 178rpx;
    background: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 18rpx;
    box-sizing: border-box;
    ._right {
      position: absolute;
      right: 30rpx;
    }
    .btn {
      width: 240rpx;
      height: 94rpx;
      background: #ffffff;
      margin-left: auto;
      border-radius: 47rpx;
      border: 2rpx solid #dcdee0;
      color: #000;
      font-size: 40rpx;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-content: center;
      &.active {
        border: none;
        color: #ffffff;
        background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
      }
    }
  }
}
</style>
