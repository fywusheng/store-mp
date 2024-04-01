<style lang="scss">
  @import '~@/styles/base';

  .filter-modal-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    // padding-left: rpx(110);
    z-index: 1000;
  }

  .filter-modal {
    position: absolute;
    bottom: 0;
    width: rpx(750);
    height: 80vh;
    background-color: #fff;
    // height: 100vh;
    padding-bottom: rpx(192);
    border-radius: 24rpx 24rpx 0rpx 0rpx;
    .title {
      font-size: 40rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 56rpx;
      padding: 60rpx 30rpx 0;
    }
    .filter-fb {
      position: fixed;
      right: 0;
      bottom: 0;
      width: rpx(750);
      height: 192rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .li {
        width: 240rpx;
        height: 94rpx;
        border-radius: 47rpx;
        border: 2rpx solid #dcdee0;
        font-size: 40rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 56rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        &:last-child {
          background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
          color: #ffffff;
          margin-left: 32rpx;
        }
      }
    }
  }

  .condition-list-wrap {
    // background-color: $white;
    padding-top: rpx(10);
    padding-left: rpx(30);
    padding-right: rpx(30);

    &:last-child {
      padding-top: rpx(40);
      padding-bottom: rpx(140);
    }

    .condition-title {
      position: relative;
      height: rpx(90);
      line-height: rpx(90);
      font-size: rpx(40);
      color: #999999;
      font-weight: 500;

      .more-wrap {
        display: flex;
        align-items: center;
        @include middle-center-y();
        right: 0;
        font-size: rpx(36);
        color: #999999;
        font-weight: normal;

        .iconfont {
          margin-left: rpx(10);
          font-size: rpx(20);
        }
      }
    }

    .condition-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .condition {
        margin-right: rpx(10);
        margin-bottom: rpx(10);
        padding-left: rpx(10);
        padding-right: rpx(10);
        width: rpx(165);
        height: rpx(66);
        line-height: rpx(60);
        font-size: rpx(36);
        color: $extra-light-black;
        background-color: #f6f6f6;
        text-align: center;
        @include ellipsis();
        border-radius: rpx(8);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        border: 1px solid transparent;
        .txt {
          width: 165rpx;
          height: 100%;
          @include ellipsis();
        }

        &:nth-child(4n) {
          margin-right: 0;
        }

        &.active {
          color: #ff5500;
          border: 1px solid #ff5500;
          background-color: #fff;
          box-sizing: border-box;
        }
      }
    }
  }
</style>

