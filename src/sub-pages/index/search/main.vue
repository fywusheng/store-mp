<template>
  <view class="search">
    <!-- 顶部搜索模块 -->
    <view class="search-view flex-h flex-c-b bg-white p-0-32">
      <view class="search-bar flex-h flex-c-b flex-1 p-0-32">
        <input
          v-model="keyword"
          :focus="false"
          mode="scaleToFill"
          :maxlength="maxlength"
          class="search-bar__input fs-36 c-black flex-1"
          placeholder="输入关键字"
        />
        <image
          v-if="keyword"
          mode="scaleToFill"
          class="search-bar__icon ml-8"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-input-clear.png"
          @click="keyword = ''"
        />
        <template>
          <view class="search-bar__line" />
          <image
            class="search-bar__voice ml-16"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-voice-grey.png"
            @click="handleVoiceInputClick"
          />
        </template>
      </view>
      <button
        class="cancel-button fs-36 c-black ml-24"
        hover-class="none"
        @click="handleSearchClick"
      >
        搜索
      </button>
    </view>
    <!-- 历史记录模块 -->
    <view class="histroy" v-if="!keyword && prodList.length === 0">
      <!-- 搜索历史 -->
      <view class="histroy-serach" v-if="histroySearch.length > 0">
        <text class="histroy-serach-left">搜索历史</text>
        <view class="histroy-serach-right" @click="clearHistory">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/map/delete2x.png"
            mode="scaleToFill"
          >
          </image>
          <text>清空</text>
        </view>
      </view>
      <view
        class="histroy-item"
        v-for="(item, index) in histroySearch"
        @click="setHistory(index)"
        :key="index"
      >
        <text class="histroy-item-left">{{ item }}</text>
        <view class="histroy-item-right" @click.stop="deleteKey(index)">
          <image
            src="https://ggllstatic.hpgjzlinfo.com/static/find/delete2x.png"
            mode="scaleToFill"
          ></image>
        </view>
      </view>
    </view>
    <!-- 搜索结果显示模块 -->
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
        <view class="_p"> ￥{{ v.salePrice }} </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 搜索关键字
      keyword: "",
      list: [],
      // 最大长度限制
      maxlength: 64,
      // 历史搜索列表(放在缓存里)
      histroySearch: [],
      // 搜索结果列表
      prodList: [],
      // 页码
      pageNum: 1,
      // 每页条数
      pageSize: 20,
    };
  },
  onLoad() {
    if (uni.getStorageSync("histroySearch")) {
      this.histroySearch = uni.getStorageSync("histroySearch");
    }
  },
  methods: {
    // 清空
    clearHistory() {
      uni.showModal({
        title: "",
        content: "确认删除全部搜索历史？",
        cancelText: "取消",
        confirmText: "确定",
        success: (res) => {
          if (res.confirm) {
            this.histroySearch = [];
            uni.setStorageSync("histroySearch", this.histroySearch);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
    goItemClick(item) {
      uni.navigateTo({
        url: `/sub-pages/index/item/main?id=${item.id}&sceneType=积分兑换`,
      });
    },
    // 删除历史
    deleteKey(index) {
      this.histroySearch.splice(index, 1);
      uni.setStorageSync("histroySearch", this.histroySearch);
    },
    // 点击历史查询
    setHistory(index) {
      this.keyword = this.histroySearch[index];
      this.histroySearch.splice(index, 1);
      this.histroySearch.unshift(this.keyword);
      uni.setStorageSync("histroySearch", this.histroySearch);
      this.pageNum = 1;
      this.handleSearchClick();
    },
    /**
     * 点击搜索事件
     */
    async handleSearchClick() {
      if (!this.keyword) {
        this.$uni.showToast("请输入您要搜索的词");
        return;
      }
      const data = {
        // supplierId: 0,
        keywords: this.keyword,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      // 是否在历史中已存在
      const a = this.histroySearch.find((value, index, arr) => {
        return value == this.keyword;
      });
      // 不存在就新增
      if (a === undefined && this.keyword && this.histroySearch.length < 20) {
        this.histroySearch.unshift(this.keyword);
      } else if (
        a === undefined &&
        this.keyword &&
        this.histroySearch.length >= 20
      ) {
        this.histroySearch.pop();
        this.histroySearch.unshift(this.keyword);
      }
      uni.setStorageSync("histroySearch", this.histroySearch);

      const res = await Axios.post("/product/getProductSearchList", data);
      if (res.code === "200") {
        this.prodList = res.data.esProducts || [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  min-height: 100vh;
  background: #fff;
  position: relative;
  .search-view {
    width: 100%;
    height: 112rpx;
    .search-bar {
      height: 80rpx;
      border-radius: 40rpx;
      border: 2rpx solid $color-primary;
      box-sizing: border-box;
      &__input {
        height: 74rpx;
        padding: 0;
      }
      &__icon {
        @include square(32);
        border-radius: 16rpx;
        margin: 0 8rpx;
      }
      &__line {
        @include size(2, 24);
        background: #c9c9c9;
      }
      &__voice {
        @include square(48);
      }
    }
    .cancel-button {
      margin-left: 24rpx;
    }
  }
  .histroy {
    background: #fff;
    padding: 0 32rpx;
    // position: absolute;
    // top: 112rpx;
    // left: 0;
    // right: 0;
    // z-index: 1;
    max-height: calc(100vh - 112rpx);

    .histroy-top {
      line-height: 90rpx;
      width: 100%;
      height: 90rpx;
      border-bottom: 2rpx solid #eeeeee;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      // font-size: 36rpx;
    }
    .histroy-serach {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 90rpx;
      .histroy-serach-left {
        font-size: 40rpx;
        font-weight: bold;
        color: #333333;
      }
      .histroy-serach-right {
        display: flex;
        align-items: center;
        image {
          width: 40rpx;
          height: 40rpx;
        }
        text {
          margin-left: 10rpx;
          color: #999999;
          font-size: 36rpx;
        }
      }
    }
    .histroy-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 90rpx;
      border-bottom: 2rpx solid#EEEEEE;
      .histroy-item-left {
        flex-shrink: 0;
        width: 480rpx;
        font-size: 40rpx;
        color: #333333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 90rpx;
        height: 90rpx;
      }
      .histroy-item-right {
        display: flex;
        align-items: center;
        image {
          width: 40rpx;
          height: 40rpx;
        }
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
}
</style>
