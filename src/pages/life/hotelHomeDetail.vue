<template>
  <view class="hotelDetail">
    <image :src="hotelPhoto" class="topBg" />
    <view class="item2">
      <view class="top">
        <view class="top_c">
          <view class="name">{{ hotelName }}</view>
          <view class="price">{{ address }}</view>
          <view class="lineB">
            <view class="distance">距您{{ setDistance(distance) }}</view>
            <view class="gomap" @click="goMap()">
              <view class="icon">
                <image
                  class="im"
                  src="https://ggllstatic.hpgjzlinfo.com/static/life/micon.png"
                  mode="scaleToFill"
                />
              </view>
              地图
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="select">
      <view class="pd" @click="clickItem(1)">
        <view :class="{ select_name: type == 1 ? true : false }">住宿</view>
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
      <view v-if="type == 1"> </view>
      <view v-if="type == 2">
        <view
          class="item3"
          v-for="(item, index) in list"
          :key="index"
          @click="hostDetail(item)"
        >
          <view class="top">
            <view class="img_qy">
              <image
                :src="item.hotelDiscountMainPhoto"
                class="bgimg"
                mode="scaleToFill"
              />
            </view>
            <view class="top_c">
              <view class="name">{{ item.hotelDiscountName }}</view>
              <view class="person">{{ item.hotelDiscountUsePeoples }}</view>
              <view class="time">{{ item.hotelDiscountValidity }}</view>
              <view class="price"
                >￥{{ formaterMoney(item.hotelDiscountPrice) }}</view
              >
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
import right from "@/pages/life/components/right.vue";
import modalKnow from "@/pages/life/components/modal-know.vue";
export default {
  components: { right, modalKnow },
  data() {
    return {
      list: [],
      hotelName: "",
      hotelPhoto: "",
      address: "",
      distance: "",
      lat: "",
      lon: "",
      item: {},
      picArray: [],
      picConent: [],
      type: 2,
    };
  },
  created() {},
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
    // const params = {
    //    address:this.address,
    //    hotelName:this.hotelName,
    //    hotelPhoto:this.hotelPhoto,
    //    lat:this.lat,
    //    lon:this.lon,
    //    distance:this.distance
    //  }
    //   return {
    //       title:'酒店详情',
    //       path:"/pages/life/hotelHomeDetail?params="+`${encodeURIComponent(JSON.stringify(params))}`,
    //    };
  },
  onLoad(option) {
    const data = JSON.parse(decodeURIComponent(option.params));
    console.log("===onload---", data);
    this.address = data.address;
    this.hotelPhoto = data.hotelPhoto;
    this.hotelName = data.hotelName;
    this.hotelId = data.hotelId;
    this.lat = data.lat;
    this.lon = data.lon;
    this.distance = data.distance;
    this.queryHotelsinsert();
  },
  methods: {
    setDistance(s) {
      s = Number(s / 1000);
      if (s.toFixed(2) < 1) {
        return s.toFixed(2) * 1000 + "米";
      } else {
        return s.toFixed(2) + "公里";
      }
    },
    formaterMoney(v) {
      return (v / 100).toFixed(2);
    },
    goMap() {
      const params = {
        name: this.hotelName,
        longitude: this.lon - 0,
        latitude: this.lat - 0,
        distance: this.distance,
        address: this.address,
        hotelPhoto: this.hotelPhoto,
      };
      uni.navigateTo({
        url:
          "/pages/life/mapShow?params=" +
          `${encodeURIComponent(JSON.stringify(params))}`,
      });
    },
    hostDetail(item) {
      uni.redirectTo({
        url:
          "/pages/life/hotelDetail?hotelDiscountId=" +
          item.hotelDiscountId +
          "&change=1" +
          "&hotelName=" +
          this.hotelName +
          "&hotelId=" +
          this.hotelId,
      });
    },
    clickItem(type) {
      if (type == 1) {
        this.$refs.notice.open();
      }
      // TODO 住宿没有 暂时不坐type切换
      // this.type = type
      this.type = 2;
    },
    queryHotelsinsert() {
      api.queryHotelsinsert({
        data: { hotelName: this.hotelName },
        success: (res) => {
          this.list = res;
        },
        fail: (res) => {},
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.hotelDetail {
  position: relative;
  background-color: #fff;
  .topBg {
    width: 750rpx;
    height: 472rpx;
  }
  .select {
    font-size: 36rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 72rpx;
    position: absolute;
    top: 680rpx;
    display: flex;
    padding-left: 34rpx;
    margin-top: 20rpx;
    .pd {
      margin-right: 34rpx;
      width: 250rpx;
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
    height: 100vh;
    margin-top: 320rpx;
    background: #f2f2f2;
    padding-top: 28rpx;
  }
  .item2 {
    position: absolute;
    top: 350rpx;
    width: 686rpx;
    background: #ffffff;
    box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 16rpx;
    margin: 52rpx 32rpx 32rpx 32rpx;
    .top {
      .top_c {
        padding: 30rpx;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
      }
      .name {
        font-size: 40rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
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
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        margin-top: 40rpx;
        margin-bottom: 30rpx;
      }
      .lineB {
        display: flex;
        justify-content: space-between;
        .distance {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
        .gomap {
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          display: flex;
          .icon {
            width: 32rpx;
            height: 36rpx;
            margin-right: 10rpx;
            .im {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
  .item3 {
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
        height: 200rpx;
        margin-right: 16rpx;
        margin-top: 3rpx;
        .bgimg {
          width: 100%;
          height: 100%;
        }
      }
      .top_c {
        display: flex;
        flex-direction: column;
        .name {
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          width: 400rpx;
        }
        .person {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          margin-top: 10rpx;
        }
        .time {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          margin-top: 16rpx;
          margin-bottom: 16rpx;
        }
        .price {
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ff5500;
        }
      }
    }
  }
}
</style>
