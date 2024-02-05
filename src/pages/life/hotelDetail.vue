<template>
  <view class="hotelDetail">
    <image :src="picArray[0]" class="topBg" />
    <view class="item">
      <view class="top">
        <view class="top_c">
          <view class="name">{{ item.hotelDiscountName }}</view>
          <view class="price" v-if="isShowPrice == 1 && item.hotelDiscountPrice"
            >￥{{ formaterMoney(item.hotelDiscountPrice) }}</view
          >
        </view>
      </view>
      <view class="bottom">
        <view class="infor"
          ><image
            src="https://ggllstatic.hpgjzlinfo.com/static/life/house.png"
            class="hourse" /><rich-text :nodes="strings"></rich-text
        ></view>
        <view class="time"
          ><image
            src="https://ggllstatic.hpgjzlinfo.com/static/life/time.png"
            class="hourse"
          />{{ item.hotelDiscountValidity }}</view
        >
      </view>
    </view>
    <view class="select" v-if="isShowPrice == 1">
      <view class="pd" @click="clickItem(1)">
        <view :class="{ select_name: type == 1 ? true : false }">产品介绍</view>
        <view class="bottom_line" v-if="type == 1"></view>
      </view>
      <view class="pd" @click="clickItem(2)">
        <view :class="{ select_name: type == 2 ? true : false }">适用酒店</view>
        <view class="bottom_line" v-if="type == 2"></view>
      </view>
    </view>
    <view class="select" v-else>
      <view class="pd" @click="clickItem(2)">
        <view :class="{ select_name: type == 2 ? true : false }">适用酒店</view>
        <view class="bottom_line" v-if="type == 2"></view>
      </view>
      <view class="pd" @click="clickItem(1)">
        <view :class="{ select_name: type == 1 ? true : false }">产品介绍</view>
        <view class="bottom_line" v-if="type == 1"></view>
      </view>
    </view>
    <view class="content">
      <image
        v-if="type == 1"
        class="bgimg"
        :src="url"
        v-for="(url, index) in picConent"
        :key="index"
        mode="widthFix"
      />
      <view v-if="type == 2"
        ><right :hotelDiscountId="hotelDiscountId"></right
      ></view>
      <view class="heightBootm" v-if="isShowPrice == 1"></view>
    </view>
    <view class="bottom_fix" v-if="isShowPrice == 1">
      <view class="btn" @click="buy"
        ><image
          class="icon"
          src="https://ggllstatic.hpgjzlinfo.com/static/life/buyBtn.png"
          mode="widthFix"
      /></view>
    </view>
    <modal-know ref="notice"></modal-know>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import right from "@/pages/life/components/right.vue";
import modalKnow from "@/pages/life/components/modal-know.vue";
import parse from "mini-html-parser2";
export default {
  components: { right, modalKnow },
  data() {
    return {
      strings: "",
      hotelDiscountId: "",
      item: {},
      picArray: [],
      picConent: [],
      type: 1,
      isShowPrice: 1,
      hotelDiscountDesc: "",
      changeP: "",
    };
  },
  created() {},
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
    // return {
    //         title:'酒店',
    //         path:"/pages/life/hotelHome",
    //      };
  },
  onLoad(option) {
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
    this.hotelName = option.hotelName;
    this.hotelId = option.hotelId;
    this.queryByDiscountId();
  },
  methods: {
    formaterMoney(v) {
      return (v / 100).toFixed(2);
    },
    turnValue(match) {
      return `<span style="color:red">${match}</span>`;
    },
    change(value) {
      if (!value) {
        return "";
      } else {
        return value.replace(/\d+/g, this.turnValue);
      }
    },
    buy() {
      // this.$refs.notice.open()
      const change = this.changeP;
      const hotelDiscountId = this.hotelDiscountId;

      uni.navigateTo({
        url: `/pages/life/submitOrder?change=${change}&hotelDiscountId=${hotelDiscountId}&hotelId=${this.hotelId}&hotelName=${this.hotelName}`,
      });
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
          this.hotelDiscountDesc = res.hotelDiscountDesc;
          const hotelList = res.hotelDiscountContent;
          this.picArray = hotelList.split(",");
          const listpic = hotelList.split(",");

          listpic.push(res.hotelDiscountRule);
          this.picConent = listpic.slice(1, listpic.length);
          const str = this.change(this.hotelDiscountDesc);
          parse(str, (e, newstring) => {
            this.strings = newstring;
          });
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
    height: 72rpx;
    font-size: 36rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 72rpx;
    position: absolute;
    top: 800rpx;
    display: flex;
    padding-left: 34rpx;
    margin-top: 20rpx;
    .pd {
      margin-right: 34rpx;
      width: 200rpx;
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
    margin-top: 440rpx;
    .bgimg {
      width: 100%;
      height: 100%;
    }
    .heightBootm {
      height: 178rpx;
    }
  }
  .item {
    position: absolute;
    top: 380rpx;
    width: 686rpx;
    height: 334rpx;
    background: #ffffff;
    box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 16rpx;
    margin: 52rpx 32rpx 32rpx 32rpx;
    padding-bottom: 12rpx;
    .top {
      width: 686rpx;
      height: 162rpx;
      position: relative;
      .top_c {
        position: absolute;
        display: flex;
        justify-content: space-between;
        top: 54rpx;
        left: 20rpx;
      }
      .bgimg {
        width: 100%;
        height: 100%;
      }
      .name {
        font-size: 40rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333;
        line-height: 56rpx;
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
        font-size: 48rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ff9500;
        line-height: 66rpx;
      }
    }
    .bottom {
      margin-left: 24rpx;
      background: #fff9f3;
      border-radius: 16rpx;
      padding: 28rpx 12rpx 28rpx 12rpx;
      margin-right: 24rpx;
      margin-bottom: 32rpx;
      .infor {
        display: flex;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        height: 50rpx;
        display: flex;
        margin-bottom: 10rpx;
        width: 630rpx;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // word-wrap: break-word;
        // white-space: normal !important;
        // -webkit-line-clamp: 1;
        // -webkit-box-orient: vertical;
        .hourse {
          width: 40rpx;
          height: 40rpx;
          margin-right: 10rpx;
          vertical-align: sub;
        }
      }
      .time {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        display: flex;
        height: 50rpx;
        width: 630rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        .hourse {
          width: 40rpx;
          height: 40rpx;
          margin-right: 10rpx;
          vertical-align: sub;
        }
      }
    }
  }

  .bottom_fix {
    position: fixed;
    bottom: 0;
    width: 750rpx;
    height: 178rpx;
    .btn {
      .icon {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
