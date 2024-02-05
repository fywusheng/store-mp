<template>
  <div class="checkout-coupon">
    <ul class="tab-list">
      <li class="tab" @click="changeTab(0)" :class="{ active: status === 0 }">
        可用({{ canuseList.length }})
      </li>
      <li class="tab" @click="changeTab(1)" :class="{ active: status === 1 }">
        不可用({{ notuseList.length }})
      </li>
    </ul>
    <template v-if="status === 0">
      <ul class="coupon-list" v-if="canuseList && canuseList.length">
        <li
          class="coupon"
          :key="index"
          v-for="(coupon, index) in canuseList"
          @click="toSelectCount(coupon)"
        >
          <div class="money">
            <span class="unit"></span>
            <span v-if="coupon.type == 0">{{ coupon.denominationStr }}元</span>
            <span v-else-if="coupon.type == 1"
              >{{ coupon.denominationStr }}折</span
            >
            <div v-if="coupon.checkThreshold == 0" class="desc">无门槛</div>
            <div v-else-if="coupon.checkThreshold == 1" class="desc">
              满{{ coupon.thresholdValue }}元可用
            </div>
          </div>
          <div class="coupon__name">{{ coupon.name }}</div>
          <div class="coupon__rule">{{ coupon.description }}</div>
          <div class="coupon__time">
            {{ coupon.beginTime }} 至 {{ coupon.endTime }}
          </div>
        </li>
      </ul>
      <div class="empty-wrap" v-if="status === 0 && !canuseList.length">
        <img
          class="icon-empty"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-empty.png"
        />
      </div>
    </template>
    <template v-if="status === 1">
      <ul class="coupon-list" v-if="notuseList && notuseList.length">
        <li
          class="coupon disabled"
          :key="index"
          v-for="(coupon, index) in notuseList"
        >
          <div class="money">
            <span class="unit"></span>
            <span v-if="coupon.type == 0">{{ coupon.denominationStr }}元</span>
            <span v-else-if="coupon.type == 1"
              >{{ coupon.denominationStr }}折</span
            >
            <div v-if="coupon.checkThreshold == 0" class="desc">无门槛</div>
            <div v-else-if="coupon.checkThreshold == 1" class="desc">
              满{{ coupon.thresholdValue }}元可用
            </div>
          </div>
          <div class="coupon__name">{{ coupon.name }}</div>
          <div class="coupon__rule">{{ coupon.description }}</div>
          <div class="coupon__time">
            {{ coupon.beginTime }} 至 {{ coupon.endTime }}
          </div>
        </li>
      </ul>
      <div class="empty-wrap" v-if="status === 1 && !notuseList.length">
        <img
          class="icon-empty"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-empty.png"
        />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      couponList: [],
      status: 0,
    };
  },
  computed: {
    notuseList() {
      if (Store.state.checkout.couponData) {
        return Store.state.checkout.couponData.cannotUsedList || [];
      }
      return [];
    },
    canuseList() {
      if (Store.state.checkout.couponData) {
        return Store.state.checkout.couponData.canUsedList || [];
      }
      return [];
    },
  },
  components: {},
  methods: {
    toSelectCount(coupon) {
      console.info("coupon:", coupon);
      Store.commit(VUEX.CHECKOUT.SET_COUPON, coupon);
      Store.dispatch("getCheckoutData", false);
      uni.$emit("onSelectCoupon", coupon);
      uni.navigateBack();
    },
    changeTab(status) {
      this.status = status;
    },
    selectCoupon(coupon) {
      if (coupon.status != 0) {
        return false;
      }
      Store.commit(VUEX.CHECKOUT.SET_COUPON, coupon);
      uni.navigateBack();
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
.checkout-coupon {
  min-height: 100vh;
  background: #f5f5f5;
  .tab-list {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #ffffff;

    .tab {
      position: relative;
      height: rpx(80);
      line-height: rpx(80);
      font-size: rpx(36);
      text-align: center;
      border-bottom: rpx(2) solid transparent;

      &.active {
        color: $color-black;
        font-weight: 500;
        border-bottom: rpx(8) solid #ff711a;
      }
    }
  }

  .coupon-list {
    padding-top: rpx(30);
    padding-left: rpx(40);
    padding-right: rpx(20);
    .coupon {
      position: relative;
      padding: rpx(30) rpx(30) rpx(30) rpx(228);
      margin-bottom: rpx(30);
      width: rpx(693);
      min-height: rpx(232);
      background: url(https://ggllstatic.hpgjzlinfo.com/static/images/order/icon-enabled.png)
        left top no-repeat;
      background-size: 220rpx 232rpx;
      background-color: #ffffff;

      &.disabled {
        background-image: url(https://ggllstatic.hpgjzlinfo.com/static/images/order/icon-disabled.png);

        .coupon__name,
        .coupon__rule {
          color: #999;
        }
      }

      .money {
        @include middle-center-y();
        left: 0;
        font-size: rpx(40);
        color: #fff;
        width: rpx(228);
        text-align: center;
        @include ellipsis();

        .unit {
          margin-right: rpx(-10);
          font-size: rpx(32);
        }

        .desc {
          font-size: rpx(32);
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        ._span {
          font-size: 40rpx;
          font-weight: 500;
        }
      }

      .coupon__name {
        padding-bottom: rpx(10);
        font-size: rpx(32);
        line-height: rpx(40);
        @include ellipsis();
        font-weight: 500;
      }
      .coupon__rule {
        padding-top: rpx(10);
        padding-bottom: rpx(10);
        font-size: rpx(32);
        line-height: rpx(37);
        @include ellipsis();
        font-weight: bold;
      }
      .coupon__time {
        padding-top: rpx(17);
        font-size: rpx(32);
        line-height: rpx(30);
        color: #999;
      }
    }
  }

  .empty-wrap {
    text-align: center;
    padding-top: rpx(250);

    .icon-empty {
      width: rpx(440);
      height: rpx(344);
      margin: 0 auto;
    }

    .title {
      padding-top: rpx(30);
      font-size: rpx(32);
      color: #999;
    }

    .desc {
      padding-top: rpx(10);
      color: #999;
      font-size: rpx(24);
    }
  }
}
</style>
