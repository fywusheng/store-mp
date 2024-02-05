<template>
  <view class="ordermanage">
    <!-- 头部导航栏 -->
    <tabs
      v-model="currentIndex"
      height="114rpx"
      lineColor="#FF711A"
      :fixed="false"
      fontSize="36rpx"
      color="#999"
      activeColor="#333"
      :tabs="items"
      :scroll="true"
      field="name"
      @change="clickItem"
    />
    <view class="cont" v-if="loading == 2">
      <view class="collectCenter">
        <hr-pull-load
          @refresh="refresh"
          @loadMore="loadMore"
          height="-2"
          :pullHeight="50"
          :maxHeight="100"
          :lowerThreshold="30"
          :newLoading="newLoading"
          :bottomTips="bottomTips"
          :isAllowPull="false"
          :isTab="true"
          ref="hrPullLoad"
        >
          <!-- 全部订单 -->
          <all-order v-if="currentIndex === 0" :list="tablist[currentIndex]" />
          <!-- 其余订单 -->
          <!-- 目前只显示附近优惠 -->
          <my-order
            v-if="[1].includes(currentIndex)"
            :list="tablist[currentIndex]"
          />
          <!-- <my-order v-if="[1,2,3,4].includes(currentIndex)" :list="tablist[currentIndex]" /> -->

          <!-- 消费养老订单-->
          <consum-order
            @resetOptions="resetOptions"
            v-if="currentIndex === 2"
            :list="tablist[currentIndex]"
          ></consum-order>

          <!-- 酒店订单 -->
          <!-- <hotel-order
            v-if="currentIndex === 5"
            :list="tablist[currentIndex]"
            @resetOptions="resetOptions"
          /> -->

          <!-- 保险订单 -->
          <insurance-order
            v-if="orderSource === '3'"
            :list="tablist[currentIndex]"
            @resetOptions="resetOptions"
          />

          <!-- 商城订单 -->
          <shop-order
            v-if="orderSource === '9'"
            :list="tablist[currentIndex]"
            @resetOptions="resetOptions"
          />

          <!-- 出行旅游 -->
          <trip-order
            v-if="orderSource === '6'"
            :list="tablist[currentIndex]"
            @resetOptions="resetOptions"
          />
        </hr-pull-load>
      </view>
    </view>
    <view v-if="loading == 3" class="empt">
      <image
        src="https://ggllstatic.hpgjzlinfo.com/static/life/emp.png"
        class="l_empt"
        mode="scaleToFill"
      />
      <view class="watch">登录后查看订单</view>
      <view class="login" @click="goLogin">去登录</view>
    </view>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import tabs from "@/pages/order/component/v-tabs-center.vue";
