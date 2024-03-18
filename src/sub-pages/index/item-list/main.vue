<style lang="scss" scoped>
@import '~@/styles/base';

.search-header {
  @include middle-center-x(fixed);
  top: 0;
  width: rpx(750);
  height: rpx(88);
  padding-left: rpx(32);
  padding-right: rpx(32);
  display: flex;
  align-items: center;
  background-color: #fff;
  z-index: 100;
  .icon {
    @include middle-center-y();
    left: rpx(52);
    width: rpx(40);
    height: rpx(40);
    z-index: 100;
  }
  input {
    display: block;
    position: relative;
    width: 100%;
    padding-left: rpx(70);
    padding-right: rpx(30);
    height: rpx(88);
    background-color: $extra-gray;
    font-size: rpx(36);
    color: $black;
    border-radius: rpx(16);
  }

  .btn-back {
    @include middle-center-y();
    left: rpx(35);
    font-size: rpx(36);
  }

  .btn-clear {
    @include middle-center-y();
    right: rpx(52);
    width: rpx(36);
    height: rpx(36);
    z-index: 100;
  }
}

.sort-list {
  @include middle-center-x(fixed);
  top: rpx(88);
  width: rpx(750);
  display: flex;
  align-items: center;
  z-index: 100;
  background-color: #fff;

  .sort {
    display: flex;
    align-items: center;
    justify-content: center;
    height: rpx(90);
    flex: 1;
    font-size: rpx(36);

    &.active {
      font-weight: 500;
    }

    .img-wrap {
      margin-left: rpx(8);

      .image {
        margin-bottom: rpx(4);
        display: block;
        width: rpx(14);
        height: rpx(8);

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .filter {
      margin-left: rpx(8);
      width: rpx(28);
      height: rpx(28);
    }
  }
}

.scroll-container {
  overflow: hidden;
}

.filter-list {
  display: flex;
  align-items: center;
  @include middle-center-x(fixed);
  top: rpx(102);
  width: rpx(750);
  background-color: #fff;
  z-index: 100;

  .filter {
    flex: 1;
    text-align: center;

    .content {
      display: inline-block;
      padding: rpx(20);
      font-size: rpx(30);
      border-bottom: 1px solid transparent;

      .iconfont {
        margin-left: rpx(5);
        font-size: rpx(25);
        font-weight: bold;
      }
    }

    &.active {
      .content {
        font-weight: bold;
        border-bottom: 1px solid $black;
      }
    }
  }
}

.item-list-wrap {
  padding-top: rpx(200);
  box-sizing: border-box;
  height: 100vh;
}

.item-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .item {
    position: relative;
    padding-left: rpx(30);
    padding-right: rpx(30);
    padding-bottom: rpx(30);
    margin-bottom: rpx(30);
    border-radius: rpx(8);
    background-color: #fff;
    width: rpx(375);
    box-sizing: border-box;

    .item-logo {
      position: relative;
      width: rpx(315);
      height: rpx(315);
      margin-bottom: rpx(30);
      background: center no-repeat;
      background-size: contain;

      .sale-out-wrap {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.3);

        .sale-out {
          @include middle-center();
          width: rpx(151);
          height: rpx(151);
        }
      }
    }

    .brand-name {
      font-size: rpx(36);
      color: $black;
      @include ellipsis();
      line-height: rpx(42);
    }

    .item-name {
      padding-top: rpx(10);
      font-size: rpx(36);
      line-height: rpx(42);
      color: $light-black;
      @include ellipsis();
    }

    .item-price {
      padding-top: rpx(10);
      line-height: rpx(42);
      font-size: rpx(36);
      color: $black;
    }
  }
}

