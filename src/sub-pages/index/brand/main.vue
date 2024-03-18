<template>
  <div class="page-brand">
    <img mode="aspectFit" :style="{height: height+ 'rpx'}" @load="onLoad" class="brand-cover"
         :src="brandInfo.brandPictUrl">
    <div class="brand-info">
      <img mode="aspectFit" class="brand-logo" :src="brandInfo.brandLogo">
      <div class="brand-name">{{brandInfo.brandName}}</div>
      <div class="btn-attention" @click="changeAttention">{{brandInfo.isAttention == 1 ? '已关注':'关注'}}</div>
    </div>
    <div class="brand-desc">
      {{brandInfo.brandIntroduce}}
      <!--<img mode="aspectFit" class="btn-down" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-down.png">-->
    </div>
    <ul class="filter-list">
      <li class="filter" @click="changeFilter({id: 0})" :class="activeId === 0 ? 'active':''">
        <div class="title">默认</div>
      </li>
      <li class="filter" @click="changeFilter(sort)" :key="sort.id" v-for="sort in sortList"
          :class="activeId === sort.id ? 'active':''">
        <div class="title">{{sort.name}}</div>
        <img v-if="sort.sort === 1" class="filter-status" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/down.png">
        <img v-else class="filter-status" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/up.png">
      </li>
    </ul>
    <ul class="item-list">
      <li class="item" @click="toDetail(item)" v-for="(item,index) in itemList" :key="index">
        <img class="item-logo" mode="aspectFit" :lazy-load="true" :src="item.proPictDir">
        <!--<div class="item-point">{{item.brandName}}</div>-->
        <div class="item-name">{{item.productName}}</div>
        <div class="price-layout">
          <div class="sale-price">¥{{item.cuPrice}}</div>
          <div class="market-price">¥{{item.originalPrice}}</div>
          <img class="icon-cart" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-cart.png">
        </div>
      </li>
    </ul>
    <div class="btn-home" @click="goHome">回首页看看吧</div>
    <top ref="toTop" :bottom="80" :showContact="false"></top>
  </div>
</template>

<script>
  import Top from '@/sub-pages/index/components/top.vue'

  export default {
    data() {
      return {
        sortList: [
          {
            id: 1,
            sort: 0,
            name: '按时间',
          }, {
            id: 2,
            sort: 0,
            name: '按销量',
          }, {
            id: 3,
            sort: 0,
            name: '按价格',
          }
        ],
        activeId: 0,
        itemList: [],
        scrollTop: 0,
        height: 750,
        brandInfo: {},
      }
    },
    components: {
      Top,
    },
    methods: {
      goHome(){
        wx.navigateTo({
          url: '/sub-pages/index/index/main'
        })
      },
      onUnload() {
        this.brandInfo = {};
        this.itemList = [];
      },
      onLoad(e) {
        this.height = parseInt(e.mp.detail.height / e.mp.detail.width * 750);
      },
      changeFilter(sort) {
        if (this.activeId === sort.id) {
          sort.sort = sort.sort === 1 ? 0 : 1;
        }
        this.activeId = sort.id;
        let sortType;
        switch (this.activeId) {
        case 1:
          sortType = sort.sort === 1 ? 12 : 11;
          break;
        case 2:
          sortType = sort.sort === 1 ? 32 : 31;
          break;
        case 3:
          sortType = sort.sort === 1 ? 22 : 21;
          break;
        }
        this.sortType = sortType;
        this.loadItem()
      },
      async changeAttention(){
        wx.showLoading({
          title: '正在提交...'
        })
        const result = await wx.request({
          data: {
            method: this.brandInfo.isAttention == 0 ? 'brand.addconcern' : 'brand.delconcern',
            brandId: this.id,
          }
        })
        wx.hideLoading();
        if (result.result.result == 1) {
          wx.showToast({
            title:  this.brandInfo.isAttention == 0 ? '关注成功' : '取消成功',
            icon: 'none'
          })
          this.brandInfo.isAttention = this.brandInfo.isAttention == 0 ? 1 : 0;
        } else {
          wx.showToast({
            title: result.result.message,
            icon: 'none'
          })
        }
      },
      toDetail(data) {
        wx.navigateTo({
          url: `/pages/item/main?id=` + data.productSid
        })
      },
      async loadItem(){
        const params = {
          pageSize: 100,
          pageNum: 1,
          brandId: this.id,
        }
        if(this.sortType){
          params.sortType = this.sortType;
        }
        // const itemResult = await wx.request({
        //   url: BASE_SEARCH_URL,
        //   data: params
        // })
        // if (itemResult.result.result == 1) {
        //   this.itemList = itemResult.data.esProducts;
        // } else {
        //   wx.showToast({
        //     title: itemResult.result.message,
        //     icon: 'none'
        //   })
        // }
      }
    },
    onPageScroll(e) {
      this.$refs.toTop.show(e.scrollTop > App.systemInfo.screenHeight)
    },
    async mounted() {
      this.id = this.$root.$mp.query.id;
      console.info(this.id)
      wx.showLoading({ title: '正在获取数据...', mask: true });
      const result = await wx.request({
        data: {
          method: 'product.brandInfo',
          brandId: this.id,
        }
      })
      wx.hideLoading()
      if (result.result.result == 1) {
        this.brandInfo = result.data;
      } else {
        wx.showToast({
          title: result.result.message,
          icon: 'none'
        })
      }
      wx.setNavigationBarTitle({
        title: '品牌详情'
      })
      this.loadItem();
    },
  }
</script>

<style lang="scss">
  @import "~@/styles/base";

  .page-brand {
    padding-bottom: rpx(50);
    .brand-cover {
      display: block;
      width: rpx(750);
    }
    .brand-info {
      margin-top: rpx(45);
      position: relative;
      display: flex;
      align-items: center;
      padding-left: rpx(30);
      .brand-logo {
        width: rpx(90);
        height: rpx(90);
      }
      .brand-name {
        margin-left: rpx(40);
        font-size: rpx(30);
        color: $black;
      }
      .btn-attention {
        @include middle-center-y();
        right: rpx(30);
        height: rpx(50);
        line-height: rpx(50);
        text-align: center;
        border-radius: rpx(25);
        width: rpx(110);
        font-size: rpx(22);
        border: rpx(1) solid $main-color;
        color: $main-color;
      }
    }
    .brand-desc {
      position: relative;
      padding: rpx(40) rpx(30) rpx(120);
      font-size: rpx(26);
      line-height: 1.385;
      color: $gray;
      .btn-down {
        @include middle-center-x();
        bottom: rpx(50);
        width: rpx(27);
        height: rpx(16);
      }
    }
    .filter-list {
      @include filter-list()
    }
    .item-list {
      @include item-list();
    }
    .btn-home {
      display: block;
      margin: rpx(45) auto;
      width: rpx(240);
      height: rpx(60);
      line-height: rpx(60);
      text-align: center;
      border: rpx(1) solid $black;
      color: $black;
      font-size: rpx(28);
      border-radius: rpx(30);
    }
  }
</style>
