<style lang="scss">
.page-coupon-list {
  padding-top: rpx(88);
  background-color: #f7f7f7;
  min-height: 100vh;

  .tab-list {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #fff;
    z-index: 1000;

    .tab {
      position: relative;
      flex: 1;
      text-align: center;

      .name {
        display: inline-block;
        height: rpx(88);
        line-height: rpx(88);
        padding-left: rpx(18);
        padding-right: rpx(18);
        font-size: rpx(28);
        color: $color-grey;
        border-bottom: rpx(6) solid transparent;
      }

      &.active {
        .name {
          font-size: rpx(32);
          color: $color-black;
          border-bottom-color: #ff5500;
        }
      }
    }
  }

  .title {
    padding: rpx(34) rpx(51) rpx(14);
    font-size: rpx(30);
    line-height: rpx(42);
    color: $color-lightgrey;
  }

  .coupon-list {
    padding-top: rpx(20);
    padding-left: rpx(40);
    padding-right: rpx(20);
    .coupon {
      position: relative;
      width: rpx(680);
      margin-bottom: rpx(15);
      .coupon-body {
        position: relative;
        padding: rpx(30) rpx(30) rpx(30) rpx(216);
        width: rpx(680);
        min-height: rpx(200);
        background: url(https://szyh-ecommerce-oss.oss-cn-zhangjiakou.aliyuncs.com/commerce/product/1624952173708.png)
          left top no-repeat;
        background-size: cover;

        &.disabled {
          background-image: url(https://szyh-ecommerce-oss.oss-cn-zhangjiakou.aliyuncs.com/commerce/product/1624952118838.png);

          .coupon__name {
            color: #999;
          }
        }
        .money {
          @include middle-center-y();
          left: 0;
          font-size: rpx(40);
          color: #fff;
          width: rpx(192);
          text-align: center;
          @include ellipsis();

          .unit {
            margin-right: rpx(-10);
            font-size: rpx(32);
          }

          .desc {
            font-size: rpx(22);
            line-height: rpx(30);
          }
        }
        .coupon__name {
          padding-top: rpx(30);
          padding-bottom: rpx(10);
          font-size: rpx(26);
          line-height: rpx(40);
          @include ellipsis();
          font-weight: bold;
        }
        .coupon__time {
          padding-top: rpx(20);
          font-size: rpx(24);
          line-height: rpx(30);
          color: #999;
        }
      }
      .coupon__description {
        display: flex;
        align-items: center;
        padding: rpx(20) rpx(20) rpx(20);
        background-color: #fff;
        color: #999;
        font-size: rpx(25);
        image {
          margin-left: rpx(10);
          width: rpx(26);
          height: rpx(26);
        }
      }
      .coupon__description-content {
        padding: 0 rpx(20) rpx(20);
        background-color: #fff;
        line-height: 1.5;
        color: #999;
        font-size: rpx(25);
      }
    }
  }

  .empty-wrap {
    text-align: center;
    padding-top: rpx(300);
    .img {
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: rpx(210);
      height: rpx(130);
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

<template>
  <div class="page-coupon-list">
    <ul class="tab-list">
      <li
        class="tab"
        @click="changeStatus(0)"
        :class="status === 0 ? 'active' : ''"
      >
        <div class="name">未使用</div>
      </li>
      <li
        class="tab"
        @click="changeStatus(1)"
        :class="status === 1 ? 'active' : ''"
      >
        <div class="name">已使用</div>
      </li>
      <li
        class="tab"
        @click="changeStatus(2)"
        :class="status === 2 ? 'active' : ''"
      >
        <div class="name">已过期</div>
      </li>
    </ul>
    <template v-if="status === 0">
      <ul class="coupon-list" v-if="couponList1 && couponList1.length">
        <li class="coupon" :key="index" v-for="(coupon, index) in couponList1">
          <div class="coupon-body">
            <div class="money">
              <span class="unit"></span>
              <span v-if="coupon.type == 0"
                >{{ coupon.denominationStr }}元</span
              >
              <span v-else-if="coupon.type == 1"
                >{{ coupon.denominationStr }}折</span
              >
              <div class="desc">满{{ coupon.thresholdValue }}元可用</div>
            </div>
            <div class="coupon__name">{{ coupon.name }}</div>
            <div class="coupon__time">
              {{ coupon.beginTime }} 至 {{ coupon.endTime }}
            </div>
          </div>
          <div class="coupon__description" @click="changeDesc(coupon)">
            使用描述
            <img
              mode="scaleToFill"
              v-if="coupon.showDesc"
              src="/static/images/me/up.png"
            />
            <img mode="scaleToFill" v-else src="/static/images/me/down.png" />
          </div>
          <div class="coupon__description-content" v-if="coupon.showDesc">
            {{ coupon.description }}
          </div>
        </li>
      </ul>
      <div class="empty-wrap" v-if="status === 0 && !couponList1?.length">
        <img
          mode="scaleToFill"
          src="https://xiu-obs.obs.cn-south-1.myhuaweicloud.com/1556375797799.png"
        />
        <div class="title">很遗憾</div>
        <div class="desc">您暂时无可用的优惠券</div>
      </div>
    </template>
    <template v-if="status === 1">
      <ul class="coupon-list" v-if="couponList2 && couponList2.length">
        <li
          class="coupon disabled"
          :key="index"
          v-for="(coupon, index) in couponList2"
        >
          <div class="coupon-body">
            <div class="money">
              <span class="unit"></span>
              <span v-if="coupon.type == 0"
                >{{ coupon.denominationStr }} 元</span
              >
              <span v-else-if="coupon.type == 1"
                >{{ coupon.denominationStr }} 折</span
              >
              <div class="desc">满{{ coupon.thresholdValue }}元可用</div>
            </div>
            <div class="coupon__name">{{ coupon.name }}</div>
            <div class="coupon__time">
              {{ coupon.beginTime }} 至 {{ coupon.endTime }}
            </div>
          </div>
          <div class="coupon__description" @click="changeDesc(coupon)">
            规则描述
            <img
              mode="scaleToFill"
              v-if="coupon.showDesc"
              src="/static/images/me/up.png"
            />
            <img mode="scaleToFill" v-else src="/static/images/me/down.png" />
          </div>
          <div class="coupon__description-content" v-if="coupon.showDesc">
            {{ coupon.description }}
          </div>
        </li>
      </ul>
      <div class="empty-wrap" v-if="status === 1 && !couponList2?.length">
        <img
          mode="scaleToFill"
          src="https://xiu-obs.obs.cn-south-1.myhuaweicloud.com/1556375797799.png"
        />
        <div class="desc">暂无已使用的优惠券</div>
      </div>
    </template>
    <template v-if="status === 2">
      <ul class="coupon-list" v-if="couponList3 && couponList3.length">
        <li
          class="coupon disabled"
          :key="index"
          v-for="(coupon, index) in couponList3"
        >
          <div class="coupon-body">
            <div class="money">
              <span class="unit"></span>
              <span v-if="coupon.type == 0"
                >{{ coupon.denominationStr }}元</span
              >
              <span v-else-if="coupon.type == 1"
                >{{ coupon.denominationStr }}折</span
              >
              <div class="desc">满{{ coupon.thresholdValue }}元可用</div>
            </div>
            <div class="coupon__name">{{ coupon.name }}</div>
            <div class="coupon__time">
              {{ coupon.beginTime }} 至 {{ coupon.endTime }}
            </div>
          </div>
          <div class="coupon__description" @click="changeDesc(coupon)">
            使用描述
            <img
              mode="scaleToFill"
              v-if="coupon.showDesc"
              src="/static/images/me/up.png"
            />
            <img mode="scaleToFill" v-else src="/static/images/me/down.png" />
          </div>
          <div class="coupon__description-content" v-if="coupon.showDesc">
            {{ coupon.description }}
          </div>
        </li>
      </ul>
      <div class="empty-wrap" v-if="status === 2 && !couponList3?.length">
        <img
          mode="scaleToFill"
          src="https://xiu-obs.obs.cn-south-1.myhuaweicloud.com/1556375797799.png"
        />
        <div class="desc">暂无已过期的优惠券</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "COUPON_LIST",
  data() {
    return {
      status: 0,
      couponCouponList: [],
    };
  },
  computed: {
    couponList1() {
      return this.couponCouponList?.filter((coupon) => {
        return coupon.usedState === 0;
      });
    },
    couponList2() {
      return this.couponCouponList?.filter((coupon) => {
        return coupon.usedState === 1;
      });
    },
    couponList3() {
      return this.couponCouponList?.filter((coupon) => {
        return coupon.usedState === 2;
      });
    },
  },
  onLoad(e) {
    this.status = Number(e.status) || 0;
  },
  methods: {
    changeDesc(data) {
      data.showDesc = !data.showDesc;
    },
    changeStatus(index) {
      this.status = index;
    },
    async loadData() {
      uni.showLoading();
      const couponResult = await Axios.post("/coupon/loading", {
        pageNum: 1,
        pageSize: 100,
        queryObject: {
          sessionId: Store.state.login.sessionId,
        },
      });
      uni.hideLoading();
      if (couponResult.code == 200) {
        this.couponCouponList = couponResult?.data?.list?.map((data) => {
          data.showDesc = false;
          return data;
        });
      } else {
        uni.showToast(couponResult.msg);
      }
    },
  },
  async mounted() {
    if (!Store.getters.isLogin) {
      await Store.dispatch("login");
    }
    this.loadData();
  },
};
</script>
