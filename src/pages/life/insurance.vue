<template>
  <view class="insurance">
    <view class="bg">
      <image
        class="topIcon"
        src="https://ggllstatic.hpgjzlinfo.com/static/life/insuranTop.png"
        mode="widthFix"
      />
    </view>
    <!-- 医疗险 -->
    <view v-if="newList.dataList.length" class="typeItem">
      <view class="left">
        <view class="line_"></view>{{ newList.firstCategory }}
      </view>
      <view class="block">
        <view class="top">
          <view class="_left">{{ newList.categoryDescription }}</view>
          <view class="_white"></view>
          <view class="_right">{{ newList.childCategory }}</view>
        </view>
        <view class="bottom">
          <view
            class="b_item"
            v-for="(listV, i) in newList.dataList"
            :key="i"
            @click="goH5Detail(listV, i)"
          >
            <view class="b_left">
              <image class="topIcon" :src="listV.img" mode="widthFix" />
            </view>
            <view class="b_right">
              <view class="proname">{{ listV.productName }}</view>
              <view class="infor">{{ listV.productDescription }}</view>
              <view class="price">
                <view class="t">
                  <view class="p">{{ listV.sales.split("/")[0] }}</view>
                  <view class="d">/{{ listV.sales.split("/")[1] }}</view>
                </view>
                <view class="isfree" v-if="listV.productName == '重疾赠险'"
                  >免费领取</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="typeItem" v-for="(item, index) in list" :key="index">
      <view class="left">
        <view class="line_"></view>{{ item.firstName }}
      </view>
      <view class="block" v-for="(v, k) in item.list" :key="k">
        <view class="top">
          <view class="_left">{{ v.desc }}</view>
          <view class="_white"></view>
          <view class="_right">{{ v.secondName }}</view>
        </view>
        <view class="bottom">
          <view
            class="b_item"
            v-for="(listV, i) in v.productList"
            :key="i"
            @click="goInsuranDetail(listV)"
          >
            <view class="b_left">
              <image
                class="topIcon"
                :src="listV.productPhoto"
                mode="widthFix"
              />
            </view>
            <view class="b_right">
              <view class="proname">{{ listV.productName }}</view>
              <view class="infor">{{ listV.productAdvantage }}</view>
              <view class="price">
                <view class="t">
                  <view class="p"
                    >￥{{ listV.productPrice.split("/")[0] }}</view
                  >
                  <view class="d">/{{ listV.productPrice.split("/")[1] }}</view>
                </view>
                <view class="isfree" v-if="listV.productIsFree == 1"
                  >免费领取</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <modal-know ref="notice"></modal-know>
    <!-- 实名认证 弹窗 -->
    <real-name-pop ref="realpop" :showTop="false" @succFlag="succFlag" />
  </view>
