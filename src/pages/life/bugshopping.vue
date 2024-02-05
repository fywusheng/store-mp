<template>
  <view class="bugshopping">
    <view class="top" @click="show">
      <image
        class="topbg"
        src="https://ggllstatic.hpgjzlinfo.com/static/life/buy_top.png"
        mode="scaleToFill"
      />
    </view>
    <view class="_center" @click="show">
      <view class="time">
        <view class="h">{{ h }}</view>
        <view class="point">:</view>
        <view class="h">{{ m }}</view>
        <view class="point">:</view>
        <view class="h">{{ s }}</view>
      </view>
      <image
        class="top_c"
        src="https://ggllstatic.hpgjzlinfo.com/static/life/buy_top_c.png"
        mode="scaleToFill"
      />
    </view>
    <view class="_center_p" @click="show">
      <image
        class="top_p"
        src="https://ggllstatic.hpgjzlinfo.com/static/life/buy_top_p.png"
        mode="scaleToFill"
      />
    </view>
    <view class="_bottom">
      <view class="like">猜你喜欢</view>
      <view class="items">
        <view class="item" v-for="(item, i) in list" :key="i" @click="show">
          <view class="top">
            <image class="_top_bg" :src="item.imgPic" />
          </view>
          <view class="bottom">
            <view class="name">{{ item.productName }}</view>
            <view class="info">{{ item.description }}</view>
            <view class="price">
              <view class="_left">{{ item.sales }}</view>
              <view class="_right"
                ><image
                  class="righ_icon"
                  src="https://ggllstatic.hpgjzlinfo.com/static/life/add.png"
              /></view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <modal-know ref="notice"></modal-know>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import modalKnow from "@/pages/life/components/modal-know.vue";

export default {
  components: { modalKnow },
  data() {
    return {
      list: [],
      h: 12,
      m: 10,
      s: 60,
    };
  },
  created() {
    this.getProductList();
    this.countDown();
    this.timeCount = setInterval(() => {
      this.countDown();
    }, 1000);
  },
  // onShow(){
  //     console.log("===onready---",this.h)
  //   this.countDown()
  //   this.timeCount =  setInterval(()=>{
  //       console.log("===倒计时处理中---")
  //       this.countDown()
  //   }, 1000)
  // },
  destroyed() {
    clearInterval(this.timeCount);
  },
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
    // return {
    //     title:'买菜',
    //     path:"/pages/life/bugshopping",
    //  };
  },
  methods: {
    show() {
      this.$refs.notice.open();
    },
    countDown() {
      var startTime = +new Date(2023, 11, 17);
      var nowTime = +new Date();
      var times = (startTime - nowTime) / 1000;
      this.h = parseInt((times / 60 / 60) % 24);
      this.h = this.h < 10 ? "0" + this.h : this.h;
      this.m = parseInt((times / 60) % 60);
      this.m = this.m < 10 ? "0" + this.m : this.m;
      this.s = parseInt(times % 60);
      this.s = this.s < 10 ? "0" + this.s : this.s;
    },
    getProductList() {
      api.getProductList({
        data: {},
        success: (res) => {
          console.log("买菜---", res);
          this.list = res;
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.bugshopping {
  background-color: #f6f6f8;
  .top {
    width: 748rpx;
    height: 1074rpx;
    .topbg {
      width: 100%;
      height: 100%;
      background-size: 100% 100%;
    }
  }
  ._center {
    position: relative;
    width: 750rpx;
    height: 670rpx;
    .top_c {
      width: 100%;
      height: 100%;
      background-size: 100% 100%;
    }
    .time {
      position: absolute;
      display: flex;
      left: 216rpx;
      top: 28rpx;
      text-align: center;
      .h {
        width: 30rpx;
        height: 32rpx;
        background: #ff5500;
        border-radius: 3rpx;
        font-size: 21rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 32rpx;
      }
      .point {
        width: 22rpx;
        height: 30rpx;
        font-size: 21rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ff5500;
        line-height: 30rpx;
      }
    }
  }
  ._center_p {
    width: 750rpx;
    height: 378rpx;
    .top_p {
      width: 100%;
      height: 100%;
      background-size: 100% 100%;
    }
  }
  ._bottom {
    .like {
      font-size: 40rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 56rpx;
      padding-left: 34rpx;
      padding-bottom: 22rpx;
    }
    .items {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding: 0 7rpx;
      .item {
        display: flex;
        flex-direction: column;
        width: 336rpx;

        background: #ffffff;
        border-radius: 16rpx;
        border: 4rpx solid #e5d6b6;
        margin-bottom: 24rpx;
        padding: 2rpx;
        .top {
          width: 336rpx;
          height: 336rpx;
          background: #ffffff;
          border-radius: 16rpx 16rpx 0rpx 0rpx;
          ._top_bg {
            width: 100%;
            height: 100%;
          }
        }
        .bottom {
          padding-left: 16rpx;
          padding-right: 14rpx;
          .name {
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 50rpx;
            margin-bottom: 8rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            height: 100rpx;
          }
          .info {
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 44rpx;
            margin-bottom: 20rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .price {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 20rpx;
            ._left {
              font-size: 36rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #eb3030;
              line-height: 50rpx;
            }
            ._right {
              width: 36rpx;
              height: 36rpx;
              .righ_icon {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
