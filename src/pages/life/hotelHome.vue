<template>
  <view class="hotelDetail">
    <view class="select">
      <view class="pd" @click="clickItem(1)">
        <view :class="{ select_name: type == 1 ? true : false }">附近酒店</view>
        <view class="bottom_line" v-if="type == 1"></view>
      </view>
      <view class="pd" @click="clickItem(2)">
        <view :class="{ select_name: type == 2 ? true : false }"
          >酒店配套餐饮</view
        >
        <view class="bottom_line" v-if="type == 2"></view>
      </view>
    </view>
    <view class="content">
      <view v-if="type == 1">
        <view v-if="list.length > 0">
          <view
            class="item"
            v-for="(item, index) in list"
            :key="index"
            @click="hostDetail(item)"
          >
            <view class="top">
              <view class="img_qy">
                <image
                  :src="item.hotelPhoto"
                  class="bgimg"
                  mode="scaleToFill"
                />
              </view>
              <view class="top_c">
                <view class="name">{{ item.hotelName }}</view>
                <view class="price">
                  <view class="icon"
                    ><image
                      class="im"
                      src="https://ggllstatic.hpgjzlinfo.com/static/life/micon.png"
                      mode="scaleToFill"
                  /></view>
                  <view class="addres">{{ item.address }}</view>
                </view>
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
      <view v-if="type == 2"><hotelList></hotelList></view>
    </view>
    <modal-know ref="notice"></modal-know>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import right from "@/pages/life/components/right.vue";
import hotelList from "@/pages/life/components/hotelList.vue";
import modalKnow from "@/pages/life/components/modal-know.vue";
export default {
  components: { right, modalKnow, hotelList },
  data() {
    return {
      loading: 1,
      list: [],
      longitude: "",
      latitude: "",
      hotelDiscountId: "",
      item: {},
      picArray: [],
      picConent: [],
      type: 1,
    };
  },
  created() {
    console.log("====11酒店初始化---");
    uni.getLocation({
      type: 0,
      // #ifdef MP-WEIXIN
      type: "gcj02",
      // #endif
      success: (res) => {
        console.log("===定位---", res);
        this.latitude = res.latitude;
        this.longitude = res.longitude;
        this.queryHotels();
      },
      fail: (err) => {
        console.log("===异常---", err);
        this.$uni.showToast(err);
      },
    });
  },
  onLoad(option) {},
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
    // return {
    //     title:'酒店',
    //     path:"/pages/life/hotelHome",
    //  };
  },
  methods: {
    hostDetail(item) {
      const params = {
        address: item.address,
        hotelName: item.hotelName,
        hotelId: item.hotelId,
        hotelPhoto: item.hotelPhoto,
        lat: item.lat,
        lon: item.lon,
        distance: item.distance,
      };
      uni.navigateTo({
        url:
          "/pages/life/hotelHomeDetail?params=" +
          `${encodeURIComponent(JSON.stringify(params))}`,
      });
    },
    queryHotels() {
      api.queryHotels({
        data: {
          lat: this.latitude,
          lon: this.longitude,
        },
        success: (res) => {
          this.list = res;
          // this.list = []
          if (this.list.length == 0) {
            this.loading = 2;
          }
        },
        fail: (res) => {},
      });
    },
    buy() {
      this.$refs.notice.open();
    },
    clickItem(type) {
      this.type = type;
      if (type == 1) {
        this.queryHotels();
      }
    },
    queryByDiscountId() {
      api.queryByDiscountId({
        data: { hotelDiscountId: this.hotelDiscountId },
        success: (res) => {
          this.item = res;
          const hotelList = res.hotelDiscountContent;
          this.picArray = hotelList.split(",");
          const listpic = hotelList.split(",");

          listpic.push(res.hotelDiscountRule);
          console.log("====suzhu111---", listpic);
          this.picConent = listpic.slice(1, listpic.length);
          console.log("====suzhu33---", this.picConent);
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
.hotelDetail {
  background-color: #f5f5f5;
  margin-top: -2.6%;
  .select {
    margin-bottom: 0.32rem;
    background-color: #fff;
    font-size: 36rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 72rpx;
    display: flex;
    padding-left: 34rpx;
    margin-top: 20rpx;
    justify-content: space-around;
    .pd {
      margin-right: 34rpx;
      display: flex;
      flex-direction: column;
      height: 100rpx;
      align-items: center;
      .select_name {
        font-size: 40rpx;
        font-weight: 600;
      }
      .bottom_line {
        width: 70rpx;
        height: 10rpx;
        background: linear-gradient(90deg, #ff7936 0%, #ff5121 100%);
        border-radius: 5rpx;
      }
    }
  }
  .content {
    .hotel {
      background-color: #f2f2f2;
      padding-top: 32rpx;
    }
  }
  .item {
    background: #ffffff;
    box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 16rpx;
    margin: 0rpx 32rpx 32rpx 32rpx;
    padding: 20rpx 20rpx 18rpx 20rpx;
    .top {
      display: flex;
      justify-content: flex-start;
      .img_qy {
        width: 214rpx;
        height: 176rpx;
        margin-right: 16rpx;
      }
      .top_c {
        display: flex;
        flex-direction: column;
      }
      .bgimg {
        width: 100%;
        height: 100%;
        border-radius: 8rpx;
      }
      .name {
        font-size: 40rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        width: 390rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        margin-right: 70rpx;
        margin-bottom: 72rpx;
      }
      .price {
        display: flex;
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        height: 40rpx;
        line-height: 40rpx;
        .icon {
          width: 28rpx;
          height: 32rpx;
          margin-right: 11rpx;
          .im {
            width: 100%;
            height: 100%;
          }
        }
        .addres {
          width: 390rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
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
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        height: 50rpx;
        display: flex;
        margin-bottom: 10rpx;
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
