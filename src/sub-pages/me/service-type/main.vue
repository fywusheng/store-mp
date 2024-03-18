<template>
  <div class="page-service-type">
    <ul class="type-list">
      <li class="type" @click="toRefund(1)">
        <div class="title">仅退款</div>
        <div class="tip">未收到货(包含未签收),或与卖家协商后</div>
        <img class="icon-right"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-right.png">
      </li>
      <li class="type" @click="toRefund(2)">
        <div class="title">退货退款</div>
        <div class="tip">已收货，需要退回已收到的商品</div>
        <img class="icon-right"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-right.png">
      </li>
      <!-- <li class="type" @click="toRefund(3)">
        <div class="title">换货</div>
        <div class="tip">已收货，需要更换已收到的商品</div>
        <img class="icon-right" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-right.png">
      </li> -->
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  components: {
  },
  methods: {
    toRefund(type) {
      const url = `../refund-apply/main?type=${type}&itemId=${this.$mp.query.itemId}&num=${this.$mp.query.num}&orderId=${this.$mp.query.orderId}&skuId=${this.$mp.query.skuId}&productId=${this.$mp.query.productId}`
      wx.redirectTo({
        url: url
      })
    }
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '选择服务类型'
    })
  }
}
</script>

<style lang="scss">
@import '~@/styles/base';

.page-service-type {
  .type-list {
    border-top: rpx(1) solid $border;
    .type {
      position: relative;
      padding: rpx(25) rpx(30);
      border-bottom: rpx(1) solid $border;
      .title {
        font-size: rpx(28);
        font-weight: bold;
      }
      .tip {
        padding-top: rpx(15);
        font-size: rpx(24);
        color: $light-black;
      }
      .icon-right {
        @include middle-center-y();
        right: rpx(30);
        width: rpx(16);
        height: rpx(27);
      }
    }
  }
}
</style>
