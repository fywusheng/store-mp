<template>
  <view class="pages">
    <view class="list" v-if="list.length > 0">
      <view
        class="item flex-h flex-c-b"
        v-for="(item, index) in list"
        :key="index"
        @click="handleMarketInfo(item)"
      >
        <view class="item-left flex-v flex-s-c">
          <view class="mb-20 fs-40 name">
            {{ info.supermarketName }}({{ item.supermarketStoreName }})
          </view>
          <view class="address fs-36">{{ item.distance | setDistance }}｜{{ item.address }}</view>
        </view>
        <view class="item-right flex-v flex-s-c" @click.stop="handleLineClick(item)">
          <image
            class="icon-line"
            src="http://192.168.1.187:10088/static/supermarket/icon-line.png"
            mode="scaleToFill"
          />
          <view class="fs-32 routeLine">路线</view>
        </view>
      </view>
    </view>
    <view class="status-box flex-v flex-c-s" v-if="showEmpty">
      <image
        class="icon-img"
        src="http://192.168.1.187:10088/static/supermarket/no-more.png"
        mode="scaleToFill"
      />
      <view>暂无其他门店</view>
    </view>
  </view>
</template>

<script>
  import api from '@/apis/index.js';

  export default {
    components: {},
    data() {
      return {
        // 商店列表
        list: [],

        info: {},
        //当前页
        pageNum: 1,
        showEmpty: false,
        //每页size
        pageSize: '10',
        // 城市信息
        city: {},
      };
    },
    onLoad(e) {
      let info = JSON.parse(decodeURIComponent(e.info));
      console.log('info:', info);
      this.info = info;
      this.city = uni.getStorageSync('supermarketCity');
      this.getOtherMarket();
    },
    // 下拉刷新
    onPullDownRefresh() {
      // this.getOtherMarket()
      this.pageNum = 1;
      this.list = [];
      this.getOtherMarket();
    },
    // 上拉加载
    onReachBottom() {
      console.log('上拉加载');
      this.getOtherMarket();
      // this.getOfficeByTypeWithPage(this.currentIndex)
    },
    methods: {
      //  商超列表
      getOtherMarket() {
        console.log('city', this.city);
        api.getOtherMarket({
          showsLoading: true,
          data: {
            supermarketId: this.info.supermarketId,
            supermarketStoreId: this.info.supermarketStoreId,
            lat: this.city.latitude,
            lon: this.city.longitude,
            cityCode: uni.getStorageSync('city').code,
            pageNum: this.pageNum + '',
            pageSize: this.pageSize,
          },
          success: (data) => {
            console.log('使用说明:', data.list);
            uni.stopPullDownRefresh();
            if (data.list.length > 0) {
              data.list.map((item, index) => {
                this.list.push(item);
              });
              this.pageNum = this.pageNum + 1;
            }
            if (this.list.length === 0) {
              this.showEmpty = true;
            }
          },
        });
      },
      // 导航事件
      handleLineClick(item) {
        let info = item;
        const data = {
          name: this.info.supermarketName + info.supermarketStoreName,
          longitude: info.lon,
          latitude: info.lat,
          distance: info.distance,
          address: info.address,
        };
        uni.navigateTo({
          url: '/pages/map/direction?data=' + encodeURIComponent(JSON.stringify(data)),
          success: (res) => {
            res.eventChannel.emit('didOpenPageFinish', data);
          },
        });
      },
      //缓存商超信息
      handleMarketInfo(item) {
        uni.setStorageSync('marketInfo', item);
        uni.navigateBack({
          delta: 1,
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
    },
  };
</script>

<style lang="scss" scoped>
  .pages {
    min-height: 100vh;
    background-color: #f2f2f2;
    .list {
      overflow: hidden;
      .item {
        width: 710rpx;
        height: 176rpx;
        background-color: #fff;
        margin: 24rpx 20rpx;
        padding: 24rpx 42rpx 26rpx 24rpx;
        box-sizing: border-box;
        color: #333;
        .item-left {
          flex-shrink: 0;
          width: 520rpx;
          .address {
            flex-shrink: 0;
            width: 520rpx;
            color: #999999;
            @include text-line(1);
          }
          .name {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .item-right {
          flex-shrink: 0;
          width: 64rpx;
          color: #333333;
          line-height: 44rpx;
          font-size: 36rpx;
          .icon-line {
            flex-shrink: 0;
            width: 48rpx;
            height: 48rpx;
            margin-bottom: 8rpx;
          }
          //#ifdef MP-ALIPAY
          .routeLine {
            width: 100rpx;
          }
          //#endif
        }
      }
    }
    .status-box {
      padding-top: 300rpx;
      .icon-img {
        width: 440rpx;
        height: 234rpx;
        margin-bottom: 24rpx;
      }
      .status-text {
        height: 50rpx;
        color: $color-grey;
      }
    }
  }
</style>
