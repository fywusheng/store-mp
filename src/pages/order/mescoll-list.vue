<template>
  <view>
    <!-- 菜单 -->
    <view class="top-warp">
      <!-- 当设置tab-width,指定每个tab宽度时,则不使用flex布局,改用水平滑动 -->
      <me-tabs
        class="me-tabs"
        v-model="tabIndex"
        :tabs="tabs"
        @change="tabChange"
      ></me-tabs>
    </view>

    <!-- top="xxx"下拉布局往下偏移,防止被悬浮菜单遮住 -->
    <mescroll-body
      ref="mescrollRef"
      @init="mescrollInit"
      top="120"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @emptyclick="emptyClick"
    >
      <!-- 目前只显示附近优惠 -->
      <near-order v-if="name === '附近优惠'" :list="orderList" />
      <!-- 酒店订单 -->
      <hotel-order v-if="name === '酒店'" :list="orderList" />
      <!-- 全部订单 -->
      <all-order v-if="name === '全部'" :list="orderList" />
      <!-- 商城订单 -->
      <shop-order v-if="name === '积分兑换'" :list="orderList" />
    </mescroll-body>
  </view>
</template>

<script>
import MescrollMixin from "./mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollBody from "./mescroll-uni/components/mescroll-body/mescroll-body.vue";
import MeTabs from "./component/me-tabs.vue";
import AllOrder from "./component/all-order.vue";
import ShopOrder from "./component/shop-order.vue";
import HotelOrder from "./component/hotel-order.vue";
import NearOrder from "./component/my-order.vue";
import api from "@/apis/index.js";

export default {
  mixins: [MescrollMixin], // 多个mescroll-body写在子组件时, 则使用mescroll-more.js补充子组件的页面生命周期
  components: {
    MeTabs,
    MescrollBody,
    AllOrder,
    ShopOrder,
    HotelOrder,
    NearOrder,
  },
  data() {
    return {
      upOption: {
        // page: {
        // 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
        // 	size: 10 // 每页数据的数量
        // },
        textNoMore: "暂无更多数据",
        noMoreSize: 2, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          tip: "~ 搜索无数据 ~", // 提示
          btnText: "去看看",
          use: false,
        },
      },
      orderList: [], // 列表数据
      tabs: [],
      name: "全部",
      tabIndex: 0, // 当前tab下标,必须与mescroll-more.js对应,所以tabIndex是固定变量,不可以改为其他的名字
    };
  },
  async onLoad(e) {
    const token = uni.getStorageSync("token") || e.token;
    const tabs = await this.getOrderDictList();
    this.tabs = [{ name: "全部", value: "" }, ...tabs];
    if (token) {
      uni.setStorageSync("token", token);
      this.userinfor = await this.getUserInfo();
      uni.setStorageSync("userInfo", this.userinfor);
      if (this.userinfor.tel) {
        this.loading = 2;
      } else {
        this.loading = 3;
      }
      // this.getOrderList(1)
    } else {
      this.loading = 3;
    }
    // 监听订单刷新事件
    // uni.$on('reloadOrderList', this.resetOptions)
  },
  onShow() {
    // 返回刷新: https://www.mescroll.com/uni.html#note 第二点
    // if(this.canReset){
    // 	let curMescroll = this.getMescroll(this.tabIndex)
    // 	curMescroll && curMescroll.resetUpScroll()
    // }
    // this.canReset = true
  },
  methods: {
    /* 上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    async upCallback(page) {
      console.log(this.tabs, this.tabIndex, "1111");
      // 联网加载数据
      const curTab = this.tabs[this.tabIndex];
      const orderSource = curTab ? curTab.value : ""; // 具体项目中,您可能取的是tab中的type,status等字段

      if (this.name === "积分兑换") {
        this.getShopOrderList(page);
        return;
      }

      const params = {
        pageNum: page.num,
        pageSize: page.size,
        orderSource: orderSource,
        orderStatus: null,
      };

      try {
        const res = await this.getOrderList(params);

        // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(0);
        // 设置列表数据
        if (page.num == 1) this.orderList = []; // 如果是第一页需手动制空列表
        this.orderList = [] || this.orderList.concat(res.list); // 追加新数据
      } catch (err) {
        // 联网失败, 结束加载
        this.mescroll.endErr();
        uni.showToast({
          icon: "error",
          title: err.message,
        });
      }
    },
    //  订单列表
    getOrderList(data) {
      return new Promise((resolve, reject) => {
        api.getOrderList({
          data,
          success: (data) => {
            resolve(data);
          },
          fail: (err) => {
            debugger;
            reject(err);
          },
        });
      });
    },
    // 商城订单
    async getShopOrderList(page) {
      try {
        const params = {
          pageNum: page.num,
          numPerPage: page.size,
          sceneType: this.name,
          status: null,
        };
        const { data } = await Axios.post("/order/list", params);
        debugger;

        // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(data.list.length);
        // 设置列表数据
        if (page.num == 1) this.orderList = []; // 如果是第一页需手动制空列表
        this.orderList = this.orderList.concat(data.list); // 追加新数据
      } catch (err) {
        // 联网失败, 结束加载
        this.mescroll.endErr();
        console.log(err);
        uni.showToast({
          icon: "error",
          title: err.message,
        });
      }
    },
    // 点击空布局按钮的回调
    emptyClick() {
      uni.showToast({
        title: "点击了按钮,具体逻辑自行实现",
      });
    },
    // 切换菜单
    tabChange() {
      this.name = this.tabs[this.tabIndex].name;
      this.orderList = []; // 先置空列表,显示加载进度
      this.mescroll.resetUpScroll(); // 再刷新列表数据
    },
    // 获取订单分类
    getOrderDictList() {
      return new Promise((resolve, reject) => {
        api.getOrderDictList({
          data: {},
          success: (res) => {
            resolve(res);
          },
          fail: (error) => {
            reject(error);
          },
        });
      });
    },
    // 获取用户信息
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
  },
};
</script>

<style>
.top-warp {
  z-index: 9990;
  position: fixed;
  top: --window-top; /* css变量 */
  left: 0;
  width: 100%;
  height: 120upx;
  background-color: white;
  display: flex;
  align-items: center;
}
.me-tabs {
  flex: 1;
}
.top-warp .tip {
  font-size: 28upx;
  height: 60upx;
  line-height: 60upx;
  text-align: center;
}
</style>