import hrPullLoad from "@/components/hr-pull-load/hr-pull-load.vue";
import MyOrder from "./component/my-order.vue";
import HotelOrder from "./component/hotel-order.vue";
import AllOrder from "./component/all-order.vue";
import ShopOrder from "./component/shop-order.vue";
import TripOrder from "./component/trip-order.vue";
import InsuranceOrder from "./component/insurance-order.vue";
import ConsumOrder from "./component/consum-order.vue";
export default {
  components: {
    tabs,
    hrPullLoad,
    MyOrder,
    HotelOrder,
    AllOrder,
    ShopOrder,
    InsuranceOrder,
    ConsumOrder,
    TripOrder,
  },
  props: {
    currentIndex2: {
      type: Number,
      default: 0,
    },
    resh: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      bottomTips: "",
      tabName: "",
      loading: 0,
      userinfor: {},
      navHeight:
        uni.getSystemInfoSync().statusBarHeight +
        uni.getSystemInfoSync().titleBarHeight,
      scrollToLeft: 0,
      currentIndex: 0,
      orderSource: "",
      newLoading: false,
      items: [],
      tablist: [[], [], [], [], [], [], [], []],
      pageOption: {
        0: {
          pageNum: 1,
          pageSize: 20,
        },
      },
    };
  },
  watch: {
    currentIndex2(value) {
      if (value === 3) {
        this.pageOption[0] = {
          pageNum: 1,
          pageSize: 20,
        };
        this.getOrderList();
      }
    },
    resh(value) {
      if (value) {
        this.pageOption[0] = {
          pageNum: 1,
          pageSize: 20,
        };
        this.getOrderList();
      }
    },
  },
  async onLoad(e) {
    console.log("===消费养老监听回来--");
    const token = uni.getStorageSync("token") || e.token;
    await this.getOrderDictList();
    if (token) {
      uni.setStorageSync("token", token);
      this.userinfor = await this.getUserInfo();
      uni.setStorageSync("userInfo", this.userinfor);
      if (this.userinfor.tel) {
        this.loading = 2;
      } else {
        this.loading = 3;
      }
      this.getOrderList(1);
    } else {
      this.loading = 3;
    }
    // 监听订单刷新事件
    uni.$on("reloadOrderList", this.resetOptions);
    uni.$on("didLogin", this.handleLogin);
  },
  methods: {
    //  订单状态重置
    resetOptions(orderStatus) {
      console.log("===订单监听重置--", orderStatus);
      this.pageOption[this.currentIndex].orderStatus =
        orderStatus == "null" ? null : orderStatus;
      this.pageOption[this.currentIndex]["pageNum"] = 1;
      //  this.tablist[this.currentIndex] = []
      this.$set(this.tablist, this.currentIndex, []);
      this.getOrderList();
    },
    // 登录监听
    async handleLogin() {
      uni.getStorageSync("userInfo", this.userinfor);
      this.userinfor = await this.getUserInfo();
      if (this.userinfor.tel) {
        this.loading = 2;
      } else {
        this.loading = 3;
      }
      this.getOrderList(1);
    },
    goLogin() {
      uni.navigateTo({ url: "/pages/user-center/login" });
    },
    //  订单列表
    getOrderList(loadmore) {
      const token = uni.getStorageSync("token");
      if (!token) return;
      uni.showLoading({ title: "加载中" });
      const pageParams = this.pageOption[this.currentIndex];
      if (!pageParams) {
        this.pageOption[this.currentIndex] = {
          pageNum: 1,
          pageSize: 20,
        };
      }
      if (this.orderSource === "3") {
        this.getInsuranceOrderList(loadmore);
        return;
      }
      if (this.orderSource === "9") {
        this.getShopOrderList(loadmore);
        return;
      }
      if (this.orderSource === "5") {
        this.consumOrderList();
        return;
      }
      // 全部 酒店订单，附近优惠订单
      api.getOrderList({
        data: {
          // transactionStatus: '1',
          pageNum: this.pageOption[this.currentIndex]["pageNum"],
          pageSize: this.pageOption[this.currentIndex]["pageSize"],
          orderSource: this.orderSource,
          orderStatus:
            this.currentIndex == 1
              ? 3
              : this.pageOption[this.currentIndex]["orderStatus"],
        },
        success: (data) => {
          uni.stopPullDownRefresh();
          uni.hideLoading();

          const list = data.list || [];
          // // 暂时屏蔽商城订单
          // list = list.filter(item => item.orderSource !== 9)
          if (list.length > 0) {
            if (loadmore) {
              this.$set(
                this.tablist,
                this.currentIndex,
                this.tablist[this.currentIndex].concat(list)
              );
            } else {
              this.$set(this.tablist, this.currentIndex, list);
            }
            this.pageOption[this.currentIndex]["pageNum"] =
              this.pageOption[this.currentIndex]["pageNum"] + 1;
          }
          if (
            this.tablist[this.currentIndex].length == 0 ||
            this.tablist[this.currentIndex].length < 3
          ) {
            this.bottomTips = "";
          } else {
            this.bottomTips = list.length > 0 ? "more" : "nomore";
          }
        },
        fail: (err) => {
          uni.showToast(err.message);
          uni.stopPullDownRefresh();
          uni.hideLoading();
        },
      });
    },
    consumOrderList(loadmore) {
      api.getOrderList({
        data: {
          pageNum: this.pageOption[this.currentIndex]["pageNum"],
          pageSize: this.pageOption[this.currentIndex]["pageSize"],
          orderSource: this.orderSource,
          orderStatus: this.pageOption[this.currentIndex]["orderStatus"],
        },
        success: (data) => {
          uni.stopPullDownRefresh();
          uni.hideLoading();
          const list = data.list || [];
          if (list.length > 0) {
            if (loadmore) {
              this.$set(
                this.tablist,
                this.currentIndex,
                this.tablist[this.currentIndex].concat(list)
              );
            } else {
              this.$set(this.tablist, this.currentIndex, list);
            }
            this.pageOption[this.currentIndex]["pageNum"] =
              this.pageOption[this.currentIndex]["pageNum"] + 1;
          }
          if (
            this.tablist[this.currentIndex].length == 0 ||
            this.tablist[this.currentIndex].length < 3
          ) {
            this.bottomTips = "";
          } else {
            this.bottomTips = list.length > 0 ? "more" : "nomore";
          }
        },
        fail: (err) => {
          uni.showToast(err.message);
          uni.stopPullDownRefresh();
          uni.hideLoading();
        },
      });
    },
    async getShopOrderList(loadmore) {
      const params = {
        pageNum: this.pageOption[this.currentIndex]["pageNum"],
        numPerPage: 20,
        sceneType: this.items[this.currentIndex].name,
        status:
          this.currentIndex == 1
            ? 3
            : this.pageOption[this.currentIndex]["orderStatus"],
      };
      const result = await Axios.post("/order/list", params);
      uni.hideLoading();
      uni.stopPullDownRefresh();
      if (result.code == 200) {
        const list = result.data.list || [];
        if (list.length > 0) {
          if (loadmore) {
            this.$set(
              this.tablist,
              this.currentIndex,
              this.tablist[this.currentIndex].concat(list)
            );
          } else {
            this.$set(this.tablist, this.currentIndex, list);
          }
          this.pageOption[this.currentIndex]["pageNum"] =
            this.pageOption[this.currentIndex]["pageNum"] + 1;
        }
      } else {
        uni.showToast(result.msg);
      }
      if (result.total > 5) {
        this.bottomTips = result.hasNextPage ? "more" : "nomore";
      } else {
        this.bottomTips = "";
      }
    },
    async getInsuranceOrderList(loadmore) {
      if (loadmore && !this.pageOption[this.currentIndex]["hasNextPage"]) {
        uni.hideLoading();
        uni.stopPullDownRefresh();
        this.bottomTips = "nomore";
        return;
      }
      const params = {
        pageNum: this.pageOption[this.currentIndex]["pageNum"],
        pageSize: 10,
        status:
          this.currentIndex == 1
            ? 3
            : this.pageOption[this.currentIndex]["orderStatus"],
      };
      api.getInsuranceOrderList({
        data: params,
        success: (result) => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (result.list.length > 0) {
            const list = result.list || [];
            if (list.length > 0) {
              if (loadmore) {
                this.$set(
                  this.tablist,
                  this.currentIndex,
                  this.tablist[this.currentIndex].concat(list)
                );
              } else {
                this.$set(this.tablist, this.currentIndex, list);
              }
              this.pageOption[this.currentIndex]["pageNum"] =
                this.pageOption[this.currentIndex]["pageNum"] + 1;
            }
            this.pageOption[this.currentIndex]["hasNextPage"] =
              result.hasNextPage;
          } else {
            uni.showToast(result.msg);
          }
          if (result.total > 5) {
            this.bottomTips = result.hasNextPage ? "more" : "nomore";
          } else {
            this.bottomTips = "";
          }
        },
        fail: (result) => {
          uni.showToast(result.msg);
        },
      });
    },
    // 获取订单分类
    getOrderDictList() {
      return new Promise((resolve, reject) => {
        api.getOrderDictList({
          data: {},
          success: (res) => {
            res.unshift({ name: "全部", value: "" });
            // 过滤 积分兑换订单
            // res = res.filter(item => item.name !== '积分兑换')
            this.items = res;
            resolve(res);
          },
          fail: (error) => {
            reject(error);
          },
        });
      });
    },
    /**
     * 获取用户信息
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
    refresh() {},
    loadMore() {
      console.log("加载更多");
      if (this.orderSource === "5") {
        this.consumOrderList(1);
        return;
      }
      this.getOrderList(1);
    },
    clickItem(v, index) {
      this.currentIndex = index;
      this.tabName = v.name;
      const type = this.items[index].value + "" || "";
      this.orderSource = type;
      this.pageOption = {
        [index]: {
          orderStatus: null,
          pageNum: 1,
          pageSize: 20,
        },
      };
      this.getOrderList();
    },
  },
};
</script>
<style lang="scss" scoped>
.cont {
  //#ifdef MP-ALIPAY
  //   margin-top:113rpx;
  //#endif
  //#ifdef MP-WEIXIN
  // margin-top:247rpx;
  //#endif

  height: calc(100vh - 114rpx);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.navigation-bar {
  width: 100%;
  height: 100%;
  background-color: #ff5d28;
  .image {
    @include size(48, 48);
    margin: 0 14rpx 0 30rpx;
  }
}
.ordermanage {
  //  background-color:#fff;
  //  margin-top: 23%;
  //  overflow:auto;
  //  margin-top: 160rpx;
  // .tabCur {
  //  position: sticky;
  //  top: 8%;
  // }
  .collectCenter {
    background-color: #f2f2f2;
    //  z-index:9;
    //  flex: 1;
    // padding-bottom: 118rpx;
  }
  .empt {
    // width: 68%;
    // margin: 0 auto;
    // text-align: center;
    // margin-top: 45%;
    width: 68%;
    text-align: center;
    position: absolute;
    left: 18%;
    top: 30%;
    .l_empt {
      width: 444rpx;
      height: 228rpx;
    }
    .watch {
      font-size: 36rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 50rpx;
      margin-bottom: 72rpx;
      margin-top: 38rpx;
    }
    .login {
      width: 398rpx;
      height: 108rpx;
      background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
      border-radius: 54rpx;
      font-size: 44rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 108rpx;
      text-align: center;
      margin: 0 auto;
    }
  }
}
</style>
