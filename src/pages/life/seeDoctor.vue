<template>
  <view class="topArea">
    <view class="bg">
      <view class="bg_block" @click="goHX(0)">
        <image mode="scaleToFill" class="topImg" :src="logo" />
      </view>
      <view class="box">
        <view
          class="_block"
          @click="goH5(v.type)"
          v-for="(v, i) in itemsData"
          :key="i"
        >
          <view class="_line">
            <view class="name">{{ v.name }}</view>
            <image
              mode="scaleToFill"
              class="icon_samll"
              :class="i == 1 ? 'right_icon' : ''"
              :src="v.src"
            />
          </view>
          <view class="_des">{{ v.des }}</view>
        </view>
      </view>
      <view class="find" @click="goHX(1)">
        <view class="left">
          <view class="f_n">找名医</view>
          <view class="f_infor">人气名医 患者好评</view>
          <view class="btn">去问诊</view>
        </view>
        <view class="right">
          <image mode="scaleToFill" class="topImg" :src="docotor" />
        </view>
      </view>
      <view class="order">
        <view class="myorder">我的订单</view>
        <view class="list">
          <view
            class="_item"
            @click="goH5(v.type)"
            v-for="(v, index) in orderLable"
            :key="index"
          >
            <image mode="scaleToFill" class="topImg" :src="v.src" />
            <view class="name">{{ v.name }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="health">
      <view class="_t" @click="goH5(8)">
        <view class="title">健康知识</view>
        <view class="more">更多</view>
      </view>
      <view
        class="line"
        @click="goH5(v.type)"
        v-for="(v, index) in imgs"
        :key="index"
      >
        <view class="_t">{{ v.name }}</view>
        <image mode="scaleToFill" class="topImg" :src="v.src" />
      </view>
    </view>
    <button class="custom" @click="customerTel">客服电话</button>
    <view class="space"></view>
    <uni-popup ref="popup" background="none">
      <image class="img-bg" :src="imgUrl" @click="closePop" />
    </uni-popup>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import { reportCmPV } from "@/plugins/cloudMonitorHelper";
export default {
  data() {
    return {
      imgs: [
        {
          type: "5",
          src: "https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/tnb.png",
          name: "#糖尿病#",
        },
        {
          type: "6",
          src: "https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/gxy.png",
          name: "#高血压#",
        },
        {
          type: "7",
          src: "https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/bnz.png",
          name: "#白内障#",
        },
      ],
      imgUrl: "https://ggllstatic.hpgjzlinfo.com/static/life/icon-kanbing.png",
      docotor:
        "https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/findDoctor.png",
      logo: "https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/huaxi-bg.png",
      type: 1,
      itemsData: [
        {
          name: "去挂号",
          type: "1",
          des: "在家挂号不排队",
          src: "https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/guahao.png",
        },
        {
          name: "问医生",
          type: "2",
          des: "小毛病在线问诊",
          src: "https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/seeDocotor.png",
        },
      ],
      orderLable: [
        {
          name: "挂号订单",
          type: "3",
          src: "https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/yyNumber.png",
        },
        {
          name: "问诊订单",
          type: "4",
          src: "https://ggllstatic.hpgjzlinfo.com/static/seeDoctor/wenZ.png",
        },
      ],
      userInfor: {},
      phoneNumber: "95169020",
    };
  },
  created() {
    this.userInfor = uni.getStorageSync("userInfo");
    this.initCustomTel();
  },
  onLoad(e) {
    if (e.source === "officialAccount") {
      reportCmPV({ title: "看病服务", query: e });
    }
  },
  mounted() {
    this.$refs.popup.open();
  },

  // 分享处理
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
  },
  methods: {
    closePop() {
      this.$refs.popup.close();
    },
    customerTel() {
      if (!this.phoneNumber) return;
      uni.makePhoneCall({
        phoneNumber: this.phoneNumber,
      });
    },
    initCustomTel() {
      api.getWyCustomerService({
        data: {},
        success: (data) => {
          this.phoneNumber = data;
        },
      });
    },
    goH5(type) {
      this.$refs.popup.open();
      return;
      const url = {
        1: "https://gjylfw.wy.guahao.com/standard/booking?_channel=wbhz",
        2: "https://gjylfw.wy.guahao.com/ums/consult/more?solutionId=SO202206102yj001",
        3: "https://gjylfw.wy.guahao.com/my/order/list?_channel=wbhz",
        4: "https://gjylfw.wy.guahao.com/my/consult/list?_channel=wbhz",
        5: "https://wy.guahao.com/ums/label/bb2901d8-32a1-11e6-95f4-b82a72d5b9fb",
        6: "https://wy.guahao.com/ums/label/880f04cf-32a3-11e6-804e-848f69fd6b70",
        7: "https://wy.guahao.com/ums/label/bff1d756-32a1-11e6-95f4-b82a72d5b9fb",
        8: "https://gjylfw.wy.guahao.com/news/menu",
      };
      // console.log("===选择地址--",url[type])
      const types = ["5", "6", "7"];
      if (types.includes(type)) {
        this.$uni.showToast("正在开通中，敬请期待");
        return;
      }
      api.getInquiryReturnUrl({
        data: {
          ext_user_id: this.userInfor.uactId, // 用户id
          target: url[type],
          mobile: this.userInfor.tel,
        },
        success: (data) => {
          const url = data;
          //  uni.navigateTo({url: `/pages/common/webpage?url=${encodeURIComponent(url)}`})
          //  return
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
      });
    },
    goHX(flag) {
      this.$refs.popup.open();
      return;
      const urls = ["/pages/life/seeDoctor-old", "/pages/life/famouseDoctor"];
      uni.navigateTo({ url: urls[flag] });
    },
  },
};
</script>
<style lang="scss" scoped>
.topArea {
  position: relative;
  background-color: #f5f5f5;
  .bg {
    height: auto;
    background: linear-gradient(
      180deg,
      #ff9500 0%,
      #ffbd6f 32%,
      #ffffff 81%,
      #f2f2f2 100%
    );
    .bg_block {
      width: 686rpx;
      height: 224rpx;
      margin: 0rpx 32rpx 32rpx 32rpx;
      padding-top: 28rpx;
      .topImg {
        width: 100%;
        height: 100%;
      }
    }
    .box {
      display: flex;
      padding: 0rpx 32rpx;
      justify-content: space-between;
      ._block {
        width: 42%;
        height: auto;
        background: #ffffff;
        box-shadow: 0rpx 4rpx 24rpx 0rpx rgba(0, 0, 0, 0.12);
        border-radius: 16rpx;
        padding: 24rpx 20rpx 28rpx 18rpx;
        ._line {
          display: flex;
          justify-content: space-between;
          .name {
            height: 60rpx;
            font-size: 44rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
          .icon_samll {
            width: 96rpx;
            height: 96rpx;
          }
          .right_icon {
            width: 80rpx;
            height: 80rpx;
            margin-bottom: 16rpx;
          }
        }
        ._des {
          height: 44rpx;
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 44rpx;
        }
      }
    }
    .find {
      margin: 32rpx 32rpx;
      background: #ffffff;
      box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.12);
      border-radius: 16rpx;
      display: flex;
      justify-content: space-between;
      .left {
        padding: 20rpx 0rpx 26rpx 24rpx;
        .f_n {
          font-size: 44rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
        .f_infor {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          margin: 12rpx 0 18rpx 0rpx;
        }
        .btn {
          width: 130rpx;
          height: 48rpx;
          line-height: 48rpx;
          text-align: center;
          border-radius: 24rpx;
          border: 2px solid #ff5500;
          color: #ff5500;
        }
      }
      .right {
        height: 236rpx;
        .topImg {
          width: 326rpx;
          height: 236rpx !important;
        }
      }
    }
    .order {
      background: #ffffff;
      border-radius: 16px;
      margin: 32rpx 32rpx;
      box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.12);
      padding: 24rpx 22rpx 26rpx 24rpx;
      .myorder {
        font-size: 40rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        margin-bottom: 24rpx;
      }
      .list {
        display: flex;
        justify-content: space-between;
        ._item {
          display: flex;
          width: 47%;
          height: 116rpx;
          background: #eef5f7;
          border-radius: 8rpx;
          justify-content: space-evenly;
          line-height: 116rpx;
          .topImg {
            width: 60rpx;
            height: 58rpx;
            margin-top: 30rpx;
          }
          .name {
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }
      }
    }
  }
  .health {
    background: #ffffff;
    border-radius: 16px;
    margin: 0rpx 32rpx;
    box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.12);
    ._t {
      display: flex;
      justify-content: space-between;
      height: 50rpx;
      line-height: 50rpx;
      padding: 24rpx 18rpx 18rpx 24rpx;
      .title {
        font-size: 40rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
      .more {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }
    .line {
      position: relative;
      height: 222rpx;
      ._t {
        position: absolute;
        top: 56rpx;
        left: 72rpx;
        font-size: 44rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
      .topImg {
        width: 100%;
        height: 222rpx;
      }
    }
  }
  .custom {
    margin: 48rpx 32rpx 0rpx 32rpx;
    height: 108rpx;
    background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
    border-radius: 54rpx;
    font-size: 44rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 108rpx;
  }
  .space {
    height: 32rpx;
  }
  .img-bg {
    width: 630rpx;
    height: 790rpx;
  }
}
</style>
