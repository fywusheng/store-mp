<template>
  <view class="pages">
    <view class="list" v-if="list.length > 0">
      <view
        class="item mt-24 mr-42 mb-24 ml-24 flex-h flex-c-b br-16"
        v-for="(item, index) in list"
        @click="handleOrderInfo(item.orderId)"
        :key="index"
      >
        <view class="flex-h flex-c-s">
          <image class="logo-img" :src="item.supermarketThumbnail" mode="scaleToFill" />
          <view class="item-left flex-v flex-s-c">
            <view class="mb-20 fs-40 fw-bold">{{ item.supermarketName }}</view>
            <view class="address fs-32">{{ item.orderTime | dateFilter }}</view>
          </view>
        </view>
        <view class="item-right flex-v flex-s-c" @click="handleLineClick(item)">
          <view class="fs-32 fw-bold">-￥{{ item.paymentAmount | formaterMoney }}</view>
        </view>
      </view>
    </view>
    <view class="status-box flex-v flex-c-s" v-if="list.length === 0">
      <image
        class="icon-img"
        src="http://192.168.1.187:10088/static/supermarket/no-order.png"
        mode="scaleToFill"
      />
      <view>暂无订单</view>
    </view>
  </view>
</template>

<script>
  import api from '@/apis/index.js';
  import dayjs from 'dayjs';
  export default {
    components: {},
    data() {
      return {
        // 商店列表
        list: [],
        //当前页
        pageNum: 1,
        //每页size
        pageSize: 10,
      };
    },
    onLoad(e) {
      this.getOrderList();
    },
    // 下拉刷新
    onPullDownRefresh() {
      // this.getOrderList()
      this.pageNum = 1;
      this.list = [];
      this.getOrderList();
    },
    // 上拉加载
    onReachBottom() {
      console.log('上拉加载');
      this.getOrderList();
      // this.getOfficeByTypeWithPage(this.currentIndex)
    },
    methods: {
      //  订单列表
      getOrderList() {
        api.getOrderList({
          data: {
            transactionStatus: '1',
            pageNum: this.pageNum,
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
          },
          fail: (err) => {
            uni.showToast(err.message);
            uni.stopPullDownRefresh();
          },
        });
      },
      // 点击订单
      handleOrderInfo(orderId) {
        console.log('点击订单', orderId);
        uni.navigateTo({
          url: '/pages/supermarket/order-info?orderId=' + orderId,
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
      formaterMoney(v) {
        return (v / 100).toFixed(2);
      },
      // 日期过滤器, 用于格式化日期
      dateFilter(value) {
        console.log('value:', value);
        console.log('dayjs:', dayjs(value).format('YYYY-MM-DD HH:mm:ss'));

        return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
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
        width: 686rpx;
        height: 180rpx;
        background-color: #fff;
        margin: 24rpx 32rpx;
        padding: 0rpx 24rpx;
        box-sizing: border-box;
        color: #333;
        .logo-img {
          flex-shrink: 0;
          width: 78rpx;
          height: 78rpx;
          margin-right: 26rpx;
        }
        .item-left {
          flex-shrink: 0;
          color: #333;
          // width: 520rpx;
          .address {
            flex-shrink: 0;
            // width: 520rpx;
            color: #999999;
            @include text-line(1);
          }
        }
        .item-right {
          color: #333333;
          font-size: 40rpx;
        }
      }
    }
    .status-box {
      padding-top: 300rpx;
      .icon-img {
        width: 440rpx;
        height: 270rpx;
        margin-bottom: 24rpx;
      }
      .status-text {
        height: 50rpx;
        color: $color-grey;
      }
    }
  }
</style>
