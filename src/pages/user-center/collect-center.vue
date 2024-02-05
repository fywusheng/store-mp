<template>
  <view>
    <view class="tabCur">
      <uni-segmented-control
        :current="current"
        :values="items"
        @clickItem="onClickItem"
        styleType="text"
        activeColor="#FF711A"
      ></uni-segmented-control>
    </view>
    <view class="collectCenter">
      <view v-if="current === 0">
        <merchant-type :list="tablist[0]" @fresh="fresh"></merchant-type>
      </view>
      <view v-if="current === 1">
        <article-type :list="tablist[1]" @fresh="fresh"></article-type>
      </view>
      <view v-if="current === 2">
        <article-type :list="tablist[2]" @fresh="fresh"></article-type>
      </view>
    </view>
  </view>
</template>
<script>
import api from "@/apis/index.js";
import articleType from "@/pages/user-center/common/article.vue";
import merchantType from "@/pages/user-center/common/merchant.vue";
export default {
  components: { articleType, merchantType },
  data() {
    return {
      current: 0,
      items: ["商户", "文章", "视频"],
      tablist: [[], [], []],
      pageOption: [
        {
          pageNum: 1,
          pageSize: 20,
        },
        {
          pageNum: 1,
          pageSize: 20,
        },
        {
          pageNum: 1,
          pageSize: 20,
        },
      ],
      latitude: "",
      longitude: "",
    };
  },
  onShow() {
    const colId = uni.getStorageSync("colId");
    if (this.current === 1) {
      const getArray = this.tablist[this.current].filter(
        (item, index, array) => {
          return item.colId !== colId;
        }
      );
      this.$set(this.tablist, this.current, getArray);
    } else {
      const getArray = this.tablist[this.current].filter(
        (item, index, array) => {
          return item.orgOfficeId !== colId;
        }
      );
      this.$set(this.tablist, this.current, getArray);
    }
  },
  destroyed() {
    // TODO 之后再删除那个同名storeage里的key   uni.setStorageSync('colId', this.dataDetail.orgOfficeId);
  },

  created() {
    uni.getLocation({
      type: "gcj02",
      success: (res) => {
        this.latitude = res.latitude;
        this.longitude = res.longitude;
        this.businessList();
      },
      fail: (err) => {
        this.$uni.showToast(err);
      },
    });
  },
  onReachBottom() {
    // 上拉加载
    const changeData = {
      0: this.businessList,
      1: this.articalList,
      2: this.articalList,
    };
    changeData[this.current]();
  },
  onPullDownRefresh() {
    // 下拉刷新
    const changeData = {
      0: this.businessList,
      1: this.articalList,
      2: this.articalList,
    };
    changeData[this.current]();
  },

  methods: {
    getLocation() {
      console.log("获取当前位置信息");
      // 先将原有位置信息清空, 再重新定位, 位置信息发生变化, 才能将当前定位置于屏幕中心
      uni.getLocation({
        type: "gcj02",
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
        },
        fail: (err) => {
          this.$uni.showToast(err);
        },
      });
    },
    fresh(mapVal) {
      const index = mapVal.index;
      const type = mapVal.type || null;
      const topflag =
        this.tablist[this.current][index]["topFlag"] == "1" ? "0" : "1";
      this.tablist[this.current][index]["topFlag"] = topflag;
      const stashItem = JSON.stringify(this.tablist[this.current][index]);
      if (type == 1) {
        // 取消收藏
        console.log("===当前情况--", this.current);
        this.tablist[this.current].splice(index, 1);
        return;
      }
      if (topflag == "0") {
        this.tablist[this.current].splice(index, 1);
        this.tablist[this.current].push(JSON.parse(stashItem));
      } else {
        this.tablist[this.current].splice(index, 1);
        this.tablist[this.current].unshift(JSON.parse(stashItem));
      }
    },
    onClickItem(e) {
      this.current = e.currentIndex;
      const changeData = {
        0: this.businessList,
        1: this.articalList,
        2: this.articalList,
      };
      changeData[this.current]();
    },
    // 文章
    articalList() {
      uni.showLoading({
        title: "加载中",
      });
      const params = {
        pageNum: this.pageOption[this.current]["pageNum"],
        pageSize: this.pageOption[this.current]["pageSize"],
        colType: this.current == 2 ? "5" : "4",
      };
      api.findArticleCollectList({
        data: params,
        success: (res) => {
          const list = res.list || [];
          if (list.length > 0) {
            this.$set(
              this.tablist,
              this.current,
              this.tablist[this.current].concat(list)
            );
            this.pageOption[this.current]["pageNum"] =
              this.pageOption[this.current]["pageNum"] + 1;
          }
          uni.stopPullDownRefresh();
          uni.hideLoading();
        },
        fail: (err) => {
          uni.showToast(err.message);
          uni.stopPullDownRefresh();
          uni.hideLoading();
        },
      });
    },
    // 商户
    businessList() {
      uni.showLoading({
        title: "加载中",
      });
      const params = {
        lon: this.longitude, // 精度
        lat: this.latitude, // 维度
        pageNum: this.pageOption[0]["pageNum"],
        pageSize: this.pageOption[0]["pageSize"],
      };
      api.findBusinessCollectList({
        data: params,
        success: (res) => {
          const list = res.list || [];
          if (list.length > 0) {
            this.$set(this.tablist, 0, this.tablist[0].concat(list));
            this.pageOption[0]["pageNum"] = this.pageOption[0]["pageNum"] + 1;
            // this.pageOption[0]['pageSize'] = res['pageSize']
          }
          uni.stopPullDownRefresh();
          uni.hideLoading();
        },
        fail: (error) => {
          this.$uni.showToast(error.message);
          uni.stopPullDownRefresh();
          uni.hideLoading();
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.tabCur {
  position: fixed;
  width: 100%;
  background-color: #fff;
  top: 0;
  z-index: 1;
}
.collectCenter {
  background-color: #fff;
  height: 100vh;
}
</style>
