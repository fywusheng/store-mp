<style lang="scss">
._notice {
  height: 760rpx;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: auto;
  padding: 0rpx 64rpx 0rpx 64rpx;
  font-size: 36rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  text-align: center;
  .title {
    height: 54rpx;
    font-size: 44rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 54rpx;
    padding-top: 34rpx;
    padding-bottom: 62rpx;
  }
  .infor {
    width: 600rpx;
    height: 556rpx;
    padding: 0 64rpx 0 64rpx;
    overflow: auto;
  }
  .close {
    height: 100rpx;
    line-height: 100rpx;
    border-top: 1rpx solid #e5e5e5;
    font-size: 44rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}
.modal-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2000;
}

.coupon-modal {
  @include middle-center-x();
  bottom: 0;
  width: rpx(750);
  height: rpx(806);
  background-color: #fff;
  .modal-header {
    position: relative;
    height: rpx(105);
    line-height: rpx(105);
    text-align: center;
    font-size: rpx(34);
    background-color: #fff;
    z-index: 100;
    color: $color-black;
    .btn-close {
      @include middle-center-y();
      right: rpx(30);
      width: rpx(30);
      height: rpx(30);
    }
  }

  .coupon-list {
    padding: rpx(30) rpx(40);
    height: rpx(705);
    background-color: #fff;
    overflow: auto;
    .coupon {
      position: relative;
      padding: 14rpx 24rpx 14rpx 216rpx;
      margin-bottom: rpx(30);
      width: rpx(670);
      min-height: rpx(226);
      box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
      // background: url(https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/coupon-valid.png)
      //   left top no-repeat;
      // background-size: cover;

      &.disabled {
        background-image: url(https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/coupon-invalid.png);

        .coupon__name {
          color: #999;
        }
      }

      .money {
        background: url("https://ggllstatic.hpgjzlinfo.com/static/common/left_icon.png");
        background-size: 100% 100%;
        height: 100%;
        width: 232rpx;
        padding-top: 57rpx;
        @include middle-center-y();
        left: 0;
        font-size: rpx(50);
        color: #fff;
        // width: rpx(192);
        text-align: center;
        @include ellipsis();

        .unit {
          // margin-right: rpx(-10);
          font-size: rpx(32);
        }
        ._span {
          font-size: 39rpx;
          font-weight: 500;
        }
        .desc {
          font-size: rpx(29);
          line-height: rpx(30);
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
      .out {
        margin-left: 37rpx;
        .f_r {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          .show_ruler {
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }
      }

      .coupon__name {
        padding-right: rpx(120);
        padding-bottom: rpx(10);
        font-size: rpx(32);
        line-height: rpx(45);
        @include ellipsis();
        font-weight: bold;
      }

      .coupon__time {
        padding-top: rpx(31);
        font-size: rpx(32);
        line-height: rpx(30);
        color: #999;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }

      .btn-status {
        width: 164rpx;
        height: 60rpx;
        background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
        border-radius: 30rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 60rpx;
        text-align: center;
        margin-top: 18rpx;
      }
      .actice_btn {
        opacity: 0.3;
      }
      .actice_name {
        color: #999999;
      }
    }
  }

  .empty-wrap {
    text-align: center;
    padding-top: rpx(300);
    height: rpx(705);
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

  .btn-confirm {
    @include btn-block();
  }
}
</style>

<template>
  <div v-if="showPopup" class="modal-wrap">
    <div class="coupon-modal">
      <div class="modal-header">
        可领取优惠券
        <img
          class="btn-close"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/close.png"
          @click="show(false)"
        />
      </div>
      <view class="coupon-list" v-if="couponList && couponList.length">
        <li class="coupon" :key="index" v-for="(coupon, index) in couponList">
          <div class="money">
            <!-- <span class="unit"></span> -->
            <span v-if="coupon.type == 0">¥{{ coupon.denominationStr }}元</span>
            <span v-else-if="coupon.type == 1"
              >打{{ coupon.denominationStr }}折</span
            >
            <div class="desc">
              {{
                coupon.checkThreshold == 0
                  ? "无门槛"
                  : `满${coupon.thresholdValue}元可用`
              }}
            </div>
          </div>
          <div class="out">
            <div
              class="coupon__name"
              :class="coupon.receivedState === 1 ? 'actice_name' : ''"
            >
              {{ coupon.name }}
            </div>
            <div class="coupon__time">
              {{ replaceDate(coupon.beginTime) }}-{{
                replaceDate(coupon.endTime)
              }}
            </div>
            <div class="f_r">
              <div class="show_ruler" @click="showRuler(coupon)">使用规则></div>
              <div
                class="btn-status"
                :class="coupon.receivedState === 1 ? 'actice_btn' : ''"
                @tap="toCoupon(coupon)"
              >
                {{ coupon.receivedState === 1 ? "已领取" : "立即领取" }}
              </div>
            </div>
          </div>
        </li>
      </view>
      <div class="empty-wrap" v-if="!couponList.length">
        <img
          class="img"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/coupon-empty.png"
        />
        <div class="title">很遗憾</div>
        <div class="desc">您暂时无可领取的优惠券</div>
      </div>
      <!-- <div class="btn-confirm" @click="show(false)">完成</div> -->
    </div>
    <uni-popup
      v-show="showRulerV"
      ref="notice"
      type="center"
      :mask-click="true"
    >
      <view class="_notice">
        <view class="title">使用规则</view>
        <view class="infor">{{ rulerContent }}</view>
        <view class="close" @click="closed">知道了</view>
      </view>
    </uni-popup>
  </div>
</template>

<script>
export default {
  name: "COUPON_LIST",
  props: {
    couponList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showPopup: false,
      rulerContent: "",
      showRulerV: false,
    };
  },
  methods: {
    replaceDate(val) {
      return val.replace(/-/g, ".");
    },
    showRuler(val) {
      this.rulerContent = val.description || "暂无";
      this.$refs.notice.open();
      this.showRulerV = true;
    },
    closed() {
      this.$refs.notice.close();
      this.showRulerV = false;
    },
    async toCoupon(coupon) {
      if (coupon.receivedState === 1) {
        return;
      }
      if (coupon.isReceived === 1) {
        return false;
      }
      uni.showLoading();
      const result = await Axios.post("/coupon/receive", {
        couponId: coupon.id,
      });
      uni.hideLoading();
      if (result.code == "200") {
        this.$uni.showToast(result.msg);
        this.$emit("loadCoupon");
      } else {
        this.$uni.showToast(result.msg);
      }
    },
    show(flag) {
      this.showPopup = flag;
    },
  },
  async mounted() {},
};
</script>
