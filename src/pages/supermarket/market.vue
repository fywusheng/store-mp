<template>
  <view class="market">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <view class="back-icon"></view>
          <image
            class="icon-desc"
            @click="handleHomeBack"
            src="http://192.168.1.187:10088/static/supermarket/icon-index.png"
            mode="scaleToFill"
          />

          <text class="navigation-bar__title fs-44 c-black flex-1">
            {{ title }}
          </text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="1">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: '44px' }">
          <image
            class="back-icon"
            @click="handleNavBack"
            src="http://192.168.1.187:10088/static/supermarket/icon-arrow-left.png"
            mode="scaleToFill"
          />
          <image
            class="icon-desc"
            @click="handleHomeBack"
            src="http://192.168.1.187:10088/static/supermarket/icon-index.png"
            mode="scaleToFill"
          />

          <text class="navigation-bar__title fs-44 c-black flex-1">
            {{ title }}
          </text>
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view class="page-header mt-16">
      <image
        class="bg"
        src="http://192.168.1.187:10088/static/supermarket/bg-card.png"
        mode="scaleToFill"
      />
      <view class="market-card bg-white br-24">
        <view class="flex-h flex-c-s">
          <image class="logo" :src="info.logo" mode="aspectFill" />
          <text>{{ info.supermarketName }}</text>
        </view>
        <view class="store">使用门店：{{ info.supermarketName }}</view>
        <view class="flex-h address" @click="handleDirectionClick">
          <image
            class="location"
            src="http://192.168.1.187:10088/static/supermarket/icon-location.png"
            mode="scaleToFill"
          />

          <template v-if="loading == 2">
            <view class="detail-address">{{ storeList[0].address }}</view>
            <view class="distance">距您{{ storeList[0].distance | setDistance }}</view>
          </template>
          <template v-if="loading == 3">
            <view class="distance2">该城市无门店</view>
          </template>
        </view>
      </view>
      <image
        class="header-meng"
        src="http://192.168.1.187:10088/static/supermarket/card-bottom.png"
        mode="scaleToFill"
      />
      <view class="discount">
        <image
          class="img"
          src="http://192.168.1.187:10088/static/supermarket/bg-discount.png"
          mode="scaleToFill"
        />
        <view class="count">{{ info.showDiscount | markrtDiscount }}折</view>
      </view>
    </view>
    <view
      v-if="otherMarketNum > 1"
      class="other-store flex-h flex-c-b ml-32 bg-white"
      @click="handleOtherMarket"
    >
      <view class="fs-36">查看其他门店地址</view>
      <image
        class="img"
        src="http://192.168.1.187:10088/static/supermarket/icon-arrow.png"
        mode="scaleToFill"
      />
    </view>
    <view class="grey-bar"></view>
    <view class="page-main bg-white">
      <view class="tab-bar flex-h flex-c-s mb-12">
        <view
          :class="tabIndex === '0' ? 'active item fw-bold' : 'item'"
          @click="handleTabClick('0')"
        >
          使用说明
        </view>
        <view
          :class="tabIndex === '1' ? 'active item fw-bold' : 'item'"
          @click="handleTabClick('1')"
        >
          注意事项
        </view>
      </view>
      <view class="section" v-if="tabIndex === '0'">
        <view class="title flex-h flex-c-s fw-bold">
          <image
            class="icon-title mr-16"
            src="http://192.168.1.187:10088/static/supermarket/icon-title.png"
            mode="scaleToFill"
          />
          <view>收银方式</view>
        </view>
        <view class="pay-type flex-h flex-c-b">
          <view class="flex-h flex-c-c">
            <image
              class="pay-icon"
              src="http://192.168.1.187:10088/static/supermarket/person-pay.png"
              mode="scaleToFill"
            />
            <view class="text">人工收银</view>
          </view>
          <view class="flex-h flex-c-c">
            <image
              class="pay-icon"
              src="http://192.168.1.187:10088/static/supermarket/machine-pay.png"
              mode="scaleToFill"
            />
            <view class="text">自助收银</view>
          </view>
        </view>
        <view class="title flex-h flex-c-s fw-bold">
          <image
            class="icon-title mr-16"
            src="http://192.168.1.187:10088/static/supermarket/icon-title.png"
            mode="scaleToFill"
          />
          <view>使用说明</view>
        </view>
        <view>
          <rich-text :nodes="nodes"></rich-text>
        </view>
      </view>
      <view v-if="tabIndex === '1'">
        <view class="pt-36">
          <rich-text :nodes="tabNodes"></rich-text>
        </view>
      </view>
    </view>
    <view class="btn-box">
      <button class="agree-button fs-44 fw-bold c-white" @click="handleAgreeClick">去付款</button>
    </view>
    <!-- 实名认证 弹窗 -->
    <real-name-pop ref="realpop" @succFlag="succFlag" />
  </view>
