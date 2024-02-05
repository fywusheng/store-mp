<template>
  <view class="result">
    <image class="_img" :src="imgs[type]" mode="widthFix" />
    <view class="infor" :class="type == 2 ? 'errorInfor' : ''">{{
      infor[type]
    }}</view>
    <view class="centent">{{ content[type] }}</view>
    <view class="btn" @click="compet">完成</view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      type: 1, // 1-right 2-error
      imgs: {
        1: "https://ggllstatic.hpgjzlinfo.com/static/user-center/right.png",
        2: "https://ggllstatic.hpgjzlinfo.com/static/user-center/error.png",
      },
      infor: { 1: "注销成功", 2: "注销失败" },
      content: {
        1: "您已成功注销账号",
        2: "您的账号有正在进行中的订单 如需注销账号,请完成订单后再重试",
      },
    };
  },
  computed: {},
  onLoad(e) {
    if (e.type) {
      this.type = e.type;
    }
  },

  methods: {
    compet() {
      uni.reLaunch({ url: "/pages/index/mine" });
    },
  },
};
</script>

<style lang="scss" scoped>
.result {
  text-align: center;
  & > image {
    width: 220rpx;
    margin-top: 160rpx;
    margin-bottom: 32rpx;
  }
  .infor {
    width: 100%;
    text-align: center;
    height: 72rpx;
    font-size: 50rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fe6a00;
    line-height: 72rpx;
    margin-bottom: 32rpx;
  }
  .errorInfor {
    color: #eb3030;
  }
  .centent {
    width: 80%;
    margin: 0 auto;
    font-size: 36rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    text-align: center;
  }
  .btn {
    width: 85%;
    height: 108rpx;
    border-radius: 54rpx;
    border: 2rpx solid #ff5500;
    margin: 218rpx auto;
    font-size: 44rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ff5500;
    line-height: 108rpx;
  }
}
</style>
