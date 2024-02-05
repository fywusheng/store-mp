<template>
  <view class="bede-house">
    <!-- banner -->
    <view class="banner-wrapper">
      <swiper
        class="banner-swiper"
        :indicator-dots="banners.length"
        :autoplay="true"
        :interval="4000"
        :duration="500"
        indicator-active-color="#FDFDFD"
        indicator-color="#FDFDFD"
      >
        <swiper-item class="item" v-for="(item, index) in banners" :key="index">
          <image
            class="image"
            mode="scaleToFill"
            :src="item.bannerUrl"
            @click="handleBannerClick(index)"
          />
        </swiper-item>
      </swiper>
    </view>
    <!-- <view class="tabs"> -->
    <me-tabs
      :tabs="tabs"
      field="name"
      v-model="select"
      font-size="36rpx"
      @change="handleTabClick"
    ></me-tabs>
    <!-- </view> -->

    <!-- 商品推荐 -->
    <view class="recommed">
      <view
        class="_block"
        v-for="(v, i) in prodList"
        :key="i"
        @click="goItemClick(v)"
      >
        <image mode="scaleToFill" class="icon" :src="v.mainImgUrl" />
        <image
          class="icon bgempt"
          v-if="v.soldOut === 0"
          src="https://ggllstatic.hpgjzlinfo.com/static/home/empt.png"
        />
        <view class="name">{{ v.name }}</view>
        <!-- <view class="jf">积分抵扣￥{{ v.creditPoints }}</view> -->
        <view class="_p">
          <!-- <view class="getPrice">到手价</view> -->
          ￥{{ v.salePrice }}
        </view>
      </view>
    </view>
    <uni-load-more :status="status" />
    <!-- top -->
    <view class="top-layout">
      <view class="menu" @click="toTop">
        <image
          class="icon-top"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/top.png"
        />
      </view>
    </view>
  </view>
</template>
<script>
import api from "@/apis/index.js";
export default {
  data() {
    return {
      banners: [],
      select: 0,
      status: "more",
      pageNum: 1,
      prodList: [],
      tabs: [],
    };
  },
  async created() {
    this.getBanners();
    this.getListByParentCode();
  },
  onLoad() {},
  methods: {
    handleBannerClick() {},
    toTop() {
      my.pageScrollTo({
        scrollTop: 0,
        duration: 500,
      });
    },
    // tabClick
    handleTabClick(item, index) {
      this.pageNum = 1;
      this.prodList = [];
      this.getProdList();
    },
    // 商品列表
    async getProdList() {
      this.status = "loading";
      const params = {
        isCreditPoints: 0,
        categoryCode:
          this.tabs.length > 0 ? this.tabs[this.select].code : "BC00002950",

        pageNum: this.pageNum,
        pageSize: 20,
      };
      try {
        const res = await Axios.post("/product/getProductSearchList", params);
        if (res.code === "200") {
          const data = res.data || {};
          const esProducts = data.esProducts || [];
          if (esProducts.length) {
            this.prodList = this.prodList.concat(esProducts);
            this.status = data.totalPage > data.pageNum ? "more" : "noMore";
          }
          if (this.prodList.length == 0) {
            this.status = "noMore";
          }
        }
      } catch (error) {
        this.status = "noMore";
        console.log(error);
      }
    },
    // 获取分类
    async getListByParentCode() {
      const data = { parentCode: "BC00002950" };
      const res = await Axios.post("/category/getListByParentCode", data);
      if (res.code == "200") {
        this.tabs = res.data || {};
      }
      this.getProdList();
    },
    // 去详情
    goItemClick({ id }) {
      uni.navigateTo({
        url: `/sub-pages/index/item/main?id=${id}&sceneType=积分兑换`,
      });
    },
    // 获取banner
    getBanners() {
      api.getBanners({
        data: { bannerType: "12", status: "1" },
        success: (data) => {
          this.banners = data;
        },
      });
    },
  },
  onReachBottom() {
    if (this.status === "noMore") return;
    this.pageNum++;
    this.getProdList();
  },
};
</script>
<style lang="scss" scoped>
.bede-house {
  background-color: #f5f5f5;
  min-height: 100vh;
  .tabs {
    background: #fff;
    width: 100%;
    padding: 0 32rpx;
    box-sizing: border-box;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 2;
  }
  .banner-wrapper {
    height: 264rpx;
    padding-top: 24rpx;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .banner-swiper {
      height: 224rpx;
      width: 686rpx;
    }
    .item {
      height: 224rpx;
      width: 686rpx;
      .image {
        width: 100%;
        height: 100%;
        border-radius: 16rpx;
      }
    }
  }
  .recommed {
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
    padding: 32rpx;
    box-sizing: border-box;
    min-height: 500rpx;
    ._block {
      background: #ffffff;
      border-radius: 16px;
      width: 332rpx;
      margin-bottom: 25rpx;
      position: relative;
      .icon {
        width: 332rpx;
        height: 340rpx;
        border-radius: 16rpx;
        &.bgempt {
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .name {
        height: 85rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        margin-top: 18rpx;
        margin-left: 18rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .jf {
        max-width: 270rpx;
        margin-left: 18rpx;
        width: fit-content;
        padding-right: 12rpx;
        height: 48rpx;
        border-radius: 4rpx;
        border: 2rpx solid #ff2600;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ff2600;
        margin-top: 50rpx;
        line-height: 48rpx;
        padding-left: 10rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      ._p {
        font-size: 40rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ff5500;
        margin: 8rpx 0;
        margin-left: 18rpx;
        display: flex;
        height: 50rpx;
        line-height: 50rpx;
        .getPrice {
          font-size: 28rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ff5500;
        }
      }
    }
  }
  .top-layout {
    position: fixed;
    right: 30rpx;
    bottom: 580rpx;
    z-index: 1000;
    .menu {
      position: relative;
      .icon-top {
        width: 100rpx;
        height: 100rpx;
      }
    }
  }
}
</style>
