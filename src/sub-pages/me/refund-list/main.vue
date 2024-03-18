<template>
  <div class="page-refund-list">
    <ul class="item-list">
      <li class="item" @click="toDetail(item)" :key="itemIndex"
        v-for="(item,itemIndex) in itemList">
        <div class="store-name">
          售后单号:{{item.returnsCode}}
          <div class="status">{{item.returnsTypeLabel}}</div>
        </div>
        <div class="item-body">
          <img class="item-logo" mode="aspectFit" :lazy-load="true" :src="item.orderItem.imgUrl">
          <div class="item-name">{{item.orderItem.productName}}</div>
          <div class="sku-name">{{item.orderItem.skuName}}</div>
          <div class="item-price">¥{{item.orderItem.totalAmount}}</div>
          <div class="item-qty">*{{item.num}}</div>
          <div class="status">{{item.statusLabel}}</div>
          <div class="btn-link" @click.stop="toDetail(item)">查 看</div>
        </div>
      </li>
    </ul>
    <top ref="toTop"></top>
    <empty v-if="!itemList.length" text="您还没有售后订单,去首页逛逛" :showHome="true"></empty>
  </div>
</template>

<script>
import Top from '@/sub-pages/index/components/top.vue'

export default {
  data() {
    return {
      itemList: [],
      status: 0
    }
  },
  components: {
    Top
  },
  methods: {
    async loadData() {
      const params = {
        pageNum: 1,
        numPerPage: 100
      }
      wx.showLoading({ title: '正在加载...', mask: true })
      const result = await Axios.post('/aftersale/returns/list', { params })
      wx.hideLoading()
      if (result.code == 200) {
        this.itemList = result.data.list
      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
      }
    },
    toDetail(item) {
      wx.navigateTo({
        url: `../refund-detail/main?productId=${this.$mp.query.productId}&skuId=${this.$mp.query.skuId}&orderId=${this.$mp.query.orderId}`
      })
    },
    toItem(item) {
      wx.navigateTo({
        url: `/pages/item/main?id=${item.pId}`
      })
    }
  },
  onPageScroll(e) {
    this.$refs.toTop.show(e.scrollTop > App.systemInfo.screenHeight)
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '售后列表'
    })
    if (!Store.getters.isLogin) {
      await Store.dispatch('login')
    }
    this.loadData()
  }
}
</script>

<style lang="scss">
@import '~@/styles/base';

.page-refund-list {
  padding: 20rpx 20rpx 60rpx;
  min-height: 100vh;
  background-color: #f4f4f4;
  .item-list {
    .item {
      padding-left: 10rpx;
      padding-bottom: 10rpx;
      margin-bottom: 30rpx;
      background-color: #fff;
      border-radius: 8rpx;
      border: 1px solid #e7e7e7;
      .store-name {
        position: relative;
        padding: 20rpx 30rpx;
        font-size: rpx(24);
        font-weight: bold;
        color: $black;
        border-bottom: rpx(1) solid #eee;
        .status {
          @include middle-center-y();
          right: 30rpx;
        }
      }
      .item-body {
        position: relative;
        padding: rpx(30) rpx(150) rpx(30) rpx(190);
        height: rpx(230);
        .item-logo {
          @include middle-center-y();
          left: rpx(30);
          width: rpx(140);
          height: rpx(140);
        }
        .item-name {
          font-size: rpx(28);
          @include multi-ellipsis();
        }
        .sku-name {
          padding-top: rpx(10);
          font-size: rpx(24);
          color: $extra-black;
        }
        .status {
          padding-top: rpx(10);
          color: $main-color;
          font-size: rpx(26);
        }
        .item-price {
          position: absolute;
          top: rpx(30);
          right: rpx(30);
          font-size: rpx(28);
          color: $black;
        }
        .item-qty {
          position: absolute;
          top: rpx(80);
          right: rpx(30);
          font-size: rpx(28);
          color: $gray;
        }
        .btn-link {
          position: absolute;
          right: 30rpx;
          bottom: 20rpx;
          height: rpx(60);
          line-height: rpx(50);
          text-align: center;
          width: rpx(145);
          font-size: rpx(26);
          color: #000;
          border: rpx(1) solid #000;
          border-radius: 8rpx;
        }
      }
    }
  }
}
</style>
