<style lang="scss">
@import '~@/styles/base';

.modal-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10000;
  .btn-submit {
    position: fixed;
    bottom: 24rpx;
    left: 78rpx;
    line-height: 54px;
    height: 108rpx;
    background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
    border-radius: 54rpx;
    width: 79%;
    margin: 0 auto;
    font-size: 44rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fff;
    text-align: center;
  }
}

.select-sku {
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  height: 900rpx;
  overflow: scroll;
  @include middle-center-x();
  bottom: 0;
  width: 100%;
  background: #fff;
  scroll-view {
    // height: fit-content;
  }
  &.isIphoneHair {
    padding-bottom: rpx(64);
  }
  .btn-close {
    position: absolute;
    right: rpx(30);
    top: rpx(41);
    width: rpx(30);
    height: rpx(30);
    z-index: 100;
  }
  .sku-header {
    position: relative;
    height: rpx(190);

    .sku-img {
      position: absolute;
      left: rpx(30);
      top: rpx(40);
      width: rpx(120);
      height: rpx(120);
      @include background-image();
      background-size: cover;
      border-radius: 8rpx;
    }

    .sell-price {
      padding-top: rpx(45);
      padding-left: rpx(171);
      color: $black;
      font-size: rpx(30);
      ._span {
        font-size: 48rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
    }

    .product-no {
      padding-top: rpx(3);
      font-size: rpx(28);
      padding-left: rpx(172);
      color: #4a4a4a;
    }
  }

  .sku-hd {
    // padding: rpx(0) rpx(30) rpx(50);
    // border-top: 1rpx solid #e5e5e5;

    width: 90%;
    margin: 0 auto;
    margin-bottom: 140rpx;
    .info {
      padding-bottom: rpx(30);

      .title {
        padding-top: rpx(30);
        padding-bottom: rpx(20);
        font-size: rpx(36);
        color: $black;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }

      .label-list {
        display: flex;
        flex-wrap: wrap;

        .label {
          margin-bottom: 10rpx;
          position: relative;
          // margin-top: rpx(30);
          margin-right: rpx(25);
          // padding-left: rpx(5);
          // padding-right: rpx(5);
          // width: rpx(110);
          height: rpx(80);
          line-height: rpx(80);
          text-align: center;
          font-size: rpx(28);
          @include ellipsis();
          color: $light-black;
          // border: rpx(2) solid #cdcdcd;

          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;

          border-radius: 8rpx;
          width: fit-content;
          color: #333;
          padding: 0 16rpx;
          background: #f5f5f5;
          &.active {
            background: #ff5500;
            color: #fff;
            // border-color: $black;

            // &:after {
            //   content: '';
            //   position: absolute;
            //   right: -6px;
            //   bottom: -6px;
            //   width: 12px;
            //   height: 12px;
            //   background: #111;
            //   transform: rotate(-45deg);
            // }
          }

          &.disabled {
            border: 1px dotted #cdcdcd;
            color: #aaaaaa;
            cursor: not-allowed;
          }
        }
      }
    }

    .number-wrap {
      display: flex;
      justify-content: space-between;
      width: 100%;
      position: relative;
      padding-top: rpx(40);
      padding-bottom: rpx(40);
      font-size: rpx(30);
      color: $black;
      border-top: 1rpx solid #e5e5e5;
      ._flex {
        display: flex;
        justify-content: space-between;
        ._num {
          line-height: 70rpx;
        }
      }
      .c-number-wrap {
        @include middle-center-y();
        top: 30px;
        right: rpx(30);
        width: 208rpx;
      }
    }
  }
}
</style>

<template>
  <div v-if="showPopup" class="modal-wrap">
    <div class="select-sku" :class="{isIphoneHair}">
      <img @click="show(false)" class="btn-close"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/item-detail/close.png">

      <div class="sku-header">
        <div class="sku-img" :style="{backgroundImage: 'url('+imgUrl+')'}"></div>
        <div class="sell-price">
          <template v-if="selectSize.subClassAttrId">
            <span>¥{{selectSize.sellingPrice}}</span>
          </template>
        </div>
        <div class="product-no">{{selectSize.subClassAttrName}}</div>
      </div>
      <div class="line"></div>

      <scroll-view scroll-y>
        <div class="sku-hd">
          <div class="info" v-if="colorList.length">
            <div class="title">{{product.firstClassName}}</div>
            <div class="label-list">
              <div class="label"
                :class="selectColor.firstClassAttrId == color.firstClassAttrId ? 'active':''"
                v-for="(color,index) in colorList" :key="index" @click="changeColor(color)">
                {{color.firstClassAttrName}}
              </div>
            </div>
          </div>
          <div class="info" v-if="sizeList.length">
            <div class="title">{{product.subClassName}}</div>
            <div class="label-list">
              <!-- <div class="label round" :class="selectSize.subClassAttrId == size.subClassAttrId ? 'active':''"
                   v-for="(size,index) in sizeList" :key="index" @click="changeSize(size)">
                {{size.subClassAttrName}}
              </div> -->
              <block v-for="(size,index) in sizeList" :key="index">
                <li v-if="size.availableStock == 0" class="condition disabled label">
                  {{size.subClassAttrName}}
                </li>
                <div v-else class="label round"
                  :class="selectSize.subClassAttrId == size.subClassAttrId ? 'active':''"
                  @click="changeSize(size)">
                  {{size.subClassAttrName}}
                </div>
              </block>
            </div>
          </div>
          <div class="number-wrap">
            <view>数量</view>
            <view>
              <number v-if="product.hzhH5" :min="1" :max="1" @change="changeNum"></number>
              <number v-else :min="1" :max="selectSize.availableStock" @change="changeNum"></number>
            </view>
          </div>
        </div>
      </scroll-view>

    </div>
    <div class="btn-submit" @click="submit">确定</div>
  </div>
</template>

<script>
import Number from './number'

export default {
  name: 'SELECT_SKU',
  props: {
    product: {
      type: Object,
      default: () => { }
    },
    productImgList: {
      type: Array,
      default: () => []
    },
    colorList: {
      type: Array,
      default: () => []
    },
    sizeList: {
      type: Array,
      default: () => []
    },
    selectColor: {
      type: Object,
      default: () => { }
    },
    selectSize: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      isIphoneHair: App.isIphoneHair,
      operateType: 1,
      showPopup: false,
      number: 1,
      imgUrl: ''
    }
  },

  watch: {
    selectColor() {
      if (this.selectColor.imgUrlList && this.selectColor.imgUrlList.length) {
        this.imgUrl = this.selectColor.imgUrlList[0]
      } else {
        this.imgUrl = this.product.mainImgUrl
      }
    }
  },
  components: {
    Number
  },
  methods: {
    changeNum(number) {
      console.log('==dianji--', this.selectSize.availableStock)
      console.log('sku id: ', this.product)
      this.number = number
    },
    async submit() {
      const params = {
        productIds: [this.product.id],
        sceneType: this.sceneType,
        clickType: this.operateType === 1 ? 0 : 1
      }

      const result = await Axios.post('/cart/checkAdd', JSON.stringify(params))
      if (result.code != 200) {
        this.$uni.showToast(result.msg || result.data)
        return
      }

      switch (this.operateType) {
        case 1:
          this.addCart()
          break
        case 2:
          this.checkout()
          break
      }
    },
    async addCart() {
      if (!this.selectSize.availableStock) {
        this.$uni.showToast('库存不足')
        return false
      }
      uni.showLoading('正在添加...')
      const result = await Axios.post('/cart/add', {
        num: this.number,
        skuId: this.selectSize.id,
        sceneType: this.sceneType
      })
      uni.hideLoading()
      if (result.code == 200) {
        // App.updateCartNum()
        this.$uni.showToast('添加成功')
        this.show(false)
        this.$parent.updateCart()
        this.show(false)
      } else {
        this.$uni.showToast(result.msg || '添加失败')
      }
    },
    checkout() {
      if (!this.selectSize.availableStock || this.selectSize.availableStock < this.number) {
        this.$uni.showToast('库存不足')
        return false
      }
      // this.show(false)
      uni.navigateTo({
        url: `/sub-pages/index/checkout/main?type=2&num=${this.number}&skuId=${this.selectSize.id}&sceneType=${this.sceneType}`
      })
    },
    changeColor(color) {
      this.$parent.changeSku('selectColor', color)
    },
    changeSize(size) {
      this.$parent.changeSku('selectSize', size)
    },
    show(flag, type, sceneType) {
      this.showPopup = flag
      this.sceneType = sceneType
      if (flag) {
        this.operateType = type
        if (this.selectColor.imgUrlList && this.selectColor.imgUrlList.length) {
          this.imgUrl = this.selectColor.imgUrlList[0]
        } else {
          this.imgUrl = this.product.mainImgUrl
        }
      }
    }
  },
  async mounted() {
  }
}
</script>
