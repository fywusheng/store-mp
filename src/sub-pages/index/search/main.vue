<style lang="scss">
  @import '~@/styles/base';

  .page-search {
    position: relative;
    display: block;
    width: rpx(750);
    background-color: #fff;

    .search-header {
      @include middle-center-x(fixed);
      top: 0;
      width: rpx(750);
      height: rpx(88);
      padding-left: rpx(32);
      padding-right: rpx(118);
      display: flex;
      align-items: center;
      background-color: #fff;
      z-index: 100;

      form {
        display: block;
        width: 100%;
      }

      input {
        display: block;
        position: relative;
        width: 100%;
        padding-left: rpx(65);
        padding-right: rpx(30);
        height: rpx(88);
        background-color: $extra-gray;
        font-size: rpx(36);
        color: $black;
        border-radius: 16rpx;
      }

      .icon-search {
        @include middle-center-y();
        left: rpx(54);
        width: rpx(40);
        height: rpx(40);
        z-index: 10;
      }

      .btn-clear {
        @include middle-center-y();
        right: rpx(30);
        font-size: rpx(36);
        font-weight: 500;
      }
    }

    .label-list-wrap {
      padding: rpx(128) rpx(30) rpx(30);
      background-color: #fff;

      .title {
        position: relative;
        font-size: rpx(36);
        color: $black;
        font-weight: bold;

        img {
          @include middle-center-y();
          right: rpx(30);
          width: rpx(36);
          height: rpx(36);
        }
      }

      .label-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .label {
          position: relative;
          margin-top: rpx(40);
          margin-right: rpx(30);
          height: rpx(68);
          line-height: rpx(68);
          width: rpx(110);
          font-size: rpx(36);
          text-align: center;
          background-color: #f6f6f6;
          color: $black;
          @include ellipsis();
        }
      }
    }
  }
</style>

<template>
  <div class="page-search">
    <div class="search-header">
      <img
        class="icon-search"
        src="http://192.168.1.187:10088/static/images/common/icon-search.png"
      />
      <input
        ref="searchInput"
        confirm-type="search"
        :adjust-position="false"
        @confirm="search('')"
        :placeholder="key"
        v-model="key"
      />
      <div class="btn-clear" @click="cancel">取消</div>
    </div>
    <div class="label-list-wrap" v-if="showHistory">
      <div class="title">
        历史搜索
        <img src="http://192.168.1.187:10088/static/images/icon-delete.png" @click="clearHistory" />
      </div>
      <ul class="label-list">
        <li
          class="label"
          @click="search(history)"
          v-for="(history, index) in historyList"
          :key="index"
        >
          {{ history }}
        </li>
      </ul>
    </div>
    <!--<ul class="label-list mt-20">-->
    <!--<li class="title label">热门标签</li>-->
    <!--<li class="label" @click="search(hot)" v-for="(hot,index) in hotList" :key="index">{{hot}}</li>-->
    <!--</ul>-->
  </div>
</template>

<script>
  export default {
    name: 'SEARCH',
    data() {
      return {
        key: '搜索你想找的商品',
        historyList: uni.getStorageSync('SEARCH_HISTORY_LIST') || [],
        resultList: [],
      };
    },
    loadDefaultData: true,
    computed: {
      showHistory() {
        return this.historyList && this.historyList.length;
      },
    },
    components: {},
    filters: {},
    methods: {
      cancel() {
        uni.navigateBack();
      },
      clearHistory() {
        uni.removeStorageSync('SEARCH_HISTORY_LIST');
        this.historyList = [];
      },
      async search(hot) {
        if (hot) {
          this.key = hot;
        }
        this.key && this.historyList.indexOf(this.key) === -1 && this.historyList.push(this.key);
        uni.setStorageSync('SEARCH_HISTORY_LIST', this.historyList);
        uni.navigateTo({
          url: '/sub-pages/index/item-list/main?key=' + this.key,
        });
      },
    },
    async onShow() {
      this.key = '';
    },
  };
</script>