.empty {
  padding-top: rpx(360);
  font-size: rpx(26);
  color: #25292d;
  text-align: center;
  width: 100%;
  white-space: nowrap;

  img {
    display: block;
    margin-bottom: rpx(30);
    margin-left: auto;
    margin-right: auto;
    width: rpx(202);
    height: rpx(280);
  }

  .btn-home {
    @include btn-block();
    margin-top: rpx(100);
    margin-left: auto;
    margin-right: auto;
    width: rpx(320);
    height: rpx(80);
    line-height: rpx(80);
    border-radius: rpx(40);
  }
}
</style>

<template>
  <div id="app">
    <div class="search-header">
      <img class="icon"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-search.png">
      <input confirm-type="search" @confirm="search" :placeholder="key || '输入关键字搜索商品...'"
        v-model="key">
      <img class="btn-clear"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/clear.png" @click="clear">
    </div>
    <ul class="sort-list">
      <li class="sort" :class="{active: !sortType}">综合</li>
      <li class="sort" @click="changeSortType(sortType === 11 ? 12 : 11)">
        时间
        <div class="img-wrap" v-if="sortType !== 11 && sortType !== 12">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_n@2x.png">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png">
        </div>
        <div class="img-wrap" v-if="sortType === 11">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_h@2x.png">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png">
        </div>
        <div class="img-wrap" v-if="sortType === 12">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_n@2x.png">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_h@2x.png">
        </div>
      </li>
      <!-- <li class="sort" @click="changeSortType(sortType === 31 ? 32 : 31)">
        销量
        <div class="img-wrap" v-if="sortType !== 31 && sortType !== 32">
          <img src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_n@2x.png">
          <img src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png">
        </div>
        <div class="img-wrap" v-if="sortType === 31">
          <img src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_h@2x.png">
          <img src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png">
        </div>
        <div class="img-wrap" v-if="sortType === 32">
          <img src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_n@2x.png">
          <img src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_h@2x.png">
        </div>
      </li> -->
      <li class="sort" @click="changeSortType(sortType === 21 ? 22 : 21)">
        价格
        <div class="img-wrap" v-if="sortType !== 21 && sortType !== 22">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_n@2x.png">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png">
        </div>
        <div class="img-wrap" v-if="sortType === 21">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_h@2x.png">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png">
        </div>
        <div class="img-wrap" v-if="sortType === 22">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_n@2x.png">
          <img class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_h@2x.png">
        </div>
      </li>
      <li class="sort" @click="showFilter">
        筛选
        <img class="filter"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/filter.png">
      </li>
    </ul>
    <scroll-view v-if="itemList.length || loading" scroll-y class="item-list-wrap"
      @scrolltolower="loadData" :lower-threshold="400">
      <ul class="item-list">
        <li class="item" @click="goItem(item)" v-for="(item,subIndex) in itemList" :key="subIndex">
          <div class="item-logo" :style="{backgroundImage: 'url('+item.proPictDir+')'}"></div>
          <div class="brand-name">{{item.brandName}}</div>
          <div class="item-name">{{item.name}}</div>
          <div class="item-price">
            &yen;{{item.costPriceStr}}
          </div>
          <div class="sale-out-wrap" v-if="item.saleState !== 5 || item.availableStock === 0">
            <img class="sale-out"
              src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/sale-out.png">
          </div>
        </li>
      </ul>
    </scroll-view>
    <div v-if="empty" class="empty">
      <img src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/empty.png">
      没有搜到您想要的商品
      <div class="btn-home" @click="toHome">再去逛逛</div>
    </div>
    <top ref="toTop" :bottom="80" :showContact="false"></top>
    <search-filter ref="filter" @reset="reset" @changePrice="changePrice" @search="search"
      @changeBrand="changeBrand" @changeCate="changeCate" :priceList="priceList"
      :attrList="attrList" :brandList="brandList" :categoryList="categoryList"></search-filter>
  </div>
</template>

