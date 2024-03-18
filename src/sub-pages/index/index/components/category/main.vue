<template>
  <div class="page-category">
    <div class="search-layout">
      <div class="search" @click="toSearch">
        <img class="icon-search"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-search.png">
        输入关键字搜索商品...
      </div>
    </div>

    <view class="panel" v-for="(top,index) in categoryList" :key="index">
      <view class="panel-header">
        <view class="left-line"></view>
        <view class="panel-header-title">{{top.name}}</view>
      </view>
      <view class="panel-body">

        <view class="img-list">
          <view class="item" v-for="item in top.children" :key="item.id" @click="toCategory(item)">
            <image class="icon-img" :src="item.iconUrl" mode="" />
            <view class="txt">{{item.name}}</view>
          </view>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      subList: [],
      currentIndex: 0,
      brandList: [],
      bannerList: [],
      operation: {},
      height: (App.systemInfo.windowHeight - 37) + 'px'
    }
  },
  methods: {
    toSearch() {
      wx.navigateTo({
        url: '/sub-pages/index/search/main'
      })
    },
    changeCategory(category, index) {
      this.currentIndex = index
      this.subList = category.children
    },
    toCategory(cate) {
      XIU.bridge.goCategory(cate.code)
    },
    async loadData() {
      uni.showLoading()
      const result = await Axios.post('/product/getProductListByType', {
        productType: 3
      })
      uni.hideLoading()
      if (result.code == 200) {
        this.categoryList = result.data
        this.changeCategory(this.categoryList[this.currentIndex], 0)
      } else {
        wx.showToast(result.result.message)
      }
    }
  },
  async mounted() {
    await this.loadData()
  }
}
</script>

<style lang="scss" scoped>
.page-category {
  padding-bottom: 226rpx;
  .panel {
    padding: 16rpx 38rpx;
    .panel-header {
      display: flex;
      align-items: center;
      .left-line {
        margin-right: 16rpx;
        width: 8rpx;
        height: 38rpx;
        border-radius: 4rpx;
        background: #ff9500;
      }
      .panel-header-title {
        font-size: 44rpx;
        font-weight: 500;
        color: #333333;
        line-height: 60rpx;
      }
    }
    .panel-body {
      .img-list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 144rpx;
          margin: 20rpx 0;
          margin-right: 30rpx;
          &:nth-child(4n) {
            margin-right: 0;
          }
          .icon-img {
            width: 120rpx;
            height: 120rpx;
            margin-bottom: 8rpx;
          }
          .txt {
            font-size: 36rpx;
            text-align: center;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .search-layout {
    display: flex;
    align-items: center;
    padding-left: 32rpx;
    padding-right: 32rpx;
    padding-bottom: 10rpx;
    .search {
      display: flex;
      align-items: center;
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      font-size: 36rpx;
      padding-left: 20rpx;
      color: #666666;
      background-color: #f8f8f8;
      border-radius: 54rpx;

      .icon-search {
        margin-right: 15rpx;
        height: 40rpx;
        width: 40rpx;
      }
    }
  }
}
</style>
