<template>
  <view class="confirm-order">
    <view class="top-bg"></view>
    <view class="card m-b-36 top-info">
      <view class="name">{{ formData.supermarketName }}</view>
      <view class="line"></view>
      <view class="schedule">
        <image
          class="icon-date"
          src="https://ggllstatic.hpgjzlinfo.com/static/benefit/icon-date.png"
          mode="scaleToFill"
        />
        <view class="desc">
          班期选择-
          <text class="target">北京出发</text>
        </view>
      </view>
      <view class="date">
        <view class="scroll">
          <template v-for="(item, index) in days" :key="item.date">
            <view
              class="date-item"
              :class="{ active: index === selectDay }"
              @click="handleSelectDay(index)"
            >
              <view class="week">{{ item.week }}</view>
              <view class="day">{{ item.date }}</view>
            </view>
          </template>
        </view>
        <view class="date-right" @click="openDate">
          <view class="txt">全部 班期</view>
          <image
            class="icon-right"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/common/right.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view class="line"></view>
      <view class="number-select">
        <view class="left">
          <view class="people-select">
            <image
              class="icon-people"
              src="https://ggllstatic.hpgjzlinfo.com/static/benefit/icon-people.png"
              mode="scaleToFill"
            />
            <view>人数选择</view>
          </view>
          <view class="people-desc">1.2米 (含) 以下儿童免费</view>
        </view>
        <view class="right">
          <uni-number-box
            :min="1"
            v-model="formData.payNumber"
            @change="handleChange"
          />
        </view>
      </view>
    </view>
    <view class="card m-b-36 contact-info">
      <view class="name">联系人信息</view>
      <view class="row">
        <view class="label">姓名</view>
        <input
          class="input"
          v-model="formData.crterName"
          type="text"
          placeholder="请输入姓名"
        />
      </view>
      <view class="line"></view>
      <view class="row">
        <view class="label">联系方式</view>
        <input
          class="input"
          v-model="formData.updterName"
          type="text"
          placeholder="请输入联系方式"
        />
      </view>
      <view class="line"></view>
    </view>
    <view class="card discount-info" @click="toCoupon">
      <view class="row">
        <view class="label">优惠券</view>
        <view class="right-cont">
          <view class="cont">无优惠券</view>
          <image
            class="icon-right"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/store/right.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view class="line"></view>
      <view class="row" @click="toInvoice">
        <view class="label">发票</view>
        <view class="right-cont">
          <view class="cont">{{ invoiceInfo.showContent || "不开发票" }}</view>
          <image
            class="icon-right"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/store/right.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view class="line"></view>
      <view class="label-name">备注</view>
      <textarea
        class="textarea"
        maxlength="100"
        v-model="formData.scopeOfApplication"
        placeholder="我们将会尽力协调您的特殊需求，如无法满足也请您见谅"
      ></textarea>
    </view>
    <view class="_block"></view>
    <view class="footer">
      <view class="left">
        <view class="real-pay"
          >实付 <text class="price">¥{{ formData.paymentAmount }}</text></view
        >
        <view class="discount">共优惠：¥{{ formData.discountAmount }}</view>
      </view>
      <view class="right" @click="submit">提交订单</view>
    </view>
    <uni-calendar
      ref="calendar"
      class="uni-calendar--hook"
      :clear-date="true"
      :date="info.date"
      :insert="info.insert"
      :lunar="info.lunar"
      :startDate="info.startDate"
      :endDate="info.endDate"
      :range="info.range"
      @confirm="confirm"
    />
  </view>
