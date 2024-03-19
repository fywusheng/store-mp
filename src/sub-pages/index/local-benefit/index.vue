
<template>
  <view class="app">
    <view class="swiper-tab">
      <swiper-tab :tab-list="tabList" @onTap="hanldChangeCate"></swiper-tab>
    </view>

    <view class="sort-list">
      <view class="sort" @click="changeSortType('')" :class="{active: !sortType}">综合</view>
      <view class="sort" @click="changeSortType(sortType === 11 ? 12 : 11)">
        时间
        <view class="img-wrap" v-if="sortType !== 11 && sortType !== 12">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png">
        </view>
        <view class="img-wrap" v-if="sortType === 11">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/up_h@2x.png">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png">
        </view>
        <view class="img-wrap" v-if="sortType === 12">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/down_h@2x.png">
        </view>
      </view>
      <view class="sort" @click="changeSortType(sortType === 21 ? 22 : 21)">
        价格
        <view class="img-wrap" v-if="sortType !== 21 && sortType !== 22">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png">
        </view>
        <view class="img-wrap" v-if="sortType === 21">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/up_h@2x.png">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png">
        </view>
        <view class="img-wrap" v-if="sortType === 22">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png">
          <img class="image"
            src="http://192.168.1.187:10088/static/images/item-list/down_h@2x.png">
        </view>
      </view>
      <view class="sort" @click="showFilter">
        <img class="filter"
          src="http://192.168.1.187:10088/static/images/index/icon-filter.png">
      </view>
    </view>
    <scroll-view v-if="itemList.length || loading" scroll-y class="item-list-wrap"
      @scrolltolower="loadData" :lower-threshold="400">
      <view class="item-list">
        <view class="item" @click="goItem(item)" v-for="(item) in itemList" :key="item.id">
          <image class="item-logo" :src="item.proPictDir" mode="" />
          <view class="item-name">{{item.name}}</view>
          <view class="item-point" :style="{opacity:item.pointDedurt?1:0}">积分抵扣¥{{item.pointDedurt}}
          </view>
          <view class="item-price">&yen;{{item.costPriceStr | formatPrice}}</view>
          <view class="sale-out-wrap" v-if="item.saleState !== 5 || item.availableStock === 0">
            <image class="sale-out"
              src="http://192.168.1.187:10088/static/images/item-list/sale-out.png">
          </view>
        </view>
        <view class="item holder" v-for="(i, index) in holder" :key="index"></view>
      </view>
    </scroll-view>
    <bottom-tips class="loadInfor" v-if="itemList.length > 0" ref="bottomTips"
      :bottomTips="bottomTips" />
    <view v-if="empty" class="empty">
      <img class="img" src="http://192.168.1.187:10088/static/images/item-list/empty.png">
      没有搜到您想要的商品
      <view class="btn-home" @click="toHome">再去逛逛</view>
    </view>
    <top ref="toTop" :bottom="80" :showContact="false"></top>
    <search-filter ref="filter" @reset="reset" @changePrice="changePrice" @search="search"
      @changeBrand="changeBrand" @changeCate="changeCate" :priceList="priceList"
      :attrList="attrList" :brandList="brandList" :categoryList="[]"></search-filter>
  </view>
