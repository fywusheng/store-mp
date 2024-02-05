<template>
  <view class="hotel">
    <view v-if="list.length > 0">
      <view
        class="item"
        v-for="(item, index) in list"
        :key="index"
        @click="hostDetail(item)"
      >
        <view class="top">
          <image
            :src="item.hotelDiscountLogo"
            class="bgimg"
            mode="scaleToFill"
          />
          <view class="top_c">
            <view class="name">{{ item.hotelDiscountName }}</view>
            <!-- <view class="price">￥{{item.hotelDiscountPrice}}</view> -->
          </view>
        </view>
        <view class="bottom">
          <view class="infor">
            <image
              src="https://ggllstatic.hpgjzlinfo.com/static/life/house.png"
              class="hourse"
            />
            <rich-text :nodes="item.show_num"></rich-text>
          </view>
          <view class="time">
            <image
              src="https://ggllstatic.hpgjzlinfo.com/static/life/time.png"
              class="hourse"
            />
            {{ item.hotelDiscountValidity }}
          </view>
        </view>
      </view>
    </view>

    <block v-else>
      <view class="flex-v flex-c-c status-box2" v-if="loading === 1">
        <image
          src="https://ggllstatic.hpgjzlinfo.com/static/common/business_loading.gif"
          mode="scaleToFill"
        />
      </view>
      <view class="flex-v flex-c-c status-box3" v-else>
        <image
          src="https://ggllstatic.hpgjzlinfo.com/static/common/status-none2x.png"
          mode="scaleToFill"
        />
        <view class="flex-c-c status-text">暂无内容</view>
      </view>
    </block>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import parse from "mini-html-parser2";
export default {
  data() {
    return {
      strings: "",
      pageNum: 1,
      pageSize: 20,
      list: [],
      loading: 1,
    };
  },
  created() {
    this.hotelList();
  },
  onReachBottom() {
    // 上拉加载
    this.hotelList();
  },
  onPullDownRefresh() {
    // 下拉刷新
    this.hotelList();
  },
  methods: {
    turnValue(match) {
      return `<span style="color:red">${match}</span>`;
    },
    change(value) {
      if (!value) {
        this.strings = "";
        return "";
      } else {
        const str = value.replace(/\d+/g, this.turnValue);
        // TODO Alipay必须 parse 富文本才会解析
        parse(str, (e, newstring) => {
          this.strings = newstring;
        });
        // #ifdef MP-WEIXIN
        return value.replace(/\d+/g, this.turnValue);
        // #endif
        // #ifdef MP-ALIPAY
        return this.strings;
        // #endif
      }
    },
    hostDetail(item) {
      uni.navigateTo({
        url:
          "/pages/life/hotelDetail?hotelDiscountId=" +
          item.hotelDiscountId +
          "&type=2&isShowPrice=2&change=null",
      });
    },
    hotelList() {
      api.gethotelList({
        data: { page: this.pageNum, pageSize: this.pageSize },
        success: (res) => {
          const list = res.list || [];
          if (list.length > 0) {
            this.pageNum = this.pageNum + 1;
            list.forEach((element) => {
              const ele = element;
              ele["show_num"] = this.change(ele.hotelDiscountDesc);
              this.list.push(ele);
            });
          }
          if (list.length == 0) {
            this.loading = 2;
          }
        },
        fail: (res) => {},
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.status-box2 {
  height: 100vh;
  background-color: #fff;
  image {
    width: 160rpx;
    height: 160rpx;
  }
}
.status-box3 {
  height: 100vh;
  background-color: #fff;
  margin-top: -20%;
  image {
    width: 440rpx;
    height: 270rpx;
    margin-bottom: 24rpx;
  }
}
.hotel {
  .item {
    width: 686rpx;
    height: 334rpx;
    background: #ffffff;
    box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 16rpx;
    margin: 32rpx;
    .top {
      width: 686rpx;
      height: 162rpx;
      position: relative;
      .top_c {
        position: absolute;
        display: flex;
        justify-content: space-between;
        top: 54rpx;
        left: 20rpx;
      }
      .bgimg {
        width: 100%;
        height: 100%;
      }
      .name {
        font-size: 40rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 56rpx;
        width: 600rpx;
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
      margin-top: 30rpx;
      margin-left: 20rpx;
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
}
</style>
