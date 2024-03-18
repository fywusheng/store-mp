<template>
  <div class="page-category">
    <div class="search-layout">
      <div class="search" @click="toSearch">
        <img class="icon-search" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-search.png">
        输入关键字搜索商品...
      </div>
    </div>
    <div class="category-list-layout">
      <scroll-view scroll-y class="top-list" :style="{height: height}">
        <li class="top" @tap="changeCategory(top, index)" :class="currentIndex===index ? 'active':''"
            v-for="(top,index) in categoryList" :key="index">{{top.name}}
        </li>
      </scroll-view>
      <scroll-view scroll-y class="content-layout" :style="{height: height}">
        <img class="banner" mode="widthFix" :style="{marginBottom: (operation.space_height || 0) + 'px'}"
             v-for="(banner,index) in bannerList" @tap="toBanner(banner.topic_link)" :key="index"
             :src="banner.image_url">
        <ul class="cate-list">
          <li class="cate" v-for="(cate,index) in subList" :key="index">
            <div class="cate-name" @tap="toCategory(cate)">
              {{cate.name}}
              <div class="btn-right">全部<i class="iconfont icon-you"></i></div>
            </div>
            <ul class="sub-cate-list">
              <li class="sub-cate" @tap="toCategory(subCate)"
                  v-for="(subCate,subIndex) in cate.children"
                  :key="subIndex">
                <div class="sub-cate-logo" :style="{backgroundImage: 'url('+subCate.iconUrl+')'}"></div>
                <div class="sub-cate-name">{{subCate.name}}</div>
              </li>
            </ul>
          </li>
        </ul>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  import wx from 'utils/wx'
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
    components: {},
    methods: {
      toSearch() {
        uni.upx2px
        wx.navigateTo({
          url: '/sub-pages/index/search/main'
        })
      },
      toBanner(link) {
        XIU.bridge.genLink(link)
      },
      changeCategory(category, index) {
        this.currentIndex = index;
        this.subList = category.children;
      },
      toCategory(cate) {
        XIU.bridge.goCategory(cate.code);
      },
      async loadData() {
        wx.showLoading();
        const result = await Axios.post('/category/getCategoryList', {
          // params: {
            type: 2
          // }
        });
        wx.hideLoading();
        if (result.code == 200) {
          this.categoryList = result.data;
          this.changeCategory(this.categoryList[this.currentIndex], 0)
        } else {
          wx.showToast(result.result.message)
        }
      }
    },
    async mounted() {
      const result = await Axios.get(`${ENV.CMS}/operationContent/getByCode?code=SEARCH_BANNER`)
      if (result.code === 200) {
        this.bannerList = result.data.contentList;
        this.operation = result.data.operation;
      }
      await this.loadData();
    }
  }
</script>

<style lang="scss">
  @import "~@/styles/base";

  .page-category {
    height: calc(100vh - 226rpx);
    .search-layout {
      display: flex;
      align-items: center;
      padding-left: rpx(32);
      padding-right: rpx(32);
      padding-bottom: rpx(10);
      .search {
        display: flex;
        align-items: center;
        width: 100%;
        height: rpx(64);
        line-height: rpx(64);
        font-size: rpx(28);
        padding-left: rpx(20);
        color: $extra-black;
        background-color: #f8f8f8;
        border-radius: rpx(10);

        .icon-search {
          margin-right: rpx(15);
          height: rpx(30);
          width: rpx(30);
        }
      }
    }
  }

  .category-list-layout {
    display: flex;

    .top-list {
      padding-bottom: rpx(50);
      width: rpx(180);
      background: #F8F8F8;
      .top {
        position: relative;
        height: rpx(88);
        line-height: rpx(88);
        padding-left: rpx(20);
        padding-right: rpx(20);
        font-size: rpx(26);
        text-align: center;
        color: $extra-light-black;
        @include ellipsis();

        &.active {
          color: $black;
          background: #fff;
          font-weight: 500;
          font-size: rpx(28);
          &:after {
            content: '';
            @include middle-center-y();
            left: 0;
            height: rpx(50);
            width: rpx(6);
            background-color: $main-color;
          }
        }
      }
    }

    .content-layout {
      width: rpx(570);
      padding-top: rpx(25);
      padding-left: rpx(30);
      padding-right: rpx(10);
      background: #fff;
      .banner {
        display: block;
        width: 100%;
      }

      .cate-list {
        .cate {
          min-height: rpx(100);

          .cate-name {
            position: relative;
            padding-top: rpx(30);
            padding-bottom: rpx(30);
            font-size: rpx(28);
            color: $black;
            font-weight: bold;

            .btn-right {
              display: flex;
              align-items: center;
              @include middle-center-y();
              right: 0;
              font-size: rpx(24);
              color: $light-black;
              font-weight: normal;

              i {
                margin-left: rpx(10);
                font-size: rpx(24);
                transform: scale(.9);
              }
            }
          }

          .sub-cate-list {
            display: flex;
            flex-wrap: wrap;

            .sub-cate {
              width: rpx(120);
              margin-bottom: rpx(40);
              margin-right: rpx(60);

              &:nth-child(3n) {
                margin-right: 0;
              }
            }

            .sub-cate-logo {
              width: rpx(120);
              height: rpx(120);
              background: center no-repeat;
              background-size: contain;
            }

            .sub-cate-name {
              margin-top: rpx(15);
              font-size: rpx(24);
              text-align: center;
              color: $black;
              @include ellipsis();
            }
          }
        }
      }
    }
  }
</style>