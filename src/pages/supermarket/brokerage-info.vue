<template>
  <view class="main_content">
    <view class="order_content">
      <view class="list">
        <view class="item main">
          <view class="item-top">
            <image class="logo" :src="productInfo.mainImgUrl" mode="scaleToFill" />
            <view class="right">
              <view class="r-t">
                <view class="name">{{ productInfo.name }}</view>
                <view v-if="[5, 61].includes(productInfo.saleState)" class="label">销售中</view>
                <view v-if="[6, 51].includes(productInfo.saleState)" class="label wait">待上架</view>
              </view>
              <view class="sku">{{ productInfo.code }}</view>
            </view>
          </view>
        </view>
        <view class="item" v-for="(item, index) in specSkuList" :key="index">
          <view class="item-top">
            <image class="logo" :src="item.imgUrl" mode="scaleToFill" />
            <view class="right">
              <view class="r-t">
                <view class="name">SKU规格：{{ item.specs }}</view>
                <!-- <view class="label ">销售中</view> -->
                <!-- <view class="label wait">待上架</view> -->
              </view>
              <view class="sku">SKU编码：{{ item.code }}</view>
            </view>
          </view>
          <view class="line"></view>
          <view class="bottom flex_r_h">
            <view class="sale-price">销售价：¥{{ item.sellingPrice.toFixed(2) }}</view>
            <view class="brokerage-price">佣金：¥{{ item.commissionPrice.toFixed(2) }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        specSkuList: [],
        productInfo: {},
      };
    },
    created() {},
    mounted() {
      // this.queryOrderList();
    },
    onLoad(e) {
      this.id = e.productId;
      this.queryOrderList();
    },
    methods: {
      /**
       * 获取订单列表
       */
      async queryOrderList() {
        this.loading = true;
        this.specSkuList = [];
        const result = await Axios.post('/product/get', { id: this.id });
        this.loading = false;
        if (result.code == 200) {
          if (result.data) {
            this.specSkuList = [];
            result.data.skuList.forEach((ele) => {
              if (ele.skuAndPriceList) {
                ele.skuAndPriceList.forEach((s) => {
                  s.specs = ele.firstClassAttrName + '/' + s.subClassAttrName;
                  s.saleState = ele.saleState;
                  s.imgUrl = ele.imgUrlList[0];
                  this.saleState = ele.saleState == 5;
                  this.specSkuList.push(s);
                });
                if (ele.imgUrlList && ele.imgUrlList.length > 0) {
                  ele.specImgUrlList = [];
                  var index = 0;
                  ele.imgUrlList.forEach((img) => {
                    ele.specImgUrlList.push({ name: index++, url: img });
                  });
                }
                ele.hideUploadCard = ele.imgUrlList && ele.imgUrlList.length >= 3 ? true : false;
              }
            });
            this.productInfo = result.data;
          }
        } else {
          this.$message.error(result.msg);
        }
      },
    },

    //下拉刷新
    onPullDownRefresh() {
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
      padding: 22rpx;

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
