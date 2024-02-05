<template>
  <view class="index">
    <!-- 头部导航栏 -->
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <template v-slot:title1>
        <view class="navigation-bar flex-h flex-c-s">
          <view class="back-icon"></view>
          <image
            class="icon-desc"
            @click="handleDesc"
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-desc.png"
            mode="scaleToFill"
          />
          <text class="desc fs-36">说明</text>
          <view class="navigation-bar__title fs-44 c-black flex-1">
            优惠买单
          </view>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="0" statusBackGround="#fff">
      <template v-slot:title1>
        <view class="navigation-bar flex-h flex-c-s">
          <image
            class="back-icon"
            @click="handleNavBack"
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-arrow-left.png"
            mode="scaleToFill"
          />
          <image
            class="icon-desc"
            @click="handleDesc"
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-desc.png"
            mode="scaleToFill"
          />
          <text class="desc">说明</text>
          <view
            @click="handleDesc"
            class="navigation-bar__title fs-44 c-black flex-1"
          >
            优惠买单
          </view>
        </view>
      </template>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <!-- banner -->
    <view class="mb-24">
      <swiper
        class="banners"
        :autoplay="true"
        :circular="true"
        :indicator-dots="banners.length > 1"
        indicator-active-color="white"
      >
        <swiper-item class="item" v-for="(item, index) in banners" :key="index">
          <image
            class="image"
            mode="scaleToFill"
            :src="item.bannerUrl"
            @error="handleBannerLoadFail(index)"
          />
        </swiper-item>
      </swiper>
    </view>
    <!-- 超时列表 -->
    <view class="flex-h flex-c-b flex-wrap ml-32 mr-32 mt-24 supmarket">
      <view
        class="market flex-v flex-c-c mb-24"
        v-for="(item, index) in supermarketList"
        @click="handleDetailClick(item)"
        :key="index"
      >
        <image class="market-logo" :src="item.logo" mode="scaleToFill" />
        <view class="line"></view>
        <view class="market-name">{{ item.supermarketName }}</view>
        <view class="count flex-h flex-c-c">
          <image
            class="img"
            src="https://ggllstatic.hpgjzlinfo.com/static/supermarket/icon-discount.png"
            mode="scaleToFill"
          />
          <view class="text">{{ markrtDiscount(item.showDiscount) }}折</view>
        </view>
      </view>
    </view>
    <!-- 拖动悬浮框 -->
    <easy-hover :iconUrl="iconUrl" @taped="handleEasyClick"></easy-hover>
  </view>
</template>

