<template>
  <view v-if="info" class="insurance-info">
    <view class="bg-grey"></view>
    <view class="card top">
      <view class="item">
        <view class="name">{{ info.prdName }}</view>
        <image
          v-if="info.insuStatus === 5"
          class="icon-status"
          :src="icon1"
          mode="scaleToFill"
        />
        <image v-else class="icon-status" :src="icon2" mode="scaleToFill" />
      </view>
      <view class="line"></view>
      <view class="item">
        <view class="label">保单号</view>
        <view class="info">{{ info.insuCode }}</view>
      </view>
    </view>
    <view class="card info">
      <view class="item">
        <view class="header">保单服务</view>
      </view>
      <view class="item">
        <view class="label"
          >该保险产品由
          <text class="company">泰康在线财险有限公司</text>
          承保并提供如下服务</view
        >
      </view>
      <view class="service">
        <view class="service-item">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/order/service-1.png"
            class="icon"
            mode="scaleToFill"
          />
          <view class="text">电子保单</view>
        </view>
        <view class="service-item">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/order/service-2.png"
            class="icon"
            mode="scaleToFill"
          />
          <view class="text">申请理赔</view>
        </view>
        <view class="service-item">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/order/service-3.png"
            class="icon"
            mode="scaleToFill"
          />
          <view class="text">电子发票</view>
        </view>
        <view class="service-item">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/order/service-4.png"
            class="icon"
            mode="scaleToFill"
          />
          <view class="text">申请退保</view>
        </view>
      </view>
      <button class="btn" @click="callPhone">联系客服，享受服务</button>
    </view>
    <view class="card info">
      <view class="item">
        <view class="header">被保人信息</view>
      </view>
      <view class="item">
        <view class="label">被保险人</view>
        <view class="info">{{ desensitizeName(info.ordInsuredDTO.name) }}</view>
      </view>
      <view class="item">
        <view class="label">身份证号</view>
        <view class="info">{{
          desensitizeInfo(info.ordInsuredDTO.cardCode)
        }}</view>
      </view>
      <view class="item">
        <view class="label">手机号</view>
        <view class="info">{{ hidePhone(info.ordInsuredDTO.telPhone) }}</view>
      </view>
      <view class="item">
        <view class="label">与投保人关系</view>
        <view class="info">{{
          formatRelation(info.ordInsuredDTO.phRelation)
        }}</view>
      </view>
    </view>
    <view class="card info">
      <view class="item">
        <view class="header">保障内容</view>
      </view>
      <view class="item">
        <view class="label">保费</view>
        <view class="info">{{ info.stressPremium }}元</view>
      </view>
      <view class="item">
        <view class="label">缴费期限</view>
        <view class="info">1年</view>
      </view>
    </view>
    <view class="card info">
      <view class="item">
        <view class="header">保障信息</view>
      </view>
      <view class="item">
        <view class="label">保障期限</view>
        <view class="info"
          >{{ formateDate(info.ordStartDate) }}至{{
            formateDate(info.ordEndDate)
          }}</view
        >
      </view>
      <view v-for="(v, i) in info.contentBean" :key="i" class="item">
        <view class="label">{{ v.responsibility }}</view>
        <view class="info">{{ v.amount }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import dayjs from "dayjs";
import {
  desensitizeName,
  hidePhone,
  desensitizeInfo,
} from "@/utils/desensitization.js";
export default {
  name: "insurance-info",
  data() {
    return {
      info: null,
      icon1: "https://ggllstatic.hpgjzlinfo.com/static/order/actived-icon.png",
      icon2: "https://ggllstatic.hpgjzlinfo.com/static/life/expired-icon.png",
    };
  },
  onLoad(options) {
    this.getInfo(options.insuCode);
  },
  methods: {
    formatRelation(type) {
      const RelationMap = {
        1: "本人",
        2: "父母",
        3: "亲属",
        4: "其他",
        5: "子女",
      };
      return RelationMap[type];
    },
    desensitizeName(name) {
      return desensitizeName(name);
    },
    hidePhone(phone) {
      return hidePhone(phone);
    },
    desensitizeInfo(card) {
      return desensitizeInfo(card);
    },
    formateDate(time) {
      return dayjs(time).format("YYYY-MM-DD");
    },
    getInfo(insuCode) {
      api.getInsuranceInfo({
        data: { insuCode },
        success: (data) => {
          this.info = data;
        },
        fail: (err) => {
          uni.showToast(err.message);
        },
      });
    },
    callPhone() {
      uni.makePhoneCall({
        phoneNumber: "95522",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.insurance-info {
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 32rpx;
  position: relative;
  .bg-grey {
    position: absolute;
    top: 0;
    left: 0;
    height: 514rpx;
    width: 100%;
    background: linear-gradient(
      180deg,
      #ffd1bb 0%,
      rgba(255, 229, 216, 0.93) 51%,
      rgba(255, 255, 255, 0) 100%
    );
    z-index: 1;
  }
  .card {
    width: 686rpx;
    background: #ffffff;
    border-radius: 16rpx;
    margin-top: 32rpx;
    z-index: 2;
    &.top {
      .item {
        &:first-child {
          height: 154rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .name {
            font-size: 44rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
          .icon-status {
            width: 146rpx;
            height: 120rpx;
          }
        }
      }
    }
    &.info {
      .item {
        .header {
          color: #333333;
          font-weight: 500;
          font-size: 36rpx;
        }
        .company {
          font-weight: 500;
        }
      }
    }
    .item {
      padding: 0 24rpx;
      margin-top: 24rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 32rpx;
      .label {
        color: #333333;
      }
      .info {
        color: #999999;
      }
      &:last-child {
        margin-bottom: 24rpx;
      }
    }
    .line {
      width: 100%;
      height: 2rpx;
      background: #eeeeee;
    }
    .service {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .service-item {
        width: 140rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .icon {
          width: 72rpx;
          height: 72rpx;
          margin: 40rpx 16rpx 16rpx 16rpx;
        }
        .text {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          margin-bottom: 40rpx;
        }
      }
    }
    .btn {
      width: 566rpx;
      height: 80rpx;
      background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
      border-radius: 54rpx;
      color: #ffffff;
      font-size: 36rpx;
      margin: 0 auto;
      margin-bottom: 24rpx;
    }
  }
}
</style>
