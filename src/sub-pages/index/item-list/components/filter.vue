<style lang="scss">
  @import "~@/styles/base";

  .filter-modal-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .3);
    padding-left: rpx(110);
    z-index: 1000;
  }

  .filter-modal {
    position: relative;
    width: rpx(640);
    background-color: #fff;
    height: 100vh;
    padding-bottom: rpx(140);
    .filter-fb {
      position: fixed;
      right: 0;
      bottom: 0;
      width: rpx(640);
      display: flex;
      align-items: center;
      .li {
        flex: 1;
        @include btn-block();
        border-radius: 0;
        &:first-child {
          background-color: #fff;
          color: #fff;
          // border-top: rpx(1) solid $border;
        }
      }
    }
  }

  .condition-list-wrap {
    background-color: $white;
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
      font-size: rpx(28);
      color: $black;
      font-weight: 500;

      .more-wrap {
        display: flex;
        align-items: center;
        @include middle-center-y();
        right: 0;
        font-size: rpx(26);
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
        width: rpx(180);
        height: rpx(60);
        line-height: rpx(60);
        font-size: rpx(26);
        color: $extra-light-black;
        background-color: #F6F6F6;
        text-align: center;
        @include ellipsis();
        border-radius: rpx(30);
        box-sizing: border-box;

        &:nth-child(3n) {
          margin-right: 0;
        }

        &.active {
          color: $main-color;
          border: 1px solid $main-color;
          background-color: #fff;
        }
      }
    }
  }
</style>

<template>
  <div class="filter-modal-wrap" v-if="showPopup">
    <scroll-view scroll-y class="filter-modal">
      <div class="condition-list-wrap">
        <div class="condition-title">
          价格区间
          <div class="more-wrap" @click="showMorePrice = !showMorePrice">
            全部
            <i v-if="showMoreCate" class="iconfont icon-xiangshangjiantou"></i>
            <i v-else class="iconfont icon-xiangxia1"></i>
          </div>
        </div>
        <ul class="condition-list">
          <li class="condition" v-show="showMorePrice || index < 3" :class="{active: subAttr.check}"
              v-for="(subAttr,index) in priceList" :key="index" @click="changePrice(subAttr)">
            {{subAttr.name}}
          </li>
        </ul>
      </div>
      <div class="condition-list-wrap">
        <div class="condition-title">
          全部分类
          <div class="more-wrap" @click="showMoreCate = !showMoreCate">
            全部
            <i v-if="showMoreCate" class="iconfont icon-xiangshangjiantou"></i>
            <i v-else class="iconfont icon-xiangxia1"></i>
          </div>
        </div>
        <ul class="condition-list">
          <li class="condition" v-show="showMoreCate || index < 3" :class="{active: subAttr.check}"
              v-for="(subAttr,index) in categoryList" :key="index" @click="changeCate(subAttr)">
            {{subAttr.name}}
          </li>
        </ul>
      </div>
      <div class="condition-list-wrap">
        <div class="condition-title">
          品牌
          <div class="more-wrap" @click="showMoreBrand = !showMoreBrand">
            全部
            <i v-if="showMoreBrand" class="iconfont icon-xiangshangjiantou"></i>
            <i v-else class="iconfont icon-xiangxia1"></i>
          </div>
        </div>
        <ul class="condition-list">
          <li class="condition" v-show="showMoreBrand || index < 3" :class="{active: subAttr.check}"
              v-for="(subAttr,index) in brandList" :key="index" @click="changeBrand(subAttr)">
           {{subAttr.brandName}}
          </li>
        </ul>
      </div>
      <div class="condition-list-wrap" v-for="(attr,index) in attrList" v-if="attr.dataList.length"
           :key="index">
        <div class="condition-title">
          {{attr.name}}
          <div class="more-wrap" @click="showMoreBrand = !showMoreBrand">
            全部
            <i v-if="attr.showMore" class="iconfont icon-xiangshangjiantou"></i>
            <i v-else class="iconfont icon-xiangxia1"></i>
          </div>
        </div>
        <ul class="condition-list">
          <li class="condition" v-show="attr.showMore || subIndex < 3" :class="{active: subAttr.check}"
              @click="changeCheck(attr.dataList, subAttr,subIndex)"
              v-for="(subAttr,subIndex) in attr.dataList" :key="subIndex">
            {{subAttr.name}}
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
        showPopup: false,
        params: {
          brandId: '',
        },
        dataList: [],
        showMoreBrand: false,
        showMoreCate: false,
        showMorePrice: false,
      }
    },
    components: {},
    filters: {},
    methods: {
      changePrice(price) {
        this.$emit('changePrice', price)
      },
      reset() {
        this.$emit('reset');
        this.showPopup = false;
      },
      search() {
        this.$emit('search');
        this.showPopup = false;
      },
      changeCate(cate) {
        //类别
        this.$emit('changeCate', cate)
      },
      changeBrand(brand) {
        //品牌
        this.$emit('changeBrand', brand)
      },
      changeCheck(conditionList, condition) {
        condition.check = !condition.check;
      },
      show(flag) {
        this.showPopup = flag;
      }
    },
    async mounted() {
    }
  }
</script>