<script>
import Top from '@/sub-pages/index/components/top.vue'
import SearchFilter from './components/filter'
import wx from 'utils/wx'
export default {
  name: 'SEARCH',
  data() {
    return {
      sceneType: '适老用品',
      loading: true,
      filterType: 0,
      pageNo: 1,
      pageSize: 20,
      disabled: false,
      empty: false,
      itemList: [],
      brandList: [],
      brandId: '',
      dispId: '',
      sortType: '',
      key: '',
      name: '',
      attrList: [],
      categoryList: [],
      priceList: []
    }
  },
  computed: {
    title() {
      if (this.key) {
        return this.key
      }
      if (this.name) {
        return this.name
      }
      return '搜索'
    }
  },
  components: {
    Top,
    SearchFilter
  },
  methods: {
    toHome() {
      uni.navigateTo({
        url: '/sub-pages/index/index/main'
      })
    },
    goItem(item) {
      // XIU.bridge.goItem(item.id)
      uni.navigateTo({
        url: `/sub-pages/index/item/main?id=${item.id}&sceneType=${this.sceneType}`
      })
    },
    back() {
      history.go(-1)
    },
    reset() {
      this.priceList.forEach(data => {
        data.check = false
      })
      this.categoryList.forEach(data => {
        data.check = false
      })
      this.brandList.forEach(data => {
        data.check = false
      })
      this.attrList.forEach(data => {
        data.dataList.forEach(child => {
          child.check = false
        })
      })
      this.search()
    },
    changeSortType(type) {
      this.sortType = type
      this.search()
    },
    clear() {
      this.key = ''
      this.search()
    },
    search() {
      this.pageNo = 1
      this.itemList = []
      this.disabled = false
      this.loadData()
    },
    changePrice(priceRange) {
      priceRange.check = !priceRange.check
      this.$set(this.priceList, priceRange.id, priceRange)
    },
    changeBrand(brand) {
      brand.check = !brand.check
      const index = this.brandList.findIndex((item) => {
        return item.brandId == brand.brandId
      })
      this.$set(this.brandList, index, brand)
    },
    changeCate(cate) {
      cate.check = !cate.check
      const index = this.categoryList.findIndex((item) => {
        return item.id == cate.id
      })
      this.$set(this.categoryList, index, cate)
    },
    showFilter() {
      this.$refs.filter.show(true)
    },
    async loadData() {
      if (this.disabled) {
        return false
      }
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNo++,
        isCreditPoints: 0
      }
      if (this.sortType) {
        params.sortType = this.sortType
      }
      if (this.brandId) {
        params.brandIds = this.brandId.join(',')
      }
      if (this.planId) {
        params.planId = this.planId
      }
      if (this.dispId) {
        params.categoryCodes = this.dispId
      }
      if (this.key) {
        params.name = this.key
      }
      const attrList = []
      this.attrList.forEach(attr => {
        attr.dataList.forEach(condition => {
          if (condition.check) {
            attrList.push(condition.value)
          }
        })
      })
      if (attrList.length) {
        params.attrValIds = attrList.join(',')
      }
      const dispIds = []
      this.categoryList.forEach(cate => {
        if (cate.check) {
          dispIds.push(cate.id)
        }
      })
      if (dispIds.length) {
        params.categoryCodes = dispIds.join(',')
      }
      const brandIds = []
      this.brandList.forEach(brand => {
        if (brand.check) {
          brandIds.push(brand.brandId)
        }
      })
      if (brandIds.length) {
        params.brandIds = brandIds.join(',')
      }
      const priceIds = []
      this.priceList.forEach(price => {
        if (price.check) {
          priceIds.push(price.name)
        }
      })
      if (priceIds.length) {
        params.priceRange = priceIds.join(',')
      }
      this.disabled = true
      wx.showLoading()
      // console.log("params: " + JSON.stringify(params))
      let searchResult = await Axios.post('/product/getProductSearchList', { ...Object.assign(params, this.searchParams) })
      // console.log("result: " + JSON.stringify(searchResult))
      searchResult = searchResult.data
      wx.hideLoading()
      this.loading = false
      if (searchResult.esProducts) {
        this.disabled = searchResult.pageNum >= searchResult.totalPage
        const list = []
        searchResult.esProducts.forEach(data => {
          const tempData = _.pick(data, ['id', 'skuList', 'mainImgUrl', 'brandName', 'name', 'price', 'stockBlance', 'saleState'])
          let availableStock = 0; let minMarkOffPrice = 0; let maxMarkOffPrice = 0; let minCostPrice = 0; let maxCostPrice = 0
          tempData.skuList && tempData.skuList.forEach(sku => {
            availableStock += sku.availableStock
            if (minMarkOffPrice === 0 || minMarkOffPrice > sku.markOffPrice) {
              minMarkOffPrice = sku.markOffPrice
            }
            if (maxMarkOffPrice === 0 || maxMarkOffPrice < sku.markOffPrice) {
              maxMarkOffPrice = sku.markOffPrice
            }
            if (minCostPrice === 0 || minCostPrice > sku.sellingPrice) {
              minCostPrice = sku.sellingPrice
            }
            if (maxCostPrice === 0 || maxCostPrice < sku.sellingPrice) {
              maxCostPrice = sku.sellingPrice
            }
          })
          if (minMarkOffPrice !== maxMarkOffPrice) {
            tempData.markOffPriceStr = `${minMarkOffPrice}-${maxMarkOffPrice}`
          } else {
            tempData.markOffPriceStr = minMarkOffPrice
          }
          if (minCostPrice !== maxCostPrice) {
            tempData.costPriceStr = `${minCostPrice}-${maxCostPrice}`
          } else {
            tempData.costPriceStr = minCostPrice
          }
          tempData.availableStock = availableStock
          tempData.proPictDir = XIU.getImgFormat(tempData.mainImgUrl, '/resize,w_750')
          list.push(tempData)
        })
        this.itemList = this.itemList.concat(list)
        this.brandList = []
        Object.keys(searchResult.brands).forEach(key => {
          searchResult.brands[key].forEach(brand => {
            this.brandList.push({
              brandId: brand.brandId,
              brandName: brand.brandName,
              check: false
            })
          })
        })
        this.categoryList = []
        searchResult.categorys.forEach(category => {
          this.categoryList.push({
            id: category.code,
            name: category.name,
            check: false
          })
        })
        this.priceList = []
        searchResult.prices.forEach((data, index) => {
          this.priceList.push({
            id: index,
            name: data,
            check: false
          })
        })
        if (this.attrList.length) {
          return false
        }
        const attrs = []
        Object.keys(searchResult.attrs).forEach(key => {
          const dataList = []
          const attr = key.split('@@@')
          searchResult.attrs[key].forEach(data => {
            if (!data) {
              return false
            }
            const subAttr = data.split('@@@')
            dataList.push({
              id: subAttr[0],
              name: subAttr[1],
              value: data,
              check: false
            })
          })
          attrs.push({
            id: attr[0],
            name: attr[1],
            showMore: false,
            dataList: dataList
          })
        })
        this.attrList = attrs
        this.empty = !this.itemList
        // if(!this.itemList){
        //   this.empty = true
        // }else{
        //   this.empty = false
        // }
        // console.log("页面商品：" + JSON.stringify(this.itemList))
      } else {
        // wx.showToast(searchResult.result.message);
        this.empty = true
      }
    }
  },
  onPageScroll(e) {
    this.$refs.toTop.show(e.scrollTop > App.systemInfo.screenHeight)
  },
  async mounted() {
    this.brandId = this.$root.$mp.query.brandId
    this.planId = this.$root.$mp.query.planId
    this.dispId = this.$root.$mp.query.dispId
    this.key = this.$root.$mp.query.key
    this.$refs.filter.show(false)
    this.pageNo = 1
    this.disabled = false
    this.itemList = []
    await this.loadData()
  }
}
</script>
