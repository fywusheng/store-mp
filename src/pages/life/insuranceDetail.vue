<template>
  <view class="insurance">
    <modal-know ref="notice"> </modal-know>
    <rich-text
      type="text"
      class="_center"
      :nodes="insuranDetal"
      @click="showNotice"
    ></rich-text>
    <view class="bottom">
      <view class="_left">
        <view class="money">￥{{ prices.split("/")[0] }}</view>
        <view class="danwei"></view>
      </view>
      <view class="no" @click="showNotice">马上咨询</view>
      <view class="tb" @click="showNotice">立即投保</view>
    </view>
  </view>
</template>
<script>
// import uniPopup from '@/components/uni-popup/uni-popup.vue'
import modalKnow from "@/pages/life/components/modal-know.vue";
// import api from '@/apis/index.js'
import parse from "mini-html-parser2";
export default {
  components: { modalKnow },
  data() {
    return {
      insuranDetal: "",
      prices: "",
    };
  },
  filters: {},
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
    // return {
    //   title:'保险详情',
    //   path:
    //     "/pages/life/insuranceDetail?price="+`${this.prices.productPrice}`,
    // };
  },
  onLoad(e) {
    const detail = uni.getStorageSync("insuranDetal") || "";
    this.insuranDetal = detail
      .replace('<body style="margin:0; padding:0">', "")
      .replace("</body>", "");
    parse(this.insuranDetal, (err, nodesList) => {
      this.insuranDetal = nodesList;
    });
    if (e.price) {
      this.prices = e.price;
    }
  },
  methods: {
    showNotice() {
      this.$refs.notice.open();
    },
  },
};
</script>
<style lang="scss" scoped>
.bottom {
  display: flex;
  height: 176rpx;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  line-height: 176rpx;
  justify-content: space-around;
  ._left {
    display: flex;
    width: 200rpx;
    .money {
      font-size: 56rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ff711a;
    }
    .danwei {
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
  }
  .no {
    width: 212rpx;
    height: 96rpx;
    background: linear-gradient(144deg, #ffc300 0%, #ff9900 100%);
    font-size: 40rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 96rpx;
    text-align: center;
    border-radius: 47rpx;
    margin-top: 38rpx;
  }
  .tb {
    width: 212rpx;
    height: 96rpx;
    background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
    line-height: 96rpx;
    text-align: center;
    margin-top: 38rpx;
    font-size: 40rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    border-radius: 47rpx;
  }
}
</style>