</template>

<script>
  import api from '@/apis/index.js';
  import parse from 'mini-html-parser2';
  import NavigationBar from '../../components/common/navigation-bar.vue';
  import RealNamePop from '@/pages/real-name-pop/real-name-pop.vue';
  export default {
    components: { NavigationBar, RealNamePop },
    data() {
      return {
        loading: 1,
        // 商店信息
        info: {},
        // 附近门店
        storeList: [],
        // 选中tab
        tabIndex: '0',

        // 标题
        title: '',

        // 富文本
        nodes: '',
        city: {},
        tabNodes: [],
        // 导航栏高度
        //#ifdef MP-WEIXIN
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
        //#endif
        //#ifdef MP-ALIPAY
        navigationBarHeight:
          uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
        //#endif
        // 状态栏高度
        statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
        otherMarketNum: 0,
      };
    },
    onLoad(e) {
      let info = JSON.parse(decodeURIComponent(e.info));
      uni.setStorageSync('supermarketInfo', JSON.stringify(info));
      this.title = info.supermarketName;
      console.log('info:', info);
      this.info = info;
      this.getUseInfo();
      this.getLocation();

      // this.getOtherList()
      if (uni.getStorageSync('marketInfo')) {
        uni.removeStorageSync('marketInfo');
      }
    },
    onShow() {
      if (uni.getStorageSync('marketInfo')) {
        let marketInfo = uni.getStorageSync('marketInfo');
        this.info.distance = marketInfo.distance;
        this.info.lat = marketInfo.lat;
        this.info.lon = marketInfo.lon;
        this.info.address = marketInfo.address;
        this.info.supermarketId = marketInfo.supermarketId;
        this.info.supermarketStoreId = marketInfo.supermarketStoreId;
      }
    },
    onShareAppMessage() {
      return {
        title: '',
        path: '/pages/index/index?index=0',
      };
    },
    methods: {
      // 返回上一页
      handleNavBack() {
        uni.navigateBack();
      },
      // 返回首页
      handleHomeBack() {
        uni.reLaunch({
          url: '/pages/index/index',
        });
      },
      // 导航事件
      handleDirectionClick() {
        const data = {
          name: this.info.supermarketName,
          longitude: this.storeList[0].lon - 0,
          latitude: this.storeList[0].lat - 0,
          distance: this.storeList[0].distance,
          address: this.storeList[0].address,
        };
        uni.navigateTo({
          url: '/pages/map/direction?data=' + encodeURIComponent(JSON.stringify(data)),
          success: (res) => {
            res.eventChannel.emit('didOpenPageFinish', data);
          },
        });
      },
      // 切换tab
      handleTabClick(index) {
        this.nodes = [];
        if (index === '0' && this.tabIndex != index) {
          this.tabIndex = index;
          this.getUseInfo();
        } else if (index === '1' && this.tabIndex != index) {
          this.tabIndex = index;
          this.getAttention();
        }
      },

      /**
       * 获取当前定位
       */
      getLocation() {
        uni.getLocation({
          type: 'gcj02',
          success: (res) => {
            uni.setStorageSync('location', res);
            // 调用高德地图 API 逆地理编码, 通过经纬度获取当前位置城市信息
            api.regeoMap(
              {
                location: res.longitude + ',' + res.latitude,
              },
              {
                success: (amap) => {
                  let city = {
                    code: amap.regeocode.addressComponent.adcode.substr(0, 4) + '00',
                    longitude: res.longitude,
                    latitude: res.latitude,
                  };
                  // 当城市是省直辖县时返回为空，以及城市为北京、上海、天津、重庆四个直辖市时，该字段返回为[],否则为城市名称（字符串）
                  if (amap.regeocode.addressComponent.city.length === 0) {
                    city.name = amap.regeocode.addressComponent.province;
                  } else {
                    city.name = amap.regeocode.addressComponent.city;
                  }
                  uni.setStorageSync('supermarketCity', city);
                  this.city = city;
                  const citycode = uni.getStorageSync('current_city');
                  if (citycode['code']) {
                    this.city['code'] = citycode['code'].substr(0, 4) + '00';
                  }
                  this.getOtherList();
                },
              },
            );
          },
          fail: () => {
            // // 定位失败默认北京市
            // const city = { code: 110100, name: '北京市' }
            // this.handleSelectCity(city)
          },
        });
      },
      //  获取附近门店
      getOtherList() {
        api.getNearStoreList({
          data: {
            supermarketId: this.info.supermarketId,
            lat: this.city.latitude,
            lon: this.city.longitude,
            cityCode: this.city.code,
          },
          success: (data) => {
            this.storeList = data.result;
            this.otherMarketNum = data.storeNums;
            if (this.storeList.length > 0) {
              this.loading = 2;
            } else {
              this.loading = 3;
            }
          },
          fail: (error) => {
            this.loading = 3;
          },
        });
      },
      //  商超详情中的使用说明
      getUseInfo() {
        api.getUseInfo({
          data: {
            instructions: this.info.instructions,
          },
          success: (data) => {
            console.log('使用说明:', data.result);
            parse(data.result, (err, nodesList) => {
              this.nodes = nodesList;
            });
          },
        });
      },
      // 商超详情中的注意事项
      getAttention() {
        api.getAttention({
          data: {
            note: this.info.note,
          },
          success: (data) => {
            console.log('注意事项:', data.data);
            parse(data.data, (err, nodesList) => {
              this.tabNodes = nodesList;
            });
          },
        });
      },
      //点击查看其他门店
      handleOtherMarket() {
        if (!this.storeList.length) return false;
        this.info.supermarketStoreId = this.storeList[0].supermarketStoreId;
        uni.navigateTo({
          url:
            '/pages/supermarket/other-market?info=' + encodeURIComponent(JSON.stringify(this.info)),
        });
      },
      // 去付款事件
      handleAgreeClick() {
        // const appStartInfo = uni.getStorageSync('app_start_info')
        const userInfo = uni.getStorageSync('userInfo');
        // 未实名
        if (userInfo.crtfStas === '0') {
          this.$refs.realpop.open();
          return false;
        }
        this.handleShowPayCodePage();
      },
      // 实名认证成功
      async succFlag(flag) {
        if (flag == 1) {
          const userInfo = await this.getUserInfo();
          uni.setStorageSync('userInfo', userInfo);

          this.$refs.realpop.close();
          uni.navigateTo({
            url: `/pages/user-center/real-name-result2?back=${'/pages/supermarket/market'}&info=${encodeURIComponent(
              JSON.stringify(this.info),
            )}`,
          });

          // this.handleShowPayCodePage()
        }
      },
      /**
       * 获取用户信息 getUserAccount
       */
      getUserInfo() {
        return new Promise((resolve, reject) => {
          api.getUserInfo({
            data: {
              accessToken: uni.getStorageSync('token'),
            },
            success: (data) => {
              resolve(data);
            },
            fail: (error) => {
              reject(error);
            },
          });
        });
      },
      // 获取支付码页面url
      handleShowPayCodePage() {
        api.getPayCodePage({
          data: { supermarketId: this.info.supermarketId },
          success: (data) => {
            uni.navigateTo({
              url: '/pages/pay/show-pay-code?url=' + encodeURIComponent(data.result),
            });
          },
        });
      },
    },
    filters: {
      setDistance(item) {
        let s = Number(item) / 1000;
        if (s.toFixed(3) < 1) {
          return parseInt(s * 1000) + 'm';
        } else {
          return s.toFixed(1) + 'km';
        }
      },
      markrtDiscount(num) {
        return (Number(num) * 10).toFixed(2);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .market {
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
        margin-right: 48rpx;
        position: relative;
        z-index: 10;
      }
      .icon-desc {
        flex-shrink: 0;
        width: 40rpx;
        height: 40rpx;
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
        // height: ;
      }
    }
    .page-header {
      height: 360rpx;
      width: 100vw;
      position: relative;
      overflow: hidden;
      .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 326rpx;
        z-index: 1;
      }
      .market-card {
        box-sizing: border-box;
        position: relative;
        width: 686rpx;
        height: 338rpx;
        margin: 0 auto;
        padding: 24rpx 0 0 24rpx;
        z-index: 2;
        box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.12);
        transform: translateY(46rpx);
        .logo {
          flex-shrink: 0;
          width: 80rpx;
          height: 80rpx;
          margin-right: 38rpx;
        }
        .store {
          line-height: 50rpx;
          margin: 16rpx 0 56rpx 0;
        }
        .address {
          align-items: center;
          .detail-address {
            flex-shrink: 0;
            width: 400rpx;
            @include text-line(1);
            margin-right: 26rpx;
          }
          .distance {
            flex-shrink: 0;
            width: 176rpx;
            @include text-line(1);
            font-size: 32rpx;
            color: #666666;
            line-height: 50rpx;
          }
        }
        .location {
          flex-shrink: 0;
          width: 32rpx;
          height: 36rpx;
          margin-right: 12rpx;
        }
      }
      .header-meng {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 34rpx;
        z-index: 3;
      }
      .discount {
        position: absolute;
        top: 46rpx;
        right: 32rpx;
        width: 192rpx;
        height: 184rpx;
        overflow: hidden;

        .img {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 3;
          width: 192rpx;
          height: 184rpx;
          //  transform:rotate(90deg);
        }
        .count {
          width: 266rpx;
          height: 64rpx;
          line-height: 64rpx;
          text-align: center;
          font-size: 36rpx;
          font-weight: bold;
          color: #c47c31;
          transform-origin: left center;
          transform: rotate(42deg) translate(-10px, -54rpx);
          position: relative;
          z-index: 5;
        }
      }
    }
    .other-store {
      margin-right: 26rpx;
      height: 88rpx;
      color: #333;
      .img {
        flex-shrink: 0;
        width: 36rpx;
        height: 36rpx;
      }
    }
    .grey-bar {
      width: 100vw;
      height: 16rpx;
      background-color: #f2f2f2;
    }
    .page-main {
      width: 100vw;
      box-sizing: border-box;
      padding-left: 32rpx;
      padding-right: 32rpx;
      padding-bottom: 182rpx;
      .tab-bar {
        height: 120rpx;
        width: 100%;
        //#ifdef MP-ALIPAY
        font-size: 0.4rem;
        //#endif
        //#ifdef MP-WEIXIN
        font-size: 40rpx;
        //#endif
        .item {
          flex-shrink: 0;
          width: 208rpx;
          height: 120rpx;
          line-height: 120rpx;
          text-align: center;
          position: relative;
          &.active::after {
            content: '';
            display: block;
            position: absolute;
            bottom: 0rpx;
            left: 50%;
            transform: translateX(-50%);
            width: 70rpx;
            height: 10rpx;
            background: linear-gradient(90deg, #ff7936 0%, #ff5121 100%);
            border-radius: 5rpx;
          }
        }
      }
      .section {
        .title {
          height: 110rpx;
          width: 100%;
          //#ifdef MP-ALIPAY
          font-size: 0.4rem;
          //#endif
          //#ifdef MP-WEIXIN
          font-size: 40rpx;
          //#endif
          // padding-top: 12rpx;
          color: #333;
          .icon-title {
            width: 10rpx;
            height: 40rpx;
            flex-shrink: 0;
          }
        }
        .pay-type {
          width: 686rpx;
          height: 180rpx;
          background: #f8f8f8;
          border-radius: 16rpx;
          color: #333;
          line-height: 50rpx;
          box-sizing: border-box;
          padding: 0 54rpx 0 50rpx;
          .pay-icon {
            width: 100rpx;
            height: 108rpx;
            flex-shrink: 0;
            margin-right: 8rpx;
          }
          .text {
            padding-top: 26rpx;
          }
        }
      }
    }
    .btn-box {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 152rpx;
      padding: 22rpx 0;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0px -2px 0px 0px #eeeeee;
      .agree-button {
        width: 686rpx;
        height: 108rpx;
        line-height: 108rpx;
        background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
        border-radius: 54rpx;
        margin: 0 auto;
      }
    }
  }
</style>
