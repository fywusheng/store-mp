<template>
  <view class="submitOrder">
    <!-- 订单详情 -->
    <view class="item">
      <image
        class="logo"
        :src="item.hotelDiscountMainPhoto"
        mode="scaleToFill"
      />
      <view class="top">
        <view class="top_c">
          <view class="name">{{ item.hotelDiscountName }}</view>
          <view class="price"
            >￥{{ formatMoney(item.hotelDiscountPrice) }}</view
          >
        </view>
      </view>
    </view>

    <view class="list">
      <view class="list-item">
        <view class="label">数量</view>
        <view class="cont">
          <uni-number-box
            class="changeNumber"
            v-model="count"
            :min="1"
            :max="1"
            @change="getTotalPrice"
          />
        </view>
      </view>
      <view class="list-item">
        <view class="label">商品总额</view>
        <view class="cont">¥{{ formatMoney(totalPrice) }}</view>
      </view>
    </view>

    <!-- 底部提交订单 -->
    <view class="bottom_fix">
      <view class="txt"
        >实付金额
        <text class="price">¥{{ formatMoney(totalPrice) }}</text></view
      >
      <button class="btn" @click="buy">提交订单</button>
    </view>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import UniNumberBox from "./components/uni-number-box.vue";
export default {
  components: { UniNumberBox },
  data() {
    return {
      hotelDiscountId: "",
      type: 1,
      isShowPrice: 1,
      changeP: "",
      //  总金额
      totalPrice: "",
      //  数量
      count: 1,
      //  商品信息
      item: {},
    };
  },
  created() {},
  onLoad(option) {
    //  option.change = '1'
    //  option.hotelDiscountId = '1483050766292750405'

    this.hotelDiscountId = option.hotelDiscountId;
    console.log("====接受---", option);
    if (option.change) {
      this.changeP = option.change;
    }
    if (option.isShowPrice) {
      this.isShowPrice = option.isShowPrice;
    }
    if (option.type) {
      this.type = option.type;
    }
    if (option.hotelName) {
      this.hotelName = option.hotelName;
      this.hotelId = option.hotelId;
    }
    this.queryByDiscountId();
  },
  filters: {
    formatMoney(money) {
      if (!money) return "";
      return (money / 100).toFixed(2);
    },
  },
  methods: {
    buy() {
      // this.$refs.notice.open()
      const uactId = uni.getStorageSync("userInfo").uactId;
      const params = {
        uactId: uactId,
        supermarketThumbnail: this.item.hotelDiscountMainPhoto,
        supermarketId: this.hotelId,
        supermarketName: this.hotelName,
        productId: this.hotelDiscountId,
        orderSource: 4,
        productPrice: this.item.hotelDiscountPrice,
        payNumber: this.count,
      };
      api.putHotelOrder({
        data: params,
        success: (res) => {
          console.log(res, "订单成功");
          const url = `${ENV.H5}/#/checkstand?cashId=${res}`;
          // #ifdef MP-ALIPAY
          uni.reLaunch({
            url: `/pages/common/webpage?url=${url}`,
          });
          // #endif

          // #ifdef MP-WEIXIN
          uni.reLaunch({
            url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
          });
          // #endif
        },
      });
      console.log(params, "参数=======");
    },
    getTotalPrice(newVal) {
      this.totalPrice = this.item.hotelDiscountPrice * newVal;
    },
    clickItem(type) {
      this.type = type;
    },
    queryByDiscountId() {
      api.queryByDiscountId({
        data: {
          hotelDiscountId: this.hotelDiscountId,
          isTransaction: this.changeP,
        },
        success: (res) => {
          this.item = res;
          this.totalPrice = this.count * res.hotelDiscountPrice;
          //  this.hotelDiscountDesc = res.hotelDiscountDesc
          //  const hotelList = res.hotelDiscountContent
          //  this.picArray =  hotelList.split(',')
          //  let listpic = hotelList.split(',')

          //  listpic.push(res.hotelDiscountRule)
          //  this.picConent = listpic.slice(1,listpic.length)
          //  let str = this.change(this.hotelDiscountDesc)
          //   parse(str,(e,newstring)=>{
          //     this.strings = newstring
          //   })
        },
        fail: (res) => {},
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.submitOrder {
  position: relative;
  background-color: #f5f5f5;
  width: 100vw;
  height: 100vh;
  .item {
    width: 100%;
    height: 242rpx;
    background: #ffffff;
    padding: 34rpx 30rpx 48rpx;
    box-sizing: border-box;
    display: flex;
    .logo {
      width: 160rpx;
      height: 160rpx;
    }
    .top {
      position: relative;
      .top_c {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 24rpx;
        box-sizing: border-box;
      }
      .name {
        font-size: 40rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .price {
        font-size: 36rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ff5000;
      }
    }
  }
  .list {
    width: 100%;
    background: #ffffff;
    margin-top: 16rpx;
    padding: 0 32rpx;
    box-sizing: border-box;

    .list-item {
      width: 100%;
      height: 88rpx;
      box-sizing: border-box;
      border-bottom: 1rpx solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 36rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .bottom_fix {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 178rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
    box-sizing: border-box;
    font-size: 40rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    background: #ffffff;
    .txt {
      .price {
        color: #ff711a;
        margin-left: 32rpx;
      }
    }
    .btn {
      width: 240rpx;
      height: 94rpx;
      color: #ffffff;
      background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
      border-radius: 47rpx;
    }
  }
}
</style>