</template>
<script>
import Top from '@/sub-pages/index/components/top.vue'
import SwiperTab from '@/sub-pages/index/components/swiper-tab/index.vue'
import SearchFilter from '@/sub-pages/index/components/search-filter/index.vue'
import BottomTips from './bottom-tips.vue'
import api from '@/apis/index.js'
export default {
  name: 'SEARCH',
  data() {
    return {
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
      priceList: [],
      bottomTips: '',
      areaCode: '',
      tabList: []
    }
  },
  filters: {
    formatPrice(price) {
      if (!Number.isNaN(Number(price))) {
        return Number(price).toFixed(2)
      }
      return price
    }
  },
  components: {
    Top,
    SwiperTab,
    SearchFilter,
    BottomTips
  },
  computed: {
    holder() {
      if (this.itemList.length % 2 === 0) {
        return 0
      }
      return 2 - (this.itemList.length % 2)
    }
  },
  methods: {
    toHome() {
      uni.navigateTo({
        url: '/sub-pages/index/index/main'
      })
    },
    goItem(item) {
      uni.navigateTo({
        url: `/sub-pages/index/item/main?id=${item.id}&sceneType=适老用品`
      })
    },
    back() {
      history.go(-1)
    },
    reset() {
      this.priceList.forEach(data => {
        data.check = false
      })
      // this.categoryList.forEach(data => {
      //   data.check = false
      // })
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
    hanldChangeCate(item) {
      this.categoryList = [{ ...item, check: true }]
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
      if (this.areaCode) {
        params.areaCode = this.areaCode
      } else {
        params.cityCode = this.cityCode
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
        params.keywords = this.key
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
        params.categoryId = dispIds.join(',')
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
      // console.log("params: " + JSON.stringify(params))
      this.bottomTips = 'loading'
      const { data: searchResult } = await Axios.post('/product/getProductSearchList', { ...Object.assign(params, this.searchParams) })
      // console.log("result: " + JSON.stringify(searchResult))
      this.loading = false
      if (searchResult.esProducts && searchResult.esProducts.length) {
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
        // this.categoryList = []
        // searchResult.categorys.forEach(category => {
        //   this.categoryList.push({
        //     id: category.code,
        //     name: category.name,
        //     check: false
        //   })
        // })
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
        // console.log("页面商品：" + JSON.stringify(this.itemList))
        if (this.itemList.length === searchResult.totalCount) {
          this.bottomTips = 'nomore'
        } else {
          this.bottomTips = 'more'
        }
      } else {
        this.bottomTips = 'nomore'
      }
      if (this.itemList.length === 0) {
        this.empty = true
      }
    },
    async getCategory() {
      const params = { productType: 7, areaCode: this.areaCode, cityCode: this.cityCode }
      const { code, data } = await Axios.post('/product/getProductListByType', params)
      if (code === '200') {
        this.tabList = [{ name: '全部', id: '' }].concat(data)
      }
    },
    // 获取当前定位
    getLocation() {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: 'gcj02',
          success: (res) => {
            uni.setStorageSync('location', res)
            // 调用高德地图 API 逆地理编码, 通过经纬度获取当前位置城市信息
            api.regeoMap(
              {
                location: res.longitude + ',' + res.latitude
              },
              {
                success: (res) => {
                  let city = {}
                  // 当城市是省直辖县时返回为空，以及城市为北京、上海、天津、重庆四个直辖市时，该字段返回为[],否则为城市名称（字符串）
                  if (res.regeocode.addressComponent.city.length === 0) {
                    city = {
                      code:
                        res.regeocode.addressComponent.adcode.substr(0, 2) +
                        '0100',
                      name: res.regeocode.addressComponent.province,
                      realCode:
                        res.regeocode.addressComponent.adcode.substr(0, 2) +
                        '0000'
                    }
                  } else {
                    city = {
                      code:
                        res.regeocode.addressComponent.adcode.substr(0, 4) + '00',
                      name: res.regeocode.addressComponent.city
                    }
                  }
                  this.areaCode = res.regeocode.addressComponent.adcode
                  this.cityCode = city.code
                  resolve()
                }
              }
            )
          },
          fail: () => {
            // this.cities.location = city
            reject()
          }
        })
      })
    }
  },
  onPageScroll(e) {
    this.$refs.toTop.show(e.scrollTop > 10)
  },
  onReachBottom() {
    this.loadData()
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
    await this.getLocation()
    await this.getCategory()
    await this.loadData()
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/base';

.app {
  background: #f5f5f5;
  min-height: 100vh;
  .swiper-tab {
    background: #fff;
  }
}
.sort-list {
  display: flex;
  align-items: center;
  z-index: 100;
  background-color: #fff;

  .sort {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90rpx;
    flex: 1;
    font-size: 40rpx;
    position: relative;

    &.active {
      font-weight: 500;
      &::before {
        display: inline-block;
        content: '';
        width: 64rpx;
        height: 8rpx;
        background: #ff711a;
        border-radius: 5rpx;
        position: absolute;
        bottom: 0;
      }
    }

    .img-wrap {
      margin-left: 8rpx;

      .image {
        margin-bottom: 4rpx;
        display: block;
        width: 14rpx;
        height: 8rpx;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .filter {
      margin-left: 8rpx;
      width: 40rpx;
      height: 40rpx;
    }
  }
}

.item-list-wrap {
  padding-top: 16rpx;
  background: #f5f5f5;
}

.item-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-evenly;

  .item {
    position: relative;
    // padding-left: 16rpx;
    // padding-right: 16rpx;
    margin-bottom: 30rpx;
    border-radius: 16rpx;
    background-color: #fff;
    width: 340rpx;
    box-sizing: border-box;

    .item-logo {
      position: relative;
      width: 340rpx;
      height: 340rpx;
      background: center no-repeat;
      background-size: contain;
      border-radius: 16rpx 16rpx 0 0;

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

    .item-name {
      padding: 10rpx 16rpx;
      font-size: 36rpx;
      height: 106rpx;
      overflow: hidden;
      color: #333333;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .item-point {
      margin: 0rpx 16rpx;
      width: 162rpx;
      height: 48rpx;
      line-height: 48rpx;
      border-radius: 4rpx;
      font-size: 28rpx;
      text-align: center;
      color: #ff2600;
      border: 2rpx solid #ff2600;
    }

    .item-price {
      padding: 0rpx 16rpx;
      font-size: 40rpx;
      font-weight: 500;
      color: #ff5500;
      line-height: 56rpx;
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

  .img {
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