<template>
  <div class="filter-modal-wrap" v-if="showPopup">
    <scroll-view scroll-y class="filter-modal">
      <!-- <view class="title">所在区域：{{ city }}</view> -->
      <div class="condition-list-wrap">
        <div class="condition-title">
          商品类型
          <!-- <div class="more-wrap" @click="showMoreCate = !showMoreCate">
            全部
            <i v-if="showMoreCate" class="iconfont icon-xiangshangjiantou"></i>
            <i v-else class="iconfont icon-xiangxia1"></i>
          </div> -->
        </div>
        <ul class="condition-list">
          <li
            class="condition"
            v-show="showMoreCate || index < 3"
            :class="{ active: subAttr.check }"
            v-for="(subAttr, index) in categoryList"
            :key="index"
            @click="changeCate(subAttr)"
          >
            <view class="txt">{{ subAttr.name }}</view>
            <!-- {{ subAttr.name }} -->
          </li>
        </ul>
      </div>
      <div class="condition-list-wrap">
        <div class="condition-title">
          商品品牌
          <!-- <div class="more-wrap" @click="showMoreBrand = !showMoreBrand">
            全部
            <i v-if="showMoreBrand" class="iconfont icon-xiangshangjiantou"></i>
            <i v-else class="iconfont icon-xiangxia1"></i>
          </div> -->
        </div>
        <ul class="condition-list">
          <li
            class="condition"
            v-show="showMoreBrand || index < 3"
            :class="{ active: subAttr.check }"
            v-for="(subAttr, index) in brandList"
            :key="index"
            @click="changeBrand(subAttr)"
          >
            <view class="txt">{{ subAttr.brandName }}</view>
          </li>
        </ul>
      </div>
      <div class="condition-list-wrap">
        <div class="condition-title">
          适用人群
          <!-- <div class="more-wrap" @click="showMoreCate = !showMoreCate">
            全部
            <i v-if="showMoreCate" class="iconfont icon-xiangshangjiantou"></i>
            <i v-else class="iconfont icon-xiangxia1"></i>
          </div> -->
        </div>
        <ul class="condition-list">
          <li
            class="condition"
            :class="{ active: subAttr.check }"
            v-for="(subAttr, index) in targetAudienceList"
            :key="index"
            @click="changeTargetAudience(subAttr)"
          >
            <view class="txt">{{ subAttr.name }}</view>
            <!-- {{ subAttr.name }} -->
          </li>
        </ul>
      </div>
      <div class="condition-list-wrap">
        <div class="condition-title">
          商品价区间
          <!-- <div class="more-wrap" @click="showMorePrice = !showMorePrice">
            全部
            <i v-if="showMoreCate" class="iconfont icon-xiangshangjiantou"></i>
            <i v-else class="iconfont icon-xiangxia1"></i>
          </div> -->
        </div>
        <ul class="condition-list">
          <li
            class="condition"
            v-show="showMorePrice || index < 3"
            :class="{ active: subAttr.check }"
            v-for="(subAttr, index) in priceList"
            :key="index"
            @click="changePrice(subAttr)"
          >
            <view class="txt">{{ subAttr.name }}</view>
          </li>
        </ul>
      </div>

      <div
        class="condition-list-wrap"
        v-for="(attr, index) in attrList"
        v-if="attr.dataList.length"
        :key="index"
      >
        <div class="condition-title">
          {{ attr.name }}
          <div class="more-wrap" @click="showMoreBrand = !showMoreBrand">
            全部
            <i v-if="attr.showMore" class="iconfont icon-xiangshangjiantou"></i>
            <i v-else class="iconfont icon-xiangxia1"></i>
          </div>
        </div>
        <ul class="condition-list">
          <li
            class="condition"
            v-show="attr.showMore || subIndex < 3"
            :class="{ active: subAttr.check }"
            @click="changeCheck(attr.dataList, subAttr, subIndex)"
            v-for="(subAttr, subIndex) in attr.dataList"
            :key="subIndex"
          >
            <view class="txt">{{ subAttr.name }}</view>
            <!-- {{ subAttr.name }} -->
          </li>
        </ul>
      </div>
      <ul class="filter-fb">
        <li class="li" @click="reset">重置</li>
        <li class="li" @click="search">确定</li>
      </ul>
    </scroll-view>
  </div>
</template>

<script>
  export default {
    name: 'SEARCH-FILTER',
    props: {
      attrList: {
        type: Array,
        default: [],
      },
      brandList: {
        type: Array,
        default: [],
      },
      categoryList: {
        type: Array,
        default: [],
      },
      priceList: {
        type: Array,
        default: [],
      },
    },
    data() {
      return {
        city: '',
        showPopup: false,
        params: {
          brandId: '',
        },
        // 适用人群
        targetAudienceList: [
          { name: '高血压', value: '高血压', check: false },
          { name: '高血脂', value: '高血脂', check: false },
          { name: '高血糖', value: '高血糖', check: false },
          { name: '高尿酸', value: '高尿酸', check: false },
          { name: '脂肪肝', value: '脂肪肝', check: false },
          { name: '肾囊肿', value: '肾囊肿', check: false },
        ],
        dataList: [],
        showMoreBrand: false,
        showMoreCate: false,
        showMorePrice: false,
      };
    },
    components: {},
    filters: {},
    methods: {
      changePrice(price) {
        this.$emit('changePrice', price);
      },
      reset() {
        this.targetAudienceList.forEach((data) => {
          data.check = false;
        });
        this.$emit('reset');
        this.showPopup = false;
      },
      search() {
        this.$emit('search');
        this.showPopup = false;
      },

      changeTargetAudience(target) {
        target.check = !target.check;
        // 适用人群
        const index = this.targetAudienceList.findIndex((item) => {
          return item.name == target.name;
        });
        this.$set(this.targetAudienceList, index, target);
        this.$emit(
          'changeTargetAudience',
          this.targetAudienceList.filter((item) => item.check),
        );
      },
      changeCate(cate) {
        //类别
        this.$emit('changeCate', cate);
      },
      changeBrand(brand) {
        //品牌
        this.$emit('changeBrand', brand);
      },
      changeCheck(conditionList, condition) {
        condition.check = !condition.check;
      },
      show(flag) {
        this.showPopup = flag;
      },
    },
    async mounted() {
      const location = uni.getStorageSync('city');
      this.city = location.name;
    },
  };
</script>
