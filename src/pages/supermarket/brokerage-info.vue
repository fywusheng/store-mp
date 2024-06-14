<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
  <view class="main_content">
    <!-- 门店管理-订单管理 -->
    <!-- <view class="top">
      <view class="form flex_r_h">
        <view class="item"><input type="text" placeholder="输入商品编码" v-model="queryParam.orderId" /></view>
        <view class="item"><input type="text" placeholder="输入商品名称" v-model="queryParam.userLoginName" /></view>
        <view class="btn" @click="handSearch">查询</view>
      </view>
    </view> -->
    <view class="order_content">
      <view class="list">
        <!-- 状态（0:未知 10：待付款 20：代发货 30：待收货 40：已完成 50：已评价 90：订单取消、手动取消、系统自动取消 100：交易取消 ） -->
        <view class="item main">
          <view class="item-top">
            <image class="logo" src="" mode="scaleToFill" />
            <view class="right">
              <view class="r-t">
                <view class="name">松辉健康理疗仪-2024款全名称两行情况</view>
                <view class="label">销售中</view>
                <!-- <view class="label wait">待上架</view> -->
              </view>
              <view class="sku">PRD100234311233123</view>
            </view>
          </view>
          <!-- <view class="line"></view>
          <view class="bottom flex_r_h">
            <view class="sale-price">销售价：¥345.00</view>
            <view class="brokerage-price">佣金：¥45.00</view>
          </view> -->
        </view>
        <view class="item" v-for="(item, index) in orderList" :key="index">
          <view class="item-top">
            <image class="logo" src="" mode="scaleToFill" />
            <view class="right">
              <view class="r-t">
                <view class="name">SKU规格：512G/曜石黑</view>
                <!-- <view class="label ">销售中</view> -->
                <!-- <view class="label wait">待上架</view> -->
              </view>
              <view class="sku">SKU编码：PRD100234311233123</view>
            </view>
          </view>
          <view class="line"></view>
          <view class="bottom flex_r_h">
            <view class="sale-price">销售价：¥345.00</view>
            <view class="brokerage-price">佣金：¥45.00</view>
          </view>
        </view>
      </view>
    </view>
    <!-- <view class="loading">
      <uni-load-more :status="status" :content-text="loadText"></uni-load-more>
    </view> -->
    <!-- <view class="footer_bottom">合计共{{ total }}条</view> -->
    <view>
      <!-- 日期选择框 -->
      <uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" :insert="false" :range="true" @confirm="confirmDate" />
    </view>
  </view>
</template>
<script>
  import api from '@/apis/index.js';
  export default {
    data() {
      return {
        showClearIcon: false,
        // 状态（0:未知 10：待付款 20：代发货 30：待收货 40：已完成 50：已评价 90：订单取消、手动取消、系统自动取消 100：交易取消 ）
        tabList: [
          {
            value: '',
            text: '全部',
          },
          {
            value: 10,
            text: '待付款',
          },
          {
            value: 20,
            text: '待发货',
          },
          {
            value: 30,
            text: '待收货',
          },
          {
            value: 40,
            text: '已完成',
          },
          {
            value: 90,
            text: '已取消',
          },
          {
            value: 100,
            text: '退款/售后',
          },
        ], //tab
        status: 'more',
        loadText: {
          contentdown: '轻轻上拉',
          contentrefresh: '努力加载中',
          contentnomore: '我是有底线的',
        },
        // 数据列表
        orderList: [[], [], []],
        show: false,
        mode: 'date',
        queryParam: {
          pageNum: 1,
          pageSize: 10,
        },
        dateSelect: '',
        total: 0,
      };
    },
    created() {},
    mounted() {
      // this.queryOrderList();
    },
    onLoad(e) {},
    methods: {
      clearIcon: function () {
        this.dateSelect = '';
        this.queryParam.startTime = '';
        this.queryParam.endTime = '';
        this.showClearIcon = false;
      },
      /**
       * 打开时间
       */
      selectDate() {
        this.$refs.calendar.open();
      },
      confirmDate(obj) {
        if (obj.range.data.length == 0) {
          this.$uni.showToast('请选择时间区间范围');
          return;
        }
        this.queryParam.startTime = obj.range.data[0];
        this.queryParam.endTime = obj.range.data[obj.range.data.length - 1];
        this.dateSelect = obj.range.data[0] + '~' + obj.range.data[obj.range.data.length - 1];
        this.showClearIcon = true;
      },
      /**
       * 获取订单列表
       */
      queryOrderList() {
        let params = {
          storeNo: uni.getStorageSync('storeNo'),
          // storeNo: '1',
          ...this.queryParam,
          // orderId:"CO20221220152139642"
        };
        this.status = 'loading';
        try {
          api.getUserOrderList({
            data: {
              ...params,
            },
            success: (data) => {
              console.log('整理前数据', data);
              if (data) {
                console.log('数据', data);
                this.total = data.totalCount;
                const orderList = data.list || [];
                if (this.queryParam.pageNum == 1) this.orderList = [];
                if (orderList.length) {
                  this.orderList = this.orderList.concat(orderList);
                  this.status = data.totalPages > data.pageNum ? 'more' : 'noMore';
                } else {
                  this.status = 'noMore';
                }
                if (this.orderList.length == 0) {
                  this.status = 'noMore';
                }
              } else {
                this.orderList = [];
                this.status = 'noMore';
              }
            },
            fail: (err) => {
              this.$uni.showToast(err.message);
              uni.stopPullDownRefresh();
              uni.hideLoading();
            },
          });
        } catch (error) {
          this.status = 'noMore';
          console.log(error);
        }
      },
      /**
       * 去订单详情 handleGoDetails
       */
      handleGoDetails(id) {
        uni.navigateTo({
          url: '/pages/order/details?orderId=' + id,
        });
      },
      // 查询
      handSearch() {
        this.queryParam.pageNum = 1;
        this.queryOrderList();
      },
    },
    // 上拉加载
    onReachBottom() {
      if (this.status === 'noMore') return;
      this.queryParam.pageNum++;
      this.queryOrderList();
    },
    //下拉刷新
    onPullDownRefresh() {
      this.queryParam.pageNum = 1;
      this.queryOrderList();
      setTimeout(function () {
        uni.stopPullDownRefresh();
      }, 200);
    },
    onShow() {},
    destroyed() {},
  };