</template>
<script>
import api from "@/apis/index.js";
import dayjs from "dayjs";
export default {
  data() {
    return {
      days: [],
      info: {
        date: "",
        lunar: true,
        range: false,
        insert: false,
        selected: [],
        startDate: "",
        endDate: "",
      },
      invoiceInfo: {}, // 发票信息
      coupon: {}, // 优惠券
      selectDay: 0,
      discountAmount: 0,
      formData: {
        supermarketName: "", //标题
        orderAmount: 0, // 原总金额
        discountAmount: 0, //优惠金额
        paymentAmount: 0, //应付金额
        orderSource: 6, //订单类型
        productPrice: 0, //单价
        payNumber: 1, //数量
        uactId: "", // 用户id
        usageTime: "", // 出发日期
        expirationTime: "", //返程日期
        crterName: "", //联系人
        updterName: "", //联系电话
        scopeOfApplication: "", //备注
      },
    };
  },
  onLoad(options) {
    console.log("options: ", options);
    this.setUactId1();
    this.getTripInfo(options.id);
  },
  created() {
    uni.$on("didSelectHeader", this.handleSetdata);
    uni.$on("onSelectCoupon", this.handleSetCoupon);
  },
  onShow() {
    // this.setUactId();
  },
  methods: {
    getTripInfo(id) {
      api.getTripInfo({
        data: { tourismId: id },
        success: (res) => {
          // console.log("res: ", res);
          this.formData.supermarketName = res.tourismName;
          this.formData.productPrice = res.amount;
          this.discountAmount = res.amount - res.discountAmount;

          this.setCalendarDate(res.appointmentDays);
          this.setDays(res.appointmentDays);
          this.setTime(this.info.startDate);
          this.calcPrice();
        },
      });
    },
    toCoupon() {
      return;
      uni.navigateTo({
        url: "/sub-pages/index/checkout-coupon/main",
      });
    },
    submit() {
      if (!this.setUactId()) {
        return false;
      }

      if (!this.formData.crterName) {
        this.$uni.showToast("请输入姓名");
        return;
      }

      if (this.formData.updterName === "") {
        this.$uni.showToast("请输入联系方式");
        return;
      }

      const params = {
        ...this.formData,
        orderAmount: this.formData.orderAmount * 100,
        discountAmount: this.formData.discountAmount * 100,
        paymentAmount: this.formData.paymentAmount * 100,
        productPrice: this.formData.productPrice * 100,
      };
      api.putHotelOrder({
        data: params,
        success: (res) => {
          const url = `${ENV.H5}/#/checkstand?cashId=${res}`;
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
      });
    },
    setUactId1() {
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo) {
        // uni.navigateTo({ url: "/pages/user-center/login" });
        return false;
      }
      this.formData.uactId = userInfo.uactId;
      this.formData.crterName = userInfo.psnName;
      this.formData.updterName = userInfo.tel;
    },
    setUactId() {
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo) {
        uni.navigateTo({ url: "/pages/user-center/login" });
        return false;
      }
      this.formData.uactId = userInfo.uactId;
      return true;
    },
    handleChange(value) {
      this.formData.payNumber = value;
      this.calcPrice();
    },
    calcPrice() {
      // 优惠金额
      this.formData.discountAmount =
        this.formData.payNumber * this.discountAmount;
      // 总金额
      this.formData.orderAmount =
        this.formData.productPrice * this.formData.payNumber;
      // 实付金额
      this.formData.paymentAmount =
        this.formData.orderAmount - this.formData.discountAmount;
    },
    setCalendarDate(d) {
      this.info.startDate = dayjs().add(d, "day").format("YYYY-MM-DD");
      this.info.date = this.info.startDate;
      this.info.endDate = dayjs()
        .add(d + 30, "day")
        .format("YYYY-MM-DD");
    },
    setDays(d) {
      let res = [];
      for (let index = 0; index < 5; index++) {
        let curretday = dayjs().add(d + index, "day");
        res.push({
          fullDate: curretday.format("YYYY-MM-DD"),
          date: curretday.get("month") + 1 + "-" + curretday.get("date"),
          week: this.getWeek(curretday.get("day")),
        });
      }
      this.days = res;
    },
    getWeek(day) {
      const weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      return weeks[day];
    },
    handleSelectDay(index) {
      this.selectDay = index;
      this.setTime(this.days[index].fullDate);
    },
    // 去开票
    toInvoice() {
      uni.navigateTo({ url: "/pages/supermarket/company-list" });
    },
    // 发票信息回显
    handleSetdata(data) {
      console.log("抬头数据：", data);
      this.invoiceInfo = data;
    },
    handleSetCoupon(data) {
      this.coupon = data;
    },
    openDate() {
      this.$refs.calendar.open();
    },
    confirm(e) {
      const date = e.fulldate;
      const curretDay = dayjs().format("YYYY-MM-DD");
      this.selectDay = this.days.findIndex((day) => day.fullDate === date);
      this.info.date = date;

      if (date === curretDay) {
        this.$uni.showToast("不可选择今天");
        return;
      }
      this.setTime(date);
    },
    setTime(startDate) {
      this.formData.usageTime = startDate;
      this.formData.expirationTime = dayjs(startDate)
        .add(2, "day")
        .format("YYYY-MM-DD");
    },
  },
};
</script>
<style lang="scss" scoped>
.confirm-order {
  position: relative;
  background: #f2f2f2;
  min-height: 100vh;
  padding-top: 36rpx;

  & ::v-deep {
    .uni-numbox--text {
      color: #ff5500 !important;
    }
    .uni-numbox .uni-numbox--disabled {
      color: #c0c0c0 !important;
    }
  }
  .top-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 750rpx;
    height: 514rpx;
    background: linear-gradient(
      180deg,
      #ffd1bb 0%,
      rgba(255, 229, 216, 0.93) 51%,
      rgba(255, 255, 255, 0) 100%
    );
    z-index: 1;
  }
  .card {
    position: relative;
    z-index: 2;
    width: 686rpx;
    white-space: pre-wrap;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 32rpx 24rpx;
    margin: 0 auto;
  }
  .m-b-36 {
    margin-bottom: 36rpx;
  }
  .top-info {
    .name {
      height: 112rpx;
      font-size: 40rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 56rpx;
    }
    .line {
      margin: 32rpx 0;
      width: 638rpx;
      height: 0;
      border-top: 1rpx solid #eeeeee;
    }
    .schedule {
      display: flex;
      align-items: center;
      .icon-date {
        width: 40rpx;
        height: 40rpx;
        margin-right: 8rpx;
      }
      .desc {
        height: 50rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 50rpx;
        .target {
          color: #ff5000;
        }
      }
    }
    .date {
      width: 638rpx;
      height: 108rpx;
      display: flex;
      margin-top: 16rpx;
      .scroll {
        height: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        overflow-x: scroll;
        .date-item {
          width: 136rpx;
          height: 108rpx;
          background: #ffffff;
          border-radius: 16rpx;
          border: 2rpx solid #eeeeee;
          color: #333333;
          flex-shrink: 0;
          margin-right: 14rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          &.active {
            border: 2rpx solid #ff5500;
            color: #ff5500;
          }
        }
      }
      .date-right {
        width: 126rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-left: 16rpx;
        .txt {
          width: 88rpx;
          height: 88rpx;
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 44rpx;
          letter-spacing: 4px;
        }
        .icon-right {
          width: 36rpx;
          height: 36rpx;
        }
      }
    }
    .number-select {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        .people-select {
          display: flex;
          align-items: center;
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          .icon-people {
            width: 40rpx;
            height: 40rpx;
            margin-right: 8rpx;
          }
        }
        .people-desc {
          font-size: 32rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ff5500;
          margin-top: 6rpx;
        }
      }
    }
  }
  .contact-info {
    .line {
      width: 638rpx;
      height: 1rpx;
      background: #eeeeee;
    }
    .name {
      height: 50rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 50rpx;
    }
    .row {
      display: flex;
      align-items: center;
      padding: 24rpx 0;
      .label {
        width: 172rpx;
        height: 44rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 44rpx;
      }
    }
  }
  .discount-info {
    &.card {
      padding-top: 0;
    }
    .line {
      width: 638rpx;
      height: 1rpx;
      background: #eeeeee;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24rpx 0;
      font-size: 36rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      .label {
        width: 172rpx;
        height: 44rpx;
        font-weight: 400;
        color: #333333;
        line-height: 44rpx;
      }
      .right-cont {
        display: flex;
        align-items: center;
        .icon-right {
          width: 36rpx;
          height: 36rpx;
        }
      }
    }
    .label-name {
      height: 50rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 50rpx;
      margin: 26rpx 0;
    }
    .textarea {
      height: 238rpx;
      background: #f5f5f5;
      border-radius: 16rpx;
      padding: 16rpx;
      box-sizing: unset;
    }
  }
  ._block {
    width: 100vw;
    height: 160rpx;
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 750rpx;
    height: 142rpx;
    background: #ffffff;
    box-shadow: 0rpx -2rpx 0rpx 0rpx rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
    z-index: 3;
    .left {
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      .real-pay {
        margin-bottom: 8rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #333333;
        display: flex;
        align-items: center;
        .price {
          margin-left: 8rpx;
          font-size: 40rpx;
          font-weight: 500;
          color: #ff5000;
        }
      }
    }
    .right {
      width: 276rpx;
      height: 94rpx;
      background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
      border-radius: 47rpx;
      font-size: 40rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
      line-height: 94rpx;
    }
  }
}
</style>