</template>
<script>
import modalKnow from "@/pages/life/components/modal-know.vue";
import RealNamePop from "@/pages/real-name-pop/real-name-pop.vue";
import api from "@/apis/index.js";
export default {
  components: { modalKnow, RealNamePop },
  data() {
    return {
      list: [],
      newList: {
        dataList: [],
      },
    };
  },
  created() {
    this.insuranceList();
    this.insuranceNewList();
  },
  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/index/index?index=0",
    };
  },
  methods: {
    goInsuranDetail(itemv) {
      const userInfo = uni.getStorageSync("userInfo");

      // 未登录, 跳转到登录页面
      if (!userInfo) {
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }

      // 未实名
      if (userInfo.crtfStas === "0") {
        this.$refs.realpop.open();
        return false;
      }

      uni.setStorageSync("insuranDetal", itemv.productH5);
      uni.navigateTo({
        url: "/pages/life/insuranceDetail?price=" + itemv.productPrice,
      });
    },
    goH5Detail(item, index) {
      const userInfo = uni.getStorageSync("userInfo");

      // 未登录, 跳转到登录页面
      if (!userInfo) {
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }

      // 未实名
      if (userInfo.crtfStas === "0") {
        this.$refs.realpop.open();
        return false;
      }

      uni.navigateTo({
        url:
          index === 0
            ? "/pages/life/insurance-premium"
            : "/pages/life/insurance-mofang",
      });
      // uni.navigateTo({ url: '/pages/common/webpage?url=' + encodeURIComponent(item.targetUrl) })
    },
    // 实名认证成功
    async succFlag(flag) {
      if (flag == 1) {
        const userInfo = await this.getUserInfo();
        uni.setStorageSync("userInfo", userInfo);
        this.$refs.realpop.close();
        uni.navigateTo({
          url: `/pages/user-center/real-name-result2?back=${"/pages/life/insurance"}`,
        });
      }
    },
    /**
     * 获取用户信息 getUserAccount
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        api.getUserInfo({
          data: {
            accessToken: uni.getStorageSync("token"),
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
    // insuranceList
    insuranceList() {
      api.insuranceList({
        data: {},
        success: (res) => {
          this.list = res;
        },
        fail: (res) => {
          console.log(res);
        },
      });
    },
    // 重疾保障
    insuranceNewList() {
      api.insuranceNewList({
        data: {},
        success: (res) => {
          console.log(res);
          this.newList = res;
        },
        fail: (res) => {},
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.insurance {
  // background-color:#fff;
  .bg {
    width: 750rpx;
    height: 368rpx;
    .topIcon {
      width: 100%;
      height: 100%;
    }
  }
  .typeItem {
    .left {
      font-size: 40rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      height: 40rpx;
      margin: 14rpx 32rpx 24rpx 32rpx;
      display: flex;
      margin-top: 44rpx;
      line-height: 35rpx;
      .line_ {
        width: 8rpx;
        height: 38rpx;
        background-color: #ff9500;
        border-radius: 18rpx;
        margin-right: 16rpx;
      }
    }
    .block {
      margin: 0rpx 32rpx 32rpx 32rpx;
      background: linear-gradient(180deg, #f9ecc9 0%, #ffffff 100%);
      box-shadow: 0rpx 4rpx 24rpx 0rpx rgba(0, 0, 0, 0.12);
      border-radius: 16rpx;
      .top {
        display: flex;
        justify-content: space-around;
        padding: 24rpx;
        ._left {
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #c64200;
        }
        ._white {
          width: 2rpx;
          height: 82rpx;
          border: 2rpx solid #ffffff;
          background-color: #fff;
          margin-right: 22rpx;
          margin-top: 5rpx;
        }
        ._right {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
      .bottom {
        margin: 24rpx 24rpx 32rpx 24rpx;
        background-color: #fff;
        margin-top: 10rpx;
        .b_item {
          display: flex;
          justify-content: flex-start;
          padding-top: 24rpx;
          padding-left: 20rpx;
          padding-bottom: 22rpx;
          background-color: #fafafa;
          border-radius: 8rpx;
          border: 2rpx solid #ffffff;
          .b_left {
            width: 172rpx;
            height: 172rpx;
            margin-right: 20rpx;
            .topIcon {
              width: 100%;
              height: 100%;
            }
          }
          .b_right {
            display: flex;
            flex-direction: column;
            .proname {
              height: 50rpx;
              font-size: 36rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 50rpx;
            }
            .infor {
              height: 44rpx;
              font-size: 32rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              line-height: 44rpx;
              width: 420rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              word-wrap: break-word;
              white-space: normal !important;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              margin-top: 14rpx;
              margin-bottom: 14rpx;
            }
            .price {
              height: 56rpx;
              font-size: 40rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              line-height: 56rpx;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              .t {
                display: flex;
                margin-right: 16rpx;
                .p {
                  color: #ff5500;
                }
                .d {
                  color: #333;
                }
              }
              .isfree {
                width: 172rpx;
                height: 48rpx;
                background: linear-gradient(180deg, #ffbf00 0%, #ff7500 100%);
                border-radius: 6rpx;
                font-size: 36rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                text-align: center;
                line-height: 48rpx;
              }
            }
          }
        }
      }
    }
  }
}
</style>
