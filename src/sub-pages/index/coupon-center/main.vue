<template>
  <div class="page-coupon-center">
    <ul class="coupon-list">
      <li class="coupon" :key="index" v-for="(coupon,index) in couponList">
        <div class='coupon-body'>
          <div class="money">
            <span class="unit"></span>
            <span v-if="coupon.type==0">{{coupon.denominationStr}}元</span>
            <span v-else-if="coupon.type==1">{{coupon.denominationStr}}折</span>
            <div class="desc">满{{coupon.thresholdValue}}元可用</div>
          </div>
          <div class="coupon__name">{{coupon.name}}</div>
          <div class="coupon__time">
            {{ coupon.beginTime }} 至 {{ coupon.endTime }}
          </div>
          <div v-if='coupon.receivedState == 0' class="btn-receive" @click='toCoupon(coupon)'>待领取
          </div>
          <div v-else class="btn-receive disabled">已领取</div>
        </div>
        <div class='coupon__description' @click='changeDesc(coupon)'>规则描述 <img
            v-if='coupon.showDesc' src='/static/images/me/up.png'> <img v-else
            src='/static/images/me/down.png'></div>
        <div class='coupon__description-content' v-if='coupon.showDesc'>{{ coupon.description }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import wx from 'utils/wx'

export default {
  data() {
    return {
      couponList: []
    }
  },
  components: {},
  methods: {
    changeDesc(data) {
      data.showDesc = !data.showDesc;
    },
    async toCoupon(coupon) {
      wx.showLoading({
        title: '正在领取...'
      });
      const result = await Axios.post('/coupon/receive', {
        couponId: coupon.id,
      })
      wx.hideLoading();
      if (result.code == 200) {
        wx.showToast({
          icon: 'none',
          title: result.msg
        });
        await this.loadData()
      }
      else {
        wx.showToast(result.msg);
      }
    },
    async loadData() {
      wx.showLoading();
      const result = await Axios.post('/coupon/list', {
        pageNum: 1,
        pageSize: 100,
        queryObject: { sessionId: Store.state.login.sessionId }
      })
      wx.hideLoading();
      if (result.code == 200) {
        this.couponList = result.data.map(data => {
          data.showDesc = false;
          return data;
        });
      }
    }
  },
  async onLoad() {
    if (!Store.getters.isLogin) {
      await Store.dispatch('login')
    }
    await this.loadData()
  }
}
</script>

<style lang="scss">
@import '~@/styles/base';

.page-coupon-center {
  background-color: #f7f7f7;
  min-height: 100vh;
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

        .btn-receive {
          position: absolute;
          top: 35%;
          right: rpx(30);
          width: rpx(120);
          height: rpx(55);
          line-height: rpx(50);
          transform: translateY(-50%);
          background-image: linear-gradient(-135deg, #f2140c, #f2270c 70%, #f24d0c);
          text-align: center;
          border-radius: rpx(8);
          color: #fff;
          font-size: rpx(25);
          &.disabled {
            border: rpx(1) solid #615f5f;
            background-image: none;
            color: #5a5a5a;
          }
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
}
</style>
