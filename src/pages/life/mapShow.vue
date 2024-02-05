<template>
  <view class="map">
    <map
      ref="map"
      id="map"
      :show-scale="true"
      class="map-view"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
    />
    <view class="_bottom">
      <view class="swiper-item">
        <!-- <view class="map-icon" @click="handleAnimation">
                <image mode="scaleToFill" src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-arrow-upward.png"/>
              </view> -->
        <view class="item3">
          <view class="top">
            <view class="img_qy">
              <image
                :src="transformData.hotelPhoto"
                class="bgimg"
                mode="scaleToFill"
              />
              <!-- <image src="https://ggllstatic.hpgjzlinfo.com/static/home/image-home-article-default.png" class="bgimg" mode="widthFix"/> -->
            </view>
            <view class="top_c">
              <view class="name">{{ transformData.name }}</view>
              <view class="time"
                >住宿 | {{ setDistance(transformData.distance) }}</view
              >
              <view class="price">{{ transformData.address }}</view>
            </view>
          </view>
        </view>
        <view class="functions">
          <view class="item" @click.stop="makeToCar">
            <image
              class="icon"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-take-taxi.png"
            />
            <text class="fs-36 c-black mt-8">打车</text>
          </view>
          <view
            class="direction flex-h flex-c-c ml-12"
            @click.stop="handleDirectionClick()"
          >
            <image
              class="icon"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-direction.png"
            />
            <text class="fs-40 c-white ml-12">路 线</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import { showToast } from "@/utils/uni";
export default {
  components: { uniPopup },
  data() {
    return {
      id: "1",
      transformData: {},
      latitude: 30.305864,
      longitude: 120.128179,
      markers: [],
    };
  },
  beforeCreate() {},
  onLoad(e) {
    const params = e.params;
    if (params) {
      this.transformData = JSON.parse(decodeURIComponent(params));
      this.latitude = this.transformData.latitude;
      this.longitude = this.transformData.longitude;
      // #ifdef MP-ALIPAY
      this.markers = [
        {
          width: "60",
          height: "60",
          label: {
            content: this.transformData.name,
            bgColor: "#fff",
            color: "#333",
            padding: 12,
            fontSize: 16,
            borderRadius: 8,
          },
          latitude: this.transformData.latitude,
          longitude: this.transformData.longitude,
          iconPath:
            "https://ggllstatic.hpgjzlinfo.com/static/life/marker-icon8.png",
        },
      ];
      // #endif
      // #ifdef MP-WEIXIN
      this.markers = [
        {
          width: "60",
          height: "60",
          callout: {
            bgColor: "#fff",
            color: "#333",
            padding: "8",
            fontSize: "16",
            borderRadius: "8",
            content: this.transformData.name,
            display: "ALWAYS",
          },
          latitude: this.transformData.latitude,
          longitude: this.transformData.longitude,
          iconPath:
            "https://ggllstatic.hpgjzlinfo.com/static/life/marker-icon8.png",
        },
      ];
      // #endif
    }
  },
  onReady() {
    this.$uni.setTitle(
      this.transformData.name.length > 12
        ? this.transformData.name.substring(0, 12) + "..."
        : this.transformData.name
    );
  },
  onShow() {},
  onUnload() {},
  watch: {},
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
    // return {
    //   title:'',
    //   path:
    //     "/pages/map/map",
    // };
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
    // 导航点击事件
    handleDirectionClick() {
      const data = {
        name: this.transformData.name,
        longitude: this.transformData.longitude,
        latitude: this.transformData.latitude,
        distance: this.transformData.distance,
        address: this.transformData.address,
      };
      uni.navigateTo({
        url:
          "/pages/map/direction?data=" +
          encodeURIComponent(JSON.stringify(data)),
        success: (res) => {
          res.eventChannel.emit("didOpenPageFinish", data);
        },
      });
    },
    /**
     * 打车
     */
    makeToCar() {
      showToast({
        title: "功能建设中，尽情期待",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.map-view {
  width: 100vw;
  // height: calc(100vh - 342rpx);
  height: 100vh;
}
._bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.swiper-item {
  margin: 40rpx;
  background: #fff;
  box-shadow: 0rpx -4rpx 6rpx 0rpx rgba(0, 0, 0, 0.08);
  border-radius: 24rpx;
  padding: 30rpx;
  .map-icon {
    width: 50rpx;
    height: 15rpx;
  }
  .item3 {
    margin-bottom: 30rpx;
    background: #ffffff;
    border-radius: 16rpx;
    .top {
      display: flex;
      justify-content: flex-start;
      .img_qy {
        width: 214rpx;
        height: 176rpx;
        margin-right: 16rpx;
        .bgimg {
          width: 100%;
          height: 100%;
        }
      }
      .top_c {
        display: flex;
        flex-direction: column;
        .name {
          font-size: 44rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          width: 370rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
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
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #666;
          width: 370rpx;
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
  }
  .functions {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .item {
      .icon {
        @include square(48);
      }
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 115rpx;
    }
    .direction {
      @include size(240, 100);
      background: linear-gradient(to right, $color-secondary, $color-primary);
      border-radius: 50rpx;
      .icon {
        @include square(48);
      }
    }
  }
}
</style>
