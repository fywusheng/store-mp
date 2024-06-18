<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
  <view class="main_content">
    <!-- 门店管理-订单管理 -->
    <view class="top">
      <view class="form flex_r_h">
        <view class="item"><input type="text" placeholder="输入商品编码" v-model="queryParam.queryObject.code" /></view>
        <view class="item"><input type="text" placeholder="输入商品名称" v-model="queryParam.queryObject.name" /></view>
        <view class="btn" @click="handSearch">查询</view>
      </view>
    </view>
    <view class="order_content">
      <view class="list">
        <view class="item" v-for="(item, index) in orderList" :key="index">
          <view class="item-top">
            <image class="logo" :src="item.mainImgUrl" mode="scaleToFill" />
            <view class="right">
              <view class="r-t">
                <view class="name">{{ item.name }}</view>
                <view v-if="[5, 61].includes(item.saleState)" class="label">销售中</view>
                <view v-if="[6, 51].includes(item.saleState)" class="label wait">待上架</view>
              </view>
              <view class="sku">{{ item.code }}</view>
            </view>
          </view>
          <view class="line"></view>
          <view class="bottom flex_r_h">
            <view class="details_btn" @click.stop="handleGoDetails(item.id)">查看佣金</view>
          </view>
        </view>
      </view>
    </view>
    <view class="loading">
      <uni-load-more :status="status" :content-text="loadText"></uni-load-more>
    </view>
    <view class="footer_bottom">合计共{{ total }}条</view>
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
          queryObject: {
            queryType: 5,
            name: '',
            code: '',
          },
        },
        dateSelect: '',
        total: 0,
      };
    },
    created() {},
    mounted() {
      this.queryOrderList();
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
      async queryOrderList() {
        try {
          const result = await Axios.post('/product/listByPageNo', this.queryParam);
          console.log('result: ', result);

          if (result.data) {
            this.total = result.data.totalCount;
            const orderList = result.data.list || [];
            if (this.queryParam.pageNum == 1) this.orderList = [];
            if (orderList.length) {
              this.orderList = this.orderList.concat(orderList);
              this.status = result.data.totalPages > result.data.pageNum ? 'more' : 'noMore';
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
          url: '/pages/supermarket/brokerage-info?productId=' + id,
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
          .item-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .logo {
              width: 120rpx;
              height: 120rpx;
              border-radius: 8rpx;
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
            flex-direction: row-reverse;

            .details_btn {
              text-align: center;
              font-size: 32rpx;
              font-weight: 500;
              color: #ff5500;
              width: 198rpx;
              height: 68rpx;
              line-height: 68rpx;
              border-radius: 36rpx;
              border: 2rpx solid #ff5500;
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
