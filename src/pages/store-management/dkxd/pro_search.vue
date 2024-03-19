<!-- author by liushuag -->
<!-- date：2.14 -->
<template>
  <view class="main_content">
    <!-- 代客下单-产品搜索 -->
    <view class="top">
      <image
        src="http://192.168.1.187:10088/static/store-mp/topbg-dk.png"
        mode="widthFix"
        class="bg_img"
      />
      <view class="content">
        <view class="date">2024-2-14</view>
        <view class="desc">
          店员
          <text>【高磊】</text>
          正在代客户
          <text>【张三】</text>
          下单…
        </view>
      </view>
      <view class="search-content" @click="handleVoiceSearchClick">
        <image
          src="http://192.168.1.187:10088/static/store-mp/search-img.png"
          mode="widthFix"
        ></image>
      </view>
    </view>
    <view class="fl_content">
      <view v-for="(top, index) in categoryList" :key="index" class="fl_main">
        <view class="title">{{ top.name }}</view>
        <view class="fl_list flex_r_h">
          <view
            v-for="item in top.children"
            :key="item.id"
            @click="toCategory(item)"
            class="fl_item flex_c_h"
          >
            <image :src="item.iconUrl" model="scaleToFill"></image>
            <view>{{ item.name }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    // computed: mapGetters(['isLogin', 'uid']),
    components: {},
    data() {
      return {
        categoryList: [],
      };
    },
    watch: {},
    mounted() {},
    onLoad() {
      this.loadData();
    },
    onShow() {},
    methods: {
      // 请求数据
      async loadData() {
        const { code, data } = await Axios.post('/category/getCategoryList', {
          type: 2,
        });
        if (code === '200') {
          this.categoryList = data;
        } else {
          this.uni.showToast(msg);
        }
      },

      // 去列表页
      toCategory(cate) {
        uni.navigateTo({
          url: '/sub-pages/index/item-list/main?dispId=' + cate.id,
        });
      },
      handleVoiceSearchClick() {
        console.log(12);
        uni.navigateTo({
          url: '/sub-pages/index/search/main',
        });
      },

      handleImgLoadFail(item) {
        item.iconUrl = ENV.IMG_DEFAULT;
      },
    },
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
      .bg_img {
        position: relative;
        width: 100%;
        z-index: -1;
      }
      .content {
        position: absolute;
        padding: 0 32rpx;
        top: 24rpx;
        width: 100%;
        justify-content: flex-start;
        text-align: left;
        .date {
          font-size: 32rpx;
          font-weight: 600;
          color: #ff5500;
        }
        .desc {
          font-size: 28rpx;
          font-weight: 400;
          color: #303133;
          margin-top: 16rpx;
          text {
            color: #ff5500;
          }
        }
      }
      .search-content {
        width: 100%;
        margin-top: -9rpx;
        image {
          width: 100%;
        }
      }
    }
    .fl_content {
      padding: 28rpx 32rpx;
      background: #fff;
      margin-top: 24rpx;
      .title {
        font-size: 32rpx;
        font-weight: 500;
        color: #333333;
      }
      .title::before {
        width: 6rpx;
        height: 24rpx;
        background: #ff5500;
        content: '';
        display: inline-block;
        margin-right: 12rpx;
      }
      .fl_main {
        margin-bottom: 32rpx;
      }
      .fl_list {
        padding: 24rpx 0;
        justify-content: space-between;
        flex-wrap: wrap;
        .fl_item {
          flex: 0 0 25%;
          margin-bottom: 24rpx;
          image {
            width: 92rpx;
            height: 92rpx;
          }
          view {
            font-size: 28rpx;
            font-weight: 500;
            color: #303133;
            margin-top: 16rpx;
          }
        }
      }
    }
  }
</style>