<script>
import api from "@/apis/index.js";
import EasyHover from "./components/easy-hover.vue";
import NavigationBar from "../../components/common/navigation-bar.vue";
export default {
  components: { EasyHover, NavigationBar },
  data() {
    return {
      // 轮播图列表
      banners: [{}],
      // 商超列表
      supermarketList: [],
      // 商超的城市信息
      city: {},

      iconUrl:
        "https://ggllstatic.hpgjzlinfo.com/static/supermarket/img-myOrder.png",

      title: "优惠买单",

      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 状态栏高度
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
    };
  },
  onLoad() {
    this.getBannerList();
    this.getSupermarketList();
    // this.getLocation()
  },
  onShareAppMessage() {
    return {
      title: "优惠买单",
      path: "/pages/index/index?index=0",
    };
  },
  methods: {
    // 点击我的订单
    handleEasyClick() {
      uni.navigateTo({
        url: "/pages/order/orderList",
      });
    },
    // 点击说明
    handleDesc() {
      uni.navigateTo({
        url: "/pages/supermarket/discount-detail",
      });
    },
    // 返回上一页
    handleNavBack() {
      uni.navigateBack();
    },

    /**
     * 获取当前定位
     */
    getLocation() {
      uni.getLocation({
        type: "gcj02",
        success: (res) => {
          uni.setStorageSync("location", res);
          // 调用高德地图 API 逆地理编码, 通过经纬度获取当前位置城市信息
          api.regeoMap(
            {
              location: res.longitude + "," + res.latitude,
            },
            {
              success: (amap) => {
                const city = {
                  code:
                    amap.regeocode.addressComponent.adcode.substr(0, 4) + "00",
                  longitude: res.longitude,
                  latitude: res.latitude,
                };
                // 当城市是省直辖县时返回为空，以及城市为北京、上海、天津、重庆四个直辖市时，该字段返回为[],否则为城市名称（字符串）
                if (amap.regeocode.addressComponent.city.length === 0) {
                  city.name = amap.regeocode.addressComponent.province;
                } else {
                  city.name = amap.regeocode.addressComponent.city;
                }
                uni.setStorageSync("supermarketCity", city);
                this.city = city;
                this.getSupermarketList();
              },
            }
          );
        },
        fail: () => {
          // // 定位失败默认北京市
          // const city = { code: 110100, name: '北京市' }
          // this.handleSelectCity(city)
        },
      });
    },
    // 获取 轮播列表
    getBannerList() {
      api.bannerForPay({
        success: (data) => {
          this.banners = data;
        },
      });
    },
    // 获取品牌商家列表（有排序）
    getSupermarketList() {
      api.getSupermarket({
        data: {
          isOnlyCheck: "0",
          // lat: this.city.latitude,
          // lon: this.city.longitude,
          // cityCode: this.city.code,
        },
        showsLoading: true,
        success: (data) => {
          console.log("超市列表：", data.result);
          if (data && data.result) {
            this.supermarketList = data.result;
          }
        },
      });
    },
    /**
     * 轮播图加载失败事件
     */
    handleBannerLoadFail(index) {
      // 图片加载失败时显示默认图片
      this.banners[index].bannerUrl =
        "https://ggllstatic.hpgjzlinfo.com/static/home/banner-home-default.png";
    },

    // 进入超市
    handleDetailClick(data) {
      uni.navigateTo({
        url:
          "/pages/supermarket/market?info=" +
          encodeURIComponent(JSON.stringify(data)),
      });
    },
    markrtDiscount(num) {
      return (Number(num) * 10).toFixed(2);
    },
  },
};
</script>

<style lang="scss" scoped>
.index {
  background: #f2f2f2;
  // 头部
  .navigation-bar {
    box-sizing: border-box;
    padding-left: 24rpx;
    width: 100vw;
    height: 100%;
    .back-icon {
      flex-shrink: 0;
      width: 44rpx;
      height: 44rpx;
      margin-right: 20rpx;
      position: relative;
      z-index: 10;
    }
    .icon-desc {
      flex-shrink: 0;
      width: 40rpx;
      height: 42rpx;
      margin-right: 12rpx;
      position: relative;
      z-index: 10;
    }
    .desc {
      color: #666666;
    }
    .navigation-bar__title {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      background-color: #fff;
      top: -40rpx;
      padding-top: 42rpx;
    }
  }

  // 新版banner
  .banners {
    height: 288rpx;
    .item {
      .image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .supmarket {
    .market {
      flex-shrink: 0;
      width: 328rpx;
      height: 318rpx;
      background: #ffffff;
      border-radius: 16rpx;
      border: 2rpx solid #eeeeee;
      position: relative;
      display: flex;
      padding: 12rpx;
      box-sizing: border-box;
      .market-logo {
        flex-shrink: 0;
        width: 200rpx;
        height: 144rpx;
        margin-bottom: 10rpx;
      }
      .market-name {
        font-size: 40rpx;
        font-weight: bold;
        color: #333333;
        line-height: 56rpx;
        margin: 14rpx 0 8rpx 0;
      }
      .line {
        width: 100%;
        height: 2rpx;
        background: #eeeeee;
      }
      .count {
        position: relative;
        top: 0;
        right: 0;
        width: 144rpx;
        height: 48rpx;
        background: #ff5500;
        border-radius: 24rpx;
        display: flex;
        justify-content: center;
        .img {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          width: 126rpx;
          height: 50rpx;
        }
        .text {
          font-size: 32rpx;
          // font-weight: bold;
          color: #ffffff;
          line-height: 44rpx;
          position: relative;
          z-index: 2;
          padding-left: 16rpx;
        }
      }
    }
  }
}
</style>