</script>
<style>
  page {
    display: flex;
    flex-direction: column;
    height: 100%;
    /* #ifdef H5 */
    background-color: #fff;
    /* #endif */
  }
</style>
<style lang="scss">
  .flex_r_h {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .flex_c_h {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .main_content {
    .top {
      padding: 24rpx 32rpx;
      background: #fff;

      .form {
        justify-content: space-between;

        view.item {
          background: #f5f7fa;
          border-radius: 40rpx;
          width: 250rpx;
          height: 56rpx;
          line-height: 56rpx;
          input {
            font-size: 24rpx;
            padding: 0 24rpx;
            height: 56rpx;
            line-height: 56rpx;
          }
        }
        .btn {
          width: 136rpx;
          height: 56rpx;
          line-height: 56rpx;
          text-align: center;
          background: linear-gradient(95deg, #fa7532 0%, #ff5500 100%);
          border-radius: 28rpx;
          color: #fff;
          font-size: 28rpx;
          font-weight: 500;
        }
      }

      .search {
        margin-top: 44rpx;
        justify-content: space-between;

        .date {
          font-size: 24rpx;
          color: #333333;

          .date_content {
            width: 360rpx;
            height: 56rpx;
            background: #f5f7fa;
            border-radius: 28rpx;
            z-index: -1;
          }

          .select_lang {
            width: 410rpx;
            height: 56rpx;
            line-height: 56rpx;
            background: #f5f7fa;
            border-radius: 28rpx;
            position: relative;
            padding: 0 24rpx;
            z-index: 0;
            .icon {
              width: 35rpx;
              position: absolute;
              top: 11rpx;
              left: 18rpx;
            }

            .input_select {
              width: 100%;
              font-size: 24rpx;
              padding: 0 24rpx;
              margin-left: 12rpx;
              height: 56rpx;
              line-height: 56rpx;
            }

            .icon_s {
              width: 20rpx;
              position: absolute;
              top: 19rpx;
              right: 18rpx;
              z-index: 333;
            }
            .delete {
              width: 30rpx;
              top: 15rpx;
            }
          }
        }
      }
    }

    .order_content {
      padding: 34rpx;

      .list {
        .item {
          background: #ffffff;
          border-radius: 16rpx;
          padding: 24rpx;
          margin-bottom: 24rpx;
          &.main {
            border: 1rpx solid #ff5500;
            background: linear-gradient(180deg, #fff8f4 0%, #ffffff 100%);
            // border-image: linear-gradient(180deg, rgba(255, 85, 0, 1), rgba(255, 85, 0, 0)) 1 1;
            .item-top {
              .right {
                .r-t {
                  .name {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    white-space: unset;
                  }
                }
              }
            }
          }
          .item-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .logo {
              width: 120rpx;
              height: 120rpx;
              border-radius: 8rpx;
              background: #fa7532;
              margin-right: 24rpx;
            }
            .right {
              flex: 1;
              height: 120rpx;
              display: flex;
              // align-items: center;
              flex-direction: column;
              justify-content: space-evenly;
              .r-t {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .name {
                  width: 350rpx;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  font-weight: 500;
                  font-size: 28rpx;
                }
                .label {
                  width: 104rpx;
                  height: 50rpx;
                  background: #ffeee6;
                  border-radius: 8rpx;
                  font-weight: 500;
                  font-size: 24rpx;
                  color: #ff5500;
                  font-style: normal;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  &.wait {
                    background: #f5f7fa;
                    color: #999999;
                  }
                }
              }
              .sku {
                color: #909399;
              }
            }
          }

          .line {
            height: 1rpx;
            background: #f5f7fa;
            width: 100%;
            margin-top: 32rpx;
          }

          .bottom {
            padding: 24rpx 0 0 0;
            justify-content: space-between;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 28rpx;
            font-style: normal;
            .sale-price {
              color: #909399;
            }
            .brokerage-price {
              color: #ff5500;
            }
          }
        }
      }
    }
  }
  .footer_bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffeee6;
    border: 1rpx solid #ff5500;
    color: #ff5500;
    padding: 10rpx 0 20rpx 0;
    text-align: center;
    @include iphoneAdaptive(m, -5rpx);
  }
</style>
